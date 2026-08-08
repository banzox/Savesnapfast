# API Endpoints & Scraper Diagnostics Report (Requirement R3)

**Project:** Savesnapfast  
**Audit Target:** API Routes (`src/pages/api/`), Scraper Utilities, Integration Scripts, Diagnostic Test Suites  
**Timestamp:** 2026-07-21  

---

## Executive Summary

A comprehensive diagnostic audit was conducted on the Savesnapfast API endpoints, scraper logic, downloader component, and test scripts. 

Key Findings:
1. **Provider Collapse in Test Suite**: 5 out of 6 third-party providers configured in `test-all-apis.js` are completely non-functional (Zell down, Alpha down, Mega down, Melon returning 404, Cessi returning Cloudflare 520). Only TikWM is functional.
2. **Broken SSL on Secondary Scraper**: `test-scrapers.js` reveals `api.tiklydown.eu.org` fails with an invalid TLS certificate (`ERR_TLS_CERT_ALTNAME_INVALID`), rendering TiklyDown unusable.
3. **Incomplete `/api/tiktok` Output**: `/api/tiktok` relies exclusively on RapidAPI (`tiktok-data-srapper.p.rapidapi.com`), which only returns oEmbed metadata (title, author, cover). It explicitly outputs empty strings for `video` and `music` (`video: ""`, `music: ""`), providing no downloadable media links server-side.
4. **CORS Failure in Slideshow ZIP Generation**: `Downloader.jsx` fetches slideshow image URLs directly from client-side JS without passing through `/api/download`. Because TikTok CDN blocks cross-origin fetches without CORS headers, all image fetches fail silently, resulting in empty `.zip` downloads.
5. **Domain Whitelist Restriction in Proxy**: `/api/download` enforces an `ALLOWED_DOMAINS` whitelist that excludes `tikwm.com` and other third-party mirror domains, causing 403 Forbidden errors if non-TikTok CDN media links are passed.

---

## 1. Diagnostic Test Suite Results

### 1.1 `test-all-apis.js` Results

Executing `node test-all-apis.js` evaluated six API provider endpoints against a valid TikTok URL (`https://www.tiktok.com/@tiktok/video/7106594312292453675`):

| Provider | Endpoint Target | Result | Failure Mechanism |
| :--- | :--- | :--- | :--- |
| **TikWM** | `https://tikwm.com/api/?url=...` | **SUCCESS** | Operational |
| **Zell** | `https://apizell.web.id/download/tiktok?url=...` | **FAILED** | `fetch failed` (Host unreachable / SSL error) |
| **Alpha** | `https://alpha.wolfy.love/api/json` | **FAILED** | `fetch failed` (Host unreachable / DNS failure) |
| **Melon** | `https://melon.clxxped.lol/api/json` | **FAILED** | HTTP 404 Not Found (Cobalt route removed) |
| **Cessi** | `https://cessi-c.meowing.de/api/json` | **FAILED** | HTTP 520 Web Server Returned Unknown Error (Cloudflare error) |
| **Mega** | `https://mega.wolfy.love/api/json` | **FAILED** | `fetch failed` (Host unreachable) |

**Diagnostic Conclusion**: The application's fallback redundancy across third-party Cobalt instances and Zell is non-existent; 83% of external providers are currently offline.

---

### 1.2 `test-scrapers.js` Results

Executing `node test-scrapers.js` tested two primary direct scrapers:

* **TikWM**: **SUCCESS** (`code: 0`, returned valid payload with video download stream).
* **TiklyDown**: **FAILED** with `ERR_TLS_CERT_ALTNAME_INVALID`.
  * **Certificate Details**: `Subject Alternative Name` is `DNS:waguri.caliphdev.com`, while request target host is `api.tiklydown.eu.org`.
  * **Impact**: Node.js and browser TLS handshakes fail immediately due to hostname mismatch.

---

### 1.3 `test-api.js` & `test-rapidapi.js` Results

Executing `node test-api.js` against RapidAPI (`tiktok-data-srapper.p.rapidapi.com`) yields:

```json
{
  "author_name": "TikTok",
  "author_url": "https://www.tiktok.com/@tiktok",
  "embed_html": "<blockquote ...></blockquote>",
  "provider": "TikTok",
  "thumbnail_height": 1024,
  "thumbnail_url": "https://p16-common-sign.tiktokcdn-eu.com/...",
  "thumbnail_width": 576,
  "title": "how many frogs did you find? 🐸 ...",
  "url": "https://www.tiktok.com/@tiktok/video/7106594312292453675"
}
```

**Diagnostic Analysis**: The configured RapidAPI service is strictly an oEmbed metadata provider. It does NOT extract or return MP4 video URLs, no-watermark streams, or MP3 audio tracks.

---

## 2. Server-Side API Endpoint Analysis (`src/pages/api/`)

### 2.1 `/api/tiktok` (`src/pages/api/tiktok.ts`)

#### Code Review & Flow Breakdown
`/api/tiktok` receives a TikTok URL, verifies `process.env.RAPIDAPI_KEY`, checks Edge Cache, queries RapidAPI, and constructs the response object.

#### Operational & Logic Flaws
1. **Empty Media Stream Mapping**:
   Lines 86–95:
   ```typescript
   const finalData = {
       provider: "rapidapi",
       title: rapidMetadata.title || "TikTok Video",
       author: rapidMetadata.author_name || "User",
       cover: rapidMetadata.thumbnail_url || "",
       video: "", 
       music: "",
       images: [],
       type: "video"
   };
   ```
   Because RapidAPI returns no media binary links, `/api/tiktok` returns `video: ""` and `music: ""`. Any client API integration relying solely on this route cannot perform downloads.
2. **Environment Variable Dependency**:
   Lines 32–35:
   ```typescript
   const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
   if (!RAPIDAPI_KEY) {
       return jsonResponse({ error: "Service temporarily unavailable" }, 503);
   }
   ```
   In Cloudflare Pages / Workers execution contexts, environment variables reside in `context.locals.runtime.env` or standard binding objects rather than `process.env`. If `process.env.RAPIDAPI_KEY` is undefined, the endpoint throws a 503 error.
3. **Edge Cache Header Mutation Hazard**:
   Lines 56–61:
   ```typescript
   const cachedResponse = await edgeCache.match(cacheRequest);
   if (cachedResponse) {
       const cachedResObj = new Response(cachedResponse.body, cachedResponse);
       cachedResObj.headers.set("X-Cache", "HIT-EDGE");
       return cachedResObj;
   }
   ```
   Creating a new `Response` passing `cachedResponse` retains the immutable header reference in certain serverless environments, which can trigger a runtime `TypeError: Cannot modify immutable headers`.

---

### 2.2 `/api/download` (`src/pages/api/download.ts`)

#### Code Review & Flow Breakdown
`/api/download` acts as a streaming proxy to bypass cross-origin browser download restrictions and force attachment downloading with proper `Content-Disposition`.

#### Operational & Logic Flaws
1. **Domain Whitelist Vulnerability**:
   Lines 4–8:
   ```typescript
   const ALLOWED_DOMAINS = [
       'tiktokcdn.com', 'tiktokcdn-us.com', 'tiktok.com',
       'akamaized.net', 'snssdk.com', 'muscdn.com',
       'byteoversea.com', 'ibytedtos.com', 'ttwstatic.com', 'pstatp.com'
   ];
   ```
   If a scraper returns media hosted on `tikwm.com` or third-party fallback hosts (e.g. `apizell.web.id`), `/api/download?url=https://tikwm.com/...` is rejected with `403 Forbidden: URL not from an allowed domain`.
2. **Deprecated Utility Usage**:
   Line 63:
   ```typescript
   const encodedFileName = encodeURIComponent(fileName).replace(/['()]/g, escape).replace(/\*/g, '%2A');
   ```
   `escape()` is a deprecated global function in JS/TS. Standard replacement should use `encodeURIComponent` formatting or custom regex replacements.
3. **Missing Range Request / Partial Content Header Handling**:
   The proxy removes `content-encoding` but does not pass through `Range` headers or respond with `206 Partial Content`. This breaks video seeking in client video players.

---

## 3. Client Downloader Component Analysis (`src/components/Downloader.jsx`)

### 3.1 Client Scraping Strategy & Single Point of Failure
In `Downloader.jsx`:
1. **Step 1**: Calls `/api/tiktok` to retrieve title and author metadata from RapidAPI.
2. **Step 2**: Executes direct browser-side `fetch` to `https://tikwm.com/api/?url=...` to retrieve video/music URLs.
3. **Step 3**: If TikWM fails, executes direct browser-side `fetch` to `https://apizell.web.id/download/tiktok?url=...`.

**Failures**:
* **Zell Fallback is Dead**: As proven by `test-all-apis.js`, Zell (`apizell.web.id`) is down. If TikWM fails, the fallback fails immediately.
* **CORS & Ad-Blocker Vulnerability**: Direct browser requests to `tikwm.com` are susceptible to client-side CORS blocking, ad-blockers, tracking protection, and regional DNS/ISP bans.

### 3.2 Broken ZIP Download for Slideshow Images (`downloadAllImages`)
Lines 185–196:
```javascript
const imagePromises = result.images.map(async (imgUrl, index) => {
    try {
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        const fileName = `slide_${index + 1}.jpg`;
        folder.file(fileName, blob);
    } catch (e) {
        // Silent fail for individual images
    }
});
```

**Diagnostic Analysis**:
* TikTok CDN image servers (`p16-sign-va.tiktokcdn.com`, etc.) do not emit `Access-Control-Allow-Origin: *`.
* Direct browser `fetch(imgUrl)` is blocked by CORS policy.
* The catch block silently suppresses the failure.
* **Result**: `folder.file()` is never called, JSZip packs zero files, and the user receives a corrupt/empty `.zip` file containing 0 bytes.

---

## 4. Summary Matrix of Identified Issues

| Id | Component | Location | Severity | Problem Description |
| :--- | :--- | :--- | :--- | :--- |
| **ISSUE-1** | Test Suite | `test-all-apis.js` | **CRITICAL** | 5/6 third-party providers (Zell, Alpha, Melon, Cessi, Mega) are completely offline/failing. |
| **ISSUE-2** | Scrapers | `test-scrapers.js` | **HIGH** | `api.tiklydown.eu.org` TLS cert mismatch (`ERR_TLS_CERT_ALTNAME_INVALID`). |
| **ISSUE-3** | API Route | `src/pages/api/tiktok.ts:86-95` | **CRITICAL** | Endpoint outputs `video: ""` and `music: ""`, returning no downloadable links server-side. |
| **ISSUE-4** | Client UI | `src/components/Downloader.jsx:185` | **HIGH** | `downloadAllImages` performs unproxied CORS `fetch` on image URLs, producing empty ZIP files. |
| **ISSUE-5** | API Route | `src/pages/api/download.ts:4-8` | **MEDIUM** | `ALLOWED_DOMAINS` whitelist excludes `tikwm.com`, causing 403 errors on proxied fallback links. |
| **ISSUE-6** | Client UI | `src/components/Downloader.jsx:293` | **HIGH** | Fallback provider Zell is dead; TikWM client request has no functional backup if blocked. |

---

## 5. Recommended Technical Remediation Plan

1. **Implement Server-Side Multi-Provider Scraper Pipeline**:
   Refactor `/api/tiktok` to attempt extraction via primary (TikWM), secondary (Cobalt working instances), and fallback APIs server-side, returning fully resolved `video` and `music` URLs to the frontend.
2. **Fix Slideshow ZIP Proxying**:
   In `Downloader.jsx`, route image fetches through `/api/download?url=${encodeURIComponent(imgUrl)}` to guarantee CORS compliance when creating ZIP blobs.
3. **Expand `/api/download` Whitelist**:
   Add `tikwm.com` and related mirror domains to `ALLOWED_DOMAINS` in `src/pages/api/download.ts`.
4. **Update Diagnostic Scripts**:
   Update `test-all-apis.js` and `test-scrapers.js` with active, verified Cobalt instances and active scraper endpoints.

