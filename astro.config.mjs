import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import fs from 'fs';
import path from 'path';

const locales = ['en', 'ar', 'es', 'pt', 'id', 'fr', 'de', 'it', 'tr', 'ru', 'vi', 'th', 'ja', 'ko', 'pl', 'nl', 'ro', 'ms', 'fil', 'uk', 'cs', 'sv', 'hu', 'el', 'da', 'fi', 'no', 'bg', 'zh', 'hi'];




// Dynamically compute the number of blog posts per language at build time
const blogDir = './src/content/blog';
const postCounts = {};
locales.forEach(l => postCounts[l] = 0);

if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir);
    files.forEach(file => {
        if (!file.endsWith('.md')) return;
        const nameWithoutExt = path.parse(file).name;
        let matchedLocale = 'en';
        for (const locale of locales) {
            if (locale === 'en') continue;
            if (nameWithoutExt.endsWith('-' + locale)) {
                matchedLocale = locale;
                break;
            }
        }
        postCounts[matchedLocale]++;
    });
}

// https://astro.build/config
export default defineConfig({
    site: 'https://savetik-fast.xyz',
    trailingSlash: 'never',
    build: {
        format: 'file'
    },
    integrations: [react(), sitemap({
        filter: (page) => {
            const url = new URL(page);
            const pathStr = url.pathname;

            // Exclude /en/ prefixed paths (they redirect to root, causing GSC "redirect" errors)
            if (pathStr.startsWith('/en/') || pathStr === '/en') return false;

            const pathSegments = pathStr.split('/').filter(Boolean);
            const lastSegment = pathSegments[pathSegments.length - 1];

            // Exclude device-specific pages (e.g. /ios, /ar/ios)
            const devicePages = ['ios', 'android', 'mac', 'pc'];
            if (pathSegments.length > 0 && devicePages.includes(lastSegment)) return false;

            // Translated legal pages are now allowed (they have canonical pointing to English)
            // This avoids hreflang vs sitemap conflicts that block indexing


            // Exclude thin-content blog listing pages (fewer than 2 posts)
            let isBlogList = false;
            let blogListLang = 'en';

            if (pathSegments.length === 1 && pathSegments[0] === 'blog') {
                isBlogList = true;
                blogListLang = 'en';
            } else if (pathSegments.length === 2 && locales.includes(pathSegments[0]) && pathSegments[1] === 'blog') {
                isBlogList = true;
                blogListLang = pathSegments[0];
            }

            if (isBlogList) {
                const count = postCounts[blogListLang] || 0;
                if (count < 2) {
                    return false;
                }
            }

            return true;
        },
        serialize(item) {
            // Set priority based on page importance
            const url = new URL(item.url);
            const pathStr = url.pathname;
            const pathSegments = pathStr.split('/').filter(Boolean);
            
            // Homepage and language homepages get highest priority
            if (pathSegments.length === 0) {
                item.priority = 1.0;
                item.changefreq = 'daily';
            } else if (pathSegments.length === 1 && locales.includes(pathSegments[0])) {
                // Language homepages like /ar, /es, /fr (not /mp3)
                item.priority = 0.9;
                item.changefreq = 'daily';
            } else if (pathStr.includes('/blog/')) {
                // Blog posts
                item.priority = 0.7;
                item.changefreq = 'weekly';
            } else {
                // Other pages (mp3, story, slideshow, tools, blog index)
                item.priority = 0.8;
                item.changefreq = 'weekly';
            }
            
            // Don't set lastmod to current build time (misleading to Google)
            // Google ignores lastmod when all pages have the same timestamp
            // Let Google determine freshness from crawl data instead
            return item;
        }
    })],
    i18n: {
        defaultLocale: 'en',
        locales: locales,
        routing: {
            prefixDefaultLocale: false
        }
    }
});