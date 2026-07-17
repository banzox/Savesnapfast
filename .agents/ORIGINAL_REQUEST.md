# Original User Request

## Initial Request — 2026-07-16T09:07:44Z

Fix SEO, indexing, redirect, canonical, and link issues in the Astro-based website `savetik-fast.xyz` according to Google Search Console audits.

Working directory: `c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast`
Integrity mode: demo

## Requirements

### R1. Resolve Redirect Issues (3XX)
- Ensure consistent trailing slash usage across the entire project (matching Astro's configured `trailingSlash: 'never'`).
- Update navigation links (e.g. `src/components/Navbar.astro`, back buttons) to point directly to clean URLs without generating redirects.
- Clean up `src/middleware.ts` to execute redirects cleanly (e.g., removing trailing slashes and mapping `/en` directly to `/` and `tl` to `fil`) without causing circular redirections.

### R2. Handle 404 Pages
- Keep the legacy redirect rules active (redirecting legacy `tl` locale paths to `fil` and `/en` to `/`).
- Identify and fix broken internal links pointing to non-existent pages (e.g., legacy routes or misnamed files).

### R3. Align Canonical Tags and Prevent Content Duplication
- Set correct, unique canonical URLs for all indexable pages.
- Ensure translated legal pages (about, privacy, terms, disclaimer, dmca, contact) point their canonical tags to the main English version and are excluded from `hreflang` attributes.
- Ensure device-specific duplicate pages (e.g., ios, android, mac, pc) have `noindex` rules, are excluded from hreflang tags, and are not included in the generated sitemaps.

## Acceptance Criteria

### Project Build & Verification
- [ ] Running `npm run build` succeeds locally without any TypeScript or Astro compiler errors.
- [ ] Running `node verify_build.cjs` passes successfully without warning of trailing slash mismatches or incorrect canonical tags.

### Redirects & Links Integrity
- [ ] Internal links to legal pages (about, privacy, terms, contact, dmca, disclaimer) point directly to the English canonical version (e.g., `/about`, `/privacy`) from all language locales in the generated build.
- [ ] Requests to URLs with the `tl` locale prefix (e.g. `/tl/about`, `/tl/`) are cleanly redirected to their `fil` equivalents via 301 redirects.
- [ ] No internal links in the codebase contain trailing slashes (except the home page `/`).

### Sitemap & Search Engine Directives
- [ ] The generated `sitemap-index.xml` and `sitemap-0.xml` do not contain device-specific pages (`/ios`, `/android`, `/mac`, `/pc` or their language prefixes).
- [ ] Translated legal pages are excluded from the sitemap.
- [ ] The `public/robots.txt` correctly blocks search bots from crawling disallowed device pages and non-English legal pages.
