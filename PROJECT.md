# Project: Savesnapfast (`savetik-fast.xyz`)

## Architecture
- **Framework**: Astro 5.x SSG with `@astrojs/cloudflare` adapter (`build.format: 'file'`, `trailingSlash: 'never'`).
- **Edge Deployment**: Cloudflare Workers with Static Asset binding (`wrangler.jsonc`, `worker/index.ts`).
- **SEO & Multilingual**: 30 supported languages (`en` + 29 translated locales). Self-referencing canonical URLs, 31-tag hreflang clusters (including `x-default`), automated sitemaps with 191 clean canonical URLs.
- **Verification Engine**: `tools/site-doctor.cjs` (117 automated SEO, edge routing, translation, schema, and sitemap integrity assertions).

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|--------|
| 1 | Google Search Console Root-Cause Analysis | Comprehensive diagnostic matrix differentiating WAF challenges, Safe Browsing ad flags, Scaled Content Abuse, and Manual Actions | M1 | Survey (Explorer 1) | DONE |
| 2 | Actionable GSC Remediation Guide | 4-step actionable manual checklist for GSC URL inspection, Security review, and sitemap re-indexing | M1 | Survey (Explorer 1) | DONE |
| 3 | Cloudflare Edge Crawler Accessibility & WAF Rules | Specification of `cf.client.bot` Skip rule, Bot Fight Mode handling, and 200 OK HTML delivery for search engine crawlers | M2 | Survey (Explorer 2) | DONE |
| 4 | Edge Worker Routing & Hostname Defense | Apex domain canonicalization (`www` -> apex), single-hop legacy redirect resolution, X-Robots-Tag for `/api/*` | M2 | Survey (Explorer 2) | DONE |
| 5 | Edge Security Headers & Cache-Control | Enhanced `public/_headers` (HSTS, nosniff, cache-control for clean HTML routes) | M2 | Survey (Explorer 2) | DONE |
| 6 | Astro Build & Static Prerendering | Verification of clean Astro compilation, file-format HTML outputs across 30 languages | M3 | Survey (Explorer 3) | DONE |
| 7 | Multilingual Sitemaps (191 Clean URLs) | Generation and validation of `sitemap.xml`, `sitemap-0.xml`, and `sitemap-index.xml` with zero trailing slashes | M3 | Survey (Explorer 3) | DONE |
| 8 | Canonical & 30-Language Hreflang Tags | Automated verification of bidirectional hreflang and self-referencing canonical tags across all 191 pages | M3 | Survey (Explorer 3) | DONE |
| 9 | Verification & Site Doctor Suite (`npm run doctor`) | Execution and 100% pass of `site-doctor.cjs` (117/117 checks) and synchronization of legacy build verification scripts | M3 | Survey (Explorer 3) | DONE |

## Milestones
| # | Name | Scope | Dependencies | Status | Key Outputs |
|---|------|-------|-------------|--------|-------------|
| M1 | SEO & GSC Diagnostic Architecture | Complete GSC root cause analysis, diagnostic matrix, and remediation documentation | None | DONE | `docs/GSC_RECOVERY_GUIDE.md`, 4-vector matrix |
| M2 | Cloudflare Edge & Routing Enhancements | Worker edge defense, headers optimization, single-hop redirects, WAF crawler rules | M1 | DONE | `worker/index.ts`, `src/utils/redirects.ts`, `public/_headers` |
| M3 | Codebase, Build, Sitemap & Test Synchronization | Synchronize test scripts, build verification, run `npm run doctor`, ensure 100% clean build | M2 | DONE | `verify_build.cjs`, `audit_check.cjs`, 191 sitemap URLs, 685 prerendered HTML |
| M4 | Comprehensive Verification & Forensic Audit | Multi-reviewer, multi-challenger crawler simulations, and forensic integrity audit | M1, M2, M3 | DONE | 1,336 crawler checks (Challenger 1), 29,700 stress checks (Challenger 2), CLEAN audit |

## Interface Contracts
### Edge Worker (`worker/index.ts`) ↔ Static Assets (`dist/`)
- Intercepts `/api/tiktok` and `/api/download` with `X-Robots-Tag: noindex, nofollow`.
- Normalizes hostname (`www.savetik-fast.xyz` -> `savetik-fast.xyz`) with 301.
- Evaluates `getCanonicalRedirect(url)` and emits 301 before asset fetch.
- Falls through to `env.ASSETS.fetch(request)` with `drop-trailing-slash` and `404-page` handling.

### SEO Component (`SEOConfig.astro`) ↔ Page Layouts (`Layout.astro`)
- Strips `.html` and trailing slashes.
- Emits absolute canonical URL: `https://savetik-fast.xyz/{path}`.
- Emits 31 `<link rel="alternate" hreflang="...">` tags for standard multilingual pages.
- Omits hreflang on 404 and standalone blog pages.

## Code Layout
- `astro.config.mjs` — Astro configuration with Cloudflare adapter, file format build, trailingSlash: 'never'.
- `wrangler.jsonc` — Cloudflare Worker configuration, routes, assets binding.
- `worker/index.ts` — Edge worker entry point with redirect logic and API handlers.
- `public/` — Static assets (`robots.txt`, `sitemap-index.xml`, `_headers`, `_redirects`).
- `src/components/` — `SEOConfig.astro`, `DownloadPage.astro`, navigation, UI components.
- `src/layouts/` — `Layout.astro`.
- `src/pages/` — Static routes across 30 languages, API endpoints, sitemaps (`sitemap.xml.ts`, `sitemap-0.xml.ts`).
- `src/utils/` — `sitemap.ts`, `redirects.ts`, language helpers.
- `tools/site-doctor.cjs` — Master automated verification suite (117 checks).
- `tools/stress-test-harness.cjs` — Empirical stress test harness (29,700 checks).
- `tools/test_crawler_emulation.cjs` — Crawler emulation test harness (1,336 checks).
- `docs/GSC_RECOVERY_GUIDE.md` — Authoritative GSC & Edge WAF Recovery Manual.
