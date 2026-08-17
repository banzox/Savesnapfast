import React, { useState, useEffect, useRef } from 'react';
import fileSaver from 'file-saver';
import { ADS_CONFIG } from '../config';
const { saveAs } = fileSaver;

// Dynamic import for JSZip - only loads when needed (better mobile performance)
const loadJSZip = () => import('jszip');

const WORKER_URL = "/api/tiktok";
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
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const resultRef = useRef(null);
    const [downloadPending, setDownloadPending] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const [downloadComplete, setDownloadComplete] = useState(false);

    // --- دالة تنظيف وتسمية الملفات ---
    const sanitizeName = (name) => {
        if (!name) return 'TikTok_User';
        const cleaned = String(name)
            .replace(/[^\p{L}\p{N}\s_-]/gu, '')
            .replace(/\s+/g, '_')
            .substring(0, 30);
        if (!cleaned || /^[_-\s]+$/.test(cleaned)) {
            return 'TikTok_User';
        }
        return cleaned;
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


    // Internal: executes the actual file download (called after countdown finishes or on skip)
    const executeDownload = (fileUrl, fileName) => {
        if (!fileUrl) return;
        const downloadUrl = `/api/download?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(fileName)}`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadComplete(true); // Show Thank You toast
    };

    // Start a requested file download immediately, with no ad interstitial.
    const initiateDownload = (fileUrl, fileName) => {
        if (!fileUrl) return;
        executeDownload(fileUrl, fileName);
    };

    // Native Ad logic is now handled in an iframe directly in the render to prevent async document.write loading issues

    // Reliable Custom Slow Scroll to Results (1.2s / 1200ms)
    const customSlowScroll = (targetId, duration = 1200) => {
        const target = document.getElementById(targetId);
        if (!target) return;

        const rect = target.getBoundingClientRect();
        let targetPosition;
        
        // إذا كان حجم النتيجة أصغر من الشاشة، نجعل أسفل النتيجة متوازياً مع أسفل الشاشة
        // هذا سيعطي مساحة علوية لإظهار الإعلان بشكل مثالي
        if (rect.height < window.innerHeight - 150) {
            targetPosition = rect.bottom + window.scrollY - window.innerHeight + 40; // 40px margin at bottom
        } else {
            // أما إذا كانت النتيجة طويلة جداً (مثل الصور المتعددة)، نبدأ من الأعلى
            targetPosition = rect.top + window.scrollY - 85;
        }
        
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;

        // Custom easing curve (easeOutQuint) - starts fast, slows down beautifully at the end
        const easing = (t) => 1 - Math.pow(1 - t, 5);

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            let progress = timeElapsed / duration;

            if (progress > 1) progress = 1;

            window.scrollTo(0, startPosition + distance * easing(progress));

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    };

    useEffect(() => {
        if (result && resultRef.current) {
            const timer = setTimeout(() => {
                // Focus explicitly on the RESULT Info, but raised higher up to reveal the ad
                customSlowScroll('result-info-box', 1200);
            }, 600); // Wait 600ms for layout to settle before moving
            return () => clearTimeout(timer);
        }
    }, [result]);

    // Countdown interstitial timer + body scroll lock
    useEffect(() => {
        if (!downloadPending) {
            document.body.style.overflow = '';
            return;
        }
        document.body.style.overflow = 'hidden';
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            executeDownload(downloadPending.fileUrl, downloadPending.fileName);
            setDownloadPending(null);
        }
        // Cleanup on unmount (e.g. SPA page navigation)
        return () => { document.body.style.overflow = ''; };
    }, [countdown, downloadPending]);

    // Auto-dismiss Thank You toast after 8 seconds
    useEffect(() => {
        if (!downloadComplete) return;
        const timer = setTimeout(() => setDownloadComplete(false), 8000);
        return () => clearTimeout(timer);
    }, [downloadComplete]);

    const downloadAllImages = async () => {
        if (!result || !result.images || result.images.length === 0) return;

        setZipping(true);
        try {
            const { default: JSZip } = await loadJSZip();
            const zip = new JSZip();
            const author = sanitizeName(result.author || 'TikTok_User');
            const folder = zip.folder(`TikTok_Slideshow_${author}`);

            let fetchedCount = 0;
            // Fetch all images via proxy to avoid CORS blocking and empty ZIPs
            const imagePromises = result.images.map(async (imgUrl, index) => {
                try {
                    const fileName = `slide_${index + 1}.jpg`;
                    const proxyUrl = `/api/download?url=${encodeURIComponent(imgUrl)}&filename=${encodeURIComponent(fileName)}`;
                    const response = await fetch(proxyUrl);
                    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                    const blob = await response.blob();
                    if (blob && blob.size > 0) {
                        folder.file(fileName, blob);
                        fetchedCount++;
                    }
                } catch (e) {
                    // Silent fail for individual images
                }
            });

            await Promise.all(imagePromises);

            if (fetchedCount === 0) {
                setError(t('error_slideshow_fetch_failed', "Failed to retrieve slideshow images"));
                return;
            }

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `TikTok_Slideshow_${author}.zip`);

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

        try {
            let res = null;
            let rapidApiData = null;

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
                            data-tooltip={url ? t('btn_copy', "Copy") : t('btn_paste', "Paste")}
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
                                data-tooltip={t('btn_clear', "Clear")}
                                aria-label={t('btn_clear', "Clear")}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                </div>

                <button id="download-btn" onClick={handleDownload} disabled={loading}>
                    <i className="fas fa-download"></i> {t('btn_download', "Download Now")}
                </button>

                {/* ─── Native Banner Promo (Visible immediately below URL box) ─── */}
                {ADS_CONFIG.enableAdsterra && (
                    <div id="main-sponsor-widget" style={{ width: '100%', overflow: 'hidden', minHeight: '250px', borderRadius: '10px', marginTop: '10px', transition: 'height 0.3s ease' }}>
                        <iframe 
                            id="native-ad-iframe"
                            src="/ad-native"
                            width="100%" 
                            height="250" 
                            frameBorder="0" 
                            scrolling="no" 
                            allowTransparency="true"
                            style={{ display: 'block', backgroundColor: 'transparent', maxWidth: '100%', transition: 'height 0.3s ease' }}
                            title="Advertisement"
                            onLoad={(e) => {
                                // Listen for height updates from the iframe
                                const handleMessage = (event) => {
                                    if (event.data && event.data.type === 'resize-ad') {
                                        const newHeight = event.data.height;
                                        if (e.target) {
                                            e.target.style.height = `${newHeight}px`;
                                            e.target.parentElement.style.height = `${newHeight}px`;
                                        }
                                    }
                                };
                                window.addEventListener('message', handleMessage);
                                // Cleanup is handled when window goes away or is handled loosely
                            }}
                        ></iframe>
                    </div>
                )}
            </div>

            <div id="scroll-target" style={{ width: '100%', marginTop: '20px' }}>

                <div id="result-area" role="region" aria-live="polite">

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
                
                {error && (
                    <div className="error-banner">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{error}</span>
                    </div>
                )}

                {result && (
                    <div className="result-card">
                        <div className="result-header">
                            {result.cover && (!images || images.length === 0) && (
                                <div className="result-preview-thumb">
                                    <img
                                        src={result.cover}
                                        alt={result.title || "TikTok preview"}
                                        loading="lazy"
                                        width="100"
                                        height="130"
                                    />
                                    <div className="preview-badge">
                                        <i className="fas fa-play"></i>
                                    </div>
                                </div>
                            )}
                            <div className="result-header-details">
                                <p className="result-author">
                                    <i className="fas fa-user-circle"></i> @{sanitizeName(result.author || 'User')}
                                    <span className="verified-badge"><i className="fas fa-check"></i></span>
                                </p>
                                <p className="result-desc">
                                    {result.title ? (result.title.length > 80 ? result.title.substring(0, 80) + '...' : result.title) : ''}
                                </p>
                            </div>
                        </div>

                        <div id="result-info-box" className="result-info" style={{ width: '100%' }}>
                            <div ref={resultRef} id="result-buttons" className="result-buttons">
                                {(!mode || mode === 'video') && videoUrl && !images && (
                                    <>
                                        <button className="btn-download btn-video" onClick={() => initiateDownload(videoUrl, generateProName(result.author, 'mp4'))}>
                                            <i className="fas fa-check-circle"></i>
                                            {t('download_nwm', "Download No Watermark")}
                                        </button>
                                        <button className="btn-download btn-hd" onClick={() => initiateDownload(videoUrl, generateProName(result.author + '_HD', 'mp4'))}>
                                            <i className="fas fa-crown"></i>
                                            {t('download_hd', "Download HD 1080p")}
                                        </button>
                                        {musicUrl && (
                                            <button className="btn-download btn-audio" onClick={() => initiateDownload(musicUrl, generateProName(result.author, 'mp3'))}>
                                                <i className="fas fa-music"></i>
                                                {t('download_audio', "Download MP3 Audio")}
                                            </button>
                                        )}
                                    </>
                                )}

                                {mode === 'mp3' && musicUrl && (
                                    <button className="btn-download btn-audio" onClick={() => initiateDownload(musicUrl, generateProName(result.author, 'mp3'))}>
                                        <i className="fas fa-music"></i>
                                        {t('download_audio', "Download MP3 Audio")}
                                    </button>
                                )}

                                {mode === 'story' && (
                                    <>
                                        {videoUrl ? (
                                            <button className="btn-download btn-video" onClick={() => initiateDownload(videoUrl, generateProName(result.author, 'mp4', 'story'))}>
                                                <i className="fas fa-history"></i> {t('download_story_vid', "Download Story (Video)")}
                                            </button>
                                        ) : (images && images.length > 0) ? (
                                            <button className="btn-download btn-sm" style={{ width: '100%' }} onClick={() => initiateDownload(images[0], generateProName(result.author, 'jpg', 'story'))}>
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

                            {/* ── Download Another Button ── */}
                            <button
                                onClick={() => { 
                                    setResult(null); setUrl(''); setError(null); setDownloadComplete(false); 
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="btn-another"
                            >
                                <i className="fas fa-redo"></i>
                                {t('download_another', 'Download Another Video')}
                            </button>

                            {(mode === 'slideshow' || (mode === 'video' && images)) && images && (
                                <div className="slideshow-container" style={{ marginTop: '15px' }}>
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
                                                    onClick={() => initiateDownload(img, generateProName(result.author, 'jpg', `slide_${index + 1}`))}>
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

            {/* ── Thank You Toast ── */}
            {downloadComplete && (
                <div style={{
                    position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #0d1b2a, #1a2f45)',
                    border: '1px solid rgba(0,242,234,0.35)',
                    borderRadius: '18px', padding: '14px 18px',
                    zIndex: 8888, display: 'flex', alignItems: 'center', gap: '14px',
                    maxWidth: '440px', width: '92%',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
                    animation: 'toastSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                }}>
                    <style>{`
                        @keyframes toastSlideUp {
                            from { transform: translate(-50%, 100px); opacity: 0; }
                            to { transform: translate(-50%, 0); opacity: 1; }
                        }
                    `}</style>
                    <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>🎉</span>
                    <div style={{ flex: 1 }}>
                        <p style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, margin: '0 0 2px' }}>
                            {t('thank_you_title', 'Download Started!')}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', margin: 0 }}>
                            {t('thank_you_msg', 'Check your downloads folder')}
                        </p>
                    </div>
                    <button
                        onClick={() => { 
                            setResult(null); setUrl(''); setError(null); setDownloadComplete(false); 
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                            background: 'linear-gradient(45deg, #FF0050, #00F2EA)',
                            border: 'none', borderRadius: '10px', padding: '8px 12px',
                            color: '#fff', fontSize: '0.78rem', fontWeight: 700,
                            cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap'
                        }}
                    >
                        <i className="fas fa-redo" style={{ marginRight: '5px' }}></i>
                        {t('download_another', 'Try Another')}
                    </button>
                </div>
            )}

            {/* ── Countdown Interstitial Modal ── */}
            {downloadPending && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)',
                    zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '16px'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
                        borderRadius: '24px', padding: '28px 24px', textAlign: 'center',
                        border: '1px solid rgba(255,255,255,0.12)', maxWidth: '500px', width: '100%',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.7)', position: 'relative'
                    }}>

                        {/* ─ X Close Button (starts download + closes modal) ─ */}
                        <button
                            onClick={() => { executeDownload(downloadPending.fileUrl, downloadPending.fileName); setDownloadPending(null); }}
                            style={{
                                position: 'absolute', top: '14px', insetInlineEnd: '16px',
                                background: 'rgba(255,255,255,0.08)', border: 'none',
                                borderRadius: '50%', width: '32px', height: '32px',
                                color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            title={t('skip_download', 'Download Now')}
                        >
                            <i className="fas fa-times"></i>
                        </button>

                        {/* ─ Alert: Check the new tab ─ */}
                        <div style={{
                            background: 'linear-gradient(90deg, rgba(255,0,80,0.15), rgba(0,242,234,0.15))',
                            border: '1px solid rgba(0,242,234,0.3)',
                            borderRadius: '12px', padding: '10px 16px',
                            marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'
                        }}>
                            <i className="fas fa-external-link-alt" style={{ color: '#00F2EA', fontSize: '1rem', flexShrink: 0 }}></i>
                            <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, margin: 0, textAlign: 'left' }}>
                                {t('check_new_tab', 'A new tab just opened — check it out while you wait!')}
                            </p>
                        </div>

                        {/* ─ Countdown row ─ */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                            <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
                                <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
                                    <defs>
                                        <linearGradient id="cdGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#FF0050" />
                                            <stop offset="100%" stopColor="#00F2EA" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                                    <circle
                                        cx="45" cy="45" r="36" fill="none"
                                        stroke="url(#cdGrad)" strokeWidth="6" strokeLinecap="round"
                                        strokeDasharray="226.2"
                                        strokeDashoffset="226.2"
                                        style={{ transition: 'stroke-dashoffset 0.9s linear' }}
                                    />
                                </svg>
                                <div style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1
                                }}>{countdown}</div>
                            </div>
                            <div style={{ textAlign: 'left', flex: 1 }}>
                                <p style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>
                                    {t('preparing_download', 'Preparing your download...')}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', margin: 0 }}>
                                    {t('countdown_msg', 'File will download automatically')}
                                </p>
                            </div>
                        </div>

                        {ADS_CONFIG.enableAdsterra && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '10px 0', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <iframe 
                                    src="/ad-300x250"
                                    width="300" height="250" 
                                    frameBorder="0" scrolling="no" 
                                    allowTransparency="true"
                                    style={{ display: 'block', backgroundColor: 'transparent' }}
                                    title="Advertisement"
                                ></iframe>
                            </div>
                        )}

                        <button
                            onClick={() => { executeDownload(downloadPending.fileUrl, downloadPending.fileName); setDownloadPending(null); }}
                            style={{
                                background: 'linear-gradient(45deg, #FF0050, #00F2EA)',
                                border: 'none', borderRadius: '14px', padding: '13px 0',
                                color: '#fff', fontSize: '1rem', fontWeight: 700,
                                cursor: 'pointer', width: '100%', letterSpacing: '0.3px'
                            }}
                        >
                            <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
                            {t('skip_download', 'Skip & Download Now')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

