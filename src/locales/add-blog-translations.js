// Script to add blog translations to all locale files
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');

// Blog translations for all languages
const blogTranslations = {
    "es": {
        "nav.blog": "Blog",
        "blog": {
            "meta_title": "Guía de Descarga TikTok 2026 - Videos, MP3, Slideshows y Stories",
            "meta_desc": "Guía completa para descargar contenido de TikTok en 2026. Aprende a guardar videos de TikTok sin marca de agua, convertir a MP3, descargar slideshows y stories en iPhone, Android, Windows, Mac.",
            "keywords": "cómo descargar videos TikTok sin marca de agua 2026, descargador TikTok iPhone iOS 18, guardar videos TikTok Android 15, convertidor TikTok a MP3 online gratis, descargar fotos slideshow TikTok, guardar stories TikTok antes de expirar, descargador TikTok HD 4K sin marca de agua, mejor alternativa extensión Chrome TikTok, descargar videos TikTok Windows 11, guardar TikTok Mac macOS Sonoma, descarga video TikTok Samsung Galaxy S25",
            "title": "Guía Definitiva de Descarga TikTok 2026",
            "subtitle": "Todo lo que necesitas saber sobre descargar videos, audio MP3, slideshows y stories de TikTok en cualquier dispositivo. Actualizado para 2026.",
            "updated": "Última actualización: Febrero",
            "back_home": "Volver al Descargador",
            "tools_heading": "Elige tu Tipo de Descarga",
            "try_now": "Probar Ahora",
            "card_video_title": "Descargador de Videos",
            "card_video_desc": "Descarga videos de TikTok sin marca de agua en calidad HD/4K. Funciona en iPhone 16, Samsung Galaxy S25 y todos los dispositivos.",
            "card_mp3_title": "Convertidor MP3",
            "card_mp3_desc": "Extrae audio de videos TikTok en alta calidad 320kbps. Perfecto para tonos y amantes de la música.",
            "card_slideshow_title": "Guardador de Slideshows",
            "card_slideshow_desc": "Descarga todas las fotos de slideshows y carruseles de TikTok como archivo ZIP.",
            "card_story_title": "Descargador de Stories",
            "card_story_desc": "Guarda stories de TikTok antes de que desaparezcan en 24 horas. Descarga anónima.",
            "section1_title": "Cómo Descargar Videos de TikTok en 2026",
            "section1_content": "<strong>Descargar videos de TikTok sin marca de agua</strong> nunca ha sido más fácil. En 2026, SaveTikFast sigue siendo la solución más rápida y confiable.",
            "section2_title": "Guía de Conversión TikTok a MP3",
            "section2_content": "¿Quieres <strong>convertir TikTok a MP3</strong>? Nuestro extractor de audio obtiene el sonido de cualquier video en <strong>alta calidad hasta 320kbps</strong>.",
            "section3_title": "Descargando Slideshows y Stories de TikTok",
            "section3_content": "<strong>Los Slideshows de TikTok</strong> se han vuelto muy populares en 2026. Nuestro descargador guarda <strong>cada imagen del carrusel</strong> en calidad original.",
            "section4_title": "Privacidad y Seguridad",
            "section4_content": "En SaveTikFast, tomamos tu <strong>privacidad en serio</strong>. Sin registro requerido, sin almacenamiento de videos.",
            "section5_title": "¿Por qué Elegir SaveTikFast?",
            "section5_content": "SaveTikFast destaca por varias razones: procesamiento más rápido, máxima calidad, sin marca de agua, gratis siempre.",
            "cta_title": "¿Listo para Descargar?",
            "cta_desc": "Comienza a descargar videos, audio MP3, slideshows y stories de TikTok ahora. 100% gratis.",
            "cta_button": "Comenzar a Descargar"
        }
    },
    "fr": {
        "nav.blog": "Blog",
        "blog": {
            "meta_title": "Guide Téléchargement TikTok 2026 - Vidéos, MP3, Slideshows et Stories",
            "meta_desc": "Guide complet pour télécharger du contenu TikTok en 2026. Apprenez à sauvegarder des vidéos TikTok sans filigrane, convertir en MP3, télécharger slideshows et stories.",
            "keywords": "comment télécharger vidéos TikTok sans filigrane 2026, téléchargeur TikTok iPhone iOS 18, sauvegarder vidéos TikTok Android 15, convertisseur TikTok MP3 en ligne gratuit",
            "title": "Guide Ultime Téléchargement TikTok 2026",
            "subtitle": "Tout ce que vous devez savoir sur le téléchargement de vidéos, audio MP3, slideshows et stories TikTok. Mis à jour pour 2026.",
            "updated": "Dernière mise à jour: Février",
            "back_home": "Retour au Téléchargeur",
            "tools_heading": "Choisissez Votre Type de Téléchargement",
            "try_now": "Essayer",
            "card_video_title": "Téléchargeur Vidéo",
            "card_video_desc": "Téléchargez des vidéos TikTok sans filigrane en qualité HD/4K.",
            "card_mp3_title": "Convertisseur MP3",
            "card_mp3_desc": "Extrayez l'audio des vidéos TikTok en haute qualité 320kbps.",
            "card_slideshow_title": "Sauveur de Slideshows",
            "card_slideshow_desc": "Téléchargez toutes les photos des slideshows TikTok en ZIP.",
            "card_story_title": "Téléchargeur Stories",
            "card_story_desc": "Sauvegardez les stories TikTok avant qu'elles ne disparaissent.",
            "section1_title": "Comment Télécharger des Vidéos TikTok en 2026",
            "section1_content": "<strong>Télécharger des vidéos TikTok sans filigrane</strong> n'a jamais été aussi facile.",
            "section2_title": "Guide Conversion TikTok vers MP3",
            "section2_content": "Vous voulez <strong>convertir TikTok en MP3</strong>? Notre extracteur audio fonctionne sur tous les appareils.",
            "section3_title": "Télécharger Slideshows et Stories TikTok",
            "section3_content": "<strong>Les Slideshows TikTok</strong> sont devenus très populaires en 2026.",
            "section4_title": "Confidentialité et Sécurité",
            "section4_content": "Chez SaveTikFast, nous prenons votre <strong>confidentialité au sérieux</strong>.",
            "section5_title": "Pourquoi Choisir SaveTikFast?",
            "section5_content": "SaveTikFast se démarque: traitement le plus rapide, qualité maximale, sans filigrane, gratuit.",
            "cta_title": "Prêt à Télécharger?",
            "cta_desc": "Commencez à télécharger des vidéos, MP3, slideshows et stories TikTok maintenant.",
            "cta_button": "Commencer"
        }
    },
    "de": {
        "nav.blog": "Blog",
        "blog": {
            "meta_title": "TikTok Download Guide 2026 - Videos, MP3, Slideshows & Stories",
            "meta_desc": "Kompletter Leitfaden zum Herunterladen von TikTok-Inhalten 2026. Videos ohne Wasserzeichen speichern, in MP3 konvertieren.",
            "title": "Ultimativer TikTok Download Guide 2026",
            "subtitle": "Alles was Sie über das Herunterladen von TikTok Videos, MP3, Slideshows und Stories wissen müssen.",
            "updated": "Letzte Aktualisierung: Februar",
            "back_home": "Zurück zum Downloader",
            "tools_heading": "Wählen Sie Ihren Download-Typ",
            "try_now": "Jetzt Testen",
            "card_video_title": "Video Downloader",
            "card_video_desc": "TikTok Videos ohne Wasserzeichen in HD/4K herunterladen.",
            "card_mp3_title": "MP3 Konverter",
            "card_mp3_desc": "Audio aus TikTok Videos in hoher Qualität 320kbps extrahieren.",
            "card_slideshow_title": "Slideshow Saver",
            "card_slideshow_desc": "Alle Fotos aus TikTok Slideshows als ZIP herunterladen.",
            "card_story_title": "Story Downloader",
            "card_story_desc": "TikTok Stories speichern bevor sie verschwinden.",
            "cta_title": "Bereit zum Download?",
            "cta_desc": "Starten Sie jetzt mit dem Herunterladen von TikTok Videos, MP3 und mehr.",
            "cta_button": "Download Starten"
        }
    },
    "pt": {
        "nav.blog": "Blog",
        "blog": {
            "meta_title": "Guia Download TikTok 2026 - Vídeos, MP3, Slideshows e Stories",
            "meta_desc": "Guia completo para baixar conteúdo TikTok em 2026. Salve vídeos sem marca d'água, converta para MP3.",
            "title": "Guia Definitivo Download TikTok 2026",
            "subtitle": "Tudo que você precisa saber sobre baixar vídeos, MP3, slideshows e stories do TikTok.",
            "updated": "Última atualização: Fevereiro",
            "back_home": "Voltar ao Downloader",
            "tools_heading": "Escolha seu Tipo de Download",
            "try_now": "Experimentar",
            "card_video_title": "Baixador de Vídeos",
            "card_video_desc": "Baixe vídeos TikTok sem marca d'água em qualidade HD/4K.",
            "card_mp3_title": "Conversor MP3",
            "card_mp3_desc": "Extraia áudio de vídeos TikTok em alta qualidade 320kbps.",
            "card_slideshow_title": "Salvador de Slideshows",
            "card_slideshow_desc": "Baixe todas as fotos de slideshows TikTok como ZIP.",
            "card_story_title": "Baixador de Stories",
            "card_story_desc": "Salve stories TikTok antes de desaparecerem.",
            "cta_title": "Pronto para Baixar?",
            "cta_desc": "Comece a baixar vídeos, MP3, slideshows e stories do TikTok agora.",
            "cta_button": "Começar Download"
        }
    }
};

// Default English blog content for other languages (they'll use English as fallback)
const defaultBlog = {
    "nav.blog": "Blog",
    "blog": {
        "meta_title": "TikTok Downloader Guide 2026 - Download Videos, MP3, Slideshows & Stories",
        "meta_desc": "Complete guide to downloading TikTok content in 2026. Learn how to save TikTok videos without watermark.",
        "title": "Ultimate TikTok Download Guide 2026",
        "subtitle": "Everything you need to know about downloading TikTok content. Updated for 2026.",
        "updated": "Last Updated: February",
        "back_home": "Back to Downloader",
        "tools_heading": "Choose Your Download Type",
        "try_now": "Try Now",
        "card_video_title": "Video Downloader",
        "card_video_desc": "Download TikTok videos without watermark in HD/4K quality.",
        "card_mp3_title": "MP3 Converter",
        "card_mp3_desc": "Extract audio from TikTok videos in high quality 320kbps.",
        "card_slideshow_title": "Slideshow Saver",
        "card_slideshow_desc": "Download all photos from TikTok slideshows as ZIP.",
        "card_story_title": "Story Downloader",
        "card_story_desc": "Save TikTok stories before they disappear.",
        "cta_title": "Ready to Download?",
        "cta_desc": "Start downloading TikTok videos, MP3, slideshows and stories now.",
        "cta_button": "Start Downloading"
    }
};

// Languages to update (excluding en and ar which are already done)
const languages = ['bg', 'cs', 'da', 'de', 'el', 'es', 'fi', 'fr', 'hi', 'hu', 'id', 'it', 'ja', 'ko', 'ms', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sv', 'th', 'tr', 'uk', 'vi', 'zh', 'fil'];

languages.forEach(lang => {
    const filePath = path.join(localesDir, `${lang}.json`);

    try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Add nav.blog if not exists
        if (!content.nav.blog) {
            content.nav.blog = blogTranslations[lang]?.["nav.blog"] || defaultBlog["nav.blog"];
        }

        // Add blog section if not exists
        if (!content.blog) {
            content.blog = blogTranslations[lang]?.blog || defaultBlog.blog;
        }

        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
        console.log(`Updated: ${lang}.json`);
    } catch (err) {
        console.error(`Error updating ${lang}.json:`, err.message);
    }
});

console.log('Done!');
