// Bypass TLS hostname mismatches safely for diagnostic test suites
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function testTikwm() {
    const url = "https://www.tiktok.com/@tiktok/video/7106594312292453675";
    try {
        const res = await fetch(`https://tikwm.com/api/?url=${url}`);
        if (!res.ok) {
            console.log("TikWM: Offline (HTTP " + res.status + ")");
            return;
        }
        const data = await res.json();
        console.log("TikWM:", data.data ? "Success" : "Offline / Invalid Data");
    } catch (e) {
        console.log("TikWM: Offline (" + e.message + ")");
    }
}

async function testTiklyDown() {
    const url = "https://www.tiktok.com/@tiktok/video/7106594312292453675";
    try {
        const res = await fetch(`https://api.tiklydown.eu.org/api/download?url=${url}`);
        if (!res.ok) {
            console.log("TiklyDown: Offline / Handled (HTTP " + res.status + ")");
            return;
        }
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            console.log("TiklyDown: Offline / Handled (Returned non-JSON response)");
            return;
        }
        const data = await res.json();
        console.log("TiklyDown:", (data && data.video) ? "Success" : "Offline / Handled");
    } catch (e) {
        console.log("TiklyDown: Offline / Handled (" + e.message + ")");
    }
}

async function runDiagnostics() {
    await testTikwm();
    await testTiklyDown();
}

runDiagnostics();
