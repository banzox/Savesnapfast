// 1. القائمة المعتمدة للغات (30 لغة متوافقة مع sitemap و _redirects)
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
                // تعديل جوهري: استخدام مسار مطلق / لضمان جلب ملفات اللغة من أي مكان
                backend: { loadPath: '/locales/{{lng}}.json' }, 
                detection: { 
                    // تعديل جوهري: إعطاء الأولوية للـ 'path' لقراءة روابط مثل /ja أو /ar
                    order: ['path', 'querystring', 'localStorage', 'navigator'], 
                    lookupFromPathIndex: 0,
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
        const sel = document.querySelector('.lang-select');
        if (sel) sel.value = lng;
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

    const currentLng = i18next.language;
    document.documentElement.lang = currentLng;
    document.documentElement.dir = ['ar', 'he'].includes(currentLng) ? 'rtl' : 'ltr';
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
            <div id="lang-picker-slot"></div>
        </nav>`;
        createPicker('lang-picker-slot');
    }

    if (footer) {
        footer.innerHTML = `
        <div class="footer-content" style="text-align:center; padding: 40px 20px; border-top: 1px solid var(--border);">
            <p data-i18n="footer.rights"></p>
            <div class="footer-links" style="margin-top:20px; display:flex; gap:15px; justify-content:center; flex-wrap:wrap;">
                <a href="/about.html" data-i18n="nav.about"></a>
                <a href="/terms.html" data-i18n="nav.terms"></a>
                <a href="/privacy.html" data-i18n="nav.privacy"></a>
                <a href="/dmca.html" data-i18n="nav.dmca"></a>
                <a href="/contact.html" data-i18n="nav.contact"></a>
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

// تعديل جوهري: استخدام التنقل الحقيقي بين المسارات لدعم الروابط النظيفة
function changeLanguageAndClose(lng) {
    window.location.href = `/${lng}`;
}

window.onclick = function(event) {
    if (!event.target.closest('.custom-dropdown')) {
        const dropdowns = document.getElementsByClassName("dropdown-options");
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('show');
        }
    }
}
