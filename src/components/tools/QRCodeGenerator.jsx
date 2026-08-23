import React, { useState } from 'react';
import QRCode from 'qrcode';

const QRCodeGenerator = ({ t = {} }) => {
    const [text, setText] = useState('');
    const [size, setSize] = useState(256);
    const [color, setColor] = useState('#000000');
    const [qrUrl, setQrUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const generateQR = async () => {
        if (!text.trim()) return;
        setIsGenerating(true);

        try {
            const dataUrl = await QRCode.toDataURL(text.trim(), {
                width: parseInt(size, 10),
                margin: 2,
                color: {
                    dark: color,
                    light: '#ffffff',
                },
            });
            setQrUrl(dataUrl);
        } catch (err) {
            console.error("QR Generation failed", err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="tool-card">
            <div className="controls-grid">
                <div className="input-group full-width">
                    <label>{t.qrcode?.input || "Text or TikTok URL"}</label>
                    <input
                        type="text"
                        placeholder={t.qrcode?.placeholder || "https://tiktok.com/@username"}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && generateQR()}
                    />
                </div>

                <div className="input-group">
                    <label>{t.qrcode?.size || "Resolution (Size)"}</label>
                    <select value={size} onChange={(e) => setSize(e.target.value)}>
                        <option value="200">200 x 200 px</option>
                        <option value="256">256 x 256 px</option>
                        <option value="512">512 x 512 px (HD)</option>
                        <option value="1024">1024 x 1024 px (Ultra HD)</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>{t.qrcode?.color || "QR Color"}</label>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="color-picker"
                    />
                </div>

                <button
                    className="btn-primary full-width"
                    onClick={generateQR}
                    disabled={!text.trim() || isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <i className="fas fa-spinner fa-spin"></i> Generating QR...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-qrcode"></i> {t.qrcode?.btn || "Generate QR Code"}
                        </>
                    )}
                </button>
            </div>

            {qrUrl && (
                <div className="result-area">
                    <div className="qr-preview">
                        <img src={qrUrl} alt="Generated QR Code" width={size > 250 ? 250 : size} height={size > 250 ? 250 : size} />
                    </div>
                    <a
                        href={qrUrl}
                        download="tiktok-qr-code.png"
                        className="btn-download"
                    >
                        <i className="fas fa-download"></i> {t.btn?.downloadPng || "Download High-Res PNG"}
                    </a>
                </div>
            )}

            <style>{`
                .tool-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                    padding: 30px;
                    width: 100%;
                    max-width: 650px;
                    margin: 0 auto;
                    backdrop-filter: blur(16px);
                }
                .controls-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 25px;
                }
                .full-width {
                    grid-column: span 2;
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .input-group label {
                    font-size: 0.88rem;
                    font-weight: 600;
                    color: var(--text-dim);
                }
                .input-group input[type="text"], .input-group select {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    padding: 12px 16px;
                    border-radius: 10px;
                    color: var(--text-main, #fff);
                    font-size: 0.95rem;
                    outline: none;
                    transition: border-color 0.3s;
                }
                .input-group input[type="text"]:focus, .input-group select:focus {
                    border-color: var(--secondary);
                }
                .color-picker {
                    width: 100%;
                    height: 48px;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 10px;
                    background: transparent;
                    cursor: pointer;
                    padding: 4px;
                }
                .btn-primary {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    border: none;
                    padding: 15px;
                    border-radius: 12px;
                    color: white;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    margin-top: 10px;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(255, 0, 80, 0.35);
                }
                .btn-primary:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .result-area {
                    background: rgba(255, 255, 255, 0.96);
                    padding: 30px;
                    border-radius: 16px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    animation: fadeInScale 0.3s ease;
                }
                .qr-preview img {
                    max-width: 220px;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }
                .btn-download {
                    background: linear-gradient(135deg, #2563eb, #0891b2);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 10px;
                    text-decoration: none;
                    font-weight: 700;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: transform 0.2s ease;
                }
                .btn-download:hover {
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
};

export default QRCodeGenerator;
