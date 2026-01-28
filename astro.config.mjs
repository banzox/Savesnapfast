import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: cloudflare(),
    integrations: [react(), sitemap()],
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'ar', 'fr', 'es', 'de', 'id', 'it', 'ja', 'ko', 'pt', 'ru', 'th', 'tr', 'vi'], // Adding major languages from the list initially, will add all 90+ later or dynamically
        routing: {
            prefixDefaultLocale: false
        }
    }
});