
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales/locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const missingDocs = [];

files.forEach(file => {
    try {
        const content = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'));
        if (!content.slideshow_page) {
            missingDocs.push(file);
        }
    } catch (e) {
        console.error(`Error reading ${file}:`, e.message);
    }
});

console.log('Files missing slideshow_page:');
console.log(missingDocs.join(', '));
if (missingDocs.length === 0) {
    console.log('All files have slideshow_page!');
}
