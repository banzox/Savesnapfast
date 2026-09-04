const fs = require('fs');
const cheerio = require('cheerio');

const sitemaps = ['./dist/sitemap.xml', './dist/sitemap-0.xml'];
let hasError = false;

for (const sm of sitemaps) {
  if (!fs.existsSync(sm)) {
    console.error(`Missing file: ${sm}`);
    hasError = true;
    continue;
  }
  const raw = fs.readFileSync(sm, 'utf8');
  try {
    const $ = cheerio.load(raw, { xmlMode: true });
    const urls = $('url');
    console.log(`[PASS] ${sm} parsed successfully with ${urls.length} <url> entries.`);
    if (urls.length !== 520) {
      console.error(`[FAIL] Expected 520 URLs, got ${urls.length}`);
      hasError = true;
    }
  } catch (err) {
    console.error(`[ERROR] Parsing XML failed for ${sm}:`, err.message);
    hasError = true;
  }
}

if (hasError) process.exit(1);
console.log('XML validation completed with 0 errors.');

