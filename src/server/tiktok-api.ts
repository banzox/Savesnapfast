const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

const RAPIDAPI_HOST = "tiktok-data-srapper.p.rapidapi.com";
const TIKWM_ORIGIN = "https://www.tikwm.com";

interface RapidApiResponse {
    author_name?: string;
    title?: string;
    thumbnail_url?: string;
    video_url?: string;
    hd_video_url?: string;
    play?: string;
    hdplay?: string;
    music_url?: string;
    music?: string;
    images?: string[];
    data?: {
        title?: string;
        author?: { nickname?: string; unique_id?: string };
        cover?: string;
        origin_cover?: string;
        play?: string;
        hdplay?: string;
        wmplay?: string;
        music?: string | { play_url?: string };
        music_info?: { play?: string };
        images?: string[];
    };
}

export interface DownloadMetadata {
    provider?: string;
    title: string;
    author: string;
    cover: string;
    video: string;
    hdVideo?: string;
    music: string;
    images: string[];
    type: "image" | "video";
}

interface RuntimeLike {
    env?: unknown;
    waitUntil?: (promise: Promise<unknown>) => void;
}

function resolveUrl(rawUrl: unknown, baseOrigin = TIKWM_ORIGIN): string {
    if (typeof rawUrl !== "string") return "";
    const trimmed = rawUrl.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    if (trimmed.startsWith("//")) return `https:${trimmed}`;
    if (trimmed.startsWith("/")) return `${baseOrigin}${trimmed}`;
    return trimmed;
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

function parseTikWMData(d: Record<string, any>, providerName: string): DownloadMetadata {
    const rawImages = Array.isArray(d.images) ? d.images : [];
    const images = rawImages.map((img: unknown) => resolveUrl(img)).filter(Boolean);
    const rawMusic = typeof d.music === "string"
        ? d.music
        : (d.music?.play_url || d.music_info?.play || "");

    const playUrl = resolveUrl(d.play) || resolveUrl(d.wmplay);
    const hdPlayUrl = resolveUrl(d.hdplay) || playUrl;

    return {
        provider: providerName,
        title: d.title || d.desc || "TikTok Video",
        author: d.author?.unique_id || d.author?.nickname || "User",
        cover: resolveUrl(d.origin_cover) || resolveUrl(d.cover),
        video: playUrl || hdPlayUrl,
        hdVideo: hdPlayUrl || playUrl,
        music: resolveUrl(rawMusic),
        images,
        type: images.length > 0 ? "image" : "video",
    };
}

async function callTikWMPost(videoUrl: string): Promise<{ code?: number; data?: Record<string, any> } | null> {
    const body = new URLSearchParams({
        url: videoUrl,
        count: "12",
        cursor: "0",
        hd: "1",
    });
    const tmRes = await fetch(`${TIKWM_ORIGIN}/api/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "Accept": "application/json",
            "Referer": "https://www.tikwm.com/",
        },
        body: body.toString(),
    });
    if (!tmRes.ok) return null;
    return await tmRes.json() as { code?: number; data?: Record<string, any> };
}

async function fetchUpstreamFallbacks(videoUrl: string): Promise<DownloadMetadata | null> {
    // Tier 1: TikWM POST (with 1-second backoff retry if shared CF IP hits 1 req/s rate limit)
    try {
        let tmJson = await callTikWMPost(videoUrl);
        if (tmJson && tmJson.code === -1) {
            await new Promise((r) => setTimeout(r, 1050));
            tmJson = await callTikWMPost(videoUrl);
        }
        if (tmJson && tmJson.code === 0 && tmJson.data) {
            return parseTikWMData(tmJson.data, "tikwm");
        }
    } catch (e) {
        console.warn(JSON.stringify({ event: "tikwm_post_failed", error: String(e) }));
    }

    // Tier 2: LoveTik API (provides no-watermark MP4, HD MP4, MP3 audio, cover, and caption)
    let partialMeta: DownloadMetadata | null = null;
    try {
        const ltBody = new URLSearchParams({ query: videoUrl });
        const ltRes = await fetch("https://lovetik.com/api/ajax/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                "Accept": "application/json",
                "Origin": "https://lovetik.com",
                "Referer": "https://lovetik.com/",
            },
            body: ltBody.toString(),
        });
        if (ltRes.ok) {
            const ltJson = await ltRes.json() as {
                status?: string;
                desc?: string;
                author?: string;
                cover?: string;
                images?: string[];
                links?: Array<{ a?: string; t?: string; s?: string }>;
            };
            if (ltJson.status === "ok" && Array.isArray(ltJson.links) && ltJson.links.length > 0) {
                const nwmLink = ltJson.links.find((l) =>
                    String(l.t || "").toLowerCase().includes("no watermark") ||
                    String(l.s || "").toLowerCase().includes("no watermark") ||
                    l.t === "nowatermark"
                )?.a || ltJson.links[0]?.a || "";
                const hdLink = ltJson.links.find((l) =>
                    String(l.t || "").toLowerCase().includes("hd") ||
                    l.t === "nowatermark_hd"
                )?.a || nwmLink;
                const mp3Link = ltJson.links.find((l) =>
                    String(l.t || "").toLowerCase().includes("mp3") ||
                    String(l.t || "").toLowerCase().includes("audio")
                )?.a || "";
                const images = Array.isArray(ltJson.images) ? ltJson.images.filter(Boolean) : [];

                const candidate: DownloadMetadata = {
                    provider: "lovetik",
                    title: ltJson.desc || "TikTok Video",
                    author: ltJson.author || "User",
                    cover: resolveUrl(ltJson.cover, "https://lovetik.com"),
                    video: resolveUrl(nwmLink, "https://lovetik.com"),
                    hdVideo: resolveUrl(hdLink, "https://lovetik.com"),
                    music: resolveUrl(mp3Link, "https://lovetik.com"),
                    images,
                    type: images.length > 0 ? "image" : "video",
                };
                if (candidate.video && (candidate.music || candidate.images.length > 0)) {
                    return candidate;
                }
                if (candidate.video || candidate.cover || candidate.music) {
                    partialMeta = candidate;
                }
            }
        }
    } catch (e) {
        console.warn(JSON.stringify({ event: "lovetik_failed", error: String(e) }));
    }

    // Tier 3: ApiZell fallback (supports video, MP3 audio, cover, and slideshow images)
    try {
        const zellRes = await fetch(`https://apizell.web.id/download/tiktok?url=${encodeURIComponent(videoUrl)}`, {
            headers: {
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
        });
        if (zellRes.ok) {
            const zJson = await zellRes.json() as { status?: boolean; result?: Record<string, any> };
            if (zJson.status && zJson.result) {
                const r = zJson.result;
                const video = Array.isArray(r.video) ? r.video[0] : (r.video?.url || r.video || "");
                const hdVideo = Array.isArray(r.video) && r.video[1] ? r.video[1] : video;
                const music = typeof r.music === "string" ? r.music : (r.music?.url || "");
                const images = Array.isArray(r.images) ? r.images.filter(Boolean) : [];
                if (video || images.length > 0) {
                    return {
                        provider: "apizell",
                        title: r.title || partialMeta?.title || "TikTok Video",
                        author: r.author?.unique_id || r.author?.nickname || r.author?.username || partialMeta?.author || "User",
                        cover: r.thumbnail || partialMeta?.cover || "",
                        video: video || partialMeta?.video || "",
                        hdVideo: hdVideo || partialMeta?.hdVideo || video || "",
                        music: music || partialMeta?.music || "",
                        images: images.length > 0 ? images : (partialMeta?.images || []),
                        type: images.length > 0 ? "image" : "video",
                    };
                }
            }
        }
    } catch (e) {
        console.warn(JSON.stringify({ event: "apizell_failed", error: String(e) }));
    }

    // Tier 4: TikMate API fallback
    try {
        const tmBody = new URLSearchParams({ url: videoUrl });
        const tmRes = await fetch("https://api.tikmate.app/api/lookup", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            body: tmBody.toString(),
        });
        if (tmRes.ok) {
            const tmJson = await tmRes.json() as {
                success?: boolean;
                token?: string;
                id?: string;
                author_name?: string;
                author_id?: string;
                cover_url?: string;
            };
            if (tmJson.success && tmJson.token) {
                const streamUrl = `https://tikmate.app/download/${tmJson.token}/${tmJson.id}.mp4`;
                const hdStreamUrl = `https://tikmate.app/download/${tmJson.token}/${tmJson.id}.mp4?hd=1`;
                return {
                    provider: partialMeta ? `${partialMeta.provider}+tikmate` : "tikmate",
                    title: partialMeta?.title || tmJson.author_name || "TikTok Video",
                    author: tmJson.author_id || tmJson.author_name || partialMeta?.author || "User",
                    cover: tmJson.cover_url || partialMeta?.cover || "",
                    video: streamUrl,
                    hdVideo: hdStreamUrl,
                    music: partialMeta?.music || "",
                    images: partialMeta?.images || [],
                    type: "video",
                };
            }
        }
    } catch (e) {
        console.warn(JSON.stringify({ event: "tikmate_failed", error: String(e) }));
    }

    return partialMeta;
}

export function handleTikTokOptions(): Response {
    return new Response(null, { headers: CORS_HEADERS });
}

export async function handleTikTokPost(request: Request, runtimeValue?: unknown): Promise<Response> {
    try {
        const body = await request.json() as { url?: unknown };
        const rawVideoUrl = body.url;

        if (
            typeof rawVideoUrl !== "string" ||
            (!rawVideoUrl.includes("tiktok.com") && !rawVideoUrl.includes("douyin.com"))
        ) {
            return jsonResponse({ error: "Invalid TikTok URL" }, 400);
        }
        const videoUrl = rawVideoUrl.trim();

        const cacheStorage = (globalThis as typeof globalThis & {
            caches?: CacheStorage & { default?: Cache };
        }).caches;
        const edgeCache = cacheStorage?.default;
        const cacheKeyUrl = new URL(request.url);
        cacheKeyUrl.pathname = "/_edge_cache/tiktok_v2";
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
                    const playStream = resolveUrl(metadata.video_url || metadata.play || d?.play || d?.wmplay || "");
                    const hdStream = resolveUrl(metadata.hd_video_url || metadata.hdplay || d?.hdplay || playStream);

                    if (authorName || videoTitle || playStream) {
                        finalData = {
                            provider: "rapidapi",
                            title: videoTitle || "TikTok Video",
                            author: authorName || "User",
                            cover: resolveUrl(metadata.thumbnail_url || d?.origin_cover || d?.cover || ""),
                            video: playStream,
                            hdVideo: hdStream || playStream,
                            music: resolveUrl(metadata.music_url || metadata.music || (typeof d?.music === "string" ? d.music : (d?.music?.play_url || d?.music_info?.play || ""))),
                            images: (images || []).map((img) => resolveUrl(img)).filter(Boolean),
                            type: (images && images.length > 0) ? "image" : "video",
                        };
                    }
                }
            } catch (error) {
                console.warn(JSON.stringify({ event: "rapidapi_request_failed", error: String(error) }));
            }
        }

        // Enrich or fallback if RapidAPI did not provide complete stream URLs
        if (!finalData || !finalData.video || (!finalData.music && finalData.images.length === 0)) {
            const fallbackData = await fetchUpstreamFallbacks(videoUrl);
            if (fallbackData) {
                if (finalData) {
                    finalData.provider = `rapidapi+${fallbackData.provider}`;
                    if (!finalData.video) finalData.video = fallbackData.video;
                    if (!finalData.hdVideo) finalData.hdVideo = fallbackData.hdVideo || fallbackData.video;
                    if (!finalData.music) finalData.music = fallbackData.music;
                    if (!finalData.cover) finalData.cover = fallbackData.cover;
                    if (finalData.images.length === 0) finalData.images = fallbackData.images;
                } else {
                    finalData = fallbackData;
                }
            }
        }

        if (!finalData || (!finalData.video && finalData.images.length === 0)) {
            return jsonResponse({ error: "Unable to extract video data from TikTok" }, 502);
        }

        // Only cache complete responses that include cover/music or slideshow images
        const shouldCache = Boolean(finalData.music || finalData.images.length > 0);
        const finalResponse = jsonResponse(finalData, 200, {
            "Cache-Control": shouldCache
                ? "public, s-maxage=14400, max-age=3600"
                : "public, s-maxage=300, max-age=120",
        });

        if (edgeCache && shouldCache) {
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
