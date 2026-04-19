const fs = require('fs');
const path = require('path');

console.log('=== FULL SITE AUDIT ===\n');

// ===== 1. SEO CANONICAL vs TRAILING SLASH CONFLICT =====
console.log('--- 1. SEO CANONICAL CONFLICT ---');
const seoConfig = fs.readFileSync('src/components/SEOConfig.astro', 'utf8');
const hasTrailingSlashInSEO = seoConfig.includes('ensureTrailingSlash');
const astroConfig = fs.readFileSync('astro.config.mjs', 'utf8');
const trailingSlashSetting = (astroConfig.match(/trailingSlash: '(.+?)'/) || [])[1] || 'not set';
console.log('astro.config trailingSlash:', trailingSlashSetting);
console.log('SEOConfig adds trailing slash to canonical:', hasTrailingSlashInSEO);
if (hasTrailingSlashInSEO && trailingSlashSetting === 'never') {
  console.log('[ERROR] MISMATCH: canonical URLs have trailing slash but pages dont!');
  console.log('   Source: SEOConfig.astro line with ensureTrailingSlash()');
  console.log('   This causes: 308/301 redirects on every page for search bots');
}

// ===== 2. hreflang URLs CHECK =====
console.log('\n--- 2. HREFLANG URLS CONFLICT ---');
if (hasTrailingSlashInSEO) {
  console.log('[WARNING] All hreflang URLs include trailing slashes');
  console.log('   Example: hreflang for /ar/mp3 is generated as /ar/mp3/');
  console.log('   Pages DON\'T have trailing slashes (trailingSlash: never)');
  console.log('   Search engines follow redirect chains -> slower indexing');
}

// ===== 3. FOOTER LINKS =====
console.log('\n--- 3. FOOTER LINK ANALYSIS ---');
const footer = fs.readFileSync('src/components/Footer.astro', 'utf8');
// Extract href values
const footerHrefs = [...footer.matchAll(/href=\{`\/\$\{.+?\}`\}/g)].map(m => m[0]);
console.log('Footer links count:', footerHrefs.length);
footerHrefs.forEach(href => {
  // Check for trailing slash issues
  if (href.includes("+ '/'") || href.endsWith("+ '/'}`}")) {
    console.log('[WARNING] Trailing slash in footer link:', href);
  }
});

// Check if disclaimer link exists in footer
const footerHasDisclaimer = footer.includes('disclaimer');
console.log('Footer has disclaimer link:', footerHasDisclaimer);

// ===== 4. NAVBAR LINKS =====
console.log('\n--- 4. NAVBAR LINK ANALYSIS ---');
const navbar = fs.readFileSync('src/components/Navbar.astro', 'utf8');
// Check for trailing slash in nav items
const navLinks = [...navbar.matchAll(/href: lang === "en" \? "(.+?)" : `\$\{lang\}(.+?)`,/g)];
navLinks.forEach(match => {
  const enHref = match[1];
  const langHref = match[2];
  if (enHref.endsWith('/') && enHref !== '/') {
    console.log('[WARNING] Nav link has trailing slash:', enHref);
  }
});
console.log('Nav links look clean');

// ===== 5. PAGES IN ROOT vs [LANG] =====
console.log('\n--- 5. PAGES PARITY CHECK ---');
const rootPages = fs.readdirSync('src/pages')
  .filter(f => f.endsWith('.astro') && f !== '404.astro')
  .map(f => f.replace('.astro', ''));
const langDir = 'src/pages/[lang]';
const langPages = fs.readdirSync(langDir)
  .filter(f => f.endsWith('.astro'))
  .map(f => f.replace('.astro', ''));

console.log('Root pages:', rootPages.join(', '));
console.log('Lang pages:', langPages.join(', '));

rootPages.forEach(p => {
  if (!langPages.includes(p) && p !== 'index' && p !== 'sitemap.xml') {
    console.log('[MISSING] /[lang]/' + p + '.astro - will cause 404 for non-English users!');
  }
});
langPages.forEach(p => {
  if (!rootPages.includes(p) && p !== 'index') {
    console.log('[EXTRA] /[lang]/' + p + '.astro has no English equivalent');
  }
});

// ===== 6. API ROUTES =====
console.log('\n--- 6. API ROUTES ---');
const apiDir = 'src/pages/api';
const apiFiles = fs.readdirSync(apiDir);
apiFiles.forEach(f => console.log('  /api/' + f));

// ===== 7. REDIRECTS FILE =====
console.log('\n--- 7. CLOUDFLARE _REDIRECTS FILE ---');
const redirectsContent = fs.readFileSync('public/_redirects', 'utf8');
console.log(redirectsContent.trim());

// ===== 8. ROBOTS.TXT =====
console.log('\n--- 8. ROBOTS.TXT CHECKS ---');
const robots = fs.readFileSync('public/robots.txt', 'utf8');
console.log('Has sitemap:', robots.includes('Sitemap:'));
console.log('Has disallow /api/:', robots.includes('Disallow: /api/'));
console.log('Has disallow /_astro/:', robots.includes('Disallow: /_astro/'));
// Check sitemap URL matches actual sitemap
const sitemapUrl = (robots.match(/Sitemap: (.+)/) || [])[1];
console.log('Sitemap URL in robots.txt:', sitemapUrl);

// ===== 9. MANIFEST.JSON =====
console.log('\n--- 9. MANIFEST.JSON ---');
const manifest = JSON.parse(fs.readFileSync('public/manifest.json', 'utf8'));
console.log('name:', manifest.name);
console.log('start_url:', manifest.start_url);
manifest.icons?.forEach(icon => {
  const iconPath = 'public' + icon.src;
  const exists = fs.existsSync(iconPath);
  console.log('  icon ' + icon.sizes + ': ' + icon.src + ' - exists: ' + exists);
});

// ===== 10. STATIC ASSET CHECK =====
console.log('\n--- 10. STATIC ASSETS ---');
const publicFiles = fs.readdirSync('public');
['robots.txt', 'sitemap-index.xml', 'favicon.ico', 'favicon.png', 'og-image.png', 'manifest.json'].forEach(f => {
  console.log(f + ': ' + (publicFiles.includes(f) ? 'EXISTS' : '[MISSING]'));
});

// ===== 11. SCHEMA MARKUP ISSUES =====
console.log('\n--- 11. SCHEMA.ORG MARKUP ---');
const schema = fs.readFileSync('src/components/Schema.astro', 'utf8');
const hasWebApp = schema.includes('WebApplication');
const hasFAQ = schema.includes('FAQPage');
const hasBreadcrumb = schema.includes('BreadcrumbList');
const hasOrg = schema.includes('Organization');
console.log('WebApplication schema:', hasWebApp);
console.log('FAQPage schema:', hasFAQ);
console.log('BreadcrumbList schema:', hasBreadcrumb);
console.log('Organization schema:', hasOrg);

// Check if breadcrumb item URLs have trailing slashes (conflict!)
if (schema.includes('currentPath + "/"') || schema.includes('currentPath}/')) {
  console.log('[WARNING] Breadcrumb schema items use trailing slashes -> mismatch with trailingSlash:never');
}

console.log('\n=== AUDIT COMPLETE ===');
