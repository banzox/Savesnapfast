/**
 * Challenger 1: Exhaustive 520 Page Empirical Stress Test
 */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const assert = require('assert');

const DIST_DIR = path.resolve('dist');
const sitemapPath = path.join(DIST_DIR, 'sitemap-0.xml');
assert.ok(fs.existsSync(sitemapPath), 'sitemap-0.xml must exist in dist');
const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

console.log('╔══════════════════════════════════════════════════════════════════════╗');
console.log('║ 🔬 CHALLENGER 1: Exhaustive 520 Page Empirical Stress Test           ║');
console.log('╚══════════════════════════════════════════════════════════════════════╝\n');
console.log('Total URLs loaded from sitemap-0.xml: ' + urls.length);

let errors = [];
let passCount = 0;
let canonicalChecks = 0;
let robotsChecks = 0;
let hreflangChecks = 0;
let reciprocalChecks = 0;
let reciprocalErrors = [];

function urlToDistFile(u) {
  const parsed = new URL(u);
  let p = parsed.pathname;
  if (p === '/' || p === '') return path.join(DIST_DIR, 'index.html');
  if (p.startsWith('/')) p = p.slice(1);
  const directHtml = path.join(DIST_DIR, p + '.html');
  if (fs.existsSync(directHtml)) return directHtml;
  const indexHtml = path.join(DIST_DIR, p, 'index.html');
  if (fs.existsSync(indexHtml)) return indexHtml;
  return null;
}

const hreflangMap = new Map();

for (const u of urls) {
  const filePath = urlToDistFile(u);
  if (!filePath || !fs.existsSync(filePath)) {
    errors.push('Missing HTML file for URL: ' + u);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // 1. Meta robots
  robotsChecks++;
  const robots = $('meta[name="robots"]').attr('content');
  if (!robots) {
    errors.push(u + ': Missing meta robots tag');
  } else if (!robots.includes('index') || robots.includes('noindex')) {
    errors.push(u + ': Invalid meta robots: "' + robots + '"');
  }

  // Specific bot meta tags
  const googlebot = $('meta[name="googlebot"]').attr('content');
  if (googlebot && googlebot.includes('noindex')) {
    errors.push(u + ': googlebot meta has noindex: "' + googlebot + '"');
  }
  const bingbot = $('meta[name="bingbot"]').attr('content');
  if (bingbot && bingbot.includes('noindex')) {
    errors.push(u + ': bingbot meta has noindex: "' + bingbot + '"');
  }

  // 2. Canonical
  canonicalChecks++;
  const canonical = $('link[rel="canonical"]').attr('href');
  if (!canonical) {
    errors.push(u + ': Missing canonical tag');
  } else if (canonical !== u) {
    errors.push(u + ': Canonical mismatch! Expected "' + u + '", got "' + canonical + '"');
  }

  // Trailing slash check on canonical (only root has slash)
  if (canonical && canonical !== 'https://savetik-fast.xyz/' && canonical.endsWith('/')) {
    errors.push(u + ': Canonical has illegal trailing slash: ' + canonical);
  }

  // 3. og:url
  const ogUrl = $('meta[property="og:url"]').attr('content');
  if (ogUrl && ogUrl !== u) {
    errors.push(u + ': og:url mismatch! Expected "' + u + '", got "' + ogUrl + '"');
  }

  // 4. Hreflang alternates
  const pageHreflangs = {};
  $('link[rel="alternate"][hreflang]').each((idx, elem) => {
    const hl = $(elem).attr('hreflang');
    const href = $(elem).attr('href');
    if (hl && href) {
      pageHreflangs[hl] = href;
      hreflangChecks++;
    }
  });

  hreflangMap.set(u, pageHreflangs);

  // 5. Structure & body check
  if (html.length < 1000) {
    errors.push(u + ': Suspiciously short HTML (' + html.length + ' bytes)');
  }

  if (html.includes('cf-turnstile') || html.includes('challenges.cloudflare.com') || html.includes('Just a moment...')) {
    errors.push(u + ': Cloudflare challenge / Turnstile screen found!');
  }

  passCount++;
}

console.log('✓ Stage 1: Scanned ' + passCount + ' content pages.');
console.log('  - Robots checks: ' + robotsChecks);
console.log('  - Canonical checks: ' + canonicalChecks);
console.log('  - Hreflang tags parsed: ' + hreflangChecks);

// ─── Stage 2: Reciprocal Hreflang Verification ─────────────────────────────
console.log('\n🔄 Stage 2: Validating Reciprocal Hreflang Bidirectionality...');
for (const [sourceUrl, sourceHreflangs] of hreflangMap.entries()) {
  for (const [targetLang, targetUrl] of Object.entries(sourceHreflangs)) {
    if (targetLang === 'x-default') continue;
    reciprocalChecks++;

    const targetHreflangs = hreflangMap.get(targetUrl);
    if (!targetHreflangs) {
      reciprocalErrors.push(sourceUrl + ' links via hreflang[' + targetLang + '] to ' + targetUrl + ' which is NOT in sitemap/hreflangMap!');
      continue;
    }

    // Find source lang
    const sourceMatch = Object.entries(targetHreflangs).find(([l, href]) => href === sourceUrl);
    if (!sourceMatch) {
      reciprocalErrors.push('Non-reciprocal hreflang: ' + sourceUrl + ' -> [' + targetLang + '] -> ' + targetUrl + ', but target does not link back to source!');
    }
  }
}

console.log('  - Reciprocal link pairs verified: ' + reciprocalChecks);
console.log('  - Reciprocal errors: ' + reciprocalErrors.length);

// ─── Stage 3: Summary ───────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════════════════════════════════');
console.log('                      📊 FINAL 520 AUDIT RESULTS                      ');
console.log('══════════════════════════════════════════════════════════════════════');
console.log('  Total Content Pages Audited : ' + passCount);
console.log('  Canonical Checks Passed     : ' + (canonicalChecks - errors.filter(e => e.includes('Canonical')).length) + ' / ' + canonicalChecks);
console.log('  Robots Tag Checks Passed    : ' + (robotsChecks - errors.filter(e => e.includes('robots')).length) + ' / ' + robotsChecks);
console.log('  Reciprocal Pairs Passed     : ' + (reciprocalChecks - reciprocalErrors.length) + ' / ' + reciprocalChecks);
console.log('  Total Direct Errors         : ' + errors.length);
console.log('  Total Reciprocal Errors     : ' + reciprocalErrors.length);
console.log('══════════════════════════════════════════════════════════════════════\n');

if (errors.length > 0 || reciprocalErrors.length > 0) {
  console.error('❌ AUDIT FAILED!');
  if (errors.length > 0) console.error('Direct errors (first 10):', errors.slice(0, 10));
  if (reciprocalErrors.length > 0) console.error('Reciprocal errors (first 10):', reciprocalErrors.slice(0, 10));
  process.exit(1);
} else {
  console.log('🌟 100% OF ALL 520 CONTENT PAGES PASSED CANONICAL, ROBOTS & RECIPROCAL HREFLANG VERIFICATION! 🌟');
}
