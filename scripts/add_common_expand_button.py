#!/usr/bin/env python3
"""
add_common_expand_button.py — Add common expand button text to app section

Add app.buttons.expand and app.buttons.browse for all card expand hints
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

# Common button texts for each language
BUTTON_TEXTS = {
    'en': {
        'expand': '[ Expand → ]',
        'browse': '[ Browse cities → ]',
    },
    'zh': {
        'expand': '[ 展开查看 → ]',
        'browse': '[ 浏览城市 → ]',
    },
    'ja': {
        'expand': '[ 展開 → ]',
        'browse': '[ 都市を見る → ]',
    },
    'ko': {
        'expand': '[ 펼치기 → ]',
        'browse': '[ 도시 보기 → ]',
    },
    'ru': {
        'expand': '[ Развернуть → ]',
        'browse': '[ Обзор городов → ]',
    },
    'vi': {
        'expand': '[ Mở rộng → ]',
        'browse': '[ Duyệt thành phố → ]',
    }
}


def main():
    print("🔨 Adding common expand/browse button texts")
    print("=" * 60)
    print()

    for lang_file in I18N_DIR.glob("*.json"):
        lang_code = lang_file.stem
        print(f"{lang_code}.json:")

        with open(lang_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        if lang_code not in BUTTON_TEXTS:
            print("  ⚠️  No data for this language")
            continue

        # Ensure app.buttons exists
        if 'app' not in data:
            data['app'] = {}
        if 'buttons' not in data['app']:
            data['app']['buttons'] = {}

        # Add button texts
        for key, value in BUTTON_TEXTS[lang_code].items():
            data['app']['buttons'][key] = value

        print(f"  ✓ Added {len(BUTTON_TEXTS[lang_code])} button texts")

        # Write back
        with open(lang_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print()

    print("✅ All button texts added")


if __name__ == "__main__":
    main()
