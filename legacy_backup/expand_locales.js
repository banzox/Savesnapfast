const fs = require('fs');
const path = require('path');

const NEW_LANGS = [
    'af', 'sq', 'am', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg',
    'ca', 'ceb', 'ny', 'zh-TW', 'co', 'hr', 'eo', 'et', 'tl', 'gl',
    'ka', 'gu', 'ht', 'ha', 'haw', 'iw', 'hmn', 'is', 'ig', 'ga',
    'jw', 'kn', 'kk', 'km', 'ku', 'ky', 'lo', 'la', 'lv', 'lt',
    'lb', 'mk', 'mg', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne',
    'ps', 'fa', 'pa', 'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si',
    'sl', 'so', 'su', 'sw', 'tg', 'ta', 'te', 'ur', 'uz', 'cy',
    'xh', 'yi', 'yo', 'zu'
];

const localesDir = path.join(__dirname, 'locales');
const enPath = path.join(localesDir, 'en.json');
const enContent = fs.readFileSync(enPath, 'utf8');

NEW_LANGS.forEach(lang => {
    const filePath = path.join(localesDir, `${lang}.json`);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, enContent, 'utf8');
        console.log(`Created ${lang}.json`);
    } else {
        console.log(`Skipped ${lang}.json (exists)`);
    }
});

console.log('Done expanding locales.');
