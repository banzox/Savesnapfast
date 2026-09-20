const fs = require('fs');
const assert = require('assert');

console.log('=== RUNNING VERIFY_ALL ===\n');

// 1. Check device tips in different languages
const testLocales = [
  { file: 'dist/de/ios.html', expected: 'Für das beste Erlebnis auf iPhone oder iPad verwenden Sie Safari' },
  { file: 'dist/fr/ios.html', expected: 'Pour une expérience optimale sur iPhone ou iPad, utilisez le navigateur Safari' },
  { file: 'dist/ar/ios.html', expected: 'للحصول على أفضل تجربة على iPhone أو iPad، نوصي باستخدام متصفح Safari' },
  { file: 'dist/ios.html', expected: 'For the best experience on iPhone or iPad, use Safari browser' },
  { file: 'dist/es/android.html', expected: 'En smartphones y tablets Android' },
  { file: 'dist/ja/mac.html', expected: 'Mac（MacBook、iMac）ではSafariやChromeで快適にご利用いただけます' },
  { file: 'dist/tr/pc.html', expected: 'Windows bilgisayarlarda SaveTikFast' }
];

console.log('1. Checking Multilingual Platform Guides:');
for (const tc of testLocales) {
  assert(fs.existsSync(tc.file), `Missing built file: ${tc.file}`);
  const html = fs.readFileSync(tc.file, 'utf8');
  assert(html.includes(tc.expected), `Expected "${tc.expected}" in ${tc.file}`);
  console.log(`  ✓ ${tc.file} contains correct native text`);
}

// 2. Check wrangler.jsonc run_worker_first
console.log('\n2. Checking wrangler.jsonc run_worker_first:');
const wrangler = fs.readFileSync('wrangler.jsonc', 'utf8');
const expectedWorkerRoutes = ['/404', '/404/*', '/404.html', '/admin', '/admin/*', '/ad-*'];
for (const route of expectedWorkerRoutes) {
  assert(wrangler.includes(`"${route}"`), `Missing ${route} in wrangler.jsonc run_worker_first`);
  console.log(`  ✓ ${route} is in run_worker_first`);
}

// 3. Check public/robots.txt
console.log('\n3. Checking public/robots.txt:');
const robots = fs.readFileSync('public/robots.txt', 'utf8');
assert(!robots.includes('Disallow: /ad-native'), 'robots.txt should not disallow /ad-native (Googlebot must see noindex tag)');
assert(!robots.includes('Disallow: /ad-300x250'), 'robots.txt should not disallow /ad-300x250');
assert(robots.includes('Sitemap: https://savetik-fast.xyz/sitemap.xml'), 'robots.txt must declare sitemap.xml');
assert(robots.includes('Sitemap: https://savetik-fast.xyz/sitemap-0.xml'), 'robots.txt must declare sitemap-0.xml');
console.log('  ✓ robots.txt correctly allows ad crawler pass-through for noindex detection');
console.log('  ✓ robots.txt declares sitemaps');

// 4. Check worker/index.ts 404 handling
console.log('\n4. Checking worker/index.ts 404 normalization:');
const workerCode = fs.readFileSync('worker/index.ts', 'utf8');
assert(workerCode.includes('normalizedPath === "/404"'), 'worker/index.ts must handle normalized 404 path');
assert(workerCode.includes('X-Robots-Tag", "noindex, follow"'), 'worker/index.ts must tag 404 with noindex, follow');
assert(workerCode.includes('X-Robots-Tag", "noindex, nofollow"'), 'worker/index.ts must tag admin and ads with noindex, nofollow');
console.log('  ✓ worker/index.ts correctly implements edge status and robots headers');

console.log('\n=== ALL VERIFY_ALL CHECKS PASSED ===\n');
