#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Static Site Generator for i18n - v3.0 (Multi-Page + Sitemap)
=============================================================
Auto-discovers ALL HTML files in root directory and generates
translated versions + automatic sitemap.xml generation.

Features:
- Auto-discovers all .html files in ROOT directory only
- Excludes language folders (ar, tr, etc.) from source scanning
- Generates translated versions for all pages
- Auto-generates sitemap.xml with all language URLs

Requirements:
- pip install beautifulsoup4

Author: Claude AI Assistant
Date: 2026-01-25
"""

import os
import sys
import json
import re
from datetime import datetime
from bs4 import BeautifulSoup

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ===============================
# Configuration
# ===============================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOCALES_DIR = os.path.join(BASE_DIR, "locales")
BASE_URL = "https://savetik-fast.xyz"
RTL_LANGUAGES = ['ar', 'he']

# Files to exclude from processing
EXCLUDED_FILES = {'404.html'}


def get_language_codes():
    """Get all language codes from locales directory."""
    codes = set()
    if os.path.exists(LOCALES_DIR):
        for filename in os.listdir(LOCALES_DIR):
            if filename.endswith('.json'):
                codes.add(filename.replace('.json', ''))
    return codes


LANGUAGE_CODES = get_language_codes()


def load_json_file(filepath):
    """Load JSON file and return as dictionary."""
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def get_nested_value(data, key_path):
    """Get nested value from dictionary using dot notation."""
    keys = key_path.split(".")
    value = data
    for key in keys:
        if isinstance(value, dict) and key in value:
            value = value[key]
        else:
            return None
    return value if isinstance(value, str) else None


def parse_i18n_attribute(attr_value):
    """Parse data-i18n attribute. Returns (attribute_name, key) or (None, key)."""
    match = re.match(r'\[([^\]]+)\](.+)', attr_value)
    if match:
        return (match.group(1), match.group(2))
    return (None, attr_value)


def discover_root_html_files():
    """
    Discover all HTML files in ROOT directory only.
    Excludes: language folders, locales, special directories.
    
    Returns:
        list of tuples: [(filename, absolute_path), ...]
    """
    html_files = []
    
    # Get list of directories to exclude (language codes + special dirs)
    excluded_dirs = LANGUAGE_CODES | {'locales', 'js', 'css', 'node_modules', '.git'}
    
    for item in os.listdir(BASE_DIR):
        item_path = os.path.join(BASE_DIR, item)
        
        # Only process files (not directories)
        if os.path.isfile(item_path):
            # Only process .html files
            if item.endswith('.html') and item not in EXCLUDED_FILES:
                html_files.append((item, item_path))
    
    return sorted(html_files)


def process_html_for_language(html_content, translations, lang_code, filename):
    """
    Process HTML content and apply translations.
    
    Args:
        html_content: Original HTML string
        translations: Dictionary from JSON
        lang_code: Language code (e.g., 'ar', 'tr')
        filename: Original filename (e.g., 'about.html')
    
    Returns:
        str: Translated HTML
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 1. Process all data-i18n elements
    for element in soup.find_all(attrs={"data-i18n": True}):
        i18n_value = element.get("data-i18n")
        if not i18n_value:
            continue
        
        attr_name, key = parse_i18n_attribute(i18n_value)
        translation = get_nested_value(translations, key)
        
        if translation:
            if attr_name:
                element[attr_name] = translation
            else:
                element.string = translation
        
        del element["data-i18n"]
    
    # 2. Update <html lang>
    html_tag = soup.find("html")
    if html_tag:
        html_tag["lang"] = lang_code
        if lang_code in RTL_LANGUAGES:
            html_tag["dir"] = "rtl"
        elif html_tag.get("dir"):
            del html_tag["dir"]
    
    # 3. Update <title>
    title_tag = soup.find("title")
    if title_tag:
        meta_title = get_nested_value(translations, "meta.title")
        if meta_title:
            title_tag.string = meta_title
    
    # 4. Update <meta description>
    meta_desc = soup.find("meta", attrs={"name": "description"})
    if meta_desc:
        meta_description = get_nested_value(translations, "meta.description")
        if meta_description:
            meta_desc["content"] = meta_description
    
    # 5. Update Canonical URL
    canonical_link = soup.find("link", attrs={"rel": "canonical"})
    if canonical_link:
        if filename == "index.html":
            canonical_path = f"/{lang_code}/"
        else:
            canonical_path = f"/{lang_code}/{filename}"
        canonical_link["href"] = f"{BASE_URL}{canonical_path}"
    
    # 6. Update Hreflang links
    for link in soup.find_all("link", attrs={"rel": "alternate", "hreflang": True}):
        hreflang = link.get("hreflang")
        if filename == "index.html":
            if hreflang == "x-default":
                link["href"] = f"{BASE_URL}/"
            else:
                link["href"] = f"{BASE_URL}/{hreflang}/"
        else:
            if hreflang == "x-default":
                link["href"] = f"{BASE_URL}/{filename}"
            else:
                link["href"] = f"{BASE_URL}/{hreflang}/{filename}"
    
    # 7. Add language script
    head = soup.find("head")
    if head:
        lang_script = soup.new_tag("script")
        lang_script.string = f"localStorage.setItem('i18nextLng', '{lang_code}');"
        head.append(lang_script)
    
    return str(soup)


def generate_sitemap(all_urls):
    """
    Generate sitemap.xml content.
    
    Args:
        all_urls: List of all URLs to include
    
    Returns:
        str: XML sitemap content
    """
    today = datetime.now().strftime("%Y-%m-%d")
    
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    
    for url in sorted(all_urls):
        # Determine priority based on URL type
        if url == f"{BASE_URL}/" or url.endswith('/index.html'):
            priority = "1.0"
        elif '/tools' in url:
            priority = "0.9"
        else:
            priority = "0.8"
        
        xml_lines.append(f'''  <url>
    <loc>{url}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>{priority}</priority>
  </url>''')
    
    xml_lines.append('</urlset>')
    
    return '\n'.join(xml_lines)


def get_available_languages():
    """Get sorted list of available languages."""
    languages = []
    if os.path.exists(LOCALES_DIR):
        for filename in os.listdir(LOCALES_DIR):
            if filename.endswith(".json"):
                languages.append(filename.replace(".json", ""))
    return sorted(languages)


def main():
    """Main function."""
    print("=" * 70)
    print("🚀 Static Site Generator for i18n - v3.0 (Multi-Page + Sitemap)")
    print("=" * 70)
    
    # 1. Discover HTML files in ROOT only
    print("\n📂 Scanning ROOT directory for HTML files...")
    html_files = discover_root_html_files()
    
    if not html_files:
        print("❌ No HTML files found in root directory!")
        return
    
    print(f"   Found {len(html_files)} HTML file(s):")
    for filename, _ in html_files:
        print(f"      • {filename}")
    
    # 2. Get languages
    languages = get_available_languages()
    if not languages:
        print("\n❌ No translation files found!")
        return
    
    print(f"\n🌍 Languages ({len(languages)}): {', '.join(languages)}")
    
    # 3. Process each language
    print("\n" + "-" * 70)
    print("🔄 Processing...")
    print("-" * 70)
    
    all_urls = []  # For sitemap
    success_count = 0
    error_count = 0
    
    # Add root URLs (English default)
    for filename, _ in html_files:
        if filename == "index.html":
            all_urls.append(f"{BASE_URL}/")
        else:
            all_urls.append(f"{BASE_URL}/{filename}")
    
    for lang_code in languages:
        try:
            json_path = os.path.join(LOCALES_DIR, f"{lang_code}.json")
            translations = load_json_file(json_path)
            
            # Create language folder
            lang_dir = os.path.join(BASE_DIR, lang_code)
            os.makedirs(lang_dir, exist_ok=True)
            
            rtl_indicator = " (RTL)" if lang_code in RTL_LANGUAGES else ""
            print(f"\n📁 {lang_code}{rtl_indicator}:")
            
            # Process each HTML file
            for filename, abs_path in html_files:
                try:
                    with open(abs_path, "r", encoding="utf-8") as f:
                        html_content = f.read()
                    
                    processed_html = process_html_for_language(
                        html_content, translations, lang_code, filename
                    )
                    
                    output_path = os.path.join(lang_dir, filename)
                    with open(output_path, "w", encoding="utf-8") as f:
                        f.write(processed_html)
                    
                    # Add to sitemap URLs
                    if filename == "index.html":
                        all_urls.append(f"{BASE_URL}/{lang_code}/")
                    else:
                        all_urls.append(f"{BASE_URL}/{lang_code}/{filename}")
                    
                    print(f"   ✅ {filename}")
                    success_count += 1
                    
                except Exception as e:
                    print(f"   ❌ {filename}: {e}")
                    error_count += 1
                    
        except Exception as e:
            print(f"\n❌ {lang_code}: {e}")
            error_count += 1
    
    # 4. Generate Sitemap
    print("\n" + "-" * 70)
    print("🗺️  Generating sitemap.xml...")
    
    sitemap_content = generate_sitemap(all_urls)
    sitemap_path = os.path.join(BASE_DIR, "sitemap.xml")
    
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write(sitemap_content)
    
    print(f"   ✅ sitemap.xml generated with {len(all_urls)} URLs")
    
    # 5. Summary
    print("\n" + "=" * 70)
    print("📊 Summary:")
    print("=" * 70)
    print(f"   📄 Source files:     {len(html_files)}")
    print(f"   🌍 Languages:        {len(languages)}")
    print(f"   📁 Files generated:  {success_count}")
    print(f"   🗺️  Sitemap URLs:     {len(all_urls)}")
    print(f"   ❌ Errors:           {error_count}")
    
    if error_count == 0:
        print("\n🎉 All files generated successfully!")
    else:
        print(f"\n⚠️ Completed with {error_count} error(s).")


if __name__ == "__main__":
    main()
