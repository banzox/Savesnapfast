import React, { useState } from 'react';

const normalChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const fontsList = [
    { name: "Bold Serif", category: "Bold", map: "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳" },
    { name: "Bold Sans", category: "Bold", map: "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇" },
    { name: "Italic Serif", category: "Italic", map: "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧" },
    { name: "Italic Sans", category: "Italic", map: "𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝲡𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻" },
    { name: "Bold Italic Sans", category: "Bold", map: "𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯" },
    { name: "Script / Cursive", category: "Aesthetic", map: "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃" },
    { name: "Handwriting", category: "Aesthetic", map: "𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏" },
    { name: "Gothic / Fraktur", category: "Gothic", map: "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷" },
    { name: "Bold Gothic", category: "Gothic", map: "𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟" },
    { name: "Double Struck (Outline)", category: "Aesthetic", map: "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫" },
    { name: "Typewriter / Monospace", category: "Aesthetic", map: "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣" },
    { name: "Bubble Circles Ⓣ", category: "Decor", map: "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ" },
    { name: "Inverted Bubble 🅣", category: "Decor", map: "🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩" },
    { name: "Square Letters [T]", category: "Decor", map: "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉" },
    { name: "Vaporwave / Wide Ｗｉｄｅ", category: "Aesthetic", map: "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ" },
    { name: "Small Caps ᴛɪᴋᴛᴏᴋ", category: "Aesthetic", map: "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ" }
];

const FontGenerator = ({ t = {} }) => {
    const [text, setText] = useState('TikTok Viral Creator ✨');
    const [filter, setFilter] = useState('All');
    const [copiedIndex, setCopiedIndex] = useState(null);

    const convertText = (input, fontMap) => {
        if (!input) return "";
        const mapArr = Array.from(fontMap);
        return Array.from(input).map(char => {
            const index = normalChars.indexOf(char);
            return (index !== -1 && mapArr[index]) ? mapArr[index] : char;
        }).join('');
    };

    const convertWithDecor = (input, type) => {
        if (!input) return "";
        if (type === 'underline') {
            return Array.from(input).map(c => c + '\u0332').join('');
        }
        if (type === 'strikethrough') {
            return Array.from(input).map(c => c + '\u0336').join('');
        }
        if (type === 'slash') {
            return Array.from(input).map(c => c + '\u0338').join('');
        }
        if (type === 'sparkles') {
            return `✨ ${input} ✨`;
        }
        if (type === 'brackets') {
            return `【 ${input} 】`;
        }
        if (type === 'arrows') {
            return `»»—— ${input} ——««`;
        }
        return input;
    };

    const copyToClipboard = (textToCopy, index) => {
        navigator.clipboard.writeText(textToCopy);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const filteredFonts = filter === 'All'
        ? fontsList
        : fontsList.filter(f => f.category === filter);

    return (
        <div className="tool-card">
            <div className="calc-header">
                <div className="badge-pill">
                    <i className="fas fa-font"></i> {t.font?.badge || "Bio & Caption Stylizer"}
                </div>
                <h3>{t.font?.heading || "TikTok Font Generator & Aesthetic Text"}</h3>
                <p className="tool-desc">
                    {t.font?.subheading || "Instantly convert your text into 20+ aesthetic Unicode fonts for your TikTok bio, captions, usernames, and comments with 1-click copy."}
                </p>
            </div>

            <div className="input-box-wrapper">
                <label>
                    <i className="fas fa-edit"></i> Type or paste your text below:
                </label>
                <div className="textarea-container">
                    <textarea
                        placeholder="Type your bio, username, or video caption here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    {text && (
                        <button
                            type="button"
                            className="btn-clear-text"
                            onClick={() => setText('')}
                            title="Clear text"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>
            </div>

            <div className="filter-chips">
                {['All', 'Aesthetic', 'Bold', 'Italic', 'Gothic', 'Decor'].map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        className={`chip-btn ${filter === cat ? 'active' : ''}`}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="fonts-list-grid">
                {/* Special Modifiers */}
                {(filter === 'All' || filter === 'Decor') && (
                    <>
                        <div className="font-card-item">
                            <div className="font-meta">
                                <span className="font-name">Sparkles Aesthetic ✨</span>
                                <div className="font-preview-text">
                                    {convertWithDecor(text || "TikTok Viral Creator", 'sparkles')}
                                </div>
                            </div>
                            <button
                                type="button"
                                className={`btn-copy-font ${copiedIndex === 'sparkles' ? 'copied' : ''}`}
                                onClick={() => copyToClipboard(convertWithDecor(text || "TikTok Viral Creator", 'sparkles'), 'sparkles')}
                            >
                                {copiedIndex === 'sparkles' ? <><i className="fas fa-check"></i> Copied!</> : <><i className="fas fa-copy"></i> Copy</>}
                            </button>
                        </div>

                        <div className="font-card-item">
                            <div className="font-meta">
                                <span className="font-name">Japanese Brackets 【 】</span>
                                <div className="font-preview-text">
                                    {convertWithDecor(text || "TikTok Viral Creator", 'brackets')}
                                </div>
                            </div>
                            <button
                                type="button"
                                className={`btn-copy-font ${copiedIndex === 'brackets' ? 'copied' : ''}`}
                                onClick={() => copyToClipboard(convertWithDecor(text || "TikTok Viral Creator", 'brackets'), 'brackets')}
                            >
                                {copiedIndex === 'brackets' ? <><i className="fas fa-check"></i> Copied!</> : <><i className="fas fa-copy"></i> Copy</>}
                            </button>
                        </div>

                        <div className="font-card-item">
                            <div className="font-meta">
                                <span className="font-name">Underlined Text</span>
                                <div className="font-preview-text">
                                    {convertWithDecor(text || "Underlined Style", 'underline')}
                                </div>
                            </div>
                            <button
                                type="button"
                                className={`btn-copy-font ${copiedIndex === 'underline' ? 'copied' : ''}`}
                                onClick={() => copyToClipboard(convertWithDecor(text || "Underlined Style", 'underline'), 'underline')}
                            >
                                {copiedIndex === 'underline' ? <><i className="fas fa-check"></i> Copied!</> : <><i className="fas fa-copy"></i> Copy</>}
                            </button>
                        </div>

                        <div className="font-card-item">
                            <div className="font-meta">
                                <span className="font-name">Strikethrough Text</span>
                                <div className="font-preview-text">
                                    {convertWithDecor(text || "Strikethrough Style", 'strikethrough')}
                                </div>
                            </div>
                            <button
                                type="button"
                                className={`btn-copy-font ${copiedIndex === 'strike' ? 'copied' : ''}`}
                                onClick={() => copyToClipboard(convertWithDecor(text || "Strikethrough Style", 'strikethrough'), 'strike')}
                            >
                                {copiedIndex === 'strike' ? <><i className="fas fa-check"></i> Copied!</> : <><i className="fas fa-copy"></i> Copy</>}
                            </button>
                        </div>
                    </>
                )}

                {filteredFonts.map((font, idx) => {
                    const transformed = convertText(text || font.name, font.map);
                    const isCopied = copiedIndex === idx;

                    return (
                        <div key={idx} className="font-card-item">
                            <div className="font-meta">
                                <span className="font-name">{font.name}</span>
                                <div className="font-preview-text">
                                    {transformed}
                                </div>
                            </div>
                            <button
                                type="button"
                                className={`btn-copy-font ${isCopied ? 'copied' : ''}`}
                                onClick={() => copyToClipboard(transformed, idx)}
                            >
                                {isCopied ? (
                                    <>
                                        <i className="fas fa-check"></i> Copied!
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-copy"></i> Copy
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            <style>{`
                .tool-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                    padding: 26px 20px;
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
                    color: var(--text-dim, #94a3b8);
                    font-size: 0.9rem;
                    max-width: 650px;
                    margin: 0 auto;
                    line-height: 1.5;
                }
                .input-box-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 20px;
                }
                .input-box-wrapper label {
                    font-size: 0.86rem;
                    font-weight: 600;
                    color: var(--text-dim, #94a3b8);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .textarea-container {
                    position: relative;
                }
                textarea {
                    width: 100%;
                    height: 85px;
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    padding: 12px 40px 12px 14px;
                    border-radius: 12px;
                    color: var(--text-main, #fff);
                    resize: vertical;
                    font-size: 1.05rem;
                    outline: none;
                    transition: border-color 0.2s;
                }
                [data-theme='light'] textarea {
                    background: #ffffff;
                    border-color: rgba(0, 0, 0, 0.12);
                    color: #0f172a;
                }
                textarea:focus {
                    border-color: var(--secondary, #00f2ea);
                }
                .btn-clear-text {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: var(--text-dim, #94a3b8);
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-clear-text:hover {
                    color: #ff0050;
                    background: rgba(255, 0, 80, 0.15);
                }
                .filter-chips {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    margin-bottom: 22px;
                }
                .chip-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: var(--text-dim, #94a3b8);
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 0.82rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                [data-theme='light'] .chip-btn {
                    background: #f8fafc;
                    border-color: rgba(0, 0, 0, 0.08);
                    color: #475569;
                }
                .chip-btn.active {
                    background: linear-gradient(135deg, var(--primary, #ff0050), var(--secondary, #00f2ea));
                    color: #fff;
                    border-color: transparent;
                }
                .fonts-list-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .font-card-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 14px 18px;
                    border-radius: 14px;
                    gap: 16px;
                    transition: all 0.2s ease;
                }
                [data-theme='light'] .font-card-item {
                    background: #ffffff;
                    border-color: rgba(0, 0, 0, 0.08);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
                }
                .font-card-item:hover {
                    border-color: var(--border-bright, rgba(0, 242, 234, 0.4));
                    transform: translateX(4px);
                }
                .font-meta {
                    flex: 1;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .font-name {
                    font-size: 0.76rem;
                    font-weight: 700;
                    color: var(--text-dim, #94a3b8);
                    text-transform: uppercase;
                    letter-spacing: 0.4px;
                }
                .font-preview-text {
                    font-size: 1.18rem;
                    color: var(--text-main, #fff);
                    overflow-x: auto;
                    white-space: nowrap;
                    padding-bottom: 2px;
                }
                [data-theme='light'] .font-preview-text {
                    color: #0f172a;
                }
                .btn-copy-font {
                    background: linear-gradient(135deg, var(--primary, #ff0050) 0%, var(--secondary, #00f2ea) 100%);
                    border: none;
                    padding: 9px 18px;
                    border-radius: 10px;
                    color: #fff;
                    font-size: 0.85rem;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    flex-shrink: 0;
                    transition: transform 0.2s, background 0.2s;
                }
                .btn-copy-font:hover {
                    transform: scale(1.04);
                }
                .btn-copy-font.copied {
                    background: #10b981 !important;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
                }
            `}</style>
        </div>
    );
};

export default FontGenerator;
