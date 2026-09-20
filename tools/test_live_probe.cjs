const https = require('https');

const paths = [
  '/',
  '/404',
  '/404.html',
  '/admin',
  '/ad-native',
  '/ios',
  '/ar/ios',
  '/blog/best-time-to-post-on-tiktok-2026',
  '/ar/blog/best-time-to-post-on-tiktok-2026-ar'
];

async function checkPath(p) {
  return new Promise((resolve) => {
    https.get('https://savetik-fast.xyz' + p, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const robotsMeta = (data.match(/<meta[^>]*name=["']robots["'][^>]*>/i) || [])[0] || 'none';
        const title = (data.match(/<title>([^<]*)<\/title>/i) || [])[1] || '';
        resolve({
          path: p,
          status: res.statusCode,
          xRobotsTag: res.headers['x-robots-tag'] || 'none',
          robotsMeta,
          title
        });
      });
    }).on('error', (err) => {
      resolve({ path: p, error: err.message });
    });
  });
}

async function run() {
  for (const p of paths) {
    const res = await checkPath(p);
    console.log(JSON.stringify(res, null, 2));
  }
}

run();
