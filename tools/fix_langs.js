
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.resolve(__dirname, '../src/locales/locales');
const EN_PATH = path.join(LOCALES_DIR, 'en.json');

function flattenKeys(obj, prefix = '') {
    let keys = {};
    for (const k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            Object.assign(keys, flattenKeys(obj[k], prefix + k + '.'));
        } else {
            keys[prefix + k] = obj[k];
        }
    }
    return keys;
}

function unflatten(data) {
    if (Object(data) !== data || Array.isArray(data)) return data;
    var result = {}, cur, prop, parts, idx;
    for (var p in data) {
        cur = result, prop = "";
        parts = p.split(".");
        for (var i = 0; i < parts.length; i++) {
            idx = !isNaN(parseInt(parts[i]));
            cur = cur[prop] || (cur[prop] = (idx ? [] : {}));
            prop = parts[i];
        }
        cur[prop] = data[p];
    }
    return result[""];
}

// Simple deep merge helper
function setDeep(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
}

function fix() {
    console.log("Starting Language Fixer...");

    if (!fs.existsSync(EN_PATH)) {
        console.error("Critical: en.json not found!");
        return;
    }

    const enContent = JSON.parse(fs.readFileSync(EN_PATH, 'utf-8'));
    const enFlattened = flattenKeys(enContent);
    const enKeys = Object.keys(enFlattened);

    const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json') && f !== 'en.json');

    files.forEach(file => {
        const filePath = path.join(LOCALES_DIR, file);
        try {
            let content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const langFlattened = flattenKeys(content);
            const langKeys = new Set(Object.keys(langFlattened));

            let addedCount = 0;

            enKeys.forEach(key => {
                if (!langKeys.has(key)) {
                    // Missing key! Add it with English value
                    setDeep(content, key, enFlattened[key]);
                    addedCount++;
                }
            });

            if (addedCount > 0) {
                console.log(`[${file}] Added ${addedCount} missing keys.`);
                fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
            } else {
                console.log(`[${file}] No missing keys.`);
            }

        } catch (e) {
            console.error(`Error processing ${file}: ${e.message}`);
        }
    });

    console.log("\nFix complete. All languages now have full key coverage (using English fallbacks).");
}

fix();
