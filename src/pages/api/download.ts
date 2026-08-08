import type { APIRoute } from 'astro';

// TikTok CDN domains whitelist — prevents proxy abuse for non-TikTok content
const ALLOWED_DOMAINS = [
    'tiktokcdn.com', 'tiktokcdn-us.com', 'tiktok.com',
    'akamaized.net', 'snssdk.com', 'muscdn.com',
    'byteoversea.com', 'ibytedtos.com', 'ttwstatic.com', 'pstatp.com',
    'tikwm.com', 'tiklydown.eu.org', 'tiklydown.com', 'ssstik.io', 'ssstik.cx', 'v1.ssstik.cx',
    'lovetik.com', 'apizell.web.id', 'wolfy.love', 'clxxped.lol', 'meowing.de',
    'cobalt.tools', 'tikmate.app', 'dlp.tikmate.app', 'savetik.app'
];

const isAllowedUrl = (url: string): boolean => {
    try {
        const { hostname } = new URL(url);
        return ALLOWED_DOMAINS.some(domain => hostname === domain || hostname.endsWith(`.${domain}`));
    } catch {
        return false;
    }
};

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
};

function jsonError(message: string, status: number) {
    return new Response(JSON.stringify({ error: message }), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...CORS_HEADERS
        }
    });
}

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Android 14; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    'Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
];

export const OPTIONS: APIRoute = async () => {
    return new Response(null, { headers: CORS_HEADERS });
};

export const GET: APIRoute = async ({ request }) => {
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const fileUrl = url.searchParams.get('url');
    const fileName = url.searchParams.get('filename') || 'download.mp4';

    if (!fileUrl) {
        return jsonError('Missing URL parameter', 400);
    }

    if (!isAllowedUrl(fileUrl)) {
        return jsonError('Forbidden: URL not from an allowed domain', 403);
    }

    try {
        const randomUA = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

        const response = await fetch(fileUrl, {
            headers: {
                'User-Agent': randomUA,
                'Referer': 'https://www.tiktok.com/'
            }
        });

        if (!response.ok) {
            return jsonError(`Failed to fetch source file: ${response.status}`, 502);
        }

        const newHeaders = new Headers(response.headers);

        // Strip unsafe upstream headers that cause edge worker stream truncation or connection reset errors
        const unsafeHeaders = [
            'content-length',
            'transfer-encoding',
            'connection',
            'content-encoding',
            'content-security-policy',
            'set-cookie',
            'x-frame-options',
            'server'
        ];
        unsafeHeaders.forEach(header => newHeaders.delete(header));

        // Safety: UTF-8 encoded filename for Content-Disposition
        const encodedFileName = encodeURIComponent(fileName).replace(/['()]/g, escape).replace(/\*/g, '%2A');
        newHeaders.set('Content-Disposition', `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`);

        // Strict Cache-Control
        newHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        newHeaders.set('Pragma', 'no-cache');
        newHeaders.set('Expires', '0');

        // CORS headers
        newHeaders.set('Access-Control-Allow-Origin', '*');
        newHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS');

        return new Response(response.body, {
            status: 200,
            headers: newHeaders,
        });

    } catch (error) {
        return jsonError('Internal Server Error', 500);
    }
};

