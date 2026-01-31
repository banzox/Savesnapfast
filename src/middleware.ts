
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

    // Clean trailing slash and .html for checking
    let cleanPath = path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;

    // REDIRECT .html to clean path
    if (cleanPath.endsWith(".html")) {
        const targetPath = cleanPath.slice(0, -5);
        return context.redirect(targetPath + url.search, 301);
    }

    // Split path parts
    const parts = cleanPath.split("/").filter(Boolean);

    if (parts.length > 0) {
        const lastPart = parts[parts.length - 1]; // Get the slug (e.g. 'about-us')

        // Check if the last part is a legacy slug
        if (redirects[lastPart]) {
            const newSlug = redirects[lastPart];

            // Reconstruct the new path
            // If it has language prefix (e.g. /ar/about-us), keep /ar/
            // parts.slice(0, -1) gives everything before the slug

            const newPathParts = parts.slice(0, -1);
            newPathParts.push(newSlug);

            const newPath = "/" + newPathParts.join("/");

            return context.redirect(newPath, 301);
        }
    }

    return next();
});
