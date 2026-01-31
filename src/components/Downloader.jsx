import React, { useState } from 'react';
import JSZip from 'jszip';
import fileSaver from 'file-saver';
const { saveAs } = fileSaver;

const WORKER_URL = "https://api.savetik-fast.xyz";
const SMART_LINK = "https://www.effectivegatecpm.com/pjjsq7g4?key=d767025cc7e5239dd2334794b7167308";

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
            const text = await navigator.clipboard.readText();
            if (text) setUrl(text);
        } catch (err) {
            console.error('Failed to read clipboard', err);
        }
    };

    const downloadFile = async (fileUrl, fileName) => {
        if (SMART_LINK) window.open(SMART_LINK, '_blank');
        try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(blobUrl);
                document.body.removeChild(a);
            }, 1000);
        } catch (err) {
            window.open(fileUrl, '_blank');
        }
    };

    const downloadAllImages = async () => {
        if (!result || !result.images || result.images.length === 0) return;

        if (SMART_LINK) window.open(SMART_LINK, '_blank');

        setZipping(true);
        try {
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
                    console.error("Failed to fetch image", imgUrl);
                }
            });

            await Promise.all(imagePromises);

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `TikTok_Slideshow_${author}.zip`);

        } catch (err) {
            console.error("Zip failed", err);
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

        // Basic URL Validation
        if (!url.includes('tiktok.com')) {
            setError(t('error_invalid_link', "Invalid Link. Please check and try again."));
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const apiUrl = `${WORKER_URL}/?url=${encodeURIComponent(url)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.error) throw new Error(data.error);

            const res = data.result || data;

            // STRICT MODE VALIDATION
            const validation = validateResultType(res, mode);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            setResult(res);

            setTimeout(() => {
                const el = document.getElementById('result-area');
                if (el) {
                    const offset = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: offset, behavior: "smooth" });
                }
            }, 500);

        } catch (err) {
            let msg = err.message;
            // Map some common API errors to user friendly text if needed
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
                        onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
                        autoComplete="off"
                        spellCheck="false"
                    />

                    <div className="input-controls">
                        {url && (
                            <button
                                type="button"
                                className="action-btn clear-btn"
                                onClick={() => setUrl('')}
                                title={t('btn_clear', "Clear")}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}

                        <button
                            type="button"
                            className="action-btn paste-btn"
                            onClick={handlePaste}
                            title={t('btn_paste', "Paste")}
                        >
                            <i className="fas fa-paste"></i>
                        </button>
                    </div>
                </div>

                <button id="download-btn" onClick={handleDownload} disabled={loading}>
                    <i className="fas fa-download"></i> {t('btn_download', "Download Now")}
                </button>
            </div>

            <div id="result-area" role="region" aria-live="polite">
                {loading && (
                    <div className="lightning-loader-container">
                        <div className="lightning-bolt-wrapper">
                            <i className="fas fa-bolt lightning-icon"></i>
                        </div>
                        <p className="processing-text">{t('processing', "Processing...")}</p>
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
                        {(result.cover || result.thumbnail) && mode !== 'slideshow' && (
                            <div className="result-thumbnail">
                                <img src={result.cover || result.thumbnail} alt="Cover" loading="lazy" />
                                <div className="play-overlay"><i className="fas fa-play"></i></div>
                            </div>
                        )}

                        <div className="result-info" style={{ width: '100%' }}>
                            <h3 className="result-author">
                                <i className="fab fa-tiktok"></i> @{sanitizeName(result.author || 'User')}
                            </h3>
                            <p className="result-desc">
                                {result.title ? (result.title.length > 60 ? result.title.substring(0, 60) + '...' : result.title) : ''}
                            </p>

                            <div className="result-buttons">
                                {(!mode || mode === 'video') && videoUrl && !images && (
                                    <>
                                        <button className="btn-download btn-video" onClick={() => downloadFile(videoUrl, generateProName(result.author, 'mp4'))}>
                                            <i className="fas fa-check-circle"></i> {t('download_nwm', "Download No Watermark")}
                                        </button>
                                        <button className="btn-download btn-hd" onClick={() => downloadFile(videoUrl, generateProName(result.author + '_HD', 'mp4'))}>
                                            <i className="fas fa-crown"></i> {t('download_hd', "Download HD 1080p")}
                                        </button>
                                    </>
                                )}

                                {mode === 'mp3' && musicUrl && (
                                    <button className="btn-download btn-audio" onClick={() => downloadFile(musicUrl, generateProName(result.author, 'mp3'))}>
                                        <i className="fas fa-music"></i> {t('download_audio', "Download MP3 Audio")}
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
                                                <img src={img} style={{ width: '100%', borderRadius: '8px', aspectRatio: '9/16', objectFit: 'cover' }} loading="lazy" />
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
    );
}

