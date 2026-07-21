#!/usr/bin/env python3
"""
cleanup_lang_tags.py — Remove all remaining lang="zh" and lang="en" tags

Complete cleanup of legacy dual-language markup
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


def main():
    print("🔨 Complete lang tag cleanup")
    print("=" * 60)
    print()

    # Read HTML
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    original_len = len(html)

    # Count before
    zh_before = len(re.findall(r'lang="zh"', html))
    en_before = len(re.findall(r'lang="en"', html))

    print(f"Before: {zh_before} zh tags, {en_before} en tags")
    print()

    # Step 1: Remove all elements with lang="zh" (keep English only)
    # Pattern: <tag ...lang="zh"...>中文内容</tag>
    html = re.sub(r'<([a-zA-Z0-9]+)([^>]*) lang="zh"([^>]*)>.*?</\1>', '', html, flags=re.DOTALL)

    # Step 2: Remove orphaned lang="zh" attributes
    html = re.sub(r' lang="zh"', '', html)

    # Step 3: Remove lang="en" attributes (keep content)
    html = re.sub(r' lang="en"', '', html)

    # Step 4: Clean up duplicate whitespace
    html = re.sub(r'\n\s*\n\s*\n', '\n\n', html)

    # Count after
    zh_after = len(re.findall(r'lang="zh"', html))
    en_after = len(re.findall(r'lang="en"', html))

    print(f"After: {zh_after} zh tags, {en_after} en tags")
    print()

    # Write back
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(html)

    new_len = len(html)

    print(f"✅ Cleanup complete")
    print(f"  Size: {original_len} → {new_len} ({new_len - original_len:+d} bytes)")
    print(f"  Removed: {zh_before - zh_after} zh, {en_before - en_after} en")


if __name__ == "__main__":
    main()
