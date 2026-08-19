# R3 GitHub Codebase, Astro Build & Verification System Deep Investigation

## 1. Observation

### 1.1 Astro Configuration & Static Pre-rendering (`astro.config.mjs`)
- **Site Origin**: `site: 'https://savetik-fast.xyz'` (`astro.config.mjs:8`)
- **Trailing Slash Setting**: `trailingSlash: 'never'` (`astro.config.mjs:9`)
- **Adapter**: `adapter: cloudflare({ imageService: 'passthrough' })` (`astro.config.mjs:10-12`)
- **Build Output Format**: `build: { format: 'file' }` (`astro.config.mjs:13-15`), which compiles pages directly to file format (e.g., `dist/mp3.html`, `dist/ar.html`, `dist/ar/mp3.html`) rather than nested directory indexes (`dist/mp3/index.html`). This prevents web server redirect overhead on clean URLs.
- **Integrations**: `integrations: [react()]` (`astro.config.mjs:18`).
- **i18n Configuration**:
  - `defaultLocale: 'en'` (`astro.config.mjs:20`)
  - `locales`: 30 languages (`en`, `ar`, `es`, `pt`, `id`, `fr`, `de`, `it`, `tr`, `ru`, `vi`, `th`, `ja`, `ko`, `pl`, `nl`, `ro`, `ms`, `fil`, `uk`, `cs`, `sv`, `hu`, `el`, `da`, `fi`, `no`, `bg`, `zh`, `hi`) (`astro.config.mjs:5, 21`)
  - `routing: { prefixDefaultLocale: false }` (`astro.config.mjs:22-24`) — ensures English pages do not use `/en/` prefix.

### 1.2 Route Tree & Static Generation Across 30 Languages
Every content route implements static prerendering (`export const prerender = true;`):
1. **Root English Routes (14 Core Page Types + 4 Device Guides + Blog)**:
   - `/` (`src/pages/index.astro`)
   - `/mp3` (`src/pages/mp3.astro`)
   - `/story` (`src/pages/story.astro`)
   - `/slideshow` (`src/pages/slideshow.astro`)
   - `/blog` (`src/pages/blog.astro`)
   - `/blog/[slug]` (`src/pages/blog/[slug].astro`) — dynamically renders 9 English Markdown posts from `src/content/blog/`.
   - `/tools` (`src/pages/tools.astro`)
   - `/[device]` (`src/pages/[device].astro`) — exports `getStaticPaths()` for `["ios", "android", "mac", "pc"]`.
   - Legal/info pages: `/about`, `/contact`, `/privacy`, `/terms`, `/disclaimer`, `/dmca` (`src/pages/*.astro`)
   - English-only governance: `/editorial-policy` (`src/pages/editorial-policy.astro`)
   - Error handling: `/404` (`src/pages/404.astro`)
2. **Localized Routes (29 Non-English Languages)**:
   - `/{lang}` (`src/pages/[lang]/index.astro`)
   - `/{lang}/mp3` (`src/pages/[lang]/mp3.astro`)
   - `/{lang}/story` (`src/pages/[lang]/story.astro`)
   - `/{lang}/slideshow` (`src/pages/[lang]/slideshow.astro`)
   - `/{lang}/blog` (`src/pages/[lang]/blog.astro`)
   - `/{lang}/blog/[slug]` (`src/pages/[lang]/blog/[slug].astro`) — 29 localized blog posts (1 Arabic + 28 other languages).
   - `/{lang}/tools` (`src/pages/[lang]/tools.astro`)
   - `/{lang}/[device]` (`src/pages/[lang]/[device].astro`) — 4 device pages per language ($29 \times 4 = 116$ device guide pages).
   - `/{lang}/about`, `/{lang}/contact`, `/{lang}/privacy`, `/{lang}/terms`, `/{lang}/disclaimer`, `/{lang}/dmca` ($29 \times 6 = 174$ pages).
3. **SSR Endpoints** (`export const prerender = false;`):
   - `/api/tiktok` (`src/pages/api/tiktok.ts`)
   - `/api/download` (`src/pages/api/download.ts`)

### 1.3 Sitemap Generation & URL Breakdown (`src/utils/sitemap.ts`)
- **Generation Logic**: `createSitemapXml()` in `src/utils/sitemap.ts` programmatically builds the sitemap:
  - `ROOT_PAGES`: 7 pages (`""`, `"about"`, `"blog"`, `"editorial-policy"`, `"mp3"`, `"slideshow"`, `"story"`) (`src/utils/sitemap.ts:11-19`)
  - `LOCALIZED_PAGES`: 5 pages (`""`, `"blog"`, `"mp3"`, `"slideshow"`, `"story"`) $\times 29$ languages = 145 URLs (`src/utils/sitemap.ts:21-27, 45-52`)
  - `posts` collection from `src/content/blog/`: 39 posts (`src/utils/sitemap.ts:54-64`)
  - Total URLs generated: $7 + 145 + 39 = \mathbf{191\text{ URLs}}$.
- **Endpoints**:
  - `src/pages/sitemap.xml.ts` (`prerender = true`) -> `https://savetik-fast.xyz/sitemap.xml`
  - `src/pages/sitemap-0.xml.ts` (`prerender = true`) -> `https://savetik-fast.xyz/sitemap-0.xml`
  - `public/sitemap-index.xml` (Static XML referencing `https://savetik-fast.xyz/sitemap-0.xml`)
- **Validation**:
  - Zero trailing-slash URLs (except root `/`).
  - Zero `/en/` prefixed URLs.
  - Zero disallowed device/legal translation paths included in sitemap.
  - Proper `<lastmod>` timestamps derived from Markdown frontmatter `pubDate`.

### 1.4 Site Doctor Implementation & Test Suites (`tools/site-doctor.cjs`)
- `npm run doctor` executes `tools/site-doctor.cjs --verbose`.
- **Checks Performed (13 distinct test categories, 117 total assertions)**:
  1. *SEO Canonical & Trailing Slash*: Verifies `trailingSlash: 'never'`, `build.format: 'file'`, no `ensureTrailingSlash` in `SEOConfig.astro`, clean dist canonical outputs.
  2. *Hreflang Tags*: Verifies presence of `x-default`, self-referencing `hreflang`, $\ge 30$ language alternates per page, absence of hreflang on 404 page.
  3. *Indexation & Meta Directives*: Asserts `index, follow` directive on all standard content and device pages; ensures absence of erroneous `noindex`.
  4. *Robots.txt*: Asserts presence of `User-agent: *`, `Allow: /`, and `Sitemap: https://savetik-fast.xyz/sitemap.xml`.
  5. *Sitemap Integrity*: Verifies `sitemap-index.xml` and `sitemap-0.xml`, URL count (191), zero trailing slashes, zero `/en/` paths.
  6. *Redirect Logic*: Verifies `tl -> fil`, `/en -> /`, trailing slash normalization, and 8 legacy slug redirects (`about-us`, `who-are-we`, `contact-us`, `privacy-policy`, `terms-of-service`, `terms-and-conditions`, `disclaimer-policy`, `dmca-policy`).
  7. *Translation Completeness*: Compares keys in `en.json` against all 29 target locale files (`src/locales/locales/*.json`) for missing or untranslated critical keys.
  8. *Internal Links*: Validates navbar logo, tool links, dynamic language selector, and footer links.
  9. *Build Output*: Verifies file-format `.html` outputs across root and localized language directories.
  10. *Schema.org Structured Data*: Verifies `WebApplication`, `WebSite`, `Organization`, `BreadcrumbList`, `FAQPage`, and `SoftwareApplication` JSON-LD blocks.
  11. *Source Code Quality*: Checks `Layout.astro`, `404.astro`, `index.astro`, and domain reference consistency.
  12. *Page Parity*: Compares root routes against `src/pages/[lang]/` routes.
  13. *Translated Legal Page Canonicals*: Validates self-referencing canonical URLs for translated pages (`ar/about.html` -> `https://savetik-fast.xyz/ar/about`).
- **Execution Result**:
  - `npm run doctor` executed with **117/117 checks passed (0 errors, 0 warnings)**.

### 1.5 Legacy Test Script Observations
1. `verify_build.cjs`:
   - Line 93: Checks for `Sitemap: https://savetik-fast.xyz/sitemap-index.xml` in `robots.txt`. Because `public/robots.txt` specifies `Sitemap: https://savetik-fast.xyz/sitemap.xml`, `verify_build.cjs` reports an error on that single line.
2. `audit_check.cjs`:
   - An older pre-build script expecting translated legal pages (`/ar/about`) to point their canonical tag back to English (`/about`) and expecting `robots.txt` to disallow `/*/about`, `/*/ios`, etc. This contradicts Google's official multilingual indexing specifications and the updated project architecture where translated pages have self-referencing canonicals and are crawlable.

---

## 2. Logic Chain

1. **Astro Build Integrity**:
   - `astro.config.mjs` configures `@astrojs/cloudflare` with `build.format: 'file'` and `trailingSlash: 'never'`.
   - Running `npm run build` generates all static HTML files with matching `.html` extensions in `dist/`, accurately mapping to clean URLs without trailing slashes.
   - All 30 language routes compile cleanly with zero SSR syntax errors or missing layout dependencies.

2. **Indexation & Canonical Architecture**:
   - `SEOConfig.astro` dynamically resolves `canonicalURL` using `Astro.url.pathname` stripped of trailing slashes and `.html` extensions (`SEOConfig.astro:24-38`).
   - Every localized page receives a clean self-referencing canonical (`https://savetik-fast.xyz/{lang}/{slug}`) and 31 `hreflang` tags (30 locales + 1 `x-default`), matching Google's multi-regional SEO standards.
   - On single-language blog posts and governance pages (`editorial-policy.astro`), `skipHreflang` is activated (`SEOConfig.astro:44-47`) to prevent invalid cross-language mappings.

3. **Sitemap Accuracy**:
   - `src/utils/sitemap.ts` generates exactly 191 indexable URLs, prioritizing high-value landing pages (tools, root homepages, blog articles) while omitting non-English legal pages from the sitemap (avoiding thin content indexation while maintaining crawlability).
   - Both `/sitemap.xml` and `/sitemap-0.xml` deliver the complete 191 URL set directly with `Content-Type: application/xml; charset=utf-8` and cache headers (`src/utils/sitemap.ts:80-84`).

4. **Edge Routing & Cloudflare Alignment**:
   - `worker/index.ts` interceptors directly route dynamic API calls (`/api/tiktok`, `/api/download`) and apply `getCanonicalRedirect(url)` before serving static assets (`env.ASSETS.fetch(request)`).
   - `wrangler.jsonc` sets `html_handling: "drop-trailing-slash"`, `not_found_handling: "404-page"`, and `run_worker_first` on legacy paths, guaranteeing no redirect loops or conflicting trailing-slash behavior.

5. **Site Doctor Coverage**:
   - `tools/site-doctor.cjs` acts as the definitive single source of truth for repository health, testing 117 separate criteria across filesystem source files, build artifacts in `dist/`, and runtime configurations.

---

## 3. Caveats

- **Windows File Locking on Fresh Builds**: When re-running `npm run build` immediately in development on Windows, Node's `emptyDir` (`fs.rmdirSync`) can occasionally encounter transient `EPERM` locks if another process has an open file handle on `dist/`. Cleaning `dist/` prior to build (`Remove-Item -Recurse -Force dist`) prevents this.
- **Legacy Verification Scripts**: `verify_build.cjs` and `audit_check.cjs` contain legacy expectations that predate the self-referencing canonical and consolidated sitemap updates. They should either be updated to align with `site-doctor.cjs` or deprecated.

---

## 4. Conclusion

1. **Build Health**: Astro build completes with 0 errors and generates a clean static distribution in `dist/` with file-format HTML and zero trailing-slash mismatches across 30 languages.
2. **Sitemap & SEO Compliance**: The sitemap logic dynamically resolves exactly 191 clean canonical URLs without redirect chains or `/en/` pollution. Canonical and `hreflang` tags across all 30 languages are 100% compliant with search engine specifications.
3. **Verification Infrastructure**: `npm run doctor` (`tools/site-doctor.cjs`) provides comprehensive automated validation across 117 checks, all of which currently pass with 0 errors and 0 warnings.

---

## 5. Verification Method

To independently verify the investigation results:

1. **Run Site Doctor**:
   ```bash
   npm run doctor
   ```
   *Expected Output*: `Total checks: 117`, `Passed: 117`, `Errors: 0`, `Warnings: 0`, `ALL CHECKS PASSED - Site is healthy!`.

2. **Clean Build Execution**:
   ```powershell
   Remove-Item -Recurse -Force dist; npm run build
   ```
   *Expected Output*: `Server built in ...s`, `[build] Complete!`, Exit Code 0.

3. **Verify Sitemap Output**:
   Check URL count in generated sitemap:
   ```powershell
   (Select-String -Path dist/sitemap-0.xml -Pattern "<loc>" -AllMatches).Matches.Count
   ```
   *Expected Output*: `191`.

4. **Verify Canonical & Hreflang Tags**:
   Inspect `dist/mp3.html` and `dist/ar/mp3.html`:
   - `dist/mp3.html`: canonical is `https://savetik-fast.xyz/mp3`, 31 `hreflang` tags.
   - `dist/ar/mp3.html`: canonical is `https://savetik-fast.xyz/ar/mp3`, 31 `hreflang` tags.
