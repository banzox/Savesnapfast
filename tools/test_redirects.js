import assert from 'node:assert/strict';
import { getCanonicalRedirect } from '../src/utils/redirects.ts';

const cases = [
    // 1. Compound legacy language + legacy slug with .html
    { input: 'https://savetik-fast.xyz/tl/about-us.html', expected: '/fil/about' },
    { input: 'https://savetik-fast.xyz/tl/contact-us.html', expected: '/fil/contact' },
    { input: 'https://savetik-fast.xyz/tl/privacy-policy.html', expected: '/fil/privacy' },
    { input: 'https://savetik-fast.xyz/tl/terms-of-service.html', expected: '/fil/terms' },
    { input: 'https://savetik-fast.xyz/tl/disclaimer-policy.html', expected: '/fil/disclaimer' },
    { input: 'https://savetik-fast.xyz/tl/dmca-policy.html', expected: '/fil/dmca' },

    // 2. English legacy language + legacy slug with .html
    { input: 'https://savetik-fast.xyz/en/about-us.html', expected: '/about' },
    { input: 'https://savetik-fast.xyz/en/contact-us.html', expected: '/contact' },
    { input: 'https://savetik-fast.xyz/en/privacy-policy.html', expected: '/privacy' },

    // 3. Root legacy slug with .html
    { input: 'https://savetik-fast.xyz/about-us.html', expected: '/about' },
    { input: 'https://savetik-fast.xyz/contact-us.html', expected: '/contact' },

    // 4. Index.html stripping
    { input: 'https://savetik-fast.xyz/index.html', expected: '/' },
    { input: 'https://savetik-fast.xyz/tl/index.html', expected: '/fil' },
    { input: 'https://savetik-fast.xyz/en/index.html', expected: '/' },
    { input: 'https://savetik-fast.xyz/ar/index.html', expected: '/ar' },

    // 5. Language aliases and language switcher pairs
    { input: 'https://savetik-fast.xyz/tl', expected: '/fil' },
    { input: 'https://savetik-fast.xyz/tl/', expected: '/fil' },
    { input: 'https://savetik-fast.xyz/en', expected: '/' },
    { input: 'https://savetik-fast.xyz/en/', expected: '/' },
    { input: 'https://savetik-fast.xyz/ar/tl.html', expected: '/fil' },
    { input: 'https://savetik-fast.xyz/tl/ar.html', expected: '/ar' },
    { input: 'https://savetik-fast.xyz/tl/en.html', expected: '/' },

    // 6. Query-string language normalization
    { input: 'https://savetik-fast.xyz/?lang=tl', expected: '/fil' },
    { input: 'https://savetik-fast.xyz/?lang=en', expected: '/' },
    { input: 'https://savetik-fast.xyz/?lang=es', expected: '/es' },

    // 7. Trailing slash normalization
    { input: 'https://savetik-fast.xyz/ar/', expected: '/ar' },
    { input: 'https://savetik-fast.xyz/es/mp3/', expected: '/es/mp3' },

    // 8. Already canonical URLs (should return null)
    { input: 'https://savetik-fast.xyz/', expected: null },
    { input: 'https://savetik-fast.xyz/ar', expected: null },
    { input: 'https://savetik-fast.xyz/fil/about', expected: null },
    { input: 'https://savetik-fast.xyz/about', expected: null },
    { input: 'https://savetik-fast.xyz/mp3', expected: null },
];

let passed = 0;
for (const { input, expected } of cases) {
    const url = new URL(input);
    const result = getCanonicalRedirect(url);
    assert.equal(result, expected, `Failed for input: ${input} (got: ${result}, expected: ${expected})`);
    passed++;
}

console.log(`✓ All ${passed} redirect test cases passed successfully!`);
