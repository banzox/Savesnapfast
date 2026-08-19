const fs = require('fs');
const distDir = './dist';
const locales = ['en', 'ar', 'es', 'pt', 'id', 'fr', 'de', 'it', 'tr', 'ru', 'vi', 'th', 'ja', 'ko', 'pl', 'nl', 'ro', 'ms', 'fil', 'uk', 'cs', 'sv', 'hu', 'el', 'da', 'fi', 'no', 'bg', 'zh', 'hi'];

console.log('=== BUILD OUTPUT VERIFICATION ===\n');

// Check directory / file format pages
const checkPaths = ['mp3', 'about', 'privacy', 'terms', 'contact', 'dmca', 'disclaimer', 'blog', 'tools'];
checkPaths.forEach(p => {
  const dirFormat = fs.existsSync(distDir + '/' + p + '/index.html');
  const fileFormat = fs.existsSync(distDir + '/' + p + '.html');
  const status = fileFormat ? 'OK (file)' : dirFormat ? 'WARN (directory)' : 'NOT FOUND';
  console.log('/' + p + ': ' + status);
  if (status === 'NOT FOUND' || status.startsWith('WARN')) {
    process.exitCode = 1;
  }
});

// Check lang pages
console.log('\nLang pages /ar/:');
['', 'mp3', 'about', 'disclaimer'].forEach(p => {
  const pathToCheck = p ? distDir + '/ar/' + p + '.html' : distDir + '/ar.html';
  const exists = fs.existsSync(pathToCheck);
  console.log('  /ar/' + p + ': ' + (exists ? 'OK' : 'MISSING'));
  if (!exists) {
    process.exitCode = 1;
  }
});

// Check canonical
console.log('\nCanonical + hreflang check (/mp3.html):');
const mp3Html = fs.readFileSync(distDir + '/mp3.html', 'utf8');

const canonical = (mp3Html.match(/rel="canonical" href="([^"]+)"/) || [])[1];
console.log('  Canonical:', canonical || 'NOT FOUND');
console.log('  Trailing slash:', canonical && canonical !== 'https://savetik-fast.xyz/' && canonical.endsWith('/') ? 'YES-BAD' : 'NO-GOOD');

const hreflangAr = (mp3Html.match(/hreflang="ar" href="([^"]+)"/) || [])[1];
console.log('  hreflang ar:', hreflangAr || 'NOT FOUND');
console.log('  hreflang trailing slash:', hreflangAr && hreflangAr.endsWith('/') ? 'YES-BAD' : 'NO-GOOD');

const ogUrl = (mp3Html.match(/og:url" content="([^"]+)"/) || [])[1];
console.log('  og:url:', ogUrl || 'NOT FOUND');

// Sitemap verification
const sitemapCandidates = ['sitemap-index.xml', 'sitemap.xml', 'sitemap-0.xml'];
const foundSitemaps = sitemapCandidates.filter(f => fs.existsSync(distDir + '/' + f));
const sitemapExists = foundSitemaps.length > 0;
console.log('\nSitemap generated:', sitemapExists ? `YES (${foundSitemaps.join(', ')})` : 'NO');
if (!sitemapExists) {
  process.exitCode = 1;
} else {
  const primarySitemap = distDir + '/' + foundSitemaps[0];
  const sitemap = fs.readFileSync(primarySitemap, 'utf8');
  const sitemapUrl = (sitemap.match(/<loc>([^<]+)<\/loc>/) || [])[1];
  console.log('First sitemap URL:', sitemapUrl);
}

// Check sitemap URLs in sitemap-0.xml or sitemap.xml
const sitemapUrlFile = fs.existsSync(distDir + '/sitemap-0.xml')
  ? distDir + '/sitemap-0.xml'
  : (fs.existsSync(distDir + '/sitemap.xml') ? distDir + '/sitemap.xml' : null);

if (sitemapUrlFile) {
  const content = fs.readFileSync(sitemapUrlFile, 'utf8');
  const urls = [...content.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const withSlash = urls.filter(u => u !== 'https://savetik-fast.xyz/' && u.endsWith('/'));
  console.log('\nSitemap URLs with trailing slash:', withSlash.length > 0 ? withSlash.slice(0,3).join(', ') : 'NONE (GOOD)');
  if (withSlash.length > 0) {
    process.exitCode = 1;
  }
  console.log('Total sitemap URLs:', urls.length);

  // Ensure sitemap URLs use exact domain https://savetik-fast.xyz
  const invalidDomainUrls = urls.filter(u => !u.startsWith('https://savetik-fast.xyz'));
  if (invalidDomainUrls.length > 0) {
    console.log(`  [ERROR] Found ${invalidDomainUrls.length} sitemap URLs with incorrect domain:`, invalidDomainUrls.slice(0, 3));
    process.exitCode = 1;
  } else {
    console.log('  OK: All sitemap URLs use domain https://savetik-fast.xyz');
  }

  // Ensure no /en/ redirected URLs are in sitemap
  const redirectedEnUrls = urls.filter(u => u.includes('savetik-fast.xyz/en/') || u.endsWith('savetik-fast.xyz/en'));
  if (redirectedEnUrls.length > 0) {
    console.log(`  [ERROR] Found redirected /en/ URLs in sitemap:`, redirectedEnUrls);
    process.exitCode = 1;
  } else {
    console.log('  OK: No redirected /en/ URLs in sitemap');
  }
}

// Check robots.txt
const robotsPath = distDir + '/robots.txt';
console.log('\nRobots.txt check:');
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  const hasUserAgent = robotsContent.includes('User-agent: *');
  const hasAllow = robotsContent.includes('Allow: /');
  const hasSitemap = robotsContent.includes('Sitemap: https://savetik-fast.xyz/sitemap.xml') ||
                     robotsContent.includes('Sitemap: https://savetik-fast.xyz/sitemap-index.xml') ||
                     robotsContent.includes('Sitemap: https://savetik-fast.xyz/sitemap-0.xml');
  let missingRules = 0;
  if (!hasUserAgent) {
    console.log('  [ERROR] robots.txt is missing User-agent: *');
    missingRules++;
  }
  if (!hasAllow) {
    console.log('  [ERROR] robots.txt is missing Allow: /');
    missingRules++;
  }
  if (!hasSitemap) {
    console.log('  [ERROR] robots.txt is missing valid Sitemap directive');
    missingRules++;
  }
  if (missingRules === 0) {
    console.log('  OK: robots.txt accurately matches specification.');
  } else {
    process.exitCode = 1;
  }
} else {
  console.log('  [ERROR] robots.txt not found in build output');
  process.exitCode = 1;
}

// Verification that content pages have index, follow and NO noindex
console.log('\nIndexing check on content pages:');
let indexingViolations = 0;

const pathsToTest = [
  'index.html',
  'ios.html',
  'ar/ios.html',
  'es/android.html',
  'ar/privacy.html',
  'de/terms.html',
  'fr/about.html',
  'ar/blog.html'
];

pathsToTest.forEach(relPath => {
  const filePath = distDir + '/' + relPath;
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    
    // Verify noindex is NOT present
    const hasNoIndex = html.includes('content="noindex, follow"') || html.includes('content="noindex"');
    if (hasNoIndex) {
      console.log(`  [ERROR] Page ${relPath} unexpectedly has noindex meta tag`);
      indexingViolations++;
    }

    // Verify index, follow IS present
    const hasIndex = html.includes('index, follow');
    if (!hasIndex) {
      console.log(`  [ERROR] Page ${relPath} missing index, follow meta tag`);
      indexingViolations++;
    }
    
    // Verify hreflang IS present
    const hasHreflang = html.includes('hreflang=');
    if (!hasHreflang) {
      console.log(`  [ERROR] Page ${relPath} is missing hreflang tags`);
      indexingViolations++;
    }
  } else {
    console.log(`  [WARN] Test page not found: ${relPath}`);
  }
});

if (indexingViolations === 0) {
  console.log('  OK: All content pages are set to index, follow with full hreflang tags.');
} else {
  process.exitCode = 1;
}

// Verification of self-referencing canonical URLs
console.log('\nSelf-referencing canonical check:');
let canonicalViolations = 0;
const sampleCanonicalPages = [
  { path: 'ar/about.html', expectedCanonical: 'https://savetik-fast.xyz/ar/about' },
  { path: 'fr/privacy.html', expectedCanonical: 'https://savetik-fast.xyz/fr/privacy' },
  { path: 'es/terms.html', expectedCanonical: 'https://savetik-fast.xyz/es/terms' },
  { path: 'de/contact.html', expectedCanonical: 'https://savetik-fast.xyz/de/contact' },
  { path: 'ar/ios.html', expectedCanonical: 'https://savetik-fast.xyz/ar/ios' },
  { path: 'ios.html', expectedCanonical: 'https://savetik-fast.xyz/ios' }
];

sampleCanonicalPages.forEach(({ path: relPath, expectedCanonical }) => {
  const filePath = distDir + '/' + relPath;
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    const match = html.match(/rel="canonical" href="([^"]+)"/);
    if (!match) {
      console.log(`  [ERROR] Page ${relPath} is missing canonical tag`);
      canonicalViolations++;
    } else if (match[1] !== expectedCanonical) {
      console.log(`  [ERROR] Page ${relPath} canonical URL is "${match[1]}", expected "${expectedCanonical}"`);
      canonicalViolations++;
    }
  } else {
    console.log(`  [WARN] Test page not found: ${relPath}`);
  }
});

if (canonicalViolations === 0) {
  console.log('  OK: All pages set clean self-referencing canonical URLs.');
} else {
  process.exitCode = 1;
}

console.log('\n=== VERIFICATION COMPLETE ===');
