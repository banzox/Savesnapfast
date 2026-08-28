const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

console.log('=== VALIDATING SITEMAP.XML & SITEMAP-0.XML ===\n');

const sitemapsToCheck = ['dist/sitemap.xml', 'dist/sitemap-0.xml'];

let totalErrors = 0;

sitemapsToCheck.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] File not found: ${filePath}`);
    totalErrors++;
    return;
  }

  const rawXml = fs.readFileSync(filePath, 'utf8');

  // Check XML Declaration
  if (!rawXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    console.error(`[ERROR] ${filePath}: Missing standard XML declaration header`);
    totalErrors++;
  } else {
    console.log(`[OK] ${filePath}: Standard XML declaration present`);
  }

  // Check root urlset & namespaces
  if (!rawXml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"') ||
      !rawXml.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"')) {
    console.error(`[ERROR] ${filePath}: Missing standard or xhtml namespaces in <urlset>`);
    totalErrors++;
  } else {
    console.log(`[OK] ${filePath}: Root <urlset> namespaces valid`);
  }

  const $ = cheerio.load(rawXml, { xmlMode: true });
  const urlNodes = $('url');

  console.log(`[INFO] ${filePath}: Found ${urlNodes.length} <url> entries`);

  if (urlNodes.length !== 520) {
    console.error(`[ERROR] ${filePath}: Expected 520 URLs, found ${urlNodes.length}`);
    totalErrors++;
  } else {
    console.log(`[OK] ${filePath}: Exactly 520 URLs present`);
  }

  let fileErrors = 0;
  const seenLocs = new Set();

  urlNodes.each((i, el) => {
    const loc = $(el).find('loc').text().trim();
    const lastmod = $(el).find('lastmod').text().trim();
    const xhtmlLinks = $(el).find('xhtml\\:link, link');

    if (!loc) {
      console.error(`  [ERROR] Entry #${i} is missing <loc>`);
      fileErrors++;
    } else {
      if (seenLocs.has(loc)) {
        console.error(`  [ERROR] Duplicate <loc> found: ${loc}`);
        fileErrors++;
      }
      seenLocs.add(loc);

      if (!loc.startsWith('https://savetik-fast.xyz')) {
        console.error(`  [ERROR] Invalid origin on <loc>: ${loc}`);
        fileErrors++;
      }

      if (loc !== 'https://savetik-fast.xyz/' && loc.endsWith('/')) {
        console.error(`  [ERROR] Trailing slash on <loc>: ${loc}`);
        fileErrors++;
      }
    }

    if (!lastmod || !/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) {
      console.error(`  [ERROR] Invalid <lastmod> on ${loc}: "${lastmod}"`);
      fileErrors++;
    }

    if (xhtmlLinks.length === 0) {
      console.error(`  [ERROR] No <xhtml:link> alternates on ${loc}`);
      fileErrors++;
    }
  });

  if (fileErrors === 0) {
    console.log(`[OK] ${filePath}: All 520 entries passed strict schema, lastmod, and xhtml link validation!`);
  } else {
    totalErrors += fileErrors;
  }
  console.log('');
});

console.log(`=== VALIDATION COMPLETE: Total errors = ${totalErrors} ===`);
process.exit(totalErrors === 0 ? 0 : 1);
