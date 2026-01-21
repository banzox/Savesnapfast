// ============================================================
// الحل الجذري الشامل: دمج قاعدة بيانات الترجمة (30 لغة)
// ============================================================

const resources = {
  ar: {
    translation: {
      "meta": { "title": "تحميل فيديو تيك توك بدون علامة مائية HD - Snaptiks 2026", "description": "أسرع أداة تحميل فيديوهات تيك توك بدون علامة مائية بجودة عالية HD. حفظ مقاطع TikTok وتحويلها إلى MP3 مجاناً." },
      "nav": { "home": "الرئيسية", "about": "حول", "contact": "تواصل", "disclaimer": "إخلاء المسؤولية", "terms": "الشروط", "privacy": "الخصوصية", "dmca": "DMCA" },
      "hero": { "title": "تحميل فيديو تيك توك", "desc": "أداة سريعة ومجانية لتحميل فيديوهات تيك توك بدون علامة مائية وبجودة عالية." },
      "downloader": { "placeholder": "الصق رابط تيك توك هنا...", "btn_download": "تحميل الآن" },
      "status": { "processing": "جاري معالجة الفيديو..." },
      "result": { "download_video": "تحميل الفيديو", "download_audio": "تحميل MP3" },
      "faq": { "title": "الأسئلة الشائعة", "q1": "كيفية التحميل؟", "a1": "انسخ رابط الفيديو، الصقه هنا، واضغط تحميل.", "q2": "هل هو مجاني؟", "a2": "نعم، الموقع مجاني تماماً وغير محدود.", "q3": "هل يمكن تحميل الصوت فقط؟", "a3": "نعم، نوفر خيار تحميل MP3." },
      "footer": { "rights": "جميع الحقوق محفوظة", "terms": "الشروط", "privacy": "الخصوصية" },
      "pages": {
        "about": { "title": "من نحن", "content": "Snaptiks هو تطبيق ويب متطور يساعدك على حفظ فيديوهات تيك توك المفضلة لديك بدون علامة مائية وبجودة أصلية." },
        "privacy": { "title": "سياسة الخصوصية", "content": "نحن نقدر خصوصيتك؛ لا نقوم بتخزين أي فيديوهات أو بيانات شخصية للمستخدمين على خوادمنا." },
        "terms": { "title": "شروط الاستخدام", "content": "يُسمح باستخدام هذه الأداة للأغراض الشخصية فقط. نحن غير مسؤولين عن سوء استخدام المحتوى المحمل." },
        "dmca": { "title": "حقوق الملكية DMCA", "content": "نحن نحترم حقوق الطبع والنشر. إذا وجد محتوى ينتهك حقوقك، يرجى مراسلتنا فوراً." },
        "disclaimer": { "title": "إخلاء المسؤولية", "content": "هذا الموقع أداة مستقلة ولا ينتمي رسمياً لشركة TikTok أو ByteDance." },
        "contact": { "title": "اتصل بنا", "content": "لأي استفسار يرجى مراسلتنا عبر البريد الإلكتروني." }
      },
      "about": {
        "intro": { "p1": "Snaptiks هي واحدة من أفضل أدوات تحميل التيك توك المتاحة عبر الإنترنت لتحميل فيديوهات TikTok بدون علامة مائية.", "p2": "لست بحاجة لتثبيت أي برنامج على جهاز الكمبيوتر أو الهاتف المحمول، كل ما تحتاجه هو رابط فيديو TikTok." },
        "steps": { "title": "كيف يعمل؟", "step1": { "desc": "انسخ رابط الفيديو من تيك توك" }, "step2": { "desc": "الصق الرابط في الخانة بالأعلى" }, "step3": { "desc": "اضغط تحميل واحفظ الفيديو" } },
        "features": { "title": "المميزات", "list": { "no_watermark": "بدون علامة مائية", "hd": "جودة HD", "free": "مجاني تماماً", "fast": "سريع جداً" } }
      }
    }
  },
  en: {
    translation: {
      "meta": { "title": "TikTok Downloader Without Watermark HD - Snaptiks 2026", "description": "Download TikTok videos without watermark for free in HD quality. Save TikTok videos and convert to MP3 with Snaptiks." },
      "nav": { "home": "Home", "about": "About", "contact": "Contact", "disclaimer": "Disclaimer", "terms": "Terms", "privacy": "Privacy", "dmca": "DMCA" },
      "hero": { "title": "TikTok Video Downloader", "desc": "Fast, free, and easy way to save TikTok videos without watermark in HD quality." },
      "downloader": { "placeholder": "Paste TikTok link here...", "btn_download": "Download Now" },
      "status": { "processing": "Processing your video..." },
      "result": { "download_video": "Download Video", "download_audio": "Download MP3" },
      "faq": { "title": "FAQ", "q1": "How to download?", "a1": "Copy the video link, paste it here, and click download.", "q2": "Is it free?", "a2": "Yes, our service is 100% free and unlimited.", "q3": "Can I download Audio?", "a3": "Yes, we support MP3 download." },
      "footer": { "rights": "All rights reserved", "terms": "Terms", "privacy": "Privacy" },
      "pages": {
        "about": { "title": "About Us", "content": "Snaptiks is a powerful web application designed to help you download and save your favorite TikTok content easily." },
        "privacy": { "title": "Privacy Policy", "content": "We respect your privacy. No user data or video content is stored on our servers." },
        "terms": { "title": "Terms of Service", "content": "Usage is for personal purposes only. We are not responsible for how you use the downloaded content." },
        "dmca": { "title": "DMCA Policy", "content": "We respect intellectual property. Contact us for any copyright concerns." },
        "disclaimer": { "title": "Disclaimer", "content": "This site is an independent tool and not affiliated with TikTok or ByteDance." },
        "contact": { "title": "Contact Us", "content": "Feel free to reach out via email." }
      },
      "about": {
        "intro": { "p1": "Snaptiks is one of the best TikTok Downloaders available online to download TikTok videos without a watermark.", "p2": "You are not required to install any software on your computer or mobile phone, all that you need is a TikTok video link." },
        "steps": { "title": "How it works?", "step1": { "desc": "Copy video link from TikTok" }, "step2": { "desc": "Paste the link above" }, "step3": { "desc": "Click Download & Save" } },
        "features": { "title": "Features", "list": { "no_watermark": "No Watermark", "hd": "HD Quality", "free": "Free Forever", "fast": "Super Fast" } }
      }
    }
  },
  fr: { translation: { "nav": { "home": "Accueil", "about": "À propos", "terms": "Conditions" }, "hero": { "title": "Téléchargeur TikTok", "desc": "Sans filigrane - Rapide et gratuit" }, "pages": { "about": { "title": "À propos", "content": "Snaptiks vous aide à sauvegarder des vidéos TikTok sans logo." } } } },
  es: { translation: { "nav": { "home": "Inicio", "about": "Nosotros", "terms": "Términos" }, "hero": { "title": "Descargador TikTok", "desc": "Sin marca de agua - Gratis y rápido" }, "pages": { "about": { "title": "Nosotros", "content": "Snaptiks te ayuda a guardar videos de TikTok sin marca." } } } },
  de: { translation: { "nav": { "home": "Start", "about": "Über uns", "terms": "Bedingungen" }, "hero": { "title": "TikTok Downloader", "desc": "Ohne Wasserzeichen - Schnell & Kostenlos" }, "pages": { "about": { "title": "Über uns", "content": "Snaptiks hilft Ihnen, TikTok-Videos ohne Logo zu speichern." } } } },
  id: { translation: { "nav": { "home": "Beranda", "about": "Tentang", "terms": "Syarat" }, "hero": { "title": "Pengunduh TikTok", "desc": "Tanpa Watermark - Cepat & Gratis" }, "pages": { "about": { "title": "Tentang Kami", "content": "Snaptiks membantu Anda menyimpan video TikTok tanpa tanda air." } } } },
  pt: { translation: { "nav": { "home": "Início", "about": "Sobre", "terms": "Termos" }, "hero": { "title": "Baixador TikTok", "desc": "Sem marca d'água - Rápido e grátis" }, "pages": { "about": { "title": "Sobre", "content": "Snaptiks ajuda você a salvar vídeos do TikTok sem logo." } } } },
  ru: { translation: { "nav": { "home": "Главная", "about": "О нас", "terms": "Условия" }, "hero": { "title": "Загрузчик TikTok", "desc": "Без водяного знака - Быстро и бесплатно" }, "pages": { "about": { "title": "О нас", "content": "Snaptiks помогает скачивать видео TikTok без логотипа." } } } },
  tr: { translation: { "nav": { "home": "Anasayfa", "about": "Hakkında", "terms": "Şartlar" }, "hero": { "title": "TikTok İndirici", "desc": "Filigransız - Hızlı ve Ücretsiz" }, "pages": { "about": { "title": "Hakkında", "content": "Snaptiks, TikTok videolarını logosuz kaydetmenize yardımcı olur." } } } },
  it: { translation: { "nav": { "home": "Home", "about": "Chi siamo", "terms": "Termini" }, "hero": { "title": "TikTok Downloader", "desc": "Senza filigrana - Veloce e gratuito" }, "pages": { "about": { "title": "Chi siamo", "content": "Snaptiks ti aiuta a salvare video TikTok senza logo." } } } },
  ja: { translation: { "nav": { "home": "ホーム", "about": "紹介", "terms": "規約" }, "hero": { "title": "TikTok保存", "desc": "ロゴなし - 高速・無料" }, "pages": { "about": { "title": "紹介", "content": "SnaptiksはTikTok動画をロゴなしで保存するツールです。" } } } },
  zh: { translation: { "nav": { "home": "首页", "about": "关于", "terms": "条款" }, "hero": { "title": "TikTok 下载器", "desc": "无水印 - 快速免费" }, "pages": { "about": { "title": "关于我们", "content": "Snaptiks 帮助您保存无水印的 TikTok 视频。" } } } },
  vi: { translation: { "nav": { "home": "Trang chủ", "about": "Giới thiệu", "terms": "Điều khoản" }, "hero": { "title": "Tải TikTok", "desc": "Không logo - Nhanh và miễn phí" }, "pages": { "about": { "title": "Giới thiệu", "content": "Snaptiks giúp bạn lưu video TikTok không có logo." } } } },
  hi: { translation: { "nav": { "home": "होम", "about": "बारे में", "terms": "नियम" }, "hero": { "title": "टिकटॉक डाउनलोडर", "desc": "बिना वॉटरमार्क - तेज़ और मुफ़्त" }, "pages": { "about": { "title": "हमारे बारे में", "content": "Snaptiks आपको बिना लोगो के टिकटॉक वीडियो डाउनलोड करने में मदद करता है।" } } } },
  nl: { translation: { "nav": { "home": "Home", "about": "Over", "terms": "Voorwaarden" }, "hero": { "title": "TikTok Downloader", "desc": "Zonder watermerk - Snel & Gratis" }, "pages": { "about": { "title": "Over ons", "content": "Snaptiks helpt u TikTok-video's zonder logo op te slaan." } } } },
  ko: { translation: { "nav": { "home": "홈", "about": "정보", "terms": "약관" }, "hero": { "title": "틱톡 다운로더", "desc": "워터마크 없음 - 빠르고 무료" }, "pages": { "about": { "title": "정보", "content": "Snaptiks는 틱톡 동영상을 워터마크 없이 저장해줍니다." } } } },
  th: { translation: { "nav": { "home": "หน้าแรก", "about": "เกี่ยวกับ", "terms": "ข้อกำหนด" }, "hero": { "title": "ดาวน์โหลด TikTok", "desc": "ไม่มีลายน้ำ - เร็วและฟรี" }, "pages": { "about": { "title": "เกี่ยวกับเรา", "content": "Snaptiks ช่วยให้คุณบันทึกวิดีโอ TikTok โดยไม่มีโลโก้" } } } },
  pl: { translation: { "nav": { "home": "Start", "about": "O nas", "terms": "Warunki" }, "hero": { "title": "Pobieracz TikTok", "desc": "Bez znaku wodnego - Szybko i bezpłatnie" }, "pages": { "about": { "title": "O nas", "content": "Snaptiks pomaga pobierać filmy z TikToka bez logo." } } } },
  uk: { translation: { "nav": { "home": "Головна", "about": "Про нас", "terms": "Умови" }, "hero": { "title": "Завантажувач TikTok", "desc": "Без водяного знака - Швидко і безкоштовно" }, "pages": { "about": { "title": "Про нас", "content": "Snaptiks допомагає зберігати відео TikTok без логотипа." } } } },
  el: { translation: { "nav": { "home": "Αρχική", "about": "Σχετικά", "terms": "Όροι" }, "hero": { "title": "TikTok Downloader", "desc": "Χωρίς υδατογράφημα - Γρήγορα και δωρεάν" }, "pages": { "about": { "title": "Σχετικά", "content": "Το Snaptiks σας βοηθά να αποθηκεύετε βίντεο TikTok χωρίς λογότυπο." } } } },
  sv: { translation: { "nav": { "home": "Hem", "about": "Om", "terms": "Villkor" }, "hero": { "title": "TikTok Downloader", "desc": "Utan vattenstämpel - Snabb & Gratis" }, "pages": { "about": { "title": "Om oss", "content": "Snaptiks hjälper dig att spara TikTok-videor utan logotyp." } } } },
  no: { translation: { "nav": { "home": "Hjem", "about": "Om", "terms": "Vilkår" }, "hero": { "title": "TikTok Downloader", "desc": "Uten vannmerke - Rask og gratis" }, "pages": { "about": { "title": "Om oss", "content": "Snaptiks hjelper deg med å lagre TikTok-videoer uten logo." } } } },
  da: { translation: { "nav": { "home": "Hjem", "about": "Om", "terms": "Vilkår" }, "hero": { "title": "TikTok Downloader", "desc": "Uden vandmærke - Hurtig og gratis" }, "pages": { "about": { "title": "Om os", "content": "Snaptiks hjælper dig med at gemme TikTok-videoer uden logo." } } } },
  fi: { translation: { "nav": { "home": "Koti", "about": "Tietoa", "terms": "Ehdot" }, "hero": { "title": "TikTok Downloader", "desc": "Ilman vesileimaa - Nopea ja ilmainen" }, "pages": { "about": { "title": "Tietoa meistä", "content": "Snaptiks auttaa sinua tallentamaan TikTok-videoita ilman logoa." } } } },
  cs: { translation: { "nav": { "home": "Domů", "about": "O nás", "terms": "Podmínky" }, "hero": { "title": "TikTok Downloader", "desc": "Bez vodoznaku - Rychle a zdarma" }, "pages": { "about": { "title": "O nás", "content": "Snaptiks vám pomůže uložit videa z TikToku bez loga." } } } },
  hu: { translation: { "nav": { "home": "Főoldal", "about": "Rólunk", "terms": "Feltételek" }, "hero": { "title": "TikTok Downloader", "desc": "Vízjel nélkül - Gyors és ingyenes" }, "pages": { "about": { "title": "Rólunk", "content": "A Snaptiks segít menteni a TikTok videókat logó nélkül." } } } },
  ro: { translation: { "nav": { "home": "Acasă", "about": "Despre", "terms": "Termeni" }, "hero": { "title": "TikTok Downloader", "desc": "Fără watermark - Rapid și gratuit" }, "pages": { "about": { "title": "Despre noi", "content": "Snaptiks vă ajută să salvați videoclipuri TikTok fără logo." } } } },
  sk: { translation: { "nav": { "home": "Domov", "about": "O nás", "terms": "Podmienky" }, "hero": { "title": "TikTok Downloader", "desc": "Bez vodoznaku - Rýchlo a zadarmo" }, "pages": { "about": { "title": "O nás", "content": "Snaptiks vám pomôže uložiť videá z TikToku bez loga." } } } },
  bg: { translation: { "nav": { "home": "Начало", "about": "За нас", "terms": "Условия" }, "hero": { "title": "TikTok Downloader", "desc": "Без воден знак - Бързо и безплатно" }, "pages": { "about": { "title": "За нас", "content": "Snaptiks ви помага да запазвате видеоклипове от TikTok без лого." } } } },
  he: { translation: { "nav": { "home": "בית", "about": "אודות", "terms": "תנאים" }, "hero": { "title": "הורדת טיקטוק", "desc": "ללא סימן מים - מהיר ובחינם" }, "pages": { "about": { "title": "אודותינו", "content": "Snaptiks עוזר לך לשמור סרטוני טיקטוק ללא לוגו." } } } }
};

const supportedLanguages = [
    { code: 'ar', name: 'العربية' }, { code: 'en', name: 'English' }, { code: 'fr', name: 'Français' }, { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' }, { code: 'id', name: 'Bahasa Indonesia' }, { code: 'pt', name: 'Português' }, { code: 'ru', name: 'Русский' },
    { code: 'tr', name: 'Türkçe' }, { code: 'it', name: 'Italiano' }, { code: 'ja', name: '日本語' }, { code: 'zh', name: '中文' },
    { code: 'vi', name: 'Tiếng Việt' }, { code: 'hi', name: 'हिन्दी' }, { code: 'nl', name: 'Nederlands' }, { code: 'ko', name: '한국어' },
    { code: 'th', name: 'ไทย' }, { code: 'pl', name: 'Polski' }, { code: 'uk', name: 'Українська' }, { code: 'el', name: 'Ελληνικά' },
    { code: 'sv', name: 'Svenska' }, { code: 'no', name: 'Norsk' }, { code: 'da', name: 'Dansk' }, { code: 'fi', name: 'Suomi' },
    { code: 'cs', name: 'Čeština' }, { code: 'hu', name: 'Magyar' }, { code: 'ro', name: 'Română' }, { code: 'sk', name: 'Slovenčina' },
    { code: 'bg', name: 'Български' }, { code: 'he', name: 'עברית' }
];

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof i18next === 'undefined') return;
    
    try {
        await i18next.use(i18nextBrowserLanguageDetector).init({
            fallbackLng: 'en',
            debug: false,
            resources: resources, // 🔥 هنا يكمن الحل: استخدام الموارد المدمجة
            detection: { 
                order: ['localStorage', 'navigator'], 
                caches: ['localStorage'] 
            }
        });
        
        injectStylesForSubpages(); 
        injectMasterLayout();      
        applyTranslations();       
    } catch (error) { console.error('i18next error:', error); }

    i18next.on('languageChanged', () => applyTranslations());
});

// -----------------------------------------------------------
// بقية الدوال البرمجية (للهيدر والفوتر والستايل)
// -----------------------------------------------------------

function injectStylesForSubpages() {
    if (!document.getElementById('main-header')) return; 

    const style = document.createElement('style');
    style.innerHTML = `
        header { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 1rem 0; position: fixed; width: 100%; top: 0; z-index: 1000; }
        .nav-container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: 800; color: white; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; }
        .nav-links { display: flex; list-style: none; gap: 1.5rem; align-items: center; margin: 0; }
        .nav-links a { color: white; text-decoration: none; font-weight: 500; transition: 0.3s; }
        .nav-links a:hover { color: #00f2ea; }
        .footer-grid { text-align: center; padding: 2rem; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 4rem; background: rgba(0,0,0,0.2); }
        .footer-nav { margin-bottom: 1rem; }
        .footer-nav a { margin: 0 10px; color: rgba(255,255,255,0.7); text-decoration: none; }
        .footer-nav a:hover { color: white; }
        .rights { color: rgba(255,255,255,0.5); font-size: 0.9rem; }
        .lang-select { padding: 5px; border-radius: 5px; background: #222; color: #fff; border: 1px solid #444; }
        @media (max-width: 768px) { .nav-links { display: none; } }
    `;
    document.head.appendChild(style);
}

function injectMasterLayout() {
    const header = document.getElementById('main-header');
    const footer = document.getElementById('main-footer');
    if (header) {
        header.innerHTML = `
        <nav class="nav-container">
            <a href="index.html" class="logo"><i class="fab fa-tiktok"></i> Snaptiks</a>
            <ul class="nav-links">
                <li><a href="index.html" data-i18n="nav.home">الرئيسية</a></li>
                <li><a href="about.html" data-i18n="nav.about">حول</a></li>
                <li><a href="contact.html" data-i18n="nav.contact">تواصل</a></li>
                <li id="lang-picker-slot"></li>
            </ul>
        </nav>`;
        createPicker('lang-picker-slot');
    }
    if (footer) {
        footer.innerHTML = `
        <div class="footer-grid">
            <div class="footer-nav">
                <a href="index.html" data-i18n="nav.home"></a>
                <a href="terms.html" data-i18n="nav.terms"></a>
                <a href="privacy.html" data-i18n="nav.privacy"></a>
                <a href="disclaimer.html" data-i18n="nav.disclaimer"></a>
            </div>
            <p class="rights">&copy; 2026 Snaptiks. <span data-i18n="footer.rights"></span></p>
        </div>`;
    }
}

function createPicker(slotId) {
    const slot = document.getElementById(slotId);
    if (!slot) return;
    const sel = document.createElement('select');
    sel.className = 'lang-select';
    sel.onchange = (e) => i18next.changeLanguage(e.target.value);
    supportedLanguages.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l.code; opt.text = l.name;
        if(l.code === i18next.language) opt.selected = true;
        sel.add(opt);
    });
    slot.appendChild(sel);
}

function applyTranslations() {
    const lang = i18next.language;
    if(!lang) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = ['ar', 'he'].includes(lang) ? 'rtl' : 'ltr';
    if (i18next.exists('meta.title')) document.title = i18next.t('meta.title');
    const desc = document.querySelector('meta[name="description"]');
    if (desc && i18next.exists('meta.description')) desc.setAttribute('content', i18next.t('meta.description'));
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const attrMatch = key.match(/^\[(.*)\](.*)/);
        if (attrMatch) { el.setAttribute(attrMatch[1], i18next.t(attrMatch[2])); } else { el.innerHTML = i18next.t(key); }
    });
}
