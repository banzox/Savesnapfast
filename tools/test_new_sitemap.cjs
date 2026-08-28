const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Load languages
const uiTs = fs.readFileSync('./src/i18n/ui.ts', 'utf8');
const languages = {
  "en": "English",
  "ar": "العربية",
  "es": "Español",
  "pt": "Português",
  "id": "Bahasa Indonesia",
  "fr": "Français",
  "de": "Deutsch",
  "it": "Italiano",
  "tr": "Türkçe",
  "ru": "Русский",
  "vi": "Tiếng Việt",
  "th": "ไทย",
  "ja": "日本語",
  "ko": "한국어",
  "pl": "Polski",
  "nl": "Nederlands",
  "ro": "Română",
  "ms": "Bahasa Melayu",
  "fil": "Filipino",
  "uk": "Українська",
  "cs": "Čeština",
  "sv": "Svenska",
  "hu": "Magyar",
  "el": "Ελληνικά",
  "da": "Dansk",
  "fi": "Suomi",
  "no": "Norsk",
  "bg": "Български",
  "zh": "中文",
  "hi": "हिन्दी"
};
const defaultLang = 'en';
const langCodes = Object.keys(languages);

const SITE_ORIGIN = "https://savetik-fast.xyz";

// All 16 standard content routes
const CORE_SLUGS = [
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
  "pc"
];

// English-only routes
const EN_ONLY_SLUGS = [
  "editorial-policy"
];

// Get all blog posts from content/blog
const blogDir = './src/content/blog';
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
const blogPosts = blogFiles.map(f => {
  const content = fs.readFileSync(path.join(blogDir, f), 'utf8');
  const langMatch = content.match(/lang:\s*["']?([^\r\n"']+)/);
  const pubDateMatch = content.match(/pubDate:\s*["']?([^\r\n"']+)/);
  const lang = langMatch ? langMatch[1].trim() : 'en';
  const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '2026-08-28';
  const slug = f.replace(/\.md$/, '');
  return { file: f, slug, lang, pubDate };
});

const escapeXml = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const toUrl = (pathname) => new URL(pathname || "/", SITE_ORIGIN).href;

const todayStr = '2026-08-28';

// Build sitemap entries
const sitemapEntries = [];

// 1. Core pages (all 30 languages)
for (const slug of CORE_SLUGS) {
  // Build hreflang links for this slug across all 30 languages + x-default
  const xDefaultUrl = toUrl(slug ? `/${slug}` : "/");
  const alternates = [
    `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(xDefaultUrl)}"/>`,
    ...langCodes.map(l => {
      const p = l === defaultLang 
        ? (slug ? `/${slug}` : "/")
        : (slug ? `/${l}/${slug}` : `/${l}`);
      return `<xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(toUrl(p))}"/>`;
    })
  ].join("");

  // Root EN URL
  const enUrl = toUrl(slug ? `/${slug}` : "/");
  sitemapEntries.push({
    loc: enUrl,
    lastmod: todayStr,
    alternates
  });

  // Localized URLs for the other 29 languages
  for (const lang of langCodes) {
    if (lang === defaultLang) continue;
    const localizedPath = slug ? `/${lang}/${slug}` : `/${lang}`;
    const localizedUrl = toUrl(localizedPath);
    sitemapEntries.push({
      loc: localizedUrl,
      lastmod: todayStr,
      alternates
    });
  }
}

// 2. English-only pages
for (const slug of EN_ONLY_SLUGS) {
  const enUrl = toUrl(`/${slug}`);
  sitemapEntries.push({
    loc: enUrl,
    lastmod: todayStr,
    alternates: `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(enUrl)}"/>`
  });
}

// 3. Blog posts
// Group multi-language blog posts if any (e.g. best-time-to-post-on-tiktok-2026)
for (const post of blogPosts) {
  const isEn = post.lang === defaultLang;
  const pathname = isEn ? `/blog/${post.slug}` : `/${post.lang}/blog/${post.slug}`;
  const url = toUrl(pathname);
  
  // If it's the 30-lang post "best-time-to-post-on-tiktok-2026", provide hreflangs
  let alternates = '';
  if (post.slug.startsWith('best-time-to-post-on-tiktok-2026')) {
    const enPostUrl = toUrl('/blog/best-time-to-post-on-tiktok-2026');
    const links = [
      `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(enPostUrl)}"/>`,
      ...langCodes.map(l => {
        const p = l === defaultLang
          ? '/blog/best-time-to-post-on-tiktok-2026'
          : `/${l}/blog/best-time-to-post-on-tiktok-2026-${l}`;
        return `<xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(toUrl(p))}"/>`;
      })
    ];
    alternates = links.join("");
  } else if (post.slug.startsWith('how-to-download-tiktok')) {
    const enUrl = toUrl('/blog/how-to-download-tiktok-iphone');
    const arUrl = toUrl('/ar/blog/how-to-download-tiktok-ar');
    alternates = [
      `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(enUrl)}"/>`,
      `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}"/>`,
      `<xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(arUrl)}"/>`
    ].join("");
  } else {
    alternates = `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(url)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(url)}"/>`;
  }

  sitemapEntries.push({
    loc: url,
    lastmod: post.pubDate,
    alternates
  });
}

// Sort alphabetically
sitemapEntries.sort((a, b) => a.loc.localeCompare(b.loc));

console.log('Total Generated Sitemap URLs:', sitemapEntries.length);

const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  sitemapEntries.map(e => `  <url>\n    <loc>${escapeXml(e.loc)}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    ${e.alternates}\n  </url>`).join('\n') +
  `\n</urlset>`;

console.log('Total XML characters:', xmlContent.length);
console.log('Sample entry:\n', xmlContent.slice(0, 1500));
