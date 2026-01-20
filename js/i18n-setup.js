const supportedLanguages = ['ar', 'en', 'fr', 'es', 'de', 'id', 'pt', 'ru', 'tr', 'it', 'ja', 'zh', 'vi', 'hi', 'nl', 'ko', 'th', 'pl'];

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof i18next === 'undefined') return;
    try {
        await i18next
            .use(i18nextHttpBackend)
            .use(i18nextBrowserLanguageDetector)
            .init({
                fallbackLng: 'en',
                supportedLngs: supportedLanguages,
                backend: {
                    loadPath: './all-langs.json', 
                    queryStringParams: { v: '1.6.0' } // تغيير النسخة لكسر الكاش
                },
                detection: { 
                    order: ['path', 'localStorage', 'navigator'], 
                    lookupFromPathIndex: 0,
                    caches: ['localStorage'] 
                }
            });
        updateContent();
    } catch (error) { console.error('i18next error:', error); }
    i18next.on('languageChanged', () => updateContent());
});

function updateContent() {
    const lang = i18next.language;
    document.documentElement.dir = ['ar', 'fa', 'he', 'ur'].includes(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerHTML = i18next.t(key);
    });
    if (i18next.exists('meta.title')) {
        document.title = i18next.t('meta.title');
    }
}

window.changeLanguage = (lang) => i18next.changeLanguage(lang);
