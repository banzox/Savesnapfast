import fs from 'fs';
import path from 'path';
import { translate } from '@vitalets/google-translate-api';

const localesDir = './src/locales/locales';
const enPath = path.join(localesDir, 'en.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Helper to delay
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function translateObject(targetObj, enObj, langCode, prefix = '') {
  let modified = false;
  
  for (const key in enObj) {
    if (typeof enObj[key] === 'object' && enObj[key] !== null) {
      if (!targetObj[key]) targetObj[key] = {};
      const childModified = await translateObject(targetObj[key], enObj[key], langCode, prefix + key + '.');
      if (childModified) modified = true;
    } else if (typeof enObj[key] === 'string') {
      // Check if missing or identical
      if (!targetObj[key] || targetObj[key] === enObj[key]) {
        // Skip translating numbers or extremely short words like "2026", "DMCA" if they are identical, though it's safer to translate all
        if (enObj[key].length <= 2 && !/[a-zA-Z]/.test(enObj[key])) {
            targetObj[key] = enObj[key];
            continue;
        }

        try {
          console.log(`Translating [${langCode}] ${prefix}${key}: "${enObj[key].substring(0, 30)}..."`);
          const res = await translate(enObj[key], { to: langCode });
          targetObj[key] = res.text;
          modified = true;
          await sleep(200); // Prevent rate limiting
        } catch (error) {
          console.error(`Error translating [${langCode}] ${prefix}${key}:`, error.message);
          // Stop if rate limited to avoid spam
          if (error.message.includes('TooManyRequests')) {
              throw error;
          }
        }
      }
    }
  }
  return modified;
}

async function main() {
  const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json') && f !== 'en.json');
  
  for (const file of files) {
    const langCode = file.replace('.json', '');
    const filePath = path.join(localesDir, file);
    
    // Map some language codes if needed for google translate
    let gLang = langCode;
    if (gLang === 'zh-CN') gLang = 'zh-cn';
    if (gLang === 'zh-TW') gLang = 'zh-tw';
    if (gLang === 'pt-BR') gLang = 'pt';
    
    console.log(`\n--- Processing ${file} ---`);
    let targetData = {};
    try {
      targetData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch(e) {
      targetData = {};
    }
    
    const modified = await translateObject(targetData, enData, gLang);
    
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(targetData, null, 2));
      console.log(`Saved ${file}`);
    } else {
      console.log(`No changes for ${file}`);
    }
  }
}

main().catch(console.error);
