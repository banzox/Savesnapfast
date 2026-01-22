// 1. القائمة المعتمدة للغات
const supportedLanguages = ['en', 'ar', 'bg', 'cs', 'da', 'de', 'el', 'es', 'fi', 'fr', 'he', 'hi', 'hu', 'id', 'it', 'ja', 'ko', 'ms', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sk', 'sv', 'th', 'tr', 'uk', 'vi', 'zh'];

const languageNames = {
    en: "English", ar: "العربية", bg: "Български", cs: "Čeština", da: "Dansk",
    de: "Deutsch", el: "Ελληνικά", es: "Español", fi: "Suomi", fr: "Français",
    he: "עברית", hi: "हिन्दी", hu: "Magyar", id: "Bahasa Indonesia", it: "Italiano",
    ja: "日本語", ko: "한국어", ms: "Bahasa Melayu", nl: "Nederlands", no: "Norsk",
    pl: "Polski", pt: "Português", ro: "Română", ru: "Русский", sk: "Slovenčina",
    sv: "Svenska", th: "ไทย", tr: "Türkçe", uk: "Українська", vi: "Tiếng Việt",
    zh: "简体中文"
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
                load: 'languageOnly',
                debug: false,
                
                // Backend configuration
                backend: { 
                    loadPath: '/locales/{{lng}}.json?v=' + new Date().getTime(),
                    crossDomain: false,
                    withCredentials: false
                },

                detection: { 
                    order: ['querystring', 'localStorage', 'navigator'],
                    lookupQuerystring: 'lang',
                    caches: ['localStorage'] 
                },

                // Missing key handling
                saveMissing: false,
                missingKeyHandler: (lngs, ns, key, fallbackValue) => {
                    console.warn(`Missing translation key: ${key} for language: ${lngs[0]}`);
                },

                // Interpolation options
                interpolation: {
                    escapeValue: false
                }
            });

        injectMasterLayout(); 
        updateContent();      
        renderHomeFAQ();      
    } catch (error) {
        console.error('I18n Init Error:', error);
        // Fallback to English if initialization fails
        document.documentElement.lang = 'en';
    }

    // Handle missing translations during runtime
    i18next.on('missingKey', (lngs, namespace, key, res) => {
        console.warn(`Missing key "${key}" in language "${lngs[0]}"`);
    });

    // Handle failed backend loads
    i18next.on('failedLoading', (lng, ns, msg) => {
        console.error(`Failed loading language "${lng}": ${msg}`);
    });

    i18next.on('languageChanged', (lng) => {
        updateContent();
        renderHomeFAQ();
        document.documentElement.dir = ['ar', 'he'].includes(lng) ? 'rtl' : 'ltr';
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
        if (attrMatch) {
            const translated = i18next.t(attrMatch[2]);
            if (translated && translated !== attrMatch[2]) el.setAttribute(attrMatch[1], translated);
        } else {
            const translated = i18next.t(key);
            if (translated && translated !== key) el.innerHTML = translated;
        }
    });
    document.title = i18next.t('meta.title');
}

function renderHomeFAQ() {
    const container = document.getElementById('home-faq-list');
    if (!container) return;
    
    let html = '';
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

function toggleFAQ(element) {
    const item = element.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
    if (!isActive) item.classList.add('active');
}

function injectMasterLayout() {
    const header = document.getElementById('main-header');
    const footer = document.getElementById('main-footer');

    if (header) {
        header.innerHTML = `
        <nav class="nav-container">
            <a href="/" class="logo"><i class="fab fa-tiktok"></i> Snaptiks</a>
            
            <div class="nav-actions" style="display: flex; align-items: center; gap: 15px;">
                <button id="theme-toggle" class="theme-btn" title="Toggle Mode">
                    <i class="fas ${document.body.classList.contains('light-mode') ? 'fa-sun' : 'fa-moon'}"></i>
                </button>
                <span style="width: 1px; height: 20px; background: rgba(255,255,255,0.1);"></span>
                <div id="lang-picker-slot"></div>
            </div>
        </nav>`;
        
        createPicker('lang-picker-slot');
        
        const themeBtn = document.getElementById('theme-toggle');
        if(themeBtn){
            themeBtn.addEventListener('click', () => {
                document.body.classList.toggle('light-mode');
                const isLight = document.body.classList.contains('light-mode');
                themeBtn.querySelector('i').className = isLight ? 'fas fa-sun' : 'fas fa-moon';
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
            });
        }
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
        updateContent();
    }
}

function createPicker(slotId) {
    const slot = document.getElementById(slotId);
    if (!slot) return;
    
    const currentLng = i18next.language || 'en';
    const currentName = languageNames[currentLng] || currentLng.toUpperCase();

    slot.innerHTML = `
        <div class="custom-dropdown">
            <button class="dropdown-trigger" onclick="document.querySelector('.dropdown-options').classList.toggle('show')">
                <i class="fas fa-globe"></i> <span>${currentName}</span> <i class="fas fa-chevron-down"></i>
            </button>
            <div class="dropdown-options">
                ${supportedLanguages.map(code => `
                    <div class="option-item ${code === currentLng ? 'active' : ''}" 
                         onclick="changeLanguageAndClose('${code}')">
                        ${languageNames[code]}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function changeLanguageAndClose(lng) {
    localStorage.setItem('i18nextLng', lng);
    window.location.search = '?lang=' + lng;
}

window.onclick = function(event) {
    if (!event.target.closest('.custom-dropdown')) {
        const dropdowns = document.getElementsByClassName("dropdown-options");
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('show');
        }
    }
}
