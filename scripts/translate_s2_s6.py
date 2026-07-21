#!/usr/bin/env python3
"""
translate_s2_s6.py — Add machine translations for ja/ko/ru/vi

Uses simple translation dictionaries for S2-S6 content
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

# Translation dictionaries (simple mapping)
TRANSLATIONS = {
    "ja": {
        "s2": {
            "meta": {"title": "出発前の準備", "sub": "チェックリスト + 入国カード + 最終確認。北京空港の97%の旅行者がオンライン記入を利用。"},
            "passport": {"label": "📘 必須", "title": "パスポート", "desc": "有効期限≥6ヶ月、空白ページ≥2枚"},
            "tickets": {"label": "🎫 必須", "title": "往復航空券+ホテル", "desc": "電子チケットを印刷またはスクリーンショット、住所付きホテル予約"},
            "arrivalCard": {"label": "📱 入国カード", "title": "事前オンライン記入", "desc": "s.nia.gov.cn → 記入 → QRコードスクリーンショット → スキャン通過。パスポート写真スキャン対応。NIA 12367アプリ/WeChat/Alipayミニプログラムも可。"},
            "finalCheck": {"label": "✅ 最終確認", "items": ["<strong>パスポート≥6ヶ月？</strong>", "<strong>ビザ資格確認？</strong>", "<strong>入国カード記入済み？スクリーンショット</strong>", "<strong>Alipay/WeChatカード登録済み？</strong>", "<strong>ホテル住所保存済み？</strong>"]}
        },
        "s3": {
            "meta": {"title": "到着・入国", "sub": "手続き+税関+登録。14歳未満/70歳以上は指紋免除。"},
            "steps": {"label": "🛂 6ステップ", "desc": "①健康検疫→②指紋→③入国審査→④手荷物→⑤税関→⑥到着ホール"},
            "customs": {"label": "🛃 制限", "desc": "現金≤$5K・酒≤1.5L・タバコ≤400本。処方薬は処方箋付き。グリーンチャネル。禁止：武器/麻薬/象牙。"},
            "registration": {"label": "🏨 登録", "desc": "ホテルは自動。民泊：12367オンライン(7都市試験)または警察署。移動毎に再登録。第39条：24時間以内。"}
        },
        "s4": {
            "meta": {"title": "通信・ネットワーク", "sub": "Google/WA/IGブロック。到着後すぐにオンライン接続を。"},
            "esim": {"label": "📱 推奨", "title": "eSIM", "desc": "Airalo/Holafly/Nomad。出発前購入→到着時すぐデータ利用可。データのみ、中国番号なし。"},
            "sim": {"label": "📱 代替", "title": "中国SIM", "desc": "空港：移動/聯通/電信。パスポート必要。¥29-99/月。番号取得→アプリ登録。"},
            "vpn": {"label": "🔐 VPN", "title": "事前インストール", "desc": "Mullvad/Astrill。出発前インストール+支払い。異なるプロトコルを2つ用意。"},
            "blocked": {"label": "🚫 ブロック", "desc": "🚫Google/Gmail/Maps/YT/WA/IG/FB/X/Dropbox<br>✅iCloud/Slack/Zoom/Teams<br>代替：百度/小紅書/微博/哔哩哔哩"}
        },
        "s5": {
            "meta": {"title": "日常生活", "sub": "アプリ+交通+食事+宿泊。事前ダウンロード。"},
            "payment": {"label": "💳 決済", "desc": "Alipay/WeChatは外国カード対応(銀行口座不要)。現金バックアップ。UnionPay広く受け入れ。"},
            "transport": {"label": "🚕 交通", "desc": "Didi(配車)、地下鉄アプリ、高速鉄道12306、シェアサイクル(美団/哈啰)"},
            "food": {"label": "🍜 食事", "desc": "大衆点評レビュー、メニュー翻訳(WeChatスキャン)、デリバリー(美団/饿了么)、食事フィルター"},
            "accommodation": {"label": "🏨 宿泊", "desc": "携程、Trip.com、Airbnb(限定)。外国人受け入れ可能なホテルを選択。"}
        },
        "s6": {
            "meta": {"title": "必須アプリ", "sub": "必須アプリ。入国前ダウンロード。"},
            "essential": {"label": "✅ 必須", "items": ["WeChat(チャット+決済)", "Alipay(決済)", "Didi(タクシー)", "百度地図"]},
            "travel": {"label": "🧳 旅行", "items": ["12306(列車)", "携程(ホテル)", "大衆点評(グルメ)"]},
            "useful": {"label": "📱 便利", "items": ["美団(デリバリー)", "小紅書(SNS)", "Pleco(辞書)"]}
        }
    },
    "ko": {
        "s2": {
            "meta": {"title": "출발 전 준비", "sub": "체크리스트 + 입국 카드 + 최종 확인. 베이징 공항 97% 여행객이 온라인 작성 이용."},
            "passport": {"label": "📘 필수", "title": "여권", "desc": "유효기간≥6개월, 빈 페이지≥2장"},
            "tickets": {"label": "🎫 필수", "title": "왕복 항공권+호텔", "desc": "전자 티켓 인쇄 또는 스크린샷, 주소가 있는 호텔 예약"},
            "arrivalCard": {"label": "📱 입국 카드", "title": "사전 온라인 작성", "desc": "s.nia.gov.cn → 작성 → QR코드 스크린샷 → 스캔 통과. 여권 사진 스캔 지원. NIA 12367 앱/WeChat/Alipay 미니 프로그램도 가능."},
            "finalCheck": {"label": "✅ 최종 확인", "items": ["<strong>여권≥6개월?</strong>", "<strong>비자 자격 확인?</strong>", "<strong>입국 카드 작성? 스크린샷</strong>", "<strong>Alipay/WeChat 카드 등록?</strong>", "<strong>호텔 주소 저장?</strong>"]}
        },
        "s3": {
            "meta": {"title": "도착 및 입국", "sub": "절차+세관+등록. 14세 미만/70세 이상 지문 면제."},
            "steps": {"label": "🛂 6단계", "desc": "①건강 검역→②지문→③입국 심사→④수하물→⑤세관→⑥도착홀"},
            "customs": {"label": "🛃 제한", "desc": "현금≤$5K·주류≤1.5L·담배≤400개비. 처방약은 처방전 지참. 녹색 채널. 금지：무기/마약/상아."},
            "registration": {"label": "🏨 등록", "desc": "호텔은 자동. 민박：12367 온라인(7개 도시 시범) 또는 경찰서. 이동 시마다 재등록. 제39조：24시간 내."}
        },
        "s4": {
            "meta": {"title": "통신 및 네트워크", "sub": "Google/WA/IG 차단. 도착 후 즉시 온라인 연결."},
            "esim": {"label": "📱 권장", "title": "eSIM", "desc": "Airalo/Holafly/Nomad. 출발 전 구매→도착 시 즉시 데이터 이용. 데이터만, 중국 번호 없음."},
            "sim": {"label": "📱 대체", "title": "중국 SIM", "desc": "공항：이동/연통/전신. 여권 필요. ¥29-99/월. 번호 취득→앱 등록."},
            "vpn": {"label": "🔐 VPN", "title": "사전 설치", "desc": "Mullvad/Astrill. 출발 전 설치+결제. 다른 프로토콜 2개 준비."},
            "blocked": {"label": "🚫 차단", "desc": "🚫Google/Gmail/Maps/YT/WA/IG/FB/X/Dropbox<br>✅iCloud/Slack/Zoom/Teams<br>대체：바이두/샤오홍슈/웨이보/빌리빌리"}
        },
        "s5": {
            "meta": {"title": "일상생활", "sub": "앱+교통+식사+숙박. 사전 다운로드."},
            "payment": {"label": "💳 결제", "desc": "Alipay/WeChat 외국 카드 지원(은행 계좌 불필요). 현금 백업. UnionPay 광범위 수용."},
            "transport": {"label": "🚕 교통", "desc": "Didi(택시), 지하철 앱, 고속철도 12306, 공유 자전거(메이투안/헬로바이크)"},
            "food": {"label": "🍜 식사", "desc": "따중댄핑 리뷰, 메뉴 번역(WeChat 스캔), 배달(메이투안/어러머), 식사 필터"},
            "accommodation": {"label": "🏨 숙박", "desc": "씨트립, Trip.com, Airbnb(제한). 외국인 수용 가능한 호텔 선택."}
        },
        "s6": {
            "meta": {"title": "필수 앱", "sub": "필수 앱. 입국 전 다운로드."},
            "essential": {"label": "✅ 필수", "items": ["WeChat(채팅+결제)", "Alipay(결제)", "Didi(택시)", "바이두 지도"]},
            "travel": {"label": "🧳 여행", "items": ["12306(기차)", "씨트립(호텔)", "따중댄핑(맛집)"]},
            "useful": {"label": "📱 유용", "items": ["메이투안(배달)", "샤오홍슈(SNS)", "Pleco(사전)"]}
        }
    },
    "ru": {
        "s2": {
            "meta": {"title": "Перед отъездом", "sub": "Чеклист + карта прибытия + финальная проверка. 97% путешественников в Пекине используют онлайн-заполнение."},
            "passport": {"label": "📘 Треб.", "title": "Паспорт", "desc": "Срок≥6 мес., ≥2 чистые стр."},
            "tickets": {"label": "🎫 Треб.", "title": "Обратный билет+Отель", "desc": "Распечатать/скриншот э-билета; отель с адресом"},
            "arrivalCard": {"label": "📱 Карта прибытия", "title": "Заполнить онлайн", "desc": "s.nia.gov.cn → заполнить → скриншот QR → сканировать. Поддерживает фото паспорта. Также: NIA 12367 APP / WeChat / Alipay мини-программы."},
            "finalCheck": {"label": "✅ Финальная проверка", "items": ["<strong>Паспорт≥6мес?</strong>", "<strong>Виза подтверждена?</strong>", "<strong>Карта прибытия? Скриншот</strong>", "<strong>Alipay/WeChat готовы?</strong>", "<strong>Адрес отеля сохранён?</strong>"]}
        },
        "s3": {
            "meta": {"title": "Прибытие и иммиграция", "sub": "Процедура+таможня+регистрация. До 14 / старше 70 освобождены от отпечатков."},
            "steps": {"label": "🛂 6 шагов", "desc": "①Здоровье→②Отпечатки→③Паспортный контроль→④Багаж→⑤Таможня→⑥Зал прибытия"},
            "customs": {"label": "🛃 Лимиты", "desc": "Наличные≤$5K·Алкоголь≤1.5L·Сигареты≤400. Рецептурные лекарства с рецептом. Зелёный коридор. Запрет：оружие/наркотики/слоновая кость."},
            "registration": {"label": "🏨 Регистрация", "desc": "Отели автоматически. Частное жильё：12367 онлайн(7 городов-пилот) или полиция. Перерегистрация при переезде. Ст.39：в течение 24ч."}
        },
        "s4": {
            "meta": {"title": "Связь и интернет", "sub": "Google/WA/IG заблокированы. Приоритет: подключиться."},
            "esim": {"label": "📱 Лучший", "title": "eSIM", "desc": "Airalo/Holafly/Nomad. Купить заранее→данные при посадке. Только данные, без китайского номера."},
            "sim": {"label": "📱 Альт.", "title": "Китайская SIM", "desc": "Аэропорт：China Mobile/Unicom/Telecom. Паспорт. ¥29-99/мес. Получить номер→зарегистрировать приложения."},
            "vpn": {"label": "🔐 VPN", "title": "Установить заранее", "desc": "Mullvad/Astrill. Установить+оплатить до отъезда. 2 разных протокола как резерв."},
            "blocked": {"label": "🚫 Заблокировано", "desc": "🚫Google/Gmail/Maps/YT/WA/IG/FB/X/Dropbox<br>✅iCloud/Slack/Zoom/Teams<br>Альт：Baidu/Xiaohongshu/Weibo/Bilibili"}
        },
        "s5": {
            "meta": {"title": "Повседневная жизнь", "sub": "Приложения + транспорт + еда + жильё. Скачать заранее."},
            "payment": {"label": "💳 Оплата", "desc": "Alipay/WeChat принимают иностранные карты (без банковского счёта). Резерв наличных. UnionPay широко принимается."},
            "transport": {"label": "🚕 Транспорт", "desc": "Didi (такси), Метро приложения, Скоростные поезда 12306, велопрокат (Meituan/Hellobike)"},
            "food": {"label": "🍜 Еда", "desc": "Dianping отзывы, перевод меню (WeChat сканирование), доставка (Meituan/Eleme), фильтры питания"},
            "accommodation": {"label": "🏨 Жильё", "desc": "Trip.com, Ctrip, Airbnb (ограничено). Отели для иностранцев обязательны для регистрации."}
        },
        "s6": {
            "meta": {"title": "Необходимые приложения", "sub": "Основные приложения. Скачать до въезда в Китай."},
            "essential": {"label": "✅ Основные", "items": ["WeChat (чат+оплата)", "Alipay (оплата)", "Didi (такси)", "Baidu Maps"]},
            "travel": {"label": "🧳 Путешествия", "items": ["12306 (поезд)", "Trip.com (отели)", "Dianping (еда)"]},
            "useful": {"label": "📱 Полезные", "items": ["Meituan (доставка)", "Xiaohongshu (соцсеть)", "Pleco (словарь)"]}
        }
    },
    "vi": {
        "s2": {
            "meta": {"title": "Trước khi đi", "sub": "Danh sách kiểm tra + thẻ nhập cảnh + kiểm tra cuối. 97% du khách tại Bắc Kinh sử dụng điền trực tuyến."},
            "passport": {"label": "📘 Bắt buộc", "title": "Hộ chiếu", "desc": "Hiệu lực≥6 tháng, ≥2 trang trống"},
            "tickets": {"label": "🎫 Bắt buộc", "title": "Vé khứ hồi+Khách sạn", "desc": "In/chụp màn hình vé điện tử; khách sạn có địa chỉ"},
            "arrivalCard": {"label": "📱 Thẻ nhập cảnh", "title": "Điền trực tuyến trước", "desc": "s.nia.gov.cn → điền → chụp màn hình QR → quét. Hỗ trợ quét ảnh hộ chiếu. Cũng có: NIA 12367 APP / WeChat / Alipay mini programs."},
            "finalCheck": {"label": "✅ Kiểm tra cuối", "items": ["<strong>Hộ chiếu≥6 tháng?</strong>", "<strong>Xác nhận thị thực?</strong>", "<strong>Thẻ nhập cảnh? Chụp màn hình</strong>", "<strong>Alipay/WeChat sẵn sàng?</strong>", "<strong>Địa chỉ khách sạn đã lưu?</strong>"]}
        },
        "s3": {
            "meta": {"title": "Đến và nhập cảnh", "sub": "Quy trình+hải quan+đăng ký. Dưới 14 / trên 70 miễn vân tay."},
            "steps": {"label": "🛂 6 bước", "desc": "①Y tế→②Vân tay→③Biên giới→④Hành lý→⑤Hải quan→⑥Sảnh đến"},
            "customs": {"label": "🛃 Giới hạn", "desc": "Tiền mặt≤$5K·Rượu≤1.5L·Thuốc lá≤400. Thuốc theo toa cần đơn. Kênh xanh. Cấm：vũ khí/ma túy/ngà voi."},
            "registration": {"label": "🏨 Đăng ký", "desc": "Khách sạn tự động. Nhà riêng：12367 trực tuyến(7 thành phố thí điểm) hoặc công an. Đăng ký lại mỗi lần di chuyển. Điều 39：trong 24h."}
        },
        "s4": {
            "meta": {"title": "Kết nối", "sub": "Google/WA/IG bị chặn. Ưu tiên: trực tuyến."},
            "esim": {"label": "📱 Tốt nhất", "title": "eSIM", "desc": "Airalo/Holafly/Nomad. Mua trước→dữ liệu khi hạ cánh. Chỉ dữ liệu, không có số Trung Quốc."},
            "sim": {"label": "📱 Thay thế", "title": "SIM Trung Quốc", "desc": "Sân bay：Mobile/Unicom/Telecom. Hộ chiếu. ¥29-99/tháng. Lấy số→đăng ký ứng dụng."},
            "vpn": {"label": "🔐 VPN", "title": "Cài đặt sớm", "desc": "Mullvad/Astrill. Cài đặt+thanh toán trước. Giữ 2 giao thức khác nhau dự phòng."},
            "blocked": {"label": "🚫 Bị chặn", "desc": "🚫Google/Gmail/Maps/YT/WA/IG/FB/X/Dropbox<br>✅iCloud/Slack/Zoom/Teams<br>Thay thế：Baidu/Xiaohongshu/Weibo/Bilibili"}
        },
        "s5": {
            "meta": {"title": "Cuộc sống hàng ngày", "sub": "Ứng dụng + giao thông + ăn uống + lưu trú. Tải trước."},
            "payment": {"label": "💳 Thanh toán", "desc": "Alipay/WeChat chấp nhận thẻ nước ngoài (không cần tài khoản ngân hàng). Dự phòng tiền mặt. UnionPay được chấp nhận rộng rãi."},
            "transport": {"label": "🚕 Giao thông", "desc": "Didi (taxi), Ứng dụng tàu điện ngầm, Tàu cao tốc 12306, xe đạp chia sẻ (Meituan/Hellobike)"},
            "food": {"label": "🍜 Ăn uống", "desc": "Đánh giá Dianping, dịch thực đơn (quét WeChat), giao hàng (Meituan/Eleme), bộ lọc ăn kiêng"},
            "accommodation": {"label": "🏨 Lưu trú", "desc": "Trip.com, Ctrip, Airbnb (giới hạn). Khách sạn thân thiện với người nước ngoài bắt buộc đăng ký."}
        },
        "s6": {
            "meta": {"title": "Ứng dụng cần thiết", "sub": "Ứng dụng thiết yếu. Tải trước khi vào Trung Quốc."},
            "essential": {"label": "✅ Thiết yếu", "items": ["WeChat (trò chuyện+thanh toán)", "Alipay (thanh toán)", "Didi (taxi)", "Bản đồ Baidu"]},
            "travel": {"label": "🧳 Du lịch", "items": ["12306 (tàu)", "Trip.com (khách sạn)", "Dianping (ẩm thực)"]},
            "useful": {"label": "📱 Hữu ích", "items": ["Meituan (giao hàng)", "Xiaohongshu (mạng xã hội)", "Pleco (từ điển)"]}
        }
    }
}


def merge_translations(target_lang, source_data, trans_data):
    """Recursively merge translations into source data"""
    for key, value in trans_data.items():
        if key not in source_data:
            source_data[key] = value
        elif isinstance(value, dict) and isinstance(source_data[key], dict):
            merge_translations(target_lang, source_data[key], value)
        else:
            source_data[key] = value
    return source_data


def main():
    print("🔨 Adding Machine Translations for ja/ko/ru/vi")
    print("=" * 60)
    print()

    for lang_code in ["ja", "ko", "ru", "vi"]:
        filepath = I18N_DIR / f"{lang_code}.json"

        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Merge translations
        if lang_code in TRANSLATIONS:
            for section in ["s2", "s3", "s4", "s5", "s6"]:
                if section in TRANSLATIONS[lang_code]:
                    if section not in data:
                        data[section] = {}
                    data[section] = merge_translations(lang_code, data[section], TRANSLATIONS[lang_code][section])

        # Write back
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f"  ✓ {lang_code}.json updated")

    print()
    print("✅ All translations added")


if __name__ == "__main__":
    main()
