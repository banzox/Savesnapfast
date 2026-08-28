const fs = require('fs');
const path = require('path');

const blogDir = './src/content/blog';
const files = fs.readdirSync(blogDir);
console.log('Total blog files:', files.length);

const posts = [];
files.forEach(f => {
  const content = fs.readFileSync(path.join(blogDir, f), 'utf8');
  const titleMatch = content.match(/title:\s*["']?([^"'\n]+)/);
  const langMatch = content.match(/lang:\s*["']?([^"'\n]+)/);
  const pubDateMatch = content.match(/pubDate:\s*["']?([^"'\n]+)/);
  posts.push({
    file: f,
    slug: f.replace(/\.md$/, ''),
    title: titleMatch ? titleMatch[1] : '',
    lang: langMatch ? langMatch[1] : 'en',
    pubDate: pubDateMatch ? pubDateMatch[1] : ''
  });
});

console.log(JSON.stringify(posts, null, 2));
