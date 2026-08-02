// Bypass TLS hostname mismatches safely for diagnostic test suites
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function fetchZell(url) {
    const res = await fetch(`https://apizell.web.id/download/tiktok?url=${encodeURIComponent(url)}`, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0" }
    });
    if (!res.ok) throw new Error("Zell API Error: " + res.status);
    const json = await res.json();
    if (!json.status || !json.result) throw new Error("Zell failed");
    return json;
}

async function fetchTikWM(url) {
    const res = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`, {
        headers: { 
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
    });
    if (!res.ok) throw new Error("TikWM API Error: " + res.status);
    const json = await res.json();
    if (json.code !== 0 || !json.data) throw new Error("TikWM Invalid Data");
    return json;
}

async function fetchCobalt(baseUrl, url) {
    const res = await fetch(`${baseUrl}/api/json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        body: JSON.stringify({ url, filenamePattern: "basic" }),
    });
    if (!res.ok) throw new Error(`Cobalt ${baseUrl} Error: ` + res.status);
    const data = await res.json();
    if (!data || data.status === "error" || !data.url) throw new Error(`Cobalt ${baseUrl} invalid data`);
    return data;
}

async function testAll() {
    const urlToTest = "https://www.tiktok.com/@tiktok/video/7106594312292453675";

    const providers = [
        { name: "Zell", fn: () => fetchZell(urlToTest) },
        { name: "TikWM", fn: () => fetchTikWM(urlToTest) },
        { name: "Alpha", fn: () => fetchCobalt("https://alpha.wolfy.love", urlToTest) },
        { name: "Melon", fn: () => fetchCobalt("https://melon.clxxped.lol", urlToTest) },
        { name: "Cessi", fn: () => fetchCobalt("https://cessi-c.meowing.de", urlToTest) },
        { name: "Mega", fn: () => fetchCobalt("https://mega.wolfy.love", urlToTest) }
    ];

    let successCount = 0;

    for (let p of providers) {
        try {
            await p.fn();
            console.log(p.name + ": SUCCESS");
            successCount++;
        } catch (e) {
            console.log(p.name + ": OFFLINE (Handled gracefully -> " + e.message + ")");
        }
    }

    console.log(`\nDiagnostic Summary: ${successCount} operational provider(s) found. Fallback providers handled cleanly.`);
}

testAll();
