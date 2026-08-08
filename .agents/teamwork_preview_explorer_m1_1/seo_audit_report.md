# SaveTikFast - Technical SEO & Indexability Audit Report (Milestone 1)

**Date**: 2026-08-02  
**Auditor**: teamwork_preview_explorer_m1_1  
**Project**: SaveTikFast (`savetik-fast.xyz`)  
**Scope**: Milestone 1 - SEO & Indexability Deep Audit (R1 Criteria)  

---

## Executive Summary

A comprehensive technical SEO and search engine indexability audit was conducted on the SaveTikFast codebase. The investigation covered `public/robots.txt`, sitemap configuration and output (`dist/sitemap-index.xml` & `dist/sitemap-0.xml`), `src/components/SEOConfig.astro`, `src/middleware.ts`, layout components (`Layout.astro`, `SEOHead.astro`, `Schema.astro`), and all 29 page routes under `src/pages/`.

While sitemap generation and trailing slash handling are largely clean and consistent, **two critical architectural violations** in `SEOConfig.astro` and `public/robots.txt` were identified that actively impair Google Search Console indexing:

1. **Non-Self-Referencing Canonicals on Translated Legal Pages**: `SEOConfig.astro` forces translated legal pages (e.g. `/ar/privacy`) to point their canonical tag to the English version (`https://savetik-fast.xyz/privacy`), directly violating `PROJECT.md` line 27 ("Canonical URLs must always be self-referencing").
2. **Missing Hreflang Tags on Translated Legal & Device Pages**: `SEOConfig.astro` completely suppresses hreflang generation on translated legal pages and device pages (`skipHreflang = true`), leaving search engines unable to associate localized versions across supported languages.
3. **Robots.txt Crawl Blocking vs. Meta Noindex Conflict**: `public/robots.txt` disallows crawlers from fetching `/*/about`, `/*/privacy`, `/*/ios`, etc., preventing search bots from seeing their `<meta name="robots" content="noindex, follow">` tags, causing GSC "Indexed though blocked by robots.txt" issues.
4. **Hreflang Legacy Code Discrepancy (`tl` vs `fil`)**: `SEOConfig.astro` converts `fil` to `tl` in outputting `hreflang="tl"`, creating a mismatch with the site's canonical URL structure `/fil/` and middleware legacy redirect `/tl` -> `/fil`.

---

## Detailed Findings by Audit Area

### 1. Robots Directives & `public/robots.txt`

#### File Location
`public/robots.txt`

#### Current Configuration
```txt
User-agent: *
Allow: /

# Block API endpoints
Disallow: /api/

# Block Keystatic admin control panels
Disallow: /admin/
Disallow: /admin

# Block device pages
Disallow: /ios
Disallow: /android
Disallow: /mac
Disallow: /pc
Disallow: /*/ios
Disallow: /*/android
Disallow: /*/mac
Disallow: /*/pc

# Block translated legal pages
Disallow: /*/about
Disallow: /*/privacy
Disallow: /*/terms
Disallow: /*/contact
Disallow: /*/dmca
Disallow: /*/disclaimer

# Block duplicate parameters to prevent crawl budget waste on duplicate URLs
Disallow: /*?*

# Sitemaps
Sitemap: https://savetik-fast.xyz/sitemap-index.xml
```

#### Observations & Issues
1. **Robots Disallow vs. Meta Noindex Conflict**:
   - Device pages (`/ios`, `/[lang]/ios`, etc.) and translated legal pages (`/[lang]/about`, `/[lang]/privacy`, etc.) render `<meta name="robots" content="noindex, follow">`.
   - However, `robots.txt` disallows crawling those exact paths (`Disallow: /*/about`, `Disallow: /*/ios`, etc.).
   - **Impact**: Googlebot is prohibited from fetching the HTML of disallowed URLs. Because it cannot crawl the page, it cannot read the `<meta name="robots" content="noindex">` directive. When inbound links exist, Google indexes the URL header without page content, triggering Google Search Console's *"Indexed though blocked by robots.txt"* status.
   - **Contract Rule**: `PROJECT.md` line 35 specifies: *"Allows crawlers to access `noindex` legal/device pages to process their directives, and allows `/_astro/` to properly render pages."*
2. **Valid Disallows**:
   - `Disallow: /api/` and `Disallow: /admin` correctly shield private API endpoints and admin panels.
   - `Disallow: /*?*` correctly prevents crawl budget waste on parameter query strings.
3. **Sitemap Reference**:
   - Line 33 correctly specifies `Sitemap: https://savetik-fast.xyz/sitemap-index.xml`.

---

### 2. Sitemap Generation & Inspection

#### Config & Script Files
- `astro.config.mjs` (lines 45–120)
- `src/pages/sitemap.xml.ts` (lines 1–6)
- `dist/sitemap-index.xml`
- `dist/sitemap-0.xml`

#### Observations & Verification
1. **Sitemap Output Inspection**:
   - `dist/sitemap-index.xml` correctly points to `https://savetik-fast.xyz/sitemap-0.xml`.
   - `dist/sitemap-0.xml` contains 71 URLs.
   - **0 trailing slash URLs**: All entries use clean URLs without trailing slashes.
   - **0 `/en/` or `/en` URLs**: Excluded by sitemap filter.
   - **0 legacy `/tl/` URLs**: Excluded by sitemap filter.
   - **0 301/308 redirecting URLs**: Every URL in the sitemap returns 200 OK directly.
2. **Filter Logic in `astro.config.mjs`**:
   - Line 51 excludes `/en/` prefixed paths.
   - Line 58 excludes device-specific pages (`ios`, `android`, `mac`, `pc`).
   - Line 62 excludes translated legal pages (`about`, `privacy`, `terms`, `contact`, `dmca`, `disclaimer` for non-English locales).
   - Lines 66–68 focus sitemap submission on 10 priority locales (`en`, `ar`, `es`, `pt`, `id`, `fr`, `de`, `tr`, `vi`, `hi`) to preserve crawl budget.
   - Lines 84–86 exclude thin-content blog listing pages (less than 2 posts).
3. **`src/pages/sitemap.xml.ts`**:
   - Correctly issues a HTTP 301 redirect from `/sitemap.xml` to `/sitemap-index.xml`.

---

### 3. Canonical & Hreflang Generation, Trailing Slashes, and Locale Codes

#### Core Component
`src/components/SEOConfig.astro`

#### Detailed Defect Analysis

##### Defect A: Non-Self-Referencing Canonicals for Translated Legal Pages
- **File**: `src/components/SEOConfig.astro`
- **Lines**: 40–49
```astro
const legalPages = ["about", "privacy", "terms", "contact", "dmca", "disclaimer"];
const isLegalPage = legalPages.includes(baseSlug);
const isTranslatedLegalPage = isLegalPage && isLangPrefix;

const canonicalPath = isTranslatedLegalPage
    ? `/${baseSlug}`
    : pathname;
const canonicalURL = new URL(canonicalPath, SITE_ORIGIN).href;
```
- **Observed Behavior**: On `/ar/privacy`, `canonicalURL` evaluates to `https://savetik-fast.xyz/privacy`.
- **Violation**:
  1. `PROJECT.md` line 27: *"Canonical URLs must always be self-referencing to point to their own path (including translated legal and device pages)."*
  2. GSC Standards: Placing an English canonical on an Arabic page causes Google to reject the Arabic page as a duplicate without user-selected canonical.
- **Recommended Fix**: Remove the override so `canonicalPath` is always `pathname` (self-referencing).
```astro
const canonicalURL = new URL(pathname, SITE_ORIGIN).href;
```

##### Defect B: Suppression of Hreflang Tags on Translated Legal & Device Pages
- **File**: `src/components/SEOConfig.astro`
- **Lines**: 55, 95
```astro
const skipHreflang = noindex || isDevicePage || is404Page || isTranslatedLegalPage;
```
- **Observed Behavior**: `skipHreflang` evaluates to `true` for all translated legal pages and device pages, disabling all `<link rel="alternate" hreflang="...">` tags on these pages.
- **Violation**: `PROJECT.md` line 28: *"Alternate `hreflang` tags must be generated for all pages, including translated legal and device pages, to link all 30 languages together for proper indexing."*
- **Recommended Fix**: `hreflangs` should be generated for all pages across all supported languages (only skipping true 404 pages).

##### Defect C: Legacy Hreflang Attribute Mapping (`fil` vs `tl`)
- **File**: `src/components/SEOConfig.astro`
- **Line**: 74
```astro
return {
    lang: langCode === "fil" ? "tl" : langCode,
    href: new URL(langPath, SITE_ORIGIN).href,
};
```
- **Observed Behavior**: Produces `<link rel="alternate" hreflang="tl" href="https://savetik-fast.xyz/fil/..." />`.
- **Issue**:
  1. `src/middleware.ts` (line 32) redirects legacy `/tl/*` paths to `/fil/*`.
  2. The canonical language code throughout the codebase is `fil`.
  3. Emitting `hreflang="tl"` for a `/fil/` target URL creates an attribute mismatch.
- **Recommended Fix**: Output `lang: langCode` (i.e. `hreflang="fil"`).

##### Trailing Slash Audit: PASS
- `astro.config.mjs`: `trailingSlash: 'never'`
- `src/middleware.ts`: Lines 21–23 strip trailing slashes and return HTTP 301.
- `SEOConfig.astro`: Strips trailing slashes from `pathname` and `langPath`.
- `Navbar.astro`, `Footer.astro`, `LanguageSelector.astro`, `Schema.astro`: All internal hrefs are formatted without trailing slashes.

---

### 4. Soft 404s & Bot User-Agent Handling

#### Analysis & Verification
1. **Status Code Verification**:
   - Inspecting `src/pages/[lang]/index.astro`, `mp3.astro`, `story.astro`, `slideshow.astro`, `tools.astro`, `about.astro`, `privacy.astro`, etc.:
   - For invalid or unrecognized language parameters (e.g. `/xyz/mp3`), each template executes:
     ```astro
     if (!isValidLang) {
         Astro.response.status = 404;
         Astro.response.statusText = "Not Found";
     }
     ```
     and renders `<NotFound />`.
   - **Result**: Invalid routes correctly respond with HTTP 404 status codes. No soft 404s (200 OK on error page) occur.
2. **Bot User-Agent Behavior**:
   - Zero User-Agent conditional checks exist in `src/` server-side code.
   - Crawlers (Googlebot, Bingbot, etc.) receive the exact same HTTP status codes and HTML markup as standard users.

---

## Actionable Recommendations & Fix Plan

| Area | Current State | Target Fix | File Path |
|------|---------------|------------|-----------|
| **Robots.txt** | Disallows `/*/about`, `/*/privacy`, `/*/ios`, etc., blocking noindex processing | Remove disallow rules for device and translated legal pages so crawlers read `<meta name="robots" content="noindex">` | `public/robots.txt` |
| **Canonical URLs** | Translated legal pages canonicalize to `/about`, `/privacy`, etc. | Ensure canonical URL is strictly self-referencing (`canonicalURL = new URL(pathname, SITE_ORIGIN).href`) | `src/components/SEOConfig.astro` |
| **Hreflang Links** | `skipHreflang = true` suppresses hreflang on legal & device pages | Remove `isTranslatedLegalPage` and `isDevicePage` from `skipHreflang` so all 30 languages generate hreflang links | `src/components/SEOConfig.astro` |
| **Hreflang Code** | `langCode === "fil" ? "tl" : langCode` | Use `langCode` directly (`hreflang="fil"`) | `src/components/SEOConfig.astro` |

---

## Conclusion

The core sitemap structure, trailing slash handling, and status code behavior for bot requests are operating correctly. However, resolving the **canonical self-referencing logic**, **hreflang generation across all 30 languages**, and **robots.txt disallow rules** in Milestone 3 will ensure 100% compliance with Google Search Console standards and project interface contracts.
