
const languages = {
    "en": "English",
    "ar": "Arabic",
    "fr": "French",
    // Partial list for testing
};
const defaultLang = 'en';

function getPathForLanguage(pathname, targetLang) {
    // 1. Identify current language prefix in path
    const segments = pathname.split("/").filter(Boolean);
    let cleanSegments = segments;

    // Check if first segment is a known non-default language
    if (
        segments.length > 0 &&
        segments[0] in languages &&
        segments[0] !== defaultLang
    ) {
        cleanSegments = segments.slice(1);
    }

    // Reconstruct path without language
    const cleanPath = "/" + cleanSegments.join("/");

    // 2. Add new prefix
    let newPath;
    if (targetLang === defaultLang) {
        newPath = cleanPath === "//" ? "/" : cleanPath; // Handle root edge case
    } else {
        newPath = `/${targetLang}${cleanPath === "/" ? "" : cleanPath}`;
    }

    // 3. Append query parameters (if any)
    // return newPath + search; // Ignoring search for this test
    return newPath;
}

// Test Cases
const testPaths = [
    '/mp3',
    '/story',
    '/ar/mp3',
    '/fr/story',
    '/'
];

const targets = ['en', 'ar', 'fr'];

console.log("Running Routing Tests...\n");

testPaths.forEach(path => {
    console.log(`Current Path: ${path}`);
    targets.forEach(target => {
        const result = getPathForLanguage(path, target);
        console.log(`  -> Switch to ${target}: ${result}`);
    });
    console.log("---");
});
