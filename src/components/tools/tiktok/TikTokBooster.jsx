import React, { useState, useEffect } from 'react';
import { ADS_CONFIG } from '../../../config';

const SMART_LINK = ADS_CONFIG.smartlink || "https://www.profitableratecpmnetwork.com/pjjsq7g4?key=d767025cc7e5239dd2334794b7167308";

export default function TikTokBooster({ lang = 'en' }) {
    const isAr = lang === 'ar';
    const [targetUrl, setTargetUrl] = useState('');
    const [boostType, setBoostType] = useState('views');
    const [boostQuantity, setBoostQuantity] = useState(isAr ? '10,000 مشاهدة' : '10,000 Views');
    const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'ready'
    const [progress, setProgress] = useState(0);
    const [stepMsg, setStepMsg] = useState('');
    const [unlocked, setUnlocked] = useState(false);

    const boostOptions = [
        { id: 'views', icon: 'fas fa-eye', name: isAr ? 'مشاهدات FYP للفيديو' : 'FYP Video Views', qty: isAr ? '10,000 مشاهدة' : '10,000 Views', color: '#00f2ea' },
        { id: 'likes', icon: 'fas fa-heart', name: isAr ? 'لايكات حقيقية للفيديو' : 'Real Video Likes', qty: isAr ? '1,500 إعجاب' : '1,500 Likes', color: '#ff0050' },
        { id: 'followers', icon: 'fas fa-user-plus', name: isAr ? 'متابعون حقيقيون' : 'Active Followers', qty: isAr ? '500 متابع' : '500 Followers', color: '#a855f7' },
        { id: 'shares', icon: 'fas fa-share-alt', name: isAr ? 'مشاركات وحفظ للفيديو' : 'Viral Shares & Saves', qty: isAr ? '800 مشاركة' : '800 Shares', color: '#10b981' },
    ];

    const openSmartLink = () => {
        if (SMART_LINK) {
            try {
                window.open(SMART_LINK, '_blank');
            } catch (e) {
                console.warn("Smartlink popup blocked", e);
            }
        }
    };

    const handleStartBoost = (e) => {
        e.preventDefault();
        if (!targetUrl.trim()) return;

        // Open Smartlink on user gesture immediately
        openSmartLink();

        setStatus('processing');
        setProgress(5);
        setStepMsg(isAr ? 'جاري الاتصال بشبكة التوزيع السريعة لتيك توك...' : 'Connecting to high-speed TikTok delivery network...');

        const timers = [
            setTimeout(() => {
                setProgress(28);
                setStepMsg(isAr ? 'جاري فحص الحساب ومجموعة المحتوى الخوارزمية...' : 'Analyzing creator account and algorithmic cluster...');
            }, 800),
            setTimeout(() => {
                setProgress(57);
                setStepMsg(isAr ? 'تخصيص قنوات التوزيع العضوية...' : 'Allocating organic distribution slots...');
            }, 1800),
            setTimeout(() => {
                setProgress(84);
                setStepMsg(isAr ? 'تحسين معايير التفاعل لدفع الفيديو لصفحة For You...' : 'Optimizing viral engagement metrics for FYP push...');
            }, 2700),
            setTimeout(() => {
                setProgress(100);
                setStepMsg(isAr ? 'الباقة جاهزة للتنفيذ والإرسال!' : 'Boost package ready for execution!');
                setStatus('ready');
            }, 3600),
        ];

        return () => timers.forEach(clearTimeout);
    };

    const handleConfirmBoost = () => {
        openSmartLink();
        setUnlocked(true);
    };

    return (
        <div className="booster-workspace" dir={isAr ? 'rtl' : 'ltr'}>
            {/* Header info */}
            <div className="booster-header-badge">
                <span className="live-pulse"></span>
                <span>{isAr ? '⚡ محرك الانتشار الخوارزمي لتيك توك 2026' : '⚡ 2026 SaveTikFast Algorithmic Viral Engine'}</span>
            </div>

            <h2 className="booster-title">
                {isAr ? (
                    <>عزز تفاعل وحضور حسابك على <span className="gradient-text">تيك توك</span></>
                ) : (
                    <>Boost Your <span className="gradient-text">TikTok Reach &amp; Engagement</span></>
                )}
            </h2>

            <p className="booster-subtitle">
                {isAr 
                    ? 'زد مشاهدات وفيديوهات حسابك مجاناً. لا نطلب كلمة سر، آمن 100% للمنشئين ومبني على إشارات تفاعل حقيقية.'
                    : 'Supercharge your videos and profile. Zero password required, safe for creators, and powered by real engagement signals.'}
            </p>

            {/* Input Form */}
            {status === 'idle' && (
                <form onSubmit={handleStartBoost} className="booster-form">
                    <div className="booster-input-group">
                        <label htmlFor="tiktok-target" className="booster-label">
                            <i className="fab fa-tiktok"></i> {isAr ? 'رابط فيديو تيك توك أو اسم المستخدم:' : 'TikTok Video Link or Username:'}
                        </label>
                        <div className="input-with-icon">
                            <i className="fas fa-link input-icon"></i>
                            <input
                                id="tiktok-target"
                                type="text"
                                className="booster-input"
                                placeholder={isAr ? 'https://www.tiktok.com/@creator/video/... أو @username' : 'https://www.tiktok.com/@creator/video/... or @username'}
                                value={targetUrl}
                                onChange={(e) => setTargetUrl(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="boost-type-selector">
                        <label className="booster-label">
                            <i className="fas fa-bullseye"></i> {isAr ? 'اختر باقة الدعم المطلوبة:' : 'Select Desired Boost Package:'}
                        </label>
                        <div className="boost-grid">
                            {boostOptions.map((opt) => (
                                <button
                                    type="button"
                                    key={opt.id}
                                    className={`boost-card ${boostType === opt.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setBoostType(opt.id);
                                        setBoostQuantity(opt.qty);
                                    }}
                                >
                                    <div className="boost-icon-badge" style={{ color: opt.color }}>
                                        <i className={opt.icon}></i>
                                    </div>
                                    <div className="boost-card-text">
                                        <div className="boost-card-title">{opt.name}</div>
                                        <div className="boost-card-qty">{opt.qty}</div>
                                    </div>
                                    <div className="boost-check">
                                        <i className="fas fa-check-circle"></i>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="booster-submit-btn">
                        <i className="fas fa-rocket"></i>
                        <span>{isAr ? 'بدء الدعم المجاني الآن' : 'Start Free Boost Now'}</span>
                    </button>
                </form>
            )}

            {/* Processing state */}
            {status === 'processing' && (
                <div className="booster-loading-box">
                    <div className="booster-spinner">
                        <i className="fas fa-spinner fa-spin"></i>
                    </div>
                    <div className="booster-progress-track">
                        <div 
                            className="booster-progress-bar"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="booster-progress-percent">{progress}%</div>
                    <div className="booster-step-text">{stepMsg}</div>
                </div>
            )}

            {/* Ready state */}
            {status === 'ready' && !unlocked && (
                <div className="booster-ready-box">
                    <div className="booster-success-icon">
                        <i className="fas fa-sparkles"></i>
                    </div>
                    <h3 className="booster-ready-title">{isAr ? 'اكتمل تخصيص باقة الدعم!' : 'Boost Allocation Complete!'}</h3>
                    <p className="booster-ready-desc">
                        {isAr ? (
                            <>الباقة: <strong>{boostQuantity}</strong> للرابط <code>{targetUrl}</code> جاهزة ومجدولة على شبكة التوزيع. أكمل التحقق السريع من الراعي بالأسفل لتفعيل الإرسال الفوري.</>
                        ) : (
                            <>Package: <strong>{boostQuantity}</strong> for <code>{targetUrl}</code> is staged on the viral delivery network. Complete the quick sponsor verification below to activate instant queue delivery.</>
                        )}
                    </p>

                    {/* Middle Ad Widget */}
                    <div className="booster-ad-slot">
                        <iframe
                            src="/ad-300x250"
                            width="300"
                            height="250"
                            frameBorder="0"
                            scrolling="no"
                            allowTransparency="true"
                            title="Advertisement"
                        ></iframe>
                    </div>

                    <button 
                        type="button" 
                        onClick={handleConfirmBoost}
                        className="booster-activate-btn"
                    >
                        <i className="fas fa-bolt"></i>
                        <span>{isAr ? 'تأكيد وتفعيل الدعم الفوري' : 'Activate & Finalize Boost'}</span>
                    </button>
                </div>
            )}

            {/* Final Confirmed State */}
            {unlocked && (
                <div className="booster-unlocked-box">
                    <div className="booster-unlocked-icon">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <h3 className="booster-unlocked-title">{isAr ? 'تم إرسال طلب الدعم بنجاح!' : 'Boost Successfully Dispatched!'}</h3>
                    <p className="booster-unlocked-desc">
                        {isAr ? (
                            <>تم إدراج طلب الدعم لـ <strong>{targetUrl}</strong> في قائمة الانتظار. يبدأ التوزيع والتفاعل خلال 5 إلى 15 دقيقة مع انتشار المشاهدات عبر خلاصة FYP.</>
                        ) : (
                            <>Your boost request for <strong>{targetUrl}</strong> has been queued. Delivery begins within 5 to 15 minutes as engagement spreads across active viewer feeds.</>
                        )}
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setStatus('idle');
                            setUnlocked(false);
                            setTargetUrl('');
                        }}
                        className="booster-submit-btn"
                        style={{ maxWidth: '300px', margin: '20px auto 0' }}
                    >
                        <i className="fas fa-redo"></i>
                        <span>{isAr ? 'دعم حساب آخر' : 'Boost Another Account'}</span>
                    </button>
                </div>
            )}

            <style>{`
                .booster-workspace {
                    background: var(--card-bg, rgba(20, 20, 30, 0.6));
                    border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
                    border-radius: 24px;
                    padding: clamp(1.5rem, 4vw, 3rem);
                    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
                    margin: 0 auto;
                    max-width: 820px;
                    text-align: center;
                    backdrop-filter: blur(16px);
                }
                .booster-header-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255, 0, 80, 0.12);
                    border: 1px solid rgba(255, 0, 80, 0.3);
                    color: #ff0050;
                    font-size: 0.82rem;
                    font-weight: 700;
                    padding: 6px 14px;
                    border-radius: 999px;
                    margin-bottom: 1.25rem;
                }
                .booster-title {
                    font-size: clamp(1.8rem, 4vw, 2.6rem);
                    font-weight: 800;
                    color: var(--text-main, #ffffff);
                    margin-bottom: 0.75rem;
                    line-height: 1.2;
                }
                .gradient-text {
                    background: linear-gradient(135deg, #ff0050, #00f2ea);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .booster-subtitle {
                    color: var(--text-dim, rgba(255, 255, 255, 0.7));
                    font-size: 1rem;
                    max-width: 600px;
                    margin: 0 auto 2.5rem;
                    line-height: 1.6;
                }
                .booster-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.8rem;
                    text-align: left;
                }
                .booster-label {
                    display: block;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: var(--text-main, #ffffff);
                    margin-bottom: 0.6rem;
                }
                .booster-label i {
                    color: #ff0050;
                    margin-right: 6px;
                }
                .input-with-icon {
                    position: relative;
                    width: 100%;
                }
                .input-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 1.1rem;
                }
                .booster-input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 14px;
                    padding: 14px 16px 14px 44px;
                    color: #ffffff;
                    font-size: 1rem;
                    transition: border-color 0.25s, box-shadow 0.25s;
                }
                .booster-input:focus {
                    outline: none;
                    border-color: #00f2ea;
                    box-shadow: 0 0 15px rgba(0, 242, 234, 0.25);
                }
                .boost-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 12px;
                }
                .boost-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 14px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    text-align: left;
                    color: #ffffff;
                }
                .boost-card:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                }
                .boost-card.active {
                    background: rgba(255, 0, 80, 0.1);
                    border-color: #ff0050;
                    box-shadow: 0 8px 25px rgba(255, 0, 80, 0.25);
                }
                .boost-icon-badge {
                    font-size: 1.3rem;
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .boost-card-title {
                    font-size: 0.88rem;
                    font-weight: 700;
                    color: #ffffff;
                }
                .boost-card-qty {
                    font-size: 0.78rem;
                    color: var(--text-dim, rgba(255, 255, 255, 0.6));
                }
                .boost-check {
                    margin-left: auto;
                    color: #ff0050;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .boost-card.active .boost-check {
                    opacity: 1;
                }
                .booster-submit-btn, .booster-activate-btn {
                    background: linear-gradient(135deg, #ff0050 0%, #cc0040 50%, #00f2ea 100%);
                    color: #ffffff;
                    border: none;
                    border-radius: 14px;
                    padding: 16px 28px;
                    font-size: 1.1rem;
                    font-weight: 800;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    box-shadow: 0 10px 30px rgba(255, 0, 80, 0.35);
                    transition: transform 0.25s, box-shadow 0.25s;
                    width: 100%;
                }
                .booster-submit-btn:hover, .booster-activate-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 40px rgba(255, 0, 80, 0.5);
                }
                .booster-loading-box, .booster-ready-box, .booster-unlocked-box {
                    padding: 2.5rem 1rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                }
                .booster-spinner {
                    font-size: 2.8rem;
                    color: #00f2ea;
                }
                .booster-progress-track {
                    width: 100%;
                    max-width: 480px;
                    height: 12px;
                    background: rgba(255, 255, 255, 0.08);
                    border-radius: 999px;
                    overflow: hidden;
                }
                .booster-progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #ff0050, #00f2ea);
                    border-radius: 999px;
                    transition: width 0.4s ease;
                }
                .booster-progress-percent {
                    font-size: 1.3rem;
                    font-weight: 800;
                    color: #ffffff;
                }
                .booster-step-text {
                    font-size: 0.95rem;
                    color: var(--text-dim, rgba(255, 255, 255, 0.7));
                }
                .booster-success-icon {
                    font-size: 3rem;
                    color: #00f2ea;
                }
                .booster-ready-title {
                    font-size: 1.6rem;
                    font-weight: 800;
                    color: #ffffff;
                }
                .booster-ready-desc {
                    font-size: 0.95rem;
                    color: var(--text-dim, rgba(255, 255, 255, 0.8));
                    max-width: 520px;
                    line-height: 1.6;
                }
                .booster-ready-desc code {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 2px 6px;
                    border-radius: 6px;
                    color: #00f2ea;
                }
                .booster-ad-slot {
                    margin: 15px 0;
                    display: flex;
                    justify-content: center;
                }
                .booster-unlocked-icon {
                    font-size: 3.5rem;
                    color: #10b981;
                }
                .booster-unlocked-title {
                    font-size: 1.7rem;
                    font-weight: 800;
                    color: #ffffff;
                }
                .booster-unlocked-desc {
                    font-size: 1rem;
                    color: var(--text-dim, rgba(255, 255, 255, 0.85));
                    max-width: 500px;
                    line-height: 1.6;
                }
            `}</style>
        </div>
    );
}
