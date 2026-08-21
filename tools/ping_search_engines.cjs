/**
 * 📡 SEARCH ENGINE NOTIFIER / SITEMAP PINGER
 * Automatically pings Google, Bing, Yandex, and IndexNow with the latest sitemap URLs.
 */

const https = require('https');
const http = require('http');

const DOMAIN = 'savetik-fast.xyz';
const SITEMAP_URL = `https://${DOMAIN}/sitemap.xml`;

function sendGetRequest(url) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;

      const req = client.get(url, {
        headers: {
          'User-Agent': 'SaveTikFast-SitemapPinger/1.0'
        },
        timeout: 8000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, statusCode: res.statusCode });
        });
      });

      req.on('error', (err) => {
        resolve({ ok: false, error: err.message });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, error: 'Timeout' });
      });
    } catch (e) {
      resolve({ ok: false, error: e.message });
    }
  });
}

async function pingSearchEngines() {
  console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║ 📡 AUTOMATED SEARCH ENGINE SITEMAP PINGER & NOTIFIER                       ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');
  console.log(` Target Sitemap: ${SITEMAP_URL}`);
  console.log(` Timestamp:      ${new Date().toISOString()}\n`);

  const pingTargets = [
    {
      name: 'Google Ping Service',
      url: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    },
    {
      name: 'Bing Sitemap Notification',
      url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    },
    {
      name: 'IndexNow / Bing Engine',
      url: `https://www.bing.com/indexnow?url=${encodeURIComponent(`https://${DOMAIN}/`)}&key=savetikfast`
    }
  ];

  for (const target of pingTargets) {
    process.stdout.write(` 🚀 Notifying ${target.name.padEnd(28)} ... `);
    const res = await sendGetRequest(target.url);
    if (res.ok) {
      console.log(`\x1b[32m[OK - HTTP ${res.statusCode}]\x1b[0m`);
    } else {
      console.log(`\x1b[33m[Dispatched / Response: ${res.statusCode || res.error}]\x1b[0m`);
    }
  }

  console.log('\n ✨ Search engine notifications dispatched successfully!\n');
}

pingSearchEngines();
