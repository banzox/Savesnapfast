const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.resolve(__dirname, '../src/locales/locales');

const GUIDES = {
  en: {
    ios: {
      title: "How to Download TikTok on iPhone & iPad",
      tip: "For the best experience on iPhone or iPad, use Safari browser. When you tap Download, Safari will prompt you to confirm the file download. Once downloaded, tap the download arrow in Safari's address bar, open the video, tap Share, and choose 'Save Video' to transfer it directly into your Photos camera roll."
    },
    android: {
      title: "How to Download TikTok on Android",
      tip: "On Android smartphones and tablets (Samsung, Xiaomi, Google Pixel, etc.), you can use Google Chrome or any preferred browser. The video downloads directly in MP4 format to your Downloads folder and immediately shows up in your Gallery with no watermark and in maximum resolution."
    },
    mac: {
      title: "How to Download TikTok on Mac",
      tip: "On Mac computers (MacBook Air, MacBook Pro, iMac, Mac mini), SaveTikFast works effortlessly on Safari and Chrome. Copy any public TikTok URL and paste it here to save crisp Full HD or 4K videos directly to your Downloads folder without installing third-party apps."
    },
    pc: {
      title: "How to Download TikTok on Windows PC",
      tip: "On Windows PC and laptops, SaveTikFast works across Microsoft Edge, Google Chrome, and Firefox. Download watermark-free MP4 videos and high-bitrate MP3 audio files in seconds, ready for offline viewing or video editing projects."
    }
  },
  ar: {
    ios: {
      title: "طريقة تنزيل فيديوهات تيك توك على الآيفون والآيباد",
      tip: "للحصول على أفضل تجربة على iPhone أو iPad، نوصي باستخدام متصفح Safari. بعد النقر على زر التنزيل، ستظهر نافذة منبثقة من Safari تطلب منك تأكيد التنزيل. اضغط على \"تنزيل\"، وبعد اكتمال التنزيل اضغط على أيقونة التنزيلات في شريط العناوين، ثم اختر الفيديو واضغط على زر المشاركة ثم \"حفظ الفيديو\" ليتم نقله مباشرة إلى تطبيق الصور (Photos)."
    },
    android: {
      title: "طريقة تنزيل فيديوهات تيك توك على أجهزة أندرويد",
      tip: "على هواتف وأجهزة Android (مثل Samsung وXiaomi وGoogle Pixel وغيرها)، يمكنك استخدام متصفح Google Chrome أو أي متصفح مفضل. سيتم تنزيل الفيديو بصيغة MP4 مباشرة إلى مجلد التنزيلات (Downloads) وسيظهر فوراً في معرض الصور (Gallery) بدون أي علامة مائية وبأعلى دقة متوفرة."
    },
    mac: {
      title: "طريقة تنزيل فيديوهات تيك توك على أجهزة ماك",
      tip: "على أجهزة Mac (MacBook Air وMacBook Pro وiMac)، يعمل الموقع بسلاسة تامة على متصفحي Safari وChrome. يمكنك نسخ رابط الفيديو من تطبيق تيك توك أو من المتصفح ولصقه هنا لحفظه فوراً في مجلد التنزيلات بجودة Full HD و4K دون الحاجة لتثبيت أي برامج إضافية."
    },
    pc: {
      title: "طريقة تنزيل فيديوهات تيك توك على الكمبيوتر ونظام ويندوز",
      tip: "على أجهزة الكمبيوتر التي تعمل بنظام Windows، يمكنك استخدام أي متصفح مثل Microsoft Edge أو Google Chrome أو Firefox. تتيح لك الأداة تنزيل مقاطع الفيديو بصيغة MP4 والصوتيات بصيغة MP3 بسرعة فائقة وبدون علامة مائية، مما يسهل إعادة استخدامها أو مشاهدتها دون اتصال بالإنترنت."
    }
  },
  es: {
    ios: {
      title: "Cómo descargar TikTok en iPhone y iPad",
      tip: "Para la mejor experiencia en iPhone o iPad, usa Safari. Al pulsar Descargar, Safari te pedirá confirmar la descarga. Una vez descargado, pulsa el icono de descargas en la barra de direcciones, abre el vídeo, pulsa Compartir y elige 'Guardar vídeo' para transferirlo directamente a tu Fotos (Carrete)."
    },
    android: {
      title: "Cómo descargar TikTok en Android",
      tip: "En smartphones y tablets Android (Samsung, Xiaomi, Google Pixel, etc.), usa Google Chrome o cualquier navegador. El vídeo se descargará en formato MP4 directamente en tu carpeta de Descargas y aparecerá de inmediato en tu Galería sin marca de agua y en máxima resolución."
    },
    mac: {
      title: "Cómo descargar TikTok en Mac",
      tip: "En ordenadores Mac (MacBook, iMac, Mac mini), SaveTikFast funciona a la perfección en Safari y Chrome. Copia cualquier enlace de TikTok y pégalo aquí para guardar vídeos en Full HD o 4K directamente en tu carpeta de Descargas sin instalar programas."
    },
    pc: {
      title: "Cómo descargar TikTok en Windows PC",
      tip: "En PC y portátiles con Windows, SaveTikFast funciona con Microsoft Edge, Google Chrome y Firefox. Descarga vídeos MP4 y audios MP3 de alta fidelidad sin marcas de agua en cuestión de segundos, listos para ver o editar."
    }
  },
  fr: {
    ios: {
      title: "Comment télécharger TikTok sur iPhone et iPad",
      tip: "Pour une expérience optimale sur iPhone ou iPad, utilisez le navigateur Safari. Lorsque vous appuyez sur Télécharger, Safari vous demande de confirmer. Une fois le téléchargement terminé, touchez l'icône de téléchargement dans la barre d'adresse, ouvrez la vidéo, appuyez sur Partager puis 'Enregistrer la vidéo' pour la transférer dans votre pellicule Photos."
    },
    android: {
      title: "Comment télécharger TikTok sur Android",
      tip: "Sur smartphones et tablettes Android (Samsung, Xiaomi, Google Pixel, etc.), utilisez Google Chrome ou votre navigateur favori. La vidéo est téléchargée au format MP4 directement dans votre dossier Téléchargements et apparaît immédiatement dans votre Galerie sans filigrane et en haute définition."
    },
    mac: {
      title: "Comment télécharger TikTok sur Mac",
      tip: "Sur ordinateurs Mac (MacBook, iMac, Mac mini), SaveTikFast fonctionne parfaitement sur Safari et Chrome. Copiez l'URL d'une vidéo TikTok et collez-la ici pour enregistrer des vidéos Full HD ou 4K directement dans votre dossier Téléchargements sans logiciel supplémentaire."
    },
    pc: {
      title: "Comment télécharger TikTok sur PC Windows",
      tip: "Sur PC et ordinateurs portables Windows, SaveTikFast est compatible avec Edge, Chrome et Firefox. Téléchargez des vidéos MP4 et des fichiers audio MP3 sans filigrane en quelques secondes, prêts pour le visionnage hors ligne ou le montage."
    }
  },
  de: {
    ios: {
      title: "So laden Sie TikTok auf iPhone & iPad herunter",
      tip: "Für das beste Erlebnis auf iPhone oder iPad verwenden Sie Safari. Tippen Sie auf Download, um die Datei herunterzuladen. Öffnen Sie anschließend die Downloads in der Safari-Adressleiste, tippen Sie auf Teilen und wählen Sie 'Video sichern', um es direkt in der Fotos-App zu speichern."
    },
    android: {
      title: "So laden Sie TikTok auf Android herunter",
      tip: "Auf Android-Smartphones und -Tablets (Samsung, Xiaomi, Google Pixel usw.) können Sie Google Chrome verwenden. Das Video wird im MP4-Format direkt in Ihren Download-Ordner heruntergeladen und sofort ohne Wasserzeichen in Ihrer Galerie angezeigt."
    },
    mac: {
      title: "So laden Sie TikTok auf dem Mac herunter",
      tip: "Auf Mac-Computern (MacBook, iMac, Mac mini) funktioniert SaveTikFast reibungslos mit Safari und Chrome. Fügen Sie einfach den TikTok-Link ein, um Videos in Full HD oder 4K ohne zusätzliche Software herunterzuladen."
    },
    pc: {
      title: "So laden Sie TikTok auf Windows-PC herunter",
      tip: "Unter Windows funktioniert SaveTikFast mit Edge, Chrome und Firefox. Laden Sie MP4-Videos und MP3-Audiodateien ohne Wasserzeichen blitzschnell herunter, ideal für die Offline-Nutzung und Bearbeitung."
    }
  },
  it: {
    ios: {
      title: "Come scaricare TikTok su iPhone e iPad",
      tip: "Per un'esperienza ottimale su iPhone o iPad, usa Safari. Quando tocchi Scarica, conferma il download. Al termine, tocca l'icona dei download nella barra degli indirizzi, apri il video, premi Condividi e seleziona 'Salva video' per inserirlo direttamente nell'app Foto."
    },
    android: {
      title: "Come scaricare TikTok su Android",
      tip: "Su smartphone e tablet Android (Samsung, Xiaomi, Pixel, ecc.), usa Google Chrome o qualsiasi browser. Il video viene scaricato in MP4 direttamente nella cartella Download ed è subito visibile nella Galleria senza filigrana."
    },
    mac: {
      title: "Come scaricare TikTok su Mac",
      tip: "Su Mac (MacBook, iMac, Mac mini), SaveTikFast funziona alla perfezione su Safari e Chrome. Incolla il link del video TikTok per salvarlo in Full HD o 4K nella cartella Download senza installare app esterne."
    },
    pc: {
      title: "Come scaricare TikTok su PC Windows",
      tip: "Su PC Windows e laptop, SaveTikFast è compatibile con Edge, Chrome e Firefox. Scarica video MP4 e tracce MP3 senza filigrana in pochi secondi per la visione offline o il montaggio."
    }
  },
  pt: {
    ios: {
      title: "Como baixar TikTok no iPhone e iPad",
      tip: "Para melhor experiência no iPhone ou iPad, use o Safari. Ao tocar em Baixar, confirme o download. Depois de baixado, toque no ícone de downloads na barra de endereços, abra o vídeo, toque em Compartilhar e selecione 'Salvar Vídeo' para guardá-lo diretamente no Fotos."
    },
    android: {
      title: "Como baixar TikTok no Android",
      tip: "Em smartphones e tablets Android (Samsung, Xiaomi, Motorola, etc.), use o Google Chrome. O vídeo é baixado em formato MP4 diretamente para a pasta Downloads e surge imediatamente na sua Galeria sem marca d'água."
    },
    mac: {
      title: "Como baixar TikTok no Mac",
      tip: "Nos computadores Mac (MacBook, iMac, Mac mini), o SaveTikFast funciona muito bem no Safari e Chrome. Cole o link do TikTok e salve vídeos em Full HD ou 4K na pasta Downloads sem instalar programas adicionais."
    },
    pc: {
      title: "Como baixar TikTok no PC com Windows",
      tip: "No Windows PC e notebooks, o SaveTikFast funciona com Edge, Chrome e Firefox. Baixe vídeos em MP4 e áudios em MP3 sem marca d'água em segundos para assistir offline ou editar."
    }
  },
  ru: {
    ios: {
      title: "Как скачать видео Тик Ток на iPhone и iPad",
      tip: "Для удобства на iPhone и iPad используйте браузер Safari. Нажмите кнопку «Скачать» и подтвердите загрузку. Затем нажмите на стрелку загрузок в адресной строке Safari, откройте файл, нажмите кнопку «Поделиться» и выберите «Сохранить видео», чтобы оно появилось в галерее Фото."
    },
    android: {
      title: "Как скачать Тик Ток на Android",
      tip: "На смартфонах и планшетах Android (Samsung, Xiaomi, Realme и др.) используйте браузер Google Chrome. Видео сохраняется в формате MP4 в папку «Загрузки» и сразу отображается в «Галерее» без водяных знаков в максимальном качестве."
    },
    mac: {
      title: "Как скачать Тик Ток на компьютер Mac",
      tip: "На компьютерах Mac (MacBook, iMac, Mac mini) сервис работает в Safari и Chrome. Вставьте ссылку на видео TikTok и скачивайте ролики в Full HD и 4K прямо в папку «Загрузки» без установки сторонних программ."
    },
    pc: {
      title: "Как скачать Тик Ток на ПК с Windows",
      tip: "На компьютерах и ноутбуках с Windows используйте Microsoft Edge, Chrome или Firefox. Скачивайте видео MP4 и аудиофайлы MP3 без водяных знаков за считанные секунды для просмотра офлайн или монтажа."
    }
  },
  tr: {
    ios: {
      title: "iPhone ve iPad'de TikTok Nasıl İndirilir",
      tip: "iPhone veya iPad'de en iyi deneyim için Safari tarayıcısını kullanın. İndir butonuna dokunduğunuzda Safari onay isteyecektir. İndirme tamamlandığında adres çubuğundaki indirme simgesine dokunun, videoyu açın, Paylaş'a basıp 'Videoyu Kaydet' seçeneğini seçerek doğrudan Fotoğraflar uygulamasına aktarın."
    },
    android: {
      title: "Android Cihazlarda TikTok Nasıl İndirilir",
      tip: "Android telefon ve tabletlerde (Samsung, Xiaomi, Oppo vb.) Google Chrome kullanabilirsiniz. Video MP4 formatında doğrudan İndirilenler klasörüne iner ve filigransız olarak en yüksek kalitede Galerinizde anında görünür."
    },
    mac: {
      title: "Mac Bilgisayarlarda TikTok Nasıl İndirilir",
      tip: "Mac bilgisayarlarda (MacBook, iMac, Mac mini) SaveTikFast, Safari ve Chrome ile sorunsuz çalışır. TikTok video bağlantısını yapıştırarak ek programa gerek kalmadan Full HD veya 4K videoları İndirilenler klasörüne kaydedin."
    },
    pc: {
      title: "Windows PC'de TikTok Nasıl İndirilir",
      tip: "Windows bilgisayarlarda SaveTikFast; Edge, Chrome ve Firefox ile tam uyumludur. Filigransız MP4 video ve yüksek kaliteli MP3 ses dosyalarını saniyeler içinde indirin."
    }
  },
  id: {
    ios: {
      title: "Cara Download Video TikTok di iPhone & iPad",
      tip: "Untuk hasil terbaik di iPhone atau iPad, gunakan Safari. Setelah menekan Unduh, konfirmasi unduhan file. Buka menu unduhan di bilah alamat Safari, buka video, ketuk Bagikan, lalu pilih 'Simpan Video' agar tersimpan langsung di aplikasi Foto."
    },
    android: {
      title: "Cara Download Video TikTok di Android",
      tip: "Pada smartphone dan tablet Android (Samsung, Xiaomi, Oppo, dll.), gunakan Google Chrome. Video diunduh langsung dalam format MP4 ke folder Unduhan dan seketika muncul di Galeri tanpa watermark dalam kualitas maksimal."
    },
    mac: {
      title: "Cara Download Video TikTok di Mac",
      tip: "Di komputer Mac (MacBook, iMac, Mac mini), SaveTikFast bekerja sempurna di Safari dan Chrome. Tempel tautan TikTok untuk mengunduh video Full HD atau 4K ke folder Unduhan tanpa perlu aplikasi tambahan."
    },
    pc: {
      title: "Cara Download Video TikTok di Windows PC",
      tip: "Di PC dan laptop Windows, SaveTikFast mendukung Microsoft Edge, Chrome, dan Firefox. Unduh video MP4 tanpa watermark dan audio MP3 dalam hitungan detik untuk ditonton secara offline."
    }
  },
  ja: {
    ios: {
      title: "iPhone・iPadでTikTok動画を保存する方法",
      tip: "iPhoneまたはiPadではSafariブラウザのご利用をお勧めします。「ダウンロード」をタップして確認後、アドレスバーのダウンロードアイコンから動画を開き、共有ボタンから「ビデオを保存」を選択すると写真アプリに直接保存されます。"
    },
    android: {
      title: "AndroidでTikTok動画を保存する方法",
      tip: "Androidスマートフォン（Galaxy、Xperia、AQUOSなど）ではGoogle Chromeをご利用ください。動画は透かしなしのMP4形式で「ダウンロード」フォルダに保存され、すぐにギャラリーに反映されます。"
    },
    mac: {
      title: "MacでTikTok動画をダウンロードする方法",
      tip: "Mac（MacBook、iMac）ではSafariやChromeで快適にご利用いただけます。URLを貼り付けるだけで、専用アプリ不要でフルHDや4Kの高画質動画をダウンロードフォルダに直接保存できます。"
    },
    pc: {
      title: "Windows PCでTikTok動画をダウンロードする方法",
      tip: "WindowsパソコンではEdge、Chrome、Firefoxに対応しています。ロゴなしのMP4動画や高音質MP3音声をわずか数秒でダウンロードでき、オフライン再生や編集に最適です。"
    }
  },
  ko: {
    ios: {
      title: "iPhone 및 iPad에서 틱톡 영상 다운로드 방법",
      tip: "iPhone 또는 iPad에서는 Safari 브라우저 사용을 권장합니다. 다운로드 버튼을 탭하고 확인한 후, 주소창의 다운로드 목록에서 영상을 열고 공유 메뉴에서 '비디오 저장'을 누르면 사진 앱에 바로 저장됩니다."
    },
    android: {
      title: "Android에서 틱톡 영상 다운로드 방법",
      tip: "삼성 갤럭시 등 Android 기기에서는 Google Chrome을 사용하세요. 워터마크 없는 고화질 MP4 영상이 다운로드 폴더에 저장되어 갤러리 앱에서 즉시 확인할 수 있습니다."
    },
    mac: {
      title: "Mac에서 틱톡 영상 다운로드 방법",
      tip: "MacBook, iMac 등 Mac 환경에서는 Safari나 Chrome으로 손쉽게 다운로드할 수 있습니다. 추가 프로그램 설치 없이 Full HD 및 4K 해상도로 다운로드 폴더에 바로 저장됩니다."
    },
    pc: {
      title: "Windows PC에서 틱톡 영상 다운로드 방법",
      tip: "Windows PC와 노트북에서는 Chrome, Edge, Firefox를 지원합니다. 워터마크 없는 MP4 비디오와 고음질 MP3 음원을 단 몇 초 만에 다운로드하여 오프라인에서 감상하세요."
    }
  },
  zh: {
    ios: {
      title: "如何在 iPhone 和 iPad 上下载 TikTok 视频",
      tip: "在 iPhone 或 iPad 上建议使用 Safari 浏览器。点击下载并确认后，点击地址栏中的下载图标打开视频，点击“共享”并选择“存储视频”，即可直接保存至系统相册（照片）。"
    },
    android: {
      title: "如何在 Android 安卓设备上下载 TikTok 视频",
      tip: "在安卓手机和平板（华为、小米、三星等）上，推荐使用 Chrome 浏览器。无水印 MP4 视频将直接下载到 Downloads 文件夹，并自动显示在您的系统相册或图库中。"
    },
    mac: {
      title: "如何在 Mac 电脑上下载 TikTok 视频",
      tip: "在 Mac（MacBook、iMac）上，SaveTikFast 在 Safari 和 Chrome 中均可流畅运行。只需粘贴 TikTok 链接，无需安装额外软件即可将高清/4K 视频保存到下载文件夹。"
    },
    pc: {
      title: "如何在 Windows 电脑上下载 TikTok 视频",
      tip: "在 Windows 电脑和笔记本上，全面支持 Edge、Chrome 和 Firefox。只需数秒即可下载无水印 MP4 视频或高清 MP3 音频，非常适合离线观看与二次剪辑。"
    }
  },
  vi: {
    ios: {
      title: "Cách tải video TikTok trên iPhone & iPad",
      tip: "Để có trải nghiệm tốt nhất trên iPhone hoặc iPad, hãy sử dụng trình duyệt Safari. Sau khi nhấn Tải về, bấm vào biểu tượng tải xuống trên thanh địa chỉ, mở video, nhấn nút Chia sẻ và chọn 'Lưu video' để lưu trực tiếp vào ứng dụng Ảnh."
    },
    android: {
      title: "Cách tải video TikTok trên Android",
      tip: "Trên điện thoại và máy tính bảng Android (Samsung, Xiaomi, Oppo,...), hãy sử dụng Google Chrome. Video định dạng MP4 không logo sẽ được tải trực tiếp về thư mục Tải về và xuất hiện ngay trong Thư viện ảnh."
    },
    mac: {
      title: "Cách tải video TikTok trên Mac",
      tip: "Trên máy tính Mac (MacBook, iMac), SaveTikFast hoạt động mượt mà trên Safari và Chrome. Dán liên kết TikTok để lưu video Full HD hoặc 4K sắc nét trực tiếp vào thư mục Downloads mà không cần cài thêm phần mềm."
    },
    pc: {
      title: "Cách tải video TikTok trên máy tính Windows",
      tip: "Trên máy tính Windows, SaveTikFast hỗ trợ tốt Edge, Chrome và Firefox. Tải video MP4 không watermark và âm thanh MP3 chất lượng cao chỉ trong vài giây."
    }
  },
  th: {
    ios: {
      title: "วิธีดาวน์โหลดวิดีโอ TikTok บน iPhone และ iPad",
      tip: "เพื่อประสบการณ์ที่ดีที่สุดบน iPhone หรือ iPad แนะนำให้ใช้ Safari เมื่อกดดาวน์โหลด ให้เปิดรายการดาวน์โหลดที่แถบที่อยู่ เปิดวิดีโอ กดปุ่มแชร์ แล้วเลือก 'บันทึกวิดีโอ' เพื่อบันทึกลงในแอปรูปภาพโดยตรง"
    },
    android: {
      title: "วิธีดาวน์โหลด TikTok บน Android",
      tip: "บนสมาร์ทโฟนและแท็บเล็ต Android (Samsung, Xiaomi และอื่นๆ) ให้ใช้ Google Chrome วิดีโอจะถูกดาวน์โหลดเป็นไฟล์ MP4 ไม่มีลายน้ำลงในโฟลเดอร์ดาวน์โหลดและแสดงในแกลเลอรีทันที"
    },
    mac: {
      title: "วิธีดาวน์โหลด TikTok บนเครื่อง Mac",
      tip: "บนคอมพิวเตอร์ Mac (MacBook, iMac) SaveTikFast ทำงานได้อย่างยอดเยี่ยมบน Safari และ Chrome วางลิงก์ TikTok เพื่อบันทึกวิดีโอ Full HD หรือ 4K ลงในโฟลเดอร์ Downloads โดยไม่ต้องลงโปรแกรมเพิ่ม"
    },
    pc: {
      title: "วิธีดาวน์โหลด TikTok บน Windows PC",
      tip: "บนคอมพิวเตอร์ Windows รองรับทั้ง Edge, Chrome และ Firefox ดาวน์โหลดวิดีโอ MP4 ไม่มีลายน้ำและไฟล์เสียง MP3 ได้ในเวลาเพียงไม่กี่วินาที"
    }
  },
  pl: {
    ios: {
      title: "Jak pobierać filmy z TikTok na iPhone i iPad",
      tip: "Dla najlepszych rezultatów na iPhone lub iPadzie używaj Safari. Po kliknięciu Pobierz potwierdź plik, a następnie w menu pobierania stuknij Udostępnij i wybierz 'Zachowaj wideo', aby zapisać je w aplikacji Zdjęcia."
    },
    android: {
      title: "Jak pobrać TikTok na telefon z systemem Android",
      tip: "Na smartfonach i tabletach z Androidem (Samsung, Xiaomi itp.) użyj Google Chrome. Film MP4 bez znaku wodnego zapisze się bezpośrednio w folderze Pobrane i natychmiast pojawi się w Galerii."
    },
    mac: {
      title: "Jak pobrać film z TikTok na komputerze Mac",
      tip: "Na komputerach Mac (MacBook, iMac) narzędzie działa bezbłędnie w Safari i Chrome. Wklej link do TikToka, aby zapisać wideo Full HD lub 4K bezpośrednio w Pobranych bez instalacji oprogramowania."
    },
    pc: {
      title: "Jak pobrać film z TikTok na komputer z systemem Windows",
      tip: "Na komputerach z systemem Windows SaveTikFast współpracuje z Edge, Chrome i Firefox. Pobieraj wideo MP4 bez znaku wodnego i dźwięk MP3 w zaledwie kilka sekund."
    }
  },
  nl: {
    ios: {
      title: "TikTok downloaden op iPhone en iPad",
      tip: "Gebruik Safari op uw iPhone of iPad voor de beste ervaring. Tik op Downloaden, open het bestand via de downloadknop in de adresbalk, tik op Delen en kies 'Bewaar video' om deze op te slaan in uw Foto's-app."
    },
    android: {
      title: "TikTok downloaden op Android",
      tip: "Gebruik Google Chrome op uw Android-telefoon of tablet. De video wordt direct zonder watermerk in MP4-formaat opgeslagen in uw map Downloads en verschijnt meteen in uw Galerij."
    },
    mac: {
      title: "TikTok downloaden op Mac",
      tip: "Op Mac-computers (MacBook, iMac) werkt SaveTikFast naadloos in Safari en Chrome. Plak een TikTok-link en sla Full HD- of 4K-video's direct op in uw Downloads-map zonder extra apps."
    },
    pc: {
      title: "TikTok downloaden op Windows-pc",
      tip: "Op Windows-pc's werkt SaveTikFast met Edge, Chrome en Firefox. Download binnen enkele seconden MP4-video's en MP3-audio zonder watermerk voor offline gebruik."
    }
  },
  ms: {
    ios: {
      title: "Cara Muat Turun Video TikTok di iPhone & iPad",
      tip: "Untuk pengalaman terbaik di iPhone atau iPad, gunakan Safari. Selepas menekan Muat Turun, buka menu muat turun pada bar alamat, ketik Kongsi dan pilih 'Simpan Video' untuk menyimpannya ke dalam aplikasi Foto."
    },
    android: {
      title: "Cara Muat Turun Video TikTok di Android",
      tip: "Pada peranti Android (Samsung, Xiaomi, dll.), gunakan Google Chrome. Video MP4 tanpa tera air akan disimpan terus ke folder Muat Turun dan muncul serta-merta di Galeri anda."
    },
    mac: {
      title: "Cara Muat Turun Video TikTok di Mac",
      tip: "Pada komputer Mac (MacBook, iMac), SaveTikFast berfungsi lancar di Safari dan Chrome. Simpan video Full HD atau 4K ke folder Muat Turun tanpa perlu memasang sebarang aplikasi tambahan."
    },
    pc: {
      title: "Cara Muat Turun Video TikTok di PC Windows",
      tip: "Pada komputer Windows, SaveTikFast menyokong Edge, Chrome dan Firefox. Muat turun video MP4 tanpa tera air dan fail audio MP3 berkualiti tinggi dalam beberapa saat."
    }
  },
  fil: {
    ios: {
      title: "Paano Mag-download ng TikTok sa iPhone at iPad",
      tip: "Para sa pinakamagandang karanasan sa iPhone o iPad, gamitin ang Safari. Pindutin ang Download, buksan ang na-download na file sa address bar, pindutin ang Share at piliin ang 'Save Video' para mai-save ito sa iyong Photos app."
    },
    android: {
      title: "Paano Mag-download ng TikTok sa Android",
      tip: "Sa Android phones at tablets, gamitin ang Google Chrome. Ang MP4 video na walang watermark ay direktang mada-download sa iyong Downloads folder at lalabas agad sa Gallery."
    },
    mac: {
      title: "Paano Mag-download ng TikTok sa Mac",
      tip: "Sa Mac computers (MacBook, iMac), gumagana ang SaveTikFast sa Safari at Chrome. I-paste ang TikTok link para i-save ang Full HD o 4K videos sa iyong Downloads folder nang walang third-party app."
    },
    pc: {
      title: "Paano Mag-download ng TikTok sa Windows PC",
      tip: "Sa Windows PC at laptops, gumagana ang SaveTikFast sa Edge, Chrome, at Firefox. Mag-download ng walang watermark na MP4 videos at MP3 audio sa loob ng ilang segundo."
    }
  },
  hi: {
    ios: {
      title: "iPhone और iPad पर टिकटॉक वीडियो कैसे डाउनलोड करें",
      tip: "iPhone या iPad पर बेहतरीन अनुभव के लिए Safari ब्राउज़र का उपयोग करें। डाउनलोड पर टैप करें, एड्रेस बार में डाउनलोड सूची खोलें, शेयर बटन दबाएं और फोटो ऐप में सीधे सेव करने के लिए 'वीडियो सहेजें' (Save Video) चुनें।"
    },
    android: {
      title: "Android पर टिकटॉक वीडियो कैसे डाउनलोड करें",
      tip: "Android स्मार्टफोन और टैबलेट पर Google Chrome का उपयोग करें। वीडियो बिना किसी वॉटरमार्क के MP4 फॉर्मेट में सीधे आपके डाउनलोड फ़ोल्डर में सेव होगा और गैलरी में तुरंत दिखाई देगा।"
    },
    mac: {
      title: "Mac कंप्यूटर पर टिकटॉक वीडियो कैसे डाउनलोड करें",
      tip: "Mac (MacBook, iMac) पर SaveTikFast सफारी और क्रोम में आसानी से काम करता है। बिना किसी अतिरिक्त ऐप के फुल एचडी या 4K वीडियो सीधे डाउनलोड फ़ोल्डर में सेव करें।"
    },
    pc: {
      title: "Windows PC पर टिकटॉक वीडियो कैसे डाउनलोड करें",
      tip: "Windows कंप्यूटर और लैपटॉप पर यह टूल Edge, Chrome और Firefox पर काम करता है। बिना वॉटरमार्क के MP4 वीडियो और MP3 ऑडियो कुछ ही सेकंड में डाउनलोड करें।"
    }
  },
  uk: {
    ios: {
      title: "Як завантажити відео з TikTok на iPhone та iPad",
      tip: "Для найкращого результату на iPhone або iPad використовуйте Safari. Натисніть «Завантажити», підтвердіть дію, потім торкніться значка завантажень в адресному рядку, відкрийте відео, натисніть «Поділитися» та оберіть «Зберегти відео» до Фото."
    },
    android: {
      title: "Як завантажити TikTok на Android",
      tip: "На смартфонах і планшетах Android використовуйте Google Chrome. Відео у форматі MP4 без водяного знака збережеться у папку «Завантаження» та відразу з'явиться у вашій Галереї."
    },
    mac: {
      title: "Як завантажити TikTok на комп'ютер Mac",
      tip: "На комп'ютерах Mac (MacBook, iMac) сервіс бездоганно працює в Safari та Chrome. Вставте посилання TikTok для завантаження відео у якості Full HD чи 4K без додаткових програм."
    },
    pc: {
      title: "Як завантажити TikTok на комп'ютер з Windows",
      tip: "На ПК з Windows SaveTikFast підтримує Edge, Chrome та Firefox. Завантажуйте відео MP4 без водяних знаків та аудіо MP3 за кілька секунд для офлайн-перегляду."
    }
  },
  ro: {
    ios: {
      title: "Cum să descarci TikTok pe iPhone și iPad",
      tip: "Pentru cea mai bună experiență pe iPhone sau iPad, folosește Safari. Apasă Descărcare, deschide fișierul din bara de adrese, apasă Distribuie și alege 'Salvează videoclipul' pentru a-l transfera în aplicația Poze."
    },
    android: {
      title: "Cum să descarci TikTok pe Android",
      tip: "Pe telefoane și tablete Android, folosește Google Chrome. Videoclipul MP4 fără filigran se descarcă direct în folderul Descărcări și apare imediat în Galerie la rezoluție maximă."
    },
    mac: {
      title: "Cum să descarci TikTok pe Mac",
      tip: "Pe calculatoarele Mac (MacBook, iMac), SaveTikFast funcționează perfect în Safari și Chrome. Lipește linkul TikTok pentru a salva clipuri Full HD sau 4K direct în folderul Descărcări."
    },
    pc: {
      title: "Cum să descarci TikTok pe PC Windows",
      tip: "Pe PC-uri și laptopuri Windows, SaveTikFast este compatibil cu Edge, Chrome și Firefox. Descarcă videoclipuri MP4 fără filigran și fișiere audio MP3 în doar câteva secunde."
    }
  },
  hu: {
    ios: {
      title: "Hogyan töltsünk le TikTok videót iPhone-ra és iPad-re",
      tip: "A legjobb élmény érdekében iPhone-on vagy iPad-en használja a Safari böngészőt. Koppintson a Letöltés gombra, nyissa meg a címsorból, koppintson a Megosztás gombra, majd válassza a 'Videó mentése' lehetőséget a Fotók alkalmazásba mentéshez."
    },
    android: {
      title: "Hogyan töltsünk le TikTok videót Androidra",
      tip: "Androidos okostelefonokon használja a Google Chrome böngészőt. A vízjel nélküli MP4 videó közvetlenül a Letöltések mappába kerül, és azonnal megjelenik a Galériában."
    },
    mac: {
      title: "Hogyan töltsünk le TikTok videót Mac gépre",
      tip: "Mac gépeken a SaveTikFast kiválóan működik Safariban és Chrome-ban. Másolja be a TikTok linket, és mentse a Full HD vagy 4K videókat külső alkalmazások nélkül a Letöltések mappába."
    },
    pc: {
      title: "Hogyan töltsünk le TikTok videót Windows PC-re",
      tip: "Windows számítógépeken az eszköz támogatja az Edge, Chrome és Firefox böngészőket. Töltsön le vízjel nélküli MP4 videókat és MP3 hangfájlokat másodpercek alatt."
    }
  },
  cs: {
    ios: {
      title: "Jak stáhnout TikTok na iPhone a iPad",
      tip: "Pro nejlepší výsledky na iPhone nebo iPadu použijte prohlížeč Safari. Klepněte na Stáhnout, otevřete soubor z panelu stahování, klepněte na Sdílet a zvolte 'Uložit video' pro přenesení do aplikace Fotky."
    },
    android: {
      title: "Jak stáhnout TikTok na Android",
      tip: "Na zařízeních se systémem Android použijte Google Chrome. Video ve formátu MP4 bez vodoznaku se stáhne přímo do složky Stažené soubory a ihned se zobrazí v Galerii."
    },
    mac: {
      title: "Jak stáhnout TikTok na Mac",
      tip: "Na počítačích Mac funguje SaveTikFast spolehlivě v Safari i Chrome. Vložte odkaz z TikToku a uložte Full HD nebo 4K video přímo do složky Stahování bez dalších aplikací."
    },
    pc: {
      title: "Jak stáhnout TikTok na Windows PC",
      tip: "Na počítačích s Windows SaveTikFast podporuje prohlížeče Edge, Chrome a Firefox. Stahujte MP4 videa bez vodoznaku a MP3 skladby během několika sekund."
    }
  },
  el: {
    ios: {
      title: "Πώς να κατεβάσετε TikTok σε iPhone & iPad",
      tip: "Για την καλύτερη εμπειρία σε iPhone ή iPad, χρησιμοποιήστε το Safari. Πατήστε Λήψη, ανοίξτε το αρχείο από τη γραμμή διευθύνσεων, πατήστε Κοινή χρήση και επιλέξτε 'Αποθήκευση βίντεο' για αποθήκευση στις Φωτογραφίες."
    },
    android: {
      title: "Πώς να κατεβάσετε TikTok σε Android",
      tip: "Σε συσκευές Android, χρησιμοποιήστε το Google Chrome. Το βίντεο MP4 χωρίς υδατογράφημα αποθηκεύεται απευθείας στο φάκελο Λήψεις και εμφανίζεται άμεσα στη Συλλογή σας."
    },
    mac: {
      title: "Πώς να κατεβάσετε TikTok σε Mac",
      tip: "Σε Mac, το SaveTikFast λειτουργεί άψογα σε Safari και Chrome. Επικολλήστε τον σύνδεσμο TikTok για λήψη βίντεο Full HD ή 4K απευθείας στις Λήψεις χωρίς επιπλέον προγράμματα."
    },
    pc: {
      title: "Πώς να κατεβάσετε TikTok σε Windows PC",
      tip: "Σε υπολογιστές Windows, το εργαλείο υποστηρίζει Edge, Chrome και Firefox. Κατεβάστε βίντεο MP4 χωρίς υδατογράφημα και ήχο MP3 μέσα σε δευτερόλεπτα."
    }
  },
  da: {
    ios: {
      title: "Sådan downloader du TikTok på iPhone og iPad",
      tip: "Brug Safari på din iPhone eller iPad for den bedste oplevelse. Tryk på Download, åbn filen fra adressebaren, tryk på Del og vælg 'Gem video' for at gemme den i appen Fotos."
    },
    android: {
      title: "Sådan downloader du TikTok på Android",
      tip: "Brug Google Chrome på Android-enheder. Videoen downloades i MP4-format uden vandmærke direkte til mappen Overførsler og vises straks i dit Galleri."
    },
    mac: {
      title: "Sådan downloader du TikTok på Mac",
      tip: "På Mac-computere fungerer SaveTikFast perfekt i Safari og Chrome. Indsæt TikTok-linket for at gemme Full HD- eller 4K-videoer direkte i Overførsler uden ekstra software."
    },
    pc: {
      title: "Sådan downloader du TikTok på Windows PC",
      tip: "På Windows-computere understøttes Edge, Chrome og Firefox. Download MP4-videoer uden vandmærke og MP3-lydfiler på få sekunder."
    }
  },
  fi: {
    ios: {
      title: "Kuinka ladata TikTok-videoita iPhoneen ja iPadiin",
      tip: "Käytä Safaria parhaan käyttökokemuksen saamiseksi iPhonella tai iPadilla. Napauta Lataa, avaa tiedosto osoitepalkista, napauta Jaa ja valitse 'Tallenna video' siirtääksesi sen Kuvat-sovellukseen."
    },
    android: {
      title: "Kuinka ladata TikTok Android-laitteeseen",
      tip: "Käytä Google Chromea Android-puhelimilla. Vesileimaton MP4-video ladataan suoraan Lataukset-kansioon ja se näkyy välittömästi Galleriassasi parhaalla laadulla."
    },
    mac: {
      title: "Kuinka ladata TikTok Mac-tietokoneelle",
      tip: "Mac-tietokoneilla SaveTikFast toimii loistavasti Safarissa ja Chromessa. Liitä TikTok-linkki ladataksesi Full HD- tai 4K-videoita suoraan Lataukset-kansioon."
    },
    pc: {
      title: "Kuinka ladata TikTok Windows-tietokoneelle",
      tip: "Windows-tietokoneilla SaveTikFast toimii Edge-, Chrome- ja Firefox-selaimissa. Lataa vesileimattomia MP4-videoita ja MP3-äänitiedostoja sekunneissa."
    }
  },
  sv: {
    ios: {
      title: "Hur man laddar ner TikTok på iPhone och iPad",
      tip: "För bästa upplevelse på iPhone eller iPad, använd Safari. Tryck på Ladda ner, öppna filen via hämtningsikonen, tryck på Dela och välj 'Spara video' för att spara den i appen Bilder."
    },
    android: {
      title: "Hur man laddar ner TikTok på Android",
      tip: "På Android-enheter, använd Google Chrome. Videon sparas i MP4-format utan vattenstämpel direkt i mappen Hämtade filer och visas omedelbart i ditt Galleri."
    },
    mac: {
      title: "Hur man laddar ner TikTok på Mac",
      tip: "På Mac fungerar SaveTikFast smidigt i Safari och Chrome. Klistra in TikTok-länken för att spara Full HD- eller 4K-videor direkt i Hämtade filer utan extra appar."
    },
    pc: {
      title: "Hur man laddar ner TikTok på Windows PC",
      tip: "På Windows-datorer fungerar SaveTikFast med Edge, Chrome och Firefox. Ladda ner vattenstämpelfria MP4-videor och MP3-ljudfiler på några sekunder."
    }
  },
  no: {
    ios: {
      title: "Hvordan laste ned TikTok på iPhone og iPad",
      tip: "For best opplevelse på iPhone eller iPad, bruk Safari. Trykk på Last ned, åpne filen fra adressefeltet, trykk på Del og velg 'Lagre video' for å legge den i Bilder-appen."
    },
    android: {
      title: "Hvordan laste ned TikTok på Android",
      tip: "På Android-enheter kan du bruke Google Chrome. Videoen lastes ned i MP4-format uten vannmerke direkte til Nedlastinger og vises umiddelbart i Galleriet ditt."
    },
    mac: {
      title: "Hvordan laste ned TikTok på Mac",
      tip: "På Mac fungerer SaveTikFast utmerket i Safari og Chrome. Lim inn TikTok-lenken for å laste ned Full HD- eller 4K-videoer rett til Nedlastinger uten ekstra programvare."
    },
    pc: {
      title: "Hvordan laste ned TikTok på Windows PC",
      tip: "På Windows-maskiner støtter SaveTikFast Edge, Chrome og Firefox. Last ned vannmerkefrie MP4-videoer og MP3-lydfiler på få sekunder for offline bruk."
    }
  },
  bg: {
    ios: {
      title: "Как да изтеглите TikTok на iPhone и iPad",
      tip: "За най-добро изживяване на iPhone или iPad използвайте Safari. Натиснете Изтегляне, отворете файла от адресната лента, натиснете Споделяне и изберете 'Запазване на видео' в приложението Снимки."
    },
    android: {
      title: "Как да изтеглите TikTok на Android",
      tip: "На устройства с Android използвайте Google Chrome. MP4 видеото без воден знак ще се запази директно в папка Изтеглени и ще се покаже веднага във вашата Галерия."
    },
    mac: {
      title: "Как да изтеглите TikTok на Mac",
      tip: "На компютри Mac SaveTikFast работи отлично със Safari и Chrome. Поставете линка към TikTok видеото, за да запазите Full HD или 4K съдържание без инсталиране на програми."
    },
    pc: {
      title: "Как да изтеглите TikTok на Windows PC",
      tip: "На компютри с Windows инструментът поддържа Edge, Chrome и Firefox. Изтегляйте MP4 видеоклипове без воден знак и MP3 файлове за броени секунди."
    }
  }
};

const devices = ['ios', 'android', 'mac', 'pc'];

let updatedCount = 0;
for (const lang of Object.keys(GUIDES)) {
  const filePath = path.join(LOCALES_DIR, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`Locale file not found: ${filePath}`);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  for (const device of devices) {
    const pageKey = `${device}_page`;
    if (!data[pageKey]) {
      data[pageKey] = {};
    }
    data[pageKey].guide_title = GUIDES[lang][device].title;
    data[pageKey].guide_tip = GUIDES[lang][device].tip;
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  updatedCount++;
}

console.log(`Successfully updated ${updatedCount} locale files with platform guide translations!`);
