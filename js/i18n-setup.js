// 1. القائمة المحدثة بدون اللغة العبرية
const supportedLanguages = ['en', 'ar', 'id', 'tr', 'fr', 'es', 'de', 'pt', 'ru', 'it', 'ja', 'zh', 'vi', 'hi', 'nl', 'ko', 'th', 'pl', 'uk', 'el', 'sv', 'no', 'da', 'fi', 'cs', 'hu', 'ro', 'sk', 'ms'];

const languageNames = {
    en: "English", ar: "العربية", id: "Bahasa Indonesia", tr: "Türkçe", fr: "Français",
    es: "Español", de: "Deutsch", pt: "Português", ru: "Русский", it: "Italiano",
    ja: "日本語", zh: "简体中文", vi: "Tiếng Việt", hi: "हिन्दी", nl: "Nederlands",
    ko: "한국어", th: "ไทย", pl: "Polski", uk: "Українська", el: "Ελληνικά",
    sv: "Svenska", no: "Norsk", da: "Dansk", fi: "Suomi", cs: "Čeština",
    hu: "Magyar", ro: "Română", sk: "Slovenčina", ms: "Bahasa Melayu"
};

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof i18next === 'undefined') return;

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }

    try {
        await i18next
            .use(i18nextHttpBackend)
            .use(i18nextBrowserLanguageDetector)
            .init({
                fallbackLng: 'en',
                supportedLngs: supportedLanguages,
                // المسار النسبي الصحيح لـ GitHub
                backend: { loadPath: 'locales/{{lng}}.json?v=' + new Date().getTime() },
                detection: { 
                    order: ['querystring', 'localStorage', 'navigator'],
                    lookupQuerystring: 'lang',
                    caches: ['localStorage'] 
                }
            });

        injectMasterLayout(); 
        updateContent();      
        renderHomeFAQ();      
    } catch (error) {
        console.error('I18n Init Error:', error);
    }

    i18next.on('languageChanged', (lng) => {
        updateContent();
        renderHomeFAQ();
        // تعديل الاتجاه للعربية فقط
        document.documentElement.dir = (lng === 'ar') ? 'rtl' : 'ltr';
        document.documentElement.lang = lng;
        
        const currentName = languageNames[lng] || lng.toUpperCase();
        const triggerSpan = document.querySelector('.dropdown-trigger span');
        if (triggerSpan) triggerSpan.textContent = currentName;
    });
});

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const attrMatch = key.match(/^\[(.*)\](.*)/);
        
        // جلب الترجمة (حتى لو فشل التحميل سيظهر اسم المفتاح ولن يختفي النص)
        const translated = i18next.t(attrMatch ? attrMatch[2] : key);

        if (attrMatch) {
            el.setAttribute(attrMatch[1], translated);
        } else {
            el.innerHTML = translated;
        }
    });
    document.title = i18next.t('meta.title');
}

// حل مشكلة اختفاء الأسئلة الشائعة
function renderHomeFAQ() {
    const container = document.getElementById('home-faq-list');
    if (!container) return;
    
    let html = '';
    for (let i = 1; i <= 10; i++) {
        const q = i18next.t(`faq.q${i}`);
        const a = i18next.t(`faq.a${i}`);
        
        // إزالة شرط عدم التساوي لضمان ظهور الأسئلة دائماً
        if (q && q !== "") {
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
// بقية الدوال (toggleFAQ, injectMasterLayout, createPicker, changeLanguageAndClose) تبقى كما هي
