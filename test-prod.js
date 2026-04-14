fetch('https://savesnapfast.pages.dev/api/tiktok', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: "https://www.tiktok.com/@tiktok/video/7106594312292453675" })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
