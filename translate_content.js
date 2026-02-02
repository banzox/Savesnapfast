const fs = require('fs');
const path = require('path');

const localesDir = './src/locales/locales';

// Italian translations
const italianTranslations = {
  features: {
    no_watermark: {
      title: "Senza Filigrana",
      desc: "Scarica video TikTok senza filigrana in qualità HD originale. SaveTikFast rimuove automaticamente il logo TikTok, offrendoti video più puliti di SSSTik, SnapTik o TikMate. Perfetto per ripubblicare su Instagram, YouTube Shorts o salvare nella tua galleria."
    },
    fast: {
      title: "Velocità Fulminea",
      desc: "Il downloader di video TikTok più veloce online. Salva qualsiasi video TikTok in soli 3 secondi su iPhone, Android, Samsung, Huawei, iPad, PC o Mac. I nostri server sono ottimizzati per la velocità, rendendoci più veloci di SaveFrom e MusicallyDown."
    },
    quality: {
      title: "Qualità HD & 4K",
      desc: "Scarica video TikTok nella massima qualità disponibile - 720p, 1080p Full HD, 2K e persino 4K quando disponibile. Preserviamo la qualità video originale senza compressione, a differenza di altri downloader TikTok."
    },
    device: {
      title: "Tutti i Dispositivi Supportati",
      desc: "Funziona perfettamente su ogni dispositivo - iPhone 15, iPhone 14, Samsung Galaxy, Google Pixel, Huawei, Xiaomi, OPPO, iPad, MacBook, Windows PC e Chromebook. Nessuna installazione di app richiesta."
    },
    free: {
      title: "100% Gratis Per Sempre",
      desc: "Download illimitati di video TikTok senza costi nascosti, senza registrazione richiesta e senza limiti giornalieri. SaveTikFast è completamente gratuito e rimarrà sempre gratuito per tutti gli utenti in tutto il mondo."
    },
    secure: {
      title: "Privato & Sicuro",
      desc: "La tua privacy è importante. Non memorizziamo i tuoi dati, non richiediamo login e non tracciamo i tuoi download. Download di video TikTok sicuri e anonimi con crittografia SSL."
    },
    browser: {
      title: "Tutti i Browser",
      desc: "Funziona istantaneamente su Chrome, Safari, Firefox, Microsoft Edge, Opera, Brave, Samsung Internet e UC Browser. Nessuna estensione o plugin necessario - basta incollare e scaricare."
    },
    batch: {
      title: "Download Multipli",
      desc: "Salva più video TikTok rapidamente. Scarica l'intera collezione del tuo creator preferito più velocemente di qualsiasi altro strumento. Download in blocco migliore di SSSTik o SnapTik."
    }
  },
  
  faq: {
    title: "Domande Frequenti (FAQ)",
    q1: "Come scaricare video TikTok senza filigrana?",
    a1: "Scaricare video TikTok senza filigrana è facile con SaveTikFast. Basta copiare il link del video TikTok dall'app, incollarlo nella nostra casella di download e fare clic sul pulsante di download. La nostra tecnologia avanzata rimuove automaticamente la filigrana TikTok, fornendoti un file video pulito. Funziona su tutti i dispositivi inclusi iPhone, Android, Samsung Galaxy, Huawei, iPad, Mac e Windows PC. Puoi utilizzare qualsiasi browser come Chrome, Safari, Firefox o Edge. A differenza di SSSTik o SnapTik, SaveTikFast fornisce la massima qualità di output con elaborazione istantanea.",
    q2: "SaveTikFast è completamente gratuito?",
    a2: "Sì, SaveTikFast è 100% gratuito e rimarrà sempre gratuito. Non ci sono costi nascosti, abbonamenti premium o limiti di download giornalieri. Puoi scaricare video TikTok illimitati senza filigrana, convertire in MP3, salvare storie e scaricare slideshow - tutto completamente gratuito. Non richiediamo registrazione o login. Il nostro servizio è supportato da pubblicità minime, permettendoci di offrire download TikTok gratuiti a milioni di utenti in tutto il mondo su qualsiasi dispositivo.",
    q3: "Quali dispositivi e browser sono supportati?",
    a3: "SaveTikFast funziona praticamente su ogni dispositivo e browser. I dispositivi supportati includono iPhone (tutti i modelli inclusi iPhone 15, 14, 13), telefoni Android (Samsung Galaxy, Google Pixel, Huawei, Xiaomi, OPPO, OnePlus), tablet (iPad, Samsung Tab) e computer (MacBook, iMac, Windows PC, Chromebook). I browser supportati includono Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge, Opera, Brave, Samsung Internet e UC Browser. Non è necessaria l'installazione di app - tutto funziona direttamente nel tuo browser web.",
    q4: "Quale qualità video posso scaricare?",
    a4: "SaveTikFast scarica video TikTok nella massima qualità disponibile. Questo include risoluzione 720p HD, 1080p Full HD, 2K e persino 4K quando il video originale lo supporta. Non comprimiamo mai né riduciamo la qualità video - ottieni esattamente la stessa qualità del caricamento TikTok originale. Questo rende SaveTikFast superiore ad altri downloader come TikMate, SaveFrom o MusicallyDown che spesso comprimono i video.",
    q5: "È sicuro usare SaveTikFast?",
    a5: "Assolutamente. SaveTikFast è completamente sicuro e protetto. Utilizziamo la crittografia SSL per proteggere la tua connessione, non memorizziamo nessuno dei tuoi dati personali e non richiediamo login o registrazione. I tuoi video scaricati vengono elaborati istantaneamente e non vengono memorizzati sui nostri server. Non installiamo nulla sul tuo dispositivo. SaveTikFast è stato fidato da milioni di utenti dal 2024 per download di video TikTok sicuri.",
    q6: "In che modo SaveTikFast è migliore di SSSTik o SnapTik?",
    a6: "SaveTikFast offre diversi vantaggi rispetto a SSSTik, SnapTik, TikMate e altri downloader TikTok. Il nostro servizio è più veloce (i download si completano in 3 secondi), fornisce output di qualità superiore (fino a 4K), ha un'interfaccia più pulita con meno pubblicità, funziona in modo più affidabile su tutti i dispositivi e offre funzionalità aggiuntive come conversione MP3, download di storie ed estrazione di slideshow. Molti utenti passano a SaveTikFast dopo aver riscontrato problemi con altri downloader.",
    q7: "Posso scaricare video TikTok su iPhone?",
    a7: "Sì, scaricare video TikTok su iPhone è facile con SaveTikFast. Apri TikTok, copia il link del video, quindi apri Safari o Chrome e vai su SaveTikFast. Incolla il link e tocca scarica. Il video verrà salvato direttamente nell'app Foto o File del tuo iPhone. Funziona su tutti i modelli di iPhone inclusi iPhone 15, 14, 13, 12 e precedenti. Nessuna installazione di app richiesta - tutto funziona nel tuo browser.",
    q8: "Posso scaricare video TikTok privati?",
    a8: "SaveTikFast può scaricare solo video TikTok pubblici. I video privati (visibili solo al creatore o ai follower approvati) non possono essere scaricati da nessuno strumento online a causa delle impostazioni di privacy di TikTok. Se hai il permesso del creatore, chiedigli di rendere il video pubblico temporaneamente o di condividerlo direttamente con te tramite le funzionalità di condivisione integrate di TikTok.",
    q9: "Come scaricare TikTok su Samsung o Android?",
    a9: "Scaricare video TikTok su Samsung Galaxy o qualsiasi telefono Android è semplice. Apri l'app TikTok, tocca Condividi sul video che desideri e copia il link. Quindi apri il browser Chrome, Firefox o Samsung Internet e visita SaveTikFast. Incolla il link nella casella di download e tocca il pulsante di download. Il video verrà salvato nella tua cartella Download o Galleria. Funziona su tutti i dispositivi Android inclusi Samsung, Huawei, Xiaomi, OPPO e Google Pixel.",
    q10: "Perché scegliere SaveTikFast rispetto ad altri downloader TikTok?",
    a10: "SaveTikFast è la scelta migliore per i download TikTok perché combiniamo velocità, qualità e affidabilità. Offriamo le velocità di download più veloci (3 secondi), la massima qualità video (fino a 4K), rimozione filigrana, conversione MP3, download di storie ed estrazione di slideshow - tutto in uno strumento gratuito. La nostra interfaccia pulita funziona perfettamente su tutti i dispositivi e browser. Siamo fidati da milioni di utenti come la migliore alternativa a SSSTik, SnapTik, TikMate, SaveFrom e MusicallyDown."
  }
};