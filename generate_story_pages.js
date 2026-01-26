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
        { q: 'كيف أحمل ستوري تيك توك بدون علم صاحبها؟', a: 'انسخ رابط الستوري، الصقه في موقع SaveTikFast واضغط تحميل. التحميل يتم بخصوصية تامة ولا يتم إشعار صاحب الحساب.' },
        { q: 'هل يمكنني حفظ صور السلايدشو من تيك توك؟', a: 'نعم! أداتنا تدعم تحميل "سلايدشو الصور" (Photo Slideshows) وتحفظ كل الصور بجودة عالية دفعة واحدة.' },
        { q: 'هل جودة الستوري المحملة تكون واضحة؟', a: 'نوفر الستوري بنفس جودتها الأصلية (HD 1080p) بدون أي تقليل في الدقة.' },
        { q: 'هل تعمل الأداة على الآيفون؟', a: 'نعم، SaveTikFast يعمل بسلاسة على الآيفون (iOS) عبر متصفح سفاري، وكذلك على الأندرويد والكمبيوتر.' },
        { q: 'كم تبقى الستوري متاحة للتحميل؟', a: 'بمجرد نشر الستوري على تيك توك تكون متاحة للتحميل لمدة 24 ساعة (أو حتى يحذفها الناشر). حملها قبل اختفائها!' },
        { q: 'هل يمكنني تحميل ستوريات من حساب خاص (Private)؟', a: 'لا، نحترم الخصوصية ولا ندعم تحميل المحتوى من الحسابات الخاصة والمقفلة.' },
        { q: 'هل التحميل مجاني؟', a: 'نعم، الخدمة مجانية 100% وبدون عدد محدود للتحميلات.' },
        { q: 'أين أجد الستوري بعد تحميلها؟', a: 'عادة ما تجد الملفات في مجلد "الصور" أو "التنزيلات" في هاتفك.' },
        { q: 'هل أحتاج لتسجيل الدخول بحسابي؟', a: 'لا! لا نطلب منك تسجيل الدخول أبداً. فقط ضع الرابط وحمل.' },
        { q: 'هل يمكنني إعادة نشر الستوري؟', a: 'يمكنك ذلك، ولكن يفضل دائماً استئذان صاحب المحتوى الأصلي أو ذكر المصدر.' }
    ],
    en: [
        { q: 'How to download TikTok Stories anonymously?', a: 'Copy the story link, paste it on SaveTikFast, and click Download. The creator will not know you saved it.' },
        { q: 'Can I download TikTok photo slideshows?', a: 'Yes! We support downloading photo slideshows. All images are downloaded in high quality at once.' },
        { q: 'What is the quality of downloaded stories?', a: 'We save stories in their original resolution (High Definition 1080p) without any compression.' },
        { q: 'Does this work on iPhone iOS?', a: 'Yes, our tool works perfectly on iPhone (Safari), Android, and PC browsers.' },
        { q: 'How long can I download a story?', a: 'Stories are available for 24 hours on TikTok. Download them here before they expire!' },
        { q: 'Can I download private stories?', a: 'No, we respect user privacy. You can only download stories from public accounts.' },
        { q: 'Is it free to use?', a: 'Yes, SaveTikFast is 100% free with unlimited downloads.' },
        { q: 'Where are stories saved on my phone?', a: 'Check your "Photos" app or "Downloads" folder after saving.' },
        { q: 'Do I need to log in to TikTok?', a: 'No login required. We extract the story using the link only.' },
        { q: 'Can I save stories without watermark?', a: 'Yes, all stories and videos are downloaded clean without the TikTok watermark.' }
    ],
    fr: [
        { q: 'Comment télécharger une story TikTok anonymement ?', a: 'Copiez le lien, collez-le ici et téléchargez. Le créateur ne saura pas que vous avez sauvegardé sa story.' },
        { q: 'Puis-je télécharger des diaporamas photos ?', a: 'Oui ! Nous supportons le téléchargement des "Slideshows" photo en haute qualité.' },
        { q: 'Quelle est la qualité des stories ?', a: 'Originale (HD 1080p). Aucune perte de qualité lors du téléchargement.' },
        { q: 'Cela fonctionne-t-il sur iPhone ?', a: 'Oui, compatible avec iPhone (Safari), Android et PC/Mac.' },
        { q: 'Combien de temps pour télécharger ?', a: 'Les stories durent 24h. Sauvegardez-les ici avant qu\'elles ne disparaissent.' },
        { q: 'Puis-je télécharger depuis un compte privé ?', a: 'Non, seuls les comptes publics sont supportés par respect pour la vie privée.' },
        { q: 'Est-ce gratuit ?', a: '100% gratuit et illimité.' },
        { q: 'Où se trouve le fichier téléchargé ?', a: 'Vérifiez votre galerie photo ou le dossier Téléchargements.' },
        { q: 'Faut-il se connecter ?', a: 'Non, aucun compte TikTok n\'est nécessaire.' },
        { q: 'Le filigrane est-il supprimé ?', a: 'Oui, toutes les stories sont téléchargées sans logo TikTok.' }
    ],
    es: [
        { q: '¿Cómo descargar historias de TikTok anónimamente?', a: 'Copia el enlace, pégalo aquí y descarga. El creador no sabrá que la guardaste.' },
        { q: '¿Puedo descargar presentaciones de fotos?', a: '¡Sí! Soportamos la descarga de "Photo Slideshows" en alta calidad.' },
        { q: '¿Qué calidad tienen las historias?', a: 'Guardamos en la resolución original (HD 1080p) sin compresión.' },
        { q: '¿Funciona en iPhone?', a: 'Sí, funciona perfecto en iPhone (Safari), Android y PC.' },
        { q: '¿Cuánto tiempo tengo para descargar?', a: 'Las historias duran 24h. ¡Descárgalas antes de que expiren!' },
        { q: '¿Soporta cuentas privadas?', a: 'No, solo cuentas públicas. No podemos acceder a contenido privado.' },
        { q: '¿Es gratis?', a: 'Sí, SaveTikFast es 100% gratuito e ilimitado.' },
        { q: '¿Dónde se guardan los archivos?', a: 'Revisa tu Galería o carpeta de Descargas.' },
        { q: '¿Necesito iniciar sesión?', a: 'No requerimos tu cuenta ni contraseña.' },
        { q: '¿Se descarga sin marca de agua?', a: 'Sí, totalmente limpio sin el logo de TikTok.' }
    ],
    de: [
        { q: 'Wie lade ich TikTok Stories anonym herunter?', a: 'Link kopieren, hier einfügen und laden. Der Ersteller wird nicht benachrichtigt.' },
        { q: 'Kann ich Foto-Diashows laden?', a: 'Ja! Wir unterstützen den Download von Foto-Slideshows in HD.' },
        { q: 'Wie ist die Qualität?', a: 'Wir speichern in Originalqualität (Full HD) ohne Verlust.' },
        { q: 'Geht das auf dem iPhone?', a: 'Ja, funktioniert problemlos auf iPhone, Android und PC.' },
        { q: 'Kann ich private Stories laden?', a: 'Nein, nur öffentliche Stories werden unterstützt.' },
        { q: 'Ist es kostenlos?', a: 'Ja, komplett kostenlos und ohne Limits.' },
        { q: 'Wo werden die Dateien gespeichert?', a: 'In Ihrer Galerie oder im Download-Ordner.' },
        { q: 'Muss ich mich anmelden?', a: 'Kein Login erforderlich.' },
        { q: 'Sind die Videos ohne Wasserzeichen?', a: 'Ja, alle Downloads sind ohne störendes TikTok-Logo.' },
        { q: 'Wie lange dauert der Download?', a: 'Sofort! In wenigen Sekunden ist die Story gespeichert.' }
    ],
    // Add translations for ID, TR, RU, PT... (Template populated)
    ru: [
        { q: 'Как скачать историю ТикТок анонимно?', a: 'Скопируйте ссылку, вставьте здесь и скачайте. Автор не узнает об этом.' },
        { q: 'Можно ли скачать слайд-шоу из фото?', a: 'Да! Мы поддерживаем загрузку фото-слайдшоу в высоком качестве.' },
        { q: 'Какое качество видео?', a: 'Оригинальное HD качество без сжатия.' },
        { q: 'Работает на айфоне?', a: 'Да, работает на iPhone, Android и ПК.' },
        { q: 'Можно ли скачать из закрытого профиля?', a: 'Нет, только из открытых (публичных) аккаунтов.' },
        { q: 'Это бесплатно?', a: 'Да, 100% бесплатно и без ограничений.' },
        { q: 'Где найти скачанный файл?', a: 'Проверьте галерею или папку Загрузки.' },
        { q: 'Нужна ли регистрация?', a: 'Нет, вход в аккаунт не требуется.' },
        { q: 'Видео будет без водяного знака?', a: 'Да, мы удаляем логотип TikTok.' },
        { q: 'Как быстро происходит скачивание?', a: 'Мгновенно, всего за пару секунд.' }
    ],
    tr: [
        { q: 'TikTok hikayeleri gizlice nasıl indirilir?', a: 'Linki kopyalayın, yapıştırın ve indirin. Karşı tarafa bildirim gitmez.' },
        { q: 'Fotoğraf slaytlarını indirebilir miyim?', a: 'Evet! Fotoğraf slaytlarını (Slideshow) HD kalitede indirebilirsiniz.' },
        { q: 'Videoların kalitesi nedir?', a: 'Orijinal kalitede (HD 1080p) kaydedilir.' },
        { q: 'iPhone\'da çalışıyor mu?', a: 'Evet, iPhone, Android ve PC\'de sorunsuz çalışır.' },
        { q: 'Gizli hesaptan indirebilir miyim?', a: 'Hayır, sadece herkese açık hesaplar desteklenir.' },
        { q: 'Ücretli mi?', a: 'Hayır, tamamen ücretsiz ve sınırsızdır.' },
        { q: 'Dosyalar nereye iniyor?', a: 'Galerinize veya İndirilenler klasörüne bakın.' },
        { q: 'Giriş yapmam gerekiyor mu?', a: 'Hayır, şifre veya üyelik gerekmez.' },
        { q: 'Filigran var mı?', a: 'Hayır, filigransız (logosuz) olarak indirilir.' },
        { q: 'İndirme ne kadar sürer?', a: 'Sadece birkaç saniye sürer.' }
    ],
    id: [
        { q: 'Cara download Story TikTok secara anonim?', a: 'Salin tautan, tempel di sini, dan unduh. Pemilik akun tidak akan tahu.' },
        { q: 'Bisa download slideshow foto?', a: 'Ya! Kami mendukung unduhan Slideshow Foto kualitas HD.' },
        { q: 'Bagaimana kualitas videonya?', a: 'Kualitas asli (HD 1080p) tanpa kompresi.' },
        { q: 'Apakah bisa di iPhone?', a: 'Ya, bekerja di iPhone (Safari), Android, dan PC.' },
        { q: 'Bisa download dari akun privat?', a: 'Tidak, hanya akun publik yang didukung.' },
        { q: 'Apakah gratis?', a: 'Ya, 100% gratis tanpa batas.' },
        { q: 'Di mana file tersimpan?', a: 'Cek Galeri atau folder Download di HP Anda.' },
        { q: 'Perlu login akun?', a: 'Tidak perlu login atau daftar.' },
        { q: 'Apakah ada watermark?', a: 'Tidak, video bersih tanpa watermark TikTok.' },
        { q: 'Berapa lama prosesnya?', a: 'Sangat cepat, hanya beberapa detik.' }
    ],
    pt: [
        { q: 'Como baixar Stories anonimamente?', a: 'Copie o link, cole aqui e baixe. O criador não saberá.' },
        { q: 'Posso baixar apresentações de fotos?', a: 'Sim! Baixe slideshows de fotos em alta qualidade.' },
        { q: 'Qual a qualidade?', a: 'Qualidade original (HD 1080p) sem perdas.' },
        { q: 'Funciona no iPhone?', a: 'Sim, compatível com iPhone, Android e PC.' },
        { q: 'Posso baixar de conta privada?', a: 'Não, apenas contas públicas.' },
        { q: 'É gratuito?', a: 'Sim, totalmente grátis e ilimitado.' },
        { q: 'Onde fica salvo?', a: 'Olhe na sua Galeria ou Downloads.' },
        { q: 'Preciso de login?', a: 'Não, sem cadastro.' },
        { q: 'Vem com marca d\'água?', a: 'Não, removemos a marca do TikTok.' },
        { q: 'Demora muito?', a: 'É instantâneo, leva segundos.' }
    ]
};

// Default FAQs for languages without specific translations
const DEFAULT_FAQS = FAQS.en;

const storyTemplate = fs.readFileSync('story.html', 'utf8');

function generateHTML(lang, data) {
    const faqs = FAQS[lang] || DEFAULT_FAQS;
    const isRTL = data.dir === 'rtl';

    let content = storyTemplate;

    // Update html attributes
    content = content.replace(/<html lang="en">/, `<html lang="${lang}" dir="${data.dir}">`);
    if (isRTL) {
        content = content.replace(/<body/i, '<body class="rtl"');
    }

    // Update Title and Meta Description
    content = content.replace(/<title>.*?<\/title>/, `<title>${data.title} - SaveTikFast 2026 | ${data.name}</title>`);
    content = content.replace(/content="Download TikTok Stories and Slideshows.*?"/, `content="${data.desc}"`);

    // Update Canonical and Hreflangs
    const hreflangTags = Object.keys(LANGUAGES).map(code =>
        `<link rel="alternate" hreflang="${code}" href="https://savetik-fast.xyz/story/${code}/" />`
    ).join('\n    ');
    const xDefault = `<link rel="alternate" hreflang="x-default" href="https://savetik-fast.xyz/story/en/" />`;
    const fullHreflangs = `${xDefault}\n    ${hreflangTags}`;

    content = content.replace(/<!-- Hreflang Tags for Story Page -->[\s\S]*?<!-- Preconnect/, `<!-- Hreflang Tags for SEO -->\n    ${fullHreflangs}\n\n    <!-- Preconnect`);
    content = content.replace(/<link rel="canonical" href=".*?"/, `<link rel="canonical" href="https://savetik-fast.xyz/story/${lang}/"`);

    // Add localStorage script for i18next
    content = content.replace(/<\/head>/, `<script>localStorage.setItem('i18nextLng', '${lang}');</script>\n</head>`);

    // Update H1 and P tags
    content = content.replace(/<h1[^>]*?>.*?<\/h1>/, `<h1>\n                <i class="fas fa-images" style="color: var(--secondary);"></i>\n                ${data.title}\n            </h1>`);
    content = content.replace(/<p data-i18n="story_page.desc">.*?<\/p>/, `<p data-i18n="story_page.desc">${data.desc}</p>`);

    // Inject FAQs
    const faqsHTML = faqs.map(faq => `
                <details class="faq-item-new">
                    <summary>${faq.q}</summary>
                    <div class="faq-answer-new"><p>${faq.a}</p></div>
                </details>`).join('');
    content = content.replace(/<!-- FAQ_PLACEHOLDER -->/, faqsHTML);

    return content;
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
