const fs = require('fs');
const path = require('path');

const localesDir = './src/locales/locales';
if (!fs.existsSync(localesDir)) {
    console.error('Locales directory not found');
    process.exit(1);
}

const files = fs.readdirSync(localesDir);

const defaultKeys = {
    "common": {
        "select_language": "Select Language",
        "toggle_theme": "Toggle Dark/Light Mode"
    },
    "404": {
        "title": "Page Not Found",
        "home_btn": "Go to Homepage"
    }
};

const localized = {
    "ar": {
        "common": { "select_language": "اختر اللغة", "toggle_theme": "تبديل الوضع ليلي/نهاري" },
        "404": { "title": "الصفحة غير موجودة", "home_btn": "العودة للرئيسية" }
    },
    "es": {
        "common": { "select_language": "Seleccionar idioma", "toggle_theme": "Alternar modo claro/oscuro" },
        "404": { "title": "Página no encontrada", "home_btn": "Ir al inicio" }
    },
    "fr": {
        "common": { "select_language": "Choisir la langue", "toggle_theme": "Changer le mode sombre/clair" },
        "404": { "title": "Page non trouvée", "home_btn": "Aller à l'accueil" }
    },
    "de": {
        "common": { "select_language": "Sprache auswählen", "toggle_theme": "Dunkel/Hell umschalten" },
        "404": { "title": "Seite nicht gefunden", "home_btn": "Zur Startseite" }
    },
    "ru": {
        "common": { "select_language": "Выбрать язык", "toggle_theme": "Переключить тему" },
        "404": { "title": "Страница не найдена", "home_btn": "На главную" }
    },
    "pt": {
        "common": { "select_language": "Selecionar idioma", "toggle_theme": "Alternar modo claro/escuro" },
        "404": { "title": "Página não encontrada", "home_btn": "Ir ao início" }
    },
    "id": {
        "common": { "select_language": "Pilih Bahasa", "toggle_theme": "Alihkan mode gelap/terang" },
        "404": { "title": "Halaman tidak ditemukan", "home_btn": "Kembali ke Beranda" }
    }
};

files.forEach(file => {
    if (!file.endsWith('.json')) return;
    const filePath = path.join(localesDir, file);
    let content;
    try {
        content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
        console.error(`Error parsing ${file}: ${e.message}`);
        return;
    }

    const lang = file.replace('.json', '');

    // Merge common
    content["common"] = {
        ...defaultKeys.common,
        ...(localized[lang]?.common || {}),
        ...(content["common"] || {})
    };

    // Merge 404
    content["404"] = {
        ...defaultKeys.404,
        ...(localized[lang] ? .404 || {}),
        ...(content["404"] || {})
    };

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
    console.log(`Synced ${file}`);
});
