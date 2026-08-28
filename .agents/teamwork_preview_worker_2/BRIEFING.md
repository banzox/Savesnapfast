# BRIEFING — 2026-08-28T10:25:00Z

## Mission
Harden the static sitemap emission pipeline so that `npm run build` deterministically outputs the genuine 520-URL sitemaps to both `public/` and `dist/`, ensuring static serving via Cloudflare Assets, and validating 100% test pass.

## 🔒 My Identity
- Archetype: worker
- Roles: implementer, qa, specialist
- Working directory: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_2
- Original parent: 815f585c-6600-4869-bebd-41cdc77658c5
- Milestone: iteration_2_static_sitemap_emission

## 🔒 Key Constraints
- Genuine implementation only; no dummy/facade implementations or hardcoded test checks.
- Zero breaking changes to existing routes or SEO layout/canonicals.
- `npm run build` must automatically emit `dist/sitemap.xml`, `dist/sitemap-0.xml`, `public/sitemap.xml`, `public/sitemap-0.xml`.
- Pass all 5 test suites: `validate_sitemap_full.cjs`, `compare_sitemap.cjs`, `site-doctor.cjs`, `test_crawler_emulation.cjs`, `stress-test-harness.cjs`.

## Current Parent
- Conversation ID: 815f585c-6600-4869-bebd-41cdc77658c5
- Updated: not yet

## Task Summary
- **What to build**: Deterministic static XML sitemap generation integrated into the build pipeline.
- **Success criteria**: Clean `npm run build`, verified static artifacts in `dist/` and `public/`, 100% test suite pass.
- **Interface contracts**: Standard XML sitemap index and urlset schemas (520 URLs), Cloudflare Assets static delivery.
- **Code layout**: `src/utils/sitemap.ts`, `tools/generate-static-sitemap.cjs`, `package.json`.

## Change Tracker
- **Files modified**: [TBD]
- **Build status**: [TBD]
- **Pending issues**: [TBD]

## Quality Status
- **Build/test result**: [TBD]
- **Lint status**: [TBD]
- **Tests added/modified**: [TBD]

## Loaded Skills
- None requested

## Key Decisions Made
- [TBD]

## Artifact Index
- `.agents/teamwork_preview_worker_2/DISPATCH.md` — Assignment instructions
- `.agents/teamwork_preview_worker_2/BRIEFING.md` — Agent memory
- `.agents/teamwork_preview_worker_2/progress.md` — Liveness and progress tracker
- `.agents/teamwork_preview_worker_2/handoff.md` — Handoff report
