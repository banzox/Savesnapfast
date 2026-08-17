import { getCollection } from "astro:content";
import { defaultLang, languages } from "../i18n/ui";

const SITE_ORIGIN = "https://savetik-fast.xyz";

// Sitemap entries are a crawl-priority signal, not a complete catalogue of
// every route we serve. Keep it focused on pages with independent search
// intent. Support, legal, device and utility routes remain accessible and
// indexable when appropriate, but are deliberately not submitted in every
// language variant.
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

const escapeXml = (value: string) => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const toUrl = (pathname: string) => new URL(pathname || "/", SITE_ORIGIN).href;

export async function createSitemapXml() {
    const pages = new Map<string, string | undefined>();

    for (const slug of ROOT_PAGES) {
        pages.set(toUrl(slug ? `/${slug}` : "/"), undefined);
    }

    for (const lang of Object.keys(languages)) {
        if (lang === defaultLang) continue;

        for (const slug of LOCALIZED_PAGES) {
            const pathname = slug ? `/${lang}/${slug}` : `/${lang}`;
            pages.set(toUrl(pathname), undefined);
        }
    }

    const posts = await getCollection("blog");
    for (const post of posts) {
        const lang = post.data.lang || defaultLang;
        const pathname = lang === defaultLang
            ? `/blog/${post.slug}`
            : `/${lang}/blog/${post.slug}`;
        const lastmod = post.data.pubDate instanceof Date
            ? post.data.pubDate.toISOString().slice(0, 10)
            : undefined;
        pages.set(toUrl(pathname), lastmod);
    }

    const entries = [...pages.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([url, lastmod]) => {
            const modified = lastmod ? `<lastmod>${lastmod}</lastmod>` : "";
            return `<url><loc>${escapeXml(url)}</loc>${modified}</url>`;
        })
        .join("");

    return `<?xml version="1.0" encoding="UTF-8"?>` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;
}

export async function sitemapResponse() {
    return new Response(await createSitemapXml(), {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
    });
}
