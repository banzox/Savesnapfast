import json
import os
import random
import time
from deep_translator import GoogleTranslator

languages = [
    'ar', 'bg', 'cs', 'da', 'de', 'el', 'es', 'fi', 'fr', 'hi', 'hu', 'id', 'it', 'ja', 'ko', 'ms', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sv', 'th', 'tr', 'uk', 'vi', 'zh', 'fil'
]

# Map locale code to google translate code if different
lang_map = {
    'zh': 'zh-CN',
    'fil': 'tl'
}

base_intro_p1 = [
    "SaveTikFast is widely recognized as one of the premier tools available online for downloading TikTok videos without any watermark. It has been meticulously designed to cater to users who demand high speed, impeccable quality, and ultimate convenience. Whether you are an avid content creator looking to back up your own videos, a social media manager gathering trending clips for analysis, or simply an enthusiast who loves saving funny and inspiring moments, SaveTikFast offers a seamless experience that stands out from the rest. The platform operates entirely through your web browser, meaning there is no need to install any cumbersome software or applications that might slow down your device. This universal accessibility ensures that you can use our service on a Windows PC, a Mac, an Android smartphone, or an iPhone with equal ease and efficiency. Furthermore, we pride ourselves on providing a completely free service that doesn't compromise on performance. You get unlimited downloads, ensuring that your favorite TikTok content is always just a click away, ready to be saved directly to your local storage in crisp, high-definition quality. Our tool is the ultimate solution for anyone wanting to keep their favorite TikToks forever.",
    "When it comes to saving TikTok videos effortlessly and without the intrusive watermarks, SaveTikFast emerges as the absolute best choice on the market. We have developed this powerful online downloader with user experience as our top priority. Navigating through our website is incredibly intuitive; you only need to paste the link of your desired TikTok video, and our advanced servers handle the rest at lightning-fast speeds. The uniqueness of SaveTikFast lies in its robust architecture, which guarantees reliable downloads even during peak traffic hours. It is an indispensable utility for influencers, marketers, and everyday users who wish to curate their personal collection of viral hits. Because it is a web-based utility, it eliminates the risks associated with downloading third-party apps, offering a secure and private environment for all your downloading needs. You can access SaveTikFast from any device, whether you're using a desktop computer at home or a mobile phone on the go. We believe that accessing high-quality media should be straightforward and free of charge. By choosing SaveTikFast, you are opting for a premium, restriction-free service that consistently delivers flawless, watermark-free videos directly to your gallery or hard drive.",
]

base_intro_p2 = [
    "Beyond just standard video downloads, SaveTikFast is equipped with a comprehensive suite of features designed to meet all your TikTok media saving needs. One of our most popular functionalities is the MP3 extraction tool. Often, a TikTok video features a catchy song, a hilarious soundbite, or a motivational speech that you'd love to listen to offline. With our platform, you can seamlessly convert any TikTok video into a high-quality MP3 audio file, perfect for setting as a ringtone or adding to your music playlist. Additionally, we fully support downloading TikTok photo slideshows. Instead of trying to screenshot each image as it passes, our tool extracts the entire slideshow and saves each picture individually in its original, uncompressed resolution. But that's not all; we also offer the ability to download TikTok Stories. As Stories are ephemeral and disappear after 24 hours, our downloader allows you to archive these fleeting moments permanently. Every single feature on SaveTikFast is optimized for speed and reliability, ensuring that whether you are downloading a 3-minute HD video, a crisp MP3 track, or a stunning photo carousel, the process is instantaneous and hassle-free.",
    "SaveTikFast is not just a simple video downloader; it is an all-in-one media extraction powerhouse tailored specifically for TikTok content. We understand that TikTok has evolved to include various formats, and our tool has adapted accordingly. If you come across a video with a viral audio track that you want to keep, our dedicated MP3 downloader allows you to rip the audio in crystal-clear quality, entirely separate from the video. This is incredibly useful for creators looking for sound effects or users wanting to enjoy their favorite TikTok tunes offline. Moreover, our platform provides full support for the increasingly popular TikTok photo slideshows. With just one click, you can download all the images from a slideshow in pristine HD quality, saving you the trouble of manual screen capturing. We also cater to the need of downloading TikTok Stories before they vanish. With our Story downloader, you can quickly save those temporary updates directly to your device. All these features are integrated into a single, user-friendly interface. Whether you need MP4 videos, MP3 audio, or JPG images, SaveTikFast delivers them all with unmatched speed, ensuring you never lose out on the content you love."
]

base_why_p1 = [
    "Speed and reliability are the cornerstones of the SaveTikFast experience. We have invested heavily in state-of-the-art server infrastructure to ensure that your downloads are processed in mere seconds, regardless of your geographic location. Unlike other services that make you wait in queues or suffer through slow transfer rates, our optimized algorithms fetch and convert TikTok media almost instantaneously. This means you can download dozens of videos back-to-back without experiencing any lag or downtime. Our platform boasts an impressive uptime record, ensuring that whenever you need to save a video, SaveTikFast is ready and waiting to deliver unparalleled performance.",
    "At SaveTikFast, we understand that your time is valuable, which is why we prioritize blazing-fast download speeds and rock-solid reliability. Our robust backend systems are engineered to handle high volumes of concurrent requests without breaking a sweat. When you hit the download button, our servers immediately process the TikTok link, stripping away the watermark and delivering the file to you in the blink of an eye. You won't encounter broken links, endless loading screens, or frustrating timeouts. We consistently monitor and upgrade our network to provide a seamless, uninterrupted downloading experience that you can depend on day in and day out."
]

base_why_p2 = [
    "Quality is never compromised when you use SaveTikFast. Our tool meticulously extracts the highest available resolution from TikTok's servers, ensuring that the videos you save look just as crisp and vibrant as they do in the app. Whether it's Full HD or 4K, if the original creator uploaded it in high quality, you will get it in high quality. Furthermore, our platform offers unparalleled device support. Whether you prefer using a Windows PC, a macOS laptop, an Android tablet, or an iOS smartphone, SaveTikFast functions flawlessly across all operating systems. It is perfectly compatible with all major web browsers, including Chrome, Safari, Firefox, and Edge.",
    "When downloading content, visual clarity is crucial, and SaveTikFast guarantees superior quality with every download. We preserve the original video's bitrate and resolution, providing you with immaculate, watermark-free MP4 files that are perfect for viewing on large screens or for professional video editing. In addition to premium quality, our service boasts universal compatibility. You don't need to worry about device restrictions; SaveTikFast is fully responsive and works perfectly on any gadget with an internet connection. From the latest iPhones and Android devices to older desktop computers, our web-based tool adapts to your screen and browser, offering a consistent and smooth user experience everywhere."
]

base_why_p3 = [
    "Your privacy and safety are of utmost importance to us at SaveTikFast. We operate under a strict no-logs policy, meaning we do not track, store, or monitor the videos you choose to download. Your usage remains entirely anonymous. Additionally, our website is fortified with advanced SSL encryption to protect your connection from any potential threats. Because our service is 100% web-based, you are never asked to download suspicious executable files or install invasive browser extensions, completely eliminating the risk of malware or viruses. You can download your favorite TikToks with total peace of mind, knowing your data is secure.",
    "SaveTikFast is committed to providing a secure and private environment for all our users. We do not require you to create an account, log in, or provide any personal information to use our services. What you download is your business, and we keep it that way by not maintaining any records of your download history. Furthermore, our site is continuously scanned for vulnerabilities and uses industry-standard HTTPS protocols to ensure your data remains safe. By avoiding the need for app installations, we protect your device from adware, spyware, and other malicious software often bundled with downloadable programs. Your digital safety is guaranteed here."
]

base_guide = [
    "Using SaveTikFast to download your favorite TikTok videos is an incredibly straightforward process that anyone can master in seconds. First, open the TikTok application on your smartphone or visit the TikTok website on your computer browser. Scroll through your feed until you find the video, slideshow, or Story you wish to save. Next, tap on the 'Share' icon, which is usually represented by an arrow pointing to the right, located on the right side of the screen. From the sharing menu that pops up, select the 'Copy Link' option. Once the link is copied to your clipboard, open your preferred web browser—whether it's Chrome, Safari, or Firefox—and navigate to the SaveTikFast website. On our homepage, you will prominently see a large input field. Paste the copied TikTok link directly into this text box. After pasting the link, click on the 'Download' button right next to it. Our system will immediately process the link and, within a few moments, present you with several download options. You can choose to download the video without a watermark, extract the audio as an MP3, or save images from a slideshow. Click on your desired format, and the file will instantly begin downloading to your device's local storage, ready to be viewed or shared offline.",
    "Downloading content from TikTok using SaveTikFast is designed to be as easy as 1-2-3, requiring no technical knowledge whatsoever. To begin, launch the TikTok app on your mobile device or access it via a web browser on your desktop. Find the specific video you want to download. Tap the 'Share' button (the arrow icon) on the right side of the video player, and then choose 'Copy Link' to save the video's URL to your clipboard. With the link copied, head over to SaveTikFast.xyz using any browser. You will find a clear, easy-to-use search bar right at the top of the page. Simply paste the URL you just copied into this search bar and hit the 'Download' button. In just a fraction of a second, our powerful servers will analyze the video and provide you with a list of available download formats. You will have the option to download the high-definition MP4 video completely free of watermarks, or you can opt to download just the background music as a high-quality MP3 file. Select the option that best suits your needs, and the download will commence immediately. The file will be saved directly to your phone's gallery or your computer's downloads folder, allowing you to enjoy the content anytime, anywhere, without needing an internet connection."
]

base_comparison = [
    "While there are several TikTok downloaders available such as SSSTik, SnapTik, and TikMate, SaveTikFast distinctly outshines the competition in numerous ways. First and foremost, our download speeds are noticeably faster, ensuring you spend less time waiting and more time enjoying your content. Unlike SSSTik, which can sometimes struggle with high-resolution slideshows, SaveTikFast processes all formats seamlessly and without error. Furthermore, our interface is much cleaner and more user-friendly than SnapTik, with fewer intrusive advertisements that disrupt the user experience. We also offer more comprehensive features, such as dedicated Story downloading and high-bitrate MP3 extraction, which are often limited or entirely absent on platforms like TikMate. SaveTikFast is continuously updated to remain fully compatible with TikTok's latest algorithm changes, guaranteeing reliable performance every single day.",
    "When you compare SaveTikFast to other popular alternatives like SnapTik, SSSTik, or TikMate, the advantages of our platform become immediately clear. SaveTikFast provides a superior, ad-light experience that doesn't overwhelm you with pop-ups, unlike many competitors. In terms of performance, our advanced conversion engines deliver watermark-free videos significantly faster than SnapTik, especially during peak internet hours. While SSSTik is a capable tool, SaveTikFast offers a more robust suite of features, handling not just standard videos but also complex multi-image slideshows and ephemeral Stories with absolute precision. Moreover, the audio quality of our MP3 downloads is consistently higher than what you get from TikMate. By focusing on speed, reliability, user experience, and comprehensive feature support, SaveTikFast has established itself as the premier choice for TikTok media downloading."
]

base_tips = [
    "To get the most out of your SaveTikFast experience, there are a few practical tips you can follow. For mobile users, we highly recommend bookmarking our website on your smartphone's home screen or browser for instant access whenever you find a video you love. If you are downloading content for video editing or professional use, always ensure you select the highest available HD resolution option to maintain visual fidelity. For users in regions with slower internet connections, downloading the MP3 audio version first can be a great way to save bandwidth if you only need the sound. Additionally, if a download doesn't start immediately, simply refreshing the page and pasting the link again usually resolves any temporary network hiccups. Always remember that while downloading is free and unlimited, you should respect the intellectual property rights of the original content creators when resharing or reusing their videos.",
    "Maximizing your efficiency with SaveTikFast is easy with a few simple tricks. If you frequently download TikToks on your computer, consider keeping a dedicated browser tab open to SaveTikFast so you can quickly switch back and forth while browsing the app. When dealing with photo slideshows, creating a specific folder on your device beforehand can help you organize the individually downloaded images more effectively. If you are an iOS user and are having trouble finding your downloads, remember to check the 'Downloads' section in your Safari browser and then save the file directly to your Camera Roll. For those looking to build a music library, our MP3 feature is perfect; just make sure to rename the files immediately after downloading to keep your playlist organized. Lastly, always ensure your browser is updated to the latest version to guarantee maximum compatibility and the fastest download speeds possible."
]

base_conclusion = [
    "In conclusion, SaveTikFast is undoubtedly the most efficient, reliable, and user-friendly tool for downloading TikTok videos, audio, and slideshows without watermarks. With our commitment to high-speed performance, uncompromising quality, and strict user privacy, we provide an unparalleled service that caters to all your downloading needs. Don't let your favorite TikTok moments slip away or get lost in the feed. Start using SaveTikFast today to build your personal offline collection of viral hits and trending sounds. Bookmark our site now, try your first free download, and experience the ultimate TikTok downloading solution for yourself!",
    "To sum up, if you are looking for the ultimate, hassle-free way to save TikTok content, SaveTikFast is your definitive answer. We combine lightning-fast speeds, premium HD quality, and a comprehensive suite of features—from MP3 extraction to Story downloading—into one secure and entirely free platform. Our tool works perfectly across all devices, ensuring you have access to your favorite media whenever you want it. Take control of your digital content today. Visit SaveTikFast, paste your first link, and discover how incredibly easy it is to save watermark-free TikTok videos directly to your device!"
]

def get_unique_english():
    return {
        "intro_title": "Best TikTok Video Downloader Without Watermark",
        "intro_p1": random.choice(base_intro_p1),
        "intro_p2": random.choice(base_intro_p2),
        "why_title": "Why Choose SaveTikFast?",
        "why_p1": random.choice(base_why_p1),
        "why_p2": random.choice(base_why_p2),
        "why_p3": random.choice(base_why_p3),
        "guide_title": "How to Download TikTok Videos on Any Device",
        "guide_p1": random.choice(base_guide),
        "comparison_title": "SaveTikFast vs Other Downloaders (SSSTik, SnapTik)",
        "comparison_p1": random.choice(base_comparison),
        "tips_title": "Tips for the Best Downloading Experience",
        "tips_p1": random.choice(base_tips),
        "conclusion_title": "Start Downloading Your Favorite TikToks Today",
        "conclusion_p1": random.choice(base_conclusion)
    }

def translate_content(content, target_lang):
    if target_lang == 'en':
        return content
    
    t_lang = lang_map.get(target_lang, target_lang)
    translator = GoogleTranslator(source='en', target=t_lang)
    translated = {}
    for k, v in content.items():
        try:
            res = translator.translate(v)
            translated[k] = res
        except Exception as e:
            print(f"Translation error for {t_lang} on key {k}: {e}")
            translated[k] = v # fallback to english
            time.sleep(2)
    return translated

locales_dir = r"c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\src\locales\locales"

# Update EN first
print("Updating EN")
en_path = os.path.join(locales_dir, 'en.json')
with open(en_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)
en_data['seo_rich_content'] = get_unique_english()
with open(en_path, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=4, ensure_ascii=False)

for lang in languages:
    filepath = os.path.join(locales_dir, f"{lang}.json")
    if not os.path.exists(filepath):
        print(f"Skipping {lang}, file not found.")
        continue
    
    print(f"Processing {lang}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Generate unique english content for this language and translate
    eng_content = get_unique_english()
    trans_content = translate_content(eng_content, lang)
    
    data['seo_rich_content'] = trans_content
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
        
    time.sleep(1) # prevent rate limiting

print("Done generating locales.")
