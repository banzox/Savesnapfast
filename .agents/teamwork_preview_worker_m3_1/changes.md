# Changes Summary — Scraper API & Core Web App Health Fixes

## Overview
This document logs the modifications performed in `src/pages/api/tiktok.ts` and `src/pages/api/download.ts` for Milestone 3 (Core Web App & Scraper API Health Fixes).

---

## 1. `src/pages/api/tiktok.ts`

### Changes Made:
- **Error-Safe Edge Cache Matching & Storage**:
  - Wrapped `caches.default.match()` call in a `try/catch` block.
  - Wrapped `caches.default.put()` in a `try/catch` block and added support for Cloudflare's non-blocking `(locals as any)?.runtime?.waitUntil(cachePromise)` or safe `.catch()` handler to prevent edge cache write failures from crashing the worker or causing 500 error responses.
- **Safe Environment Variable Resolution**:
  - Resolved `RAPIDAPI_KEY` safely by checking `(locals as any)?.runtime?.env?.RAPIDAPI_KEY`, `import.meta.env?.RAPIDAPI_KEY`, and `process?.env?.RAPIDAPI_KEY` using optional chaining and runtime checks. This avoids `ReferenceError` when `process` is undefined in Cloudflare Pages Functions edge runtime.
- **Safe API Handlers**:
  - Added explicit `OPTIONS` route handler returning proper CORS headers.
  - Updated `POST` and `GET` signature to accept `locals` context safely.

---

## 2. `src/pages/api/download.ts`

### Changes Made:
- **Expanded `ALLOWED_DOMAINS` Whitelist**:
  - Added third-party fallback scraper media domains: `ssstik.cx`, `v1.ssstik.cx`, `cobalt.tools`, `tikmate.app`, `dlp.tikmate.app`, and `savetik.app`.
  - Fixes 403 Forbidden errors when proxying video streams or slideshow images via `/api/download`.
- **Unsafe Upstream Headers Filter**:
  - Filtered out `content-length`, `transfer-encoding`, `connection`, `content-encoding`, `content-security-policy`, `set-cookie`, `x-frame-options`, and `server` headers before constructing proxy response objects.
  - Prevents edge worker stream truncation and socket reset errors when Cloudflare decompresses or transforms proxy response streams.
- **Standardized JSON Error Responses & CORS Headers**:
  - Created `jsonError(message, status)` helper returning `{ error: message }` with `Content-Type: application/json` and `Access-Control-Allow-Origin: *`.
  - Replaced plain text error responses with standardized JSON responses across 400, 403, 502, and 500 error status codes.
  - Added explicit `OPTIONS` route handler with CORS headers.

---

## 3. Verification Plan
- `npx astro build`: Run Astro build and confirm zero errors.
- `node verify_build.cjs`: Run build output verification script to ensure all page structures, canonicals, hreflang tags, robots.txt rules, and sitemaps remain 100% compliant.
