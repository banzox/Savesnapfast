import React, { useState, useRef } from 'react';

const ImageConverter = ({ t = {} }) => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [format, setFormat] = useState('image/webp');
    const [quality, setQuality] = useState(0.92);
    const [converted, setConverted] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.match(/image\//)) {
            processFile(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        setImage(file);
        setPreview(URL.createObjectURL(file));
        setConverted(null);
    };

    const convertImage = async () => {
        if (!image || !preview) return;
        setIsProcessing(true);

        const img = new Image();
        img.src = preview;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            
            // Fill white background for JPEG/BMP/ICO if original had transparency
            if (format === 'image/jpeg' || format === 'image/bmp') {
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
    };

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
                    className="dropzone"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current.click()}
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
                    <p>{t.dropzone?.hint_convert || "Convert seamlessly between WebP, PNG, JPG, BMP, and ICO (100% Free & Private)"}</p>
                    <button type="button" className="btn-browse">
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
                                    <option value="image/png">PNG (Lossless & Transparent)</option>
                                    <option value="image/jpeg">JPEG / JPG (Universal)</option>
                                    <option value="image/bmp">BMP (Windows Bitmap)</option>
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
                                        <i className="fas fa-sync-alt"></i> Convert Now
                                    </>
                                )}
                            </button>

                            <button
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
                                <span>{image?.name}</span>
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
                    padding: 28px;
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
                .dropzone:hover {
                    border-color: var(--secondary);
                    background: rgba(0, 242, 234, 0.04);
                    transform: translateY(-2px);
                }
                [data-theme='light'] .dropzone {
                    border-color: rgba(0, 0, 0, 0.15);
                    background: #f8fafc;
                }
                [data-theme='light'] .dropzone:hover {
                    border-color: var(--primary);
                    background: #eff6ff;
                }
                .dropzone .icon {
                    font-size: 3rem;
                    color: var(--secondary);
                    margin-bottom: 12px;
                }
                [data-theme='light'] .dropzone .icon {
                    color: var(--primary);
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
                    color: var(--text-dim);
                    font-size: 0.88rem;
                    margin: 0 0 16px;
                }
                .btn-browse {
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
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
                    color: var(--text-dim);
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
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    border: none;
                    padding: 13px;
                    border-radius: 12px;
                    color: #fff;
                    font-weight: 700;
                    font-size: 1rem;
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
                    color: var(--text-dim);
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
            `}</style>
        </div>
    );
};

export default ImageConverter;
