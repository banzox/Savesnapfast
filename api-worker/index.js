// ================================
// SavetikFast Worker (RapidAPI Edition)
// مصدر واحد: tiktok-data-srapper.p.rapidapi.com
// ================================

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

// ---- إعدادات ----
const RATE_LIMIT = 10;          // عدد الطلبات المسموحة لكل مستخدم
const RATE_WINDOW = 60;         // خلال كم ثانية (دقيقة واحدة)
const CACHE_TTL = 3600;         // مدة بقاء الرابط في الكاش (ساعة كاملة)

export default {
    async fetch(request, env, ctx) {

        // 1. التعامل مع CORS (Preflight)
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: CORS_HEADERS });
        }

        // 2. استخراج الرابط (يدعم GET و POST)
        let videoUrl = null;
        const reqUrl = new URL(request.url);

        // POST: الفرونت يرسل { url: "..." }
        if (request.method === "POST") {
            try {
                const body = await request.json();
                videoUrl = body.url;
            } catch (e) { }
        }

        // GET: ?url=https://tiktok.com/...
        if (!videoUrl) {
            videoUrl = reqUrl.searchParams.get("url");
        }

        // التحقق من صحة الرابط
        if (!videoUrl || !videoUrl.includes("tiktok.com")) {
            return json({ error: "Invalid TikTok URL" }, 400);
        }

        // 3. نظام الحماية (Rate Limiting عبر KV)
        if (env.RATE) {
            const ip = request.headers.get("CF-Connecting-IP") || "unknown";
            const rateKey = `rate:${ip}`;
            const now = Math.floor(Date.now() / 1000);

            try {
                const rateData = await env.RATE.get(rateKey, "json");
                if (rateData && now - rateData.time < RATE_WINDOW && rateData.count >= RATE_LIMIT) {
                    return json({ error: "Too many requests, please wait a moment." }, 429);
                }

                await env.RATE.put(
                    rateKey,
                    JSON.stringify({
                        count: rateData ? rateData.count + 1 : 1,
                        time: rateData ? rateData.time : now,
                    }),
                    { expirationTtl: RATE_WINDOW }
                );
            } catch (e) {
                // تجاوز الخطأ إذا KV غير مربوطة
            }
        }

        // 4. التخزين المؤقت (Cache) - يوفر طلبات RapidAPI
        const cacheKey = new Request(`https://cache.local/?url=${encodeURIComponent(videoUrl)}`, { method: "GET" });
        const cache = caches.default;

        let cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
            return cachedResponse;
        }

        // 5. طلب البيانات من RapidAPI
        const apiKey = env.RAPIDAPI_KEY;

        if (!apiKey) {
            return json({ error: "API key not configured" }, 500);
        }

        try {
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

            // التحقق من وجود بيانات
            if (!result || !result.data) {
                return json({ error: "Video not found or link is invalid" }, 404);
            }

            const v = result.data;

            // 6. تحويل البيانات إلى الصيغة المتوافقة مع Downloader.jsx
            // الفرونت يقرأ: result.video, result.author (string), result.title, result.cover, result.music, result.images
            const finalData = {
                provider: "rapidapi",
                title: v.title || "TikTok Video",
                author: v.author?.nickname || v.author?.unique_id || "TikTok User",
                cover: v.cover || v.origin_cover || "",
                video: v.play || "",
                music: (typeof v.music === "string") ? v.music : (v.music_info?.play || v.music?.play_url || ""),
                images: v.images || [],
                type: (v.images && v.images.length > 0) ? "image" : "video",
                // حقول إضافية للتوافق
                play: v.play || "",
                download_url: v.play || "",
            };

            // إنشاء الاستجابة مع Cache headers
            const response = json(finalData, 200, {
                "Cache-Control": `public, max-age=${CACHE_TTL}`,
            });

            // حفظ في الكاش لتوفير طلبات RapidAPI
            ctx.waitUntil(cache.put(cacheKey, response.clone()));

            return response;

        } catch (error) {
            return json({
                error: "Server Error",
                details: error.message
            }, 500);
        }
    }
};

// ================================
// دالة مساعدة
// ================================

function json(data, status = 200, extraHeaders = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
            ...extraHeaders,
        },
    });
}
