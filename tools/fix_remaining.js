
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.resolve(__dirname, '../src/locales/locales');

// Common fixes for the "5 missing keys" pattern found in many languages
// (mp3_page.meta_desc, story_page.meta_desc, slideshow_page.features...)

const COMMON_FIXES = {
    "cs": {
        "mp3_page.meta_desc": "Převod videa z TikToku na MP3 audio. Stahujte skladby a hudbu ve vysoké kvalitě 320kbps.",
        "story_page.meta_desc": "Stahujte příběhy a prezentace z TikToku anonymně. Uložte fotky před vypršením platnosti.",
        "slideshow_page.features.original.title": "Originální kvalita",
        "slideshow_page.features.format.title": "Chytré formáty",
        "slideshow_page.features.device.title": "Všechna zařízení"
    },
    "da": {
        "mp3_page.meta_desc": "Konverter TikTok-videoer til MP3-lyd. Udtræk sange og musik i høj kvalitet 320kbps.",
        "story_page.meta_desc": "Download TikTok-historier og diasshows anonymt. Gem fotokarruseller, før de udløber.",
        "slideshow_page.features.original.title": "Original kvalitet",
        "slideshow_page.features.format.title": "Smarte formater",
        "slideshow_page.features.device.title": "Alle enheder"
    },
    "el": {
        "mp3_page.meta_desc": "Μετατροπή βίντεο TikTok σε ήχο MP3. Εξαγωγή τραγουδιών και μουσικής σε υψηλή ποιότητα.",
        "story_page.meta_desc": "Λήψη ιστοριών και παρουσιάσεων TikTok ανώνυμα. Αποθηκεύστε φωτογραφίες πριν λήξουν.",
        "slideshow_page.features.original.title": "Αρχική ποιότητα",
        "slideshow_page.features.format.title": "Έξυπνες μορφές",
        "slideshow_page.features.device.title": "Όλες οι συσκευές"
    },
    "fi": {
        "mp3_page.meta_desc": "Muunna TikTok-videot MP3-ääneksi. Pura kappaleita ja musiikkia korkealaatuisena.",
        "story_page.meta_desc": "Lataa TikTok-tarinoita ja diaesityksiä nimettömästi. Tallenna kuvat ennen kuin ne vanhenevat.",
        "slideshow_page.features.original.title": "Alkuperäinen laatu",
        "slideshow_page.features.format.title": "Älykkäät muodot",
        "slideshow_page.features.device.title": "Kaikki laitteet"
    },
    "hu": {
        "mp3_page.meta_desc": "TikTok videók konvertálása MP3 hanggá. Dalok és zene kinyerése kiváló minőségben.",
        "story_page.meta_desc": "TikTok történetek és diavetítések névtelen letöltése. Mentse el a fotókat, mielőtt lejárnak.",
        "slideshow_page.features.original.title": "Eredeti minőség",
        "slideshow_page.features.format.title": "Okos formátumok",
        "slideshow_page.features.device.title": "Minden eszköz"
    },
    "it": {
        "mp3_page.meta_desc": "Converti video TikTok in audio MP3. Estrai canzoni e musica in alta qualità 320kbps.",
        "story_page.meta_desc": "Scarica storie e slideshow TikTok in modo anonimo. Salva le foto prima che scadano.",
        "slideshow_page.features.original.title": "Qualità Originale",
        "slideshow_page.features.format.title": "Formati Smart",
        "slideshow_page.features.device.title": "Tutti i Dispositivi"
    },
    "ja": {
        "mp3_page.meta_desc": "TikTok動画をMP3オーディオに変換。高音質320kbpsで曲や音楽を抽出。",
        "story_page.meta_desc": "TikTokストーリーとスライドショーを匿名でダウンロード。期限切れになる前に写真を保存。",
        "slideshow_page.features.original.title": "オリジナル画質",
        "slideshow_page.features.format.title": "スマート形式",
        "slideshow_page.features.device.title": "全デバイス対応"
    },
    "ko": {
        "mp3_page.meta_desc": "TikTok 비디오를 MP3 오디오로 변환하세요. 고음질 320kbps로 노래와 음악을 추출하세요.",
        "story_page.meta_desc": "TikTok 스토리와 슬라이드쇼를 익명으로 다운로드하세요. 만료되기 전에 사진을 저장하세요.",
        "slideshow_page.features.original.title": "원본 화질",
        "slideshow_page.features.format.title": "스마트 포맷",
        "slideshow_page.features.device.title": "모든 기기 지원"
    },
    "ms": {
        "mp3_page.meta_desc": "Tukar video TikTok kepada audio MP3.kstrak lagu dan muzik dalam kualiti tinggi.",
        "story_page.meta_desc": "Muat turun Cerita dan Tayangan Slaid TikTok secara tanpa nama. Simpan foto sebelum tamat tempoh.",
        "slideshow_page.features.original.title": "Kualiti Asal",
        "slideshow_page.features.format.title": "Format Pintar",
        "slideshow_page.features.device.title": "Semua Peranti"
    },
    "nl": {
        "mp3_page.meta_desc": "Converteer TikTok-video's naar MP3-audio. Extraheer nummers en muziek in hoge kwaliteit.",
        "story_page.meta_desc": "Download TikTok Verhalen en Slideshows anoniem. Sla foto's op voordat ze verlopen.",
        "slideshow_page.title": "TikTok Slideshow Downloader",
        "slideshow_page.features.original.title": "Originele Kwaliteit",
        "slideshow_page.features.format.title": "Slimme Formaten",
        "slideshow_page.features.device.title": "Alle Apparaten"
    },
    "no": {
        "mp3_page.meta_desc": "Konverter TikTok-videoer til MP3-lyd. Trekk ut sanger og musikk i høy kvalitet.",
        "story_page.meta_desc": "Last ned TikTok-historier og bildeserier anonymt. Lagre bilder før de utløper.",
        "slideshow_page.features.original.title": "Original kvalitet",
        "slideshow_page.features.format.title": "Smarte formater",
        "slideshow_page.features.device.title": "Alle enheter"
    },
    "pl": {
        "mp3_page.meta_desc": "Konwertuj filmy TikTok na dźwięk MP3. Wyodrębnij piosenki i muzykę w wysokiej jakości.",
        "story_page.meta_desc": "Pobieraj historie i pokazy slajdów TikTok anonimowo. Zapisz zdjęcia, zanim wygasną.",
        "slideshow_page.features.original.title": "Oryginalna jakość",
        "slideshow_page.features.format.title": "Inteligentne formaty",
        "slideshow_page.features.device.title": "Wszystkie urządzenia"
    },
    "ro": {
        "mp3_page.meta_desc": "Convertește videoclipuri TikTok în audio MP3. Extrage melodii și muzică la calitate înaltă.",
        "story_page.meta_desc": "Descarcă povești și slideshow-uri TikTok anonim. Salvează pozele înainte să expire.",
        "slideshow_page.features.original.title": "Calitate Originală",
        "slideshow_page.features.format.title": "Formate Inteligente",
        "slideshow_page.features.device.title": "Toate Dispozitivele"
    },
    "sv": {
        "mp3_page.meta_desc": "Konvertera TikTok-videor till MP3-ljud. Extrahera låtar och musik i hög kvalitet.",
        "story_page.meta_desc": "Ladda ner TikTok Stories och bildspel anonymt. Spara bilder innan de går ut.",
        "slideshow_page.features.original.title": "Originalkvalitet",
        "slideshow_page.features.format.title": "Smarta format",
        "slideshow_page.features.device.title": "Alla enheter"
    },
    "th": {
        "mp3_page.meta_desc": "แปลงวิดีโอ TikTok เป็นไฟล์เสียง MP3 แยกเพลงและดนตรีคุณภาพสูง",
        "story_page.meta_desc": "ดาวน์โหลดเรื่องราวและสไลด์โชว์ TikTok โดยไม่ระบุตัวตน บันทึกรูปภาพก่อนหมดอายุ",
        "slideshow_page.features.original.title": "คุณภาพดั้งเดิม",
        "slideshow_page.features.format.title": "รูปแบบอัจฉริยะ",
        "slideshow_page.features.device.title": "ทุกอุปกรณ์"
    },
    "uk": {
        "mp3_page.meta_desc": "Перетворення відео TikTok в аудіо MP3. Витягуйте пісні та музику у високій якості.",
        "story_page.meta_desc": "Завантажуйте історії та слайд-шоу TikTok анонімно. Збережіть фото до закінчення терміну.",
        "slideshow_page.features.original.title": "Оригінальна якість",
        "slideshow_page.features.format.title": "Розумні формати",
        "slideshow_page.features.device.title": "Всі пристрої"
    },
    "vi": {
        "mp3_page.meta_desc": "Chuyển đổi video TikTok sang âm thanh MP3. Trích xuất bài hát và nhạc chất lượng cao.",
        "story_page.meta_desc": "Tải xuống Tin và Trình chiếu TikTok ẩn danh. Lưu ảnh trước khi hết hạn.",
        "slideshow_page.features.original.title": "Chất lượng gốc",
        "slideshow_page.features.format.title": "Định dạng thông minh",
        "slideshow_page.features.device.title": "Mọi thiết bị"
    },
    "zh": {
        "mp3_page.meta_desc": "将 TikTok 视频转换为 MP3 音频。提取高质量的歌曲和音乐。",
        "story_page.meta_desc": "匿名下载 TikTok 故事和幻灯片。在过期前保存照片。",
        "slideshow_page.title": "TikTok 幻灯片下载器",
        "slideshow_page.features.original.title": "原始质量",
        "slideshow_page.features.format.title": "智能格式",
        "slideshow_page.features.device.title": "所有设备"
    },
    "bg": {
        // Bulgarian had many missing, filling core + meta
        "mp3_page.meta_desc": "Конвертиране на TikTok видео в MP3 аудио. Извличане на песни и музика с високо качество.",
        "story_page.meta_desc": "Сваляйте истории и слайдшоута от TikTok анонимно. Запазете снимките преди да изтекат.",
        "slideshow_page.features.original.title": "Оригинално качество",
        "slideshow_page.features.format.title": "Умни формати",
        "slideshow_page.features.device.title": "Всички устройства",
        "mp3_page.title": "TikTok MP3 Конвертор",
        "slideshow_page.title": "Сваляне на Слайдшоу"
    },
    "tr": {
        "mp3_page.meta_desc": "TikTok videolarını MP3 sese dönüştürün. Şarkıları ve müzikleri yüksek kalitede çıkarın.",
        "story_page.meta_desc": "TikTok Hikayelerini ve Slayt Gösterilerini anonim olarak indirin."
    },
    "es": {
        "mp3_page.meta_desc": "Convierte videos de TikTok a audio MP3. Extrae canciones y música en alta calidad.",
        "story_page.meta_desc": "Descarga historias y slideshows de TikTok anónimamente."
    },
    "fr": {
        "mp3_page.meta_desc": "Convertir des vidéos TikTok en audio MP3. Extraire des chansons et de la musique en haute qualité.",
        "story_page.meta_desc": "Téléchargez des histoires et des diaporamas TikTok de manière anonyme."
    },
    "pt": {
        "mp3_page.meta_desc": "Converta vídeos do TikTok em áudio MP3. Extraia músicas e sons com alta qualidade.",
        "story_page.meta_desc": "Baixe histórias e apresentações de slides do TikTok anonimamente."
    },
    "ru": {
        "mp3_page.meta_desc": "Конвертируйте видео TikTok в аудио MP3. Извлекайте песни и музыку в высоком качестве.",
        "story_page.meta_desc": "Скачивайте истории и слайд-шоу TikTok анонимно."
    },
    "de": {
        "mp3_page.meta_desc": "TikTok-Videos in MP3-Audio umwandeln. Songs und Musik in hoher Qualität extrahieren.",
        "story_page.meta_desc": "Laden Sie TikTok-Storys und Diashows anonym herunter."
    },
    "id": {
        "mp3_page.meta_desc": "Ubah video TikTok menjadi audio MP3. Ekstrak lagu dan musik dalam kualitas tinggi.",
        "mp3_page.title": "Konverter MP3 TikTok",
        "story_page.meta_desc": "Unduh Cerita dan Tampilan Slide TikTok secara anonim."
    },
    "tl": {
        "mp3_page.meta_desc": "I-convert ang mga video sa TikTok sa MP3 audio. I-extract ang mga kanta at musika.",
        "mp3_page.features.trending.title": "Trending na Tunog",
        "story_page.meta_desc": "Mag-download ng TikTok Stories at Slideshows nang hindi nakikilala.",
        "story_page.features.anonymous.title": "Anonimo",
        "slideshow_page.title": "TikTok Slideshow Downloader",
        "slideshow_page.features.original.title": "Orihinal na Kalidad",
        "slideshow_page.features.format.title": "Smart Formats"
    }

};

function setDeep(obj, pathKey, value) {
    const keys = pathKey.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
}

function run() {
    console.log("Applying Final Fixes...");
    let count = 0;

    for (const [lang, fixes] of Object.entries(COMMON_FIXES)) {
        const filePath = path.join(LOCALES_DIR, `${lang}.json`);
        if (fs.existsSync(filePath)) {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            for (const [key, value] of Object.entries(fixes)) {
                setDeep(content, key, value);
            }

            fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
            console.log(`✅ ${lang} patched.`);
            count++;
        }
    }
    console.log(`Fixed ${count} languages.`);
}

run();
