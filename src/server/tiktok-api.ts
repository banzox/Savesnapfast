const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

const RAPIDAPI_HOST = "tiktok-data-srapper.p.rapidapi.com";

interface RapidApiResponse {
    author_name?: string;
    title?: string;
    thumbnail_url?: string;
    video_url?: string;
    play?: string;
    music_url?: string;
    music?: string;
    images?: string[];
    data?: {
        title?: string;
        author?: { nickname?: string; unique_id?: string };
        cover?: string;
        origin_cover?: string;
        play?: string;
        wmplay?: string;
        music?: string | { play_url?: string };
        music_info?: { play?: string };
        images?: string[];
    };
}

interface DownloadMetadata {
    provider?: string;
    title: string;
    author: string;
    cover: string;
    video: string;
    music: string;
    images: string[];
    type: "image" | "video";
}

interface RuntimeLike {
    env?: unknown;
    waitUntil?: (promise: Promise<unknown>) => void;
}

function jsonResponse(data: unknown, status = 200, headers: HeadersInit = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
            ...headers,
        },
    });
}

function getRuntime(value: unknown): RuntimeLike | undefined {
    if (!value || typeof value !== "object") return undefined;
    return value as RuntimeLike;
}

function getRapidApiKey(runtimeValue: unknown): string | undefined {
    const runtime = getRuntime(runtimeValue);
    const runtimeEnv = runtime?.env;
    if (runtimeEnv && typeof runtimeEnv === "object" && "RAPIDAPI_KEY" in runtimeEnv) {
        const key = (runtimeEnv as { RAPIDAPI_KEY?: unknown }).RAPIDAPI_KEY;
        if (typeof key === "string" && key.trim()) return key.trim();
    }

    const astroKey = typeof import.meta !== "undefined"
        ? (import.meta as ImportMeta & { env?: Record<string, unknown> }).env?.RAPIDAPI_KEY
        : undefined;
    if (typeof astroKey === "string" && astroKey.trim()) return astroKey.trim();

    const nodeKey = typeof process !== "undefined" ? process.env?.RAPIDAPI_KEY : undefined;
    if (typeof nodeKey === "string" && nodeKey.trim()) return nodeKey.trim();

    return undefined;
}

async function fetchTikWMFallback(videoUrl: string): Promise<DownloadMetadata | null> {
    try {
        const tmRes = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`, {
            headers: {
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
        });
        if (!tmRes.ok) return null;
        const tmJson = await tmRes.json() as { code?: number; data?: any };
        if (tmJson.code === 0 && tmJson.data) {
            const d = tmJson.data;
            const images = Array.isArray(d.images) ? d.images : [];
            return {
                provider: "tikwm",
                title: d.title || d.desc || "TikTok Video",
                author: d.author?.unique_id || d.author?.nickname || "User",
                cover: d.cover || d.origin_cover || "",
                video: d.play || d.wmplay || d.hdplay || "",
                music: typeof d.music === "string" ? d.music : (d.music?.play_url || d.music_info?.play || ""),
                images,
                type: images.length > 0 ? "image" : "video",
            };
        }
    } catch (e) {
        console.warn(JSON.stringify({ event: "tikwm_fallback_failed", error: String(e) }));
    }
    return null;
}

export function handleTikTokOptions(): Response {
    return new Response(null, { headers: CORS_HEADERS });
}

export async function handleTikTokPost(request: Request, runtimeValue?: unknown): Promise<Response> {
    try {
        const body = await request.json() as { url?: unknown };
        const videoUrl = body.url;

        if (typeof videoUrl !== "string" || !videoUrl.includes("tiktok.com")) {
            return jsonResponse({ error: "Invalid TikTok URL" }, 400);
        }

        const cacheStorage = (globalThis as typeof globalThis & {
            caches?: CacheStorage & { default?: Cache };
        }).caches;
        const edgeCache = cacheStorage?.default;
        const cacheKeyUrl = new URL(request.url);
        cacheKeyUrl.pathname = "/_edge_cache/tiktok";
        cacheKeyUrl.searchParams.set("url", videoUrl);
        const cacheRequest = new Request(cacheKeyUrl.toString(), { method: "GET" });

        if (edgeCache) {
            try {
                const cachedResponse = await edgeCache.match(cacheRequest);
                if (cachedResponse) {
                    const response = new Response(cachedResponse.body, cachedResponse);
                    response.headers.set("X-Cache", "HIT-EDGE");
                    return response;
                }
            } catch (error) {
                console.warn(JSON.stringify({ event: "tiktok_cache_match_failed", error: String(error) }));
            }
        }

        const rapidApiKey = getRapidApiKey(runtimeValue);
        let finalData: DownloadMetadata | null = null;

        if (rapidApiKey) {
            try {
                const response = await fetch(`https://${RAPIDAPI_HOST}/api/v1/tiktok/video?url=${encodeURIComponent(videoUrl)}`, {
                    headers: {
                        "x-rapidapi-key": rapidApiKey,
                        "x-rapidapi-host": RAPIDAPI_HOST,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const metadata = await response.json() as RapidApiResponse;
                    const d = metadata.data;
                    const images = Array.isArray(metadata.images) ? metadata.images : (Array.isArray(d?.images) ? d?.images : []);
                    const authorName = metadata.author_name || d?.author?.nickname || d?.author?.unique_id || "";
                    const videoTitle = metadata.title || d?.title || "";

                    if (authorName || videoTitle || metadata.video_url || metadata.play || d?.play) {
                        finalData = {
                            provider: "rapidapi",
                            title: videoTitle || "TikTok Video",
                            author: authorName || "User",
                            cover: metadata.thumbnail_url || d?.cover || d?.origin_cover || "",
                            video: metadata.video_url || metadata.play || d?.play || d?.wmplay || "",
                            music: metadata.music_url || metadata.music || (typeof d?.music === "string" ? d.music : (d?.music?.play_url || d?.music_info?.play || "")),
                            images: images || [],
                            type: (images && images.length > 0) ? "image" : "video",
                        };
                    }
                }
            } catch (error) {
                console.warn(JSON.stringify({ event: "rapidapi_request_failed", error: String(error) }));
            }
        }

        // Fallback to TikWM if RapidAPI failed or did not provide stream URLs
        if (!finalData || !finalData.video || (!finalData.music && finalData.images.length === 0)) {
            const tikwmData = await fetchTikWMFallback(videoUrl);
            if (tikwmData) {
                if (finalData) {
                    finalData.provider = "rapidapi+tikwm";
                    if (!finalData.video) finalData.video = tikwmData.video;
                    if (!finalData.music) finalData.music = tikwmData.music;
                    if (!finalData.cover) finalData.cover = tikwmData.cover;
                    if (finalData.images.length === 0) finalData.images = tikwmData.images;
                } else {
                    finalData = tikwmData;
                }
            }
        }

        if (!finalData || (!finalData.video && finalData.images.length === 0)) {
            return jsonResponse({ error: "Unable to extract video data from TikTok" }, 502);
        }

        const finalResponse = jsonResponse(finalData, 200, {
            "Cache-Control": "public, s-maxage=14400, max-age=3600",
        });

        if (edgeCache) {
            try {
                const cachePromise = edgeCache.put(cacheRequest, finalResponse.clone());
                const runtime = getRuntime(runtimeValue);
                if (runtime?.waitUntil) runtime.waitUntil(cachePromise);
                else void cachePromise.catch((error) => {
                    console.warn(JSON.stringify({ event: "tiktok_cache_put_failed", error: String(error) }));
                });
            } catch (error) {
                console.warn(JSON.stringify({ event: "tiktok_cache_put_failed", error: String(error) }));
            }
        }

        return finalResponse;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return jsonResponse({ error: "Server Error", details: [message] }, 500);
    }
}

export async function handleTikTokGet(request: Request, runtimeValue?: unknown): Promise<Response> {
    const url = new URL(request.url);
    const videoUrl = url.searchParams.get("url");
    if (!videoUrl) return jsonResponse({ error: "Missing url parameter" }, 400);

    const postRequest = new Request(request.url, {
        method: "POST",
        headers: request.headers,
        body: JSON.stringify({ url: videoUrl }),
    });
    return handleTikTokPost(postRequest, runtimeValue);
}

export function methodNotAllowed(): Response {
    return jsonResponse({ error: "Method Not Allowed" }, 405, { "Allow": "GET, POST, OPTIONS" });
}
