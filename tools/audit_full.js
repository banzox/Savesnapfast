
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.resolve(__dirname, '../src/locales/locales');
const EN_PATH = path.join(LOCALES_DIR, 'en.json');
const EN_DATA = JSON.parse(fs.readFileSync(EN_PATH, 'utf-8'));

const TARGET_LANGS = [
    'ar', 'bg', 'cs', 'da', 'de', 'el', 'es', 'fi', 'fr', 'hi',
    'hu', 'id', 'it', 'ja', 'ko', 'ms', 'nl', 'no', 'pl', 'pt',
    'ro', 'ru', 'sv', 'th', 'tl', 'tr', 'uk', 'vi', 'zh'
];

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function check(lang, obj, enObj, pathPrefix = '', report) {
    for (const key in enObj) {
        const fullPath = pathPrefix ? `${pathPrefix}.${key}` : key;

        // Critical sections to check text content
        const criticalSections = ['mp3_page', 'slideshow_page', 'story_page'];
        const isCritical = criticalSections.some(sec => fullPath.startsWith(sec));

        if (!obj || obj[key] === undefined) {
            report.missing.push(fullPath);
        } else if (isObject(enObj[key])) {
            check(lang, obj[key], enObj[key], fullPath, report);
        } else {
            // Text Check: If strictly equal to English AND English length > 5 (to avoid short words like "MP3", "ZIP")
            // And ignore keys that represent IDs or technical names (simplified check)
            if (isCritical && typeof obj[key] === 'string' && obj[key] === enObj[key] && enObj[key].length > 5) {
                // Heuristic: It's likely untranslated if it matches English exactly in these content pages
                // Exception: "Download" might be same in some langs, but usually not exact sentence match.
                report.untranslated.push(fullPath);
            }
        }
    }
}

function checkFaq(lang, obj, enObj, pathPrefix, report) {
    // Specifically check if FAQ array/object exists and has content
    // Assuming structure like mp3_page.faq.q1 ...
    if (!obj || !obj.faq) {
        report.missing_faq.push(pathPrefix);
        return;
    }

    // Check if FAQ content is just English copy
    const enFaq = enObj.faq;
    const langFaq = obj.faq;

    let isEnglishCopy = false;
    let missingKeys = false;

    // Check first question as sample
    if (enFaq.q1 && langFaq.q1 && enFaq.q1 === langFaq.q1) {
        isEnglishCopy = true;
    }

    // Check Q count match roughly
    if (Object.keys(enFaq).length > Object.keys(langFaq).length) {
        missingKeys = true;
    }

    if (isEnglishCopy) report.untranslated_faq.push(pathPrefix);
    if (missingKeys) report.incomplete_faq.push(pathPrefix);
}


function audit() {
    console.log("Starting Audit...");
    const overview = {};

    TARGET_LANGS.forEach(lang => {
        const filePath = path.join(LOCALES_DIR, `${lang}.json`);
        if (!fs.existsSync(filePath)) {
            console.error(`Missing file: ${lang}.json`);
            return;
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const report = {
            missing: [],
            untranslated: [],
            missing_faq: [],
            untranslated_faq: [],
            incomplete_faq: []
        };

        // Recursive key check
        check(lang, data, EN_DATA, '', report);

        // Specific FAQ checks for the 3 pages
        ['mp3_page', 'slideshow_page', 'story_page'].forEach(page => {
            if (EN_DATA[page]) {
                checkFaq(lang, data[page], EN_DATA[page], page, report);
            }
        });

        overview[lang] = report;
    });

    // Output stats
    console.log("Audit Results (Summary):");
    let hasIssues = false;

    for (const [lang, rep] of Object.entries(overview)) {
        const issues = [];
        if (rep.missing.length > 0) issues.push(`${rep.missing.length} missing keys`);
        if (rep.untranslated.length > 0) issues.push(`${rep.untranslated.length} untranslated text`);
        if (rep.missing_faq.length > 0) issues.push(`Missing FAQs: ${rep.missing_faq.join(', ')}`);
        if (rep.untranslated_faq.length > 0) issues.push(`Untranslated FAQs: ${rep.untranslated_faq.join(', ')}`);

        if (issues.length > 0) {
            console.log(`\n[${lang.toUpperCase()}] Issues:`);
            console.log(issues.join('\n'));
            // console.log("Details:", JSON.stringify(rep, null, 2)); // Too verbose for summary
            hasIssues = true;
        }
    }

    if (!hasIssues) {
        console.log("No critical issues found! All languages seem consistent.");
    }

    fs.writeFileSync('audit_results_full.json', JSON.stringify(overview, null, 2));
}

audit();
