## 2026-07-16T09:13:17Z

Please set up the E2E Testing Track for the Savesnapfast project.
Refer to PROJECT.md and ORIGINAL_REQUEST.md.

Tasks:
1. Create a `TEST_INFRA.md` in the project root based on the template in the orchestrator instructions. Define the test philosophy, feature inventory (SEO canonicals, trailing slashes, sitemaps, robots.txt, redirects, etc.), and 4-tier coverage thresholds.
2. Enhance `verify_build.cjs` and `audit_check.cjs` to make them comprehensive.
   - For `verify_build.cjs`:
     - Fix the duplicate file-exists check bug on lines 9-11 (file format vs directory format check).
     - Add checks to verify that thin-content blog list pages (less than 2 posts) are excluded from the sitemap (i.e. not in sitemap-0.xml).
     - Add checks to verify that blog post pages have a correct self-referencing hreflang tag pointing to their own absolute URLs.
     - Add checks to verify that robots.txt blocks `_astro/`.
   - For `audit_check.cjs`:
     - Fix the false negative check for `sitemap-index.xml` in `public/` (since it is built dynamically in `dist/`).
3. Create `TEST_READY.md` in the project root with the test runner command (`node verify_build.cjs` and `node audit_check.cjs`) and the coverage summary.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your working directory is: `c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_e2e_testing_1`.
Your identity is: `worker_e2e_testing_1` (archetype: `teamwork_preview_worker`).
When complete, write your handoff report and notify the parent.
