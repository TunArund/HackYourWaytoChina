#!/usr/bin/env python3
"""
build.py — Bundle multi-file project into single self-contained HTML file.

Usage:
    python scripts/build.py              # Output to dist/guide.html
    python scripts/build.py --watch      # Rebuild on file changes (requires watchdog)

Reads:  src/index.html, src/css/style.css, src/js/*.js, src/i18n/*.json
Writes: dist/guide.html (self-contained, offline-able)
"""

import os
import io
import re
import json
import shutil
import sys
from pathlib import Path

# Fix Unicode output on Windows
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

ROOT = Path(__file__).parent.parent  # Go up from scripts/ to project root
SRC = ROOT / "src"
DIST = ROOT / "dist"


def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def inline_css(html):
    """Replace <link rel="stylesheet" href="css/style.css"> with inline <style>"""
    css_path = SRC / "css" / "style.css"
    css_content = read_file(css_path)
    # Minify CSS slightly: remove comments, collapse whitespace
    css_content = re.sub(r"/\*.*?\*/", "", css_content, flags=re.DOTALL)
    css_content = re.sub(r"\s+", " ", css_content).strip()
    html = re.sub(
        r'<link\s+rel="stylesheet"\s+href="css/style\.css"\s*/?>',
        f"<style>{css_content}</style>",
        html,
    )
    return html


def inline_js(html):
    """Replace <script src="js/..."> tags with inline <script> blocks, in order"""
    pattern = re.compile(r'<script\s+src="(js/[^"]+)"\s*></script>')

    def replace_script(match):
        js_file = SRC / match.group(1)
        code = read_file(js_file)
        # Remove sourceMappingURL if present
        code = re.sub(r"//# sourceMappingURL=.*", "", code)
        return f"<script>{code}</script>"

    return pattern.sub(replace_script, html)


def inline_i18n(html):
    """Embed current language JSON into a <script> tag for offline use.
    Reads all i18n/*.json and embeds them as window.__I18N_BUNDLE = {...}
    """
    i18n_dir = SRC / "i18n"
    bundle = {}
    for f in sorted(i18n_dir.glob("*.json")):
        lang = f.stem
        bundle[lang] = json.loads(read_file(f))

    # Generate JS that pre-loads the bundle so no fetch() needed
    bundle_js = f"<script>window.__I18N_BUNDLE={json.dumps(bundle,ensure_ascii=False)};</script>"
    # Also modify i18n.js setLang to use bundle instead of fetch
    # We'll inject the bundle before the first script tag
    html = html.replace(
        '<script src="js/i18n.js"></script>',
        f'{bundle_js}\n<script src="js/i18n.js"></script>',
    )
    return html


def build():
    print("Building...")

    # Read shell
    html = read_file(SRC / "index.html")

    # Inline CSS
    html = inline_css(html)
    print("  ✓ CSS inlined")

    # Inline i18n bundle FIRST (before JS inlining)
    html = inline_i18n(html)
    print("  ✓ i18n bundled")

    # Inline JS (will now also inline i18n.js which follows the bundle)
    html = inline_js(html)
    print("  ✓ JS inlined")

    # Write output
    DIST.mkdir(exist_ok=True)
    out_path = DIST / "guide.html"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)

    size_kb = len(html) / 1024
    print(f"  → {out_path} ({size_kb:.0f} KB)")


if __name__ == "__main__":
    import sys

    if "--watch" in sys.argv:
        try:
            from watchdog.observers import Observer
            from watchdog.events import FileSystemEventHandler

            class Handler(FileSystemEventHandler):
                def on_modified(self, event):
                    if event.src_path.endswith((".html", ".css", ".js", ".json")):
                        print(f"\n[changed: {Path(event.src_path).name}]")
                        build()

            observer = Observer()
            observer.schedule(Handler(), str(SRC / "css"), recursive=False)
            observer.schedule(Handler(), str(SRC / "js"), recursive=False)
            observer.schedule(Handler(), str(SRC / "i18n"), recursive=False)
            observer.schedule(Handler(), str(SRC), recursive=False)
            observer.start()
            print("Watching for changes... (Ctrl+C to stop)")
            build()
            observer.join()
        except ImportError:
            print("pip install watchdog for --watch mode")
            sys.exit(1)
    else:
        build()
