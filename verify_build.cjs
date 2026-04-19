const fs = require('fs');
const distDir = './dist';

console.log('=== BUILD OUTPUT VERIFICATION ===\n');

// Check directory format pages
const checkPaths = ['mp3', 'about', 'privacy', 'terms', 'contact', 'dmca', 'disclaimer', 'blog', 'tools'];
checkPaths.forEach(p => {
  const dirFormat = fs.existsSync(distDir + '/' + p + '/index.html');
  const fileFormat = fs.existsSync(distDir + '/' + p + '.html');
  const status = dirFormat ? 'OK (directory)' : fileFormat ? 'WARN (file.html)' : 'NOT FOUND';
  console.log('/' + p + ': ' + status);
});

// Check lang pages
console.log('\nLang pages /ar/:');
['', 'mp3', 'about', 'disclaimer'].forEach(p => {
  const pathToCheck = p ? distDir + '/ar/' + p + '/index.html' : distDir + '/ar/index.html';
  const exists = fs.existsSync(pathToCheck);
  console.log('  /ar/' + p + ': ' + (exists ? 'OK' : 'MISSING'));
});

// Check canonical
console.log('\nCanonical + hreflang check (/mp3/index.html):');
const mp3Html = fs.readFileSync(distDir + '/mp3/index.html', 'utf8');

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
  console.log('Total sitemap URLs:', urls.length);
}

console.log('\n=== VERIFICATION COMPLETE ===');
