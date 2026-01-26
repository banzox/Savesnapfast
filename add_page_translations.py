"""
Script to add MP3 and Story page translations to all 30 language files.
This adds the nav_menu, mp3_page, and story_page sections to all locale files.
"""

import json
import os
from pathlib import Path

# Translations for all languages
translations = {
    "en": {
        "nav_menu": {"video": "Video", "mp3": "MP3 Audio", "stories": "Stories"},
        "mp3_page": {
            "meta_title": "TikTok to MP3 Converter - Download Audio High Quality 320kbps",
            "meta_desc": "Convert TikTok videos to MP3 audio files. Extract songs & music in high quality.",
            "title": "Download TikTok MP3",
            "subtitle": "(Audio Only)",
            "desc": "Convert TikTok videos to MP3 audio files. Extract songs, trending sounds & music in high quality.",
            "placeholder": "Paste TikTok video link to extract MP3...",
            "btn_download": "Extract MP3",
            "about_title": "Best TikTok to MP3 Converter 2026",
            "about_content": "Extract audio from any TikTok video instantly. Download trending songs in high-quality MP3 format.",
            "features": {
                "quality": {"title": "High Quality Audio", "desc": "Extract audio up to 320kbps."},
                "fast": {"title": "Instant Conversion", "desc": "Convert TikTok to MP3 in seconds."},
                "trending": {"title": "Trending Sounds", "desc": "Download viral TikTok sounds."},
                "device": {"title": "Works Everywhere", "desc": "Works on all devices."},
                "ringtone": {"title": "Ringtone Ready", "desc": "Use as ringtones or alarms."},
                "unlimited": {"title": "Unlimited & Free", "desc": "No limits on downloads."}
            },
            "how_to": {
                "title": "How to Convert TikTok to MP3",
                "step1": "Find the TikTok video with the audio. Tap Share → Copy Link.",
                "step2": "Paste the link into the box above.",
                "step3": "Click Extract MP3 and download instantly."
            }
        },
        "story_page": {
            "meta_title": "TikTok Story Downloader - Save Slideshows & Photos",
            "meta_desc": "Download TikTok Stories and Slideshows anonymously. Save photos before they expire.",
            "title": "TikTok Story & Slideshow Downloader",
            "desc": "Save TikTok Stories and Photo Slideshows. Download all images anonymously.",
            "placeholder": "Paste TikTok Story or Slideshow link...",
            "btn_download": "Save Story",
            "about_title": "Best TikTok Story Saver 2026",
            "about_content": "Save TikTok Stories before they expire. Download all slideshow images at once.",
            "features": {
                "anonymous": {"title": "100% Anonymous", "desc": "Download without creator knowing."},
                "slides": {"title": "All Slides at Once", "desc": "Download all carousel images."},
                "expire": {"title": "Before They Expire", "desc": "Save before 24h expiry."},
                "quality": {"title": "Original Quality", "desc": "Full resolution photos."},
                "device": {"title": "All Devices", "desc": "Works on all devices."},
                "favorites": {"title": "Save Favorites", "desc": "Keep your favorite content."}
            },
            "how_to": {
                "title": "How to Download TikTok Stories",
                "step1": "Find the Story or Slideshow. Tap Share → Copy Link.",
                "step2": "Paste the link into the box above.",
                "step3": "Click Save Story and download all images."
            }
        }
    },
    "ar": {
        "nav_menu": {"video": "فيديو", "mp3": "صوت MP3", "stories": "ستوري"},
        "mp3_page": {
            "meta_title": "محول تيك توك إلى MP3 - تحميل صوت بجودة عالية",
            "meta_desc": "حول فيديوهات تيك توك إلى ملفات صوت MP3. استخرج الأغاني والموسيقى بجودة عالية.",
            "title": "تحميل صوت تيك توك MP3",
            "subtitle": "(صوت فقط)",
            "desc": "حول فيديوهات تيك توك إلى ملفات MP3. استخرج الأغاني والأصوات الشائعة بجودة عالية.",
            "placeholder": "الصق رابط فيديو تيك توك لاستخراج الصوت...",
            "btn_download": "استخراج MP3",
            "about_title": "أفضل محول تيك توك إلى MP3 لعام 2026",
            "about_content": "استخرج الصوت من أي فيديو تيك توك فوراً. حمل الأغاني الشائعة بجودة MP3 عالية.",
            "features": {
                "quality": {"title": "جودة صوت عالية", "desc": "استخراج صوت حتى 320kbps."},
                "fast": {"title": "تحويل فوري", "desc": "حول تيك توك إلى MP3 في ثوانٍ."},
                "trending": {"title": "الأصوات الشائعة", "desc": "حمل أصوات تيك توك الفيروسية."},
                "device": {"title": "يعمل في كل مكان", "desc": "يعمل على جميع الأجهزة."},
                "ringtone": {"title": "جاهز كنغمة", "desc": "استخدمه كنغمة رنين أو منبه."},
                "unlimited": {"title": "مجاني وغير محدود", "desc": "بدون حدود على التحميلات."}
            },
            "how_to": {
                "title": "كيفية تحويل تيك توك إلى MP3",
                "step1": "ابحث عن الفيديو مع الصوت المطلوب. اضغط مشاركة ← نسخ الرابط.",
                "step2": "الصق الرابط في الصندوق أعلاه.",
                "step3": "اضغط استخراج MP3 وحمل فوراً."
            }
        },
        "story_page": {
            "meta_title": "تحميل ستوري تيك توك - حفظ الصور والسلايدات",
            "meta_desc": "حمل ستوريات تيك توك والسلايدات بشكل مجهول. احفظ الصور قبل انتهاء صلاحيتها.",
            "title": "تحميل ستوري وسلايدات تيك توك",
            "desc": "احفظ ستوريات تيك توك والسلايدات. حمل جميع الصور بشكل مجهول.",
            "placeholder": "الصق رابط ستوري أو سلايدات تيك توك...",
            "btn_download": "حفظ الستوري",
            "about_title": "أفضل حافظ ستوري تيك توك 2026",
            "about_content": "احفظ ستوريات تيك توك قبل انتهائها. حمل جميع صور السلايدات دفعة واحدة.",
            "features": {
                "anonymous": {"title": "مجهول 100%", "desc": "حمل بدون معرفة المنشئ."},
                "slides": {"title": "كل الصور دفعة واحدة", "desc": "حمل جميع صور الكاروسيل."},
                "expire": {"title": "قبل الانتهاء", "desc": "احفظ قبل انتهاء 24 ساعة."},
                "quality": {"title": "جودة أصلية", "desc": "صور بدقة كاملة."},
                "device": {"title": "جميع الأجهزة", "desc": "يعمل على كل الأجهزة."},
                "favorites": {"title": "احفظ المفضلة", "desc": "احتفظ بمحتواك المفضل."}
            },
            "how_to": {
                "title": "كيفية تحميل ستوري تيك توك",
                "step1": "ابحث عن الستوري أو السلايدات. اضغط مشاركة ← نسخ الرابط.",
                "step2": "الصق الرابط في الصندوق أعلاه.",
                "step3": "اضغط حفظ الستوري وحمل جميع الصور."
            }
        }
    },
    "es": {
        "nav_menu": {"video": "Video", "mp3": "Audio MP3", "stories": "Historias"},
        "mp3_page": {
            "meta_title": "Convertidor TikTok a MP3 - Descargar Audio Alta Calidad",
            "meta_desc": "Convierte videos de TikTok a archivos de audio MP3. Extrae canciones y música en alta calidad.",
            "title": "Descargar TikTok MP3",
            "subtitle": "(Solo Audio)",
            "desc": "Convierte videos de TikTok a archivos MP3. Extrae canciones y sonidos trending.",
            "placeholder": "Pega el enlace de TikTok para extraer MP3...",
            "btn_download": "Extraer MP3",
            "about_title": "Mejor Convertidor TikTok a MP3 2026",
            "about_content": "Extrae audio de cualquier video de TikTok al instante.",
            "features": {
                "quality": {"title": "Audio Alta Calidad", "desc": "Extrae audio hasta 320kbps."},
                "fast": {"title": "Conversión Instantánea", "desc": "Convierte TikTok a MP3 en segundos."},
                "trending": {"title": "Sonidos Trending", "desc": "Descarga sonidos virales de TikTok."},
                "device": {"title": "Funciona en Todos Lados", "desc": "Funciona en todos los dispositivos."},
                "ringtone": {"title": "Listo para Tono", "desc": "Úsalo como tono de llamada."},
                "unlimited": {"title": "Ilimitado y Gratis", "desc": "Sin límites de descargas."}
            },
            "how_to": {
                "title": "Cómo Convertir TikTok a MP3",
                "step1": "Encuentra el video con el audio. Toca Compartir → Copiar Enlace.",
                "step2": "Pega el enlace en el cuadro de arriba.",
                "step3": "Haz clic en Extraer MP3 y descarga al instante."
            }
        },
        "story_page": {
            "meta_title": "Descargador de Historias TikTok - Guardar Presentaciones",
            "meta_desc": "Descarga Historias y Presentaciones de TikTok de forma anónima.",
            "title": "Descargador de Historias y Presentaciones TikTok",
            "desc": "Guarda Historias y Presentaciones de TikTok. Descarga todas las imágenes anónimamente.",
            "placeholder": "Pega el enlace de Historia o Presentación de TikTok...",
            "btn_download": "Guardar Historia",
            "about_title": "Mejor Guardador de Historias TikTok 2026",
            "about_content": "Guarda Historias de TikTok antes de que expiren.",
            "features": {
                "anonymous": {"title": "100% Anónimo", "desc": "Descarga sin que el creador lo sepa."},
                "slides": {"title": "Todas las Diapositivas", "desc": "Descarga todas las imágenes del carrusel."},
                "expire": {"title": "Antes de que Expiren", "desc": "Guarda antes de las 24h."},
                "quality": {"title": "Calidad Original", "desc": "Fotos en resolución completa."},
                "device": {"title": "Todos los Dispositivos", "desc": "Funciona en todos los dispositivos."},
                "favorites": {"title": "Guardar Favoritos", "desc": "Conserva tu contenido favorito."}
            },
            "how_to": {
                "title": "Cómo Descargar Historias de TikTok",
                "step1": "Encuentra la Historia o Presentación. Toca Compartir → Copiar Enlace.",
                "step2": "Pega el enlace en el cuadro de arriba.",
                "step3": "Haz clic en Guardar Historia y descarga todas las imágenes."
            }
        }
    },
    "fr": {
        "nav_menu": {"video": "Vidéo", "mp3": "Audio MP3", "stories": "Stories"},
        "mp3_page": {
            "meta_title": "Convertisseur TikTok en MP3 - Télécharger Audio Haute Qualité",
            "meta_desc": "Convertissez les vidéos TikTok en fichiers audio MP3 de haute qualité.",
            "title": "Télécharger TikTok MP3",
            "subtitle": "(Audio Seulement)",
            "desc": "Convertissez les vidéos TikTok en fichiers MP3. Extrayez les chansons tendance.",
            "placeholder": "Collez le lien TikTok pour extraire le MP3...",
            "btn_download": "Extraire MP3",
            "about_title": "Meilleur Convertisseur TikTok en MP3 2026",
            "about_content": "Extrayez l'audio de n'importe quelle vidéo TikTok instantanément.",
            "features": {
                "quality": {"title": "Audio Haute Qualité", "desc": "Extraction jusqu'à 320kbps."},
                "fast": {"title": "Conversion Instantanée", "desc": "Convertissez en secondes."},
                "trending": {"title": "Sons Tendance", "desc": "Téléchargez les sons viraux."},
                "device": {"title": "Fonctionne Partout", "desc": "Compatible avec tous les appareils."},
                "ringtone": {"title": "Prêt pour Sonnerie", "desc": "Utilisez comme sonnerie."},
                "unlimited": {"title": "Illimité et Gratuit", "desc": "Sans limites de téléchargement."}
            },
            "how_to": {
                "title": "Comment Convertir TikTok en MP3",
                "step1": "Trouvez la vidéo avec l'audio. Appuyez sur Partager → Copier le lien.",
                "step2": "Collez le lien dans la boîte ci-dessus.",
                "step3": "Cliquez sur Extraire MP3 et téléchargez instantanément."
            }
        },
        "story_page": {
            "meta_title": "Téléchargeur de Stories TikTok - Sauvegarder Diaporamas",
            "meta_desc": "Téléchargez les Stories et Diaporamas TikTok de manière anonyme.",
            "title": "Téléchargeur de Stories et Diaporamas TikTok",
            "desc": "Sauvegardez les Stories et Diaporamas TikTok. Téléchargez toutes les images anonymement.",
            "placeholder": "Collez le lien de Story ou Diaporama TikTok...",
            "btn_download": "Sauvegarder Story",
            "about_title": "Meilleur Sauvegardeur de Stories TikTok 2026",
            "about_content": "Sauvegardez les Stories TikTok avant qu'elles n'expirent.",
            "features": {
                "anonymous": {"title": "100% Anonyme", "desc": "Téléchargez sans que le créateur sache."},
                "slides": {"title": "Toutes les Diapos", "desc": "Téléchargez toutes les images."},
                "expire": {"title": "Avant Expiration", "desc": "Sauvegardez avant 24h."},
                "quality": {"title": "Qualité Originale", "desc": "Photos en pleine résolution."},
                "device": {"title": "Tous Appareils", "desc": "Fonctionne partout."},
                "favorites": {"title": "Sauver Favoris", "desc": "Gardez votre contenu préféré."}
            },
            "how_to": {
                "title": "Comment Télécharger les Stories TikTok",
                "step1": "Trouvez la Story ou Diaporama. Appuyez sur Partager → Copier le lien.",
                "step2": "Collez le lien dans la boîte ci-dessus.",
                "step3": "Cliquez sur Sauvegarder Story et téléchargez toutes les images."
            }
        }
    },
    "de": {
        "nav_menu": {"video": "Video", "mp3": "MP3 Audio", "stories": "Stories"},
        "mp3_page": {
            "meta_title": "TikTok zu MP3 Konverter - Audio Hochqualität herunterladen",
            "meta_desc": "TikTok Videos in MP3 Audiodateien konvertieren. Songs und Musik in hoher Qualität extrahieren.",
            "title": "TikTok MP3 herunterladen",
            "subtitle": "(Nur Audio)",
            "desc": "TikTok Videos in MP3 konvertieren. Trending Sounds extrahieren.",
            "placeholder": "TikTok Link einfügen um MP3 zu extrahieren...",
            "btn_download": "MP3 extrahieren",
            "about_title": "Bester TikTok zu MP3 Konverter 2026",
            "about_content": "Audio aus jedem TikTok Video sofort extrahieren.",
            "features": {
                "quality": {"title": "Hochwertige Audio", "desc": "Bis zu 320kbps extrahieren."},
                "fast": {"title": "Sofortige Konvertierung", "desc": "In Sekunden konvertieren."},
                "trending": {"title": "Trending Sounds", "desc": "Virale Sounds herunterladen."},
                "device": {"title": "Überall nutzbar", "desc": "Auf allen Geräten nutzbar."},
                "ringtone": {"title": "Klingelton-fertig", "desc": "Als Klingelton nutzen."},
                "unlimited": {"title": "Unbegrenzt & Kostenlos", "desc": "Keine Download-Limits."}
            },
            "how_to": {
                "title": "Wie man TikTok zu MP3 konvertiert",
                "step1": "Video mit Audio finden. Teilen → Link kopieren drücken.",
                "step2": "Link oben einfügen.",
                "step3": "MP3 extrahieren klicken und sofort herunterladen."
            }
        },
        "story_page": {
            "meta_title": "TikTok Story Downloader - Diashows speichern",
            "meta_desc": "TikTok Stories und Diashows anonym herunterladen.",
            "title": "TikTok Story & Diashow Downloader",
            "desc": "TikTok Stories und Diashows speichern. Alle Bilder anonym herunterladen.",
            "placeholder": "TikTok Story oder Diashow Link einfügen...",
            "btn_download": "Story speichern",
            "about_title": "Bester TikTok Story Saver 2026",
            "about_content": "TikTok Stories speichern bevor sie ablaufen.",
            "features": {
                "anonymous": {"title": "100% Anonym", "desc": "Ohne Wissen des Erstellers."},
                "slides": {"title": "Alle Folien", "desc": "Alle Karussell-Bilder."},
                "expire": {"title": "Vor Ablauf", "desc": "Vor 24h speichern."},
                "quality": {"title": "Originalqualität", "desc": "Volle Auflösung."},
                "device": {"title": "Alle Geräte", "desc": "Überall nutzbar."},
                "favorites": {"title": "Favoriten speichern", "desc": "Lieblingsinhalt behalten."}
            },
            "how_to": {
                "title": "Wie man TikTok Stories herunterlädt",
                "step1": "Story oder Diashow finden. Teilen → Link kopieren.",
                "step2": "Link oben einfügen.",
                "step3": "Story speichern und alle Bilder herunterladen."
            }
        }
    }
}

# Copy English as base for other languages with language code suffix
base_languages = ["cs", "da", "el", "fi", "he", "hi", "hu", "id", "it", "ja", "ko", "ms", "nl", "no", "pl", "pt", "ro", "ru", "sk", "sv", "th", "tr", "uk", "vi", "zh"]

# Use English as base
for lang in base_languages:
    translations[lang] = translations["en"].copy()

def update_locale_file(locale_path, lang_code):
    """Update a single locale file with new translations."""
    try:
        with open(locale_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading {locale_path}: {e}")
        return False
    
    # Get translations for this language (fallback to English)
    lang_trans = translations.get(lang_code, translations["en"])
    
    # Add new sections if they don't exist
    if "nav_menu" not in data:
        data["nav_menu"] = lang_trans["nav_menu"]
    
    if "mp3_page" not in data:
        data["mp3_page"] = lang_trans["mp3_page"]
    
    if "story_page" not in data:
        data["story_page"] = lang_trans["story_page"]
    
    # Write back
    try:
        with open(locale_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ Updated: {lang_code}.json")
        return True
    except Exception as e:
        print(f"❌ Error writing {locale_path}: {e}")
        return False

def main():
    locales_dir = Path(__file__).parent / "locales"
    
    if not locales_dir.exists():
        print(f"Locales directory not found: {locales_dir}")
        return
    
    print("=" * 50)
    print("Adding MP3 and Story translations to all locales")
    print("=" * 50)
    
    success_count = 0
    for locale_file in locales_dir.glob("*.json"):
        lang_code = locale_file.stem
        if update_locale_file(locale_file, lang_code):
            success_count += 1
    
    print("=" * 50)
    print(f"✅ Updated {success_count} locale files")
    print("=" * 50)

if __name__ == "__main__":
    main()
