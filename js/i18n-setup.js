const supportedLanguages = ['en', 'ar', 'id', 'tr', 'fr', 'es', 'de', 'pt', 'ru', 'it', 'ja', 'zh', 'vi', 'hi', 'nl', 'ko', 'th', 'pl', 'uk', 'el', 'sv', 'no', 'da', 'fi', 'cs', 'hu', 'ro', 'sk', 'ms', 'he'];

const languageNames = {
    en: "English", ar: "العربية", id: "Bahasa Indonesia", tr: "Türkçe", fr: "Français",
    es: "Español", de: "Deutsch", pt: "Português", ru: "Русский", it: "Italiano",
    ja: "日本語", zh: "简体中文", vi: "Tiếng Việt", hi: "हिन्दी", nl: "Nederlands",
    ko: "한국어", th: "ไทย", pl: "Polski", uk: "Українська", el: "Ελληνικά",
    sv: "Svenska", no: "Norsk", da: "Dansk", fi: "Suomi", cs: "Čeština",
    hu: "Magyar", ro: "Română", sk: "Slovenčina", ms: "Bahasa Melayu", he: "עברית"
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
                backend: { loadPath: './locales/{{lng}}.json' },
                detection: { 
                    order: ['querystring', 'localStorage', 'navigator'], 
                    lookupQuerystring: 'lang',
                    caches: ['localStorage'] 
                }
            });
        
        injectMasterLayout(); 
        updateContent();
        renderHomeFAQ();
    } catch (error) { console.error('I18n Initialization Error:', error); }

    i18next.on('languageChanged', (lng) => {
        updateContent();
        renderHomeFAQ();
        const sel = document.querySelector('.lang-select');
        if(sel) sel.value = lng;
    });
});

function updateContent() {
    // 1. ترجمة العناصر (يدعم السمات مثل data-i18n="[placeholder]key")
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const attrMatch = key.match(/^\[(.*)\](.*)/);
        if (attrMatch) {
            const translated = i18next.t(attrMatch[2]);
            if (translated && translated !== attrMatch[2]) el.setAttribute(attrMatch[1], translated);
        } else {
            const translated = i18next.t(key);
            // حل مشكلة الأقسام المفقودة: لا تقم بالمسح إذا كان المفتاح غير موجود
            if (translated && translated !== key) el.innerHTML = translated;
        }
    });

    // 2. تحديث اتجاه الصفحة (RTL/LTR)
    const currentLng = i18next.language;
    document.documentElement.lang = currentLng;
    document.documentElement.dir = ['ar', 'he'].includes(currentLng) ? 'rtl' : 'ltr';

    // 3. تحديث الميتا تاق (SEO)
    document.title = i18next.t('meta.title');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', i18next.t('meta.description'));
}

function renderHomeFAQ() {
    const container = document.getElementById('home-faq-list');
    if (!container) return;
    let html = '';
    
    // إصلاح: قراءة الأسئلة الـ 10 من هيكل ملفاتك الجديد (faq.q1, faq.a1)
    for(let i=1; i<=10; i++) {
        const questionKey = `faq.q${i}`;
        const answerKey = `faq.a${i}`;
        
        if (i18next.exists(questionKey)) {
            html += `
            <div class="faq-item">
                <div class="faq-question" onclick="this.parentElement.classList.toggle('active')">
                    <span>${i18next.t(questionKey)}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${i18next.t(answerKey)}</p>
                </div>
            </div>`;
        }
    }
    container.innerHTML = html;
}

function injectMasterLayout() {
    const header = document.getElementById('main-header');
    const footer = document.getElementById('main-footer');

    // حقن الهيدر مع اللوغو واختيار اللغة
    if (header && !header.innerHTML) {
        header.innerHTML = `
        <nav class="nav-container">
            <a href="/" class="logo">Snaptiks</a>
            <div id="lang-picker-slot"></div>
        </nav>`;
        createPicker('lang-picker-slot');
    }

    // حقن الفوتر مع الحقوق المحفوظة
    if (footer && !footer.innerHTML) {
        footer.innerHTML = `
        <div class="footer-content">
            <p data-i18n="footer.rights"></p>
            <div class="footer-links">
                <a href="about.html" data-i18n="nav.about"></a>
                <a href="terms.html" data-i18n="nav.terms"></a>
                <a href="privacy.html" data-i18n="nav.privacy"></a>
            </div>
        </div>`;
        // تحديث محتوى الفوتر بعد الحقن
        updateContent();
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
        if(code === i18next.language) opt.selected = true;
        sel.add(opt);
    });
    slot.innerHTML = '';
    slot.appendChild(sel);
}
