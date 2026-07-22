/* ============================================================
   i18n.js — Lightweight i18n engine
   ============================================================ */

let I18N = {};
let LANG = 'en';
let _ready = false;

/* Translate all elements with data-i18n attribute */
function translateDOM() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);

    // Skip if translation is missing (format: [some.key])
    // But allow translations that happen to start with [ (like button text "[ Expand → ]")
    const isMissingKey = translation && translation.startsWith('[') && translation.endsWith(']') && !translation.includes(' ');

    if (translation && !isMissingKey) {
      // Use innerHTML to preserve HTML tags like <strong>
      el.innerHTML = translation;
    }
  });
}

function refreshUI() {
  // Translate all [data-i18n] elements
  translateDOM();

  const vcR = document.getElementById('vcResult');
  if (vcR && vcR.classList.contains('show') && vcR._lastCountry && typeof showVisaPolicies === 'function') showVisaPolicies(vcR._lastCountry);
  if (typeof currentDetail !== 'undefined' && currentDetail.slide) {
    const panel = document.getElementById('detail-' + currentDetail.slide);
    if (panel && panel.classList.contains('active') && typeof renderDetail === 'function') {
      panel.innerHTML = renderDetail(currentDetail.slide, currentDetail.key, currentDetail.sub);
    }
  }
  if (typeof updateVersionSwitchText === 'function') updateVersionSwitchText();
  if (typeof updateLanguageButton === 'function') updateLanguageButton();
  if (typeof updateCountryLang === 'function') updateCountryLang();
}

/* Init: load bundled (offline) or fetch (dev) immediately */
(async function () {
  const saved = localStorage.getItem('guide-lang') || 'en';
  LANG = saved;
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

  // Translate DOM after i18n is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', translateDOM);
  } else {
    translateDOM();
  }

  if (typeof updateCountryLang === 'function') updateCountryLang();
  if (typeof refreshUI === 'function') refreshUI();
})();

/* _lookup(bundle, key) — traverse nested bundle for dot-separated key; returns value or undefined */
function _lookup(bundle, key) {
  const parts = key.split('.');
  let v = bundle;
  for (const p of parts) {
    if (v == null || typeof v !== 'object') return undefined;
    v = v[p];
  }
  return v;
}

/* _fallback(key, raw) — try English bundle if current language isn't en */
function _fallback(key, raw) {
  if (LANG === 'en') return undefined;
  const enBundle = (window.__I18N_BUNDLE && window.__I18N_BUNDLE.en) || null;
  if (!enBundle) return undefined;
  return _lookup(enBundle, key);
}

function t(key) {
  if (!_ready) return '…';
  let v = _lookup(I18N, key);
  if (v !== undefined) return String(v);
  v = _fallback(key, false);
  if (v !== undefined) return String(v);
  return '[' + key + ']';
}

/* ta(key) — like t() but returns raw value (for arrays, objects) */
function ta(key) {
  if (!_ready) return [];
  let v = _lookup(I18N, key);
  if (v !== undefined) return v;
  v = _fallback(key, true);
  if (v !== undefined) return v;
  return [];
}

async function setLang(lang) {
  LANG = lang;
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
  if (typeof updateLanguageButton === 'function') updateLanguageButton();
  if (typeof updateCountryLang === 'function') updateCountryLang();
  if (typeof refreshUI === 'function') refreshUI();
}
