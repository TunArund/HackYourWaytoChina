/* ============================================================
   data.js — Pure structured data (no language strings)
   All display text lives in i18n/*.json
   ============================================================ */

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
const MEDICAL_DENTAL = ['cleaning','filling','root','implant','crown'];
const MEDICAL_TCM = ['acupuncture','tuina','bonesetting','cupping','herbal'];
const SHOP_ELECTRONICS = ['foldable','drone','ai_glasses','translator','earbuds'];
const SOUVENIR_CITIES = ['beijing','chengdu','xian','chongqing','guizhou'];
const TAXREFUND_REQS = ['reqStay','reqAmount','reqDeparture','reqCarry'];
const TAXREFUND_STEPS = ['stepInvoice','stepCustoms','stepCollect'];
const SEASONS = ['spring','summer','autumn','winter'];


/* ============================================================
   Layout definitions — block arrays for detail views
   One copy, developer-maintained. i18n only holds text.
   Block types: h3, h4, intro, p, muted, tip, table, cards, ul, ol
   ============================================================ */
var LAYOUT = {
  s7: {
    hospital: {
      back: 's7.back',
      blocks: [
        { t: 'h3',    k: 's7.hospital.title' },
        { t: 'intro', k: 's7.hospital.intro' },
        { t: 'h4',    k: 's7.hospital.sectionHospitals' },
        { t: 'table', ref: 's7_hospitals' },
        { t: 'h4',    k: 's7.hospital.sectionMeds', pair: true },
        { t: 'table', ref: 's7_meds' },
        { t: 'tip',   k: 's7.hospital.insuranceWarning', body: 's7.hospital.insuranceDetail', s: 'warn' }
      ]
    },
    big3: {
      back: 's7.back',
      blocks: [
        { t: 'h3',    k: 's7.big3.title' },
        { t: 'h4',    k: 's7.big3.sectionDental' },
        { t: 'table', ref: 'big3_dental' },
        { t: 'h4',    k: 's7.big3.sectionEye' },
        { t: 'intro', k: 's7.big3.eyeDesc' },
        { t: 'h4',    k: 's7.big3.sectionTcm' },
        { t: 'table', ref: 'big3_tcm' },
        { t: 'tip',   k: 's7.big3.tcmHotspots', body: 's7.big3.tcmHotspotsDetail', s: 'info' }
      ]
    },
    checkup: {
      back: 's7.back',
      blocks: [
        { t: 'h3',    k: 's7.checkup.title' },
        { t: 'intro', k: 's7.checkup.intro' },
        { t: 'intro', k: 's7.checkup.recommended' },
        { t: 'tip',   k: 's7.checkup.warning', body: 's7.checkup.warningDetail', s: 'warn' }
      ]
    }
  },
  s8: {
    electronics: {
      back: 's8.back',
      blocks: [
        { t: 'h3',    k: 's8.electronics.title' },
        { t: 'table', ref: 's8_electronics' },
        { t: 'tip',   k: 's8.electronics.whereToBuy', body: 's8.electronics.whereToBuyDetail', s: 'info' }
      ]
    },
    souvenirs: {
      back: 's8.back',
      blocks: [
        { t: 'h3',    k: 's8.souvenirs.title' },
        { t: 'table', ref: 's8_souvenirs' },
        { t: 'muted', k: 's8.souvenirs.tip' }
      ]
    },
    taxrefund: {
      back: 's8.back',
      blocks: [
        { t: 'h3',    k: 's8.taxrefund.title' },
        { t: 'intro', k: 's8.taxrefund.stats' },
        { t: 'h4',    k: 's8.taxrefund.sectionRequirements' },
        { t: 'ul',    ref: 'taxrefund_reqs' },
        { t: 'h4',    k: 's8.taxrefund.sectionProcess' },
        { t: 'ol',    ref: 'taxrefund_steps' },
        { t: 'tip',   k: 's8.taxrefund.instantRefundTitle', body: 's8.taxrefund.instantRefundDetail', s: 'good' }
      ]
    },
    cityshops: {
      back: 's8.back',
      blocks: [
        { t: 'h3',    k: 's8.cityshops.title' },
        { t: 'muted', k: 's8.cityshops.tapHint' },
        { t: 'cards', ref: 'cityshops' }
      ]
    }
  },
  s9: {
    top10: {
      back: 's9.back',
      blocks: [
        { t: 'h3',    k: 's9.top10.title' },
        { t: 'muted', k: 's9.tapHint' },
        { t: 'cards', ref: 'top10' }
      ]
    },
    rising: {
      back: 's9.back',
      blocks: [
        { t: 'h3',    k: 's9.rising.title' },
        { t: 'muted', k: 's9.rising.subtitle' },
        { t: 'cards', ref: 'rising' }
      ]
    },
    seasons: {
      back: 's9.back',
      blocks: [
        { t: 'h3',    k: 's9.seasons.title' },
        { t: 'tip',   k: 's9.seasons.spring.title',  body: 's9.seasons.spring.desc',  s: 'info' },
        { t: 'tip',   k: 's9.seasons.summer.title',  body: 's9.seasons.summer.desc',  s: 'info' },
        { t: 'tip',   k: 's9.seasons.autumn.title',  body: 's9.seasons.autumn.desc',  s: 'info' },
        { t: 'tip',   k: 's9.seasons.winter.title',  body: 's9.seasons.winter.desc',  s: 'info' },
        { t: 'muted', k: 's9.seasons.sizingTip' }
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
    var cols = [t('s7.hospital.colCity'), t('s7.hospital.colHospital'), t('s7.hospital.colNote')];
    var rows = HOSPITAL_CITIES.map(function (c) { return [t('city.' + c + '.label'), t('s7.hospital.' + c + 'Name'), t('s7.hospital.' + c + 'Note')]; });
    return renderTable(cols, rows);
  },

  s7_meds: function () {
    var tl = LANG_LABELS[LANG] || LANG_LABELS['en'];
    var cols = [t('s7.hospital.colCn'), tl.full, t('s7.hospital.colUse')];
    var rows = MEDS.map(function (m) { return [m.cn, m[LANG] || m.en, t('s7.hospital.med' + m.k.charAt(0).toUpperCase() + m.k.slice(1) + 'Use')]; });
    return renderTable(cols, rows);
  },

  big3_dental: function () {
    var cols = [t('s7.big3.colItem'), t('s7.big3.colChinaPrice'), t('s7.big3.colUsEuPrice')];
    var rows = MEDICAL_DENTAL.map(function (k) { return [t('s7.big3.dental_' + k), t('s7.big3.dental_' + k + '_cn'), t('s7.big3.dental_' + k + '_us')]; });
    return renderTable(cols, rows);
  },

  big3_tcm: function () {
    var cols = [t('s7.big3.colTherapy'), t('s7.big3.colDescription'), t('s7.big3.colPrice')];
    var rows = MEDICAL_TCM.map(function (k) { return [t('s7.big3.tcm_' + k), t('s7.big3.tcm_' + k + '_desc'), t('s7.big3.tcm_' + k + '_price')]; });
    return renderTable(cols, rows);
  },

  s8_electronics: function () {
    var cols = [t('s8.electronics.colCategory'), t('s8.electronics.colWhy'), t('s8.electronics.colPrice')];
    var rows = SHOP_ELECTRONICS.map(function (k) { return [t('s8.electronics.' + k), t('s8.electronics.' + k + '_why'), t('s8.electronics.' + k + '_price') || '—']; });
    return renderTable(cols, rows);
  },

  s8_souvenirs: function () {
    var cols = [t('s8.souvenirs.colCity'), t('s8.souvenirs.colItem')];
    var rows = SOUVENIR_CITIES.map(function (k) { return [t('city.' + (k === 'xian' ? 'xian' : k) + '.label'), t('s8.souvenirs.' + k + '_item')]; });
    return renderTable(cols, rows);
  },

  /* ---- Lists ---- */

  taxrefund_reqs: function () {
    return '<ul class="step-list">' + TAXREFUND_REQS.map(function (k) { return '<li>' + t('s8.taxrefund.' + k) + '</li>'; }).join('') + '</ul>';
  },

  taxrefund_steps: function () {
    return '<ol class="step-list">' + TAXREFUND_STEPS.map(function (k) { return '<li>' + t('s8.taxrefund.' + k) + '</li>'; }).join('') + '</ol>';
  },

  /* ---- Cards (with sub-navigation) ---- */

  top10: function (sub) {
    if (sub) {
      return '<button class="detail-back" onclick="event.stopPropagation();openDetail(\'s9\',\'top10\')">← ' + t('s9.back') + '</button>'
        + '<h3>' + t('city.' + sub + '.label') + '</h3>'
        + '<p class="dp-subtitle">' + t('city.' + sub + '.tag') + '</p>'
        + '<p class="dp-text">' + t('city.' + sub + '.desc') + '</p>';
    }
    return renderCardGrid(TOP10_CITIES, 's9', 'top10', 'city.', 'label', 'tag');
  },

  rising: function (sub) {
    if (sub) {
      return '<button class="detail-back" onclick="event.stopPropagation();openDetail(\'s9\',\'rising\')">← ' + t('s9.back') + '</button>'
        + '<h3>' + t('city.' + sub + '.label') + '</h3>'
        + '<p class="dp-subtitle">' + t('city.' + sub + '.tag') + '</p>'
        + '<p class="dp-text">' + t('city.' + sub + '.desc') + '</p>';
    }
    return renderCardGrid(RISING_CITIES, 's9', 'rising', 'city.', 'label', 'tag');
  },

  cityshops: function (sub) {
    if (sub) {
      return '<button class="detail-back" onclick="event.stopPropagation();openDetail(\'s8\',\'cityshops\')">← ' + t('s8.back') + '</button>'
        + '<h3>' + t('shop.' + sub + '.name') + '</h3>'
        + '<p class="dp-text">' + t('shop.' + sub + '.desc') + '</p>';
    }
    return renderCardGrid(SHOP_CITY_KEYS, 's8', 'cityshops', 'shop.', 'name', null, function (k) { return t('s8.cityshops.cities.' + k + '.subtitle'); });
  }
};
