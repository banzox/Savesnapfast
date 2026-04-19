globalThis.process ??= {}; globalThis.process.env ??= {};
import { d as defineMiddleware, s as sequence } from './chunks/index_CPSw9rT_.mjs';
import './chunks/astro-designed-error-pages_DD4jMgNF.mjs';
import './chunks/astro/server_CLQcuNu7.mjs';

const redirects = {
  "about-us": "about",
  "who-are-we": "about",
  "contact-us": "contact",
  "privacy-policy": "privacy",
  "terms-of-service": "terms",
  "terms-and-conditions": "terms",
  "disclaimer-policy": "disclaimer",
  "dmca-policy": "dmca"
};
const onRequest$2 = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const path = url.pathname;
  let cleanPath = path;
  if (path.endsWith("/") && path.length > 1) {
    cleanPath = path.slice(0, -1);
    return context.redirect(cleanPath + url.search, 301);
  }
  if (cleanPath.endsWith(".html")) {
    const targetPath = cleanPath.slice(0, -5);
    return context.redirect(targetPath + url.search, 301);
  }
  const parts = cleanPath.split("/").filter(Boolean);
  if (parts.length > 0) {
    if (parts[0] === "tl") {
      parts[0] = "fil";
      const newPath = "/" + parts.join("/");
      return context.redirect(newPath + url.search, 301);
    }
    const lastPart = parts[parts.length - 1];
    if (redirects[lastPart]) {
      const newSlug = redirects[lastPart];
      const newPathParts = parts.slice(0, -1);
      newPathParts.push(newSlug);
      const newPath = "/" + newPathParts.join("/");
      return context.redirect(newPath, 301);
    }
  }
  return next();
});

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	onRequest$2
	
);

export { onRequest };
