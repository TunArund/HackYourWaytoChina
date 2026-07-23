/* ============================================================
   nav.js — Version management + draggable scrubber navigation
   ============================================================ */

/* ============================================================
   Version Management
   ============================================================ */
let currentVersion = null;
const container = document.getElementById('slidesContainer');
const scrubber = document.getElementById('navScrubber');
const versionSwitch = document.getElementById('versionSwitch');
const tooltip = document.getElementById('scrubTooltip');

function startVersion(v, targetSlide) {
  currentVersion = v;
  document.body.className = 'version-' + v;
  container.querySelectorAll('.slide--short,.slide--long').forEach(s => {
    if (v === 'short') { s.style.display = s.classList.contains('slide--short') ? '' : 'none'; }
    else { s.style.display = s.classList.contains('slide--long') ? '' : 'none'; }
  });
  container.classList.remove('locked');
  versionSwitch.classList.add('visible');
  scrubber.classList.add('visible');
  updateVersionSwitchText();
  buildBars();
  var dest = targetSlide || (v === 'short' ? document.getElementById('s1') : document.getElementById('l1'));
  if (dest) dest.scrollIntoView({ behavior: targetSlide ? 'instant' : 'smooth', block: 'start' });
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
  history.replaceState(null, '', '#');
}

function updateVersionSwitchText() {
  versionSwitch.innerHTML = safeHtml(t('app.nav.home')) || '↩ Home';
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
