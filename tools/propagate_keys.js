const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales/locales');
const enPath = path.join(localesDir, 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Helper to get nested value
function getValue(obj, keyPath) {
    return keyPath.split('.').reduce((o, i) => o ? o[i] : null, obj);
}

// Helper to set nested value
function setValue(obj, keyPath, value) {
    const keys = keyPath.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) current[key] = {};
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
}

// Flatten keys
function flattenKeys(obj, prefix = '') {
    let keys = [];
    for (const k in obj) {
        const newKey = prefix ? `${prefix}.${k}` : k;
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            keys = keys.concat(flattenKeys(obj[k], newKey));
        } else {
            keys.push(newKey);
        }
    }
    return keys;
}

const allKeys = flattenKeys(enData);

fs.readdirSync(localesDir).forEach(file => {
    if (file === 'en.json') return;

    const filePath = path.join(localesDir, file);
    let langData;
    try {
        langData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        console.error(`Error reading ${file}, skipping.`);
        return;
    }

    let modified = false;
    allKeys.forEach(key => {
        const val = getValue(langData, key);
        if (val === undefined) {
            console.log(`[${file}] Missing key: ${key} -> Filling with EN`);
            const enVal = getValue(enData, key);
            setValue(langData, key, enVal);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(langData, null, 2), 'utf8');
        console.log(`Updated ${file}`);
    }
});
console.log('Propagation complete.');
