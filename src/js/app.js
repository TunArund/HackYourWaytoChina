/* ============================================================
   app.js — Visa checker, language selector, hash URL restore, init
   ============================================================ */


/* ============================================================
   Visa Checker — card-based: continent → country → detail
   ============================================================ */
var vcCards = document.getElementById('vcCards');
var vcBack = document.getElementById('vcBack');
var vcR = document.getElementById('vcResult');
var vcReset = document.getElementById('vcReset');
var _visaState = null; // { view: 'continents'|'countries', continent: key }

var CONTINENT_ORDER = ['asiaPacific','middleEast','europeWest','europeEast','americas','africa'];

function showContinents() {
  _visaState = { view: 'continents' };
  vcR.className = 'vc-result'; vcR.innerHTML = '';
  vcR._lastCountry = null;
  vcReset.classList.remove('show');
  vcBack.style.display = 'none';
  vcCards.className = 'vc-cards';

  var html = '';
  for (var i = 0; i < CONTINENT_ORDER.length; i++) {
    var c = CONTINENT_ORDER[i];
    var name = t('s1.continents.' + c) || c;
    html += '<div class="card vc-card" onclick="showCountries(\'' + c + '\')" role="button" tabindex="0">'
      + '<span class="vc-card-label">' + name + '</span>'
      + '</div>';
  }
  vcCards.innerHTML = html;
}

function showCountries(continent) {
  _visaState = { view: 'countries', continent: continent };
  vcR.className = 'vc-result'; vcR.innerHTML = '';
  vcR._lastCountry = null;
  vcReset.classList.remove('show');
  vcBack.style.display = '';
  vcCards.className = 'vc-cards vc-cards--sm';

  var codes = COUNTRY_CONTINENTS[continent] || [];
  var html = '';
  for (var i = 0; i < codes.length; i++) {
    var code = codes[i];
    var name = t('countries.' + code) || code;
    html += '<div class="card vc-card" onclick="showVisaPolicies(\'' + code + '\')" role="button" tabindex="0">'
      + '<span class="vc-card-label">' + name + '</span>'
      + '</div>';
  }
  vcCards.innerHTML = html;
}

/* Visa result for selected country */
function showVisaPolicies(code) {
  if (!code) return;
  var types = [];
  if (MUTUAL.has(code)) types.push('mutual');
  if (VISA_FREE.has(code)) types.push('free');
  if (TRANSIT.has(code)) types.push('transit');
  if (types.length === 0) types.push('visaRequired');

  vcCards.innerHTML = '';
  vcBack.style.display = 'none';
  vcR.className = 'vc-result show';
  vcR._lastCountry = code;
  vcR._lastTypes = types;
  vcR.innerHTML = safeHtml(types.map(function (type) { return renderVisaSection(type, code); }).join(''));
  vcReset.classList.add('show');
}

function renderVisaSection(type, code) {
  var conds = tArray('visa.' + type + '.conditions');
  var condList = Array.isArray(conds) ? conds : [];
  var links = (VISA_DETAIL[type] && VISA_DETAIL[type].links) || [];
  var ruNote = (code === 'RU' && type === 'free')
    ? '<p class="tip-box tip-box--warn"><strong>' + t('visa.free.ruWarning') + '</strong></p>' : '';
  var linksBlock = links.length
    ? '<div class="vc-links-block"><p class="vc-links-heading">🔗 ' + t('app.links.official') + '</p>' + links.map(function (l) { return '<a href="' + l.url + '" target="_blank" rel="noopener" class="vc-link">' + t('visa.links.' + l.key) + ' →</a>'; }).join('') + '</div>' : '';

  return '<div class="vc-section">'
    + '<h4 class="vc-section-title">📋 ' + t('visa.' + type + '.detailTitle') + '</h4>'
    + '<ul class="step-list">' + condList.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul>'
    + ruNote + linksBlock
    + '</div>';
}

/* i18n update: re-render card labels */
function updateCountryLang() {
  if (_visaState && _visaState.view === 'countries') showCountries(_visaState.continent);
  else showContinents();
}

// Init
showContinents();


var isRestoring = false;


/* ============================================================
   Language selector (dropdown in top bar)
   ============================================================ */
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },      // Default
  { code: 'ko', name: '한국어', flag: '🇰🇷' },      // #1 Korea
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },     // #2 Russia
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },  // #4 Vietnam
  { code: 'ja', name: '日本語', flag: '🇯🇵' },      // #8 Japan
  { code: 'zh', name: '中文', flag: '🇨🇳' }          // Chinese
];

function buildLanguageDropdown() {
  const btn = document.getElementById('btnLang');
  if (!btn) return;

  // Create dropdown container
  const dropdown = document.createElement('div');
  dropdown.className = 'lang-dropdown';
  dropdown.id = 'langDropdown';
  dropdown.style.display = 'none';

  SUPPORTED_LANGUAGES.forEach(lang => {
    const item = document.createElement('button');
    item.className = 'lang-dropdown-item';
    item.innerHTML = `${lang.flag} ${lang.name}`;
    item.onclick = (e) => {
      e.stopPropagation();
      setLang(lang.code);
      dropdown.style.display = 'none';
    };
    dropdown.appendChild(item);
  });

  btn.parentElement.appendChild(dropdown);
}

function updateLanguageButton() {
  const btn = document.getElementById('btnLang');
  if (!btn) return;

  const current = document.documentElement.getAttribute('data-lang') || 'en';
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === current) || SUPPORTED_LANGUAGES[0];

  btn.innerHTML = `${currentLang.flag} ${currentLang.name} <span style="margin-left:4px">▼</span>`;
  btn.setAttribute('aria-label', `Current language: ${currentLang.name}`);
}

function toggleLanguageDropdown(e) {
  e.stopPropagation();
  const dropdown = document.getElementById('langDropdown');
  if (!dropdown) return;

  dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

// Close dropdown when clicking outside
document.addEventListener('click', () => {
  const dropdown = document.getElementById('langDropdown');
  if (dropdown) dropdown.style.display = 'none';
});

document.getElementById('btnLang').addEventListener('click', toggleLanguageDropdown);

// Prevent browser from restoring scroll position on refresh
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

/* ============================================================
   Hash URL restore — on page load, parse hash and restore state
   ============================================================ */
function restoreFromHash() {
  var hash = window.location.hash;
  if (!hash || hash === '#s0' || hash === '#') return false;

  // Parse: #slideId  or  #slideId-detail-key  or  #slideId-detail-key-sub
  var rest = hash.replace('#', '');
  var dashIdx = rest.indexOf('-detail-');
  var slideId, detailKey, detailSub;
  if (dashIdx > -1) {
    slideId = rest.substring(0, dashIdx);
    var afterDetail = rest.substring(dashIdx + 8); // '-detail-'.length === 8
    var subIdx = afterDetail.indexOf('-');
    if (subIdx > -1) {
      detailKey = afterDetail.substring(0, subIdx);
      detailSub = afterDetail.substring(subIdx + 1);
    } else {
      detailKey = afterDetail;
      detailSub = null;
    }
  } else {
    slideId = rest;
    detailKey = null;
    detailSub = null;
  }

  // Validate slideId
  var slideEl = document.getElementById(slideId);
  if (!slideEl) return false;

  // Determine version
  var version = slideId.charAt(0) === 'l' ? 'long' : 'short';

  // Start version, targeting the specific slide (instant scroll, no animation)
  startVersion(version, slideEl);

  // If a detail was open, restore it after a brief DOM settle
  if (detailKey) {
    isRestoring = true;
    setTimeout(function () {
      openDetail(slideId, detailKey, detailSub);
      isRestoring = false;
    }, 150);
  }

  return true;
}

// Initialize on DOM ready
function _appInit() {
  buildLanguageDropdown();
  updateLanguageButton();
  restoreFromHash();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _appInit);
} else {
  _appInit();
}
