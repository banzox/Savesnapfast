import type { APIRoute } from 'astro';

// ================================
// SavetikFast - TikTok API (RapidAPI Only - By User Request)
// Endpoint: /api/tiktok
// ================================

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data: any, status = 200, headers = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
            ...headers
        }
    });
}

async function fetchTikWMFallback(videoUrl: string) {
    try {
        const tmRes = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`, {
            headers: {
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });
        if (!tmRes.ok) return null;
        const tmJson = await tmRes.json();
        if (tmJson.code === 0 && tmJson.data) {
            const d = tmJson.data;
            const images = Array.isArray(d.images) ? d.images : [];
            return {
                title: d.title || d.desc || "TikTok Video",
                author: d.author?.unique_id || d.author?.nickname || "User",
                cover: d.cover || d.origin_cover || "",
                video: d.play || d.wmplay || d.hdplay || "",
                music: typeof d.music === 'string' ? d.music : (d.music?.play_url || d.music_info?.play || ""),
                images: images,
                type: images.length > 0 ? "image" : "video"
            };
        }
    } catch (e) {
        // Fallback error ignored
    }
    return null;
}

export const OPTIONS: APIRoute = async () => {
    return new Response(null, { headers: CORS_HEADERS });
};

export const POST: APIRoute = async ({ request, locals }: any) => {
    if (request.method === "OPTIONS") {
        return new Response(null, { headers: CORS_HEADERS });
    }

    try {
        const body = await request.json();
        let videoUrl = body.url;

        if (!videoUrl || typeof videoUrl !== "string" || !videoUrl.includes("tiktok.com")) {
            return jsonResponse({ error: "Invalid TikTok URL" }, 400);
        }

        // ==========================================
        // EDGE CACHE: Check if we already have this video
        // ==========================================
        const edgeCache = (globalThis as any).caches?.default;
        const cacheKeyUrl = new URL(request.url);
        cacheKeyUrl.pathname = "/_edge_cache/tiktok"; // Virtual cache path
        cacheKeyUrl.searchParams.set("url", videoUrl);
        
        const cacheRequest = new Request(cacheKeyUrl.toString(), { method: "GET" });

        if (edgeCache) {
            try {
                const cachedResponse = await edgeCache.match(cacheRequest);
                if (cachedResponse) {
                    // Add a header to prove it came from Edge Cache
                    const cachedResObj = new Response(cachedResponse.body, cachedResponse);
                    cachedResObj.headers.set("X-Cache", "HIT-EDGE");
                    return cachedResObj;
                }
            } catch (e) {
                console.warn("Edge cache match failed:", e);
            }
        }

        // Environment Variable Resolution for Cloudflare Workers / Astro
        const cfEnv = (locals as any)?.runtime?.env;
        const RAPIDAPI_KEY = cfEnv?.RAPIDAPI_KEY || (typeof import.meta !== 'undefined' && (import.meta as any).env?.RAPIDAPI_KEY) || (typeof process !== 'undefined' ? process?.env?.RAPIDAPI_KEY : undefined);
        let finalData: any = null;

        // Try RapidAPI if key is available
        if (RAPIDAPI_KEY) {
            try {
                const res = await fetch(`https://tiktok-data-srapper.p.rapidapi.com/api/v1/tiktok/video?url=${encodeURIComponent(videoUrl)}`, {
                    method: "GET",
                    headers: {
                        "x-rapidapi-key": RAPIDAPI_KEY,
                        "x-rapidapi-host": "tiktok-data-srapper.p.rapidapi.com",
                        "Content-Type": "application/json"
                    }
                });

                if (res.ok) {
                    const rapidMetadata = await res.json();
                    if (rapidMetadata && (rapidMetadata.author_name || rapidMetadata.title)) {
                        finalData = {
                            provider: "rapidapi",
                            title: rapidMetadata.title || "TikTok Video",
                            author: rapidMetadata.author_name || "User",
                            cover: rapidMetadata.thumbnail_url || "",
                            video: rapidMetadata.video_url || rapidMetadata.play || "", 
                            music: rapidMetadata.music_url || rapidMetadata.music || "",
                            images: rapidMetadata.images || [],
                            type: (rapidMetadata.images && rapidMetadata.images.length > 0) ? "image" : "video"
                        };
                    }
                }
            } catch (err) {
                console.warn("RapidAPI request failed, falling back to TikWM", err);
            }
        }

        // Fallback to TikWM if video or music is empty or RapidAPI failed/missing
        if (!finalData || !finalData.video || !finalData.music) {
            const tikwmData = await fetchTikWMFallback(videoUrl);
            if (tikwmData) {
                if (finalData) {
                    // Enrich existing RapidAPI metadata with playable video/music streams from TikWM
                    finalData.provider = "rapidapi+tikwm";
                    if (!finalData.video) finalData.video = tikwmData.video;
                    if (!finalData.music) finalData.music = tikwmData.music;
                    if (!finalData.images || finalData.images.length === 0) finalData.images = tikwmData.images;
                    if (!finalData.cover) finalData.cover = tikwmData.cover;
                } else {
                    finalData = {
                        provider: "tikwm",
                        ...tikwmData
                    };
                }
            }
        }

        if (!finalData) {
            return jsonResponse({ error: "Unable to extract video data from TikTok" }, 502);
        }

        const finalResponse = jsonResponse(finalData, 200, {
            "Cache-Control": "public, s-maxage=14400, max-age=3600" // Cache for 4 hours on Edge
        });

        // Save to Edge Cache safely (non-blocking / error-safe)
        if (edgeCache) {
            try {
                const cachePromise = edgeCache.put(cacheRequest, finalResponse.clone());
                if ((locals as any)?.runtime?.waitUntil) {
                    (locals as any).runtime.waitUntil(cachePromise);
                } else if (cachePromise && typeof cachePromise.catch === 'function') {
                    cachePromise.catch((err: any) => console.warn("Edge cache put error:", err));
                }
            } catch (e) {
                console.warn("Edge cache put failed:", e);
            }
        }

        return finalResponse;

    } catch (error: any) {
        return jsonResponse({ error: "Server Error", details: [error?.message || "Unknown error"] }, 500);
    }
};

export const GET: APIRoute = async ({ request, locals }: any) => {
    const url = new URL(request.url);
    const videoUrl = url.searchParams.get("url");

    if (!videoUrl) return jsonResponse({ error: "Missing url parameter" }, 400);

    const fakeRequest = new Request(request.url, {
        method: "POST",
        headers: request.headers,
        body: JSON.stringify({ url: videoUrl })
    });

    return POST({ request: fakeRequest, locals } as any);
};

