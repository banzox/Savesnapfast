
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.resolve(__dirname, '../src/locales/locales');

// The 28 target languages (excluding En/Ar which are already good)
// Based strictly on ui.ts supported list.
// fil -> maps to tl.json
const TARGET_LANGS = [
    'es', 'pt', 'id', 'fr', 'de', 'it', 'tr', 'ru',
    'vi', 'th', 'ja', 'ko', 'pl', 'nl', 'ro', 'ms',
    'uk', 'cs', 'sv', 'hu', 'el', 'da', 'fi', 'no',
    'bg', 'zh', 'hi', 'tl' // 'tl' for 'fil'
];

const TRANSLATIONS = {
    // --- Romance / European ---
    "es": {
        "downloader": { "download_zip": "Descargar Todo (ZIP)", "creating_zip": "Creando ZIP...", "save_image": "Guardar Imagen" },
        "slideshow_page": { "features": { "safe": { "title": "100% Seguro", "desc": "Descargas privadas. Sin historial." }, "anonymous": { "title": "Visor Anónimo", "desc": "Ver sin notificar al creador." } } },
        "mp3_page": { "features": { "safe": { "title": "Seguro", "desc": "Respetamos tu privacidad." }, "no_watermark": { "title": "Audio Limpio", "desc": "Sin marcas de agua." } } }
    },
    "fr": {
        "downloader": { "download_zip": "Tout Télécharger (ZIP)", "creating_zip": "Création ZIP...", "save_image": "Sauvegarder" },
        "slideshow_page": { "features": { "safe": { "title": "100% Sécurisé", "desc": "Téléchargements privés." }, "anonymous": { "title": "Anonyme", "desc": "Voir sans notification." } } },
        "mp3_page": { "features": { "safe": { "title": "Sûr", "desc": "Respect de la vie privée." }, "no_watermark": { "title": "Audio Pur", "desc": "Sans filigrane." } } }
    },
    "it": {
        "downloader": { "download_zip": "Scarica Tutto (ZIP)", "creating_zip": "Creazione ZIP...", "save_image": "Salva" },
        "slideshow_page": { "features": { "safe": { "title": "100% Sicuro", "desc": "Download privati." }, "anonymous": { "title": "Anonimo", "desc": "Visualizza senza notifica." } } },
        "mp3_page": { "features": { "safe": { "title": "Sicuro", "desc": "Privacy rispettata." }, "no_watermark": { "title": "Audio Pulito", "desc": "Nessun watermark." } } }
    },
    "pt": {
        "downloader": { "download_zip": "Baixar Tudo (ZIP)", "creating_zip": "Criando ZIP...", "save_image": "Salvar" },
        "slideshow_page": { "features": { "safe": { "title": "100% Seguro", "desc": "Downloads privados." }, "anonymous": { "title": "Anônimo", "desc": "Ver sem notificar." } } },
        "mp3_page": { "features": { "safe": { "title": "Seguro", "desc": "Privacidade garantida." }, "no_watermark": { "title": "Áudio Limpo", "desc": "Sem marca d'água." } } }
    },
    "ro": {
        "downloader": { "download_zip": "Descarcă Tot (ZIP)", "creating_zip": "Creare ZIP...", "save_image": "Salvează" },
        "slideshow_page": { "features": { "safe": { "title": "100% Sigur", "desc": "Descărcări private." }, "anonymous": { "title": "Anonim", "desc": "Vezi fără notificare." } } },
        "mp3_page": { "features": { "safe": { "title": "Sigur", "desc": "Respectăm confidențialitatea." }, "no_watermark": { "title": "Audio Curat", "desc": "Fără filigran." } } }
    },

    // --- Germanic ---
    "de": {
        "downloader": { "download_zip": "Alles Laden (ZIP)", "creating_zip": "ZIP erstellen...", "save_image": "Speichern" },
        "slideshow_page": { "features": { "safe": { "title": "100% Sicher", "desc": "Private Downloads." }, "anonymous": { "title": "Anonym", "desc": "Ohne Benachrichtigung ansehen." } } },
        "mp3_page": { "features": { "safe": { "title": "Sicher", "desc": "Privatsphäre geschützt." }, "no_watermark": { "title": "Reines Audio", "desc": "Ohne Wasserzeichen." } } }
    },
    "nl": {
        "downloader": { "download_zip": "Alles Downloaden (ZIP)", "creating_zip": "ZIP maken...", "save_image": "Opslaan" },
        "slideshow_page": { "features": { "safe": { "title": "100% Veilig", "desc": "Privé downloads." }, "anonymous": { "title": "Anoniem", "desc": "Bekijk zonder melding." } } },
        "mp3_page": { "features": { "safe": { "title": "Veilig", "desc": "Privacy gerespecteerd." }, "no_watermark": { "title": "Zuivere Audio", "desc": "Geen watermerk." } } }
    },
    "sv": {
        "downloader": { "download_zip": "Ladda ner alla (ZIP)", "creating_zip": "Skapar ZIP...", "save_image": "Spara" },
        "slideshow_page": { "features": { "safe": { "title": "100% Säkert", "desc": "Privata nedladdningar." }, "anonymous": { "title": "Anonym", "desc": "Visa utan avisering." } } },
        "mp3_page": { "features": { "safe": { "title": "Säkert", "desc": "Integritet skyddad." }, "no_watermark": { "title": "Rent Ljud", "desc": "Inget vattenmärke." } } }
    },
    "da": {
        "downloader": { "download_zip": "Download alle (ZIP)", "creating_zip": "Laver ZIP...", "save_image": "Gem" },
        "slideshow_page": { "features": { "safe": { "title": "100% Sikker", "desc": "Private downloads." }, "anonymous": { "title": "Anonym", "desc": "Se uden besked." } } },
        "mp3_page": { "features": { "safe": { "title": "Sikker", "desc": "Vi respekterer privatliv." }, "no_watermark": { "title": "Ren lyd", "desc": "Uden vandmærke." } } }
    },
    "no": {
        "downloader": { "download_zip": "Last ned alle (ZIP)", "creating_zip": "Lager ZIP...", "save_image": "Lagre" },
        "slideshow_page": { "features": { "safe": { "title": "100% Sikker", "desc": "Private nedlastinger." }, "anonymous": { "title": "Anonym", "desc": "Se uten varsel." } } },
        "mp3_page": { "features": { "safe": { "title": "Trygg", "desc": "Personvern respektert." }, "no_watermark": { "title": "Ren lyd", "desc": "Uten vannmerke." } } }
    },

    // --- Asian ---
    "id": {
        "downloader": { "download_zip": "Unduh Semua (ZIP)", "creating_zip": "Membuat ZIP...", "save_image": "Simpan" },
        "slideshow_page": { "features": { "safe": { "title": "100% Aman", "desc": "Unduhan pribadi." }, "anonymous": { "title": "Anonim", "desc": "Lihat tanpa notifikasi." } } },
        "mp3_page": { "features": { "safe": { "title": "Aman", "desc": "Privasi terjaga." }, "no_watermark": { "title": "Audio Bersih", "desc": "Tanpa tanda air." } } }
    },
    "ms": {
        "downloader": { "download_zip": "Muat Turun Semua (ZIP)", "creating_zip": "Mencipta ZIP...", "save_image": "Simpan" },
        "slideshow_page": { "features": { "safe": { "title": "100% Selamat", "desc": "Muat turun peribadi." }, "anonymous": { "title": "Tanpa Nama", "desc": "Lihat tanpa pemberitahuan." } } },
        "mp3_page": { "features": { "safe": { "title": "Selamat", "desc": "Privasi dihormati." }, "no_watermark": { "title": "Audio Bersih", "desc": "Tiada tera air." } } }
    },
    "vi": {
        "downloader": { "download_zip": "Tải Tất Cả (ZIP)", "creating_zip": "Tạo ZIP...", "save_image": "Lưu" },
        "slideshow_page": { "features": { "safe": { "title": "An Toàn 100%", "desc": "Tải xuống riêng tư." }, "anonymous": { "title": "Ẩn Danh", "desc": "Xem không thông báo." } } },
        "mp3_page": { "features": { "safe": { "title": "An Toàn", "desc": "Bảo mật quyền riêng tư." }, "no_watermark": { "title": "Âm Thanh Sạch", "desc": "Không logo." } } }
    },
    "th": {
        "downloader": { "download_zip": "ดาวน์โหลดทั้งหมด (ZIP)", "creating_zip": "กำลังสร้าง ZIP...", "save_image": "บันทึก" },
        "slideshow_page": { "features": { "safe": { "title": "ปลอดภัย 100%", "desc": "ดาวน์โหลดส่วนตัว" }, "anonymous": { "title": "นิรนาม", "desc": "ดูโดยไม่แจ้งเตือน" } } },
        "mp3_page": { "features": { "safe": { "title": "ปลอดภัย", "desc": "เคารพความเป็นส่วนตัว" }, "no_watermark": { "title": "เสียงชัดใส", "desc": "ไม่มีลายน้ำ" } } }
    },
    "ja": {
        "downloader": { "download_zip": "すべてDL (ZIP)", "creating_zip": "ZIP作成中...", "save_image": "保存" },
        "slideshow_page": { "features": { "safe": { "title": "100%安全", "desc": "プライベートなダウンロード。" }, "anonymous": { "title": "匿名", "desc": "通知せずに閲覧。" } } },
        "mp3_page": { "features": { "safe": { "title": "安全", "desc": "プライバシー保護。" }, "no_watermark": { "title": "クリアな音声", "desc": "透かしなし。" } } }
    },
    "ko": {
        "downloader": { "download_zip": "모두 다운로드 (ZIP)", "creating_zip": "ZIP 생성 중...", "save_image": "저장" },
        "slideshow_page": { "features": { "safe": { "title": "100% 안전", "desc": "비공개 다운로드." }, "anonymous": { "title": "익명", "desc": "알림 없이 보기." } } },
        "mp3_page": { "features": { "safe": { "title": "안전", "desc": "개인정보 보호." }, "no_watermark": { "title": "깨끗한 오디오", "desc": "워터마크 없음." } } }
    },
    "zh": {
        "downloader": { "download_zip": "全部下载 (ZIP)", "creating_zip": "生成 ZIP...", "save_image": "保存" },
        "slideshow_page": { "features": { "safe": { "title": "100% 安全", "desc": "私密下载。" }, "anonymous": { "title": "匿名", "desc": "查看时不通知。" } } },
        "mp3_page": { "features": { "safe": { "title": "安全", "desc": "隐私保护。" }, "no_watermark": { "title": "纯净音频", "desc": "无水印。" } } }
    },
    "tl": { // Filipino
        "downloader": { "download_zip": "I-download Lahat (ZIP)", "creating_zip": "Gumagawa ng ZIP...", "save_image": "I-save" },
        "slideshow_page": { "features": { "safe": { "title": "100% Ligtas", "desc": "Pribadong pag-download." }, "anonymous": { "title": "Incognito", "desc": "Manood nang hindi inaabisuhan." } } },
        "mp3_page": { "features": { "safe": { "title": "Ligtas", "desc": "Ginagalang ang privacy." }, "no_watermark": { "title": "Malinis na Audio", "desc": "Walang watermark." } } }
    },
    "hi": {
        "downloader": { "download_zip": "सभी डाउनलोड (ZIP)", "creating_zip": "ZIP बना रहा है...", "save_image": "सेव करें" },
        "slideshow_page": { "features": { "safe": { "title": "100% सुरक्षित", "desc": "निजी डाउनलोड।" }, "anonymous": { "title": "गुमनाम", "desc": "बिना सूचना के देखें।" } } },
        "mp3_page": { "features": { "safe": { "title": "सुरक्षित", "desc": "गोपनीयता का सम्मान।" }, "no_watermark": { "title": "साफ ऑडियो", "desc": "बिना वॉटरमार्क।" } } }
    },

    // --- Slavic / Eastern European / Others ---
    "ru": {
        "downloader": { "download_zip": "Скачать все (ZIP)", "creating_zip": "Создание ZIP...", "save_image": "Сохранить" },
        "slideshow_page": { "features": { "safe": { "title": "100% Безопасно", "desc": "Приватные загрузки." }, "anonymous": { "title": "Анонимно", "desc": "Просмотр без уведомлений." } } },
        "mp3_page": { "features": { "safe": { "title": "Безопасно", "desc": "Конфиденциальность." }, "no_watermark": { "title": "Чистый звук", "desc": "Без водяных знаков." } } }
    },
    "pl": {
        "downloader": { "download_zip": "Pobierz Wszystko (ZIP)", "creating_zip": "Tworzenie ZIP...", "save_image": "Zapisz" },
        "slideshow_page": { "features": { "safe": { "title": "100% Bezpieczne", "desc": "Prywatne pobieranie." }, "anonymous": { "title": "Anonimowy", "desc": "Oglądaj bez powiadomienia." } } },
        "mp3_page": { "features": { "safe": { "title": "Bezpieczne", "desc": "Prywatność chroniona." }, "no_watermark": { "title": "Czyste Audio", "desc": "Bez znaku wodnego." } } }
    },
    "tr": {
        "downloader": { "download_zip": "Hepsini İndir (ZIP)", "creating_zip": "ZIP Yapılıyor...", "save_image": "Kaydet" },
        "slideshow_page": { "features": { "safe": { "title": "%100 Güvenli", "desc": "Gizli indirmeler." }, "anonymous": { "title": "Anonim", "desc": "Bildirim gitmeden izle." } } },
        "mp3_page": { "features": { "safe": { "title": "Güvenli", "desc": "Gizliliğe saygı." }, "no_watermark": { "title": "Temiz Ses", "desc": "Filigran yok." } } }
    },
    "uk": {
        "downloader": { "download_zip": "Завантажити все (ZIP)", "creating_zip": "Створення ZIP...", "save_image": "Зберегти" },
        "slideshow_page": { "features": { "safe": { "title": "100% Безпечно", "desc": "Приватні завантаження." }, "anonymous": { "title": "Анонімно", "desc": "Перегляд без сповіщень." } } },
        "mp3_page": { "features": { "safe": { "title": "Безпечно", "desc": "Конфіденційність." }, "no_watermark": { "title": "Чистий звук", "desc": "Без водяних знаків." } } }
    },
    "cs": {
        "downloader": { "download_zip": "Stáhnout vše (ZIP)", "creating_zip": "Vytvářím ZIP...", "save_image": "Uložit" },
        "slideshow_page": { "features": { "safe": { "title": "100% Bezpečné", "desc": "Soukromé stahování." }, "anonymous": { "title": "Anonymní", "desc": "Prohlížet bez upozornění." } } },
        "mp3_page": { "features": { "safe": { "title": "Bezpečné", "desc": "Respektujeme soukromí." }, "no_watermark": { "title": "Čistý zvuk", "desc": "Bez vodoznaku." } } }
    },
    "hu": {
        "downloader": { "download_zip": "Összes letöltése (ZIP)", "creating_zip": "ZIP készítése...", "save_image": "Mentés" },
        "slideshow_page": { "features": { "safe": { "title": "100% Biztonságos", "desc": "Privát letöltések." }, "anonymous": { "title": "Névtelen", "desc": "Nézd meg értesítés nélkül." } } },
        "mp3_page": { "features": { "safe": { "title": "Biztonságos", "desc": "Adatvédelem." }, "no_watermark": { "title": "Tiszta Hang", "desc": "Vízjel nélkül." } } }
    },
    "el": {
        "downloader": { "download_zip": "Λήψη όλων (ZIP)", "creating_zip": "Δημιουργία ZIP...", "save_image": "Αποθήκευση" },
        "slideshow_page": { "features": { "safe": { "title": "100% Ασφαλές", "desc": "Ιδιωτικές λήψεις." }, "anonymous": { "title": "Ανώνυμη", "desc": "Προβολή χωρίς ειδοποίηση." } } },
        "mp3_page": { "features": { "safe": { "title": "Ασφαλές", "desc": "Σεβασμός στο απόρρητο." }, "no_watermark": { "title": "Καθαρός ήχος", "desc": "Χωρίς υδατογράφημα." } } }
    },
    "bg": {
        "downloader": { "download_zip": "Изтегли всички (ZIP)", "creating_zip": "Създаване ZIP...", "save_image": "Запази" },
        "slideshow_page": { "features": { "safe": { "title": "100% Сигурно", "desc": "Частни изтегляния." }, "anonymous": { "title": "Анонимно", "desc": "Без известие." } } },
        "mp3_page": { "features": { "safe": { "title": "Сигурно", "desc": "Поверителност." }, "no_watermark": { "title": "Чист звук", "desc": "Без воден знак." } } }
    },
    "fi": {
        "downloader": { "download_zip": "Lataa kaikki (ZIP)", "creating_zip": "Luodaan ZIP...", "save_image": "Tallenna" },
        "slideshow_page": { "features": { "safe": { "title": "100% Turvallinen", "desc": "Yksityiset lataukset." }, "anonymous": { "title": "Anonyymi", "desc": "Katso ilman ilmoitusta." } } },
        "mp3_page": { "features": { "safe": { "title": "Turvallinen", "desc": "Yksityisyyden suoja." }, "no_watermark": { "title": "Puhdas ääni", "desc": "Ei vesileimaa." } } }
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
    console.log(`Starting update for ${TARGET_LANGS.length} languages...`);
    const verifiedLangs = TARGET_LANGS;

    let updatedCount = 0;

    verifiedLangs.forEach(lang => {
        const filePath = path.join(LOCALES_DIR, `${lang}.json`);

        if (fs.existsSync(filePath)) {
            try {
                const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                const dict = TRANSLATIONS[lang] || TRANSLATIONS['es']; // Fallback to ES if missing (should not happen if I filled all)

                if (TRANSLATIONS[lang]) {
                    // Downloader
                    if (TRANSLATIONS[lang].downloader) {
                        for (const [k, v] of Object.entries(TRANSLATIONS[lang].downloader)) {
                            setDeep(content, `downloader.${k}`, v);
                        }
                    }
                    // Slideshow
                    if (TRANSLATIONS[lang].slideshow_page?.features) {
                        for (const [k, v] of Object.entries(TRANSLATIONS[lang].slideshow_page.features)) {
                            setDeep(content, `slideshow_page.features.${k}`, v);
                        }
                    }
                    // MP3
                    if (TRANSLATIONS[lang].mp3_page?.features) {
                        for (const [k, v] of Object.entries(TRANSLATIONS[lang].mp3_page.features)) {
                            setDeep(content, `mp3_page.features.${k}`, v);
                        }
                    }
                } else {
                    console.warn(`WARNING: No dictionary found for ${lang}, skipping patches.`);
                }

                fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
                console.log(`✅ ${lang} updated.`);
                updatedCount++;
            } catch (e) {
                console.error(`❌ Error ${lang}: ${e.message}`);
            }
        } else {
            console.log(`Skipping ${lang} (file not found).`);
        }
    });

    console.log(`Done. Updated ${updatedCount} files.`);
}

run();
