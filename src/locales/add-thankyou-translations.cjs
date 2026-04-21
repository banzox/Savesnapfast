const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');

const translations = {
  en: {
    download_another: "Download Another Video",
    thank_you_title: "Download Started!",
    thank_you_msg: "Check your downloads folder"
  },
  ar: {
    download_another: "تحميل فيديو آخر",
    thank_you_title: "بدأ التحميل!",
    thank_you_msg: "تحقق من مجلد التنزيلات الخاصة بك"
  },
  bg: {
    download_another: "Изтегли друго видео",
    thank_you_title: "Изтеглянето започна!",
    thank_you_msg: "Проверете папката си за изтегляния"
  },
  cs: {
    download_another: "Stáhnout další video",
    thank_you_title: "Stahování začalo!",
    thank_you_msg: "Zkontrolujte složku se staženými soubory"
  },
  da: {
    download_another: "Download en anden video",
    thank_you_title: "Download startet!",
    thank_you_msg: "Tjek din downloadmappe"
  },
  de: {
    download_another: "Anderes Video herunterladen",
    thank_you_title: "Download gestartet!",
    thank_you_msg: "Überprüfe deinen Download-Ordner"
  },
  el: {
    download_another: "Λήψη άλλου βίντεο",
    thank_you_title: "Η λήψη ξεκίνησε!",
    thank_you_msg: "Ελέγξτε το φάκελο λήψεων"
  },
  es: {
    download_another: "Descargar otro video",
    thank_you_title: "¡Descarga iniciada!",
    thank_you_msg: "Revisa tu carpeta de descargas"
  },
  fi: {
    download_another: "Lataa toinen video",
    thank_you_title: "Lataus aloitettu!",
    thank_you_msg: "Tarkista latauskansiosi"
  },
  fil: {
    download_another: "Mag-download ng Ibang Video",
    thank_you_title: "Nagsimula na ang Download!",
    thank_you_msg: "Tingnan ang iyong downloads folder"
  },
  fr: {
    download_another: "Télécharger une autre vidéo",
    thank_you_title: "Téléchargement lancé !",
    thank_you_msg: "Vérifiez votre dossier de téléchargements"
  },
  hi: {
    download_another: "एक और वीडियो डाउनलोड करें",
    thank_you_title: "डाउनलोड शुरू हो गया!",
    thank_you_msg: "अपना डाउनलोड फ़ोल्डर जांचें"
  },
  hu: {
    download_another: "Másik videó letöltése",
    thank_you_title: "Letöltés elindítva!",
    thank_you_msg: "Ellenőrizd a letöltések mappát"
  },
  id: {
    download_another: "Unduh Video Lain",
    thank_you_title: "Unduhan Dimulai!",
    thank_you_msg: "Periksa folder unduhan Anda"
  },
  it: {
    download_another: "Scarica un altro video",
    thank_you_title: "Download avviato!",
    thank_you_msg: "Controlla la tua cartella download"
  },
  ja: {
    download_another: "別の動画をダウンロード",
    thank_you_title: "ダウンロード開始！",
    thank_you_msg: "ダウンロードフォルダを確認してください"
  },
  ko: {
    download_another: "다른 비디오 다운로드",
    thank_you_title: "다운로드 시작됨!",
    thank_you_msg: "다운로드 폴더를 확인하세요"
  },
  ms: {
    download_another: "Muat Turun Video Lain",
    thank_you_title: "Muat Turun Bermula!",
    thank_you_msg: "Semak folder muat turun anda"
  },
  nl: {
    download_another: "Nog een video downloaden",
    thank_you_title: "Download gestart!",
    thank_you_msg: "Controleer je downloadsmap"
  },
  no: {
    download_another: "Last ned en annen video",
    thank_you_title: "Nedlasting startet!",
    thank_you_msg: "Sjekk nedlastingsmappen din"
  },
  pl: {
    download_another: "Pobierz inne wideo",
    thank_you_title: "Pobieranie rozpoczęte!",
    thank_you_msg: "Sprawdź folder pobranych plików"
  },
  pt: {
    download_another: "Baixar outro vídeo",
    thank_you_title: "Download Iniciado!",
    thank_you_msg: "Verifique sua pasta de downloads"
  },
  ro: {
    download_another: "Descarcă alt videoclip",
    thank_you_title: "Descărcarea a început!",
    thank_you_msg: "Verifică folderul de descărcări"
  },
  ru: {
    download_another: "Скачать другое видео",
    thank_you_title: "Загрузка началась!",
    thank_you_msg: "Проверьте папку загрузок"
  },
  sv: {
    download_another: "Ladda ner en annan video",
    thank_you_title: "Nedladdning startad!",
    thank_you_msg: "Kolla din nedladdningsmapp"
  },
  th: {
    download_another: "ดาวน์โหลดวิดีโออื่น",
    thank_you_title: "เริ่มการดาวน์โหลดแล้ว!",
    thank_you_msg: "ตรวจสอบโฟลเดอร์ดาวน์โหลดของคุณ"
  },
  tr: {
    download_another: "Başka Bir Video İndir",
    thank_you_title: "İndirme Başladı!",
    thank_you_msg: "İndirmeler klasörünüzü kontrol edin"
  },
  uk: {
    download_another: "Завантажити інше відео",
    thank_you_title: "Завантаження почалося!",
    thank_you_msg: "Перевірте папку завантажень"
  },
  vi: {
    download_another: "Tải video khác",
    thank_you_title: "Đã bắt đầu tải xuống!",
    thank_you_msg: "Kiểm tra thư mục tải xuống của bạn"
  },
  zh: {
    download_another: "下载另一个视频",
    thank_you_title: "下载已开始！",
    thank_you_msg: "请检查您的下载文件夹"
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
