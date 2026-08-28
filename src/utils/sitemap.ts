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

    // 1. Core pages across all 30 languages (16 * 30 = 480 URLs)
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

    // 2. English-only pages (1 URL)
    for (const slug of EN_ONLY_PAGES) {
        const url = toUrl(`/${slug}`);
        items.push({
            loc: url,
            lastmod: today,
            alternates: `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(url)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(url)}"/>`,
        });
    }

    // 3. Blog articles (39 URLs)
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

    // Sort entries deterministically by URL
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

