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
                loadPath: 'all-langs.json', 
                queryStringParams: { v: '320.0.0' } 
            },
            detection: { 
                order: ['localStorage', 'navigator'], 
                caches: ['localStorage'] 
            }
        });
        
        injectStylesForSubpages(); // ستايل الصفحات الفرعية
        injectMasterLayout();      // بناء الهيدر والفوتر
        applyTranslations();       // تطبيق الترجمة
    } catch (error) { console.error('i18next error:', error); }

    i18next.on('languageChanged', () => applyTranslations());
});

// دالة لحقن تصميم القائمة في الصفحات الفرعية فقط
function injectStylesForSubpages() {
    // إذا لم يكن هناك هيدر فرعي (أي نحن في الرئيسية)، لا تفعل شيئاً
    if (!document.getElementById('main-header')) return; 

    const style = document.createElement('style');
    style.innerHTML = `
        header {
            background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 1rem 0;
            position: fixed; width: 100%; top: 0; z-index: 1000;
        }
        .nav-container {
            max-width: 1200px; margin: 0 auto; padding: 0 2rem;
            display: flex; justify-content: space-between; align-items: center;
        }
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
        
        @media (max-width: 768px) {
            .nav-links { display: none; }
        }
    `;
    document.head.appendChild(style);
}

function injectMasterLayout() {
    const header = document.getElementById('main-header');
    const footer = document.getElementById('main-footer');
    
    // حقن الهيدر فقط في الصفحات الفرعية
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

    // حقن الفوتر
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
        opt.value = l.code; 
        opt.text = l.name;
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
        if (attrMatch) {
            el.setAttribute(attrMatch[1], i18next.t(attrMatch[2]));
        } else {
            el.innerHTML = i18next.t(key);
        }
    });
}
