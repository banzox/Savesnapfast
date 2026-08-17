import type { APIRoute } from "astro";
import {
    handleTikTokGet,
    handleTikTokOptions,
    handleTikTokPost,
} from "../../server/tiktok-api";

export const prerender = false;

function runtimeFromLocals(locals: unknown): unknown {
    if (!locals || typeof locals !== "object" || !("runtime" in locals)) return undefined;
    return (locals as { runtime?: unknown }).runtime;
}

export const OPTIONS: APIRoute = async () => handleTikTokOptions();

export const POST: APIRoute = async ({ request, locals }) => {
    return handleTikTokPost(request, runtimeFromLocals(locals));
};

export const GET: APIRoute = async ({ request, locals }) => {
    return handleTikTokGet(request, runtimeFromLocals(locals));
};
