"""Fix kicker sentences, s-title keywords, and L-slide card naming."""
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

# --- New kickers (sentences) and s-titles (keywords) ---
updates = {
    's1': {'title': 'Visa',       'kicker': 'Find Out If You Need One'},
    's2': {'title': 'Preparation', 'kicker': 'What to Sort Before You Fly'},
    's3': {'title': 'Arrival',     'kicker': 'From Tarmac to Taxi in 6 Steps'},
    's4': {'title': 'Connectivity','kicker': 'Stay Online Behind the Firewall'},
    's5': {'title': 'Payment',     'kicker': 'Go Cashless — Link in 5 Minutes'},
    's6': {'title': 'Eat · Move · Stay', 'kicker': 'Navigate China Like a Local'},
    's7': {'title': 'Medical',     'kicker': 'World-Class Care, Fraction of the Cost'},
    's8': {'title': 'Shopping',    'kicker': 'Buy the Best + Get Your Tax Back'},
    's9': {'title': 'Destinations','kicker': 'Nearly 500 Cities Await You'},
    's10':{'title': 'Emergency',   'kicker': 'When Things Go Wrong — Who to Call'},
    'l1': {'title': 'Status Transfer',  'kicker': 'Your Route In'},
    'l2': {'title': 'Work & Residence',  'kicker': 'Get Permitted'},
    'l3': {'title': 'Phone + Bank',      'kicker': 'Digital Keys to Everyday Life'},
    'l4': {'title': 'Housing',           'kicker': 'Find Your Home'},
    'l5': {'title': 'Insurance',         'kicker': 'Stay Covered'},
    'l6': {'title': 'Drive + School',    'kicker': 'Hit the Road, Hit the Books'},
    'l7': {'title': 'Daily Life',        'kicker': 'Live Like a Local'},
    'l8': {'title': 'Compliance',        'kicker': 'Play by the Rules'},
}

# --- L-slide card labels (descriptive) + new sub keys ---
l_labels_subs = {
    'l1': {
        'pathA': {'label': 'Tourist → Work',   'sub': 'Employer sponsors, convert or re-enter'},
        'pathB': {'label': 'Student → Work',   'sub': 'Graduate & convert in-country, no exit'},
        'pathC': {'label': 'K Visa (STEM Talent)',   'sub': 'Self-sponsored, 5-year multi-entry'},
    },
    'l2': {
        'workPermit':     {'label': 'Work Permit',      'sub': 'Step 1 — Employer applies online'},
        'residencePermit':{'label': 'Residence Permit',  'sub': 'Step 2 — Within 30 days of entry'},
    },
    'l3': {
        'phone': {'label': 'SIM Card',      'sub': 'Passport required. ¥29-99/month'},
        'bank':  {'label': 'Bank Account',  'sub': 'BOC / ICBC / CMB. Lifts ¥200 limit'},
    },
    'l4': {
        'rent':         {'label': 'Renting',       'sub': 'Ziroom · Beike · Contracts · Costs'},
        'registration': {'label': 'Registration',  'sub': 'Mandatory within 24h of moving'},
    },
    'l5': {
        'socialIns':  {'label': 'Social Insurance',  'sub': 'Five mandatory insurances + housing fund'},
        'privateIns': {'label': 'Private Insurance', 'sub': 'Cigna · Allianz · Bupa'},
    },
    'l6': {
        'license': {'label': "Driver's License", 'sub': 'Temp permit, direct swap, or written test'},
        'school':  {'label': 'Schools',           'sub': 'International · Bilingual · Public Intl'},
    },
    'l7': {
        'shopping':  {'label': 'Shopping',  'sub': 'Taobao · JD · Pinduoduo · Hema'},
        'food':      {'label': 'Dining',    'sub': 'Dianping · Meituan · Ele.me'},
        'clothing':  {'label': 'Clothing',  'sub': 'Sizes & seasonal dressing guide'},
        'transport': {'label': 'Transport', 'sub': 'Metro · DiDi · Shared bikes · HSR'},
    },
    'l8': {
        'renewal': {'label': 'Renewal & Compliance', 'sub': 'Permits · Overstay · Green Card'},
    },
}

# --- Apply to en.json and zh.json ---
zh_titles = {
    's1': '签证', 's2': '行前准备', 's3': '入境', 's4': '通讯', 's5': '支付',
    's6': '食·行·住', 's7': '医疗', 's8': '购物', 's9': '目的地', 's10': '紧急',
    'l1': '身份转换', 'l2': '工作与居留', 'l3': '手机+银行', 'l4': '租房',
    'l5': '保险', 'l6': '驾照+学校', 'l7': '日常生活', 'l8': '合规',
}
zh_kickers = {
    's1': '看看你需要签证吗', 's2': '出发前搞定这些', 's3': '落地到出关只需6步',
    's4': '翻越防火墙，保持在线', 's5': '无现金生活，5分钟绑卡',
    's6': '像本地人一样穿梭中国', 's7': '世界级医疗，价格只要零头',
    's8': '买最好的+退税拿回来', 's9': '近500座城市等你探索',
    's10':'遇到麻烦了——打给谁',
    'l1': '你的入境之路', 'l2': '拿到许可', 'l3': '数字生活的钥匙',
    'l4': '找到你的家', 'l5': '给自己保障', 'l6': '上路+上学',
    'l7': '像本地人一样生活', 'l8': '守规矩，少麻烦',
}
zh_labels = {
    'l1': {
        'pathA': {'label': '旅游 → 工作',   'sub': '雇主担保，境内转换或出境重入'},
        'pathB': {'label': '学生 → 工作',   'sub': '毕业境内直接转换，无需出境'},
        'pathC': {'label': 'K签证(STEM人才)', 'sub': '无需雇主，5年多次入境'},
    },
    'l2': {
        'workPermit':      {'label': '工作许可',     'sub': '第一步——雇主在线申请'},
        'residencePermit': {'label': '居留许可',     'sub': '第二步——入境30天内办理'},
    },
    'l3': {
        'phone': {'label': '手机卡',     'sub': '需护照原件。¥29-99/月'},
        'bank':  {'label': '银行账户',   'sub': '中行/工行/招行。解除¥200限额'},
    },
    'l4': {
        'rent':         {'label': '租房',   'sub': '自如·贝壳·合同·费用'},
        'registration': {'label': '住宿登记', 'sub': '搬家24小时内强制办理'},
    },
    'l5': {
        'socialIns':  {'label': '社会保险',   'sub': '五险一金，强制参保'},
        'privateIns': {'label': '商业保险',   'sub': 'Cigna·Allianz·Bupa'},
    },
    'l6': {
        'license': {'label': '驾照',   'sub': '临时许可、直接换领或笔试'},
        'school':  {'label': '学校',   'sub': '国际·双语·公立国际部'},
    },
    'l7': {
        'shopping':  {'label': '购物', 'sub': '淘宝·京东·拼多多·盒马'},
        'food':      {'label': '餐饮', 'sub': '大众点评·美团·饿了么'},
        'clothing':  {'label': '穿衣', 'sub': '尺码与四季穿搭指南'},
        'transport': {'label': '出行', 'sub': '地铁·滴滴·共享单车·高铁'},
    },
    'l8': {
        'renewal': {'label': '续签与合规', 'sub': '许可·逾期·绿卡'},
    },
}

for fname, lang_data in [
    ('d:/Work/HackYourWaytoChina/src/i18n/en.json', None),
    ('d:/Work/HackYourWaytoChina/src/i18n/zh.json', None),
]:
    with open(fname, encoding='utf-8') as f:
        data = json.load(f)

    is_zh = 'zh' in fname

    # Update titles and kickers
    for sid in updates:
        if sid not in data: continue
        data[sid]['kicker'] = zh_kickers[sid] if is_zh else updates[sid]['kicker']
        new_title = zh_titles[sid] if is_zh else updates[sid]['title']
        if 'meta' in data[sid]:
            data[sid]['meta']['title'] = new_title

    # Update L-slide labels and add sub keys
    for lid, entries in l_labels_subs.items():
        if lid not in data: continue
        for key, vals in entries.items():
            if key not in data[lid]: continue
            src = zh_labels[lid][key] if is_zh else vals
            data[lid][key]['label'] = src['label']
            data[lid][key]['sub'] = src['sub']

    with open(fname, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'{fname}: OK')

# Verify
for fname in ['d:/Work/HackYourWaytoChina/src/i18n/en.json', 'd:/Work/HackYourWaytoChina/src/i18n/zh.json']:
    with open(fname, encoding='utf-8') as f:
        data = json.load(f)
    for lid, entries in l_labels_subs.items():
        for key in entries:
            if 'sub' not in data[lid][key]:
                print(f'MISSING: {fname} {lid}.{key}.sub')
    print(f'{fname}: all subs present')
print('Done')
