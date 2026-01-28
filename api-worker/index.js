// Cloudflare Worker - Multi-Source TikTok Downloader
// Sources extracted from FusionTik: Zell API & Sanka API

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export default {
    async fetch(request, env, ctx) {
        // 1. Handle CORS preflight
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: CORS_HEADERS });
        }

        // 2. Extract TikTok URL (Support both GET and POST)
        let videoUrl = null;
        const url = new URL(request.url);

        if (request.method === "POST") {
            try {
                const body = await request.json();
                videoUrl = body.url;
            } catch (e) {
                // Fallback if JSON parsing fails
            }
        }

        if (!videoUrl) {
            videoUrl = url.searchParams.get("url");
        }

        if (!videoUrl) {
            return new Response(JSON.stringify({ error: "Missing 'url' parameter" }), {
                status: 400,
                headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
            });
        }

        // 3. Failover Logic (Source 1 -> Source 2)
        let data = null;

        // Try Source 1: Zell
        try {
            data = await fetchFromZell(videoUrl);
        } catch (e1) {
            // If Source 1 fails, Try Source 2: Sanka
            try {
                data = await fetchFromSanka(videoUrl);
            } catch (e2) {
                // If both fail
                return new Response(JSON.stringify({ error: "All providers failed", details: e2.message }), {
                    status: 500,
                    headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
                });
            }
        }

        // 4. Return Success Response
        return new Response(JSON.stringify(data), {
            headers: {
                ...CORS_HEADERS,
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=3600" // Cache for 1 hour
            }
        });
    }
};

// --- Helper Functions ---

async function fetchFromZell(url) {
    const baseUrl = "https://apizell.web.id/download/tiktok";
    const apiUrl = `${baseUrl}?url=${encodeURIComponent(url)}`;

    const res = await fetch(apiUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" }
    });

    if (!res.ok) throw new Error(`Zell API Error: ${res.status}`);

    const json = await res.json();
    if (!json || json.status !== true || !json.result) {
        throw new Error("Invalid Zell Response");
    }

    const result = json.result;

    // Music handling
    let musicUrl = "";
    if (typeof result.music === 'string') musicUrl = result.music;
    else if (result.music?.url) musicUrl = result.music.url;
    else if (result.music?.play_url) musicUrl = result.music.play_url;

    // Video handling
    let videoUrlResult = "";
    if (Array.isArray(result.video)) videoUrlResult = result.video[0];
    else if (typeof result.video === 'string') videoUrlResult = result.video;
    else if (result.video?.url) videoUrlResult = result.video.url;

    // Normalize Data
    return {
        provider: "zell",
        title: result.title || "No Title",
        author: result.author?.username || result.author?.nickname || "TikTok User",
        cover: result.thumbnail || "",
        video: videoUrlResult,
        music: musicUrl,
        // Handle Images/Slideshows
        images: Array.isArray(result.images) ? result.images : [],
        type: (Array.isArray(result.images) && result.images.length > 0) ? "image" : "video"
    };
}

async function fetchFromSanka(url) {
    const baseUrl = "https://www.sankavollerei.com/download/tiktok";
    // Key extracted from FusionTik source code
    const apiKey = "planaai";

    const apiUrl = `${baseUrl}?apikey=${apiKey}&url=${encodeURIComponent(url)}`;

    const res = await fetch(apiUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" }
    });

    if (!res.ok) throw new Error(`Sanka API Error: ${res.status}`);

    const json = await res.json();
    if (!json || json.status !== true || !json.result) {
        throw new Error("Invalid Sanka Response");
    }

    const result = json.result;

    // Music handling for Sanka
    let musicUrl = result.music || "";
    if (typeof musicUrl !== 'string' && result.music_info?.play) musicUrl = result.music_info.play;

    // Normalize Data to match Zell format
    return {
        provider: "sanka",
        title: result.title || "No Title",
        author: result.author?.unique_id || result.author?.nickname || "TikTok User",
        cover: result.cover || result.thumbnail || "",
        video: result.play || result.video || "",
        music: musicUrl,
        images: Array.isArray(result.images) ? result.images : [],
        type: (Array.isArray(result.images) && result.images.length > 0) ? "image" : "video"
    };
}
