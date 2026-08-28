const fs = require('fs');
const cheerio = require('cheerio');

// Run generator and get XML string directly
const { execSync } = require('child_process');
const output = execSync('node -e "const { testGen } = require(\'./tools/sitemap_lib.cjs\'); console.log(testGen());"', { encoding: 'utf8' });

// We can test parsing directly
