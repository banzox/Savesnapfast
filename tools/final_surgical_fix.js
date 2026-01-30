
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.resolve(__dirname, '../src/locales/locales');

const SURGICAL_FIXES = {
    // Arabix Fixes
    "ar": {
        "mp3_page.meta_desc": "تحويل فيديو TikTok إلى MP3. استخراج الأغاني والموسيقى بجودة عالية 320kbps.",
        "story_page.meta_desc": "تحميل قصص TikTok وعروض الشرائح بشكل مجهول. احفظ الصور قبل انتهاء صلاحيتها."
    },
    // Danish Fixes
    "da": {
        "mp3_page.title": "TikTok MP3 Konverter",
        "slideshow_page.title": "TikTok Diasshow Downloader"
    },
    // German Fixes
    "de": {
        "slideshow_page.title": "TikTok Diashow Downloader"
    },
    // Dutch Fixes
    "nl": {
        "slideshow_page.title": "TikTok Diashow Downloader"
    },
    // Tagalog Fixes
    "tl": {
        "slideshow_page.title": "Tagapag-download ng TikTok Slideshow",
        "slideshow_page.features.format.title": "Matalinong Format"
    },

    // BULGARIAN FAQ FIXES (Massive injection)
    "bg": {
        // MP3 Page FAQ
        "mp3_page.faq.q1": "Как да конвертирам TikTok видео в MP3?",
        "mp3_page.faq.a1": "Много е просто: 1. Отворете TikTok и намерете видеото. 2. Натиснете 'Сподели' и 'Копирай връзката'. 3. Поставете връзката тук в SaveTikFast. 4. Натиснете 'Изтегли MP3'.",
        "mp3_page.faq.q2": "Какво е качеството на аудиото?",
        "mp3_page.faq.a2": "Ние извличаме възможно най-високото качество от оригинала, обикновено до 320kbps.",
        "mp3_page.faq.q3": "Мога ли да свалям вирални звуци?",
        "mp3_page.faq.a3": "Да! Можете да свалите всеки звук, песен или мелодия от TikTok.",
        "mp3_page.faq.q4": "Безопасно ли е?",
        "mp3_page.faq.a4": "Напълно! Не изискваме регистрация и не пазим вашите файлове.",
        "mp3_page.faq.q5": "Мога ли да ползвам MP3 за мелодия на звънене?",
        "mp3_page.faq.a5": "Да, изтеглените файлове са идеални за мелодии и аларми.",
        "mp3_page.faq.q6": "Работи ли на iPhone и Android?",
        "mp3_page.faq.a6": "Да, работи перфектно на всички мобилни устройства и компютри.",
        "mp3_page.faq.q7": "Има ли лимит на свалянията?",
        "mp3_page.faq.a7": "Няма никакви ограничения. Услугата е напълно безплатна.",
        "mp3_page.faq.q8": "Защо не чувам звук във файла?",
        "mp3_page.faq.a8": "Уверете се, че оригиналното видео има звук и не е заглушено.",
        "mp3_page.faq.q9": "Мога ли да свалям от защитени видеа?",
        "mp3_page.faq.a9": "SaveTikFast работи само с публични видеоклипове.",
        "mp3_page.faq.q10": "Каква е разликата с видео свалянето?",
        "mp3_page.faq.a10": "Този инструмент извлича само аудио пистата, без видео картината.",

        // Story Page FAQ
        "story_page.faq.q1": "Как да сваля TikTok история (Story)?",
        "story_page.faq.a1": "Копирайте линка на историята, поставете го в полето по-горе и натиснете 'Изтегли'.",
        "story_page.faq.q2": "Ще разбере ли потребителят, че съм я свалил?",
        "story_page.faq.a2": "Не, свалянето е напълно анонимно. Никой няма да разбере.",
        "story_page.faq.q3": "Поддържате ли слайдшоута?",
        "story_page.faq.a3": "Да, сваляме всички снимки от слайдшоуто наведнъж.",
        "story_page.faq.q4": "Кога изтичат историите?",
        "story_page.faq.a4": "След 24 часа. Затова ги свалете бързо със SaveTikFast.",
        "story_page.faq.q5": "Какво е качеството?",
        "story_page.faq.a5": "Запазваме оригиналната HD резолюция на снимките и видеата.",
        "story_page.faq.q6": "Работи ли на iPhone?",
        "story_page.faq.a6": "Да, в Safari, Chrome или всеки друг браузър.",
        "story_page.faq.q7": "Мога ли да свалям от частни профили?",
        "story_page.faq.a7": "Не, поддържаме само публични истории.",
        "story_page.faq.q8": "Безплатно ли е?",
        "story_page.faq.a8": "Напълно безплатно и без скрити такси.",
        "story_page.faq.q9": "Защо не работи линка?",
        "story_page.faq.a9": "Уверете се, че историята не е изтекла (24ч) и профилът е публичен.",
        "story_page.faq.q10": "Каква е разликата със Слайдшоу?",
        "story_page.faq.a10": "Историите са временни (24ч), докато слайдшоутата са постоянни постове."
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
    console.log("Applying Surgical Fixes...");
    let count = 0;

    for (const [lang, fixes] of Object.entries(SURGICAL_FIXES)) {
        const filePath = path.join(LOCALES_DIR, `${lang}.json`);
        if (fs.existsSync(filePath)) {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            for (const [key, value] of Object.entries(fixes)) {
                setDeep(content, key, value);
            }

            fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
            console.log(`✅ ${lang} surgically patched.`);
            count++;
        }
    }
    console.log(`Fixed ${count} languages.`);
}

run();
