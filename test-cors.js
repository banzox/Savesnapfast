fetch("https://tikwm.com/api/?url=https://www.tiktok.com/@tiktok/video/7106594312292453675")
.then(r => console.log(r.headers.get("access-control-allow-origin")));
