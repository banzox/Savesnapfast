import React, { useState, useEffect, useRef } from 'react';
import fileSaver from 'file-saver';
import { ADS_CONFIG } from '../config';
const { saveAs } = fileSaver;

// Dynamic import for JSZip - only loads when needed (better mobile performance)
const loadJSZip = () => import('jszip');

const WORKER_URL = "/api/tiktok";

export default function Downloader(props) {
    const { messages = {}, mode = 'video' } = props;

    // دالة الترجمة مع دعم النصوص الافتراضية الذكية
    const t = (key, defaultText) => {
        const k = key.replace('downloader.', '');
        return messages[k] || defaultText;
    };

    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadStage, setLoadStage] = useState(1);
    const [zipping, setZipping] = useState(false);
    const [zipProgress, setZipProgress] = useState(0);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const resultRef = useRef(null);
    const [downloadPending, setDownloadPending] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const [downloadComplete, setDownloadComplete] = useState(false);
    const [copied, setCopied] = useState(false);

    // التحقق من صحة رابط تيك توك
    const isTikTokUrl = (str) => {
        if (!str || typeof str !== 'string') return false;
        const clean = str.trim().toLowerCase();
        return (
            clean.includes('tiktok.com') ||
            clean.includes('douyin.com') ||
            clean.includes('vt.tiktok.com') ||
            clean.includes('vm.tiktok.com')
        );
    };

    const isLinkValid = isTikTokUrl(url);

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
            if (navigator.permissions && navigator.permissions.query) {
                const status = await navigator.permissions.query({ name: 'clipboard-read' });
                if (status.state === 'denied') {
                    throw new Error('Permission Denied');
                }
            }
            const text = await navigator.clipboard.readText();
            if (text) {
                setUrl(text.trim());
                setError(null);
            }
        } catch (err) {
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
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setUrl('');
        setError(null);
        setCopied(false);
    };

    // تنفيذ التنزيل الفعلي عبر البروكسي الداخلي
    const executeDownload = (fileUrl, fileName) => {
        if (!fileUrl) return;
        const downloadUrl = `/api/download?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(fileName)}`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadComplete(true);
    };

    const initiateDownload = (fileUrl, fileName) => {
        if (!fileUrl) return;
        executeDownload(fileUrl, fileName);
    };

    // التمرير السلس والذكي نحو النتائج
    const customSlowScroll = (targetId, duration = 900) => {
        const target = document.getElementById(targetId);
        if (!target) return;

        const rect = target.getBoundingClientRect();
        let targetPosition;
        
        if (rect.height < window.innerHeight - 150) {
            targetPosition = rect.bottom + window.scrollY - window.innerHeight + 40;
        } else {
            targetPosition = rect.top + window.scrollY - 85;
        }
        
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const easing = (t) => 1 - Math.pow(1 - t, 4);

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
                customSlowScroll('result-info-box', 900);
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [result]);

    // إخفاء إشعار اكتمال التنزيل تلقائياً بعد 5 ثوانٍ
    useEffect(() => {
        if (!downloadComplete) return;
        const timer = setTimeout(() => setDownloadComplete(false), 5000);
        return () => clearTimeout(timer);
    }, [downloadComplete]);

    // تنزيل جميع الصور كملف مضغوط ZIP مع شريط تقدم
    const downloadAllImages = async () => {
        if (!result || !result.images || result.images.length === 0) return;

        setZipping(true);
        setZipProgress(10);
        try {
            const { default: JSZip } = await loadJSZip();
            const zip = new JSZip();
            const author = sanitizeName(result.author || 'TikTok_User');
            const folder = zip.folder(`TikTok_Slideshow_${author}`);

            let fetchedCount = 0;
            const total = result.images.length;

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
                        setZipProgress(Math.round(10 + (fetchedCount / total) * 70));
                    }
                } catch (e) {
                    // تجاهل الأخطاء الفردية
                }
            });

            await Promise.all(imagePromises);

            if (fetchedCount === 0) {
                setError(t('error_slideshow_fetch_failed', "Failed to retrieve slideshow images"));
                return;
            }

            setZipProgress(90);
            const content = await zip.generateAsync({ type: "blob" });
            setZipProgress(100);
            saveAs(content, `TikTok_Slideshow_${author}.zip`);
            setDownloadComplete(true);

        } catch (err) {
            setError(t('error_busy', "Failed to create ZIP file."));
        } finally {
            setZipping(false);
            setZipProgress(0);
        }
    };

    const validateResultType = (res, currentMode) => {
        const hasImages = res.images && res.images.length > 0;
        if (currentMode === 'slideshow') {
            if (!hasImages) return { valid: false, error: t('error_wrong_type_slideshow', "Link is not a slideshow! Use Video Downloader.") };
        }
        return { valid: true };
    };

    const handleDownload = async () => {
        const cleanUrl = url.trim();
        if (!cleanUrl) return;

        if (!isTikTokUrl(cleanUrl)) {
            setError(t('error_invalid_link', "Please enter a valid TikTok video, audio, or photo link."));
            return;
        }

        setLoading(true);
        setLoadStage(1);
        setError(null);
        setResult(null);

        const stageTimer1 = setTimeout(() => setLoadStage(2), 700);
        const stageTimer2 = setTimeout(() => setLoadStage(3), 1400);

        try {
            let res = null;
            let rapidApiData = null;

            // المستوى 1: طلب خادم الحافة (Edge Worker)
            try {
                const rapidRes = await fetch(WORKER_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: cleanUrl })
                });
                if (rapidRes.ok) {
                    const rData = await rapidRes.json();
                    if (!rData.error && rData.author) {
                        rapidApiData = rData;
                    }
                }
            } catch (e) {
                console.warn("Worker fetch warning:", e);
            }

            // المستوى 2: طلب TikWM المباشر
            try {
                const tmRes = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}`, {
                    headers: { "Accept": "application/json" }
                });
                if (tmRes.ok) {
                    const tmJson = await tmRes.json();
                    if (tmJson.code === 0 && tmJson.data) {
                        const v = tmJson.data;
                        res = {
                            provider: "tikwm_client",
                            title: v.title || v.desc || "TikTok Video",
                            author: v.author?.unique_id || v.author?.nickname || "User",
                            cover: v.cover || v.origin_cover || "",
                            video: v.play || v.wmplay || v.hdplay || "", 
                            music: typeof v.music === 'string' ? v.music : (v.music?.play_url || v.music_info?.play || ""),
                            images: Array.isArray(v.images) ? v.images : [],
                            type: (v.images && v.images.length > 0) ? "image" : "video"
                        };
                    }
                }
            } catch (e) {
                console.warn("TikWM fetch warning:", e);
            }

            // المستوى 3: طلب Zell API الاحتياطي
            if (!res || !res.video) {
                try {
                    const zellRes = await fetch(`https://apizell.web.id/download/tiktok?url=${encodeURIComponent(cleanUrl)}`, {
                        headers: { "Accept": "application/json" }
                    });
                    if (zellRes.ok) {
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
                                images: Array.isArray(r.images) ? r.images : [],
                                type: (r.images && r.images.length > 0) ? "image" : "video"
                            };
                        }
                    }
                } catch (e) {
                    console.warn("Zell fetch warning:", e);
                }
            }

            if (res) {
                if (rapidApiData) {
                    res.author = rapidApiData.author || res.author;
                    res.title = rapidApiData.title || res.title;
                    if (!res.cover) res.cover = rapidApiData.cover;
                    res.provider = `RapidAPI + ${res.provider}`;
                }
            } else if (rapidApiData && (rapidApiData.video || (rapidApiData.images && rapidApiData.images.length > 0))) {
                res = rapidApiData;
            } else {
                throw new Error(t('error_not_found', "Unable to fetch video links. Please ensure the video is public and try again."));
            }

            const validation = validateResultType(res, mode);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            setResult(res);

        } catch (err) {
            let msg = err.message;
            if (msg === 'Failed to fetch') msg = t('error_invalid_link', "Network error or invalid link. Please try again.");
            setError(msg);
        } finally {
            clearTimeout(stageTimer1);
            clearTimeout(stageTimer2);
            setLoading(false);
        }
    };

    const videoUrl = result?.video || result?.play || result?.url || result?.nowatermark;
    const musicUrl = result?.music || result?.audio;
    const images = result?.images && Array.isArray(result.images) && result.images.length > 0 ? result.images : null;

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
                        onChange={(e) => {
                            setUrl(e.target.value);
                            if (error) setError(null);
                        }}
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
                            className={`action-btn ${url ? (copied ? 'copied-btn' : 'copy-btn') : 'paste-btn'}`}
                            onClick={url ? handleCopyInput : handlePaste}
                            data-tooltip={url ? (copied ? t('copied', "Copied!") : t('btn_copy', "Copy")) : t('btn_paste', "Paste")}
                            aria-label={url ? (copied ? t('copied', "Copied!") : t('btn_copy', "Copy")) : t('btn_paste', "Paste")}
                            title={url ? (copied ? t('copied', "Copied!") : t('btn_copy', "Copy")) : t('btn_paste', "Paste")}
                        >
                            <i className={`fas ${url ? (copied ? 'fa-check' : 'fa-copy') : 'fa-paste'}`}></i>
                        </button>

                        {/* زر المسح - يظهر فقط عند وجود نص */}
                        {url && (
                            <button
                                type="button"
                                className="action-btn clear-btn"
                                onClick={handleClear}
                                data-tooltip={t('btn_clear', "Clear")}
                                aria-label={t('btn_clear', "Clear")}
                                title={t('btn_clear', "Clear")}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* شارة التحقق الفوري من الرابط */}
                {isLinkValid && !loading && !result && (
                    <div className="link-ready-badge">
                        <span className="pulse-dot"></span>
                        <span>{t('link_detected', "TikTok Link Detected — Ready to Download")}</span>
                    </div>
                )}

                <button 
                    id="download-btn" 
                    onClick={handleDownload} 
                    disabled={loading || !url.trim()}
                    className={loading ? 'loading-btn' : ''}
                >
                    {loading ? (
                        <>
                            <i className="fas fa-circle-notch fa-spin"></i> {t('btn_loading', "Processing...")}
                        </>
                    ) : (
                        <>
                            <i className="fas fa-bolt"></i> {t('btn_download', "Download Now")}
                        </>
                    )}
                </button>

                {/* ─── Native Banner Promo (Visible below URL box) ─── */}
                {ADS_CONFIG.enableAdsterra && (
                    <div id="main-sponsor-widget" style={{ width: '100%', overflow: 'hidden', minHeight: '250px', borderRadius: '14px', marginTop: '14px', transition: 'height 0.3s ease' }}>
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
                            }}
                        ></iframe>
                    </div>
                )}
            </div>

            <div id="scroll-target" style={{ width: '100%', marginTop: '24px' }}>
                <div id="result-area" role="region" aria-live="polite">

                {/* ─── بطاقة التحميل المرحلية المتطورة ─── */}
                {loading && (
                    <div className="skeleton-loading-card">
                        <div className="multi-stage-progress">
                            <div className="progress-bar-track">
                                <div 
                                    className="progress-bar-fill"
                                    style={{ 
                                        width: loadStage === 1 ? '30%' : loadStage === 2 ? '70%' : '95%' 
                                    }}
                                ></div>
                            </div>
                            <div className="stage-steps">
                                <div className={`stage-step ${loadStage >= 1 ? 'active' : ''}`}>
                                    <i className="fas fa-link"></i>
                                    <span>{t('stage_1', "Analyzing Link")}</span>
                                </div>
                                <div className={`stage-step ${loadStage >= 2 ? 'active' : ''}`}>
                                    <i className="fas fa-magic"></i>
                                    <span>{t('stage_2', "Extracting Stream")}</span>
                                </div>
                                <div className={`stage-step ${loadStage >= 3 ? 'active' : ''}`}>
                                    <i className="fas fa-check-circle"></i>
                                    <span>{t('stage_3', "Ready")}</span>
                                </div>
                            </div>
                        </div>

                        <div className="skeleton-content-row">
                            <div className="skeleton-thumbnail"></div>
                            <div className="skeleton-info">
                                <div className="skeleton-line author"></div>
                                <div className="skeleton-line title"></div>
                                <div className="skeleton-buttons">
                                    <div className="skeleton-btn"></div>
                                    <div className="skeleton-btn"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* ─── رسالة الخطأ العصرية ─── */}
                {error && (
                    <div className="error-banner">
                        <div className="error-icon-wrapper">
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <div className="error-text-wrapper">
                            <p className="error-title">{t('error_title', "Download Failed")}</p>
                            <span className="error-desc">{error}</span>
                        </div>
                        <button 
                            className="error-dismiss-btn"
                            onClick={() => setError(null)}
                            aria-label="Dismiss error"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                )}

                {/* ─── بطاقة النتيجة الفائقة الجودة (Result Card) ─── */}
                {result && (
                    <div className="result-card">
                        <div className="result-header">
                            {result.cover && (!images || images.length === 0) && (
                                <div className="result-preview-thumb">
                                    <img
                                        src={result.cover}
                                        alt={result.title || "TikTok preview"}
                                        loading="lazy"
                                        decoding="async"
                                        width="120"
                                        height="160"
                                    />
                                    <div className="preview-badge">
                                        <i className="fas fa-play"></i>
                                    </div>
                                </div>
                            )}
                            <div className="result-header-details">
                                <div className="result-author-row">
                                    <div className="author-avatar-badge">
                                        <i className="fas fa-user-check"></i>
                                    </div>
                                    <div>
                                        <p className="result-author">
                                            @{sanitizeName(result.author || 'TikTok_User')}
                                            <span className="verified-badge" title="Verified Creator">
                                                <i className="fas fa-check-circle"></i>
                                            </span>
                                        </p>
                                        <span className="result-badge-quality">
                                            <i className="fas fa-crown"></i> 1080p Full HD
                                        </span>
                                    </div>
                                </div>
                                <p className="result-desc">
                                    {result.title ? (result.title.length > 100 ? result.title.substring(0, 100) + '...' : result.title) : ''}
                                </p>
                            </div>
                        </div>

                        <div id="result-info-box" className="result-info" style={{ width: '100%' }}>
                            <div ref={resultRef} id="result-buttons" className="result-buttons">
                                {(!mode || mode === 'video') && videoUrl && !images && (
                                    <>
                                        <button 
                                            className="btn-download btn-video" 
                                            onClick={() => initiateDownload(videoUrl, generateProName(result.author, 'mp4'))}
                                        >
                                            <i className="fas fa-check-circle"></i>
                                            <span>{t('download_nwm', "Download No Watermark (Fast Server)")}</span>
                                        </button>
                                        <button 
                                            className="btn-download btn-hd" 
                                            onClick={() => initiateDownload(videoUrl, generateProName(result.author + '_HD', 'mp4'))}
                                        >
                                            <i className="fas fa-crown"></i>
                                            <span>{t('download_hd', "Download HD 1080p Ultra")}</span>
                                        </button>
                                        {musicUrl && (
                                            <button 
                                                className="btn-download btn-audio" 
                                                onClick={() => initiateDownload(musicUrl, generateProName(result.author, 'mp3'))}
                                            >
                                                <i className="fas fa-music"></i>
                                                <span>{t('download_audio', "Download MP3 Audio")}</span>
                                            </button>
                                        )}
                                    </>
                                )}

                                {mode === 'mp3' && musicUrl && (
                                    <button 
                                        className="btn-download btn-audio" 
                                        onClick={() => initiateDownload(musicUrl, generateProName(result.author, 'mp3'))}
                                    >
                                        <i className="fas fa-music"></i>
                                        <span>{t('download_audio', "Download MP3 Audio (Original Sound)")}</span>
                                    </button>
                                )}

                                {mode === 'story' && (
                                    <>
                                        {videoUrl ? (
                                            <button 
                                                className="btn-download btn-video" 
                                                onClick={() => initiateDownload(videoUrl, generateProName(result.author, 'mp4', 'story'))}
                                            >
                                                <i className="fas fa-history"></i>
                                                <span>{t('download_story_vid', "Download Story (Video)")}</span>
                                            </button>
                                        ) : (images && images.length > 0) ? (
                                            <button 
                                                className="btn-download btn-sm" 
                                                style={{ width: '100%' }} 
                                                onClick={() => initiateDownload(images[0], generateProName(result.author, 'jpg', 'story'))}
                                            >
                                                <i className="fas fa-image"></i>
                                                <span>{t('download_story_img', "Download Story (Image)")}</span>
                                            </button>
                                        ) : null}
                                    </>
                                )}

                                {(mode === 'slideshow' || (mode === 'video' && images)) && images && (
                                    <div className="slideshow-actions" style={{ width: '100%', marginBottom: '16px' }}>
                                        <button
                                            className="btn-download btn-zip"
                                            onClick={downloadAllImages}
                                            disabled={zipping}
                                        >
                                            {zipping ? (
                                                <>
                                                    <i className="fas fa-spinner fa-spin"></i> 
                                                    <span>{t('creating_zip', "Creating ZIP...")} ({zipProgress}%)</span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-file-archive"></i> 
                                                    <span>{t('download_zip', "Download All Images in ZIP (One Click)")}</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* زر تنزيل فيديو آخر */}
                            <button
                                onClick={() => { 
                                    setResult(null); 
                                    setUrl(''); 
                                    setError(null); 
                                    setDownloadComplete(false); 
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    const input = document.getElementById('url-input');
                                    if (input) input.focus();
                                }}
                                className="btn-another"
                            >
                                <i className="fas fa-redo-alt"></i>
                                <span>{t('download_another', 'Download Another Video')}</span>
                            </button>

                            {/* شبكة معرض الصور للسلايد شو */}
                            {(mode === 'slideshow' || (mode === 'video' && images)) && images && (
                                <div className="slideshow-container">
                                    <div className="slideshow-header-info">
                                        <i className="fas fa-images"></i>
                                        <span>{images.length} {t('photos_count', "Photos Found in Album")}</span>
                                    </div>
                                    <div className="slideshow-grid">
                                        {images.map((img, index) => (
                                            <div key={index} className="slide-item">
                                                <div className="slide-image-wrapper">
                                                    <img
                                                        src={img}
                                                        alt={`${t('slide_desc', 'TikTok Photo')} ${index + 1}`}
                                                        loading="lazy"
                                                        decoding="async"
                                                        width="180"
                                                        height="320"
                                                    />
                                                    <span className="slide-counter">#{index + 1}</span>
                                                </div>
                                                <button 
                                                    className="btn-download-slide"
                                                    onClick={() => initiateDownload(img, generateProName(result.author, 'jpg', `slide_${index + 1}`))}
                                                >
                                                    <i className="fas fa-arrow-down"></i> {t('save_image', "Save Photo")}
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

            {/* ── Toast الإشعار عند بدء التحميل ── */}
            {downloadComplete && (
                <div className="thank-you-toast">
                    <div className="toast-icon-badge">
                        <i className="fas fa-sparkles"></i>
                    </div>
                    <div className="toast-text-box">
                        <p className="toast-title">{t('thank_you_title', 'Download Started!')}</p>
                        <p className="toast-msg">{t('thank_you_msg', 'Your file has been saved to your downloads folder.')}</p>
                    </div>
                    <button
                        className="toast-action-btn"
                        onClick={() => { 
                            setResult(null); 
                            setUrl(''); 
                            setError(null); 
                            setDownloadComplete(false); 
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        <i className="fas fa-plus"></i>
                        <span>{t('try_another', 'Next Video')}</span>
                    </button>
                </div>
            )}
        </div>
    );
}

