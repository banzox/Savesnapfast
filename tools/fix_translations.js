
const fs = require('fs');
const path = require('path');

// Configuration
const localesDir = path.join(__dirname, '../src/locales/locales');
const sourceLang = 'en';
const missingSections = ['mp3_page', 'story_page'];

// Read source file (English)
const sourcePath = path.join(localesDir, `${sourceLang}.json`);
const sourceContent = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

// Get all locale files
const files = fs.readdirSync(localesDir).filter(file => file.endsWith('.json') && file !== `${sourceLang}.json`);

console.log(`Found ${files.length} locale files to check.`);

files.forEach(file => {
    const filePath = path.join(localesDir, file);
    try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let modified = false;

        missingSections.forEach(section => {
            if (!content[section]) {
                console.log(`[${file}] Missing section: ${section}. Copying from source.`);
                // Deep copy the section from source
                content[section] = JSON.parse(JSON.stringify(sourceContent[section]));
                // Add a marker to values to indicate they are English fallbacks (optional, but good for debugging)
                // For now, we just copy exact English text so the page RENDERS correctly.
                modified = true;
            }
        });

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
            console.log(`[${file}] Updated and saved.`);
        } else {
            console.log(`[${file}] All sections present. Skipping.`);
        }
    } catch (err) {
        console.error(`[${file}] Error processing file: ${err.message}`);
    }
});

console.log("Done.");
