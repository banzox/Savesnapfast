const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales/locales');
const enPath = path.join(localesDir, 'en.json');

try {
    const enContent = fs.readFileSync(enPath, 'utf8');
    const enJson = JSON.parse(enContent);
    const enTools = enJson.tools || {};

    const files = fs.readdirSync(localesDir);

    files.forEach(file => {
        if (!file.endsWith('.json')) return;
        if (file === 'en.json') return; // Skip source

        const filePath = path.join(localesDir, file);
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const json = JSON.parse(content);
            let modified = false;

            if (!json.tools) {
                json.tools = {};
                modified = true;
            }

            // 1. Merge stray root keys into tools
            const strayKeys = ['tabs', 'compressor', 'converter', 'qrcode', 'engagement', 'money', 'font', 'hashtag'];

            strayKeys.forEach(key => {
                if (json[key]) {
                    console.log(`[${file}] Found stray key: ${key}`);

                    if (!json.tools[key]) {
                        // Move entire object
                        json.tools[key] = json[key];
                    } else {
                        // Merge
                        // We want the stray values (New Translations) to overwrite the existing values (Old English)
                        // But we want to keep existing keys that are NOT in stray (like howto, seo)
                        if (typeof json.tools[key] === 'object' && typeof json[key] === 'object') {
                            json.tools[key] = { ...json.tools[key], ...json[key] };
                        } else {
                            json.tools[key] = json[key];
                        }
                    }
                    delete json[key]; // Remove stray
                    modified = true;
                }
            });

            // 2. Backfill missing tools from English
            // For each key in en.tools, check if it exists in target.tools
            Object.keys(enTools).forEach(toolKey => {
                if (!json.tools[toolKey]) {
                    console.log(`[${file}] Missing tool key: ${toolKey}, copying from EN`);
                    json.tools[toolKey] = enTools[toolKey];
                    modified = true;
                } else {
                    // If tool exists, check strictly for the 7 main tools + tabs to ensure sub-prop coverage?
                    // Specifically for 'tabs', we added new keys (engagement, money...).
                    // If target.tools.tabs exists (e.g. old version), it might lack 'engagement'.
                    // We need to backfill missing sub-keys for 'tabs'.
                    if (toolKey === 'tabs') {
                        const enTabs = enTools.tabs;
                        const targetTabs = json.tools.tabs;
                        Object.keys(enTabs).forEach(tabKey => {
                            if (!targetTabs[tabKey]) {
                                console.log(`[${file}] Missing tab: ${tabKey}, copying from EN`);
                                targetTabs[tabKey] = enTabs[tabKey];
                                modified = true;
                            }
                        });
                    }

                    // For the new tools (engagement, money, font, hashtag), we copied the whole object if missing (handled above).
                    // If they exist (from stray merge), we assume they are complete.
                }
            });

            // Ensure 'btn' exists in tools if missing (some old files might not have it)
            if (!json.tools.btn) {
                if (enTools.btn) {
                    json.tools.btn = enTools.btn;
                    modified = true;
                }
            }

            // Check for duplicate 'tools' entry (rare case if parser was weird, but here we work on object)
            // Save
            if (modified) {
                fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
                console.log(`[${file}] Updated.`);
            }

        } catch (e) {
            console.error(`Error processing ${file}:`, e);
        }
    });

    console.log('All files processed.');

} catch (e) {
    console.error('Error running propagate script:', e);
}
