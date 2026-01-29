import React, { useState } from 'react';

const WORKER_URL = "https://api.savetik-fast.xyz";
const SMART_LINK = "https://www.effectivegatecpm.com/pjjsq7g4?key=d767025cc7e5239dd2334794b7167308";

export default function Downloader({ messages = {}, mode = 'video' }) {
    // Simplified translation helper for the component
    const t = (key) => {
        const k = key.replace('downloader.', '');
        return messages[k] || key;
    };
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const sanitizeFileName = (name) => {
        if (!name) return 'TikTok';
        return name.replace(/[^\w\s-]/gi, '').replace(/\s+/g, '_').replace(/^_|_$/g, '').substring(0, 30) || 'TikTok';
    };

    const generateViralFileName = (author, ext = 'mp4') => {
        const cleanName = sanitizeFileName(author);
        const randomId = Math.random().toString(36).substring(2, 8);
        return `SaveTikFast_${cleanName}_${randomId}.${ext} `;
    };

    const downloadFile = async (fileUrl, fileName) => {
        if (SMART_LINK) window.open(SMART_LINK, '_blank');

        try {
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error('Network response was not ok');
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
            console.warn('Blob download failed, fallback to direct link', err);
            const a = document.createElement('a');
            a.href = fileUrl;
            a.download = fileName;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => document.body.removeChild(a), 1000);
        }
    };

    const handleDownload = async () => {
        if (!url) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const apiUrl = `${WORKER_URL}/?url=${encodeURIComponent(url)}`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const data = await response.json();

            if (data.error) throw new Error(data.error);
            const res = data.result || data;
            setResult(res);

            // Auto-scroll logic could go here or in useEffect
            setTimeout(() => {
                const resultElement = document.getElementById('result-area');
                if (resultElement) {
                    const headerOffset = 100;
                    const elementPosition = resultElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
            }, 100);

        } catch (err) {
            console.error(err);
            setError(err.message || "Service is busy. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                setUrl(text);
                if (text.includes('tiktok.com')) {
                    // Small delay to ensure state update or just pass text if we refactored
                    // For now, let's just fill it. Auto-download might be annoying if accidental.
                    // But user asked for "improve tool". Let's stick to auto-fill for safety, 
                    // or maybe focus the button. 
                    // Let's Just fill it. UX standard is usually fill. 
                }
            }
        } catch (err) {
            // Input focus fallback handled by UI interaction naturally
        }
    };

    return (
        <div className="downloader-container">
            <div className="downloader-box">
                <div className="input-wrapper">
                    <input
                        type="url"
                        id="url-input"
                        placeholder={
                            mode === 'mp3' ? (t('mp3_page.placeholder') || "Paste TikTok music link...") :
                                mode === 'slideshow' ? (t('slideshow_page.placeholder') || "Paste slideshow link...") :
                                    mode === 'story' ? (t('story_page.placeholder') || "Paste story link...") :
                                        (t('downloader.placeholder') || "Paste TikTok video link here...")
                        }
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
                        autoComplete="off"
                        spellCheck="false"
                        aria-label="TikTok video URL"
                    />
                    {url && (
                        <button
                            id="clear-btn"
                            type="button"
                            onClick={() => setUrl('')}
                            title="Clear"
                            aria-label="Clear input"
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', marginRight: '5px' }}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                    <button id="paste-btn" type="button" onClick={handlePaste} title="Paste from clipboard" aria-label="Paste link">
                        <i className="fas fa-paste"></i>
                    </button>
                </div>
                <button id="download-btn" onClick={handleDownload} aria-label="Download TikTok video">
                    <i className="fas fa-download"></i> {t('downloader.btn_download') || "Download"}
                </button>
            </div>

            <div id="result-area" role="region" aria-live="polite">
                {loading && (
                    <div className="lightning-loader">
                        <i className="fas fa-bolt lightning-bolt"></i>
                        <p className="shimmer-text">{t('downloader.processing') || "Processing..."}</p>
                    </div>
                )}

                {error && (
                    <div className="error-message" style={{ color: '#ff4444', textAlign: 'center', padding: '20px' }}>
                        <i className="fas fa-exclamation-triangle"></i>
                        <p>{error}</p>
                    </div>
                )}

                {result && (
                    <div className="result-card">
                        {(result.cover || result.thumbnail) && (!result.images || result.images.length === 0) && (
                            <div className="result-thumbnail">
                                <img src={result.cover || result.thumbnail} alt="TikTok Thumbnail" loading="lazy" />
                                <div className="play-overlay"><i className="fas fa-play-circle"></i></div>
                            </div>
                        )}

                        <div className="result-info" style={{ width: '100%' }}>
                            <h3 className="result-author">
                                <i className="fab fa-tiktok"></i> @{sanitizeFileName(result.author || result.authorName)}
                            </h3>
                            {result.title && <p className="result-desc">{result.title.substring(0, 100)}{result.title.length > 100 ? '...' : ''}</p>}

                            <div className="result-buttons">
                                {/* Video Buttons - Only show in 'video' mode or default */}
                                {(!mode || mode === 'video') && !result.images && result.video && (
                                    <>
                                        <button className="btn-download btn-video" onClick={() => downloadFile(result.video, generateViralFileName(result.author || result.authorName, 'mp4'))}>
                                            <i className="fas fa-download"></i> {t('downloader.download_video') || "Download"} <span className="badge">{t('downloader.hd_quality') || "No Watermark"}</span>
                                        </button>
                                        <button className="btn-download btn-hd" onClick={() => downloadFile(result.video, generateViralFileName((result.author || result.authorName) + '_HD', 'mp4'))}>
                                            <i className="fas fa-film"></i> {t('downloader.download_hd') || "Download HD"} <span className="badge badge-hd">1080p</span>
                                        </button>
                                    </>
                                )}

                                {/* MP3 Button - Only show in 'mp3' mode */}
                                {mode === 'mp3' && result.music && (
                                    <button className="btn-download btn-audio" onClick={() => downloadFile(result.music, generateViralFileName(result.author || result.authorName, 'mp3'))}>
                                        <i className="fas fa-music"></i> {t('downloader.download_audio') || "Download MP3"}
                                    </button>
                                )}

                                {/* Story/Slideshow Logic handled below, but if we want to force 'slideshow' mode to ONLY show images, we keep this empty for slideshows */}
                            </div>

                            {/* Slideshow / Story Images */}
                            {(mode === 'story' || mode === 'slideshow' || (!mode && result.images)) && result.images && result.images.length > 0 && (
                                <div className="slideshow-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginTop: '15px' }}>
                                    {result.images.map((img, index) => (
                                        <div className="slide-item" key={index} style={{ position: 'relative' }}>
                                            <img src={img} style={{ width: '100%', borderRadius: '8px', aspectRatio: '9/16', objectFit: 'cover' }} loading="lazy" />
                                            <button className="btn-download btn-sm"
                                                style={{ fontSize: '0.8rem', padding: '5px', marginTop: '5px', width: '100%' }}
                                                onClick={() => downloadFile(img, generateViralFileName(`${result.author || result.authorName}_slide_${index + 1}`, 'jpg'))}>
                                                <i className="fas fa-download"></i> {t('downloader.save') || "Save"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
