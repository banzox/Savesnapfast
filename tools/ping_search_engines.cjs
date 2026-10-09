/**
 * Search engine notifier.
 *
 * - Google retired its sitemap "ping" endpoint (2023) and Bing did the same, so the
 *   old GET /ping calls only ever returned 404/410. Google must be notified through
 *   Search Console (Sitemaps > submit https://savetik-fast.xyz/sitemap.xml).
 * - IndexNow (Bing, Yandex, Seznam, Naver, Yep) is still live. It needs a key file at
 *   https://<host>/<key>.txt (public/savetikfast.txt) and accepts a JSON batch POST.
 *
 * Usage:  node tools/ping_search_engines.cjs [--dry-run]
 */

const DOMAIN = 'savetik-fast.xyz';
const KEY = 'savetikfast';
const KEY_LOCATION = `https://${DOMAIN}/${KEY}.txt`;
const SITEMAP_URL = `https://${DOMAIN}/sitemap.xml`;
const ENDPOINTS = [
  'https://api.indexnow.org/IndexNow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
];
const MAX_PER_REQUEST = 10000;
const DRY_RUN = process.argv.includes('--dry-run');

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SaveTikFast-IndexNow/2.0' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.text();
}

async function main() {
  console.log(`\nIndexNow submission for ${DOMAIN}`);
  console.log(`Timestamp: ${new Date().toISOString()}${DRY_RUN ? ' (dry run)' : ''}\n`);

  // 1. The key file must be reachable and match, otherwise every engine rejects the batch.
  const keyBody = (await fetchText(KEY_LOCATION)).trim();
  if (keyBody !== KEY) {
    console.error(`FAIL key file ${KEY_LOCATION} contains "${keyBody}", expected "${KEY}"`);
    process.exit(1);
  }
  console.log(`OK   key file reachable: ${KEY_LOCATION}`);

  // 2. URL list comes from the live sitemap so it always matches what is deployed.
  const xml = await fetchText(SITEMAP_URL);
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].trim().replaceAll('&amp;', '&'))
    .filter((u) => new URL(u).hostname === DOMAIN);
  const unique = [...new Set(urls)];
  console.log(`OK   ${unique.length} URLs read from ${SITEMAP_URL}\n`);
  if (unique.length === 0) {
    console.error('FAIL sitemap contained no URLs');
    process.exit(1);
  }
  if (DRY_RUN) return;

  let accepted = 0;
  for (const endpoint of ENDPOINTS) {
    let endpointOk = true;
    for (let i = 0; i < unique.length; i += MAX_PER_REQUEST) {
      const batch = unique.slice(i, i + MAX_PER_REQUEST);
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ host: DOMAIN, key: KEY, keyLocation: KEY_LOCATION, urlList: batch }),
          signal: AbortSignal.timeout(20000),
        });
        // 200 = accepted, 202 = accepted pending key validation.
        const ok = res.status === 200 || res.status === 202;
        endpointOk = endpointOk && ok;
        console.log(`${ok ? 'OK  ' : 'FAIL'} ${endpoint} -> HTTP ${res.status} (${batch.length} URLs)`);
      } catch (err) {
        endpointOk = false;
        console.log(`FAIL ${endpoint} -> ${err.message}`);
      }
    }
    if (endpointOk) accepted++;
  }

  console.log(`\n${accepted}/${ENDPOINTS.length} IndexNow endpoints accepted the batch.`);
  console.log('Google is not part of IndexNow: submit the sitemap and request indexing of the');
  console.log('homepage in Search Console (see docs/GSC_RECOVERY_GUIDE.md).\n');
  if (accepted === 0) process.exit(1);
}

main().catch((err) => {
  console.error('FAIL', err.message);
  process.exit(1);
});
