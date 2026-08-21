/**
 * 🩺 LIVE SITE & EDGE DIAGNOSTICS SUITE
 * Fast, comprehensive live probe for savetik-fast.xyz
 * Tests Cloudflare Edge, SSL, Googlebot Crawler response, Robots.txt, and Sitemaps.
 */

const https = require('https');

const DOMAIN = 'savetik-fast.xyz';
const BASE_URL = `https://${DOMAIN}`;

const GOOGLEBOT_UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': options.userAgent || CHROME_UA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...options.headers
      },
      timeout: 10000
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out after 10000ms'));
    });

    req.end();
  });
}

async function runLiveDiagnostics() {
  console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║ 🌐 SAVESNAPFAST / SAVETIKFAST - LIVE EDGE & SEO DIAGNOSTIC AUDIT           ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');
  console.log(` Target Domain: ${BASE_URL}`);
  console.log(` Timestamp:     ${new Date().toISOString()}\n`);

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function assert(condition, message, details = '') {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  \x1b[32m✓ [PASS]\x1b[0m ${message}`);
    } else {
      failedTests++;
      console.log(`  \x1b[31m✗ [FAIL]\x1b[0m ${message} ${details ? `\x1b[33m(${details})\x1b[0m` : ''}`);
    }
  }

  // 1. Live Homepage Probe (Standard Browser)
  console.log('━━━ 1. Live Apex Homepage & Cloudflare Edge ━━━');
  try {
    const res = await fetchUrl(BASE_URL);
    assert(res.statusCode === 200, `Homepage HTTP status is 200 OK`, `Received: ${res.statusCode}`);
    assert(res.headers['server'] && res.headers['server'].toLowerCase().includes('cloudflare'), `Served through Cloudflare Edge`, `Server: ${res.headers['server']}`);
    assert(res.headers['strict-transport-security'], `HSTS Security header active`, `HSTS present`);
    assert(res.headers['cf-ray'], `Cloudflare CF-Ray rayID confirmed`, `RayID: ${res.headers['cf-ray']}`);
    assert(res.body.includes('SaveTikFast') || res.body.includes('TikTok') || res.body.includes('<!DOCTYPE html>'), `HTML payload contains valid page content`);
  } catch (err) {
    assert(false, `Failed to reach homepage`, err.message);
  }

  // 2. Googlebot Crawler Simulation Probe
  console.log('\n━━━ 2. Googlebot & Search Crawler Accessibility (WAF Check) ━━━');
  try {
    const resBot = await fetchUrl(BASE_URL, { userAgent: GOOGLEBOT_UA });
    assert(resBot.statusCode === 200, `Googlebot receives HTTP 200 OK (No WAF block or challenge)`, `Received: ${resBot.statusCode}`);
    assert(!resBot.body.includes('Just a moment...') && !resBot.body.includes('cf-browser-verification'), `Googlebot is not blocked by Cloudflare Challenge / Bot Fight Mode`);
    assert(resBot.body.includes('<link rel="canonical"') || resBot.body.includes('rel="canonical"'), `Prerendered HTML contains canonical tag for Googlebot`);
    assert(resBot.body.includes('hreflang='), `Prerendered HTML contains hreflang multilingual tags`);
  } catch (err) {
    assert(false, `Googlebot crawler request failed`, err.message);
  }

  // 3. Robots.txt & Sitemap Inspection
  console.log('\n━━━ 3. Robots.txt & Sitemap XML Integrity ━━━');
  try {
    const resRobots = await fetchUrl(`${BASE_URL}/robots.txt`);
    assert(resRobots.statusCode === 200, `robots.txt is accessible (200 OK)`, `Received: ${resRobots.statusCode}`);
    assert(resRobots.body.includes('Allow: /'), `robots.txt allows search crawlers`);
    assert(resRobots.body.includes('Sitemap:'), `robots.txt declares primary sitemap`);
    assert(resRobots.body.includes('Allow: /_astro/'), `robots.txt allows CSS/JS assets (_astro)`);

    const resSitemap = await fetchUrl(`${BASE_URL}/sitemap.xml`);
    assert(resSitemap.statusCode === 200, `sitemap.xml is accessible (200 OK)`, `Received: ${resSitemap.statusCode}`);
    assert(resSitemap.headers['content-type'] && resSitemap.headers['content-type'].includes('xml'), `sitemap.xml serves valid XML Content-Type`);
    assert(resSitemap.body.includes('<url>') || resSitemap.body.includes('<sitemap>'), `sitemap.xml contains structured URL entries`);
  } catch (err) {
    assert(false, `Robots/Sitemap check failed`, err.message);
  }

  // 4. Multilingual Localized Routes Probe
  console.log('\n━━━ 4. Multilingual Subpaths Live Probe ━━━');
  const testPaths = ['/ar', '/es/mp3', '/de/tools', '/fr/privacy'];
  for (const path of testPaths) {
    try {
      const resPath = await fetchUrl(`${BASE_URL}${path}`, { userAgent: GOOGLEBOT_UA });
      assert(resPath.statusCode === 200, `Localized route '${path}' returns 200 OK`, `Status: ${resPath.statusCode}`);
    } catch (err) {
      assert(false, `Localized route '${path}' failed`, err.message);
    }
  }

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(` 📊 LIVE AUDIT RESULTS SUMMARY`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(` Total Assertions: ${totalTests}`);
  console.log(` \x1b[32m✓ Passed:\x1b[0m         ${passedTests}`);
  console.log(` \x1b[31m✗ Failed:\x1b[0m         ${failedTests}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  if (failedTests === 0) {
    console.log(' \x1b[32m✨ ALL LIVE SYSTEM CHECKS PASSED PERFECTLY - SITE IS LIVE & FULLY INDEXABLE! ✨\x1b[0m\n');
  } else {
    console.log(' \x1b[31m⚠️ SOME LIVE SYSTEM CHECKS FAILED - PLEASE REVIEW LOGS ABOVE! ⚠️\x1b[0m\n');
  }
}

runLiveDiagnostics().catch(console.error);
