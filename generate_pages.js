/**
 * Generate 30 language folders with index.html, mp3.html, story.html
 * Run with: node generate_pages.js
 */

const fs = require('fs');
const path = require('path');

// All 30 languages
const languages = [
    'ar', 'cs', 'da', 'de', 'el', 'es', 'fi', 'fr', 'he', 'hi',
    'hu', 'id', 'it', 'ja', 'ko', 'ms', 'nl', 'no', 'pl', 'pt',
    'ro', 'ru', 'sk', 'sv', 'th', 'tr', 'uk', 'vi', 'zh'
];

// RTL languages
const rtlLanguages = ['ar', 'he'];

// Read template files
const indexTemplate = fs.readFileSync('index.html', 'utf8');
const mp3Template = fs.readFileSync('mp3.html', 'utf8');
const storyTemplate = fs.readFileSync('story.html', 'utf8');

console.log('='.repeat(50));
console.log('Generating language folders...');
console.log('='.repeat(50));

let created = 0;

languages.forEach(lang => {
    const langDir = path.join(__dirname, lang);

    // Create folder if not exists
    if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir, { recursive: true });
    }

    // Determine if RTL
    const isRTL = rtlLanguages.includes(lang);
    const htmlLang = isRTL ? `<html lang="${lang}" dir="rtl">` : `<html lang="${lang}">`;

    // Process each template
    const templates = [
        { name: 'index.html', content: indexTemplate },
        { name: 'mp3.html', content: mp3Template },
        { name: 'story.html', content: storyTemplate }
    ];

    templates.forEach(tmpl => {
        let content = tmpl.content;

        // Update html lang attribute
        content = content.replace(/<html lang="en">/, htmlLang);

        // Update base href to point to root
        content = content.replace(/<base href="\/">/, '<base href="/">');

        // Update canonical URL
        content = content.replace(
            /href="https:\/\/savetik-fast\.xyz\/"/g,
            `href="https://savetik-fast.xyz/${lang}/"`
        );
        content = content.replace(
            /href="https:\/\/savetik-fast\.xyz\/mp3\.html"/,
            `href="https://savetik-fast.xyz/${lang}/mp3.html"`
        );
        content = content.replace(
            /href="https:\/\/savetik-fast\.xyz\/story\.html"/,
            `href="https://savetik-fast.xyz/${lang}/story.html"`
        );

        // Update og:url
        content = content.replace(
            /content="https:\/\/savetik-fast\.xyz\/"/,
            `content="https://savetik-fast.xyz/${lang}/"`
        );

        // Write file
        const filePath = path.join(langDir, tmpl.name);
        fs.writeFileSync(filePath, content, 'utf8');
    });

    console.log(`✅ Created: ${lang}/ (index.html, mp3.html, story.html)`);
    created++;
});

console.log('='.repeat(50));
console.log(`✅ Generated ${created} language folders with 3 pages each`);
console.log(`📁 Total files created: ${created * 3}`);
console.log('='.repeat(50));
