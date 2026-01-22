// 1. القائمة المعتمدة للغات
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

    // استعادة وضع الثيم المفضل
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
                // تحميل ملفات اللغة من المسار الجذري دائماً
                backend: { loadPath: 'locales/{{lng}}.json' }, 
                detection: { 
                    // الاعتماد على الرابط (?lang=) ثم التخزين المحلي
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
        const sel = document.querySelector('.lang-select');
        if (sel) sel.value = lng;
        
        // تعديل اتجاه الصفحة فوراً عند التغيير
        document.documentElement.dir = ['ar', 'he'].includes(lng) ? 'rtl' : 'ltr';
        document.documentElement.lang = lng;
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
            
            <div class="nav-actions" style="display: flex; align-items: center; gap: 15px;">
                <button id="theme-toggle" class="theme-btn" title="Toggle Mode">
                    <i class="fas ${document.body.classList.contains('light-mode') ? 'fa-sun' : 'fa-moon'}"></i>
                </button>
                
                <span style="width: 1px; height: 20px; background: rgba(255,255,255,0.1);"></span>

                <div id="lang-picker-slot"></div>
            </div>
        </nav>`;
        
        createPicker('lang-picker-slot');
        
        // تفعيل زر الثيم
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

// 🔥 التعديل الأهم هنا: استخدام ?lang= بدلاً من /lang
function changeLanguageAndClose(lng) {
    // تحديث الرابط بنفس الصفحة مع متغير اللغة فقط
    // هذا يمنع اختفاء ملفات الـ CSS
    const url = new URL(window.location);
    url.searchParams.set('lang', lng);
    window.location.href = url.toString();
}

window.onclick = function(event) {
    if (!event.target.closest('.custom-dropdown')) {
        const dropdowns = document.getElementsByClassName("dropdown-options");
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('show');
        }
    }
}
