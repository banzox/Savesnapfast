const fs = require('fs');
const path = require('path');

const DIST_DIR = path.resolve('dist');
const DOMAIN = 'https://savetik-fast.xyz';

console.log('=== STARTING EMPIRICAL DEEP SCAN OF DIST/ ===');

// Helper to get all files recursively in a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

const allDistFiles = getAllFiles(DIST_DIR);
const relativeDistFiles = new Set(allDistFiles.map(f => path.relative(DIST_DIR, f).replace(/\\/g, '/')));

console.log(`Total files in dist: ${relativeDistFiles.size}`);

// Build a map of valid internal paths
// e.g. "mp3" -> dist/mp3.html
// "ar/mp3" -> dist/ar/mp3.html
// "favicon.png" -> dist/favicon.png
// "index.html" / "" -> dist/index.html
function isValidPath(urlPath) {
  // Strip domain if present
  let p = urlPath;
  if (p.startsWith(DOMAIN)) {
    p = p.substring(DOMAIN.length);
  }
  // Strip hash or query string
  p = p.split('#')[0].split('?')[0];

  if (!p || p === '/') return relativeDistFiles.has('index.html');

  // Strip leading slash
  if (p.startsWith('/')) p = p.substring(1);

  // If exact file exists (e.g. assets/style.css, favicon.png)
  if (relativeDistFiles.has(p)) return true;

  // If file with .html extension exists (e.g. mp3 -> mp3.html)
  if (relativeDistFiles.has(p + '.html')) return true;

  // If index.html exists in subdirectory (e.g. tools -> tools/index.html)
  if (relativeDistFiles.has(p + '/index.html')) return true;
  if (p.endsWith('/') && relativeDistFiles.has(p.slice(0, -1) + '.html')) return true;
  if (p.endsWith('/') && relativeDistFiles.has(p + 'index.html')) return true;

  return false;
}

// 1. Scan HTML files for links & assets
const htmlFiles = allDistFiles.filter(f => f.endsWith('.html'));
console.log(`Scanning ${htmlFiles.length} HTML files...`);

let brokenInternalLinks = [];
let trailingSlashAnomalies = [];
let missingAssets = [];
let hreflangIssues = [];
let canonicalIssues = [];
let metaOgIssues = [];

const hrefRegex = /href=["']([^"']+)["']/g;
const srcRegex = /src=["']([^"']+)["']/g;
const srcsetRegex = /srcset=["']([^"']+)["']/g;
const canonicalRegex = /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/g;
const hreflangRegex = /<link[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["']/g;

htmlFiles.forEach(filePath => {
  const relPath = path.relative(DIST_DIR, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');

  // HREFLANG Scan
  let match;
  const hRefMatches = [...content.matchAll(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["'][^>]*hreflang=["']([^"']+)["']/g),
                       ...content.matchAll(/<link[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["']/g)];
  for (const m of hRefMatches) {
    const href = m[1].includes('http') ? m[1] : m[2];
    const lang = m[1].includes('http') ? m[2] : m[1];
    
    // Check if hreflang target exists
    if (!isValidPath(href)) {
      hreflangIssues.push({ page: relPath, hreflang: lang, href, reason: 'Target page does not exist in dist/' });
    }
    // Trailing slash check on hreflang
    if (href !== DOMAIN + '/' && href.endsWith('/')) {
      hreflangIssues.push({ page: relPath, hreflang: lang, href, reason: 'Trailing slash anomaly in hreflang URL' });
    }
  }

  // CANONICAL Scan
  const canMatch = [...content.matchAll(canonicalRegex)];
  for (const m of canMatch) {
    const href = m[1];
    if (!isValidPath(href)) {
      canonicalIssues.push({ page: relPath, href, reason: 'Canonical target does not exist in dist/' });
    }
    if (href !== DOMAIN + '/' && href.endsWith('/')) {
      canonicalIssues.push({ page: relPath, href, reason: 'Trailing slash anomaly in canonical URL' });
    }
  }

  // HREF Links scan
  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1];

    // Ignore external links, mailto, tel, javascript, hash-only
    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (href.startsWith(DOMAIN)) {
        // Domain internal link
        const pathname = href.substring(DOMAIN.length);
        if (pathname !== '/' && pathname.endsWith('/')) {
          trailingSlashAnomalies.push({ page: relPath, href });
        }
        if (!isValidPath(href)) {
          brokenInternalLinks.push({ page: relPath, href });
        }
      }
      continue;
    }
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || href.startsWith('javascript:')) {
      continue;
    }

    // Relative / Root internal link
    if (href.startsWith('/')) {
      if (href.endsWith('.css') || href.endsWith('.js') || href.endsWith('.png') || href.endsWith('.svg') || href.endsWith('.jpg') || href.endsWith('.ico') || href.endsWith('.webp') || href.endsWith('.json') || href.endsWith('.xml')) {
        if (!isValidPath(href)) {
          missingAssets.push({ page: relPath, asset: href });
        }
      } else {
        if (href !== '/' && href.endsWith('/')) {
          trailingSlashAnomalies.push({ page: relPath, href });
        }
        if (!isValidPath(href)) {
          brokenInternalLinks.push({ page: relPath, href });
        }
      }
    }
  }

  // SRC Scan
  while ((match = srcRegex.exec(content)) !== null) {
    const src = match[1];
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) continue;
    if (src.startsWith('/')) {
      if (!isValidPath(src)) {
        missingAssets.push({ page: relPath, asset: src });
      }
    }
  }
});

// 2. Scan Sitemap XML files
console.log('\n--- SITEMAP XML ANALYSIS ---');
const xmlFiles = allDistFiles.filter(f => f.endsWith('.xml'));
let invalidSitemapUrls = [];
let trailingSlashSitemapUrls = [];

xmlFiles.forEach(xmlPath => {
  const relPath = path.relative(DIST_DIR, xmlPath).replace(/\\/g, '/');
  const xmlContent = fs.readFileSync(xmlPath, 'utf8');
  const locMatches = [...xmlContent.matchAll(/<loc>([^<]+)<\/loc>/g)];

  locMatches.forEach(m => {
    const locUrl = m[1];
    if (locUrl.startsWith(DOMAIN)) {
      if (locUrl !== DOMAIN + '/' && locUrl.endsWith('/')) {
        trailingSlashSitemapUrls.push({ sitemap: relPath, url: locUrl });
      }
      if (!isValidPath(locUrl)) {
        invalidSitemapUrls.push({ sitemap: relPath, url: locUrl });
      }
    }
  });
});

// 3. Scan 404 Page (404.html)
console.log('\n--- 404 PAGE & LOCALIZATION CHECK ---');
let page404Issues = [];
if (relativeDistFiles.has('404.html')) {
  const path404 = path.join(DIST_DIR, '404.html');
  const content404 = fs.readFileSync(path404, 'utf8');
  console.log('404.html exists in dist.');

  // Check language links in 404
  const langLinkMatches = [...content404.matchAll(/href=["']([^"']+)["']/g)];
  for (const m of langLinkMatches) {
    const href = m[1];
    if (href.startsWith('/') && !href.endsWith('.css') && !href.endsWith('.js') && !href.endsWith('.png')) {
      if (!isValidPath(href)) {
        page404Issues.push({ page: '404.html', link: href, issue: 'Broken link on 404 page' });
      }
      if (href !== '/' && href.endsWith('/')) {
        page404Issues.push({ page: '404.html', link: href, issue: 'Trailing slash on 404 page link' });
      }
    }
  }
} else {
  page404Issues.push({ page: '404.html', issue: '404.html does not exist in dist root!' });
}

// Print Summary Report
console.log('\n=== SCAN RESULTS SUMMARY ===');
console.log(`Broken Internal Links: ${brokenInternalLinks.length}`);
brokenInternalLinks.forEach(item => console.log(`  [BROKEN LINK] Page: ${item.page} -> Href: ${item.href}`));

console.log(`Trailing Slash Anomalies in HTML: ${trailingSlashAnomalies.length}`);
trailingSlashAnomalies.slice(0, 10).forEach(item => console.log(`  [TRAILING SLASH] Page: ${item.page} -> Href: ${item.href}`));

console.log(`Missing Asset References: ${missingAssets.length}`);
missingAssets.forEach(item => console.log(`  [MISSING ASSET] Page: ${item.page} -> Asset: ${item.asset}`));

console.log(`Hreflang Issues: ${hreflangIssues.length}`);
hreflangIssues.forEach(item => console.log(`  [HREFLANG] Page: ${item.page} (${item.hreflang}) -> ${item.href} Reason: ${item.reason}`));

console.log(`Canonical Issues: ${canonicalIssues.length}`);
canonicalIssues.forEach(item => console.log(`  [CANONICAL] Page: ${item.page} -> ${item.href} Reason: ${item.reason}`));

console.log(`Invalid Sitemap URLs: ${invalidSitemapUrls.length}`);
invalidSitemapUrls.forEach(item => console.log(`  [INVALID SITEMAP URL] ${item.sitemap} -> ${item.url}`));

console.log(`Sitemap Trailing Slash URLs: ${trailingSlashSitemapUrls.length}`);
trailingSlashSitemapUrls.forEach(item => console.log(`  [SITEMAP TRAILING SLASH] ${item.sitemap} -> ${item.url}`));

console.log(`404 Page Issues: ${page404Issues.length}`);
page404Issues.forEach(item => console.log(`  [404 ISSUE] ${item.issue} (Detail: ${item.link || ''})`));

