#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Static Site Generator for i18n (Internationalization) - v2.0
=============================================================
Auto-Discovery Version: Processes ALL HTML files automatically.

Features:
- Auto-discovers all .html files in root directory
- Recursively finds HTML in subdirectories (like tools/)
- Excludes language folders to prevent reprocessing
- Generates translated versions with proper canonical URLs

Requirements:
- pip install beautifulsoup4

Author: Claude AI Assistant
Date: 2026-01-25
"""

import os
import sys
import json
import re
import glob
from bs4 import BeautifulSoup

# Fix Windows console encoding for Arabic/Unicode output
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ===============================
# Configuration
# ===============================

# Base directory (where the script is located)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Locales directory containing JSON translation files
LOCALES_DIR = os.path.join(BASE_DIR, "locales")

# Base URL of the website
BASE_URL = "https://savetik-fast.xyz"

# RTL (Right-to-Left) languages
RTL_LANGUAGES = ['ar', 'he']

# Directories to EXCLUDE from scanning (won't be searched for source HTML)
# These are the output language folders + other non-source directories
EXCLUDED_DIRS = {
    'locales', 'js', 'css', 'images', 'assets', 'node_modules', 
    '.git', '.github', '__pycache__', 'vendor'
}

# Files to EXCLUDE from processing
EXCLUDED_FILES = {'404.html'}


def get_language_codes():
    """
    Get all language codes from the locales directory.
    Returns a set of 2-letter language codes.
    """
    codes = set()
    if os.path.exists(LOCALES_DIR):
        for filename in os.listdir(LOCALES_DIR):
            if filename.endswith('.json'):
                codes.add(filename.replace('.json', ''))
    return codes


# Add language folder codes to excluded dirs
LANGUAGE_CODES = get_language_codes()
EXCLUDED_DIRS.update(LANGUAGE_CODES)


def load_json_file(filepath):
    """Load JSON file and return as dictionary."""
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def get_nested_value(data, key_path):
    """
    Get nested value from dictionary using dot notation.
    Example: get_nested_value(data, "hero.title") -> data["hero"]["title"]
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
    Parse data-i18n attribute value.
    
    Formats:
    - "hero.title" -> (None, "hero.title") -> replace element text
    - "[placeholder]key" -> ("placeholder", "key") -> replace attribute
    - "[content]meta.description" -> ("content", "meta.description")
    """
    match = re.match(r'\[([^\]]+)\](.+)', attr_value)
    
    if match:
        return (match.group(1), match.group(2))
    else:
        return (None, attr_value)


def discover_html_files():
    """
    Auto-discover all HTML files that should be processed.
    
    Returns:
        list of tuples: [(relative_path, absolute_path), ...]
        Example: [("index.html", "C:/site/index.html"), 
                  ("about.html", "C:/site/about.html"),
                  ("tools/index.html", "C:/site/tools/index.html")]
    """
    html_files = []
    
    for root, dirs, files in os.walk(BASE_DIR):
        # Calculate relative path from BASE_DIR
        rel_root = os.path.relpath(root, BASE_DIR)
        
        # Skip excluded directories
        # Modify dirs in-place to prevent os.walk from descending into them
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
        
        # Find HTML files in current directory
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


def process_html_for_language(html_content, translations, lang_code, relative_path):
    """
    Process HTML content and apply translations.
    
    Args:
        html_content: Original HTML string
        translations: Dictionary of translations from JSON
        lang_code: Language code (e.g., 'ar', 'tr')
        relative_path: Relative path of the file (e.g., 'tools/index.html')
    
    Returns:
        str: Translated HTML content
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # ===============================
    # 1. Process all data-i18n elements
    # ===============================
    elements_with_i18n = soup.find_all(attrs={"data-i18n": True})
    
    for element in elements_with_i18n:
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
        
        # Remove data-i18n attribute (no longer needed)
        del element["data-i18n"]
    
    # ===============================
    # 2. Update <html lang> attribute
    # ===============================
    html_tag = soup.find("html")
    if html_tag:
        html_tag["lang"] = lang_code
        
        if lang_code in RTL_LANGUAGES:
            html_tag["dir"] = "rtl"
        elif html_tag.get("dir"):
            del html_tag["dir"]
    
    # ===============================
    # 3. Update <title> tag
    # ===============================
    title_tag = soup.find("title")
    if title_tag:
        meta_title = get_nested_value(translations, "meta.title")
        if meta_title:
            title_tag.string = meta_title
    
    # ===============================
    # 4. Update <meta description>
    # ===============================
    meta_desc = soup.find("meta", attrs={"name": "description"})
    if meta_desc:
        meta_description = get_nested_value(translations, "meta.description")
        if meta_description:
            meta_desc["content"] = meta_description
    
    # ===============================
    # 5. Update Canonical URL (with correct path)
    # ===============================
    canonical_link = soup.find("link", attrs={"rel": "canonical"})
    if canonical_link:
        # Build correct canonical path
        # Example: tools/index.html in 'tr' folder -> /tr/tools/
        if relative_path == "index.html":
            canonical_path = f"/{lang_code}/"
        elif relative_path.endswith("/index.html"):
            # e.g., tools/index.html -> /tr/tools/
            folder_path = relative_path.replace("/index.html", "").replace("\\", "/")
            canonical_path = f"/{lang_code}/{folder_path}/"
        else:
            # e.g., about.html -> /tr/about.html
            canonical_path = f"/{lang_code}/{relative_path}"
        
        canonical_link["href"] = f"{BASE_URL}{canonical_path}"
    
    # ===============================
    # 6. Update Hreflang links (folder-based)
    # ===============================
    hreflang_links = soup.find_all("link", attrs={"rel": "alternate", "hreflang": True})
    for link in hreflang_links:
        hreflang = link.get("hreflang")
        
        # Build the correct path for each language
        if relative_path == "index.html":
            if hreflang == "x-default":
                link["href"] = f"{BASE_URL}/"
            else:
                link["href"] = f"{BASE_URL}/{hreflang}/"
        elif relative_path.endswith("/index.html"):
            folder_path = relative_path.replace("/index.html", "").replace("\\", "/")
            if hreflang == "x-default":
                link["href"] = f"{BASE_URL}/{folder_path}/"
            else:
                link["href"] = f"{BASE_URL}/{hreflang}/{folder_path}/"
        else:
            if hreflang == "x-default":
                link["href"] = f"{BASE_URL}/{relative_path}"
            else:
                link["href"] = f"{BASE_URL}/{hreflang}/{relative_path}"
    
    # ===============================
    # 7. Add language script to head
    # ===============================
    head = soup.find("head")
    if head:
        lang_script = soup.new_tag("script")
        lang_script.string = f"localStorage.setItem('i18nextLng', '{lang_code}');"
        head.append(lang_script)
    
    return str(soup)


def get_available_languages():
    """Get list of available languages from locales folder."""
    languages = []
    
    if not os.path.exists(LOCALES_DIR):
        print(f"⚠️  Warning: Locales directory '{LOCALES_DIR}' not found!")
        return languages
    
    for filename in os.listdir(LOCALES_DIR):
        if filename.endswith(".json"):
            lang_code = filename.replace(".json", "")
            languages.append(lang_code)
    
    return sorted(languages)


def main():
    """Main function to run the Static Site Generator."""
    print("=" * 70)
    print("🚀 Static Site Generator for i18n - v2.0 (Auto-Discovery)")
    print("=" * 70)
    
    # ===============================
    # 1. Discover all source HTML files
    # ===============================
    print("\n📂 Scanning for HTML files...")
    html_files = discover_html_files()
    
    if not html_files:
        print("❌ No HTML files found to process!")
        return
    
    print(f"   Found {len(html_files)} HTML file(s):")
    for rel_path, _ in html_files:
        print(f"      • {rel_path}")
    
    # ===============================
    # 2. Get available languages
    # ===============================
    languages = get_available_languages()
    
    if not languages:
        print("\n❌ No translation files found in locales folder!")
        return
    
    print(f"\n🌍 Languages detected ({len(languages)}): {', '.join(languages)}")
    
    # ===============================
    # 3. Process each language
    # ===============================
    print("\n" + "-" * 70)
    print("🔄 Processing...")
    print("-" * 70)
    
    total_files = 0
    success_count = 0
    error_count = 0
    
    for lang_code in languages:
        try:
            # Load translation file
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
                    # Read source file
                    with open(abs_path, "r", encoding="utf-8") as f:
                        html_content = f.read()
                    
                    # Process HTML
                    processed_html = process_html_for_language(
                        html_content, 
                        translations, 
                        lang_code,
                        rel_path
                    )
                    
                    # Create subdirectory if needed (e.g., tools/)
                    output_rel_dir = os.path.dirname(rel_path)
                    if output_rel_dir:
                        output_dir = os.path.join(lang_dir, output_rel_dir)
                        os.makedirs(output_dir, exist_ok=True)
                    
                    # Save translated file
                    output_path = os.path.join(lang_dir, rel_path.replace('/', os.sep))
                    with open(output_path, "w", encoding="utf-8") as f:
                        f.write(processed_html)
                    
                    print(f"   ✅ {rel_path}")
                    success_count += 1
                    total_files += 1
                    
                except Exception as e:
                    print(f"   ❌ {rel_path}: {e}")
                    error_count += 1
                    total_files += 1
            
        except FileNotFoundError:
            print(f"\n❌ {lang_code}: Translation file not found!")
            error_count += 1
        except json.JSONDecodeError as e:
            print(f"\n❌ {lang_code}: JSON parse error - {e}")
            error_count += 1
        except Exception as e:
            print(f"\n❌ {lang_code}: Unexpected error - {e}")
            error_count += 1
    
    # ===============================
    # 4. Summary
    # ===============================
    print("\n" + "=" * 70)
    print("📊 Summary:")
    print("=" * 70)
    print(f"   📄 Source files:     {len(html_files)}")
    print(f"   🌍 Languages:        {len(languages)}")
    print(f"   📁 Total generated:  {success_count}")
    print(f"   ✅ Successful:       {success_count}")
    print(f"   ❌ Errors:           {error_count}")
    
    if error_count == 0:
        print("\n🎉 All files generated successfully!")
    else:
        print(f"\n⚠️ Completed with {error_count} error(s).")


if __name__ == "__main__":
    main()
