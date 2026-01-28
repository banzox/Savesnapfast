import { ui, defaultLang } from '../i18n/ui';

export function getLangFromUrl(url) {
    const [, lang] = url.pathname.split('/');
    if (lang in ui) return lang;
    const queryLang = url.searchParams.get('lang');
    if (queryLang && queryLang in ui) return queryLang;
    return defaultLang;
}

export function useTranslations(lang) {
    return function t(key) {
        const keys = key.split('.');

        // Try current language
        let value = ui[lang];
        for (const k of keys) {
            if (value === undefined || value === null) break;
            value = value[k];
        }
        if (value !== undefined) return value;

        // Fallback to default language
        value = ui[defaultLang];
        for (const k of keys) {
            if (value === undefined || value === null) break;
            value = value[k];
        }

        return value !== undefined ? value : key;
    }
}
