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
                debug: false,
                backend: {
                    loadPath: './locales/{{lng}}.json', 
                },
                detection: {
                    order: ['localStorage', 'navigator', 'querystring'], // لا يوجد path هنا لمنع الـ 404
                    caches: ['localStorage']
                }
            });
        injectMasterLayout(); 
        handleRouting();
    } catch (error) { console.error('Error:', error); }

    i18next.on('languageChanged', (lng) => {
        document.documentElement.lang = lng;
        document.documentElement.dir = ['ar', 'he'].includes(lng) ? 'rtl' : 'ltr';
        updateContent('home');
        renderHomeFAQ();
    });
});

function handleRouting() {
    const homeView = document.getElementById('home-view');
    if(homeView) homeView.style.display = 'block';
    updateContent('home');
    renderHomeFAQ();
}

function updateContent(page) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const attrMatch = key.match(/^\[(.*)\](.*)/);
        if (attrMatch) el.setAttribute(attrMatch[1], i18next.t(attrMatch[2]));
        else el.innerHTML = i18next.t(key);
    });
    document.title = i18next.t('meta.title');
}

function renderHomeFAQ() {
    const container = document.getElementById('home-faq-list');
    if (!container) return;
    let html = '';
    for(let i=1; i<=10; i++) {
        if(i18next.exists(`faq.q${i}`)) {
            html += `
            <div class="faq-item" onclick="this.classList.toggle('active')">
                <div class="faq-question"><span>${i18next.t(`faq.q${i}`)}</span><i class="fas fa-chevron-down"></i></div>
                <div class="faq-answer"><p>${i18next.t(`faq.a${i}`)}</p></div>
            </div>`;
        }
    }
    container.innerHTML = html;
}

function injectMasterLayout() {
    const header = document.getElementById('main-header');
    const footer = document.getElementById('main-footer');
    if (header) {
        header.innerHTML = `
        <nav><a href="/" class="logo"><i class="fab fa-tiktok"></i> Snaptiks</a>
            <ul class="nav-links">
                <li><a data-i18n="nav.home">Home</a></li>
                <li id="lang-picker-slot"></li>
            </ul>
        </nav>`;
        createPicker('lang-picker-slot');
    }
    if (footer) {
        footer.innerHTML = `<div class="container"><div class="footer-links">
            <a data-i18n="nav.terms">Terms</a><a data-i18n="nav.privacy">Privacy</a>
        </div><p>&copy; 2026 Snaptiks. <span data-i18n="footer.rights">All rights reserved.</span></p></div>`;
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
