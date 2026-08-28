## 2026-08-28T10:24:45Z
You are Iteration 2 Worker (Static Sitemap Emission & Build Pipeline Hardening) for Savesnapfast (savetik-fast.xyz).
Workspace Directory: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast
Original Request: C:\Users\newFUTURE\.gemini\antigravity\brain\815f585c-6600-4869-bebd-41cdc77658c5\ORIGINAL_REQUEST.md
Reviewer 2 Feedback: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_reviewer_2\handoff.md

Your Write Ownership:
- `package.json` (build script)
- `src/utils/sitemap.ts`
- `tools/generate-static-sitemap.cjs` (or Astro config / scripts)
- `public/sitemap.xml`
- `public/sitemap-0.xml`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Task Objectives:
1. Read the Reviewer 2 handoff report at `c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_reviewer_2\handoff.md`.
2. Address the issue: When running `npm run build`, ensure that `dist/sitemap.xml` and `dist/sitemap-0.xml` (and `public/sitemap.xml`, `public/sitemap-0.xml`) are deterministically and statically generated using the genuine 520-URL sitemap generator.
3. Configure `package.json` (e.g. build script running postbuild sitemap emission, or Astro integration) so that any clean build (`npm run build`) automatically and statically outputs the full XML sitemaps into `dist/` and `public/`.
4. Run the full build command (`npm run build`).
5. Run all test suites:
   - `node tools/validate_sitemap_full.cjs`
   - `node tools/compare_sitemap.cjs`
   - `node tools/site-doctor.cjs`
   - `node tools/test_crawler_emulation.cjs`
   - `node tools/stress-test-harness.cjs`
6. Verify 100% pass across all tests with 0 missing files and 0 errors.
7. Write your handoff report in your working directory and send a message back with your verification results.
