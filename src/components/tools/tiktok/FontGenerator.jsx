import React, { useState } from 'react';

const FontGenerator = ({ t }) => {
    const [text, setText] = useState('');

    const fonts = [
        { name: "Bold", map: "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳" },
        { name: "Italic", map: "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧" },
        { name: "Script", map: "𝓐𝓑𝓒𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃" },
        { name: "Double Struck", map: "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫" },
        { name: "Monospace", map: "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣" },
        { name: "Bubble", map: "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ" }
    ];

    const convertText = (input, fontMap) => {
        const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        return input.split('').map(char => {
            const index = normal.indexOf(char);
            return index !== -1 ? fontMap[index] : char;
        }).join('');
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Could add a toast notification here
    };

    return (
        <div className="tool-card">
            <h3>TikTok Font Generator</h3>
            <textarea
                placeholder="Type your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <div className="fonts-list">
                {fonts.map((font, idx) => (
                    <div key={idx} className="font-item">
                        <div className="font-preview">
                            {text ? convertText(text, font.map) : font.name}
                        </div>
                        <button
                            className="btn-copy"
                            onClick={() => copyToClipboard(text ? convertText(text, font.map) : font.name)}
                        >
                            Copy
                        </button>
                    </div>
                ))}
            </div>

            <style>{`
                .tool-card {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 25px;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                textarea {
                    width: 100%;
                    height: 80px;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 15px;
                    border-radius: 8px;
                    color: white;
                    margin-bottom: 20px;
                    resize: none;
                    font-size: 1.1rem;
                }
                .font-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(255,255,255,0.03);
                    padding: 15px;
                    margin-bottom: 10px;
                    border-radius: 8px;
                }
                .font-preview {
                    font-size: 1.2rem;
                    overflow-x: auto;
                    white-space: nowrap;
                    margin-right: 15px;
                }
                .btn-copy {
                    background: var(--primary);
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    color: white;
                    cursor: pointer;
                    min-width: 70px;
                }
                .btn-copy:active {
                    background: var(--secondary);
                }
            `}</style>
        </div>
    );
};

export default FontGenerator;
