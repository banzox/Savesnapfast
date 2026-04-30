import fs from 'fs';
import path from 'path';

const englishTitle = "Best Time to Post on TikTok in 2026 (New Algorithm Update)";
const englishDescription = "Discover the best times to post on TikTok in 2026 to go viral. Learn how the new TikTok algorithm works and how to find your account's specific peak hours for maximum views.";
const englishContent = `Introduction
Are you posting great videos on TikTok but barely getting any views? The problem might not be your content; it might be when you are posting. Understanding the TikTok algorithm in 2026 means knowing exactly when your audience is awake, scrolling, and ready to engage. In this guide, we will reveal the global best times to post on TikTok and how to find your personal golden hours.

The Global Best Times to Post on TikTok
Based on recent 2026 algorithm data and engagement studies across millions of videos, there are specific windows where user activity peaks. If you want a quick cheat sheet, here are the generally accepted global best times to post (in Eastern Standard Time - EST):

Monday: 6 AM, 10 AM, 10 PM
Tuesday: 2 AM, 4 AM, 9 AM
Wednesday: 7 AM, 8 AM, 11 PM
Thursday: 9 AM, 12 PM, 7 PM
Friday: 5 AM, 1 PM, 3 PM
Saturday: 11 AM, 7 PM, 8 PM
Sunday: 7 AM, 8 AM, 4 PM

Why do early morning hours work? Because people check their phones as soon as they wake up, and your video gets pushed to different time zones around the world throughout the day.

How to Find YOUR Unique Best Time to Post
While global times are a great starting point, your specific audience might have different habits. Here is how to find the exact times your followers are most active:

1. Switch to a Business or Creator Account
To access TikTok Analytics, ensure your profile is set to a Creator or Business account. This is free and takes only a few seconds in your settings.

2. Check the "Followers" Tab in Analytics
Go to your Creator Tools > Analytics > Followers. Scroll down to the "Follower Activity" section. Here, TikTok shows you a clear graph of the days and hours when your followers are most active online.

3. Post 30 Minutes Before Peak Time
If your analytics show that your audience is most active at 7 PM, don't post exactly at 7 PM. Post at 6:30 PM. This gives the algorithm time to process your video and start pushing it to the "For You" page (FYP) just as your followers are logging in.

Does Consistency Matter More Than Timing?
Yes! In 2026, the TikTok algorithm highly rewards consistency. Posting 1 to 3 times a day keeps your account active and increases your chances of hitting the FYP. However, combining consistency with the right timing is the ultimate recipe for going viral.

Pro Tip for Creators: If you are analyzing competitors or saving trending videos to study their posting times, you can always download them in high quality and without a watermark using our free tool at SaveTikFast.

Conclusion
Finding the best time to post on TikTok requires a mix of global data and studying your own personal analytics. Test different times, track your results, and stick to a consistent schedule. Once you find your sweet spot, the views will follow!`;

const languages = {
  "en": "en", "ar": "ar", "es": "es", "pt": "pt", "id": "id", 
  "fr": "fr", "de": "de", "it": "it", "tr": "tr", "ru": "ru", 
  "vi": "vi", "th": "th", "ja": "ja", "ko": "ko", "pl": "pl", 
  "nl": "nl", "ro": "ro", "ms": "ms", "fil": "tl", "uk": "uk", 
  "cs": "cs", "sv": "sv", "hu": "hu", "el": "el", "da": "da", 
  "fi": "fi", "no": "no", "bg": "bg", "zh": "zh-CN", "hi": "hi"
};

async function translateText(text, targetLang) {
    if (targetLang === 'en') return text;
    
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        let translatedText = '';
        data[0].forEach(part => {
            translatedText += part[0];
        });
        return translatedText;
    } catch (error) {
        console.error(`Error translating to ${targetLang}:`, error);
        return text;
    }
}

async function processTranslations() {
    console.log("Starting translation process...");
    const outDir = path.join(process.cwd(), 'src', 'content', 'blog');
    
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    const paragraphs = englishContent.split('\n\n');

    for (const [langCode, googleLang] of Object.entries(languages)) {
        console.log(`Processing ${langCode}...`);
        
        try {
            const transTitle = await translateText(englishTitle, googleLang);
            const transDesc = await translateText(englishDescription, googleLang);
            
            let transContent = [];
            for (const p of paragraphs) {
                if (p.trim().length === 0) continue;
                const translatedP = await translateText(p, googleLang);
                transContent.push(translatedP);
                await new Promise(r => setTimeout(r, 200));
            }

            const markdownContent = `---
title: "${transTitle.replace(/"/g, '\\"')}"
description: "${transDesc.replace(/"/g, '\\"')}"
author: "SaveTikFast Editor"
pubDate: "2026-04-30"
lang: "${langCode}"
---

${transContent.join('\n\n')}
`;

            const filename = langCode === 'en' 
                ? 'best-time-to-post-on-tiktok-2026.md' 
                : `best-time-to-post-on-tiktok-2026-${langCode}.md`;
            
            fs.writeFileSync(path.join(outDir, filename), markdownContent);
            console.log(`✅ Saved ${filename}`);
        } catch (e) {
            console.error(`Failed for ${langCode}`, e);
        }
    }
    console.log("All done!");
}

processTranslations();
