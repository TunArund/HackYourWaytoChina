#!/usr/bin/env python3
"""
restore_shop_keys.py — Restore shop.* keys from git history

Extract shop keys from commit 93c2c62 and add to current i18n
"""

import json
import subprocess
import sys
import io
from pathlib import Path

# Fix Unicode output on Windows
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

ROOT = Path(__file__).parent.parent
I18N_DIR = ROOT / "src" / "i18n"


def get_shop_keys(old_data):
    """Extract all shop.* keys from old data"""
    shop_keys = {}
    for key, value in old_data.items():
        if key.startswith('shop.'):
            shop_keys[key] = value
    return shop_keys


def get_old_i18n(lang_code):
    """Get i18n from old commit"""
    result = subprocess.run(
        ["git", "show", f"93c2c62:src/i18n/{lang_code}.json"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding='utf-8'
    )
    if result.returncode != 0:
        print(f"  ⚠️  Could not fetch old {lang_code}.json")
        return None
    return json.loads(result.stdout)


def main():
    print("🔨 Restoring shop.* keys from git history")
    print("=" * 60)
    print()

    for lang_file in I18N_DIR.glob("*.json"):
        lang_code = lang_file.stem
        print(f"{lang_code}.json:")

        # Load current
        with open(lang_file, "r", encoding="utf-8") as f:
            current = json.load(f)

        # Get old version
        old = get_old_i18n(lang_code)
        if not old:
            continue

        # Extract shop keys
        shop_keys = get_shop_keys(old)
        if shop_keys:
            # Add to current (flat keys at root level)
            for key, value in shop_keys.items():
                current[key] = value
            print(f"  ✓ Restored {len(shop_keys)} shop.* keys")
        else:
            print("  No shop keys found")

        # Write back
        with open(lang_file, "w", encoding="utf-8") as f:
            json.dump(current, f, ensure_ascii=False, indent=2)

        print()

    print("✅ All shop keys restored")


if __name__ == "__main__":
    main()
