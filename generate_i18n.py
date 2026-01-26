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


def discover_html_files():
    """
    Discover all HTML files in ROOT and allowed subdirectories.
    Excludes: language folders, locales, special directories.
    Includes: tools/ and other content subdirectories.
    
    Returns:
        list of tuples: [(relative_path, absolute_path), ...]
        Example: [("index.html", "C:/site/index.html"), 
                  ("tools/index.html", "C:/site/tools/index.html")]
    """
    html_files = []
    
    # Directories to exclude (language codes + system dirs)
    excluded_dirs = LANGUAGE_CODES | {'locales', 'js', 'css', 'node_modules', '.git', '.github', '__pycache__', 'mp3', 'story'}
    
    for root, dirs, files in os.walk(BASE_DIR):
        # Calculate relative path from BASE_DIR
        rel_root = os.path.relpath(root, BASE_DIR)
        
        # Skip excluded directories - modify dirs in-place
        dirs[:] = [d for d in dirs if d not in excluded_dirs]
        
        # Find HTML files
        for filename in files:
            if filename.endswith('.html') and filename not in EXCLUDED_FILES:
                abs_path = os.path.join(root, filename)
                
                # Build relative path
                if rel_root == '.':
                    rel_path = filename
                else:
                    rel_path = os.path.join(rel_root, filename).replace('\\', '/')
                
                html_files.append((rel_path, abs_path))
    
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
        # Handle paths like "index.html", "about.html", "tools/index.html"
        if filename == "index.html":
            canonical_path = f"/{lang_code}/"
        elif filename.endswith("/index.html"):
            # e.g., tools/index.html -> /tr/tools/
            folder = filename.replace("/index.html", "")
            canonical_path = f"/{lang_code}/{folder}/"
        else:
            canonical_path = f"/{lang_code}/{filename}"
        canonical_link["href"] = f"{BASE_URL}{canonical_path}"
    
    # 6. Update Hreflang links (Dynamic Injection)
    # Remove existing hreflangs first to avoid cleanup issues
    for link in soup.find_all("link", attrs={"rel": "alternate", "hreflang": True}):
        link.decompose()

    # Create new hreflang tags for all languages + x-default
    sorted_langs = sorted(list(LANGUAGE_CODES))
    head = soup.find("head")
    
    if head:
        # Determine current path suffix
        if filename == "index.html":
            base_suffix = ""
        elif filename.endswith("/index.html"):
            base_suffix = filename.replace("/index.html", "") + "/"
        else:
            base_suffix = filename

        # Add x-default
        x_def = soup.new_tag("link", rel="alternate", hreflang="x-default")
        x_def["href"] = f"{BASE_URL}/{base_suffix}"
        head.append(x_def)
        head.append(BeautifulSoup("\n    ", 'html.parser'))

        # Add all languages
        for code in sorted_langs:
            link = soup.new_tag("link", rel="alternate", hreflang=code)
            link["href"] = f"{BASE_URL}/{code}/{base_suffix}"
            head.append(link)
            head.append(BeautifulSoup("\n    ", 'html.parser'))
    
    # 7. Add language script
    head = soup.find("head")
    if head:
        lang_script = soup.new_tag("script")
        lang_script.string = f"localStorage.setItem('i18nextLng', '{lang_code}');"
        head.append(lang_script)
        
        # Add Manifest
        manifest_link = soup.new_tag("link", rel="manifest", href="/manifest.json")
        head.append(manifest_link)
    
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
    
    # 1. Discover HTML files (root + subdirectories like tools/)
    print("\n📂 Scanning for HTML files...")
    html_files = discover_html_files()
    
    if not html_files:
        print("❌ No HTML files found!")
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
    for rel_path, _ in html_files:
        if rel_path == "index.html":
            all_urls.append(f"{BASE_URL}/")
        elif rel_path.endswith("/index.html"):
            folder = rel_path.replace("/index.html", "")
            all_urls.append(f"{BASE_URL}/{folder}/")
        else:
            all_urls.append(f"{BASE_URL}/{rel_path}")
    
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
            for rel_path, abs_path in html_files:
                try:
                    with open(abs_path, "r", encoding="utf-8") as f:
                        html_content = f.read()
                    
                    processed_html = process_html_for_language(
                        html_content, translations, lang_code, rel_path
                    )
                    
                    # Create subdirectory if needed (e.g., tr/tools/)
                    output_rel_dir = os.path.dirname(rel_path)
                    if output_rel_dir:
                        output_subdir = os.path.join(lang_dir, output_rel_dir)
                        os.makedirs(output_subdir, exist_ok=True)
                    
                    # Save file
                    output_path = os.path.join(lang_dir, rel_path.replace('/', os.sep))
                    with open(output_path, "w", encoding="utf-8") as f:
                        f.write(processed_html)
                    
                    # Add to sitemap URLs
                    if rel_path == "index.html":
                        all_urls.append(f"{BASE_URL}/{lang_code}/")
                    elif rel_path.endswith("/index.html"):
                        folder = rel_path.replace("/index.html", "")
                        all_urls.append(f"{BASE_URL}/{lang_code}/{folder}/")
                    else:
                        all_urls.append(f"{BASE_URL}/{lang_code}/{rel_path}")
                    
                    print(f"   ✅ {rel_path}")
                    success_count += 1
                    
                except Exception as e:
                    print(f"   ❌ {rel_path}: {e}")
                    error_count += 1
                    
        except Exception as e:
            print(f"\n❌ {lang_code}: {e}")
            error_count += 1
    
    # 3.5. Add pre-generated pages (MP3, Story) to sitemap
    print("\n🔍 Scanning for pre-generated pages (mp3, story)...")
    for extra_folder in ['mp3', 'story']:
        folder_path = os.path.join(BASE_DIR, extra_folder)
        if os.path.exists(folder_path):
            count = 0
            for root, dirs, files in os.walk(folder_path):
                for file in files:
                    if file == 'index.html':
                        # Get relative path
                        rel_path = os.path.relpath(os.path.join(root, file), BASE_DIR)
                        # Normalize path for URL
                        url_path = rel_path.replace('\\', '/')
                        
                        # Create full URL
                        if url_path.endswith('index.html'):
                            url_path = url_path[:-10] # remove 'index.html'
                            
                        full_url = f"{BASE_URL}/{url_path}"
                        
                        # Add if not already present (avoid duplicates)
                        if full_url not in all_urls:
                            all_urls.append(full_url)
                            count += 1
            print(f"   ➕ Added {count} URLs from {extra_folder}/")

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
