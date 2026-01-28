const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Configuration
const BASE_URL = 'https://savetik-fast.xyz';
const LOCALES_DIR = path.join(__dirname, 'locales');
const RTL_LANGUAGES = ['ar', 'he'];
const EXCLUDED_DIRS = ['node_modules', 'locales', 'js', 'css', '.git', '.github', 'mp3', 'story', '__pycache__'];
const EXCLUDED_FILES = ['404.html'];

// Helper: Load JSON
function loadJson(filepath) {
    if (!fs.existsSync(filepath)) return null;
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

// Helper: Get Nested Value
function getNestedValue(obj, keyPath) {
    return keyPath.split('.').reduce((prev, curr) => prev && prev[curr], obj);
}

// 1. Get Language Codes
function getLanguageCodes() {
    return fs.readdirSync(LOCALES_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''));
}

const LANGUAGE_CODES = getLanguageCodes();
const ALL_EXCLUDED_DIRS = new Set([...EXCLUDED_DIRS, ...LANGUAGE_CODES]);

// 2. Discover Source HTML Files (Root only + Subdirs like tools/)
function scanFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        const relPath = path.relative(__dirname, filePath).replace(/\\/g, '/');

        if (stat.isDirectory()) {
            if (!ALL_EXCLUDED_DIRS.has(file)) {
                scanFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html') && !EXCLUDED_FILES.includes(file)) {
            fileList.push({
                relPath: relPath,
                absPath: filePath
            });
        }
    });
    return fileList;
}

// 3. Process HTML Logic
function processHtml(html, translations, langCode, filename) {
    const $ = cheerio.load(html);

    // Calculate Relative Prefix
    let depth = 0;
    if (filename !== 'index.html') {
        const parts = filename.split('/');
        depth = parts.length - 1; // index.html is root (0)
        if (filename.endsWith('/index.html')) {
            // e.g. tools/index.html -> depth 1
            // parts = ['tools', 'index.html'] -> length 2 -> depth 1. Correct.
        } else {
            // e.g. about.html -> length 1 -> depth 0. Correct.
            // Wait. parts=['about.html']. length=1. depth=0. Correct.
            // about.html is in root.
        }
    }
    // If we are outputting to /ar/about.html (Source: about.html)
    // The output file is at depth 1 (ar).
    // The SOURCE file depth calculation above is for source structure.
    // BUT the output structure puts EVERYTHING inside /langCode/ folder.
    // So /langCode/about.html -> depth 1. prefix = '../'

    // Logic:
    // Source: index.html -> Out: /ar/index.html. Depth 1. Prefix '../'
    // Source: tools/index.html -> Out: /ar/tools/index.html. Depth 2. Prefix '../../'

    // We need to calculate depth of OUTPUT file relative to Root.
    // Output path is langCode/filename.
    // e.g. ar/index.html
    const outputPath = `${langCode}/${filename}`;
    const outputParts = outputPath.split('/');
    const outputDepth = outputParts.length - 1;

    const relPrefix = '../'.repeat(outputDepth);

    // A. Update Text (data-i18n)
    $('[data-i18n]').each((i, el) => {
        const attrRaw = $(el).attr('data-i18n');
        let targetAttr = null;
        let key = attrRaw;

        const match = attrRaw.match(/^\[([^\]]+)\](.+)$/);
        if (match) {
            targetAttr = match[1];
            key = match[2];
        }

        const val = getNestedValue(translations, key);
        if (val) {
            if (targetAttr) {
                $(el).attr(targetAttr, val);
            } else {
                // Use .html() to preserve nested tags like spans (e.g. in hero.title)
                $(el).html(val);
            }
        }
        // DO NOT REMOVE data-i18n. This allows client-side i18next to 
        // handle dynamic updates or missing keys on page load.
        // $(el).removeAttr('data-i18n');
    });

    // B. Update <html lang/dir>
    $('html').attr('lang', langCode);
    const dir = RTL_LANGUAGES.includes(langCode) ? 'rtl' : 'ltr';
    $('html').attr('dir', dir);

    // C. Update Meta
    const metaTitle = getNestedValue(translations, 'meta.title');
    if (metaTitle) $('title').text(metaTitle);

    const metaDesc = getNestedValue(translations, 'meta.description');
    if (metaDesc) $('meta[name="description"]').attr('content', metaDesc);

    // D. Canonical and Hreflang (ABSOLUTE URLS for SEO)
    let canonicalSuffix;
    if (filename === 'index.html') canonicalSuffix = '';
    else if (filename.endsWith('/index.html')) canonicalSuffix = filename.replace('/index.html', '') + '/';
    else canonicalSuffix = filename;

    const fullCanonical = `${BASE_URL}/${langCode}/${canonicalSuffix}`;
    $('link[rel="canonical"]').remove();
    $('head').append(`<link rel="canonical" href="${fullCanonical}">\n    `);

    // Hreflang
    $('link[rel="alternate"][hreflang]').remove();
    $('head').append(`<link rel="alternate" hreflang="x-default" href="${BASE_URL}/${canonicalSuffix}">\n    `);
    LANGUAGE_CODES.sort().forEach(code => {
        $('head').append(`<link rel="alternate" hreflang="${code}" href="${BASE_URL}/${code}/${canonicalSuffix}">\n    `);
    });

    // E. Relative Assets Injection
    // Fix existing /style.css -> ../style.css
    $('link[rel="stylesheet"]').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.startsWith('/')) {
            $(el).attr('href', href.replace(/^\//, relPrefix));
        }
    });

    $('script[src]').each((i, el) => {
        const src = $(el).attr('src');
        if (src && src.startsWith('/')) {
            $(el).attr('src', src.replace(/^\//, relPrefix));
        }
    });

    $('link[rel="icon"]').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.startsWith('/')) {
            $(el).attr('href', href.replace(/^\//, relPrefix));
        }
    });

    // Manifest
    $('link[rel="manifest"]').remove();
    $('head').append(`<link rel="manifest" href="${relPrefix}manifest.json">\n    `);

    // Locale Script
    $('head').append(`<script>localStorage.setItem('i18nextLng', '${langCode}');</script>\n    `);

    return $.html();
}

// 4. Generate Sitemap (remains mostly same)
function generateSitemap(urls) {
    const header = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    const footer = `\n</urlset>`;
    const body = urls.map(url => {
        let priority = '0.8';
        if (url === `${BASE_URL}/` || url.endsWith('/')) priority = '1.0';
        else if (url.includes('/tools/')) priority = '0.9';
        return `\n  <url>\n    <loc>${url}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    }).join('');
    return header + body + footer;
}

// Main
async function main() {
    console.log('🔄 Starting Node.js Generator (Relative Paths)...');
    const sourceFiles = scanFiles(__dirname);
    const allUrls = [];

    // Add Root URLs
    sourceFiles.forEach(file => {
        let url;
        if (file.relPath === 'index.html') url = `${BASE_URL}/`;
        else if (file.relPath.endsWith('/index.html')) url = `${BASE_URL}/${path.dirname(file.relPath)}/`;
        else url = `${BASE_URL}/${file.relPath}`;
        allUrls.push(url);
    });

    // Process Languages
    LANGUAGE_CODES.forEach(langCode => {
        process.stdout.write(`Processing ${langCode}... `);
        const translations = loadJson(path.join(LOCALES_DIR, `${langCode}.json`));
        if (!translations) return;

        const langDir = path.join(__dirname, langCode);
        if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });

        sourceFiles.forEach(file => {
            const html = fs.readFileSync(file.absPath, 'utf8');
            const processed = processHtml(html, translations, langCode, file.relPath);

            const outFileAbs = path.join(langDir, file.relPath);
            const outDir = path.dirname(outFileAbs);
            if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
            fs.writeFileSync(outFileAbs, processed, 'utf8');

            let sitemapUrl;
            if (file.relPath === 'index.html') sitemapUrl = `${BASE_URL}/${langCode}/`;
            else if (file.relPath.endsWith('/index.html')) sitemapUrl = `${BASE_URL}/${langCode}/${path.dirname(file.relPath)}/`;
            else sitemapUrl = `${BASE_URL}/${langCode}/${file.relPath}`;
            allUrls.push(sitemapUrl);
        });
    });

    // Scan MP3/Story
    console.log('\nScanning MP3/Story...');
    ['mp3', 'story'].forEach(dir => {
        const fullDir = path.join(__dirname, dir);
        if (fs.existsSync(fullDir)) {
            const scan = (d) => {
                const listing = fs.readdirSync(d);
                listing.forEach(f => {
                    const fp = path.join(d, f);
                    if (fs.statSync(fp).isDirectory()) scan(fp);
                    else if (f === 'index.html') {
                        const relative = path.relative(__dirname, fp).replace(/\\/g, '/');
                        const urlSuffix = relative.replace('index.html', '');
                        const url = `${BASE_URL}/${urlSuffix}`;
                        if (!allUrls.includes(url)) allUrls.push(url);
                    }
                });
            };
            scan(fullDir);
        }
    });

    fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), generateSitemap(allUrls.sort()), 'utf8');
    console.log('✅ Done!');
}

main();
