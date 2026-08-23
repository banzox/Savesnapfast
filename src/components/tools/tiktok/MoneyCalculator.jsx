import React, { useState } from 'react';

const MoneyCalculator = ({ t = {} }) => {
    const [views, setViews] = useState('100000');
    const [programType, setProgramType] = useState('crp'); // 'crp' (1min+), 'short', 'live', 'affiliate'
    const [region, setRegion] = useState('us'); // 'us' ($0.80-$1.50), 'eu' ($0.40-$0.90), 'global' ($0.15-$0.45)
    const [monthlyVideos, setMonthlyVideos] = useState(15);
    const [results, setResults] = useState(null);

    const calculateEarnings = () => {
        const viewCount = Math.max(0, Number(views) || 0);
        if (viewCount <= 0) return;

        let rpmMin = 0.02;
        let rpmMax = 0.04;

        if (programType === 'crp') {
            // Qualified views usually ~50-70% of total views
            if (region === 'us') {
                rpmMin = 0.70;
                rpmMax = 1.60;
            } else if (region === 'eu') {
                rpmMin = 0.40;
                rpmMax = 0.95;
            } else {
                rpmMin = 0.20;
                rpmMax = 0.50;
            }
        } else if (programType === 'short') {
            rpmMin = 0.02;
            rpmMax = 0.06;
        } else if (programType === 'affiliate') {
            // E-commerce conversion estimate (1-2% click, 3-5% buy, $5-15 commission)
            rpmMin = 1.20;
            rpmMax = 3.80;
        }

        const perVideoMin = (viewCount / 1000) * rpmMin;
        const perVideoMax = (viewCount / 1000) * rpmMax;

        const monthlyMin = perVideoMin * monthlyVideos;
        const monthlyMax = perVideoMax * monthlyVideos;

        const yearlyMin = monthlyMin * 12;
        const yearlyMax = monthlyMax * 12;

        setResults({
            perVideo: { min: perVideoMin.toFixed(2), max: perVideoMax.toFixed(2) },
            monthly: { min: monthlyMin.toFixed(2), max: monthlyMax.toFixed(2) },
            yearly: { min: yearlyMin.toFixed(0), max: yearlyMax.toFixed(0) },
            rpmRange: `$${rpmMin.toFixed(2)} - $${rpmMax.toFixed(2)}`
        });
    };

    return (
        <div className="tool-card">
            <div className="calc-header">
                <div className="badge-pill">
                    <i className="fas fa-coins"></i> 2026 TikTok Creator Economics
                </div>
                <h3>TikTok Money & Creator Rewards Calculator</h3>
                <p className="tool-desc">
                    Accurately estimate your potential TikTok earnings based on the latest Creator Rewards Program, video length, and audience geography.
                </p>
            </div>

            <div className="calc-grid">
                <div className="calc-input-box">
                    <label>
                        <i className="fas fa-eye"></i> Average Views per Video:
                    </label>
                    <input
                        type="number"
                        placeholder="e.g. 100,000"
                        value={views}
                        onChange={(e) => setViews(e.target.value)}
                    />
                    <div className="quick-buttons">
                        {[10000, 50000, 100000, 500000, 1000000].map((v) => (
                            <button
                                key={v}
                                type="button"
                                className="btn-quick-val"
                                onClick={() => setViews(String(v))}
                            >
                                {v >= 1000000 ? `${v / 1000000}M` : `${v / 1000}K`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="calc-input-box">
                    <label>
                        <i className="fas fa-video"></i> Monetization Model:
                    </label>
                    <select value={programType} onChange={(e) => setProgramType(e.target.value)}>
                        <option value="crp">🌟 Creator Rewards Program (Videos &gt; 1 Minute)</option>
                        <option value="short">⚡ Classic Creator Fund (Short Videos &lt; 1 Min)</option>
                        <option value="affiliate">🛍️ TikTok Shop &amp; Affiliate Commission</option>
                    </select>
                </div>

                <div className="calc-input-box">
                    <label>
                        <i className="fas fa-globe-americas"></i> Primary Audience Region:
                    </label>
                    <select value={region} onChange={(e) => setRegion(e.target.value)}>
                        <option value="us">🇺🇸 USA, Canada &amp; Australia (High RPM $0.70 - $1.60)</option>
                        <option value="eu">🇪🇺 UK, Germany, France &amp; GCC (Medium-High RPM $0.40 - $0.95)</option>
                        <option value="global">🌍 Latin America, Asia &amp; Worldwide (Average RPM $0.20 - $0.50)</option>
                    </select>
                </div>

                <div className="calc-input-box">
                    <label>
                        <i className="fas fa-calendar-alt"></i> Videos Posted Per Month: <strong>{monthlyVideos}</strong>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="60"
                        value={monthlyVideos}
                        onChange={(e) => setMonthlyVideos(Number(e.target.value))}
                    />
                </div>
            </div>

            <button className="btn-calculate" onClick={calculateEarnings}>
                <i className="fas fa-calculator"></i> Calculate Potential Revenue
            </button>

            {results && (
                <div className="results-container">
                    <div className="results-headline">
                        <span>Calculated Estimated RPM: <strong>{results.rpmRange}</strong> per 1,000 views</span>
                    </div>

                    <div className="earnings-cards-grid">
                        <div className="earnings-card per-video">
                            <span className="card-period">Per Video</span>
                            <div className="card-amount">${results.perVideo.min} - ${results.perVideo.max}</div>
                            <span className="card-sub">Estimated per post</span>
                        </div>

                        <div className="earnings-card monthly highlight">
                            <span className="card-period">Monthly Estimated Income</span>
                            <div className="card-amount">${results.monthly.min} - ${results.monthly.max}</div>
                            <span className="card-sub">Based on {monthlyVideos} uploads/month</span>
                        </div>

                        <div className="earnings-card yearly">
                            <span className="card-period">Yearly Projected Income</span>
                            <div className="card-amount">${results.yearly.min} - ${results.yearly.max}</div>
                            <span className="card-sub">Annual creator salary potential</span>
                        </div>
                    </div>

                    <div className="tips-box">
                        <i className="fas fa-lightbulb"></i>
                        <p>
                            <strong>Creator Growth Tip:</strong> In 2026, TikTok heavily prioritizes original landscape/horizontal and 1+ minute videos with high completion rates, offering up to <strong>300% higher RPM</strong> compared to short clips.
                        </p>
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
                    margin-bottom: 25px;
                }
                .badge-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(16, 185, 129, 0.15);
                    border: 1px solid rgba(16, 185, 129, 0.35);
                    color: #10b981;
                    padding: 5px 14px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    margin-bottom: 12px;
                }
                .calc-header h3 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--text-main, #fff);
                    margin: 0 0 8px;
                }
                [data-theme='light'] .calc-header h3 {
                    color: #0f172a;
                }
                .tool-desc {
                    color: var(--text-dim);
                    font-size: 0.92rem;
                    max-width: 650px;
                    margin: 0 auto;
                    line-height: 1.5;
                }
                .calc-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 18px;
                    margin-bottom: 25px;
                }
                .calc-input-box {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    padding: 16px;
                    border-radius: 14px;
                }
                [data-theme='light'] .calc-input-box {
                    background: #f8fafc;
                    border-color: rgba(0, 0, 0, 0.06);
                }
                .calc-input-box label {
                    font-size: 0.86rem;
                    font-weight: 600;
                    color: var(--text-dim);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .calc-input-box input[type="number"], .calc-input-box select {
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    padding: 12px 14px;
                    border-radius: 10px;
                    color: var(--text-main, #fff);
                    font-size: 1rem;
                    outline: none;
                    transition: border-color 0.2s;
                }
                [data-theme='light'] .calc-input-box input[type="number"], [data-theme='light'] .calc-input-box select {
                    background: #ffffff;
                    border-color: rgba(0, 0, 0, 0.12);
                    color: #0f172a;
                }
                .calc-input-box input[type="number"]:focus, .calc-input-box select:focus {
                    border-color: #10b981;
                }
                .quick-buttons {
                    display: flex;
                    gap: 6px;
                    flex-wrap: wrap;
                    margin-top: 4px;
                }
                .btn-quick-val {
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    color: var(--text-dim);
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-quick-val:hover {
                    background: #10b981;
                    color: #fff;
                    border-color: transparent;
                }
                .btn-calculate {
                    width: 100%;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    border: none;
                    padding: 15px;
                    border-radius: 12px;
                    color: #fff;
                    font-weight: 700;
                    font-size: 1.05rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
                }
                .btn-calculate:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(16, 185, 129, 0.5);
                }
                .results-container {
                    margin-top: 25px;
                    animation: fadeInScale 0.3s ease;
                }
                .results-headline {
                    text-align: center;
                    margin-bottom: 16px;
                    color: var(--text-dim);
                    font-size: 0.9rem;
                }
                .results-headline strong {
                    color: #10b981;
                }
                .earnings-cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 16px;
                    margin-bottom: 20px;
                }
                .earnings-card {
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 20px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                [data-theme='light'] .earnings-card {
                    background: #ffffff;
                    border-color: rgba(0, 0, 0, 0.08);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
                }
                .earnings-card.highlight {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%);
                    border-color: rgba(16, 185, 129, 0.35);
                    transform: scale(1.03);
                }
                .card-period {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .card-amount {
                    font-size: 1.6rem;
                    font-weight: 900;
                    color: #10b981;
                }
                .card-sub {
                    font-size: 0.76rem;
                    color: var(--text-dim);
                }
                .tips-box {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.25);
                    padding: 14px 18px;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    color: var(--text-main, #fff);
                }
                [data-theme='light'] .tips-box {
                    color: #0f172a;
                }
                .tips-box i {
                    color: #10b981;
                    font-size: 1.2rem;
                    margin-top: 2px;
                }
                .tips-box p {
                    margin: 0;
                    line-height: 1.5;
                }
            `}</style>
        </div>
    );
};

export default MoneyCalculator;
