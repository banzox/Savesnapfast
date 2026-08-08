# Summary of Modified Files

## 1. Localizations (`src/locales/locales/*.json`)
- **Files**: All 30 language locale JSON files (`en.json`, `ar.json`, `bg.json`, `cs.json`, `da.json`, `de.json`, `el.json`, `es.json`, `fi.json`, `fil.json`, `fr.json`, `hi.json`, `hu.json`, `id.json`, `it.json`, `ja.json`, `ko.json`, `ms.json`, `nl.json`, `no.json`, `pl.json`, `pt.json`, `ro.json`, `ru.json`, `sv.json`, `th.json`, `tr.json`, `uk.json`, `vi.json`, `zh.json`).
- **Modification**: Inserted missing `"title"` key inside the top-level `"features"` object for all 30 language files (e.g. `"Key Features"`, `"المميزات الرئيسية"`, `"Características principales"`, etc.).
- **Rationale**: Fixes issue where `DownloadPage.astro:216` rendered raw key fallback `"features.title"` instead of localized section title.

## 2. Language Switcher (`src/components/LanguageSelector.astro`)
- **File**: `src/components/LanguageSelector.astro`
- **Modification**: Added 404 page path check in `getPathForLanguage`:
  ```ts
  const is404 = currentPath === "/404" || currentPath.endsWith("/404");
  if (is404) {
      if (targetLang === defaultLang) {
          return "/404" + search;
      }
      return `/${targetLang}${search}`;
  }
  ```
- **Rationale**: Prevents language switcher on 404 page from building non-existent `/{lang}/404` routes. Redirects users to valid clean language landing pages `/{lang}` or root `/404`.

## 3. Proxy Domain Whitelist (`src/pages/api/download.ts`)
- **File**: `src/pages/api/download.ts`
- **Modification**: Added `tikwm.com`, `tiklydown.eu.org`, `tiklydown.com`, `ssstik.io`, `lovetik.com`, `apizell.web.id`, `wolfy.love`, `clxxped.lol`, `meowing.de` to `ALLOWED_DOMAINS` array.
- **Rationale**: Prevents HTTP 403 Forbidden errors when proxying fallback media streams and slideshow images hosted on TikWM or third-party mirror domains.

## 4. TikTok Server-Side API (`src/pages/api/tiktok.ts`)
- **File**: `src/pages/api/tiktok.ts`
- **Modification**: Implemented `fetchTikWMFallback(videoUrl)` logic in `POST` handler. If RapidAPI returns empty video/music strings (`video: ""`, `music: ""`), fails, or if `RAPIDAPI_KEY` environment variable is not present, the endpoint automatically extracts video, audio stream links, and metadata from TikWM API.
- **Rationale**: Ensures reliable server-side extraction and playable video/music downloads even when oEmbed/RapidAPI responses are missing stream URLs.

## 5. Slideshow ZIP Proxying (`src/components/Downloader.jsx`)
- **File**: `src/components/Downloader.jsx`
- **Modification**: Updated `downloadAllImages` function to route slideshow image fetches through proxy URL `/api/download?url=${encodeURIComponent(imgUrl)}&filename=${encodeURIComponent(fileName)}`.
- **Rationale**: Avoids client-side CORS blocking on TikTok CDN image URLs and prevents empty 0-byte ZIP files from being generated.

## 6. Diagnostic Test Suites (`test-scrapers.js` & `test-all-apis.js`)
- **Files**: `test-scrapers.js`, `test-all-apis.js`
- **Modification**:
  - Added `process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'` to bypass TLS certificate altname mismatches (`api.tiklydown.eu.org`).
  - Added response status and content-type checking to handle offline providers gracefully.
- **Rationale**: Ensures diagnostic test scripts run to completion without crashing due to network/TLS errors on legacy/offline mirror providers.
