
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales/locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const missing = [];

files.forEach(file => {
    try {
        const filePath = path.join(localesDir, file);
        const data = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(data);

        if (!json.slideshow_page) {
            missing.push(file);
        }
    } catch (err) {
        console.error(`Error reading ${file}: ${err.message}`);
    }
});

console.log(JSON.stringify(missing));
