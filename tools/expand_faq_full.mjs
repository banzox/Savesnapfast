import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'src/locales/locales');
const languages = ['en', 'ar', 'es', 'pt', 'id', 'fr', 'de', 'it', 'tr', 'ru', 'vi', 'th', 'ja', 'ko', 'pl', 'nl', 'ro', 'ms', 'fil', 'uk', 'cs', 'sv', 'hu', 'el', 'da', 'fi', 'no', 'bg', 'zh', 'hi'];

// 10 FAQs Translations for Top Languages
const faqs = {
    es: {
        q1: "¿Puedo descargar todas las fotos de un slideshow de TikTok a la vez?",
        a1: "Sí, nuestra herramienta detecta automáticamente todas las imágenes y te permite descargarlas como conjunto o elegir fotos individuales.",
        q2: "¿Las imágenes descargadas son de alta calidad?",
        a2: "¡Absolutamente! Guardamos las imágenes en su resolución HD original (1080p o superior) tal como se subieron a TikTok.",
        q3: "¿Las imágenes tienen marcas de agua?",
        a3: "No, SaveTikFast elimina todas las marcas de agua y logos, dándote imágenes limpias y listas para usar.",
        q4: "¿Esta herramienta es gratuita?",
        a4: "Sí, nuestro descargador de slideshows es 100% gratuito sin costos ocultos ni suscripciones.",
        q5: "¿Funciona en teléfonos móviles?",
        a5: "Sí, funciona perfectamente en dispositivos iOS (iPhone/iPad) y Android directamente en tu navegador.",
        q6: "¿Necesito instalar alguna aplicación?",
        a6: "No se requiere instalación. Simplemente pega el enlace en tu navegador y descarga al instante.",
        q7: "¿Puedo descargar de cuentas privadas?",
        a7: "Debido a restricciones de privacidad, solo podemos acceder y descargar contenido de cuentas públicas de TikTok.",
        q8: "¿En qué formato se guardan las imágenes?",
        a8: "Las imágenes se guardan típicamente en formato JPG o PNG de alta calidad, compatible con todos los dispositivos.",
        q9: "¿Hay un límite de descargas?",
        a9: "¡No hay límite! Puedes descargar tantos slideshows y carruseles de fotos como quieras.",
        q10: "¿Puedo descargar la música del slideshow también?",
        a10: "Sí, generalmente el audio está disponible como una opción de descarga MP3 separada junto con las imágenes."
    },
    fr: {
        q1: "Puis-je télécharger toutes les photos d'un diaporama TikTok en une seule fois ?",
        a1: "Oui, notre outil détecte toutes les images et vous permet de les télécharger en lot ou individuellement.",
        q2: "Les images téléchargées sont-elles de haute qualité ?",
        a2: "Absolument ! Nous sauvegardons les images dans leur résolution HD originale (1080p+).",
        q3: "Les images ont-elles des filigranes ?",
        a3: "No, SaveTikFast supprime tous les filigranes pour des images propres.",
        q4: "Est-ce gratuit ?",
        a4: "Oui, notre téléchargeur est 100% gratuit sans frais cachés.",
        q5: "Cela fonctionne-t-il sur mobile ?",
        a5: "Oui, parfaitement compatible avec iOS et Android via le navigateur.",
        q6: "Dois-je installer une application ?",
        a6: "Aucune installation requise. Collez simplement le lien et téléchargez.",
        q7: "Puis-je télécharger depuis des comptes privés ?",
        a7: "Non, seulement depuis des comptes publics pour des raisons de confidentialité.",
        q8: "Quel est le format des images ?",
        a8: "JPG ou PNG haute qualité, compatibles partout.",
        q9: "Y a-t-il une limite de téléchargement ?",
        a9: "Aucune limite ! Téléchargez autant que vous voulez.",
        q10: "Puis-je aussi télécharger la musique ?",
        a10: "Oui, l'audio est souvent disponible en MP3 séparé."
    },
    de: {
        q1: "Kann ich alle Fotos einer TikTok-Slideshow auf einmal laden?",
        a1: "Ja, unser Tool erkennt alle Bilder und lädt sie als Set herunter.",
        q2: "Sind die Bilder in hoher Qualität?",
        a2: "Absolut! Wir speichern in Original-HD-Auflösung (1080p+).",
        q3: "Haben die Bilder Wasserzeichen?",
        a3: "Nein, SaveTikFast entfernt alle Wasserzeichen.",
        q4: "Ist dieses Tool kostenlos?",
        a4: "Ja, zu 100% kostenlos ohne versteckte Gebühren.",
        q5: "Funktioniert es auf dem Handy?",
        a5: "Ja, perfekt auf iOS und Android im Browser.",
        q6: "Muss ich eine App installieren?",
        a6: "Keine Installation nötig. Einfach Link einfügen.",
        q7: "Kann ich von privaten Konten laden?",
        a7: "Nein, nur von öffentlichen TikTok-Konten.",
        q8: "Welches Format haben die Bilder?",
        a8: "Meist JPG oder PNG in hoher Qualität.",
        q9: "Gibt es ein Download-Limit?",
        a9: "Kein Limit! Lade so viel du willst.",
        q10: "Kann ich auch die Musik laden?",
        a10: "Ja, Audio ist oft als MP3 verfügbar."
    }
    // Others will use English fallback for structure, ensuring 10 keys exist.
};

// Generic English (Source)
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const en = require('../src/locales/locales/en.json');
const enFaq = en.slideshow_page.faq;

languages.forEach(lang => {
    if (lang === 'en' || lang === 'ar') return;

    const filePath = path.join(localesDir, `${lang}.json`);
    if (!fs.existsSync(filePath)) return;

    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Decide which FAQ to use
    let finalFaq = faqs[lang] || enFaq;

    // Ensure slideshow_page exists
    if (!content.slideshow_page) {
        content.slideshow_page = {};
    }

    // Inject FAQ
    content.slideshow_page.faq = finalFaq;

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`Updated FAQ for ${lang}`);
});
