
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.resolve(__dirname, '../src/locales/locales');

// The 30 Supported Languages + 'tl' (for Filipino)
const KEEP_LANGS = [
    'en.json', 'ar.json', 'es.json', 'pt.json', 'id.json',
    'fr.json', 'de.json', 'it.json', 'tr.json', 'ru.json',
    'vi.json', 'th.json', 'ja.json', 'ko.json', 'pl.json',
    'nl.json', 'ro.json', 'ms.json', 'tl.json', 'uk.json',
    'cs.json', 'sv.json', 'hu.json', 'el.json', 'da.json',
    'fi.json', 'no.json', 'bg.json', 'zh.json', 'hi.json'
];

function cleanup() {
    console.log("Scanning for extra languages...");
    const files = fs.readdirSync(LOCALES_DIR);
    let deletedCount = 0;

    files.forEach(file => {
        if (!KEEP_LANGS.includes(file)) {
            const filePath = path.join(LOCALES_DIR, file);
            fs.unlinkSync(filePath);
            console.log(`Deleted: ${file}`);
            deletedCount++;
        } else {
            console.log(`Kept: ${file}`);
        }
    });

    console.log(`\nCleanup complete. Deleted ${deletedCount} files.`);
    console.log(`Remaining files: ${fs.readdirSync(LOCALES_DIR).length}`);
}

cleanup();
