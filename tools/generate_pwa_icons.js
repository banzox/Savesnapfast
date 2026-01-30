import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceIcon = path.join(process.cwd(), 'public', 'source_icon.jpg');
const publicDir = path.join(process.cwd(), 'public');

const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 }
];

async function generate() {
    console.log(`Processing ${sourceIcon}...`);

    if (!fs.existsSync(sourceIcon)) {
        console.error('Source icon not found!');
        process.exit(1);
    }

    for (const icon of sizes) {
        const outputPath = path.join(publicDir, icon.name);
        await sharp(sourceIcon)
            .resize(icon.size, icon.size)
            .toFile(outputPath);
        console.log(`Generated ${icon.name}`);
    }

    // Generate legacy favicon.ico (using 32x32 png as base, but naming it .ico is not enough strictly, 
    // but browsers cope. Ideally use a library, but for now we'll rely on the pngs in HTML head).
    // Actually, let's just make a 32x32 png and rename it to favicon.ico if we want a fallback,
    // but modern practice is using <link rel="icon" href="favicon.svg" or png>.
    // We already generated favicon-32x32.png.

    console.log('Done.');
}

generate().catch(console.error);
