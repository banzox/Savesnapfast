// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/_server-islands/*",
    "/_image",
    "/api/*",
    "/sitemap.xml"
  ],
  exclude: [
    "/",
    "/_astro/*",
    "/#",
    "/sitemap.xml",
    "/.assetsignore",
    "/android-chrome-192x192.png",
    "/android-chrome-512x512.png",
    "/apple-touch-icon.png",
    "/favicon-16x16.png",
    "/favicon-32x32.png",
    "/favicon.ico",
    "/favicon.png",
    "/manifest.json",
    "/og-image.png",
    "/robots.txt",
    "/404",
    "/about",
    "/blog",
    "/contact",
    "/disclaimer",
    "/dmca",
    "/mp3",
    "/privacy",
    "/slideshow",
    "/story",
    "/terms",
    "/tools",
    "/en/*",
    "/ar/*",
    "/es/*",
    "/pt/*",
    "/id/*",
    "/fr/*",
    "/de/*",
    "/it/*",
    "/tr/*",
    "/ru/*",
    "/vi/*",
    "/th/*",
    "/ja/*",
    "/ko/*",
    "/pl/*",
    "/nl/*",
    "/ro/*",
    "/ms/*",
    "/fil/*",
    "/uk/*",
    "/cs/*",
    "/sv/*",
    "/hu/*",
    "/el/*",
    "/da/*",
    "/fi/*",
    "/no/*",
    "/bg/*",
    "/zh/*",
    "/hi/*"
  ]
};

// node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "C:\\Users\\newFUTURE\\Desktop\\xmax2\\Savesnapfast\\.wrangler\\tmp\\pages-bfU8Vi\\bundledWorker-0.2515163116405721.mjs";
import { isRoutingRuleMatch } from "C:\\Users\\newFUTURE\\Desktop\\xmax2\\Savesnapfast\\node_modules\\wrangler\\templates\\pages-dev-util.ts";
export * from "C:\\Users\\newFUTURE\\Desktop\\xmax2\\Savesnapfast\\.wrangler\\tmp\\pages-bfU8Vi\\bundledWorker-0.2515163116405721.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=kuszzupdimn.js.map
