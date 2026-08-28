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

let stats = {
  total: htmls.length,
  indexable: 0,
  noindex: 0,
  noindexFiles: [],
  missingCanonical: 0,
  missingCanonicalFiles: [],
  canonicalMismatch: 0,
  canonicalMismatchFiles: [],
  hreflangCounts: {},
  routesBySection: {}
};

htmls.forEach(f => {
  const rel = path.relative('./dist', f).split(path.sep).join('/');
  const content = fs.readFileSync(f, 'utf8');
  const $ = cheerio.load(content);
  
  const robots = $('meta[name="robots"]').attr('content') || '';
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const hreflangs = $('link[rel="alternate"][hreflang]').length;
  
  const isNoindex = robots.includes('noindex');
  if (isNoindex) {
    stats.noindex++;
    stats.noindexFiles.push(rel);
  } else {
    stats.indexable++;
  }
  
  if (!canonical) {
    stats.missingCanonical++;
    stats.missingCanonicalFiles.push(rel);
  } else {
    let expectedPath = rel.replace(/\.html$/, '').replace(/\/index$/, '');
    if (expectedPath === 'index') expectedPath = '';
    const expectedCanonical = expectedPath ? `https://savetik-fast.xyz/${expectedPath}` : 'https://savetik-fast.xyz/';
    if (canonical !== expectedCanonical) {
      stats.canonicalMismatch++;
      stats.canonicalMismatchFiles.push({ rel, canonical, expectedCanonical });
    }
  }

  const section = rel.includes('/') ? rel.split('/')[0] : 'root';
  stats.routesBySection[section] = (stats.routesBySection[section] || 0) + 1;
});

console.log(JSON.stringify(stats, null, 2));
