import React, { useState } from 'react';

const MoneyCalculator = ({ t }) => {
    const [views, setViews] = useState('');
    const [earnings, setEarnings] = useState(null);

    const calculateEarnings = () => {
        const viewCount = Number(views);
        if (viewCount > 0) {
            // Estimated RPM $0.02 - $0.04 per 1000 views
            const min = (viewCount / 1000) * 0.02;
            const max = (viewCount / 1000) * 0.04;
            setEarnings({ min: min.toFixed(2), max: max.toFixed(2) });
        }
    };

    return (
        <div className="tool-card">
            <h3>TikTok Money Calculator</h3>
            <p className="tool-desc">Estimate earnings based on Creator Fund rates ($0.02 - $0.04 RPM)</p>

            <div className="input-group">
                <input
                    type="number"
                    placeholder="Enter Video Views"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                />
            </div>

            <button className="btn-primary full-width" onClick={calculateEarnings}>
                Estimate Earnings
            </button>

            {earnings && (
                <div className="result-box">
                    <h4>Estimated Earnings</h4>
                    <div className="earnings-value">${earnings.min} - ${earnings.max}</div>
                </div>
            )}

            <style>{`
                .tool-card {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 25px;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    text-align: center;
                }
                .tool-desc {
                    color: rgba(255,255,255,0.6);
                    font-size: 0.9rem;
                    margin-bottom: 20px;
                }
                .input-group {
                    margin-bottom: 20px;
                }
                input {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 15px;
                    border-radius: 8px;
                    color: white;
                    width: 100%;
                    font-size: 1.1rem;
                    text-align: center;
                }
                .btn-primary {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    border: none;
                    padding: 12px;
                    border-radius: 8px;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    width: 100%;
                }
                .result-box {
                    margin-top: 20px;
                    background: rgba(16, 185, 129, 0.15);
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid rgba(16, 185, 129, 0.3);
                }
                .earnings-value {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #10b981;
                }
            `}</style>
        </div>
    );
};

export default MoneyCalculator;
