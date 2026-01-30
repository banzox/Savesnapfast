
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.resolve(__dirname, '../src/locales/locales');

// Core translations for Slideshow Page (excluding FAQs)
const SLIDESHOW_DATA = {
    // Spanish
    "es": {
        meta_title: "Descargar Slideshow TikTok - Guardar Fotos",
        meta_desc: "Descarga carruseles de fotos de TikTok en HD. Sin marca de agua.",
        title: "Descargador de Slideshow TikTok",
        desc: "Guarda todos los carruseles de fotos en alta calidad.",
        placeholder: "Pega el enlace del slideshow...",
        btn_download: "Descargar Imágenes",
        about_title: "Descargador de Fotos TikTok",
        about_content: "Guarda presentaciones de fotos de TikTok en calidad original HD sin marcas de agua.",
        how_to: {
            title: "Cómo Descargar Slideshow",
            step1: "Copia el enlace del TikTok.",
            step2: "Pégalo en la caja de arriba.",
            step3: "Haz clic en Descargar."
        }
    },
    // French
    "fr": {
        meta_title: "Télécharger Diaporama TikTok - Sauvegarder Photos",
        meta_desc: "Téléchargez des diaporamas photos TikTok en HD sans filigrane.",
        title: "Téléchargeur Diaporama TikTok",
        desc: "Sauvegardez les carrousels photos en haute qualité.",
        placeholder: "Collez le lien ici...",
        btn_download: "Télécharger Images",
        about_title: "Téléchargeur de Photos TikTok",
        about_content: "Sauvegardez les diaporamas TikTok en qualité HD originale sans logo.",
        how_to: {
            title: "Comment Télécharger",
            step1: "Copiez le lien TikTok.",
            step2: "Collez le lien ci-dessus.",
            step3: "Cliquez sur Télécharger."
        }
    },
    // German
    "de": {
        meta_title: "TikTok Slideshow Downloader - Fotos Speichern",
        meta_desc: "Laden Sie TikTok-Foto-Slideshows in HD ohne Wasserzeichen herunter.",
        title: "TikTok Slideshow Downloader",
        desc: "Speichern Sie Foto-Karussells in hoher Qualität.",
        placeholder: "Link hier einfügen...",
        btn_download: "Bilder Herunterladen",
        about_title: "TikTok Foto Downloader",
        about_content: "Speichern Sie TikTok-Foto-Slideshows in Original-HD-Qualität ohne Wasserzeichen.",
        how_to: {
            title: "Wie man herunterlädt",
            step1: "Kopieren Sie den TikTok-Link.",
            step2: "Fügen Sie ihn oben ein.",
            step3: "Klicken Sie auf Herunterladen."
        }
    },
    // Italian
    "it": {
        meta_title: "Scarica Slideshow TikTok - Salva Foto",
        meta_desc: "Scarica slideshow di foto TikTok in HD senza filigrana.",
        title: "Downloader Slideshow TikTok",
        desc: "Scarica caroselli di foto in alta qualità.",
        placeholder: "Incolla il link qui...",
        btn_download: "Scarica Immagini",
        about_title: "Downloader Foto TikTok",
        about_content: "Salva gli slideshow di foto TikTok in qualità HD originale senza loghi.",
        how_to: {
            title: "Come Scaricare",
            step1: "Copia il link TikTok.",
            step2: "Incolla il link sopra.",
            step3: "Clicca su Scarica."
        }
    },
    // Portuguese
    "pt": {
        meta_title: "Baixar Slideshow TikTok - Salvar Fotos",
        meta_desc: "Baixe carrosséis de fotos do TikTok em HD sem marca d'água.",
        title: "Baixar Slideshow TikTok",
        desc: "Salve carrosséis de fotos em alta qualidade.",
        placeholder: "Cole o link aqui...",
        btn_download: "Baixar Imagens",
        about_title: "Baixador de Fotos TikTok",
        about_content: "Salve slideshows de fotos do TikTok em qualidade HD original sem marca d'água.",
        how_to: {
            title: "Como Baixar",
            step1: "Copie o link do TikTok.",
            step2: "Cole o link acima.",
            step3: "Clique em Baixar."
        }
    },
    // Turkish
    "tr": {
        meta_title: "TikTok Slayt İndirici - Fotoğrafları Kaydet",
        meta_desc: "TikTok fotoğraf slaytlarını HD kalitesinde filigransız indirin.",
        title: "TikTok Slayt İndirici",
        desc: "Fotoğraf karusellerini yüksek kalitede kaydedin.",
        placeholder: "Linki buraya yapıştır...",
        btn_download: "Resimleri İndir",
        about_title: "TikTok Fotoğraf İndirici",
        about_content: "TikTok fotoğraf slaytlarını orijinal HD kalitesinde ve filigransız kaydedin.",
        how_to: {
            title: "Nasıl İndirilir",
            step1: "TikTok bağlantısını kopyala.",
            step2: "Linki yukarıya yapıştır.",
            step3: "İndir'e tıkla."
        }
    },
    // Russian
    "ru": {
        meta_title: "Скачать слайдшоу TikTok - Сохранить фото",
        meta_desc: "Скачивайте фото-слайдшоу TikTok в HD без водяных знаков.",
        title: "Скачать Слайдшоу TikTok",
        desc: "Сохраняйте фото-карусели в высоком качестве.",
        placeholder: "Вставьте ссылку...",
        btn_download: "Скачать изображения",
        about_title: "Загрузчик фото TikTok",
        about_content: "Сохраняйте слайдшоу TikTok в оригинальном HD качестве без водяных знаков.",
        how_to: {
            title: "Как скачать",
            step1: "Скопируйте ссылку TikTok.",
            step2: "Вставьте ссылку выше.",
            step3: "Нажмите Скачать."
        }
    },
    // Indonesian
    "id": {
        meta_title: "Download Slideshow TikTok - Simpan Foto",
        meta_desc: "Unduh slideshow foto TikTok dalam HD tanpa watermark.",
        title: "Pengunduh Slideshow TikTok",
        desc: "Simpan karusel foto dengan kualitas tinggi.",
        placeholder: "Tempel tautan di sini...",
        btn_download: "Unduh Gambar",
        about_title: "Pengunduh Foto TikTok",
        about_content: "Simpan slideshow foto TikTok dalam kualitas HD asli tanpa watermark.",
        how_to: {
            title: "Cara Mengunduh",
            step1: "Salin tautan TikTok.",
            step2: "Tempel tautan di atas.",
            step3: "Klik Unduh."
        }
    },
    // Vietnamese
    "vi": {
        meta_title: "Tải Slideshow TikTok - Lưu Ảnh",
        meta_desc: "Tải xuống trình chiếu ảnh TikTok chất lượng HD không logo.",
        title: "Tải Slideshow TikTok",
        desc: "Lưu băng chuyền ảnh chất lượng cao.",
        placeholder: "Dán liên kết vào đây...",
        btn_download: "Tải Xuống Ảnh",
        about_title: "Trình Tải Ảnh TikTok",
        about_content: "Lưu trình chiếu ảnh TikTok với chất lượng HD gốc không có hình mờ.",
        how_to: {
            title: "Cách Tải Xuống",
            step1: "Sao chép liên kết TikTok.",
            step2: "Dán liên kết ở trên.",
            step3: "Nhấp vào Tải xuống."
        }
    },
    // Thai
    "th": {
        meta_title: "ดาวน์โหลดสไลด์โชว์ TikTok - บันทึกรูปภาพ",
        meta_desc: "ดาวน์โหลดสไลด์โชว์รูปภาพ TikTok ในรูปแบบ HD โดยไม่มีลายน้ำ",
        title: "ดาวน์โหลดสไลด์โชว์ TikTok",
        desc: "บันทึกภาพสไลด์คุณภาพสูง",
        placeholder: "วางลิงก์ที่นี่...",
        btn_download: "ดาวน์โหลดรูปภาพ",
        about_title: "เครื่องมือดาวน์โหลดรูปภาพ TikTok",
        about_content: "บันทึกสไลด์โชว์รูปภาพ TikTok ในคุณภาพ HD ดั้งเดิมโดยไม่มีลายน้ำ",
        how_to: {
            title: "วิธีดาวน์โหลด",
            step1: "คัดลอกลิงก์ TikTok",
            step2: "วางลิงก์ด้านบน",
            step3: "คลิกดาวน์โหลด"
        }
    },
    // Japanese
    "ja": {
        meta_title: "TikTokスライドショーダウンローダー - 写真を保存",
        meta_desc: "TikTokの写真スライドショーを透かしなしのHDでダウンロード。",
        title: "TikTokスライドショーダウンローダー",
        desc: "高品質で写真カルーセルを保存。",
        placeholder: "リンクをここに貼り付け...",
        btn_download: "画像をダウンロード",
        about_title: "TikTok写真ダウンローダー",
        about_content: "TikTokの写真スライドショーを透かしなしのオリジナルのHD品質で保存します。",
        how_to: {
            title: "ダウンロード方法",
            step1: "TikTokのリンクをコピー。",
            step2: "上にリンクを貼り付け。",
            step3: "ダウンロードをクリック。"
        }
    },
    // Korean
    "ko": {
        meta_title: "TikTok 슬라이드쇼 다운로더 - 사진 저장",
        meta_desc: "워터마크 없는 HD로 TikTok 사진 슬라이드쇼를 다운로드하세요.",
        title: "TikTok 슬라이드쇼 다운로더",
        desc: "고화질로 사진 캐러셀 저장.",
        placeholder: "여기에 링크 붙여넣기...",
        btn_download: "이미지 다운로드",
        about_title: "TikTok 사진 다운로더",
        about_content: "워터마크 없이 원본 HD 품질로 TikTok 사진 슬라이드쇼를 저장하세요.",
        how_to: {
            title: "다운로드 방법",
            step1: "TikTok 링크 복사.",
            step2: "위에 링크 붙여넣기.",
            step3: "다운로드 클릭."
        }
    },
    // Arabic
    "ar": {
        meta_title: "تحميل صور تيك توك - سلايد شو بدون حقوق",
        meta_desc: "قم بتتحميل عرض صور تيك توك (سلايد شو) بجودة عالية وبدون علامة مائية.",
        title: "تحميل صور تيك توك (سلايد شو)",
        desc: "حفظ ألبومات الصور من تيك توك بجودة عالية.",
        placeholder: "ضع رابط الفيديو هنا...",
        btn_download: "تحميل الصور",
        about_title: "محمل صور تيك توك",
        about_content: "احفظ عروض صور تيك توك بجودة HD الأصلية بدون أي علامات مائية.",
        how_to: {
            title: "كيفية التحميل",
            step1: "انسخ رابط تيك توك.",
            step2: "الصق الرابط في الأعلى.",
            step3: "اضغط على تحميل."
        }
    },
    // Polish
    "pl": {
        meta_title: "Pobieranie pokazu slajdów TikTok - Zapisz zdjęcia",
        meta_desc: "Pobieraj pokazy slajdów TikTok w jakości HD bez znaku wodnego.",
        title: "Pobieranie Slajdów TikTok",
        desc: "Zapisz karuzele zdjęć w wysokiej jakości.",
        placeholder: "Wklej link tutaj...",
        btn_download: "Pobierz Obrazy",
        about_title: "Pobieranie Zdjęć TikTok",
        about_content: "Zapisuj pokazy slajdów TikTok w oryginalnej jakości HD bez znaków wodnych.",
        how_to: {
            title: "Jak Pobrać",
            step1: "Skopiuj link TikTok.",
            step2: "Wklej link powyżej.",
            step3: "Kliknij Pobierz."
        }
    },
    // Dutch
    "nl": {
        meta_title: "TikTok Slideshow Downloader - Foto's Opslaan",
        meta_desc: "Download TikTok foto slideshows in HD zonder watermerk.",
        title: "TikTok Slideshow Downloader",
        desc: "Sla fotocarrousels op in hoge kwaliteit.",
        placeholder: "Plak link hier...",
        btn_download: "Afbeeldingen Downloaden",
        about_title: "TikTok Foto Downloader",
        about_content: "Sla TikTok foto slideshows op in originele HD kwaliteit zonder watermerk.",
        how_to: {
            title: "Hoe te downloaden",
            step1: "Kopieer de TikTok-link.",
            step2: "Plak de link hierboven.",
            step3: "Klik op Downloaden."
        }
    },
    // Romanian
    "ro": {
        meta_title: "Descărcare Slideshow TikTok - Salvează Poze",
        meta_desc: "Descarcă slideshow-uri TikTok în HD fără filigran.",
        title: "Descărcare Slideshow TikTok",
        desc: "Salvează carusele de poze la calitate înaltă.",
        placeholder: "Lipește linkul aici...",
        btn_download: "Descarcă Imagini",
        about_title: "Descărcător Poze TikTok",
        about_content: "Salvează slideshow-uri TikTok la calitate HD originală fără filigrane.",
        how_to: {
            title: "Cum să descarci",
            step1: "Copiază linkul TikTok.",
            step2: "Lipește linkul mai sus.",
            step3: "Apasă Descarcă."
        }
    },
    // Malay
    "ms": {
        meta_title: "Muat Turun Tayangan Slaid TikTok - Simpan Foto",
        meta_desc: "Muat turun tayangan slaid foto TikTok dalam HD tanpa tera air.",
        title: "Pemuat Turun Slaid TikTok",
        desc: "Simpan karusel foto dalam kualiti tinggi.",
        placeholder: "Tampal pautan di sini...",
        btn_download: "Muat Turun Imej",
        about_title: "Pemuat Turun Foto TikTok",
        about_content: "Simpan tayangan slaid foto TikTok dalam kualiti HD asal tanpa tanda air.",
        how_to: {
            title: "Cara Muat Turun",
            step1: "Salin pautan TikTok.",
            step2: "Tampal pautan di atas.",
            step3: "Klik Muat Turun."
        }
    },
    // Czech
    "cs": {
        meta_title: "Stahovač prezentací TikTok - Uložit fotky",
        meta_desc: "Stahujte prezentace fotek z TikToku v HD bez vodoznaku.",
        title: "Stahovač Prezentací TikTok",
        desc: "Uložte foto karusely ve vysoké kvalitě.",
        placeholder: "Vložte odkaz zde...",
        btn_download: "Stáhnout Obrázky",
        about_title: "Stahovač Fotek TikTok",
        about_content: "Ukládejte prezentace fotek z TikToku v originální HD kvalitě bez vodoznaků.",
        how_to: {
            title: "Jak stahovat",
            step1: "Zkopírujte odkaz TikTok.",
            step2: "Vložte odkaz výše.",
            step3: "Klikněte na Stáhnout."
        }
    },
    // Swedish
    "sv": {
        meta_title: "Ladda ner TikTok Slideshow - Spara Foton",
        meta_desc: "Ladda ner TikTok bildspel i HD utan vattenstämpel.",
        title: "TikTok Slideshow Nedladdare",
        desc: "Spara fotokaruseller i hög kvalitet.",
        placeholder: "Klistra in länk här...",
        btn_download: "Ladda ner Bilder",
        about_title: "TikTok Foto Nedladdare",
        about_content: "Spara TikTok bildspel i original HD-kvalitet utan vattenstämplar.",
        how_to: {
            title: "Hur man laddar ner",
            step1: "Kopiera TikTok-länken.",
            step2: "Klistra in länken ovan.",
            step3: "Klicka på Ladda ner."
        }
    },
    // Hungarian
    "hu": {
        meta_title: "TikTok Slideshow Letöltő - Fotók Mentése",
        meta_desc: "Töltsön le TikTok fotó diavetítéseket HD-ban vízjel nélkül.",
        title: "TikTok Slideshow Letöltő",
        desc: "Mentse el a fotó galériákat kiváló minőségben.",
        placeholder: "Illessze be a linket ide...",
        btn_download: "Képek Letöltése",
        about_title: "TikTok Fotó Letöltő",
        about_content: "Mentse el a TikTok fotó diavetítéseket eredeti HD minőségben vízjelek nélkül.",
        how_to: {
            title: "Hogyan tölthető le",
            step1: "Másolja a TikTok linket.",
            step2: "Illessze be a linket fent.",
            step3: "Kattintson a Letöltés gombra."
        }
    },
    // Greek
    "el": {
        meta_title: "Λήψη Slideshow TikTok - Αποθήκευση Φωτογραφιών",
        meta_desc: "Κατεβάστε παρουσιάσεις φωτογραφιών TikTok σε HD χωρίς υδατογράφημα.",
        title: "Λήψη Slideshow TikTok",
        desc: "Αποθηκεύστε καρουζέλ φωτογραφιών σε υψηλή ποιότητα.",
        placeholder: "Επικολλήστε τον σύνδεσμο εδώ...",
        btn_download: "Λήψη Εικόνων",
        about_title: "Πρόγραμμα λήψης φωτογραφιών TikTok",
        about_content: "Αποθηκεύστε παρουσιάσεις φωτογραφιών TikTok σε αρχική ποιότητα HD χωρίς υδατογραφήματα.",
        how_to: {
            title: "Πώς να κατεβάσετε",
            step1: "Αντιγράψτε τον σύνδεσμο TikTok.",
            step2: "Επικολλήστε τον σύνδεσμο παραπάνω.",
            step3: "Κάντε κλικ στη Λήψη."
        }
    },
    // Danish
    "da": {
        meta_title: "TikTok Slideshow Downloader - Gem Billeder",
        meta_desc: "Download TikTok billedserier i HD uden vandmærke.",
        title: "TikTok Slideshow Downloader",
        desc: "Gem fotokarruseller i høj kvalitet.",
        placeholder: "Indsæt link her...",
        btn_download: "Download Billeder",
        about_title: "TikTok Foto Downloader",
        about_content: "Gem TikTok billedserier i original HD-kvalitet uden vandmærker.",
        how_to: {
            title: "Sådan downloader du",
            step1: "Kopier TikTok-linket.",
            step2: "Indsæt linket ovenfor.",
            step3: "Klik på Download."
        }
    },
    // Finnish
    "fi": {
        meta_title: "TikTok Slideshow Lataaja - Tallenna Kuvia",
        meta_desc: "Lataa TikTok-kuvaesitykset HD-laadulla ilman vesileimaa.",
        title: "TikTok Slideshow Lataaja",
        desc: "Tallenna kuvakarusellit korkealaatuisina.",
        placeholder: "Liitä linkki tähän...",
        btn_download: "Lataa Kuvia",
        about_title: "TikTok Kuvalataaja",
        about_content: "Tallenna TikTok-kuvaesitykset alkuperäisellä HD-laadulla ilman vesileimoja.",
        how_to: {
            title: "Kuinka ladata",
            step1: "Kopioi TikTok-linkki.",
            step2: "Liitä linkki ylle.",
            step3: "Napsauta Lataa."
        }
    },
    // Norwegian
    "no": {
        meta_title: "TikTok Slideshow Nedlaster - Lagre Bilder",
        meta_desc: "Last ned TikTok bildeserier i HD uten vannmerke.",
        title: "TikTok Slideshow Nedlaster",
        desc: "Lagre bildekaruseller i høy kvalitet.",
        placeholder: "Lim inn lenke her...",
        btn_download: "Last Ned Bilder",
        about_title: "TikTok Foto Nedlaster",
        about_content: "Lagre TikTok bildeserier i original HD-kvalitet uten vannmerker.",
        how_to: {
            title: "Hvordan laste ned",
            step1: "Kopier TikTok-lenken.",
            step2: "Lim inn lenken ovenfor.",
            step3: "Klikk på Last ned."
        }
    },
    // Ukrainian
    "uk": {
        meta_title: "Завантажувач слайдшоу TikTok - Зберегти фото",
        meta_desc: "Завантажуйте фото-слайдшоу TikTok у HD без водяних знаків.",
        title: "Завантажувач Слайдшоу TikTok",
        desc: "Зберігайте фото-каруселі у високій якості.",
        placeholder: "Вставте посилання...",
        btn_download: "Завантажити зображення",
        about_title: "Завантажувач фото TikTok",
        about_content: "Зберігайте слайдшоу TikTok в оригінальній HD якості без водяних знаків.",
        how_to: {
            title: "Як завантажити",
            step1: "Скопіюйте посилання TikTok.",
            step2: "Вставте посилання вище.",
            step3: "Натисніть Завантажити."
        }
    },
    // Hindi
    "hi": {
        meta_title: "TikTok स्लाइडशो डाउनलोडर - फोटो सहेजें",
        meta_desc: "बिना वॉटरमार्क के HD में TikTok फोटो स्लाइडशो डाउनलोड करें।",
        title: "TikTok स्लाइडशो डाउनलोडर",
        desc: "उच्च गुणवत्ता में फोटो हिंडोला सहेजें।",
        placeholder: "लिंक यहाँ पेस्ट करें...",
        btn_download: "छवियाँ डाउनलोड करें",
        about_title: "TikTok फोटो डाउनलोडर",
        about_content: "बिना वॉटरमार्क के मूल HD गुणवत्ता में TikTok फोटो स्लाइडशो सहेजें।",
        how_to: {
            title: "कैसे डाउनलोड करें",
            step1: "TikTok लिंक कॉपी करें।",
            step2: "लिंक ऊपर पेस्ट करें।",
            step3: "डाउनलोड पर क्लिक करें।"
        }
    },
    // Bulgarian
    "bg": {
        meta_title: "Сваляне на Слайдшоу от TikTok - Запази снимки",
        meta_desc: "Свалете фото слайдшоу от TikTok в HD без воден знак.",
        title: "Сваляне на Слайдшоу TikTok",
        desc: "Запазете фото въртележки с високо качество.",
        placeholder: "Поставете линка тук...",
        btn_download: "Свали Снимки",
        about_title: "TikTok Свали Снимки",
        about_content: "Запазете фото слайдшоута от TikTok в оригинално HD качество без водни знаци.",
        how_to: {
            title: "Как да свалите",
            step1: "Копирайте линка от TikTok.",
            step2: "Поставете линка горе.",
            step3: "Натиснете Свали."
        }
    },
    // Tagalog (Filipino)
    "tl": {
        meta_title: "TikTok Slideshow Downloader - I-save ang mga Larawan",
        meta_desc: "I-download ang mga TikTok photo slideshow sa HD nang walang watermark.",
        title: "TikTok Slideshow Downloader",
        desc: "I-save ang mga photo carousel sa mataas na kalidad.",
        placeholder: "I-paste ang link dito...",
        btn_download: "I-download ang mga Larawan",
        about_title: "TikTok Photo Downloader",
        about_content: "I-save ang mga TikTok photo slideshow sa orihinal na HD na kalidad nang walang watermark.",
        how_to: {
            title: "Paano Mag-download",
            step1: "Kopyahin ang link ng TikTok.",
            step2: "I-paste ang link sa itaas.",
            step3: "I-click ang Download."
        }
    },
    // Hebrew - Standard modern Hebrew
    "he": {
        meta_title: "הורדת מצגת טיקטוק - שמור תמונות",
        meta_desc: "הורד מצגות תמונות מטיקטוק באיכות HD ללא סימן מים.",
        title: "הורדת מצגת טיקטוק",
        desc: "שמור קרוסלות תמונות באיכות גבוהה.",
        placeholder: "הדבק קישור כאן...",
        btn_download: "הורד תמונות",
        about_title: "הורדת תמונות מטיקטוק",
        about_content: "שמור מצגות תמונות מטיקטוק באיכות HD מקורית ללא סימני מים.",
        how_to: {
            title: "איך להוריד",
            step1: "העתק את הקישור מטיקטוק.",
            step2: "הדבק את הקישור למעלה.",
            step3: "לחץ על הורדה."
        }
    }
};

function setDeep(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
}

function run() {
    console.log("Applying Core Slideshow Fixes...");
    let updatedCount = 0;

    for (const [lang, data] of Object.entries(SLIDESHOW_DATA)) {
        const filePath = path.join(LOCALES_DIR, `${lang}.json`);
        if (fs.existsSync(filePath)) {
            try {
                const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

                // Copy top-level string keys
                for (const key of ['meta_title', 'meta_desc', 'title', 'desc', 'placeholder', 'btn_download', 'about_title', 'about_content']) {
                    if (data[key]) {
                        setDeep(content, `slideshow_page.${key}`, data[key]);
                    }
                }

                // Copy how_to object keys
                if (data.how_to) {
                    for (const key of ['title', 'step1', 'step2', 'step3']) {
                        if (data.how_to[key]) {
                            setDeep(content, `slideshow_page.how_to.${key}`, data.how_to[key]);
                        }
                    }
                }

                fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
                console.log(`✅ ${lang} slideshow core patched.`);
                updatedCount++;
            } catch (e) {
                console.error(`Error ${lang}: ${e.message}`);
            }
        }
    }
    console.log(`Finished patching ${updatedCount} files.`);
}

run();
