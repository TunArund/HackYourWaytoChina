#!/usr/bin/env python3
"""
restore_detail_sections.py — Restore s8_detail and s9_detail from git history

Extract from commit 93c2c62 and merge into current s8.detail and s9.detail
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
    print("🔨 Restoring detail sections from git history")
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

        # Merge s8_detail
        if 's8_detail' in old:
            if 's8' not in current:
                current['s8'] = {}
            current['s8']['detail'] = old['s8_detail']
            print(f"  ✓ Restored s8.detail ({len(old['s8_detail'])} keys)")

        # Merge s9_detail
        if 's9_detail' in old:
            if 's9' not in current:
                current['s9'] = {}
            current['s9']['detail'] = old['s9_detail']
            print(f"  ✓ Restored s9.detail ({len(old['s9_detail'])} keys)")

        # Write back
        with open(lang_file, "w", encoding="utf-8") as f:
            json.dump(current, f, ensure_ascii=False, indent=2)

        print()

    print("✅ All detail sections restored")


if __name__ == "__main__":
    main()
