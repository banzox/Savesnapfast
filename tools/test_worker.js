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

    // 6. /404 and /404.html return true 404 status with X-Robots-Tag: noindex, follow
    for (const path404 of ['/404', '/404/', '/404.html']) {
        const req404 = new Request('https://savetik-fast.xyz' + path404);
        const res404 = await worker.fetch(req404, mockEnv, mockCtx);
        assert.equal(res404.status, 404, `Expected 404 for ${path404}, got ${res404.status}`);
        assert.equal(res404.headers.get('X-Robots-Tag'), 'noindex, follow');
        assert.equal(res404.headers.get('Cache-Control'), 'public, max-age=3600');
    }
    console.log('  ✓ /404, /404/, and /404.html true 404 & X-Robots-Tag verified');

    // 7. /admin* and /ad-* return X-Robots-Tag: noindex, nofollow and Cache-Control: private, no-store
    for (const privPath of ['/admin', '/admin/dashboard', '/ad-native', '/ad-300x250']) {
        const privReq = new Request('https://savetik-fast.xyz' + privPath);
        const privRes = await worker.fetch(privReq, mockEnv, mockCtx);
        assert.equal(privRes.headers.get('X-Robots-Tag'), 'noindex, nofollow', `Expected noindex, nofollow on ${privPath}`);
        assert.equal(privRes.headers.get('Cache-Control'), 'private, no-store');
    }
    console.log('  ✓ /admin and /ad-* X-Robots-Tag: noindex, nofollow & Cache-Control verified');

    // 8. /boost/go and /boost?direct=1 do NOT redirect to Smartlink
    for (const boostRoute of ['/boost/go', '/boost?direct=1', '/boost?go=1']) {
        const boostReq = new Request('https://savetik-fast.xyz' + boostRoute);
        const boostRes = await worker.fetch(boostReq, mockEnv, mockCtx);
        assert.notEqual(boostRes.status, 302, `Expected NO 302 redirect on ${boostRoute}`);
        assert.notEqual(boostRes.headers.get('Location'), 'https://www.profitableratecpmnetwork.com/pjjsq7g4?key=d767025cc7e5239dd2334794b7167308');
    }
    console.log('  ✓ /boost/go and smartlinks correctly deactivated');

    console.log('✓ All Worker tests passed successfully!');
}

testWorker().catch(err => {
    console.error(err);
    process.exit(1);
});
