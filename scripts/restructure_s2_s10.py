#!/usr/bin/env python3
"""
restructure_s2_s10.py — Add proper structure for S2-S10 in i18n files

Defines meta/sections structure for remaining sections
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


def restructure_s2_to_s10(data):
    """Add meta wrapper to s2-s10 if needed"""

    for i in range(2, 11):
        key = f"s{i}"
        if key not in data or not isinstance(data[key], dict):
            continue

        section = data[key]

        # If already has meta/sections structure, skip
        if "meta" in section:
            continue

        # Extract title and sub if they exist at root level
        title = section.pop("title", "")
        sub = section.pop("sub", "")

        # Create new structure
        new_section = {
            "meta": {
                "title": title,
                "sub": sub
            }
        }

        # Keep everything else (cards, detail, etc.) at root level
        new_section.update(section)

        data[key] = new_section

    return data


def process_file(filepath):
    """Process a single i18n JSON file"""
    print(f"Processing {filepath.name}...")

    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Apply restructuring
    data = restructure_s2_to_s10(data)

    # Write back
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"  ✓ {filepath.name} updated")


def main():
    print("🔨 Restructure S2-S10 with meta wrapper")
    print("=" * 60)
    print()

    for filepath in sorted(I18N_DIR.glob("*.json")):
        process_file(filepath)

    print()
    print("✅ All sections now have meta/sections structure")


if __name__ == "__main__":
    main()
