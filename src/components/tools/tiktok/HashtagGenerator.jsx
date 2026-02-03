import React, { useState } from 'react';

const hashtagsData = {
    "General": ["#tiktok", "#foryou", "#fyp", "#viral", "#love", "#funny", "#memes", "#followme", "#cute", "#fun", "#music", "#happy", "#fashion", "#follow"],
    "Funny": ["#comedy", "#funny", "#memes", "#blooper", "#laugh", "#lol", "#prank", "#humor", "#joke", "#trending"],
    "Dance": ["#dance", "#dancer", "#dancelife", "#choreography", "#tiktokdance", "#dancechallenge", "#music", "#party"],
    "Education": ["#education", "#learning", "#knowledge", "#school", "#student", "#learnontiktok", "#science", "#tips", "#howto"],
    "Fitness": ["#fitness", "#gym", "#workout", "#fit", "#fitnessmotivation", "#motivation", "#bodybuilding", "#health", "#training"],
    "Beauty": ["#beauty", "#makeup", "#skincare", "#fashion", "#beautiful", "#model", "#style", "#makeuptutorial"]
};

const HashtagGenerator = ({ t }) => {
    const [category, setCategory] = useState('General');
    const [selectedTags, setSelectedTags] = useState([]);

    const generate = () => {
        // Randomly select 8-12 tags from the category
        const allTags = hashtagsData[category];
        const shuffled = [...allTags].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);
        setSelectedTags(selected);
    };

    const copyTags = () => {
        navigator.clipboard.writeText(selectedTags.join(' '));
    };

    return (
        <div className="tool-card">
            <h3>TikTok Hashtag Generator</h3>

            <div className="controls">
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {Object.keys(hashtagsData).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <button className="btn-primary" onClick={generate}>Generate</button>
            </div>

            {selectedTags.length > 0 && (
                <div className="results">
                    <div className="tags-box">
                        {selectedTags.map(tag => (
                            <span key={tag} className="tag">{tag}</span>
                        ))}
                    </div>
                    <button className="btn-copy" onClick={copyTags}>
                        <i className="fas fa-copy"></i> Copy All
                    </button>
                </div>
            )}

            <style>{`
                .tool-card {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 25px;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .controls {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 25px;
                }
                select {
                    flex: 1;
                    padding: 12px;
                    border-radius: 8px;
                    background: rgba(0,0,0,0.2);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                }
                .btn-primary {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    border: none;
                    padding: 12px 25px;
                    border-radius: 8px;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                }
                .tags-box {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    background: rgba(0,0,0,0.2);
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 15px;
                }
                .tag {
                    background: rgba(255,255,255,0.1);
                    padding: 5px 12px;
                    border-radius: 20px;
                    color: var(--secondary);
                }
                .btn-copy {
                    width: 100%;
                    padding: 12px;
                    background: #2563eb;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
};

export default HashtagGenerator;
