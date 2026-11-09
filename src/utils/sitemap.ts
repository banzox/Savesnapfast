import { getCollection } from "astro:content";
import { defaultLang, languages } from "../i18n/ui";

const SITE_ORIGIN = "https://savetik-fast.xyz";
const langCodes = Object.keys(languages);

// Stable release date for static templates (avoids fake daily lastmod churn)
const STATIC_RELEASE_DATE = "2026-11-09";

// High-intent search and tool routes prioritized across all supported languages
const CORE_PAGES = [
    "",
    "mp3",
    "slideshow",
    "story",
    "tools",
    "ios",
    "android",
    "mac",
    "pc",
    "blog",
];

// Canonical informational and legal pages (indexed in primary English version)
const EN_ONLY_PAGES = [
    "about",
    "contact",
    "disclaimer",
    "dmca",
    "privacy",
    "terms",
    "editorial-policy",
];

const escapeXml = (value: string) => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const toUrl = (pathname: string) => new URL(pathname || "/", SITE_ORIGIN).href;

interface AlternateLink {
    hreflang: string;
    href: string;
}

interface SitemapItem {
    loc: string;
    lastmod: string;
    alternates?: AlternateLink[];
}

export async function createSitemapXml() {
    const items: SitemapItem[] = [];

    // 1. Core pages across all 30 languages (10 * 30 = 300 URLs) with bidirectional xhtml:link alternates
    for (const slug of CORE_PAGES) {
        const xDefaultUrl = toUrl(slug ? `/${slug}` : "/");

        const alternates: AlternateLink[] = [
            { hreflang: "x-default", href: xDefaultUrl },
            ...langCodes.map((code) => ({
                hreflang: code,
                href: code === defaultLang
                    ? xDefaultUrl
                    : toUrl(slug ? `/${code}/${slug}` : `/${code}`),
            })),
        ];

        // Root English entry
        items.push({
            loc: xDefaultUrl,
            lastmod: STATIC_RELEASE_DATE,
            alternates,
        });

        // 29 Localized entries
        for (const lang of langCodes) {
            if (lang === defaultLang) continue;
            const localizedPath = slug ? `/${lang}/${slug}` : `/${lang}`;
            items.push({
                loc: toUrl(localizedPath),
                lastmod: STATIC_RELEASE_DATE,
                alternates,
            });
        }
    }

    // 2. English-only canonical trust & legal pages (7 URLs)
    for (const slug of EN_ONLY_PAGES) {
        const url = toUrl(`/${slug}`);
        items.push({
            loc: url,
            lastmod: STATIC_RELEASE_DATE,
        });
    }

    // 3. Blog articles
    const posts = await getCollection("blog");
    for (const post of posts) {
        const rawLang = (post.data.lang ? String(post.data.lang) : "").trim() || defaultLang;
        const lang = rawLang in languages ? rawLang : defaultLang;
        const isEn = lang === defaultLang;
        const pathname = isEn
            ? `/blog/${post.slug}`
            : `/${lang}/blog/${post.slug}`;
        const url = toUrl(pathname);

        const lastmod = post.data.pubDate instanceof Date && !isNaN(post.data.pubDate.getTime())
            ? post.data.pubDate.toISOString().slice(0, 10)
            : STATIC_RELEASE_DATE;

        items.push({
            loc: url,
            lastmod,
        });
    }

    // Sort entries deterministically by URL
    items.sort((a, b) => a.loc.localeCompare(b.loc));

    const xmlEntries = items.map((item) => {
        const altXml = item.alternates
            ? "\n" + item.alternates.map((alt) =>
                `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(alt.href)}" />`
            ).join("\n")
            : "";

        return `  <url>\n    <loc>${escapeXml(item.loc)}</loc>\n    <lastmod>${item.lastmod}</lastmod>${altXml}\n  </url>`;
    }).join("\n");

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
