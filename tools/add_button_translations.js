const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales/locales');

// Translations for each language
const translations = {
    'ar': { btn_paste: 'لصق', btn_copy: 'نسخ', btn_clear: 'مسح' },
    'bg': { btn_paste: 'Поставяне', btn_copy: 'Копиране', btn_clear: 'Изчистване' },
    'cs': { btn_paste: 'Vložit', btn_copy: 'Kopírovat', btn_clear: 'Vymazat' },
    'da': { btn_paste: 'Indsæt', btn_copy: 'Kopier', btn_clear: 'Ryd' },
    'de': { btn_paste: 'Einfügen', btn_copy: 'Kopieren', btn_clear: 'Löschen' },
    'el': { btn_paste: 'Επικόλληση', btn_copy: 'Αντιγραφή', btn_clear: 'Εκκαθάριση' },
    'en': { btn_paste: 'Paste', btn_copy: 'Copy', btn_clear: 'Clear' },
    'es': { btn_paste: 'Pegar', btn_copy: 'Copiar', btn_clear: 'Borrar' },
    'fi': { btn_paste: 'Liitä', btn_copy: 'Kopioi', btn_clear: 'Tyhjennä' },
    'fil': { btn_paste: 'I-paste', btn_copy: 'Kopyahin', btn_clear: 'I-clear' },
    'fr': { btn_paste: 'Coller', btn_copy: 'Copier', btn_clear: 'Effacer' },
    'hi': { btn_paste: 'पेस्ट करें', btn_copy: 'कॉपी करें', btn_clear: 'साफ़ करें' },
    'hu': { btn_paste: 'Beillesztés', btn_copy: 'Másolás', btn_clear: 'Törlés' },
    'id': { btn_paste: 'Tempel', btn_copy: 'Salin', btn_clear: 'Hapus' },
    'it': { btn_paste: 'Incolla', btn_copy: 'Copia', btn_clear: 'Cancella' },
    'ja': { btn_paste: '貼り付け', btn_copy: 'コピー', btn_clear: 'クリア' },
    'ko': { btn_paste: '붙여넣기', btn_copy: '복사', btn_clear: '지우기' },
    'ms': { btn_paste: 'Tampal', btn_copy: 'Salin', btn_clear: 'Padam' },
    'nl': { btn_paste: 'Plakken', btn_copy: 'Kopiëren', btn_clear: 'Wissen' },
    'no': { btn_paste: 'Lim inn', btn_copy: 'Kopier', btn_clear: 'Slett' },
    'pl': { btn_paste: 'Wklej', btn_copy: 'Kopiuj', btn_clear: 'Wyczyść' },
    'pt': { btn_paste: 'Colar', btn_copy: 'Copiar', btn_clear: 'Limpar' },
    'ro': { btn_paste: 'Lipește', btn_copy: 'Copiază', btn_clear: 'Șterge' },
    'ru': { btn_paste: 'Вставить', btn_copy: 'Копировать', btn_clear: 'Очистить' },
    'sv': { btn_paste: 'Klistra in', btn_copy: 'Kopiera', btn_clear: 'Rensa' },
    'th': { btn_paste: 'วาง', btn_copy: 'คัดลอก', btn_clear: 'ล้าง' },
    'tr': { btn_paste: 'Yapıştır', btn_copy: 'Kopyala', btn_clear: 'Temizle' },
    'uk': { btn_paste: 'Вставити', btn_copy: 'Копіювати', btn_clear: 'Очистити' },
    'vi': { btn_paste: 'Dán', btn_copy: 'Sao chép', btn_clear: 'Xóa' },
    'zh': { btn_paste: '粘贴', btn_copy: '复制', btn_clear: '清除' }
};

// Process each locale file
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
    const lang = file.replace('.json', '');
    const filePath = path.join(localesDir, file);

    try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (content.downloader && translations[lang]) {
            // Check if keys already exist
            if (!content.downloader.btn_paste) {
                content.downloader.btn_paste = translations[lang].btn_paste;
                content.downloader.btn_copy = translations[lang].btn_copy;
                content.downloader.btn_clear = translations[lang].btn_clear;

                fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
                console.log(`✅ Updated: ${file}`);
            } else {
                console.log(`⏭️  Skipped (already has keys): ${file}`);
            }
        } else {
            console.log(`⚠️  Missing downloader section or translation: ${file}`);
        }
    } catch (err) {
        console.error(`❌ Error processing ${file}:`, err.message);
    }
});

console.log('\n✅ All done!');
