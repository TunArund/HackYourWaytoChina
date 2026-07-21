/* ============================================================
   app.js — Version management, navigation, visa checker, language
   ============================================================ */

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

function toggleVersion() {
  if (!currentVersion) return;
  startVersion(currentVersion === 'short' ? 'long' : 'short');
}

function updateVersionSwitchText() {
  versionSwitch.innerHTML = currentVersion === 'short'
    ? (t('app.nav.versionSwitch.toLong'))
    : (t('app.nav.versionSwitch.toShort'));
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
function isOverScrubber(e) { const r = scrubber.getBoundingClientRect(); return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom; }

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
   Visa Checker
   ============================================================ */
const vcN = document.getElementById('vcNationality');
const vcQ4 = document.getElementById('vcQ4');
const vcR = document.getElementById('vcResult');
const vcReset = document.getElementById('vcReset');

document.querySelectorAll('input[name="purpose"]').forEach(r => r.addEventListener('change', () => {
  vcQ4.style.display = r.value === 'transit' ? 'block' : 'none'; checkVisa();
}));
document.querySelectorAll('input[name="duration"]').forEach(r => r.addEventListener('change', checkVisa));
document.querySelectorAll('input[name="onward"]').forEach(r => r.addEventListener('change', checkVisa));
vcN.addEventListener('change', checkVisa);

// Populate country dropdown
(function () {
  const s = document.getElementById('vcNationality');
  // Single placeholder, text from i18n
  const ph = document.createElement('option'); ph.value = ''; ph.disabled = true; ph.selected = true;
  ph.textContent = t('s1.placeholder') || '…';
  s.appendChild(ph);
  COUNTRY_CODES.forEach(code => {
    const o = document.createElement('option');
    o.value = code;
    o.textContent = t('countries.' + code) || code;
    s.appendChild(o);
  });
})();

function updateCountryLang() {
  Array.from(document.getElementById('vcNationality').options).forEach(o => {
    if (!o.value) { o.textContent = t('s1.placeholder') || '…'; return; }
    o.textContent = t('countries.' + o.value) || o.value;
  });
}

function getRadio(n) { const e = document.querySelector(`input[name="${n}"]:checked`); return e ? e.value : null; }

function checkVisa() {
  const c = vcN.value, p = getRadio('purpose'), d = getRadio('duration');
  if (!c || !p || !d) { vcR.className = 'vc-result'; vcR.innerHTML = ''; vcReset.classList.remove('show'); return; }
  if (p === 'transit' && !getRadio('onward')) return;
  showResult(evalVisa(c, p, d));
}

function evalVisa(c, p, d) {
  const vf = VISA_FREE.has(c), tr = TRANSIT.has(c), mf = MUTUAL.has(c);
  if (mf && (p === 'tourism' || p === 'business' || p === 'family') && (d === 'short' || d === 'medium'))
    return { type: 'mutual' };
  if (vf && (p === 'tourism' || p === 'business' || p === 'family') && (d === 'short' || d === 'medium'))
    return { type: 'free', country: c };
  if (tr && p === 'transit' && getRadio('onward') === 'yes' && d === 'short')
    return { type: 'transit' };
  if (p === 'work' && (d === 'long' || d === 'xlong'))
    return { type: 'kvisa' };
  return { type: 'visaRequired' };
}

function showResult(r) {
  vcR._lastResult = r;
  const vd = VISA_DETAIL[r.type];
  if (!vd) return;
  const cls = r.type === 'visaRequired' ? 'visa' : r.type;
  vcR.className = 'vc-result vc-result--' + cls + ' show';
  const bodyKey = r.country === 'RU' && r.type === 'free' ? 'visa.free.bodyRuNote' : `visa.${r.type}.body`;
  const conds = ta('visa.' + r.type + '.conditions');
  const condList = Array.isArray(conds) ? conds : [];
  vcR.innerHTML = `<strong>${t('visa.' + r.type + '.title')}</strong><p>${t(bodyKey)}</p><ul>${condList.map(c => `<li>${c}</li>`).join('')}</ul><button class="vc-detail-btn" onclick="event.stopPropagation();openVisaDetail('${r.type}','${r.country || ''}')">${t('app.buttons.details')}</button>`;
  vcReset.classList.add('show');
}

function resetVisaChecker() {
  vcN.selectedIndex = 0;
  document.querySelectorAll('input[name="purpose"]:checked,input[name="duration"]:checked,input[name="onward"]:checked').forEach(r => r.checked = false);
  vcQ4.style.display = 'none'; vcR.className = 'vc-result'; vcR.innerHTML = ''; vcReset.classList.remove('show');
  if (typeof closeVisaDetail === 'function') closeVisaDetail();
}


/* ============================================================
   Visa Detail (expand from result card)
   ============================================================ */
function openVisaDetail(type, country) {
  const d = VISA_DETAIL[type]; if (!d) return;
  const conds = ta('visa.' + type + '.conditions');
  const condList = Array.isArray(conds) ? conds : [];
  const links = d.links || [];
  const ruNote = (country === 'RU' && type === 'free') ? `<p class="tip-box tip-box--warn" style="margin-top:8px"><strong>${t('visa.free.ruWarning')}</strong></p>` : '';
  vcR.innerHTML = `<div style="margin-bottom:10px"><button class="detail-back" onclick="event.stopPropagation();closeVisaDetail()">← ${t('app.buttons.back')}</button></div><h4 style="margin-bottom:10px">📋 ${t('visa.' + type + '.detailTitle')}</h4><ul class="step-list">${condList.map(c => `<li>${c}</li>`).join('')}</ul>${ruNote}${links.length ? `<div style="margin-top:12px"><p style="font-size:0.78rem;font-weight:700;margin-bottom:4px">🔗 ${t('app.links.official')}</p>${links.map(l => `<a href="${l.url}" target="_blank" rel="noopener" style="display:block;font-size:0.8rem;color:var(--info);text-decoration:underline;margin-bottom:2px">${t('visa.links.' + l.key)} →</a>`).join('')}</div>` : ''}`;
  history.pushState({ visaDetail: true, type, country }, '', '#s1-detail-visa');
}

function closeVisaDetail() {
  const r = vcR._lastResult;
  if (r) showResult(r);
  history.pushState(null, '', '#s1');
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
