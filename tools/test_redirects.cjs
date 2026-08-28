const { getCanonicalRedirect } = require('../src/utils/redirects.ts');

// We can test redirects logic with various input URLs
const testUrls = [
  'https://savetik-fast.xyz/en',
  'https://savetik-fast.xyz/en/',
  'https://savetik-fast.xyz/en/mp3',
  'https://savetik-fast.xyz/en/mp3.html',
  'https://savetik-fast.xyz/tl',
  'https://savetik-fast.xyz/tl/mp3',
  'https://savetik-fast.xyz/ar/',
  'https://savetik-fast.xyz/ar/mp3/',
  'https://savetik-fast.xyz/mp3.html',
  'https://savetik-fast.xyz/ar/mp3.html',
  'https://savetik-fast.xyz/about-us',
  'https://savetik-fast.xyz/ar/about-us',
  'https://savetik-fast.xyz/ar/en.html',
  'https://savetik-fast.xyz/?lang=ar',
  'https://savetik-fast.xyz/?lang=tl',
  'https://savetik-fast.xyz/?lang=en',
  'https://savetik-fast.xyz/index.html',
  'https://savetik-fast.xyz/ar/index.html',
  'https://savetik-fast.xyz/blog/best-time-to-post-on-tiktok-2026.html',
  'https://savetik-fast.xyz/ar/blog/best-time-to-post-on-tiktok-2026-ar.html'
];

console.log('Testing Canonical Redirects:');
testUrls.forEach(u => {
  const urlObj = new URL(u);
  const dest = getCanonicalRedirect(urlObj);
  console.log(`${u} -> ${dest}`);
  
  // Test second hop to ensure no loops
  if (dest) {
    const secondHopUrl = new URL(dest, u);
    const secondDest = getCanonicalRedirect(secondHopUrl);
    if (secondDest !== null) {
      console.error(`  [LOOP/CHAIN ERROR] Second hop occurred: ${secondHopUrl} -> ${secondDest}`);
    }
  }
});
