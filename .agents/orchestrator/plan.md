# Plan — SEO, Indexing, Canonical, and Link Fixes for Savesnapfast

## Phase 1: Exploration & Alignment
1. **Goal**: Locate and understand all relevant components, configurations, and scripts.
2. **Steps**:
   - Spawn an Explorer agent to check project configuration (`astro.config.mjs`), routing middleware (`src/middleware.ts`), components (`SEOConfig.astro`, `Navbar.astro`, `Footer.astro`, `LanguageSelector.astro`, `Schema.astro`), static assets (`public/robots.txt`), pages (specifically device-specific pages under `src/pages` or `src/pages/[lang]`), and existing validation scripts (`verify_build.cjs`, `audit_check.cjs`).
   - The Explorer will document the findings in `analysis.md` inside their folder.

## Phase 2: Dual Track Execution
We will run two parallel tracks (conceptually, or sequentially if context demands, but organized as tracks):
- **E2E Testing Track**: Build and execute validations to ensure all requirements (R1, R2, R3) are met. We will inspect and potentially enhance `verify_build.cjs` and `audit_check.cjs` to fully cover the four tiers of E2E tests:
  - Tier 1: Feature Coverage (e.g., verifying canonical/hreflang structure, trailing slash setting, robots.txt exclusions, and sitemap entries).
  - Tier 2: Boundary/Corner Cases (e.g., empty/malformed paths, double slashes).
  - Tier 3: Cross-Feature Interactions (e.g., middleware redirects and trailing slash coexistence).
  - Tier 4: Real-World Workload (e.g., full build verification, ensuring zero warnings/errors from the verification scripts).
- **Implementation Track**: Fix the identified code issues.
  - Milestone 1: Fix Redirects & Links (R1, R2). Update navbar, footer, middleware, config, and back buttons to enforce no-trailing-slash and clean redirects.
  - Milestone 2: Fix Canonical & Duplicate Content (R3). Correct canonical URL logic, add `noindex`, exclude device pages and non-English legal pages from sitemaps/hreflang, and update robots.txt.
  - Milestone 3: Run Full Build and Verification. Execute build and runs verify scripts.

## Phase 3: Verification & Auditing
1. **Verification**: Verify that the build completes successfully and `verify_build.cjs` passes without errors.
2. **Forensic Audit**: Run `teamwork_preview_auditor` to perform integrity forensics.
3. **Completion**: Report back to the Sentinel.
