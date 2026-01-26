/**
 * MP3 Page Generator for 30 Languages
 * Generates /mp3/{lang}/index.html for each language
 * SEO optimized with 10 FAQs per language
 */

const fs = require('fs');
const path = require('path');

// 30 Languages with translations
const LANGUAGES = {
    ar: { name: 'العربية', dir: 'rtl', title: 'تحميل MP3 من تيك توك', desc: 'حول فيديوهات تيك توك إلى ملفات MP3 صوتية بجودة عالية 320kbps مجاناً' },
    en: { name: 'English', dir: 'ltr', title: 'TikTok to MP3 Converter', desc: 'Convert TikTok videos to MP3 audio files in high quality 320kbps for free' },
    es: { name: 'Español', dir: 'ltr', title: 'Convertidor TikTok a MP3', desc: 'Convierte videos de TikTok a archivos MP3 de alta calidad 320kbps gratis' },
    fr: { name: 'Français', dir: 'ltr', title: 'Convertisseur TikTok en MP3', desc: 'Convertissez les vidéos TikTok en fichiers audio MP3 haute qualité 320kbps' },
    de: { name: 'Deutsch', dir: 'ltr', title: 'TikTok zu MP3 Konverter', desc: 'Konvertieren Sie TikTok-Videos in MP3-Audiodateien in hoher Qualität 320kbps' },
    it: { name: 'Italiano', dir: 'ltr', title: 'Convertitore TikTok in MP3', desc: 'Converti video TikTok in file audio MP3 di alta qualità 320kbps gratis' },
    pt: { name: 'Português', dir: 'ltr', title: 'Conversor TikTok para MP3', desc: 'Converta vídeos do TikTok em arquivos MP3 de alta qualidade 320kbps grátis' },
    ru: { name: 'Русский', dir: 'ltr', title: 'Конвертер TikTok в MP3', desc: 'Конвертируйте видео TikTok в аудио MP3 высокого качества 320kbps бесплатно' },
    ja: { name: '日本語', dir: 'ltr', title: 'TikTok MP3変換', desc: 'TikTok動画を高品質320kbps MP3オーディオファイルに無料変換' },
    ko: { name: '한국어', dir: 'ltr', title: 'TikTok MP3 변환기', desc: 'TikTok 비디오를 고품질 320kbps MP3 오디오 파일로 무료 변환' },
    zh: { name: '中文', dir: 'ltr', title: 'TikTok转MP3转换器', desc: '免费将TikTok视频转换为高质量320kbps MP3音频文件' },
    tr: { name: 'Türkçe', dir: 'ltr', title: 'TikTok MP3 Dönüştürücü', desc: 'TikTok videolarını yüksek kaliteli 320kbps MP3 ses dosyalarına ücretsiz dönüştürün' },
    id: { name: 'Indonesia', dir: 'ltr', title: 'Konverter TikTok ke MP3', desc: 'Konversi video TikTok ke file audio MP3 berkualitas tinggi 320kbps gratis' },
    vi: { name: 'Tiếng Việt', dir: 'ltr', title: 'Chuyển đổi TikTok sang MP3', desc: 'Chuyển đổi video TikTok thành tệp âm thanh MP3 chất lượng cao 320kbps miễn phí' },
    th: { name: 'ไทย', dir: 'ltr', title: 'แปลง TikTok เป็น MP3', desc: 'แปลงวิดีโอ TikTok เป็นไฟล์เสียง MP3 คุณภาพสูง 320kbps ฟรี' },
    nl: { name: 'Nederlands', dir: 'ltr', title: 'TikTok naar MP3 Converter', desc: 'Converteer TikTok-videos naar MP3-audiobestanden van hoge kwaliteit 320kbps gratis' },
    pl: { name: 'Polski', dir: 'ltr', title: 'Konwerter TikTok na MP3', desc: 'Konwertuj filmy TikTok na pliki audio MP3 wysokiej jakości 320kbps za darmo' },
    uk: { name: 'Українська', dir: 'ltr', title: 'Конвертер TikTok в MP3', desc: 'Конвертуйте відео TikTok в аудіо MP3 високої якості 320kbps безкоштовно' },
    he: { name: 'עברית', dir: 'rtl', title: 'ממיר TikTok ל-MP3', desc: 'המר סרטוני TikTok לקבצי אודיו MP3 באיכות גבוהה 320kbps בחינם' },
    hi: { name: 'हिन्दी', dir: 'ltr', title: 'TikTok से MP3 कन्वर्टर', desc: 'TikTok वीडियो को उच्च गुणवत्ता 320kbps MP3 ऑडियो फ़ाइलों में मुफ्त में कनवर्ट करें' },
    cs: { name: 'Čeština', dir: 'ltr', title: 'TikTok do MP3 Konvertor', desc: 'Převeďte videa TikTok na vysoce kvalitní 320kbps MP3 audio soubory zdarma' },
    da: { name: 'Dansk', dir: 'ltr', title: 'TikTok til MP3 Konverter', desc: 'Konverter TikTok-videoer til MP3-lydfiler i høj kvalitet 320kbps gratis' },
    el: { name: 'Ελληνικά', dir: 'ltr', title: 'Μετατροπέας TikTok σε MP3', desc: 'Μετατρέψτε βίντεο TikTok σε αρχεία ήχου MP3 υψηλής ποιότητας 320kbps δωρεάν' },
    fi: { name: 'Suomi', dir: 'ltr', title: 'TikTok MP3 Muunnin', desc: 'Muunna TikTok-videot korkealaatuisiksi 320kbps MP3-äänitiedostoiksi ilmaiseksi' },
    hu: { name: 'Magyar', dir: 'ltr', title: 'TikTok MP3 Konverter', desc: 'Konvertálja a TikTok videókat kiváló minőségű 320kbps MP3 hangfájlokká ingyen' },
    ms: { name: 'Melayu', dir: 'ltr', title: 'Penukar TikTok ke MP3', desc: 'Tukar video TikTok kepada fail audio MP3 berkualiti tinggi 320kbps secara percuma' },
    no: { name: 'Norsk', dir: 'ltr', title: 'TikTok til MP3 Konverter', desc: 'Konverter TikTok-videoer til MP3-lydfiler av høy kvalitet 320kbps gratis' },
    ro: { name: 'Română', dir: 'ltr', title: 'Convertor TikTok în MP3', desc: 'Convertiți videoclipuri TikTok în fișiere audio MP3 de înaltă calitate 320kbps gratuit' },
    sk: { name: 'Slovenčina', dir: 'ltr', title: 'TikTok na MP3 Konvertor', desc: 'Preveďte videá TikTok na vysoko kvalitné 320kbps MP3 audio súbory zadarmo' },
    sv: { name: 'Svenska', dir: 'ltr', title: 'TikTok till MP3 Konverterare', desc: 'Konvertera TikTok-videor till MP3-ljudfiler av hög kvalitet 320kbps gratis' }
};

// FAQ translations for each language (10 SEO-optimized questions)
const FAQS = {
    ar: [
        { q: 'كيف أحول فيديو تيك توك إلى MP3 بجودة عالية؟', a: 'انسخ رابط الفيديو من تيك توك، الصقه في المربع أعلاه، واضغط تحميل. سيتم استخراج الصوت بجودة 320kbps.' },
        { q: 'هل خدمة تحويل تيك توك إلى صوت مجانية؟', a: 'نعم، SaveTikFast مجاني 100% ولا يتطلب أي اشتراك أو تسجيل حساب.' },
        { q: 'كيف أحمل نغمة رنين من تيك توك؟', a: 'بعد تحويل الفيديو لـ MP3، احفظ الملف في هاتفك ثم انتقل للإعدادات واجعله نغمة رنين.' },
        { q: 'هل يعمل المحول على الآيفون والاندرويد؟', a: 'نعم، أداتنا تعمل بكفاءة على جميع الهواتف (آيفون، سامسونج، هواوي) والكمبيوتر.' },
        { q: 'أين يتم حفظ ملفات MP3؟', a: 'تجد الملفات في مجلد "التنزيلات" أو في تطبيق "الموسيقى" حسب جهازك.' },
        { q: 'هل يمكنني تحميل الأغاني الترند؟', a: 'بالتأكيد! يمكنك تحميل أي صوت أو أغنية ترند من تيك توك بصيغة MP3.' },
        { q: 'لماذا لا يوجد صوت في الملف المحمل؟', a: 'تأكد أن الفيديو الأصلي يحتوي على صوت مسموع وليس محمياً بحقوق نشر تمنع الصوت.' },
        { q: 'كم عدد الملفات المسموح بتحميلها يومياً؟', a: 'لا يوجد حد! يمكنك تحميل عدد لا نهائي من ملفات MP3 يومياً مجاناً.' },
        { q: 'هل الجودة أصلية أم مضغوطة؟', a: 'نحن نحافظ على الجودة الأصلية للصوت كما هي من المصدر (حتى 320kbps).' },
        { q: 'هل أحتاج لتثبيت برنامج للتحميل؟', a: 'لا، الأداة تعمل أونلاين عبر المتصفح دون الحاجة لأي برامج إضافية.' }
    ],
    en: [
        { q: 'How to convert TikTok video to MP3 high quality?', a: 'Copy the video link, paste it above, and click Download MP3. We extract audio in 320kbps quality.' },
        { q: 'Is TikTok to MP3 converter free?', a: 'Yes, SaveTikFast is 100% free with no hidden fees or registration needed.' },
        { q: 'Can I use the MP3 as a phone ringtone?', a: 'Yes! Download the MP3, then go to phone settings > Sound > Ringtone and select the file.' },
        { q: 'Does it work on iPhone and Android?', a: 'Absolutely. Our tool works mainly on browser, compatible with iOS, Android, PC and Mac.' },
        { q: 'Where are MP3 files saved?', a: 'Files are usually saved in the "Downloads" folder or your Music app.' },
        { q: 'Can I download trending TikTok songs?', a: 'Yes, you can extract any music, sound effect, or voiceover from TikTok videos.' },
        { q: 'Why is the downloaded audio silent?', a: 'Check if original video has sound. Some copyrighted sounds are muted by TikTok.' },
        { q: 'Is there a daily download limit?', a: 'No limits! Download as many MP3 files as you wish anytime.' },
        { q: 'What is the bitrate of the MP3?', a: 'We provide the highest available bitrate from the source, up to 320kbps.' },
        { q: 'Do I need to install an app?', a: 'No installation required. Works directly in Chrome, Safari, or any browser.' }
    ],
    // French
    fr: [
        { q: 'Comment convertir une vidéo TikTok en MP3 ?', a: 'Copiez le lien, collez-le ci-dessus et cliquez sur Télécharger. L\'audio sera extrait en haute qualité.' },
        { q: 'Est-ce que SaveTikFast est gratuit ?', a: 'Oui, notre service est 100% gratuit, sans inscription ni frais cachés.' },
        { q: 'Puis-je l\'utiliser sur iPhone et Android ?', a: 'Oui, cela fonctionne parfaitement sur tous les appareils mobiles et ordinateurs via le navigateur.' },
        { q: 'Quelle est la qualité audio MP3 ?', a: 'Nous offrons la meilleure qualité possible (jusqu\'à 320kbps) extraite directement de la source.' },
        { q: 'Où sont stockés les fichiers téléchargés ?', a: 'Vérifiez votre dossier "Téléchargements" ou l\'application Fichiers de votre téléphone.' },
        { q: 'Puis-je télécharger des musiques tendance ?', a: 'Absolument, vous pouvez extraire n\'importe quelle musique ou son viral de TikTok.' },
        { q: 'Y a-t-il une limite de téléchargement ?', a: 'Non, c\'est illimité. Téléchargez autant de fichiers MP3 que vous le souhaitez.' },
        { q: 'Faut-il installer une application ?', a: 'Non, tout se passe en ligne. Pas besoin d\'installer de logiciel supplémentaire.' },
        { q: 'Pourquoi mon fichier MP3 est-il silencieux ?', a: 'Vérifiez la vidéo originale. Parfois, le son est coupé pour des droits d\'auteur.' },
        { q: 'Est-ce légal de télécharger des MP3 ?', a: 'Oui, pour un usage personnel uniquement (écoute hors ligne). Respectez les droits d\'auteur.' }
    ],
    // Spanish
    es: [
        { q: '¿Cómo convertir video de TikTok a MP3?', a: 'Copia el enlace, pégalo arriba y pulsa Descargar. El audio se extraerá en alta calidad.' },
        { q: '¿Es gratis este convertidor?', a: 'Sí, SaveTikFast es 100% gratuito sin necesidad de registro ni pagos.' },
        { q: '¿Funciona en iPhone y Android?', a: 'Sí, funciona en todos los dispositivos (celulares, tablets, PC) a través del navegador.' },
        { q: '¿Puedo usar el MP3 como tono de llamada?', a: '¡Claro! Descarga el archivo y configúralo como tono desde los ajustes de tu teléfono.' },
        { q: '¿Dónde se guardan los archivos?', a: 'Busca en la carpeta "Descargas" o en tu gestor de archivos.' },
        { q: '¿Qué calidad tiene el audio?', a: 'Ofrecemos la máxima calidad original disponible, hasta 320kbps.' },
        { q: '¿Hay límite de descargas diarias?', a: 'No hay límites. Descarga audios y canciones ilimitadamente.' },
        { q: '¿Necesito instalar alguna app?', a: 'No, es una herramienta online. No ocupa espacio en tu dispositivo.' },
        { q: '¿Puedo descargar audios virales?', a: 'Sí, extrae cualquier sonido, canción o efecto viral de TikTok fácilmente.' },
        { q: '¿Por qué no se oye el audio?', a: 'Asegúrate que el video original tenga sonido público y no esté silenciado.' }
    ],
    // German
    de: [
        { q: 'Wie wandle ich TikTok in MP3 um?', a: 'Link kopieren, oben einfügen und auf Download klicken. Audio wird in hoher Qualität extrahiert.' },
        { q: 'Ist dieser Service kostenlos?', a: 'Ja, 100% kostenlos ohne Anmeldung oder versteckte Kosten.' },
        { q: 'Funktioniert es auf iPhone/Android?', a: 'Ja, es läuft auf allen Geräten und Browsern (Chrome, Safari, Firefox).' },
        { q: 'Kann ich Klingeltöne herunterladen?', a: 'Ja, lade die MP3 herunter und stelle sie in den Einstellungen als Klingelton ein.' },
        { q: 'Welche Audioqualität bekomme ich?', a: 'Wir bieten die beste Originalqualität bis zu 320kbps.' },
        { q: 'Wo finde ich meine Downloads?', a: 'Im Ordner "Downloads" oder der Dateien-App Ihres Geräts.' },
        { q: 'Gibt es ein Download-Limit?', a: 'Nein, unbegrenzte Downloads für alle Nutzer.' },
        { q: 'Muss ich eine App installieren?', a: 'Nein, alles funktioniert online ohne Software-Installation.' },
        { q: 'Kann ich Musik speichern?', a: 'Ja, extrahieren Sie Musik, Sounds und Sprache aus jedem Video.' },
        { q: 'Warum hat die MP3 keinen Ton?', a: 'Prüfen Sie das Originalvideo. Manche Sounds sind stummgeschaltet.' }
    ],
    // Indonesian
    id: [
        { q: 'Cara mengubah video TikTok ke MP3?', a: 'Salin tautan, tempel di atas, dan klik Unduh. Audio diekstrak dalam kualitas tinggi.' },
        { q: 'Apakah layanan ini gratis?', a: 'Ya, 100% gratis tanpa pendaftaran atau biaya tersembunyi.' },
        { q: 'Bisa dipakai untuk nada dering?', a: 'Tentu! Unduh MP3-nya dan atur sebagai nada dering di pengaturan HP Anda.' },
        { q: 'Apakah support iPhone dan Android?', a: 'Ya, bekerja lancar di semua perangkat via browser.' },
        { q: 'Di mana file tersimpan?', a: 'Cek folder "Download" atau Pengelola File di HP Anda.' },
        { q: 'Berapa kualitas audionya?', a: 'Kami menyediakan kualitas terbaik hingga 320kbps dari sumber asli.' },
        { q: 'Apakah ada batas unduhan?', a: 'Tidak ada batas. Unduh sepuasnya kapan saja.' },
        { q: 'Perlu instal aplikasi?', a: 'Tidak perlu. Gunakan langsung dari browser Chrome atau Safari.' },
        { q: 'Bisa download lagu viral?', a: 'Ya, simpan semua lagu dan sound viral TikTok dengan mudah.' },
        { q: 'Kenapa tidak ada suaranya?', a: 'Pastikan video asli memiliki suara dan tidak dibisukan oleh TikTok.' }
    ],
    // Turkish
    tr: [
        { q: 'TikTok videosu MP3\'e nasıl çevrilir?', a: 'Linki kopyalayın, yukarı yapıştırın ve İndir\'e tıklayın. Ses yüksek kalitede indirilir.' },
        { q: 'Bu hizmet ücretsiz mi?', a: 'Evet, %100 ücretsizdir. Üyelik veya ücret gerektirmez.' },
        { q: 'Zil sesi yapabilir miyim?', a: 'Evet, MP3\'ü indirin ve telefon ayarlarından zil sesi olarak seçin.' },
        { q: 'iPhone ve Android\'de çalışır mı?', a: 'Evet, tüm telefon ve bilgisayarlarda tarayıcı üzerinden çalışır.' },
        { q: 'Dosyalar nereye kaydedilir?', a: 'Genellikle "İndirilenler" klasörüne veya Dosya Yöneticisine kaydedilir.' },
        { q: 'Ses kalitesi nasıldır?', a: 'Orijinal videodaki en yüksek kaliteyi (320kbps\'ye kadar) sunuyoruz.' },
        { q: 'İndirme sınırı var mı?', a: 'Hayır, sınırsız MP3 indirme hakkınız var.' },
        { q: 'Uygulama indirmem gerekir mi?', a: 'Hayır, web tabanlıdır. Ekstra program gerektirmez.' },
        { q: 'Trend şarkıları indirebilir miyim?', a: 'Elbette, viral TikTok şarkılarını ve seslerini kolayca kaydedin.' },
        { q: 'Neden ses gelmiyor?', a: 'Orijinal videonun sesinin açık olduğundan emin olun.' }
    ],
    // Russian
    ru: [
        { q: 'Как конвертировать TikTok в MP3?', a: 'Скопируйте ссылку, вставьте выше и нажмите Скачать. Аудио будет сохранено в высоком качестве.' },
        { q: 'Это бесплатно?', a: 'Да, сервис на 100% бесплатен, без регистрации и скрытых платежей.' },
        { q: 'Работает на айфоне и андроиде?', a: 'Да, работает на любых устройствах через браузер.' },
        { q: 'Можно ли сделать рингтон?', a: 'Да, скачайте MP3 и установите как мелодию звонка в настройках.' },
        { q: 'Какое качество звука?', a: 'Мы предоставляем максимальное качество оригинала (до 320kbps).' },
        { q: 'Где искать файлы?', a: 'Проверьте папку "Загрузки" (Downloads) на вашем устройстве.' },
        { q: 'Есть ли лимиты?', a: 'Никаких лимитов. Качайте сколько угодно.' },
        { q: 'Нужно ли качать приложение?', a: 'Нет, всё работает онлайн без установки программ.' },
        { q: 'Можно качать трендовую музыку?', a: 'Да, сохраняйте любые звуки и песни из ТикТока.' },
        { q: 'Почему нет звука?', a: 'Проверьте оригинал видео. Возможно, звук удален правообладателем.' }
    ],
    // Portuguese
    pt: [
        { q: 'Como converter vídeo do TikTok em MP3?', a: 'Copie o link, cole acima e clique em Baixar. O áudio será extraído em alta qualidade.' },
        { q: 'É gratuito?', a: 'Sim, 100% grátis, sem cadastro ou taxas ocultas.' },
        { q: 'Funciona no iPhone e Android?', a: 'Sim, compatível com todos os dispositivos móveis e PC.' },
        { q: 'Posso usar como toque de celular?', a: 'Sim! Baixe o MP3 e defina como toque nas configurações.' },
        { q: 'Qual a qualidade do áudio?', a: 'Oferecemos a melhor qualidade original, até 320kbps.' },
        { q: 'Onde ficam os arquivos?', a: 'Verifique a pasta "Downloads" ou Galeria do seu celular.' },
        { q: 'Existe limite de download?', a: 'Não, downloads ilimitados para todos os usuários.' },
        { q: 'Preciso instalar app?', a: 'Não, utilize direto pelo navegador sem instalar nada.' },
        { q: 'Posso baixar músicas virais?', a: 'Sim, baixe qualquer som ou música tendência do TikTok.' },
        { q: 'Por que está sem som?', a: 'Verifique se o vídeo original possui áudio ativo.' }
    ]
};

// Fallback for others (English)
const DEFAULT_FAQS = FAQS.en;

function generateHTML(lang, langData) {
    const faqs = FAQS[lang] || DEFAULT_FAQS;
    const isRTL = langData.dir === 'rtl';

    // Generate Hreflang Tags
    const hreflangTags = Object.keys(LANGUAGES).map(code =>
        `<link rel="alternate" hreflang="${code}" href="https://savetik-fast.xyz/mp3/${code}/" />`
    ).join('\n    ');

    // Add x-default (English)
    const xDefault = `<link rel="alternate" hreflang="x-default" href="https://savetik-fast.xyz/mp3/en/" />`;
    const fullHreflangs = `${xDefault}\n    ${hreflangTags}`;

    const faqsHTML = faqs.map((faq, i) => `
                <details class="faq-item-new">
                    <summary>${faq.q}</summary>
                    <div class="faq-answer-new">
                        <p>${faq.a}</p>
                    </div>
                </details>`).join('');

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${langData.dir}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    
    <title>${langData.title} - SaveTikFast 2026 | ${langData.name}</title>
    <meta name="description" content="${langData.desc}">
    <meta name="keywords" content="tiktok to mp3, tiktok mp3 download, ${lang}, convert tiktok to mp3, tiktok audio download 2026">
    
    <!-- Hreflang Tags for SEO -->
    ${fullHreflangs}

    <link rel="canonical" href="https://savetik-fast.xyz/mp3/${lang}/">
    <link rel="icon" type="image/png" href="/favicon.png">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/style.css">
    
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "${langData.title} - SaveTikFast",
        "url": "https://savetik-fast.xyz/mp3/${lang}/",
        "description": "${langData.desc}",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "All",
        "inLanguage": "${lang}",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    }
    </script>

    <!-- Correct i18next Libraries Loader -->
    <script src="https://unpkg.com/i18next@21.6.10/dist/umd/i18next.min.js"></script>
    <script src="https://unpkg.com/i18next-http-backend@1.4.0/i18nextHttpBackend.min.js"></script>
    <script src="https://unpkg.com/i18next-browser-languagedetector@6.1.3/i18nextBrowserLanguageDetector.min.js"></script>
</head>
<body${isRTL ? ' class="rtl"' : ''}>
    <header id="main-header"></header>
    
    <nav class="nav-menu" aria-label="Download Types">
        <a href="/${lang}/" title="Video" data-i18n="nav_menu.video"><i class="fas fa-video"></i> Video</a>
        <a href="/mp3/${lang}/" class="active" title="MP3" data-i18n="nav_menu.mp3"><i class="fas fa-music"></i> MP3</a>
        <a href="/story/${lang}/" title="Stories" data-i18n="nav_menu.stories"><i class="fas fa-images"></i> Stories</a>
    </nav>

    <main id="main-content">
        <article class="hero-section">
            <h1>
                <i class="fas fa-music" style="color: var(--secondary);"></i>
                ${langData.title}
            </h1>
            <p>${langData.desc}</p>

            <div class="downloader-box">
                <div class="input-wrapper">
                    <input type="url" id="url-input" placeholder="Paste TikTok video link..." autocomplete="off">
                    <button id="paste-btn" type="button" title="Paste"><i class="fas fa-paste"></i></button>
                </div>
                <button id="download-btn"><i class="fas fa-music"></i> Download MP3</button>
            </div>

            <div id="result-area" role="region" aria-live="polite"></div>
        </article>

        <section class="container faq-section">
            <h2 class="section-title"><i class="fas fa-question-circle"></i> FAQ</h2>
            <div class="faq-container">
${faqsHTML}
            </div>
        </section>
    </main>

    <footer id="main-footer"></footer>
    
    <script src="/js/i18n-setup.js"></script>
    <script src="/logic.js"></script>
    
    <!-- Social Bar Ad -->
    <script src="https://pl28502619.effectivegatecpm.com/40/30/09/403009a90d32a66dcba80b1e5510e001.js"></script>
</body>
</html>`;
}

// Generate all pages
const mp3Dir = path.join(__dirname, 'mp3');
if (!fs.existsSync(mp3Dir)) fs.mkdirSync(mp3Dir);

Object.entries(LANGUAGES).forEach(([lang, data]) => {
    const langDir = path.join(mp3Dir, lang);
    if (!fs.existsSync(langDir)) fs.mkdirSync(langDir);

    const html = generateHTML(lang, data);
    fs.writeFileSync(path.join(langDir, 'index.html'), html, 'utf8');
    console.log(`✅ Generated: /mp3/${lang}/index.html`);
});

console.log('\n🎉 All MP3 pages generated successfully!');
