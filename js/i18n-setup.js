const supportedLanguages = [
    { code: 'ar', name: 'العربية' }, { code: 'en', name: 'English' }, { code: 'fr', name: 'Français' }, { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' }, { code: 'id', name: 'Indonesia' }, { code: 'pt', name: 'Português' }, { code: 'ru', name: 'Русский' },
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
        await i18next.use(i18nextHttpBackend).use(i18nextBrowserLanguageDetector).init({
            fallbackLng: 'en',
            supportedLngs: supportedLanguages.map(l => l.code),
            backend: { 
                loadPath: '/all-langs.json', // تصحيح المسار ليكون عالمياً
                queryStringParams: { v: '10.0.0' } 
            },
            detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] }
        });
        
        injectMasterLayout(); // بناء الأجزاء المشتركة
        applyTranslations();  // ترجمة النصوص والسيو
    } catch (error) { console.error('i18next error:', error); }
    i18next.on('languageChanged', () => applyTranslations());
});

function injectMasterLayout() {
    const header = document.getElementById('main-header');
    const footer = document.getElementById('main-footer');
    
    if (header) {
        header.innerHTML = `
        <nav class="nav-container">
            <a href="/" class="logo"><i class="fab fa-tiktok"></i> Snaptiks</a>
            <ul class="nav-links">
                <li><a href="index.html" data-i18n="nav.home"></a></li>
                <li><a href="about.html" data-i18n="nav.about"></a></li>
                <li><a href="contact.html" data-i18n="nav.contact"></a></li>
                <li id="lang-picker-slot"></li>
            </ul>
        </nav>`;
        createPicker('lang-picker-slot');
    }

    if (footer) {
        footer.innerHTML = `
        <div class="footer-grid">
            <div class="footer-nav">
                <a href="terms.html" data-i18n="nav.terms"></a>
                <a href="privacy.html" data-i18n="nav.privacy"></a>
                <a href="disclaimer.html" data-i18n="nav.disclaimer"></a>
                <a href="dmca.html" data-i18n="nav.dmca"></a>
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
    document.documentElement.lang = lang;
    document.documentElement.dir = ['ar', 'he'].includes(lang) ? 'rtl' : 'ltr';
    
    // سيو عالمي: تحديث العنوان والوصف تلقائياً
    if (i18next.exists('meta.title')) document.title = i18next.t('meta.title');
    const desc = document.querySelector('meta[name=\"description\"]');
    if (desc && i18next.exists('meta.description')) desc.setAttribute('content', i18next.t('meta.description'));

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const attr = key.match(/^\[(.*)\](.*)/);
        if (attr) el.setAttribute(attr[1], i18next.t(attr[2]));
        else el.innerHTML = i18next.t(key);
    });
}
