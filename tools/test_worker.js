import assert from 'node:assert/strict';
import worker from '../worker/index.ts';

const mockEnv = {
    ASSETS: {
        fetch: async (request) => new Response('Static Asset OK: ' + request.url, { status: 200 }),
    },
};

const mockCtx = {
    waitUntil: () => {},
};

async function testWorker() {
    console.log('Testing Worker Edge Handlers...');

    // 1. Hostname canonicalization
    const wwwReq = new Request('https://www.savetik-fast.xyz/about');
    const wwwRes = await worker.fetch(wwwReq, mockEnv, mockCtx);
    assert.equal(wwwRes.status, 301);
    assert.equal(wwwRes.headers.get('Location'), 'https://savetik-fast.xyz/about');
    console.log('  ✓ www -> apex 301 redirect verified');

    // 2. /api/* returns X-Robots-Tag: noindex, nofollow
    const apiReq = new Request('https://savetik-fast.xyz/api/unknown-endpoint');
    const apiRes = await worker.fetch(apiReq, mockEnv, mockCtx);
    assert.equal(apiRes.headers.get('X-Robots-Tag'), 'noindex, nofollow');
    assert.equal(apiRes.status, 404);
    console.log('  ✓ /api/* X-Robots-Tag header verified');

    // 3. /api/download OPTIONS returns X-Robots-Tag: noindex, nofollow
    const downloadOptReq = new Request('https://savetik-fast.xyz/api/download', { method: 'OPTIONS' });
    const downloadOptRes = await worker.fetch(downloadOptReq, mockEnv, mockCtx);
    assert.equal(downloadOptRes.headers.get('X-Robots-Tag'), 'noindex, nofollow');
    console.log('  ✓ /api/download OPTIONS X-Robots-Tag header verified');

    // 4. Single-hop compound redirect
    const legacyReq = new Request('https://savetik-fast.xyz/tl/about-us.html');
    const legacyRes = await worker.fetch(legacyReq, mockEnv, mockCtx);
    assert.equal(legacyRes.status, 301);
    assert.equal(legacyRes.headers.get('Location'), 'https://savetik-fast.xyz/fil/about');
    console.log('  ✓ /tl/about-us.html -> /fil/about in 1 hop verified');

    // 5. Normal static asset pass-through
    const staticReq = new Request('https://savetik-fast.xyz/ar/about');
    const staticRes = await worker.fetch(staticReq, mockEnv, mockCtx);
    assert.equal(staticRes.status, 200);
    const text = await staticRes.text();
    assert.match(text, /Static Asset OK/);
    console.log('  ✓ Static asset pass-through verified');

    console.log('✓ All Worker tests passed successfully!');
}

testWorker().catch(err => {
    console.error(err);
    process.exit(1);
});
