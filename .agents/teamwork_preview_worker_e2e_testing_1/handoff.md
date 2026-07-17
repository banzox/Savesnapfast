# E2E Testing Track Handoff Report

This report outlines the setup and enhancement of the E2E testing infrastructure for the Savesnapfast project.

---

## 1. Observation

1. **Duplicate Page Check Bug**:
   - In `verify_build.cjs` (original lines 9-11), both variables referenced the exact same path format, making the directory format check redundant:
     ```javascript
     const dirFormat = fs.existsSync(distDir + '/' + p + '.html');
     const fileFormat = fs.existsSync(distDir + '/' + p + '.html');
     ```
2. **Thin-Content Blog Index Pages in Sitemap**:
   - Running `node verify_build.cjs` originally showed `Total sitemap URLs: 219`. Thin localized blog listings like `https://savetik-fast.xyz/es/blog` (which contain <2 posts and are blocked by `noindex` in the pages) were present in `dist/sitemap-0.xml`.
3. **Blog Post Hreflang Self-Reference**:
   - `dist/blog/best-time-to-post-on-tiktok-2026.html` and its translated variants generated an `hreflang` self-referencing tag pointing to `/blog` or `/[lang]/blog` index rather than the post page itself:
     ```
     [ERROR] Hreflang self-reference mismatch in ./dist/blog/best-time-to-post-on-tiktok-2026.html:
       Expected: https://savetik-fast.xyz/blog/best-time-to-post-on-tiktok-2026
       Found:    https://savetik-fast.xyz/blog
     ```
4. **Robots.txt Disallow**:
   - Robots.txt checks on the built site showed:
     ```
     [ERROR] robots.txt is missing Disallow rule for /_astro/
     ```
5. **Sitemap Index False Mismatch**:
   - In `audit_check.cjs`, the file checked `public/` directory for `sitemap-index.xml`, producing `sitemap-index.xml: [MISSING]` since it is only generated dynamically in `dist/`.

---

## 2. Logic Chain

1. **L1 (Correcting directory check)**: We changed `dirFormat` to check `distDir + '/' + p + '/index.html'` and `fileFormat` to check `distDir + '/' + p + '.html'`. This allows accurate detection of the page format in `verify_build.cjs`.
2. **L2 (Identifying thin content)**: We mapped the blog posts per language locale dynamically by checking `src/content/blog` filenames. If a locale has $< 2$ posts, we verify that its index `/locale/blog` is NOT present in the sitemap. This guarantees that `noindex` listing pages do not get crawled via the XML sitemap.
3. **L3 (Hreflang self-referencing checks)**: We recursive-checked all blog posts in `dist/blog` and `dist/[lang]/blog` to ensure their self-referencing `hreflang` tags match their exact paths (no `.html` suffix) and language code (with `fil` mapped to `tl`).
4. **L4 (Asset false-negative fix)**: We adjusted `audit_check.cjs` to search for `sitemap-index.xml` in either `public/` or `dist/`. This removes the false negative while keeping other asset checks intact.
5. **L5 (Robots.txt check)**: We ensured both scripts fail with exit code 1 if `Disallow: /_astro/` is missing in `robots.txt` or built outputs.

---

## 3. Caveats

- We assumed that all blog files end with `-[locale].md` for localized content, and no locale code has a hyphen in it (except the default `en` which has no suffix or suffix other than the configured locales list). This assumption holds true for the 30 languages currently configured.

---

## 4. Conclusion

The E2E testing framework has been fully set up. `TEST_INFRA.md` defines the 4-tier coverage thresholds, and `TEST_READY.md` provides the execution entry point. The enhanced `verify_build.cjs` and `audit_check.cjs` now correctly report failures (such as the missing `_astro/` disallow rule, thin content listing sitemaps, and hreflang self-reference bugs) and exit with status 1 on failure.

---

## 5. Verification Method

To verify the test suite:
1. Run:
   ```bash
   node audit_check.cjs
   ```
   *Expected*: It should run, find `sitemap-index.xml` as `EXISTS`, and fail with exit code 1 showing `[ERROR] robots.txt is missing Disallow: /_astro/`.
2. Run:
   ```bash
   node verify_build.cjs
   ```
   *Expected*: It should run, identify the hreflang self-reference mismatches and thin-content sitemap list errors on the current built codebase, and exit with code 1.
