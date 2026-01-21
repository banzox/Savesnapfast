// 1. القائمة المعتمدة للغات (30 لغة كما في ملف sitemap)
const supportedLanguages = ['en', 'ar', 'id', 'tr', 'fr', 'es', 'de', 'pt', 'ru', 'it', 'ja', 'zh', 'vi', 'hi', 'nl', 'ko', 'th', 'pl', 'uk', 'el', 'sv', 'no', 'da', 'fi', 'cs', 'hu', 'ro', 'sk', 'ms', 'he'];

const languageNames = {
    en: "English", ar: "العربية", id: "Bahasa Indonesia", tr: "Türkçe", fr: "Français",
    es: "Español", de: "Deutsch", pt: "Português", ru: "Русский", it: "Italiano",
    ja: "日本語", zh: "简体中文", vi: "Tiếng Việt", hi: "हिन्दी", nl: "Nederlands",
    ko: "한국어", th: "ไทย", pl: "Polski", uk: "Українська", el: "Ελληνικά",
    sv: "Svenska", no: "Norsk", da: "Dansk", fi: "Suomi", cs: "Čeština",
    hu: "Magyar", ro: "Română", sk: "Slovenčina", ms: "Bahasa Melayu", he: "עبرى"
};

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof i18next === 'undefined') return;

    try {
        await i18next
            .use(i18nextHttpBackend)
            .use(i18nextBrowserLanguageDetector)
            .init({
                fallbackLng: 'en',
                supportedLngs: supportedLanguages,
                backend: { loadPath: './locales/{{lng}}.json' }, // مسار ملفات JSON المرفوعة
                detection: { 
                    order: ['querystring', 'localStorage', 'navigator'], 
                    lookupQuerystring: 'lang',
                    caches: ['localStorage'] 
                }
            });

        injectMasterLayout(); // بناء الهيدر والفوتر
        updateContent();      // ترجمة النصوص الأساسية
        renderHomeFAQ();      // بناء الأسئلة الشائعة الـ 10
    } catch (error) {
        console.error('I18n Init Error:', error);
    }

    // تحديث الموقع فور تغيير اللغة
    i18next.on('languageChanged', (lng) => {
        updateContent();
        renderHomeFAQ();
        const sel = document.querySelector('.lang-select');
        if (sel) sel.value = lng;
    });
});

// وظيفة ترجمة العناصر وضبط الاتجاه (RTL/LTR)
function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        // دعم ترجمة السمات مثل placeholder
        const attrMatch = key.match(/^\[(.*)\](.*)/);
        if (attrMatch) {
            const translated = i18next.t(attrMatch[2]);
            if (translated && translated !== attrMatch[2]) el.setAttribute(attrMatch[1], translated);
        } else {
            const translated = i18next.t(key);
            if (translated && translated !== key) el.innerHTML = translated;
        }
    });

    const currentLng = i18next.language;
    document.documentElement.lang = currentLng;
    // ضبط اتجاه الصفحة للغات العربية والعبرية
    document.documentElement.dir = ['ar', 'he'].includes(currentLng) ? 'rtl' : 'ltr';
    
    // تحديث الميتا تاق للسيو
    document.title = i18next.t('meta.title');
}

// بناء نظام الأسئلة الشائعة التفاعلي (فتح وغلق)
function renderHomeFAQ() {
    const container = document.getElementById('home-faq-list');
    if (!container) return;
    
    let html = '';
    // سحب الأسئلة من q1 إلى q10 من ملفات الـ JSON
    for (let i = 1; i <= 10; i++) {
        const q = i18next.t(`faq.q${i}`);
        const a = i18next.t(`faq.a${i}`);
        
        if (q && q !== `faq.q${i}`) {
            html += `
            <div class="faq-item">
                <div class="faq-question" onclick="toggleFAQ(this)">
                    <span>${q}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer"><p>${a}</p></div>
            </div>`;
        }
    }
    container.innerHTML = html;
}

// وظيفة الفتح والغلق (Toggle Logic)
function toggleFAQ(element) {
    const item = element.parentElement;
    const isActive = item.classList.contains('active');
    
    // إغلاق أي سؤال مفتوح آخر (اختياري لجعل الشكل أرتب)
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
    
    if (!isActive) {
        item.classList.add('active');
    }
}

// حقن الهيدر والفوتر لضمان توحيد التصميم في كل الصفحات
function injectMasterLayout() {
    const header = document.getElementById('main-header');
    const footer = document.getElementById('main-footer');

    if (header) {
        header.innerHTML = `
        <nav class="nav-container">
            <a href="/" class="logo"><i class="fab fa-tiktok"></i> Snaptiks</a>
            <div id="lang-picker-slot"></div>
        </nav>`;
        createPicker('lang-picker-slot');
    }

    if (footer) {
        footer.innerHTML = `
        <div class="footer-content" style="text-align:center; padding: 40px 20px; border-top: 1px solid var(--border);">
            <p data-i18n="footer.rights"></p>
            <div class="footer-links" style="margin-top:20px; display:flex; gap:15px; justify-content:center; flex-wrap:wrap;">
                <a href="about.html" data-i18n="nav.about"></a>
                <a href="terms.html" data-i18n="nav.terms"></a>
                <a href="privacy.html" data-i18n="nav.privacy"></a>
                <a href="dmca.html" data-i18n="nav.dmca"></a>
                <a href="contact.html" data-i18n="nav.contact"></a>
            </div>
        </div>`;
        updateContent(); // ترجمة الروابط التي تم حقنها للتو
    }
}

function createPicker(slotId) {
    const slot = document.getElementById(slotId);
    if (!slot) return;
    const sel = document.createElement('select');
    sel.className = 'lang-select';
    sel.onchange = (e) => i18next.changeLanguage(e.target.value);
    
    supportedLanguages.forEach(code => {
        const opt = document.createElement('option');
        opt.value = code;
        opt.text = languageNames[code] || code.toUpperCase();
        if (code === i18next.language) opt.selected = true;
        sel.add(opt);
    });
    slot.appendChild(sel);
}
