// Only passive display ad units are allowed (native + 300x250 banner).
// Do NOT re-add popunders/smartlinks (window.open), social bars, or redirects
// to ad networks: Google Safe Browsing / Search treat them as deceptive and
// de-index the site.
export const ADS_CONFIG = {
    enableAdsterra: false,
    nativeBannerScript: "https://pl28502654.profitableratecpmnetwork.com/2d1b844eacef7f58a020be44e8239ff9/invoke.js",
    nativeBannerContainer: "container-2d1b844eacef7f58a020be44e8239ff9",
    banner300x250Script: "https://www.highrevenueformat.com/15bf9d78696647e64b6e0e360912a7fe/invoke.js",
    banner300x250Key: "15bf9d78696647e64b6e0e360912a7fe",
};
