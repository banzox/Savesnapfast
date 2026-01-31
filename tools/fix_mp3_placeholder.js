
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales/locales');

const translations = {
    ar: "ضع رابط الفيديو لاستخراج الصوت...",
    bg: "Поставете връзка към видеоклип за извличане на аудио...",
    cs: "Vložte odkaz na video pro extrakci zvuku...",
    da: "Indsæt videolink for at udtrække lyd...",
    de: "Videolink einfügen, um Audio zu extrahieren...",
    el: "Επικολλήστε τον σύνδεσμο βίντεο για εξαγωγή ήχου...",
    en: "Paste video link to extract audio...",
    es: "Pega el enlace del video para extraer el audio...",
    fi: "Liitä videolinkki äänen poimimiseksi...",
    fr: "Collez le lien vidéo pour extraire l'audio...",
    hi: "ऑडियो निकालने के लिए वीडियो लिंक पेस्ट करें...",
    hu: "Illessze be a videó linkjét a hang kinyeréséhez...",
    id: "Tempel tautan video untuk mengekstrak audio...",
    it: "Incolla il link del video per estrarre l'audio...",
    ja: "音声を抽出するには動画リンクを貼り付けてください...",
    ko: "오디오를 추출하려면 비디오 링크를 붙여넣으세요...",
    ms: "Tampal pautan video untuk mengeluarkan audio...",
    nl: "Plak videolink om audio te extraheren...",
    no: "Lim inn videolink for å hente ut lyd...",
    pl: "Wklej link do wideo, aby wyodrębnić dźwięk...",
    pt: "Cole o link do vídeo para extrair o áudio...",
    ro: "Lipiți linkul video pentru a extrage audio...",
    ru: "Вставьте ссылку на видео для извлечения звука...",
    sv: "Klistra in videolänk för att extrahera ljud...",
    th: "วางลิงก์วิดีโอเพื่อแยกเสียง...",
    tl: "I-paste ang link ng video upang makuha ang audio...",
    tr: "Ses çıkarmak için video bağlantısını yapıştırın...",
    uk: "Вставте посилання на відео для вилучення аудіо...",
    vi: "Dán liên kết video để trích xuất âm thanh...",
    zh: "粘贴视频链接以提取音频..."
};

try {
    const files = fs.readdirSync(localesDir);

    files.forEach(file => {
        if (path.extname(file) === '.json') {
            const langCode = path.basename(file, '.json');
            const filePath = path.join(localesDir, file);

            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const json = JSON.parse(content);

                // Update the key
                if (json.mp3_page) {
                    // Fallback to English if translation missing
                    const newText = translations[langCode] || translations['en'];

                    if (json.mp3_page.placeholder !== newText) {
                        console.log(`Updating ${file}...`);
                        json.mp3_page.placeholder = newText;
                        fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
                    }
                }
            } catch (err) {
                console.error(`Error processing ${file}:`, err);
            }
        }
    });
    console.log('All files processed.');
} catch (e) {
    console.error("Critical error:", e);
}

// Force exit to ensure process doesn't hang
process.exit(0);
