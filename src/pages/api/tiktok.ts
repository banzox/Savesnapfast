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
        headers: { "Accept": "application/json" }
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

// الدالة الرئيسية للمسار
export const POST: APIRoute = async ({ request }) => {
    if (request.method === "OPTIONS") {
        return new Response(null, { headers: CORS_HEADERS });
    }

    try {
        const body = await request.json();
        let videoUrl = body.url;

        if (!videoUrl || !videoUrl.includes("tiktok.com")) {
            return jsonResponse({ error: "Invalid TikTok URL" }, 400);
        }

        // بناء الـ 5 مصادر
        const providers = [
            () => fetchTikWM(videoUrl), // الأساسي: الأقوى والأدق (يعطيك اسم المؤلف الفعلي)
            ...shuffle([ // الاحتياطيات
                () => fetchCobalt("https://alpha.wolfy.love", videoUrl),
                () => fetchCobalt("https://melon.clxxped.lol", videoUrl),
                () => fetchCobalt("https://cessi-c.meowing.de", videoUrl),
                () => fetchCobalt("https://mega.wolfy.love", videoUrl),
            ])
        ];

        let lastError = null;

        // حلقة التجربة (Failover): إذا فشل الأول، ينتقل للثاني مباشرة بشفافية تامة
        for (const provider of providers) {
            try {
                const data = await provider();
                
                // التأكد أن البيانات حقيقية وكاملة
                if (data && (data.video || (data.images && data.images.length > 0))) {
                    // تم العثور على النتيجة بنجاح!
                    return jsonResponse(data, 200, {
                        "Cache-Control": "public, max-age=3600"
                    });
                }
            } catch (e: any) {
                lastError = e;
            }
        }

        // إذا لا قدر الله تعطلت الـ 5 سيرفرات (شبه مستحيل)
        return jsonResponse(
            { error: "جميع سيرفرات التحميل مشغولة، جرب مرة أخرى." },
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
