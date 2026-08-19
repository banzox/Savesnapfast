import { getCanonicalRedirect } from "../src/utils/redirects";
import {
    handleTikTokGet,
    handleTikTokOptions,
    handleTikTokPost,
    methodNotAllowed,
} from "../src/server/tiktok-api";
import {
    downloadMethodNotAllowed,
    handleDownloadGet,
    handleDownloadOptions,
} from "../src/server/download-api";

function withRobotsHeader(response: Response): Response {
    const headers = new Headers(response.headers);
    headers.set("X-Robots-Tag", "noindex, nofollow");
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

        const destination = getCanonicalRedirect(url);

        if (destination) {
            return Response.redirect(new URL(destination, request.url), 301);
        }

        return env.ASSETS.fetch(request);
    },
} satisfies ExportedHandler<Env>;
