import type { APIRoute } from 'astro';

// ================================
// SavetikFast - TikTok API (RapidAPI)
// Endpoint: /api/tiktok
// ================================

export const POST: APIRoute = async ({ request, locals }) => {
    const CORS_HEADERS = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    try {
        // 1. استخراج الرابط من POST body
        const body = await request.json();
        const videoUrl = body.url;

        if (!videoUrl || !videoUrl.includes("tiktok.com")) {
            return new Response(JSON.stringify({ error: "Invalid TikTok URL" }), {
                status: 400,
                headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
            });
        }

        // 2. جلب مفتاح API من البيئة
        const runtime = (locals as any).runtime;
        const apiKey = runtime?.env?.RAPIDAPI_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: "API key not configured" }), {
                status: 500,
                headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
            });
        }

        // 3. طلب البيانات من RapidAPI
        const apiResponse = await fetch(
            `https://tiktok-data-srapper.p.rapidapi.com/api/v1/tiktok/video?url=${encodeURIComponent(videoUrl)}`,
            {
                method: "GET",
                headers: {
                    "x-rapidapi-key": apiKey,
                    "x-rapidapi-host": "tiktok-data-srapper.p.rapidapi.com",
                    "Content-Type": "application/json"
                }
            }
        );

        if (!apiResponse.ok) {
            throw new Error(`API returned ${apiResponse.status}`);
        }

        const result = await apiResponse.json();

        if (!result || !result.data) {
            return new Response(JSON.stringify({ error: "Video not found or link is invalid" }), {
                status: 404,
                headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
            });
        }

        const v = result.data;

        // 4. تحويل البيانات إلى الصيغة المتوافقة مع Downloader.jsx
        const finalData = {
            provider: "rapidapi",
            title: v.title || "TikTok Video",
            author: v.author?.nickname || v.author?.unique_id || "TikTok User",
            cover: v.cover || v.origin_cover || "",
            video: v.play || "",
            music: (typeof v.music === "string") ? v.music : (v.music_info?.play || v.music?.play_url || ""),
            images: v.images || [],
            type: (v.images && v.images.length > 0) ? "image" : "video",
            play: v.play || "",
            download_url: v.play || "",
        };

        return new Response(JSON.stringify(finalData), {
            status: 200,
            headers: {
                ...CORS_HEADERS,
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=3600",
            }
        });

    } catch (error: any) {
        return new Response(JSON.stringify({
            error: "Server Error",
            details: error.message
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

// دعم GET أيضاً
export const GET: APIRoute = async ({ request, locals }) => {
    const url = new URL(request.url);
    const videoUrl = url.searchParams.get("url");

    // تحويل GET إلى POST
    const fakeRequest = new Request(request.url, {
        method: "POST",
        headers: request.headers,
        body: JSON.stringify({ url: videoUrl })
    });

    return POST({ request: fakeRequest, locals } as any);
};
