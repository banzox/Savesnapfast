## 2026-07-21T20:25:51Z
You are a Worker subagent for the Savesnapfast project.
Your assigned working directory is: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_repair_1.

## Scope & Objective
Perform automated repairs across codebase, localizations, link integrity, API endpoints, and scrapers (Requirement R4).

## Identified Issues & Required Repairs:
1. **Missing Translation Key (`features.title`)**:
   - Add `features.title` translation key to `src/locales/locales/en.json` (and all other 29 language JSON files or update fallback logic) so `DownloadPage.astro:216` renders localized title instead of raw fallback string `"features.title"`.
2. **Broken Internal Links on 404 Page**:
   - Fix `src/pages/404.astro` (or Navbar/LanguageSwitcher) so the language switcher does NOT generate broken `/{lang}/404` links (which do not exist as static pages). Ensure language switcher links on 404 page point to valid clean URLs (`/{lang}` or clean root `/404`).
3. **Proxy Domain Whitelist Restriction (`/api/download.ts`)**:
   - Add `tikwm.com`, `*.tikwm.com`, and all necessary fallback domains to `ALLOWED_DOMAINS` array in `src/pages/api/download.ts` to prevent HTTP 403 Forbidden errors when proxying downloads.
4. **TikTok API & Scraper Server-Side Fallback (`/api/tiktok.ts`)**:
   - Update `src/pages/api/tiktok.ts` so when oEmbed returns empty strings (`video: ""`, `music: ""`), it falls back to TikWM API extraction logic to return downloadable video/music stream links.
5. **Slideshow ZIP Download Proxying (`src/components/Downloader.jsx`)**:
   - In `src/components/Downloader.jsx`, proxy slideshow image fetches via `/api/download?url=${encodeURIComponent(imgUrl)}` instead of direct client-side fetch, avoiding CORS failures and preventing empty 0-byte ZIP files.
6. **API Test Suites & Diagnostics (`test-all-apis.js` & `test-scrapers.js`)**:
   - Update `test-all-apis.js` and `test-scrapers.js` (or provider handling) so offline API providers are handled gracefully, TLS hostname mismatches (`api.tiklydown.eu.org`) are fixed or bypassed safely, and API test suites pass cleanly.

## Build & Verification Requirements:
1. Run `npm run build` to confirm zero build or TypeScript errors.
2. Run `node verify_build.cjs`, `node audit_check.cjs`, and `node analyze_links.cjs` to confirm 100% compliance and zero broken links.
3. Run `node test-all-apis.js` and `node test-scrapers.js` to verify API and scraper functionality.
4. Write full details of all modified files to `c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_repair_1\changes.md`.
5. Write your handoff report to `c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_repair_1\handoff.md`.
