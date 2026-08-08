## 2026-07-22T00:34:12Z
<USER_REQUEST>
You are a Worker subagent for the Savesnapfast project.
Your assigned working directory is: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_repair_3.

## Scope & Objective
Perform Victory Audit Remediation to address all findings from the Victory Audit rejection:

### 1. Fix Legal Page Canonicals (`src/components/SEOConfig.astro`)
- For all translated legal pages (`about`, `privacy`, `terms`, `contact`, `dmca`, `disclaimer` across any non-English language locale like `/ar/about`, `/fr/privacy`, `/es/terms`, etc.), set their canonical URL `<link rel="canonical">` to point strictly to the main English version (e.g., `https://savetik-fast.xyz/about`, `https://savetik-fast.xyz/privacy`, `https://savetik-fast.xyz/terms`, etc.).
- Inspect `src/components/SEOConfig.astro` (around line 41) or `Layout.astro` where canonical URLs are calculated.
- Ensure that if the current page path is a legal page and `lang !== 'en'` (or default), `canonicalURL` strips the language prefix and evaluates to `https://savetik-fast.xyz/${legalSlug}`.

### 2. Update `public/robots.txt` Disallow Directives
- Update `public/robots.txt` to include explicit `Disallow` rules for:
  - Device pages: `Disallow: /ios`, `Disallow: /android`, `Disallow: /mac`, `Disallow: /pc`, `Disallow: /*/ios`, `Disallow: /*/android`, `Disallow: /*/mac`, `Disallow: /*/pc`.
  - Non-English translated legal pages: `Disallow: /*/about`, `Disallow: /*/privacy`, `Disallow: /*/terms`, `Disallow: /*/contact`, `Disallow: /*/dmca`, `Disallow: /*/disclaimer`.

### 3. Update Verification Scripts (`verify_build.cjs` & `audit_check.cjs`)
- Update `verify_build.cjs` and `audit_check.cjs` to include automated assertions verifying:
  a) Translated legal pages in `dist/` (e.g. `dist/ar/about.html`) set canonical URLs to main English URLs (`https://savetik-fast.xyz/about`).
  b) `robots.txt` correctly contains `Disallow` directives for device pages and translated legal pages.

### 4. Workspace Cleanup of `.agents/` Subdirectories
- Delete any leftover executable scripts (`check_locales.cjs`, `run-stress-tests.cjs`, `verify_all_seo.cjs`, `check_all_links.cjs`, etc.) that were placed inside `.agents/` subdirectories, ensuring `.agents/` contains metadata (`.md`) files only.

### 5. Build & Verification Requirements:
- Run `npm run build` to confirm static build completes cleanly with 0 errors.
- Run `node verify_build.cjs` and `node audit_check.cjs` to confirm 100% compliance.
- Write change details to `c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_repair_3\changes.md`.
- Write your handoff report to `c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_repair_3\handoff.md`.

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

</USER_REQUEST>
