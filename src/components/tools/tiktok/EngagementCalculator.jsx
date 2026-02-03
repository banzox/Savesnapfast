import React, { useState } from 'react';

const EngagementCalculator = ({ t }) => {
    const [stats, setStats] = useState({
        followers: '',
        likes: '',
        comments: '',
        shares: ''
    });
    const [rate, setRate] = useState(null);

    const calculate = () => {
        const { followers, likes, comments, shares } = stats;
        const totalInteractions = Number(likes) + Number(comments) + Number(shares);
        const followerCount = Number(followers);

        if (followerCount > 0) {
            const engagementRate = (totalInteractions / followerCount) * 100;
            setRate(engagementRate.toFixed(2));
        }
    };

    const handleChange = (e) => {
        setStats({ ...stats, [e.target.name]: e.target.value });
    };

    return (
        <div className="tool-card">
            <h3>TikTok Engagement Rate Calculator</h3>
            <div className="input-grid">
                <input
                    type="number"
                    name="followers"
                    placeholder="Followers"
                    value={stats.followers}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="likes"
                    placeholder="Likes"
                    value={stats.likes}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="comments"
                    placeholder="Comments"
                    value={stats.comments}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="shares"
                    placeholder="Shares"
                    value={stats.shares}
                    onChange={handleChange}
                />
            </div>
            <button className="btn-primary full-width" onClick={calculate}>
                Calculate Engagement
            </button>

            {rate !== null && (
                <div className="result-box">
                    <h4>Engagement Rate</h4>
                    <div className="rate-value">{rate}%</div>
                    <p className="rate-desc">
                        {rate > 5 ? "Excellent! 🚀" : rate > 3 ? "Good 👍" : "Needs Improvement 📉"}
                    </p>
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
                .input-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin: 20px 0;
                }
                input {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 12px;
                    border-radius: 8px;
                    color: white;
                    width: 100%;
                }
                .btn-primary {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
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
                    background: rgba(255, 255, 255, 0.1);
                    padding: 20px;
                    border-radius: 12px;
                }
                .rate-value {
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: var(--secondary);
                }
            `}</style>
        </div>
    );
};

export default EngagementCalculator;
