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

try {
    const files = fs.readdirSync(localesDir);

    files.forEach((file) => {
        if (path.extname(file) === '.json') {
            const filePath = path.join(localesDir, file);

            try {
                const data = fs.readFileSync(filePath, 'utf8');
                const json = JSON.parse(data);

                if (!json.nav_menu) {
                    console.log(`Adding nav_menu to ${file}`);
                    json.nav_menu = navMenu;
                    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
                } else {
                    console.log(`Skipping ${file} - nav_menu already exists`);
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
