document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       1. عناصر الواجهة
    ========================== */
    const downloadBtn = document.getElementById('download-btn');
    const urlInput = document.getElementById('url-input');
    const resultArea = document.getElementById('result-area');
    const pasteBtn = document.getElementById('paste-btn');

    // 🚀 الإضافة: رابط المحرك الخاص بك
    const WORKER_URL = "https://misty-violet-50ef.banzox9595.workers.dev";
    
    // 💰 رابط الإعلان الذكي (Adsterra)
    const MY_SMART_LINK = "https://www.effectivegatecpm.com/pjjsq7g4?key=d767025cc7e5239dd2334794b7167308";

    /* =========================
       2. تفعيل وظيفة زر اللصق
    ========================== */
    if (pasteBtn && urlInput) {
        pasteBtn.addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                urlInput.value = text;
                urlInput.focus();
            } catch (e) {
                console.error('Clipboard access denied');
            }
        });
    }

    /* =========================
       3. دالة التحميل المباشر (عبر المحرك)
    ========================== */
    window.downloadFile = async (rawUrl, fileName, btn) => {
        const url = decodeURIComponent(rawUrl);
        const originalHTML = btn.innerHTML;

        try {
            // فتح الإعلان للربح أولاً
            window.open(MY_SMART_LINK, '_blank');

            // إظهار حالة جاري التحميل داخل الزر
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            btn.style.pointerEvents = 'none';

            // استخدام المحرك لكسر حماية تيك توك وإجبار التحميل
            const proxied = `${WORKER_URL}/?url=${encodeURIComponent(url)}`;
            const res = await fetch(proxied);
            if (!res.ok) throw new Error('Fetch failed');

            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = fileName || 'video.mp4';
            document.body.appendChild(a);
            a.click();

            URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);

        } catch (e) {
            // Fallback: التوجه للمحرك مباشرة في حال فشل المتصفح
            window.location.href = `${WORKER_URL}/?url=${encodeURIComponent(url)}`;
        } finally {
            btn.innerHTML = originalHTML;
            btn.style.pointerEvents = 'auto';
        }
    };

    /* =========================
       4. السيرفرات (APIs)
    ========================== */
    const apiEndpoints = [
        { name: 'tikwm', url: 'https://www.tikwm.com/api/' },
        { name: 'tikmate', url: 'https://api.tikmate.app/api/lookup' }
    ];

    /* =========================
       5. زر التحميل الأساسي
    ========================== */
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const url = urlInput.value.trim();
            if (!url) {
                const msg = (typeof i18next !== 'undefined') ? i18next.t('downloader.placeholder') : 'Please paste a TikTok link';
                alert(msg);
                return;
            }
            startProcess(url);
        });
    }

    /* =========================
       6. بدء المعالجة
    ========================== */
    async function startProcess(videoUrl) {
        const procTxt = (typeof i18next !== 'undefined') ? i18next.t('downloader.processing') : 'Processing...';
        resultArea.innerHTML = `
            <div style="text-align:center;padding:30px">
                <i class="fas fa-circle-notch fa-spin" style="font-size:2.5rem;color:#00f2ea"></i>
                <p style="margin-top:15px;font-weight:bold;color:white">${procTxt}</p>
            </div>
        `;

        for (const api of apiEndpoints) {
            try {
                const ok = await fetchFromApi(api, videoUrl);
                if (ok) return;
            } catch {}
        }

        const errTxt = (typeof i18next !== 'undefined') ? i18next.t('downloader.error_busy') : 'Service busy, try again later';
        resultArea.innerHTML = `<div style="color:#ff4444;text-align:center;padding:20px">${errTxt}</div>`;
    }

    /* =========================
       7. جلب البيانات
    ========================== */
    async function fetchFromApi(api, videoUrl) {
        const req = api.name === 'tikwm'
                ? `${api.url}?url=${encodeURIComponent(videoUrl)}`
                : `${api.url}?url=${videoUrl}`;

        const res = await fetch(req);
        const data = await res.json();

        if (api.name === 'tikwm' && data.code === 0) {
            renderResult(normalizeTikwm(data.data));
            return true;
        }
        if (api.name === 'tikmate' && data.success) {
            renderResult(normalizeTikmate(data.result));
            return true;
        }
        return false;
    }

    /* =========================
       8. توحيد البيانات
    ========================== */
    function normalizeTikwm(d) {
        return {
            cover: d.cover,
            play: d.play,
            hd: d.hdplay || d.play,
            music: d.music,
            title: d.title || 'TikTok Video',
            author: d.author?.nickname || 'unknown'
        };
    }

    function normalizeTikmate(d) {
        return {
            cover: d.cover,
            play: d.video,
            hd: d.video,
            music: d.music,
            title: d.title || 'TikTok Video',
            author: d.author || 'unknown'
        };
    }

    /* =========================
       9. عرض النتيجة النهائية
    ========================== */
    function renderResult(v) {
        const displayTitle = v.title.length > 60 ? v.title.substring(0, 60) + '…' : v.title;
        const t_vid = (typeof i18next !== 'undefined') ? i18next.t('downloader.download_video') : 'Download Video';
        const t_aud = (typeof i18next !== 'undefined') ? i18next.t('downloader.download_audio') : 'Download MP3';
        const t_hd = (typeof i18next !== 'undefined') ? i18next.t('downloader.hd_quality') : 'HD Quality';

        resultArea.innerHTML = `
            <div class="result-card fade-in" style="background:#1e1e1e;padding:20px;border-radius:15px;border:1px solid #333;display:flex;gap:20px;flex-wrap:wrap;color:white">
                <img src="${v.cover}" style="width:160px;border-radius:10px;box-shadow:0 4px 15px rgba(0,0,0,0.5)">
                <div style="flex:1;min-width:250px">
                    <h3 style="margin-bottom:5px">${displayTitle}</h3>
                    <p style="color:#aaa;margin-bottom:15px">@${v.author}</p>

                    <button class="btn-dl video-action" data-url="${encodeURIComponent(v.play)}" data-name="video.mp4" 
                        style="background:#333;width:100%;padding:12px;border-radius:8px;margin-bottom:10px;color:white;cursor:pointer;border:1px solid #444;font-weight:bold">
                        <i class="fas fa-video"></i> ${t_vid}
                    </button>

                    <button class="btn-dl hd-action" data-url="${encodeURIComponent(v.hd)}" data-name="video_hd.mp4" 
                        style="background:linear-gradient(90deg,#00f2ea,#ff0050);width:100%;padding:15px;border-radius:8px;margin-bottom:10px;color:white;cursor:pointer;border:none;font-weight:800;box-shadow:0 4px 15px rgba(255,0,80,0.3)">
                        <i class="fas fa-high-definition"></i> ${t_vid} (${t_hd})
                    </button>

                    ${v.music ? `
                    <button class="btn-dl audio-action" data-url="${encodeURIComponent(v.music)}" data-name="audio.mp3" 
                        style="background:transparent;width:100%;padding:10px;border-radius:8px;color:#00f2ea;cursor:pointer;border:1px dashed #00f2ea">
                        <i class="fas fa-music"></i> ${t_aud}
                    </button>` : ''}
                </div>
            </div>
        `;

        // ربط الأحداث بالأزرار الجديدة
        resultArea.querySelectorAll('.btn-dl').forEach(btn => {
            btn.addEventListener('click', () => {
                downloadFile(btn.dataset.url, btn.dataset.name, btn);
            });
        });
    }
});
