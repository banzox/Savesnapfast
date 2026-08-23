import React, { useState } from 'react';

const hashtagsData = {
    "Viral & FYP Boost": ["#fyp", "#foryou", "#foryoupage", "#viral", "#trending", "#tiktokviral", "#xyzbca", "#explore", "#viralvideo", "#fypage", "#blowthisup", "#goviral"],
    "TikTok Shop & Ecom": ["#tiktokshop", "#tiktokmademebuyit", "#unboxing", "#productreview", "#musthaves", "#amazonfinds", "#shopwithme", "#haul", "#dealfinder", "#smallbusiness"],
    "Gaming & Esports": ["#gaming", "#gamer", "#gametok", "#gameplay", "#fortnite", "#roblox", "#minecraft", "#callofduty", "#pcgaming", "#gamingclips", "#streamer", "#twitch"],
    "Fitness & Gym": ["#fitness", "#gymtok", "#workout", "#gymmotivation", "#fitcheck", "#bodybuilding", "#healthylifestyle", "#gains", "#fitnessjourney", "#legday", "#calisthenics"],
    "AI & Tech Reviews": ["#tech", "#techtok", "#ai", "#artificialintelligence", "#chatgpt", "#futuretech", "#gadgets", "#techhacks", "#innovation", "#software", "#productivity"],
    "Food & Cooking": ["#foodtiktok", "#recipe", "#easyrecipe", "#cooking", "#foodie", "#dinnerideas", "#baking", "#quickrecipes", "#delicious", "#streetfood", "#cheflife"],
    "Beauty & Skincare": ["#beauty", "#skincare", "#makeup", "#makeuptutorial", "#glowup", "#grwm", "#beautytips", "#skincareroutine", "#haircare", "#cosmetics", "#style"],
    "Comedy & Memes": ["#funny", "#comedy", "#memes", "#humor", "#relatable", "#laugh", "#prank", "#joke", "#bloopers", "#funnyvideos", "#funnymoments", "#standup"],
    "Travel & Places": ["#travel", "#traveltiktok", "#wanderlust", "#travelvlog", "#vacation", "#hiddenplaces", "#backpacking", "#roadtrip", "#bucketlist", "#exploretheworld"],
    "Education & Hacks": ["#learnontiktok", "#education", "#tipsandtricks", "#lifehack", "#studentlife", "#science", "#howto", "#knowledge", "#edutok", "#facts", "#didyouknow"],
    "Business & Finance": ["#moneytok", "#entrepreneur", "#business", "#investing", "#crypto", "#sidehustle", "#passiveincome", "#financialfreedom", "#wealth", "#stocks"],
    "Pets & Animals": ["#petsoftiktok", "#dogsoftiktok", "#catsoftiktok", "#cute", "#puppy", "#kitten", "#animalover", "#pets", "#funnyanimals", "#wholesome"],
    "Fashion & Outfits": ["#fashion", "#ootd", "#outfitideas", "#styleinspo", "#streetwear", "#thrifted", "#fashiontiktok", "#vintage", "#fitcheck", "#clothingbrand"],
    "Cars & Automotive": ["#cartok", "#carsoftiktok", "#supercars", "#carlifestyle", "#jdm", "#tuning", "#carreview", "#automotive", "#carspotting", "#drift", "#cars"],
    "Motivation & Mindset": ["#motivation", "#mindset", "#success", "#inspiration", "#discipline", "#selfimprovement", "#hardwork", "#quotes", "#mentalhealth", "#growth"],
    "Music & Dance": ["#dance", "#dancer", "#dancechallenge", "#choreography", "#trendingaudio", "#newsong", "#musician", "#singing", "#dancetutorial", "#beats"]
};

const HashtagGenerator = ({ t = {} }) => {
    const [category, setCategory] = useState('Viral & FYP Boost');
    const [customKeyword, setCustomKeyword] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [copiedMode, setCopiedMode] = useState(null);

    const generateCategoryTags = () => {
        const allTags = hashtagsData[category] || hashtagsData["Viral & FYP Boost"];
        const shuffled = [...allTags].sort(() => 0.5 - Math.random());
        setSelectedTags(shuffled.slice(0, 10));
    };

    const generateCustomTags = () => {
        if (!customKeyword.trim()) return;
        const clean = customKeyword.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!clean) return;

        const generated = [
            `#${clean}`,
            `#${clean}tok`,
            `#${clean}tips`,
            `#${clean}hack`,
            `#${clean}viral`,
            `#${clean}trend`,
            `#${clean}fyp`,
            `#learn${clean}`,
            `#best${clean}`,
            `#${clean}2026`,
            `#fyp`,
            `#viral`
        ];
        setSelectedTags(generated);
    };

    const copyTags = (asCaption = false) => {
        if (selectedTags.length === 0) return;
        const text = asCaption
            ? `Watch till the end! 👀 What do you think about this?\n\nFollow for more daily content 🔥\n\n${selectedTags.join(' ')}`
            : selectedTags.join(' ');

        navigator.clipboard.writeText(text);
        setCopiedMode(asCaption ? 'caption' : 'tags');
        setTimeout(() => setCopiedMode(null), 2000);
    };

    const removeTag = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(t => t !== tagToRemove));
    };

    return (
        <div className="tool-card">
            <div className="calc-header">
                <div className="badge-pill">
                    <i className="fas fa-hashtag"></i> 2026 Viral Trend Engine
                </div>
                <h3>TikTok Hashtag &amp; Caption Generator</h3>
                <p className="tool-desc">
                    Discover high-converting hashtags across 16 specialized niches, or generate tailored keyword bundles to maximize your video's FYP reach.
                </p>
            </div>

            <div className="generator-grid">
                <div className="gen-box">
                    <label><i className="fas fa-layer-group"></i> Browse Trending Niches:</label>
                    <div className="select-row">
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            {Object.keys(hashtagsData).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <button className="btn-gen-cat" onClick={generateCategoryTags}>
                            <i className="fas fa-magic"></i> Generate
                        </button>
                    </div>
                </div>

                <div className="gen-box">
                    <label><i className="fas fa-keyboard"></i> Or Generate by Custom Keyword:</label>
                    <div className="select-row">
                        <input
                            type="text"
                            placeholder="e.g. anime, fitness, sneakers, travel"
                            value={customKeyword}
                            onChange={(e) => setCustomKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && generateCustomTags()}
                        />
                        <button className="btn-gen-custom" onClick={generateCustomTags}>
                            <i className="fas fa-bolt"></i> Generate
                        </button>
                    </div>
                </div>
            </div>

            {selectedTags.length > 0 && (
                <div className="results-wrapper">
                    <div className="tags-header">
                        <span>Generated Hashtags ({selectedTags.length}) • Click any tag to remove</span>
                    </div>

                    <div className="tags-cloud">
                        {selectedTags.map((tag) => (
                            <span
                                key={tag}
                                className="tag-chip"
                                onClick={() => removeTag(tag)}
                                title="Click to remove tag"
                            >
                                {tag} <i className="fas fa-times"></i>
                            </span>
                        ))}
                    </div>

                    <div className="action-buttons-group">
                        <button
                            className={`btn-copy-action ${copiedMode === 'tags' ? 'copied' : ''}`}
                            onClick={() => copyTags(false)}
                        >
                            {copiedMode === 'tags' ? (
                                <><i className="fas fa-check"></i> Copied Hashtags!</>
                            ) : (
                                <><i className="fas fa-copy"></i> Copy Hashtags Only</>
                            )}
                        </button>

                        <button
                            className={`btn-copy-caption ${copiedMode === 'caption' ? 'copied' : ''}`}
                            onClick={() => copyTags(true)}
                        >
                            {copiedMode === 'caption' ? (
                                <><i className="fas fa-check"></i> Copied Caption Template!</>
                            ) : (
                                <><i className="fas fa-file-alt"></i> Copy as Complete TikTok Caption</>
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
                    padding: 30px 24px;
                    max-width: 850px;
                    margin: 0 auto;
                    backdrop-filter: blur(16px);
                }
                .calc-header {
                    text-align: center;
                    margin-bottom: 24px;
                }
                .badge-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(255, 0, 80, 0.15);
                    border: 1px solid rgba(255, 0, 80, 0.35);
                    color: #ff0050;
                    padding: 5px 14px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    margin-bottom: 12px;
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
                .generator-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 18px;
                    margin-bottom: 24px;
                }
                .gen-box {
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 18px;
                    border-radius: 14px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                [data-theme='light'] .gen-box {
                    background: #f8fafc;
                    border-color: rgba(0, 0, 0, 0.06);
                }
                .gen-box label {
                    font-size: 0.86rem;
                    font-weight: 600;
                    color: var(--text-dim);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .select-row {
                    display: flex;
                    gap: 10px;
                }
                .select-row select, .select-row input {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    padding: 11px 14px;
                    border-radius: 10px;
                    color: var(--text-main, #fff);
                    font-size: 0.92rem;
                    outline: none;
                }
                [data-theme='light'] .select-row select, [data-theme='light'] .select-row input {
                    background: #ffffff;
                    border-color: rgba(0, 0, 0, 0.12);
                    color: #0f172a;
                }
                .btn-gen-cat {
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    border: none;
                    color: #fff;
                    padding: 10px 18px;
                    border-radius: 10px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    white-space: nowrap;
                    transition: transform 0.2s;
                }
                .btn-gen-custom {
                    background: linear-gradient(135deg, #3b82f6, #0891b2);
                    border: none;
                    color: #fff;
                    padding: 10px 18px;
                    border-radius: 10px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    white-space: nowrap;
                    transition: transform 0.2s;
                }
                .btn-gen-cat:hover, .btn-gen-custom:hover {
                    transform: scale(1.03);
                }
                .results-wrapper {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 20px;
                    animation: fadeInScale 0.3s ease;
                }
                [data-theme='light'] .results-wrapper {
                    background: #ffffff;
                    border-color: rgba(0, 0, 0, 0.08);
                }
                .tags-header {
                    font-size: 0.84rem;
                    color: var(--text-dim);
                    margin-bottom: 14px;
                }
                .tags-cloud {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                .tag-chip {
                    background: rgba(0, 242, 234, 0.1);
                    border: 1px solid rgba(0, 242, 234, 0.25);
                    color: #00f2ea;
                    padding: 7px 14px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                }
                [data-theme='light'] .tag-chip {
                    background: rgba(37, 99, 235, 0.08);
                    border-color: rgba(37, 99, 235, 0.2);
                    color: #2563eb;
                }
                .tag-chip:hover {
                    background: rgba(239, 68, 68, 0.2);
                    border-color: #ef4444;
                    color: #f87171;
                    transform: scale(0.96);
                }
                .tag-chip i {
                    font-size: 0.75rem;
                    opacity: 0.6;
                }
                .action-buttons-group {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .btn-copy-action {
                    flex: 1;
                    min-width: 180px;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    border: none;
                    padding: 13px 20px;
                    border-radius: 12px;
                    color: #fff;
                    font-weight: 700;
                    font-size: 0.95rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.2s;
                }
                .btn-copy-caption {
                    flex: 1;
                    min-width: 180px;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    border: none;
                    padding: 13px 20px;
                    border-radius: 12px;
                    color: #fff;
                    font-weight: 700;
                    font-size: 0.95rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.2s;
                }
                .btn-copy-action:hover, .btn-copy-caption:hover {
                    transform: translateY(-2px);
                }
                .btn-copy-action.copied, .btn-copy-caption.copied {
                    background: #10b981 !important;
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
                }
            `}</style>
        </div>
    );
};

export default HashtagGenerator;
