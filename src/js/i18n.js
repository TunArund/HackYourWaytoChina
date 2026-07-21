/* ============================================================
   i18n.js — Lightweight i18n engine
   ============================================================ */

let I18N = {};
let _ready = false;

/* Init: load bundled (offline) or fetch (dev) immediately */
(async function () {
  const saved = localStorage.getItem('guide-lang') || 'en';
  if (window.__I18N_BUNDLE) {
    I18N = window.__I18N_BUNDLE[saved] || window.__I18N_BUNDLE['en'] || {};
    _ready = true;
  } else {
    try {
      const res = await fetch('i18n/' + saved + '.json');
      I18N = await res.json();
      _ready = true;
    } catch (e) {
      console.warn('i18n: fetch failed, trying en fallback');
      try {
        const res = await fetch('i18n/en.json');
        I18N = await res.json();
        _ready = true;
      } catch (e2) {
        console.error('i18n: cannot load any language file');
        I18N = {};
        _ready = true;
      }
    }
  }
  document.documentElement.setAttribute('data-lang', saved);
  if (typeof updateCountryLang === 'function') updateCountryLang();
  if (typeof refreshUI === 'function') refreshUI();
})();

function t(key) {
  if (!_ready) return '…';
  // Try flat lookup first (supports dot-in-key names from data.js migration)
  if (I18N[key] !== undefined) return String(I18N[key]);
  // Try nested traversal (supports the agent's nested JSON structure)
  const parts = key.split('.');
  let v = I18N;
  for (const p of parts) {
    if (v == null || typeof v !== 'object') return '[' + key + ']';
    v = v[p];
  }
  return v !== undefined ? String(v) : '[' + key + ']';
}

/* ta(key) — like t() but returns raw value (for arrays, objects) */
function ta(key) {
  if (!_ready) return [];
  if (I18N[key] !== undefined) return I18N[key];
  const parts = key.split('.');
  let v = I18N;
  for (const p of parts) {
    if (v == null || typeof v !== 'object') return [];
    v = v[p];
  }
  return v !== undefined ? v : [];
}

async function setLang(lang) {
  if (window.__I18N_BUNDLE && window.__I18N_BUNDLE[lang]) {
    I18N = window.__I18N_BUNDLE[lang];
  } else {
    try {
      const res = await fetch('i18n/' + lang + '.json');
      I18N = await res.json();
    } catch (e) { console.warn('i18n: cannot load', lang); return; }
  }
  _ready = true;
  document.documentElement.setAttribute('data-lang', lang);
  localStorage.setItem('guide-lang', lang);
  if (typeof updateCountryLang === 'function') updateCountryLang();
  if (typeof refreshUI === 'function') refreshUI();
}

function refreshUI() {
  const vcR = document.getElementById('vcResult');
  if (vcR && vcR.classList.contains('show') && typeof checkVisa === 'function') checkVisa();
  if (typeof currentDetail !== 'undefined' && currentDetail.slide) {
    const panel = document.getElementById('detail-' + currentDetail.slide);
    if (panel && panel.classList.contains('active') && typeof renderDetail === 'function') {
      panel.innerHTML = renderDetail(currentDetail.slide, currentDetail.key, currentDetail.sub);
    }
  }
  if (typeof updateVersionSwitchText === 'function') updateVersionSwitchText();
  if (typeof updateCountryLang === 'function') updateCountryLang();
}
