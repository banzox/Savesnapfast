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
}

export async function createSitemapXml() {
    const today = new Date().toISOString().slice(0, 10);
    const items: SitemapItem[] = [];

    // 1. Core pages across all 30 languages (16 * 30 = 480 URLs)
    for (const slug of CORE_PAGES) {
        const xDefaultUrl = toUrl(slug ? `/${slug}` : "/");

        // Root English entry
        items.push({
            loc: xDefaultUrl,
            lastmod: today,
        });

        // 29 Localized entries
        for (const lang of langCodes) {
            if (lang === defaultLang) continue;
            const localizedPath = slug ? `/${lang}/${slug}` : `/${lang}`;
            items.push({
                loc: toUrl(localizedPath),
                lastmod: today,
            });
        }
    }

    // 2. English-only pages (1 URL)
    for (const slug of EN_ONLY_PAGES) {
        const url = toUrl(`/${slug}`);
        items.push({
            loc: url,
            lastmod: today,
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

        items.push({
            loc: url,
            lastmod,
        });
    }

    // Sort entries deterministically by URL
    items.sort((a, b) => a.loc.localeCompare(b.loc));

    const xmlEntries = items.map((item) =>
        `  <url>\n    <loc>${escapeXml(item.loc)}</loc>\n    <lastmod>${item.lastmod}</lastmod>\n  </url>`
    ).join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
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


