/* ============================================================
   app.js — Version management, navigation, visa checker, language
   ============================================================ */

// Clean up stale hash fragments that match slide IDs (would force-scroll on refresh)
if (/^#s\d/.test(window.location.hash)) {
  history.replaceState(null, '', window.location.pathname + window.location.search);
}

/* ============================================================
   Version Management
   ============================================================ */
let currentVersion = null;
const container = document.getElementById('slidesContainer');
const scrubber = document.getElementById('navScrubber');
const versionSwitch = document.getElementById('versionSwitch');
const tooltip = document.getElementById('scrubTooltip');

function startVersion(v) {
  currentVersion = v;
  document.body.className = 'version-' + v;
  // Explicitly hide slides from the other version (belt-and-suspenders with CSS)
  container.querySelectorAll('.slide--short,.slide--long').forEach(s => {
    if (v === 'short') { s.style.display = s.classList.contains('slide--short') ? '' : 'none'; }
    else { s.style.display = s.classList.contains('slide--long') ? '' : 'none'; }
  });
  container.classList.remove('locked');
  versionSwitch.classList.add('visible');
  scrubber.classList.add('visible');
  updateVersionSwitchText();
  buildBars();
  const first = v === 'short' ? document.getElementById('s1') : document.getElementById('l1');
  if (first) first.scrollIntoView({ behavior: 'smooth' });
}

function resetToCover() {
  if (!currentVersion) return;
  currentVersion = null;
  container.classList.add('locked');
  container.scrollTo({ top: 0, behavior: 'instant' });
  // Clear inline display styles so CSS rules take over
  container.querySelectorAll('.slide--short,.slide--long').forEach(s => { s.style.display = ''; });
  versionSwitch.classList.remove('visible');
  scrubber.classList.remove('visible');
}

function updateVersionSwitchText() {
  versionSwitch.innerHTML = t('app.nav.home') || '↩ Home';
}


/* ============================================================
   Draggable Scrubber
   ============================================================ */
let bars = [], barElements = [];

function getVisibleSlides() {
  const all = container.querySelectorAll('section.slide');
  const vis = [];
  all.forEach(s => {
    if (s.id === 's0') return;
    if (window.getComputedStyle(s).display !== 'none') vis.push(s);
  });
  return vis;
}

function buildBars() {
  scrubber.innerHTML = '';
  barElements = [];
  bars = getVisibleSlides();
  bars.forEach((s, i) => {
    const bar = document.createElement('div');
    bar.className = 'nav-bar';
    scrubber.appendChild(bar);
    barElements.push(bar);
  });
}

function updateBarHighlight(slideIdx) {
  barElements.forEach((b, i) => b.classList.toggle('active', i === slideIdx));
}

function currentSlideIndex() {
  const ch = container.clientHeight;
  let idx = 0;
  bars.forEach((s, i) => { if (s.getBoundingClientRect().top < ch * 0.5) idx = i; });
  return idx;
}

function getSlideHeading(slide, idx) {
  const h2s = slide.querySelectorAll('.s-title');
  let txt = '';
  h2s.forEach(h => { if (window.getComputedStyle(h).display !== 'none') txt = h.textContent.trim(); });
  return (idx + 1) + '. ' + txt;
}

let dragging = false, pointerDownY = 0;

function getClosestBarIndex(clientY) {
  let best = 0, min = Infinity;
  barElements.forEach((b, i) => {
    const r = b.getBoundingClientRect(), cy = r.top + r.height / 2;
    const d = Math.abs(clientY - cy);
    if (d < min) { min = d; best = i; }
  });
  return best;
}

function showBarTooltip(idx) {
  if (!barElements[idx]) return;
  const barRect = barElements[idx].getBoundingClientRect();
  tooltip.style.top = (barRect.top + barRect.height / 2) + 'px';
  tooltip.textContent = getSlideHeading(bars[idx], idx);
  tooltip.classList.add('show');
}

let hoverActive = false;
function isOverScrubber(e) { const r = scrubber.getBoundingClientRect(); const buf = 36; return e.clientX >= r.left - buf && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom; }

scrubber.addEventListener('mousemove', e => {
  if (dragging) return; hoverActive = true;
  const idx = getClosestBarIndex(e.clientY);
  updateBarHighlight(idx); showBarTooltip(idx);
});
scrubber.addEventListener('mouseleave', () => { hoverActive = false; tooltip.classList.remove('show'); updateBarHighlight(currentSlideIndex()); });
document.addEventListener('mousemove', e => {
  if (dragging || hoverActive) return;
  if (!isOverScrubber(e)) { tooltip.classList.remove('show'); updateBarHighlight(currentSlideIndex()); }
});

function jumpTo(idx) { if (bars[idx]) { bars[idx].scrollIntoView({ behavior: 'smooth' }); updateBarHighlight(idx); } }

scrubber.addEventListener('pointerdown', e => {
  pointerDownY = e.clientY; dragging = false;
  scrubber.setPointerCapture(e.pointerId); scrubber.classList.add('dragging');
  const idx = getClosestBarIndex(e.clientY); updateBarHighlight(idx); showBarTooltip(idx);
  e.preventDefault();
});
scrubber.addEventListener('pointermove', e => {
  if (Math.abs(e.clientY - pointerDownY) < 5) return;
  dragging = true;
  const idx = getClosestBarIndex(e.clientY);
  updateBarHighlight(idx); showBarTooltip(idx);
});
scrubber.addEventListener('pointerup', e => {
  scrubber.classList.remove('dragging');
  const idx = getClosestBarIndex(e.clientY);
  jumpTo(idx);
  dragging = false; tooltip.classList.remove('show');
});
scrubber.addEventListener('pointerleave', () => {
  if (dragging) {
    scrubber.classList.remove('dragging');
    tooltip.classList.remove('show');
    dragging = false;
  }
});
container.addEventListener('scroll', () => { if (!dragging) updateBarHighlight(currentSlideIndex()); });
window.addEventListener('resize', () => { if (currentVersion) { buildBars(); updateBarHighlight(currentSlideIndex()); } });


/* ============================================================
   Visa Checker — two-level: continent → country → detail
   ============================================================ */
const vcC = document.getElementById('vcContinent');
const vcN = document.getElementById('vcNationality');
const vcSA = document.getElementById('vcSelectArea');
const vcR = document.getElementById('vcResult');
const vcReset = document.getElementById('vcReset');

// Populate continent dropdown
(function () {
  const s = vcC;
  const ph = document.createElement('option'); ph.value = ''; ph.disabled = true; ph.selected = true;
  ph.textContent = t('s1.placeholder') || '…';
  s.appendChild(ph);
  const groupOrder = ['asiaPacific','middleEast','europe','americas','africa'];
  for (const continent of groupOrder) {
    const o = document.createElement('option');
    o.value = continent;
    o.textContent = t('s1.continents.' + continent) || continent;
    s.appendChild(o);
  }
  const oOther = document.createElement('option');
  oOther.value = 'other';
  oOther.textContent = t('s1.continents.other') || 'Other';
  s.appendChild(oOther);
})();

// Populate country dropdown when continent changes
function populateCountries(continent) {
  const s = vcN;
  const prev = s.value;
  s.innerHTML = '';
  const ph = document.createElement('option'); ph.value = ''; ph.disabled = true; ph.selected = true;
  ph.textContent = t('s1.placeholder') || '…';
  s.appendChild(ph);
  const codes = COUNTRY_CONTINENTS[continent];
  if (codes) {
    codes.forEach(code => {
      const o = document.createElement('option');
      o.value = code;
      o.textContent = t('countries.' + code) || code;
      if (code === prev) o.selected = true;
      s.appendChild(o);
    });
  } else {
    const o = document.createElement('option');
    o.value = 'OTHER';
    o.textContent = t('countries.OTHER') || 'Other';
    if ('OTHER' === prev) o.selected = true;
    s.appendChild(o);
  }
  s.disabled = false;
}

vcC.addEventListener('change', () => {
  if (vcC.value) { populateCountries(vcC.value); } else { vcN.innerHTML = ''; vcN.disabled = true; }
});
vcN.addEventListener('change', () => showVisaPolicies(vcN.value));

function updateCountryLang() {
  const groupOrder = ['asiaPacific','middleEast','europe','americas','africa'];
  Array.from(vcC.options).forEach(o => {
    if (!o.value) { o.textContent = t('s1.placeholder') || '…'; return; }
    if (o.value === 'other') { o.textContent = t('s1.continents.other') || 'Other'; return; }
    o.textContent = t('s1.continents.' + o.value) || o.value;
  });
  if (vcC.value) populateCountries(vcC.value);
}

/* Show visa detail for selected country — replaces dropdown area */
function showVisaPolicies(code) {
  if (!code) return;

  const types = [];
  if (MUTUAL.has(code)) types.push('mutual');
  if (VISA_FREE.has(code)) types.push('free');
  if (TRANSIT.has(code)) types.push('transit');
  if (types.length === 0) types.push('visaRequired');

  vcSA.style.display = 'none';
  vcR.className = 'vc-result show';
  vcR._lastCountry = code;
  vcR._lastTypes = types;

  vcR.innerHTML = types.map(type => renderVisaSection(type, code)).join('');

  vcReset.classList.add('show');
}

function renderVisaSection(type, code) {
  const conds = ta('visa.' + type + '.conditions');
  const condList = Array.isArray(conds) ? conds : [];
  const links = (VISA_DETAIL[type] && VISA_DETAIL[type].links) || [];
  const ruNote = (code === 'RU' && type === 'free')
    ? '<p class="tip-box tip-box--warn"><strong>' + t('visa.free.ruWarning') + '</strong></p>' : '';
  const linksBlock = links.length
    ? '<div class="vc-links-block"><p class="vc-links-heading">🔗 ' + t('app.links.official') + '</p>' + links.map(l => '<a href="' + l.url + '" target="_blank" rel="noopener" class="vc-link">' + t('visa.links.' + l.key) + ' →</a>').join('') + '</div>' : '';

  return '<h4 class="vc-section-title">📋 ' + t('visa.' + type + '.detailTitle') + '</h4>' +
    '<ul class="step-list">' + condList.map(c => '<li>' + c + '</li>').join('') + '</ul>' +
    ruNote + linksBlock;
}

function resetVisaChecker() {
  vcC.selectedIndex = 0;
  vcN.innerHTML = ''; vcN.disabled = true;
  vcSA.style.display = '';
  vcR.className = 'vc-result'; vcR.innerHTML = '';
  vcR._lastCountry = null;
  vcReset.classList.remove('show');
}


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

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    buildLanguageDropdown();
    updateLanguageButton();
  });
} else {
  buildLanguageDropdown();
  updateLanguageButton();
}
