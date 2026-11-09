// Monetization & Advertising Configuration
// 1. Google AdSense Auto Ads are enabled automatically on all indexable content pages
//    (and strictly excluded from 404/error/noindex pages per AdSense Publisher Policy).
// 2. Once you create manual Display/In-Article ad units in your AdSense dashboard
//    (Ads -> By ad unit -> Display ads), paste the 10-digit numeric slot IDs below
//    to activate high-RPM manual placements in addition to Auto Ads.
// 3. Do NOT add popunders, smartlinks (window.open), or redirect scripts: Google Safe
//    Browsing flags them as deceptive and de-indexes the domain.
export const ADS_CONFIG = {
    adsenseClient: "ca-pub-2779375554237684",
    enableAdSense: true,
    adsenseSlots: {
        heroBottom: "",     // Paste 10-digit Display Ad Slot ID (e.g. "1234567890")
        midContent: "",     // Paste 10-digit Display/In-Feed Slot ID
        blogInArticle: "",  // Paste 10-digit In-Article Slot ID
        toolsBanner: "",    // Paste 10-digit Display Ad Slot ID
    },
    enableAdsterra: false,
    nativeBannerScript: "https://pl28502654.profitableratecpmnetwork.com/2d1b844eacef7f58a020be44e8239ff9/invoke.js",
    nativeBannerContainer: "container-2d1b844eacef7f58a020be44e8239ff9",
    banner300x250Script: "https://www.highrevenueformat.com/15bf9d78696647e64b6e0e360912a7fe/invoke.js",
    banner300x250Key: "15bf9d78696647e64b6e0e360912a7fe",
};
