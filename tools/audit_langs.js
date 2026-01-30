
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to locales
const LOCALES_DIR = path.resolve(__dirname, '../src/locales/locales');
const EN_PATH = path.join(LOCALES_DIR, 'en.json');

// Supported languages (extracted manually from ui.ts logic for simplicity, or we can audit all files in dir)
// The user asked to check "missing languages or problems", so let's check ALL files found in the dir against EN.
const SUPPORTED_LANGS = [
    "ar", "es", "pt", "id", "fr", "de", "it", "tr", "ru", "vi", "th", "ja", "ko",
    "pl", "nl", "ro", "ms", "fil", "uk", "cs", "sv", "hu", "el", "da", "fi", "no",
    "bg", "zh", "hi" // + en
];

function flattenKeys(obj, prefix = '') {
    let keys = [];
    for (const k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            keys = keys.concat(flattenKeys(obj[k], prefix + k + '.'));
        } else {
            keys.push(prefix + k);
        }
    }
    return keys;
}

function audit() {
    console.log("Starting Language Audit...");

    if (!fs.existsSync(EN_PATH)) {
        console.error("Critical: en.json not found!");
        return;
    }

    const enContent = JSON.parse(fs.readFileSync(EN_PATH, 'utf-8'));
    const enKeys = new Set(flattenKeys(enContent));

    console.log(`English (Source) Keys: ${enKeys.size}`);

    const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json') && f !== 'en.json');

    let issuesFound = 0;

    files.forEach(file => {
        const langCode = file.replace('.json', '');

        // Optional: Filter to only the 30 supported langs if desired, but checking all is safer.
        // if (!SUPPORTED_LANGS.includes(langCode) && langCode !== 'tl') return; 

        const filePath = path.join(LOCALES_DIR, file);
        try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const langKeys = new Set(flattenKeys(content));

            const missing = [];
            for (const key of enKeys) {
                if (!langKeys.has(key)) {
                    missing.push(key);
                }
            }

            if (missing.length > 0) {
                console.log(`\n[${langCode}] Missing ${missing.length} keys:`);
                // Print first 5 missing keys
                missing.slice(0, 10).forEach(k => console.log(`  - ${k}`));
                if (missing.length > 10) console.log(`  ... and ${missing.length - 10} more.`);

                // Specific checks for critical sections
                const missingCritical = missing.filter(k =>
                    k.includes('mp3_page') ||
                    k.includes('slideshow_page') ||
                    k.includes('story_page') ||
                    k.includes('download_zip')
                );

                if (missingCritical.length > 0) {
                    console.log(`  !! CRITICAL MISSING: mp3/story/slideshow sections incomplete.`);
                }

                issuesFound++;
            }

        } catch (e) {
            console.error(`Error parsing ${file}: ${e.message}`);
        }
    });

    if (issuesFound === 0) {
        console.log("\nAll languages are complete!");
    } else {
        console.log(`\nAudit complete. Found issues in ${issuesFound} languages.`);
    }
}

audit();
