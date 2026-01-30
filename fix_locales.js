import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, 'src', 'locales', 'locales');

const navMenu = {
    "video": "Video",
    "mp3": "MP3 Audio",
    "stories": "Stories",
    "slideshow": "Slideshow"
};

const missingKeys = {
    "downloader.placeholder": "Paste TikTok link here...",
    "downloader.processing": "Processing...",
    "downloader.error_wrong_type_video": "Invalid Link! Please use the Video Downloader.",
    "downloader.error_wrong_type_slideshow": "Invalid Link! Please use the Slideshow Downloader.",
    "downloader.error_wrong_type_story": "Invalid Link! Please use the Story Downloader.",
    "downloader.error_invalid_link": "Invalid Link. Please check and try again.",

    "slideshow_page.placeholder": "Paste TikTok Slideshow link...",
    "story_page.placeholder": "Paste TikTok Story link...",
    "mp3_page.placeholder": "Paste TikTok Audio link...",
    "video_page.placeholder": "Paste TikTok Video link..."
};

try {
    const files = fs.readdirSync(localesDir);

    files.forEach((file) => {
        if (path.extname(file) === '.json') {
            const filePath = path.join(localesDir, file);

            try {
                let data = fs.readFileSync(filePath, 'utf8');
                let json = JSON.parse(data);
                let modified = false;

                // 1. Add Nav Menu if missing
                if (!json.nav_menu) {
                    console.log(`Adding nav_menu to ${file}`);
                    json.nav_menu = navMenu;
                    modified = true;
                }

                // 2. Add Downloader Errors & Messages
                if (!json.downloader) json.downloader = {};

                // Helper to add nested keys if missing
                const addIfMissing = (obj, keyPath, value) => {
                    const keys = keyPath.split('.');
                    let current = obj;
                    for (let i = 0; i < keys.length - 1; i++) {
                        if (!current[keys[i]]) current[keys[i]] = {};
                        current = current[keys[i]];
                    }
                    const lastKey = keys[keys.length - 1];
                    if (!current[lastKey]) {
                        current[lastKey] = value;
                        return true;
                    }
                    return false;
                };

                // Add simple keys
                if (addIfMissing(json, 'downloader.processing', missingKeys['downloader.processing'])) modified = true;
                if (addIfMissing(json, 'downloader.error_wrong_type_video', missingKeys['downloader.error_wrong_type_video'])) modified = true;
                if (addIfMissing(json, 'downloader.error_wrong_type_slideshow', missingKeys['downloader.error_wrong_type_slideshow'])) modified = true;
                if (addIfMissing(json, 'downloader.error_wrong_type_story', missingKeys['downloader.error_wrong_type_story'])) modified = true;
                if (addIfMissing(json, 'downloader.error_invalid_link', missingKeys['downloader.error_invalid_link'])) modified = true;

                // Add Page placeholders
                if (!json.slideshow_page) json.slideshow_page = {};
                if (addIfMissing(json, 'slideshow_page.placeholder', missingKeys['slideshow_page.placeholder'])) modified = true;

                if (!json.story_page) json.story_page = {};
                if (addIfMissing(json, 'story_page.placeholder', missingKeys['story_page.placeholder'])) modified = true;

                if (!json.mp3_page) json.mp3_page = {};
                if (addIfMissing(json, 'mp3_page.placeholder', missingKeys['mp3_page.placeholder'])) modified = true;

                // Fallback video placeholder if not present in downloader
                // if (addIfMissing(json, 'downloader.placeholder', missingKeys['downloader.placeholder'])) modified = true;


                if (modified) {
                    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
                    console.log(`Updated ${file}`);
                } else {
                    console.log(`Skipping ${file} - All keys exist`);
                }
            } catch (e) {
                console.error(`Error processing ${file}:`, e);
            }
        }
    });
    console.log("All locale files processed successfully.");
} catch (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
}
