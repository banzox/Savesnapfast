import React, { useState, useEffect, useRef } from 'react';
import ImageCompressor from './ImageCompressor';
import ImageConverter from './ImageConverter';
import QRCodeGenerator from './QRCodeGenerator';
import EngagementCalculator from './tiktok/EngagementCalculator';
import MoneyCalculator from './tiktok/MoneyCalculator';
import FontGenerator from './tiktok/FontGenerator';
import HashtagGenerator from './tiktok/HashtagGenerator';

const ToolsTabs = ({ translations }) => {
    const [activeTab, setActiveTab] = useState('compressor');
    const containerRef = useRef(null);

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

    const scrollToWorkspace = () => {
        if (typeof window !== 'undefined') {
            const el = document.getElementById('tools-workspace') || containerRef.current;
            if (el) {
                const yOffset = -80;
                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    };

    // Deep-linking hash support and event listeners
    useEffect(() => {
        const syncTabFromHash = (shouldScroll = false) => {
            if (typeof window !== 'undefined' && window.location.hash) {
                const hash = window.location.hash.replace('#', '').trim().toLowerCase();
                const matched = tabs.find(x => x.id.toLowerCase() === hash);
                if (matched) {
                    setActiveTab(matched.id);
                    if (shouldScroll) {
                        setTimeout(scrollToWorkspace, 50);
                    }
                }
            }
        };

        // Check on initial load
        syncTabFromHash(false);

        // Listen to hashchange
        const onHashChange = () => syncTabFromHash(true);
        window.addEventListener('hashchange', onHashChange);
        window.addEventListener('popstate', onHashChange);

        // Custom event for direct triggering from quick cards
        const onCustomSwitch = (e) => {
            const toolId = e.detail?.toolId;
            if (toolId && tabs.some(x => x.id === toolId)) {
                setActiveTab(toolId);
                if (typeof window !== 'undefined') {
                    window.history.replaceState(null, '', `#${toolId}`);
                }
                setTimeout(scrollToWorkspace, 50);
            }
        };
        window.addEventListener('switch-tool', onCustomSwitch);

        return () => {
            window.removeEventListener('hashchange', onHashChange);
            window.removeEventListener('popstate', onHashChange);
            window.removeEventListener('switch-tool', onCustomSwitch);
        };
    }, []);

    const handleTabChange = (id) => {
        setActiveTab(id);
        if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', `#${id}`);
        }
    };

    const getTabTitle = (id) => {
        if (t[id]?.title) return t[id].title;
        const tab = tabs.find(x => x.id === id);
        return tab ? tab.label : "Tool";
    };

    const getTabDesc = (id) => {
        if (t[id]?.desc) return t[id].desc;
        const defaultDescs = {
            compressor: "Compress JPG, PNG & WebP images up to 80% losslessly with zero quality loss directly in your browser.",
            converter: "Convert images seamlessly between WebP, PNG, JPG, and other popular formats 100% privately.",
            qrcode: "Create high-resolution, custom-colored QR codes for TikTok profiles, videos, links, or text.",
            engagement: "Calculate accurate TikTok engagement rate, viral score, and algorithm distribution analytics.",
            money: "Estimate projected creator revenue based on 2026 Creator Rewards Program (CRP) RPM rates.",
            font: "Convert regular text into aesthetic Unicode fonts and symbols for TikTok bio, captions, and comments.",
            hashtag: "Generate viral trending hashtags and ready-to-use captions across 16 specialized niches."
        };
        return defaultDescs[id] || "Free 100% browser-based tools for creators and web designers.";
    };

    return (
        <div id="tools-workspace" ref={containerRef} className="tools-container">
            <div className="tabs-header">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => handleTabChange(tab.id)}
                        aria-selected={activeTab === tab.id}
                    >
                        <i className={tab.icon}></i>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="tab-content">
                <div className="tool-header">
                    <h2>{getTabTitle(activeTab)}</h2>
                    <p>{getTabDesc(activeTab)}</p>
                </div>

                <div className="active-tool-view">
                    {activeTab === 'compressor' && <ImageCompressor t={t} />}
                    {activeTab === 'converter' && <ImageConverter t={t} />}
                    {activeTab === 'qrcode' && <QRCodeGenerator t={t} />}
                    {activeTab === 'engagement' && <EngagementCalculator t={t} />}
                    {activeTab === 'money' && <MoneyCalculator t={t} />}
                    {activeTab === 'font' && <FontGenerator t={t} />}
                    {activeTab === 'hashtag' && <HashtagGenerator t={t} />}
                </div>
            </div>

            <style>{`
                .tools-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 10px;
                    scroll-margin-top: 90px;
                }
                .tabs-header {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 25px;
                    flex-wrap: wrap;
                }
                .tab-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 11px 18px;
                    border-radius: 50px;
                    color: var(--text-main, #fff);
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.92rem;
                    font-weight: 600;
                    transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
                    user-select: none;
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
                    color: #00f2ea;
                }
                [data-theme='light'] .tab-btn:hover {
                    background: #f8fafc;
                    color: #2563eb;
                }
                .tab-btn.active {
                    background: linear-gradient(135deg, var(--primary, #ff0050) 0%, var(--secondary, #00f2ea) 100%);
                    border-color: transparent;
                    color: #ffffff !important;
                    box-shadow: 0 4px 18px rgba(255, 0, 80, 0.4);
                    transform: translateY(-1px);
                }
                [data-theme='light'] .tab-btn.active {
                    background: linear-gradient(135deg, #2563eb 0%, #0891b2 100%);
                    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.25);
                }
                .tool-header {
                    text-align: center;
                    margin-bottom: 25px;
                }
                .tool-header h2 {
                    font-size: 1.85rem;
                    margin-bottom: 8px;
                    font-weight: 800;
                    color: var(--text-main, #fff);
                }
                [data-theme='light'] .tool-header h2 {
                    color: #0f172a;
                }
                .tool-header p {
                    color: var(--text-dim, #94a3b8);
                    max-width: 650px;
                    margin: 0 auto;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                .active-tool-view {
                    animation: fadeInScale 0.25s ease;
                }
                @keyframes fadeInScale {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @media (max-width: 600px) {
                    .tabs-header {
                        gap: 6px;
                    }
                    .tab-btn {
                        padding: 8px 12px;
                        font-size: 0.82rem;
                        gap: 6px;
                    }
                    .tool-header h2 {
                        font-size: 1.45rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default ToolsTabs;
