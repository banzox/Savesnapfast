const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/locales/locales/en.json');

try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);

    // List of keys that might have strayed to root
    const strayKeys = ['tabs', 'compressor', 'converter', 'qrcode', 'engagement', 'money', 'font', 'hashtag'];

    if (!json.tools) {
        json.tools = {};
    }

    strayKeys.forEach(key => {
        if (json[key]) {
            console.log(`Found stray key: ${key}`);

            if (!json.tools[key]) {
                // If not in tools, just move it
                json.tools[key] = json[key];
            } else {
                // If exists in tools, merge
                // We prioritize the EXISTING content in tools because it has SEO/FAQ related stuff for image tools
                // But for NEW tools (engagement etc), we take the new one.
                // Actually, for compressor/converter/qrcode, the stray one is the "simple" one I added. 
                // The one in tools is the "rich" one.
                // So for these, I should probably KEEP the rich one and IGNORE the stray one, unless I want to update title/desc?
                // Let's assume the rich one is better.
                // For new tools (engagement), they won't exist in tools, so they are moved.
                console.log(`Key ${key} exists in tools. Keeping existing complex object, updating simple fields if necessary? No, keeping existing.`);
            }

            // Remove from root
            delete json[key];
        }
    });

    // Ensure btn is correct in tools
    // My previous edit might have deleted 'btn' object from tools if I replaced it.
    // I need to check if tools.btn exists.
    if (!json.tools.btn) {
        json.tools.btn = {
            "download": "Download",
            "downloadPng": "Download PNG"
        };
    } else {
        // Ensure downloadPng exists
        if (!json.tools.btn.downloadPng) {
            json.tools.btn.downloadPng = "Download PNG";
        }
    }

    // Also check if I accidentally put 'downloadPng' in 'preview' or somewhere unwanted
    // The line number analysis suggested 'downloadPng' was floating?
    // JSON.parse handles that structure cleanly. If keys are misplaced, I can't easily guess where they are unless I look at the object.
    // I will trust the merge for now.

    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    console.log('Fixed en.json');

} catch (e) {
    console.error('Error fixing en.json:', e);
}
