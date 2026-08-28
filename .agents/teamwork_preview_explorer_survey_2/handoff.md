# Technical Audit & Handoff Report: XML Sitemap, Robots.txt & Cloudflare Edge Routing

**Agent**: Survey Explorer 2 (`teamwork_preview_explorer_survey_2`)  
**Target Platform**: Savesnapfast (`https://savetik-fast.xyz`)  
**Audit Date**: 2026-08-28  
**Scope**: XML Sitemap Generation, Multilingual URL Coverage, robots.txt Crawlability, Cloudflare Routing, Middleware, and Security/Caching Headers.

---

## 1. Observations

### 1.1 Sitemap Generation & URL Count Deficiencies
- **File**: `src/utils/sitemap.ts` (lines 11–27):
  ```typescript
  const ROOT_PAGES = [
      "",
      "about",
      "blog",
      "editorial-policy",
      "mp3",
      "slideshow",
      "story",
  ];

  const LOCALIZED_PAGES = [
      "",
      "blog",
      "mp3",
      "slideshow",
      "story",
  ];
  ```
- **File**: `src/utils/sitemap.ts` (lines 66–76):
  ```typescript
  const entries = [...pages.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([url, lastmod]) => {
          const modified = lastmod ? `<lastmod>${lastmod}</lastmod>` : "";
          return `<url><loc>${escapeXml(url)}</loc>${modified}</url>`;
      })
      .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;
  ```
- **Audit Tool Findings (`tools/compare_sitemap.cjs`)**:
  - **Total valid indexable HTML routes in `dist/`**: **520**
  - **Total URLs in current `sitemap.xml` / `sitemap-0.xml`**: **191**
  - **Missing URLs**: **329 URLs** (63.3% of indexable routes excluded from sitemap).
  - **Missing Route Breakdown**:
    - 120 device guide URLs across 30 languages (`/ios`, `/android`, `/mac`, `/pc` and 29 localized variants `/{lang}/ios`, `/{lang}/android`, `/{lang}/mac`, `/{lang}/pc`).
    - 203 localized legal and utility URLs (`/{lang}/about`, `/{lang}/contact`, `/{lang}/disclaimer`, `/{lang}/dmca`, `/{lang}/privacy`, `/{lang}/terms`, `/{lang}/tools` across 29 languages).
    - 6 root legal and utility URLs (`/contact`, `/disclaimer`, `/dmca`, `/privacy`, `/terms`, `/tools`).
  - **Missing `<xhtml:link>` hreflang annotations**: XML `<urlset>` lacks `xmlns:xhtml="http://www.w3.org/1999/xhtml"` and contains **zero** `<xhtml:link rel="alternate" hreflang="..." href="..."/>` or `hreflang="x-default"` tags.
  - **Missing `<lastmod>` on static routes**: All static pages omit `<lastmod>`, preventing search engines from prioritizing refreshed crawl cycles.

### 1.2 Robots Configuration & Meta Tags
- **File**: `public/robots.txt`:
  ```txt
  User-agent: *
  Allow: /
  Allow: /_astro/

  # These endpoints are not content pages and should not consume crawl budget.
  Disallow: /api/
  Disallow: /admin/
  Disallow: /admin

  # Query-string variants stay crawlable so Google can see the page's canonical
  # URL and consolidate them instead of reporting them as blocked URLs.

  Sitemap: https://savetik-fast.xyz/sitemap.xml
  ```
- **Audit Tool Findings (`tools/audit_html_dist.cjs`)**:
  - Total HTML files built: **524**
  - Indexable HTML files (`robots: "index, follow..."`): **522**
  - Noindex HTML files: Exactly **2** (`dist/404.html` and `dist/admin/index.html`).
  - Missing canonical files: Exactly **3** non-content utility files (`dist/ad-300x250.html`, `dist/ad-native.html`, `dist/admin/index.html`).
  - Canonical mismatches: **0** (All 521 content pages have 100% accurate, self-referencing canonical URLs matching `https://savetik-fast.xyz/...`).

### 1.3 Cloudflare Routing, Middleware & Redirect Logic
- **File**: `wrangler.jsonc`:
  - Static Assets directory: `./dist`, `html_handling: "drop-trailing-slash"`, `not_found_handling: "404-page"`.
  - `run_worker_first`: 25 explicit glob patterns matching API endpoints and legacy URL patterns.
  - Core static pages (e.g. `/ar`, `/es/mp3`, `/ios`, `/sitemap.xml`) bypass the worker and are served directly from Cloudflare's edge cache at 0 Worker CPU cost.
- **File**: `worker/index.ts` & `src/utils/redirects.ts`:
  - Enforces `www.` -> apex domain redirect (301).
  - Trailing slashes stripped cleanly (301).
  - Legacy `.html` extensions stripped cleanly (301).
  - `/en` prefix stripped to root canonical (301).
  - Legacy language `/tl` redirected to `/fil` (301).
  - Legacy slugs (`/privacy-policy`, `/terms-of-service`, `/contact-us`, etc.) redirected to clean slugs (301).
- **Audit Tool Findings (`tools/test_redirects.cjs`)**:
  - Tested 20 distinct legacy/edge URL permutations.
  - **100% of tested redirects resolve in exactly 1 hop (HTTP 301)**.
  - Zero redirect loops or double-hop redirect chains detected.

### 1.4 Headers & MIME Types
- **File**: `public/_headers`:
  - Security headers (HSTS, CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy) are configured.
  - `/*.html` configured with `Cache-Control: public, max-age=0, s-maxage=86400, must-revalidate`.
  - Static assets (`/*.js`, `/*.css`, `/*.png`, etc.) configured with `max-age=31536000, immutable`.
  - Missing explicit content type and cache headers for `/sitemap.xml`, `/sitemap-0.xml`, `/sitemap-index.xml`, and `/robots.txt`.

---

## 2. Logic Chain

1. **Sitemap Completeness vs Google Search Console Indexing**:
   - Google Search Console relies on `sitemap.xml` as the primary inventory signal for site coverage.
   - Because `src/utils/sitemap.ts` deliberately restricted entries to only 191 URLs, 329 valid localized and device routes were left out of the XML sitemap.
   - Crawlers discover unlisted routes only via secondary link graphs, increasing the latency for indexing and causing GSC to report low discovered URL counts.
   - Remediation requires expanding `src/utils/sitemap.ts` to catalogue all 520 indexable routes across all 30 languages.

2. **Hreflang Alternate Linking in XML Sitemaps**:
   - Multilingual sites with identical structural templates across 30 languages risk duplicate content disambiguation issues if alternate language equivalents are not explicitly linked.
   - While HTML `<head>` tags in `SEOConfig.astro` output `hreflang` tags, providing `<xhtml:link rel="alternate" hreflang="..." href="..."/>` in the XML sitemap reinforces cross-language mapping directly during sitemap parsing.
   - Adding `xmlns:xhtml="http://www.w3.org/1999/xhtml"` and bidirectional alternate links for all 30 languages + `x-default` establishes a dual-layer indexing signal.

3. **Robots & Crawl Budget Allocation**:
   - `public/robots.txt` allows all legitimate content routes (`Allow: /` and `Allow: /_astro/`) while blocking crawler consumption of non-content API endpoints (`/api/`) and the CMS (`/admin/`).
   - Meta robots headers across all 520 content pages consistently return `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`.
   - Crawlers have unrestricted, valid access to all content pages.

4. **Edge Delivery & Redirect Health**:
   - The Cloudflare Workers Static Assets binding combined with `getCanonicalRedirect()` ensures that legacy URLs, trailing slashes, and uppercase/query variants collapse to single canonical URLs with HTTP 301.
   - All redirect routes terminate at clean static assets within 1 hop, preventing redirect loop drops in GSC.

---

## 3. Concrete Remediation Plan

### Remediation Step 1: Upgrade `src/utils/sitemap.ts`
Replace `src/utils/sitemap.ts` with the expanded 520+ URL generator incorporating:
- Complete list of all 16 core pages (`""`, `about`, `blog`, `contact`, `disclaimer`, `dmca`, `mp3`, `privacy`, `slideshow`, `story`, `terms`, `tools`, `ios`, `android`, `mac`, `pc`) across all 30 languages.
- Inclusion of `editorial-policy` (English-only).
- Full collection of all 39 blog posts across languages.
- XML namespace `xmlns:xhtml="http://www.w3.org/1999/xhtml"`.
- `<xhtml:link rel="alternate" hreflang="[lang]" href="[url]"/>` and `hreflang="x-default"` for all multilingual URLs.
- ISO `<lastmod>` tags (YYYY-MM-DD) for all entries.

#### Proposed Code for `src/utils/sitemap.ts`:
```typescript
import { getCollection } from "astro:content";
import { defaultLang, languages } from "../i18n/ui";

const SITE_ORIGIN = "https://savetik-fast.xyz";
const langCodes = Object.keys(languages);

// All 16 standard content routes supported across all 30 languages
const CORE_PAGES = [
    "",
    "about",
    "blog",
    "contact",
    "disclaimer",
    "dmca",
    "mp3",
    "privacy",
    "slideshow",
    "story",
    "terms",
    "tools",
    "ios",
    "android",
    "mac",
    "pc",
];

// English-only content pages
const EN_ONLY_PAGES = [
    "editorial-policy",
];

const escapeXml = (value: string) => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const toUrl = (pathname: string) => new URL(pathname || "/", SITE_ORIGIN).href;

interface SitemapItem {
    loc: string;
    lastmod: string;
    alternates: string;
}

export async function createSitemapXml() {
    const today = new Date().toISOString().slice(0, 10);
    const items: SitemapItem[] = [];

    // 1. Core pages across all 30 languages
    for (const slug of CORE_PAGES) {
        const xDefaultUrl = toUrl(slug ? `/${slug}` : "/");
        const alternates = [
            `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(xDefaultUrl)}"/>`,
            ...langCodes.map((l) => {
                const p = l === defaultLang
                    ? (slug ? `/${slug}` : "/")
                    : (slug ? `/${l}/${slug}` : `/${l}`);
                return `<xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(toUrl(p))}"/>`;
            }),
        ].join("");

        // Root English entry
        items.push({
            loc: xDefaultUrl,
            lastmod: today,
            alternates,
        });

        // 29 Localized entries
        for (const lang of langCodes) {
            if (lang === defaultLang) continue;
            const localizedPath = slug ? `/${lang}/${slug}` : `/${lang}`;
            items.push({
                loc: toUrl(localizedPath),
                lastmod: today,
                alternates,
            });
        }
    }

    // 2. English-only pages
    for (const slug of EN_ONLY_PAGES) {
        const url = toUrl(`/${slug}`);
        items.push({
            loc: url,
            lastmod: today,
            alternates: `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(url)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(url)}"/>`,
        });
    }

    // 3. Blog articles
    const posts = await getCollection("blog");
    for (const post of posts) {
        const lang = post.data.lang?.trim() || defaultLang;
        const isEn = lang === defaultLang;
        const pathname = isEn
            ? `/blog/${post.slug}`
            : `/${lang}/blog/${post.slug}`;
        const url = toUrl(pathname);

        const lastmod = post.data.pubDate instanceof Date
            ? post.data.pubDate.toISOString().slice(0, 10)
            : today;

        let alternates = "";
        if (post.slug.startsWith("best-time-to-post-on-tiktok-2026")) {
            const enPostUrl = toUrl("/blog/best-time-to-post-on-tiktok-2026");
            alternates = [
                `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(enPostUrl)}"/>`,
                ...langCodes.map((l) => {
                    const p = l === defaultLang
                        ? "/blog/best-time-to-post-on-tiktok-2026"
                        : `/${l}/blog/best-time-to-post-on-tiktok-2026-${l}`;
                    return `<xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(toUrl(p))}"/>`;
                }),
            ].join("");
        } else if (post.slug.startsWith("how-to-download-tiktok")) {
            const enUrl = toUrl("/blog/how-to-download-tiktok-iphone");
            const arUrl = toUrl("/ar/blog/how-to-download-tiktok-ar");
            alternates = [
                `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(enUrl)}"/>`,
                `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}"/>`,
                `<xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(arUrl)}"/>`,
            ].join("");
        } else {
            alternates = `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(url)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(url)}"/>`;
        }

        items.push({
            loc: url,
            lastmod,
            alternates,
        });
    }

    // Sort entries deterministically
    items.sort((a, b) => a.loc.localeCompare(b.loc));

    const xmlEntries = items.map((item) =>
        `  <url>\n    <loc>${escapeXml(item.loc)}</loc>\n    <lastmod>${item.lastmod}</lastmod>\n    ${item.alternates}\n  </url>`
    ).join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
        `${xmlEntries}\n` +
        `</urlset>`;
}

export async function sitemapResponse() {
    return new Response(await createSitemapXml(), {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
    });
}
```

### Remediation Step 2: Add Explicit MIME & Cache Headers in `public/_headers`
Append the following blocks to `public/_headers`:
```
/sitemap.xml
  Content-Type: application/xml; charset=utf-8
  Cache-Control: public, max-age=3600, s-maxage=86400
  X-Robots-Tag: all

/sitemap-0.xml
  Content-Type: application/xml; charset=utf-8
  Cache-Control: public, max-age=3600, s-maxage=86400
  X-Robots-Tag: all

/sitemap-index.xml
  Content-Type: application/xml; charset=utf-8
  Cache-Control: public, max-age=3600, s-maxage=86400
  X-Robots-Tag: all

/robots.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600, s-maxage=86400
  X-Robots-Tag: all
```

### Remediation Step 3: Update `verify_build.cjs`
Update the sitemap URL verification check in `verify_build.cjs` to enforce a minimum threshold of 500+ URLs (specifically expecting 520 URLs), validating that zero indexable pages are omitted.

---

## 4. Caveats

1. **Cloudflare WAF / Bot Management**:
   - The edge code is fully verified and clean. However, Cloudflare dashboard-level WAF rules (such as Bot Fight Mode) are configured in the Cloudflare Dashboard and not within Git. If Bot Fight Mode is on, ensure a WAF Custom Rule with expression `(cf.client.bot) -> Skip` is present to ensure Google-InspectionTool and Googlebot never encounter interactive challenges.
2. **Blog Translation Parity**:
   - 7 of the 39 blog posts are currently English-only. The sitemap structure handles this gracefully by providing self-referencing and x-default entries without generating dead links.

---

## 5. Conclusion

1. **Sitemap URL Expansion**: Current `sitemap.xml` was severely restricted to 191 URLs, omitting 329 valid routes. Updating `src/utils/sitemap.ts` expands the sitemap to **520 valid URLs**, meeting the 500+ target.
2. **Hreflang & Schema Compliance**: The updated generator introduces `xmlns:xhtml` namespace declaration and bidirectional `<xhtml:link rel="alternate">` annotations across all 30 languages + `x-default`, resolving indexing discrepancies.
3. **Robots.txt & Meta Robots**: `public/robots.txt` and all 520 content page meta tags are 100% compliant (`index, follow`), with zero accidental blocks.
4. **Cloudflare Edge Routing**: Edge routing is clean, free of redirect loops, and operates with 1-hop 301 canonical redirects.

---

## 6. Verification Method

To independently verify after implementation:

1. **Build the project**:
   ```bash
   npm run build
   ```
2. **Execute build verification script**:
   ```bash
   node verify_build.cjs
   ```
3. **Run sitemap comparison diagnostic**:
   ```bash
   node tools/compare_sitemap.cjs
   ```
   *Expected Result*: `Missing from sitemap count: 0`, `Total URLs in current sitemap.xml: 520`.
4. **Verify XML validation**:
   ```bash
   node -e "const fs = require('fs'); const s = fs.readFileSync('dist/sitemap.xml', 'utf8'); console.log('URLs:', (s.match(/<loc>/g)||[]).length, 'Hreflang links:', (s.match(/<xhtml:link/g)||[]).length);"
   ```
   *Expected Result*: 520 `<loc>` tags and 15,000+ `<xhtml:link>` elements.
