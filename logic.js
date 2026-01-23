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

    // تحسين: استخدام event delegation واحد فقط على resultArea بدلاً من إضافة listeners متعددة
    if (resultArea) {
        resultArea.addEventListener('click', handleDownloadClick);
    }

    // دالة واحدة للتعامل مع جميع أزرار التحميل (event delegation)
    function handleDownloadClick(e) {
        const btn = e.target.closest('.btn-dl');
        if (!btn) return;
        
        e.preventDefault();
        downloadFile(btn.dataset.url, btn.dataset.name, btn);
    }

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

            // إظهار حالة جاري التحميل داخل الزر - استخدام CSS class بدلاً من inline styles
            btn.classList.add('loading');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

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
            btn.classList.remove('loading');
            btn.innerHTML = originalHTML;
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
    let downloadTimeout = null; // للـ debouncing
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // منع الضغط المتكرر السريع (debouncing)
            if (downloadTimeout) return;
            
            const url = urlInput.value.trim();
            if (!url) {
                const msg = (typeof i18next !== 'undefined') ? i18next.t('downloader.placeholder') : 'Please paste a TikTok link';
                alert(msg);
                return;
            }
            
            // تعطيل الزر لمدة ثانية واحدة لمنع الضغط المتكرر
            downloadTimeout = setTimeout(() => {
                downloadTimeout = null;
            }, 1000);
            
            startProcess(url);
        });
    }

    /* =========================
       6. بدء المعالجة
    ========================== */
    async function startProcess(videoUrl) {
        const procTxt = (typeof i18next !== 'undefined') ? i18next.t('downloader.processing') : 'Processing...';
        resultArea.innerHTML = `
            <div class="processing-state">
                <i class="fas fa-circle-notch fa-spin"></i>
                <p>${procTxt}</p>
            </div>
        `;

        for (const api of apiEndpoints) {
            try {
                const ok = await fetchFromApi(api, videoUrl);
                if (ok) return;
            } catch {}
        }

        const errTxt = (typeof i18next !== 'undefined') ? i18next.t('downloader.error_busy') : 'Service busy, try again later';
        resultArea.innerHTML = `<div class="error-state">${errTxt}</div>`;
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

        // استخدام CSS classes بدلاً من inline styles
        resultArea.innerHTML = `
            <div class="result-card fade-in">
                <img src="${v.cover}" alt="Video thumbnail">
                <div class="buttons-container">
                    <h3>${displayTitle}</h3>
                    <p class="author">@${v.author}</p>

                    <button class="btn-dl video-action" data-url="${encodeURIComponent(v.play)}" data-name="video.mp4">
                        <i class="fas fa-video"></i> ${t_vid}
                    </button>

                    <button class="btn-dl hd-action" data-url="${encodeURIComponent(v.hd)}" data-name="video_hd.mp4">
                        <i class="fas fa-certificate"></i> ${t_vid} (${t_hd})
                    </button>

                    ${v.music ? `
                    <button class="btn-dl audio-action" data-url="${encodeURIComponent(v.music)}" data-name="audio.mp3">
                        <i class="fas fa-music"></i> ${t_aud}
                    </button>` : ''}
                </div>
            </div>
        `;
        
        // Event delegation تم إعداده مسبقاً في بداية الملف - لا حاجة لإضافة listener هنا
    }

});
