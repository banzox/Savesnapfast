# Project: Savesnapfast SEO & Redirects Fix

## Architecture
- Astro-based website (`savetik-fast.xyz`).
- Multilingual site (uses i18n locales like `ar`, `bg`, `cs`, `da`, `de`, `el`, `es`, `fi`, `fr`, `hi`, `hu`, `id`, `it`, `ja`, `ko`, `ms`, `nl`, `no`, `pl`, `pt`, `ro`, `ru`, `sv`, `th`, `fil`, and legacy `tl`).
- Deploy target: Cloudflare Pages (indicated by `wrangler.jsonc` and `public/_redirects`).
- Middleware redirects handled by `src/middleware.ts`.
- Page canonicals and hreflang tag configuration handled by `src/components/SEOConfig.astro`.
- Device pages: `ios`, `android`, `mac`, `pc` (e.g. `src/pages/[lang]/ios.astro`, `src/pages/ios.astro`, etc.).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Exploration | Analysis of files, routes, sitemaps, and robots configuration. | None | DONE |
| 2 | E2E Test Suite | Set up E2E Test infrastructure & update `TEST_INFRA.md`. | M1 | DONE |
| 3 | Implementation of Fixes | Fix redirects (R1), 404/broken links (R2), canonicals & duplicates (R3). | M2 | DONE |
| 4 | Verification & Auditing | Verify build, run test script, verify sitemap, run Forensic Auditor. | M3 | DONE |

## Interface Contracts
### `src/components/SEOConfig.astro`
- Props: title, description, canonical (optional), noindex (optional).
- Output: `<link rel="canonical" href="...">`, `<link rel="alternate" hreflang="..." href="...">`, `<meta name="robots" content="...">`.
- Rules:
  - Canonical must never have trailing slash unless it is `/`.
  - Hreflang URLs must never have trailing slash.
  - If `noindex` is true, set `<meta name="robots" content="noindex, follow">`.
  - Canonical URLs must always be self-referencing to point to their own path (including translated legal and device pages).
  - Alternate `hreflang` tags must be generated for all pages, including translated legal and device pages, to link all 30 languages together for proper indexing.

### `src/middleware.ts`
- Performs redirects for legacy/unsupported routes (e.g., `tl` to `fil`, `/en` or `/en/` to `/`, trailing slash removal) without infinite redirect loops.

### `public/robots.txt`
- Must block `/api/`, `/admin/` (and `/admin`), and query parameters (`/*?*`).
- Allows crawlers to access `noindex` legal/device pages to process their directives, and allows `/_astro/` to properly render pages.
- Contains references to generated sitemap.

## Code Layout
- `src/components/`: SEOConfig, Navbar, Footer, LanguageSelector
- `src/pages/`: Pages like index, about, contact, tools, etc.
- `src/pages/[lang]/`: Translated equivalents of main pages, including device-specific and legal pages.
- `public/`: robots.txt, manifest.json, favicon, _redirects
- `astro.config.mjs`: Astro project configuration
- `src/middleware.ts`: Request processing & redirects
