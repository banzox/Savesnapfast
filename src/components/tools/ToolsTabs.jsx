import React, { useState, useEffect } from 'react';
import ImageCompressor from './ImageCompressor';
import ImageConverter from './ImageConverter';
import QRCodeGenerator from './QRCodeGenerator';
import EngagementCalculator from './tiktok/EngagementCalculator';
import MoneyCalculator from './tiktok/MoneyCalculator';
import FontGenerator from './tiktok/FontGenerator';
import HashtagGenerator from './tiktok/HashtagGenerator';

const ToolsTabs = ({ translations }) => {
    const [activeTab, setActiveTab] = useState('compressor');

    // Default translations if missing
    const t = translations?.tools || {};

    const tabs = [
        { id: 'compressor', label: t.tabs?.compressor || "Image Compressor", icon: "fas fa-compress-arrows-alt" },
        { id: 'converter', label: t.tabs?.converter || "Image Converter", icon: "fas fa-exchange-alt" },
        { id: 'qrcode', label: t.tabs?.qrcode || "QR Generator", icon: "fas fa-qrcode" },
        { id: 'engagement', label: t.tabs?.engagement || "Engagement Calc", icon: "fas fa-calculator" },
        { id: 'money', label: t.tabs?.money || "Money Calc", icon: "fas fa-coins" },
        { id: 'font', label: t.tabs?.font || "Font Generator", icon: "fas fa-font" },
        { id: 'hashtag', label: t.tabs?.hashtag || "Hashtag Gen", icon: "fas fa-hashtag" }
    ];

    // Deep-linking hash support
    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.hash) {
            const hash = window.location.hash.replace('#', '');
            if (tabs.some(x => x.id === hash)) {
                setActiveTab(hash);
            }
        }
    }, []);

    const handleTabChange = (id) => {
        setActiveTab(id);
        if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', `#${id}`);
        }
    };

    return (
        <div className="tools-container">
            <div className="tabs-header">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => handleTabChange(tab.id)}
                    >
                        <i className={tab.icon}></i>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="tab-content">
                <div className="tool-header">
                    <h2>{t[activeTab]?.title || tabs.find(x => x.id === activeTab)?.label}</h2>
                    <p>{t[activeTab]?.desc || "Free 100% browser-based tools for creators and web designers"}</p>
                </div>

                {activeTab === 'compressor' && <ImageCompressor t={t} />}
                {activeTab === 'converter' && <ImageConverter t={t} />}
                {activeTab === 'qrcode' && <QRCodeGenerator t={t} />}
                {activeTab === 'engagement' && <EngagementCalculator t={t} />}
                {activeTab === 'money' && <MoneyCalculator t={t} />}
                {activeTab === 'font' && <FontGenerator t={t} />}
                {activeTab === 'hashtag' && <HashtagGenerator t={t} />}
            </div>

            <style>{`
                .tools-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .tabs-header {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                }
                .tab-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 12px 20px;
                    border-radius: 50px;
                    color: var(--text-main, #fff);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.95rem;
                    font-weight: 600;
                    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
                [data-theme='light'] .tab-btn {
                    background: #ffffff;
                    border-color: rgba(0, 0, 0, 0.08);
                    color: #475569;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                }
                .tab-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                }
                [data-theme='light'] .tab-btn:hover {
                    background: #f8fafc;
                    color: #0f172a;
                }
                .tab-btn.active {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    border-color: transparent;
                    color: #ffffff !important;
                    box-shadow: 0 4px 15px rgba(255, 0, 80, 0.35);
                }
                [data-theme='light'] .tab-btn.active {
                    background: linear-gradient(135deg, #2563eb 0%, #0891b2 100%);
                    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.25);
                }
                .tool-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .tool-header h2 {
                    font-size: 2rem;
                    margin-bottom: 8px;
                    font-weight: 800;
                    color: var(--text-main, #fff);
                }
                [data-theme='light'] .tool-header h2 {
                    color: #0f172a;
                }
                .tool-header p {
                    color: var(--text-dim);
                    max-width: 600px;
                    margin: 0 auto;
                    font-size: 1rem;
                }
                
                @media (max-width: 600px) {
                    .tabs-header {
                        gap: 8px;
                    }
                    .tab-btn {
                        padding: 10px 14px;
                        font-size: 0.85rem;
                    }
                    .tool-header h2 {
                        font-size: 1.6rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default ToolsTabs;
