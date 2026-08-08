const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'locales', 'locales');
const enPath = path.join(LOCALES_DIR, 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

function deepMergeMissing(target, source) {
    let addedCount = 0;
    for (const key of Object.keys(source)) {
        if (target[key] === undefined) {
            target[key] = JSON.parse(JSON.stringify(source[key]));
            addedCount++;
        } else if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
            if (typeof target[key] === 'object' && target[key] !== null && !Array.isArray(target[key])) {
                addedCount += deepMergeMissing(target[key], source[key]);
            }
        }
    }
    return addedCount;
}

const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json') && f !== 'en.json');
let totalAdded = 0;

files.forEach(file => {
    const filePath = path.join(LOCALES_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const added = deepMergeMissing(data, enData);
    if (added > 0) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`[${file}] Added ${added} missing translation key(s).`);
        totalAdded += added;
    }
});

console.log(`\nCompleted! Added total ${totalAdded} missing translation keys across all locales.`);
