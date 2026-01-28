import json
import os
import copy

# Supported languages (excluding en, ar which are done)
LANGUAGES = [
    'cs', 'da', 'de', 'el', 'es', 'fi', 'fr', 'he', 'hi', 'hu', 
    'id', 'it', 'ja', 'ko', 'ms', 'nl', 'no', 'pl', 'pt', 'ro', 
    'ru', 'sk', 'sv', 'th', 'tr', 'uk', 'vi', 'zh'
]

# Comprehensive translations for key UI elements
TRANSLATIONS = {
    'cs': {
        "backToDownloader": "Zpět na stahovač",
        "intro": "Online nástroje zdarma",
        "tabs": { "compressor": "Komprese", "converter": "Konvertor", "qrcode": "QR Generátor" },
        "hero": { "title": "Online nástroje pro obrázky a QR", "desc": "Komprimujte, převádějte a generujte QR kódy lokálně." },
        "dropzone": { "text": "Přetáhněte obrázek sem", "hint": "nebo klikněte pro výběr" },
        "btn": { "download": "Stáhnout" }
    },
    'da': {
        "backToDownloader": "Tilbage til downloader",
        "tabs": { "compressor": "Kompressor", "converter": "Konverter", "qrcode": "QR-generator" },
        "hero": { "title": "Gratis Billede & QR Værktøjer", "desc": "Komprimer, konverter og generer QR-koder lokalt." },
        "dropzone": { "text": "Træk og slip billede her", "hint": "eller klik for at vælge" },
        "btn": { "download": "Hent" }
    },
    'de': {
        "backToDownloader": "Zurück zum Downloader",
        "meta": { "title": "Kostenlose Bild- & QR-Tools", "description": "Bilder komprimieren, Formate konvertieren und QR-Codes erstellen." },
        "hero": { "title": "Kostenlose Bild- & QR-Tools", "desc": "Komprimieren, konvertieren und QR-Codes erstellen - alles im Browser." },
        "tabs": { "compressor": "Kompressor", "converter": "Konverter", "qrcode": "QR-Generator" },
        "dropzone": { "text": "Bild hierher ziehen", "hint": "oder klicken zum Auswählen" },
        "btn": { "download": "Herunterladen" }
    },
    'el': {
        "backToDownloader": "Πίσω στη λήψη",
        "tabs": { "compressor": "Συμπίεση", "converter": "Μετατροπή", "qrcode": "QR Κώδικας" },
        "hero": { "title": "Εργαλεία Εικόνας & QR", "desc": "Συμπίεση, μετατροπή και δημιουργία QR κωδικών." },
        "btn": { "download": "Λήψη" }
    },
    'es': {
        "backToDownloader": "Volver al descargador",
        "meta": { "title": "Herramientas de Imagen y QR", "description": "Comprimir imágenes, convertir formatos y generar códigos QR gratis." },
        "hero": { "title": "Herramientas de Imagen y QR", "desc": "Procesamiento local 100% privado en tu navegador." },
        "tabs": { "compressor": "Compresor", "converter": "Convertidor", "qrcode": "Generador QR" },
        "dropzone": { "text": "Arrastra tu imagen aquí", "hint": "o clic para seleccionar" },
        "btn": { "download": "Descargar" }
    },
    'fi': {
        "backToDownloader": "Takaisin lataajaan",
        "tabs": { "compressor": "Pakkaaja", "converter": "Muunnin", "qrcode": "QR-generaattori" },
        "hero": { "title": "Kuva- ja QR-työkalut", "desc": "Pakkaa, muunna ja luo QR-koodeja selaimessa." },
        "btn": { "download": "Lataa" }
    },
    'fr': {
        "backToDownloader": "Retour au téléchargeur",
        "meta": { "title": "Outils Image & QR Gratuits", "description": "Outils en ligne gratuits : Compresser, convertir et générer QR." },
        "hero": { "title": "Outils Image & QR Gratuits", "desc": "Compressez, convertissez et générez des QR codes localement." },
        "tabs": { "compressor": "Compresseur", "converter": "Convertisseur", "qrcode": "Générateur QR" },
        "dropzone": { "text": "Glissez-déposez ici", "hint": "ou cliquez pour sélectionner" },
        "btn": { "download": "Télécharger" }
    },
    'he': {
        "backToDownloader": "חזור להורדה",
        "meta": { "title": "כלים לתמונות ו-QR", "description": "דחיסת תמונות, המרת פורמטים ויצירת קוד QR אונליין." },
        "hero": { "title": "כלים לתמונות ו-QR", "desc": "דחיסה, המרה ויצירת קוד QR - הכל בדפדפן שלך." },
        "tabs": { "compressor": "דחיסת תמונות", "converter": "ממיר פורמטים", "qrcode": "יוצר QR" },
        "dropzone": { "text": "גרור תמונה לכאן", "hint": "או לחץ לבחירה" },
        "btn": { "download": "הורד" }
    },
    'hi': {
        "backToDownloader": "डाउनलोडर पर वापस जाएं",
        "tabs": { "compressor": "इमेज कंप्रेसर", "converter": "कनवर्टर", "qrcode": "QR जेनरेटर" },
        "hero": { "title": "मुफ्त इमेज और QR टूल्स", "desc": "इमेज कंप्रेस करें, फॉर्मेट बदलें और QR कोड बनाएं।" },
        "btn": { "download": "डाउनलोड" }
    },
    'hu': {
        "backToDownloader": "Vissza a letöltőhöz",
        "tabs": { "compressor": "Tömörítő", "converter": "Átalakító", "qrcode": "QR Generáló" },
        "hero": { "title": "Kép és QR Eszközök", "desc": "Tömörítés, átalakítás és QR kód készítés helyben." },
        "btn": { "download": "Letöltés" }
    },
    'id': {
        "backToDownloader": "Kembali ke Pengunduh",
        "meta": { "title": "Alat Gambar & QR Gratis", "description": "Kompres gambar, ubah format, dan buat kode QR secara gratis." },
        "hero": { "title": "Alat Gambar & QR Gratis", "desc": "Semua diproses di browser Anda. Aman dan cepat." },
        "tabs": { "compressor": "Kompresor", "converter": "Konverter", "qrcode": "QR Generator" },
        "dropzone": { "text": "Seret & lepas gambar di sini", "hint": "atau klik untuk memilih" },
        "btn": { "download": "Unduh" }
    },
    'it': {
        "backToDownloader": "Torna al downloader",
        "meta": { "title": "Strumenti Immagini e QR", "description": "Comprimi immagini, converti formati e genera codici QR." },
        "hero": { "title": "Strumenti Immagini e QR", "desc": "Tutto elaborato localmente nel tuo browser." },
        "tabs": { "compressor": "Compressore", "converter": "Convertitore", "qrcode": "Generatore QR" },
        "dropzone": { "text": "Trascina l'immagine qui", "hint": "o clicca per selezionare" },
        "btn": { "download": "Scarica" }
    },
    'ja': {
        "backToDownloader": "ダウンローダーに戻る",
        "meta": { "title": "無料の画像＆QRツール", "description": "画像の圧縮、形式変換、QRコード作成がブラウザで完結。" },
        "hero": { "title": "無料の画像＆QRツール", "desc": "圧縮、変換、QR作成 - すべてブラウザ内で処理されます。" },
        "tabs": { "compressor": "圧縮ツール", "converter": "変換ツール", "qrcode": "QR作成" },
        "dropzone": { "text": "ここに画像をドロップ", "hint": "またはクリックして選択" },
        "btn": { "download": "ダウンロード" }
    },
    'ko': {
        "backToDownloader": "다운로더로 돌아가기",
        "meta": { "title": "무료 이미지 및 QR 도구", "description": "이미지 압축, 형식 변환 및 QR 코드 생성을 위한 무료 도구." },
        "hero": { "title": "이미지 및 QR 도구", "desc": "브라우저에서 직접 압축, 변환 및 QR 코드를 생성하세요." },
        "tabs": { "compressor": "이미지 압축", "converter": "변환기", "qrcode": "QR 생성기" },
        "dropzone": { "text": "이미지를 여기로 드래그", "hint": "또는 클릭하여 선택" },
        "btn": { "download": "다운로드" }
    },
    'ms': {
        "backToDownloader": "Kembali ke Pemuat Turun",
        "tabs": { "compressor": "Pemampat", "converter": "Penukar", "qrcode": "Penjana QR" },
        "hero": { "title": "Alat Imej & QR", "desc": "Mampatkan, tukar format dan jana kod QR." },
        "btn": { "download": "Muat Turun" }
    },
    'nl': {
        "backToDownloader": "Terug naar downloader",
        "meta": { "title": "Gratis Afbeelding & QR Tools", "description": "Afbeeldingen comprimeren, converteren en QR-codes genereren." },
        "hero": { "title": "Afbeelding & QR Tools", "desc": "Lokaal verwerkt in je browser. Snel en privé." },
        "tabs": { "compressor": "Compressor", "converter": "Converter", "qrcode": "QR Generator" },
        "dropzone": { "text": "Sleep afbeelding hierheen", "hint": "of klik om te selecteren" },
        "btn": { "download": "Downloaden" }
    },
    'no': {
        "backToDownloader": "Tilbake til laster",
        "tabs": { "compressor": "Kompressor", "converter": "Konverter", "qrcode": "QR-generator" },
        "hero": { "title": "Bilde og QR Verktøy", "desc": "Komprimer, konverter og lag QR-koder." },
        "btn": { "download": "Last ned" }
    },
    'pl': {
        "backToDownloader": "Wróć do pobierania",
        "meta": { "title": "Narzędzia Obrazu i QR", "description": "Kompresuj obrazy, konwertuj formaty i generuj kody QR." },
        "hero": { "title": "Narzędzia Obrazu i QR", "desc": "Wszystko przetwarzane lokalnie w przeglądarce." },
        "tabs": { "compressor": "Kompresor", "converter": "Konwerter", "qrcode": "Generator QR" },
        "dropzone": { "text": "Przeciągnij zdjęcie tutaj", "hint": "lub kliknij, aby wybrać" },
        "btn": { "download": "Pobierz" }
    },
    'pt': {
        "backToDownloader": "Voltar ao Baixador",
        "meta": { "title": "Ferramentas de Imagem e QR", "description": "Comprimir, converter e gerar QR codes grátis." },
        "hero": { "title": "Ferramentas de Imagem e QR", "desc": "Processamento local no seu navegador." },
        "tabs": { "compressor": "Compressor", "converter": "Conversor", "qrcode": "Gerador QR" },
        "dropzone": { "text": "Arraste sua imagem aqui", "hint": "ou clique para selecionar" },
        "btn": { "download": "Baixar" }
    },
    'ro': {
        "backToDownloader": "Înapoi la descărcare",
        "tabs": { "compressor": "Compresor", "converter": "Convertor", "qrcode": "Generator QR" },
        "hero": { "title": "Instrumente Imagine & QR", "desc": "Comprimă, convertește și generează coduri QR." },
        "btn": { "download": "Descarcă" }
    },
    'ru': {
        "backToDownloader": "Назад к загрузчику",
        "meta": { "title": "Инструменты для изображений и QR", "description": "Сжатие изображений, конвертация форматов и генерация QR-кодов." },
        "hero": { "title": "Инструменты для фото и QR", "desc": "Обработка в браузере. Быстро и приватно." },
        "tabs": { "compressor": "Сжатие", "converter": "Конвертер", "qrcode": "QR-код" },
        "dropzone": { "text": "Перетащите изображение сюда", "hint": "или нажмите для выбора" },
        "btn": { "download": "Скачать" }
    },
    'sk': {
        "backToDownloader": "Späť na sťahovanie",
        "tabs": { "compressor": "Kompresor", "converter": "Konvertor", "qrcode": "QR Generátor" },
        "hero": { "title": "Nástroje pre obrázky a QR", "desc": "Komprimujte, prevádzajte a generujte QR kódy." },
        "btn": { "download": "Stiahnuť" }
    },
    'sv': {
        "backToDownloader": "Tillbaka till nedladdare",
        "tabs": { "compressor": "Kompressor", "converter": "Konverterare", "qrcode": "QR-generator" },
        "hero": { "title": "Bild- och QR-verktyg", "desc": "Komprimera, konvertera och skapa QR-koder." },
        "btn": { "download": "Ladda ner" }
    },
    'th': {
        "backToDownloader": "กลับไปที่เครื่องมือดาวน์โหลด",
        "tabs": { "compressor": "บีบอัดภาพ", "converter": "แปลงไฟล์", "qrcode": "สร้าง QR" },
        "hero": { "title": "เครื่องมือรูปภาพและ QR ฟรี", "desc": "บีบอัด แปลงไฟล์ และสร้าง QR code ในเบราว์เซอร์" },
        "btn": { "download": "ดาวน์โหลด" }
    },
    'tr': {
        "backToDownloader": "TikTok İndiriciye Dön",
        "meta": { "title": "Ücretsiz Resim ve QR Araçları - SaveTikFast", "description": "Ücretsiz çevrimiçi araçlar: Resim sıkıştırın, format dönüştürün ve QR kodları oluşturun." },
        "hero": { "title": "Ücretsiz Resim ve QR Araçları", "desc": "Resimleri sıkıştırın, format dönüştürün ve QR kodları oluşturun." },
        "tabs": { "compressor": "Resim Sıkıştırıcı", "converter": "Format Dönüştürücü", "qrcode": "QR Kod Oluşturucu" },
        "dropzone": { "text": "Resminizi buraya sürükleyin", "hint": "veya seçmek için tıklayın" },
        "btn": { "download": "İndir" }
    },
    'uk': {
        "backToDownloader": "Назад до завантажувача",
        "meta": { "title": "Інструменти для зображень та QR", "description": "Стискання, конвертація та створення QR-кодів." },
        "hero": { "title": "Інструменти для фото та QR", "desc": "Обробка в браузері. Швидко та приватно." },
        "tabs": { "compressor": "Стискання", "converter": "Конвертер", "qrcode": "QR-код" },
        "btn": { "download": "Завантажити" }
    },
    'vi': {
        "backToDownloader": "Quay lại trình tải xuống",
        "meta": { "title": "Công cụ Hình ảnh & QR Miễn phí", "description": "Nén ảnh, chuyển đổi định dạng và tạo mã QR." },
        "hero": { "title": "Công cụ Hình ảnh & QR", "desc": "Nén, chuyển đổi và tạo mã QR ngay trên trình duyệt." },
        "tabs": { "compressor": "Nén ảnh", "converter": "Chuyển đổi", "qrcode": "Tạo mã QR" },
        "dropzone": { "text": "Kéo thả ảnh vào đây", "hint": "hoặc nhấp để chọn" },
        "btn": { "download": "Tải xuống" }
    },
    'zh': {
        "backToDownloader": "返回下载器",
        "meta": { "title": "免费图片和QR工具", "description": "在线压缩图片，转换格式和生成二维码。" },
        "hero": { "title": "免费图片和QR工具", "desc": "在浏览器中本地处理。快速且隐私安全。" },
        "tabs": { "compressor": "压缩工具", "converter": "转换工具", "qrcode": "QR生成器" },
        "dropzone": { "text": "将图片拖放到此处", "hint": "或点击选择" },
        "btn": { "download": "下载" }
    }
}

def update_locales():
    with open('locales/en.json', 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    
    tools_template = en_data['tools']

    for code in LANGUAGES:
        filename = f'locales/{code}.json'
        # Proceed even if file doesn't exist (though it should)
        
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            print(f"Warning: {filename} not found, skipping.")
            continue
        
        # Deep copy template to start with full structure (English fallback)
        new_tools = copy.deepcopy(tools_template)
        
        # Merge specific translations if available
        if code in TRANSLATIONS:
            trans = TRANSLATIONS[code]
            
            def merge(target, source):
                for k, v in source.items():
                    if isinstance(v, dict) and k in target and isinstance(target[k], dict):
                        merge(target[k], v)
                    else:
                        target[k] = v
            
            merge(new_tools, trans)
        
        data['tools'] = new_tools
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"Updated {code}.json")

if __name__ == "__main__":
    update_locales()
