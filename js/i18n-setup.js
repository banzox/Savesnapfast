const supportedLanguages = ['en', 'ar', 'id', 'tr', 'fr', 'es', 'de', 'pt', 'ru', 'it', 'ja', 'zh', 'vi', 'hi', 'nl', 'ko', 'th', 'pl', 'uk', 'el', 'sv', 'no', 'da', 'fi', 'cs', 'hu', 'ro', 'sk', 'ms', 'he'];

// مصفوفة أسماء اللغات لتحسين تجربة المستخدم (UX)
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
                    // إضافة querystring لدعم أرشفة الروابط ?lang= 
                    order: ['querystring', 'localStorage', 'navigator'], 
                    lookupQuerystring: 'lang',
                    caches: ['localStorage'] 
                }
            });
        
        injectMasterLayout(); 
        handleRouting();
    } catch (error) { console.error('I18n Initialization Error:', error); }

    i18next.on('languageChanged', (lng) => {
        updateContent();
        renderHomeFAQ();
        // تحديث القائمة المنسدلة لتطابق اللغة الجديدة
        const sel = document.querySelector('.lang-select');
        if(sel) sel.value = lng;
    });
});

function handleRouting() {
    const homeView = document.getElementById('home-view');
    if(homeView) homeView.style.display = 'block';
    updateContent();
    renderHomeFAQ();
}

function updateContent() {
    // 1. ترجمة العناصر التي تحمل وسم data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const attrMatch = key.match(/^\[(.*)\](.*)/);
        if (attrMatch) el.setAttribute(attrMatch[1], i18next.t(attrMatch[2]));
        else el.innerHTML = i18next.t(key);
    });

    // 2. تحديث خصائص HTML الأساسية للسيو
    const currentLng = i18next.language;
    document.documentElement.lang = currentLng;
    document.documentElement.dir = ['ar', 'he'].includes(currentLng) ? 'rtl' : 'ltr';

    // 3. تحديث Meta Tags ديناميكياً للأرشفة العالمية
    document.title = i18next.t('meta.title');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', i18next.t('meta.description'));
}

function renderHomeFAQ() {
    const container = document.getElementById('home-faq-list');
    if (!container) return;
    let html = '';
    for(let i=1; i<=10; i++) {
        if(i18next.exists(`faq.q${i}`)) {
            html += `
            <div class="faq-item" onclick="this.classList.toggle('active')">
                <div class="faq-question">
                    <span>${i18next.t(`faq.q${i}`)}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer"><p>${i18next.t(`faq.a${i}`)}</p></div>
            </div>`;
        }
    }
    container.innerHTML = html;
}

function injectMasterLayout() {
    const header = document.getElementById('main-header');
    if (header && !header.innerHTML) {
        header.innerHTML = `
        <nav class="nav-container">
            <a href="/" class="logo">Snaptiks</a>
            <div id="lang-picker-slot"></div>
        </nav>`;
        createPicker('lang-picker-slot');
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
        // عرض اسم اللغة الأصلي بدلاً من الكود
        opt.text = languageNames[code] || code.toUpperCase();
        if(code === i18next.language) opt.selected = true;
        sel.add(opt);
    });
    
    slot.innerHTML = ''; // تنظيف السلوت قبل الإضافة
    slot.appendChild(sel);
}
