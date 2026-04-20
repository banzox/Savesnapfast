import React, { useState, useEffect } from 'react';
import fileSaver from 'file-saver';
const { saveAs } = fileSaver;

// Dynamic import for JSZip - only loads when needed (better mobile performance)
const loadJSZip = () => import('jszip');

const WORKER_URL = "/api/tiktok";
const SMART_LINK = "https://ferocitycandour.com/pjjsq7g4?key=d767025cc7e5239dd2334794b7167308";

// Native Ad Slot Loader — defined outside component to avoid re-creation on render
function loadNativeAd(slotId) {
    if (typeof window === 'undefined') return;
    const wrapper = document.getElementById(slotId);
    if (!wrapper || wrapper.dataset.loaded) return;
    wrapper.dataset.loaded = 'true';

    const innerDiv = document.createElement('div');
    innerDiv.id = 'container-2d1b844eacef7f58a020be44e8239ff9';
    wrapper.appendChild(innerDiv);

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl28502654.effectivegatecpm.com/2d1b844eacef7f58a020be44e8239ff9/invoke.js';
    wrapper.appendChild(script);
}

export default function Downloader(props) {
    const { messages = {}, mode = 'video' } = props;

    // دالة الترجمة
    const t = (key, defaultText) => {
        const k = key.replace('downloader.', '');
        return messages[k] || defaultText;
    };

    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [zipping, setZipping] = useState(false);
    const [downloadingUrl, setDownloadingUrl] = useState(null); // New: Tracks individual file downloads
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [hasStartedDownload, setHasStartedDownload] = useState(false);

    // --- دالة تنظيف وتسمية الملفات ---
    const sanitizeName = (name) => {
        if (!name) return 'User';
        return name.replace(/[^\w\s-]/gi, '').replace(/\s+/g, '_').substring(0, 20);
    };

    const generateProName = (author, type, id) => {
        const cleanAuthor = sanitizeName(author);
        const uniqueId = id || Math.floor(1000 + Math.random() * 9000);
        return `TikTok_${cleanAuthor}_${uniqueId}.${type}`;
    };

    const handlePaste = async () => {
        try {
            // Check for clipboard-read permission first
            if (navigator.permissions && navigator.permissions.query) {
                const status = await navigator.permissions.query({ name: 'clipboard-read' });
                if (status.state === 'denied') {
                    throw new Error('Permission Denied');
                }
            }
            const text = await navigator.clipboard.readText();
            if (text) setUrl(text);
        } catch (err) {
            // Fallback for browsers that block clipboard API or don't support it
            const input = document.getElementById('url-input');
            if (input) {
                input.focus();
                try { document.execCommand('paste'); } catch (e) { }
            }
        }
    };

    const handleCopyInput = () => {
        if (!url) return;
        navigator.clipboard.writeText(url);
    };

    // Load below-input ad on mount (2s delay for Lighthouse performance)
    useEffect(() => {
        const timer = setTimeout(() => loadNativeAd('ad-slot-below-input'), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Load around-loader ads the first time user presses Download
    useEffect(() => {
        if (!hasStartedDownload) return;
        loadNativeAd('ad-slot-above-loader');
        const timer = setTimeout(() => loadNativeAd('ad-slot-below-loader'), 800);
        return () => clearTimeout(timer);
    }, [hasStartedDownload]);

    const downloadFile = (fileUrl, fileName) => {
        if (!fileUrl) return;

        // Use server-side streaming proxy for immediate start and custom naming
        const downloadUrl = `/api/download?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(fileName)}`;

        // Trigger download via hidden <a> tag (smoother experience)
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Open ad in new tab
        setTimeout(() => {
            if (SMART_LINK) window.open(SMART_LINK, '_blank');
        }, 1000);
    };

    const downloadAllImages = async () => {
        if (!result || !result.images || result.images.length === 0) return;

        setZipping(true);
        try {
            const { default: JSZip } = await loadJSZip();
            const zip = new JSZip();
            const author = sanitizeName(result.author || 'User');
            const folder = zip.folder(`TikTok_Slideshow_${author}`);

            // Fetch all images
            const imagePromises = result.images.map(async (imgUrl, index) => {
                try {
                    const response = await fetch(imgUrl);
                    const blob = await response.blob();
                    const fileName = `slide_${index + 1}.jpg`;
                    folder.file(fileName, blob);
                } catch (e) {
                    // Silent fail for individual images
                }
            });

            await Promise.all(imagePromises);

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `TikTok_Slideshow_${author}.zip`);

            // فتح الإعلان بعد نجاح إنشاء الـ ZIP
            setTimeout(() => {
                if (SMART_LINK) window.open(SMART_LINK, '_blank');
            }, 500);

        } catch (err) {
            setError(t('error_busy', "Failed to create ZIP file."));
        } finally {
            setZipping(false);
        }
    };

    const validateResultType = (res, currentMode) => {
        const hasImages = res.images && res.images.length > 0;
        const hasVideo = !!(res.video || res.play || res.url || res.nowatermark);
        // Basic Story detection: Check URL or if API flags it (API might not always flag, but presence of both video/image or specialized metadata helps)
        // For now, we rely on output content.

        if (currentMode === 'slideshow') {
            if (!hasImages) return { valid: false, error: t('error_wrong_type_slideshow', "Link is not a slideshow! Use Video Downloader.") };
        }

        // Strict Video Mode: If it's a slideshow (only images), warn user? 
        // Or if user wants to download VIDEO, but link is SLIDESHOW, TikWM often returns images for slideshows.
        // If we are in VIDEO mode, we generally accept everything BUT if it's purely images, maybe warn?
        // User requested strict separation.
        if (currentMode === 'video' || currentMode === 'mp3') {
            // MP3 is loose, usually any link works for mp3.
        }

        if (currentMode === 'story') {
            // Stories can be video or image. 
            // Ideally check if URL contains /story/ or /video/.
            if (!url.includes('/story/') && !url.includes('/video/')) {
                // Weak check, but better than nothing.
            }
        }

        return { valid: true };
    };

    const handleDownload = async () => {
        if (!url) return;

        if (!url.includes('tiktok.com')) {
            setError(t('error_invalid_link', "Invalid Link. Please check and try again."));
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        setHasStartedDownload(true);

        try {
            let res = null;
            let rapidApiData = null;

            // 1. طلب بيانات الاسم والصورة من RapidAPI عبر السيرفر الداخلي
            try {
                const rapidRes = await fetch(WORKER_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: url })
                });
                const rData = await rapidRes.json();
                if (!rData.error && rData.author) {
                    rapidApiData = rData;
                }
            } catch (e) {
                console.warn("RapidAPI metadata failed", e);
            }

            // 2. طلب روابط التحميل (الفيديو والصوت) مباشرة من جهاز المستخدم (تخطي حظر كلاودفلير)
            try {
                const tmRes = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`, {
                    headers: { "Accept": "application/json" }
                });
                const tmJson = await tmRes.json();
                
                if (tmJson.code === 0 && tmJson.data) {
                    const v = tmJson.data;
                    res = {
                        provider: "tikwm_client",
                        title: v.title || v.desc || "TikTok Video",
                        author: v.author?.unique_id || v.author?.nickname || "User",
                        cover: v.cover || v.origin_cover || "",
                        video: v.play || v.wmplay || "", 
                        music: typeof v.music === 'string' ? v.music : (v.music?.play_url || v.music_info?.play || ""),
                        images: v.images || [],
                        type: (v.images && v.images.length > 0) ? "image" : "video"
                    };
                }
            } catch (e) {
                console.warn("TikWM video fetch failed", e);
            }

            // 3. كود الطوارئ (لو فشل TikWM) يجرب Zell
            if (!res || !res.video) {
                try {
                    const zellRes = await fetch(`https://apizell.web.id/download/tiktok?url=${encodeURIComponent(url)}`, {
                        headers: { "Accept": "application/json" }
                    });
                    const zJson = await zellRes.json();
                    
                    if (zJson.status && zJson.result) {
                        const r = zJson.result;
                        res = {
                            provider: "zell_client",
                            title: r.title || "TikTok Video",
                            author: r.author?.nickname || r.author?.username || "User",
                            cover: r.thumbnail || "",
                            video: Array.isArray(r.video) ? r.video[0] : (r.video?.url || r.video),
                            music: r.music?.url || r.music || "",
                            images: r.images || [],
                            type: (r.images && r.images.length > 0) ? "image" : "video"
                        };
                    }
                } catch (e) {
                    console.warn("Zell video fetch failed", e);
                }
            }

            // 4. دمج بيانات RapidAPI (الاسم المؤكد) مع السيرفرات السابقة
            if (res) {
                if (rapidApiData) {
                    res.author = rapidApiData.author || res.author;
                    res.title = rapidApiData.title || res.title;
                    if (!res.cover) res.cover = rapidApiData.cover;
                    res.provider = `RapidAPI + ${res.provider}`;
                }
            } else {
                throw new Error("Unable to fetch video links. Please try again.");
            }

            // التحقق النهائي من نوع المحتوى
            const validation = validateResultType(res, mode);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            setResult(res);

            setTimeout(() => {
                const el = document.getElementById('result-area');
                if (el) {
                    const offset = el.getBoundingClientRect().top + window.scrollY - 20; // Changed from -100 to -20
                    window.scrollTo({ top: offset, behavior: "smooth" });
                }
            }, 500);

        } catch (err) {
            let msg = err.message;
            if (msg === 'Failed to fetch') msg = t('error_invalid_link', "Invalid Link or Network Error.");
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // المتغيرات الآمنة
    const videoUrl = result?.video || result?.play || result?.url || result?.nowatermark;
    const musicUrl = result?.music || result?.audio;
    const images = result?.images && Array.isArray(result.images) && result.images.length > 0 ? result.images : null;

    // Use passed placeholder or fallback
    const placeholderText = props.placeholder || t('placeholder', "Paste TikTok link here...");

    return (
        <div className="downloader-container">
            <div className="downloader-box">
                {/* Inputs and Buttons */}
                <div className="input-wrapper">
                    <input
                        type="url"
                        id="url-input"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={placeholderText}
                        aria-label={placeholderText}
                        onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
                        autoComplete="off"
                        spellCheck="false"
                    />

                    <div className="input-controls">
                        {/* زر ذكي: لصق عند الفراغ، نسخ عند وجود نص */}
                        <button
                            type="button"
                            className={`action-btn ${url ? 'copy-btn' : 'paste-btn'}`}
                            onClick={url ? handleCopyInput : handlePaste}
                            title={url ? t('btn_copy', "Copy") : t('btn_paste', "Paste")}
                            aria-label={url ? t('btn_copy', "Copy") : t('btn_paste', "Paste")}
                        >
                            <i className={`fas ${url ? 'fa-copy' : 'fa-paste'}`}></i>
                        </button>

                        {/* زر المسح - يظهر فقط عند وجود نص */}
                        {url && (
                            <button
                                type="button"
                                className="action-btn clear-btn"
                                onClick={() => setUrl('')}
                                title={t('btn_clear', "Clear")}
                                aria-label={t('btn_clear', "Clear")}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* ─── Native Banner Ad: Below URL Input ─── */}
                <div
                    id="ad-slot-below-input"
                    style={{
                        width: '100%',
                        minHeight: '90px',
                        margin: '10px 0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                        borderRadius: '10px',
                    }}
                />

                <button id="download-btn" onClick={handleDownload} disabled={loading}>
                    <i className="fas fa-download"></i> {t('btn_download', "Download Now")}
                </button>
            </div>

            <div id="scroll-target" style={{ width: '100%', marginTop: '20px' }}>
                {/* الإعلان سيظهر هنا، وسينزل الموقع للتمركز عليه لضمان رؤيته قبل النتيجة */}
                {props.children && (
                    <div className="ad-container-top" style={{ width: '100%', marginBottom: '20px' }}>
                        {props.children}
                    </div>
                )}

                <div id="result-area" role="region" aria-live="polite">

                {/* ─── Native Banner Ad: Above Loading Indicator ─── */}
                {hasStartedDownload && (
                    <div
                        id="ad-slot-above-loader"
                        style={{
                            width: '100%',
                            minHeight: '90px',
                            margin: '0 0 14px 0',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            borderRadius: '10px',
                        }}
                    />
                )}

                {loading && (
                    <div className="skeleton-loading-card">
                        <div className="skeleton-thumbnail"></div>
                        <div className="skeleton-info">
                            <div className="skeleton-line author"></div>
                            <div className="skeleton-line title"></div>
                            <div className="skeleton-buttons">
                                <div className="skeleton-btn"></div>
                                <div className="skeleton-btn"></div>
                            </div>
                        </div>
                        <div className="lightning-loader-container">
                            <div className="lightning-bolt-wrapper">
                                <i className="fas fa-bolt lightning-icon"></i>
                            </div>
                            <p className="processing-text">{t('processing', "Processing...")}</p>
                        </div>
                    </div>
                )}

                {/* ─── Native Banner Ad: Below Loading Indicator ─── */}
                {hasStartedDownload && (
                    <div
                        id="ad-slot-below-loader"
                        style={{
                            width: '100%',
                            minHeight: '90px',
                            margin: '14px 0',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            borderRadius: '10px',
                        }}
                    />
                )}

                {error && (
                    <div className="error-banner">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{error}</span>
                    </div>
                )}

                {result && (
                    <div className="result-card">
                        {(result.cover || result.thumbnail) && mode !== 'slideshow' && (
                            <div className="result-thumbnail">
                                <img
                                    src={result.cover || result.thumbnail}
                                    alt={t('cover_desc', 'TikTok Video Thumbnail')}
                                    loading="lazy"
                                    width="100%"
                                    height="auto"
                                    style={{ aspectRatio: '9/16', objectFit: 'cover' }}
                                />
                                <div className="play-overlay"><i className="fas fa-play"></i></div>
                            </div>
                        )}

                        <div className="result-info" style={{ width: '100%' }}>
                            <p className="result-author">
                                <i className="fab fa-tiktok"></i> @{sanitizeName(result.author || 'User')}
                            </p>
                            <p className="result-desc">
                                {result.title ? (result.title.length > 60 ? result.title.substring(0, 60) + '...' : result.title) : ''}
                            </p>

                            <div className="result-buttons">
                                {(!mode || mode === 'video') && videoUrl && !images && (
                                    <>
                                        <button className="btn-download btn-video" onClick={() => downloadFile(videoUrl, generateProName(result.author, 'mp4'))} disabled={downloadingUrl === videoUrl}>
                                            {downloadingUrl === videoUrl ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check-circle"></i>}
                                            {t('download_nwm', "Download No Watermark")}
                                        </button>
                                        <button className="btn-download btn-hd" onClick={() => downloadFile(videoUrl, generateProName(result.author + '_HD', 'mp4'))} disabled={downloadingUrl === videoUrl}>
                                            {downloadingUrl === videoUrl ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-crown"></i>}
                                            {t('download_hd', "Download HD 1080p")}
                                        </button>
                                    </>
                                )}

                                {mode === 'mp3' && musicUrl && (
                                    <button className="btn-download btn-audio" onClick={() => downloadFile(musicUrl, generateProName(result.author, 'mp3'))} disabled={downloadingUrl === musicUrl}>
                                        {downloadingUrl === musicUrl ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-music"></i>}
                                        {t('download_audio', "Download MP3 Audio")}
                                    </button>
                                )}

                                {mode === 'story' && (
                                    <>
                                        {videoUrl ? (
                                            <button className="btn-download btn-video" onClick={() => downloadFile(videoUrl, generateProName(result.author, 'mp4', 'story'))}>
                                                <i className="fas fa-history"></i> {t('download_story_vid', "Download Story (Video)")}
                                            </button>
                                        ) : (images && images.length > 0) ? (
                                            <button className="btn-download btn-sm" style={{ width: '100%' }} onClick={() => downloadFile(images[0], generateProName(result.author, 'jpg', 'story'))}>
                                                <i className="fas fa-image"></i> {t('download_story_img', "Download Story (Image)")}
                                            </button>
                                        ) : null}
                                    </>
                                )}

                                {(mode === 'slideshow' || (mode === 'video' && images)) && images && (
                                    <div className="slideshow-actions" style={{ width: '100%', marginBottom: '15px' }}>
                                        <button
                                            className="btn-download btn-video"
                                            onClick={downloadAllImages}
                                            disabled={zipping}
                                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(45deg, #FF0050, #00F2EA)' }}
                                        >
                                            {zipping ? (
                                                <>
                                                    <i className="fas fa-spinner fa-spin"></i> {t('creating_zip', "Creating ZIP...")}
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-file-archive"></i> {t('download_zip', "Download All Images (ZIP)")}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {(mode === 'slideshow' || (mode === 'video' && images)) && images && (
                                <div className="slideshow-container" style={{ marginTop: '0px' }}>
                                    <div className="slideshow-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                                        {images.map((img, index) => (
                                            <div key={index} className="slide-item">
                                                <img
                                                    src={img}
                                                    alt={`${t('slide_desc', 'TikTok Slideshow Image')} ${index + 1}`}
                                                    style={{ width: '100%', borderRadius: '8px', aspectRatio: '9/16', objectFit: 'cover' }}
                                                    loading="lazy"
                                                    width="150"
                                                    height="266"
                                                />
                                                <button className="btn-download btn-sm"
                                                    style={{ fontSize: '0.85rem', width: '100%', marginTop: '5px' }}
                                                    onClick={() => downloadFile(img, generateProName(result.author, 'jpg', `slide_${index + 1}`))}>
                                                    <i className="fas fa-download"></i> {t('save_image', "Save Image")}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}

