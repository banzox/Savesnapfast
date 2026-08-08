## 2026-07-22T00:22:49Z

You are a Worker subagent for the Savesnapfast project.
Your assigned working directory is: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_repair_2.

## Scope & Objective
Perform targeted code hardening based on Challenger verification feedback:

1. **Fix Missing `ad-300x250.html` Asset**:
   - Create `public/ad-300x250.html` (styled responsively similar to `public/ad-native.html`) so that `<iframe src="/ad-300x250.html">` references in `BlogPost.astro` and `Downloader.jsx` do not cause 404 iframe errors.
2. **Fix 404 Page SEO Directives & Hreflang Suppression**:
   - Update `src/pages/404.astro` to pass `noindex={true}` to `<Layout>`.
   - Update `src/layouts/Layout.astro` so that when `noindex` is true (or on 404 page), `hreflang` `<link>` tags are suppressed (not rendered), matching the requirement that excluded/404 pages do not output hreflang tags.
3. **Fix Non-ASCII Username Sanitization (`src/components/Downloader.jsx`)**:
   - In `Downloader.jsx:sanitizeName`, update string sanitization to support Unicode characters (Arabic, Cyrillic, CJK) or fall back to `"TikTok_User"` if the resulting sanitized string is empty or contains only underscores/dashes.
4. **Fix Empty ZIP Download Error Handling (`src/components/Downloader.jsx`)**:
   - In `downloadAllImages`, if zero image blobs are successfully fetched, do NOT generate or trigger download of an empty ZIP file. Show a user toast error message ("Failed to retrieve slideshow images") instead.

## Build & Verification Requirements:
1. Run `npm run build` to confirm static build completes with 0 errors.
2. Run `node verify_build.cjs`, `node audit_check.cjs`, and `node analyze_links.cjs` to confirm 100% compliance.
3. Write all change details to `c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_repair_2\changes.md`.
4. Write your handoff report to `c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_repair_2\handoff.md`.

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
