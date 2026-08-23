import React, { useState, useRef } from 'react';

const ImageCompressor = ({ t = {} }) => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [compressed, setCompressed] = useState(null);
    const [quality, setQuality] = useState(80);
    const [maxWidth, setMaxWidth] = useState(1920);
    const [targetFormat, setTargetFormat] = useState('image/webp');
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.match(/image\/(png|jpeg|webp|jpg)/)) {
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
        setCompressed(null);
    };

    const compressImage = async () => {
        if (!image || !preview) return;
        setIsProcessing(true);

        const img = new Image();
        img.src = preview;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            const maxDimension = parseInt(maxWidth, 10) || 1920;
            if (width > maxDimension) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const compressedUrl = URL.createObjectURL(blob);
                        setCompressed({
                            url: compressedUrl,
                            size: blob.size,
                            width,
                            height,
                            extension: targetFormat.split('/')[1] === 'jpeg' ? 'jpg' : targetFormat.split('/')[1]
                        });
                    }
                    setIsProcessing(false);
                },
                targetFormat,
                quality / 100
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

    const savingsPercent = image && compressed && image.size > compressed.size
        ? Math.round(((image.size - compressed.size) / image.size) * 100)
        : 0;

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
                        accept="image/png, image/jpeg, image/webp"
                        hidden
                    />
                    <div className="icon">
                        <i className="fas fa-cloud-upload-alt"></i>
                    </div>
                    <h3>{t.dropzone?.text || "Drag & drop your image here"}</h3>
                    <p>{t.dropzone?.hint || "Supports JPG, PNG, WebP up to 50MB (100% Client-Side)"}</p>
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
                                    <i className="fas fa-sliders-h"></i> Compression Quality: <strong>{quality}%</strong>
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={quality}
                                    onChange={(e) => setQuality(Number(e.target.value))}
                                />
                                <div className="range-labels">
                                    <span>Max Compression</span>
                                    <span>High Quality</span>
                                </div>
                            </div>

                            <div className="control-group">
                                <label>
                                    <i className="fas fa-expand-arrows-alt"></i> Max Width:
                                </label>
                                <select value={maxWidth} onChange={(e) => setMaxWidth(Number(e.target.value))}>
                                    <option value="3840">4K Ultra HD (3840px)</option>
                                    <option value="1920">Full HD (1920px)</option>
                                    <option value="1280">HD (1280px)</option>
                                    <option value="800">Web Standard (800px)</option>
                                    <option value="400">Thumbnail (400px)</option>
                                </select>
                            </div>

                            <div className="control-group">
                                <label>
                                    <i className="fas fa-file-image"></i> Output Format:
                                </label>
                                <select value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
                                    <option value="image/webp">WebP (Best Compression)</option>
                                    <option value="image/jpeg">JPEG / JPG</option>
                                    <option value="image/png">PNG</option>
                                </select>
                            </div>
                        </div>

                        <div className="actions-row">
                            <button
                                className="btn-compress-action"
                                onClick={compressImage}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Compressing Image...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-compress-arrows-alt"></i> Compress Now
                                    </>
                                )}
                            </button>

                            <button
                                className="btn-reset"
                                onClick={() => {
                                    setImage(null);
                                    setPreview(null);
                                    setCompressed(null);
                                }}
                            >
                                <i className="fas fa-redo"></i> Choose Another
                            </button>
                        </div>
                    </div>

                    <div className="preview-compare-grid">
                        <div className="preview-card original-card">
                            <div className="preview-badge original">Original</div>
                            <div className="img-wrapper">
                                <img src={preview} alt="Original" />
                            </div>
                            <div className="preview-stats">
                                <span>{image?.name}</span>
                                <strong>{formatSize(image?.size)}</strong>
                            </div>
                        </div>

                        {compressed && (
                            <div className="preview-card compressed-card">
                                <div className="preview-badge compressed">
                                    {savingsPercent > 0 ? `-${savingsPercent}% Saved` : 'Optimized'}
                                </div>
                                <div className="img-wrapper">
                                    <img src={compressed.url} alt="Compressed" />
                                </div>
                                <div className="preview-stats">
                                    <span>{compressed.width}x{compressed.height}px</span>
                                    <strong className="success-size">{formatSize(compressed.size)}</strong>
                                </div>
                                <a
                                    href={compressed.url}
                                    download={`optimized_${image?.name?.replace(/\.[^/.]+$/, '')}.${compressed.extension}`}
                                    className="btn-download-compressed"
                                >
                                    <i className="fas fa-download"></i> Download Optimized Image
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
                .range-labels {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.72rem;
                    color: var(--text-dim);
                }
                .actions-row {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .btn-compress-action {
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
                .btn-compress-action:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(255, 0, 80, 0.35);
                }
                .btn-compress-action:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default ImageCompressor;
