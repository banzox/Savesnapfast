const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');

const translations = {
  en: {
    check_new_tab: "A new tab just opened — check it out while you wait!",
    preparing_download: "Preparing your download...",
    countdown_msg: "File will download automatically",
    modal_ad_text: "Special offer just for you — tap to claim!",
    skip_download: "Skip & Download Now"
  },
  ar: {
    check_new_tab: "تم فتح تبويب جديد — تفقّده أثناء الانتظار!",
    preparing_download: "جارٍ تحضير ملفك...",
    countdown_msg: "سيبدأ التحميل تلقائياً",
    modal_ad_text: "عرض حصري لك — انقر للمطالبة!",
    skip_download: "تخطَّ وحمِّل الآن"
  },
  bg: {
    check_new_tab: "Отвори се нов раздел — разгледай го, докато чакаш!",
    preparing_download: "Подготвяме вашия файл...",
    countdown_msg: "Изтеглянето ще започне автоматично",
    modal_ad_text: "Специална оферта само за теб — натисни за повече!",
    skip_download: "Пропусни и изтегли сега"
  },
  cs: {
    check_new_tab: "Otevřela se nová karta — podívej se na ni, než čekáš!",
    preparing_download: "Připravujeme váš soubor...",
    countdown_msg: "Stahování začne automaticky",
    modal_ad_text: "Speciální nabídka jen pro vás — klikněte pro více!",
    skip_download: "Přeskočit a stáhnout nyní"
  },
  da: {
    check_new_tab: "En ny fane er åbnet — tjek den ud, mens du venter!",
    preparing_download: "Forbereder din fil...",
    countdown_msg: "Downloaden starter automatisk",
    modal_ad_text: "Specialtilbud til dig — tryk for at kræve det!",
    skip_download: "Spring over og download nu"
  },
  de: {
    check_new_tab: "Ein neuer Tab wurde geöffnet — sieh ihn dir an, während du wartest!",
    preparing_download: "Deine Datei wird vorbereitet...",
    countdown_msg: "Download startet automatisch",
    modal_ad_text: "Exklusives Angebot für dich — jetzt ansehen!",
    skip_download: "Überspringen & Jetzt downloaden"
  },
  el: {
    check_new_tab: "Άνοιξε νέα καρτέλα — δες την ενώ περιμένεις!",
    preparing_download: "Προετοιμασία αρχείου...",
    countdown_msg: "Η λήψη θα ξεκινήσει αυτόματα",
    modal_ad_text: "Ειδική προσφορά μόνο για σένα — πάτα για να τη δεις!",
    skip_download: "Παράλειψη & Λήψη τώρα"
  },
  es: {
    check_new_tab: "Se abrió una nueva pestaña — ¡échale un vistazo mientras esperas!",
    preparing_download: "Preparando tu archivo...",
    countdown_msg: "La descarga comenzará automáticamente",
    modal_ad_text: "¡Oferta especial para ti — toca para reclamar!",
    skip_download: "Omitir y Descargar Ahora"
  },
  fi: {
    check_new_tab: "Uusi välilehti avautui — katso sitä odottaessasi!",
    preparing_download: "Valmistellaan tiedostoasi...",
    countdown_msg: "Lataus alkaa automaattisesti",
    modal_ad_text: "Erikoistarjous juuri sinulle — napauta lunastaksesi!",
    skip_download: "Ohita ja lataa nyt"
  },
  fil: {
    check_new_tab: "Bumukas ang bagong tab — tingnan ito habang naghihintay!",
    preparing_download: "Inihahanda ang iyong file...",
    countdown_msg: "Awtomatikong magsisimula ang pag-download",
    modal_ad_text: "Espesyal na alok para sa iyo — i-tap para i-claim!",
    skip_download: "I-skip at I-download Na"
  },
  fr: {
    check_new_tab: "Un nouvel onglet vient de s'ouvrir — consultez-le pendant que vous attendez!",
    preparing_download: "Préparation de votre fichier...",
    countdown_msg: "Le téléchargement démarrera automatiquement",
    modal_ad_text: "Offre spéciale pour vous — appuyez pour en profiter!",
    skip_download: "Passer & Télécharger maintenant"
  },
  hi: {
    check_new_tab: "एक नया टैब खुला — प्रतीक्षा करते समय इसे देखें!",
    preparing_download: "आपकी फ़ाइल तैयार की जा रही है...",
    countdown_msg: "डाउनलोड अपने आप शुरू होगा",
    modal_ad_text: "आपके लिए खास ऑफर — क्लेम करने के लिए टैप करें!",
    skip_download: "छोड़ें और अभी डाउनलोड करें"
  },
  hu: {
    check_new_tab: "Megnyílt egy új lap — nézd meg, amíg várakozol!",
    preparing_download: "A fájlod előkészítése...",
    countdown_msg: "A letöltés automatikusan indul",
    modal_ad_text: "Különleges ajánlat neked — kattints a részletekért!",
    skip_download: "Kihagyás és Letöltés most"
  },
  id: {
    check_new_tab: "Tab baru dibuka — lihat sebentar saat menunggu!",
    preparing_download: "Menyiapkan file Anda...",
    countdown_msg: "Unduhan akan dimulai secara otomatis",
    modal_ad_text: "Penawaran spesial untukmu — tap untuk klaim!",
    skip_download: "Lewati & Unduh Sekarang"
  },
  it: {
    check_new_tab: "Si è aperta una nuova scheda — dai un'occhiata mentre aspetti!",
    preparing_download: "Preparazione del file...",
    countdown_msg: "Il download inizierà automaticamente",
    modal_ad_text: "Offerta speciale per te — tocca per approfittarne!",
    skip_download: "Salta e Scarica Ora"
  },
  ja: {
    check_new_tab: "新しいタブが開きました — 待っている間にチェックしてください！",
    preparing_download: "ファイルを準備しています...",
    countdown_msg: "ダウンロードが自動的に開始されます",
    modal_ad_text: "あなただけの特別オファー — タップして入手！",
    skip_download: "スキップして今すぐダウンロード"
  },
  ko: {
    check_new_tab: "새 탭이 열렸습니다 — 기다리는 동안 확인해 보세요!",
    preparing_download: "파일을 준비하는 중...",
    countdown_msg: "다운로드가 자동으로 시작됩니다",
    modal_ad_text: "당신을 위한 특별 혜택 — 탭해서 받아가세요!",
    skip_download: "건너뛰고 지금 다운로드"
  },
  ms: {
    check_new_tab: "Tab baharu dibuka — semak semasa menunggu!",
    preparing_download: "Menyediakan fail anda...",
    countdown_msg: "Muat turun akan bermula secara automatik",
    modal_ad_text: "Tawaran istimewa untuk anda — ketik untuk tuntut!",
    skip_download: "Langkau & Muat Turun Sekarang"
  },
  nl: {
    check_new_tab: "Een nieuw tabblad is geopend — bekijk het terwijl je wacht!",
    preparing_download: "Je bestand wordt voorbereid...",
    countdown_msg: "Download start automatisch",
    modal_ad_text: "Speciaal aanbod voor jou — tik om te claimen!",
    skip_download: "Overslaan & Nu Downloaden"
  },
  no: {
    check_new_tab: "En ny fane ble åpnet — sjekk den mens du venter!",
    preparing_download: "Forbereder filen din...",
    countdown_msg: "Nedlastingen starter automatisk",
    modal_ad_text: "Spesialtilbud bare for deg — trykk for å kreve det!",
    skip_download: "Hopp over og last ned nå"
  },
  pl: {
    check_new_tab: "Otwarto nową kartę — sprawdź ją, czekając!",
    preparing_download: "Przygotowujemy twój plik...",
    countdown_msg: "Pobieranie rozpocznie się automatycznie",
    modal_ad_text: "Specjalna oferta tylko dla Ciebie — kliknij, by ją odebrać!",
    skip_download: "Pomiń i Pobierz Teraz"
  },
  pt: {
    check_new_tab: "Uma nova aba foi aberta — confira enquanto espera!",
    preparing_download: "Preparando seu arquivo...",
    countdown_msg: "O download iniciará automaticamente",
    modal_ad_text: "Oferta especial para você — toque para resgatar!",
    skip_download: "Pular e Baixar Agora"
  },
  ro: {
    check_new_tab: "S-a deschis o filă nouă — verifică-o cât timp aștepți!",
    preparing_download: "Se pregătește fișierul...",
    countdown_msg: "Descărcarea va începe automat",
    modal_ad_text: "Ofertă specială pentru tine — atinge pentru a o revendica!",
    skip_download: "Sari și Descarcă Acum"
  },
  ru: {
    check_new_tab: "Открылась новая вкладка — загляни в неё, пока ждёшь!",
    preparing_download: "Подготовка файла...",
    countdown_msg: "Загрузка начнётся автоматически",
    modal_ad_text: "Специальное предложение для тебя — нажми, чтобы получить!",
    skip_download: "Пропустить и Скачать сейчас"
  },
  sv: {
    check_new_tab: "En ny flik öppnades — kolla in den medan du väntar!",
    preparing_download: "Förbereder din fil...",
    countdown_msg: "Nedladdningen startar automatiskt",
    modal_ad_text: "Specialerbjudande bara för dig — tryck för att hämta!",
    skip_download: "Hoppa över och Ladda Ner nu"
  },
  th: {
    check_new_tab: "เปิดแท็บใหม่แล้ว — ลองดูขณะรอดาวน์โหลด!",
    preparing_download: "กำลังเตรียมไฟล์...",
    countdown_msg: "การดาวน์โหลดจะเริ่มต้นโดยอัตโนมัติ",
    modal_ad_text: "ข้อเสนอพิเศษสำหรับคุณ — แตะเพื่อรับ!",
    skip_download: "ข้ามและดาวน์โหลดเดี๋ยวนี้"
  },
  tr: {
    check_new_tab: "Yeni bir sekme açıldı — beklerken bir göz at!",
    preparing_download: "Dosyanız hazırlanıyor...",
    countdown_msg: "İndirme otomatik olarak başlayacak",
    modal_ad_text: "Sana özel teklif — almak için dokun!",
    skip_download: "Atla ve Şimdi İndir"
  },
  uk: {
    check_new_tab: "Відкрилася нова вкладка — переглянь її, поки чекаєш!",
    preparing_download: "Підготовка файлу...",
    countdown_msg: "Завантаження розпочнеться автоматично",
    modal_ad_text: "Спеціальна пропозиція для тебе — натисни, щоб отримати!",
    skip_download: "Пропустити і Завантажити зараз"
  },
  vi: {
    check_new_tab: "Một tab mới vừa mở — xem qua trong lúc chờ đợi!",
    preparing_download: "Đang chuẩn bị tệp của bạn...",
    countdown_msg: "Tải xuống sẽ bắt đầu tự động",
    modal_ad_text: "Ưu đãi đặc biệt dành cho bạn — nhấn để nhận!",
    skip_download: "Bỏ qua và Tải Về Ngay"
  },
  zh: {
    check_new_tab: "新标签页已打开 — 等待时去看看吧！",
    preparing_download: "正在准备您的文件...",
    countdown_msg: "下载将自动开始",
    modal_ad_text: "专属特别优惠 — 点击立即领取！",
    skip_download: "跳过并立即下载"
  }
};

let updated = 0;
let skipped = 0;

for (const [lang, keys] of Object.entries(translations)) {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${lang}.json`);
    skipped++;
    continue;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Add keys to downloader section
  if (!data.downloader) data.downloader = {};
  let changed = false;
  for (const [key, value] of Object.entries(keys)) {
    if (!data.downloader[key]) {
      data.downloader[key] = value;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Updated: ${lang}.json`);
    updated++;
  } else {
    console.log(`ℹ️  Already has keys: ${lang}.json`);
    skipped++;
  }
}

console.log(`\n🎉 Done! Updated: ${updated} files | Skipped: ${skipped} files`);
