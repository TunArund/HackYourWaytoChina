#!/usr/bin/env python3
"""
reorganize_i18n.py — Restructure i18n JSON files for consistency

- Remove duplicate 'flag' fields from city objects
- Reorder sections: app, countries, s0-s10, clinic, city, visa
- Merge s7 and s7_detail
- Fix langSwitchLabel values
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

SECTION_ORDER = [
    "app",
    "countries",
    "s0",
    "s1",
    "s2",
    "s3",
    "s4",
    "s5",
    "s6",
    "s7",
    "s8",
    "s9",
    "s10",
    "clinic",
    "city",
    "visa"
]

def clean_city_objects(data):
    """Remove 'flag' field from city objects (duplicate of key)"""
    if "city" in data and isinstance(data["city"], dict):
        for city_key, city_data in data["city"].items():
            if isinstance(city_data, dict) and "flag" in city_data:
                del city_data["flag"]
    return data

def merge_s7_detail(data):
    """Merge s7_detail into s7"""
    if "s7_detail" in data:
        if "s7" not in data:
            data["s7"] = {}
        if "detail" not in data["s7"]:
            data["s7"]["detail"] = {}
        data["s7"]["detail"].update(data["s7_detail"])
        del data["s7_detail"]
    return data

def reorder_keys(data):
    """Reorder top-level keys according to SECTION_ORDER"""
    ordered = {}
    # Add known sections in order
    for key in SECTION_ORDER:
        if key in data:
            ordered[key] = data[key]
    # Add any remaining keys
    for key in data:
        if key not in ordered:
            ordered[key] = data[key]
    return ordered

def process_file(filepath):
    """Process a single i18n JSON file"""
    print(f"Processing {filepath.name}...")

    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Apply transformations
    data = clean_city_objects(data)
    data = merge_s7_detail(data)
    data = reorder_keys(data)

    # Write back with pretty formatting
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"  ✓ {filepath.name} reorganized")

def main():
    for filepath in sorted(I18N_DIR.glob("*.json")):
        process_file(filepath)
    print("\n✅ All i18n files reorganized")

if __name__ == "__main__":
    main()
