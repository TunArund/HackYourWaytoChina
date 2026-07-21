/* ============================================================
   data.js — Pure structured data (no language strings)
   All display text lives in i18n/*.json
   ============================================================ */

/* ---- Visa Rules ---- */
const VISA_FREE = new Set(['FR','DE','IT','NL','ES','CH','IE','HU','AT','BE','LU','PL','PT','GR','CY','SI','SK','NO','FI','DK','IS','AD','MC','LI','BG','RO','HR','ME','MK','MT','EE','LV','RU','SE','GB','BN','KR','JP','SA','OM','KW','BH','BR','AR','CL','PE','UY','CA','AU','NZ']);
const TRANSIT = new Set(['AT','BE','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IT','LV','LT','LU','MT','NL','PL','PT','SK','SI','ES','SE','CH','MC','RU','GB','IE','CY','BG','RO','UA','RS','HR','BA','ME','MK','AL','BY','NO','US','CA','BR','MX','AR','CL','AU','NZ','KR','JP','SG','BN','AE','QA','ID']);
const MUTUAL = new Set(['SG','AE','RS','MU','SC','BB','BS','EC','FJ','GD','JM','MV','MD','MC','LC','VC','WS','SB','TO','AG','AM','AZ','BY','BR','DM','GA','GE','KZ','KG','TH','UZ','SR']);

/* ---- Country list (code + flag only; names in i18n countries.{code}) ---- */
const COUNTRY_CODES = ['AU','NZ','JP','KR','SG','MY','TH','ID','IN','PH','VN','BN','AE','QA','SA','KW','OM','BH','GB','FR','DE','IT','ES','PT','NL','BE','CH','AT','SE','NO','DK','FI','IS','IE','PL','HU','GR','RO','RU','US','CA','BR','AR','CL','MX','PE','UY','ZA','OTHER'];

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

/* ---- Aesthetic clinic contact data ---- */
const COSMETIC_CLINICS = {
  jiahui: { addr:'上海市徐汇区桂平路689号', tel:'4008-919191', web:'jiahui.com' },
  mhwd:   { addr:'上海市', tel:'', web:'' },
  rodeo:  { addr:'上海市黄浦区茂名南路7号2楼', tel:'', web:'' },
  yuansong: { addr:'上海市(多个院区)', tel:'', web:'' }
};
const CLINIC_KEYS = Object.keys(COSMETIC_CLINICS);

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

/* ---- Treatment lists (keys map to i18n for display) ---- */
const COSMETIC_LASER = ['ipl','pico','thermage','hifu','hair_removal'];
const COSMETIC_INJECTION = ['botox_import','juvederm','btx_domestic','ha_domestic','neck_filler'];
const COSMETIC_SURGERY = ['thread_lift','incisional','rhinoplasty','rib_rhino'];
const BIG3_DENTAL = ['implant','cleaning','crown'];
const BIG3_TCM = ['acupuncture','tuina','bonesetting','herbal'];
const SHOP_ELECTRONICS = ['foldable','drone','ai_glasses','translator','earbuds'];
const SOUVENIR_CITIES = ['beijing','chengdu','xian','chongqing','guizhou'];
const TAXREFUND_REQS = ['reqStay','reqAmount','reqDeparture','reqCarry'];
const TAXREFUND_STEPS = ['stepInvoice','stepCustoms','stepCollect'];
const SEASONS = ['spring','summer','autumn','winter'];
