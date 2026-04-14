import type { APIRoute } from 'astro';

// ================================
// SavetikFast - TikTok Downloader (5 Powerful Nodes)
// Endpoint: /api/tiktok
// ================================

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

// --- مساعدات إرجاع النتيجة ---
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

function shuffle(arr: any[]) {
    return arr.sort(() => Math.random() - 0.5);
}

// --- العقد والمصادر (Scraping Nodes) ---

// 1. TikWM (Primary Master Node)
async function fetchTikWM(url: string) {
    const res = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`, {
        headers: { 
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
    });
    if (!res.ok) throw new Error("TikWM API Error");
    
    const json = await res.json();
    if (json.code !== 0 || !json.data) throw new Error("TikWM Invalid Data");
    
    const v = json.data;
    
    return {
        provider: "tikwm",
        title: v.title || v.desc || "TikTok Video",
        author: v.author?.unique_id || v.author?.nickname || "User",
        cover: v.cover || v.origin_cover || "",
        video: v.play || v.wmplay || "", // mp4
        music: typeof v.music === 'string' ? v.music : (v.music?.play_url || v.music_info?.play || ""), // mp3
        images: v.images || [],
        type: (v.images && v.images.length > 0) ? "image" : "video"
    };
}

// 2. Cobalt API (Multiple Nodes)
async function fetchCobalt(baseUrl: string, url: string) {
    const res = await fetch(`${baseUrl}/api/json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        },
        body: JSON.stringify({ url, filenamePattern: "basic" }),
    });

    if (!res.ok) throw new Error("Cobalt API Error");
    
    const data = await res.json();
    if (!data || data.status === "error" || !data.url) {
        throw new Error("Cobalt returned invalid data");
    }

    return {
        provider: "cobalt",
        title: data.filename || "TikTok Video",
        author: "User", // Cobalt غالبا ما يرجع الاسم
        cover: "", 
        video: data.url,
        music: "",
        images: [], 
        type: "video",
    };
}

// 3. Zell API
async function fetchZell(url: string) {
    const res = await fetch(`https://apizell.web.id/download/tiktok?url=${encodeURIComponent(url)}`, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0" }
    });
    
    if (!res.ok) throw new Error("Zell API Error");
    const json = await res.json();
    if (!json.status || !json.result) throw new Error("Zell failed");

    const r = json.result;
    return {
        provider: "zell",
        title: r.title || "TikTok Video",
        author: r.author?.nickname || r.author?.username || "User",
        cover: r.thumbnail || "",
        video: Array.isArray(r.video) ? r.video[0] : (r.video?.url || r.video),
        music: r.music?.url || r.music || "",
        images: r.images || [],
        type: (r.images && r.images.length > 0) ? "image" : "video"
    };
}

// 4. RapidAPI (Metadata Only)
async function fetchRapidAPI(url: string) {
    const res = await fetch(`https://tiktok-data-srapper.p.rapidapi.com/api/v1/tiktok/video?url=${encodeURIComponent(url)}`, {
        method: "GET",
        headers: {
            "x-rapidapi-key": process.env.RAPIDAPI_KEY || "3e57b80e46mshe510b59abca6429p1875adjsne7df30921005",
            "x-rapidapi-host": "tiktok-data-srapper.p.rapidapi.com",
            "Content-Type": "application/json"
        }
    });
    if (!res.ok) throw new Error("RapidAPI Error");
    const json = await res.json();
    if (!json.author_name) throw new Error("RapidAPI No Data");
    return json;
}

// الدالة الرئيسية للمسار
export const POST: APIRoute = async ({ request, locals }) => {
    if (request.method === "OPTIONS") {
        return new Response(null, { headers: CORS_HEADERS });
    }

    try {
        const body = await request.json();
        let videoUrl = body.url;

        if (!videoUrl || !videoUrl.includes("tiktok.com")) {
            return jsonResponse({ error: "Invalid TikTok URL" }, 400);
        }

        let errors: any[] = [];
        let finalData: any = null;

        // 1. محاولة جلب الايدي والاسم من RapidAPI بناء على طلبك
        let rapidMetadata: any = null;
        try {
            rapidMetadata = await fetchRapidAPI(videoUrl);
        } catch (e: any) {
            errors.push("RapidAPI: " + e.message);
        }

        // بناء الـ 5 مصادر لجلب رابط الفيديو (الـ RapidAPI ما يعطي فيديو)
        const providers = [
            () => fetchZell(videoUrl),
            () => fetchTikWM(videoUrl),
            ...shuffle([
                () => fetchCobalt("https://alpha.wolfy.love", videoUrl),
                () => fetchCobalt("https://melon.clxxped.lol", videoUrl),
                () => fetchCobalt("https://cessi-c.meowing.de", videoUrl),
                () => fetchCobalt("https://mega.wolfy.love", videoUrl),
            ])
        ];

        // حلقة التجربة للحصول على رابط الفيديو الصافي
        for (const provider of providers) {
            try {
                const data = await provider();
                if (data && (data.video || (data.images && data.images.length > 0))) {
                    finalData = data;
                    break;
                }
            } catch (e: any) {
                errors.push("Provider: " + e.message);
            }
        }

        // دمج النتائج (RapidAPI للاسم + Providers للفيديو)
        if (finalData) {
            if (rapidMetadata) {
                finalData.author = rapidMetadata.author_name || finalData.author;
                finalData.title = rapidMetadata.title || finalData.title;
                if (!finalData.cover) finalData.cover = rapidMetadata.thumbnail_url;
                finalData.provider = "RapidAPI + " + finalData.provider;
            }

            return jsonResponse(finalData, 200, {
                "Cache-Control": "public, max-age=3600"
            });
        }

        return jsonResponse(
            { error: "جميع سيرفرات التحميل مشغولة، جرب مرة أخرى.", details: errors },
            503
        );

    } catch (error: any) {
        return jsonResponse({ error: "Server Error", details: error.message }, 500);
    }
};

export const GET: APIRoute = async ({ request, locals }) => {
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
