import React, { useState } from 'react';

const EngagementCalculator = ({ t = {} }) => {
    const [calcMode, setCalcMode] = useState('views'); // 'views' or 'followers'
    const [baseNumber, setBaseNumber] = useState('50000');
    const [likes, setLikes] = useState('4500');
    const [comments, setComments] = useState('320');
    const [shares, setShares] = useState('680');
    const [saves, setSaves] = useState('850');
    const [results, setResults] = useState(null);

    const calculate = () => {
        const base = Math.max(1, Number(baseNumber) || 0);
        const l = Math.max(0, Number(likes) || 0);
        const c = Math.max(0, Number(comments) || 0);
        const s = Math.max(0, Number(shares) || 0);
        const sv = Math.max(0, Number(saves) || 0);

        const totalInteractions = l + c + s + sv;
        const rate = (totalInteractions / base) * 100;

        const likeRatio = (l / base) * 100;
        const commentRatio = l > 0 ? (c / l) * 100 : 0;
        const shareRatio = (s / base) * 100;
        const saveRatio = (sv / base) * 100;

        let tier = 'Average';
        let tierColor = '#3b82f6';
        let badge = '📊 Average Engagement';
        let advice = 'Good consistency. Adding stronger hooks in the first 2 seconds can push your videos into wider FYP distribution.';

        if (rate >= 12) {
            tier = 'Superstar';
            tierColor = '#ec4899';
            badge = '👑 TikTok Elite / Mega Viral';
            advice = 'Your audience retention and interaction velocity are exceptional! This content pattern has maximum FYP algorithmic push.';
        } else if (rate >= 7) {
            tier = 'Viral';
            tierColor = '#10b981';
            badge = '🚀 High Viral Potential';
            advice = 'Outstanding numbers! The algorithm is actively recommending your content to high-intent viewer clusters.';
        } else if (rate >= 3.5) {
            tier = 'Good';
            tierColor = '#00f2ea';
            badge = '👍 Solid & Healthy';
            advice = 'Above industry baseline (~3%). Encourage more saves and shares by offering actionable takeaways or cheat sheets.';
        } else {
            tier = 'Developing';
            tierColor = '#f59e0b';
            badge = '📈 Developing / Needs Push';
            advice = 'Try asking open-ended questions in the video caption and pinning top comments to trigger reply chains.';
        }

        setResults({
            rate: rate.toFixed(2),
            totalInteractions,
            likeRatio: likeRatio.toFixed(1),
            commentRatio: commentRatio.toFixed(1),
            shareRatio: shareRatio.toFixed(1),
            saveRatio: saveRatio.toFixed(1),
            tier,
            tierColor,
            badge,
            advice
        });
    };

    return (
        <div className="tool-card">
            <div className="calc-header">
                <div className="badge-pill">
                    <i className="fas fa-chart-line"></i> TikTok Algorithm Diagnostics
                </div>
                <h3>TikTok Engagement Rate & Viral Score Calculator</h3>
                <p className="tool-desc">
                    Measure your true content engagement rate incorporating likes, comments, shares, and high-value saves based on views or follower count.
                </p>
            </div>

            <div className="mode-toggle">
                <button
                    className={`btn-mode ${calcMode === 'views' ? 'active' : ''}`}
                    onClick={() => setCalcMode('views')}
                >
                    <i className="fas fa-eye"></i> Views-Based (Recommended)
                </button>
                <button
                    className={`btn-mode ${calcMode === 'followers' ? 'active' : ''}`}
                    onClick={() => setCalcMode('followers')}
                >
                    <i className="fas fa-users"></i> Followers-Based
                </button>
            </div>

            <div className="input-grid">
                <div className="input-field full">
                    <label>
                        <i className={calcMode === 'views' ? 'fas fa-eye' : 'fas fa-users'}></i>
                        Total {calcMode === 'views' ? 'Video Views' : 'Account Followers'}:
                    </label>
                    <input
                        type="number"
                        placeholder="e.g. 50,000"
                        value={baseNumber}
                        onChange={(e) => setBaseNumber(e.target.value)}
                    />
                </div>

                <div className="input-field">
                    <label><i className="fas fa-heart" style={{ color: '#ff0050' }}></i> Total Likes:</label>
                    <input
                        type="number"
                        placeholder="e.g. 4,500"
                        value={likes}
                        onChange={(e) => setLikes(e.target.value)}
                    />
                </div>

                <div className="input-field">
                    <label><i className="fas fa-comment-dots" style={{ color: '#00f2ea' }}></i> Total Comments:</label>
                    <input
                        type="number"
                        placeholder="e.g. 320"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                </div>

                <div className="input-field">
                    <label><i className="fas fa-share" style={{ color: '#10b981' }}></i> Total Shares:</label>
                    <input
                        type="number"
                        placeholder="e.g. 680"
                        value={shares}
                        onChange={(e) => setShares(e.target.value)}
                    />
                </div>

                <div className="input-field">
                    <label><i className="fas fa-bookmark" style={{ color: '#f59e0b' }}></i> Saves / Bookmarks:</label>
                    <input
                        type="number"
                        placeholder="e.g. 850"
                        value={saves}
                        onChange={(e) => setSaves(e.target.value)}
                    />
                </div>
            </div>

            <button className="btn-primary full-width" onClick={calculate}>
                <i className="fas fa-fire"></i> Analyze Engagement Rate
            </button>

            {results && (
                <div className="result-box">
                    <div className="result-score-banner" style={{ borderColor: results.tierColor }}>
                        <div className="score-label">Engagement Rate</div>
                        <div className="score-number" style={{ color: results.tierColor }}>
                            {results.rate}%
                        </div>
                        <div className="score-badge" style={{ background: results.tierColor }}>
                            {results.badge}
                        </div>
                    </div>

                    <div className="metrics-pills-grid">
                        <div className="metric-pill">
                            <span>Like Rate</span>
                            <strong>{results.likeRatio}%</strong>
                        </div>
                        <div className="metric-pill">
                            <span>Share Rate</span>
                            <strong>{results.shareRatio}%</strong>
                        </div>
                        <div className="metric-pill">
                            <span>Save Rate</span>
                            <strong>{results.saveRatio}%</strong>
                        </div>
                        <div className="metric-pill">
                            <span>Total Engagements</span>
                            <strong>{results.totalInteractions.toLocaleString()}</strong>
                        </div>
                    </div>

                    <div className="advice-card">
                        <i className="fas fa-rocket"></i>
                        <p>{results.advice}</p>
                    </div>
                </div>
            )}

            <style>{`
                .tool-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                    padding: 30px 24px;
                    max-width: 850px;
                    margin: 0 auto;
                    backdrop-filter: blur(16px);
                }
                .calc-header {
                    text-align: center;
                    margin-bottom: 22px;
                }
                .badge-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(0, 242, 234, 0.15);
                    border: 1px solid rgba(0, 242, 234, 0.35);
                    color: #00f2ea;
                    padding: 5px 14px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    margin-bottom: 12px;
                }
                [data-theme='light'] .badge-pill {
                    background: rgba(37, 99, 235, 0.1);
                    color: #2563eb;
                    border-color: rgba(37, 99, 235, 0.3);
                }
                .calc-header h3 {
                    font-size: 1.45rem;
                    font-weight: 800;
                    color: var(--text-main, #fff);
                    margin: 0 0 8px;
                }
                [data-theme='light'] .calc-header h3 {
                    color: #0f172a;
                }
                .tool-desc {
                    color: var(--text-dim);
                    font-size: 0.9rem;
                    max-width: 650px;
                    margin: 0 auto;
                    line-height: 1.5;
                }
                .mode-toggle {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 22px;
                }
                .btn-mode {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: var(--text-dim);
                    padding: 10px 18px;
                    border-radius: 12px;
                    font-size: 0.88rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                }
                [data-theme='light'] .btn-mode {
                    background: #f8fafc;
                    border-color: rgba(0, 0, 0, 0.08);
                    color: #475569;
                }
                .btn-mode.active {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    color: #fff;
                    border-color: transparent;
                    box-shadow: 0 4px 15px rgba(255, 0, 80, 0.3);
                }
                [data-theme='light'] .btn-mode.active {
                    background: linear-gradient(135deg, #2563eb, #0891b2);
                }
                .input-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 16px;
                    margin-bottom: 22px;
                }
                .input-field.full {
                    grid-column: 1 / -1;
                }
                .input-field {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .input-field label {
                    font-size: 0.86rem;
                    font-weight: 600;
                    color: var(--text-dim);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .input-field input {
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    padding: 12px 14px;
                    border-radius: 10px;
                    color: var(--text-main, #fff);
                    font-size: 0.98rem;
                    outline: none;
                    transition: border-color 0.2s;
                }
                [data-theme='light'] .input-field input {
                    background: #ffffff;
                    border-color: rgba(0, 0, 0, 0.12);
                    color: #0f172a;
                }
                .input-field input:focus {
                    border-color: var(--secondary);
                }
                .btn-primary {
                    width: 100%;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    border: none;
                    padding: 14px;
                    border-radius: 12px;
                    color: #fff;
                    font-weight: 700;
                    font-size: 1.02rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(255, 0, 80, 0.35);
                }
                .result-box {
                    margin-top: 25px;
                    animation: fadeInScale 0.3s ease;
                }
                .result-score-banner {
                    background: rgba(255, 255, 255, 0.04);
                    border: 2px solid;
                    border-radius: 18px;
                    padding: 24px;
                    text-align: center;
                    margin-bottom: 20px;
                }
                [data-theme='light'] .result-score-banner {
                    background: #ffffff;
                }
                .score-label {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .score-number {
                    font-size: 3.2rem;
                    font-weight: 900;
                    line-height: 1.1;
                    margin: 6px 0;
                }
                .score-badge {
                    display: inline-block;
                    color: #fff;
                    font-size: 0.85rem;
                    font-weight: 700;
                    padding: 4px 14px;
                    border-radius: 20px;
                }
                .metrics-pills-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                    gap: 12px;
                    margin-bottom: 18px;
                }
                .metric-pill {
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    padding: 14px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                [data-theme='light'] .metric-pill {
                    background: #f8fafc;
                    border-color: rgba(0, 0, 0, 0.06);
                }
                .metric-pill span {
                    font-size: 0.78rem;
                    color: var(--text-dim);
                }
                .metric-pill strong {
                    font-size: 1.15rem;
                    color: var(--text-main, #fff);
                }
                [data-theme='light'] .metric-pill strong {
                    color: #0f172a;
                }
                .advice-card {
                    background: rgba(0, 242, 234, 0.08);
                    border: 1px solid rgba(0, 242, 234, 0.25);
                    border-radius: 14px;
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    font-size: 0.88rem;
                    color: var(--text-main, #fff);
                    line-height: 1.5;
                }
                [data-theme='light'] .advice-card {
                    color: #0f172a;
                    background: #eff6ff;
                    border-color: rgba(37, 99, 235, 0.2);
                }
                .advice-card i {
                    color: #00f2ea;
                    font-size: 1.4rem;
                    flex-shrink: 0;
                }
                [data-theme='light'] .advice-card i {
                    color: #2563eb;
                }
                .advice-card p {
                    margin: 0;
                }
            `}</style>
        </div>
    );
};

export default EngagementCalculator;
