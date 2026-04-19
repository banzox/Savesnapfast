import fs from 'fs';
import path from 'path';

// =============================================================
// PROFESSIONAL SEO META — All 30 languages — Complete Rewrite
// Title: 50-60 chars (Latin) | 28-35 (CJK) | 45-55 (Arabic)
// Description: 120-155 chars (Latin) | 65-90 (CJK) | 100-140 (Arabic)
// =============================================================

const META = {
  en: {
    'meta.title': 'SaveTikFast 2026 – Best TikTok Downloader No Watermark (4K)',
    'meta.description': 'Download TikTok videos without watermark for free in Ultra HD/4K quality. Fastest TikTok Saver 2026. Save to MP4 & MP3 on iPhone, Android, and PC instantly.',
    'mp3_page.meta_title': 'TikTok to MP3 Converter – Free Audio Download 320kbps',
    'mp3_page.meta_desc': 'Convert TikTok videos to MP3 audio in high quality 320kbps. Extract songs, sounds & music free online. No app install or registration needed. Works on all devices.',
    'story_page.meta_title': 'TikTok Story Downloader – Save Slideshows & Photos Anonymously',
    'story_page.meta_desc': 'Download TikTok Stories and Slideshows anonymously for free. Save photo carousels, image posts & story videos before they expire. Fast, free, no login required.',
    'slideshow_page.meta_title': 'TikTok Slideshow Downloader – Save Photo Carousels in HD',
    'slideshow_page.meta_desc': 'Download TikTok photo slideshows and carousels in HD quality without watermark. Save all images from any TikTok post instantly. Free, fast, no registration required.',
    'blog.meta_title': 'TikTok Download Guide 2026 – Videos, MP3, Slideshows & Stories',
    'blog.meta_desc': 'Complete guide to TikTok downloads in 2026. Save videos without watermark, convert to MP3, download slideshows & stories on iPhone, Android & PC. Step-by-step.',
    'tools.meta.title': 'Free Online Tools – Image Compressor, Converter & QR Generator',
    'tools.meta.description': 'Free browser-based tools: compress images, convert formats (WebP, JPG, PNG), and generate QR codes instantly. No file uploads or account registration required.',
  },
  ar: {
    'meta.title': 'SaveTikFast 2026 - أفضل تطبيق تنزيل TikTok بدون علامة مائية (4K)',
    'meta.description': 'حمّل مقاطع TikTok بدون علامة مائية مجاناً بجودة Ultra HD/4K. أسرع موقع لتنزيل TikTok في 2026. احفظ بصيغة MP4 وMP3 على iPhone وAndroid والكمبيوتر فوراً.',
    'mp3_page.meta_title': 'تحويل TikTok إلى MP3 - تنزيل صوت 320kbps عالي الجودة مجاناً',
    'mp3_page.meta_desc': 'حوّل مقاطع TikTok إلى ملفات MP3 بجودة عالية 320kbps. استخرج الأغاني والموسيقى مجاناً بدون تطبيق أو تسجيل. يعمل على جميع الأجهزة والمتصفحات بسهولة.',
    'story_page.meta_title': 'تنزيل قصص TikTok - حفظ السلايد شو والصور بشكل مجهول مجاناً',
    'story_page.meta_desc': 'حمّل قصص وعروض شرائح TikTok بشكل مجهول تماماً. احفظ ألبومات الصور ومقاطع القصص قبل انتهاء صلاحيتها. مجاني وسريع بدون تسجيل أو تطبيق.',
    'slideshow_page.meta_title': 'تنزيل سلايد شو TikTok - حفظ ألبومات الصور بجودة HD مجاناً',
    'slideshow_page.meta_desc': 'حمّل عروض الصور وألبومات TikTok بجودة HD عالية وبدون علامة مائية. احفظ جميع الصور من أي منشور TikTok فوراً. مجاني وسريع وبدون تسجيل أو برامج.',
    'blog.meta_title': 'دليل تنزيل TikTok 2026 - فيديو وMP3 وسلايد شو وقصص',
    'blog.meta_desc': 'الدليل الشامل لتنزيل محتوى TikTok في 2026. تعلم حفظ الفيديوهات بدون علامة مائية، والتحويل إلى MP3، وتنزيل السلايد شو والقصص على iPhone وAndroid والكمبيوتر.',
    'tools.meta.title': 'أدوات مجانية - ضغط الصور وتحويل الصيغ وإنشاء رموز QR',
    'tools.meta.description': 'أدوات مجانية بالمتصفح مباشرة: اضغط الصور وحوّل الصيغ (WebP وJPG وPNG) وأنشئ رموز QR فوراً. لا حاجة للتحميل أو التسجيل. يعمل على جميع الأجهزة.',
  },
  bg: {
    'meta.title': 'SaveTikFast 2026 – Най-добър TikTok Downloader без воден знак (4K)',
    'meta.description': 'Изтеглете TikTok видеа без воден знак безплатно в Ultra HD/4K. Най-бързият TikTok Saver за 2026. Запазете като MP4 и MP3 на iPhone, Android и PC.',
    'mp3_page.meta_title': 'TikTok към MP3 конвертор – Безплатно изтегляне 320kbps',
    'mp3_page.meta_desc': 'Конвертирайте TikTok видеа в MP3 аудио файлове с висококачествени 320kbps. Безплатно изтегляне на песни и музика онлайн. Не е нужно приложение или регистрация.',
    'story_page.meta_title': 'TikTok Story Downloader – Запазете снимки анонимно безплатно',
    'story_page.meta_desc': 'Изтегляйте TikTok сторита и слайдшоута анонимно и безплатно. Запазете галерии от снимки и видеа преди да изтекат. Бързо, лесно, без вход в профил.',
    'slideshow_page.meta_title': 'TikTok Slideshow Downloader – Снимки в HD без воден знак',
    'slideshow_page.meta_desc': 'Изтеглете фото слайдшоута и галерии от TikTok в HD качество без воден знак. Запазете всички снимки от публикации в TikTok незабавно. Безплатно и бързо.',
    'blog.meta_title': 'Ръководство TikTok 2026 – Видеа, MP3, слайдшоута и сторита',
    'blog.meta_desc': 'Пълно ръководство за изтегляне на TikTok съдържание. Запазване на видеа без воден знак, конверсия в MP3, изтегляне на слайдшоута на iPhone, Android и PC.',
    'tools.meta.title': 'Безплатни инструменти – Компресиране, конвертиране и QR кодове',
    'tools.meta.description': 'Безплатни браузър-базирани инструменти: компресирайте снимки, конвертирайте формати (WebP, JPG, PNG) и генерирайте QR кодове. Без качване или регистрация.',
  },
  cs: {
    'meta.title': 'SaveTikFast 2026 – Nejlepší TikTok Downloader bez vodoznaku (4K)',
    'meta.description': 'Stahujte TikTok videa bez vodoznaku zdarma v Ultra HD/4K kvalitě. Nejrychlejší TikTok Saver 2026. Ukládejte jako MP4 a MP3 na iPhone, Android a PC.',
    'mp3_page.meta_title': 'TikTok do MP3 konvertor – Stahování audia 320kbps zdarma',
    'mp3_page.meta_desc': 'Převádějte TikTok videa na MP3 audio soubory ve vysoké kvalitě 320kbps. Extrahujte písně a hudbu zdarma online. Žádná aplikace ani registrace není potřeba.',
    'story_page.meta_title': 'TikTok Story Downloader – Ukládejte fotky a příběhy anonymně',
    'story_page.meta_desc': 'Stahujte TikTok příběhy a prezentace anonymně a zdarma. Ukládejte alba fotek a video příběhy před vypršením. Rychle, bez přihlášení nebo instalace aplikace.',
    'slideshow_page.meta_title': 'TikTok Slideshow Downloader – Fotky v HD bez vodoznaku zdarma',
    'slideshow_page.meta_desc': 'Stahujte fotoprezentace a galerie z TikToku ve HD kvalitě bez vodoznaku. Uložte všechny obrázky z libovolného příspěvku okamžitě. Zdarma, rychle, bez registrace.',
    'blog.meta_title': 'TikTok průvodce stahováním 2026 – Videa, MP3, slajdy a příběhy',
    'blog.meta_desc': 'Kompletní průvodce stahováním obsahu TikTok v 2026. Ukládání videí bez vodoznaku, převod na MP3, stahování prezentací a příběhů na iPhone, Android a PC.',
    'tools.meta.title': 'Bezplatné nástroje – Komprese obrázků, konverze a QR kódy',
    'tools.meta.description': 'Bezplatné nástroje v prohlížeči: komprimujte obrázky, převádějte formáty (WebP, JPG, PNG) a generujte QR kódy. Bez nahrávání souborů ani registrace.',
  },
  da: {
    'meta.title': 'SaveTikFast 2026 – Bedste TikTok Downloader uden vandmærke (4K)',
    'meta.description': 'Download TikTok-videoer uden vandmærke gratis i Ultra HD/4K. Hurtigste TikTok Saver 2026. Gem som MP4 og MP3 på iPhone, Android og PC med det samme.',
    'mp3_page.meta_title': 'TikTok til MP3 konverter – Gratis lyddownload 320kbps',
    'mp3_page.meta_desc': 'Konverter TikTok-videoer til MP3-lydfiler i høj kvalitet 320kbps. Udtræk sange og musik gratis online. Kræver ingen app eller registrering. Virker på alle enheder.',
    'story_page.meta_title': 'TikTok Story Downloader – Gem billeder og historier anonymt',
    'story_page.meta_desc': 'Download TikTok-historier og diasshows anonymt og gratis. Gem fotogallerier og videohistorier, inden de udløber. Hurtigt, gratis, ingen login påkrævet.',
    'slideshow_page.meta_title': 'TikTok Slideshow Downloader – Gem billeder i HD uden vandmærke',
    'slideshow_page.meta_desc': 'Download foto-slideshows og billedserier fra TikTok i HD-kvalitet uden vandmærke. Gem alle billeder fra TikTok-opslag øjeblikkeligt. Gratis, hurtigt, ingen registrering.',
    'blog.meta_title': 'TikTok download guide 2026 – Videoer, MP3, slideshows og historier',
    'blog.meta_desc': 'Komplet guide til download af TikTok-indhold i 2026. Gem videoer uden vandmærke, konverter til MP3, download slideshows og historier på iPhone, Android og PC.',
    'tools.meta.title': 'Gratis onlineværktøjer – Billedkomprimering, konverter og QR-koder',
    'tools.meta.description': 'Gratis browserbaserede værktøjer: komprimer billeder, konverter formater (WebP, JPG, PNG) og generer QR-koder øjeblikkeligt. Ingen upload eller registrering nødvendig.',
  },
  de: {
    'meta.title': 'SaveTikFast 2026 – Bester TikTok Downloader Ohne Wasserzeichen (4K)',
    'meta.description': 'TikTok-Videos kostenlos ohne Wasserzeichen in Ultra HD/4K herunterladen. Der schnellste TikTok-Downloader 2026. Als MP4 und MP3 auf iPhone, Android und PC speichern.',
    'mp3_page.meta_title': 'TikTok zu MP3 Konverter – Kostenloses Download 320kbps',
    'mp3_page.meta_desc': 'TikTok-Videos in MP3-Audiodateien mit 320kbps Qualität konvertieren. Lieder und Musik kostenlos extrahieren. Keine App oder Registrierung nötig. Auf allen Geräten nutzbar.',
    'story_page.meta_title': 'TikTok Story Downloader – Fotos & Slideshows Anonym Speichern',
    'story_page.meta_desc': 'TikTok Storys und Diashows anonym und kostenlos herunterladen. Fotokarussells und Story-Videos speichern, bevor sie ablaufen. Schnell, gratis, keine Anmeldung nötig.',
    'slideshow_page.meta_title': 'TikTok Slideshow Downloader – Foto-Karussells in HD Speichern',
    'slideshow_page.meta_desc': 'TikTok-Fotopräsentationen und Karussells in HD ohne Wasserzeichen herunterladen. Alle Fotos aus TikTok-Beiträgen sofort speichern. Kostenlos, schnell, ohne Registrierung.',
    'blog.meta_title': 'TikTok Download Guide 2026 – Videos, MP3, Slideshows und Storys',
    'blog.meta_desc': 'Vollständiger Guide zum Download von TikTok-Inhalten 2026. Videos ohne Wasserzeichen speichern, in MP3 konvertieren, Diashows auf iPhone, Android und PC herunterladen.',
    'tools.meta.title': 'Kostenlose Online-Tools – Bildkomprimierung, Konverter & QR-Codes',
    'tools.meta.description': 'Kostenlose Browser-Tools: Bilder komprimieren, Formate konvertieren (WebP, JPG, PNG) und QR-Codes generieren. Keine Datei-Uploads oder Registrierung erforderlich.',
  },
  el: {
    'meta.title': 'SaveTikFast 2026 – Καλύτερος TikTok Downloader χωρίς υδατογράφημα (4K)',
    'meta.description': 'Κατεβάστε βίντεο TikTok χωρίς υδατογράφημα δωρεάν σε Ultra HD/4K. Ο πιο γρήγορος TikTok Saver 2026. Αποθήκευση ως MP4 και MP3 σε iPhone, Android και PC.',
    'mp3_page.meta_title': 'TikTok σε MP3 Μετατροπέας – Δωρεάν Λήψη Ήχου 320kbps',
    'mp3_page.meta_desc': 'Μετατρέψτε βίντεο TikTok σε αρχεία MP3 με υψηλή ποιότητα 320kbps. Εξαγωγή τραγουδιών και μουσικής δωρεάν. Χωρίς εφαρμογή ή εγγραφή. Λειτουργεί σε όλες τις συσκευές.',
    'story_page.meta_title': 'TikTok Story Downloader – Αποθήκευση Φωτογραφιών Ανώνυμα',
    'story_page.meta_desc': 'Κατεβάστε ιστορίες και παρουσιάσεις TikTok ανώνυμα και δωρεάν. Αποθηκεύστε άλμπουμ φωτογραφιών πριν λήξουν. Γρήγορα, χωρίς σύνδεση ή εγκατάσταση.',
    'slideshow_page.meta_title': 'TikTok Slideshow Downloader – Φωτογραφίες σε HD χωρίς υδατογράφημα',
    'slideshow_page.meta_desc': 'Κατεβάστε φωτοπαρουσιάσεις και άλμπουμ TikTok σε HD χωρίς υδατογράφημα. Αποθηκεύστε όλες τις φωτογραφίες από δημοσιεύσεις TikTok άμεσα. Δωρεάν, γρήγορα.',
    'blog.meta_title': 'Οδηγός TikTok 2026 – Βίντεο, MP3, Παρουσιάσεις & Ιστορίες',
    'blog.meta_desc': 'Πλήρης οδηγός λήψης περιεχομένου TikTok 2026. Αποθήκευση βίντεο χωρίς υδατογράφημα, μετατροπή σε MP3, λήψη παρουσιάσεων σε iPhone, Android και PC.',
    'tools.meta.title': 'Δωρεάν Online Εργαλεία – Συμπίεση, Μετατροπή & QR Κωδικοί',
    'tools.meta.description': 'Δωρεάν εργαλεία στον περιηγητή: συμπιέστε εικόνες, μετατρέψτε μορφές (WebP, JPG, PNG) και δημιουργήστε QR κωδικούς. Χωρίς μεταφόρτωση ή εγγραφή.',
  },
  es: {
    'meta.title': 'SaveTikFast 2026 – Mejor Descargador TikTok Sin Marca de Agua (4K)',
    'meta.description': 'Descarga vídeos de TikTok sin marca de agua gratis en Ultra HD/4K. El descargador TikTok más rápido del 2026. Guarda en MP4 y MP3 en iPhone, Android y PC.',
    'mp3_page.meta_title': 'TikTok a MP3 Convertidor – Descarga de Audio 320kbps Gratis',
    'mp3_page.meta_desc': 'Convierte vídeos de TikTok a archivos de audio MP3 en alta calidad 320kbps. Extrae canciones y música gratis online. Sin aplicación ni registro. Compatible con todos los dispositivos.',
    'story_page.meta_title': 'Descargador de Stories TikTok – Guardar Fotos Anónimamente',
    'story_page.meta_desc': 'Descarga Stories y presentaciones de TikTok de forma anónima y gratuita. Guarda álbumes de fotos y vídeos antes de que expiren. Rápido, sin inicio de sesión.',
    'slideshow_page.meta_title': 'Descargador Slideshow TikTok – Guardar Fotos en HD Sin Marca',
    'slideshow_page.meta_desc': 'Descarga presentaciones de fotos y carruseles de TikTok en calidad HD sin marca de agua. Guarda todas las imágenes de cualquier publicación al instante. Gratis y rápido.',
    'blog.meta_title': 'Guía TikTok Download 2026 – Videos, MP3, Slideshows e Historias',
    'blog.meta_desc': 'Guía completa para descargar contenido de TikTok en 2026. Guarda vídeos sin marca de agua, convierte a MP3, descarga slideshows e historias en iPhone, Android y PC.',
    'tools.meta.title': 'Herramientas Online Gratis – Comprimir, Convertir y Crear QR',
    'tools.meta.description': 'Herramientas gratuitas en el navegador: comprime imágenes, convierte formatos (WebP, JPG, PNG) y genera códigos QR al instante. Sin subidas ni registro necesario.',
  },
  fi: {
    'meta.title': 'SaveTikFast 2026 – Paras TikTok-lataaja ilman vesileimaa (4K)',
    'meta.description': 'Lataa TikTok-videoita ilman vesileimaa ilmaiseksi Ultra HD/4K-laadulla. Nopein TikTok-lataaja 2026. Tallenna MP4:nä ja MP3:na iPhonellesi, Androidille ja PC:lle.',
    'mp3_page.meta_title': 'TikTok MP3-muunnin – Ilmainen äänilataus 320kbps',
    'mp3_page.meta_desc': 'Muunna TikTok-videot MP3-äänitiedostoiksi korkealaatuisena 320kbps. Pura kappaleita ja musiikkia ilmaiseksi verkossa. Ei sovellusta tai rekisteröitymistä tarvita.',
    'story_page.meta_title': 'TikTok Story -lataaja – Kuvat ja tarinat anonyymisti ilmaiseksi',
    'story_page.meta_desc': 'Lataa TikTok-tarinoita ja esityksiä anonyymisti ja ilmaiseksi. Tallenna kuvagalleriat ja tarinat ennen kuin ne vanhenevat. Nopeaa, ilmaista, ei kirjautumista.',
    'slideshow_page.meta_title': 'TikTok Slideshow -lataaja – Kuvat HD-laadulla ilman vesileimaa',
    'slideshow_page.meta_desc': 'Lataa TikTok-kuvaesitykset ja -galleriat HD-laadulla ilman vesileimaa. Tallenna kaikki kuvat mistä tahansa TikTok-julkaisusta välittömästi. Ilmainen, nopea, ei rekisteröintiä.',
    'blog.meta_title': 'TikTok-latausopas 2026 – Videot, MP3, diaesitykset ja tarinat',
    'blog.meta_desc': 'Täydellinen opas TikTok-sisällön lataamiseen 2026. Tallenna videoita ilman vesileimaa, muunna MP3:ksi, lataa esityksiä iPhonelle, Androidille ja PC:lle.',
    'tools.meta.title': 'Ilmaiset verkkotyökalut – Kuvapakkaus, muunnin ja QR-koodit',
    'tools.meta.description': 'Ilmaiset selainpohjaiset työkalut: pakkaa kuvia, muunna tiedostomuotoja (WebP, JPG, PNG) ja luo QR-koodeja välittömästi. Ei tiedostojen latausta tai rekisteröitymistä.',
  },
  fil: {
    'meta.title': 'SaveTikFast 2026 – Pinakamahusay na TikTok Downloader Walang Watermark',
    'meta.description': 'I-download ang mga TikTok video nang walang watermark, libre, sa Ultra HD/4K. Pinakamabilis na TikTok Saver 2026. I-save bilang MP4 at MP3 sa iPhone, Android, at PC.',
    'mp3_page.meta_title': 'TikTok sa MP3 Converter – Libreng Audio Download 320kbps',
    'mp3_page.meta_desc': 'I-convert ang mga TikTok video sa MP3 audio file nang may mataas na kalidad na 320kbps. I-extract ang mga kanta at musika nang libre online. Walang kailangan na app o pagpaparehistro.',
    'story_page.meta_title': 'TikTok Story Downloader – I-save ang Mga Larawan Nang Hindi Kilala',
    'story_page.meta_desc': 'I-download ang mga TikTok story at slideshow nang hindi kilala at libre. I-save ang mga photo album at story video bago pa maging invalid. Mabilis, walang login.',
    'slideshow_page.meta_title': 'TikTok Slideshow Downloader – I-save ang Mga Larawan sa HD',
    'slideshow_page.meta_desc': 'I-download ang mga TikTok photo slideshow at carousel sa HD nang walang watermark. I-save ang lahat ng larawan mula sa anumang TikTok post agad. Libre, mabilis, walang registration.',
    'blog.meta_title': 'TikTok Download Guide 2026 – Video, MP3, Slideshow at Story',
    'blog.meta_desc': 'Kumpletong gabay sa pag-download ng TikTok content sa 2026. I-save ang mga video nang walang watermark, i-convert sa MP3, i-download ang mga slideshow sa iPhone, Android at PC.',
    'tools.meta.title': 'Libreng Online na Mga Tool – Compression, Converter at QR Generator',
    'tools.meta.description': 'Libreng mga browser-based na tool: mag-compress ng larawan, mag-convert ng format (WebP, JPG, PNG), at mag-generate ng QR code agad. Walang upload o pagpaparehistrong kailangan.',
  },
  fr: {
    'meta.title': 'SaveTikFast 2026 – Meilleur Téléchargeur TikTok Sans Filigrane (4K)',
    'meta.description': 'Téléchargez des vidéos TikTok sans filigrane gratuitement en Ultra HD/4K. Le téléchargeur TikTok le plus rapide de 2026. Enregistrez en MP4 et MP3 sur iPhone, Android et PC.',
    'mp3_page.meta_title': 'TikTok vers MP3 – Téléchargement Audio Gratuit 320kbps',
    'mp3_page.meta_desc': 'Convertissez des vidéos TikTok en fichiers audio MP3 en haute qualité 320kbps. Extrayez des chansons et de la musique gratuitement. Aucune application ni inscription requise.',
    'story_page.meta_title': 'Téléchargeur Stories TikTok – Enregistrer Photos Anonymement',
    'story_page.meta_desc': 'Téléchargez des stories et diaporamas TikTok anonymement et gratuitement. Enregistrez des albums photos et vidéos avant leur expiration. Rapide, sans connexion requise.',
    'slideshow_page.meta_title': 'Téléchargeur Slideshow TikTok – Enregistrer Carrousels en HD',
    'slideshow_page.meta_desc': 'Téléchargez des diaporamas et carrousels photos TikTok en HD sans filigrane. Enregistrez toutes les images de n\'importe quelle publication TikTok. Gratuit, rapide, sans inscription.',
    'blog.meta_title': 'Guide Téléchargement TikTok 2026 – Vidéos, MP3, Slideshows et Stories',
    'blog.meta_desc': 'Guide complet pour télécharger du contenu TikTok en 2026. Enregistrez les vidéos sans filigrane, convertissez en MP3, téléchargez des diaporamas sur iPhone, Android et PC.',
    'tools.meta.title': 'Outils Gratuits en Ligne – Compression, Conversion et QR Code',
    'tools.meta.description': 'Outils gratuits dans le navigateur : compressez des images, convertissez des formats (WebP, JPG, PNG) et générez des QR codes instantanément. Sans téléchargement ni inscription.',
  },
  hi: {
    'meta.title': 'SaveTikFast 2026 – सबसे अच्छा TikTok डाउनलोडर बिना वॉटरमार्क (4K)',
    'meta.description': 'TikTok वीडियो मुफ्त में बिना वॉटरमार्क के Ultra HD/4K में डाउनलोड करें। 2026 का सबसे तेज़ TikTok Saver। iPhone, Android और PC पर MP4 और MP3 में सेव करें।',
    'mp3_page.meta_title': 'TikTok से MP3 कनवर्टर – 320kbps ऑडियो मुफ्त डाउनलोड',
    'mp3_page.meta_desc': 'TikTok वीडियो को 320kbps उच्च गुणवत्ता MP3 में बदलें। गाने और संगीत मुफ्त में ऑनलाइन निकालें। कोई ऐप या रजिस्ट्रेशन की जरूरत नहीं। सभी डिवाइस पर काम करता है।',
    'story_page.meta_title': 'TikTok Story डाउनलोडर – फोटो और स्लाइडशो गुमनाम सेव करें',
    'story_page.meta_desc': 'TikTok Stories और Slideshows गुमनाम रूप से मुफ्त में डाउनलोड करें। एक्सपायर होने से पहले फोटो एल्बम और स्टोरी वीडियो सेव करें। तेज़, मुफ्त, कोई लॉगिन नहीं।',
    'slideshow_page.meta_title': 'TikTok Slideshow डाउनलोडर – HD में फोटो बिना वॉटरमार्क',
    'slideshow_page.meta_desc': 'TikTok फोटो स्लाइडशो और कैरोसेल HD क्वालिटी में वॉटरमार्क के बिना डाउनलोड करें। किसी भी TikTok पोस्ट से सभी तस्वीरें तुरंत सेव करें। मुफ्त, तेज़, रजिस्ट्रेशन नहीं।',
    'blog.meta_title': 'TikTok डाउनलोड गाइड 2026 – वीडियो, MP3, स्लाइडशो और स्टोरी',
    'blog.meta_desc': '2026 में TikTok कंटेंट डाउनलोड करने का पूरा गाइड। वॉटरमार्क के बिना वीडियो सेव करें, MP3 में कनवर्ट करें, iPhone, Android और PC पर स्लाइडशो डाउनलोड करें।',
    'tools.meta.title': 'मुफ्त ऑनलाइन टूल्स – इमेज कम्प्रेसर, कनवर्टर और QR जनरेटर',
    'tools.meta.description': 'मुफ्त ब्राउज़र-आधारित टूल्स: इमेज कम्प्रेस करें, फॉर्मेट बदलें (WebP, JPG, PNG) और QR कोड बनाएं। कोई फाइल अपलोड या रजिस्ट्रेशन की जरूरत नहीं। 100% मुफ्त।',
  },
  hu: {
    'meta.title': 'SaveTikFast 2026 – Legjobb TikTok Letöltő Vízjel Nélkül (4K)',
    'meta.description': 'Töltse le a TikTok-videókat vízjel nélkül ingyenesen Ultra HD/4K minőségben. A leggyorsabb TikTok Saver 2026. Mentse el MP4 és MP3 formátumban iPhone-ra, Androidra és PC-re.',
    'mp3_page.meta_title': 'TikTok MP3 Konverter – Ingyenes Hangfájl Letöltés 320kbps',
    'mp3_page.meta_desc': 'Konvertálja a TikTok-videókat MP3 hangfájlokká 320kbps minőségben. Zenék és dalok ingyenes kinyerése online. Nincs szükség alkalmazásra vagy regisztrációra. Minden eszközön működik.',
    'story_page.meta_title': 'TikTok Story Letöltő – Fotók és Előadások Névtelen Mentése',
    'story_page.meta_desc': 'Töltse le a TikTok-sztorikat és képbemutatókat névtelenül és ingyenesen. Mentse el a fotóalbumokat és a stori videókat lejáratuk előtt. Gyors, ingyenes, bejelentkezés nélkül.',
    'slideshow_page.meta_title': 'TikTok Slideshow Letöltő – Fotók Mentése HD Minőségben',
    'slideshow_page.meta_desc': 'Töltse le a TikTok-fotóbemutatókat és galériákat HD minőségben vízjel nélkül. Mentse el az összes képet bármely TikTok-bejegyzésből azonnal. Ingyenes, gyors, regisztráció nélkül.',
    'blog.meta_title': 'TikTok Letöltési Útmutató 2026 – Videók, MP3, Slideshowk és Sztorik',
    'blog.meta_desc': 'Teljes útmutató TikTok-tartalmak letöltéséhez 2026-ban. Videók mentése vízjel nélkül, MP3-má konvertálás, képbemutatók és sztorik letöltése iPhone-on, Androidon és PC-n.',
    'tools.meta.title': 'Ingyenes Online Eszközök – Képtömörítő, Konverter és QR-generátor',
    'tools.meta.description': 'Ingyenes böngészőalapú eszközök: tömörítse a képeket, konvertálja a formátumokat (WebP, JPG, PNG) és generáljon QR-kódokat azonnal. Feltöltés vagy regisztráció nem szükséges.',
  },
  id: {
    'meta.title': 'SaveTikFast 2026 – Unduhan TikTok Terbaik Tanpa Watermark (4K)',
    'meta.description': 'Unduh video TikTok tanpa watermark secara gratis dalam kualitas Ultra HD/4K. TikTok Saver tercepat 2026. Simpan sebagai MP4 dan MP3 di iPhone, Android, dan PC.',
    'mp3_page.meta_title': 'TikTok ke MP3 Converter – Unduh Audio Gratis 320kbps',
    'mp3_page.meta_desc': 'Konversi video TikTok ke file audio MP3 berkualitas tinggi 320kbps. Ekstrak lagu dan musik secara gratis online. Tidak perlu aplikasi atau registrasi. Kompatibel semua perangkat.',
    'story_page.meta_title': 'TikTok Story Downloader – Simpan Foto dan Cerita Secara Anonim',
    'story_page.meta_desc': 'Unduh Stories dan Slideshow TikTok secara anonim dan gratis. Simpan album foto dan video cerita sebelum kedaluwarsa. Cepat, gratis, tanpa perlu login atau aplikasi.',
    'slideshow_page.meta_title': 'TikTok Slideshow Downloader – Simpan Foto HD Tanpa Watermark',
    'slideshow_page.meta_desc': 'Unduh foto slideshow dan galeri TikTok dalam kualitas HD tanpa watermark. Simpan semua gambar dari postingan TikTok mana pun secara instan. Gratis, cepat, tanpa registrasi.',
    'blog.meta_title': 'Panduan Download TikTok 2026 – Video, MP3, Slideshow dan Cerita',
    'blog.meta_desc': 'Panduan lengkap mengunduh konten TikTok di 2026. Simpan video tanpa watermark, konversi ke MP3, unduh slideshow dan cerita di iPhone, Android, dan PC. Mudah dan gratis.',
    'tools.meta.title': 'Alat Online Gratis – Kompres Gambar, Konverter dan Generator QR',
    'tools.meta.description': 'Alat berbasis browser gratis: kompres gambar, konversi format (WebP, JPG, PNG), dan buat kode QR seketika. Tidak perlu upload file atau registrasi akun. 100% gratis.',
  },
  it: {
    'meta.title': 'SaveTikFast 2026 – Miglior Downloader TikTok Senza Filigrana (4K)',
    'meta.description': 'Scarica video TikTok senza filigrana gratuitamente in Ultra HD/4K. Il downloader TikTok più veloce del 2026. Salva in MP4 e MP3 su iPhone, Android e PC.',
    'mp3_page.meta_title': 'TikTok in MP3 Convertitore – Download Audio Gratis 320kbps',
    'mp3_page.meta_desc': 'Converti video TikTok in file audio MP3 ad alta qualità 320kbps. Estrai canzoni e musica gratuitamente online. Nessuna app o registrazione necessaria. Funziona su tutti i dispositivi.',
    'story_page.meta_title': 'TikTok Story Downloader – Salva Foto e Storie Anonimamente',
    'story_page.meta_desc': 'Scarica storie e presentazioni di TikTok in modo anonimo e gratuito. Salva album fotografici e video delle storie prima che scadano. Veloce, senza accesso richiesto.',
    'slideshow_page.meta_title': 'TikTok Slideshow Downloader – Salva Foto in HD Senza Filigrana',
    'slideshow_page.meta_desc': 'Scarica presentazioni fotografiche e caroselli TikTok in HD senza filigrana. Salva tutte le immagini da qualsiasi post TikTok istantaneamente. Gratuito, veloce, senza registrazione.',
    'blog.meta_title': 'Guida Download TikTok 2026 – Video, MP3, Slideshow e Storie',
    'blog.meta_desc': 'Guida completa al download di contenuti TikTok nel 2026. Salva video senza filigrana, converti in MP3, scarica slideshow e storie su iPhone, Android e PC.',
    'tools.meta.title': 'Strumenti Online Gratuiti – Comprimi, Converti e Crea QR Code',
    'tools.meta.description': 'Strumenti gratuiti nel browser: comprimi immagini, converti formati (WebP, JPG, PNG) e genera QR code istantaneamente. Nessun caricamento o registrazione necessaria.',
  },
  ja: {
    'meta.title': 'SaveTikFast 2026 – TikTok動画ダウンロード 透かしなし 4K対応',
    'meta.description': 'TikTok動画を透かしなしで無料でUltra HD/4Kでダウンロード。2026年最速のTikTokセーバー。iPhone、Android、PCでMP4・MP3として保存できます。',
    'mp3_page.meta_title': 'TikTok MP3変換 – 320kbps高音質無料ダウンロード',
    'mp3_page.meta_desc': 'TikTok動画を高音質320kbpsのMP3ファイルに変換。楽曲や音楽を無料でオンライン抽出。アプリや登録不要。すべてのデバイスで動作します。',
    'story_page.meta_title': 'TikTokストーリー保存 – 写真とスライドを匿名で無料ダウンロード',
    'story_page.meta_desc': 'TikTokストーリーとスライドショーを匿名で無料でダウンロード。期限切れになる前にフォトアルバムや動画を保存。ログイン不要、素早くかんたん。',
    'slideshow_page.meta_title': 'TikTokスライドショー保存 – HD画質・透かしなしで写真を一括ダウンロード',
    'slideshow_page.meta_desc': 'TikTokのフォトスライドショーやカルーセルをHD画質で透かしなしでダウンロード。TikTokの投稿からすべての画像を即座に保存。無料・高速・登録不要。',
    'blog.meta_title': 'TikTokダウンロード完全ガイド2026 – 動画・MP3・スライドショー',
    'blog.meta_desc': '2026年版TikTokコンテンツダウンロード完全ガイド。透かしなし動画保存、MP3変換、スライドショー・ストーリーをiPhone、Android、PCでダウンロードする方法。',
    'tools.meta.title': '無料オンラインツール – 画像圧縮・変換・QRコード生成',
    'tools.meta.description': '無料のブラウザ内ツール：画像を圧縮、形式変換（WebP、JPG、PNG）、QRコード生成が即座にできます。ファイルのアップロードや登録は一切不要。完全無料。',
  },
  ko: {
    'meta.title': 'SaveTikFast 2026 – TikTok 동영상 다운로더 워터마크 없음 (4K)',
    'meta.description': 'TikTok 동영상을 워터마크 없이 무료로 Ultra HD/4K로 다운로드하세요. 2026년 가장 빠른 TikTok Saver. iPhone, Android, PC에서 MP4 및 MP3로 저장하세요.',
    'mp3_page.meta_title': 'TikTok MP3 변환 – 320kbps 고음질 무료 다운로드',
    'mp3_page.meta_desc': 'TikTok 동영상을 320kbps 고음질 MP3로 변환하세요. 노래와 음악을 무료로 온라인에서 추출. 앱이나 회원가입 불필요. 모든 기기에서 작동합니다.',
    'story_page.meta_title': 'TikTok 스토리 다운로더 – 사진과 슬라이드를 익명으로 저장',
    'story_page.meta_desc': 'TikTok 스토리와 슬라이드쇼를 익명으로 무료 다운로드하세요. 만료 전에 사진 앨범과 스토리 동영상을 저장하세요. 빠르고, 무료이며, 로그인이 필요 없습니다.',
    'slideshow_page.meta_title': 'TikTok 슬라이드쇼 다운로더 – HD 화질로 사진 무료 저장',
    'slideshow_page.meta_desc': 'TikTok 포토 슬라이드쇼와 캐러셀을 워터마크 없이 HD로 다운로드하세요. TikTok 게시물의 모든 사진을 즉시 저장. 무료, 빠르고, 회원가입 불필요.',
    'blog.meta_title': 'TikTok 다운로드 가이드 2026 – 동영상, MP3, 슬라이드, 스토리',
    'blog.meta_desc': '2026년 TikTok 콘텐츠 다운로드 완전 가이드. 워터마크 없이 동영상 저장, MP3 변환, iPhone, Android, PC에서 슬라이드쇼와 스토리 다운로드 방법을 알아보세요.',
    'tools.meta.title': '무료 온라인 도구 – 이미지 압축, 변환 및 QR 코드 생성',
    'tools.meta.description': '무료 브라우저 기반 도구: 이미지 압축, 형식 변환(WebP, JPG, PNG) 및 QR 코드를 즉시 생성하세요. 파일 업로드나 회원 가입이 필요 없습니다. 완전 무료.',
  },
  ms: {
    'meta.title': 'SaveTikFast 2026 – Pemuat Turun TikTok Terbaik Tanpa Tera Air (4K)',
    'meta.description': 'Muat turun video TikTok tanpa tera air secara percuma dalam kualiti Ultra HD/4K. TikTok Saver terpantas 2026. Simpan sebagai MP4 dan MP3 pada iPhone, Android dan PC.',
    'mp3_page.meta_title': 'TikTok ke MP3 Penukar – Muat Turun Audio Percuma 320kbps',
    'mp3_page.meta_desc': 'Tukar video TikTok kepada fail audio MP3 berkualiti tinggi 320kbps. Ekstrak lagu dan muzik secara percuma dalam talian. Tiada aplikasi atau pendaftaran diperlukan. Semua peranti.',
    'story_page.meta_title': 'Pemuat Turun Story TikTok – Simpan Foto Secara Tanpa Nama',
    'story_page.meta_desc': 'Muat turun Stories dan Slideshow TikTok secara tanpa nama dan percuma. Simpan album foto dan video cerita sebelum tamat tempoh. Cepat, percuma, tiada log masuk diperlukan.',
    'slideshow_page.meta_title': 'Pemuat Turun Slideshow TikTok – Simpan Foto HD Tanpa Tera Air',
    'slideshow_page.meta_desc': 'Muat turun tayangan slaid foto dan galeri TikTok dalam kualiti HD tanpa tera air. Simpan semua imej dari mana-mana siaran TikTok serta-merta. Percuma, cepat, tiada pendaftaran.',
    'blog.meta_title': 'Panduan Muat Turun TikTok 2026 – Video, MP3, Slideshow dan Cerita',
    'blog.meta_desc': 'Panduan lengkap untuk memuat turun kandungan TikTok pada 2026. Simpan video tanpa tera air, tukar ke MP3, muat turun slideshow dan cerita pada iPhone, Android dan PC.',
    'tools.meta.title': 'Alat Dalam Talian Percuma – Pemampat Imej, Penukar dan QR',
    'tools.meta.description': 'Alat berasaskan pelayar percuma: mampatkan imej, tukar format (WebP, JPG, PNG) dan jana kod QR serta-merta. Tiada muat naik fail atau pendaftaran diperlukan. 100% percuma.',
  },
  nl: {
    'meta.title': 'SaveTikFast 2026 – Beste TikTok Downloader Zonder Watermerk (4K)',
    'meta.description': 'Download TikTok-video\'s zonder watermerk gratis in Ultra HD/4K. De snelste TikTok Saver van 2026. Sla op als MP4 en MP3 op iPhone, Android en PC.',
    'mp3_page.meta_title': 'TikTok naar MP3 Converter – Gratis Audiodownload 320kbps',
    'mp3_page.meta_desc': 'Converteer TikTok-video\'s naar MP3-audiobestanden in hoge kwaliteit 320kbps. Haal nummers en muziek gratis online op. Geen app of registratie nodig. Werkt op alle apparaten.',
    'story_page.meta_title': 'TikTok Story Downloader – Sla Foto\'s en Verhalen Anoniem Op',
    'story_page.meta_desc': 'Download TikTok-verhalen en -fotoreeksen anoniem en gratis. Sla fotoalbums en verhaalvideo\'s op voor ze verlopen. Snel, gratis, geen inloggen vereist.',
    'slideshow_page.meta_title': 'TikTok Slideshow Downloader – Sla Foto\'s op in HD Zonder Watermerk',
    'slideshow_page.meta_desc': 'Download TikTok-fotopresentaties en -carrousels in HD-kwaliteit zonder watermerk. Sla alle afbeeldingen uit TikTok-berichten direct op. Gratis, snel, zonder registratie.',
    'blog.meta_title': 'TikTok Download Gids 2026 – Video\'s, MP3, Slideshows en Verhalen',
    'blog.meta_desc': 'Complete gids voor het downloaden van TikTok-content in 2026. Video\'s opslaan zonder watermerk, converteren naar MP3, slideshows downloaden op iPhone, Android en PC.',
    'tools.meta.title': 'Gratis Online Tools – Afbeeldingscompressor, Converter en QR-codes',
    'tools.meta.description': 'Gratis browsergebaseerde tools: comprimeer afbeeldingen, converteer formaten (WebP, JPG, PNG) en genereer QR-codes direct. Geen bestanden uploaden of registreren vereist.',
  },
  no: {
    'meta.title': 'SaveTikFast 2026 – Beste TikTok Nedlaster Uten Vannmerke (4K)',
    'meta.description': 'Last ned TikTok-videoer uten vannmerke gratis i Ultra HD/4K. Raskeste TikTok Saver for 2026. Lagre som MP4 og MP3 på iPhone, Android og PC med én gang.',
    'mp3_page.meta_title': 'TikTok til MP3 Konverter – Gratis Lydnedlasting 320kbps',
    'mp3_page.meta_desc': 'Konverter TikTok-videoer til MP3-lydfiler i høy kvalitet 320kbps. Trekk ut sanger og musikk gratis online. Ingen app eller registrering nødvendig. Fungerer på alle enheter.',
    'story_page.meta_title': 'TikTok Story Nedlaster – Lagre Bilder og Historier Anonymt',
    'story_page.meta_desc': 'Last ned TikTok-historier og bildepresentasjoner anonymt og gratis. Lagre fotoalbum og videohistorier før de utløper. Raskt, gratis, ingen innlogging nødvendig.',
    'slideshow_page.meta_title': 'TikTok Slideshow Nedlaster – Lagre Bilder i HD Uten Vannmerke',
    'slideshow_page.meta_desc': 'Last ned TikTok-bildeserier og fotogallerier i HD-kvalitet uten vannmerke. Lagre alle bilder fra TikTok-innlegg umiddelbart. Gratis, raskt, ingen registrering nødvendig.',
    'blog.meta_title': 'TikTok Nedlastingsguide 2026 – Videoer, MP3, Slideshows og Historier',
    'blog.meta_desc': 'Komplett guide til nedlasting av TikTok-innhold i 2026. Lagre videoer uten vannmerke, konverter til MP3, last ned slideshows og historier på iPhone, Android og PC.',
    'tools.meta.title': 'Gratis Online Verktøy – Bildekomprimering, Konverter og QR-koder',
    'tools.meta.description': 'Gratis nettleserbaserte verktøy: komprimer bilder, konverter formater (WebP, JPG, PNG) og generer QR-koder umiddelbart. Ingen filopplasting eller registrering nødvendig.',
  },
  pl: {
    'meta.title': 'SaveTikFast 2026 – Najlepszy Pobieracz TikTok Bez Znaku Wodnego (4K)',
    'meta.description': 'Pobieraj filmy TikTok bez znaku wodnego za darmo w Ultra HD/4K. Najszybszy TikTok Saver 2026. Zapisz jako MP4 i MP3 na iPhone, Android i PC.',
    'mp3_page.meta_title': 'TikTok do MP3 Konwerter – Bezpłatne Pobieranie Audio 320kbps',
    'mp3_page.meta_desc': 'Konwertuj filmy TikTok na pliki audio MP3 w wysokiej jakości 320kbps. Wyodrębniaj piosenki i muzykę za darmo online. Bez aplikacji ani rejestracji. Działa na wszystkich urządzeniach.',
    'story_page.meta_title': 'Pobieracz Stories TikTok – Zachowaj Zdjęcia Anonimowo',
    'story_page.meta_desc': 'Pobieraj Stories i pokazy slajdów TikTok anonimowo i za darmo. Zapisuj albumy zdjęć i filmy przed ich wygaśnięciem. Szybko, bez logowania ani instalacji.',
    'slideshow_page.meta_title': 'Pobieracz Slideshows TikTok – Zdjęcia w HD Bez Znaku Wodnego',
    'slideshow_page.meta_desc': 'Pobieraj fotorelacje i galerie TikTok w jakości HD bez znaku wodnego. Zapisuj wszystkie zdjęcia z dowolnego posta TikTok natychmiastowo. Darmowe, szybkie, bez rejestracji.',
    'blog.meta_title': 'Przewodnik TikTok Download 2026 – Filmy, MP3, Slajdy i Stories',
    'blog.meta_desc': 'Kompletny przewodnik pobierania treści TikTok w 2026. Zapisuj filmy bez znaku wodnego, konwertuj do MP3, pobieraj pokazy slajdów na iPhone, Android i PC. Łatwe i bezpłatne.',
    'tools.meta.title': 'Bezpłatne Narzędzia Online – Kompresja Obrazów, Konwerter i QR',
    'tools.meta.description': 'Bezpłatne narzędzia w przeglądarce: kompresuj obrazy, konwertuj formaty (WebP, JPG, PNG) i generuj kody QR natychmiastowo. Bez przesyłania plików lub rejestracji.',
  },
  pt: {
    'meta.title': 'SaveTikFast 2026 – Melhor Baixador TikTok Sem Marca D\'água (4K)',
    'meta.description': 'Baixe vídeos do TikTok sem marca d\'água de graça em Ultra HD/4K. O TikTok Saver mais rápido de 2026. Salve em MP4 e MP3 no iPhone, Android e PC.',
    'mp3_page.meta_title': 'TikTok para MP3 Conversor – Download de Áudio 320kbps Grátis',
    'mp3_page.meta_desc': 'Converta vídeos do TikTok em arquivos MP3 em alta qualidade 320kbps. Extraia músicas e sons gratuitamente online. Sem aplicativo ou cadastro. Funciona em todos os dispositivos.',
    'story_page.meta_title': 'Baixador de Stories TikTok – Salvar Fotos Anonimamente Grátis',
    'story_page.meta_desc': 'Baixe Stories e apresentações do TikTok anonimamente e de graça. Salve álbuns de fotos e vídeos antes que expirem. Rápido, sem necessidade de login ou aplicativo.',
    'slideshow_page.meta_title': 'Baixador Slideshow TikTok – Salvar Fotos em HD Sem Marca D\'água',
    'slideshow_page.meta_desc': 'Baixe apresentações de fotos e carrosséis do TikTok em HD sem marca d\'água. Salve todas as imagens de posts do TikTok instantaneamente. Grátis, rápido, sem registro.',
    'blog.meta_title': 'Guia Download TikTok 2026 – Vídeos, MP3, Slideshows e Stories',
    'blog.meta_desc': 'Guia completo para baixar conteúdo do TikTok em 2026. Salve vídeos sem marca d\'água, converta para MP3, baixe slideshows e stories no iPhone, Android e PC.',
    'tools.meta.title': 'Ferramentas Online Grátis – Compressor de Imagens, Conversor e QR',
    'tools.meta.description': 'Ferramentas gratuitas no navegador: comprima imagens, converta formatos (WebP, JPG, PNG) e gere QR codes instantaneamente. Sem upload de arquivos ou cadastro necessário.',
  },
  ro: {
    'meta.title': 'SaveTikFast 2026 – Cel Mai Bun Descărcător TikTok Fără Filigran (4K)',
    'meta.description': 'Descarcă videoclipuri TikTok fără filigran și gratuit în Ultra HD/4K. Cel mai rapid TikTok Saver 2026. Salvează ca MP4 și MP3 pe iPhone, Android și PC.',
    'mp3_page.meta_title': 'TikTok la MP3 Convertor – Descărcare Audio Gratuită 320kbps',
    'mp3_page.meta_desc': 'Convertește videoclipuri TikTok în fișiere audio MP3 la 320kbps calitate înaltă. Extrage cântece și muzică gratuit online. Fără aplicație sau înregistrare. Funcționează pe orice dispozitiv.',
    'story_page.meta_title': 'Descărcător Stories TikTok – Salvează Poze Anonim și Gratuit',
    'story_page.meta_desc': 'Descarcă Stories și prezentări TikTok anonim și gratuit. Salvează albumele foto și videoclipurile înainte să expire. Rapid, fără autentificare sau instalare de aplicație.',
    'slideshow_page.meta_title': 'Descărcător Slideshow TikTok – Salvează Poze în HD Fără Filigran',
    'slideshow_page.meta_desc': 'Descarcă prezentațiile foto și galeriile TikTok în calitate HD fără filigran. Salvează toate imaginile din orice postare TikTok imediat. Gratuit, rapid, fără înregistrare.',
    'blog.meta_title': 'Ghid Download TikTok 2026 – Videoclipuri, MP3, Slideshow-uri și Stories',
    'blog.meta_desc': 'Ghid complet pentru descărcarea conținutului TikTok în 2026. Salvează videourile fără filigran, convertește la MP3, descarcă prezentări pe iPhone, Android și PC.',
    'tools.meta.title': 'Instrumente Online Gratuite – Compresie, Conversie Imagini și QR',
    'tools.meta.description': 'Instrumente gratuite în browser: comprimați imagini, convertiți formate (WebP, JPG, PNG) și generați coduri QR instantaneu. Fără încărcare de fișiere sau înregistrare necesară.',
  },
  ru: {
    'meta.title': 'SaveTikFast 2026 – Лучший загрузчик TikTok без водяного знака (4K)',
    'meta.description': 'Скачивайте видео TikTok без водяного знака бесплатно в Ultra HD/4K. Самый быстрый TikTok Saver 2026. Сохраняйте в MP4 и MP3 на iPhone, Android и ПК.',
    'mp3_page.meta_title': 'TikTok в MP3 конвертер – Бесплатная загрузка 320kbps',
    'mp3_page.meta_desc': 'Конвертируйте видео TikTok в аудиофайлы MP3 высокого качества 320kbps. Извлекайте песни и музыку бесплатно онлайн. Не нужен приложение или регистрация. Работает на всех устройствах.',
    'story_page.meta_title': 'Загрузчик историй TikTok – Сохранять фото анонимно бесплатно',
    'story_page.meta_desc': 'Скачивайте истории и слайд-шоу TikTok анонимно и бесплатно. Сохраняйте фотоальбомы и видео до истечения срока. Быстро, без входа в аккаунт или установки приложений.',
    'slideshow_page.meta_title': 'Загрузчик слайд-шоу TikTok – Фото в HD без водяного знака',
    'slideshow_page.meta_desc': 'Скачивайте фотопрезентации и галереи TikTok в HD без водяного знака. Сохраняйте все фотографии из любого поста TikTok мгновенно. Бесплатно, быстро, без регистрации.',
    'blog.meta_title': 'Руководство по скачиванию TikTok 2026 – Видео, MP3, слайды и истории',
    'blog.meta_desc': 'Полное руководство по скачиванию контента TikTok в 2026 году. Сохранение видео без водяного знака, конвертация в MP3, загрузка слайдшоу на iPhone, Android и ПК.',
    'tools.meta.title': 'Бесплатные онлайн-инструменты – Сжатие фото, конвертер и QR',
    'tools.meta.description': 'Бесплатные инструменты в браузере: сжимайте изображения, конвертируйте форматы (WebP, JPG, PNG) и создавайте QR-коды мгновенно. Без загрузки файлов или регистрации.',
  },
  sv: {
    'meta.title': 'SaveTikFast 2026 – Bästa TikTok Nedladdare Utan Vattenstämpel (4K)',
    'meta.description': 'Ladda ned TikTok-videor utan vattenstämpel gratis i Ultra HD/4K. Snabbaste TikTok Saver för 2026. Spara som MP4 och MP3 på iPhone, Android och PC.',
    'mp3_page.meta_title': 'TikTok till MP3 Konverterare – Gratis Ljudnedladdning 320kbps',
    'mp3_page.meta_desc': 'Konvertera TikTok-videor till MP3-ljudfiler i hög kvalitet 320kbps. Extrahera låtar och musik gratis online. Ingen app eller registrering krävs. Fungerar på alla enheter.',
    'story_page.meta_title': 'TikTok Story Nedladdare – Spara Foton och Berättelser Anonymt',
    'story_page.meta_desc': 'Ladda ned TikTok-berättelser och bildspel anonymt och gratis. Spara fotoalbum och videoberättelser innan de går ut. Snabbt, gratis, ingen inloggning krävs.',
    'slideshow_page.meta_title': 'TikTok Slideshow Nedladdare – Spara Foton i HD Utan Vattenstämpel',
    'slideshow_page.meta_desc': 'Ladda ned TikTok-bildspel och fotogallerier i HD-kvalitet utan vattenstämpel. Spara alla bilder från TikTok-inlägg omedelbart. Gratis, snabbt, utan registrering.',
    'blog.meta_title': 'TikTok-nedladdningsguide 2026 – Videor, MP3, Bildspel och Berättelser',
    'blog.meta_desc': 'Komplett guide för nedladdning av TikTok-innehåll 2026. Spara videor utan vattenstämpel, konvertera till MP3, ladda ned bildspel och berättelser på iPhone, Android och PC.',
    'tools.meta.title': 'Gratis Online-verktyg – Bildkomprimering, Konverterare och QR-koder',
    'tools.meta.description': 'Gratis webbläsarbaserade verktyg: komprimera bilder, konvertera format (WebP, JPG, PNG) och generera QR-koder direkt. Ingen filuppladdning eller registrering behövs.',
  },
  th: {
    'meta.title': 'SaveTikFast 2026 - ดาวน์โหลดวิดีโอ TikTok ไม่มีลายน้ำ คุณภาพ 4K',
    'meta.description': 'ดาวน์โหลดวิดีโอ TikTok ฟรีโดยไม่มีลายน้ำในคุณภาพ Ultra HD/4K. TikTok Saver ที่เร็วที่สุดในปี 2026. บันทึกเป็น MP4 และ MP3 บน iPhone, Android และ PC.',
    'mp3_page.meta_title': 'แปลง TikTok เป็น MP3 - ดาวน์โหลดเสียง 320kbps ฟรี',
    'mp3_page.meta_desc': 'แปลงวิดีโอ TikTok เป็นไฟล์ MP3 คุณภาพสูง 320kbps. แยกเพลงและดนตรีออนไลน์ฟรี. ไม่ต้องติดตั้งแอปหรือลงทะเบียน. ใช้งานได้บนทุกอุปกรณ์และทุกเบราว์เซอร์.',
    'story_page.meta_title': 'ดาวน์โหลด TikTok Story - บันทึกรูปภาพและสไลด์โดยไม่ระบุตัวตน',
    'story_page.meta_desc': 'ดาวน์โหลด TikTok Stories และสไลด์โชว์โดยไม่ระบุตัวตนและฟรี. บันทึกอัลบั้มรูปและวิดีโอก่อนหมดอายุ. รวดเร็ว ไม่ต้องเข้าสู่ระบบหรือติดตั้งแอปพลิเคชัน.',
    'slideshow_page.meta_title': 'ดาวน์โหลด TikTok Slideshow - บันทึกรูป HD ไม่มีลายน้ำฟรี',
    'slideshow_page.meta_desc': 'ดาวน์โหลดสไลด์โชว์รูปภาพและแกลเลอรี่จาก TikTok ในคุณภาพ HD โดยไม่มีลายน้ำ. บันทึกทุกภาพจากโพสต์ TikTok ได้ทันที. ฟรี รวดเร็ว ไม่ต้องลงทะเบียน.',
    'blog.meta_title': 'คู่มือดาวน์โหลด TikTok 2026 - วิดีโอ MP3 สไลด์โชว์ และสตอรี่',
    'blog.meta_desc': 'คู่มือครบถ้วนสำหรับดาวน์โหลดเนื้อหา TikTok ในปี 2026. บันทึกวิดีโอไม่มีลายน้ำ แปลงเป็น MP3 ดาวน์โหลดสไลด์โชว์บน iPhone, Android และ PC.',
    'tools.meta.title': 'เครื่องมือออนไลน์ฟรี - บีบอัดรูป แปลงไฟล์ และสร้าง QR Code',
    'tools.meta.description': 'เครื่องมือฟรีบนเบราว์เซอร์: บีบอัดรูปภาพ แปลงรูปแบบไฟล์ (WebP, JPG, PNG) และสร้าง QR code ได้ทันที. ไม่ต้องอัปโหลดไฟล์หรือลงทะเบียน. ใช้งานได้ฟรี 100%.',
  },
  tr: {
    'meta.title': 'SaveTikFast 2026 – En İyi TikTok İndirici Filigransız (4K Kalite)',
    'meta.description': 'TikTok videolarını filigransız olarak ücretsiz Ultra HD/4K kalitesinde indirin. 2026\'nın en hızlı TikTok Saver\'ı. iPhone, Android ve PC\'de MP4 ve MP3 olarak kaydedin.',
    'mp3_page.meta_title': 'TikTok MP3 Dönüştürücü – 320kbps Ücretsiz Ses İndirme',
    'mp3_page.meta_desc': 'TikTok videolarını 320kbps yüksek kalitede MP3 ses dosyalarına dönüştürün. Şarkı ve müzik dosyalarını ücretsiz online çıkarın. Uygulama veya kayıt gerekmez. Tüm cihazlarda çalışır.',
    'story_page.meta_title': 'TikTok Story İndirici – Fotoğraf ve Hikayeleri Anonim Kaydet',
    'story_page.meta_desc': 'TikTok hikayelerini ve slayt gösterilerini anonim ve ücretsiz indirin. Süresi dolmadan önce fotoğraf albümlerini ve video hikayeleri kaydedin. Hızlı, giriş gerektirmez.',
    'slideshow_page.meta_title': 'TikTok Slayt Gösterisi İndirici – HD\'de Fotoğraf Kaydet',
    'slideshow_page.meta_desc': 'TikTok fotoğraf slayt gösterilerini ve galerilerini HD kalitesinde filigransız indirin. Herhangi bir TikTok gönderisindeki tüm fotoğrafları anında kaydedin. Ücretsiz, hızlı, kayıt yok.',
    'blog.meta_title': 'TikTok İndirme Rehberi 2026 – Video, MP3, Slayt ve Hikayeler',
    'blog.meta_desc': '2026\'da TikTok içeriği indirmek için eksiksiz rehber. Filigransız video kaydedin, MP3\'e dönüştürün, iPhone, Android ve PC\'de slayt ve hikayeleri indirin. Kolay ve ücretsiz.',
    'tools.meta.title': 'Ücretsiz Online Araçlar – Görsel Sıkıştırma, Dönüştürücü ve QR',
    'tools.meta.description': 'Ücretsiz tarayıcı tabanlı araçlar: görüntüleri sıkıştırın, formatları dönüştürün (WebP, JPG, PNG) ve QR kodları oluşturun. Dosya yükleme veya kayıt gerekmez. Tamamen ücretsiz.',
  },
  uk: {
    'meta.title': 'SaveTikFast 2026 – Найкращий завантажувач TikTok без водяного знака (4K)',
    'meta.description': 'Завантажуйте відео TikTok без водяного знака безкоштовно в Ultra HD/4K. Найшвидший TikTok Saver 2026. Зберігайте як MP4 і MP3 на iPhone, Android і ПК.',
    'mp3_page.meta_title': 'TikTok в MP3 конвертер – Безкоштовне завантаження 320kbps',
    'mp3_page.meta_desc': 'Конвертуйте відео TikTok в MP3-аудіофайли високої якості 320kbps. Витягуйте пісні та музику безкоштовно онлайн. Не потрібен додаток або реєстрація. Працює на всіх пристроях.',
    'story_page.meta_title': 'Завантажувач сторіс TikTok – Зберігати фото анонімно безкоштовно',
    'story_page.meta_desc': 'Завантажуйте сторіс та слайд-шоу TikTok анонімно і безкоштовно. Зберігайте фотоальбоми та відео до закінчення терміну. Швидко, без входу в акаунт чи встановлення.',
    'slideshow_page.meta_title': 'Завантажувач слайд-шоу TikTok – Фото в HD без водяного знака',
    'slideshow_page.meta_desc': 'Завантажуйте фотопрезентації та галереї TikTok у HD без водяного знака. Зберігайте всі фотографії з будь-якого допису TikTok миттєво. Безкоштовно, швидко, без реєстрації.',
    'blog.meta_title': 'Посібник завантаження TikTok 2026 – Відео, MP3, слайди та сторіс',
    'blog.meta_desc': 'Повний посібник із завантаження контенту TikTok у 2026 році. Збереження відео без водяного знака, конвертація в MP3, завантаження слайдшоу на iPhone, Android та ПК.',
    'tools.meta.title': 'Безкоштовні онлайн-інструменти – Стиснення фото, конвертер і QR',
    'tools.meta.description': 'Безкоштовні інструменти в браузері: стискайте зображення, конвертуйте формати (WebP, JPG, PNG) і створюйте QR-коди миттєво. Без завантаження файлів або реєстрації.',
  },
  vi: {
    'meta.title': 'SaveTikFast 2026 – Tải TikTok Tốt Nhất Không Logo Chất Lượng 4K',
    'meta.description': 'Tải video TikTok không logo miễn phí chất lượng Ultra HD/4K. TikTok Saver nhanh nhất 2026. Lưu dưới dạng MP4 và MP3 trên iPhone, Android và PC ngay lập tức.',
    'mp3_page.meta_title': 'Chuyển TikTok sang MP3 – Tải Nhạc Miễn Phí Chất Lượng 320kbps',
    'mp3_page.meta_desc': 'Chuyển đổi video TikTok thành file MP3 chất lượng cao 320kbps. Trích xuất bài hát và nhạc miễn phí trực tuyến. Không cần cài app hay đăng ký. Hoạt động trên mọi thiết bị.',
    'story_page.meta_title': 'Tải Story TikTok – Lưu Ảnh và Slideshow Ẩn Danh Miễn Phí',
    'story_page.meta_desc': 'Tải Story và Slideshow TikTok ẩn danh và miễn phí. Lưu album ảnh và video story trước khi hết hạn. Nhanh chóng, không cần đăng nhập hay cài đặt ứng dụng.',
    'slideshow_page.meta_title': 'Tải Slideshow TikTok – Lưu Ảnh HD Không Logo Miễn Phí',
    'slideshow_page.meta_desc': 'Tải slideshow ảnh và bộ sưu tập từ TikTok chất lượng HD không logo. Lưu tất cả ảnh từ bất kỳ bài đăng TikTok nào ngay lập tức. Miễn phí, nhanh, không cần đăng ký.',
    'blog.meta_title': 'Hướng Dẫn Tải TikTok 2026 – Video, MP3, Slideshow và Story',
    'blog.meta_desc': 'Hướng dẫn đầy đủ tải nội dung TikTok năm 2026. Lưu video không dính logo, chuyển sang MP3, tải slideshow và story trên iPhone, Android và PC. Dễ dàng và miễn phí.',
    'tools.meta.title': 'Công Cụ Trực Tuyến Miễn Phí – Nén Ảnh, Chuyển Đổi và Tạo QR',
    'tools.meta.description': 'Công cụ miễn phí trên trình duyệt: nén ảnh, chuyển đổi định dạng (WebP, JPG, PNG) và tạo mã QR ngay lập tức. Không cần tải lên hay đăng ký tài khoản. Hoàn toàn miễn phí.',
  },
  zh: {
    'meta.title': 'SaveTikFast 2026 - TikTok视频下载器 无水印 4K高清免费',
    'meta.description': '免费下载TikTok视频，无水印，超高清4K/HD画质。2026年最快的TikTok下载工具。支持MP4和MP3格式，兼容iPhone、Android和电脑。操作简单，即开即用。',
    'mp3_page.meta_title': 'TikTok转MP3 - 免费下载高质量音频 320kbps',
    'mp3_page.meta_desc': '将TikTok视频转换为高质量320kbps MP3音频文件。在线免费提取歌曲和音乐。无需安装应用程序，无需注册账号。支持所有设备和浏览器。快速便捷。',
    'story_page.meta_title': 'TikTok故事下载器 - 匿名保存照片和幻灯片 免费',
    'story_page.meta_desc': '匿名免费下载TikTok故事和幻灯片。在过期前保存相册和故事视频。快速、免费，无需登录或安装任何应用程序。一键保存所有TikTok故事内容。',
    'slideshow_page.meta_title': 'TikTok相册下载器 - 高清无水印保存轮播图片 免费',
    'slideshow_page.meta_desc': '下载TikTok照片幻灯片和轮播相册，高清无水印。立即保存TikTok帖子中的所有图片。完全免费，速度快，无需注册。支持批量下载多张图片。',
    'blog.meta_title': 'TikTok下载完全指南2026 - 视频 MP3 幻灯片和故事',
    'blog.meta_desc': '2026年TikTok内容下载完整指南。学会无水印保存视频、转换MP3、在iPhone、Android和电脑上下载幻灯片和故事。简单易用，完全免费。',
    'tools.meta.title': '免费在线工具 - 图片压缩、格式转换和二维码生成',
    'tools.meta.description': '免费浏览器工具：压缩图片、转换格式（WebP、JPG、PNG）、即时生成二维码。无需上传文件或注册账号。100%免费，所有功能在浏览器本地完成。',
  },
};

// =============================================================
// Helper functions
// =============================================================

function getNestedVal(obj, keyPath) {
  return keyPath.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
}

function setNestedVal(obj, keyPath, value) {
  const parts = keyPath.split('.');
  let curr = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!curr[parts[i]] || typeof curr[parts[i]] !== 'object') curr[parts[i]] = {};
    curr = curr[parts[i]];
  }
  curr[parts[parts.length - 1]] = value;
}

// =============================================================
// Main execution
// =============================================================

const LOCALES_DIR = 'src/locales/locales';
let updatedCount = 0;
let skippedCount = 0;
const report = [];

for (const [lang, meta] of Object.entries(META)) {
  const file = path.join(LOCALES_DIR, `${lang}.json`);
  if (!fs.existsSync(file)) {
    console.log(`⚠️  Skipping ${lang}.json — file not found`);
    continue;
  }

  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  let changed = false;
  const changes = [];

  for (const [key, newValue] of Object.entries(meta)) {
    const currentValue = getNestedVal(data, key);
    if (currentValue !== newValue) {
      const oldLen = currentValue ? currentValue.length : 0;
      setNestedVal(data, key, newValue);
      changes.push(`  ${key}: ${oldLen}c → ${newValue.length}c`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Updated ${lang}.json (${changes.length} keys)`);
    changes.forEach(c => console.log(c));
    updatedCount++;
    report.push({ lang, changes });
  } else {
    console.log(`⏭️  Skipped ${lang}.json — all values already correct`);
    skippedCount++;
  }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`✅ Done: ${updatedCount} files updated, ${skippedCount} skipped`);
console.log(`📊 Total languages processed: ${Object.keys(META).length}`);
