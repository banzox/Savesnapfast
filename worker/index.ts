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

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        if (url.pathname === "/api/tiktok") {
            const runtime = {
                env,
                waitUntil: (promise: Promise<unknown>) => ctx.waitUntil(promise),
            };
            if (request.method === "GET") return handleTikTokGet(request, runtime);
            if (request.method === "POST") return handleTikTokPost(request, runtime);
            if (request.method === "OPTIONS") return handleTikTokOptions();
            return methodNotAllowed();
        }

        if (url.pathname === "/api/download") {
            if (request.method === "GET") return handleDownloadGet(request);
            if (request.method === "OPTIONS") return handleDownloadOptions();
            return downloadMethodNotAllowed();
        }

        const destination = getCanonicalRedirect(url);

        if (destination) {
            return Response.redirect(new URL(destination, request.url), 301);
        }

        return env.ASSETS.fetch(request);
    },
} satisfies ExportedHandler<Env>;
