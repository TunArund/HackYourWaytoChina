#!/usr/bin/env python3
"""
extract_s2_s6.py — Extract S2-S6 content from HTML to i18n JSON

Parses HTML and creates structured i18n keys for sections 2-6
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

# Manual extraction from HTML - S2 example structure
S2_EN = {
    "meta": {
        "title": "Before You Go",
        "sub": "Checklist + arrival card + final check. <strong>97%</strong> Beijing arrivals use online filing."
    },
    "passport": {
        "label": "📘 Req",
        "title": "Passport",
        "desc": "≥6mo valid, ≥2 blank pages"
    },
    "tickets": {
        "label": "🎫 Req",
        "title": "Return+Hotel",
        "desc": "Print/screenshot e-ticket; hotel with address"
    },
    "arrivalCard": {
        "label": "📱 Arrival Card",
        "title": "Pre-fill Online",
        "desc": "s.nia.gov.cn → fill → screenshot QR → scan. Supports passport photo scan. Also: NIA 12367 APP / WeChat / Alipay mini programs."
    },
    "finalCheck": {
        "label": "✅ Final Check",
        "items": [
            "<strong>Passport ≥6mo?</strong>",
            "<strong>Visa eligibility?</strong>",
            "<strong>Arrival card? Screenshot</strong>",
            "<strong>Alipay/WeChat ready?</strong>",
            "<strong>Hotel address saved?</strong>"
        ]
    }
}

S2_ZH = {
    "meta": {
        "title": "出发前准备",
        "sub": "材料清单 + 入境卡预填 + 最终检查。北京口岸<strong>97%</strong>旅客已在线填入境卡。"
    },
    "passport": {
        "label": "📘 必备",
        "title": "护照",
        "desc": "有效期≥6个月，≥2空白页"
    },
    "tickets": {
        "label": "🎫 必备",
        "title": "返程机票+酒店",
        "desc": "打印或截图电子行程单；酒店订单含中文地址"
    },
    "arrivalCard": {
        "label": "📱 在线入境卡",
        "title": "提前在线填写",
        "desc": "s.nia.gov.cn → 填好 → 截图二维码 → 扫码通关。支持拍照识别护照。也可用\"移民局12367\"APP/微信/支付宝小程序。"
    },
    "finalCheck": {
        "label": "✅ 最终检查",
        "items": [
            "<strong>护照≥6个月？</strong>",
            "<strong>签证/免签确认？</strong>",
            "<strong>入境卡填好？截图</strong>",
            "<strong>支付宝/微信绑卡？</strong>",
            "<strong>酒店地址中英文保存？</strong>"
        ]
    }
}

# Note: S3-S6 would need similar manual extraction
# For now, just adding S2 as an example

def add_s2_to_file(filepath, s2_data):
    """Add S2 structure to an i18n file"""
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Insert S2 after S1
    new_data = {}
    for key, value in data.items():
        new_data[key] = value
        if key == "s1":
            new_data["s2"] = s2_data

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(new_data, f, ensure_ascii=False, indent=2)


def main():
    print("🔨 Adding S2 structure to i18n files")
    print("=" * 60)
    print()

    # Add to English
    en_path = I18N_DIR / "en.json"
    add_s2_to_file(en_path, S2_EN)
    print(f"  ✓ en.json")

    # Add to Chinese
    zh_path = I18N_DIR / "zh.json"
    add_s2_to_file(zh_path, S2_ZH)
    print(f"  ✓ zh.json")

    print()
    print("✅ S2 structure added")
    print()
    print("⚠️  Note: S3-S6 still need manual extraction")
    print("   Run this script again after defining S3-S6 structures")


if __name__ == "__main__":
    main()
