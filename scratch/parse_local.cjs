const fs = require('fs');
const cheerio = require('cheerio');

function main() {
    const html = fs.readFileSync('dist/index.html', 'utf8');
    const $ = cheerio.load(html);
    
    console.log("=== LOCAL SCRIPTS ===");
    $('script').each((i, el) => {
        console.log(i, {
            src: $(el).attr('src'),
            type: $(el).attr('type'),
            textSnippet: $(el).text().substring(0, 100).replace(/\n/g, ' '),
            textLength: $(el).text().length
        });
    });
}

main();
