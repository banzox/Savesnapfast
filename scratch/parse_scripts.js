const cheerio = require('cheerio');

async function main() {
    const res = await fetch('https://savetik-fast.xyz');
    const html = await res.text();
    const $ = cheerio.load(html);
    
    console.log("=== SCRIPTS ===");
    $('script').each((i, el) => {
        console.log(i, {
            src: $(el).attr('src'),
            type: $(el).attr('type'),
            isInline: $(el).attr('is:inline') !== undefined,
            textSnippet: $(el).text().substring(0, 100).replace(/\n/g, ' '),
            textLength: $(el).text().length
        });
    });
}

main().catch(console.error);
