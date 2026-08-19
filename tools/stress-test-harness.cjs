/**
 * ============================================================================
 * 🧪 EMPIRICAL CHALLENGER 2 - STRESS TEST HARNESS
 * ============================================================================
 * Focus:
 *  1. Edge Redirect Engine (100+ combinations, 0 loops, 0 multi-hops)
 *  2. Sitemap Verification (all 191 URLs clean, valid, dist existence, canonical matching)
 *  3. Bidirectional Hreflang Reciprocity across 30-Language Clusters
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const SITE_ORIGIN = 'https://savetik-fast.xyz';
const DIST_DIR = path.resolve(__dirname, '../dist');

// Transpile and load src/utils/redirects.ts directly
const redirectsTsPath = path.resolve(__dirname, '../src/utils/redirects.ts');
const tsCode = fs.readFileSync(redirectsTsPath, 'utf8');
const jsCode = ts.transpileModule(tsCode, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
}).outputText;

const redirectsModule = {};
const fn = new Function('exports', 'module', 'require', jsCode);
fn(redirectsModule, { exports: redirectsModule }, require);
const { getCanonicalRedirect } = redirectsModule;

// Track stats
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureDetails = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
  } else {
    failedTests++;
    failureDetails.push({ testName, details });
    console.error(`  ❌ FAILED: ${testName} - ${details}`);
  }
}

console.log('======================================================================');
console.log('🔥 EMPIRICAL STRESS TEST SUITE: REDIRECTS, SITEMAPS & HREFLANG');
console.log('======================================================================\n');

// ═════════════════════════════════════════════════════════════════════════════
// SUITE 1: EDGE REDIRECT ENGINE STRESS TEST (100+ Combinations)
// ═════════════════════════════════════════════════════════════════════════════
console.log('--- SUITE 1: Edge Redirect Engine Stress Test ---');

const testCases = [
  // 1.1 Legacy 'tl' compound paths (language translation tl -> fil)
  { input: '/tl', expected: '/fil' },
  { input: '/tl/', expected: '/fil' },
  { input: '/tl.html', expected: '/fil' },
  { input: '/tl/about.html', expected: '/fil/about' },
  { input: '/tl/about-us.html', expected: '/fil/about' },
  { input: '/tl/about-us/', expected: '/fil/about' },
  { input: '/tl/about-us', expected: '/fil/about' },
  { input: '/tl/who-are-we', expected: '/fil/about' },
  { input: '/tl/who-are-we.html', expected: '/fil/about' },
  { input: '/tl/who-are-we/', expected: '/fil/about' },
  { input: '/tl/contact-us.html', expected: '/fil/contact' },
  { input: '/tl/contact-us/', expected: '/fil/contact' },
  { input: '/tl/contact-us', expected: '/fil/contact' },
  { input: '/tl/contact.html', expected: '/fil/contact' },
  { input: '/tl/privacy-policy.html', expected: '/fil/privacy' },
  { input: '/tl/privacy-policy/', expected: '/fil/privacy' },
  { input: '/tl/privacy-policy', expected: '/fil/privacy' },
  { input: '/tl/privacy.html', expected: '/fil/privacy' },
  { input: '/tl/terms-of-service.html', expected: '/fil/terms' },
  { input: '/tl/terms-of-service/', expected: '/fil/terms' },
  { input: '/tl/terms-of-service', expected: '/fil/terms' },
  { input: '/tl/terms-and-conditions.html', expected: '/fil/terms' },
  { input: '/tl/terms-and-conditions/', expected: '/fil/terms' },
  { input: '/tl/terms-and-conditions', expected: '/fil/terms' },
  { input: '/tl/terms.html', expected: '/fil/terms' },
  { input: '/tl/disclaimer-policy.html', expected: '/fil/disclaimer' },
  { input: '/tl/disclaimer-policy/', expected: '/fil/disclaimer' },
  { input: '/tl/disclaimer-policy', expected: '/fil/disclaimer' },
  { input: '/tl/disclaimer.html', expected: '/fil/disclaimer' },
  { input: '/tl/dmca-policy.html', expected: '/fil/dmca' },
  { input: '/tl/dmca-policy/', expected: '/fil/dmca' },
  { input: '/tl/dmca-policy', expected: '/fil/dmca' },
  { input: '/tl/dmca.html', expected: '/fil/dmca' },
  { input: '/tl/mp3', expected: '/fil/mp3' },
  { input: '/tl/mp3.html', expected: '/fil/mp3' },
  { input: '/tl/mp3/', expected: '/fil/mp3' },
  { input: '/tl/story.html', expected: '/fil/story' },
  { input: '/tl/story/', expected: '/fil/story' },
  { input: '/tl/slideshow.html', expected: '/fil/slideshow' },
  { input: '/tl/slideshow/', expected: '/fil/slideshow' },
  { input: '/tl/tools.html', expected: '/fil/tools' },
  { input: '/tl/ios.html', expected: '/fil/ios' },
  { input: '/tl/android.html', expected: '/fil/android' },
  { input: '/tl/mac.html', expected: '/fil/mac' },
  { input: '/tl/pc.html', expected: '/fil/pc' },

  // 1.2 English prefix '/en' removal
  { input: '/en', expected: '/' },
  { input: '/en/', expected: '/' },
  { input: '/en.html', expected: '/' },
  { input: '/en/index.html', expected: '/' },
  { input: '/en/mp3', expected: '/mp3' },
  { input: '/en/mp3.html', expected: '/mp3' },
  { input: '/en/mp3/', expected: '/mp3' },
  { input: '/en/story.html', expected: '/story' },
  { input: '/en/story/', expected: '/story' },
  { input: '/en/slideshow.html', expected: '/slideshow' },
  { input: '/en/slideshow/', expected: '/slideshow' },
  { input: '/en/about.html', expected: '/about' },
  { input: '/en/about-us.html', expected: '/about' },
  { input: '/en/about-us/', expected: '/about' },
  { input: '/en/who-are-we.html', expected: '/about' },
  { input: '/en/who-are-we', expected: '/about' },
  { input: '/en/contact.html', expected: '/contact' },
  { input: '/en/contact-us.html', expected: '/contact' },
  { input: '/en/privacy.html', expected: '/privacy' },
  { input: '/en/privacy-policy.html', expected: '/privacy' },
  { input: '/en/privacy-policy/', expected: '/privacy' },
  { input: '/en/terms.html', expected: '/terms' },
  { input: '/en/terms-of-service.html', expected: '/terms' },
  { input: '/en/terms-and-conditions.html', expected: '/terms' },
  { input: '/en/disclaimer.html', expected: '/disclaimer' },
  { input: '/en/disclaimer-policy.html', expected: '/disclaimer' },
  { input: '/en/dmca.html', expected: '/dmca' },
  { input: '/en/dmca-policy.html', expected: '/dmca' },
  { input: '/en/tools.html', expected: '/tools' },
  { input: '/en/ios.html', expected: '/ios' },
  { input: '/en/android.html', expected: '/android' },
  { input: '/en/mac.html', expected: '/mac' },
  { input: '/en/pc.html', expected: '/pc' },

  // 1.3 Root legacy slugs and .html stripping
  { input: '/index.html', expected: '/' },
  { input: '/about.html', expected: '/about' },
  { input: '/about/', expected: '/about' },
  { input: '/about-us', expected: '/about' },
  { input: '/about-us.html', expected: '/about' },
  { input: '/about-us/', expected: '/about' },
  { input: '/who-are-we', expected: '/about' },
  { input: '/who-are-we.html', expected: '/about' },
  { input: '/who-are-we/', expected: '/about' },
  { input: '/contact.html', expected: '/contact' },
  { input: '/contact/', expected: '/contact' },
  { input: '/contact-us', expected: '/contact' },
  { input: '/contact-us.html', expected: '/contact' },
  { input: '/contact-us/', expected: '/contact' },
  { input: '/privacy.html', expected: '/privacy' },
  { input: '/privacy/', expected: '/privacy' },
  { input: '/privacy-policy', expected: '/privacy' },
  { input: '/privacy-policy.html', expected: '/privacy' },
  { input: '/privacy-policy/', expected: '/privacy' },
  { input: '/terms.html', expected: '/terms' },
  { input: '/terms/', expected: '/terms' },
  { input: '/terms-of-service', expected: '/terms' },
  { input: '/terms-of-service.html', expected: '/terms' },
  { input: '/terms-of-service/', expected: '/terms' },
  { input: '/terms-and-conditions', expected: '/terms' },
  { input: '/terms-and-conditions.html', expected: '/terms' },
  { input: '/terms-and-conditions/', expected: '/terms' },
  { input: '/disclaimer.html', expected: '/disclaimer' },
  { input: '/disclaimer/', expected: '/disclaimer' },
  { input: '/disclaimer-policy', expected: '/disclaimer' },
  { input: '/disclaimer-policy.html', expected: '/disclaimer' },
  { input: '/disclaimer-policy/', expected: '/disclaimer' },
  { input: '/dmca.html', expected: '/dmca' },
  { input: '/dmca/', expected: '/dmca' },
  { input: '/dmca-policy', expected: '/dmca' },
  { input: '/dmca-policy.html', expected: '/dmca' },
  { input: '/dmca-policy/', expected: '/dmca' },
  { input: '/mp3.html', expected: '/mp3' },
  { input: '/mp3/', expected: '/mp3' },
  { input: '/story.html', expected: '/story' },
  { input: '/story/', expected: '/story' },
  { input: '/slideshow.html', expected: '/slideshow' },
  { input: '/slideshow/', expected: '/slideshow' },
  { input: '/tools.html', expected: '/tools' },
  { input: '/tools/', expected: '/tools' },
  { input: '/blog.html', expected: '/blog' },
  { input: '/blog/', expected: '/blog' },
  { input: '/ios.html', expected: '/ios' },
  { input: '/ios/', expected: '/ios' },
  { input: '/android.html', expected: '/android' },
  { input: '/android/', expected: '/android' },
  { input: '/mac.html', expected: '/mac' },
  { input: '/mac/', expected: '/mac' },
  { input: '/pc.html', expected: '/pc' },
  { input: '/pc/', expected: '/pc' },

  // 1.4 Multilingual legacy slugs and trailing slash across various languages
  { input: '/ar/', expected: '/ar' },
  { input: '/ar.html', expected: '/ar' },
  { input: '/ar/about-us.html', expected: '/ar/about' },
  { input: '/ar/who-are-we', expected: '/ar/about' },
  { input: '/ar/mp3/', expected: '/ar/mp3' },
  { input: '/es/terms-of-service/', expected: '/es/terms' },
  { input: '/es/terms-and-conditions.html', expected: '/es/terms' },
  { input: '/es/mp3.html', expected: '/es/mp3' },
  { input: '/fr/privacy-policy.html', expected: '/fr/privacy' },
  { input: '/fr/privacy-policy/', expected: '/fr/privacy' },
  { input: '/de/contact-us.html', expected: '/de/contact' },
  { input: '/it/disclaimer-policy/', expected: '/it/disclaimer' },
  { input: '/tr/dmca-policy.html', expected: '/tr/dmca' },
  { input: '/ru/terms-and-conditions.html', expected: '/ru/terms' },
  { input: '/vi/about.html', expected: '/vi/about' },
  { input: '/th/mp3/', expected: '/th/mp3' },
  { input: '/ja/story.html', expected: '/ja/story' },
  { input: '/ko/slideshow/', expected: '/ko/slideshow' },
  { input: '/pl/about-us/', expected: '/pl/about' },
  { input: '/nl/privacy-policy/', expected: '/nl/privacy' },
  { input: '/ro/terms-of-service.html', expected: '/ro/terms' },
  { input: '/ms/who-are-we.html', expected: '/ms/about' },
  { input: '/uk/contact-us/', expected: '/uk/contact' },
  { input: '/cs/disclaimer-policy.html', expected: '/cs/disclaimer' },
  { input: '/sv/dmca-policy/', expected: '/sv/dmca' },
  { input: '/hu/terms-and-conditions/', expected: '/hu/terms' },
  { input: '/el/about-us.html', expected: '/el/about' },
  { input: '/da/privacy-policy.html', expected: '/da/privacy' },
  { input: '/fi/contact-us.html', expected: '/fi/contact' },
  { input: '/no/who-are-we', expected: '/no/about' },
  { input: '/bg/terms-of-service/', expected: '/bg/terms' },
  { input: '/zh/disclaimer-policy.html', expected: '/zh/disclaimer' },
  { input: '/hi/dmca-policy.html', expected: '/hi/dmca' },

  // 1.5 Legacy language switcher cross pairs (/current/target.html)
  { input: '/ar/es.html', expected: '/es' },
  { input: '/es/fr.html', expected: '/fr' },
  { input: '/fr/de.html', expected: '/de' },
  { input: '/de/it.html', expected: '/it' },
  { input: '/it/ru.html', expected: '/ru' },
  { input: '/ru/ja.html', expected: '/ja' },
  { input: '/ja/ko.html', expected: '/ko' },
  { input: '/ko/zh.html', expected: '/zh' },
  { input: '/zh/hi.html', expected: '/hi' },
  { input: '/hi/ar.html', expected: '/ar' },
  { input: '/fil/tl.html', expected: '/fil' },
  { input: '/tl/ar.html', expected: '/ar' },
  { input: '/en/pt.html', expected: '/pt' },

  // 1.6 Query parameter normalization (?lang=...)
  { input: '/?lang=tl', expected: '/fil' },
  { input: '/?lang=TL', expected: '/fil' },
  { input: '/?lang=es&ref=123', expected: '/es?ref=123' },
  { input: '/?ref=123&lang=es', expected: '/es?ref=123' },
  { input: '/?lang=en', expected: '/' },
  { input: '/?lang=EN', expected: '/' },
  { input: '/?lang=en&a=1&b=2', expected: '/?a=1&b=2' },
  { input: '/?lang=ES', expected: '/es' },
  { input: '/?lang=fil', expected: '/fil' },
  { input: '/?lang=FIL', expected: '/fil' },
  { input: '/?lang=FR', expected: '/fr' },
  { input: '/?lang=', expected: '/' },
  { input: '/?lang=ar&utm_source=twitter&utm_medium=social', expected: '/ar?utm_source=twitter&utm_medium=social' },
  { input: '/?lang=TL&ref=123&utm_source=fb', expected: '/fil?ref=123&utm_source=fb' },
  { input: '/?lang=fil&fbclid=abcdef', expected: '/fil?fbclid=abcdef' },
  { input: '/?lang=invalid', expected: '/' },
  { input: '/?lang=unknown&query=test', expected: '/?query=test' },

  // 1.7 Blog and nested route redirects
  { input: '/blog/how-to-download-tiktok-iphone.html', expected: '/blog/how-to-download-tiktok-iphone' },
  { input: '/blog/how-to-download-tiktok-iphone/', expected: '/blog/how-to-download-tiktok-iphone' },
  { input: '/en/blog/how-to-download-tiktok-iphone.html', expected: '/blog/how-to-download-tiktok-iphone' },
  { input: '/en/blog/how-to-download-tiktok-iphone', expected: '/blog/how-to-download-tiktok-iphone' },
  { input: '/tl/blog/best-time-to-post-on-tiktok-2026-fil.html', expected: '/fil/blog/best-time-to-post-on-tiktok-2026-fil' },
  { input: '/tl/blog/best-time-to-post-on-tiktok-2026-fil/', expected: '/fil/blog/best-time-to-post-on-tiktok-2026-fil' },
  { input: '/ar/blog/how-to-download-tiktok-ar.html', expected: '/ar/blog/how-to-download-tiktok-ar' },
  { input: '/ar/blog/how-to-download-tiktok-ar/', expected: '/ar/blog/how-to-download-tiktok-ar' },
  { input: '/tl/blog/', expected: '/fil/blog' },
  { input: '/tl/blog.html', expected: '/fil/blog' },
  { input: '/en/blog/', expected: '/blog' },
  { input: '/en/blog.html', expected: '/blog' },
  { input: '/ar/blog/', expected: '/ar/blog' },
  { input: '/ar/blog.html', expected: '/ar/blog' },
  { input: '/ar/index.html', expected: '/ar' },
  { input: '/fil/index.html', expected: '/fil' },
  { input: '/tl/index.html', expected: '/fil' },
  { input: '/en/index.html', expected: '/' },

  // 1.8 Canonical URLs that MUST NOT redirect (return null)
  { input: '/', expected: null },
  { input: '/mp3', expected: null },
  { input: '/about', expected: null },
  { input: '/privacy', expected: null },
  { input: '/terms', expected: null },
  { input: '/contact', expected: null },
  { input: '/disclaimer', expected: null },
  { input: '/dmca', expected: null },
  { input: '/blog', expected: null },
  { input: '/blog/how-to-download-tiktok-iphone', expected: null },
  { input: '/ar/blog/how-to-download-tiktok-ar', expected: null },
  { input: '/tools', expected: null },
  { input: '/ios', expected: null },
  { input: '/ar', expected: null },
  { input: '/ar/mp3', expected: null },
  { input: '/ar/about', expected: null },
  { input: '/es/privacy', expected: null },
  { input: '/fil/terms', expected: null },
  { input: '/zh/story', expected: null },
  { input: '/hi/slideshow', expected: null },
];

console.log(`Executing ${testCases.length} edge redirect test cases...`);

testCases.forEach(({ input, expected }, idx) => {
  const url = new URL(input, SITE_ORIGIN);
  const result = getCanonicalRedirect(url);

  assert(
    result === expected,
    `Redirect test #${idx + 1}: ${input}`,
    `Expected: "${expected}", Received: "${result}"`
  );

  // If redirect occurred, assert single-hop (destination returns null) and loop-free
  if (result !== null) {
    const destUrl = new URL(result, SITE_ORIGIN);
    const secondHop = getCanonicalRedirect(destUrl);
    assert(
      secondHop === null,
      `Single-Hop Invariant: ${input} -> ${result}`,
      `Destination produced secondary redirect: "${secondHop}"`
    );
  }
});

// 1.8 Worker Hostname & Edge Simulation Stress Test
console.log('Testing Edge Worker Hostname Canonicalization & Loop Freedom...');
const hostnamesToTest = [
  'www.savetik-fast.xyz',
  'www.savetik-fast.xyz:443',
  'savetik-fast.xyz',
];

hostnamesToTest.forEach(host => {
  const isWww = host.startsWith('www.');
  const testUrl = new URL(`https://${host}/tl/about-us.html`);
  
  // Simulate worker hostname check
  let finalUrl = testUrl.toString();
  let hops = 0;
  const maxHops = 5;
  const chain = [finalUrl];

  while (hops < maxHops) {
    const current = new URL(finalUrl);
    hops++;
    
    // Worker step 1: www check
    if (current.hostname.startsWith('www.')) {
      current.hostname = current.hostname.replace(/^www\./, '');
      finalUrl = current.toString();
      chain.push(`[www-redirect] -> ${finalUrl}`);
      continue;
    }

    // Worker step 2: getCanonicalRedirect check
    const redir = getCanonicalRedirect(current);
    if (redir) {
      finalUrl = new URL(redir, current).toString();
      chain.push(`[canonical-redirect] -> ${finalUrl}`);
      continue;
    }

    // Settled at final asset
    break;
  }

  const expectedFinal = 'https://savetik-fast.xyz/fil/about';
  assert(
    finalUrl === expectedFinal,
    `Worker Edge Simulation for host: ${host}`,
    `Ended at "${finalUrl}", expected "${expectedFinal}". Chain: ${chain.join(' ')}`
  );

  assert(
    hops <= 3, // At most 2 redirects (www + path), never looping
    `Worker Redirect Hops count for host: ${host}`,
    `Total hops: ${hops}. Chain: ${chain.join(' ')}`
  );
});

console.log(`  ✓ Suite 1 finished: ${passedTests} assertions passed so far.\n`);


// ═════════════════════════════════════════════════════════════════════════════
// SUITE 2: SITEMAP XML (191 URLs) & CANONICAL SELF-REFERENCE VERIFICATION
// ═════════════════════════════════════════════════════════════════════════════
console.log('--- SUITE 2: Sitemap XML & Canonical Tag Stress Test ---');

const sitemap0Path = path.join(DIST_DIR, 'sitemap-0.xml');
const sitemapIndexPath = path.join(DIST_DIR, 'sitemap-index.xml');
const sitemapXmlPath = path.join(DIST_DIR, 'sitemap.xml');

assert(fs.existsSync(sitemap0Path), 'sitemap-0.xml exists in dist/');
assert(fs.existsSync(sitemapXmlPath), 'sitemap.xml exists in dist/');
assert(fs.existsSync(sitemapIndexPath), 'sitemap-index.xml exists in dist/');

const sitemap0Content = fs.readFileSync(sitemap0Path, 'utf8');
const sitemapXmlContent = fs.readFileSync(sitemapXmlPath, 'utf8');

// Parse URLs
const sitemap0Urls = [...sitemap0Content.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const sitemapXmlUrls = [...sitemapXmlContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

assert(sitemap0Urls.length === 191, 'sitemap-0.xml contains exactly 191 URLs', `Found: ${sitemap0Urls.length}`);
assert(sitemapXmlUrls.length === 191, 'sitemap.xml contains exactly 191 URLs', `Found: ${sitemapXmlUrls.length}`);

// Compare sitemap.xml and sitemap-0.xml for 100% parity
const sitemap0Set = new Set(sitemap0Urls);
const sitemapXmlSet = new Set(sitemapXmlUrls);
let parityDiff = 0;
sitemap0Urls.forEach(u => {
  if (!sitemapXmlSet.has(u)) parityDiff++;
});
assert(parityDiff === 0, 'sitemap.xml and sitemap-0.xml have 100% identical URL sets');

// Verify sitemap-index.xml points to sitemap-0.xml
const sitemapIndexContent = fs.readFileSync(sitemapIndexPath, 'utf8');
assert(
  sitemapIndexContent.includes('https://savetik-fast.xyz/sitemap-0.xml'),
  'sitemap-index.xml references https://savetik-fast.xyz/sitemap-0.xml'
);

// Stress test each of the 191 URLs
console.log(`Validating all 191 sitemap URLs against disk artifacts and canonical tags...`);

sitemap0Urls.forEach((locUrl, index) => {
  const parsed = new URL(locUrl);

  // Check 1: Origin
  assert(
    parsed.origin === SITE_ORIGIN,
    `Sitemap URL #${index + 1} origin: ${locUrl}`,
    `Origin is "${parsed.origin}", expected "${SITE_ORIGIN}"`
  );

  // Check 2: No .html extension
  assert(
    !parsed.pathname.endsWith('.html'),
    `Sitemap URL #${index + 1} has no .html: ${locUrl}`
  );

  // Check 3: No trailing slash (except root '/')
  const hasBadTrailingSlash = parsed.pathname !== '/' && parsed.pathname.endsWith('/');
  assert(
    !hasBadTrailingSlash,
    `Sitemap URL #${index + 1} has no trailing slash: ${locUrl}`
  );

  // Check 4: No /en/ prefix
  const hasEnPrefix = parsed.pathname.startsWith('/en/') || parsed.pathname === '/en';
  assert(
    !hasEnPrefix,
    `Sitemap URL #${index + 1} has no /en/ prefix: ${locUrl}`
  );

  // Check 5: Corresponding HTML file in dist/
  let expectedHtmlRelPath;
  if (parsed.pathname === '/') {
    expectedHtmlRelPath = 'index.html';
  } else {
    // e.g. /about -> about.html, /ar -> ar.html, /ar/mp3 -> ar/mp3.html, /blog/post -> blog/post.html
    const rel = parsed.pathname.slice(1);
    expectedHtmlRelPath = `${rel}.html`;
  }

  const expectedHtmlFullPath = path.join(DIST_DIR, expectedHtmlRelPath);
  const fileExists = fs.existsSync(expectedHtmlFullPath);

  assert(
    fileExists,
    `Sitemap URL #${index + 1} exists in dist/: ${locUrl} -> ${expectedHtmlRelPath}`,
    `File not found: ${expectedHtmlFullPath}`
  );

  if (fileExists) {
    const html = fs.readFileSync(expectedHtmlFullPath, 'utf8');

    // Check 6: Strictly matching self-referencing canonical tag
    const canonicalMatch = html.match(/rel="canonical"\s+href="([^"]+)"/) || html.match(/href="([^"]+)"\s+rel="canonical"/);
    const canonicalHref = canonicalMatch ? canonicalMatch[1] : null;

    assert(
      canonicalHref === locUrl,
      `Sitemap URL #${index + 1} canonical match: ${locUrl}`,
      `Canonical in HTML is "${canonicalHref}", expected "${locUrl}"`
    );

    // Check 7: Robots directive is index, follow (no noindex)
    const hasNoindex = html.includes('content="noindex');
    assert(
      !hasNoindex,
      `Sitemap URL #${index + 1} is indexable: ${locUrl}`,
      `Found noindex directive in ${expectedHtmlRelPath}`
    );
  }
});

console.log(`  ✓ Suite 2 finished: all 191 sitemap URLs verified.\n`);


// ═════════════════════════════════════════════════════════════════════════════
// SUITE 3: BIDIRECTIONAL HREFLANG RECIPROCITY MATRIX STRESS TEST
// ═════════════════════════════════════════════════════════════════════════════
console.log('--- SUITE 3: Multilingual Hreflang Reciprocity Matrix Stress Test ---');

const ALL_30_LOCALES = [
  'en', 'ar', 'es', 'pt', 'id', 'fr', 'de', 'it', 'tr', 'ru',
  'vi', 'th', 'ja', 'ko', 'pl', 'nl', 'ro', 'ms', 'fil', 'uk',
  'cs', 'sv', 'hu', 'el', 'da', 'fi', 'no', 'bg', 'zh', 'hi'
];

// Define standard multilingual page clusters across all 30 locales
const MULTILINGUAL_CLUSTERS = [
  { name: 'Home', getPath: (lang) => lang === 'en' ? '/' : `/${lang}` },
  { name: 'MP3 Tool', getPath: (lang) => lang === 'en' ? '/mp3' : `/${lang}/mp3` },
  { name: 'Story Tool', getPath: (lang) => lang === 'en' ? '/story' : `/${lang}/story` },
  { name: 'Slideshow Tool', getPath: (lang) => lang === 'en' ? '/slideshow' : `/${lang}/slideshow` },
  { name: 'Tools Hub', getPath: (lang) => lang === 'en' ? '/tools' : `/${lang}/tools` },
  { name: 'About', getPath: (lang) => lang === 'en' ? '/about' : `/${lang}/about` },
  { name: 'Privacy Policy', getPath: (lang) => lang === 'en' ? '/privacy' : `/${lang}/privacy` },
  { name: 'Terms of Service', getPath: (lang) => lang === 'en' ? '/terms' : `/${lang}/terms` },
  { name: 'Contact', getPath: (lang) => lang === 'en' ? '/contact' : `/${lang}/contact` },
  { name: 'DMCA Policy', getPath: (lang) => lang === 'en' ? '/dmca' : `/${lang}/dmca` },
  { name: 'Disclaimer', getPath: (lang) => lang === 'en' ? '/disclaimer' : `/${lang}/disclaimer` },
  { name: 'iOS Device Guide', getPath: (lang) => lang === 'en' ? '/ios' : `/${lang}/ios` },
  { name: 'Android Device Guide', getPath: (lang) => lang === 'en' ? '/android' : `/${lang}/android` },
  { name: 'Mac Device Guide', getPath: (lang) => lang === 'en' ? '/mac' : `/${lang}/mac` },
  { name: 'PC Device Guide', getPath: (lang) => lang === 'en' ? '/pc' : `/${lang}/pc` },
];

let totalHreflangPairsChecked = 0;
let totalHreflangTagsParsed = 0;

MULTILINGUAL_CLUSTERS.forEach(cluster => {
  console.log(`Checking Hreflang Cluster: ${cluster.name} across all 30 languages...`);

  // Map: lang -> { url, htmlPath, hreflangs: Map(hreflangCode -> href), xDefault: string }
  const clusterMap = new Map();

  ALL_30_LOCALES.forEach(lang => {
    const pagePath = cluster.getPath(lang);
    const fullUrl = `${SITE_ORIGIN}${pagePath === '/' ? '/' : pagePath}`;
    const relHtml = pagePath === '/' ? 'index.html' : `${pagePath.slice(1)}.html`;
    const fullHtmlPath = path.join(DIST_DIR, relHtml);

    if (fs.existsSync(fullHtmlPath)) {
      const html = fs.readFileSync(fullHtmlPath, 'utf8');
      const hreflangs = new Map();

      // Match all alternate tags: <link rel="alternate" hreflang="xx" href="yy" /> or variants
      const matches = [...html.matchAll(/<link\s+[^>]*rel=["']alternate["'][^>]*>/gi)];
      
      matches.forEach(m => {
        const tag = m[0];
        const hreflangMatch = tag.match(/hreflang=["']([^"']+)["']/i);
        const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
        if (hreflangMatch && hrefMatch) {
          hreflangs.set(hreflangMatch[1].toLowerCase(), hrefMatch[1]);
          totalHreflangTagsParsed++;
        }
      });

      const xDefaultMatch = html.match(/hreflang=["']x-default["']\s+href=["']([^"']+)["']/i) ||
                            html.match(/href=["']([^"']+)["']\s+hreflang=["']x-default["']/i);
      const xDefault = xDefaultMatch ? xDefaultMatch[1] : hreflangs.get('x-default');

      clusterMap.set(lang, {
        lang,
        url: fullUrl,
        relHtml,
        hreflangs,
        xDefault
      });
    } else {
      assert(false, `Cluster ${cluster.name}: HTML file exists for lang ${lang}`, `Missing file: ${fullHtmlPath}`);
    }
  });

  // Verify x-default on all pages points to English root URL
  const expectedXDefault = `${SITE_ORIGIN}${cluster.getPath('en') === '/' ? '/' : cluster.getPath('en')}`;
  
  ALL_30_LOCALES.forEach(lang => {
    const pageData = clusterMap.get(lang);
    if (pageData) {
      assert(
        pageData.xDefault === expectedXDefault,
        `Cluster ${cluster.name} [${lang}] x-default tag`,
        `Received: "${pageData.xDefault}", Expected: "${expectedXDefault}"`
      );

      // Check self-referencing hreflang
      const selfHreflang = pageData.hreflangs.get(lang);
      assert(
        selfHreflang === pageData.url,
        `Cluster ${cluster.name} [${lang}] self-referencing hreflang`,
        `Received: "${selfHreflang}", Expected: "${pageData.url}"`
      );
    }
  });

  // Stress test full pairwise bidirectional reciprocity: 30 x 30 matrix = 900 pairs per cluster!
  for (let i = 0; i < ALL_30_LOCALES.length; i++) {
    for (let j = 0; j < ALL_30_LOCALES.length; j++) {
      const langA = ALL_30_LOCALES[i];
      const langB = ALL_30_LOCALES[j];
      const dataA = clusterMap.get(langA);
      const dataB = clusterMap.get(langB);

      if (dataA && dataB) {
        totalHreflangPairsChecked++;
        // Link from A -> B
        const aToB = dataA.hreflangs.get(langB);
        // Link from B -> A
        const bToA = dataB.hreflangs.get(langA);

        assert(
          aToB === dataB.url,
          `Cluster ${cluster.name}: ${langA} -> ${langB} alternate link`,
          `Page ${dataA.relHtml} links to "${aToB}", expected "${dataB.url}"`
        );

        assert(
          bToA === dataA.url,
          `Cluster ${cluster.name}: ${langB} -> ${langA} reciprocal alternate link`,
          `Page ${dataB.relHtml} links to "${bToA}", expected "${dataA.url}"`
        );
      }
    }
  }
});

// Check non-multilingual pages (404 and standalone blog) for hreflang isolation
console.log('Checking standalone and 404 page hreflang isolation...');
const p404Html = fs.readFileSync(path.join(DIST_DIR, '404.html'), 'utf8');
const p404Hreflangs = (p404Html.match(/hreflang=/g) || []).length;
assert(p404Hreflangs === 0, '404.html has 0 hreflang tags');

// English-only editorial policy check
const editorialHtml = fs.readFileSync(path.join(DIST_DIR, 'editorial-policy.html'), 'utf8');
const editorialHreflangs = (editorialHtml.match(/hreflang=/g) || []).length;
assert(editorialHreflangs === 0, 'editorial-policy.html has 0 hreflang tags (standalone English page)');

console.log(`  ✓ Suite 3 finished: checked ${totalHreflangPairsChecked} pairwise combinations (${totalHreflangTagsParsed} tags parsed).\n`);


// ═════════════════════════════════════════════════════════════════════════════
// SUMMARY & VERDICT
// ═════════════════════════════════════════════════════════════════════════════
console.log('======================================================================');
console.log('📊 EMPIRICAL STRESS TEST RESULTS');
console.log('======================================================================');
console.log(`Total Assertions Checked: ${totalTests}`);
console.log(`Passed:                   ${passedTests}`);
console.log(`Failed:                   ${failedTests}`);

if (failedTests === 0) {
  console.log('\n🌟 VERDICT: PASS - 100% EMPIRICAL STRESS TESTS PASSED WITH ZERO FLAWS.');
} else {
  console.log(`\n❌ VERDICT: FAIL - ${failedTests} ASSERTIONS FAILED.`);
  console.log('Failure details:');
  failureDetails.forEach((f, i) => {
    console.log(` ${i + 1}. [${f.testName}] -> ${f.details}`);
  });
  process.exitCode = 1;
}
