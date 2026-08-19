/**
 * ============================================================================
 * 🤖 EMPIRICAL CHALLENGER TEST HARNESS: Search Crawler Emulation & HTTP Status
 * ============================================================================
 * Tests:
 * 1. Googlebot/2.1, Google-InspectionTool, and bingbot User-Agent handling.
 * 2. Root '/', all 30 localized homepages, tools, blogs, legal & device pages.
 * 3. HTTP 200 + clean HTML verification (no 403/503, no Turnstile challenges).
 * 4. Genuine HTTP 404 + <meta name="robots" content="noindex, follow"> on invalid routes.
 * 5. X-Robots-Tag: noindex, nofollow on /api/* endpoints across HTTP methods.
 * 6. Edge canonical redirects (301) for www, legacy slugs, /en, /tl, ?lang=
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';

// Import edge worker
import worker from '../worker/index.ts';

const DIST_DIR = path.resolve('dist');

// Define User-Agents
const USER_AGENTS = {
    Googlebot: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    GoogleInspectionTool: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36 (compatible; Google-InspectionTool/1.0;)',
    Bingbot: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
    StandardChrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};

const ALL_LOCALES = [
    'en', 'ar', 'es', 'pt', 'id', 'fr', 'de', 'it', 'tr', 'ru',
    'vi', 'th', 'ja', 'ko', 'pl', 'nl', 'ro', 'ms', 'fil', 'uk',
    'cs', 'sv', 'hu', 'el', 'da', 'fi', 'no', 'bg', 'zh', 'hi'
];

/**
 * Cloudflare Assets Simulator matching wrangler.jsonc:
 * - html_handling: "drop-trailing-slash"
 * - not_found_handling: "404-page"
 */
function resolveAsset(pathname) {
    let cleanPath = pathname;
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.slice(1);

    // 1. Root index
    if (cleanPath === '' || cleanPath === '/') {
        const indexPath = path.join(DIST_DIR, 'index.html');
        if (fs.existsSync(indexPath)) return { filePath: indexPath, status: 200, contentType: 'text/html; charset=utf-8' };
    }

    // 2. Direct file (e.g. robots.txt, favicon.png, sitemap-0.xml, etc.)
    const directPath = path.join(DIST_DIR, cleanPath);
    if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
        const ext = path.extname(directPath);
        let ct = 'text/plain; charset=utf-8';
        if (ext === '.html') ct = 'text/html; charset=utf-8';
        else if (ext === '.xml') ct = 'application/xml; charset=utf-8';
        else if (ext === '.json') ct = 'application/json; charset=utf-8';
        else if (ext === '.js') ct = 'application/javascript; charset=utf-8';
        else if (ext === '.css') ct = 'text/css; charset=utf-8';
        return { filePath: directPath, status: 200, contentType: ct };
    }

    // 3. Drop-trailing-slash / file-format (.html extension)
    // E.g. /mp3 -> dist/mp3.html, /ar/mp3 -> dist/ar/mp3.html
    const htmlPath = path.join(DIST_DIR, `${cleanPath}.html`);
    if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
        return { filePath: htmlPath, status: 200, contentType: 'text/html; charset=utf-8' };
    }

    // 4. Nested directory index.html
    const nestedIndex = path.join(DIST_DIR, cleanPath, 'index.html');
    if (fs.existsSync(nestedIndex) && fs.statSync(nestedIndex).isFile()) {
        return { filePath: nestedIndex, status: 200, contentType: 'text/html; charset=utf-8' };
    }

    // 5. 404 Fallback
    const notFoundPath = path.join(DIST_DIR, '404.html');
    if (fs.existsSync(notFoundPath)) {
        return { filePath: notFoundPath, status: 404, contentType: 'text/html; charset=utf-8' };
    }

    return { content: '404 Not Found', status: 404, contentType: 'text/plain; charset=utf-8' };
}

const mockEnv = {
    ASSETS: {
        fetch: async (request) => {
            const url = new URL(request.url);
            const asset = resolveAsset(url.pathname);
            if (asset.filePath) {
                const body = fs.readFileSync(asset.filePath);
                return new Response(body, {
                    status: asset.status,
                    headers: { 'Content-Type': asset.contentType },
                });
            }
            return new Response(asset.content, {
                status: asset.status,
                headers: { 'Content-Type': asset.contentType },
            });
        },
    },
};

const mockCtx = {
    waitUntil: () => {},
};

// Test Runner
async function runEmpiricalCrawlerSuite() {
    console.log('=================================================================');
    console.log('🚀 RUNNING EMPIRICAL CRAWLER EMULATION & HTTP STATUS STRESS TESTS');
    console.log('=================================================================\n');

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    const failures = [];

    function recordPass(testName) {
        totalTests++;
        passedTests++;
        // console.log(`  ✓ ${testName}`);
    }

    function recordFail(testName, error) {
        totalTests++;
        failedTests++;
        console.error(`  ✗ FAIL: ${testName} -> ${error}`);
        failures.push({ testName, error });
    }

    // Helper to dispatch request through worker
    async function dispatch(urlStr, options = {}) {
        const req = new Request(urlStr, options);
        return await worker.fetch(req, mockEnv, mockCtx);
    }

    // -------------------------------------------------------------------------
    // 1. EXTRACT ALL URLS FROM SITEMAP
    // -------------------------------------------------------------------------
    console.log('--- Step 1: Loading all indexable URLs from sitemap-0.xml ---');
    const sitemapPath = path.join(DIST_DIR, 'sitemap-0.xml');
    assert.ok(fs.existsSync(sitemapPath), 'sitemap-0.xml must exist in dist');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    const sitemapUrls = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    console.log(`Found ${sitemapUrls.length} canonical URLs in sitemap.\n`);

    // -------------------------------------------------------------------------
    // 2. STRESS TEST ALL SITEMAP URLS WITH 3 SEARCH BOT USER-AGENTS
    // -------------------------------------------------------------------------
    console.log('--- Step 2: Testing all 191 Sitemap URLs with Googlebot, Google-InspectionTool, & bingbot ---');
    
    for (const rawUrl of sitemapUrls) {
        for (const [botName, botUserAgent] of Object.entries(USER_AGENTS)) {
            const urlObj = new URL(rawUrl);
            const pathName = urlObj.pathname;
            const testLabel = `${botName} -> GET ${pathName}`;

            try {
                const res = await dispatch(rawUrl, {
                    method: 'GET',
                    headers: {
                        'User-Agent': botUserAgent,
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    },
                });

                if (res.status !== 200) {
                    recordFail(testLabel, `Expected HTTP 200, got ${res.status}`);
                    continue;
                }

                const contentType = res.headers.get('Content-Type') || '';
                if (!contentType.includes('text/html')) {
                    recordFail(testLabel, `Expected Content-Type text/html, got ${contentType}`);
                    continue;
                }

                const html = await res.text();

                // Check for anti-bot / challenge screens
                if (
                    html.includes('challenges.cloudflare.com') ||
                    html.includes('cf-turnstile') ||
                    html.includes('Attention Required! | Cloudflare') ||
                    html.includes('Just a moment...') ||
                    html.includes('Checking your browser')
                ) {
                    recordFail(testLabel, 'Turnstile / Cloudflare challenge page detected!');
                    continue;
                }

                // Check basic HTML validity
                if (!html.includes('<!DOCTYPE html>') && !html.includes('<!doctype html>')) {
                    recordFail(testLabel, 'Missing <!DOCTYPE html>');
                    continue;
                }

                // Check that robots tag does NOT have noindex
                const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
                if (robotsMatch) {
                    const content = robotsMatch[1];
                    if (content.includes('noindex')) {
                        recordFail(testLabel, `Indexable sitemap URL has meta robots noindex: "${content}"`);
                        continue;
                    }
                }

                // Check canonical URL is self-referencing
                const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
                if (!canonicalMatch) {
                    recordFail(testLabel, 'Missing canonical tag');
                    continue;
                }
                const canonicalHref = canonicalMatch[1];
                const expectedCanonical = rawUrl;
                if (canonicalHref !== expectedCanonical) {
                    recordFail(testLabel, `Canonical mismatch: got "${canonicalHref}", expected "${expectedCanonical}"`);
                    continue;
                }

                recordPass(testLabel);
            } catch (err) {
                recordFail(testLabel, `Exception: ${err.message}`);
            }
        }
    }

    console.log(`Completed sitemap URL crawler emulation test. Current Passed: ${passedTests}, Failed: ${failedTests}\n`);

    // -------------------------------------------------------------------------
    // 3. TEST ALL 30 LOCALIZED HOMEPAGES & TOOL PAGES
    // -------------------------------------------------------------------------
    console.log('--- Step 3: Verifying 30 Locales Homepage & Tool Pages ---');
    const toolSlugs = ['mp3', 'story', 'slideshow', 'about', 'privacy', 'terms', 'contact', 'dmca', 'disclaimer'];

    for (const lang of ALL_LOCALES) {
        // Test localized homepage
        const homePath = lang === 'en' ? '/' : `/${lang}`;
        const homeUrl = `https://savetik-fast.xyz${homePath}`;
        
        for (const [botName, botUserAgent] of Object.entries(USER_AGENTS)) {
            const testLabel = `Locale [${lang}] Home -> ${botName}`;
            try {
                const res = await dispatch(homeUrl, {
                    headers: { 'User-Agent': botUserAgent },
                });
                if (res.status !== 200) {
                    recordFail(testLabel, `Expected 200, got ${res.status}`);
                } else {
                    const html = await res.text();
                    assert.ok(html.includes('<html'), 'Must contain <html');
                    recordPass(testLabel);
                }
            } catch (e) {
                recordFail(testLabel, e.message);
            }
        }

        // Test sample tools for each locale
        for (const tool of ['mp3', 'story', 'slideshow']) {
            const toolPath = lang === 'en' ? `/${tool}` : `/${lang}/${tool}`;
            const toolUrl = `https://savetik-fast.xyz${toolPath}`;
            const testLabel = `Tool [${lang}/${tool}] Googlebot`;
            try {
                const res = await dispatch(toolUrl, {
                    headers: { 'User-Agent': USER_AGENTS.Googlebot },
                });
                if (res.status !== 200) {
                    recordFail(testLabel, `Expected 200, got ${res.status}`);
                } else {
                    recordPass(testLabel);
                }
            } catch (e) {
                recordFail(testLabel, e.message);
            }
        }
    }

    console.log(`Completed locale & tool checks. Current Passed: ${passedTests}, Failed: ${failedTests}\n`);

    // -------------------------------------------------------------------------
    // 4. ADVERSARIAL 404 ERROR STRESS TESTING
    // -------------------------------------------------------------------------
    console.log('--- Step 4: Adversarial HTTP 404 & Meta Robots Testing ---');
    const nonExistentRoutes = [
        '/random-404-check',
        '/does-not-exist',
        '/non-existent-page-xyz-12345',
        '/ar/invalid-route',
        '/es/does-not-exist',
        '/fr/fake-tool-path',
        '/ja/random-page-123',
        '/wp-login.php',
        '/administrator/index.php',
        '/feed.xml.bak',
        '/blog/non-existent-article-slug-xyz',
        '/api-does-not-exist',
    ];

    for (const route of nonExistentRoutes) {
        for (const [botName, botUserAgent] of Object.entries(USER_AGENTS)) {
            const testLabel = `404 Test: ${botName} -> ${route}`;
            const testUrl = `https://savetik-fast.xyz${route}`;

            try {
                const res = await dispatch(testUrl, {
                    headers: { 'User-Agent': botUserAgent },
                });

                if (res.status !== 404) {
                    recordFail(testLabel, `Expected genuine HTTP 404, got ${res.status} (Soft 404!)`);
                    continue;
                }

                const html = await res.text();

                // Verify <meta name="robots" content="noindex, follow"> exists
                const hasRobotsNoindex = html.includes('content="noindex, follow"') || html.includes('content="noindex"');
                if (!hasRobotsNoindex) {
                    recordFail(testLabel, 'HTTP 404 page is missing meta robots noindex tag!');
                    continue;
                }

                // Check googlebot/bingbot specific tags
                const hasGooglebotNoindex = html.includes('name="googlebot" content="noindex');
                const hasBingbotNoindex = html.includes('name="bingbot" content="noindex');

                if (!hasGooglebotNoindex || !hasBingbotNoindex) {
                    recordFail(testLabel, 'HTTP 404 page missing specific googlebot/bingbot noindex meta tags');
                    continue;
                }

                recordPass(testLabel);
            } catch (e) {
                recordFail(testLabel, `Exception: ${e.message}`);
            }
        }
    }

    console.log(`Completed 404 stress test. Current Passed: ${passedTests}, Failed: ${failedTests}\n`);

    // -------------------------------------------------------------------------
    // 5. API ENDPOINTS & X-ROBOTS-TAG VERIFICATION
    // -------------------------------------------------------------------------
    console.log('--- Step 5: API Endpoints & X-Robots-Tag Stress Testing ---');
    const apiEndpoints = [
        { url: 'https://savetik-fast.xyz/api/tiktok', method: 'GET', desc: 'GET /api/tiktok (no params)' },
        { url: 'https://savetik-fast.xyz/api/tiktok?url=https://www.tiktok.com/@test/video/123', method: 'GET', desc: 'GET /api/tiktok (with url param)' },
        { url: 'https://savetik-fast.xyz/api/tiktok', method: 'POST', body: JSON.stringify({ url: 'https://invalid.com' }), desc: 'POST /api/tiktok (invalid url)' },
        { url: 'https://savetik-fast.xyz/api/tiktok', method: 'OPTIONS', desc: 'OPTIONS /api/tiktok' },
        { url: 'https://savetik-fast.xyz/api/download', method: 'GET', desc: 'GET /api/download (no params)' },
        { url: 'https://savetik-fast.xyz/api/download?url=https://malicious.com/hack.exe', method: 'GET', desc: 'GET /api/download (unauthorized domain)' },
        { url: 'https://savetik-fast.xyz/api/download', method: 'OPTIONS', desc: 'OPTIONS /api/download' },
        { url: 'https://savetik-fast.xyz/api/download', method: 'DELETE', desc: 'DELETE /api/download (Method Not Allowed)' },
        { url: 'https://savetik-fast.xyz/api/nonexistent-endpoint', method: 'GET', desc: 'GET /api/nonexistent (404)' },
        { url: 'https://savetik-fast.xyz/api/nonexistent-endpoint', method: 'POST', desc: 'POST /api/nonexistent (404)' },
    ];

    for (const endpoint of apiEndpoints) {
        const testLabel = `API Header Test: ${endpoint.desc}`;
        try {
            const reqInit = {
                method: endpoint.method,
                headers: {
                    'User-Agent': USER_AGENTS.Googlebot,
                    'Content-Type': 'application/json',
                },
            };
            if (endpoint.body) reqInit.body = endpoint.body;

            const res = await dispatch(endpoint.url, reqInit);
            const xRobotsTag = res.headers.get('X-Robots-Tag');

            if (!xRobotsTag) {
                recordFail(testLabel, 'Missing X-Robots-Tag header in response');
                continue;
            }

            if (!xRobotsTag.includes('noindex') || !xRobotsTag.includes('nofollow')) {
                recordFail(testLabel, `X-Robots-Tag must contain "noindex, nofollow", got "${xRobotsTag}"`);
                continue;
            }

            recordPass(testLabel);
        } catch (e) {
            recordFail(testLabel, `Exception: ${e.message}`);
        }
    }

    console.log(`Completed API header verification. Current Passed: ${passedTests}, Failed: ${failedTests}\n`);

    // -------------------------------------------------------------------------
    // 6. EDGE REDIRECTS & CANONICAL HOSTNAME STRESS TESTING (301 PERMANENT)
    // -------------------------------------------------------------------------
    console.log('--- Step 6: Edge Canonical Redirects (301 Permanent) ---');
    const redirectTestCases = [
        { from: 'https://www.savetik-fast.xyz/', expectedStatus: 301, expectedLocation: 'https://savetik-fast.xyz/' },
        { from: 'https://www.savetik-fast.xyz/mp3', expectedStatus: 301, expectedLocation: 'https://savetik-fast.xyz/mp3' },
        { from: 'https://www.savetik-fast.xyz/ar/story', expectedStatus: 301, expectedLocation: 'https://savetik-fast.xyz/ar/story' },
        { from: 'https://savetik-fast.xyz/en', expectedStatus: 301, expectedLocation: 'https://savetik-fast.xyz/' },
        { from: 'https://savetik-fast.xyz/en/mp3', expectedStatus: 301, expectedLocation: 'https://savetik-fast.xyz/mp3' },
        { from: 'https://savetik-fast.xyz/tl', expectedStatus: 301, expectedLocation: 'https://savetik-fast.xyz/fil' },
        { from: 'https://savetik-fast.xyz/tl/mp3', expectedStatus: 301, expectedLocation: 'https://savetik-fast.xyz/fil/mp3' },
        { from: 'https://savetik-fast.xyz/about-us', expectedStatus: 301, expectedLocation: 'https://savetik-fast.xyz/about' },
        { from: 'https://savetik-fast.xyz/who-are-we', expectedStatus: 301, expectedLocation: 'https://savetik-fast.xyz/about' },
        { from: 'https://savetik-fast.xyz/privacy-policy', expectedStatus: 301, expectedLocation: 'https://savetik-fast.xyz/privacy' },
        { from: 'https://savetik-fast.xyz/terms-of-service', expectedStatus: 301, expectedLocation: 'https://savetik-fast.xyz/terms' },
        { from: 'https://savetik-fast.xyz/dmca-policy', expectedStatus: 301, expectedLocation: 'https://savetik-fast.xyz/dmca' },
        { from: 'https://savetik-fast.xyz/disclaimer-policy', expectedStatus: 301, expectedLocation: 'https://savetik-fast.xyz/disclaimer' },
        { from: 'https://savetik-fast.xyz/tl/about-us.html', expectedStatus: 301, expectedLocation: 'https://savetik-fast.xyz/fil/about' },
        { from: 'https://savetik-fast.xyz/?lang=ar', expectedStatus: 301, expectedLocation: 'https://savetik-fast.xyz/ar' },
        { from: 'https://savetik-fast.xyz/?lang=tl', expectedStatus: 301, expectedLocation: 'https://savetik-fast.xyz/fil' },
        { from: 'https://savetik-fast.xyz/?lang=en', expectedStatus: 301, expectedLocation: 'https://savetik-fast.xyz/' },
    ];

    for (const tc of redirectTestCases) {
        const testLabel = `Redirect: ${tc.from} -> ${tc.expectedLocation}`;
        try {
            const res = await dispatch(tc.from, {
                headers: { 'User-Agent': USER_AGENTS.Googlebot },
                redirect: 'manual',
            });

            if (res.status !== tc.expectedStatus) {
                recordFail(testLabel, `Expected status ${tc.expectedStatus}, got ${res.status}`);
                continue;
            }

            const location = res.headers.get('Location');
            if (location !== tc.expectedLocation) {
                recordFail(testLabel, `Expected Location "${tc.expectedLocation}", got "${location}"`);
                continue;
            }

            recordPass(testLabel);
        } catch (e) {
            recordFail(testLabel, `Exception: ${e.message}`);
        }
    }

    console.log(`Completed redirect tests. Current Passed: ${passedTests}, Failed: ${failedTests}\n`);

    // -------------------------------------------------------------------------
    // 7. REAL HTTP TCP SERVER MOUNT & END-TO-END WIRE TESTING
    // -------------------------------------------------------------------------
    console.log('--- Step 7: End-to-End HTTP Wire Test with Actual HTTP Sockets ---');
    const port = 8765;
    const server = http.createServer(async (req, res) => {
        try {
            const fullUrl = `https://savetik-fast.xyz${req.url}`;
            const headers = new Headers();
            for (const [k, v] of Object.entries(req.headers)) {
                if (typeof v === 'string') headers.set(k, v);
                else if (Array.isArray(v)) v.forEach(item => headers.append(k, item));
            }

            let body = null;
            if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
                const chunks = [];
                for await (const chunk of req) chunks.push(chunk);
                body = Buffer.concat(chunks);
            }

            const fetchReq = new Request(fullUrl, {
                method: req.method,
                headers,
                body,
            });

            const workerRes = await worker.fetch(fetchReq, mockEnv, mockCtx);
            res.statusCode = workerRes.status;
            for (const [hk, hv] of workerRes.headers.entries()) {
                res.setHeader(hk, hv);
            }

            if (workerRes.body) {
                const buf = Buffer.from(await workerRes.arrayBuffer());
                res.end(buf);
            } else {
                res.end();
            }
        } catch (serverErr) {
            res.statusCode = 500;
            res.end(`Internal Server Error: ${serverErr.message}`);
        }
    });

    await new Promise(resolve => server.listen(port, resolve));
    console.log(`Test HTTP server listening on http://127.0.0.1:${port}`);

    // Run wire HTTP requests using fetch
    const wireTests = [
        { path: '/', agent: USER_AGENTS.Googlebot, expectedStatus: 200 },
        { path: '/ar', agent: USER_AGENTS.GoogleInspectionTool, expectedStatus: 200 },
        { path: '/ja/mp3', agent: USER_AGENTS.Bingbot, expectedStatus: 200 },
        { path: '/blog/best-time-to-post-on-tiktok-2026', agent: USER_AGENTS.Googlebot, expectedStatus: 200 },
        { path: '/about', agent: USER_AGENTS.Googlebot, expectedStatus: 200 },
        { path: '/non-existent-wire-route-xyz', agent: USER_AGENTS.Googlebot, expectedStatus: 404 },
        { path: '/api/tiktok', agent: USER_AGENTS.Googlebot, expectedStatus: 400, expectRobotsHeader: true },
        { path: '/api/download', agent: USER_AGENTS.Bingbot, expectedStatus: 400, expectRobotsHeader: true },
    ];

    for (const wt of wireTests) {
        const testLabel = `Wire HTTP: GET ${wt.path} [${wt.expectedStatus}]`;
        try {
            const wireRes = await fetch(`http://127.0.0.1:${port}${wt.path}`, {
                headers: { 'User-Agent': wt.agent },
            });

            if (wireRes.status !== wt.expectedStatus) {
                recordFail(testLabel, `Expected status ${wt.expectedStatus}, got ${wireRes.status}`);
                continue;
            }

            if (wt.expectRobotsHeader) {
                const xRobots = wireRes.headers.get('x-robots-tag');
                if (!xRobots || !xRobots.includes('noindex')) {
                    recordFail(testLabel, `Missing or invalid X-Robots-Tag: "${xRobots}"`);
                    continue;
                }
            }

            recordPass(testLabel);
        } catch (err) {
            recordFail(testLabel, `Wire request failed: ${err.message}`);
        }
    }

    server.close();
    console.log('Test HTTP server closed.\n');

    // -------------------------------------------------------------------------
    // SUMMARY REPORT
    // -------------------------------------------------------------------------
    console.log('=================================================================');
    console.log('📊 EMPIRICAL STRESS TEST SUITE RESULTS');
    console.log('=================================================================');
    console.log(`Total Invocations Tested: ${totalTests}`);
    console.log(`Passed Checks:           ${passedTests}`);
    console.log(`Failed Checks:           ${failedTests}`);

    if (failures.length > 0) {
        console.log('\n❌ FAILURES BREAKDOWN:');
        failures.forEach((f, idx) => {
            console.log(`${idx + 1}. ${f.testName}: ${f.error}`);
        });
        return { pass: false, totalTests, passedTests, failedTests, failures };
    } else {
        console.log('\n🎉 100% OF EMPIRICAL CRAWLER EMULATION & HTTP STRESS TESTS PASSED!');
        return { pass: true, totalTests, passedTests, failedTests, failures };
    }
}

runEmpiricalCrawlerSuite().then(res => {
    if (!res.pass) {
        process.exit(1);
    }
}).catch(e => {
    console.error('Fatal Test Runner Error:', e);
    process.exit(1);
});
