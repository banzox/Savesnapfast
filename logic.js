document.addEventListener('DOMContentLoaded', () => {
    // 1. تعريف عناصر الواجهة
    const downloadBtn = document.getElementById('download-btn');
    const urlInput = document.getElementById('url-input');
    const resultArea = document.getElementById('result-area');
    const pasteBtn = document.getElementById('paste-btn');

    // 🚀 رابط المحرك (Worker) الخاص بك
    const WORKER_URL = "https://misty-violet-50ef.banzox9595.workers.dev";

    // 💰 رابط الإعلان الذكي (Smart Link)
    const MY_SMART_LINK = "https://www.effectivegatecpm.com/pjjsq7g4?key=d767025cc7e5239dd2334794b7167308";

    // 2. تفعيل وظيفة زر اللصق (Paste Button)
    if (pasteBtn && urlInput) {
        pasteBtn.addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                urlInput.value = text;
                urlInput.focus(); 
            } catch (err) {
                console.error('فشل الوصول إلى الحافظة:', err);
            }
        });
    }

    // 3. دالة التحميل المباشر (تعديل احترافي للهواتف)
    window.downloadFile = function(url, fileName, btnElement) {
        // أ. فتح الإعلان للربح
        window.open(MY_SMART_LINK, '_blank');

        // ب. توجيه المستخدم للمحرك مع أمر التحميل الإجباري
        // هذه الطريقة تضمن عدم فتح "الصفحة السوداء" في هواتف أندرويد وآيفون
        const finalDownloadUrl = `${WORKER_URL}/?url=${encodeURIComponent(url)}`;
        window.location.href = finalDownloadUrl; 
    };

    // 4. روابط السيرفرات الأساسية
    const apiEndpoints = [
        "https://www.tikwm.com/api/", 
        "https://api.tikmate.app/api/lookup",
    ];

    // 5. تفعيل عملية التحميل
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const url = urlInput.value.trim();
            if (!url) {
                const placeholder = (typeof i18next !== 'undefined') ? i18next.t('downloader.placeholder') : 'Please paste a link first';
                alert(placeholder);
                return;
            }
            startDownloadProcess(url);
        });
    }

    async function startDownloadProcess(videoUrl) {
        const processingTxt = (typeof i18next !== 'undefined') ? i18next.t('downloader.processing') : 'Processing...';
        
        resultArea.innerHTML = `
            <div class="loader-container" style="text-align:center; padding:30px;">
                <i class="fas fa-circle-notch fa-spin" style="font-size:2.5rem; color:#00f2ea;"></i>
                <p style="margin-top:15px; font-weight:bold;">${processingTxt}</p>
            </div>
        `;

        for (let i = 0; i < apiEndpoints.length; i++) {
            try {
                const success = await fetchFromApi(apiEndpoints[i], videoUrl);
                if (success) return;
            } catch (e) { 
                console.log(`Server ${i+1} failed...`); 
            }
        }

        const errorMsg = (typeof i18next !== 'undefined') ? i18next.t('downloader.error_busy') : 'Service busy. Please try again later.';
        resultArea.innerHTML = `<div style="text-align:center; color:#ff4444; padding:20px; background:rgba(255,0,0,0.1); border-radius:10px;">${errorMsg}</div>`;
    }

    async function fetchFromApi(apiUrl, videoUrl) {
        let requestUrl = apiUrl.includes("tikwm") ? `${apiUrl}?url=${encodeURIComponent(videoUrl)}` : `${apiUrl}?url=${videoUrl}`;
        try {
            const response = await fetch(requestUrl);
            const data = await response.json();
            if(apiUrl.includes("tikwm") && data.code === 0) {
                renderResult(data.data);
                return true;
            }
            return false; 
        } catch (error) { 
            return false; 
        }
    }

    function renderResult(videoData) {
        const { cover, play, hdplay, music, title, author } = videoData;
        const hdLink = hdplay || play; 

        const t_vid = (typeof i18next !== 'undefined') ? i18next.t('downloader.download_video') : 'Download Video';
        const t_aud = (typeof i18next !== 'undefined') ? i18next.t('downloader.download_audio') : 'Download MP3';
        const t_hd = (typeof i18next !== 'undefined') ? i18next.t('downloader.hd_quality') : 'HD Quality';

        const html = `
            <div class="result-card fade-in" style="background:#1e1e1e; padding:20px; border-radius:15px; margin-top:20px; display:flex; gap:20px; flex-wrap:wrap; border:1px solid #333; text-align:center;">
                
                <div class="video-thumb" style="flex:1; min-width:150px;">
                    <img src="${cover}" alt="Cover" style="width:100%; border-radius:10px; box-shadow:0 4px 15px rgba(0,0,0,0.5);">
                </div>

                <div class="video-info" style="flex:2; min-width:250px; display:flex; flex-direction:column; justify-content:center;">
                    <h3 style="margin-bottom:5px; font-size:1.1rem; color:white;">${title ? title.substring(0, 60) : 'TikTok Video'}...</h3>
                    <p style="color:#aaa; margin-bottom:20px; font-size:0.9rem;">@${author.nickname}</p>
                    
                    <button onclick="downloadFile('${play}', 'video_server1.mp4', this)" style="
                        background: #333; color: white; padding: 12px; border: 1px solid #444; 
                        text-align: center; border-radius: 8px; margin-bottom: 10px; cursor: pointer;
                        font-weight: bold; width: 100%;">
                        <i class="fas fa-video"></i> ${t_vid} (Server 1)
                    </button>
                    
                    <button onclick="downloadFile('${hdLink}', 'video_hd.mp4', this)" style="
                        background: linear-gradient(90deg, #00f2ea 0%, #ff0050 100%); 
                        color: white; padding: 15px; border: none; text-align: center; 
                        border-radius: 8px; margin-bottom: 10px; cursor: pointer; font-weight: 800; 
                        box-shadow: 0 4px 20px rgba(255, 0, 80, 0.4); width: 100%;">
                        <i class="fas fa-high-definition"></i> ${t_vid} (${t_hd})
                    </button>

                    ${music ? `
                    <button onclick="downloadFile('${music}', 'audio.mp3', this)" style="
                        background: transparent; color: #00f2ea; padding: 10px; border: 1px dashed #00f2ea;
                        text-align: center; border-radius: 8px; cursor: pointer; font-size: 0.9rem; width: 100%;">
                        <i class="fas fa-music"></i> ${t_aud}
                    </button>` : ''}

                </div>
            </div>
        `;
        resultArea.innerHTML = html;
    }
});
