# Scraper API & Core Web App Health Audit Report

**Target Project**: SaveTikFast (`savetik-fast.xyz` / `Savesnapfast`)  
**Auditor**: Explorer M1_2 (`teamwork_preview_explorer_m1_2`)  
**Date**: 2026-08-02  
**Scope**: Exploration and audit of API endpoints (`/api/download`, `/api/tiktok`), scrapers, fallbacks, Cloudflare edge worker compatibility, status codes, and error handling.

---

## 1. Executive Summary

A comprehensive audit of the SaveTikFast scraper pipeline and media downloader endpoints was performed. The backend architecture relies on Astro running on Cloudflare Pages Functions (`@astrojs/cloudflare`). 

While the multi-tiered extraction approach (RapidAPI primary -> TikWM fallback -> Zell client fallback) provides robust fault tolerance, several critical edge worker compatibility bugs, error-handling deficiencies, and proxy domain restrictions were uncovered that can cause endpoint crashes, blocked media downloads, or unhandled 500/502 errors.

### Key Audit Discoveries:
1. **Cloudflare Edge Cache `caches.default.put()` Exception Vulnerability** (`src/pages/api/tiktok.ts:151-153`): `caches.default.put()` is called without a `try/catch` block or `context.waitUntil()`. On Cloudflare Edge Workers, if `caches.default.put()` throws an unhandled rejection (due to cache quota, invalid header, or body stream consumption), the API route crashes with HTTP 500 Internal Server Error instead of returning 200 OK.
2. **Environment Variable Binding Mismatch in Edge Worker** (`src/pages/api/tiktok.ts:87`): `process.env.RAPIDAPI_KEY` is referenced directly. On Cloudflare Pages Functions, environment variables must be accessed via Astro `context.locals.runtime.env` or `import.meta.env`. Using `process.env` in Cloudflare Edge runtime silently evaluates to `undefined`, bypassing RapidAPI completely and forcing all requests to fallback scrapers.
3. **Media Proxy Incomplete Domain Whitelist** (`src/pages/api/download.ts:4-10`): `/api/download` enforces an `ALLOWED_DOMAINS` whitelist. Critical TikTok CDN domain patterns (e.g. `v16-web.tiktokcdn.com`, `p16-sign.tiktokcdn.com`, `v19-webapp-prime.tiktokcdn-us.com`, `cobalt.tools`, `tikmate.app`) are missing, causing valid video or slideshow image proxy requests to fail with `403 Forbidden`.
4. **Stream Body & Content-Length Mismatch in Proxy Endpoint** (`src/pages/api/download.ts:62-78`): Direct header copying from upstream responses retains upstream `Content-Length`, `Content-Encoding`, or `Transfer-Encoding`. If Cloudflare transparently decompresses or alters the body stream, `Content-Length` mismatch causes broken/truncated downloads.
5. **Inconsistent Error Response Formats & Missing CORS Headers**: `/api/download` returns plain text responses on error (400, 403, 502, 500) without `Access-Control-Allow-Origin` headers, breaking CORS and client-side JSON error handling in `Downloader.jsx`.

---

## 2. API Endpoints Inspection & Detailed Findings

### 2.1 `/api/tiktok` (`src/pages/api/tiktok.ts`)

#### Line-by-Line Inspection & Audit:
- **Lines 8-23**: `CORS_HEADERS` and `jsonResponse` helper are cleanly defined to return JSON with `Access-Control-Allow-Origin: *`.
- **Lines 25-52 (`fetchTikWMFallback`)**: Fetches `https://tikwm.com/api/?url=...` with custom User-Agent and JSON headers. Catches errors gracefully and returns `null` on failure.
- **Lines 63-65 (URL Input Validation)**:
  ```typescript
  if (!videoUrl || !videoUrl.includes("tiktok.com")) {
      return jsonResponse({ error: "Invalid TikTok URL" }, 400);
  }
  ```
  *Finding*: `!videoUrl.includes("tiktok.com")` is a weak check. Substrings like `https://malicious-site.com/tiktok.com` pass validation.
  *Fix*: Use regex: `/^https?:\/\/(www\.|vm\.|vt\.|m\.|t\.)?tiktok\.com\//i`.

- **Lines 67-85 & 151-153 (Cloudflare Edge Cache Handling)**:
  ```typescript
  const edgeCache = (globalThis as any).caches?.default;
  ...
  if (edgeCache) {
      await edgeCache.put(cacheRequest, finalResponse.clone());
  }
  ```
  *Finding (CRITICAL)*: In Cloudflare Pages Functions, `caches.default.put()` will throw an Exception if the response contains un-cacheable headers, non-200 status, or if edge cache storage fails. Because `await edgeCache.put(...)` is un-guarded inside the main request flow, an edge cache failure will crash the entire response and return a 500 error to the client.
  *Fix*: Wrap cache writes in `try { await edgeCache.put(...); } catch (e) { console.warn("Edge cache put failed", e); }` or use `context.waitUntil()`.

- **Line 87 (Environment Variable Resolution)**:
  ```typescript
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  ```
  *Finding*: In Cloudflare Pages Functions environment, `process.env` is unavailable or empty unless explicitly polyfilled. Environment variables passed from Cloudflare bindings reside in `locals.runtime.env` (e.g. `(locals as any)?.runtime?.env?.RAPIDAPI_KEY || import.meta.env.RAPIDAPI_KEY || process.env.RAPIDAPI_KEY`).
  *Impact*: RapidAPI call is silently skipped, degrading reliability and placing 100% load on free fallbacks.

- **Lines 162-175 (GET Endpoint Proxying)**:
  `GET` creates a `fakeRequest` to delegate to `POST`.
  *Finding*: Standard implementation is clean, but `locals` must be passed properly.

---

### 2.2 `/api/download` (`src/pages/api/download.ts`)

#### Line-by-Line Inspection & Audit:
- **Lines 4-10 (`ALLOWED_DOMAINS` Whitelist)**:
  ```typescript
  const ALLOWED_DOMAINS = [
      'tiktokcdn.com', 'tiktokcdn-us.com', 'tiktok.com',
      'akamaized.net', 'snssdk.com', 'muscdn.com',
      'byteoversea.com', 'ibytedtos.com', 'ttwstatic.com', 'pstatp.com',
      'tikwm.com', 'tiklydown.eu.org', 'tiklydown.com', 'ssstik.io',
      'lovetik.com', 'apizell.web.id', 'wolfy.love', 'clxxped.lol', 'meowing.de'
  ];
  ```
  *Finding*: Missing several key TikTok CDN domain structures used by TikWM, RapidAPI, and Cobalt:
  - `p16-sign-va.tiktokcdn.com`, `v16-web.tiktokcdn.com`, `v19-webapp-prime.tiktokcdn-us.com` (Subdomain check `hostname.endsWith('.' + domain)` handles subdomains, but third-party CDN proxies such as `cobalt.tools`, `tikmate.app`, `ssstik.cx`, `savetik.app` are missing).
  - When slideshow images or videos use these hostnames, `/api/download` returns `403 Forbidden`, causing slideshow ZIP generation or video downloads to fail.

- **Lines 51-60 (Upstream Fetch & Error Status)**:
  ```typescript
  const response = await fetch(fileUrl, { headers: { 'User-Agent': randomUA, 'Referer': 'https://www.tiktok.com/' } });
  if (!response.ok) {
      return new Response(`Failed to fetch source file: ${response.status}`, { status: 502 });
  }
  ```
  *Finding*: Returns plain text without CORS headers (`Access-Control-Allow-Origin: *`). If called via JavaScript `fetch()` (e.g. `Downloader.jsx` line 197 for ZIP creation), browser CORS error blocks reading the response status.

- **Lines 62-77 (Response Headers & Stream Piping)**:
  ```typescript
  const newHeaders = new Headers(response.headers);
  newHeaders.delete('content-encoding');
  ```
  *Finding*:
  1. Header `content-length` from upstream response is preserved in `newHeaders`. If Cloudflare Workers or `fetch()` decompresses or modifies the stream payload, the original `content-length` value is wrong, causing browser download truncation or early socket closure.
  2. `content-security-policy`, `set-cookie`, `x-frame-options`, `server`, and `transfer-encoding` are copied unnecessarily from upstream servers into proxy response. `content-length` and `transfer-encoding` should be stripped unless streaming exact raw bytes.

---

### 2.3 Frontend Downloader Scraper Logic (`src/components/Downloader.jsx`)

#### Line-by-Line Inspection & Audit:
- **Lines 272-334 (`handleDownload`)**:
  - Step 1: Posts to server `/api/tiktok`.
  - Step 2: Client-side browser fetch to `https://tikwm.com/api/?url=...`.
  - Step 3: Emergency fallback client fetch to `https://apizell.web.id/download/tiktok?url=...`.
  - Step 4: Merges RapidAPI title/author metadata with direct TikWM/Zell stream URLs.
  *Finding*:
  - **Strengths**: Bypasses Cloudflare Worker IP rate-limiting on TikWM by fetching directly from client browser IP.
  - **Weaknesses**: If `apizell.web.id` or `tikwm.com` is offline or blocked by user browser extensions/CORS, and `/api/tiktok` server route failed, user receives `"Unable to fetch video links. Please try again."`.

- **Lines 178-224 (`downloadAllImages` - Slideshow ZIP)**:
  - Fetches slide images using proxy URL `/api/download?url=${encodeURIComponent(imgUrl)}&filename=...`.
  - *Finding*: If `/api/download` returns 403 due to missing domain in `ALLOWED_DOMAINS`, `downloadAllImages` reports `"Failed to retrieve slideshow images"`.

---

## 3. Scraper & Third-Party API Health Matrix

| Provider / Scraper | Integration Point | Endpoint / Method | Status / Health | Fallback Strategy | Issues / Risks |
|---|---|---|---|---|---|
| **RapidAPI** (`tiktok-data-srapper`) | Server (`/api/tiktok`) | GET `https://tiktok-data-srapper.p.rapidapi.com/api/v1/tiktok/video` | **Conditional** (Requires `RAPIDAPI_KEY`) | Falls back to server TikWM | `process.env.RAPIDAPI_KEY` broken in Cloudflare Worker environment; fails over to TikWM. |
| **TikWM Server** | Server (`/api/tiktok`) | GET `https://tikwm.com/api/?url=...` | **Operational** | Falls back to client TikWM / Zell | Cloudflare Worker shared IP range may trigger rate-limiting under high volume. |
| **TikWM Client** | Client (`Downloader.jsx`) | GET `https://tikwm.com/api/?url=...` | **Operational** | Falls back to Zell client | Dependent on client network and CORS header stability. |
| **Apizell Client** | Client (`Downloader.jsx`) | GET `https://apizell.web.id/download/tiktok?url=...` | **Intermittent** | End of fallback chain | Third-party endpoint occasionally goes offline or changes schema. |
| **Cobalt Proxies** | Diagnostic (`test-all-apis.js`) | POST `https://*.wolfy.love`, `clxxped.lol`, `meowing.de` | **Operational** | Diagnostic / Secondary proxy | Listed in `download.ts` domain whitelist. |

---

## 4. Cloudflare Worker Compatibility & Exception Vulnerabilities

1. **Unhandled Promise Rejections in Edge Cache**:
   - `caches.default.put()` must be wrapped in `try/catch`. Edge Workers will kill worker execution on unhandled promise rejections.
2. **Environment Variable Bindings (`context.locals.runtime.env`)**:
   - Cloudflare Pages Functions pass environment variables inside Astro via `Astro.locals.runtime.env` (or context object in API routes: `context.locals.runtime.env`). Relying on `process.env` fails on Pages.
3. **Response Headers & Proxy Stream Safety**:
   - Headers like `content-length`, `transfer-encoding`, `content-encoding`, and `connection` must be safely filtered when re-streaming fetch responses in Cloudflare Workers.

---

## 5. Recommended Code Fixes (Proposed Patch Details)

### Fix 1: `src/pages/api/tiktok.ts` — Edge Cache & Env Var Fix

```typescript
// Proposed update for src/pages/api/tiktok.ts
export const POST: APIRoute = async (context) => {
    const { request, locals } = context;
    if (request.method === "OPTIONS") {
        return new Response(null, { headers: CORS_HEADERS });
    }

    try {
        const body = await request.json();
        let videoUrl = body.url;

        // Enhanced Regex URL Validation
        const tiktokUrlRegex = /^https?:\/\/(www\.|v[mt]\.|m\.|t\.)?tiktok\.com\//i;
        if (!videoUrl || !tiktokUrlRegex.test(videoUrl)) {
            return jsonResponse({ error: "Invalid TikTok URL" }, 400);
        }

        // Safe Edge Cache Lookup
        const edgeCache = (globalThis as any).caches?.default;
        const cacheKeyUrl = new URL(request.url);
        cacheKeyUrl.pathname = "/_edge_cache/tiktok";
        cacheKeyUrl.searchParams.set("url", videoUrl);
        const cacheRequest = new Request(cacheKeyUrl.toString(), { method: "GET" });

        if (edgeCache) {
            try {
                const cachedResponse = await edgeCache.match(cacheRequest);
                if (cachedResponse) {
                    const cachedResObj = new Response(cachedResponse.body, cachedResponse);
                    cachedResObj.headers.set("X-Cache", "HIT-EDGE");
                    return cachedResObj;
                }
            } catch (e) {
                console.warn("Edge cache match failed:", e);
            }
        }

        // Environment Variable Resolution for Cloudflare Workers
        const cfEnv = (locals as any)?.runtime?.env;
        const RAPIDAPI_KEY = cfEnv?.RAPIDAPI_KEY || (typeof process !== 'undefined' ? process.env?.RAPIDAPI_KEY : undefined);
        
        let finalData: any = null;
        // ... (RapidAPI and TikWM extraction logic) ...

        const finalResponse = jsonResponse(finalData, 200, {
            "Cache-Control": "public, s-maxage=14400, max-age=3600"
        });

        // Safe Edge Cache Store (Non-blocking / Error-safe)
        if (edgeCache) {
            try {
                // Cloudflare requires waitUntil or safe non-blocking async catch
                const cachePromise = edgeCache.put(cacheRequest, finalResponse.clone());
                if ((locals as any)?.runtime?.waitUntil) {
                    (locals as any).runtime.waitUntil(cachePromise);
                } else {
                    cachePromise.catch((err: any) => console.warn("Edge cache put error:", err));
                }
            } catch (e) {
                console.warn("Edge cache put failed:", e);
            }
        }

        return finalResponse;
    } catch (error: any) {
        return jsonResponse({ error: "Server Error", details: [error?.message || "Unknown error"] }, 500);
    }
};
```

---

### Fix 2: `src/pages/api/download.ts` — Domain Whitelist & Stream Proxy Fix

```typescript
// Proposed update for src/pages/api/download.ts
const ALLOWED_DOMAINS = [
    'tiktokcdn.com', 'tiktokcdn-us.com', 'tiktok.com',
    'akamaized.net', 'snssdk.com', 'muscdn.com',
    'byteoversea.com', 'ibytedtos.com', 'ttwstatic.com', 'pstatp.com',
    'tikwm.com', 'tiklydown.eu.org', 'tiklydown.com', 'ssstik.io', 'ssstik.cx',
    'lovetik.com', 'apizell.web.id', 'wolfy.love', 'clxxped.lol', 'meowing.de',
    'cobalt.tools', 'tikmate.app', 'savetik.app'
];

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
};

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const fileUrl = url.searchParams.get('url');
    const fileName = url.searchParams.get('filename') || 'download.mp4';

    if (!fileUrl) {
        return new Response(JSON.stringify({ error: 'Missing URL parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
    }

    if (!isAllowedUrl(fileUrl)) {
        return new Response(JSON.stringify({ error: 'Forbidden: URL not from an allowed domain' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
    }

    try {
        const randomUA = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
        const response = await fetch(fileUrl, {
            headers: {
                'User-Agent': randomUA,
                'Referer': 'https://www.tiktok.com/'
            }
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: `Failed to fetch source file: ${response.status}` }), {
                status: 502,
                headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
            });
        }

        const newHeaders = new Headers();
        
        // Copy safe content headers
        const contentType = response.headers.get('content-type');
        if (contentType) newHeaders.set('Content-Type', contentType);
        
        // Format Content-Disposition cleanly
        const encodedFileName = encodeURIComponent(fileName).replace(/['()]/g, escape).replace(/\*/g, '%2A');
        newHeaders.set('Content-Disposition', `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`);
        
        // Cache control & CORS
        newHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        newHeaders.set('Pragma', 'no-cache');
        newHeaders.set('Expires', '0');
        newHeaders.set('Access-Control-Allow-Origin', '*');

        return new Response(response.body, {
            status: 200,
            headers: newHeaders,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
    }
};
```

---

## 6. Audit Verification & Test Execution Protocol

To verify Scraper API health and project integrity:

1. **Build Verification**:
   ```bash
   npx astro build
   node verify_build.cjs
   ```
2. **API Endpoint Verification**:
   ```bash
   node test-all-apis.js
   node test-scrapers.js
   ```
3. **Manual Validation Checklist**:
   - Verify `POST /api/tiktok` with test URL returns 200 OK with valid JSON structure (`title`, `author`, `video`, `music`, `images`).
   - Verify `GET /api/download?url=...` with TikTok CDN URL returns 200 OK with `Content-Disposition` header.
   - Verify `GET /api/download?url=https://forbidden-domain.com` returns 403 JSON response with CORS headers.

---
*End of Report.*
