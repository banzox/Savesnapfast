const fs = require('fs');
const path = require('path');

const localesDir = 'src/locales/locales';
const enPath = path.join(localesDir, 'en.json');

// Read English source
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Helper to flatten object keys
function flattenKeys(obj, prefix = '') {
    let keys = {};
    for (const k in obj) {
        const newKey = prefix ? `${prefix}.${k}` : k;
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            Object.assign(keys, flattenKeys(obj[k], newKey));
        } else {
            keys[newKey] = obj[k];
        }
    }
    return keys;
}

const enKeys = flattenKeys(enData);
const missingReport = {};

// Scan all files
fs.readdirSync(localesDir).forEach(file => {
    if (file === 'en.json') return;

    const lang = file.replace('.json', '');
    const data = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'));
    const langKeys = flattenKeys(data);

    missingReport[lang] = {
        missing: [],
        identicalToEnglish: []
    };

    // Check against English keys
    for (const key in enKeys) {
        if (langKeys[key] === undefined) {
            missingReport[lang].missing.push(key);
        } else if (langKeys[key] === enKeys[key] && enKeys[key].length > 5) { // Ignore short words that might be same
            missingReport[lang].identicalToEnglish.push(key);
        }
    }
});

// Output report
let totalMissing = 0;
let totalIdentical = 0;

for (const lang in missingReport) {
    const missingCount = missingReport[lang].missing.length;
    const identicalCount = missingReport[lang].identicalToEnglish.length;

    if (missingCount > 0 || identicalCount > 50) { // Only show if significant issues
        console.log(`\n[${lang}]`);
        if (missingCount > 0) console.log(`  - Missing Keys: ${missingCount}`);
        if (identicalCount > 0) console.log(`  - Identical to English: ${identicalCount} (Probable placeholders)`);
        totalMissing += missingCount;
        totalIdentical += identicalCount;
    }
}

console.log(`\nTotal Missing Keys: ${totalMissing}`);
console.log(`Total Identical to English: ${totalIdentical}`);
