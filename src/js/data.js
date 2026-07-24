/* ============================================================
   data.js — Pure structured data (no language strings)
   All display text lives in i18n/*.json
   ============================================================ */

/* ---- Emoji / Icon Constants (pure decoration, not in i18n) ---- */
const COUNTRY_FLAGS = { AU:'🇦🇺',NZ:'🇳🇿',JP:'🇯🇵',KR:'🇰🇷',SG:'🇸🇬',MY:'🇲🇾',TH:'🇹🇭',ID:'🇮🇩',IN:'🇮🇳',PH:'🇵🇭',VN:'🇻🇳',BN:'🇧🇳',AE:'🇦🇪',QA:'🇶🇦',SA:'🇸🇦',KW:'🇰🇼',OM:'🇴🇲',BH:'🇧🇭',GB:'🇬🇧',FR:'🇫🇷',DE:'🇩🇪',IT:'🇮🇹',ES:'🇪🇸',PT:'🇵🇹',NL:'🇳🇱',BE:'🇧🇪',CH:'🇨🇭',AT:'🇦🇹',SE:'🇸🇪',NO:'🇳🇴',DK:'🇩🇰',FI:'🇫🇮',IS:'🇮🇸',IE:'🇮🇪',PL:'🇵🇱',HU:'🇭🇺',GR:'🇬🇷',RO:'🇷🇴',RU:'🇷🇺',US:'🇺🇸',CA:'🇨🇦',BR:'🇧🇷',AR:'🇦🇷',CL:'🇨🇱',MX:'🇲🇽',PE:'🇵🇪',UY:'🇺🇾',ZA:'🇿🇦',OTHER:'🌍' };
const CONTINENT_ICONS = { asiaPacific:'🌏',middleEast:'🏜️',europeWest:'🏰',europeEast:'🏛️',americas:'🌎',africa:'🌍' };
const PURPOSE_ICONS = { tourism:'🏖',business:'💼',family:'👨‍👩‍👧',transit:'🔄',work:'💻' };
const ONWARD_ICONS = { yes:'✅',no:'❌' };
const VISA_TYPE_ICONS = { mutual:'✅',free:'✅',transit:'✅',kvisa:'💡',visaRequired:'📋' };
const BUTTON_ICONS = { back:'←',reset:'🔄',details:'📋',home:'↩',expand:'→' };
const SEASON_ICONS = { spring:'🌸',summer:'🌿',autumn:'🍂',winter:'❄️' };

/* ---- Slide → Domain mapping (for detail.js renderSteps) ---- */
const SLIDE_DOMAIN = {
  s2:'preparation',s3:'arrival',s4:'connectivity',
  s5:'payment',s6:'lifestyle',s7:'medical',
  s8:'shopping',s9:'destinations',s10:'emergency',
  l1:'longstay.transfer',l2:'longstay.permits',l3:'longstay.phonebank',
  l4:'longstay.housing',l5:'longstay.insurance',l6:'longstay.driveschool',
  l7:'longstay.daily',l8:'longstay.compliance'
};

/* ---- Visa Rules ---- */
const VISA_FREE = new Set(['FR','DE','IT','NL','ES','CH','IE','HU','AT','BE','LU','PL','PT','GR','CY','SI','SK','NO','FI','DK','IS','AD','MC','LI','BG','RO','HR','ME','MK','MT','EE','LV','RU','SE','GB','BN','KR','JP','SA','OM','KW','BH','BR','AR','CL','PE','UY','CA','AU','NZ']);
const TRANSIT = new Set(['AT','BE','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IT','LV','LT','LU','MT','NL','PL','PT','SK','SI','ES','SE','CH','MC','RU','GB','IE','CY','BG','RO','UA','RS','HR','BA','ME','MK','AL','BY','NO','US','CA','BR','MX','AR','CL','AU','NZ','KR','JP','SG','BN','AE','QA','ID']);
const MUTUAL = new Set(['SG','AE','RS','MU','SC','BB','BS','EC','FJ','GD','JM','MV','MD','MC','LC','VC','WS','SB','TO','AG','AM','AZ','BY','BR','DM','GA','GE','KZ','KG','TH','UZ','SR']);

/* ---- Country list with continent grouping (names in i18n countries.{code}) ---- */
const COUNTRY_CONTINENTS = {
  asiaPacific: ['AU','NZ','JP','KR','SG','MY','TH','ID','IN','PH','VN','BN'],
  middleEast:  ['AE','QA','SA','KW','OM','BH'],
  europeWest:  ['GB','IE','FR','NL','BE','DE','CH','AT','IT','ES','PT','IS'],
  europeEast:  ['SE','NO','DK','FI','PL','HU','GR','RO','RU'],
  americas:    ['US','CA','BR','AR','CL','MX','PE','UY'],
  africa:      ['ZA']
};

/* ---- Visa detail data (conditions now in i18n; links reference i18n keys) ---- */
const VISA_DETAIL = {
  free: {
    links: [
      {key:'niaVisaFree', url:'https://en.nia.gov.cn'},
      {key:'beijingVisaFaq', url:'https://wb.beijing.gov.cn/home/wswm/crjxx/qzxx/qztz/202605/t20260522_4661992.html'}
    ]
  },
  mutual: {
    links: [
      {key:'mfaConsular', url:'https://www.mfa.gov.cn'}
    ]
  },
  transit: {
    links: [
      {key:'niaTransit', url:'https://en.nia.gov.cn'}
    ]
  },
  visaRequired: {
    links: [
      {key:'cvasc', url:'https://www.visaforchina.cn'},
      {key:'onlineBooking', url:'https://bio.visaforchina.cn'},
      {key:'consularServices', url:'https://consular.mfa.gov.cn/VISA/'}
    ]
  },
  kvisa: {
    links: [
      {key:'niaKVisa', url:'https://en.nia.gov.cn'}
    ]
  }
};

/* ---- City keys for destinations ---- */
const TOP10_CITIES = ['shanghai','beijing','guangzhou','shenzhen','chongqing','chengdu','hangzhou','kunming','harbin','qingdao'];
const RISING_CITIES = ['zhengzhou','taiyuan','guiyang','fuzhou','yiwu'];
const HOSPITAL_CITIES = ['shanghai','beijing','guangzhou','tianjin','hainan'];

/* ---- Shop city keys ---- */
const SHOP_CITY_KEYS = ['shenzhen','shanghai','yiwu','sanya','beijing'];

/* ---- Medication data (trilingual; use key in i18n for usage description) ---- */
const MEDS = [
  { cn:'布洛芬', en:'Ibuprofen', ru:'Ибупрофен', k:'ibuprofen' },
  { cn:'阿莫西林', en:'Amoxicillin', ru:'Амоксициллин', k:'amoxicillin' },
  { cn:'洛哌丁胺', en:'Loperamide', ru:'Лоперамид', k:'loperamide' },
  { cn:'氯雷他定', en:'Loratadine', ru:'Лоратадин', k:'loratadine' },
  { cn:'奥美拉唑', en:'Omeprazole', ru:'Омепразол', k:'omeprazole' },
];

/* ---- Language labels for dynamic CN|targetLang display ---- */
var LANG_LABELS = {
  en: { short: 'EN', full: 'English' },
  zh: { short: '中', full: '中文' },
  ja: { short: '日', full: '日本語' },
  ko: { short: '한', full: '한국어' },
  ru: { short: 'RU', full: 'Русский' },
  vi: { short: 'VI', full: 'Tiếng Việt' }
};

/* ---- Treatment lists (keys map to i18n for display) ---- */
const MEDICAL_DENTAL = ['cleaning','filling','rootCanal','implant','crown'];
const MEDICAL_TCM = ['acupuncture','tuina','bonesetting','cupping','herbal'];
const SHOP_ELECTRONICS = ['foldable','drone','aiGlasses','translator','earbuds'];
const SOUVENIR_CITIES = ['beijing','chengdu','xian','chongqing','guizhou'];
const TAXREFUND_REQS = ['reqStay','reqAmount','reqDeparture','reqCarry'];
const TAXREFUND_STEPS = ['stepInvoice','stepCustoms','stepCollect'];
const SEASONS = ['spring','summer','autumn','winter'];


/* ============================================================
   Layout definitions — block arrays for detail views
   One copy, developer-maintained. i18n only holds text.
   Block types: h3, h4, intro, p, muted, tip, table, cards, ul, ol
   icon: optional emoji prepended before translated text
   ============================================================ */
var LAYOUT = {
  s7: {
    hospital: {
      blocks: [
        { t: 'h3',    k: 'medical.hospital.title', icon: '🏥' },
        { t: 'intro', k: 'medical.hospital.intro' },
        { t: 'h4',    k: 'medical.hospital.sectionHospitals' },
        { t: 'table', ref: 's7_hospitals' },
        { t: 'h4',    k: 'medical.hospital.sectionMeds', pair: true },
        { t: 'table', ref: 's7_meds' },
        { t: 'tip',   k: 'medical.hospital.insuranceWarning', body: 'medical.hospital.insuranceDetail', s: 'warn' }
      ]
    },
    big3: {
      blocks: [
        { t: 'h3',    k: 'medical.dental.title', icon: '🦷' },
        { t: 'h4',    k: 'medical.dental.sectionDental' },
        { t: 'table', ref: 'big3_dental' },
        { t: 'h4',    k: 'medical.eyeCare.sectionTitle' },
        { t: 'intro', k: 'medical.eyeCare.desc' },
        { t: 'h4',    k: 'medical.tcm.sectionTitle' },
        { t: 'table', ref: 'big3_tcm' },
        { t: 'tip',   k: 'medical.tcm.hotspots', body: 'medical.tcm.hotspotsDetail', s: 'info' }
      ]
    },
    checkup: {
      blocks: [
        { t: 'h3',    k: 'medical.healthCheckup.title', icon: '📋' },
        { t: 'intro', k: 'medical.healthCheckup.intro' },
        { t: 'intro', k: 'medical.healthCheckup.recommended' },
        { t: 'tip',   k: 'medical.healthCheckup.warning', body: 'medical.healthCheckup.warningDetail', s: 'warn' }
      ]
    }
  },
  s8: {
    electronics: {
      blocks: [
        { t: 'h3',    k: 'shopping.electronics.title', icon: '📱' },
        { t: 'table', ref: 's8_electronics' },
        { t: 'tip',   k: 'shopping.electronics.whereToBuy', body: 'shopping.electronics.whereToBuyDetail', s: 'info' }
      ]
    },
    souvenirs: {
      blocks: [
        { t: 'h3',    k: 'shopping.souvenirs.title', icon: '🎨' },
        { t: 'table', ref: 's8_souvenirs' },
        { t: 'muted', k: 'shopping.souvenirs.tip' }
      ]
    },
    taxrefund: {
      blocks: [
        { t: 'h3',    k: 'shopping.taxrefund.title', icon: '💰' },
        { t: 'intro', k: 'shopping.taxrefund.stats' },
        { t: 'h4',    k: 'shopping.taxrefund.sectionRequirements' },
        { t: 'ul',    ref: 'taxrefund_reqs' },
        { t: 'h4',    k: 'shopping.taxrefund.sectionProcess' },
        { t: 'ol',    ref: 'taxrefund_steps' },
        { t: 'tip',   k: 'shopping.taxrefund.instantRefundTitle', body: 'shopping.taxrefund.instantRefundDetail', s: 'good' }
      ]
    },
    cityshops: {
      blocks: [
        { t: 'h3',    k: 'shopping.cityshops.title', icon: '🗺️' },
        { t: 'muted', k: 'shopping.cityshops.tapHint' },
        { t: 'cards', ref: 'cityshops' }
      ]
    }
  },
  s9: {
    top10: {
      blocks: [
        { t: 'h3',    k: 'destinations.top10.title', icon: '🏙️' },
        { t: 'muted', k: 'slide.s9.tapHint' },
        { t: 'cards', ref: 'top10' }
      ]
    },
    rising: {
      blocks: [
        { t: 'h3',    k: 'destinations.rising.title', icon: '🚀' },
        { t: 'muted', k: 'destinations.rising.subtitle' },
        { t: 'cards', ref: 'rising' }
      ]
    },
    seasons: {
      blocks: [
        { t: 'h3',    k: 'destinations.seasons.title', icon: '🌍' },
        { t: 'tip',   k: 'destinations.seasons.spring.title',  body: 'destinations.seasons.spring.desc',  s: 'info' },
        { t: 'tip',   k: 'destinations.seasons.summer.title',  body: 'destinations.seasons.summer.desc',  s: 'info' },
        { t: 'tip',   k: 'destinations.seasons.autumn.title',  body: 'destinations.seasons.autumn.desc',  s: 'info' },
        { t: 'tip',   k: 'destinations.seasons.winter.title',  body: 'destinations.seasons.winter.desc',  s: 'info' },
        { t: 'muted', k: 'destinations.seasons.sizingTip' }
      ]
    }
  }
};


/* ============================================================
   Block handlers — table / cards data iterators
   Called at render time by detail.js renderBlock()
   Each receives (sub) for sub-navigation; returns HTML string
   ============================================================ */
var BLOCK_HANDLERS = {

  /* ---- Tables ---- */

  s7_hospitals: function () {
    var cols = [t('medical.hospital.colCity'), t('medical.hospital.colHospital'), t('medical.hospital.colNote')];
    var rows = HOSPITAL_CITIES.map(function (c) { return [t('city.' + c + '.label'), t('medical.hospital.' + c + 'Name'), t('medical.hospital.' + c + 'Note')]; });
    return renderTable(cols, rows);
  },

  s7_meds: function () {
    var tl = LANG_LABELS[LANG] || LANG_LABELS['en'];
    var cols = [t('medical.hospital.colCn'), tl.full, t('medical.hospital.colUse')];
    var rows = MEDS.map(function (m) { return [m.cn, m[LANG] || m.en, t('medical.hospital.med' + m.k.charAt(0).toUpperCase() + m.k.slice(1) + 'Use')]; });
    return renderTable(cols, rows);
  },

  big3_dental: function () {
    var cols = [t('medical.dental.colItem'), t('medical.dental.colChinaPrice'), t('medical.dental.colUsEuPrice')];
    var rows = MEDICAL_DENTAL.map(function (k) { return [t('medical.dental.' + k), t('medical.dental.' + k + 'Cn'), t('medical.dental.' + k + 'Us')]; });
    return renderTable(cols, rows);
  },

  big3_tcm: function () {
    var cols = [t('medical.tcm.colTherapy'), t('medical.tcm.colDescription'), t('medical.tcm.colPrice')];
    var rows = MEDICAL_TCM.map(function (k) { return [t('medical.tcm.' + k), t('medical.tcm.' + k + 'Desc'), t('medical.tcm.' + k + 'Price')]; });
    return renderTable(cols, rows);
  },

  s8_electronics: function () {
    var cols = [t('shopping.electronics.colCategory'), t('shopping.electronics.colWhy'), t('shopping.electronics.colPrice')];
    var rows = SHOP_ELECTRONICS.map(function (k) { return [t('shopping.electronics.' + k), t('shopping.electronics.' + k + 'Why'), t('shopping.electronics.' + k + 'Price') || '—']; });
    return renderTable(cols, rows);
  },

  s8_souvenirs: function () {
    var cols = [t('shopping.souvenirs.colCity'), t('shopping.souvenirs.colItem')];
    var rows = SOUVENIR_CITIES.map(function (k) { return [t('city.' + (k === 'xian' ? 'xian' : k) + '.label'), t('shopping.souvenirs.' + k + 'Item')]; });
    return renderTable(cols, rows);
  },

  /* ---- Lists ---- */

  taxrefund_reqs: function () {
    return '<ul class="step-list">' + TAXREFUND_REQS.map(function (k) { return '<li>' + t('shopping.taxrefund.' + k) + '</li>'; }).join('') + '</ul>';
  },

  taxrefund_steps: function () {
    return '<ol class="step-list">' + TAXREFUND_STEPS.map(function (k) { return '<li>' + t('shopping.taxrefund.' + k) + '</li>'; }).join('') + '</ol>';
  },

  /* ---- Cards (with sub-navigation) ---- */

  top10: function (sub) {
    if (sub) {
      return '<button class="detail-back" onclick="event.stopPropagation();openDetail(\'s9\',\'top10\')">' + BUTTON_ICONS.back + ' ' + t('app.buttons.back') + '</button>'
        + '<h3>' + t('city.' + sub + '.label') + '</h3>'
        + '<p class="dp-subtitle">' + t('city.' + sub + '.tag') + '</p>'
        + '<p class="dp-text">' + t('city.' + sub + '.desc') + '</p>';
    }
    return renderCardGrid(TOP10_CITIES, 's9', 'top10', 'city.', 'label', 'tag');
  },

  rising: function (sub) {
    if (sub) {
      return '<button class="detail-back" onclick="event.stopPropagation();openDetail(\'s9\',\'rising\')">' + BUTTON_ICONS.back + ' ' + t('app.buttons.back') + '</button>'
        + '<h3>' + t('city.' + sub + '.label') + '</h3>'
        + '<p class="dp-subtitle">' + t('city.' + sub + '.tag') + '</p>'
        + '<p class="dp-text">' + t('city.' + sub + '.desc') + '</p>';
    }
    return renderCardGrid(RISING_CITIES, 's9', 'rising', 'city.', 'label', 'tag');
  },

  cityshops: function (sub) {
    if (sub) {
      return '<button class="detail-back" onclick="event.stopPropagation();openDetail(\'s8\',\'cityshops\')">' + BUTTON_ICONS.back + ' ' + t('app.buttons.back') + '</button>'
        + '<h3>' + t('shop.' + sub + '.name') + '</h3>'
        + '<p class="dp-text">' + t('shop.' + sub + '.desc') + '</p>';
    }
    return renderCardGrid(SHOP_CITY_KEYS, 's8', 'cityshops', 'shop.', 'name', null, function (k) { return t('shopping.cityshops.cities.' + k + '.subtitle'); });
  }
};
