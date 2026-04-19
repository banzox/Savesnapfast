import fs from 'fs';

function updateJson(lang, updates) {
    const file = `src/locales/locales/${lang}.json`;
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    for (const [key, value] of Object.entries(updates)) {
        const parts = key.split('.');
        let curr = data;
        for (let i = 0; i < parts.length - 1; i++) {
            if (!curr[parts[i]]) curr[parts[i]] = {};
            curr = curr[parts[i]];
        }
        curr[parts[parts.length - 1]] = value;
    }
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${lang}.json`);
}

updateJson('bg', {
    'nav.about': 'За нас',
    'nav.privacy': 'Политика за поверителност',
    'nav.terms': 'Условия за ползване',
    'nav.disclaimer': 'Отказ от отговорност',
    'nav.dmca': 'DMCA',
    'pages.about.title': 'За нас',
    'pages.about.content': 'Добре дошли в SaveTikFast, водещият TikTok Downloader за 2026 г.<br/><br/>Създадохме SaveTikFast с една цел: да осигурим най-бързото, най-висококачественото и най-надеждното изтегляне от TikTok в интернет без досадни водни знаци.<br/><br/>Нашият екип от разработчици забеляза, че повечето програми за изтегляне на TikTok са бавни, пълни с изскачащи прозорци или влошават качеството на видеото. Решихме да променим това. SaveTikFast обработва видеоклипове за милисекунди, като извлича директните връзки към CDN, за да ви даде точния оригинален файл в пълно Ultra HD качество.<br/><br/>Независимо дали трябва да запазите вирусен танц, урок по готвене, слайдшоу с множество изображения или да извлечете MP3 аудио за мелодия, SaveTikFast се справя с всичко безпроблемно на всички устройства.'
});

updateJson('fil', {
    'nav.about': 'Tungkol sa Amin',
    'nav.privacy': 'Patakaran sa Privacy',
    'nav.terms': 'Mga Tuntunin ng Serbisyo',
    'nav.disclaimer': 'Disclaimer',
    'nav.dmca': 'DMCA',
    'pages.about.title': 'Tungkol sa Amin',
    'pages.about.content': 'Maligayang pagdating sa SaveTikFast, ang nangungunang TikTok Downloader para sa 2026.<br/><br/>Binuo namin ang SaveTikFast nang may isang layunin: upang magbigay ng pinakamabilis, pinakamataas na kalidad, at pinaka-maaasahang karanasan sa pag-download ng TikTok sa internet nang walang anumang nakakainis na watermark.<br/><br/>Napansin ng aming team ng mga developer na ang karamihan sa mga nangda-download ng TikTok ay mabagal, puno ng mga popup, o nagpapababa ng kalidad ng video. Nagpasya kaming baguhin iyon. Pinoproseso ng SaveTikFast ang mga video sa loob ng milliseconds, kinukuha ang mga direktang link ng CDN upang ibigay sa iyo ang eksaktong orihinal na file sa buong Ultra HD na kalidad.<br/><br/>Kailangan mo mang i-save ang isang viral dance, isang cooking tutorial, isang multi-image slideshow, o kunin ang MP3 audio para sa isang ringtone, pinangangasiwaan ng SaveTikFast ang lahat ng ito nang walang putol sa lahat ng device.'
});

updateJson('it', { 'nav.disclaimer': 'Disclaimer' });
updateJson('nl', { 'nav.disclaimer': 'Disclaimer' });
