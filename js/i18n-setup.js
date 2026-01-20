const supportedLanguages = ['ar', 'en', 'fr', 'es', 'de', 'id', 'pt', 'ru', 'tr', 'it', 'ja', 'zh', 'vi', 'hi', 'nl', 'ko', 'th', 'pl', 'uk', 'el'];

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof i18next === 'undefined') return;

    try {
        await i18next
            .use(i18nextHttpBackend)
            .use(i18nextBrowserLanguageDetector)
            .init({
                // الإعدادات الذكية
                fallbackLng: 'en', // اللغة الاحتياطية (الإنجليزية)
                supportedLngs: supportedLanguages,
                load: 'languageOnly', // هام جداً: يحول en-US إلى en ويحول pt-BR إلى pt
                backend: {
                    loadPath: './locales/{{lng}}/translation.json',
                    queryStringParams: { v: '1.0.7' } // تحديث الكاش
                },
                detection: { 
                    // الترتيب الذهبي: الرابط > الذاكرة > لغة الجهاز
                    order: ['path', 'localStorage', 'navigator'], 
                    lookupFromPathIndex: 0,
                    caches: ['localStorage'] 
                }
            });

        updateContent();
    } catch (error) { console.error('i18next error:', error); }

    i18next.on('languageChanged', () => updateContent());
});

function renderLangButtons() {
    const container = document.getElementById('lang-switcher-container');
    if (!container) return;
    container.innerHTML = ''; 
}

function updateContent() {
    const lang = i18next.language;
    
    // دعم الاتجاه (يمين/يسار)
    const dir = ['ar', 'fa', 'he', 'ur'].includes(lang) ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    
    // تغيير الخط حسب اللغة
    document.body.style.fontFamily = (lang === 'ar') ? "'Tajawal', sans-serif" : "'Inter', sans-serif";

    // ترجمة العناصر
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key.startsWith('[') && key.includes(']')) {
            const [attr, k] = key.replace('[', '').split(']');
            el.setAttribute(attr, i18next.t(k));
        } else {
            el.innerHTML = i18next.t(key);
        }
    });
    updateSEO();
}

function updateSEO() {
    document.title = i18next.t('meta.title');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', i18next.t('meta.description'));
}

window.changeLanguage = (lang) => i18next.changeLanguage(lang);
