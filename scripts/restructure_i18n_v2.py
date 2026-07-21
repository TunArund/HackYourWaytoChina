#!/usr/bin/env python3
"""
restructure_i18n_v2.py — Radical restructuring of i18n files

Transforms flat/mixed structure into logical nested hierarchy.

Before:
  s1.purposeTourism, s1.durationShort, s1.onwardYes

After:
  s1.purpose.tourism, s1.duration.short, s1.onward.yes
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


def restructure_app(old):
    """Restructure app section"""
    return {
        "nav": {
            "title": old.get("topBarTitle", ""),
            "versionSwitch": {
                "toLong": old.get("versionSwitchToLong", ""),
                "toShort": old.get("versionSwitchToShort", "")
            }
        },
        "cover": {
            "title": old.get("coverTitle", ""),
            "subtitle": old.get("coverSubtitle", ""),
            "footer": old.get("coverFooter", ""),
            "short": {
                "label": old.get("coverShortLabel", ""),
                "tagline": old.get("coverShortTagline", ""),
                "examples": old.get("coverShortExamples", "")
            },
            "long": {
                "label": old.get("coverLongLabel", ""),
                "tagline": old.get("coverLongTagline", ""),
                "examples": old.get("coverLongExamples", "")
            }
        },
        "buttons": {
            "reset": old.get("resetButton", ""),
            "back": old.get("backToResult", ""),
            "details": old.get("visaDetailButton", ""),
            "expand": "[ Expand → ]"
        },
        "links": {
            "official": old.get("officialLinks", "")
        },
        "hints": {
            "scroll": old.get("scrollHint", "")
        }
    }


def restructure_s1(old):
    """Restructure s1 section"""
    return {
        "meta": {
            "title": old.get("title", ""),
            "sub": old.get("sub", "")
        },
        "questions": {
            "q1": old.get("q1", ""),
            "q2": old.get("q2", ""),
            "q3": old.get("q3", ""),
            "q4": old.get("q4", "")
        },
        "purpose": {
            "tourism": old.get("purposeTourism", ""),
            "business": old.get("purposeBusiness", ""),
            "family": old.get("purposeFamily", ""),
            "transit": old.get("purposeTransit", ""),
            "work": old.get("purposeWork", "")
        },
        "duration": {
            "short": old.get("durationShort", ""),
            "medium": old.get("durationMedium", ""),
            "long": old.get("durationLong", ""),
            "xlong": old.get("durationXlong", "")
        },
        "onward": {
            "yes": old.get("onwardYes", ""),
            "no": old.get("onwardNo", "")
        },
        "placeholder": old.get("placeholder", "")
    }


def restructure_city(old_cities):
    """Restructure city section - remove 'name' field (use 'label' instead)"""
    new_cities = {}
    for key, city in old_cities.items():
        if isinstance(city, dict):
            new_cities[key] = {
                "label": city.get("name", ""),
                "desc": city.get("desc", ""),
                "tag": city.get("tag", "")
            }
        else:
            new_cities[key] = city
    return new_cities


def restructure_clinic(old_clinics):
    """Restructure clinic section - rename 'name' to 'label'"""
    new_clinics = {}
    for key, clinic in old_clinics.items():
        if isinstance(clinic, dict):
            new_clinics[key] = {
                "label": clinic.get("name", ""),
                "desc": clinic.get("desc", "")
            }
        else:
            new_clinics[key] = clinic
    return new_clinics


def merge_detail_sections(data):
    """Merge s7_detail, s8_detail, s9_detail into s7.detail, s8.detail, s9.detail"""
    for i in [7, 8, 9]:
        section_key = f"s{i}"
        detail_key = f"s{i}_detail"

        if detail_key in data:
            if section_key not in data:
                data[section_key] = {}
            if "detail" not in data[section_key]:
                data[section_key]["detail"] = {}

            # Merge detail content
            data[section_key]["detail"].update(data[detail_key])
            del data[detail_key]

    return data


def restructure_data(data):
    """Apply all restructuring transformations"""
    new_data = {}

    # App section
    if "app" in data:
        new_data["app"] = restructure_app(data["app"])

    # Countries (no change)
    if "countries" in data:
        new_data["countries"] = data["countries"]

    # s0 (no content - cover page uses app.cover)
    new_data["s0"] = {}

    # s1 - Visa checker
    if "s1" in data:
        new_data["s1"] = restructure_s1(data["s1"])

    # Merge detail sections before copying s2-s10
    data = merge_detail_sections(data)

    # s2-s10 - Keep for now (will restructure in next iteration)
    for i in range(2, 11):
        key = f"s{i}"
        if key in data:
            new_data[key] = data[key]

    # City section
    if "city" in data:
        new_data["city"] = restructure_city(data["city"])

    # Clinic section
    if "clinic" in data:
        new_data["clinic"] = restructure_clinic(data["clinic"])

    # Visa section (keep for now)
    if "visa" in data:
        new_data["visa"] = data["visa"]

    return new_data


def process_file(filepath):
    """Process a single i18n JSON file"""
    print(f"Restructuring {filepath.name}...")

    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Apply restructuring
    new_data = restructure_data(data)

    # Backup original
    backup_path = filepath.with_suffix(".json.bak")
    with open(backup_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # Write new structure
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(new_data, f, ensure_ascii=False, indent=2)

    print(f"  ✓ {filepath.name} restructured (backup: {backup_path.name})")


def main():
    print("🔨 i18n Structure V2 - Radical Restructuring")
    print("=" * 60)
    print()

    for filepath in sorted(I18N_DIR.glob("*.json")):
        process_file(filepath)

    print()
    print("✅ All i18n files restructured")
    print()
    print("📝 Next steps:")
    print("  1. Update JS: t('s1.purposeTourism') → t('s1.purpose.tourism')")
    print("  2. Update HTML: data-i18n='s1.purposeTourism' → data-i18n='s1.purpose.tourism'")
    print("  3. Test each section")
    print()
    print("⚠️  Backups saved as *.json.bak - restore if needed")


if __name__ == "__main__":
    main()
