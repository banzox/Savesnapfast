import fs from 'fs';
import path from 'path';

const localesDir = 'c:/Users/newFUTURE/Desktop/xmax2/Savesnapfast/src/locales/locales';
const files = fs.readdirSync(localesDir);

const requiredKeys = ['mp3_page', 'story_page'];
const subKeys = ['title', 'desc', 'placeholder'];

const results = {};

files.forEach(file => {
    if (file.endsWith('.json')) {
        const content = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf-8'));
        const missing = [];

        requiredKeys.forEach(key => {
            if (!content[key]) {
                missing.push(key);
            } else {
                subKeys.forEach(sub => {
                    if (!content[key][sub]) {
                        missing.push(`${key}.${sub}`);
                    }
                });
            }
        });

        if (missing.length > 0) {
            results[file] = missing;
        }
    }
});

console.log(JSON.stringify(results, null, 2));
