
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales/locales');

const translations = {
    "bg": {
        "slideshow_page": {
            "meta_title": "TikTok Slideshow Downloader - Изтегляне на снимки",
            "meta_desc": "Изтеглете TikTok слайдшоута и снимки. Запазете всички изображения без воден знак с високо качество.",
            "title": "TikTok Слайдшоу Изтегляне",
            "desc": "Най-добрият инструмент за изтегляне на снимки от TikTok. Запазете всяко изображение.",
            "placeholder": "Поставете линк към слайдшоу...",
            "btn_download": "Изтегли Снимки",
            "about_title": "Изтегляне на TikTok Снимки",
            "about_content": "Нашият инструмент ви позволява да запазвате TikTok слайдшоута с оригинално качество. Изтеглете всички снимки наведнъж.",
            "features": {
                "bulk": { "title": "Масово изтегляне", "desc": "Запазете всички снимки наведнъж." },
                "original": { "title": "Оригинално качество", "desc": "Без компресия." },
                "fast": { "title": "Супер бързо", "desc": "Незабавна обработка." },
                "format": { "title": "Умни формати", "desc": "JPG/PNG формати." },
                "device": { "title": "Всички устройства", "desc": "iOS, Android, PC." },
                "unlimited": { "title": "Неограничено", "desc": "Безплатни изтегляния." }
            },
            "how_to": {
                "title": "Как да изтеглите слайдшоу",
                "step1": "Копирайте линка от TikTok.",
                "step2": "Поставете го тук.",
                "step3": "Натиснете Изтегли."
            },
            "faq": {
                "q1": "Мога ли да изтегля всички снимки?", "a1": "Да, всички наведнъж.",
                "q2": "Високо качество ли са?", "a2": "Да, оригинално HD качество.",
                "q3": "Има ли воден знак?", "a3": "Не, без воден знак.",
                "q4": "Безплатно ли е?", "a4": "Напълно безплатно.",
                "q5": "Работи ли на телефон?", "a5": "Да, на всички телефони.",
                "q6": "Трябва ли приложение?", "a6": "Не, само браузър.",
                "q7": "От частни профили?", "a7": "Не, само публични.",
                "q8": "Какъв формат?", "a8": "JPG или PNG.",
                "q9": "Има ли лимит?", "a9": "Няма лимит.",
                "q10": "А музиката?", "a10": "Можете да изтеглите MP3 отделно."
            }
        }
    },
    "cs": {
        "slideshow_page": {
            "meta_title": "TikTok Slideshow Downloader - Stahování fotek",
            "meta_desc": "Stáhněte si TikTok prezentace a fotky. Uložte všechny obrázky bez vodoznaku v HD kvalitě.",
            "title": "Stahování TikTok Slideshow",
            "desc": "Nejlepší nástroj pro stahování fotek z TikToku. Uložte si každý obrázek.",
            "placeholder": "Vložte odkaz na slideshow...",
            "btn_download": "Stáhnout obrázky",
            "about_title": "Stahování TikTok fotek",
            "about_content": "Náš nástroj umožňuje ukládat TikTok prezentace v originální kvalitě. Stáhněte všechny fotky najednou.",
            "features": {
                "bulk": { "title": "Hromadné stahování", "desc": "Uložte všechny fotky najednou." },
                "original": { "title": "Originální kvalita", "desc": "Bez komprese." },
                "fast": { "title": "Super rychlé", "desc": "Okamžité zpracování." },
                "format": { "title": "Chytré formáty", "desc": "JPG/PNG." },
                "device": { "title": "Všechna zařízení", "desc": "iOS, Android, PC." },
                "unlimited": { "title": "Neomezeně", "desc": "Stahování zdarma." }
            },
            "how_to": {
                "title": "Jak stáhnout slideshow",
                "step1": "Zkopírujte odkaz z TikToku.",
                "step2": "Vložte jej sem.",
                "step3": "Klikněte na Stáhnout."
            },
            "faq": {
                "q1": "Mohu stáhnout všechny fotky?", "a1": "Ano, všechny najednou.",
                "q2": "Je to vysoká kvalita?", "a2": "Ano, originální HD.",
                "q3": "Je tam vodoznak?", "a3": "Ne, bez vodoznaku.",
                "q4": "Je to zdarma?", "a4": "Zcela zdarma.",
                "q5": "Funguje to na mobilu?", "a5": "Ano, na všech.",
                "q6": "Potřebuji aplikaci?", "a6": "Ne, jen prohlížeč.",
                "q7": "Z soukromých účtů?", "a7": "Ne, jen veřejné.",
                "q8": "Jaký formát?", "a8": "JPG nebo PNG.",
                "q9": "Existuje limit?", "a9": "Žádný limit.",
                "q10": "A co hudba?", "a10": "MP3 lze stáhnout zvlášť."
            }
        }
    },
    "da": {
        "slideshow_page": {
            "meta_title": "TikTok Slideshow Downloader - Gem billeder",
            "meta_desc": "Download TikTok diasshows og fotos. Gem alle billeder uden vandmærke i HD.",
            "title": "TikTok Slideshow Downloader",
            "desc": "Det bedste værktøj til at gemme TikTok fotos. Download alle billeder.",
            "placeholder": "Indsæt link...",
            "btn_download": "Download billeder",
            "about_title": "TikTok Foto Downloader",
            "about_content": "Gem TikTok diasshows i original kvalitet. Hent alle billeder på én gang.",
            "features": {
                "bulk": { "title": "Masse-download", "desc": "Gem alle fotos straks." },
                "original": { "title": "Original kvalitet", "desc": "Fuld opløsning." },
                "fast": { "title": "Lynhurtig", "desc": "Øjeblikkelig behandling." },
                "format": { "title": "Smarte formater", "desc": "JPG/PNG." },
                "device": { "title": "Alle enheder", "desc": "iOS, Android, PC." },
                "unlimited": { "title": "Ubegrænset", "desc": "Gratis downloads." }
            },
            "how_to": {
                "title": "Sådan downloader du",
                "step1": "Kopier TikTok link.",
                "step2": "Indsæt her.",
                "step3": "Klik Download."
            },
            "faq": {
                "q1": "Kan jeg hente alle billeder?", "a1": "Ja, alle på én gang.",
                "q2": "Er kvaliteten god?", "a2": "Ja, original HD.",
                "q3": "Er der vandmærke?", "a3": "Nej, intet vandmærke.",
                "q4": "Er det gratis?", "a4": "Ja, 100% gratis.",
                "q5": "Virker det på mobil?", "a5": "Ja, iOS og Android.",
                "q6": "Kræver det en app?", "a6": "Nej, kun browser.",
                "q7": "Fra private konti?", "a7": "Nej, kun offentlige.",
                "q8": "Hvilket format?", "a8": "JPG eller PNG.",
                "q9": "Er der en grænse?", "a9": "Ingen grænser.",
                "q10": "Hvad med musikken?", "a10": "MP3 kan hentes separat."
            }
        }
    },
    "el": {
        "slideshow_page": {
            "meta_title": "Λήψη TikTok Slideshow - Αποθήκευση Φωτογραφιών",
            "meta_desc": "Κατεβάστε φωτογραφίες και slideshows από το TikTok χωρίς υδατογράφημα.",
            "title": "Λήψη TikTok Slideshow",
            "desc": "Το καλύτερο εργαλείο για αποθήκευση φωτογραφιών TikTok. Κατεβάστε κάθε εικόνα.",
            "placeholder": "Επικολλήστε τον σύνδεσμο...",
            "btn_download": "Λήψη Εικόνων",
            "about_title": "Εργαλείο Λήψης Φωτογραφιών",
            "about_content": "Αποθηκεύστε τα TikTok slideshows στην αρχική τους ποιότητα. Όλες οι φωτογραφίες μαζί.",
            "features": {
                "bulk": { "title": "Μαζική Λήψη", "desc": "Όλες οι φώτο μαζί." },
                "original": { "title": "Αρχική Ποιότητα", "desc": "Χωρίς συμπίεση." },
                "fast": { "title": "Πολύ Γρήγορο", "desc": "Άμεση επεξεργασία." },
                "format": { "title": "Μορφές", "desc": "JPG/PNG." },
                "device": { "title": "Όλες οι συσκευές", "desc": "iOS, Android, PC." },
                "unlimited": { "title": "Απεριόριστα", "desc": "Δωρεάν λήψεις." }
            },
            "how_to": {
                "title": "Πώς να κατεβάσετε",
                "step1": "Αντιγράψτε τον σύνδεσμο.",
                "step2": "Επικολλήστε τον εδώ.",
                "step3": "Πατήστε Λήψη."
            },
            "faq": {
                "q1": "Μπορώ να τα κατεβάσω όλα;", "a1": "Ναι, όλα μαζί.",
                "q2": "Είναι καλή ποιότητα;", "a2": "Ναι, HD.",
                "q3": "Έχει λογότυπο;", "a3": "Όχι, χωρίς λογότυπο.",
                "q4": "Είναι δωρεάν;", "a4": "Ναι, εντελώς.",
                "q5": "Λειτουργεί σε κινητά;", "a5": "Ναι, παντού.",
                "q6": "Θέλει εφαρμογή;", "a6": "Όχι, μόνο browser.",
                "q7": "Από ιδιωτικά προφίλ;", "a7": "Όχι, μόνο δημόσια.",
                "q8": "Τι αρχείο;", "a8": "JPG ή PNG.",
                "q9": "Υπάρχει όριο;", "a9": "Κανένα όριο.",
                "q10": "Και η μουσική;", "a10": "Κατεβάστε το MP3 ξεχωριστά."
            }
        }
    },
    "fi": {
        "slideshow_page": {
            "meta_title": "TikTok Diaesitys Lataaja - Tallenna Kuvat",
            "meta_desc": "Lataa TikTok diaesitykset ja kuvat ilman vesileimaa HD-laadulla.",
            "title": "TikTok Diaesitys Lataaja",
            "desc": "Paras työkalu TikTok-kuvien tallentamiseen. Lataa jokainen kuva.",
            "placeholder": "Liitä linkki tähän...",
            "btn_download": "Lataa Kuvat",
            "about_title": "TikTok Kuvien Lataaja",
            "about_content": "Tallenna TikTok-diaesitykset alkuperäisellä laadulla. Kaikki kuvat kerralla.",
            "features": {
                "bulk": { "title": "Massalataus", "desc": "Kaikki kuvat kerralla." },
                "original": { "title": "Alkuperäinen laatu", "desc": "Täysi resoluutio." },
                "fast": { "title": "Salamannopea", "desc": "Välitön käsittely." },
                "format": { "title": "Formaatit", "desc": "JPG/PNG." },
                "device": { "title": "Kaikki laitteet", "desc": "iOS, Android, PC." },
                "unlimited": { "title": "Rajoittamaton", "desc": "Ilmainen käyttö." }
            },
            "how_to": {
                "title": "Kuinka ladata",
                "step1": "Kopioi linkki TikTokista.",
                "step2": "Liitä se ylle.",
                "step3": "Paina Lataa."
            },
            "faq": {
                "q1": "Voinko ladata kaikki kuvat?", "a1": "Kyllä, kaikki kerralla.",
                "q2": "Onko laatu hyvä?", "a2": "Kyllä, HD.",
                "q3": "Onko vesileimaa?", "a3": "Ei vesileimaa.",
                "q4": "Maksaako se?", "a4": "Ei, se on ilmainen.",
                "q5": "Toimiiko puhelimella?", "a5": "Kyllä, kaikilla.",
                "q6": "Tarvitsenko sovelluksen?", "a6": "Et, selain riittää.",
                "q7": "Yksityiset tilit?", "a7": "Vain julkiset.",
                "q8": "Mikä tiedostomuoto?", "a8": "JPG tai PNG.",
                "q9": "Onko rajaa?", "a9": "Ei latausrajaa.",
                "q10": "Entä musiikki?", "a10": "MP3 on erikseen."
            }
        }
    },
    "hi": {
        "slideshow_page": {
            "meta_title": "TikTok Slideshow Downloader - फोटो डाउनलोड करें",
            "meta_desc": "बिना वॉटरमार्क के TikTok स्लाइडशो और तस्वीरें डाउनलोड करें। HD क्वालिटी।",
            "title": "TikTok स्लाइडशो डाउनलोडर",
            "desc": "TikTok फोटो स्लाइडशो डाउनलोड करने का सबसे अच्छा टूल। उच्च गुणवत्ता।",
            "placeholder": "लिंक यहाँ पेस्ट करें...",
            "btn_download": "तस्वीरें डाउनलोड करें",
            "about_title": "TikTok फोटो सेवर",
            "about_content": "SaveTikFast के साथ TikTok फोटो स्लाइडशो को मूल गुणवत्ता में सहेजें। सभी तस्वीरें एक साथ।",
            "features": {
                "bulk": { "title": "एक साथ डाउनलोड", "desc": "सभी फोटो एक क्लिक में।" },
                "original": { "title": "असली क्वालिटी", "desc": "बिना किसी बदलाव के।" },
                "fast": { "title": "सुपर फास्ट", "desc": "तुरंत डाउनलोड।" },
                "format": { "title": "सही फॉर्मेट", "desc": "JPG/PNG।" },
                "device": { "title": "सभी डिवाइस", "desc": "iOS, Android, PC।" },
                "unlimited": { "title": "अनलिमिटेड", "desc": "मुफ्त डाउनलोड।" }
            },
            "how_to": {
                "title": "कैसे डाउनलोड करें",
                "step1": "TikTok लिंक कॉपी करें।",
                "step2": "यहाँ पेस्ट करें।",
                "step3": "डाउनलोड पर क्लिक करें।"
            },
            "faq": {
                "q1": "क्या मैं सभी फोटो डाउनलोड कर सकता हूँ?", "a1": "हाँ, सभी एक साथ।",
                "q2": "क्या क्वालिटी अच्छी है?", "a2": "हाँ, ओरिजिनल HD।",
                "q3": "क्या वॉटरमार्क होगा?", "a3": "नहीं, कोई वॉटरमार्क नहीं।",
                "q4": "क्या यह फ्री है?", "a4": "हाँ, 100% फ्री।",
                "q5": "क्या मोबाइल पर चलेगा?", "a5": "हाँ, सभी मोबाइल पर।",
                "q6": "ऐप चाहिए?", "a6": "नहीं, बस ब्राउज़र।",
                "q7": "प्राइवेट अकाउंट?", "a7": "नहीं, केवल पब्लिक।",
                "q8": "फॉर्मेट क्या है?", "a8": "JPG या PNG।",
                "q9": "कोई लिमिट?", "a9": "नहीं, अनलिमिटेड।",
                "q10": "म्यूजिक का क्या?", "a10": "MP3 अलग से डाउनलोड करें।"
            }
        }
    },
    "hu": {
        "slideshow_page": {
            "meta_title": "TikTok Slideshow Letöltő - Képek Mentése",
            "meta_desc": "Töltsön le TikTok diavetítéseket és fotókat vízjel nélkül HD minőségben.",
            "title": "TikTok Slideshow Letöltő",
            "desc": "A legjobb eszköz TikTok fotók mentésére. Töltsön le minden képet.",
            "placeholder": "Illessze be a linket...",
            "btn_download": "Képek Letöltése",
            "about_title": "TikTok Fotó Letöltő",
            "about_content": "Mentse el a TikTok diavetítéseket eredeti minőségben. Minden kép egyszerre.",
            "features": {
                "bulk": { "title": "Tömeges Letöltés", "desc": "Minden kép egyszerre." },
                "original": { "title": "Eredeti Minőség", "desc": "Teljes felbontás." },
                "fast": { "title": "Szupergyors", "desc": "Azonnali feldolgozás." },
                "format": { "title": "Okos Formátumok", "desc": "JPG/PNG." },
                "device": { "title": "Minden Eszköz", "desc": "iOS, Android, PC." },
                "unlimited": { "title": "Korlátlan", "desc": "Ingyenes letöltések." }
            },
            "how_to": {
                "title": "Hogyan töltsön le",
                "step1": "Másolja a TikTok linket.",
                "step2": "Illessze be ide.",
                "step3": "Kattintson a Letöltésre."
            },
            "faq": {
                "q1": "Letölthetem az összeset?", "a1": "Igen, mindet egyszerre.",
                "q2": "Jó a minőség?", "a2": "Igen, HD.",
                "q3": "Van vízjel?", "a3": "Nincs vízjel.",
                "q4": "Ingyenes?", "a4": "Igen, teljesen.",
                "q5": "Működik mobilon?", "a5": "Igen, mindenhol.",
                "q6": "Kell app?", "a6": "Nem, csak böngésző.",
                "q7": "Privát fiókok?", "a7": "Csak nyilvános.",
                "q8": "Milyen formátum?", "a8": "JPG vagy PNG.",
                "q9": "Van limit?", "a9": "Nincs limit.",
                "q10": "És a zene?", "a10": "MP3 külön letölthető."
            }
        }
    },
    "it": {
        "slideshow_page": {
            "meta_title": "Scaricare Slideshow TikTok - Salva Foto",
            "meta_desc": "Scarica slideshow e foto di TikTok senza filigrana in HD.",
            "title": "Downloader Slideshow TikTok",
            "desc": "Il miglior strumento per salvare le foto di TikTok. Scarica ogni immagine.",
            "placeholder": "Incolla il link qui...",
            "btn_download": "Scarica Immagini",
            "about_title": "Downloader Foto TikTok",
            "about_content": "Salva i caroselli di foto di TikTok in qualità originale. Tutte le foto in un clic.",
            "features": {
                "bulk": { "title": "Download di Massa", "desc": "Tutte le foto subito." },
                "original": { "title": "Qualità Originale", "desc": "Alta risoluzione." },
                "fast": { "title": "Velocissimo", "desc": "Processo istantaneo." },
                "format": { "title": "Formati Smart", "desc": "JPG/PNG." },
                "device": { "title": "Tutti i Dispositivi", "desc": "iOS, Android, PC." },
                "unlimited": { "title": "Illimitato", "desc": "Gratis per sempre." }
            },
            "how_to": {
                "title": "Come scaricare",
                "step1": "Copia il link TikTok.",
                "step2": "Incollalo qui sopra.",
                "step3": "Clicca Scarica."
            },
            "faq": {
                "q1": "Posso scaricare tutto?", "a1": "Sì, tutte le foto insieme.",
                "q2": "Qualità alta?", "a2": "Sì, HD originale.",
                "q3": "C'è il logo?", "a3": "No, senza filigrana.",
                "q4": "È gratis?", "a4": "Sì, 100% gratis.",
                "q5": "Funziona su iPhone?", "a5": "Sì, e Android.",
                "q6": "Serve un'app?", "a6": "No, basta il browser.",
                "q7": "Account privati?", "a7": "Solo pubblici.",
                "q8": "Che formato?", "a8": "JPG o PNG.",
                "q9": "Limiti?", "a9": "Nessun limite.",
                "q10": "La musica?", "a10": "Scarica MP3 a parte."
            }
        }
    },
    "ja": {
        "slideshow_page": {
            "meta_title": "TikTokスライドショーダウンローダー - 写真保存",
            "meta_desc": "TikTokのスライドショーや写真を透かしなしでHD保存。",
            "title": "TikTokスライドショー保存",
            "desc": "TikTokの写真を一括ダウンロード。高画質で保存。",
            "placeholder": "リンクを貼り付け...",
            "btn_download": "画像を保存",
            "about_title": "TikTokフォトダウンローダー",
            "about_content": "TikTokのフォトスライドショーを元の品質で保存します。すべての画像を一度に。",
            "features": {
                "bulk": { "title": "一括ダウンロード", "desc": "全写真を一度に。" },
                "original": { "title": "オリジナル画質", "desc": "高解像度。" },
                "fast": { "title": "高速処理", "desc": "瞬時に変換。" },
                "format": { "title": "形式", "desc": "JPG/PNG。" },
                "device": { "title": "全デバイス対応", "desc": "iOS, Android, PC。" },
                "unlimited": { "title": "無制限", "desc": "完全無料。" }
            },
            "how_to": {
                "title": "ダウンロード方法",
                "step1": "リンクをコピー。",
                "step2": "ここに貼り付け。",
                "step3": "ダウンロードを押す。"
            },
            "faq": {
                "q1": "全画像保存可能？", "a1": "はい、一括で。",
                "q2": "画質は？", "a2": "はい、HDです。",
                "q3": "ロゴは？", "a3": "ロゴなしです。",
                "q4": "無料？", "a4": "はい、無料です。",
                "q5": "スマホ対応？", "a5": "はい、全機種。",
                "q6": "アプリ必要？", "a6": "いいえ、ブラウザのみ。",
                "q7": "非公開垢は？", "a7": "公開のみです。",
                "q8": "形式は？", "a8": "JPGかPNG。",
                "q9": "制限は？", "a9": "無制限です。",
                "q10": "音楽は？", "a10": "MP3は別で可能。"
            }
        }
    },
    "ko": {
        "slideshow_page": {
            "meta_title": "틱톡 슬라이드쇼 다운로더 - 사진 저장",
            "meta_desc": "워터마크 없이 틱톡 슬라이드쇼와 사진을 HD로 다운로드하세요.",
            "title": "틱톡 슬라이드쇼 다운로드",
            "desc": "틱톡 사진을 저장하는 최고의 도구. 모든 이미지 저장.",
            "placeholder": "링크 붙여넣기...",
            "btn_download": "사진 다운로드",
            "about_title": "틱톡 포토 세이버",
            "about_content": "틱톡 슬라이드쇼를 원본 화질로 저장하세요. 모든 사진을 한 번에.",
            "features": {
                "bulk": { "title": "일괄 다운로드", "desc": "모든 사진 한 번에." },
                "original": { "title": "원본 화질", "desc": "고해상도." },
                "fast": { "title": "초고속", "desc": "즉시 처리." },
                "format": { "title": "스마트 포맷", "desc": "JPG/PNG." },
                "device": { "title": "모든 기기", "desc": "iOS, Android, PC." },
                "unlimited": { "title": "무제한", "desc": "무료 사용." }
            },
            "how_to": {
                "title": "다운로드 방법",
                "step1": "링크 복사.",
                "step2": "여기에 붙여넣기.",
                "step3": "다운로드 클릭."
            },
            "faq": {
                "q1": "모두 저장 가능?", "a1": "네, 한 번에.",
                "q2": "화질은?", "a2": "네, HD 원본.",
                "q3": "워터마크?", "a3": "없습니다.",
                "q4": "무료인가요?", "a4": "네, 100% 무료.",
                "q5": "모바일?", "a5": "네, 모두 지원.",
                "q6": "앱 설치?", "a6": "아니요, 웹에서.",
                "q7": "비공개 계정?", "a7": "공개만 가능.",
                "q8": "파일 형식?", "a8": "JPG 또는 PNG.",
                "q9": "제한?", "a9": "무제한입니다.",
                "q10": "음악은?", "a10": "MP3는 별도."
            }
        }
    },
    "ms": {
        "slideshow_page": {
            "meta_title": "Pemuat Turun Slaid TikTok - Simpan Foto",
            "meta_desc": "Muat turun slaid dan foto TikTok tanpa tera air dalam HD.",
            "title": "Pemuat Turun Slaid TikTok",
            "desc": "Alat terbaik untuk menyimpan foto TikTok. Muat turun setiap gambar.",
            "placeholder": "Tampal pautan...",
            "btn_download": "Muat Turun Foto",
            "about_title": "Penyimpan Foto TikTok",
            "about_content": "Simpan persembahan slaid TikTok dalam kualiti asal. Semua foto sekaligus.",
            "features": {
                "bulk": { "title": "Muat Turun Pukal", "desc": "Semua foto sekaligus." },
                "original": { "title": "Kualiti Asal", "desc": "Resolusi penuh." },
                "fast": { "title": "Sangat Pantas", "desc": "Proses segera." },
                "format": { "title": "Format", "desc": "JPG/PNG." },
                "device": { "title": "Semua Peranti", "desc": "iOS, Android, PC." },
                "unlimited": { "title": "Tanpa Had", "desc": "Percuma." }
            },
            "how_to": {
                "title": "Cara memuat turun",
                "step1": "Salin pautan TikTok.",
                "step2": "Tampal di sini.",
                "step3": "Klik Muat Turun."
            },
            "faq": {
                "q1": "Boleh dl semua?", "a1": "Ya, sekaligus.",
                "q2": "Kualiti HD?", "a2": "Ya, asal.",
                "q3": "Ada watermark?", "a3": "Tiada.",
                "q4": "Percuma?", "a4": "Ya, 100% percuma.",
                "q5": "Telefon?", "a5": "Ya, semua jenis.",
                "q6": "App?", "a6": "Tak perlu app.",
                "q7": "Akaun privet?", "a7": "Hanya awam.",
                "q8": "Format?", "a8": "JPG/PNG.",
                "q9": "Had?", "a9": "Tiada had.",
                "q10": "Muzik?", "a10": "MP3 asing."
            }
        }
    },
    "nl": {
        "slideshow_page": {
            "meta_title": "TikTok Slideshow Downloader - Foto's Opslaan",
            "meta_desc": "Download TikTok slideshows en foto's zonder watermerk in HD.",
            "title": "TikTok Slideshow Downloader",
            "desc": "De beste tool om TikTok foto's op te slaan. Download elke afbeelding.",
            "placeholder": "Plak link hier...",
            "btn_download": "Foto's Downloaden",
            "about_title": "TikTok Foto Saver",
            "about_content": "Bewaar TikTok diavoorstellingen in originele kwaliteit. Alle foto's in één keer.",
            "features": {
                "bulk": { "title": "Alles Downloaden", "desc": "Alle foto's tegelijk." },
                "original": { "title": "Originele Kwaliteit", "desc": "Hoge resolutie." },
                "fast": { "title": "Supersnel", "desc": "Direct klaar." },
                "format": { "title": "Slimme Formaten", "desc": "JPG/PNG." },
                "device": { "title": "Alle Apparaten", "desc": "iOS, Android, PC." },
                "unlimited": { "title": "Onbeperkt", "desc": "Gratis gebruik." }
            },
            "how_to": {
                "title": "Hoe te downloaden",
                "step1": "Kopieer TikTok link.",
                "step2": "Plak hierboven.",
                "step3": "Klik Downloaden."
            },
            "faq": {
                "q1": "Kan ik alles downloaden?", "a1": "Ja, alles tegelijk.",
                "q2": "Is de kwaliteit goed?", "a2": "Ja, origineel HD.",
                "q3": "Met watermerk?", "a3": "Nee, zonder logo.",
                "q4": "Is het gratis?", "a4": "Ja, 100% gratis.",
                "q5": "Werkt het op mobiel?", "a5": "Ja, op alle.",
                "q6": "App nodig?", "a6": "Nee, via browser.",
                "q7": "Privé accounts?", "a7": "Nee, alleen openbaar.",
                "q8": "Welk formaat?", "a8": "JPG of PNG.",
                "q9": "Is er een limiet?", "a9": "Geen limiet.",
                "q10": "En de muziek?", "a10": "MP3 kan apart."
            }
        }
    },
    "no": {
        "slideshow_page": {
            "meta_title": "TikTok Slideshow Downloader - Lagre Bilder",
            "meta_desc": "Last ned TikTok lysbildeserier og bilder uten vannmerke i HD.",
            "title": "TikTok Slideshow Nedlaster",
            "desc": "Det beste verktøyet for å lagre TikTok-bilder. Last ned hvert bilde.",
            "placeholder": "Lim inn lenke...",
            "btn_download": "Last Ned Bilder",
            "about_title": "TikTok Foto Nedlaster",
            "about_content": "Lagre TikTok-lysbildeserier i original kvalitet. Alle bildene på én gang.",
            "features": {
                "bulk": { "title": "Masse-nedlasting", "desc": "Alle bilder samtidig." },
                "original": { "title": "Original Kvalitet", "desc": "Full oppløsning." },
                "fast": { "title": "Superrask", "desc": "Øyeblikkelig prosess." },
                "format": { "title": "Formater", "desc": "JPG/PNG." },
                "device": { "title": "Alle Enheter", "desc": "iOS, Android, PC." },
                "unlimited": { "title": "Ubegrenset", "desc": "Gratis." }
            },
            "how_to": {
                "title": "Hvordan laste ned",
                "step1": "Kopier lenke.",
                "step2": "Lim inn her.",
                "step3": "Klikk Last Ned."
            },
            "faq": {
                "q1": "Kan jeg ta alle?", "a1": "Ja, alle samtidig.",
                "q2": "God kvalitet?", "a2": "Ja, HD.",
                "q3": "Vannmerke?", "a3": "Nei, uten.",
                "q4": "Gratis?", "a4": "Ja.",
                "q5": "Mobil?", "a5": "Ja, iOS/Android.",
                "q6": "App?", "a6": "Nei, nettleser.",
                "q7": "Privat konto?", "a7": "Bare offentlige.",
                "q8": "Filtype?", "a8": "JPG/PNG.",
                "q9": "Grense?", "a9": "Ingen grenser.",
                "q10": "Musikk?", "a10": "MP3 separat."
            }
        }
    },
    "pl": {
        "slideshow_page": {
            "meta_title": "Pobieranie Slideshow TikTok - Zapisz Zdjęcia",
            "meta_desc": "Pobieraj pokazy slajdów i zdjęcia z TikToka bez znaku wodnego w HD.",
            "title": "Pobieranie Slideshow TikTok",
            "desc": "Najlepsze narzędzie do zapisu zdjęć z TikToka. Pobierz każdy obraz.",
            "placeholder": "Wklej link...",
            "btn_download": "Pobierz Zdjęcia",
            "about_title": "Downloader Zdjęć TikTok",
            "about_content": "Zapisuj pokazy slajdów TikTok w oryginalnej jakości. Wszystkie zdjęcia naraz.",
            "features": {
                "bulk": { "title": "Pobierz Wszystkie", "desc": "Cała seria naraz." },
                "original": { "title": "Oryginalna Jakość", "desc": "Pełna rozdzielczość." },
                "fast": { "title": "Superszybko", "desc": "Natychmiast." },
                "format": { "title": "Formaty", "desc": "JPG/PNG." },
                "device": { "title": "Wszystkie Urządzenia", "desc": "iOS, Android, PC." },
                "unlimited": { "title": "Bez Limitu", "desc": "Za darmo." }
            },
            "how_to": {
                "title": "Jak pobrać",
                "step1": "Skopiuj link.",
                "step2": "Wklej tutaj.",
                "step3": "Kliknij Pobierz."
            },
            "faq": {
                "q1": "Mogę pobrać wszystkie?", "a1": "Tak, wszystkie naraz.",
                "q2": "Jakość HD?", "a2": "Tak, oryginał.",
                "q3": "Znak wodny?", "a3": "Nie, bez znaku.",
                "q4": "Za darmo?", "a4": "Tak, całkowicie.",
                "q5": "Na telefon?", "a5": "Tak, każdy.",
                "q6": "Aplikacja?", "a6": "Nie, przeglądarka.",
                "q7": "Konta prywatne?", "a7": "Tylko publiczne.",
                "q8": "Format?", "a8": "JPG/PNG.",
                "q9": "Limit?", "a9": "Brak limitu.",
                "q10": "Muzyka?", "a10": "MP3 osobno."
            }
        }
    },
    "ro": {
        "slideshow_page": {
            "meta_title": "Descărcare Slideshow TikTok - Salvează Poze",
            "meta_desc": "Descarcă slideshow-uri și poze TikTok fără watermark în HD.",
            "title": "Descărcare Slideshow TikTok",
            "desc": "Cel mai bun instrument pentru poze TikTok. Descarcă fiecare imagine.",
            "placeholder": "Lipește linkul...",
            "btn_download": "Descarcă Imaginile",
            "about_title": "Descărcător Foto TikTok",
            "about_content": "Salvează slideshow-urile TikTok la calitate originală. Toate pozele odată.",
            "features": {
                "bulk": { "title": "Descărcare în Masă", "desc": "Toate pozele odată." },
                "original": { "title": "Calitate Originală", "desc": "Rezoluție maximă." },
                "fast": { "title": "Foarte Rapid", "desc": "Procesare instantă." },
                "format": { "title": "Formate", "desc": "JPG/PNG." },
                "device": { "title": "Orice Dispozitiv", "desc": "iOS, Android, PC." },
                "unlimited": { "title": "Nelimitat", "desc": "Gratuit." }
            },
            "how_to": {
                "title": "Cum să descarci",
                "step1": "Copiază linkul.",
                "step2": "Lipește aici.",
                "step3": "Apasă Descarcă."
            },
            "faq": {
                "q1": "Pot descărca tot?", "a1": "Da, toate odată.",
                "q2": "Calitate bună?", "a2": "Da, HD.",
                "q3": "Cu watermark?", "a3": "Nu, fără.",
                "q4": "Gratis?", "a4": "Da, 100%.",
                "q5": "Pe mobil?", "a5": "Da, iOS/Android.",
                "q6": "Aplicație?", "a6": "Nu, browser.",
                "q7": "Conturi private?", "a7": "Doar publice.",
                "q8": "Format?", "a8": "JPG/PNG.",
                "q9": "Limită?", "a9": "Fără limită.",
                "q10": "Muzică?", "a10": "MP3 separat."
            }
        }
    },
    "sv": {
        "slideshow_page": {
            "meta_title": "TikTok Slideshow Downloader - Spara Bilder",
            "meta_desc": "Ladda ner TikTok bildspel och foton utan vattenstämpel i HD.",
            "title": "TikTok Slideshow Nedladdare",
            "desc": "Bästa verktyget för att spara TikTok-foton. Ladda ner varje bild.",
            "placeholder": "Klistra in länk...",
            "btn_download": "Ladda Ner Bilder",
            "about_title": "TikTok Foto Sparare",
            "about_content": "Spara TikTok bildspel i originalkvalitet. Alla bilder på en gång.",
            "features": {
                "bulk": { "title": "Massnedladdning", "desc": "Alla foton direkt." },
                "original": { "title": "Originalkvalitet", "desc": "Full upplösning." },
                "fast": { "title": "Supersnabb", "desc": "Direkt behandling." },
                "format": { "title": "Format", "desc": "JPG/PNG." },
                "device": { "title": "Alla Enheter", "desc": "iOS, Android, PC." },
                "unlimited": { "title": "Obegränsat", "desc": "Gratis." }
            },
            "how_to": {
                "title": "Hur man laddar ner",
                "step1": "Kopiera länk.",
                "step2": "Klistra in här.",
                "step3": "Klicka Ladda Ner."
            },
            "faq": {
                "q1": "Kan jag ta alla?", "a1": "Ja, alla samtidigt.",
                "q2": "Bra kvalitet?", "a2": "Ja, HD.",
                "q3": "Vattenstämpel?", "a3": "Nej, utan.",
                "q4": "Gratis?", "a4": "Ja.",
                "q5": "Mobil?", "a5": "Ja, alla.",
                "q6": "App?", "a6": "Nej, webbläsare.",
                "q7": "Privat konto?", "a7": "Bara offentliga.",
                "q8": "Format?", "a8": "JPG/PNG.",
                "q9": "Gräns?", "a9": "Ingen gräns.",
                "q10": "Musik?", "a10": "MP3 separat."
            }
        }
    },
    "th": {
        "slideshow_page": {
            "meta_title": "TikTok Slideshow Downloader - บันทึกรูปภาพ",
            "meta_desc": "ดาวน์โหลดสไลด์โชว์และรูปภาพ TikTok โดยไม่มีลายน้ำ ระดับ HD",
            "title": "ดาวน์โหลดสไลด์โชว์ TikTok",
            "desc": "เครื่องมือที่ดีที่สุดสำหรับบันทึกรูปภาพ TikTok ดาวน์โหลดทุกรูป",
            "placeholder": "วางลิงก์...",
            "btn_download": "ดาวน์โหลดรูปภาพ",
            "about_title": "โปรแกรมบันทึกรูป TikTok",
            "about_content": "บันทึกสไลด์โชว์ TikTok ในคุณภาพต้นฉบับ รูปภาพทั้งหมดในครั้งเดียว",
            "features": {
                "bulk": { "title": "โหลดทั้งหมด", "desc": "รูปทั้งหมดทันที" },
                "original": { "title": "คุณภาพเดิม", "desc": "ความละเอียดเต็ม" },
                "fast": { "title": "เร็วมาก", "desc": "ประมวลผลทันที" },
                "format": { "title": "รูปแบบ", "desc": "JPG/PNG" },
                "device": { "title": "ทุกอุปกรณ์", "desc": "iOS, Android, PC" },
                "unlimited": { "title": "ไม่จำกัด", "desc": "ฟรี" }
            },
            "how_to": {
                "title": "วิธีดาวน์โหลด",
                "step1": "คัดลอกลิงก์",
                "step2": "วางที่นี่",
                "step3": "คลิกดาวน์โหลด"
            },
            "faq": {
                "q1": "โหลดหมดได้ไหม?", "a1": "ได้ ทุกรูป",
                "q2": "ชัดไหม?", "a2": "ชัด ระดับ HD",
                "q3": "มีลายน้ำไหม?", "a3": "ไม่มี",
                "q4": "ฟรีไหม?", "a4": "ฟรี 100%",
                "q5": "มือถือได้ไหม?", "a5": "ได้ ทุกรุ่น",
                "q6": "ต้องโหลดแอป?", "a6": "ไม่ใช้แอป",
                "q7": "ส่วนตัวได้ไหม?", "a7": "สาธารณะเท่านั้น",
                "q8": "ไฟล์อะไร?", "a8": "JPG/PNG",
                "q9": "จำกัดไหม?", "a9": "ไม่จำกัด",
                "q10": "เพลงล่ะ?", "a10": "โหลด MP3 แยกได้"
            }
        }
    },
    "uk": {
        "slideshow_page": {
            "meta_title": "Завантажувач слайд-шоу TikTok - Зберегти фото",
            "meta_desc": "Завантажуйте слайд-шоу та фото з TikTok без водяних знаків у HD.",
            "title": "Завантажувач слайд-шоу TikTok",
            "desc": "Найкращий інструмент для збереження фото з TikTok. Завантажте кожне зображення.",
            "placeholder": "Вставте посилання...",
            "btn_download": "Завантажити фото",
            "about_title": "Збереження фото TikTok",
            "about_content": "Зберігайте слайд-шоу TikTok в оригінальній якості. Всі фото одразу.",
            "features": {
                "bulk": { "title": "Масове завантаження", "desc": "Всі фото разом." },
                "original": { "title": "Оригінальна якість", "desc": "Повна роздільна здатність." },
                "fast": { "title": "Супер швидко", "desc": "Миттєва обробка." },
                "format": { "title": "Формати", "desc": "JPG/PNG." },
                "device": { "title": "Всі пристрої", "desc": "iOS, Android, PC." },
                "unlimited": { "title": "Безліміт", "desc": "Безкоштовно." }
            },
            "how_to": {
                "title": "Як завантажити",
                "step1": "Скопіюйте посилання.",
                "step2": "Вставте сюди.",
                "step3": "Натисніть Завантажити."
            },
            "faq": {
                "q1": "Можна все одразу?", "a1": "Так, всі фото.",
                "q2": "Якість добра?", "a2": "Так, HD.",
                "q3": "Знак є?", "a3": "Ні, без знака.",
                "q4": "Безкоштовно?", "a4": "Так.",
                "q5": "На телефон?", "a5": "Так.",
                "q6": "Додаток?", "a6": "Ні, браузер.",
                "q7": "Приватні акаунти?", "a7": "Тільки публічні.",
                "q8": "Формат?", "a8": "JPG/PNG.",
                "q9": "Ліміт?", "a9": "Без ліміту.",
                "q10": "Музика?", "a10": "MP3 окремо."
            }
        }
    },
    "vi": {
        "slideshow_page": {
            "meta_title": "Tải Slideshow TikTok - Lưu Ảnh TikTok",
            "meta_desc": "Tải xuống slideshow và ảnh TikTok không logo chất lượng HD.",
            "title": "Tải Slideshow TikTok",
            "desc": "Công cụ tốt nhất để lưu ảnh TikTok. Tải xuống từng hình ảnh.",
            "placeholder": "Dán liên kết...",
            "btn_download": "Tải Ảnh",
            "about_title": "Lưu Ảnh TikTok",
            "about_content": "Lưu slideshow TikTok với chất lượng gốc. Tất cả ảnh cùng lúc.",
            "features": {
                "bulk": { "title": "Tải Hàng Loạt", "desc": "Tất cả ảnh ngay lập tức." },
                "original": { "title": "Chất Lượng Gốc", "desc": "Độ phân giải đầy đủ." },
                "fast": { "title": "Siêu Nhanh", "desc": "Xử lý ngay lập tức." },
                "format": { "title": "Định Dạng", "desc": "JPG/PNG." },
                "device": { "title": "Mọi Thiết Bị", "desc": "iOS, Android, PC." },
                "unlimited": { "title": "Không Giới Hạn", "desc": "Miễn phí." }
            },
            "how_to": {
                "title": "Cách tải xuống",
                "step1": "Sao chép liên kết.",
                "step2": "Dán vào đây.",
                "step3": "Nhấn Tải Về."
            },
            "faq": {
                "q1": "Tải hết được không?", "a1": "Được, tất cả cùng lúc.",
                "q2": "Chất lượng cao?", "a2": "Đúng, HD gốc.",
                "q3": "Có logo không?", "a3": "Không logo.",
                "q4": "Miễn phí không?", "a4": "Có, 100%.",
                "q5": "Điện thoại?", "a5": "iOS và Android.",
                "q6": "Cần app không?", "a6": "Không, chỉ cần web.",
                "q7": "Riêng tư?", "a7": "Chỉ công khai.",
                "q8": "Định dạng?", "a8": "JPG hoặc PNG.",
                "q9": "Giới hạn?", "a9": "Không giới hạn.",
                "q10": "Nhạc?", "a10": "Tải MP3 riêng."
            }
        }
    },
    "zh": {
        "slideshow_page": {
            "meta_title": "TikTok 幻灯片下载器 - 保存图片",
            "meta_desc": "下载无水印的 TikTok 幻灯片和照片。高清画质。",
            "title": "TikTok 幻灯片下载",
            "desc": "保存 TikTok 照片的最佳工具。下载每一张图片。",
            "placeholder": "粘贴链接...",
            "btn_download": "下载图片",
            "about_title": "TikTok 照片保存",
            "about_content": "以原始质量保存 TikTok 幻灯片。一次性下载所有照片。",
            "features": {
                "bulk": { "title": "批量下载", "desc": "一次性所有照片。" },
                "original": { "title": "原始画质", "desc": "全分辨率。" },
                "fast": { "title": "超快", "desc": "即时处理。" },
                "format": { "title": "智能格式", "desc": "JPG/PNG。" },
                "device": { "title": "全设备支持", "desc": "iOS, Android, PC。" },
                "unlimited": { "title": "无限", "desc": "免费下载。" }
            },
            "how_to": {
                "title": "如何下载",
                "step1": "复制链接。",
                "step2": "粘贴到这里。",
                "step3": "点击下载。"
            },
            "faq": {
                "q1": "能下载所有吗？", "a1": "是的，一次性。",
                "q2": "画质好吗？", "a2": "是的，高清。",
                "q3": "有水印吗？", "a3": "没有水印。",
                "q4": "免费吗？", "a4": "是的，完全免费。",
                "q5": "手机能用吗？", "a5": "支持所有手机。",
                "q6": "需要APP吗？", "a6": "不需要，浏览器即可。",
                "q7": "私密账号？", "a7": "仅限公开。",
                "q8": "格式？", "a8": "JPG 或 PNG。",
                "q9": "有限制吗？", "a9": "无限制。",
                "q10": "音乐呢？", "a10": "可单独下载 MP3。"
            }
        }
    },
    "tl": {
        "slideshow_page": {
            "meta_title": "TikTok Slideshow Downloader - I-save ang mga Larawan",
            "meta_desc": "I-download ang TikTok slideshows at photos nang walang watermark sa HD.",
            "title": "TikTok Slideshow Downloader",
            "desc": "Ang pinakamahusay na tool para sa pag-save ng TikTok photos. I-download ang bawat larawan.",
            "placeholder": "I-paste ang link...",
            "btn_download": "I-download ang mga Larawan",
            "about_title": "TikTok Photo Saver",
            "about_content": "I-save ang TikTok slideshows sa orihinal na kalidad. Lahat ng larawan nang sabay-sabay.",
            "features": {
                "bulk": { "title": "Bulk Download", "desc": "Lahat ng photos agad." },
                "original": { "title": "Original Quality", "desc": "Buong resolution." },
                "fast": { "title": "Sobrang Bilis", "desc": "Instant processing." },
                "format": { "title": "Smart Formats", "desc": "JPG/PNG." },
                "device": { "title": "Lahat ng Device", "desc": "iOS, Android, PC." },
                "unlimited": { "title": "Unlimited", "desc": "Libreng downloads." }
            },
            "how_to": {
                "title": "Paano mag-download",
                "step1": "Kopyahin ang link.",
                "step2": "I-paste dito.",
                "step3": "I-click ang Download."
            },
            "faq": {
                "q1": "Pwede bang lahat?", "a1": "Oo, lahat sabay-sabay.",
                "q2": "Mataas ba quality?", "a2": "Oo, HD original.",
                "q3": "May watermark?", "a3": "Wala, malinis.",
                "q4": "Libre ba?", "a4": "Oo, 100% libre.",
                "q5": "Pwede sa mobile?", "a5": "Oo, lahat ng mobile.",
                "q6": "Kailangan ng app?", "a6": "Hindi, browser lang.",
                "q7": "Private accounts?", "a7": "Public lang.",
                "q8": "Anong format?", "a8": "JPG o PNG.",
                "q9": "May limit?", "a9": "Walang limit.",
                "q10": "Yung music?", "a10": "Pwede MP3 hiwalay."
            }
        }
    }
};

Object.keys(translations).forEach(lang => {
    const filePath = path.join(localesDir, `${lang}.json`);
    if (fs.existsSync(filePath)) {
        try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            content.slideshow_page = translations[lang].slideshow_page;
            fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
            console.log(`Updated ${lang}.json`);
        } catch (e) {
            console.error(`Failed to update ${lang}.json:`, e);
        }
    } else {
        console.warn(`${lang}.json not found`);
    }
});
