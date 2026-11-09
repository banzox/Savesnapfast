const ALLOWED_DOMAINS = [
    "tiktokcdn.com", "tiktokcdn-us.com", "tiktokcdn-eu.com", "tiktok.com", "tiktokv.com",
    "akamaized.net", "snssdk.com", "muscdn.com", "byteimg.com",
    "byteoversea.com", "ibytedtos.com", "ttwstatic.com", "pstatp.com",
    "tikwm.com", "tikcdn.io", "snapcdn.app", "tiklydown.eu.org", "tiklydown.com",
    "ssstik.io", "ssstik.cx", "v1.ssstik.cx",
    "lovetik.com", "apizell.web.id", "wolfy.love", "clxxped.lol", "meowing.de",
    "cobalt.tools", "tikmate.app", "dlp.tikmate.app", "savetik.app",
];

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Range",
};

const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
];

function jsonError(message: string, status: number): Response {
    return new Response(JSON.stringify({ error: message }), {
        status,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
}

function isAllowedUrl(value: string): boolean {
    try {
        const { protocol, hostname } = new URL(value);
        if (protocol !== "https:" && protocol !== "http:") return false;
        return ALLOWED_DOMAINS.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
    } catch {
        return false;
    }
}

function inferMimeType(fileName: string, currentContentType: string | null): string {
    const lower = fileName.toLowerCase();
    const ct = (currentContentType || "").toLowerCase();
    const isGeneric = !ct || ct.includes("text/plain") || ct.includes("application/octet-stream");

    if (lower.endsWith(".mp4")) return isGeneric ? "video/mp4" : currentContentType!;
    if (lower.endsWith(".mp3")) return isGeneric ? "audio/mpeg" : currentContentType!;
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return isGeneric ? "image/jpeg" : currentContentType!;
    if (lower.endsWith(".webp")) return isGeneric ? "image/webp" : currentContentType!;
    if (lower.endsWith(".png")) return isGeneric ? "image/png" : currentContentType!;
    return currentContentType || "application/octet-stream";
}

export function handleDownloadOptions(): Response {
    return new Response(null, { headers: CORS_HEADERS });
}

export async function handleDownloadGet(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const rawFileUrl = url.searchParams.get("url");
    const fileName = url.searchParams.get("filename") || "download.mp4";

    if (!rawFileUrl) return jsonError("Missing URL parameter", 400);
    const fileUrl = rawFileUrl.startsWith("/") ? `https://www.tikwm.com${rawFileUrl}` : rawFileUrl;

    if (!isAllowedUrl(fileUrl)) return jsonError("Forbidden: URL not from an allowed domain", 403);

    try {
        const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
        const reqHeaders: Record<string, string> = {
            "User-Agent": userAgent,
            "Referer": "https://www.tiktok.com/",
        };
        const range = request.headers.get("Range");
        if (range) reqHeaders["Range"] = range;

        const upstream = await fetch(fileUrl, { headers: reqHeaders });
        if (!upstream.ok && upstream.status !== 206) {
            return jsonError(`Failed to fetch source file: ${upstream.status}`, 502);
        }

        const headers = new Headers(upstream.headers);
        for (const header of [
            "transfer-encoding", "connection", "content-encoding",
            "content-security-policy", "set-cookie", "x-frame-options", "server",
        ]) headers.delete(header);

        headers.set("Content-Type", inferMimeType(fileName, upstream.headers.get("content-type")));

        const encodedFileName = encodeURIComponent(fileName)
            .replace(/['()]/g, escape)
            .replace(/\*/g, "%2A");
        headers.set("Content-Disposition", `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`);
        headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        headers.set("Pragma", "no-cache");
        headers.set("Expires", "0");
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");

        return new Response(upstream.body, { status: upstream.status, headers });
    } catch {
        return jsonError("Internal Server Error", 500);
    }
}

export function downloadMethodNotAllowed(): Response {
    return jsonError("Method Not Allowed", 405);
}
