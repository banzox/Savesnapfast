import React, { useState, useRef, useEffect, useCallback } from 'react';

const ImageConverter = ({ t = {} }) => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [format, setFormat] = useState('image/webp');
    const [quality, setQuality] = useState(0.92);
    const [converted, setConverted] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const processFile = (file) => {
        if (!file || !file.type.match(/image\//)) return;
        setImage(file);
        const url = URL.createObjectURL(file);
        setPreview(url);
        setConverted(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const convertImage = useCallback(async () => {
        if (!image || !preview) return;
        setIsProcessing(true);

        try {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                
                // Fill white background for JPEG if original had transparency
                if (format === 'image/jpeg') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, img.width, img.height);
                }

                ctx.drawImage(img, 0, 0);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const convertedUrl = URL.createObjectURL(blob);
                            const ext = format === 'image/jpeg' ? 'jpg' : format.split('/')[1];
                            setConverted({
                                url: convertedUrl,
                                size: blob.size,
                                formatName: ext.toUpperCase(),
                                extension: ext,
                                width: img.width,
                                height: img.height
                            });
                        }
                        setIsProcessing(false);
                    },
                    format,
                    quality
                );
            };

            img.onerror = () => {
                console.error("Failed to load image for conversion");
                setIsProcessing(false);
            };

            img.src = preview;
        } catch (err) {
            console.error("Conversion error:", err);
            setIsProcessing(false);
        }
    }, [image, preview, format, quality]);

    // Auto-convert on select or format change
    useEffect(() => {
        if (preview && image) {
            convertImage();
        }
    }, [preview, format, quality]);

    const formatSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 KB';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <div className="tool-card">
            {!preview ? (
                <div
                    className={`dropzone ${isDragging ? 'dragging' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        hidden
                    />
                    <div className="icon">
                        <i className="fas fa-exchange-alt"></i>
                    </div>
                    <h3>{t.dropzone?.text || "Drag & drop your image to convert"}</h3>
                    <p>{t.dropzone?.hint_convert || "Convert seamlessly between WebP, PNG, and JPG (100% Free & Private)"}</p>
                    <button
                        type="button"
                        className="btn-browse"
                        onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                        }}
                    >
                        <i className="fas fa-folder-open"></i> Browse Image
                    </button>
                </div>
            ) : (
                <div className="workspace">
                    <div className="controls-panel">
                        <div className="control-row">
                            <div className="control-group">
                                <label>
                                    <i className="fas fa-file-export"></i> Target Output Format:
                                </label>
                                <select value={format} onChange={(e) => setFormat(e.target.value)}>
                                    <option value="image/webp">WebP (Next-Gen Web Standard)</option>
                                    <option value="image/png">PNG (Lossless &amp; Transparent)</option>
                                    <option value="image/jpeg">JPEG / JPG (Universal)</option>
                                </select>
                            </div>

                            {format !== 'image/png' && (
                                <div className="control-group">
                                    <label>
                                        <i className="fas fa-sliders-h"></i> Quality: <strong>{Math.round(quality * 100)}%</strong>
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={quality * 100}
                                        onChange={(e) => setQuality(Number(e.target.value) / 100)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="actions-row">
                            <button
                                type="button"
                                className="btn-convert-action"
                                onClick={convertImage}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Converting Image...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-sync-alt"></i> Convert Image
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="btn-reset"
                                onClick={() => {
                                    setImage(null);
                                    setPreview(null);
                                    setConverted(null);
                                }}
                            >
                                <i className="fas fa-redo"></i> Choose Another
                            </button>
                        </div>
                    </div>

                    <div className="preview-compare-grid">
                        <div className="preview-card">
                            <div className="preview-badge original">
                                Original ({image?.type ? image.type.split('/')[1].toUpperCase() : 'IMG'})
                            </div>
                            <div className="img-wrapper">
                                <img src={preview} alt="Original" />
                            </div>
                            <div className="preview-stats">
                                <span className="file-name">{image?.name}</span>
                                <strong>{formatSize(image?.size)}</strong>
                            </div>
                        </div>

                        {converted && (
                            <div className="preview-card converted-card">
                                <div className="preview-badge converted">
                                    Converted ({converted.formatName})
                                </div>
                                <div className="img-wrapper">
                                    <img src={converted.url} alt="Converted" />
                                </div>
                                <div className="preview-stats">
                                    <span>{converted.width}x{converted.height}px</span>
                                    <strong className="success-size">{formatSize(converted.size)}</strong>
                                </div>
                                <a
                                    href={converted.url}
                                    download={`${image?.name?.replace(/\.[^/.]+$/, '')}_converted.${converted.extension}`}
                                    className="btn-download-converted"
                                >
                                    <i className="fas fa-download"></i> Download {converted.formatName} File
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .tool-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                    padding: 26px 20px;
                    width: 100%;
                    max-width: 850px;
                    margin: 0 auto;
                    backdrop-filter: blur(16px);
                }
                .dropzone {
                    border: 2px dashed rgba(255, 255, 255, 0.2);
                    border-radius: 16px;
                    padding: 45px 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: rgba(255, 255, 255, 0.02);
                }
                .dropzone:hover, .dropzone.dragging {
                    border-color: var(--secondary, #00f2ea);
                    background: rgba(0, 242, 234, 0.05);
                    transform: translateY(-2px);
                }
                [data-theme='light'] .dropzone {
                    border-color: rgba(0, 0, 0, 0.15);
                    background: #f8fafc;
                }
                [data-theme='light'] .dropzone:hover {
                    border-color: var(--primary, #2563eb);
                    background: #eff6ff;
                }
                .dropzone .icon {
                    font-size: 3rem;
                    color: var(--secondary, #00f2ea);
                    margin-bottom: 12px;
                }
                [data-theme='light'] .dropzone .icon {
                    color: var(--primary, #2563eb);
                }
                .dropzone h3 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--text-main, #fff);
                    margin: 0 0 6px;
                }
                [data-theme='light'] .dropzone h3 {
                    color: #0f172a;
                }
                .dropzone p {
                    color: var(--text-dim, #94a3b8);
                    font-size: 0.88rem;
                    margin: 0 0 16px;
                }
                .btn-browse {
                    background: linear-gradient(135deg, var(--primary, #ff0050), var(--secondary, #00f2ea));
                    border: none;
                    color: #fff;
                    padding: 10px 22px;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: transform 0.2s;
                }
                .btn-browse:hover {
                    transform: scale(1.04);
                }
                .controls-panel {
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 24px;
                }
                [data-theme='light'] .controls-panel {
                    background: #f8fafc;
                    border-color: rgba(0, 0, 0, 0.08);
                }
                .control-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 16px;
                    margin-bottom: 20px;
                }
                .control-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .control-group label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-dim, #94a3b8);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .control-group select, .control-group input[type="range"] {
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    padding: 10px 14px;
                    border-radius: 10px;
                    color: var(--text-main, #fff);
                    font-size: 0.9rem;
                    outline: none;
                }
                [data-theme='light'] .control-group select {
                    background: #ffffff;
                    border-color: rgba(0, 0, 0, 0.12);
                    color: #0f172a;
                }
                .actions-row {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .btn-convert-action {
                    flex: 2;
                    min-width: 180px;
                    background: linear-gradient(135deg, var(--primary, #ff0050) 0%, var(--secondary, #00f2ea) 100%);
                    border: none;
                    padding: 13px;
                    border-radius: 12px;
                    color: #fff;
                    font-weight: 700;
                    font-size: 0.98rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .btn-convert-action:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(255, 0, 80, 0.35);
                }
                .btn-convert-action:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .btn-reset {
                    flex: 1;
                    min-width: 130px;
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    padding: 13px;
                    border-radius: 12px;
                    color: var(--text-dim, #94a3b8);
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    transition: all 0.2s;
                }
                .btn-reset:hover {
                    color: var(--text-main, #fff);
                    background: rgba(255, 255, 255, 0.1);
                }
                .preview-compare-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 20px;
                }
                .preview-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 16px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                [data-theme='light'] .preview-card {
                    background: #ffffff;
                    border-color: rgba(0, 0, 0, 0.08);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
                }
                .preview-badge {
                    position: absolute;
                    top: 12px;
                    inset-inline-start: 12px;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    z-index: 2;
                }
                .preview-badge.original {
                    background: rgba(0, 0, 0, 0.6);
                    color: #fff;
                }
                .preview-badge.converted {
                    background: #3b82f6;
                    color: #fff;
                    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
                }
                .img-wrapper {
                    width: 100%;
                    height: 200px;
                    border-radius: 10px;
                    overflow: hidden;
                    background: rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .img-wrapper img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }
                .preview-stats {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.85rem;
                }
                .file-name {
                    max-width: 160px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: var(--text-dim, #94a3b8);
                }
                .success-size {
                    color: #3b82f6;
                    font-weight: 700;
                }
                .btn-download-converted {
                    background: linear-gradient(135deg, #3b82f6, #0891b2);
                    color: #fff;
                    padding: 11px;
                    border-radius: 10px;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .btn-download-converted:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
                }
            `}</style>
        </div>
    );
};

export default ImageConverter;
