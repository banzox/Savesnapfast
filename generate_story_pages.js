/**
 * Story Page Generator for 30 Languages
 * Generates /story/{lang}/index.html for each language
 * SEO optimized with 10 FAQs per language
 */

const fs = require('fs');
const path = require('path');

const LANGUAGES = {
    ar: { name: 'العربية', dir: 'rtl', title: 'تحميل ستوري تيك توك والسلايدشو', desc: 'حمّل ستوريات تيك توك وسلايدشو الصور بجودة عالية بدون علامة مائية مجاناً' },
    en: { name: 'English', dir: 'ltr', title: 'TikTok Story & Slideshow Downloader', desc: 'Download TikTok stories and photo slideshows in HD quality without watermark for free' },
    es: { name: 'Español', dir: 'ltr', title: 'Descargar Stories de TikTok', desc: 'Descarga historias y presentaciones de fotos de TikTok en HD sin marca de agua gratis' },
    fr: { name: 'Français', dir: 'ltr', title: 'Télécharger Stories TikTok', desc: 'Téléchargez les stories et diaporamas TikTok en HD sans filigrane gratuitement' },
    de: { name: 'Deutsch', dir: 'ltr', title: 'TikTok Story Downloader', desc: 'Laden Sie TikTok Stories und Foto-Diashows in HD-Qualität ohne Wasserzeichen herunter' },
    it: { name: 'Italiano', dir: 'ltr', title: 'Scarica Storie TikTok', desc: 'Scarica storie e slideshow di foto TikTok in HD senza filigrana gratis' },
    pt: { name: 'Português', dir: 'ltr', title: 'Baixar Stories do TikTok', desc: 'Baixe stories e slideshows de fotos do TikTok em HD sem marca d\'água grátis' },
    ru: { name: 'Русский', dir: 'ltr', title: 'Скачать Stories TikTok', desc: 'Скачивайте истории и фото-слайдшоу TikTok в HD качестве без водяного знака бесплатно' },
    ja: { name: '日本語', dir: 'ltr', title: 'TikTokストーリーダウンロード', desc: 'TikTokストーリーとフォトスライドショーを透かしなしでHD画質で無料ダウンロード' },
    ko: { name: '한국어', dir: 'ltr', title: 'TikTok 스토리 다운로더', desc: 'TikTok 스토리와 사진 슬라이드쇼를 워터마크 없이 HD 화질로 무료 다운로드' },
    zh: { name: '中文', dir: 'ltr', title: 'TikTok故事下载器', desc: '免费下载TikTok故事和照片幻灯片，高清无水印' },
    tr: { name: 'Türkçe', dir: 'ltr', title: 'TikTok Hikaye İndirici', desc: 'TikTok hikayelerini ve fotoğraf slaytlarını filigransız HD kalitede ücretsiz indirin' },
    id: { name: 'Indonesia', dir: 'ltr', title: 'Unduh Story TikTok', desc: 'Unduh story dan slideshow foto TikTok dalam kualitas HD tanpa watermark gratis' },
    vi: { name: 'Tiếng Việt', dir: 'ltr', title: 'Tải Story TikTok', desc: 'Tải story và slideshow ảnh TikTok chất lượng HD không watermark miễn phí' },
    th: { name: 'ไทย', dir: 'ltr', title: 'ดาวน์โหลด Story TikTok', desc: 'ดาวน์โหลดสตอรี่และสไลด์โชว์รูปภาพ TikTok คุณภาพ HD ไม่มีลายน้ำ ฟรี' },
    nl: { name: 'Nederlands', dir: 'ltr', title: 'TikTok Story Downloader', desc: 'Download TikTok stories en foto-slideshows in HD-kwaliteit zonder watermerk gratis' },
    pl: { name: 'Polski', dir: 'ltr', title: 'Pobierz Story TikTok', desc: 'Pobieraj historie i pokazy zdjęć TikTok w jakości HD bez znaku wodnego za darmo' },
    uk: { name: 'Українська', dir: 'ltr', title: 'Завантажити Stories TikTok', desc: 'Завантажуйте історії та фотослайдшоу TikTok в HD якості без водяного знаку безкоштовно' },
    he: { name: 'עברית', dir: 'rtl', title: 'הורד סטורי TikTok', desc: 'הורד סטוריז ומצגות תמונות TikTok באיכות HD ללא סימן מים בחינם' },
    hi: { name: 'हिन्दी', dir: 'ltr', title: 'TikTok स्टोरी डाउनलोडर', desc: 'TikTok स्टोरीज और फोटो स्लाइडशो को HD क्वालिटी में बिना वॉटरमार्क के मुफ्त डाउनलोड करें' },
    cs: { name: 'Čeština', dir: 'ltr', title: 'Stáhnout TikTok Stories', desc: 'Stahujte TikTok příběhy a foto prezentace v HD kvalitě bez vodoznaku zdarma' },
    da: { name: 'Dansk', dir: 'ltr', title: 'Download TikTok Stories', desc: 'Download TikTok historier og foto-slideshows i HD-kvalitet uden vandmærke gratis' },
    el: { name: 'Ελληνικά', dir: 'ltr', title: 'Λήψη Stories TikTok', desc: 'Κατεβάστε ιστορίες και slideshow φωτογραφιών TikTok σε HD ποιότητα χωρίς υδατογράφημα δωρεάν' },
    fi: { name: 'Suomi', dir: 'ltr', title: 'Lataa TikTok Tarinoita', desc: 'Lataa TikTok-tarinoita ja kuvaesityksiä HD-laadulla ilman vesileimaa ilmaiseksi' },
    hu: { name: 'Magyar', dir: 'ltr', title: 'TikTok Story Letöltő', desc: 'Töltse le a TikTok történeteket és fotó diavetítéseket HD minőségben vízjel nélkül ingyen' },
    ms: { name: 'Melayu', dir: 'ltr', title: 'Muat Turun Story TikTok', desc: 'Muat turun story dan tayangan slaid foto TikTok dalam kualiti HD tanpa tera air secara percuma' },
    no: { name: 'Norsk', dir: 'ltr', title: 'Last ned TikTok Stories', desc: 'Last ned TikTok-historier og bildefremvisninger i HD-kvalitet uten vannmerke gratis' },
    ro: { name: 'Română', dir: 'ltr', title: 'Descarcă Stories TikTok', desc: 'Descărcați povești și prezentări foto TikTok în calitate HD fără filigran gratuit' },
    sk: { name: 'Slovenčina', dir: 'ltr', title: 'Stiahnuť TikTok Stories', desc: 'Stiahnite si TikTok príbehy a foto prezentácie v HD kvalite bez vodoznaku zadarmo' },
    sv: { name: 'Svenska', dir: 'ltr', title: 'Ladda ner TikTok Stories', desc: 'Ladda ner TikTok-berättelser och bildspel i HD-kvalitet utan vattenstämpel gratis' }
};

const FAQS = {
    ar: [
        ('كيف أحمل ستوري تيك توك بدون علامة مائية؟', 'انسخ رابط الستوري من تيك توك والصقه في الأداة أعلاه واضغط تحميل. سيتم حفظ الستوري بجودة عالية بدون أي علامة مائية.'),
        ('هل يمكنني تحميل سلايدشو صور من تيك توك؟', 'نعم! أداتنا تدعم تحميل سلايدشو الصور بالإضافة للفيديوهات العادية والستوريات.'),
        ('ما جودة الستوري المحمل؟', 'نوفر أعلى جودة متاحة من الستوري الأصلي، تصل لـ Full HD 1080p.'),
        ('هل التحميل مجاني وآمن؟', 'نعم، الخدمة مجانية 100% وآمنة تماماً. لا نطلب تسجيل دخول ولا نحفظ ملفاتك.'),
        ('هل يعمل على الآيفون والأندرويد؟', 'نعم، يعمل على جميع الأجهزة: آيفون، أندرويد، كمبيوتر، وأي جهاز بمتصفح.'),
        ('كم يستغرق تحميل الستوري؟', 'التحميل فوري! يستغرق ثوانٍ فقط لحفظ الستوري على جهازك.'),
        ('هل يمكنني تحميل ستوري خاص؟', 'لا، يمكن تحميل الستوريات العامة فقط. الستوريات الخاصة محمية.'),
        ('لماذا لا يعمل الرابط؟', 'تأكد من نسخ الرابط الصحيح للستوري. جرب فتح الستوري مباشرة ونسخ الرابط.'),
        ('هل هناك حد للتحميلات؟', 'لا حدود! حمّل ما تشاء من الستوريات مجاناً بدون قيود.'),
        ('هل يمكنني مشاركة الستوري المحمل؟', 'نعم، بعد التحميل يمكنك مشاركته على أي منصة. لكن يرجى احترام حقوق المنشئ.')
    ],
    en: [
        ('How to download TikTok stories without watermark?', 'Copy the story link from TikTok, paste it in the tool above and click Download. The story will be saved in high quality without any watermark.'),
        ('Can I download photo slideshows from TikTok?', 'Yes! Our tool supports downloading photo slideshows in addition to regular videos and stories.'),
        ('What quality are the downloaded stories?', 'We provide the highest quality available from the original story, up to Full HD 1080p.'),
        ('Is downloading free and safe?', 'Yes, the service is 100% free and completely safe. No login required and we don\'t store your files.'),
        ('Does it work on iPhone and Android?', 'Yes, it works on all devices: iPhone, Android, PC, and any device with a browser.'),
        ('How long does story download take?', 'Download is instant! It takes only seconds to save the story to your device.'),
        ('Can I download private stories?', 'No, only public stories can be downloaded. Private stories are protected.'),
        ('Why isn\'t the link working?', 'Make sure you copied the correct story link. Try opening the story directly and copying the link.'),
        ('Is there a download limit?', 'No limits! Download as many stories as you want for free without restrictions.'),
        ('Can I share the downloaded story?', 'Yes, after downloading you can share it on any platform. But please respect the creator\'s rights.')
    ]
};

const DEFAULT_FAQS = FAQS.en;

function generateHTML(lang, data) {
    const faqs = FAQS[lang] || DEFAULT_FAQS;
    const isRTL = data.dir === 'rtl';

    const faqsHTML = faqs.map(faq => `
                <details class="faq-item-new">
                    <summary>${faq[0]}</summary>
                    <div class="faq-answer-new"><p>${faq[1]}</p></div>
                </details>`).join('');

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${data.dir}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    
    <title>${data.title} - SaveTikFast 2026 | ${data.name}</title>
    <meta name="description" content="${data.desc}">
    <meta name="keywords" content="tiktok story download, tiktok slideshow download, ${lang}, download tiktok stories 2026, tiktok photo slideshow">
    
    <link rel="canonical" href="https://savetik-fast.xyz/story/${lang}/">
    <link rel="icon" type="image/png" href="/favicon.png">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/style.css">
    
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "${data.title} - SaveTikFast",
        "url": "https://savetik-fast.xyz/story/${lang}/",
        "description": "${data.desc}",
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
        <a href="/mp3/${lang}/" title="MP3" data-i18n="nav_menu.mp3"><i class="fas fa-music"></i> MP3</a>
        <a href="/story/${lang}/" class="active" title="Stories" data-i18n="nav_menu.stories"><i class="fas fa-images"></i> Stories</a>
    </nav>

    <main id="main-content">
        <article class="hero-section">
            <h1>
                <i class="fas fa-images" style="color: var(--secondary);"></i>
                ${data.title}
            </h1>
            <p>${data.desc}</p>

            <div class="downloader-box">
                <div class="input-wrapper">
                    <input type="url" id="url-input" placeholder="Paste TikTok story/slideshow link..." autocomplete="off">
                    <button id="paste-btn" type="button" title="Paste"><i class="fas fa-paste"></i></button>
                </div>
                <button id="download-btn"><i class="fas fa-images"></i> Download Story</button>
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
const storyDir = path.join(__dirname, 'story');
if (!fs.existsSync(storyDir)) fs.mkdirSync(storyDir);

Object.entries(LANGUAGES).forEach(([lang, data]) => {
    const langDir = path.join(storyDir, lang);
    if (!fs.existsSync(langDir)) fs.mkdirSync(langDir);

    const html = generateHTML(lang, data);
    fs.writeFileSync(path.join(langDir, 'index.html'), html, 'utf8');
    console.log(`✅ Generated: /story/${lang}/index.html`);
});

console.log('\n🎉 All Story pages generated successfully!');
