#!/usr/bin/env python3
"""
restore_city_keys.py — Restore all city.* keys from git history

Extract city keys from commit 93c2c62 and add to current i18n
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


def get_city_keys(old_data):
    """Extract all city.* keys from old data"""
    city_keys = {}
    for key, value in old_data.items():
        if key.startswith('city.'):
            city_keys[key] = value
    return city_keys


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
    print("🔨 Restoring city.* keys from git history")
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

        # Extract city keys
        city_keys = get_city_keys(old)

        # Count how many are new
        new_count = 0
        for key, value in city_keys.items():
            if key not in current:
                current[key] = value
                new_count += 1

        if new_count > 0:
            print(f"  ✓ Added {new_count} missing city.* keys")
        else:
            print("  Already complete")

        # Write back
        with open(lang_file, "w", encoding="utf-8") as f:
            json.dump(current, f, ensure_ascii=False, indent=2)

        print()

    print("✅ All city keys restored")


if __name__ == "__main__":
    main()
