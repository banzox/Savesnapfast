const fs = require('fs');
const distDir = './dist';
const locales = ['en', 'ar', 'es', 'pt', 'id', 'fr', 'de', 'it', 'tr', 'ru', 'vi', 'th', 'ja', 'ko', 'pl', 'nl', 'ro', 'ms', 'fil', 'uk', 'cs', 'sv', 'hu', 'el', 'da', 'fi', 'no', 'bg', 'zh', 'hi'];

console.log('=== BUILD OUTPUT VERIFICATION ===\n');

// Check directory format pages
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

const revisit = mp3Html.includes('revisit-after');
console.log('  revisit-after removed:', revisit ? 'NO-STILL THERE' : 'YES-CLEAN');

// Verify disclaimer in footer
const disclaimerInFooter = mp3Html.includes('/disclaimer');
console.log('\nDisclaimer link in page:', disclaimerInFooter ? 'YES' : 'NO');

// Sitemap
const sitemapExists = fs.existsSync(distDir + '/sitemap-index.xml');
console.log('\nSitemap generated:', sitemapExists ? 'YES' : 'NO');
if (sitemapExists) {
  const sitemap = fs.readFileSync(distDir + '/sitemap-index.xml', 'utf8');
  const sitemapUrl = (sitemap.match(/<loc>([^<]+)<\/loc>/) || [])[1];
  console.log('First sitemap URL:', sitemapUrl);
}

// Check sitemap-0.xml for trailing slash URLs
const sitemap0 = distDir + '/sitemap-0.xml';
if (fs.existsSync(sitemap0)) {
  const content = fs.readFileSync(sitemap0, 'utf8');
  const urls = [...content.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const withSlash = urls.filter(u => u !== 'https://savetik-fast.xyz/' && u.endsWith('/'));
  console.log('\nSitemap URLs with trailing slash:', withSlash.length > 0 ? withSlash.slice(0,3).join(', ') : 'NONE (GOOD)');
  if (withSlash.length > 0) {
    process.exitCode = 1;
  }
  console.log('Total sitemap URLs:', urls.length);

  // Verify device-specific pages and translated legal pages are excluded
  const devPages = ['ios', 'android', 'mac', 'pc'];
  const legPages = ['about', 'privacy', 'terms', 'contact', 'dmca', 'disclaimer'];
  
  let sitemapViolations = 0;
  urls.forEach(urlStr => {
    const pathname = urlStr.replace('https://savetik-fast.xyz', '');
    const segments = pathname.split('/').filter(Boolean);
    
    // Check for device pages (e.g. /ios or /ar/ios)
    if (segments.length > 0 && devPages.includes(segments[segments.length - 1])) {
      console.log(`  [ERROR] Device page in sitemap: ${urlStr}`);
      sitemapViolations++;
    }
    
    // Check for translated legal pages (e.g. /ar/privacy)
    if (segments.length === 2 && locales.includes(segments[0]) && legPages.includes(segments[1])) {
      console.log(`  [ERROR] Translated legal page in sitemap: ${urlStr}`);
      sitemapViolations++;
    }
  });

  if (sitemapViolations === 0) {
    console.log('  OK: All device pages and translated legal pages are excluded from sitemap.');
  } else {
    process.exitCode = 1;
  }

  // Dynamic checks for thin-content blog listing pages (less than 2 posts)
  const blogDir = './src/content/blog';
  const postCounts = {};
  locales.forEach(l => postCounts[l] = 0);

  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir);
    files.forEach(file => {
      if (!file.endsWith('.md')) return;
      const nameWithoutExt = file.substring(0, file.length - 3);
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

  console.log('\nThin-content blog lists in sitemap check:');
  let thinViolations = 0;
  Object.keys(postCounts).forEach(locale => {
    const count = postCounts[locale];
    if (count < 2) {
      const blogUrl = locale === 'en' 
        ? 'https://savetik-fast.xyz/blog' 
        : `https://savetik-fast.xyz/${locale}/blog`;
      
      if (urls.includes(blogUrl)) {
        console.log(`  [ERROR] Thin-content blog list page for '${locale}' (posts: ${count}) found in sitemap: ${blogUrl}`);
        thinViolations++;
      }
    }
  });
  if (thinViolations === 0) {
    console.log('  OK: All thin-content blog list pages are excluded from the sitemap.');
  } else {
    process.exitCode = 1;
  }
}

// Blog post pages self-referencing hreflang check
const blogPostFiles = [];
if (fs.existsSync(distDir + '/blog')) {
  fs.readdirSync(distDir + '/blog').forEach(f => {
    if (f.endsWith('.html')) {
      blogPostFiles.push(distDir + '/blog/' + f);
    }
  });
}
locales.forEach(l => {
  if (l === 'en') return;
  const pathToCheck = distDir + '/' + l + '/blog';
  if (fs.existsSync(pathToCheck)) {
    fs.readdirSync(pathToCheck).forEach(f => {
      if (f.endsWith('.html')) {
        blogPostFiles.push(pathToCheck + '/' + f);
      }
    });
  }
});

console.log('\nBlog post self-referencing hreflang check:');
let hreflangViolations = 0;
blogPostFiles.forEach(file => {
  const pathParts = file.replace('./dist/', '').replace('dist/', '').split('/');
  let pageLocale = 'en';
  if (pathParts.length > 2 && pathParts[0] !== 'blog') {
    pageLocale = pathParts[0];
  }
  const expectedHreflangAttr = pageLocale;
  const relativePath = file.replace('./dist/', '').replace('dist/', '').replace('.html', '');
  const expectedSelfUrl = 'https://savetik-fast.xyz/' + relativePath;

  if (fs.existsSync(file)) {
    const htmlContent = fs.readFileSync(file, 'utf8');
    const regex = new RegExp(`hreflang="${expectedHreflangAttr}" href="([^"]+)"`);
    const match = htmlContent.match(regex);
    const foundHref = match ? match[1] : null;

    if (!foundHref) {
      console.log(`  [ERROR] No self-referencing hreflang tag found for '${expectedHreflangAttr}' in: ${file}`);
      hreflangViolations++;
    } else if (foundHref !== expectedSelfUrl) {
      console.log(`  [ERROR] Hreflang self-reference mismatch in ${file}:\n    Expected: ${expectedSelfUrl}\n    Found:    ${foundHref}`);
      hreflangViolations++;
    }
  }
});
if (hreflangViolations === 0) {
  console.log('  OK: All blog post pages have correct self-referencing hreflang tags.');
} else {
  process.exitCode = 1;
}

// Check robots.txt for admin, api, query param disallows, _astro allows, and absence of device/legal disallows
const robotsPath = distDir + '/robots.txt';
console.log('\nRobots.txt check:');
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  const requiredRobotsRules = [
    'Disallow: /api/',
    'Disallow: /admin',
    'Disallow: /*?*',
    'Allow: /_astro/',
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
    'Disallow: /*/contact',
    'Disallow: /*/dmca',
    'Disallow: /*/disclaimer'
  ];
  let missingRules = 0;
  requiredRobotsRules.forEach(rule => {
    if (!robotsContent.includes(rule)) {
      console.log(`  [ERROR] robots.txt is missing required rule: ${rule}`);
      missingRules++;
    }
  });
  if (missingRules === 0) {
    console.log('  OK: robots.txt accurately includes all required disallow rules.');
  } else {
    process.exitCode = 1;
  }
} else {
  console.log('  [ERROR] robots.txt not found in build output');
  process.exitCode = 1;
}

// Verification of noindex and hreflang presence on device and translated legal pages
console.log('\nNoindex and hreflang check on excluded pages:');
let exclusionViolations = 0;

// Test paths: a few sample device pages and translated legal pages
const pathsToTest = [
  'ios.html',
  'ar/ios.html',
  'es/android.html',
  'ar/privacy.html',
  'de/terms.html',
  'fr/about.html'
];

pathsToTest.forEach(relPath => {
  const filePath = distDir + '/' + relPath;
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    
    // Verify noindex is present
    const hasNoIndex = html.includes('name="robots" content="noindex, follow"') || html.includes('name="googlebot" content="noindex, follow"');
    if (!hasNoIndex) {
      console.log(`  [ERROR] Page ${relPath} is missing noindex meta tag`);
      exclusionViolations++;
    }
    
    // Verify hreflang IS present across languages (self-referencing & cross-linking)
    const hasHreflang = html.includes('hreflang=');
    if (!hasHreflang) {
      console.log(`  [ERROR] Page ${relPath} is missing hreflang tags`);
      exclusionViolations++;
    }
  } else {
    console.log(`  [WARN] Test page not found: ${relPath}`);
  }
});

if (exclusionViolations === 0) {
  console.log('  OK: Verified noindex meta tag and hreflang presence across sample legal and device pages.');
} else {
  process.exitCode = 1;
}

// Verification of translated legal page self-referencing canonical URLs
console.log('\nTranslated legal page canonical check:');
let legalCanonicalViolations = 0;
const sampleTranslatedLegalPages = [
  { path: 'ar/about.html', expectedCanonical: 'https://savetik-fast.xyz/about' },
  { path: 'fr/privacy.html', expectedCanonical: 'https://savetik-fast.xyz/privacy' },
  { path: 'es/terms.html', expectedCanonical: 'https://savetik-fast.xyz/terms' },
  { path: 'de/contact.html', expectedCanonical: 'https://savetik-fast.xyz/contact' },
  { path: 'it/dmca.html', expectedCanonical: 'https://savetik-fast.xyz/dmca' },
  { path: 'tr/disclaimer.html', expectedCanonical: 'https://savetik-fast.xyz/disclaimer' }
];

sampleTranslatedLegalPages.forEach(({ path: relPath, expectedCanonical }) => {
  const filePath = distDir + '/' + relPath;
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    const match = html.match(/rel="canonical" href="([^"]+)"/);
    if (!match) {
      console.log(`  [ERROR] Page ${relPath} is missing canonical tag`);
      legalCanonicalViolations++;
    } else if (match[1] !== expectedCanonical) {
      console.log(`  [ERROR] Page ${relPath} canonical URL is "${match[1]}", expected "${expectedCanonical}"`);
      legalCanonicalViolations++;
    }
  } else {
    console.log(`  [WARN] Test page not found: ${relPath}`);
  }
});

if (legalCanonicalViolations === 0) {
  console.log('  OK: Translated legal pages correctly set canonical URLs pointing to root English legal pages.');
} else {
  process.exitCode = 1;
}

console.log('\n=== VERIFICATION COMPLETE ===');

