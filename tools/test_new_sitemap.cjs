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
  // Root EN URL
  const enUrl = toUrl(slug ? `/${slug}` : "/");
  sitemapEntries.push({
    loc: enUrl,
    lastmod: todayStr,
  });

  // Localized URLs for the other 29 languages
  for (const lang of langCodes) {
    if (lang === defaultLang) continue;
    const localizedPath = slug ? `/${lang}/${slug}` : `/${lang}`;
    const localizedUrl = toUrl(localizedPath);
    sitemapEntries.push({
      loc: localizedUrl,
      lastmod: todayStr,
    });
  }
}

// 2. English-only pages
for (const slug of EN_ONLY_SLUGS) {
  const enUrl = toUrl(`/${slug}`);
  sitemapEntries.push({
    loc: enUrl,
    lastmod: todayStr,
  });
}

// 3. Blog posts
for (const post of blogPosts) {
  const isEn = post.lang === defaultLang;
  const pathname = isEn ? `/blog/${post.slug}` : `/${post.lang}/blog/${post.slug}`;
  const url = toUrl(pathname);

  sitemapEntries.push({
    loc: url,
    lastmod: post.pubDate,
  });
}

// Sort alphabetically
sitemapEntries.sort((a, b) => a.loc.localeCompare(b.loc));

console.log('Total Generated Sitemap URLs:', sitemapEntries.length);

const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sitemapEntries.map(e => `  <url>\n    <loc>${escapeXml(e.loc)}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n  </url>`).join('\n') +
  `\n</urlset>`;

console.log('Total XML characters:', xmlContent.length);
console.log('Sample entry:\n', xmlContent.slice(0, 1500));
