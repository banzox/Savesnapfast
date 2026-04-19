globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_rEauAmOa.mjs';

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      ...headers
    }
  });
}
const POST = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }
  try {
    const body = await request.json();
    let videoUrl = body.url;
    if (!videoUrl || !videoUrl.includes("tiktok.com")) {
      return jsonResponse({ error: "Invalid TikTok URL" }, 400);
    }
    const res = await fetch(`https://tiktok-data-srapper.p.rapidapi.com/api/v1/tiktok/video?url=${encodeURIComponent(videoUrl)}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY || "3e57b80e46mshe510b59abca6429p1875adjsne7df30921005",
        "x-rapidapi-host": "tiktok-data-srapper.p.rapidapi.com",
        "Content-Type": "application/json"
      }
    });
    if (!res.ok) {
      throw new Error(`RapidAPI Error: ${res.status}`);
    }
    const rapidMetadata = await res.json();
    if (!rapidMetadata || !rapidMetadata.author_name) {
      throw new Error(rapidMetadata?.message || "RapidAPI returned empty data for this link");
    }
    const finalData = {
      provider: "rapidapi",
      title: rapidMetadata.title || "TikTok Video",
      author: rapidMetadata.author_name || "User",
      cover: rapidMetadata.thumbnail_url || "",
      // السيرفر هذا ما يرجع روابط فيديو نهائياً (فقط اسم وصورة وعنوان)
      video: "",
      music: "",
      images: [],
      type: "video"
    };
    return jsonResponse(finalData, 200, {
      "Cache-Control": "public, max-age=3600"
    });
  } catch (error) {
    return jsonResponse({ error: "Server Error", details: [error.message] }, 500);
  }
};
const GET = async ({ request, locals }) => {
  const url = new URL(request.url);
  const videoUrl = url.searchParams.get("url");
  if (!videoUrl) return jsonResponse({ error: "Missing url parameter" }, 400);
  const fakeRequest = new Request(request.url, {
    method: "POST",
    headers: request.headers,
    body: JSON.stringify({ url: videoUrl })
  });
  return POST({ request: fakeRequest});
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
