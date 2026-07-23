/* ============================================================
   detail.js — Detail panel system (data-driven)
   ============================================================ */

const currentDetail = { slide: null, key: null, sub: null };

/* ---- open / close ---- */
function openDetail(slide, key, sub) {
  const panel = document.getElementById('detail-' + slide);
  if (!panel) return;
  const sec = panel.closest('.slide');
  const container = document.getElementById('slidesContainer');

  // Temporarily disable snap to prevent auto-jump to another slide during DOM change
  if (container) container.style.scrollSnapType = 'none';
  if (sec) sec.style.overflow = 'hidden';

  currentDetail.slide = slide; currentDetail.key = key; currentDetail.sub = sub || null;
  panel.innerHTML = renderDetail(slide, key, sub);
  panel.classList.add('active');
  const body = panel.parentElement;
  const cards = body.querySelector('.info-cards');
  if (cards) cards.style.display = 'none';

  // Scroll to this slide and re-enable snap after layout settles
  if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
  setTimeout(() => {
    if (container) container.style.scrollSnapType = 'y mandatory';
  }, 120);

  if (typeof _restoring !== 'undefined' && _restoring) {
    history.replaceState({ slide, key, sub }, '', `#${slide}-detail-${key}${sub ? '-' + sub : ''}`);
  } else {
    history.pushState({ slide, key, sub }, '', `#${slide}-detail-${key}${sub ? '-' + sub : ''}`);
  }
}

function closeDetail(slide) {
  const panel = document.getElementById('detail-' + slide);
  if (!panel) return;
  const sec = panel.closest('.slide');
  const container = document.getElementById('slidesContainer');

  if (container) container.style.scrollSnapType = 'none';
  if (sec) sec.style.overflow = '';

  panel.classList.remove('active'); panel.innerHTML = '';
  const body = panel.parentElement;
  const cards = body.querySelector('.info-cards');
  if (cards) cards.style.display = '';

  currentDetail.slide = null; currentDetail.key = null; currentDetail.sub = null;

  if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
  setTimeout(() => {
    if (container) container.style.scrollSnapType = 'y mandatory';
  }, 120);

  history.replaceState(null, '', '#' + slide);
}

window.addEventListener('popstate', e => {
  const cd = currentDetail;
  if (e.state && e.state.slide) {
    // Forward/back to a detail state — open it if not already showing
    if (!cd.slide || cd.slide !== e.state.slide || cd.key !== e.state.key) {
      if (cd.slide) closeDetail(cd.slide);
      openDetail(e.state.slide, e.state.key, e.state.sub || null);
    }
  } else if (cd.slide) {
    // Navigated away from detail — close it
    closeDetail(cd.slide);
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && currentDetail.slide) closeDetail(currentDetail.slide); });


/* ---- Render helpers ---- */

const H = {
  back: (slide) => `<button class="detail-back" onclick="closeDetail('${slide}')">← ${t(slide + '.detail.back')}</button>`,
  title: (text) => `<h3>${text}</h3>`,
  h4: (text) => `<h4>${text}</h4>`,
  intro: (key) => `<p class="dp-intro">${t(key)}</p>`,
  table: (headers, rows) => `<div class="table-wrapper"><table class="detail-table"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`,
  tip: (type, title, body) => `<div class="tip-box tip-box--${type}"><strong>${title}</strong><span>${body}</span></div>`,
  subGrid: (items) => `<div class="sub-card-grid">${items.join('')}</div>`,
  subCard: (title, desc, onclick) => `<div class="sub-card" onclick="${onclick}"><div class="sc-title">${title}</div><div class="sc-desc">${desc}</div><div class="sc-hint">[ ${t('app.buttons.expand')} ]</div></div>`,
  nav: (prev, next, idx, total) => `<div class="detail-nav">${prev || '<span></span>'}<span class="dn-center">${idx + 1}/${total}</span>${next || '<span></span>'}</div>`,
  muted: (text) => `<p class="muted-sm mt-sm">${text}</p>`,
};

/* ---- Master dispatch ---- */

function renderDetail(slide, key, sub) {
  if (slide === 's3') return renderS3(key);
  if (slide === 's4') return renderS4(key);
  if (slide === 's7') return renderS7(key, sub);
  if (slide === 's8') return renderS8(key, sub);
  if (slide === 's9') return renderS9(key, sub);
  return '';
}


/* ============================================================
   S3  Arrival & Immigration
   ============================================================ */

function renderS3(key) {
  const P = 's3.detail.' + key + '.';
  const items = ta(P + 'items');
  const itemList = Array.isArray(items) ? items : [];
  return H.back('s3') + H.title(t(P + 'title')) + H.intro(P + 'intro')
    + '<ul class="step-list">' + itemList.map(i => '<li>' + i + '</li>').join('') + '</ul>'
    + (t(P + 'linkUrl') ? '<p style="margin-top:12px"><a class="card-link" href="' + t(P + 'linkUrl') + '" target="_blank" rel="noopener">' + t(P + 'linkLabel') + ' →</a></p>' : '');
}


/* ============================================================
   S4  Connectivity
   ============================================================ */

function renderS4(key) {
  const P = 's4.detail.' + key + '.';
  const items = ta(P + 'items');
  const itemList = Array.isArray(items) ? items : [];
  return H.back('s4') + H.title(t(P + 'title')) + H.intro(P + 'intro')
    + '<ul class="step-list">' + itemList.map(i => '<li>' + i + '</li>').join('') + '</ul>';
}


/* ============================================================
   S7  Medical & Aesthetics
   ============================================================ */

function renderS7(key, sub) {
  const P = 's7.detail.';

  if (key === 'hospital') {
    const cols = [t(P + 'hospital.colCity'), t(P + 'hospital.colHospital'), t(P + 'hospital.colNote')];
    const hrows = HOSPITAL_CITIES.map(c => [t('city.' + c + '.label'), t(P + 'hospital.' + c + 'Name'), t(P + 'hospital.' + c + 'Note')]);
    const mcols = [t(P + 'hospital.colCn'), 'English', 'Русский', t(P + 'hospital.colUse')];
    const mrows = MEDS.map(m => [m.cn, m.en, m.ru, t(P + 'hospital.med' + m.k.charAt(0).toUpperCase() + m.k.slice(1) + 'Use')]);
    return H.back('s7') + H.title(t(P + 'hospital.title')) + H.intro(P + 'hospital.intro')
      + H.h4(t(P + 'hospital.sectionHospitals')) + H.table(cols, hrows)
      + H.h4(t(P + 'hospital.sectionMeds')) + H.table(mcols, mrows)
      + H.tip('warn', t(P + 'hospital.insuranceWarning'), t(P + 'hospital.insuranceDetail'));
  }

  if (key === 'big3') {
    const BP = P + 'big3.';
    const dCols = [t(BP + 'colItem'), t(BP + 'colChinaPrice'), t(BP + 'colUsEuPrice')];
    const dRows = BIG3_DENTAL.map(k => [t(BP + 'dental_' + k), t(BP + 'dental_' + k + '_cn'), t(BP + 'dental_' + k + '_us')]);
    const tCols = [t(BP + 'colTherapy'), t(BP + 'colDescription'), t(BP + 'colPrice')];
    const tRows = BIG3_TCM.map(k => [t(BP + 'tcm_' + k), t(BP + 'tcm_' + k + '_desc'), t(BP + 'tcm_' + k + '_price')]);
    return H.back('s7') + H.title(t(BP + 'title'))
      + H.h4(t(BP + 'sectionDental')) + H.table(dCols, dRows)
      + H.h4(t(BP + 'sectionEye')) + H.intro(BP + 'eyeDesc')
      + H.h4(t(BP + 'sectionTcm')) + H.table(tCols, tRows)
      + H.tip('info', t(BP + 'tcmHotspots'), t(BP + 'tcmHotspotsDetail'));
  }

  if (key === 'checkup') {
    const CP = P + 'checkup.';
    return H.back('s7') + H.title(t(CP + 'title')) + H.intro(CP + 'intro') + H.intro(CP + 'recommended')
      + H.tip('warn', t(CP + 'warning'), t(CP + 'warningDetail'));
  }
  return '';
}


/* ============================================================
   S8  Shopping
   ============================================================ */

function renderS8(key, sub) {
  const P = 's8.detail.';

  if (key === 'electronics') {
    const EP = P + 'electronics.';
    const eCols = [t(EP + 'colCategory'), t(EP + 'colWhy'), t(EP + 'colPrice')];
    const eRows = SHOP_ELECTRONICS.map(k => [t(EP + k), t(EP + k + '_why'), t(EP + k + '_price') || '—']);
    return H.back('s8') + H.title(t(EP + 'title')) + H.table(eCols, eRows)
      + H.tip('info', t(EP + 'whereToBuy'), t(EP + 'whereToBuyDetail'));
  }

  if (key === 'souvenirs') {
    const SP = P + 'souvenirs.';
    const sCols = [t(SP + 'colCity'), t(SP + 'colItem')];
    const sRows = SOUVENIR_CITIES.map(k => [t('city.' + (k === 'xian' ? 'xian' : k) + '.label'), t(SP + k + '_item')]);
    return H.back('s8') + H.title(t(SP + 'title')) + H.table(sCols, sRows) + H.muted(t(SP + 'tip'));
  }

  if (key === 'taxrefund') {
    const TP = P + 'taxrefund.';
    return H.back('s8') + H.title(t(TP + 'title')) + H.intro(TP + 'stats')
      + H.h4(t(TP + 'sectionRequirements')) + '<ul class="step-list">' + TAXREFUND_REQS.map(k => `<li>${t(TP + k)}</li>`).join('') + '</ul>'
      + H.h4(t(TP + 'sectionProcess')) + '<ol class="step-list">' + TAXREFUND_STEPS.map(k => `<li>${t(TP + k)}</li>`).join('') + '</ol>'
      + H.tip('good', t(TP + 'instantRefundTitle'), t(TP + 'instantRefundDetail'));
  }

  if (key === 'cityshops') {
    if (sub) {
      return `<button class="detail-back" onclick="event.stopPropagation();openDetail('s8','cityshops')">← ${t(P + 'cityshops.backToCityGuide')}</button>
        <h3>🛍️ ${t('shop.' + sub + '.name')}</h3><p class="dp-text">${t('shop.' + sub + '.desc')}</p>`;
    }
    const cards = SHOP_CITY_KEYS.map(k => `<div class="sub-card" onclick="event.stopPropagation();openDetail('s8','cityshops','${k}')"><div class="sc-title">${t('shop.' + k + '.name')}</div><div class="sc-desc">${t(P + 'cityshops.cities.' + k + '.subtitle')}</div></div>`);
    return H.back('s8') + H.title(t(P + 'cityshops.title')) + H.muted(t(P + 'cityshops.tapHint')) + H.subGrid(cards);
  }
  return '';
}


/* ============================================================
   S9  Destinations
   ============================================================ */

function renderS9(key, sub) {
  const P = 's9.detail.';

  if (key === 'top10') {
    if (sub) return renderDestCity(sub, TOP10_CITIES);
    const cards = TOP10_CITIES.map(k => `<div class="sub-card" onclick="event.stopPropagation();openDetail('s9','top10','${k}')"><div class="sc-title">${t('city.' + k + '.label')}</div><div class="sc-desc">${t('city.' + k + '.tag')}</div></div>`);
    return H.back('s9') + H.title(t(P + 'top10.title')) + H.muted(t(P + 'tapHint')) + H.subGrid(cards);
  }

  if (key === 'rising') {
    if (sub) return renderDestCity(sub, RISING_CITIES);
    const cards = RISING_CITIES.map(k => `<div class="sub-card" onclick="event.stopPropagation();openDetail('s9','rising','${k}')"><div class="sc-title">${t('city.' + k + '.label')}</div><div class="sc-desc">${t('city.' + k + '.tag')}</div></div>`);
    return H.back('s9') + H.title(t(P + 'rising.title')) + H.muted(t(P + 'rising.subtitle')) + H.subGrid(cards);
  }

  if (key === 'seasons') {
    const SP = P + 'seasons.';
    return H.back('s9') + H.title(t(SP + 'title'))
      + SEASONS.map(s => H.tip('info', t(SP + s + '.title'), t(SP + s + '.desc'))).join('')
      + H.muted(t(SP + 'sizingTip'));
  }
  return '';
}

function renderDestCity(key, cities) {
  const idx = cities.indexOf(key);
  const prev = idx > 0 ? `<button onclick="event.stopPropagation();openDetail('s9','${cities === TOP10_CITIES ? 'top10' : 'rising'}','${cities[idx - 1]}')">← ${t('city.' + cities[idx - 1] + '.label')}</button>` : null;
  const next = idx < cities.length - 1 ? `<button onclick="event.stopPropagation();openDetail('s9','${cities === TOP10_CITIES ? 'top10' : 'rising'}','${cities[idx + 1]}')">${t('city.' + cities[idx + 1] + '.label')} →</button>` : null;
  return `<button class="detail-back" onclick="event.stopPropagation();openDetail('s9','${cities === TOP10_CITIES ? 'top10' : 'rising'}')">← ${t('s9.detail.backToCityList')}</button>
    <h3>${t('city.' + key + '.label')}</h3>
    <p class="dp-subtitle">${t('city.' + key + '.tag')}</p>
    <p class="dp-text">${t('city.' + key + '.desc')}</p>
    ${H.nav(prev, next, idx, cities.length)}`;
}
