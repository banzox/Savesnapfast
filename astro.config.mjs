import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://savetik-fast.xyz',
    trailingSlash: 'never',
    build: {
        format: 'file'
    },
    output: 'server',
    adapter: cloudflare(),
    integrations: [react(), sitemap({
        filter: (page) => {
            const url = new URL(page);
            const path = url.pathname;

            // Exclude /en/ prefixed paths (they redirect to root, causing GSC "redirect" errors)
            if (path.startsWith('/en/') || path === '/en') return false;

            // Exclude all device pages (ios/android/mac/pc) - they are duplicate content
            // This covers: /ios, /android, /mac, /pc AND /{lang}/ios, /{lang}/android, etc.
            const devicePaths = ['/ios', '/android', '/mac', '/pc'];
            const pathSegments = path.split('/').filter(Boolean);
            const lastSegment = pathSegments[pathSegments.length - 1];
            if (devicePaths.some(d => path === d || path.endsWith(d))) return false;
            if (['ios', 'android', 'mac', 'pc'].includes(lastSegment)) return false;

            // Exclude non-English legal pages to avoid duplicate/thin content
            const legalPages = ['about', 'privacy', 'terms', 'disclaimer', 'dmca', 'contact'];
            if (pathSegments.length >= 2 && legalPages.includes(lastSegment)) {
                return false;
            }

            return true;
        },
        serialize(item) {
            item.lastmod = new Date().toISOString();
            return item;
        }
    })],
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'ar', 'es', 'pt', 'id', 'fr', 'de', 'it', 'tr', 'ru', 'vi', 'th', 'ja', 'ko', 'pl', 'nl', 'ro', 'ms', 'fil', 'uk', 'cs', 'sv', 'hu', 'el', 'da', 'fi', 'no', 'bg', 'zh', 'hi'],
        routing: {
            prefixDefaultLocale: false
        }
    }
});