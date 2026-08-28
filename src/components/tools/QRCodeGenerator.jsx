import React, { useState, useEffect, useCallback, useRef } from 'react';
import QRCode from 'qrcode';

const QRCodeGenerator = ({ t = {} }) => {
    const [text, setText] = useState('https://www.tiktok.com/@tiktok');
    const [size, setSize] = useState(512);
    const [color, setColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [qrUrl, setQrUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const debounceTimerRef = useRef(null);

    const generateQR = useCallback(async (content = text, targetSize = size, fgColor = color, bg = bgColor) => {
        if (!content || !content.trim()) {
            setQrUrl('');
            return;
        }
        setIsGenerating(true);

        try {
            const dataUrl = await QRCode.toDataURL(content.trim(), {
                width: parseInt(targetSize, 10) || 512,
                margin: 2,
                color: {
                    dark: fgColor || '#000000',
                    light: bg || '#ffffff',
                },
                errorCorrectionLevel: 'H'
            });
            setQrUrl(dataUrl);
        } catch (err) {
            console.error("QR Generation failed", err);
        } finally {
            setIsGenerating(false);
        }
    }, [text, size, color, bgColor]);

    // Initial QR generation on mount
    useEffect(() => {
        generateQR('https://www.tiktok.com/@tiktok', size, color, bgColor);
    }, []);

    // Live generation when text, color, or size changes
    const handleTextChange = (e) => {
        const val = e.target.value;
        setText(val);
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
            generateQR(val, size, color, bgColor);
        }, 300);
    };

    const handleSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setSize(newSize);
        generateQR(text, newSize, color, bgColor);
    };

    const handleColorChange = (e) => {
        const newColor = e.target.value;
        setColor(newColor);
        generateQR(text, size, newColor, bgColor);
    };

    const handleBgColorChange = (e) => {
        const newBg = e.target.value;
        setBgColor(newBg);
        generateQR(text, size, color, newBg);
    };

    const copyQRImage = async () => {
        if (!qrUrl) return;
        try {
            const res = await fetch(qrUrl);
            const blob = await res.blob();
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            // Fallback: copy url string
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="tool-card">
            <div className="controls-grid">
                <div className="input-group full-width">
                    <label>
                        <i className="fas fa-link"></i> {t.qrcode?.input || "Enter Text, Username or TikTok Link:"}
                    </label>
                    <div className="input-with-action">
                        <input
                            type="text"
                            placeholder={t.qrcode?.placeholder || "https://tiktok.com/@username"}
                            value={text}
                            onChange={handleTextChange}
                            onKeyDown={(e) => e.key === 'Enter' && generateQR(text, size, color, bgColor)}
                            autoComplete="off"
                        />
                        {text && (
                            <button
                                type="button"
                                className="btn-input-clear"
                                onClick={() => {
                                    setText('');
                                    setQrUrl('');
                                }}
                                title="Clear input"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                </div>

                <div className="input-group">
                    <label>
                        <i className="fas fa-expand"></i> {t.qrcode?.size || "Resolution (Quality):"}
                    </label>
                    <select value={size} onChange={handleSizeChange}>
                        <option value="256">256 x 256 px (Standard)</option>
                        <option value="512">512 x 512 px (High Def)</option>
                        <option value="1024">1024 x 1024 px (Ultra HD 4K)</option>
                        <option value="2048">2048 x 2048 px (Print Ready)</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>
                        <i className="fas fa-palette"></i> {t.qrcode?.color || "QR Foreground Color:"}
                    </label>
                    <div className="color-picker-wrap">
                        <input
                            type="color"
                            value={color}
                            onChange={handleColorChange}
                            className="color-picker"
                        />
                        <span className="color-hex">{color.toUpperCase()}</span>
                    </div>
                </div>

                <div className="quick-palette-row full-width">
                    <span className="palette-label">Preset Colors:</span>
                    {[
                        { name: "Black", fg: "#000000" },
                        { name: "TikTok Pink", fg: "#ff0050" },
                        { name: "Cyan Teal", fg: "#00f2ea" },
                        { name: "Electric Blue", fg: "#2563eb" },
                        { name: "Emerald", fg: "#10b981" },
                        { name: "Purple", fg: "#8b5cf6" }
                    ].map(p => (
                        <button
                            key={p.fg}
                            type="button"
                            className={`palette-dot ${color === p.fg ? 'active' : ''}`}
                            style={{ background: p.fg }}
                            onClick={() => {
                                setColor(p.fg);
                                generateQR(text, size, p.fg, bgColor);
                            }}
                            title={p.name}
                        ></button>
                    ))}
                </div>

                <button
                    type="button"
                    className="btn-primary full-width"
                    onClick={() => generateQR(text, size, color, bgColor)}
                    disabled={!text.trim() || isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <i className="fas fa-spinner fa-spin"></i> Generating QR...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-qrcode"></i> {t.qrcode?.btn || "Regenerate QR Code"}
                        </>
                    )}
                </button>
            </div>

            {qrUrl && (
                <div className="result-area">
                    <div className="qr-preview-wrapper">
                        <img src={qrUrl} alt="Generated QR Code" />
                    </div>

                    <div className="qr-actions-row">
                        <a
                            href={qrUrl}
                            download={`TikTok_QRCode_${Math.floor(1000 + Math.random() * 9000)}.png`}
                            className="btn-download-qr"
                        >
                            <i className="fas fa-download"></i> {t.btn?.downloadPng || "Download HD PNG"}
                        </a>

                        <button
                            type="button"
                            className={`btn-copy-qr ${copied ? 'copied' : ''}`}
                            onClick={copyQRImage}
                        >
                            {copied ? (
                                <><i className="fas fa-check"></i> Copied!</>
                            ) : (
                                <><i className="fas fa-copy"></i> Copy Image</>
                            )}
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .tool-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                    padding: 26px;
                    width: 100%;
                    max-width: 700px;
                    margin: 0 auto;
                    backdrop-filter: blur(16px);
                }
                .controls-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 18px;
                    margin-bottom: 22px;
                }
                .full-width {
                    grid-column: 1 / -1;
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .input-group label {
                    font-size: 0.86rem;
                    font-weight: 600;
                    color: var(--text-dim, #94a3b8);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .input-with-action {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .input-with-action input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    padding: 12px 42px 12px 14px;
                    border-radius: 12px;
                    color: var(--text-main, #fff);
                    font-size: 0.95rem;
                    outline: none;
                    transition: border-color 0.2s;
                }
                [data-theme='light'] .input-with-action input, [data-theme='light'] select {
                    background: #ffffff;
                    border-color: rgba(0, 0, 0, 0.12);
                    color: #0f172a;
                }
                .input-with-action input:focus, select:focus {
                    border-color: var(--secondary, #00f2ea);
                }
                .btn-input-clear {
                    position: absolute;
                    right: 10px;
                    background: transparent;
                    border: none;
                    color: var(--text-dim, #94a3b8);
                    cursor: pointer;
                    padding: 6px;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-input-clear:hover {
                    color: #ff0050;
                }
                select {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    padding: 12px 14px;
                    border-radius: 12px;
                    color: var(--text-main, #fff);
                    font-size: 0.92rem;
                    outline: none;
                }
                .color-picker-wrap {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    padding: 6px 12px;
                    border-radius: 12px;
                }
                [data-theme='light'] .color-picker-wrap {
                    background: #ffffff;
                    border-color: rgba(0, 0, 0, 0.12);
                }
                .color-picker {
                    width: 36px;
                    height: 36px;
                    border: none;
                    border-radius: 8px;
                    background: transparent;
                    cursor: pointer;
                    padding: 0;
                }
                .color-hex {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--text-dim, #94a3b8);
                }
                .quick-palette-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                .palette-label {
                    font-size: 0.8rem;
                    color: var(--text-dim, #94a3b8);
                    font-weight: 600;
                }
                .palette-dot {
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    border: 2px solid transparent;
                    cursor: pointer;
                    transition: transform 0.2s, border-color 0.2s;
                }
                .palette-dot:hover {
                    transform: scale(1.15);
                }
                .palette-dot.active {
                    border-color: #ffffff;
                    box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
                }
                .btn-primary {
                    background: linear-gradient(135deg, var(--primary, #ff0050) 0%, var(--secondary, #00f2ea) 100%);
                    border: none;
                    padding: 14px;
                    border-radius: 12px;
                    color: white;
                    font-weight: 700;
                    font-size: 0.98rem;
                    cursor: pointer;
                    margin-top: 4px;
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
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 24px;
                    border-radius: 18px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 18px;
                    animation: fadeInScale 0.3s ease;
                }
                [data-theme='light'] .result-area {
                    background: #f8fafc;
                    border-color: rgba(0, 0, 0, 0.06);
                }
                .qr-preview-wrapper {
                    background: #ffffff;
                    padding: 16px;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .qr-preview-wrapper img {
                    width: 220px;
                    height: 220px;
                    object-fit: contain;
                    display: block;
                }
                .qr-actions-row {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                    justify-content: center;
                    width: 100%;
                }
                .btn-download-qr {
                    background: linear-gradient(135deg, #2563eb, #0891b2);
                    color: white;
                    padding: 12px 22px;
                    border-radius: 10px;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 0.92rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .btn-download-qr:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
                }
                .btn-copy-qr {
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    color: var(--text-main, #fff);
                    padding: 12px 20px;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 0.92rem;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                }
                [data-theme='light'] .btn-copy-qr {
                    background: #ffffff;
                    border-color: rgba(0, 0, 0, 0.12);
                    color: #0f172a;
                }
                .btn-copy-qr:hover {
                    background: rgba(255, 255, 255, 0.15);
                    transform: translateY(-2px);
                }
                .btn-copy-qr.copied {
                    background: #10b981 !important;
                    color: #ffffff !important;
                    border-color: transparent;
                }
            `}</style>
        </div>
    );
};

export default QRCodeGenerator;
