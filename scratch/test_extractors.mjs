const url = "https://www.tiktok.com/@tiktok/video/7106594312292453675";

async function testTikWMPost(videoUrl) {
    try {
        const body = new URLSearchParams({
            url: videoUrl,
            count: "12",
            cursor: "0",
            web: "1",
            hd: "1"
        });
        const res = await fetch("https://tikwm.com/api/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
            body: body.toString()
        });
        const json = await res.json();
        if (json.code === 0 && json.data) {
            return {
                provider: "tikwm_post",
                title: json.data.title || json.data.desc || "TikTok Video",
                author: json.data.author?.unique_id || "User",
                cover: json.data.cover || json.data.origin_cover || "",
                video: json.data.play || json.data.wmplay || json.data.hdplay || "",
                music: json.data.music || json.data.music_info?.play || "",
                images: json.data.images || [],
                type: (json.data.images && json.data.images.length > 0) ? "image" : "video"
            };
        }
    } catch (e) {
        console.warn("TikWM POST failed:", e.message);
    }
    return null;
}

async function testTikMate(videoUrl) {
    try {
        const body = new URLSearchParams({ url: videoUrl });
        const res = await fetch("https://api.tikmate.app/api/lookup", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            body: body.toString()
        });
        const json = await res.json();
        if (json.success && json.token) {
            return {
                provider: "tikmate",
                title: json.author_name || "TikTok Video",
                author: json.author_id || json.author_name || "User",
                cover: json.cover_url || "",
                video: `https://tikmate.app/download/${json.token}/${json.id}.mp4`,
                music: "",
                images: [],
                type: "video"
            };
        }
    } catch (e) {
        console.warn("TikMate failed:", e.message);
    }
    return null;
}

async function testLoveTik(videoUrl) {
    try {
        const body = new URLSearchParams({ query: videoUrl });
        const res = await fetch("https://lovetik.com/api/ajax/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            body: body.toString()
        });
        const json = await res.json();
        if (json.status === "ok" && json.links && json.links.length > 0) {
            const videoLink = json.links.find(l => l.t === "nowatermark" || l.t === "nowatermark_hd")?.a || json.links[0].a;
            const audioLink = json.links.find(l => l.t === "mp3")?.a || "";
            return {
                provider: "lovetik",
                title: json.desc || "TikTok Video",
                author: json.author || "User",
                cover: json.cover || "",
                video: videoLink,
                music: audioLink,
                images: [],
                type: "video"
            };
        }
    } catch (e) {
        console.warn("LoveTik failed:", e.message);
    }
    return null;
}

async function run() {
    console.log("Testing extractors for URL:", url);
    const r1 = await testTikWMPost(url);
    console.log("TikWM POST result:", r1 ? `SUCCESS (${r1.author} - ${r1.video ? "has video" : "no video"})` : "FAILED");

    const r2 = await testTikMate(url);
    console.log("TikMate result:", r2 ? `SUCCESS (${r2.author} - ${r2.video ? "has video" : "no video"})` : "FAILED");

    const r3 = await testLoveTik(url);
    console.log("LoveTik result:", r3 ? `SUCCESS (${r3.author} - ${r3.video ? "has video" : "no video"})` : "FAILED");
}

run();
