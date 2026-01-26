/**
 * MP3 Page Generator for 30 Languages
 * Generates /mp3/{lang}/index.html for each language
 * SEO optimized with 10 FAQs per language
 */

const fs = require('fs');
const path = require('path');

// 30 Languages with translations
const LANGUAGES = {
    ar: { name: 'العربية', dir: 'rtl', title: 'تحميل MP3 من تيك توك', desc: 'حول فيديوهات تيك توك إلى ملفات MP3 صوتية بجودة عالية 320kbps مجاناً' },
    en: { name: 'English', dir: 'ltr', title: 'TikTok to MP3 Converter', desc: 'Convert TikTok videos to MP3 audio files in high quality 320kbps for free' },
    es: { name: 'Español', dir: 'ltr', title: 'Convertidor TikTok a MP3', desc: 'Convierte videos de TikTok a archivos MP3 de alta calidad 320kbps gratis' },
    fr: { name: 'Français', dir: 'ltr', title: 'Convertisseur TikTok en MP3', desc: 'Convertissez les vidéos TikTok en fichiers audio MP3 haute qualité 320kbps' },
    de: { name: 'Deutsch', dir: 'ltr', title: 'TikTok zu MP3 Konverter', desc: 'Konvertieren Sie TikTok-Videos in MP3-Audiodateien in hoher Qualität 320kbps' },
    it: { name: 'Italiano', dir: 'ltr', title: 'Convertitore TikTok in MP3', desc: 'Converti video TikTok in file audio MP3 di alta qualità 320kbps gratis' },
    pt: { name: 'Português', dir: 'ltr', title: 'Conversor TikTok para MP3', desc: 'Converta vídeos do TikTok em arquivos MP3 de alta qualidade 320kbps grátis' },
    ru: { name: 'Русский', dir: 'ltr', title: 'Конвертер TikTok в MP3', desc: 'Конвертируйте видео TikTok в аудио MP3 высокого качества 320kbps бесплатно' },
    ja: { name: '日本語', dir: 'ltr', title: 'TikTok MP3変換', desc: 'TikTok動画を高品質320kbps MP3オーディオファイルに無料変換' },
    ko: { name: '한국어', dir: 'ltr', title: 'TikTok MP3 변환기', desc: 'TikTok 비디오를 고품질 320kbps MP3 오디오 파일로 무료 변환' },
    zh: { name: '中文', dir: 'ltr', title: 'TikTok转MP3转换器', desc: '免费将TikTok视频转换为高质量320kbps MP3音频文件' },
    tr: { name: 'Türkçe', dir: 'ltr', title: 'TikTok MP3 Dönüştürücü', desc: 'TikTok videolarını yüksek kaliteli 320kbps MP3 ses dosyalarına ücretsiz dönüştürün' },
    id: { name: 'Indonesia', dir: 'ltr', title: 'Konverter TikTok ke MP3', desc: 'Konversi video TikTok ke file audio MP3 berkualitas tinggi 320kbps gratis' },
    vi: { name: 'Tiếng Việt', dir: 'ltr', title: 'Chuyển đổi TikTok sang MP3', desc: 'Chuyển đổi video TikTok thành tệp âm thanh MP3 chất lượng cao 320kbps miễn phí' },
    th: { name: 'ไทย', dir: 'ltr', title: 'แปลง TikTok เป็น MP3', desc: 'แปลงวิดีโอ TikTok เป็นไฟล์เสียง MP3 คุณภาพสูง 320kbps ฟรี' },
    nl: { name: 'Nederlands', dir: 'ltr', title: 'TikTok naar MP3 Converter', desc: 'Converteer TikTok-videos naar MP3-audiobestanden van hoge kwaliteit 320kbps gratis' },
    pl: { name: 'Polski', dir: 'ltr', title: 'Konwerter TikTok na MP3', desc: 'Konwertuj filmy TikTok na pliki audio MP3 wysokiej jakości 320kbps za darmo' },
    uk: { name: 'Українська', dir: 'ltr', title: 'Конвертер TikTok в MP3', desc: 'Конвертуйте відео TikTok в аудіо MP3 високої якості 320kbps безкоштовно' },
    he: { name: 'עברית', dir: 'rtl', title: 'ממיר TikTok ל-MP3', desc: 'המר סרטוני TikTok לקבצי אודיו MP3 באיכות גבוהה 320kbps בחינם' },
    hi: { name: 'हिन्दी', dir: 'ltr', title: 'TikTok से MP3 कन्वर्टर', desc: 'TikTok वीडियो को उच्च गुणवत्ता 320kbps MP3 ऑडियो फ़ाइलों में मुफ्त में कनवर्ट करें' },
    cs: { name: 'Čeština', dir: 'ltr', title: 'TikTok do MP3 Konvertor', desc: 'Převeďte videa TikTok na vysoce kvalitní 320kbps MP3 audio soubory zdarma' },
    da: { name: 'Dansk', dir: 'ltr', title: 'TikTok til MP3 Konverter', desc: 'Konverter TikTok-videoer til MP3-lydfiler i høj kvalitet 320kbps gratis' },
    el: { name: 'Ελληνικά', dir: 'ltr', title: 'Μετατροπέας TikTok σε MP3', desc: 'Μετατρέψτε βίντεο TikTok σε αρχεία ήχου MP3 υψηλής ποιότητας 320kbps δωρεάν' },
    fi: { name: 'Suomi', dir: 'ltr', title: 'TikTok MP3 Muunnin', desc: 'Muunna TikTok-videot korkealaatuisiksi 320kbps MP3-äänitiedostoiksi ilmaiseksi' },
    hu: { name: 'Magyar', dir: 'ltr', title: 'TikTok MP3 Konverter', desc: 'Konvertálja a TikTok videókat kiváló minőségű 320kbps MP3 hangfájlokká ingyen' },
    ms: { name: 'Melayu', dir: 'ltr', title: 'Penukar TikTok ke MP3', desc: 'Tukar video TikTok kepada fail audio MP3 berkualiti tinggi 320kbps secara percuma' },
    no: { name: 'Norsk', dir: 'ltr', title: 'TikTok til MP3 Konverter', desc: 'Konverter TikTok-videoer til MP3-lydfiler av høy kvalitet 320kbps gratis' },
    ro: { name: 'Română', dir: 'ltr', title: 'Convertor TikTok în MP3', desc: 'Convertiți videoclipuri TikTok în fișiere audio MP3 de înaltă calitate 320kbps gratuit' },
    sk: { name: 'Slovenčina', dir: 'ltr', title: 'TikTok na MP3 Konvertor', desc: 'Preveďte videá TikTok na vysoko kvalitné 320kbps MP3 audio súbory zadarmo' },
    sv: { name: 'Svenska', dir: 'ltr', title: 'TikTok till MP3 Konverterare', desc: 'Konvertera TikTok-videor till MP3-ljudfiler av hög kvalitet 320kbps gratis' }
};

// FAQ translations for each language (10 SEO-optimized questions)
const FAQS = {
    ar: [
        { q: 'كيف أحول فيديو تيك توك إلى MP3 بدون تطبيقات؟', a: 'انسخ رابط الفيديو من تيك توك، ثم الصقه في الأداة أعلاه واضغط على تحميل MP3. سيتم تحويله فوراً.' },
        { q: 'هل تحميل MP3 من تيك توك مجاني وآمن؟', a: 'نعم، خدمتنا مجانية 100% وآمنة تماماً. لا نطلب تسجيل دخول ولا نخزن ملفاتك.' },
        { q: 'ما جودة ملفات MP3 المحملة من تيك توك؟', a: 'نوفر أعلى جودة متاحة من الفيديو الأصلي، تصل إلى 320kbps للصوت النقي.' },
        { q: 'هل يمكنني تحميل أغاني تيك توك الترند؟', a: 'نعم، يمكنك تحميل أي صوت من تيك توك سواء أغاني ترند أو مؤثرات صوتية أو تعليقات صوتية.' },
        { q: 'كيف أستخدم MP3 المحمل كرنة للهاتف؟', a: 'بعد التحميل، انتقل لإعدادات الهاتف واختر الملف كرنة أو تنبيه.' },
        { q: 'هل يعمل محول تيك توك MP3 على الآيفون؟', a: 'نعم، يعمل على جميع الأجهزة: آيفون، أندرويد، كمبيوتر، وأي جهاز بمتصفح.' },
        { q: 'لماذا الملف المحمل صامت بدون صوت؟', a: 'قد يكون الفيديو الأصلي بصوت منخفض. جرب فيديو آخر بصوت واضح.' },
        { q: 'هل هناك حد لعدد تحميلات MP3؟', a: 'لا حدود إطلاقاً! حمّل ما تشاء من ملفات MP3 مجاناً بدون قيود.' },
        { q: 'كم يستغرق تحويل تيك توك إلى MP3؟', a: 'التحويل فوري! يستغرق ثوانٍ معدودة فقط لتحميل ملف MP3.' },
        { q: 'هل يمكنني تحميل موسيقى محمية بحقوق الطبع؟', a: 'يمكنك تحميل أي صوت متاح علناً، لكن يجب احترام حقوق الملكية واستخدامها للأغراض الشخصية فقط.' }
    ],
    en: [
        { q: 'How to convert TikTok video to MP3 without any app?', a: 'Simply copy the TikTok video link, paste it in our tool above, and click Download MP3. Conversion is instant.' },
        { q: 'Is downloading MP3 from TikTok free and safe?', a: 'Yes, our service is 100% free and completely safe. No login required and we never store your files.' },
        { q: 'What is the audio quality of downloaded TikTok MP3 files?', a: 'We provide the highest quality available from the original video, up to 320kbps crystal clear audio.' },
        { q: 'Can I download trending TikTok songs and sounds?', a: 'Yes, you can download any audio from TikTok - trending songs, sound effects, voiceovers, and background music.' },
        { q: 'How to use downloaded MP3 as phone ringtone?', a: 'After downloading, go to your phone settings and select the file as your ringtone or notification sound.' },
        { q: 'Does TikTok MP3 converter work on iPhone?', a: 'Yes, it works on all devices: iPhone, Android, PC, Mac, and any device with a web browser.' },
        { q: 'Why is my downloaded MP3 file silent?', a: 'The original video might have had low or muted audio. Try downloading from a different video with clear sound.' },
        { q: 'Is there a limit on TikTok MP3 downloads?', a: 'No limits at all! Download as many MP3 files as you want for free without any restrictions.' },
        { q: 'How long does TikTok to MP3 conversion take?', a: 'Conversion is instant! It takes only a few seconds to download your MP3 file.' },
        { q: 'Can I download copyrighted music from TikTok?', a: 'You can download any publicly available audio, but please respect copyright and use for personal purposes only.' }
    ],
    // Add more languages...
};

// Default FAQs for languages without specific translations
const DEFAULT_FAQS = FAQS.en;

function generateHTML(lang, langData) {
    const faqs = FAQS[lang] || DEFAULT_FAQS;
    const isRTL = langData.dir === 'rtl';

    const faqsHTML = faqs.map((faq, i) => `
                <details class="faq-item-new">
                    <summary>${faq.q}</summary>
                    <div class="faq-answer-new">
                        <p>${faq.a}</p>
                    </div>
                </details>`).join('');

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${langData.dir}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    
    <title>${langData.title} - SaveTikFast 2026 | ${langData.name}</title>
    <meta name="description" content="${langData.desc}">
    <meta name="keywords" content="tiktok to mp3, tiktok mp3 download, ${lang}, convert tiktok to mp3, tiktok audio download 2026">
    
    <link rel="canonical" href="https://savetik-fast.xyz/mp3/${lang}/">
    <link rel="icon" type="image/png" href="/favicon.png">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/style.css">
    
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "${langData.title} - SaveTikFast",
        "url": "https://savetik-fast.xyz/mp3/${lang}/",
        "description": "${langData.desc}",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "All",
        "inLanguage": "${lang}",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    }
    </script>
</head>
<body${isRTL ? ' class="rtl"' : ''}>
    <header id="main-header"></header>
    
    <nav class="nav-menu" aria-label="Download Types">
        <a href="/${lang}/" title="Video" data-i18n="nav_menu.video"><i class="fas fa-video"></i> Video</a>
        <a href="/mp3/${lang}/" class="active" title="MP3" data-i18n="nav_menu.mp3"><i class="fas fa-music"></i> MP3</a>
        <a href="/story/${lang}/" title="Stories" data-i18n="nav_menu.stories"><i class="fas fa-images"></i> Stories</a>
    </nav>

    <main id="main-content">
        <article class="hero-section">
            <h1>
                <i class="fas fa-music" style="color: var(--secondary);"></i>
                ${langData.title}
            </h1>
            <p>${langData.desc}</p>

            <div class="downloader-box">
                <div class="input-wrapper">
                    <input type="url" id="url-input" placeholder="Paste TikTok video link..." autocomplete="off">
                    <button id="paste-btn" type="button" title="Paste"><i class="fas fa-paste"></i></button>
                </div>
                <button id="download-btn"><i class="fas fa-music"></i> Download MP3</button>
            </div>

            <div id="result-area" role="region" aria-live="polite"></div>
        </article>

        <section class="container faq-section">
            <h2 class="section-title"><i class="fas fa-question-circle"></i> FAQ</h2>
            <div class="faq-container">
${faqsHTML}
            </div>
        </section>
    </main>

    <footer id="main-footer"></footer>
    <script src="/js/i18n-setup.js"></script>
    <script src="/logic.js"></script>
</body>
</html>`;
}

// Generate all pages
const mp3Dir = path.join(__dirname, 'mp3');
if (!fs.existsSync(mp3Dir)) fs.mkdirSync(mp3Dir);

Object.entries(LANGUAGES).forEach(([lang, data]) => {
    const langDir = path.join(mp3Dir, lang);
    if (!fs.existsSync(langDir)) fs.mkdirSync(langDir);

    const html = generateHTML(lang, data);
    fs.writeFileSync(path.join(langDir, 'index.html'), html, 'utf8');
    console.log(`✅ Generated: /mp3/${lang}/index.html`);
});

console.log('\n🎉 All MP3 pages generated successfully!');
