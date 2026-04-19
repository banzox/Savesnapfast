const fs = require('fs');
const path = require('path');

const localesDir = 'src/locales/locales';
const files = fs.readdirSync(localesDir);

let internalLinks = new Set();
let externalLinks = new Set();

files.forEach(function(file) {
    const content = fs.readFileSync(path.join(localesDir, file), 'utf8');
    
    // Find href patterns
    const hrefRegex = /href="([^"]+)"/g;
    let match;
    while ((match = hrefRegex.exec(content)) !== null) {
        const url = match[1];
        if (url.startsWith('http')) {
            externalLinks.add(url);
        } else {
            internalLinks.add(url);
        }
    }
    
    // Also find href with single quotes
    const hrefRegex2 = /href='([^']+)'/g;
    while ((match = hrefRegex2.exec(content)) !== null) {
        const url = match[1];
        if (url.startsWith('http')) {
            externalLinks.add(url);
        } else {
            internalLinks.add(url);
        }
    }
});

console.log('=== INTERNAL LINKS IN LOCALE FILES ===');
const sortedInternal = Array.from(internalLinks).sort();
sortedInternal.forEach(function(l) { console.log(l); });

console.log('\n=== EXTERNAL LINKS IN LOCALE FILES ===');
const sortedExternal = Array.from(externalLinks).sort();
sortedExternal.forEach(function(l) { console.log(l); });

// Now scan Astro components for href patterns
console.log('\n=== SCANNING ASTRO COMPONENTS FOR LINKS ===');
const srcDir = 'src';
function scanDir(dir) {
    const items = fs.readdirSync(dir);
    items.forEach(function(item) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && item !== 'node_modules') {
            scanDir(fullPath);
        } else if (item.endsWith('.astro') || item.endsWith('.tsx') || item.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            // Look for hardcoded href links (not template literals)
            const hardcodedLinks = content.match(/href="(\/[^"]+)"/g) || [];
            if (hardcodedLinks.length > 0) {
                console.log('\nFile: ' + fullPath);
                hardcodedLinks.forEach(function(l) { console.log('  ' + l); });
            }
        }
    });
}
scanDir(srcDir);
