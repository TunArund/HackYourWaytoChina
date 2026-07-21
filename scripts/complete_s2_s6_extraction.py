#!/usr/bin/env python3
"""
complete_s2_s6_extraction.py — Complete extraction for S2-S6

Extracts all content from HTML and creates i18n structure for all 6 languages.
For ja/ko/ru/vi: uses English as placeholder (to be translated later)
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

# Complete section data
SECTIONS_EN = {
    "s2": {
        "meta": {
            "title": "Before You Go",
            "sub": "Checklist + arrival card + final check. <strong>97%</strong> Beijing arrivals use online filing."
        },
        "passport": {"label": "📘 Req", "title": "Passport", "desc": "≥6mo valid, ≥2 blank pages"},
        "tickets": {"label": "🎫 Req", "title": "Return+Hotel", "desc": "Print/screenshot e-ticket; hotel with address"},
        "arrivalCard": {"label": "📱 Arrival Card", "title": "Pre-fill Online", "desc": "s.nia.gov.cn → fill → screenshot QR → scan. Supports passport photo scan. Also: NIA 12367 APP / WeChat / Alipay mini programs."},
        "finalCheck": {"label": "✅ Final Check", "items": ["<strong>Passport ≥6mo?</strong>", "<strong>Visa eligibility?</strong>", "<strong>Arrival card? Screenshot</strong>", "<strong>Alipay/WeChat ready?</strong>", "<strong>Hotel address saved?</strong>"]}
    },
    "s3": {
        "meta": {
            "title": "Arrival & Immigration",
            "sub": "Flow+customs+registration. Under 14 / over 70 fingerprint exempt."
        },
        "steps": {"label": "🛂 6 Steps", "desc": "①Health→②Fingerprint→③Border→④Baggage→⑤Customs→⑥Arrival Hall"},
        "customs": {"label": "🛃 Limits", "desc": "Cash≤$5K·Alc≤1.5L·Cigs≤400. Rx meds with note. Green channel. Ban:weapons/drugs/ivory."},
        "registration": {"label": "🏨 Register", "desc": "Hotels auto. Private:12367 online(7 pilot) or police. Re-register per move. Art.39:within 24h."}
    },
    "s4": {
        "meta": {
            "title": "Connectivity",
            "sub": "Google/WA/IG blocked. Priority: get online."
        },
        "esim": {"label": "📱 Best", "title": "eSIM", "desc": "Airalo/Holafly/Nomad. Buy before→data on landing. Data only, no CN number."},
        "sim": {"label": "📱 Alt", "title": "CN SIM", "desc": "Airport:Mobile/Unicom/Telecom. Passport. ¥29-99/mo. Get number→register apps."},
        "vpn": {"label": "🔐 VPN", "title": "Install Early", "desc": "Mullvad/Astrill. Install+pay before. Keep 2 different protocols as backup."},
        "blocked": {"label": "🚫 Blocked", "desc": "🚫Google/Gmail/Maps/YT/WA/IG/FB/X/Dropbox<br>✅iCloud/Slack/Zoom/Teams<br>Alt:Baidu/Xiaohongshu/Weibo/Bilibili"}
    },
    "s5": {
        "meta": {
            "title": "Daily Life",
            "sub": "Apps + transport + food + hotels. Download before."
        },
        "payment": {"label": "💳 Payment", "desc": "Alipay/WeChat accept foreign cards (no bank account). Cash backup. UnionPay widely accepted."},
        "transport": {"label": "🚕 Transport", "desc": "Didi (Uber-like), Metro apps, HSR 12306, bike-share (Meituan/Hellobike)"},
        "food": {"label": "🍜 Food", "desc": "Dianping reviews, translate menus (WeChat scan), delivery (Meituan/Eleme), dietary filters"},
        "accommodation": {"label": "🏨 Hotels", "desc": "Trip.com, Ctrip, Airbnb (limited). Foreign-friendly hotels required for registration."}
    },
    "s6": {
        "meta": {
            "title": "Apps to Download",
            "sub": "Essential apps. Download before entering China."
        },
        "essential": {"label": "✅ Essential", "items": ["WeChat (chat+pay)", "Alipay (pay)", "Didi (taxi)", "Baidu Maps"]},
        "travel": {"label": "🧳 Travel", "items": ["12306 (train)", "Trip.com (hotels)", "Dianping (food)"]},
        "useful": {"label": "📱 Useful", "items": ["Meituan (delivery)", "Xiaohongshu (social)", "Pleco (dictionary)"]}
    }
}

SECTIONS_ZH = {
    "s2": {
        "meta": {"title": "出发前准备", "sub": "材料清单 + 入境卡预填 + 最终检查。北京口岸<strong>97%</strong>旅客已在线填入境卡。"},
        "passport": {"label": "📘 必备", "title": "护照", "desc": "有效期≥6个月，≥2空白页"},
        "tickets": {"label": "🎫 必备", "title": "返程机票+酒店", "desc": "打印或截图电子行程单；酒店订单含中文地址"},
        "arrivalCard": {"label": "📱 在线入境卡", "title": "提前在线填写", "desc": "s.nia.gov.cn → 填好 → 截图二维码 → 扫码通关。支持拍照识别护照。也可用\"移民局12367\"APP/微信/支付宝小程序。"},
        "finalCheck": {"label": "✅ 最终检查", "items": ["<strong>护照≥6个月？</strong>", "<strong>签证/免签确认？</strong>", "<strong>入境卡填好？截图</strong>", "<strong>支付宝/微信绑卡？</strong>", "<strong>酒店地址中英文保存？</strong>"]}
    },
    "s3": {
        "meta": {"title": "落地入境", "sub": "通关流程+海关限额+住宿登记。14岁以下/70岁以上免指纹。"},
        "steps": {"label": "🛂 通关6步", "desc": "①健康检疫→②指纹→③边检(护照+入境卡QR)→④行李→⑤海关→⑥到达大厅"},
        "customs": {"label": "🛃 海关", "desc": "现金≤$5K·酒≤1.5L·烟≤400支。处方药带处方。无申报走绿通。禁止:武器/毒品/象牙/违禁出版物。"},
        "registration": {"label": "🏨 住宿登记", "desc": "酒店自动登记。私人住所:12367在线(7省试点)或派出所。换住所重登。《出境入境管理法》第39条:24h内完成。"}
    },
    "s4": {
        "meta": {"title": "通讯与网络", "sub": "Google/WA/IG 不可用。落地第一件事：搞定网络。"},
        "esim": {"label": "📱 优选", "title": "eSIM", "desc": "Airalo/Holafly/Nomad。出发前买,落地有网。仅流量，不分配中国号码。"},
        "sim": {"label": "📱 备选", "title": "中国SIM卡", "desc": "机场到达厅移动/联通/电信。护照办理。月¥29-99。得号码→注册App。"},
        "vpn": {"label": "🔐 VPN", "title": "出发前装好", "desc": "Mullvad/Astrill。出发前安装+付费。备2个不同协议以防万一。"},
        "blocked": {"label": "🚫 被墙服务", "desc": "🚫Google/Gmail/Maps/YT/WA/IG/FB/X/Dropbox<br>✅iCloud/Slack/Zoom/Teams<br>替代:百度/小红书/微博/哔哩哔哩"}
    },
    "s5": {
        "meta": {"title": "日常生活", "sub": "App+交通+饮食+住宿。提前下载。"},
        "payment": {"label": "💳 支付", "desc": "支付宝/微信接受外卡(无需开户)。备现金。银联广泛接受。"},
        "transport": {"label": "🚕 出行", "desc": "滴滴(打车)、地铁App、12306(高铁)、共享单车(美团/哈啰)"},
        "food": {"label": "🍜 饮食", "desc": "大众点评评价、翻译菜单(微信扫一扫)、外卖(美团/饿了么)、饮食过滤"},
        "accommodation": {"label": "🏨 住宿", "desc": "携程、Trip.com、Airbnb(有限)。需选择接待外国人的酒店。"}
    },
    "s6": {
        "meta": {"title": "必备App", "sub": "必装应用。入境前下载。"},
        "essential": {"label": "✅ 必装", "items": ["微信(聊天+支付)", "支付宝(支付)", "滴滴(打车)", "百度地图"]},
        "travel": {"label": "🧳 出行", "items": ["12306(火车)", "携程(酒店)", "大众点评(美食)"]},
        "useful": {"label": "📱 实用", "items": ["美团(外卖)", "小红书(社交)", "Pleco(词典)"]}
    }
}


def merge_sections(data, new_sections):
    """Insert S2-S6 into data after S1"""
    result = {}
    for key, value in data.items():
        result[key] = value
        if key == "s1":
            # Insert S2-S6 after S1
            for i in range(2, 7):
                section_key = f"s{i}"
                if section_key in new_sections:
                    result[section_key] = new_sections[section_key]
    return result


def process_language(lang_code, sections_data):
    """Add S2-S6 to a language file"""
    filepath = I18N_DIR / f"{lang_code}.json"

    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    data = merge_sections(data, sections_data)

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"  ✓ {lang_code}.json")


def main():
    print("🔨 Complete S2-S6 Extraction")
    print("=" * 60)
    print()

    # Process English and Chinese
    process_language("en", SECTIONS_EN)
    process_language("zh", SECTIONS_ZH)

    # For ja/ko/ru/vi: use English as placeholder
    for lang in ["ja", "ko", "ru", "vi"]:
        process_language(lang, SECTIONS_EN)

    print()
    print("✅ S2-S6 added to all languages")
    print()
    print("📝 Note: ja/ko/ru/vi use English placeholders")
    print("   Translate these later or use existing translations if available")


if __name__ == "__main__":
    main()
