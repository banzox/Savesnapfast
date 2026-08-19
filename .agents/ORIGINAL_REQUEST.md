# Original User Request

## Initial Request — 2026-08-02T17:22:47Z

Full audit, deep inspection, and resolution of all technical, SEO, Google indexing, rendering, and performance issues for SaveTikFast (TikTok downloader web app).

Working directory: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast
Integrity mode: development

## Requirements

### R1. Technical SEO & Search Engine Indexing Fixes
Ensure all pages meet Google Search Console indexing standards: correct canonical URLs, valid hreflang tags across supported languages, proper meta robots directives (index/noindex scoping), clean status codes (no soft 404s), and valid sitemaps without duplicate or legacy paths.

### R2. Core Web App & Scraper API Health
Verify and ensure all download endpoints (video, MP3, story, slideshow), scrapers, and fallback APIs respond reliably with 200 OK without unhandled edge worker exceptions or rate-limiting crashes on Cloudflare.

### R3. Performance, Assets & Rendering Integrity
Validate SSR rendering in Cloudflare Pages environment, ensure static assets load without 404s, remove extraneous bot-blocking triggers, and optimize page load performance.

## Acceptance Criteria

### SEO & Indexability
- [ ] robots.txt contains accurate disallow rules for device/legal translated pages.
- [ ] sitemap-index.xml and sub-sitemaps generate without broken/redirecting URLs.
- [ ] Meta canonical and hreflang tags match exact target URLs with no trailing slash conflicts.
- [ ] No pages exhibit soft 404s or unhandled SSR errors under bot User-Agent requests.

### Build & Verification
- [ ] npx astro build completes clean with 0 errors.
- [ ] node verify_build.cjs passes all verification checks.

## Follow-up — 2026-08-19T16:04:13Z

# Teamwork Project Prompt — Final

Diagnose and resolve the search visibility and de-indexing crisis for Savesnapfast (`savetik-fast.xyz`), inspecting Google Search Console indexing causes, Cloudflare Edge & WAF behaviors, and GitHub repository codebase health.

Working directory: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast
Integrity mode: development

## Requirements

### R1. Google Search Console & SEO Root Cause Investigation
Investigate why `savetik-fast.xyz` has 0 indexed pages (`site:savetik-fast.xyz` returning 0 results). Differentiate between technical crawl issues, Google algorithm penalties (Scaled Content Abuse / Thin Content), manual actions, DMCA/deceptive site flags, and provide actionable audit criteria and remediation steps for GSC.

### R2. Cloudflare & Edge Delivery Verification
Audit Cloudflare Worker routing, WAF rules, Bot Fight Mode, cache headers, and crawler accessibility to ensure Googlebot (and other search crawlers) receive clean 200 OK responses with valid HTML and no challenge pages across all locales.

### R3. GitHub Codebase & Build Validation
Verify that the Astro project build, prerendered static assets, `robots.txt`, `sitemap.xml` (191 clean URLs), canonical tags, and hreflang annotations across 30 supported languages are 100% compliant with zero crawl-budget waste or redirect loops.

## Acceptance Criteria

### Technical SEO & Crawler Verification
- [ ] All primary routes (`/`, `/{lang}`, `/mp3`, `/{lang}/mp3`, `/story`, `/slideshow`, `/blog/*`) return HTTP 200 to `Googlebot/2.1` without JavaScript challenge or blocking.
- [ ] `robots.txt` and `sitemap.xml` are accessible, correctly formatted, and contain zero duplicate or trailing-slash URLs.
- [ ] All 30 localized language variants possess valid self-referencing canonicals and matching bidirectional `hreflang` sets.

### Diagnostic & Recovery Action Plan
- [ ] Provide explicit, documented diagnostic checklist for Google Search Console (Manual Actions, Security Issues, Index Coverage report, URL live test).
- [ ] Verify Cloudflare Worker (`worker/index.ts`) edge routing and assets binding without redirect chains.
- [ ] Local build and site doctor audit (`npm run doctor`) pass 100% of checks without errors or warnings.

