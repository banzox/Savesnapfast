import fs from 'fs';
import path from 'path';

const legacyLocalesDir = 'c:/Users/newFUTURE/Desktop/xmax2/Savesnapfast/legacy_backup/locales';
const outputFile = 'c:/Users/newFUTURE/Desktop/xmax2/Savesnapfast/src/i18n/ui.ts';

// Map of language codes to their native names (simplified subset, will fallback to code if unknown)
// This list should be ideally comprehensive, but I will do my best for the files present.
const langNames = {
    en: "English", ar: "العربية", cs: "Čeština", de: "Deutsch", el: "Ελληνικά",
    es: "Español", fr: "Français", hi: "हिन्दी", hu: "Magyar", id: "Bahasa Indonesia",
    it: "Italiano", ja: "日本語", ko: "한국어", ms: "Bahasa Melayu", nl: "Nederlands",
    pl: "Polski", pt: "Português", ro: "Română", ru: "Русский", sv: "Svenska",
    th: "ไทย", tr: "Türkçe", vi: "Tiếng Việt", zh: "中文", "zh-TW": "繁體中文",
    uk: "Українська", ur: "اردو", tl: "Tagalog", fa: "فارسی", bn: "বাংলা",
    // Add more as needed or use code
};

function flattenObject(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
}

const files = fs.readdirSync(legacyLocalesDir).filter(f => f.endsWith('.json'));

let languagesObj = {};
let uiObj = {};

files.forEach(file => {
    const code = file.replace('.json', '');
    const content = fs.readFileSync(path.join(legacyLocalesDir, file), 'utf8');
    try {
        const json = JSON.parse(content);
        languagesObj[code] = langNames[code] || code.toUpperCase(); // Fallback to code if name missing
        uiObj[code] = flattenObject(json);
    } catch (e) {
        console.error(`Error parsing ${file}:`, e);
    }
});

// Construct the TS file content
const fileContent = `export const languages = ${JSON.stringify(languagesObj, null, 2)};

export const defaultLang = 'en';

export const ui = ${JSON.stringify(uiObj, null, 2)} as const;
`;

fs.writeFileSync(outputFile, fileContent);
console.log(`Successfully generated ui.ts with ${Object.keys(languagesObj).length} languages.`);
