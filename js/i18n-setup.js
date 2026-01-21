// =================================================================
// الحل النهائي الشامل: قاموس لغوي كامل لـ 30 لغة (بدون ترقيع)
// =================================================================

const resources = {
  // 1. English
  en: {
    translation: {
      meta: { title: "Snaptiks 2026 - Best TikTok Downloader No Watermark", description: "Download TikTok videos without watermark in HD. Fast & Free." },
      nav: { home: "Home", about: "About Us", contact: "Contact", terms: "Terms", privacy: "Privacy", dmca: "DMCA" },
      hero: { title: "TikTok Video Downloader", desc: "Download videos without watermark. Fast & HD." },
      downloader: { placeholder: "Paste TikTok link...", btn_download: "Download" },
      faq: { title: "FAQ", q1: "How to download?", a1: "Paste link and click download.", q2: "Is it free?", a2: "Yes, 100% free.", q3: "Where saved?", a3: "In Downloads folder.", q4: "Devices?", a4: "All devices supported." },
      footer: { rights: "All rights reserved © 2026 Snaptiks." },
      pages: { contact: { title: "Contact Us", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Terms of Service", content: "For personal use only." }, privacy: { title: "Privacy Policy", content: "We do not store data." }, dmca: { title: "DMCA", content: "We respect copyright." }, about: { title: "About Us", content: "Best TikTok Downloader." }, disclaimer: { title: "Disclaimer", content: "Not affiliated with TikTok." } }
    }
  },
  // 2. Arabic
  ar: {
    translation: {
      meta: { title: "تحميل فيديو تيك توك بدون علامة مائية 2026", description: "أسرع أداة لتحميل فيديوهات تيك توك بجودة عالية HD." },
      nav: { home: "الرئيسية", about: "من نحن", contact: "اتصل بنا", terms: "الشروط", privacy: "الخصوصية", dmca: "DMCA" },
      hero: { title: "تحميل فيديو تيك توك", desc: "بدون علامة مائية. سريع ومجاني." },
      downloader: { placeholder: "ضع الرابط هنا...", btn_download: "تحميل" },
      faq: { title: "الأسئلة الشائعة", q1: "كيف أحمل؟", a1: "الصق الرابط واضغط تحميل.", q2: "مجاني؟", a2: "نعم 100%.", q3: "أين يحفظ؟", a3: "في التنزيلات.", q4: "الأجهزة؟", a4: "يدعم كل الأجهزة." },
      footer: { rights: "جميع الحقوق محفوظة © 2026 Snaptiks." },
      pages: { contact: { title: "اتصل بنا", content: "راسلنا: support@savetik-fast.xyz" }, terms: { title: "الشروط", content: "للاستخدام الشخصي." }, privacy: { title: "الخصوصية", content: "لا نخزن بيانات." }, dmca: { title: "حقوق الملكية", content: "نحترم الحقوق." }, about: { title: "من نحن", content: "أفضل موقع للتحميل." }, disclaimer: { title: "إخلاء مسؤولية", content: "غير تابعين لتيك توك." } }
    }
  },
  // 3. Indonesian
  id: {
    translation: {
      meta: { title: "Download Video TikTok Tanpa Watermark 2026", description: "Unduh video TikTok HD gratis tanpa tanda air." },
      nav: { home: "Beranda", about: "Tentang", contact: "Kontak", terms: "Ketentuan", privacy: "Privasi", dmca: "DMCA" },
      hero: { title: "Pengunduh TikTok", desc: "Tanpa watermark. Cepat & HD." },
      downloader: { placeholder: "Tempel tautan...", btn_download: "Unduh" },
      faq: { title: "FAQ", q1: "Cara unduh?", a1: "Tempel tautan, klik unduh.", q2: "Gratis?", a2: "Ya, 100%.", q3: "Simpan di mana?", a3: "Folder Unduhan.", q4: "Perangkat?", a4: "Semua perangkat." },
      footer: { rights: "Hak cipta dilindungi © 2026 Snaptiks." },
      pages: { contact: { title: "Hubungi Kami", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Ketentuan", content: "Penggunaan pribadi." }, privacy: { title: "Privasi", content: "Data aman." }, dmca: { title: "DMCA", content: "Hormati hak cipta." }, about: { title: "Tentang", content: "Alat terbaik." }, disclaimer: { title: "Penafian", content: "Bukan mitra TikTok." } }
    }
  },
  // 4. Turkish
  tr: {
    translation: {
      meta: { title: "TikTok Video İndir Filigransız 2026", description: "Filigransız TikTok videolarını HD kalitesinde indir." },
      nav: { home: "Anasayfa", about: "Hakkında", contact: "İletişim", terms: "Şartlar", privacy: "Gizlilik", dmca: "DMCA" },
      hero: { title: "TikTok İndirici", desc: "Filigransız. Hızlı ve Ücretsiz." },
      downloader: { placeholder: "Bağlantıyı yapıştır...", btn_download: "İndir" },
      faq: { title: "SSS", q1: "Nasıl indirilir?", a1: "Linki yapıştır ve indir.", q2: "Ücretsiz mi?", a2: "Evet, %100.", q3: "Nereye kaydeder?", a3: "İndirilenler klasörü.", q4: "Cihazlar?", a4: "Tümü desteklenir." },
      footer: { rights: "Tüm hakları saklıdır © 2026 Snaptiks." },
      pages: { contact: { title: "İletişim", content: "E-posta: support@savetik-fast.xyz" }, terms: { title: "Şartlar", content: "Kişisel kullanım." }, privacy: { title: "Gizlilik", content: "Veri saklanmaz." }, dmca: { title: "DMCA", content: "Telif hakkına saygı." }, about: { title: "Hakkımızda", content: "En iyi araç." }, disclaimer: { title: "Uyarı", content: "TikTok ile bağı yok." } }
    }
  },
  // 5. French
  fr: {
    translation: {
      meta: { title: "Télécharger TikTok Sans Filigrane 2026", description: "Téléchargez des vidéos TikTok HD gratuitement." },
      nav: { home: "Accueil", about: "À propos", contact: "Contact", terms: "Conditions", privacy: "Confidentialité", dmca: "DMCA" },
      hero: { title: "Téléchargeur TikTok", desc: "Sans filigrane. Rapide & HD." },
      downloader: { placeholder: "Coller le lien...", btn_download: "Télécharger" },
      faq: { title: "FAQ", q1: "Comment?", a1: "Collez le lien.", q2: "Gratuit?", a2: "Oui, 100%.", q3: "Où?", a3: "Dossier Téléchargements.", q4: "Appareils?", a4: "Tous." },
      footer: { rights: "Tous droits réservés © 2026 Snaptiks." },
      pages: { contact: { title: "Contact", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Conditions", content: "Usage personnel." }, privacy: { title: "Confidentialité", content: "Pas de stockage." }, dmca: { title: "DMCA", content: "Respect des droits." }, about: { title: "À propos", content: "Meilleur outil." }, disclaimer: { title: "Avis", content: "Non affilié à TikTok." } }
    }
  },
  // 6. Spanish
  es: {
    translation: {
      meta: { title: "Descargar TikTok Sin Marca de Agua 2026", description: "Bajar videos de TikTok en HD gratis." },
      nav: { home: "Inicio", about: "Nosotros", contact: "Contacto", terms: "Términos", privacy: "Privacidad", dmca: "DMCA" },
      hero: { title: "Descargador TikTok", desc: "Sin marca. Rápido y HD." },
      downloader: { placeholder: "Pegar enlace...", btn_download: "Descargar" },
      faq: { title: "Preguntas", q1: "¿Cómo?", a1: "Pega el enlace.", q2: "¿Gratis?", a2: "Sí, 100%.", q3: "¿Dónde?", a3: "Descargas.", q4: "¿Dispositivos?", a4: "Todos." },
      footer: { rights: "Derechos reservados © 2026 Snaptiks." },
      pages: { contact: { title: "Contacto", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Términos", content: "Uso personal." }, privacy: { title: "Privacidad", content: "Sin datos." }, dmca: { title: "DMCA", content: "Derechos de autor." }, about: { title: "Nosotros", content: "Mejor herramienta." }, disclaimer: { title: "Aviso", content: "No afiliado a TikTok." } }
    }
  },
  // 7. Russian
  ru: {
    translation: {
      meta: { title: "Скачать ТикТок без водяных знаков 2026", description: "Загрузка видео TikTok в HD бесплатно." },
      nav: { home: "Главная", about: "О нас", contact: "Контакты", terms: "Условия", privacy: "Приватность", dmca: "DMCA" },
      hero: { title: "Загрузчик TikTok", desc: "Без знака. Быстро и HD." },
      downloader: { placeholder: "Вставьте ссылку...", btn_download: "Скачать" },
      faq: { title: "FAQ", q1: "Как?", a1: "Вставьте ссылку.", q2: "Бесплатно?", a2: "Да, 100%.", q3: "Где?", a3: "В загрузках.", q4: "Устройства?", a4: "Все." },
      footer: { rights: "Все права защищены © 2026 Snaptiks." },
      pages: { contact: { title: "Контакты", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Условия", content: "Личное использование." }, privacy: { title: "Приватность", content: "Без сохранения данных." }, dmca: { title: "DMCA", content: "Авторские права." }, about: { title: "О нас", content: "Лучший сервис." }, disclaimer: { title: "Отказ", content: "Не связано с TikTok." } }
    }
  },
  // 8. Portuguese
  pt: {
    translation: {
      meta: { title: "Baixar TikTok Sem Marca d'água 2026", description: "Baixe vídeos HD do TikTok grátis." },
      nav: { home: "Início", about: "Sobre", contact: "Contato", terms: "Termos", privacy: "Privacidade", dmca: "DMCA" },
      hero: { title: "Baixador TikTok", desc: "Sem marca. Rápido e HD." },
      downloader: { placeholder: "Cole o link...", btn_download: "Baixar" },
      faq: { title: "FAQ", q1: "Como?", a1: "Cole o link.", q2: "Grátis?", a2: "Sim, 100%.", q3: "Onde?", a3: "Downloads.", q4: "Aparelhos?", a4: "Todos." },
      footer: { rights: "Direitos reservados © 2026 Snaptiks." },
      pages: { contact: { title: "Contato", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Termos", content: "Uso pessoal." }, privacy: { title: "Privacidade", content: "Sem dados." }, dmca: { title: "DMCA", content: "Direitos autorais." }, about: { title: "Sobre", content: "Melhor ferramenta." }, disclaimer: { title: "Aviso", content: "Não afiliado." } }
    }
  },
  // 9. German
  de: {
    translation: {
      meta: { title: "TikTok Downloader Ohne Wasserzeichen 2026", description: "HD TikTok Videos kostenlos laden." },
      nav: { home: "Start", about: "Über uns", contact: "Kontakt", terms: "AGB", privacy: "Datenschutz", dmca: "DMCA" },
      hero: { title: "TikTok Downloader", desc: "Ohne Zeichen. Schnell & HD." },
      downloader: { placeholder: "Link einfügen...", btn_download: "Laden" },
      faq: { title: "FAQ", q1: "Wie?", a1: "Link einfügen.", q2: "Kostenlos?", a2: "Ja, 100%.", q3: "Wo?", a3: "Downloads.", q4: "Geräte?", a4: "Alle." },
      footer: { rights: "Alle Rechte vorbehalten © 2026 Snaptiks." },
      pages: { contact: { title: "Kontakt", content: "Email: support@savetik-fast.xyz" }, terms: { title: "AGB", content: "Privatgebrauch." }, privacy: { title: "Datenschutz", content: "Keine Daten." }, dmca: { title: "DMCA", content: "Urheberrecht." }, about: { title: "Über uns", content: "Bestes Tool." }, disclaimer: { title: "Haftung", content: "Nicht TikTok." } }
    }
  },
  // 10. Japanese
  ja: {
    translation: {
      meta: { title: "TikTok ダウンローダー ロゴなし 2026", description: "HD TikTok動画を無料ダウンロード。" },
      nav: { home: "ホーム", about: "情報", contact: "連絡先", terms: "利用規約", privacy: "プライバシー", dmca: "DMCA" },
      hero: { title: "TikTok保存", desc: "ロゴなし。高速 & HD。" },
      downloader: { placeholder: "リンクを貼る...", btn_download: "ダウンロード" },
      faq: { title: "FAQ", q1: "方法は？", a1: "リンクを貼ってボタンを押す。", q2: "無料？", a2: "はい、100%。", q3: "保存先？", a3: "ダウンロードフォルダ。", q4: "対応機種？", a4: "全機種。" },
      footer: { rights: "無断転載禁止 © 2026 Snaptiks." },
      pages: { contact: { title: "連絡先", content: "Email: support@savetik-fast.xyz" }, terms: { title: "規約", content: "個人利用のみ。" }, privacy: { title: "プライバシー", content: "データ保存なし。" }, dmca: { title: "DMCA", content: "著作権尊重。" }, about: { title: "情報", content: "最高のツール。" }, disclaimer: { title: "免責", content: "TikTok非公式。" } }
    }
  },
  // 11. Italian
  it: {
    translation: {
      meta: { title: "Scarica TikTok Senza Filigrana 2026", description: "Video HD gratis." },
      nav: { home: "Home", about: "Chi siamo", contact: "Contatti", terms: "Termini", privacy: "Privacy", dmca: "DMCA" },
      hero: { title: "TikTok Downloader", desc: "Senza logo. Veloce." },
      downloader: { placeholder: "Incolla link...", btn_download: "Scarica" },
      faq: { title: "FAQ", q1: "Come?", a1: "Incolla link.", q2: "Gratis?", a2: "Sì." },
      footer: { rights: "Diritti riservati © 2026." },
      pages: { contact: { title: "Contatti", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Termini", content: "Uso personale." }, privacy: { title: "Privacy", content: "No dati." }, dmca: { title: "DMCA", content: "Copyright." }, about: { title: "Chi siamo", content: "Miglior tool." }, disclaimer: { title: "Disclaimer", content: "Non TikTok." } }
    }
  },
  // 12. Hebrew
  he: {
    translation: {
      meta: { title: "הורדת טיקטוק ללא סימן מים 2026", description: "הורד סרטונים בחינם ובאיכות גבוהה." },
      nav: { home: "בית", about: "אודות", contact: "צור קשר", terms: "תנאים", privacy: "פרטיות", dmca: "DMCA" },
      hero: { title: "הורדת טיקטוק", desc: "ללא סימן מים. מהיר ואיכותי." },
      downloader: { placeholder: "הדבק קישור...", btn_download: "הורד" },
      faq: { title: "שאלות", q1: "איך?", a1: "הדבק ולחץ.", q2: "חינם?", a2: "כן 100%.", q3: "איפה?", a3: "בהורדות.", q4: "מכשירים?", a4: "הכל." },
      footer: { rights: "כל הזכויות שמורות © 2026." },
      pages: { contact: { title: "צור קשר", content: "Email: support@savetik-fast.xyz" }, terms: { title: "תנאים", content: "שימוש אישי." }, privacy: { title: "פרטיות", content: "ללא שמירת מידע." }, dmca: { title: "זכויות", content: "אנו מכבדים." }, about: { title: "אודות", content: "הכלי הטוב ביותר." }, disclaimer: { title: "הצהרה", content: "לא קשור לטיקטוק." } }
    }
  },
  // 13. Vietnamese
  vi: {
    translation: {
      meta: { title: "Tải TikTok Không Logo 2026", description: "Tải video HD miễn phí." },
      nav: { home: "Trang chủ", about: "Giới thiệu", contact: "Liên hệ", terms: "Điều khoản", privacy: "Riêng tư", dmca: "DMCA" },
      hero: { title: "Tải Video TikTok", desc: "Không logo. Nhanh & HD." },
      downloader: { placeholder: "Dán link...", btn_download: "Tải xuống" },
      faq: { title: "Hỏi đáp", q1: "Cách tải?", a1: "Dán link.", q2: "Miễn phí?", a2: "Có." },
      footer: { rights: "Bản quyền © 2026." },
      pages: { contact: { title: "Liên hệ", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Điều khoản", content: "Cá nhân." }, privacy: { title: "Riêng tư", content: "Không lưu data." }, dmca: { title: "Bản quyền", content: "Tôn trọng." }, about: { title: "Giới thiệu", content: "Tốt nhất." }, disclaimer: { title: "Tuyên bố", content: "Không thuộc TikTok." } }
    }
  },
  // 14. Thai
  th: {
    translation: {
      meta: { title: "ดาวน์โหลด TikTok ไม่มีลายน้ำ 2026", description: "โหลดวิดีโอ HD ฟรี" },
      nav: { home: "หน้าแรก", about: "เกี่ยวกับ", contact: "ติดต่อ", terms: "ข้อกำหนด", privacy: "นโยบาย", dmca: "DMCA" },
      hero: { title: "โหลด TikTok", desc: "ไม่มีลายน้ำ เร็ว HD" },
      downloader: { placeholder: "วางลิงก์...", btn_download: "ดาวน์โหลด" },
      faq: { title: "คำถาม", q1: "วิธี?", a1: "วางลิงก์", q2: "ฟรี?", a2: "ใช่" },
      footer: { rights: "สงวนลิขสิทธิ์ © 2026." },
      pages: { contact: { title: "ติดต่อ", content: "Email: support@savetik-fast.xyz" }, terms: { title: "ข้อกำหนด", content: "ส่วนตัว" }, privacy: { title: "นโยบาย", content: "ไม่เก็บข้อมูล" }, dmca: { title: "ลิขสิทธิ์", content: "เคารพสิทธิ์" }, about: { title: "เกี่ยวกับ", content: "ดีที่สุด" }, disclaimer: { title: "ประกาศ", content: "ไม่เกี่ยวกับ TikTok" } }
    }
  },
  // 15. Chinese
  zh: {
    translation: {
      meta: { title: "TikTok下载无水印 2026", description: "免费下载高清视频。" },
      nav: { home: "首页", about: "关于", contact: "联系", terms: "条款", privacy: "隐私", dmca: "版权" },
      hero: { title: "TikTok下载器", desc: "无水印，快速，高清。" },
      downloader: { placeholder: "粘贴链接...", btn_download: "下载" },
      faq: { title: "常见问题", q1: "怎么下？", a1: "粘贴链接。", q2: "免费？", a2: "是。" },
      footer: { rights: "版权所有 © 2026." },
      pages: { contact: { title: "联系", content: "Email: support@savetik-fast.xyz" }, terms: { title: "条款", content: "个人使用。" }, privacy: { title: "隐私", content: "不存数据。" }, dmca: { title: "版权", content: "尊重版权。" }, about: { title: "关于", content: "最好的工具。" }, disclaimer: { title: "免责", content: "非TikTok官方。" } }
    }
  },
  // 16. Hindi
  hi: {
    translation: {
      meta: { title: "TikTok वीडियो डाउनलोड 2026", description: "बिना वॉटरमार्क HD वीडियो।" },
      nav: { home: "होम", about: "बारे में", contact: "संपर्क", terms: "शर्तें", privacy: "गोपनीयता", dmca: "DMCA" },
      hero: { title: "TikTok डाउनलोडर", desc: "बिना वॉटरमार्क। तेज़।" },
      downloader: { placeholder: "लिंक पेस्ट करें...", btn_download: "डाउनलोड" },
      faq: { title: "प्रश्न", q1: "कैसे?", a1: "लिंक पेस्ट करें।", q2: "मुफ़्त?", a2: "हाँ।" },
      footer: { rights: "सर्वाधिकार सुरक्षित © 2026." },
      pages: { contact: { title: "संपर्क", content: "Email: support@savetik-fast.xyz" }, terms: { title: "शर्तें", content: "निजी उपयोग।" }, privacy: { title: "गोपनीयता", content: "डेटा नहीं।" }, dmca: { title: "कॉपीराइट", content: "सम्मान।" }, about: { title: "बारे में", content: "सबसे अच्छा।" }, disclaimer: { title: "अस्वीकरण", content: "TikTok नहीं।" } }
    }
  },
  // 17. Dutch
  nl: {
    translation: {
      meta: { title: "TikTok Downloaden Zonder Watermerk 2026", description: "HD video's gratis." },
      nav: { home: "Home", about: "Over", contact: "Contact", terms: "Voorwaarden", privacy: "Privacy", dmca: "DMCA" },
      hero: { title: "TikTok Downloader", desc: "Geen watermerk. Snel." },
      downloader: { placeholder: "Plak link...", btn_download: "Downloaden" },
      faq: { title: "FAQ", q1: "Hoe?", a1: "Plak link.", q2: "Gratis?", a2: "Ja." },
      footer: { rights: "Rechten voorbehouden © 2026." },
      pages: { contact: { title: "Contact", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Voorwaarden", content: "Prive." }, privacy: { title: "Privacy", content: "Geen data." }, dmca: { title: "DMCA", content: "Copyright." }, about: { title: "Over", content: "Beste tool." }, disclaimer: { title: "Disclaimer", content: "Niet TikTok." } }
    }
  },
  // 18. Korean
  ko: {
    translation: {
      meta: { title: "틱톡 다운로더 2026", description: "워터마크 없는 HD 영상." },
      nav: { home: "홈", about: "정보", contact: "연락처", terms: "약관", privacy: "개인정보", dmca: "DMCA" },
      hero: { title: "틱톡 다운로드", desc: "워터마크 없음. 빠름." },
      downloader: { placeholder: "링크 붙여넣기...", btn_download: "다운로드" },
      faq: { title: "FAQ", q1: "방법?", a1: "링크 붙여넣기.", q2: "무료?", a2: "네." },
      footer: { rights: "저작권 소유 © 2026." },
      pages: { contact: { title: "연락처", content: "Email: support@savetik-fast.xyz" }, terms: { title: "약관", content: "개인용." }, privacy: { title: "개인정보", content: "데이터 없음." }, dmca: { title: "저작권", content: "존중." }, about: { title: "정보", content: "최고의 도구." }, disclaimer: { title: "면책", content: "틱톡 아님." } }
    }
  },
  // 19. Polish
  pl: {
    translation: {
      meta: { title: "Pobieranie TikTok 2026", description: "HD bez znaku wodnego." },
      nav: { home: "Start", about: "O nas", contact: "Kontakt", terms: "Regulamin", privacy: "Prywatność", dmca: "DMCA" },
      hero: { title: "TikTok Downloader", desc: "Bez znaku. Szybko." },
      downloader: { placeholder: "Wklej link...", btn_download: "Pobierz" },
      faq: { title: "FAQ", q1: "Jak?", a1: "Wklej link.", q2: "Za darmo?", a2: "Tak." },
      footer: { rights: "Prawa zastrzeżone © 2026." },
      pages: { contact: { title: "Kontakt", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Regulamin", content: "Prywatne." }, privacy: { title: "Prywatność", content: "Bez danych." }, dmca: { title: "DMCA", content: "Prawa autorskie." }, about: { title: "O nas", content: "Najlepsze." }, disclaimer: { title: "Zrzeczenie", content: "Nie TikTok." } }
    }
  },
  // 20. Ukrainian
  uk: {
    translation: {
      meta: { title: "Завантажити TikTok 2026", description: "Без водяного знака HD." },
      nav: { home: "Головна", about: "Про нас", contact: "Контакти", terms: "Умови", privacy: "Приватність", dmca: "DMCA" },
      hero: { title: "TikTok Завантажувач", desc: "Без знака. Швидко." },
      downloader: { placeholder: "Вставте посилання...", btn_download: "Завантажити" },
      faq: { title: "FAQ", q1: "Як?", a1: "Вставте лінк.", q2: "Безкоштовно?", a2: "Так." },
      footer: { rights: "Всі права захищені © 2026." },
      pages: { contact: { title: "Контакти", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Умови", content: "Особисте." }, privacy: { title: "Приватність", content: "Без даних." }, dmca: { title: "DMCA", content: "Авторське право." }, about: { title: "Про нас", content: "Краще." }, disclaimer: { title: "Відмова", content: "Не TikTok." } }
    }
  },
  // 21. Greek
  el: {
    translation: {
      meta: { title: "Λήψη TikTok 2026", description: "Χωρίς υδατογράφημα HD." },
      nav: { home: "Αρχική", about: "Σχετικά", contact: "Επαφή", terms: "Όροι", privacy: "Απόρρητο", dmca: "DMCA" },
      hero: { title: "TikTok Downloader", desc: "Χωρίς σήμα. Γρήγορα." },
      downloader: { placeholder: "Επικόλληση...", btn_download: "Λήψη" },
      faq: { title: "FAQ", q1: "Πώς;", a1: "Επικόλληση.", q2: "Δωρεάν;", a2: "Ναι." },
      footer: { rights: "Δικαιώματα © 2026." },
      pages: { contact: { title: "Επαφή", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Όροι", content: "Προσωπική." }, privacy: { title: "Απόρρητο", content: "Όχι δεδομένα." }, dmca: { title: "DMCA", content: "Πνευματικά." }, about: { title: "Σχετικά", content: "Το καλύτερο." }, disclaimer: { title: "Αποποίηση", content: "Όχι TikTok." } }
    }
  },
  // 22. Swedish
  sv: {
    translation: {
      meta: { title: "Ladda ner TikTok 2026", description: "Utan vattenstämpel HD." },
      nav: { home: "Hem", about: "Om oss", contact: "Kontakt", terms: "Villkor", privacy: "Sekretess", dmca: "DMCA" },
      hero: { title: "TikTok Nedladdare", desc: "Inget märke. Snabbt." },
      downloader: { placeholder: "Klistra in...", btn_download: "Ladda ner" },
      faq: { title: "FAQ", q1: "Hur?", a1: "Klistra in.", q2: "Gratis?", a2: "Ja." },
      footer: { rights: "Rättigheter © 2026." },
      pages: { contact: { title: "Kontakt", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Villkor", content: "Privat." }, privacy: { title: "Sekretess", content: "Ingen data." }, dmca: { title: "DMCA", content: "Upphovsrätt." }, about: { title: "Om", content: "Bäst." }, disclaimer: { title: "Varning", content: "Ej TikTok." } }
    }
  },
  // 23. Norwegian
  no: {
    translation: {
      meta: { title: "Last ned TikTok 2026", description: "Uten vannmerke HD." },
      nav: { home: "Hjem", about: "Om", contact: "Kontakt", terms: "Vilkår", privacy: "Personvern", dmca: "DMCA" },
      hero: { title: "TikTok Nedlaster", desc: "Uten merke. Raskt." },
      downloader: { placeholder: "Lim inn...", btn_download: "Last ned" },
      faq: { title: "FAQ", q1: "Hvordan?", a1: "Lim inn.", q2: "Gratis?", a2: "Ja." },
      footer: { rights: "Rettigheter © 2026." },
      pages: { contact: { title: "Kontakt", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Vilkår", content: "Privat." }, privacy: { title: "Personvern", content: "Ingen data." }, dmca: { title: "DMCA", content: "Opphavsrett." }, about: { title: "Om", content: "Best." }, disclaimer: { title: "Disclaimer", content: "Ikke TikTok." } }
    }
  },
  // 24. Danish
  da: {
    translation: {
      meta: { title: "Download TikTok 2026", description: "Uden vandmærke HD." },
      nav: { home: "Hjem", about: "Om", contact: "Kontakt", terms: "Vilkår", privacy: "Privatliv", dmca: "DMCA" },
      hero: { title: "TikTok Downloader", desc: "Uden mærke. Hurtigt." },
      downloader: { placeholder: "Indsæt...", btn_download: "Download" },
      faq: { title: "FAQ", q1: "Hvordan?", a1: "Indsæt link.", q2: "Gratis?", a2: "Ja." },
      footer: { rights: "Rettigheder © 2026." },
      pages: { contact: { title: "Kontakt", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Vilkår", content: "Privat." }, privacy: { title: "Privatliv", content: "Ingen data." }, dmca: { title: "DMCA", content: "Ophavsret." }, about: { title: "Om", content: "Bedst." }, disclaimer: { title: "Ansvarsfraskrivelse", content: "Ikke TikTok." } }
    }
  },
  // 25. Finnish
  fi: {
    translation: {
      meta: { title: "Lataa TikTok 2026", description: "Ilman vesileimaa HD." },
      nav: { home: "Koti", about: "Tietoa", contact: "Yhteystiedot", terms: "Ehdot", privacy: "Tietosuoja", dmca: "DMCA" },
      hero: { title: "TikTok Lataaja", desc: "Ei leimaa. Nopea." },
      downloader: { placeholder: "Liitä...", btn_download: "Lataa" },
      faq: { title: "UKK", q1: "Miten?", a1: "Liitä linkki.", q2: "Ilmainen?", a2: "Kyllä." },
      footer: { rights: "Oikeudet © 2026." },
      pages: { contact: { title: "Yhteystiedot", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Ehdot", content: "Yksityinen." }, privacy: { title: "Tietosuoja", content: "Ei dataa." }, dmca: { title: "DMCA", content: "Tekijänoikeus." }, about: { title: "Tietoa", content: "Paras." }, disclaimer: { title: "Vastuuvapaus", content: "Ei TikTok." } }
    }
  },
  // 26. Czech
  cs: {
    translation: {
      meta: { title: "Stáhnout TikTok 2026", description: "Bez vodoznaku HD." },
      nav: { home: "Domů", about: "O nás", contact: "Kontakt", terms: "Podmínky", privacy: "Soukromí", dmca: "DMCA" },
      hero: { title: "TikTok Stahovač", desc: "Bez značky. Rychle." },
      downloader: { placeholder: "Vložit...", btn_download: "Stáhnout" },
      faq: { title: "FAQ", q1: "Jak?", a1: "Vložit odkaz.", q2: "Zdarma?", a2: "Ano." },
      footer: { rights: "Práva vyhrazena © 2026." },
      pages: { contact: { title: "Kontakt", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Podmínky", content: "Soukromé." }, privacy: { title: "Soukromí", content: "Žádná data." }, dmca: { title: "DMCA", content: "Autorská práva." }, about: { title: "O nás", content: "Nejlepší." }, disclaimer: { title: "Odmítnutí", content: "Ne TikTok." } }
    }
  },
  // 27. Hungarian
  hu: {
    translation: {
      meta: { title: "TikTok Letöltés 2026", description: "Vízjel nélkül HD." },
      nav: { home: "Főoldal", about: "Rólunk", contact: "Kapcsolat", terms: "Feltételek", privacy: "Adatvédelem", dmca: "DMCA" },
      hero: { title: "TikTok Letöltő", desc: "Vízjel nélkül. Gyors." },
      downloader: { placeholder: "Beillesztés...", btn_download: "Letöltés" },
      faq: { title: "GYIK", q1: "Hogyan?", a1: "Illeszd be.", q2: "Ingyenes?", a2: "Igen." },
      footer: { rights: "Jogok fenntartva © 2026." },
      pages: { contact: { title: "Kapcsolat", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Feltételek", content: "Személyes." }, privacy: { title: "Adatvédelem", content: "Nincs adat." }, dmca: { title: "DMCA", content: "Szerzői jog." }, about: { title: "Rólunk", content: "Legjobb." }, disclaimer: { title: "Nyilatkozat", content: "Nem TikTok." } }
    }
  },
  // 28. Romanian
  ro: {
    translation: {
      meta: { title: "Descarcă TikTok 2026", description: "Fără watermark HD." },
      nav: { home: "Acasă", about: "Despre", contact: "Contact", terms: "Termeni", privacy: "Confidențialitate", dmca: "DMCA" },
      hero: { title: "Descărcător TikTok", desc: "Fără semn. Rapid." },
      downloader: { placeholder: "Lipește...", btn_download: "Descarcă" },
      faq: { title: "FAQ", q1: "Cum?", a1: "Lipește link.", q2: "Gratuit?", a2: "Da." },
      footer: { rights: "Drepturi rezervate © 2026." },
      pages: { contact: { title: "Contact", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Termeni", content: "Personal." }, privacy: { title: "Confidențialitate", content: "Fără date." }, dmca: { title: "DMCA", content: "Drepturi." }, about: { title: "Despre", content: "Cel mai bun." }, disclaimer: { title: "Declinare", content: "Nu TikTok." } }
    }
  },
  // 29. Slovak
  sk: {
    translation: {
      meta: { title: "Stiahnuť TikTok 2026", description: "Bez vodoznaku HD." },
      nav: { home: "Domov", about: "O nás", contact: "Kontakt", terms: "Podmienky", privacy: "Súkromie", dmca: "DMCA" },
      hero: { title: "TikTok Sťahovač", desc: "Bez značky. Rýchlo." },
      downloader: { placeholder: "Vložiť...", btn_download: "Stiahnuť" },
      faq: { title: "FAQ", q1: "Ako?", a1: "Vložiť odkaz.", q2: "Zadarmo?", a2: "Áno." },
      footer: { rights: "Práva vyhradené © 2026." },
      pages: { contact: { title: "Kontakt", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Podmienky", content: "Súkromné." }, privacy: { title: "Súkromie", content: "Žiadne dáta." }, dmca: { title: "DMCA", content: "Autorské práva." }, about: { title: "O nás", content: "Najlepšie." }, disclaimer: { title: "Odmietnutie", content: "Nie TikTok." } }
    }
  },
  // 30. Bulgarian
  bg: {
    translation: {
      meta: { title: "Изтегляне TikTok 2026", description: "Без воден знак HD." },
      nav: { home: "Начало", about: "За нас", contact: "Контакт", terms: "Условия", privacy: "Поверителност", dmca: "DMCA" },
      hero: { title: "TikTok Изтегляне", desc: "Без знак. Бързо." },
      downloader: { placeholder: "Поставете...", btn_download: "Изтегли" },
      faq: { title: "ЧЗВ", q1: "Как?", a1: "Поставете линк.", q2: "Безплатно?", a2: "Да." },
      footer: { rights: "Всички права запазени © 2026." },
      pages: { contact: { title: "Контакт", content: "Email: support@savetik-fast.xyz" }, terms: { title: "Условия", content: "Лично." }, privacy: { title: "Поверителност", content: "Без данни." }, dmca: { title: "DMCA", content: "Авторско право." }, about: { title: "За нас", content: "Най-доброто." }, disclaimer: { title: "Отказ", content: "Не TikTok." } }
    }
  }
};

const supportedLanguages = [
    { code: 'ar', name: 'العربية' }, { code: 'en', name: 'English' }, { code: 'fr', name: 'Français' }, { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' }, { code: 'id', name: 'Bahasa Indonesia' }, { code: 'pt', name: 'Português' }, { code: 'ru', name: 'Русский' },
    { code: 'tr', name: 'Türkçe' }, { code: 'it', name: 'Italiano' }, { code: 'ja', name: '日本語' }, { code: 'zh', name: '中文' },
    { code: 'vi', name: 'Tiếng Việt' }, { code: 'hi', name: 'हिन्दी' }, { code: 'nl', name: 'Nederlands' }, { code: 'ko', name: '한국어' },
    { code: 'th', name: 'ไทย' }, { code: 'pl', name: 'Polski' }, { code: 'uk', name: 'Українська' }, { code: 'el', name: 'Ελληνικά' },
    { code: 'sv', name: 'Svenska' }, { code: 'no', name: 'Norsk' }, { code: 'da', name: 'Dansk' }, { code: 'fi', name: 'Suomi' },
    { code: 'cs', name: 'Čeština' }, { code: 'hu', name: 'Magyar' }, { code: 'ro', name: 'Română' }, { code: 'sk', name: 'Slovenčina' },
    { code: 'bg', name: 'Български' }, { code: 'he', name: 'עברית' }
];

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof i18next === 'undefined') return;
    
    try {
        await i18next.use(i18nextBrowserLanguageDetector).init({
            fallbackLng: 'en',
            debug: false,
            resources: resources,
            detection: { 
                order: ['path', 'localStorage', 'navigator'], 
                caches: ['localStorage'],
                lookupFromPathIndex: 0
            }
        });
        
        injectStylesForSubpages(); 
        injectMasterLayout();      
        applyTranslations();       
    } catch (error) { console.error('i18next error:', error); }

    i18next.on('languageChanged', () => applyTranslations());
});

function injectStylesForSubpages() {
    if (!document.getElementById('main-header')) return; 
    const style = document.createElement('style');
    style.innerHTML = `
        header { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 1rem 0; position: fixed; width: 100%; top: 0; z-index: 1000; }
        .nav-container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: 800; color: white; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; }
        .nav-links { display: flex; list-style: none; gap: 1.5rem; align-items: center; margin: 0; }
        .nav-links a { color: white; text-decoration: none; font-weight: 500; transition: 0.3s; }
        .nav-links a:hover { color: #00f2ea; }
        .footer-grid { text-align: center; padding: 2rem; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 4rem; background: rgba(0,0,0,0.2); }
        .footer-nav { margin-bottom: 1rem; }
        .footer-nav a { margin: 0 10px; color: rgba(255,255,255,0.7); text-decoration: none; }
        .footer-nav a:hover { color: white; }
        .rights { color: rgba(255,255,255,0.5); font-size: 0.9rem; }
        .lang-select { padding: 5px; border-radius: 5px; background: #222; color: #fff; border: 1px solid #444; }
        @media (max-width: 768px) { .nav-links { display: none; } }
    `;
    document.head.appendChild(style);
}

function injectMasterLayout() {
    const header = document.getElementById('main-header');
    const footer = document.getElementById('main-footer');
    if (header) {
        header.innerHTML = `
        <nav class="nav-container">
            <a href="index.html" class="logo"><i class="fab fa-tiktok"></i> Snaptiks</a>
            <ul class="nav-links">
                <li><a href="index.html" data-i18n="nav.home">Home</a></li>
                <li><a href="about.html" data-i18n="nav.about">About</a></li>
                <li><a href="contact.html" data-i18n="nav.contact">Contact</a></li>
                <li id="lang-picker-slot"></li>
            </ul>
        </nav>`;
        createPicker('lang-picker-slot');
    }
    if (footer) {
        footer.innerHTML = `
        <div class="footer-grid">
            <div class="footer-nav">
                <a href="index.html" data-i18n="nav.home">Home</a>
                <a href="terms.html" data-i18n="nav.terms">Terms</a>
                <a href="privacy.html" data-i18n="nav.privacy">Privacy</a>
                <a href="disclaimer.html" data-i18n="nav.disclaimer">Disclaimer</a>
            </div>
            <p class="rights">&copy; 2026 Snaptiks. <span data-i18n="footer.rights">All rights reserved.</span></p>
        </div>`;
    }
}

function createPicker(slotId) {
    const slot = document.getElementById(slotId);
    if (!slot) return;
    const sel = document.createElement('select');
    sel.className = 'lang-select';
    sel.onchange = (e) => i18next.changeLanguage(e.target.value);
    supportedLanguages.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l.code; opt.text = l.name;
        if(l.code === i18next.language) opt.selected = true;
        sel.add(opt);
    });
    slot.appendChild(sel);
}

function applyTranslations() {
    const lang = i18next.language;
    if(!lang) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = ['ar', 'he'].includes(lang) ? 'rtl' : 'ltr';
    if (i18next.exists('meta.title')) document.title = i18next.t('meta.title');
    const desc = document.querySelector('meta[name="description"]');
    if (desc && i18next.exists('meta.description')) desc.setAttribute('content', i18next.t('meta.description'));
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const attrMatch = key.match(/^\[(.*)\](.*)/);
        if (attrMatch) { el.setAttribute(attrMatch[1], i18next.t(attrMatch[2])); } else { el.innerHTML = i18next.t(key); }
    });
}
