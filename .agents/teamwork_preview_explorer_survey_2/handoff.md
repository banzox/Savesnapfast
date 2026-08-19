# Handoff Report — Survey 2: Cloudflare Edge & Edge Delivery Deep Investigation

## 1. Observation

### 1.1 Cloudflare Worker Architecture & Configuration
- **Entry point and configuration**:
  - `wrangler.jsonc` (lines 1–51):
    - Worker entry: `"main": "./worker/index.ts"`
    - Routing pattern: `"routes": [{ "pattern": "savetik-fast.xyz", "custom_domain": true }]`
    - Asset binding: `"directory": "./dist"`, `"binding": "ASSETS"`, `"html_handling": "drop-trailing-slash"`, `"not_found_handling": "404-page"`.
    - `run_worker_first` contains 25 path globs (`/`, `/api/*`, `/en`, `/en/*`, `/tl`, `/tl/*`, `/*.html`, `/*/*.html`, `/*/en`, `/about-us`, `/*/about-us`, `/who-are-we`, etc.).
  - `worker/index.ts` (lines 1–44):
    - Routes `/api/tiktok` to `handleTikTokGet` / `handleTikTokPost` / `handleTikTokOptions`.
    - Routes `/api/download` to `handleDownloadGet` / `handleDownloadOptions`.
    - Evaluates canonical redirects via `getCanonicalRedirect(url)` from `src/utils/redirects.ts`. Returns `Response.redirect(..., 301)`.
    - Non-matching routes fall through to `env.ASSETS.fetch(request)`.

### 1.2 Edge Headers & Caching Layer
- **`public/_headers` (lines 1–39)**:
  - Security headers defined under `/*`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`.
  - Static asset cache (`*.js`, `*.css`, `*.woff2`, `*.png`, `*.jpg`, `*.svg`, `*.ico`): `Cache-Control: public, max-age=31536000, immutable`.
  - Manifest cache: `Cache-Control: public, max-age=86400`.
  - `/*.html`: `Cache-Control: public, max-age=0, must-revalidate`.
  - *Observation on clean URLs*: In Cloudflare Workers Static Assets, clean URLs (e.g. `/about`, `/ar`, `/mp3`) match `/*` rather than `/*.html`. Under `/*`, no explicit `Cache-Control` header is defined, so Cloudflare Edge applies default zone cache rules for HTML.
- **Security & Robot Headers**:
  - No `X-Robots-Tag: noindex` is returned on HTML routes.
  - Media proxy (`src/server/download-api.ts:69-71`) sets: `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`, `Pragma: no-cache`, `Expires: 0`.
  - API endpoint (`src/server/tiktok-api.ts:278`) sets: `Cache-Control: public, s-maxage=14400, max-age=3600`.
  - Edge Cache (`caches.default` at `src/server/tiktok-api.ts:197-217`) caches parsed TikTok metadata with key `/_edge_cache/tiktok?url=...` and emits `X-Cache: HIT-EDGE`.

### 1.3 Redirects and Canonical Routing Logic
- **`src/utils/redirects.ts` (lines 1–112)**:
  - Language redirect: `tl` -> `fil`, `/en` or `/en/*` -> stripped to `/` or clean path.
  - Old language switcher URLs (`/ar/en` -> `/ar`) stripped to single language.
  - Trailing slashes stripped (`/about/` -> `/about`).
  - `.html` extensions stripped (`/about.html` -> `/about`).
  - Legacy slugs mapped: `about-us` / `who-are-we` -> `about`, `contact-us` -> `contact`, `privacy-policy` -> `privacy`, `terms-of-service` / `terms-and-conditions` -> `terms`, `disclaimer-policy` -> `disclaimer`, `dmca-policy` -> `dmca`.
  - Legacy query parameter: `/?lang=es` -> `/es`, `/?lang=tl` -> `/fil`.
  - All redirects return HTTP 301 Permanent Redirect.
  - *Compound legacy observation*: In `redirects.ts:39`, `isKnownHtmlPage` evaluates `SUPPORTED_LANGUAGES.has(parts[0])` before the `tl` -> `fil` conversion on line 70. A request to `/tl/about-us.html` takes 2 hops (`/tl/about-us.html` -> `/fil/about-us.html` -> `/fil/about`).

### 1.4 Scraper Endpoints & Fallback APIs
- **`src/server/tiktok-api.ts` (lines 1–317)**:
  - 4-Tier Scraper Architecture:
    1. Tier 1: RapidAPI (`tiktok-data-srapper.p.rapidapi.com`) via `RAPIDAPI_KEY` in environment.
    2. Tier 2: TikWM POST (`https://tikwm.com/api/` with `hd=1, web=1`).
    3. Tier 3: TikWM GET (`https://tikwm.com/api/?url=...`).
    4. Tier 4: TikMate API (`https://api.tikmate.app/api/lookup`).
  - Hybrid merging: If RapidAPI lacks streams or audio, TikWM data is spliced seamlessly (`finalData.provider = "rapidapi+tikwm"`).
  - All errors caught gracefully; returns structured JSON (400, 405, 500, 502) with 0 unhandled worker exceptions.
- **`src/server/download-api.ts` (lines 1–84)**:
  - SSRF protection: `ALLOWED_DOMAINS` whitelist blocks open-proxy abuse (403 Forbidden).
  - User-Agent pool rotates across 5 modern desktop and mobile browser UAs to bypass CDN rate-limits.
  - Sanitizes upstream headers and injects `Content-Disposition: attachment; filename="..."` with UTF-8 encoding.

### 1.5 Diagnostic Test Executions
- `node tools/site-doctor.cjs --verbose`: Passed 117/117 checks (0 errors, 0 warnings).
- `node verify_build.cjs`: Exited with code 1 due to `robots.txt` containing `Sitemap: https://savetik-fast.xyz/sitemap.xml` while the test script strictly checked for `Sitemap: https://savetik-fast.xyz/sitemap-index.xml`.

---

## 2. Logic Chain

### 2.1 Googlebot Indexing & Edge Firewall Interference
1. **Observation**: In Cloudflare-hosted web applications, 0 indexed pages in Google Search Console with valid canonical/hreflang HTML usually stem from Edge/WAF challenges.
2. **Mechanism**:
   - If Cloudflare "Bot Fight Mode" (BFM) or "Super Bot Fight Mode" is enabled with "Challenge" or "Block" actions, or if "Security Level" is set to "High" or "I'm Under Attack", Cloudflare serves JavaScript challenge interstitials (Turnstile / Managed Challenge, HTTP 403/503) to automated clients.
   - If custom WAF rules or rate-limiting rules are configured without exempting `cf.client.bot`, Googlebot, Google-InspectionTool, and bingbot receive challenge pages.
   - When Googlebot receives a challenge page or 403/503, it cannot execute the challenge, treats the URL as unreachable or soft-error, and refuses to index the site.
3. **Inference**: A mandatory Cloudflare WAF Skip Rule for `cf.client.bot` is required to ensure 100% unhindered crawlability for search engine bots.

### 2.2 Custom Domain & Hostname Normalization
1. **Observation**: `wrangler.jsonc` binds `"savetik-fast.xyz"`. `worker/index.ts` normalizes `url.pathname` and `url.searchParams`, but does not inspect `url.hostname`.
2. **Mechanism**:
   - If a user or bot accesses `www.savetik-fast.xyz` or `http://savetik-fast.xyz`:
     - If Cloudflare DNS routes `www` to the worker without a dashboard redirect rule, `worker/index.ts` will serve the site under `www.savetik-fast.xyz` instead of 301 redirecting to the canonical apex domain `savetik-fast.xyz`.
     - This would create duplicate content / split indexing signals between `www` and non-`www`.
3. **Inference**: Hostname canonicalization (`www` -> apex) and protocol enforcement (`http` -> `https`) should be handled at the Cloudflare Edge Rule layer and defended in `worker/index.ts`.

### 2.3 Edge Caching for Clean HTML Routes
1. **Observation**: `public/_headers` specifies `Cache-Control: public, max-age=0, must-revalidate` for `/*.html`. However, routes rendered with `drop-trailing-slash` are requested without `.html` (e.g. `/about`, `/ar`).
2. **Mechanism**: Cloudflare Workers Assets matches `/about` against `/*` rather than `/*.html`. Under `/*`, no `Cache-Control` header is currently specified.
3. **Inference**: Adding an explicit `Cache-Control: public, max-age=0, s-maxage=86400, must-revalidate` rule or configuring Cloudflare Edge Cache Rules for HTML paths will guarantee optimal edge caching while allowing instant revalidation upon new deployments.

---

## 3. Caveats
- Cloudflare Dashboard WAF rules, Bot Fight Mode toggle, and SSL/TLS settings reside in the Cloudflare Web Dashboard (external to the local git repository). While the local configuration (`wrangler.jsonc`, `worker/index.ts`, `_headers`, `_redirects`) is verified, dashboard-level settings must be verified in the Cloudflare console.
- `verify_build.cjs` has a minor string mismatch looking for `sitemap-index.xml` instead of `sitemap.xml` in `robots.txt`.

---

## 4. Conclusion & Actionable Recommendations

### 4.1 Edge Worker & Codebase Assessment
The Cloudflare Worker implementation in `worker/index.ts` and `wrangler.jsonc` is lightweight, robust, and correctly routes between edge-cached API endpoints, canonical redirects, and static pre-rendered assets.

### 4.2 Priority Recommendations for Cloudflare Edge & Search Visibility

#### Recommendation 1: Cloudflare WAF "Skip" Rule for Verified Search Bots
In Cloudflare Dashboard (`Security -> WAF -> Custom Rules`):
- **Rule Name**: `Allow Search Engine Crawlers`
- **Expression**: `cf.client.bot`
- **Action**: `Skip`
  - Check: `All remaining custom rules`
  - Check: `Rate limiting rules`
  - Check: `Managed rules (WAF)`
  - Check: `Bot Fight Mode / Super Bot Fight Mode`
- **Placement**: Priority 1 (top of rule list).

#### Recommendation 2: Cloudflare Dashboard Bot Fight Mode & Security Level
- In `Security -> Bots`: Ensure Bot Fight Mode does not block or challenge verified bots (or is bypassed via Recommendation 1).
- In `Security -> Settings`: Ensure "Security Level" is set to `Medium` (NOT `I'm Under Attack` or `High`).
- In `SSL/TLS -> Edge Certificates`: Ensure `Always Use HTTPS` is enabled.

#### Recommendation 3: Domain & Hostname Canonicalization
- In Cloudflare Dashboard (`Rules -> Redirect Rules`):
  - If `www.savetik-fast.xyz` DNS record exists, add rule:
    `When incoming requests match: (http.host eq "www.savetik-fast.xyz")`
    `Then: Dynamic Redirect to concat("https://savetik-fast.xyz", http.request.uri.path) with status 301`.
- In `worker/index.ts`: Add hostname normalization defense-in-depth:
  ```typescript
  if (url.hostname === "www.savetik-fast.xyz") {
      url.hostname = "savetik-fast.xyz";
      return Response.redirect(url.toString(), 301);
  }
  ```

#### Recommendation 4: Edge Security Headers & Cache-Control Enhancement
- In `public/_headers`, add explicit cache-control for clean HTML routes and `Strict-Transport-Security` (HSTS):
  ```
  /*
    X-Content-Type-Options: nosniff
    X-Frame-Options: SAMEORIGIN
    Referrer-Policy: strict-origin-when-cross-origin
    Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
    Cache-Control: public, max-age=0, s-maxage=86400, must-revalidate
  ```
- In `worker/index.ts`, add `X-Robots-Tag: noindex, nofollow` to `/api/*` responses to ensure raw JSON endpoints are never indexed if discovered.

#### Recommendation 5: Single-Hop Normalization in `src/utils/redirects.ts`
- In `src/utils/redirects.ts`, move the `tl` -> `fil` and `en` normalization before `isKnownHtmlPage` check to ensure compound legacy URLs like `/tl/about-us.html` resolve to `/fil/about` in 1 single 301 hop.

---

## 5. Verification Method

### 5.1 Local Verification Commands
1. **Site Doctor Full Audit**:
   ```bash
   node tools/site-doctor.cjs --verbose
   ```
   *Expected*: 117/117 checks passing (0 errors, 0 warnings).
2. **Build and Asset Packaging**:
   ```bash
   npx astro build
   ```
   *Expected*: 0 errors, output generated in `./dist` with `wrangler.jsonc` assets binding.
3. **API Scraper Multi-Tier Health Check**:
   ```bash
   node test-scrapers.js
   ```
   *Expected*: TikWM, TikMate, and fallback scrapers return valid media payloads.

### 5.2 Live Edge & Crawler Verification (Post-Deployment)
1. **Googlebot Emulation via cURL**:
   ```bash
   curl -I -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" https://savetik-fast.xyz/
   curl -I -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" https://savetik-fast.xyz/ar
   curl -I -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" https://savetik-fast.xyz/mp3
   ```
   *Expected Result*: HTTP `200 OK` directly from edge cache with `Content-Type: text/html; charset=utf-8` (no 403, 503, or challenge).
2. **Google Search Console Live Test**:
   - In GSC, use "URL Inspection" -> "Test Live URL" on `https://savetik-fast.xyz/` and `https://savetik-fast.xyz/ar`.
   - Inspect "View Tested Page" -> Screenshot and HTML to verify full DOM render without Cloudflare challenge screens.
