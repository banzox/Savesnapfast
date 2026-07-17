## 2026-07-16T09:16:36Z
Please implement the SEO, canonical, sitemap, robots.txt, redirects, and link fixes in the Savesnapfast repository.

Refer to PROJECT.md and the analysis/handoff reports from Phase 1 and Phase 2.

Here is the exact set of fixes to implement:

1. **Fix Self-Referencing Hreflang on Blog Posts in `src/components/SEOConfig.astro`**:
   - In `src/components/SEOConfig.astro`, ensure that the alternate hreflang entry for the *current language* points to the exact canonical URL of the current page (e.g. using `baseSlug`), rather than falling back to the generic `blog` index page.
   - For `x-default`, if the current page is an English blog post, it should point to the English blog post itself. If the current page is a translated blog post, it should point to the English blog index.

2. **Exclude Thin-Content Blog Listing Pages from Sitemap and Fix Priority Logic in `astro.config.mjs`**:
   - Read all markdown files under `src/content/blog` dynamically at build time (e.g., using `fs` and `path`) to compute the number of blog posts per language.
   - In the sitemap `filter` option, check if the page is a blog list page (`/blog` or `/[lang]/blog`). If the language of that blog list page has fewer than 2 posts, exclude it from the sitemap (i.e. return `false`).
   - In the sitemap `serialize` option, fix the language homepage priority check: only match actual configured language codes (from the locales list) rather than checking `pathSegments[0].length <= 3`, which incorrectly included `/mp3`.

3. **Add Missing Disallow in `public/robots.txt`**:
   - Add `Disallow: /_astro/` directly to `public/robots.txt` right under `Disallow: /api/`.

4. **Verify Your Work**:
   - Run `npm run build` to verify that the build succeeds without TypeScript or Astro compiler errors.
   - Run `node audit_check.cjs` and verify it runs successfully with exit code 0.
   - Run `node verify_build.cjs` and verify it passes successfully with exit code 0 (no warnings, errors, or sitemap/hreflang mismatches).

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your working directory is: `c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_implementation_1`.
Your identity is: `worker_implementation_1` (archetype: `teamwork_preview_worker`).
When complete, write your handoff report and notify the parent.
