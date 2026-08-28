# BRIEFING — 2026-08-28T10:30:40Z

## Mission
Ensure deterministic static sitemap emission (`dist/sitemap.xml` & `dist/sitemap-0.xml`, and `public/`) during `npm run build`, hardened across Cloudflare ASSETS deployment and passing 100% test suites.

## 🔒 My Identity
- Archetype: teamwork_preview_worker
- Roles: implementer, qa, specialist
- Working directory: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_repair_5
- Original parent: 815f585c-6600-4869-bebd-41cdc77658c5
- Milestone: Static Sitemap Emission & Build Pipeline Hardening

## 🔒 Key Constraints
- Build script (`package.json`) and/or Astro configuration must deterministically generate and emit complete 520-URL sitemaps (`sitemap.xml` and `sitemap-0.xml`) to both `public/` and `dist/`.
- Must pass all test suites: `node tools/validate_sitemap_full.cjs`, `node tools/compare_sitemap.cjs`, `node tools/site-doctor.cjs`, `node tools/test_crawler_emulation.cjs`, `node tools/stress-test-harness.cjs`.
- No cheating, no hardcoding, genuine generation logic.

## Current Parent
- Conversation ID: 815f585c-6600-4869-bebd-41cdc77658c5
- Updated: not yet

## Task Summary
- **What to build**: Deterministic static sitemap emission during `npm run build` so that `dist/sitemap.xml` and `dist/sitemap-0.xml` are statically present for Cloudflare ASSETS delivery.
- **Success criteria**: `npm run build` generates `dist/sitemap.xml` and `dist/sitemap-0.xml` with 520 valid URLs; 100% pass across all 5 verification suites.
- **Interface contracts**: `PROJECT.md`, `SCOPE.md`, `ORIGINAL_REQUEST.md`
- **Code layout**: `src/utils/sitemap.ts`, `tools/generate-static-sitemap.cjs`, `package.json`, `astro.config.mjs`, `public/sitemap*.xml`.

## Key Decisions Made
- [TBD]

## Artifact Index
- `.agents/teamwork_preview_worker_repair_5/DISPATCH.md` — Assignment record
- `.agents/teamwork_preview_worker_repair_5/BRIEFING.md` — Agent memory
- `.agents/teamwork_preview_worker_repair_5/progress.md` — Progress tracker

## Change Tracker
- **Files modified**: None yet
- **Build status**: Pending initial run
- **Pending issues**: None

## Quality Status
- **Build/test result**: Pending
- **Lint status**: Clean
- **Tests added/modified**: Pending

## Loaded Skills
- None
