const SUPPORTED_LANGUAGES = new Set([
    "en", "ar", "es", "pt", "id", "fr", "de", "it", "tr", "ru",
    "vi", "th", "ja", "ko", "pl", "nl", "ro", "ms", "fil", "uk",
    "cs", "sv", "hu", "el", "da", "fi", "no", "bg", "zh", "hi",
]);

const LEGACY_LANGUAGES: Record<string, string> = {
    tl: "fil",
};

const ALL_LANGUAGES = new Set([...SUPPORTED_LANGUAGES, ...Object.keys(LEGACY_LANGUAGES)]);

const LEGACY_SLUGS: Record<string, string> = {
    "about-us": "about",
    "who-are-we": "about",
    "contact-us": "contact",
    "privacy-policy": "privacy",
    "terms-of-service": "terms",
    "terms-and-conditions": "terms",
    "disclaimer-policy": "disclaimer",
    "dmca-policy": "dmca",
};

const CONTENT_SLUGS = new Set([
    "about", "blog", "contact", "disclaimer", "dmca", "editorial-policy",
    "mp3", "privacy", "slideshow", "story", "terms", "tools",
    "ios", "android", "mac", "pc",
    ...Object.keys(LEGACY_SLUGS),
]);

/**
 * Return the canonical path for a legacy URL, or null when no redirect is
 * needed. This stays independent from Astro so the same rules can run in
 * local middleware and in the deployed Cloudflare Worker.
 */
export function getCanonicalRedirect(url: URL): string | null {
    const originalPath = url.pathname;
    const originalSearch = url.search;
    const parts = originalPath.split("/").filter(Boolean);
    let changed = originalPath.length > 1 && originalPath.endsWith("/");

    const lastIndex = parts.length - 1;
    const htmlSlug = lastIndex >= 0 && parts[lastIndex].endsWith(".html")
        ? parts[lastIndex].slice(0, -5)
        : null;
    const isKnownHtmlPage = htmlSlug !== null && (
        htmlSlug === "index" ||
        (parts.length === 1 && (
            ALL_LANGUAGES.has(htmlSlug) ||
            CONTENT_SLUGS.has(htmlSlug)
        )) ||
        (parts.length === 2 && (
            (ALL_LANGUAGES.has(parts[0]) && (
                ALL_LANGUAGES.has(htmlSlug) || CONTENT_SLUGS.has(htmlSlug)
            )) ||
            parts[0] === "blog"
        )) ||
        (parts.length === 3 && ALL_LANGUAGES.has(parts[0]) && parts[1] === "blog")
    );

    if (htmlSlug !== null && isKnownHtmlPage) {
        parts[lastIndex] = htmlSlug;
        changed = true;
    }

    // Old language-switcher links used /current/target.html. They are not
    // content pages; send them directly to the target language homepage.
    if (
        parts.length === 2 &&
        ALL_LANGUAGES.has(parts[0]) &&
        ALL_LANGUAGES.has(parts[1])
    ) {
        parts.splice(0, 2, parts[1]);
        changed = true;
    }

    if (parts[0] === "tl" || LEGACY_LANGUAGES[parts[0]]) {
        parts[0] = LEGACY_LANGUAGES[parts[0]] || "fil";
        changed = true;
    } else if (parts[0] === "en") {
        parts.shift();
        changed = true;
    }

    if (parts.length === 1 && parts[0] === "index") {
        parts.length = 0;
        changed = true;
    } else if (parts.length > 1 && parts[parts.length - 1] === "index") {
        parts.pop();
        changed = true;
    }

    const finalIndex = parts.length - 1;
    if (finalIndex >= 0 && LEGACY_SLUGS[parts[finalIndex]]) {
        parts[finalIndex] = LEGACY_SLUGS[parts[finalIndex]];
        changed = true;
    }

    // Replace legacy query-based language selection with the clean language
    // path. Unknown values still collapse to the canonical English homepage.
    if (parts.length === 0 && url.searchParams.has("lang")) {
        const requestedLanguage = url.searchParams.get("lang")?.toLowerCase();
        if (requestedLanguage === "tl") {
            parts.push("fil");
        } else if (
            requestedLanguage &&
            requestedLanguage !== "en" &&
            SUPPORTED_LANGUAGES.has(requestedLanguage)
        ) {
            parts.push(requestedLanguage);
        }
        url.searchParams.delete("lang");
        changed = true;
    }

    if (!changed) return null;

    const pathname = parts.length > 0 ? `/${parts.join("/")}` : "/";
    const search = url.searchParams.toString();
    const candidate = search ? `${pathname}?${search}` : pathname;
    const originalFull = originalSearch ? `${originalPath}${originalSearch}` : originalPath;

    if (candidate === originalFull) return null;
    return candidate;
}
