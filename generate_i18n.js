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

    // A. Update Text (data-i18n)
    $('[data-i18n]').each((i, el) => {
        const attrRaw = $(el).attr('data-i18n');
        let targetAttr = null;
        let key = attrRaw;

        // Handle [attr]key syntax
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
                $(el).text(val);
                // If text is HTML safe? Cheerio escapes by default.
                // If bold needed, use .html() - typically text is safer.
            }
        }
        $(el).removeAttr('data-i18n');
    });

    // B. Update <html lang/dir>
    $('html').attr('lang', langCode);
    const dir = RTL_LANGUAGES.includes(langCode) ? 'rtl' : 'ltr';
    $('html').attr('dir', dir);

    // C. Update Title
    const metaTitle = getNestedValue(translations, 'meta.title');
    if (metaTitle) $('title').text(metaTitle);

    // D. Update Description
    const metaDesc = getNestedValue(translations, 'meta.description');
    if (metaDesc) $('meta[name="description"]').attr('content', metaDesc);

    // E. Canonical URL
    let canonicalPath;
    if (filename === 'index.html') {
        canonicalPath = `/${langCode}/`;
    } else if (filename.endsWith('/index.html')) {
        const folder = filename.replace('/index.html', '');
        canonicalPath = `/${langCode}/${folder}/`;
    } else {
        canonicalPath = `/${langCode}/${filename}`;
    }
    const fullCanonical = `${BASE_URL}${canonicalPath}`;

    // Remove existing canonical
    $('link[rel="canonical"]').remove();
    // Add new
    $('head').append(`<link rel="canonical" href="${fullCanonical}">\n    `);

    // F. Inject Hreflang (Dynamic)
    $('link[rel="alternate"][hreflang]').remove(); // Cleanup

    // Prepare Hreflang Tags
    let suffix = '';
    if (filename === 'index.html') suffix = '';
    else if (filename.endsWith('/index.html')) suffix = filename.replace('/index.html', '') + '/';
    else suffix = filename;

    // x-default
    $('head').append(`<link rel="alternate" hreflang="x-default" href="${BASE_URL}/${suffix}">\n    `);

    // All languages
    LANGUAGE_CODES.sort().forEach(code => {
        $('head').append(`<link rel="alternate" hreflang="${code}" href="${BASE_URL}/${code}/${suffix}">\n    `);
    });

    // G. Inject Manifest
    // Remove if exists
    $('link[rel="manifest"]').remove();
    $('head').append(`<link rel="manifest" href="/manifest.json">\n    `);

    // H. Inject Locale Script
    $('head').append(`<script>localStorage.setItem('i18nextLng', '${langCode}');</script>\n    `);

    return $.html();
}

// 4. Generate Sitemap
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

// ==================== MAIN EXECUTION ====================

async function main() {
    console.log('🔄 Starting Node.js Generator...');

    const sourceFiles = scanFiles(__dirname);
    console.log(`Found ${sourceFiles.length} source HTML files.`);

    const allUrls = [];

    // Add Root URLs (English)
    sourceFiles.forEach(file => {
        let url;
        if (file.relPath === 'index.html') url = `${BASE_URL}/`;
        else if (file.relPath.endsWith('/index.html')) url = `${BASE_URL}/${path.dirname(file.relPath)}/`;
        else url = `${BASE_URL}/${file.relPath}`;
        allUrls.push(url);
    });

    // Process Languages
    LANGUAGE_CODES.forEach(langCode => {
        console.log(`\n📁 Processing ${langCode}...`);
        const translations = loadJson(path.join(LOCALES_DIR, `${langCode}.json`));
        if (!translations) {
            console.error(`Missing translations for ${langCode}`);
            return;
        }

        const langDir = path.join(__dirname, langCode);
        if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });

        sourceFiles.forEach(file => {
            const html = fs.readFileSync(file.absPath, 'utf8');
            const processed = processHtml(html, translations, langCode, file.relPath);

            // Output path
            const outFileRel = file.relPath;
            const outFileAbs = path.join(langDir, outFileRel);

            // Ensure dir exists
            const outDir = path.dirname(outFileAbs);
            if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

            fs.writeFileSync(outFileAbs, processed, 'utf8');

            // Add to Sitemap
            let sitemapUrl;
            if (outFileRel === 'index.html') sitemapUrl = `${BASE_URL}/${langCode}/`;
            else if (outFileRel.endsWith('/index.html')) sitemapUrl = `${BASE_URL}/${langCode}/${path.dirname(outFileRel)}/`;
            else sitemapUrl = `${BASE_URL}/${langCode}/${outFileRel}`;
            allUrls.push(sitemapUrl);
        });
    });

    // scan MP3/Story for Sitemap inclusion (Pre-generated)
    console.log('\n🔍 Scanning for pre-generated pages (mp3, story)...');
    ['mp3', 'story'].forEach(dir => {
        const fullDir = path.join(__dirname, dir);
        if (fs.existsSync(fullDir)) {
            const scan = (d) => {
                const listing = fs.readdirSync(d);
                listing.forEach(f => {
                    const fp = path.join(d, f);
                    if (fs.statSync(fp).isDirectory()) {
                        scan(fp);
                    } else if (f === 'index.html') {
                        // Correct path calculation
                        const relative = path.relative(__dirname, fp).replace(/\\/g, '/');
                        // remove index.html
                        const urlSuffix = relative.replace('index.html', '');
                        const url = `${BASE_URL}/${urlSuffix}`;
                        if (!allUrls.includes(url)) allUrls.push(url);
                    }
                });
            };
            scan(fullDir);
        }
    });

    // Write Sitemap
    console.log(`\n🗺️ Generating sitemap.xml with ${allUrls.length} URLs...`);
    fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), generateSitemap(allUrls.sort()), 'utf8');

    console.log('✅ Done!');
}

main().catch(err => console.error(err));
