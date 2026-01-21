// =================================================================
// SnapTik-Style Engine: محرك الصفحة الواحدة المتكامل
// =================================================================

const supportedLanguages = [
    'en', 'ar', 'id', 'tr', 'fr', 'es', 'de', 'pt', 'ru', 'it', 
    'ja', 'zh', 'vi', 'hi', 'nl', 'ko', 'th', 'pl', 'uk', 'el', 
    'sv', 'no', 'da', 'fi', 'cs', 'hu', 'ro', 'sk', 'ms', 'he'
];

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof i18next === 'undefined') return;

    try {
        await i18next
            .use(i18nextHttpBackend)
            .use(i18nextBrowserLanguageDetector)
                        .init({
                fallbackLng: 'en',
                supportedLngs: supportedLanguages,
                debug: false,
                partialBundledLanguages: true,
                backend: {
                    loadPath: './locales/{{lng}}.json', // النقطة هنا مهمة جداً للمسار
                },
                detection: {
                    // تم حذف 'path' نهائياً لمنع ظهور صفحة "عذراً" في GitHub
                    order: ['localStorage', 'navigator', 'querystring'],
                    caches: ['localStorage']
                }
            });

        // 1. بناء القوائم (الهيدر والفوتر)
        injectMasterLayout(); 
        
        // 2. تحديد أي مشهد يجب عرضه (الرئيسية أم صفحة فرعية)
        handleRouting();

        // 3. تفعيل التنقل السلس (بدون تحميل)
        window.addEventListener('popstate', handleRouting);

    } catch (error) { console.error('Error:', error); }

    // عند تغيير اللغة، حدث كل شيء فوراً
    i18next.on('languageChanged', (lng) => {
        document.documentElement.lang = lng;
        document.documentElement.dir = ['ar', 'he', 'fa'].includes(lng) ? 'rtl' : 'ltr';
        handleRouting(); 
    });
});

// =========================================================
// الموجه (Router): العقل المدبر للتنقل
// =========================================================
function handleRouting() {
    let path = window.location.pathname;
    const langSegment = path.split('/')[1];
    
    // تنظيف الرابط من رمز اللغة
    if (supportedLanguages.includes(langSegment)) {
        path = path.replace('/' + langSegment, '') || '/';
    }

    const homeView = document.getElementById('home-view');
    const pageView = document.getElementById('page-view');
    const pageTitle = document.getElementById('dynamic-page-title');
    const pageContent = document.getElementById('dynamic-page-content');

    // إخفاء جميع المشاهد أولاً
    if(homeView) homeView.style.display = 'none';
    if(pageView) pageView.style.display = 'none';

    // قرار العرض
    if (path === '/' || path === '/index.html') {
        // --- نحن في الصفحة الرئيسية ---
        if(homeView) homeView.style.display = 'block';
        updateContent('home'); 
        renderHomeFAQ(); // بناء الأسئلة الشائعة في الرئيسية
    } else {
        // --- نحن في صفحة فرعية ---
        const pageKey = path.substring(1).replace('.html', ''); // مثال: terms
        
        if (i18next.exists(`pages.${pageKey}.title`)) {
            if(pageView) pageView.style.display = 'block';
            // حقن النصوص من ملف JSON
            if(pageTitle) pageTitle.innerHTML = i18next.t(`pages.${pageKey}.title`);
            if(pageContent) pageContent.innerHTML = i18next.t(`pages.${pageKey}.content`).replace(/\n/g, '<br>');
            
            updateContent(pageKey); // تحديث الـ SEO
        } else {
            // صفحة غير موجودة -> نعيده للرئيسية
            if(homeView) homeView.style.display = 'block';
        }
    }
    updateHreflangs();
}

// دالة الانتقال السلس (تستخدم في الأزرار)
window.navigateTo = function(path) {
    const lang = i18next.language;
    const url = `/${lang}${path.startsWith('/') ? path : '/' + path}`;
    history.pushState({}, '', url);
    handleRouting();
    window.scrollTo(0, 0);
};

// =========================================================
// وظائف المحتوى والـ SEO
// =========================================================
function updateContent(page) {
    // تحديث النصوص الثابتة
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const attrMatch = key.match(/^\[(.*)\](.*)/);
        if (attrMatch) el.setAttribute(attrMatch[1], i18next.t(attrMatch[2]));
        else el.innerHTML = i18next.t(key);
    });

    // تحديث SEO
    let titleKey = page === 'home' ? 'meta.title' : `pages.${page}.title`;
    let descKey = page === 'home' ? 'meta.description' : `pages.${page}.content`;

    document.title = page === 'home' ? i18next.t(titleKey) : `${i18next.t(titleKey)} - Snaptiks`;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        let descText = i18next.t(descKey).substring(0, 160);
        metaDesc.setAttribute('content', descText);
    }
}

// بناء قسم الأسئلة الشائعة في الرئيسية (الميزة التي طلبتها)
function renderHomeFAQ() {
    const container = document.getElementById('home-faq-list');
    if (!container) return;
    
    let html = '';
    // نبحث عن 6 أسئلة في ملف JSON
    for(let i=1; i<=10; i++) {
        if(i18next.exists(`faq.q${i}`)) {
            html += `
            <div class="faq-item" onclick="this.classList.toggle('active')">
                <div class="faq-question">
                    <span>${i18next.t(`faq.q${i}`)}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${i18next.t(`faq.a${i}`)}</p>
                </div>
            </div>`;
        }
    }
    container.innerHTML = html;
}

function updateHreflangs() {
    document.querySelectorAll("link[rel='alternate'][hreflang]").forEach(e => e.remove());
    const baseUrl = window.location.origin;
    let cleanPath = window.location.pathname.replace(/^\/[a-z]{2}\//, '/');
    if (cleanPath === '/index.html') cleanPath = '/';

    supportedLanguages.forEach(lang => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = lang;
        link.href = `${baseUrl}/${lang}${cleanPath === '/' ? '' : cleanPath}`;
        document.head.appendChild(link);
    });
}

// =========================================================
// حقن القوائم (Header & Footer) ديناميكياً
// =========================================================
function injectMasterLayout() {
    const header = document.getElementById('main-header');
    const footer = document.getElementById('main-footer');
    
    if (header) {
        header.innerHTML = `
        <nav>
            <a href="javascript:void(0)" onclick="navigateTo('/')" class="logo">
                <i class="fab fa-tiktok"></i> Snaptiks
            </a>
            <ul class="nav-links">
                <li><a onclick="navigateTo('/')" data-i18n="nav.home">Home</a></li>
                <li><a onclick="navigateTo('/about')" data-i18n="nav.about">About</a></li>
                <li><a onclick="navigateTo('/contact')" data-i18n="nav.contact">Contact</a></li>
                <li id="lang-picker-slot"></li>
            </ul>
            <div class="mobile-menu" onclick="document.querySelector('.nav-links').classList.toggle('active')">
                <span></span><span></span><span></span>
            </div>
        </nav>`;
        createPicker('lang-picker-slot');
    }

    if (footer) {
        footer.innerHTML = `
        <div class="container">
            <div class="footer-logo">Snaptiks</div>
            <div class="footer-links">
                <a onclick="navigateTo('/')" data-i18n="nav.home">Home</a>
                <a onclick="navigateTo('/terms')" data-i18n="nav.terms">Terms</a>
                <a onclick="navigateTo('/privacy')" data-i18n="nav.privacy">Privacy</a>
                <a onclick="navigateTo('/disclaimer')" data-i18n="nav.disclaimer">Disclaimer</a>
                <a onclick="navigateTo('/dmca')" data-i18n="nav.dmca">DMCA</a>
            </div>
            <p style="opacity:0.7; font-size:0.9rem;">&copy; 2026 Snaptiks. <span data-i18n="footer.rights">All rights reserved.</span></p>
        </div>`;
    }
}

function createPicker(slotId) {
    const slot = document.getElementById(slotId);
    if (!slot) return;
    const sel = document.createElement('select');
    sel.style.cssText = "background:#222; color:#fff; border:1px solid #444; padding:5px; border-radius:5px;";
    sel.onchange = (e) => {
        const newLang = e.target.value;
        i18next.changeLanguage(newLang);
        // تحديث الرابط في المتصفح ليعكس اللغة الجديدة
        let path = window.location.pathname;
        const currentLang = path.split('/')[1];
        if (supportedLanguages.includes(currentLang)) {
            path = path.replace('/' + currentLang, '/' + newLang);
        } else {
            path = '/' + newLang + path;
        }
        history.pushState({}, '', path);
    };
    
    supportedLanguages.forEach(code => {
        const opt = document.createElement('option');
        opt.value = code;
        opt.text = code.toUpperCase();
        if(code === i18next.language) opt.selected = true;
        sel.add(opt);
    });
    slot.appendChild(sel);
}
