import { getCanonicalRedirect } from "../src/utils/redirects.ts";
import {
    handleTikTokGet,
    handleTikTokOptions,
    handleTikTokPost,
    methodNotAllowed,
} from "../src/server/tiktok-api.ts";
import {
    downloadMethodNotAllowed,
    handleDownloadGet,
    handleDownloadOptions,
} from "../src/server/download-api.ts";

function withRobotsHeader(response: Response, directive = "noindex, nofollow"): Response {
    const headers = new Headers(response.headers);
    headers.set("X-Robots-Tag", directive);
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Hostname canonicalization: redirect www.savetik-fast.xyz to savetik-fast.xyz
        if (url.hostname === "www.savetik-fast.xyz" || url.hostname.startsWith("www.")) {
            url.hostname = url.hostname.replace(/^www\./, "");
            return Response.redirect(url.toString(), 301);
        }

        if (url.pathname === "/api/tiktok") {
            const runtime = {
                env,
                waitUntil: (promise: Promise<unknown>) => ctx.waitUntil(promise),
            };
            let response: Response;
            if (request.method === "GET") response = await handleTikTokGet(request, runtime);
            else if (request.method === "POST") response = await handleTikTokPost(request, runtime);
            else if (request.method === "OPTIONS") response = handleTikTokOptions();
            else response = methodNotAllowed();
            return withRobotsHeader(response);
        }

        if (url.pathname === "/api/download") {
            let response: Response;
            if (request.method === "GET") response = await handleDownloadGet(request);
            else if (request.method === "OPTIONS") response = handleDownloadOptions();
            else response = downloadMethodNotAllowed();
            return withRobotsHeader(response);
        }

        if (url.pathname.startsWith("/api/")) {
            return withRobotsHeader(new Response(JSON.stringify({ error: "Not Found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            }));
        }

        const normalizedPath = url.pathname.replace(/\/+$/, "");

        // Gracefully serve sitemap.xml even if a user pastes the full URL into GSC's URL-prefix box
        if (
            normalizedPath.endsWith("/sitemap.xml") ||
            normalizedPath.endsWith("/sitemap-0.xml") ||
            normalizedPath.endsWith("/sitemap_index.xml")
        ) {
            const sitemapRes = await env.ASSETS.fetch(new Request(new URL("/sitemap.xml", request.url), request));
            const headers = new Headers(sitemapRes.headers);
            headers.set("Content-Type", "application/xml; charset=utf-8");
            headers.set("X-Robots-Tag", "all");
            headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
            return new Response(sitemapRes.body, {
                status: 200,
                headers,
            });
        }

        // Permanently retired /boost routes return HTTP 410 Gone so search engines immediately drop them
        if (normalizedPath === "/boost" || /^\/[a-z]{2,3}\/boost$/i.test(normalizedPath)) {
            const assetRes = await env.ASSETS.fetch(new Request(new URL("/404.html", request.url), request));
            const headers = new Headers(assetRes.headers);
            headers.set("X-Robots-Tag", "noindex, nofollow");
            headers.set("Cache-Control", "public, max-age=86400");
            return new Response(assetRes.body, {
                status: 410,
                statusText: "Gone",
                headers,
            });
        }

        // Force true 404 status for explicit 404 paths (prevents soft-404 indexing errors in Google Search Console)
        if (normalizedPath === "/404" || url.pathname === "/404.html") {
            const assetRes = await env.ASSETS.fetch(new Request(new URL("/404.html", request.url), request));
            const headers = new Headers(assetRes.headers);
            headers.set("X-Robots-Tag", "noindex, follow");
            headers.set("Cache-Control", "public, max-age=3600");
            return new Response(assetRes.body, {
                status: 404,
                statusText: "Not Found",
                headers,
            });
        }

        // Tag internal admin tools and ad frames with noindex, nofollow
        if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/ad-")) {
            const assetRes = await env.ASSETS.fetch(request);
            const headers = new Headers(assetRes.headers);
            headers.set("X-Robots-Tag", "noindex, nofollow");
            headers.set("Cache-Control", "private, no-store");
            return new Response(assetRes.body, {
                status: assetRes.status,
                statusText: assetRes.statusText,
                headers,
            });
        }

        const destination = getCanonicalRedirect(url);

        if (destination) {
            return Response.redirect(new URL(destination, request.url), 301);
        }

        const assetRes = await env.ASSETS.fetch(request);
        if (assetRes.status === 404) {
            return withRobotsHeader(assetRes, "noindex, follow");
        }
        return assetRes;
    },
} satisfies ExportedHandler<Env>;
