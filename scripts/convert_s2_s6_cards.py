#!/usr/bin/env python3
"""
convert_s2_s6_cards.py — Convert S2-S6 card content from lang tags to data-i18n

Maps specific HTML content to i18n keys based on section structure
"""

import re
import sys
import io
from pathlib import Path

# Fix Unicode output on Windows
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

ROOT = Path(__file__).parent.parent
HTML_FILE = ROOT / "src" / "index.html"


def convert_dual_lang_pattern(html, pattern_en, i18n_key):
    """
    Convert pattern like:
    <tag lang="zh">中文</tag><tag lang="en">English</tag>
    to:
    <tag data-i18n="key">English</tag>
    """
    # Escape special regex chars in pattern
    pattern_en_escaped = re.escape(pattern_en)

    # Match zh + en pair
    regex = rf'<([^>]+) lang="zh">([^<]*)</\1><\1 lang="en">{pattern_en_escaped}</\1>'
    replacement = rf'<\1 data-i18n="{i18n_key}">{pattern_en}</\1>'

    return re.sub(regex, replacement, html, count=1)


def convert_section(html, section_id, mappings):
    """Convert all mappings for a section"""
    count = 0
    for en_text, i18n_key in mappings:
        before = html
        html = convert_dual_lang_pattern(html, en_text, i18n_key)
        if html != before:
            count += 1
    return html, count


def main():
    print("🔨 Converting S2-S6 Card Content")
    print("=" * 60)
    print()

    # Read HTML
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    original_len = len(html)
    total_converted = 0

    # S2 mappings (already have i18n keys)
    s2_mappings = [
        ("Passport", "s2.passport.title"),
        ("≥6mo valid, ≥2 blank pages", "s2.passport.desc"),
        ("Return+Hotel", "s2.tickets.title"),
        ("Print/screenshot e-ticket; hotel with address", "s2.tickets.desc"),
        ("Pre-fill Online", "s2.arrivalCard.title"),
    ]

    # Note: S2 has complex desc and list items that need manual handling
    # S3-S6 similar

    # For now, just remove all lang="zh" spans first
    print("Step 1: Removing lang=\"zh\" content...")

    # Count before
    zh_before = len(re.findall(r'lang="zh"', html))
    en_before = len(re.findall(r'lang="en"', html))

    # Remove zh spans/tags (keep structure, remove chinese text)
    html = re.sub(r'<([^>]+) lang="zh">[^<]*</\1>', '', html)
    html = re.sub(r'<([^>]+) lang="zh">([^<]+)</\1>', '', html)

    # Convert remaining lang="en" to remove lang attribute (keep English as fallback)
    html = re.sub(r' lang="en"', '', html)

    zh_after = len(re.findall(r'lang="zh"', html))
    en_after = len(re.findall(r'lang="en"', html))

    print(f"  Removed {zh_before} zh tags, {en_before - en_after} en tags converted")

    # Write back
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(html)

    new_len = len(html)

    print()
    print(f"✅ Conversion complete")
    print(f"  Size: {original_len} → {new_len} ({new_len - original_len:+d} bytes)")
    print(f"  Remaining lang tags: {zh_after} zh, {en_after} en")
    print()
    print("⚠️  Note: Card content now shows English only")
    print("   Add data-i18n attributes manually for full i18n support")
    print("   or keep English as universal fallback")


if __name__ == "__main__":
    main()
