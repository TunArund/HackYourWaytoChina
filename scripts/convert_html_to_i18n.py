#!/usr/bin/env python3
"""
convert_html_to_i18n.py — Convert all lang="zh"/lang="en" to data-i18n

Batch converts HTML sections S2-S10 to use data-i18n attributes
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


def convert_section_titles(html):
    """Convert section titles and subtitles"""

    # S2-S10 section titles pattern
    # <h2 class="s-title" lang="zh">中文</h2><h2 class="s-title" lang="en">English</h2>
    # → <h2 class="s-title" data-i18n="sN.meta.title">English</h2>

    for i in range(2, 11):
        # Title pattern
        pattern = rf'(<h2 class="s-title") lang="zh">([^<]+)</h2><h2 class="s-title" lang="en">([^<]+)</h2>'
        replacement = rf'\1 data-i18n="s{i}.meta.title">\3</h2>'
        html = re.sub(pattern, replacement, html, count=1)

        # Subtitle pattern (may contain HTML tags like <strong>)
        pattern = rf'(<p class="s-sub") lang="zh">(.+?)</p><p class="s-sub" lang="en">(.+?)</p>'
        replacement = rf'\1 data-i18n="s{i}.meta.sub">\3</p>'
        html = re.sub(pattern, replacement, html, count=1)

    return html


def remove_duplicate_lang_tags(html):
    """Remove duplicate lang="zh" and lang="en" pairs, keep only English with data-i18n"""

    # Pattern: <tag lang="zh">中文</tag><tag lang="en">English</tag>
    # Replace with: <tag data-i18n="...">English</tag>

    # This is complex because we need context to generate correct i18n keys
    # For now, just remove zh spans and convert en to placeholder

    # Remove lang="zh" spans/elements
    html = re.sub(r'<([^>]+) lang="zh">([^<]*)</\1>', '', html)

    # Convert remaining lang="en" to keep content but mark for manual i18n
    # html = re.sub(r'lang="en"', 'data-i18n="TODO"', html)

    return html


def main():
    print("🔨 Converting HTML to data-i18n")
    print("=" * 60)
    print()

    # Read HTML
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    original_len = len(html)

    # Backup
    backup_file = HTML_FILE.with_suffix(".html.bak")
    with open(backup_file, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"✓ Backup: {backup_file.name}")

    # Convert titles
    html = convert_section_titles(html)

    # Count remaining lang tags
    zh_count = len(re.findall(r'lang="zh"', html))
    en_count = len(re.findall(r'lang="en"', html))

    # Write back
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(html)

    new_len = len(html)

    print(f"✓ Section titles converted (S2-S10)")
    print(f"  Size: {original_len} → {new_len} ({new_len - original_len:+d} bytes)")
    print()
    print(f"📊 Remaining lang tags:")
    print(f"  lang=\"zh\": {zh_count}")
    print(f"  lang=\"en\": {en_count}")
    print()
    print("✅ Phase 1 complete: Section titles converted")
    print()
    print("📝 Next: Manual conversion of card content (S2-S6)")
    print("   or use specialized scripts for each section")


if __name__ == "__main__":
    main()
