import React, { useState } from 'react';
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
        { id: 'engagement', label: "Engagement Calc", icon: "fas fa-calculator" },
        { id: 'money', label: "Money Calc", icon: "fas fa-coins" },
        { id: 'font', label: "Font Generator", icon: "fas fa-font" },
        { id: 'hashtag', label: "Hashtag Gen", icon: "fas fa-hashtag" }
    ];

    return (
        <div className="tools-container">
            <div className="tabs-header">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <i className={tab.icon}></i>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="tab-content">
                <div className="tool-header">
                    <h2>{t[activeTab]?.title || tabs.find(x => x.id === activeTab).label}</h2>
                    <p>{t[activeTab]?.desc || "Free online tool for TikTok users"}</p>
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
                    gap: 15px;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                }
                .tab-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 12px 24px;
                    border-radius: 50px;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }
                .tab-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                }
                .tab-btn.active {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    border-color: transparent;
                    box-shadow: 0 4px 15px rgba(0, 242, 234, 0.3);
                }
                .tool-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .tool-header h2 {
                    font-size: 2rem;
                    margin-bottom: 10px;
                    background: linear-gradient(to right, #fff, #bbb);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .tool-header p {
                    color: var(--text-dim);
                    max-width: 600px;
                    margin: 0 auto;
                }
                
                @media (max-width: 600px) {
                    .tabs-header {
                        gap: 10px;
                    }
                    .tab-btn {
                        padding: 10px 16px;
                        font-size: 0.9rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default ToolsTabs;
