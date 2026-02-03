// ================================
// SavetikFast Ultimate Worker PRO (7 Sources)
// ================================

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

// ---- إعدادات ----
const RATE_LIMIT = 10;          // عدد الطلبات المسموحة
const RATE_WINDOW = 60;         // خلال كم ثانية (دقيقة واحدة)
const CACHE_TTL = 3600;         // مدة بقاء الرابط في الكاش (ساعة كاملة)

export default {
    async fetch(request, env, ctx) {

        // 1. التعامل مع CORS
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: CORS_HEADERS });
        }

        // 2. استخراج الرابط (يدعم GET و POST)
        let videoUrl = null;
        const reqUrl = new URL(request.url);

        if (request.method === "POST") {
            try {
                const body = await request.json();
                videoUrl = body.url;
            } catch (e) { }
        }
        
        if (!videoUrl) {
            videoUrl = reqUrl.searchParams.get("url");
        }

        // التحقق من صحة الرابط
        if (!videoUrl || !videoUrl.includes("tiktok.com")) {
            return json({ error: "Invalid TikTok URL" }, 400);
        }

        // 3. نظام الحماية (Rate Limiting)
        // ملاحظة: يعمل فقط إذا قمت بربط قاعدة بيانات KV باسم RATE
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
                // تجاوز الخطأ إذا كانت قاعدة البيانات غير جاهزة
            }
        }

        // 4. التخزين المؤقت (Cache)
        const cacheKey = new Request(reqUrl.toString(), request);
        const cache = caches.default;
        
        // محاولة جلب الاستجابة من الكاش
        let response = await cache.match(cacheKey);
        if (response) {
            return response;
        }

        // 5. المصادر (The 7 Providers)
        // يتم استخدام خلط عشوائي (Shuffle) لتوزيع الضغط وتجنب الحظر
        
        // مفتاح Sanka (نستخدم المفتاح من البيئة أو المفتاح الموجود في كودك القديم كاحتياطي)
        const sankaKey = env.SANKA_KEY || "planaai"; 

        const providers = shuffle([
            // 5 سيرفرات Cobalt مختلفة وقوية
            () => fetchFromCobalt("https://alpha.wolfy.love", videoUrl),
            () => fetchFromCobalt("https://melon.clxxped.lol", videoUrl),
            () => fetchFromCobalt("https://cessi-c.meowing.de", videoUrl),
            () => fetchFromCobalt("https://mega.wolfy.love", videoUrl),
            () => fetchFromCobalt("https://grapefruit.clxxped.lol", videoUrl),
            
            // المصدرين القديمين
            () => fetchFromZell(videoUrl),
            () => fetchFromSanka(videoUrl, sankaKey),
        ]);

        let lastError = null;

        // حلقة التجربة (Failover Loop)
        for (const provider of providers) {
            try {
                const data = await provider();
                
                // التأكد أن البيانات صالحة قبل إرجاعها
                if (data && (data.video || (data.images && data.images.length > 0))) {
                    response = json(data, 200, {
                        "Cache-Control": `public, max-age=${CACHE_TTL}`,
                    });

                    // حفظ النسخة الناجحة في الكاش
                    ctx.waitUntil(cache.put(cacheKey, response.clone()));
                    return response;
                }
            } catch (e) {
                lastError = e;
                // فشل هذا المصدر، ننتقل للتالي بصمت
            }
        }

        // إذا فشلت جميع الـ 7 مصادر
        return json(
            { error: "Server is busy, please try again.", details: lastError?.message },
            503
        );
    }
};

// ================================
// دوال مساعدة (Helpers)
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

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// ================================
// دوال المصادر (Providers Functions)
// ================================

// ---- 1. Cobalt API (Multiple Instances) ----
async function fetchFromCobalt(baseUrl, url) {
    const res = await fetch(`${baseUrl}/api/json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
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
        author: "TikTok User", // Cobalt لا يعيد اسم المؤلف دائماً
        cover: "", // Cobalt لا يعيد الصورة دائماً
        video: data.url,
        music: "",
        images: [], // Cobalt يدعم الصور أحياناً في picker، نركز هنا على الفيديو
        type: "video",
    };
}

// ---- 2. Zell API ----
async function fetchFromZell(url) {
    const res = await fetch(
        `https://apizell.web.id/download/tiktok?url=${encodeURIComponent(url)}`,
        { headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" } }
    );
    
    if (!res.ok) throw new Error("Zell API Error");
    const json = await res.json();
    if (!json.status || !json.result) throw new Error("Zell failed");

    const r = json.result;
    return {
        provider: "zell",
        title: r.title || "",
        author: r.author?.username || "User",
        cover: r.thumbnail || "",
        video: Array.isArray(r.video) ? r.video[0] : (r.video?.url || r.video),
        music: r.music?.url || r.music || "",
        images: r.images || [],
        type: (r.images && r.images.length > 0) ? "image" : "video"
    };
}

// ---- 3. Sanka API ----
async function fetchFromSanka(url, apiKey) {
    const res = await fetch(
        `https://www.sankavollerei.com/download/tiktok?apikey=${apiKey}&url=${encodeURIComponent(url)}`,
        { headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" } }
    );
    
    if (!res.ok) throw new Error("Sanka API Error");
    const json = await res.json();
    if (!json.status || !json.result) throw new Error("Sanka failed");

    const r = json.result;
    return {
        provider: "sanka",
        title: r.title || "",
        author: r.author?.unique_id || "User",
        cover: r.cover || r.thumbnail || "",
        video: r.play || r.video || "",
        music: r.music?.url || r.music || "", // Sanka أحياناً يعيد object
        images: r.images || [],
        type: (r.images && r.images.length > 0) ? "image" : "video"
    };
}
