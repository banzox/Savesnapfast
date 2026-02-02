import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const fileUrl = url.searchParams.get('url');
    const fileName = url.searchParams.get('filename') || 'download.mp4';

    if (!fileUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        const response = await fetch(fileUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            return new Response(`Failed to fetch source file: ${response.status}`, { status: 502 });
        }

        const newHeaders = new Headers(response.headers);
        newHeaders.set('Content-Disposition', `attachment; filename="${fileName}"`);
        newHeaders.delete('content-encoding'); // Prevent double compression issues

        return new Response(response.body, {
            status: 200,
            headers: newHeaders,
        });

    } catch (error) {
        return new Response('Internal Server Error', { status: 500 });
    }
};
