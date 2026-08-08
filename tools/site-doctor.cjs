/**
 * ============================================================================
 *  🩺 SITE DOCTOR - Comprehensive Auditor & Auto-Fixer for SaveTikFast
 * ============================================================================
 *  Usage:
 *    node tools/site-doctor.cjs              # Audit only (default)
 *    node tools/site-doctor.cjs --fix        # Audit + Auto-fix
 *    node tools/site-doctor.cjs --report     # Output JSON report
 *    node tools/site-doctor.cjs --verbose    # Show all details
 *
 *  Covers ALL known issues:
 *    1.  SEO Canonical URLs (trailing slash conflicts)
 *    2.  Hreflang tags (self-referencing, x-default)
 *    3.  Noindex meta tags on device/legal pages
 *    4.  Robots.txt rules validation
 *    5.  Sitemap integrity (no forbidden pages)
 *    6.  Redirect logic (tl→fil, en→/, trailing slash)
 *    7.  Translation completeness
 *    8.  Internal link integrity
 *    9.  Build output verification
 *    10. Schema.org structured data
 *    11. Source code errors (TypeScript/Astro)
 *    12. Page parity (root vs [lang])
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

// ─── Configuration ──────────────────────────────────────────────────────────
const SITE_ORIGIN = 'https://savetik-fast.xyz';
const DIST_DIR = './dist';
const SRC_DIR = './src';
const PUBLIC_DIR = './public';

const LOCALES = ['en', 'ar', 'es', 'pt', 'id', 'fr', 'de', 'it', 'tr', 'ru', 'vi', 'th', 'ja', 'ko', 'pl', 'nl', 'ro', 'ms', 'fil', 'uk', 'cs', 'sv', 'hu', 'el', 'da', 'fi', 'no', 'bg', 'zh', 'hi'];
const DEVICE_PAGES = ['ios', 'android', 'mac', 'pc'];
const LEGAL_PAGES = ['about', 'privacy', 'terms', 'contact', 'dmca', 'disclaimer'];
const TOOL_PAGES = ['mp3', 'story', 'slideshow'];

// Legacy slug redirects (from middleware.ts)
const LEGACY_SLUGS = {
  'about-us': 'about',
  'who-are-we': 'about',
  'contact-us': 'contact',
  'privacy-policy': 'privacy',
  'terms-of-service': 'terms',
  'terms-and-conditions': 'terms',
  'disclaimer-policy': 'disclaimer',
  'dmca-policy': 'dmca',
};

// ─── CLI Args ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const FLAG_FIX = args.includes('--fix');
const FLAG_REPORT = args.includes('--report');
const FLAG_VERBOSE = args.includes('--verbose');

// ─── Colors (ANSI) ─────────────────────────────────────────────────────────
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
};

// ─── Result Tracking ────────────────────────────────────────────────────────
const results = {
  checks: [],
  errors: 0,
  warnings: 0,
  passed: 0,
  fixed: 0,
  totalChecks: 0,
};

function addResult(category, status, message, details = null) {
  results.totalChecks++;
  const entry = { category, status, message };
  if (details) entry.details = details;

  if (status === 'ERROR') {
    results.errors++;
    if (!FLAG_REPORT) console.log(`  ${C.red}✗${C.reset} ${message}`);
  } else if (status === 'WARN') {
    results.warnings++;
    if (!FLAG_REPORT) console.log(`  ${C.yellow}⚠${C.reset} ${message}`);
  } else if (status === 'FIXED') {
    results.fixed++;
    if (!FLAG_REPORT) console.log(`  ${C.magenta}🔧${C.reset} ${message}`);
  } else {
    results.passed++;
    if (!FLAG_REPORT && FLAG_VERBOSE) console.log(`  ${C.green}✓${C.reset} ${message}`);
  }
  results.checks.push(entry);
}

function sectionHeader(title) {
  if (!FLAG_REPORT) {
    console.log(`\n${C.cyan}${C.bold}━━━ ${title} ━━━${C.reset}`);
  }
}

function readFileIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  CHECK 1: SEO Canonical & Trailing Slash Conflict
// ═════════════════════════════════════════════════════════════════════════════
function checkSEOCanonical() {
  sectionHeader('1. SEO Canonical & Trailing Slash');

  // Check astro.config.mjs
  const astroConfig = readFileIfExists('astro.config.mjs');
  if (!astroConfig) {
    addResult('canonical', 'ERROR', 'astro.config.mjs not found');
    return;
  }

  const trailingSlashMatch = astroConfig.match(/trailingSlash:\s*'(\w+)'/);
  const trailingSlash = trailingSlashMatch ? trailingSlashMatch[1] : 'not set';
  if (trailingSlash === 'never') {
    addResult('canonical', 'PASS', `trailingSlash: '${trailingSlash}' ✓`);
  } else {
    addResult('canonical', 'ERROR', `trailingSlash should be 'never', found: '${trailingSlash}'`);
  }

  const buildFormatMatch = astroConfig.match(/format:\s*'(\w+)'/);
  const buildFormat = buildFormatMatch ? buildFormatMatch[1] : 'not set';
  if (buildFormat === 'file') {
    addResult('canonical', 'PASS', `build.format: '${buildFormat}' ✓`);
  } else {
    addResult('canonical', 'WARN', `build.format should be 'file', found: '${buildFormat}'`);
  }

  // Check SEOConfig.astro for trailing slash issues
  const seoConfig = readFileIfExists('src/components/SEOConfig.astro');
  if (seoConfig) {
    if (seoConfig.includes('ensureTrailingSlash')) {
      addResult('canonical', 'ERROR', 'SEOConfig.astro still contains ensureTrailingSlash() - conflicts with trailingSlash: never');
    } else {
      addResult('canonical', 'PASS', 'SEOConfig.astro has no trailing slash functions ✓');
    }

    // Check canonical URL construction
    if (seoConfig.includes('SITE_ORIGIN') && seoConfig.includes('canonicalURL')) {
      addResult('canonical', 'PASS', 'SEOConfig builds absolute canonical URLs ✓');
    }

    // Check for translated legal page canonical logic
    if (seoConfig.includes('isTranslatedLegalPage') && seoConfig.includes('legalPages')) {
      addResult('canonical', 'PASS', 'Translated legal pages point canonical to English version ✓');
    } else {
      addResult('canonical', 'ERROR', 'Missing translated legal page canonical logic in SEOConfig.astro');
    }
  }

  // Verify in dist (if built)
  if (fs.existsSync(DIST_DIR)) {
    const checkFiles = ['mp3.html', 'ar.html', 'story.html'];
    checkFiles.forEach(file => {
      const filePath = path.join(DIST_DIR, file);
      const html = readFileIfExists(filePath);
      if (html) {
        const canonicalMatch = html.match(/rel="canonical" href="([^"]+)"/);
        if (canonicalMatch) {
          const canonical = canonicalMatch[1];
          if (canonical !== `${SITE_ORIGIN}/` && canonical.endsWith('/')) {
            addResult('canonical', 'ERROR', `${file}: Canonical has trailing slash: ${canonical}`);
          } else {
            addResult('canonical', 'PASS', `${file}: Canonical clean → ${canonical}`);
          }
        } else {
          addResult('canonical', 'ERROR', `${file}: No canonical tag found`);
        }
      }
    });
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  CHECK 2: Hreflang Tags
// ═════════════════════════════════════════════════════════════════════════════
function checkHreflang() {
  sectionHeader('2. Hreflang Tags');

  if (!fs.existsSync(DIST_DIR)) {
    addResult('hreflang', 'WARN', 'Dist directory not found - skipping hreflang build checks. Run "npm run build" first.');
    return;
  }

  // Check main pages for hreflang presence
  const pagesToCheck = [
    { file: 'mp3.html', expectedLang: 'en' },
    { file: 'ar.html', expectedLang: 'ar' },
    { file: 'ar/mp3.html', expectedLang: 'ar' },
  ];

  pagesToCheck.forEach(({ file, expectedLang }) => {
    const filePath = path.join(DIST_DIR, file);
    const html = readFileIfExists(filePath);
    if (!html) {
      addResult('hreflang', 'WARN', `${file}: File not found in dist`);
      return;
    }

    // Check x-default
    const hasXDefault = html.includes('hreflang="x-default"');
    if (hasXDefault) {
      addResult('hreflang', 'PASS', `${file}: Has x-default hreflang ✓`);
    } else {
      addResult('hreflang', 'ERROR', `${file}: Missing x-default hreflang`);
    }

    // Check self-referencing hreflang
    const selfHreflang = html.match(new RegExp(`hreflang="${expectedLang}" href="([^"]+)"`));
    if (selfHreflang) {
      const href = selfHreflang[1];
      if (href !== `${SITE_ORIGIN}/` && href.endsWith('/')) {
        addResult('hreflang', 'ERROR', `${file}: Self hreflang has trailing slash: ${href}`);
      } else {
        addResult('hreflang', 'PASS', `${file}: Self-referencing hreflang (${expectedLang}) ✓`);
      }
    } else {
      addResult('hreflang', 'ERROR', `${file}: Missing self-referencing hreflang for "${expectedLang}"`);
    }

    // Count total hreflang tags
    const hreflangCount = (html.match(/hreflang="/g) || []).length;
    // Should be 30 languages + 1 x-default = 31
    if (hreflangCount >= 30) {
      addResult('hreflang', 'PASS', `${file}: Has ${hreflangCount} hreflang tags (expected ≥30) ✓`);
    } else if (hreflangCount > 0) {
      addResult('hreflang', 'WARN', `${file}: Only ${hreflangCount} hreflang tags (expected ≥30)`);
    } else {
      addResult('hreflang', 'ERROR', `${file}: No hreflang tags found`);
    }
  });

  // Check 404 page should NOT have hreflang
  const html404 = readFileIfExists(path.join(DIST_DIR, '404.html'));
  if (html404) {
    const has404Hreflang = html404.includes('hreflang=');
    if (!has404Hreflang) {
      addResult('hreflang', 'PASS', '404.html: Correctly has no hreflang tags ✓');
    } else {
      addResult('hreflang', 'WARN', '404.html: Has hreflang tags (should be skipped for 404)');
    }
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  CHECK 3: Noindex Meta Tags
// ═════════════════════════════════════════════════════════════════════════════
function checkNoindex() {
  sectionHeader('3. Noindex Meta Tags');

  if (!fs.existsSync(DIST_DIR)) {
    addResult('noindex', 'WARN', 'Dist directory not found - skipping noindex checks');
    return;
  }

  // Device pages should have noindex
  const devicePagesToCheck = [
    'ios.html', 'android.html', 'mac.html', 'pc.html',
    'ar/ios.html', 'es/android.html', 'fr/mac.html'
  ];

  devicePagesToCheck.forEach(file => {
    const filePath = path.join(DIST_DIR, file);
    const html = readFileIfExists(filePath);
    if (!html) {
      if (FLAG_VERBOSE) addResult('noindex', 'WARN', `${file}: Not found in dist`);
      return;
    }

    const hasNoindex = html.includes('content="noindex, follow"') || html.includes('content="noindex,follow"');
    if (hasNoindex) {
      addResult('noindex', 'PASS', `${file}: Has noindex ✓`);
    } else {
      addResult('noindex', 'ERROR', `${file}: Missing noindex meta tag (device page)`);
    }
  });

  // Translated legal pages should have noindex
  const legalPagesToCheck = ['ar/about.html', 'fr/privacy.html', 'de/terms.html', 'es/contact.html', 'it/dmca.html', 'tr/disclaimer.html'];

  legalPagesToCheck.forEach(file => {
    const filePath = path.join(DIST_DIR, file);
    const html = readFileIfExists(filePath);
    if (!html) {
      if (FLAG_VERBOSE) addResult('noindex', 'WARN', `${file}: Not found in dist`);
      return;
    }

    const hasNoindex = html.includes('content="noindex, follow"') || html.includes('content="noindex,follow"');
    if (hasNoindex) {
      addResult('noindex', 'PASS', `${file}: Has noindex ✓`);
    } else {
      addResult('noindex', 'ERROR', `${file}: Missing noindex (translated legal page)`);
    }
  });

  // Root English legal pages should NOT have noindex
  LEGAL_PAGES.forEach(page => {
    const filePath = path.join(DIST_DIR, `${page}.html`);
    const html = readFileIfExists(filePath);
    if (!html) return;

    const hasNoindex = html.includes('content="noindex, follow"');
    if (!hasNoindex) {
      addResult('noindex', 'PASS', `${page}.html: Correctly indexable ✓`);
    } else {
      addResult('noindex', 'ERROR', `${page}.html: Root English legal page has noindex - should be indexable!`);
    }
  });

  // Check Layout.astro noindex implementation
  const layout = readFileIfExists('src/layouts/Layout.astro');
  if (layout) {
    if (layout.includes('noindex') && layout.includes('robots') && layout.includes('is404')) {
      addResult('noindex', 'PASS', 'Layout.astro: Noindex logic is implemented ✓');
    } else {
      addResult('noindex', 'ERROR', 'Layout.astro: Missing noindex implementation');
    }
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  CHECK 4: Robots.txt
// ═════════════════════════════════════════════════════════════════════════════
function checkRobotsTxt() {
  sectionHeader('4. Robots.txt');

  const robotsPath = path.join(PUBLIC_DIR, 'robots.txt');
  const robots = readFileIfExists(robotsPath);
  if (!robots) {
    addResult('robots', 'ERROR', 'robots.txt not found in public/');
    return;
  }

  // Required rules
  const requiredRules = [
    { rule: 'Disallow: /api/', desc: 'Block API endpoints' },
    { rule: 'Disallow: /admin', desc: 'Block admin panel' },
    { rule: 'Disallow: /*?*', desc: 'Block query parameters' },
    { rule: 'Allow: /_astro/', desc: 'Allow Astro assets' },
    { rule: `Sitemap: ${SITE_ORIGIN}/sitemap-index.xml`, desc: 'Sitemap reference' },
  ];

  // Device page rules
  DEVICE_PAGES.forEach(device => {
    requiredRules.push({ rule: `Disallow: /${device}`, desc: `Block /${device}` });
    requiredRules.push({ rule: `Disallow: /*/${device}`, desc: `Block /*/${device}` });
  });

  // Translated legal page rules
  LEGAL_PAGES.forEach(page => {
    requiredRules.push({ rule: `Disallow: /*/${page}`, desc: `Block translated /${page}` });
  });

  requiredRules.forEach(({ rule, desc }) => {
    if (robots.includes(rule)) {
      addResult('robots', 'PASS', `${desc} ✓`);
    } else {
      addResult('robots', 'ERROR', `Missing rule: ${rule} (${desc})`);
    }
  });
}

// ═════════════════════════════════════════════════════════════════════════════
//  CHECK 5: Sitemap Integrity
// ═════════════════════════════════════════════════════════════════════════════
function checkSitemap() {
  sectionHeader('5. Sitemap');

  // Check sitemap-index.xml in dist
  const sitemapIndexPath = path.join(DIST_DIR, 'sitemap-index.xml');
  if (!fs.existsSync(sitemapIndexPath)) {
    // Also check public
    if (fs.existsSync(path.join(PUBLIC_DIR, 'sitemap-index.xml'))) {
      addResult('sitemap', 'PASS', 'sitemap-index.xml found in public/ ✓');
    } else {
      addResult('sitemap', 'WARN', 'sitemap-index.xml not found - run build first');
      return;
    }
  } else {
    addResult('sitemap', 'PASS', 'sitemap-index.xml exists in dist ✓');
  }

  // Check sitemap-0.xml
  const sitemap0Path = path.join(DIST_DIR, 'sitemap-0.xml');
  const sitemap0 = readFileIfExists(sitemap0Path);
  if (!sitemap0) {
    addResult('sitemap', 'WARN', 'sitemap-0.xml not found in dist');
    return;
  }

  const urls = [...sitemap0.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  addResult('sitemap', 'PASS', `Total sitemap URLs: ${urls.length}`);

  // Check for trailing slash URLs
  const trailingSlashUrls = urls.filter(u => u !== `${SITE_ORIGIN}/` && u.endsWith('/'));
  if (trailingSlashUrls.length > 0) {
    addResult('sitemap', 'ERROR', `${trailingSlashUrls.length} URLs have trailing slashes`, trailingSlashUrls.slice(0, 5));
  } else {
    addResult('sitemap', 'PASS', 'No trailing slash URLs in sitemap ✓');
  }

  // Check for device pages in sitemap (should be excluded)
  let deviceViolations = 0;
  urls.forEach(url => {
    const pathname = url.replace(SITE_ORIGIN, '');
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0 && DEVICE_PAGES.includes(segments[segments.length - 1])) {
      addResult('sitemap', 'ERROR', `Device page in sitemap: ${url}`);
      deviceViolations++;
    }
  });
  if (deviceViolations === 0) {
    addResult('sitemap', 'PASS', 'No device pages in sitemap ✓');
  }

  // Check for translated legal pages (should be excluded)
  let legalViolations = 0;
  urls.forEach(url => {
    const pathname = url.replace(SITE_ORIGIN, '');
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 2 && LOCALES.includes(segments[0]) && LEGAL_PAGES.includes(segments[1])) {
      addResult('sitemap', 'ERROR', `Translated legal page in sitemap: ${url}`);
      legalViolations++;
    }
  });
  if (legalViolations === 0) {
    addResult('sitemap', 'PASS', 'No translated legal pages in sitemap ✓');
  }

  // Check for /en/ prefixed pages (should redirect, not be in sitemap)
  const enPrefixed = urls.filter(u => {
    const p = u.replace(SITE_ORIGIN, '');
    return p.startsWith('/en/') || p === '/en';
  });
  if (enPrefixed.length > 0) {
    addResult('sitemap', 'ERROR', `${enPrefixed.length} /en/ prefixed URLs in sitemap (these redirect)`, enPrefixed);
  } else {
    addResult('sitemap', 'PASS', 'No /en/ prefixed URLs in sitemap ✓');
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  CHECK 6: Redirect Logic
// ═════════════════════════════════════════════════════════════════════════════
function checkRedirects() {
  sectionHeader('6. Redirect Logic (Middleware)');

  const middleware = readFileIfExists('src/middleware.ts');
  if (!middleware) {
    addResult('redirects', 'ERROR', 'middleware.ts not found');
    return;
  }

  // Check tl → fil redirect
  if ((middleware.includes('"tl"') || middleware.includes("'tl'")) && (middleware.includes('"fil"') || middleware.includes("'fil'"))) {
    addResult('redirects', 'PASS', 'tl → fil redirect exists ✓');
  } else {
    addResult('redirects', 'ERROR', 'Missing tl → fil redirect in middleware');
  }

  // Check /en → / redirect
  if ((middleware.includes('"en"') || middleware.includes("'en'")) && middleware.includes('parts.shift')) {
    addResult('redirects', 'PASS', '/en → / redirect exists ✓');
  } else {
    addResult('redirects', 'ERROR', 'Missing /en → / redirect in middleware');
  }

  // Check trailing slash removal
  if (middleware.includes('endsWith("/")') || middleware.includes("endsWith('/')")) {
    addResult('redirects', 'PASS', 'Trailing slash removal exists ✓');
  } else {
    addResult('redirects', 'ERROR', 'Missing trailing slash removal in middleware');
  }

  // Check legacy slug redirects
  const expectedSlugs = Object.keys(LEGACY_SLUGS);
  let missingSlugs = [];
  expectedSlugs.forEach(slug => {
    if (!middleware.includes(`"${slug}"`) && !middleware.includes(`'${slug}'`)) {
      missingSlugs.push(slug);
    }
  });
  if (missingSlugs.length === 0) {
    addResult('redirects', 'PASS', `All ${expectedSlugs.length} legacy slug redirects configured ✓`);
  } else {
    addResult('redirects', 'WARN', `Missing legacy slug redirects: ${missingSlugs.join(', ')}`);
  }

  // Check redirect uses 301
  if (middleware.includes('301')) {
    addResult('redirects', 'PASS', 'Redirects use 301 (permanent) ✓');
  } else {
    addResult('redirects', 'WARN', 'Redirects may not use 301 status code');
  }

  // Check Cloudflare _redirects file
  const redirectsFile = readFileIfExists('public/_redirects');
  if (redirectsFile) {
    if (redirectsFile.includes('/sitemap.xml') && redirectsFile.includes('/sitemap-index.xml')) {
      addResult('redirects', 'PASS', '_redirects: sitemap.xml → sitemap-index.xml ✓');
    }
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  CHECK 7: Translation Completeness
// ═════════════════════════════════════════════════════════════════════════════
function checkTranslations() {
  sectionHeader('7. Translation Completeness');

  const localesDir = 'src/locales/locales';
  if (!fs.existsSync(localesDir)) {
    addResult('translations', 'ERROR', 'Locales directory not found');
    return;
  }

  // Load English reference
  const enPath = path.join(localesDir, 'en.json');
  let enData;
  try {
    enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  } catch (e) {
    addResult('translations', 'ERROR', `Failed to parse en.json: ${e.message}`);
    return;
  }

  // Flatten English keys for comparison
  function flattenKeys(obj, prefix = '') {
    const keys = [];
    for (const key of Object.keys(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys.push(...flattenKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    return keys;
  }

  function getNestedValue(obj, keyPath) {
    const parts = keyPath.split('.');
    let current = obj;
    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }
    return current;
  }

  const enKeys = flattenKeys(enData);

  // Critical keys that MUST be translated
  const criticalKeys = [
    'meta.title', 'meta.description',
    'mp3_page.meta_desc', 'mp3_page.title',
    'story_page.meta_desc', 'story_page.title',
    'slideshow_page.title',
    'slideshow_page.features.quality.title',
    'slideshow_page.features.fast.title',
    'slideshow_page.features.device.title',
  ];

  let totalUntranslated = 0;
  let totalMissing = 0;
  const langIssues = {};

  const nonEnLocales = LOCALES.filter(l => l !== 'en');
  nonEnLocales.forEach(lang => {
    const langPath = path.join(localesDir, `${lang}.json`);
    let langData;
    try {
      langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    } catch (e) {
      addResult('translations', 'ERROR', `Failed to parse ${lang}.json: ${e.message}`);
      return;
    }

    const untranslated = [];
    const missing = [];

    criticalKeys.forEach(key => {
      const enVal = getNestedValue(enData, key);
      const langVal = getNestedValue(langData, key);

      if (langVal === undefined || langVal === null) {
        missing.push(key);
      } else if (typeof enVal === 'string' && langVal === enVal && enVal.length > 3) {
        // Value is same as English = likely untranslated
        untranslated.push(key);
      }
    });

    if (missing.length > 0 || untranslated.length > 0) {
      langIssues[lang] = { missing, untranslated };
      totalUntranslated += untranslated.length;
      totalMissing += missing.length;
    }
  });

  if (Object.keys(langIssues).length === 0) {
    addResult('translations', 'PASS', `All critical translations present across ${nonEnLocales.length} languages ✓`);
  } else {
    const issueCount = Object.keys(langIssues).length;
    addResult('translations', 'WARN', `${issueCount} languages have translation issues (${totalMissing} missing, ${totalUntranslated} untranslated)`);

    if (FLAG_VERBOSE) {
      Object.entries(langIssues).forEach(([lang, issues]) => {
        if (issues.missing.length > 0) {
          addResult('translations', 'WARN', `  [${lang.toUpperCase()}] Missing: ${issues.missing.join(', ')}`);
        }
        if (issues.untranslated.length > 0) {
          addResult('translations', 'WARN', `  [${lang.toUpperCase()}] Untranslated: ${issues.untranslated.join(', ')}`);
        }
      });
    }
  }

  // Check for FAQs in BG (known issue from audit_details)
  const bgPath = path.join(localesDir, 'bg.json');
  try {
    const bgData = JSON.parse(fs.readFileSync(bgPath, 'utf8'));
    const faqKeys = ['mp3_page.faq.q1', 'story_page.faq.q1'];
    let bgFaqIssues = 0;
    faqKeys.forEach(key => {
      const bgVal = getNestedValue(bgData, key);
      const enVal = getNestedValue(enData, key);
      if (bgVal && enVal && bgVal === enVal) {
        bgFaqIssues++;
      }
    });
    if (bgFaqIssues > 0) {
      addResult('translations', 'WARN', `[BG] FAQ translations may still be English (${bgFaqIssues} sections)`);
    }
  } catch { /* ignore */ }
}

// ═════════════════════════════════════════════════════════════════════════════
//  CHECK 8: Internal Links
// ═════════════════════════════════════════════════════════════════════════════
function checkInternalLinks() {
  sectionHeader('8. Internal Links');

  // Check Navbar links
  const navbar = readFileIfExists('src/components/Navbar.astro');
  if (navbar) {
    // Check logo link
    const logoLinkMatch = navbar.match(/href=\{lang === "en" \? "\/" : `\/\$\{lang\}`\}/);
    if (logoLinkMatch) {
      addResult('links', 'PASS', 'Navbar logo link: Clean pattern ✓');
    }

    // Check nav items for trailing slash
    if (navbar.includes('/mp3') && !navbar.includes('/mp3/')) {
      addResult('links', 'PASS', 'Navbar tool links: No trailing slashes ✓');
    }
  }

  // Check Footer links
  const footer = readFileIfExists('src/components/Footer.astro');
  if (footer) {
    // Legal links should point to root English versions
    let footerIssues = 0;
    LEGAL_PAGES.forEach(page => {
      if (footer.includes(`href="/${page}"`)) {
        // Good: links directly to English version
      } else {
        footerIssues++;
      }
    });

    if (footerIssues === 0) {
      addResult('links', 'PASS', 'Footer legal links point to English root pages ✓');
    } else {
      addResult('links', 'WARN', `Footer: ${footerIssues} legal links may not point to English root`);
    }

    // Device links with nofollow
    if (footer.includes('rel="nofollow"')) {
      addResult('links', 'PASS', 'Footer device links have rel="nofollow" ✓');
    } else {
      addResult('links', 'WARN', 'Footer device links missing rel="nofollow"');
    }
  }

  // Check LanguageSelector
  const langSelector = readFileIfExists('src/components/LanguageSelector.astro');
  if (langSelector) {
    if (langSelector.includes('getPathForLanguage')) {
      addResult('links', 'PASS', 'LanguageSelector: Has dynamic path generation ✓');
    }

    // Check trailing slash stripping
    if (langSelector.includes('.slice(0, -1)') || langSelector.includes('endsWith("/")')) {
      addResult('links', 'PASS', 'LanguageSelector: Strips trailing slashes ✓');
    }

    // Check blog post redirect to blog index
    if (langSelector.includes('/blog/') && (langSelector.includes('pathNoLang = "/blog"') || langSelector.includes("pathNoLang = '/blog'"))) {
      addResult('links', 'PASS', 'LanguageSelector: Blog post → blog index on lang switch ✓');
    }
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  CHECK 9: Build Output Verification
// ═════════════════════════════════════════════════════════════════════════════
function checkBuildOutput() {
  sectionHeader('9. Build Output');

  if (!fs.existsSync(DIST_DIR)) {
    addResult('build', 'WARN', 'Dist directory not found - run "npm run build" first');
    return;
  }

  // Check root pages exist as file format (.html)
  const expectedPages = ['mp3', 'about', 'privacy', 'terms', 'contact', 'dmca', 'disclaimer', 'blog', 'tools', 'story', 'slideshow'];
  expectedPages.forEach(page => {
    const fileFormat = fs.existsSync(path.join(DIST_DIR, `${page}.html`));
    const dirFormat = fs.existsSync(path.join(DIST_DIR, page, 'index.html'));

    if (fileFormat) {
      addResult('build', 'PASS', `/${page}: File format (.html) ✓`);
    } else if (dirFormat) {
      addResult('build', 'WARN', `/${page}: Directory format (index.html) - should be file format`);
    } else {
      addResult('build', 'ERROR', `/${page}: NOT FOUND in build output`);
    }
  });

  // Check language pages
  const sampleLangs = ['ar', 'es', 'fr', 'de'];
  sampleLangs.forEach(lang => {
    const langIndex = fs.existsSync(path.join(DIST_DIR, `${lang}.html`));
    if (langIndex) {
      addResult('build', 'PASS', `/${lang}: Language index exists ✓`);
    } else {
      addResult('build', 'ERROR', `/${lang}: Language index MISSING`);
    }

    // Check tool pages under language
    const mp3Page = fs.existsSync(path.join(DIST_DIR, lang, 'mp3.html'));
    if (mp3Page) {
      addResult('build', 'PASS', `/${lang}/mp3: Exists ✓`);
    }
  });

  // Check static assets
  const requiredAssets = ['robots.txt', 'favicon.png', 'manifest.json'];
  requiredAssets.forEach(asset => {
    const exists = fs.existsSync(path.join(DIST_DIR, asset)) || fs.existsSync(path.join(PUBLIC_DIR, asset));
    if (exists) {
      addResult('build', 'PASS', `${asset}: Exists ✓`);
    } else {
      addResult('build', 'ERROR', `${asset}: MISSING`);
    }
  });
}

// ═════════════════════════════════════════════════════════════════════════════
//  CHECK 10: Schema.org Structured Data
// ═════════════════════════════════════════════════════════════════════════════
function checkSchema() {
  sectionHeader('10. Schema.org Structured Data');

  const schema = readFileIfExists('src/components/Schema.astro');
  if (!schema) {
    addResult('schema', 'ERROR', 'Schema.astro not found');
    return;
  }

  const requiredSchemas = [
    { name: 'WebApplication', check: 'WebApplication' },
    { name: 'WebSite', check: 'WebSite' },
    { name: 'Organization', check: 'Organization' },
    { name: 'BreadcrumbList', check: 'BreadcrumbList' },
    { name: 'FAQPage', check: 'FAQPage' },
    { name: 'SoftwareApplication', check: 'SoftwareApplication' },
  ];

  requiredSchemas.forEach(({ name, check }) => {
    if (schema.includes(check)) {
      addResult('schema', 'PASS', `${name} schema exists ✓`);
    } else {
      addResult('schema', 'ERROR', `${name} schema missing`);
    }
  });

  // Check noindex suppression for device/FAQ schemas
  if (schema.includes('!noindex') && schema.includes('faqSchemaItems')) {
    addResult('schema', 'PASS', 'FAQ/Device schemas suppressed on noindex pages ✓');
  } else {
    addResult('schema', 'WARN', 'FAQ/Device schemas may not be suppressed on noindex pages');
  }

  // Check for breadcrumb trailing slash issues
  if (schema.includes('currentPath + "/"') || schema.includes('currentPath}/')) {
    addResult('schema', 'ERROR', 'Breadcrumb schema items use trailing slashes - conflicts with trailingSlash: never');
  } else {
    addResult('schema', 'PASS', 'Breadcrumb schema URLs have no trailing slash issues ✓');
  }

  // Verify in dist
  if (fs.existsSync(DIST_DIR)) {
    const indexHtml = readFileIfExists(path.join(DIST_DIR, 'index.html'));
    if (indexHtml) {
      const schemaBlocks = (indexHtml.match(/application\/ld\+json/g) || []).length;
      if (schemaBlocks >= 4) {
        addResult('schema', 'PASS', `index.html: ${schemaBlocks} JSON-LD schema blocks found ✓`);
      } else {
        addResult('schema', 'WARN', `index.html: Only ${schemaBlocks} JSON-LD blocks (expected ≥4)`);
      }
    }
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  CHECK 11: Source Code Quality
// ═════════════════════════════════════════════════════════════════════════════
function checkSourceCode() {
  sectionHeader('11. Source Code Quality');

  // Check 404.astro for missing description prop
  const page404 = readFileIfExists('src/pages/404.astro');
  if (page404) {
    // 404.astro may delegate to NotFound.astro which includes the description
    if (page404.includes('description=') || page404.includes('NotFound')) {
      // If using NotFound, verify NotFound.astro has description
      const notFound = readFileIfExists('src/components/NotFound.astro');
      if (notFound && notFound.includes('description=')) {
        addResult('source', 'PASS', '404.astro: Uses NotFound component with description prop ✓');
      } else if (page404.includes('description=')) {
        addResult('source', 'PASS', '404.astro: Has description prop ✓');
      } else {
        addResult('source', 'WARN', '404.astro: Uses NotFound but NotFound may lack description prop');
      }
    } else {
      addResult('source', 'ERROR', '404.astro: Missing "description" prop on Layout component');
      if (FLAG_FIX) {
        try {
          const fixed = page404.replace(
            '<Layout title="404 - Page Not Found">',
            '<Layout title="404 - Page Not Found" description="The page you are looking for could not be found.">'
          );
          if (fixed !== page404) {
            fs.writeFileSync('src/pages/404.astro', fixed, 'utf8');
            addResult('source', 'FIXED', '404.astro: Added missing description prop');
          }
        } catch (e) {
          addResult('source', 'WARN', `Could not auto-fix 404.astro: ${e.message}`);
        }
      }
    }
  }

  // Check for deprecated ViewTransitions import
  const layout = readFileIfExists('src/layouts/Layout.astro');
  if (layout) {
    if (layout.includes("import { ViewTransitions }")) {
      addResult('source', 'WARN', 'Layout.astro: Uses deprecated "ViewTransitions" import (use ClientRouter instead in Astro 5+)');
    } else {
      addResult('source', 'PASS', 'Layout.astro: No deprecated imports ✓');
    }

    // Check for og:url matching canonical
    if (layout.includes('og:url') && layout.includes('currentPageURL')) {
      addResult('source', 'PASS', 'Layout.astro: og:url uses computed page URL ✓');
    }
  }

  // Check index.astro for import issues
  const indexPage = readFileIfExists('src/pages/index.astro');
  if (indexPage) {
    if (indexPage.includes('getTranslations')) {
      addResult('source', 'ERROR', 'index.astro: Imports "getTranslations" but should use "useTranslations"');
      if (FLAG_FIX) {
        try {
          const fixed = indexPage.replace('getTranslations', 'useTranslations');
          fs.writeFileSync('src/pages/index.astro', fixed, 'utf8');
          addResult('source', 'FIXED', 'index.astro: Fixed getTranslations → useTranslations');
        } catch (e) {
          addResult('source', 'WARN', `Could not auto-fix index.astro: ${e.message}`);
        }
      }
    } else {
      addResult('source', 'PASS', 'index.astro: Correct imports ✓');
    }
  }

  // Check for hardcoded domain consistency
  const filesToCheckDomain = [
    'src/components/SEOConfig.astro',
    'src/components/Schema.astro',
    'src/layouts/Layout.astro',
    'astro.config.mjs',
  ];

  let domainConsistent = true;
  filesToCheckDomain.forEach(file => {
    const content = readFileIfExists(file);
    if (content && content.includes('savetik-fast.xyz')) {
      // OK - consistent domain
    } else if (content && (content.includes('savesnapfast') && !file.includes('wrangler'))) {
      addResult('source', 'WARN', `${file}: May have domain inconsistency (savesnapfast vs savetik-fast.xyz)`);
      domainConsistent = false;
    }
  });
  if (domainConsistent) {
    addResult('source', 'PASS', 'Domain references are consistent (savetik-fast.xyz) ✓');
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  CHECK 12: Page Parity (Root vs [lang])
// ═════════════════════════════════════════════════════════════════════════════
function checkPageParity() {
  sectionHeader('12. Page Parity (Root vs [lang])');

  const pagesDir = 'src/pages';
  const langDir = 'src/pages/[lang]';

  if (!fs.existsSync(pagesDir) || !fs.existsSync(langDir)) {
    addResult('parity', 'ERROR', 'Pages directories not found');
    return;
  }

  const rootPages = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.astro') && f !== '404.astro' && f !== 'sitemap.xml.ts')
    .map(f => f.replace('.astro', ''));

  const langPages = fs.readdirSync(langDir)
    .filter(f => f.endsWith('.astro'))
    .map(f => f.replace('.astro', ''));

  // Root pages should have lang equivalents
  rootPages.forEach(page => {
    if (page === 'index') return; // index handled by [lang]/index.astro
    if (langPages.includes(page) || page === '[device]') {
      addResult('parity', 'PASS', `/${page}: Has [lang] equivalent ✓`);
    } else {
      addResult('parity', 'ERROR', `/${page}: Missing [lang]/${page}.astro - will 404 for non-English users!`);
    }
  });

  // Check for extra [lang] pages without root
  langPages.forEach(page => {
    if (page === 'index' || page === '[device]') return;
    if (!rootPages.includes(page)) {
      addResult('parity', 'WARN', `[lang]/${page}: Has no English root equivalent`);
    }
  });
}

// ═════════════════════════════════════════════════════════════════════════════
//  CHECK BONUS: Translated Legal Page Canonicals (dist verification)
// ═════════════════════════════════════════════════════════════════════════════
function checkTranslatedLegalCanonicals() {
  sectionHeader('B. Translated Legal Page Canonicals');

  if (!fs.existsSync(DIST_DIR)) {
    addResult('legal-canonical', 'WARN', 'Dist not found - skipping');
    return;
  }

  const tests = [
    { path: 'ar/about.html', expected: `${SITE_ORIGIN}/about` },
    { path: 'fr/privacy.html', expected: `${SITE_ORIGIN}/privacy` },
    { path: 'es/terms.html', expected: `${SITE_ORIGIN}/terms` },
    { path: 'de/contact.html', expected: `${SITE_ORIGIN}/contact` },
    { path: 'it/dmca.html', expected: `${SITE_ORIGIN}/dmca` },
    { path: 'tr/disclaimer.html', expected: `${SITE_ORIGIN}/disclaimer` },
  ];

  tests.forEach(({ path: relPath, expected }) => {
    const filePath = path.join(DIST_DIR, relPath);
    const html = readFileIfExists(filePath);
    if (!html) {
      addResult('legal-canonical', 'WARN', `${relPath}: Not found in dist`);
      return;
    }

    const match = html.match(/rel="canonical" href="([^"]+)"/);
    if (!match) {
      addResult('legal-canonical', 'ERROR', `${relPath}: No canonical tag`);
    } else if (match[1] === expected) {
      addResult('legal-canonical', 'PASS', `${relPath}: Canonical → ${expected} ✓`);
    } else {
      addResult('legal-canonical', 'ERROR', `${relPath}: Canonical is "${match[1]}", expected "${expected}"`);
    }
  });
}

// ═════════════════════════════════════════════════════════════════════════════
//  MAIN EXECUTION
// ═════════════════════════════════════════════════════════════════════════════
function main() {
  const startTime = Date.now();

  if (!FLAG_REPORT) {
    console.log(`\n${C.bgBlue}${C.white}${C.bold} 🩺 SITE DOCTOR - SaveTikFast Comprehensive Auditor ${C.reset}`);
    console.log(`${C.dim}   Mode: ${FLAG_FIX ? 'AUDIT + AUTO-FIX' : 'AUDIT ONLY'}${C.reset}`);
    console.log(`${C.dim}   Site: ${SITE_ORIGIN}${C.reset}`);
    console.log(`${C.dim}   Time: ${new Date().toISOString()}${C.reset}`);
  }

  // Run all checks
  checkSEOCanonical();
  checkHreflang();
  checkNoindex();
  checkRobotsTxt();
  checkSitemap();
  checkRedirects();
  checkTranslations();
  checkInternalLinks();
  checkBuildOutput();
  checkSchema();
  checkSourceCode();
  checkPageParity();
  checkTranslatedLegalCanonicals();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  if (FLAG_REPORT) {
    // JSON output
    console.log(JSON.stringify({
      site: SITE_ORIGIN,
      timestamp: new Date().toISOString(),
      duration: `${elapsed}s`,
      summary: {
        total: results.totalChecks,
        passed: results.passed,
        errors: results.errors,
        warnings: results.warnings,
        fixed: results.fixed,
      },
      checks: results.checks,
    }, null, 2));
  } else {
    // Summary
    console.log(`\n${C.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
    console.log(`${C.bold}  📊 AUDIT SUMMARY${C.reset}`);
    console.log(`${C.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
    console.log(`  ${C.bold}Total checks:${C.reset}  ${results.totalChecks}`);
    console.log(`  ${C.green}✓ Passed:${C.reset}      ${results.passed}`);
    console.log(`  ${C.red}✗ Errors:${C.reset}      ${results.errors}`);
    console.log(`  ${C.yellow}⚠ Warnings:${C.reset}    ${results.warnings}`);
    if (FLAG_FIX) {
      console.log(`  ${C.magenta}🔧 Fixed:${C.reset}      ${results.fixed}`);
    }
    console.log(`  ${C.dim}⏱ Duration:    ${elapsed}s${C.reset}`);
    console.log();

    if (results.errors === 0 && results.warnings === 0) {
      console.log(`  ${C.bgGreen}${C.white}${C.bold} ✨ ALL CHECKS PASSED - Site is healthy! ✨ ${C.reset}`);
    } else if (results.errors === 0) {
      console.log(`  ${C.bgYellow}${C.bold} ⚠ No errors, but ${results.warnings} warnings to review ${C.reset}`);
    } else {
      console.log(`  ${C.bgRed}${C.white}${C.bold} 🚨 ${results.errors} ERRORS FOUND - Action required ${C.reset}`);
      if (!FLAG_FIX) {
        console.log(`  ${C.dim}Run with --fix flag to attempt auto-repairs${C.reset}`);
      }
    }
    console.log();
  }

  // Exit with error code if issues found
  if (results.errors > 0) {
    process.exitCode = 1;
  }
}

main();
