#!/usr/bin/env python3
"""
add_missing_price_fields.py — Add missing _price fields to s8.detail.electronics

Add price information for electronics items in all languages
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

# Price data (same for all languages)
PRICES = {
    'foldable_price': '¥5,000-15,000',
    'drone_price': '¥2,000-8,000',
    'ai_glasses_price': '¥1,500-3,000',
    'translator_price': '¥300-1,500',
    'earbuds_price': '¥100-500'
}


def main():
    print("🔨 Adding missing _price fields")
    print("=" * 60)
    print()

    for lang_file in I18N_DIR.glob("*.json"):
        lang_code = lang_file.stem
        print(f"{lang_code}.json:")

        with open(lang_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Check if s8.detail.electronics exists
        if 's8' not in data or 'detail' not in data['s8'] or 'electronics' not in data['s8']['detail']:
            print("  ⚠️  No s8.detail.electronics")
            continue

        electronics = data['s8']['detail']['electronics']
        added = 0

        # Add missing price fields
        for key, value in PRICES.items():
            if key not in electronics:
                electronics[key] = value
                added += 1

        if added > 0:
            print(f"  ✓ Added {added} price fields")

            # Write back
            with open(lang_file, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        else:
            print("  Already complete")

        print()

    print("✅ All price fields added")


if __name__ == "__main__":
    main()
