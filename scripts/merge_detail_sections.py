#!/usr/bin/env python3
"""
merge_detail_sections.py — Merge s8_detail and s9_detail into s8.detail and s9.detail

Restore detail sections that were accidentally removed during i18n restructure
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


def merge_detail(data):
    """Merge s8_detail and s9_detail into s8.detail and s9.detail"""

    # Merge s8_detail into s8.detail
    if 's8_detail' in data:
        if 's8' not in data:
            data['s8'] = {}
        data['s8']['detail'] = data.pop('s8_detail')
        print("  ✓ Merged s8_detail → s8.detail")

    # Merge s9_detail into s9.detail
    if 's9_detail' in data:
        if 's9' not in data:
            data['s9'] = {}
        data['s9']['detail'] = data.pop('s9_detail')
        print("  ✓ Merged s9_detail → s9.detail")

    return data


def main():
    print("🔨 Merging detail sections")
    print("=" * 60)
    print()

    for lang_file in I18N_DIR.glob("*.json"):
        lang_code = lang_file.stem

        with open(lang_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        print(f"{lang_code}.json:")

        # Check if already has s8.detail or s9.detail
        has_s8_detail = 's8' in data and 'detail' in data.get('s8', {})
        has_s9_detail = 's9' in data and 'detail' in data.get('s9', {})

        if has_s8_detail and has_s9_detail:
            print("  Already merged")
        else:
            data = merge_detail(data)

            # Write back
            with open(lang_file, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

        print()

    print("✅ All detail sections merged")


if __name__ == "__main__":
    main()
