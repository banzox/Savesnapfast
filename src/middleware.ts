
import { defineMiddleware } from "astro:middleware";

// Map of legacy slugs to new slugs
const redirects: Record<string, string> = {
    "about-us": "about",
    "who-are-we": "about",
    "contact-us": "contact",
    "privacy-policy": "privacy",
    "terms-of-service": "terms",
    "terms-and-conditions": "terms",
    "disclaimer-policy": "disclaimer",
    "dmca-policy": "dmca",
};

export const onRequest = defineMiddleware(async (context, next) => {
    const url = new URL(context.request.url);
    const path = url.pathname;

    // Clean trailing slash first (build clean path for all checks)
    let cleanPath = (path.endsWith("/") && path.length > 1)
        ? path.slice(0, -1)
        : path;

    // Split path parts
    const parts = cleanPath.split("/").filter(Boolean);

    let needsRedirect = cleanPath !== path; // trailing slash was removed

    if (parts.length > 0) {
        // Redirect legacy tl to fil
        if (parts[0] === "tl") {
            parts[0] = "fil";
            needsRedirect = true;
        }
        // Redirect /en to /
        else if (parts[0] === "en") {
            parts.shift();
            needsRedirect = true;
        }

        // Check if the last part is a legacy slug
        if (parts.length > 0) {
            const lastPart = parts[parts.length - 1];
            if (redirects[lastPart]) {
                parts[parts.length - 1] = redirects[lastPart];
                needsRedirect = true;
            }
        }
    }

    if (needsRedirect) {
        const newPath = parts.length > 0 ? "/" + parts.join("/") : "/";
        return context.redirect(newPath + url.search, 301);
    }

    return next();
});
