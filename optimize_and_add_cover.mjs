import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceImage = 'C:\\Users\\newFUTURE\\.gemini\\antigravity\\brain\\7d979136-5d3a-41db-a62b-eb3b322300ff\\media__1777573728780.jpg';
const destFolder = path.join(process.cwd(), 'public', 'images', 'blog');
const destImage = path.join(destFolder, 'best-time-to-post-2026.webp');

async function processImage() {
    console.log("Optimizing image...");
    if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true });
    }
    
    // Resize to max 800px width and convert to WebP to make it lightweight
    await sharp(sourceImage)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(destImage);
        
    console.log("Image optimized and saved to:", destImage);
}

function updateFrontmatter() {
    console.log("Adding cover image to all generated blog posts...");
    const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
    const files = fs.readdirSync(blogDir).filter(f => f.startsWith('best-time-to-post'));
    
    for (const file of files) {
        const filePath = path.join(blogDir, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        
        // Add cover field before 'lang:'
        if (!content.includes('cover:')) {
            content = content.replace('lang:', 'cover: "/images/blog/best-time-to-post-2026.webp"\nlang:');
            fs.writeFileSync(filePath, content);
        }
    }
    console.log("Updated all markdown files with cover image.");
}

async function run() {
    try {
        await processImage();
        updateFrontmatter();
    } catch (err) {
        console.error("Error:", err);
    }
}

run();
