const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const distDir = path.resolve(__dirname, '../../dist');
const blogContentDir = path.resolve(__dirname, '../../src/content/blog');
const locales = ['en', 'ar', 'es', 'pt', 'id', 'fr', 'de', 'it', 'tr', 'ru', 'vi', 'th', 'ja', 'ko', 'pl', 'nl', 'ro', 'ms', 'fil', 'uk', 'cs', 'sv', 'hu', 'el', 'da', 'fi', 'no', 'bg', 'zh', 'hi'];
const legalSlugs = ['about', 'privacy', 'terms', 'disclaimer', 'dmca', 'contact'];
const deviceSlugs = ['ios', 'android', 'mac', 'pc'];

console.log('Starting comprehensive SEO, Sitemap, and Redirect Verification...\n');

// Help function: find all files recursively
function getFiles(dir, ext = '.html') {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(filePath, ext));
        } else if (file.endsWith(ext)) {
            // Exclude admin dashboard and ad frame helpers
            const relativeToDist = path.relative(distDir, filePath).replace(/\\/g, '/');
            if (relativeToDist === 'ad-native.html' || relativeToDist.startsWith('admin/')) {
                return;
            }
            results.push(filePath);
        }
    });
    return results;
}

// ----------------------------------------------------
// TIER 1 & 3: HTML Pages Verification
// ----------------------------------------------------
console.log('--- Tier 1 & 3: Verifying HTML Pages ---');
const htmlFiles = getFiles(distDir, '.html');
console.log(`Found ${htmlFiles.length} HTML files.`);

let htmlErrors = 0;
let checkedCount = 0;

htmlFiles.forEach(filePath => {
    const relativePath = path.relative(distDir, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content);
    checkedCount++;

    // 1. Check Canonical
    const canonicalLink = $('link[rel="canonical"]');
    if (canonicalLink.length === 0) {
        console.error(`[ERROR] Missing canonical link in: ${relativePath}`);
        htmlErrors++;
        return;
    }
    if (canonicalLink.length > 1) {
        console.error(`[ERROR] Multiple canonical links in: ${relativePath}`);
        htmlErrors++;
    }

    const canonicalHref = canonicalLink.attr('href');
    if (!canonicalHref.startsWith('https://savetik-fast.xyz')) {
        console.error(`[ERROR] Canonical URL must start with site origin in: ${relativePath} (found: ${canonicalHref})`);
        htmlErrors++;
    }

    // Trailing slash verification (canonical must NOT end with / unless it is the home page)
    if (canonicalHref !== 'https://savetik-fast.xyz/' && canonicalHref.endsWith('/')) {
        console.error(`[ERROR] Canonical URL has trailing slash: ${relativePath} (found: ${canonicalHref})`);
        htmlErrors++;
    }

    // Determine path properties for validation
    // Path segments: e.g. "ar/about.html" -> ["ar", "about"]
    const pageSlug = relativePath.replace(/\.html$/, '');
    const segments = pageSlug.split('/').filter(Boolean);
    
    let isLangPrefix = false;
    let pageLocale = 'en';
    let baseSlug = pageSlug;

    if (segments.length > 0 && locales.includes(segments[0])) {
        isLangPrefix = true;
        pageLocale = segments[0];
        baseSlug = segments.slice(1).join('/');
    }

    const isLegalPage = legalSlugs.includes(baseSlug);
    const isDevicePage = deviceSlugs.includes(segments[segments.length - 1]);
    const isBlogPost = baseSlug.startsWith('blog/') && baseSlug !== 'blog';

    // 2. Validate translated legal page rules
    if (isLangPrefix && isLegalPage) {
        // Canonical must point to English version
        const expectedCanonical = `https://savetik-fast.xyz/${baseSlug}`;
        if (canonicalHref !== expectedCanonical) {
            console.error(`[ERROR] Translated legal page canonical mismatch in: ${relativePath}\n  Expected: ${expectedCanonical}\n  Found:    ${canonicalHref}`);
            htmlErrors++;
        }
        
        // Hreflang alternate tags must be omitted
        const hreflangTags = $('link[rel="alternate"][hreflang]');
        if (hreflangTags.length > 0) {
            console.error(`[ERROR] Translated legal page should NOT have hreflang tags: ${relativePath} (found ${hreflangTags.length} tags)`);
            htmlErrors++;
        }

        // Robots tag must contain noindex
        const robotsMeta = $('meta[name="robots"]').attr('content') || '';
        if (!robotsMeta.includes('noindex')) {
            console.error(`[ERROR] Translated legal page is missing noindex in robots meta: ${relativePath} (found: ${robotsMeta})`);
            htmlErrors++;
        }
    } 
    // 3. Validate device page rules
    else if (isDevicePage) {
        // Hreflang alternate tags must be omitted
        const hreflangTags = $('link[rel="alternate"][hreflang]');
        if (hreflangTags.length > 0) {
            console.error(`[ERROR] Device page should NOT have hreflang tags: ${relativePath} (found ${hreflangTags.length} tags)`);
            htmlErrors++;
        }

        // Robots tag must contain noindex
        const robotsMeta = $('meta[name="robots"]').attr('content') || '';
        if (!robotsMeta.includes('noindex')) {
            console.error(`[ERROR] Device page is missing noindex in robots meta: ${relativePath} (found: ${robotsMeta})`);
            htmlErrors++;
        }
    } 
    // 4. Validate normal indexable page rules (non-legal, non-device)
    else {
        // Must have hreflang alternate tags (including x-default, en, and others)
        const hreflangTags = $('link[rel="alternate"][hreflang]');
        if (hreflangTags.length === 0) {
            console.error(`[ERROR] Missing hreflang tags in: ${relativePath}`);
            htmlErrors++;
        } else {
            // Verify x-default
            const xDefault = $('link[rel="alternate"][hreflang="x-default"]').attr('href');
            if (!xDefault) {
                console.error(`[ERROR] Missing hreflang x-default in: ${relativePath}`);
                htmlErrors++;
            } else {
                let expectedXDefault;
                if (isBlogPost) {
                    expectedXDefault = (pageLocale === 'en')
                        ? `https://savetik-fast.xyz/${baseSlug}`
                        : `https://savetik-fast.xyz/blog`; // translated blogs fallback to English blog index
                } else if (baseSlug === '' || baseSlug === 'index') {
                    expectedXDefault = `https://savetik-fast.xyz/`;
                } else {
                    expectedXDefault = `https://savetik-fast.xyz/${baseSlug}`;
                    if (expectedXDefault.endsWith('/')) expectedXDefault = expectedXDefault.slice(0, -1);
                }
                
                if (xDefault !== expectedXDefault) {
                    console.error(`[ERROR] x-default mismatch in: ${relativePath}\n  Expected: ${expectedXDefault}\n  Found:    ${xDefault}`);
                    htmlErrors++;
                }
            }

            // Verify self-referencing and alternates
            const hreflangList = {};
            hreflangTags.each((_, el) => {
                const lang = $(el).attr('hreflang');
                const href = $(el).attr('href');
                hreflangList[lang] = href;
                
                if (href.endsWith('/') && href !== 'https://savetik-fast.xyz/') {
                    console.error(`[ERROR] Alternate hreflang has trailing slash: ${relativePath} (hreflang="${lang}" href="${href}")`);
                    htmlErrors++;
                }
            });

            // Self-referencing check
            // Note: Google's Tagalog/Filipino language code for hreflang is 'tl' in this setup.
            const selfHreflangCode = pageLocale === 'fil' ? 'tl' : pageLocale;
            const selfHreflangUrl = hreflangList[selfHreflangCode];

            let expectedSelfUrl = canonicalHref;
            if (selfHreflangUrl !== expectedSelfUrl) {
                console.error(`[ERROR] Self-referencing hreflang mismatch in: ${relativePath}\n  Expected: ${expectedSelfUrl}\n  Found:    ${selfHreflangUrl} (hreflang="${selfHreflangCode}")`);
                htmlErrors++;
            }
        }
    }
});

console.log(`HTML verification completed: ${checkedCount} pages checked. Errors found: ${htmlErrors}\n`);

// ----------------------------------------------------
// TIER 2: Sitemap Verification
// ----------------------------------------------------
console.log('--- Tier 2: Verifying Sitemap ---');
const sitemap0Path = path.join(distDir, 'sitemap-0.xml');
let sitemapErrors = 0;

if (!fs.existsSync(sitemap0Path)) {
    console.error('[ERROR] sitemap-0.xml does not exist in build output directory!');
    sitemapErrors++;
} else {
    const sitemapContent = fs.readFileSync(sitemap0Path, 'utf8');
    const $ = cheerio.load(sitemapContent, { xmlMode: true });
    const urls = [];
    
    $('loc').each((_, el) => {
        urls.push($(el).text().trim());
    });

    console.log(`Parsed ${urls.length} URLs from sitemap-0.xml.`);

    // Check sitemap URLs
    urls.forEach(url => {
        if (!url.startsWith('https://savetik-fast.xyz')) {
            console.error(`[ERROR] Sitemap URL does not start with origin: ${url}`);
            sitemapErrors++;
        }
        if (url !== 'https://savetik-fast.xyz/' && url.endsWith('/')) {
            console.error(`[ERROR] Sitemap URL has trailing slash: ${url}`);
            sitemapErrors++;
        }
    });

    // Dynamically calculate blog post counts by language to verify thin content exclusion
    const postCounts = {};
    locales.forEach(l => postCounts[l] = 0);

    if (fs.existsSync(blogContentDir)) {
        const files = fs.readdirSync(blogContentDir);
        files.forEach(file => {
            if (!file.endsWith('.md')) return;
            const nameWithoutExt = path.parse(file).name;
            let matchedLocale = 'en';
            for (const locale of locales) {
                if (locale === 'en') continue;
                if (nameWithoutExt.endsWith('-' + locale)) {
                    matchedLocale = locale;
                    break;
                }
            }
            postCounts[matchedLocale]++;
        });
    }

    console.log('Blog post counts per locale:');
    console.log(postCounts);

    // Verify sitemap rules for thin content blog indexes
    locales.forEach(locale => {
        const count = postCounts[locale];
        const blogUrl = locale === 'en' 
            ? 'https://savetik-fast.xyz/blog' 
            : `https://savetik-fast.xyz/${locale}/blog`;

        if (count < 2) {
            // Must NOT be in sitemap
            if (urls.includes(blogUrl)) {
                console.error(`[ERROR] Thin-content blog listing page '${blogUrl}' (count: ${count}) exists in sitemap!`);
                sitemapErrors++;
            }
        } else {
            // Must be in sitemap
            if (!urls.includes(blogUrl)) {
                console.error(`[ERROR] Populated blog listing page '${blogUrl}' (count: ${count}) is missing from sitemap!`);
                sitemapErrors++;
            }
        }
    });
}
console.log(`Sitemap verification completed. Errors found: ${sitemapErrors}\n`);

// ----------------------------------------------------
// TIER 4: Robots.txt Content Verification
// ----------------------------------------------------
console.log('--- Tier 4: Verifying Robots.txt ---');
const robotsPath = path.join(distDir, 'robots.txt');
let robotsErrors = 0;

if (!fs.existsSync(robotsPath)) {
    console.error('[ERROR] robots.txt does not exist in build output!');
    robotsErrors++;
} else {
    const robotsLines = fs.readFileSync(robotsPath, 'utf8').split('\n').map(l => l.trim());
    
    // Check specific requirements
    const requiredRules = [
        'Disallow: /api/',
        'Disallow: /_astro/',
        'Disallow: /ios',
        'Disallow: /android',
        'Disallow: /mac',
        'Disallow: /pc',
        'Disallow: /*/ios',
        'Disallow: /*/android',
        'Disallow: /*/mac',
        'Disallow: /*/pc',
        'Disallow: /*/about',
        'Disallow: /*/privacy',
        'Disallow: /*/terms',
        'Disallow: /*/disclaimer',
        'Disallow: /*/dmca',
        'Disallow: /*/contact',
        'Sitemap: https://savetik-fast.xyz/sitemap-index.xml'
    ];

    requiredRules.forEach(rule => {
        const found = robotsLines.some(line => line.replace(/\s+/g, '') === rule.replace(/\s+/g, ''));
        if (!found) {
            console.error(`[ERROR] Robots.txt is missing required rule: ${rule}`);
            robotsErrors++;
        }
    });
}
console.log(`Robots.txt verification completed. Errors found: ${robotsErrors}\n`);

// ----------------------------------------------------
// TIER 5: Middleware Logic Verification (Mock Simulation)
// ----------------------------------------------------
console.log('--- Tier 5: Verifying Middleware Redirect Rules ---');
const redirectsConfig = {
    "about-us": "about",
    "who-are-we": "about",
    "contact-us": "contact",
    "privacy-policy": "privacy",
    "terms-of-service": "terms",
    "terms-and-conditions": "terms",
    "disclaimer-policy": "disclaimer",
    "dmca-policy": "dmca",
};

// Replicate the onRequest middleware logic for verification
function simulateMiddleware(requestUrl) {
    const url = new URL(requestUrl);
    const path = url.pathname;

    let cleanPath = (path.endsWith("/") && path.length > 1)
        ? path.slice(0, -1)
        : path;

    const parts = cleanPath.split("/").filter(Boolean);
    let needsRedirect = cleanPath !== path;

    if (parts.length > 0) {
        if (parts[0] === "tl") {
            parts[0] = "fil";
            needsRedirect = true;
        } else if (parts[0] === "en") {
            parts.shift();
            needsRedirect = true;
        }

        if (parts.length > 0) {
            const lastPart = parts[parts.length - 1];
            if (redirectsConfig[lastPart]) {
                parts[parts.length - 1] = redirectsConfig[lastPart];
                needsRedirect = true;
            }
        }
    }

    if (needsRedirect) {
        const newPath = parts.length > 0 ? "/" + parts.join("/") : "/";
        return { redirect: true, to: newPath + url.search };
    }
    return { redirect: false };
}

const redirectTests = [
    { in: 'https://savetik-fast.xyz/about/', out: '/about' },
    { in: 'https://savetik-fast.xyz/ar/mp3/', out: '/ar/mp3' },
    { in: 'https://savetik-fast.xyz/tl/mp3', out: '/fil/mp3' },
    { in: 'https://savetik-fast.xyz/tl/mp3/', out: '/fil/mp3' },
    { in: 'https://savetik-fast.xyz/en/mp3', out: '/mp3' },
    { in: 'https://savetik-fast.xyz/en/', out: '/' },
    { in: 'https://savetik-fast.xyz/en', out: '/' },
    { in: 'https://savetik-fast.xyz/about-us', out: '/about' },
    { in: 'https://savetik-fast.xyz/ar/who-are-we', out: '/ar/about' },
    { in: 'https://savetik-fast.xyz/es/privacy-policy/', out: '/es/privacy' },
    { in: 'https://savetik-fast.xyz/terms-of-service?ref=google', out: '/terms?ref=google' },
    { in: 'https://savetik-fast.xyz/fil/mp3', out: null }, // no redirect expected
    { in: 'https://savetik-fast.xyz/ar', out: null }, // no redirect expected
    { in: 'https://savetik-fast.xyz/', out: null } // no redirect expected
];

let middlewareErrors = 0;
redirectTests.forEach(t => {
    const res = simulateMiddleware(t.in);
    if (t.out === null) {
        if (res.redirect) {
            console.error(`[ERROR] Middleware redirected but should not have: ${t.in} -> ${res.to}`);
            middlewareErrors++;
        }
    } else {
        if (!res.redirect) {
            console.error(`[ERROR] Middleware failed to redirect: ${t.in} (expected redirect to ${t.out})`);
            middlewareErrors++;
        } else if (res.to !== t.out) {
            console.error(`[ERROR] Middleware redirect mismatch for: ${t.in}\n  Expected: ${t.out}\n  Found:    ${res.to}`);
            middlewareErrors++;
        }
    }
});
console.log(`Middleware verification completed. Errors found: ${middlewareErrors}\n`);

// ----------------------------------------------------
// Overall Result Assessment
// ----------------------------------------------------
const totalErrors = htmlErrors + sitemapErrors + robotsErrors + middlewareErrors;
console.log('=== VERIFICATION SUMMARY ===');
console.log(`HTML Errors:       ${htmlErrors}`);
console.log(`Sitemap Errors:    ${sitemapErrors}`);
console.log(`Robots.txt Errors: ${robotsErrors}`);
console.log(`Middleware Errors: ${middlewareErrors}`);
console.log(`Total Errors:      ${totalErrors}`);

if (totalErrors > 0) {
    console.error('\n[FAIL] One or more verification checks failed.');
    process.exit(1);
} else {
    console.log('\n[PASS] All verification checks passed successfully!');
    process.exit(0);
}
