import React, { useState, useRef } from 'react';

const ImageCompressor = ({ t }) => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [compressed, setCompressed] = useState(null);
    const [quality, setQuality] = useState(80);
    const [maxWidth, setMaxWidth] = useState(1920);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.match(/image\/(png|jpeg|webp)/)) {
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
        if (!image) return;
        setIsProcessing(true);

        const img = new Image();
        img.src = preview;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
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
                            type: image.type // Keep original type or default to jpeg/webp? Usually jpeg/webp for compression
                        });
                    }
                    setIsProcessing(false);
                },
                image.type === 'image/png' ? 'image/png' : 'image/jpeg', // Canvas toggles
                quality / 100
            );
        };
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="tool-card">
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
                <div className="icon"><i className="fas fa-cloud-upload-alt"></i></div>
                <p>{t.dropzone?.text || "Drag & drop your image here"}</p>
                <span>{t.dropzone?.hint || "or click to browse"}</span>
            </div>

            {preview && (
                <div className="workspace">
                    <div className="controls">
                        <div className="control-group">
                            <label>{t.compressor?.quality || "Quality"}: {quality}%</label>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={quality}
                                onChange={(e) => setQuality(e.target.value)}
                            />
                        </div>
                        <div className="control-group">
                            <label>{t.compressor?.maxWidth || "Max Width"}: {maxWidth}px</label>
                            <input
                                type="number"
                                value={maxWidth}
                                onChange={(e) => setMaxWidth(e.target.value)}
                            />
                        </div>
                        <button
                            className="btn-primary"
                            onClick={compressImage}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (t.progress?.compressing || "Compressing...") : (t.compressor?.btn || "Compress Image")}
                        </button>
                    </div>

                    <div className="preview-compare">
                        <div className="preview-box">
                            <h4>{t.preview?.original || "Original"}</h4>
                            <img src={preview} alt="Original" />
                            <p>{formatSize(image.size)}</p>
                        </div>
                        {compressed && (
                            <div className="preview-box">
                                <h4>{t.preview?.after || "Compressed"}</h4>
                                <img src={compressed.url} alt="Compressed" />
                                <p className="success-text">
                                    {formatSize(compressed.size)}
                                    <span className="badge">
                                        -{Math.round(((image.size - compressed.size) / image.size) * 100)}%
                                    </span>
                                </p>
                                <a
                                    href={compressed.url}
                                    download={`compressed_${image.name}`}
                                    className="btn-download"
                                >
                                    <i className="fas fa-download"></i> {t.btn?.download || "Download"}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .tool-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    padding: 30px;
                    width: 100%;
                }
                .dropzone {
                    border: 2px dashed rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    padding: 40px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .dropzone:hover {
                    border-color: var(--secondary, #00f2ea);
                    background: rgba(255, 255, 255, 0.02);
                }
                .dropzone .icon {
                    font-size: 3rem;
                    color: var(--text-dim);
                    margin-bottom: 15px;
                }
                .workspace {
                    margin-top: 30px;
                }
                .controls {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 20px;
                    border-radius: 12px;
                }
                .control-group {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .preview-compare {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 30px;
                }
                .preview-box {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 15px;
                    border-radius: 12px;
                    text-align: center;
                }
                .preview-box img {
                    max-width: 100%;
                    max-height: 300px;
                    object-fit: contain;
                    border-radius: 8px;
                    margin: 10px 0;
                }
                .btn-primary {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: auto;
                }
                .btn-download {
                    display: inline-block;
                    background: #22c55e;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 6px;
                    text-decoration: none;
                    margin-top: 10px;
                    font-weight: 500;
                }
                .success-text {
                    color: #22c55e;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .badge {
                    background: rgba(34, 197, 94, 0.2);
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 0.8em;
                }
            `}</style>
        </div>
    );
};

export default ImageCompressor;
