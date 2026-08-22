# SaveTikFast (`savetik-fast.xyz`)

High-performance, multilingual TikTok Video & MP3 Downloader built on **Astro 5.x SSG** and deployed globally via **Cloudflare Workers**.

---

## ⚡ Key Features

- **Blazing Fast Static Generation**: 191 pre-rendered static HTML routes across 30 languages with zero runtime latency.
- **Advanced Multilingual SEO**: Self-referencing canonical URLs, 31-cluster bidirectional `hreflang` tags (including `x-default`), and clean XML sitemaps.
- **Full Cloudflare Edge Integration**: Edge-level routing, apex hostname normalizations (`www` ➔ apex 301), and crawler security policies.
- **Rich Structured Data**: Complete Schema.org JSON-LD schemas (`WebSite`, `WebApplication`, `FAQPage`, `BreadcrumbList`, `Organization`).
- **Comprehensive Diagnostic Engine**: In-repo testing suite (`site-doctor`, `live-diagnostics`, `test_crawler_emulation`).

---

## 🛠️ Tech Stack

- **Framework**: [Astro 5.x](https://astro.build/) (Static Site Generation)
- **Edge Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/) (`@astrojs/cloudflare` + Static Assets)
- **UI Components**: Astro & React 19
- **Languages**: 30 Locales (`en`, `ar`, `es`, `fr`, `de`, `pt`, `id`, `tr`, `ru`, `vi`, `th`, `ja`, `ko`, `pl`, `nl`, `ro`, `ms`, `fil`, `uk`, `cs`, `sv`, `hu`, `el`, `da`, `fi`, `no`, `bg`, `zh`, `hi`)

---

## 🧞 Available Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | Starts the Astro development server at `http://localhost:4321` |
| `npm run build` | Compiles the full static site into the `./dist/` directory |
| `npm run doctor` | Runs the 117-point SEO, routing, schema, and sitemap assertion engine |
| `npm run live:check` | Probes live DNS, SSL, Cloudflare edge, and Googlebot accessibility on `savetik-fast.xyz` |
| `npm run ping:search` | Dispatches instant sitemap notifications to Google, Bing, and IndexNow |
| `npx wrangler deploy` | Deploys static assets and edge worker directly to Cloudflare |

---

## 🛡️ Edge Security & Headers

Configured in `public/_headers`:
- **HSTS**: `max-age=31536000; includeSubDomains; preload`
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `SAMEORIGIN`
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Content-Security-Policy**: Enforces strict domain allowances for scripts, media, and fonts.
- **Permissions-Policy**: Restricts access to camera, microphone, and geolocation.

---

## 📂 Project Structure

```text
├── public/                 # Static assets, robots.txt, sitemaps, _headers
├── src/
│   ├── components/         # Astro UI components (SEOConfig, Schema, Navigation)
│   ├── i18n/               # Translation dictionary and language helpers
│   ├── layouts/            # Page layout wrapper (Layout.astro)
│   ├── locales/            # 30 language JSON translation files
│   ├── pages/              # Static routes ([lang], tools, blog, legal)
│   ├── server/             # API endpoints (/api/tiktok, /api/download)
│   └── utils/              # Canonical redirect and helper utilities
├── tools/                  # Automated verification and diagnostic suites
├── worker/                 # Cloudflare Worker edge entry point (index.ts)
├── wrangler.jsonc          # Cloudflare deployment configuration
└── package.json
```
