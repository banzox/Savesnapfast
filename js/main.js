// تشغيل القائمة في الموبايل
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// نصوص الترجمة
const translations = {
    ar: {
        home: "الرئيسية",
        about: "حول",
        contact: "تواصل",
        title: "تحميل فيديو تيك توك",
        desc: "بدون علامة مائية - سريع ومجاني",
        btn: "تحميل الآن"
    },
    en: {
        home: "Home",
        about: "About",
        contact: "Contact",
        title: "TikTok Video Downloader",
        desc: "No Watermark - Fast & Free",
        btn: "Download Now"
    }
};

// تشغيل اللغة
function switchLang() {
    const currentLang = document.documentElement.lang;
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    
    // تحديث النصوص
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if(translations[newLang][key]) {
            el.innerText = translations[newLang][key];
        }
    });

    // تحديث زر اللغة
    document.getElementById('langBtn').innerText = newLang === 'ar' ? 'English' : 'العربية';
    
    // حفظ اللغة
    localStorage.setItem('snaptiks_lang', newLang);
}

// تطبيق اللغة المحفوظة عند فتح الموقع
window.onload = function() {
    const savedLang = localStorage.getItem('snaptiks_lang');
    if(savedLang && savedLang === 'en') {
        switchLang(); // حول للإنجليزية إذا كانت محفوظة
    }
}
