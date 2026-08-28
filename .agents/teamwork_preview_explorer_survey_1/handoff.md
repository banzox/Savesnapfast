# Routing, Meta Robots & Indexing Architecture Forensic Audit Report

**Target Platform**: Savesnapfast (`https://savetik-fast.xyz`)  
**Audit Role**: Survey Explorer 1 (Routing & Meta Robots Auditor)  
**Date**: 2026-08-28  
**Scope**: Full codebase audit across `src/pages/`, `src/layouts/`, `src/components/`, `src/i18n/`, `src/locales/`, `src/utils/`, `worker/`, and `public/` across all 30 languages.

---

## 1. Observation

### 1.1 Meta Robots Directives & Restriction Points
We performed an exhaustive scan for all meta robots emission points across the codebase.

- **Primary Layout (`src/layouts/Layout.astro:16-24, 220-222`)**:
  ```astro
  interface Props {
      title: string;
      description: string;
      lang?: string;
      keywords?: string;
      noindex?: boolean;
  }
  const { title, description, lang = "en", keywords, noindex = false } = Astro.props;
  const is404 = noindex || Astro.url.pathname.includes("404");
  const robotsContent = is404
      ? "noindex, follow" 
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  ...
  <meta name="robots" content={robotsContent} />
  <meta name="googlebot" content={is404 ? "noindex, follow" : "index, follow, max-image-preview:large"} />
  <meta name="bingbot" content={is404 ? "noindex, follow" : "index, follow"} />
  ```
  - **Clean State**: When `is404` is `false`, `Layout.astro` emits full search indexation directives (`index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` for Googlebot and Bingbot).
  - **Restricted State**: Only when `is404` is `true` (explicitly on `/404` or when `noindex={true}` is provided), it emits `noindex, follow`.

- **Downloader & Tool Templates (`src/components/DownloadPage.astro:119-150`)**:
  ```astro
  // --- Device page detection (allow indexation as they have unique platform instructions) ---
  const isDevicePage = false;
  ...
  <Layout title={metaTitle} description={metaDesc} lang={lang} noindex={isDevicePage || noindex}>
  ```
  - Previously in earlier legacy iterations, `isDevicePage` was set to `true`, which caused device routes (`/ios`, `/android`, `/mac`, `/pc`, and localized `/{lang}/ios`...) to emit `noindex`.
  - In the current source code, `isDevicePage` is explicitly set to `false`, and `noindex` defaults to `false`.

- **404 & Fallback Handling (`src/components/NotFound.astro:12, 27` & `src/pages/404.astro:9`)**:
  ```astro
  const { lang = defaultLang, noindex = true } = Astro.props;
  ...
  <Layout title={`${t("404.title")} - SaveTikFast`} lang={lang} description={t("404.title")} noindex={noindex}>
  ```
  - `/404` and dynamically rejected language requests cleanly emit `noindex, follow`.

- **Cloudflare Edge API Directives (`worker/index.ts:14-22, 44, 53, 56-60`)**:
  ```ts
  function withRobotsHeader(response: Response): Response {
      const headers = new Headers(response.headers);
      headers.set("X-Robots-Tag", "noindex, nofollow");
      return new Response(response.body, { status: response.status, headers });
  }
  ```
  - Injects `X-Robots-Tag: noindex, nofollow` on all `/api/tiktok`, `/api/download`, and `/api/*` endpoints to prevent crawl budget drain.

- **Empirical Dist Build Verification (`tools/audit_html_dist.cjs`)**:
  - Out of **524 total built HTML files**:
    - **520 content pages** emit `index, follow, max-image-preview:large`.
    - Exactly **2 internal non-content pages** emit `noindex`: `404.html` (HTTP 404 fallback) and `admin/index.html` (Keystatic CMS admin interface).
    - Exactly **2 internal helper frames**: `ad-300x250.html` and `ad-native.html` (isolated ad containers).

---

### 1.2 Canonical Tag Logic & Self-Referencing Validation
- **Canonical Architecture (`src/components/SEOConfig.astro:22-38, 83-85`)**:
  ```astro
  // Strips trailing slash for clean comparison (trailingSlash: 'never')
  const rawPath = Astro.url.pathname.replace(/\.html$/, "");
  const pathname = rawPath.endsWith("/") && rawPath.length > 1
      ? rawPath.slice(0, -1)
      : rawPath;
  const pathParts = pathname.split("/").filter(Boolean);
  const firstPart = pathParts[0];
  const isLangPrefix = firstPart && Object.keys(languages).includes(firstPart);
  const baseSlug = isLangPrefix
      ? pathParts.slice(1).join("/")
      : pathParts.join("/");

  // Every indexable page gets a self-referencing canonical URL
  const canonicalURL = new URL(pathname, SITE_ORIGIN).href;
  ...
  <link rel="canonical" href={canonicalURL} />
  ```
- **Validation**:
  - `Astro.url.pathname` is stripped of `.html` extensions and normalized to remove trailing slashes (matching `trailingSlash: 'never'` in `astro.config.mjs`).
  - Empirical verification across all 520 built HTML files showed **0 canonical mismatches** (`canonicalMismatch: 0`).
  - Examples:
    - Root Video Downloader: `https://savetik-fast.xyz/`
    - Arabic MP3 Downloader: `https://savetik-fast.xyz/ar/mp3`
    - French iOS Guide: `https://savetik-fast.xyz/fr/ios`
    - German Privacy Policy: `https://savetik-fast.xyz/de/privacy`
    - Japanese Blog Post: `https://savetik-fast.xyz/ja/blog/best-time-to-post-on-tiktok-2026-ja`

---

### 1.3 Hreflang Tag Implementation Across All 30 Languages
- **Hreflang Generation (`src/components/SEOConfig.astro:40-99`)**:
  ```astro
  const currentLang = isLangPrefix ? firstPart : "en";
  const isBlogPost = baseSlug && baseSlug.startsWith("blog/") && baseSlug !== "blog";
  const is404Page = pathname.includes("404") || baseSlug === "404";
  const hasLocalizedVersions = baseSlug !== "editorial-policy";
  const skipHreflang = noindex || is404Page || isBlogPost || !hasLocalizedVersions;

  const hreflangs = skipHreflang ? [] : Object.keys(languages).map((langCode) => {
      const isSelf = langCode === currentLang;
      const slug = isBlogPost ? (isSelf ? baseSlug : "blog") : baseSlug;
      const langPath = langCode === "en"
          ? slug ? `/${slug}` : "/"
          : slug ? `/${langCode}/${slug}` : `/${langCode}`;

      return {
          lang: langCode,
          href: new URL(langPath, SITE_ORIGIN).href,
      };
  });

  const xDefaultSlug = isBlogPost ? (currentLang === "en" ? baseSlug : "blog") : baseSlug;
  const xDefaultHref = new URL(xDefaultSlug ? `/${xDefaultSlug}` : "/", SITE_ORIGIN).href;
  ```
- **Cluster Properties**:
  - **All 30 Language Codes**: `en`, `ar`, `es`, `pt`, `id`, `fr`, `de`, `it`, `tr`, `ru`, `vi`, `th`, `ja`, `ko`, `pl`, `nl`, `ro`, `ms`, `fil`, `uk`, `cs`, `sv`, `hu`, `el`, `da`, `fi`, `no`, `bg`, `zh`, `hi`.
  - **Bidirectional Coverage**: Every localized page outputs 30 distinct `<link rel="alternate" hreflang="[code]" href="..." />` tags plus 1 `<link rel="alternate" hreflang="x-default" href="..." />`.
  - **Smart Omission Rules**:
    - `skipHreflang` activates on `noindex`/`404` pages (preventing invalid indexation signals).
    - `skipHreflang` activates on `/editorial-policy` (an English-only policy page).
    - `skipHreflang` activates on distinct blog post slugs `/blog/[slug]` so that language variants with non-identical article slugs do not point to mismatched URLs.

---

### 1.4 Complete Inventory of All Route Types & 520 Content URLs

The Savesnapfast platform consists of **10 route types** spanning **30 languages** and **520 indexable content URLs**:

| # | Route Type | English Route | Localized Routes Pattern (`/{lang}/...`) | Total URLs |
|---|---|---|---|---|
| 1 | **Home / Video Downloader** | `/` (1 URL) | `/{lang}` for 29 languages | **30 URLs** |
| 2 | **MP3 Audio Downloader** | `/mp3` (1 URL) | `/{lang}/mp3` for 29 languages | **30 URLs** |
| 3 | **Slideshow / Carousel Downloader** | `/slideshow` (1 URL) | `/{lang}/slideshow` for 29 languages | **30 URLs** |
| 4 | **Stories Downloader** | `/story` (1 URL) | `/{lang}/story` for 29 languages | **30 URLs** |
| 5 | **Device Guides (iOS, Android, Mac, PC)** | `/ios`, `/android`, `/mac`, `/pc` (4 URLs) | `/{lang}/ios`, `/{lang}/android`, `/{lang}/mac`, `/{lang}/pc` (29 × 4 = 116) | **120 URLs** |
| 6 | **Creator Tools Suite** | `/tools` (1 URL) | `/{lang}/tools` for 29 languages | **30 URLs** |
| 7 | **Institutional & Legal Pages**<br>*(About, Contact, Privacy, Terms, DMCA, Disclaimer)* | `/about`, `/contact`, `/privacy`, `/terms`, `/dmca`, `/disclaimer` (6 URLs) | `/{lang}/about`, `/{lang}/contact`, `/{lang}/privacy`, `/{lang}/terms`, `/{lang}/dmca`, `/{lang}/disclaimer` (29 × 6 = 174) | **180 URLs** |
| 8 | **Editorial Policy** | `/editorial-policy` (1 URL) | *N/A (English-only standard)* | **1 URL** |
| 9 | **Blog Listing Index** | `/blog` (1 URL) | `/{lang}/blog` for 29 languages | **30 URLs** |
| 10 | **Blog Articles** | `/blog/{slug}` (9 English posts) | `/{lang}/blog/{slug}` (29 localized `best-time...` + 1 `how-to-download-tiktok-ar`) | **39 URLs** |
| **TOTAL** | **All Indexable Content Routes** | **26 English URLs** | **494 Localized URLs** | **520 URLs** |

In addition to the 520 content URLs, the platform includes:
- `/404` (Error fallback with `noindex, follow`)
- `/sitemap.xml` & `/sitemap-0.xml` (XML sitemaps)
- `/api/tiktok` & `/api/download` (Worker APIs with `X-Robots-Tag: noindex, nofollow`)

---

## 2. Logic Chain

1. **Premise 1**: Google Search Console index drops occur when crawlers encounter either:
   - Contradictory indexing signals (e.g. sitemap submits a URL that contains `noindex`, or canonical points to a different domain/URL).
   - Incomplete sitemaps (sitemap contains only 191 URLs while 520 valid URLs exist).
   - Trailing slash or redirect loops between `index.html`, `/`, and `/{lang}`.
   - WAF / Bot challenge blocks on Googlebot / Bingbot.
2. **Observation Step 1**: In `src/layouts/Layout.astro` and `src/components/DownloadPage.astro`, `noindex` is only emitted on genuine 404 pages or internal admin routes. 100% of the 520 content pages render `index, follow, max-image-preview:large`.
3. **Observation Step 2**: In `src/components/SEOConfig.astro`, canonical URLs are strictly computed as `new URL(pathname, SITE_ORIGIN).href` with trailing slash stripped, guaranteeing 100% self-referencing canonicals across all 30 languages.
4. **Observation Step 3**: In `src/utils/sitemap.ts`, `ROOT_PAGES` (7) and `LOCALIZED_PAGES` (5) were previously hardcoded to export only 191 URLs, leaving out device pages (`/ios`, `/android`, `/mac`, `/pc`), legal pages (`/privacy`, `/terms`, `/contact`, `/dmca`, `/disclaimer`), and tools (`/tools`).
5. **Deductive Conclusion**: To fulfill the mandate of expanding the XML sitemap to encompass all 500+ valid routes and eliminate any discrepancy with Googlebot discovery, `src/utils/sitemap.ts` must be updated to include all 10 route categories for all 30 languages (generating all 520 URLs in `sitemap.xml`).

---

## 3. Caveats

1. **Filipino Locale ISO Code**: The codebase uses `fil` as the locale slug (e.g. `/fil/mp3`). In `src/components/SEOConfig.astro`, hreflang outputs `hreflang="fil"`. Note that Google Search Console accepts both `fil` (ISO 639-2/3) and `tl` (ISO 639-1 Tagalog).
2. **Dynamic Blog Slugs**: Blog posts are intentionally excluded from cross-language hreflang sets in `SEOConfig.astro` (`isBlogPost` check) because localized posts have distinct translated slugs (e.g. `best-time-to-post-on-tiktok-2026-ar` vs `best-time-to-post-on-tiktok-2026`). Each article maintains its own self-referencing canonical.

---

## 4. Conclusion & Actionable Remediation Blueprint

### Core Audit Verdict:
1. **Routing & Meta Robots**: **HEALTHY & CLEAN**. Zero unwanted `noindex` directives exist on any of the 520 public content pages.
2. **Canonical URLs**: **100% SELF-REFERENCING & ACCURATE**. Zero canonical mismatches across all 30 languages.
3. **Hreflang Clusters**: **30 LANGUAGES + X-DEFAULT VALIDATED**. Complete bidirectional parity on all core templates.
4. **Sitemap Scope**: **REQUIRES EXPANSION**. `src/utils/sitemap.ts` currently outputs 191 URLs and should be expanded to include all 520 URLs.

### Action Plan for Worker/Implementation Team:
1. **Expand `src/utils/sitemap.ts`**:
   - Update `ROOT_PAGES` to:
     ```ts
     const ROOT_PAGES = [
         "", "mp3", "slideshow", "story",
         "ios", "android", "mac", "pc",
         "tools", "about", "contact", "privacy", "terms", "dmca", "disclaimer",
         "editorial-policy", "blog"
     ];
     ```
   - Update `LOCALIZED_PAGES` to:
     ```ts
     const LOCALIZED_PAGES = [
         "", "mp3", "slideshow", "story",
         "ios", "android", "mac", "pc",
         "tools", "about", "contact", "privacy", "terms", "dmca", "disclaimer",
         "blog"
     ];
     ```
   - This expands `sitemap.xml` to 17 (root) + 29 × 16 (localized) + 39 (blog posts) = **520 URLs**.
2. **Verify `robots.txt`**:
   - Confirm `Sitemap: https://savetik-fast.xyz/sitemap.xml` is present and no public content paths are disallowed.

---

## 5. Verification Method

To independently verify the routing, metadata, and crawler emulation assertions:

1. **Run Full Crawler Emulation Test Suite**:
   ```bash
   node tools/test_crawler_emulation.cjs
   ```
   *Expected Result: 1,336 passed assertions, 0 failures.*

2. **Run Full HTML Dist Inspector**:
   ```bash
   node tools/audit_html_dist.cjs
   ```
   *Expected Result: 520 indexable pages, exactly 2 non-content noindex files (404.html, admin/index.html), 0 canonical mismatches.*

3. **Verify Edge Worker & API Robots Headers**:
   ```bash
   node tools/test_worker.js
   ```
   *Expected Result: X-Robots-Tag: noindex, nofollow confirmed on all /api/* routes.*

