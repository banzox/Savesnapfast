
const defaultLang = 'en';
const languages = {
    "en": "English",
    "es": "Español",
    "fr": "Français"
};

function getPathForLanguage(pathname, targetLang) {
    let currentPath = pathname;

    // Remove trailing slash for consistency
    if (currentPath.endsWith('/') && currentPath.length > 1) {
        currentPath = currentPath.slice(0, -1);
    }

    // 1. Strip existing language prefix
    let pathNoLang = currentPath;
    const langCodes = Object.keys(languages).filter(k => k !== defaultLang);

    for (const code of langCodes) {
        const prefix = `/${code}`;
        if (pathNoLang === prefix || pathNoLang.startsWith(prefix + '/')) {
            pathNoLang = pathNoLang.slice(prefix.length);
            break;
        }
    }

    if (!pathNoLang.startsWith('/')) pathNoLang = '/' + pathNoLang;

    // 2. Construct New Path
    if (targetLang === defaultLang) {
        return pathNoLang === '/' ? '/' : pathNoLang;
    } else {
        if (pathNoLang === '/') {
            return `/${targetLang}`;
        }
        return `/${targetLang}${pathNoLang}`;
    }
}

// Test Cases
const tests = [
    { path: '/es/mp3', target: 'fr', expected: '/fr/mp3' },
    { path: '/es/mp3', target: 'en', expected: '/mp3' },
    { path: '/mp3', target: 'es', expected: '/es/mp3' },
    { path: '/es', target: 'en', expected: '/' },
    { path: '/', target: 'es', expected: '/es' },
    { path: '/es/story', target: 'fr', expected: '/fr/story' },
];

console.log("Running Tests...");
tests.forEach(t => {
    const result = getPathForLanguage(t.path, t.target);
    const pass = result === t.expected;
    console.log(`[${pass ? 'PASS' : 'FAIL'}] In: ${t.path} -> Target: ${t.target} | Out: ${result} (Exp: ${t.expected})`);
});
