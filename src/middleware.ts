
import { defineMiddleware } from "astro:middleware";
import { getCanonicalRedirect } from "./utils/redirects";

export const onRequest = defineMiddleware(async (context, next) => {
    // With build.format="file", Astro prerenders clean routes to internal
    // .html filenames. Redirecting those build-time URLs would replace every
    // generated page with a redirect document. The deployed Worker owns the
    // production redirect layer, so prerendering must render content normally.
    if (context.isPrerendered) return next();

    const url = new URL(context.request.url);
    const destination = getCanonicalRedirect(url);

    if (destination) return context.redirect(destination, 301);

    return next();
});
