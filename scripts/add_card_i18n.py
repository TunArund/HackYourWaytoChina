#!/usr/bin/env python3
"""
add_card_i18n.py — Add data-i18n attributes to S2-S6 card content

Maps HTML elements to i18n keys based on JSON structure
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


# Mapping patterns: (regex_pattern, i18n_key, description)
PATTERNS = [
    # S2 - Already done

    # S3
    (r'(<span class="c-label">)🛂 6 Steps(</span>)', r'\1🛂 6 Steps\2 data-i18n="s3.steps.label"', 'S3 steps label'),
    (r'(<p>)①Health→②Fingerprint→③Border→④Baggage→⑤Customs→⑥Arrival Hall(</p>)', r'<p data-i18n="s3.steps.desc">①Health→②Fingerprint→③Border→④Baggage→⑤Customs→⑥Arrival Hall</p>', 'S3 steps desc'),
    (r'(<span class="c-label">)🛃 Limits(</span>)', r'<span class="c-label" data-i18n="s3.customs.label">🛃 Limits</span>', 'S3 customs label'),
    (r'(<p>)Cash≤\$5K·Alc≤1\.5L·Cigs≤400\. Rx meds with note\. Green channel\. Ban:weapons/drugs/ivory\.(</p>)', r'<p data-i18n="s3.customs.desc">Cash≤$5K·Alc≤1.5L·Cigs≤400. Rx meds with note. Green channel. Ban:weapons/drugs/ivory.</p>', 'S3 customs desc'),
    (r'(<span class="c-label">)🏨 Register(</span>)', r'<span class="c-label" data-i18n="s3.registration.label">🏨 Register</span>', 'S3 registration label'),
    (r'(<p>)Hotels auto\. Private:12367 online\(7 pilot\) or police\. Re-register per move\. Art\.39:within 24h\.(</p>)', r'<p data-i18n="s3.registration.desc">Hotels auto. Private:12367 online(7 pilot) or police. Re-register per move. Art.39:within 24h.</p>', 'S3 registration desc'),

    # S4
    (r'(<span class="c-label">)📱 Best(</span>)', r'<span class="c-label" data-i18n="s4.esim.label">📱 Best</span>', 'S4 esim label'),
    (r'(<h4>)eSIM(</h4>)', r'<h4 data-i18n="s4.esim.title">eSIM</h4>', 'S4 esim title'),
    (r'(<p>)Airalo/Holafly/Nomad\. Buy before→data on landing\. Data only, no CN number\.(</p>)', r'<p data-i18n="s4.esim.desc">Airalo/Holafly/Nomad. Buy before→data on landing. Data only, no CN number.</p>', 'S4 esim desc'),
    (r'(<span class="c-label">)📱 Alt(</span>)', r'<span class="c-label" data-i18n="s4.sim.label">📱 Alt</span>', 'S4 sim label'),
    (r'(<h4>)CN SIM(</h4>)', r'<h4 data-i18n="s4.sim.title">CN SIM</h4>', 'S4 sim title'),
    (r'(<p>)Airport:Mobile/Unicom/Telecom\. Passport\. ¥29-99/mo\. Get number→register apps\.(</p>)', r'<p data-i18n="s4.sim.desc">Airport:Mobile/Unicom/Telecom. Passport. ¥29-99/mo. Get number→register apps.</p>', 'S4 sim desc'),
    (r'(<span class="c-label">)🔐 VPN(</span>)', r'<span class="c-label" data-i18n="s4.vpn.label">🔐 VPN</span>', 'S4 vpn label'),
    (r'(<h4>)Install Early(</h4>)', r'<h4 data-i18n="s4.vpn.title">Install Early</h4>', 'S4 vpn title'),
    (r'(<p>)Mullvad/Astrill\. Install\+pay before\. Keep 2 different protocols as backup\.(</p>)', r'<p data-i18n="s4.vpn.desc">Mullvad/Astrill. Install+pay before. Keep 2 different protocols as backup.</p>', 'S4 vpn desc'),
    (r'(<span class="c-label">)🚫 Blocked(</span>)', r'<span class="c-label" data-i18n="s4.blocked.label">🚫 Blocked</span>', 'S4 blocked label'),
    (r'(<p>)🚫Google/Gmail/Maps/YT/WA/IG/FB/X/Dropbox<br>✅iCloud/Slack/Zoom/Teams<br>Alt:Baidu/Xiaohongshu/Weibo/Bilibili(</p>)', r'<p data-i18n="s4.blocked.desc">🚫Google/Gmail/Maps/YT/WA/IG/FB/X/Dropbox<br>✅iCloud/Slack/Zoom/Teams<br>Alt:Baidu/Xiaohongshu/Weibo/Bilibili</p>', 'S4 blocked desc'),

    # S6 (Move+Eat+Stay)
    (r'(<span class="c-label">)🚕 Transport(</span>)', r'<span class="c-label" data-i18n="s5.transport.label">🚕 Transport</span>', 'S6 transport label'),
    (r'(<span class="c-label">)🍜 Dining(</span>)', r'<span class="c-label" data-i18n="s5.food.label">🍜 Dining</span>', 'S6 food label'),
    (r'(<span class="c-label">)🏨 Stay(</span>)', r'<span class="c-label" data-i18n="s5.accommodation.label">🏨 Stay</span>', 'S6 accommodation label'),
]


def main():
    print("🔨 Adding data-i18n to S2-S6 cards")
    print("=" * 60)
    print()

    # Read HTML
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    original = html
    count = 0

    # Apply patterns
    for pattern, replacement, desc in PATTERNS:
        before = html
        html = re.sub(pattern, replacement, html, count=1)
        if html != before:
            count += 1
            print(f"  ✓ {desc}")

    # Write back
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(html)

    print()
    print(f"✅ Added {count} data-i18n attributes")
    print(f"  Size: {len(original)} → {len(html)} ({len(html) - len(original):+d} bytes)")


if __name__ == "__main__":
    main()
