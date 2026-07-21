#!/usr/bin/env python3
"""
add_guizhou_city_data.py — Add city.guizhou.* keys for all languages

Guizhou is a province, not a city, but SOUVENIR_CITIES includes it
"""

import json
import sys
import io
from pathlib import Path

# Fix Unicode output on Windows
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

ROOT = Path(__file__).parent.parent
I18N_DIR = ROOT / "src" / "i18n"

# Guizhou city data for each language
GUIZHOU_DATA = {
    'en': {
        'city.guizhou.label': 'Guizhou',
        'city.guizhou.name': 'Guizhou',
    },
    'zh': {
        'city.guizhou.label': '贵州',
        'city.guizhou.name': '贵州',
    },
    'ja': {
        'city.guizhou.label': '貴州',
        'city.guizhou.name': '貴州',
    },
    'ko': {
        'city.guizhou.label': '구이저우',
        'city.guizhou.name': '구이저우',
    },
    'ru': {
        'city.guizhou.label': 'Гуйчжоу',
        'city.guizhou.name': 'Гуйчжоу',
    },
    'vi': {
        'city.guizhou.label': 'Quý Châu',
        'city.guizhou.name': 'Quý Châu',
    }
}


def main():
    print("🔨 Adding city.guizhou.* keys")
    print("=" * 60)
    print()

    for lang_file in I18N_DIR.glob("*.json"):
        lang_code = lang_file.stem
        print(f"{lang_code}.json:")

        with open(lang_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        if lang_code in GUIZHOU_DATA:
            for key, value in GUIZHOU_DATA[lang_code].items():
                data[key] = value
            print(f"  ✓ Added {len(GUIZHOU_DATA[lang_code])} keys")

            # Write back
            with open(lang_file, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        else:
            print("  ⚠️  No data for this language")

        print()

    print("✅ All guizhou keys added")


if __name__ == "__main__":
    main()
