#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Static Site Generator for i18n (Internationalization)
======================================================
هذا السكربت يقوم بتوليد صفحات HTML ثابتة مع الترجمات "محفورة" بداخلها
بدلاً من الاعتماد على JavaScript للترجمة (Client-side Rendering).

هذا أفضل بكثير للـ SEO لأن محركات البحث ترى المحتوى المترجم مباشرة.

المتطلبات:
- pip install beautifulsoup4

الكاتب: Claude AI Assistant
التاريخ: 2026-01-25
"""

import os
import sys
import json
import re
from bs4 import BeautifulSoup

# Fix Windows console encoding for Arabic/Unicode output
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ===============================
# الإعدادات الأساسية (Configuration)
# ===============================

# الملف القالب الأساسي
TEMPLATE_FILE = "index.html"

# مجلد ملفات الترجمة
LOCALES_DIR = "locales"

# الرابط الأساسي للموقع
BASE_URL = "https://savetik-fast.xyz"

# اللغات التي تكتب من اليمين لليسار (RTL)
RTL_LANGUAGES = ['ar', 'he']


def load_json_file(filepath):
    """
    تحميل ملف JSON وإرجاع محتواه كـ dictionary.
    
    Args:
        filepath: مسار ملف JSON
        
    Returns:
        dict: محتوى الملف
    """
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def get_nested_value(data, key_path):
    """
    استخراج قيمة متداخلة من dictionary باستخدام مسار مفتاح (مثل "hero.title").
    
    Args:
        data: الـ dictionary الأساسي
        key_path: مسار المفتاح (مثل "meta.title" أو "features.fast.title")
        
    Returns:
        str أو None: القيمة المطلوبة أو None إذا لم توجد
    """
    keys = key_path.split(".")
    value = data
    
    for key in keys:
        if isinstance(value, dict) and key in value:
            value = value[key]
        else:
            return None
    
    return value if isinstance(value, str) else None


def parse_i18n_attribute(attr_value):
    """
    تحليل قيمة سمة data-i18n.
    
    الصيغ الممكنة:
    - "hero.title" → استبدال محتوى العنصر
    - "[placeholder]downloader.placeholder" → استبدال سمة placeholder
    - "[content]meta.description" → استبدال سمة content
    
    Args:
        attr_value: قيمة سمة data-i18n
        
    Returns:
        tuple: (اسم_السمة أو None, مفتاح_الترجمة)
    """
    # التحقق من وجود نمط السمات [attribute]key
    match = re.match(r'\[([^\]]+)\](.+)', attr_value)
    
    if match:
        attribute_name = match.group(1)
        translation_key = match.group(2)
        return (attribute_name, translation_key)
    else:
        # لا توجد سمة محددة، استبدال محتوى العنصر
        return (None, attr_value)


def process_html_for_language(html_content, translations, lang_code):
    """
    معالجة ملف HTML وتطبيق الترجمات عليه.
    
    Args:
        html_content: محتوى HTML الأصلي
        translations: dictionary الترجمات
        lang_code: كود اللغة (مثل 'ar', 'tr')
        
    Returns:
        str: محتوى HTML المترجم
    """
    # استخدام html.parser للحفاظ على هيكل HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # ===============================
    # 1. معالجة جميع العناصر ذات data-i18n
    # ===============================
    elements_with_i18n = soup.find_all(attrs={"data-i18n": True})
    
    for element in elements_with_i18n:
        i18n_value = element.get("data-i18n")
        
        if not i18n_value:
            continue
        
        # تحليل قيمة data-i18n
        attr_name, key = parse_i18n_attribute(i18n_value)
        
        # البحث عن الترجمة
        translation = get_nested_value(translations, key)
        
        if translation:
            if attr_name:
                # تحديث سمة معينة (مثل placeholder, content)
                element[attr_name] = translation
            else:
                # استبدال محتوى العنصر النصي
                element.string = translation
        
        # حذف سمة data-i18n (لأننا لم نعد بحاجة إليها)
        del element["data-i18n"]
    
    # ===============================
    # 2. حقن الـ SEO - تحديث <html lang>
    # ===============================
    html_tag = soup.find("html")
    if html_tag:
        html_tag["lang"] = lang_code
        
        # إضافة دعم RTL للغات العربية والعبرية
        if lang_code in RTL_LANGUAGES:
            html_tag["dir"] = "rtl"
        else:
            # التأكد من إزالة dir إذا لم تكن اللغة RTL
            if html_tag.get("dir"):
                del html_tag["dir"]
    
    # ===============================
    # 3. حقن الـ SEO - تحديث <title>
    # ===============================
    title_tag = soup.find("title")
    if title_tag:
        meta_title = get_nested_value(translations, "meta.title")
        if meta_title:
            title_tag.string = meta_title
        # حذف data-i18n من title إذا وجدت (تم حذفها بالفعل في الخطوة 1)
    
    # ===============================
    # 4. حقن الـ SEO - تحديث <meta description>
    # ===============================
    meta_desc = soup.find("meta", attrs={"name": "description"})
    if meta_desc:
        meta_description = get_nested_value(translations, "meta.description")
        if meta_description:
            meta_desc["content"] = meta_description
        # حذف data-i18n من meta إذا وجدت (تم حذفها بالفعل في الخطوة 1)
    
    # ===============================
    # 5. حقن الـ SEO - تحديث Canonical URL
    # ===============================
    canonical_link = soup.find("link", attrs={"rel": "canonical"})
    if canonical_link:
        # تحديث الـ href ليشير للمجلد الفرعي للغة
        canonical_link["href"] = f"{BASE_URL}/{lang_code}/"
    
    # ===============================
    # 6. تحديث روابط Hreflang (اختياري)
    # ===============================
    # تحويل الروابط من ?lang=xx إلى /xx/ للمجلدات الفرعية
    hreflang_links = soup.find_all("link", attrs={"rel": "alternate", "hreflang": True})
    for link in hreflang_links:
        hreflang = link.get("hreflang")
        if hreflang == "x-default":
            link["href"] = f"{BASE_URL}/"
        else:
            link["href"] = f"{BASE_URL}/{hreflang}/"
    
    # ===============================
    # 7. تحديث base href للمسارات النسبية
    # ===============================
    base_tag = soup.find("base")
    if base_tag:
        # تحديث base href للإشارة للجذر
        base_tag["href"] = "/"
    
    # ===============================
    # 8. إزالة سكربت تحديد اللغة الديناميكي (اختياري)
    # ===============================
    # يمكنك تفعيل هذا إذا أردت إزالة السكربتات غير الضرورية
    # script_to_remove = soup.find("script", string=re.compile("localStorage.setItem"))
    # if script_to_remove:
    #     script_to_remove.decompose()
    
    # ===============================
    # 9. إضافة سكربت لضبط اللغة في localStorage
    # ===============================
    head = soup.find("head")
    if head:
        # إنشاء سكربت لضبط اللغة
        lang_script = soup.new_tag("script")
        lang_script.string = f"localStorage.setItem('i18nextLng', '{lang_code}');"
        
        # إضافته قبل نهاية head
        head.append(lang_script)
    
    # إرجاع HTML كنص
    return str(soup)


def get_available_languages():
    """
    الحصول على قائمة اللغات المتاحة من مجلد locales.
    
    Returns:
        list: قائمة بأكواد اللغات (مثل ['ar', 'en', 'tr'])
    """
    languages = []
    
    if not os.path.exists(LOCALES_DIR):
        print(f"⚠️  تحذير: مجلد {LOCALES_DIR} غير موجود!")
        return languages
    
    for filename in os.listdir(LOCALES_DIR):
        if filename.endswith(".json"):
            lang_code = filename.replace(".json", "")
            languages.append(lang_code)
    
    return sorted(languages)


def main():
    """
    الدالة الرئيسية لتشغيل Static Site Generator.
    """
    print("=" * 60)
    print("🚀 Static Site Generator for i18n")
    print("=" * 60)
    
    # ===============================
    # 1. التحقق من وجود الملفات المطلوبة
    # ===============================
    if not os.path.exists(TEMPLATE_FILE):
        print(f"❌ خطأ: ملف القالب '{TEMPLATE_FILE}' غير موجود!")
        return
    
    if not os.path.exists(LOCALES_DIR):
        print(f"❌ خطأ: مجلد الترجمات '{LOCALES_DIR}' غير موجود!")
        return
    
    # ===============================
    # 2. قراءة ملف القالب الأساسي
    # ===============================
    print(f"\n📖 قراءة ملف القالب: {TEMPLATE_FILE}")
    with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
        template_content = f.read()
    
    # ===============================
    # 3. الحصول على اللغات المتاحة
    # ===============================
    languages = get_available_languages()
    
    if not languages:
        print("❌ لا توجد ملفات ترجمة في مجلد locales!")
        return
    
    print(f"\n🌍 اللغات المكتشفة ({len(languages)}): {', '.join(languages)}")
    
    # ===============================
    # 4. معالجة كل لغة
    # ===============================
    print("\n" + "-" * 60)
    print("🔄 بدء المعالجة...")
    print("-" * 60)
    
    success_count = 0
    error_count = 0
    
    for lang_code in languages:
        try:
            # تحميل ملف الترجمة
            json_path = os.path.join(LOCALES_DIR, f"{lang_code}.json")
            translations = load_json_file(json_path)
            
            # معالجة HTML
            processed_html = process_html_for_language(
                template_content, 
                translations, 
                lang_code
            )
            
            # إنشاء مجلد اللغة إذا لم يكن موجوداً
            output_dir = lang_code
            os.makedirs(output_dir, exist_ok=True)
            
            # حفظ الملف
            output_file = os.path.join(output_dir, "index.html")
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(processed_html)
            
            # الحصول على معلومات إضافية للعرض
            title = get_nested_value(translations, "meta.title") or "N/A"
            rtl_indicator = " (RTL)" if lang_code in RTL_LANGUAGES else ""
            
            print(f"  ✅ {lang_code}{rtl_indicator}: {output_file}")
            success_count += 1
            
        except FileNotFoundError:
            print(f"  ❌ {lang_code}: ملف الترجمة غير موجود!")
            error_count += 1
        except json.JSONDecodeError as e:
            print(f"  ❌ {lang_code}: خطأ في قراءة JSON - {e}")
            error_count += 1
        except Exception as e:
            print(f"  ❌ {lang_code}: خطأ غير متوقع - {e}")
            error_count += 1
    
    # ===============================
    # 5. ملخص النتائج
    # ===============================
    print("\n" + "=" * 60)
    print("📊 ملخص النتائج:")
    print("=" * 60)
    print(f"  ✅ نجح: {success_count} لغة")
    print(f"  ❌ فشل: {error_count} لغة")
    print(f"  📁 المجلدات المُنشأة: {success_count}")
    print("\n🎉 اكتمل التوليد بنجاح!" if error_count == 0 else "\n⚠️ اكتمل مع بعض الأخطاء!")


if __name__ == "__main__":
    main()
