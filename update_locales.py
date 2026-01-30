import json
import os

locales_dir = r"c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\src\locales\locales"
en_path = os.path.join(locales_dir, "en.json")

# Keys to ensure exist in 'downloader'
required_keys = {
    "download_nwm": "Download No Watermark",
    "download_hd": "Download HD",
    "download_story_vid": "Download Story (Video)",
    "download_story_img": "Download Story (Image)"
}

# Read English file to get structure if needed, but we have hardcoded required keys for safety
try:
    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
        # optionally update required_keys from en_data if we wanted dynamic sync
except Exception as e:
    print(f"Error reading en.json: {e}")
    exit(1)

# Iterate over all json files
count = 0
for filename in os.listdir(locales_dir):
    if filename.endswith(".json") and filename != "en.json": # Skip en.json as it's the source
        file_path = os.path.join(locales_dir, filename)
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if "downloader" not in data:
                data["downloader"] = {}
            
            modified = False
            for key, default_val in required_keys.items():
                if key not in data["downloader"]:
                    data["downloader"][key] = default_val # Use English default
                    modified = True
                    print(f"Added {key} to {filename}")
            
            if modified:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                count += 1
                
        except Exception as e:
            print(f"Error processing {filename}: {e}")

print(f"Updated {count} files.")
