import { getCollection } from "astro:content";
import { defaultLang, languages } from "../i18n/ui";

const SITE_ORIGIN = "https://savetik-fast.xyz";
const langCodes = Object.keys(languages);

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

export async function createSitemapXml() {
    const urls = new Set<string>();

    // 1. Core pages across all 30 languages (10 * 30 = 300 URLs)
    for (const slug of CORE_PAGES) {
        urls.add(toUrl(slug ? `/${slug}` : "/"));

        for (const lang of langCodes) {
            if (lang === defaultLang) continue;
            const localizedPath = slug ? `/${lang}/${slug}` : `/${lang}`;
            urls.add(toUrl(localizedPath));
        }
    }

    // 2. English-only canonical trust & legal pages (7 URLs)
    for (const slug of EN_ONLY_PAGES) {
        urls.add(toUrl(`/${slug}`));
    }

    // 3. Blog articles (41 URLs)
    const posts = await getCollection("blog");
    for (const post of posts) {
        const rawLang = (post.data.lang ? String(post.data.lang) : "").trim() || defaultLang;
        const lang = rawLang in languages ? rawLang : defaultLang;
        const isEn = lang === defaultLang;
        const pathname = isEn
            ? `/blog/${post.slug}`
            : `/${lang}/blog/${post.slug}`;
        urls.add(toUrl(pathname));
    }

    const sortedUrls = Array.from(urls).sort((a, b) => a.localeCompare(b));

    const xmlEntries = sortedUrls
        .map((loc) => `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`)
        .join("\n");

    return (
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        `${xmlEntries}\n` +
        `</urlset>\n`
    );
}

export async function sitemapResponse() {
    return new Response(await createSitemapXml(), {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
            "X-Robots-Tag": "all",
        },
    });
}
