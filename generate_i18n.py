import os

def main():
    # 1. Input
    file_path = "index.html"
    if not os.path.exists(file_path):
        print(f"Error: {file_path} does not exist.")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        original_content = f.read()

    # 2. Target Languages
    languages = ['ar', 'es', 'fr', 'de', 'ru', 'zh', 'pt', 'ja', 'ko', 'it', 'nl', 'pl', 'tr', 'vi', 'th', 'id', 'hi', 'uk', 'el', 'sv', 'no', 'da', 'fi', 'cs', 'hu', 'ro', 'sk', 'ms', 'he']

    # 3. Process Loop
    for lang_code in languages:
        # a. Create new directory
        dir_path = os.path.join(".", lang_code)
        os.makedirs(dir_path, exist_ok=True)

        # b. Copy content (in memory)
        new_content = original_content

        # 4. File Modifications

        # a. Fix Canonical Tag
        # Note: The file has an ID "canonical-link" which was not in the strict prompt.
        # We handle both cases to ensure it works.
        target_canonical_strict = '<link rel="canonical" href="https://savetik-fast.xyz/">'
        target_canonical_actual = '<link rel="canonical" href="https://savetik-fast.xyz/" id="canonical-link">'
        replacement_canonical = f'<link rel="canonical" href="https://savetik-fast.xyz/{lang_code}/">'
        
        if target_canonical_strict in new_content:
            new_content = new_content.replace(target_canonical_strict, replacement_canonical)
        elif target_canonical_actual in new_content:
            new_content = new_content.replace(target_canonical_actual, replacement_canonical)
        
        # b. Fix HTML Lang Attribute
        target_lang = '<html lang="en">'
        replacement_lang = f'<html lang="{lang_code}">'
        new_content = new_content.replace(target_lang, replacement_lang)

        # c. Add RTL Support
        if lang_code in ['ar', 'he']:
            # We just replaced it above, so now we replace the new tag with the RTL version
            target_rtl = f'<html lang="{lang_code}">'
            replacement_rtl = f'<html lang="{lang_code}" dir="rtl">'
            new_content = new_content.replace(target_rtl, replacement_rtl)

        # d. Inject Language Enforcer Script
        injection = f"<script>localStorage.setItem('i18nextLng', '{lang_code}');</script>"
        if '</head>' in new_content:
            # Insert immediately before closing head tag
            new_content = new_content.replace('</head>', f'{injection}\n</head>')

        # Write the file
        output_file = os.path.join(dir_path, "index.html")
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(new_content)
        
        print(f"Processed: {lang_code}")

if __name__ == "__main__":
    main()
