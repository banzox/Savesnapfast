
const locales = import.meta.glob('../locales/*.json', { eager: true });

export function getTranslations(lang) {
    const path = `../locales/${lang}.json`;
    if (locales[path]) {
        return locales[path].default || locales[path];
    }
    // Fallback to English if not found
    return locales['../locales/en.json']?.default || {};
}

export function getLangFromUrl(url) {
    const [, lang] = url.pathname.split('/');
    if (lang in locales) return lang;
    return 'en';
}

export const supportedLanguages = Object.keys(locales).map(path => {
    return path.replace('../locales/', '').replace('.json', '');
});
