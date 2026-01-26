// 1. القائمة المعتمدة للغات
const supportedLanguages = ['en', 'ar', 'id', 'tr', 'fr', 'es', 'de', 'pt', 'ru', 'it', 'ja', 'zh', 'vi', 'hi', 'nl', 'ko', 'th', 'pl', 'uk', 'el', 'sv', 'no', 'da', 'fi', 'cs', 'hu', 'ro', 'sk', 'ms', 'he'];

// RTL Languages list
const RTL_LANGUAGES = ['ar', 'he'];

const languageNames = {
    en: "English", ar: "العربية", id: "Bahasa Indonesia", tr: "Türkçe", fr: "Français",
    es: "Español", de: "Deutsch", pt: "Português", ru: "Русский", it: "Italiano",
    ja: "日本語", zh: "简体中文", vi: "Tiếng Việt", hi: "हिन्दी", nl: "Nederlands",
    ko: "한국어", th: "ไทย", pl: "Polski", uk: "Українська", el: "Ελληνικά",
    sv: "Svenska", no: "Norsk", da: "Dansk", fi: "Suomi", cs: "Čeština",
    hu: "Magyar", ro: "Română", sk: "Slovenčina", ms: "Bahasa Melayu", he: "עבرى"
};

// ===============================
// Folder-based Language Detection Utilities
// ===============================

/**
 * Get current language from URL path (e.g., /ar/about.html -> 'ar')
 * Returns 'en' if no language folder is detected (root = English)
 */
function getCurrentLanguageFromPath() {
    const path = window.location.pathname;
    // Match pattern like /ar/, /tr/, /fr/ at the start of path
    const match = path.match(/^\/([a-z]{2})(\/|$)/);

    if (match && supportedLanguages.includes(match[1])) {
        return match[1];
    }
    return 'en'; // Default: root is English
}

/**
 * Get the current page path without the language prefix
 * Supports standard /ar/ and deep /mp3/ar/ paths
 */
function getPagePathWithoutLang() {
    const path = window.location.pathname;

    // Check for /mp3/xx/ or /story/xx/ (Deep Structure)
    const deepMatch = path.match(/^\/(mp3|story)\/([a-z]{2})(\/.*)?$/);
    if (deepMatch && supportedLanguages.includes(deepMatch[2])) {
        // Return /mp3/ + suffix
        return '/' + deepMatch[1] + (deepMatch[3] || '/');
    }

    // Standard detection /ar/...
    const match = path.match(/^\/([a-z]{2})(\/.*)?$/);
    if (match && supportedLanguages.includes(match[1])) {
        return match[2] || '/';
    }
    return path;
}

/**
 * Build URL for a specific language
 * Handles both Root structure (en=root) and Deep structure (mp3/en exists)
 */
function buildLanguageUrl(targetLang, pagePath = null) {
    let currentPagePath = pagePath || getPagePathWithoutLang();

    // Clean path formatting
    if (!currentPagePath.startsWith('/')) currentPagePath = '/' + currentPagePath;

    // Special handling for MP3/Story paths (Always use /{type}/{lang}/)
    const deepMatch = currentPagePath.match(/^\/(mp3|story)(\/|$)/);
    if (deepMatch) {
        const type = deepMatch[1];
        // Remove /mp3/ or /story/ from start to get the suffix
        const suffix = currentPagePath.replace(/^\/(mp3|story)/, '');
        // Construct: /mp3/ar/suffix
        return `/${type}/${targetLang}${suffix || '/'}`;
    }

    // Standard Structure (Root)
    if (targetLang === 'en') {
        // English is at root
        return currentPagePath; // e.g., /about.html
    }

    // Other languages are in subfolders
    return '/' + targetLang + currentPagePath;
}

/**
 * Apply RTL/LTR direction based on language
 */
function applyDirection(lng) {
    const isRTL = RTL_LANGUAGES.includes(lng);
    const direction = isRTL ? 'rtl' : 'ltr';

    document.documentElement.dir = direction;
    document.documentElement.lang = lng;
    document.body.dir = direction;

    window.dispatchEvent(new CustomEvent('directionChanged', {
        detail: { direction, language: lng, isRTL }
    }));
}

// Global function for "Back" button navigation
window.navigateWithLang = function (basePath) {
    const currentLng = getCurrentLanguageFromPath();
    // Use i18next logic for correct routing
    window.location.href = buildLanguageUrl(currentLng, basePath);
};

// Helper function to preserve language in URLs
function getLocalizedUrl(path) {
    const currentLng = i18next.language || getCurrentLanguageFromPath();
    return buildLanguageUrl(currentLng, path);
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
                // استخدام cache headers بدلاً من timestamp للتحكم في التخزين المؤقت
                backend: { loadPath: '/locales/{{lng}}.json' },

                // Use custom detection: path-based first, then localStorage
                lng: getCurrentLanguageFromPath(), // Force use path-based detection
                detection: {
                    order: ['localStorage', 'navigator'], // Fallback only
                    caches: ['localStorage']
                }
            });

        // Set initial RTL direction based on detected language
        const initialLng = i18next.language;
        applyDirection(initialLng);

        injectMasterLayout();
        updateContent();
        renderHomeFAQ();
    } catch (error) {
        console.error('I18n Init Error:', error);
    }

    i18next.on('languageChanged', (lng) => {
        updateContent();
        renderHomeFAQ();
        applyDirection(lng);

        const currentName = languageNames[lng] || lng.toUpperCase();
        const triggerSpan = document.querySelector('.dropdown-trigger span');
        if (triggerSpan) triggerSpan.textContent = currentName;
    });
});

function updateContent() {
    // دفعة واحدة من تحديثات DOM لتقليل reflows
    const fragment = document.createDocumentFragment();
    const updates = [];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const attrMatch = key.match(/^\[(.*)\](.*)/);
        if (attrMatch) {
            const translated = i18next.t(attrMatch[2]);
            if (translated && translated !== attrMatch[2]) {
                updates.push({ el, type: 'attr', name: attrMatch[1], value: translated });
            }
        } else {
            const translated = i18next.t(key);
            if (translated && translated !== key) {
                // استخدام textContent بدلاً من innerHTML للنصوص البسيطة (أسرع وأكثر أماناً)
                updates.push({ el, type: 'text', value: translated });
            }
        }
    });

    // تطبيق كل التحديثات دفعة واحدة
    updates.forEach(({ el, type, name, value }) => {
        if (type === 'attr') {
            el.setAttribute(name, value);
        } else {
            // استخدام innerHTML فقط إذا كان النص يحتوي على HTML tags
            if (value.includes('<')) {
                el.innerHTML = value;
            } else {
                el.textContent = value;
            }
        }
    });

    // Smart Title Update based on Page Context
    const currentPath = window.location.pathname;
    if (currentPath.includes('/mp3/')) {
        const mp3Title = i18next.t('mp3_page.meta_title');
        if (mp3Title && mp3Title !== 'mp3_page.meta_title') {
            document.title = mp3Title;
        }
    } else if (currentPath.includes('/story/')) {
        const storyTitle = i18next.t('story_page.meta_title');
        if (storyTitle && storyTitle !== 'story_page.meta_title') {
            document.title = storyTitle;
        }
    } else {
        // Default / Home / Generic Pages
        document.title = i18next.t('meta.title');
    }
}

function renderHomeFAQ() {
    const container = document.getElementById('home-faq-list');
    if (!container) return;

    // التحقق إذا كان FAQ موجود بالفعل - فقط تحديث النصوص بدلاً من إعادة البناء
    const existingItems = container.querySelectorAll('.faq-item');

    if (existingItems.length > 0) {
        // تحديث النصوص فقط للحفاظ على حالة الفتح/الإغلاق
        existingItems.forEach((item, i) => {
            const q = i18next.t(`faq.q${i + 1}`);
            const a = i18next.t(`faq.a${i + 1}`);

            if (q && q !== `faq.q${i + 1}`) {
                const questionEl = item.querySelector('.faq-question span');
                const answerEl = item.querySelector('.faq-answer p');
                if (questionEl) questionEl.textContent = q;
                if (answerEl) answerEl.textContent = a;
            }
        });
        return;
    }

    // البناء الأولي فقط
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

    // Simply toggle the clicked item's active state
    // This allows multiple items to be open simultaneously
    item.classList.toggle('active');
}

function injectMasterLayout() {
    const header = document.getElementById('main-header');
    const footer = document.getElementById('main-footer');

    if (header) {
        header.innerHTML = `
        <a href="#main-content" class="skip-link">Skip to main content</a>
        <nav class="nav-container">
            <a href="${getLocalizedUrl('/')}" class="logo"><i class="fab fa-tiktok"></i> SaveTikFast</a>
            
            <div class="nav-actions" style="display: flex; align-items: center; gap: 15px;">
                <a href="${getLocalizedUrl('/tools/')}" class="nav-link tools-link" aria-label="Tools Hub">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                    </svg>
                    <span class="tools-text">Tool All in One</span>
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
        if (themeBtn) {
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
window.toggleLanguageDropdown = function (triggerElement) {
    const dropdown = document.querySelector('.dropdown-options');
    if (!dropdown) return;

    const isExpanded = dropdown.classList.toggle('show');
    triggerElement.setAttribute('aria-expanded', isExpanded);
};

// Language change with HARD REDIRECT to language folder
window.changeLanguageInstant = function (lng) {
    // Close dropdown first for visual feedback
    const dropdown = document.querySelector('.dropdown-options');
    const trigger = document.querySelector('.dropdown-trigger');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
    if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
    }

    // Get current language from path
    const currentLng = getCurrentLanguageFromPath();

    // Prevent infinite loop: don't redirect if already in correct folder
    if (lng === currentLng) {
        console.log('Already in language folder:', lng);
        return;
    }

    // Save to localStorage for future visits
    localStorage.setItem('i18nextLng', lng);

    // Build the new URL with language folder
    const newUrl = buildLanguageUrl(lng);

    console.log('Redirecting to language folder:', newUrl);

    // Hard redirect to the new language folder
    window.location.href = newUrl;
};

// تحسين: استخدام event delegation بدلاً من global handler
let dropdownClickHandler = null;
window.onclick = function (event) {
    if (!event.target.closest('.custom-dropdown')) {
        const dropdown = document.querySelector('.dropdown-options.show');
        if (dropdown) {
            dropdown.classList.remove('show');
            const trigger = document.querySelector('.dropdown-trigger');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
    }
}
