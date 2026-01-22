// 1. القائمة المعتمدة للغات
const supportedLanguages = ['en', 'ar', 'id', 'tr', 'fr', 'es', 'de', 'pt', 'ru', 'it', 'ja', 'zh', 'vi', 'hi', 'nl', 'ko', 'th', 'pl', 'uk', 'el', 'sv', 'no', 'da', 'fi', 'cs', 'hu', 'ro', 'sk', 'ms', 'he'];

const languageNames = {
    en: "English", ar: "العربية", id: "Bahasa Indonesia", tr: "Türkçe", fr: "Français",
    es: "Español", de: "Deutsch", pt: "Português", ru: "Русский", it: "Italiano",
    ja: "日本語", zh: "简体中文", vi: "Tiếng Việt", hi: "हिन्दी", nl: "Nederlands",
    ko: "한국어", th: "ไทย", pl: "Polski", uk: "Українська", el: "Ελληνικά",
    sv: "Svenska", no: "Norsk", da: "Dansk", fi: "Suomi", cs: "Čeština",
    hu: "Magyar", ro: "Română", sk: "Slovenčina", ms: "Bahasa Melayu", he: "עבرى"
};

// Global function for "Back" button navigation with language preservation
window.navigateWithLang = function(basePath) {
    const currentLng = i18next?.language || localStorage.getItem('i18nextLng') || 'en';
    if (currentLng === 'en') {
        window.location.href = basePath;
    } else {
        window.location.href = basePath + '?lang=' + currentLng;
    }
};

// Helper function to preserve language in URLs
function getLocalizedUrl(path) {
    const currentLng = i18next?.language || localStorage.getItem('i18nextLng') || 'en';
    if (currentLng === 'en') {
        return path;
    }
    return path + '?lang=' + currentLng;
}

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
                // هذا الكود يضيف توقيت اللحظة الحالية للرابط، فيجبر المتصفح على تحميل الجديد دائماً
                backend: { loadPath: '/locales/{{lng}}.json?v=' + new Date().getTime() },

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
        <a href="#main-content" class="skip-link">Skip to main content</a>
        <nav class="nav-container">
            <a href="${getLocalizedUrl('/')}" class="logo"><i class="fab fa-tiktok"></i> Snaptiks</a>
            
            <div class="nav-actions" style="display: flex; align-items: center; gap: 15px;">
                <a href="${getLocalizedUrl('/tools/')}" class="nav-link" aria-label="Tools Hub">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                    </svg>
                    <span data-i18n="nav.tools">Tools</span>
                </a>
                <button id="theme-toggle" aria-label="Toggle dark/light mode" title="Toggle Mode">
                    <i class="fas ${document.body.classList.contains('light-mode') ? 'fa-sun' : 'fa-moon'}" aria-hidden="true"></i>
                </button>
                <span class="nav-separator"></span>
                <div id="lang-picker-slot"></div>
            </div>
        </nav>`;
        
        createPicker('lang-picker-slot');
        
        const themeBtn = document.getElementById('theme-toggle');
        if(themeBtn){
            themeBtn.addEventListener('click', () => {
                document.body.classList.toggle('light-mode');
                const isLight = document.body.classList.contains('light-mode');
                const icon = themeBtn.querySelector('i');
                icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
                icon.setAttribute('aria-hidden', 'true');
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
            });
        }
    }

    if (footer) {
        footer.innerHTML = `
        <div class="footer-content" style="text-align:center; padding: 40px 20px; border-top: 1px solid var(--border);">
            <p data-i18n="footer.rights"></p>
            <div class="footer-links" style="margin-top:20px; display:flex; gap:15px; justify-content:center; flex-wrap:wrap;">
                <a href="${getLocalizedUrl('/tools/')}" data-i18n="nav.tools"></a>
                <a href="${getLocalizedUrl('about.html')}" data-i18n="nav.about"></a>
                <a href="${getLocalizedUrl('terms.html')}" data-i18n="nav.terms"></a>
                <a href="${getLocalizedUrl('privacy.html')}" data-i18n="nav.privacy"></a>
                <a href="${getLocalizedUrl('dmca.html')}" data-i18n="nav.dmca"></a>
                <a href="${getLocalizedUrl('contact.html')}" data-i18n="nav.contact"></a>
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
            <button class="dropdown-trigger" 
                    aria-label="Select language"
                    aria-haspopup="listbox"
                    aria-expanded="false"
                    onclick="toggleLanguageDropdown(this)">
                <i class="fas fa-globe" aria-hidden="true"></i> 
                <span>${currentName}</span> 
                <i class="fas fa-chevron-down" aria-hidden="true"></i>
            </button>
            <div class="dropdown-options" role="listbox" aria-label="Available languages">
                ${supportedLanguages.map(code => `
                    <div class="option-item ${code === currentLng ? 'active' : ''}" 
                         role="option"
                         aria-selected="${code === currentLng}"
                         data-lang="${code}"
                         onclick="changeLanguageInstant('${code}')">
                        ${languageNames[code]}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Toggle language dropdown with accessibility
window.toggleLanguageDropdown = function(triggerElement) {
    const dropdown = document.querySelector('.dropdown-options');
    if (!dropdown) return;
    
    const isExpanded = dropdown.classList.toggle('show');
    triggerElement.setAttribute('aria-expanded', isExpanded);
};

// Instant language change WITHOUT page reload
window.changeLanguageInstant = function(lng) {
    // Close dropdown
    const dropdown = document.querySelector('.dropdown-options');
    const trigger = document.querySelector('.dropdown-trigger');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
    if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
    }
    
    // Save to localStorage
    localStorage.setItem('i18nextLng', lng);
    
    // Change language - triggers 'languageChanged' event for instant UI update
    i18next.changeLanguage(lng);
    
    // Update URL without reload
    const url = new URL(window.location);
    if (lng === 'en') {
        url.searchParams.delete('lang');
    } else {
        url.searchParams.set('lang', lng);
    }
    window.history.replaceState({}, '', url);
    
    // Update active state
    document.querySelectorAll('.option-item').forEach(item => {
        const isSelected = item.dataset.lang === lng;
        item.classList.toggle('active', isSelected);
        item.setAttribute('aria-selected', isSelected);
    });
};

window.onclick = function(event) {
    if (!event.target.closest('.custom-dropdown')) {
        const dropdowns = document.getElementsByClassName("dropdown-options");
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('show');
        }
    }
}
