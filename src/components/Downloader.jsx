import React, { useState } from 'react';

const WORKER_URL = "https://api.savetik-fast.xyz";
const SMART_LINK = "https://www.effectivegatecpm.com/pjjsq7g4?key=d767025cc7e5239dd2334794b7167308";

export default function Downloader({ messages = {}, mode = 'video' }) {
    
    // دالة الترجمة: تبحث عن الكلمة في ملف اللغة، وإذا لم تجدها تعرض النص الإنجليزي الافتراضي
    const t = (key, defaultText) => {
        // حذف البادئة downloader. إذا كانت موجودة لتتوافق مع مفاتيح ملف الترجمة
        const k = key.replace('downloader.', '');
        return messages[k] || defaultText;
    };

    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    // --- دالة تنظيف وتسمية الملفات ---
    const sanitizeName = (name) => {
        if (!name) return 'User';
        // إبقاء الحروف والأرقام فقط
        return name.replace(/[^\w\s-]/gi, '').replace(/\s+/g, '_').substring(0, 20);
    };

    const generateProName = (author, type, id) => {
        const cleanAuthor = sanitizeName(author);
        const uniqueId = id || Math.floor(1000 + Math.random() * 9000);
        return `TikTok_${cleanAuthor}_${uniqueId}.${type}`;
    };

    // --- دالة التعامل مع اللصق من الحافظة ---
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) setUrl(text);
        } catch (err) {
            console.error('Failed to read clipboard', err);
        }
    };

    // --- دالة التحميل المتقدمة (Blob) ---
    const downloadFile = async (fileUrl, fileName) => {
        // فتح الرابط الإعلاني في نافذة جديدة
        if (SMART_LINK) window.open(SMART_LINK, '_blank');

        try {
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error('Network error');
            
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = fileName;
            document.body.appendChild(a);
            
            a.click();
            
            // تنظيف الذاكرة بعد التحميل
            setTimeout(() => {
                window.URL.revokeObjectURL(blobUrl);
                document.body.removeChild(a);
            }, 1000);

        } catch (err) {
            // التحميل المباشر كخطة بديلة في حال فشل الـ Blob
            console.warn('Fallback to direct download');
            window.open(fileUrl, '_blank');
        }
    };

    // --- دالة جلب البيانات من الـ API ---
    const handleDownload = async () => {
        if (!url) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const apiUrl = `${WORKER_URL}/?url=${encodeURIComponent(url)}`;
            const response = await fetch(apiUrl);
            
            if (!response.ok) throw new Error(`Server Error: ${response.status}`);
            
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            
            const res = data.result || data;
            setResult(res);
            
            // التمرير التلقائي لأسفل لعرض النتيجة
            setTimeout(() => {
                const el = document.getElementById('result-area');
                if (el) {
                    const offset = el.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: offset, behavior: "smooth" });
                }
            }, 100);

        } catch (err) {
            setError(t('error_msg', "Service is busy or link is invalid. Please try again."));
        } finally {
            setLoading(false);
        }
    };

    // --- تعريف المتغيرات الآمنة للعرض ---
    const videoUrl = result?.video || result?.play || result?.url || result?.nowatermark;
    const musicUrl = result?.music || result?.audio;
    // التأكد من أن الصور موجودة وليست مصفوفة فارغة
    const images = result?.images && Array.isArray(result.images) && result.images.length > 0 ? result.images : null;

    // --- تحديد نص الإدخال (Placeholder) حسب الصفحة ---
    const placeholderText = 
        mode === 'mp3' ? t('placeholder_mp3', "Paste TikTok music link...") :
        mode === 'slideshow' ? t('placeholder_slideshow', "Paste slideshow link...") :
        mode === 'story' ? t('placeholder_story', "Paste story link...") :
        t('placeholder_video', "Paste TikTok video link here...");

    return (
        <div className="downloader-container">
            <div className="downloader-box">
                <div className="input-wrapper">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={placeholderText}
                        onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
                        autoComplete="off"
                    />
                    
                    {url && (
                        <button type="button" onClick={() => setUrl('')} className="clear-btn" title="Clear">
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                    
                    <button type="button" onClick={handlePaste} id="paste-btn" title="Paste">
                        <i className="fas fa-paste"></i>
                    </button>
                </div>
                
                <button id="download-btn" onClick={handleDownload}>
                    <i className="fas fa-download"></i> {t('btn_download', "Download Now")}
                </button>
            </div>

            <div id="result-area" role="region" aria-live="polite">
                {/* Loader */}
                {loading && (
                    <div className="lightning-loader">
                        <i className="fas fa-bolt lightning-bolt"></i>
                        <p className="shimmer-text">{t('processing', "Processing...")}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="error-message" style={{ color: '#ff4444', textAlign: 'center', padding: '20px' }}>
                        <p><i className="fas fa-exclamation-circle"></i> {error}</p>
                    </div>
                )}

                {/* Result Card */}
                {result && (
                    <div className="result-card">
                        {/* Thumbnail: يظهر في الفيديو والصوت والستوري، لكن نخفيه في وضع السلايد شو لأنه يعرض شبكة صور */}
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
                                
                                {/* 1. Video Page Buttons */}
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

                                {/* 2. MP3 Page Button */}
                                {mode === 'mp3' && musicUrl && (
                                    <button className="btn-download btn-audio" onClick={() => downloadFile(musicUrl, generateProName(result.author, 'mp3'))}>
                                        <i className="fas fa-music"></i> {t('download_audio', "Download MP3 Audio")}
                                    </button>
                                )}

                                {/* 3. Story Page Button (Detects if story is video or image) */}
                                {mode === 'story' && (
                                    <>
                                        {videoUrl ? (
                                            <button className="btn-download btn-video" onClick={() => downloadFile(videoUrl, generateProName(result.author, 'mp4', 'story'))}>
                                                <i className="fas fa-history"></i> {t('download_story_vid', "Download Story (Video)")}
                                            </button>
                                        ) : (images && images.length > 0) ? (
                                            <button className="btn-download btn-sm" style={{width: '100%'}} onClick={() => downloadFile(images[0], generateProName(result.author, 'jpg', 'story'))}>
                                                <i className="fas fa-image"></i> {t('download_story_img', "Download Story (Image)")}
                                            </button>
                                        ) : null}
                                    </>
                                )}
                            </div>

                            {/* 4. Slideshow Page (Image Grid) */}
                            {(mode === 'slideshow' || (mode === 'video' && images)) && images && (
                                <div className="slideshow-container" style={{marginTop: '15px'}}>
                                    <div className="slideshow-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                                        {images.map((img, index) => (
                                            <div key={index} className="slide-item">
                                                <img src={img} style={{ width: '100%', borderRadius: '8px', aspectRatio: '9/16', objectFit: 'cover' }} loading="lazy" />
                                                <button className="btn-download btn-sm" 
                                                    style={{fontSize: '0.85rem', width: '100%', marginTop: '5px'}}
                                                    onClick={() => downloadFile(img, generateProName(result.author, 'jpg', `slide_${index+1}`))}>
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
