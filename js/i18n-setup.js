const supportedLanguages = [
    { code: 'ar', name: 'العربية' }, { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' }, { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' }, { code: 'id', name: 'Indonesia' },
    { code: 'pt', name: 'Português' }, { code: 'ru', name: 'Русский' },
    { code: 'tr', name: 'Türkçe' }, { code: 'it', name: 'Italiano' },
    { code: 'ja', name: '日本語' }, { code: 'zh', name: '中文' },
    { code: 'vi', name: 'Tiếng Việt' }, { code: 'hi', name: 'हिन्दी' },
    { code: 'nl', name: 'Nederlands' }, { code: 'ko', name: '한국어' },
    { code: 'th', name: 'ไทย' }, { code: 'pl', name: 'Polski' },
    { code: 'uk', name: 'Українська' }, { code: 'el', name: 'Ελληνικά' },
    { code: 'sv', name: 'Svenska' }, { code: 'no', name: 'Norsk' },
    { code: 'da', name: 'Dansk' }, { code: 'fi', name: 'Suomi' },
    { code: 'cs', name: 'Čeština' }, { code: 'hu', name: 'Magyar' },
    { code: 'ro', name: 'Română' }, { code: 'sk', name: 'Slovenčina' },
    { code: 'bg', name: 'Български' }, { code: 'he', name: 'עברית' }
];

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof i18next === 'undefined') return;
    try {
        await i18next
            .use(i18nextHttpBackend)
            .use(i18nextBrowserLanguageDetector)
            .init({
                fallbackLng: 'en',
                supportedLngs: supportedLanguages.map(l => l.code),
                backend: { 
                    loadPath: './all-langs.json', 
                    queryStringParams: { v: '3.0.0' } 
                },
                detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] }
            });
        renderLanguageSwitchers();
        updateContent();
    } catch (error) { console.error('i18next error:', error); }
    i18next.on('languageChanged', () => updateContent());
});

function renderLanguageSwitchers() {
    const containers = document.querySelectorAll('#lang-switcher-container');
    containers.forEach(container => {
        const select = document.createElement('select');
        select.style.cssText = "padding:8px; border-radius:5px; background:#222; color:#fff; border:1px solid #444; margin:10px 0;";
        select.onchange = (e) => i18next.changeLanguage(e.target.value);
        const defOpt = document.createElement('option');
        defOpt.text = "🌍 Change Language"; defOpt.disabled = true; defOpt.selected = true;
        select.add(defOpt);
        supportedLanguages.forEach(lang => {
            const opt = document.createElement('option');
            opt.value = lang.code; opt.text = lang.name;
            if(lang.code === i18next.language) opt.selected = true;
            select.add(opt);
        });
        container.innerHTML = ''; container.appendChild(select);
    });
}

function updateContent() {
    const lang = i18next.language;
    document.documentElement.dir = ['ar', 'fa', 'he', 'ur'].includes(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const match = key.match(/^\[(.*)\](.*)/);
        if (match) { el.setAttribute(match[1], i18next.t(match[2])); }
        else { el.innerHTML = i18next.t(key); }
    });
    if (i18next.exists('meta.title')) document.title = i18next.t('meta.title');
}
