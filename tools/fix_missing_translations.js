/**
 * سكربت لإصلاح الترجمات الناقصة في كل ملفات اللغات
 * يضيف المفاتيح الناقصة بترجمات احترافية
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'locales', 'locales');

// الترجمات الناقصة لكل لغة
const translations = {
    // bg - Bulgarian
    bg: {
        common: {
            select_language: "Избор на език",
            toggle_theme: "Превключване на тема"
        },
        features: {
            no_watermark: { title: "Без воден знак", desc: "Изтегляйте TikTok видеа без досадния воден знак. Чисти видеа, готови за споделяне." },
            quality: { title: "HD и 4K качество", desc: "Запазвайте видеа в оригинално качество - до 4K резолюция с кристално чист звук." },
            device: { title: "Всички устройства", desc: "Работи перфектно на iPhone, Android, PC, Mac и таблети. Не е необходима инсталация." }
        }
    },
    // cs - Czech
    cs: {
        common: {
            select_language: "Vyberte jazyk",
            toggle_theme: "Přepnout motiv"
        },
        features: {
            no_watermark: { title: "Bez vodoznaku", desc: "Stahujte TikTok videa bez otravného vodoznaku. Čistá videa připravená ke sdílení." },
            quality: { title: "HD a 4K kvalita", desc: "Ukládejte videa v původní kvalitě - až do rozlišení 4K s křišťálově čistým zvukem." },
            device: { title: "Všechna zařízení", desc: "Funguje perfektně na iPhone, Android, PC, Mac a tabletech. Žádná instalace není potřeba." }
        }
    },
    // da - Danish
    da: {
        common: {
            select_language: "Vælg sprog",
            toggle_theme: "Skift tema"
        },
        features: {
            no_watermark: { title: "Uden vandmærke", desc: "Download TikTok videoer uden det irriterende vandmærke. Rene videoer klar til deling." },
            quality: { title: "HD & 4K kvalitet", desc: "Gem videoer i original kvalitet - op til 4K opløsning med krystalklart lyd." },
            device: { title: "Alle enheder", desc: "Virker perfekt på iPhone, Android, PC, Mac og tablets. Ingen installation nødvendig." }
        }
    },
    // de - German
    de: {
        common: {
            select_language: "Sprache wählen",
            toggle_theme: "Design wechseln"
        },
        features: {
            no_watermark: { title: "Ohne Wasserzeichen", desc: "TikTok Videos ohne das nervige Wasserzeichen herunterladen. Saubere Videos zum Teilen." },
            quality: { title: "HD & 4K Qualität", desc: "Videos in Originalqualität speichern - bis zu 4K Auflösung mit kristallklarem Ton." },
            device: { title: "Alle Geräte", desc: "Funktioniert perfekt auf iPhone, Android, PC, Mac und Tablets. Keine Installation nötig." }
        }
    },
    // el - Greek
    el: {
        common: {
            select_language: "Επιλέξτε γλώσσα",
            toggle_theme: "Εναλλαγή θέματος"
        },
        features: {
            no_watermark: { title: "Χωρίς υδατογράφημα", desc: "Κατεβάστε βίντεο TikTok χωρίς το ενοχλητικό υδατογράφημα. Καθαρά βίντεο έτοιμα για κοινοποίηση." },
            quality: { title: "HD & 4K ποιότητα", desc: "Αποθηκεύστε βίντεο σε αρχική ποιότητα - μέχρι 4K ανάλυση με κρυστάλλινο ήχο." },
            device: { title: "Όλες οι συσκευές", desc: "Λειτουργεί τέλεια σε iPhone, Android, PC, Mac και tablets. Δεν απαιτείται εγκατάσταση." }
        }
    },
    // fi - Finnish
    fi: {
        common: {
            select_language: "Valitse kieli",
            toggle_theme: "Vaihda teemaa"
        },
        features: {
            no_watermark: { title: "Ilman vesileimaa", desc: "Lataa TikTok-videoita ilman ärsyttävää vesileimaa. Puhtaat videot valmiina jakamiseen." },
            quality: { title: "HD & 4K laatu", desc: "Tallenna videot alkuperäislaadulla - jopa 4K resoluutiolla ja kristallinkirkkaalla äänellä." },
            device: { title: "Kaikki laitteet", desc: "Toimii täydellisesti iPhonella, Androidilla, PC:llä, Macilla ja tableteilla. Ei asennusta tarvita." }
        }
    },
    // hi - Hindi
    hi: {
        common: {
            select_language: "भाषा चुनें",
            toggle_theme: "थीम बदलें"
        },
        features: {
            no_watermark: { title: "बिना वॉटरमार्क", desc: "TikTok वीडियो बिना परेशान करने वाले वॉटरमार्क के डाउनलोड करें। साफ वीडियो शेयर करने के लिए तैयार।" },
            quality: { title: "HD और 4K क्वालिटी", desc: "वीडियो को मूल गुणवत्ता में सेव करें - क्रिस्टल क्लियर ऑडियो के साथ 4K रेजोल्यूशन तक।" },
            device: { title: "सभी डिवाइस", desc: "iPhone, Android, PC, Mac और टैबलेट पर पूरी तरह से काम करता है। कोई इंस्टॉलेशन जरूरी नहीं।" }
        }
    },
    // hu - Hungarian
    hu: {
        common: {
            select_language: "Nyelv kiválasztása",
            toggle_theme: "Téma váltása"
        },
        features: {
            no_watermark: { title: "Vízjel nélkül", desc: "TikTok videók letöltése a bosszantó vízjel nélkül. Tiszta videók megosztásra készen." },
            quality: { title: "HD és 4K minőség", desc: "Videók mentése eredeti minőségben - akár 4K felbontással és kristálytiszta hanggal." },
            device: { title: "Minden eszköz", desc: "Tökéletesen működik iPhone-on, Androidon, PC-n, Mac-en és tableteken. Nincs szükség telepítésre." }
        }
    },
    // it - Italian
    it: {
        common: {
            select_language: "Seleziona lingua",
            toggle_theme: "Cambia tema"
        },
        features: {
            no_watermark: { title: "Senza filigrana", desc: "Scarica video TikTok senza la fastidiosa filigrana. Video puliti pronti da condividere." },
            quality: { title: "Qualità HD e 4K", desc: "Salva video in qualità originale - fino a risoluzione 4K con audio cristallino." },
            device: { title: "Tutti i dispositivi", desc: "Funziona perfettamente su iPhone, Android, PC, Mac e tablet. Nessuna installazione richiesta." }
        }
    },
    // ja - Japanese
    ja: {
        common: {
            select_language: "言語を選択",
            toggle_theme: "テーマを切り替え"
        },
        features: {
            no_watermark: { title: "ウォーターマークなし", desc: "うっとうしいウォーターマークなしでTikTok動画をダウンロード。共有可能なクリーンな動画。" },
            quality: { title: "HD & 4K品質", desc: "オリジナル品質で動画を保存 - クリスタルクリアな音声で4K解像度まで対応。" },
            device: { title: "全デバイス対応", desc: "iPhone、Android、PC、Mac、タブレットで完璧に動作。インストール不要。" }
        }
    },
    // ko - Korean
    ko: {
        common: {
            select_language: "언어 선택",
            toggle_theme: "테마 전환"
        },
        features: {
            no_watermark: { title: "워터마크 없음", desc: "성가신 워터마크 없이 TikTok 동영상을 다운로드하세요. 공유할 준비가 된 깨끗한 동영상." },
            quality: { title: "HD & 4K 품질", desc: "원본 품질로 동영상 저장 - 크리스탈 클리어 오디오로 최대 4K 해상도." },
            device: { title: "모든 기기", desc: "iPhone, Android, PC, Mac, 태블릿에서 완벽하게 작동. 설치 필요 없음." }
        }
    },
    // ms - Malay
    ms: {
        common: {
            select_language: "Pilih bahasa",
            toggle_theme: "Tukar tema"
        },
        features: {
            no_watermark: { title: "Tanpa tera air", desc: "Muat turun video TikTok tanpa tera air yang menjengkelkan. Video bersih sedia dikongsi." },
            quality: { title: "Kualiti HD & 4K", desc: "Simpan video dalam kualiti asal - sehingga resolusi 4K dengan audio jernih." },
            device: { title: "Semua peranti", desc: "Berfungsi dengan sempurna di iPhone, Android, PC, Mac dan tablet. Tiada pemasangan diperlukan." }
        }
    },
    // nl - Dutch
    nl: {
        common: {
            select_language: "Selecteer taal",
            toggle_theme: "Thema wisselen"
        },
        features: {
            no_watermark: { title: "Geen watermerk", desc: "Download TikTok video's zonder het irritante watermerk. Schone video's klaar om te delen." },
            quality: { title: "HD & 4K kwaliteit", desc: "Sla video's op in originele kwaliteit - tot 4K resolutie met kristalhelder geluid." },
            device: { title: "Alle apparaten", desc: "Werkt perfect op iPhone, Android, PC, Mac en tablets. Geen installatie nodig." }
        }
    },
    // no - Norwegian
    no: {
        common: {
            select_language: "Velg språk",
            toggle_theme: "Bytt tema"
        },
        features: {
            no_watermark: { title: "Uten vannmerke", desc: "Last ned TikTok-videoer uten det irriterende vannmerket. Rene videoer klare til deling." },
            quality: { title: "HD & 4K kvalitet", desc: "Lagre videoer i original kvalitet - opptil 4K oppløsning med krystallklar lyd." },
            device: { title: "Alle enheter", desc: "Fungerer perfekt på iPhone, Android, PC, Mac og nettbrett. Ingen installasjon nødvendig." }
        }
    },
    // pl - Polish
    pl: {
        common: {
            select_language: "Wybierz język",
            toggle_theme: "Zmień motyw"
        },
        features: {
            no_watermark: { title: "Bez znaku wodnego", desc: "Pobieraj filmy TikTok bez irytującego znaku wodnego. Czyste wideo gotowe do udostępnienia." },
            quality: { title: "Jakość HD i 4K", desc: "Zapisuj filmy w oryginalnej jakości - do rozdzielczości 4K z krystalicznie czystym dźwiękiem." },
            device: { title: "Wszystkie urządzenia", desc: "Działa idealnie na iPhone, Android, PC, Mac i tabletach. Nie wymaga instalacji." }
        }
    },
    // pt - Portuguese
    pt: {
        common: {
            select_language: "Selecionar idioma",
            toggle_theme: "Alternar tema"
        },
        features: {
            no_watermark: { title: "Sem marca d'água", desc: "Baixe vídeos do TikTok sem a marca d'água irritante. Vídeos limpos prontos para compartilhar." },
            quality: { title: "Qualidade HD e 4K", desc: "Salve vídeos em qualidade original - até resolução 4K com áudio cristalino." },
            device: { title: "Todos os dispositivos", desc: "Funciona perfeitamente em iPhone, Android, PC, Mac e tablets. Nenhuma instalação necessária." }
        }
    },
    // ro - Romanian
    ro: {
        common: {
            select_language: "Selectați limba",
            toggle_theme: "Schimbați tema"
        },
        features: {
            no_watermark: { title: "Fără filigran", desc: "Descărcați videoclipuri TikTok fără filigranul enervant. Videoclipuri curate gata de partajat." },
            quality: { title: "Calitate HD și 4K", desc: "Salvați videoclipuri la calitate originală - până la rezoluție 4K cu sunet cristalin." },
            device: { title: "Toate dispozitivele", desc: "Funcționează perfect pe iPhone, Android, PC, Mac și tablete. Nu necesită instalare." }
        }
    },
    // sv - Swedish
    sv: {
        common: {
            select_language: "Välj språk",
            toggle_theme: "Byt tema"
        },
        features: {
            no_watermark: { title: "Utan vattenstämpel", desc: "Ladda ner TikTok-videor utan den irriterande vattenstämpeln. Rena videor redo att dela." },
            quality: { title: "HD & 4K kvalitet", desc: "Spara videor i originalkvalitet - upp till 4K upplösning med kristallklart ljud." },
            device: { title: "Alla enheter", desc: "Fungerar perfekt på iPhone, Android, PC, Mac och surfplattor. Ingen installation krävs." }
        }
    },
    // th - Thai
    th: {
        common: {
            select_language: "เลือกภาษา",
            toggle_theme: "เปลี่ยนธีม"
        },
        features: {
            no_watermark: { title: "ไม่มีลายน้ำ", desc: "ดาวน์โหลดวิดีโอ TikTok โดยไม่มีลายน้ำที่น่ารำคาญ วิดีโอสะอาดพร้อมแชร์" },
            quality: { title: "คุณภาพ HD และ 4K", desc: "บันทึกวิดีโอในคุณภาพต้นฉบับ - สูงสุดความละเอียด 4K พร้อมเสียงใสกริ๊ง" },
            device: { title: "ทุกอุปกรณ์", desc: "ทำงานได้อย่างสมบูรณ์แบบบน iPhone, Android, PC, Mac และแท็บเล็ต ไม่ต้องติดตั้ง" }
        }
    },
    // tr - Turkish
    tr: {
        common: {
            select_language: "Dil seçin",
            toggle_theme: "Tema değiştir"
        },
        features: {
            no_watermark: { title: "Filigran yok", desc: "TikTok videolarını sinir bozucu filigran olmadan indirin. Paylaşmaya hazır temiz videolar." },
            quality: { title: "HD ve 4K kalite", desc: "Videoları orijinal kalitede kaydedin - kristal netliğinde sesle 4K çözünürlüğe kadar." },
            device: { title: "Tüm cihazlar", desc: "iPhone, Android, PC, Mac ve tabletlerde mükemmel çalışır. Kurulum gerektirmez." }
        }
    },
    // uk - Ukrainian
    uk: {
        common: {
            select_language: "Виберіть мову",
            toggle_theme: "Змінити тему"
        },
        features: {
            no_watermark: { title: "Без водяного знаку", desc: "Завантажуйте відео TikTok без дратівливого водяного знаку. Чисті відео готові до поширення." },
            quality: { title: "HD та 4K якість", desc: "Зберігайте відео в оригінальній якості - до 4K роздільної здатності з кришталево чистим звуком." },
            device: { title: "Усі пристрої", desc: "Ідеально працює на iPhone, Android, ПК, Mac та планшетах. Не потребує встановлення." }
        }
    },
    // vi - Vietnamese
    vi: {
        common: {
            select_language: "Chọn ngôn ngữ",
            toggle_theme: "Đổi giao diện"
        },
        features: {
            no_watermark: { title: "Không có watermark", desc: "Tải video TikTok mà không có watermark phiền phức. Video sạch sẵn sàng chia sẻ." },
            quality: { title: "Chất lượng HD & 4K", desc: "Lưu video với chất lượng gốc - lên đến độ phân giải 4K với âm thanh trong trẻo." },
            device: { title: "Mọi thiết bị", desc: "Hoạt động hoàn hảo trên iPhone, Android, PC, Mac và máy tính bảng. Không cần cài đặt." }
        }
    },
    // zh - Chinese
    zh: {
        common: {
            select_language: "选择语言",
            toggle_theme: "切换主题"
        },
        features: {
            no_watermark: { title: "无水印", desc: "下载TikTok视频无烦人水印。干净视频随时分享。" },
            quality: { title: "高清和4K画质", desc: "以原始质量保存视频 - 高达4K分辨率配以水晶般清晰音质。" },
            device: { title: "全平台支持", desc: "在iPhone、Android、PC、Mac和平板电脑上完美运行。无需安装。" }
        }
    },
    // fil - Filipino
    fil: {
        common: {
            select_language: "Pumili ng wika",
            toggle_theme: "Palitan ang tema"
        },
        features: {
            no_watermark: { title: "Walang watermark", desc: "I-download ang TikTok videos nang walang nakakainis na watermark. Malinis na videos handang i-share." },
            quality: { title: "HD at 4K quality", desc: "I-save ang videos sa original na quality - hanggang 4K resolution na may napakaclear na audio." },
            device: { title: "Lahat ng devices", desc: "Gumagana nang perpekto sa iPhone, Android, PC, Mac at tablets. Hindi kailangan ng installation." }
        }
    }
};

// دالة لدمج الترجمات
function deepMerge(target, source) {
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) target[key] = {};
            deepMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

// تطبيق التحديثات
let updatedCount = 0;

for (const [lang, newTranslations] of Object.entries(translations)) {
    const filePath = path.join(LOCALES_DIR, `${lang}.json`);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️ ملف غير موجود: ${lang}.json`);
        continue;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(content);

        // دمج الترجمات الجديدة مع الموجودة
        deepMerge(json, newTranslations);

        // حفظ الملف
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
        console.log(`✅ تم تحديث: ${lang}.json`);
        updatedCount++;
    } catch (err) {
        console.error(`❌ خطأ في ${lang}.json:`, err.message);
    }
}

console.log(`\n🎉 تم تحديث ${updatedCount} ملف لغة!`);
