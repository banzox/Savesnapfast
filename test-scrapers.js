async function testTikwm() {
    const url = "https://www.tiktok.com/@tiktok/video/7106594312292453675";
    try {
        const res = await fetch(`https://tikwm.com/api/?url=${url}`);
        const data = await res.json();
        console.log("TikWM:", data.data ? "Success" : data);
    } catch (e) { console.error("TikWM error", e); }
}

async function testTiklyDown() {
    const url = "https://www.tiktok.com/@tiktok/video/7106594312292453675";
    try {
        const res = await fetch(`https://api.tiklydown.eu.org/api/download?url=${url}`);
        const data = await res.json();
        console.log("TiklyDown:", data.video ? "Success" : data);
    } catch (e) { console.error("TiklyDown error", e); }
}

testTikwm();
testTiklyDown();
