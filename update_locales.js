
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales', 'locales');
const enPath = path.join(localesDir, 'en.json');

// Keys to ensure exist in 'downloader'
const requiredKeys = {
    "download_nwm": "Download No Watermark",
    "download_hd": "Download HD",
    "download_story_vid": "Download Story (Video)",
    "download_story_img": "Download Story (Image)"
};

try {
    const files = fs.readdirSync(localesDir);
    let count = 0;

    files.forEach(filename => {
        if (filename.endsWith('.json') && filename !== 'en.json') {
            const filePath = path.join(localesDir, filename);

            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const data = JSON.parse(content);

                if (!data.downloader) {
                    data.downloader = {};
                }

                let modified = false;
                for (const [key, defaultVal] of Object.entries(requiredKeys)) {
                    if (!data.downloader[key]) {
                        // Use English default if missing
                        data.downloader[key] = defaultVal;
                        modified = true;
                    }
                }

                if (modified) {
                    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
                    console.log(`Updated ${filename}`);
                    count++;
                }
            } catch (err) {
                console.error(`Error processing ${filename}:`, err.message);
            }
        }
    });

    console.log(`Successfully updated ${count} files.`);

} catch (err) {
    console.error("Error reading dir:", err);
}
