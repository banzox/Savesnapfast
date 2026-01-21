const supportedLanguages = ['en', 'ar', 'id', 'tr', 'fr', 'es', 'de', 'pt', 'ru', 'it', 'ja', 'zh', 'vi', 'hi', 'nl', 'ko', 'th', 'pl', 'uk', 'el', 'sv', 'no', 'da', 'fi', 'cs', 'hu', 'ro', 'sk', 'ms', 'he'];

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
                detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] }
            });
        
        injectMasterLayout(); 
        handleRouting(); // الدالة المفقودة تم إضافتها بالأسفل
    } catch (error) { console.error('Error:', error); }

    i18next.on('languageChanged', () => {
        updateContent();
        renderHomeFAQ();
    });
});

function handleRouting() {
    // عرض المشهد الرئيسي دائماً عند البداية
    const homeView = document.getElementById('home-view');
    if(homeView) homeView.style.display = 'block';
    updateContent();
    renderHomeFAQ();
}

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const attrMatch = key.match(/^\[(.*)\](.*)/);
        if (attrMatch) el.setAttribute(attrMatch[1], i18next.t(attrMatch[2]));
        else el.innerHTML = i18next.t(key);
    });
    document.documentElement.lang = i18next.language;
    document.documentElement.dir = ['ar', 'he'].includes(i18next.language) ? 'rtl' : 'ltr';
}

function renderHomeFAQ() {
    const container = document.getElementById('home-faq-list');
    if (!container) return;
    let html = '';
    for(let i=1; i<=10; i++) {
        if(i18next.exists(`faq.q${i}`)) {
            html += `<div class="faq-item" onclick="this.classList.toggle('active')">
                <div class="faq-question"><span>${i18next.t(`faq.q${i}`)}</span><i class="fas fa-chevron-down"></i></div>
                <div class="faq-answer"><p>${i18next.t(`faq.a${i}`)}</p></div>
            </div>`;
        }
    }
    container.innerHTML = html;
}

function injectMasterLayout() {
    const header = document.getElementById('main-header');
    if (header) {
        header.innerHTML = `<nav><a href="/" class="logo">Snaptiks</a><div id="lang-picker-slot"></div></nav>`;
        createPicker('lang-picker-slot');
    }
}

function createPicker(slotId) {
    const slot = document.getElementById(slotId);
    if (!slot) return;
    const sel = document.createElement('select');
    sel.style.cssText = "background:#222; color:#fff; border:1px solid #444; padding:5px; border-radius:5px;";
    sel.onchange = (e) => i18next.changeLanguage(e.target.value);
    supportedLanguages.forEach(code => {
        const opt = document.createElement('option');
        opt.value = code; opt.text = code.toUpperCase();
        if(code === i18next.language) opt.selected = true;
        sel.add(opt);
    });
    slot.appendChild(sel);
}
