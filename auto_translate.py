import json
import os
import time
from deep_translator import GoogleTranslator

locales_dir = r"c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\src\locales\locales"
en_path = os.path.join(locales_dir, "en.json")

with open(en_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

def translate_obj(target_obj, en_obj, lang_code, prefix=""):
    modified = False
    
    for key, en_val in en_obj.items():
        if isinstance(en_val, dict):
            if key not in target_obj:
                target_obj[key] = {}
            if translate_obj(target_obj[key], en_val, lang_code, f"{prefix}{key}."):
                modified = True
        elif isinstance(en_val, str):
            target_val = target_obj.get(key)
            
            if target_val is None or target_val == en_val:
                # skip short words
                if len(en_val) <= 2 and not any(c.isalpha() for c in en_val):
                    target_obj[key] = en_val
                    continue
                    
                print(f"Translating [{lang_code}] {prefix}{key}: {en_val[:30]}...")
                try:
                    translated = GoogleTranslator(source='en', target=lang_code).translate(en_val)
                    target_obj[key] = translated
                    modified = True
                    time.sleep(0.2) # sleep to avoid rate limits
                except Exception as e:
                    print(f"Error translating: {e}")
                    # Sleep longer on error
                    time.sleep(5.0)
                    
    return modified

def get_google_lang(lang_code):
    mapping = {
        'zh-CN': 'zh-CN',
        'zh-TW': 'zh-TW',
        'in': 'id', # Indonesian
        'pt-BR': 'pt'
    }
    return mapping.get(lang_code, lang_code.split('-')[0])

for filename in os.listdir(locales_dir):
    if not filename.endswith(".json") or filename == "en.json":
        continue
        
    lang_code = filename.replace(".json", "")
    g_lang = get_google_lang(lang_code)
    
    file_path = os.path.join(locales_dir, filename)
    print(f"\n--- Processing {filename} ---")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            target_data = json.load(f)
    except Exception:
        target_data = {}
        
    modified = translate_obj(target_data, en_data, g_lang)
    
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(target_data, f, ensure_ascii=False, indent=2)
        print(f"Saved {filename}")
    else:
        print(f"No changes for {filename}")
