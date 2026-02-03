import React, { useState, useRef } from 'react';

const ImageConverter = ({ t }) => {
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
        if (!image) return;
        setIsProcessing(true);

        const img = new Image();
        img.src = preview;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const convertedUrl = URL.createObjectURL(blob);
                        setConverted({
                            url: convertedUrl,
                            size: blob.size,
                            format: format.split('/')[1].toUpperCase()
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
                    accept="image/*"
                    hidden
                />
                <div className="icon"><i className="fas fa-exchange-alt"></i></div>
                <p>{t.dropzone?.text || "Drag & drop your image here"}</p>
                <span>{t.dropzone?.hint_convert || "or click to browse"}</span>
            </div>

            {preview && (
                <div className="workspace">
                    <div className="controls">
                        <div className="control-group">
                            <label>{t.converter?.output || "Output Format"}</label>
                            <select value={format} onChange={(e) => setFormat(e.target.value)}>
                                <option value="image/webp">WebP</option>
                                <option value="image/jpeg">JPEG</option>
                                <option value="image/png">PNG</option>
                            </select>
                        </div>
                        {format !== 'image/png' && (
                            <div className="control-group">
                                <label>{t.converter?.quality || "Quality"}: {Math.round(quality * 100)}%</label>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={quality * 100}
                                    onChange={(e) => setQuality(e.target.value / 100)}
                                />
                            </div>
                        )}
                        <button
                            className="btn-primary"
                            onClick={convertImage}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (t.progress?.converting || "Converting...") : (t.converter?.btn || "Convert Image")}
                        </button>
                    </div>

                    <div className="preview-compare">
                        <div className="preview-box">
                            <h4>{t.preview?.original || "Original"}</h4>
                            <p className="meta-info">{image.type.split('/')[1].toUpperCase()} • {formatSize(image.size)}</p>
                            <img src={preview} alt="Original" />
                        </div>
                        {converted && (
                            <div className="preview-box">
                                <h4>{t.preview?.converted || "Converted"}</h4>
                                <p className="meta-info success-text">{converted.format} • {formatSize(converted.size)}</p>
                                <img src={converted.url} alt="Converted" />
                                <a
                                    href={converted.url}
                                    download={`converted_${image.name.split('.')[0]}.${converted.format.toLowerCase()}`}
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
                /* Reuse styles from Compressor or define common styles */
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
                .control-group select, .control-group input {
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    padding: 8px;
                    border-radius: 6px;
                    color: white;
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
                .meta-info {
                    font-size: 0.9em;
                    color: rgba(255,255,255,0.6);
                    margin-bottom: 5px;
                }
                .success-text {
                    color: #22c55e;
                }
            `}</style>
        </div>
    );
};

export default ImageConverter;
