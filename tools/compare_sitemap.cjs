const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) results = results.concat(getFiles(full));
    else results.push(full);
  });
  return results;
}

const all = getFiles('./dist');
const htmls = all.filter(f => f.endsWith('.html'));

const indexableRoutes = [];
htmls.forEach(f => {
  const rel = path.relative('./dist', f).split(path.sep).join('/');
  const content = fs.readFileSync(f, 'utf8');
  const $ = cheerio.load(content);
  const robots = $('meta[name="robots"]').attr('content') || '';
  if (!robots.includes('noindex') && !rel.startsWith('ad-') && !rel.startsWith('admin/')) {
    let route = rel.replace(/\.html$/, '').replace(/\/index$/, '');
    if (route === 'index') route = '';
    const url = route ? `https://savetik-fast.xyz/${route}` : 'https://savetik-fast.xyz/';
    indexableRoutes.push({ rel, route, url });
  }
});

console.log('Total indexable routes in dist:', indexableRoutes.length);

// Check current sitemap.xml
const sitemapContent = fs.readFileSync('./dist/sitemap.xml', 'utf8');
const sitemapUrls = new Set([...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));
console.log('Total URLs in current sitemap.xml:', sitemapUrls.size);

const missingFromSitemap = indexableRoutes.filter(r => !sitemapUrls.has(r.url));
console.log('Missing from sitemap count:', missingFromSitemap.length);
console.log('Sample missing URLs (first 25):', missingFromSitemap.slice(0, 25).map(r => r.url));

const extraInSitemap = [...sitemapUrls].filter(u => !indexableRoutes.some(r => r.url === u));
console.log('Extra in sitemap count (not in dist):', extraInSitemap.length, extraInSitemap);
