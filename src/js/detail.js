/* ============================================================
   detail.js — Unified detail system (data-driven dispatch)
   Layout-driven for S7/S8/S9; generic step-list for pay-detail slides.
   Domain-prefixed i18n keys via SLIDE_DOMAIN mapping.
   ============================================================ */

/* ---- State ---- */
const currentDetail = { slide: null, key: null, sub: null };


/* ---- Shared back button HTML ---- */
function backBtn() {
  return '<button class="detail-back" onclick="event.stopPropagation();closeDetail(\'' + (currentDetail.slide||'') + '\')">' + BUTTON_ICONS.back + ' ' + t('app.buttons.back') + '</button>';
}


/* ---- Generic step-list renderer (pay-detail slides: S2-S6,S10,L1-L8) ---- */

function renderSteps(slide, key) {
  // L8 hotlines redirect to emergency entity
  if (slide === 'l8' && key !== 'renewal') {
    var hotSteps = tArray('emergency.' + key + '.steps');
    var hotList = Array.isArray(hotSteps) ? hotSteps : [];
    return '<button class="detail-back" onclick="closeDetail(\'' + slide + '\')">' + BUTTON_ICONS.back + ' ' + t('app.buttons.back') + '</button>'
      + '<h3>' + t('emergency.' + key + '.title') + '</h3>'
      + '<ol class="step-list">' + hotList.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>';
  }

  var domain = SLIDE_DOMAIN[slide] || slide;
  var P = domain + '.' + key + '.';
  var steps = tArray(P + 'steps');
  var stepList = Array.isArray(steps) ? steps : [];
  var links = tArray(P + 'links');
  var linkList = Array.isArray(links) ? links : [];

  var h = '<button class="detail-back" onclick="closeDetail(\'' + slide + '\')">' + BUTTON_ICONS.back + ' ' + t('app.buttons.back') + '</button>';
  h += '<h3>' + t(P + 'title') + '</h3>';
  if (stepList.length) {
    h += '<ol class="step-list">' + stepList.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>';
  }
  if (linkList.length) {
    h += '<p style="margin-top:12px">' + linkList.map(function (l) {
      return '<a class="card-link" href="' + l.url + '" target="_blank" rel="noopener">' + (l.label || l.key) + ' ' + BUTTON_ICONS.expand + '</a>';
    }).join('<br>') + '</p>';
  }
  return h;
}


/* ---- Render helpers ---- */

function renderTable(cols, rows) {
  return '<div class="table-wrapper"><table class="detail-table"><thead><tr>'
    + cols.map(function (c) { return '<th>' + c + '</th>'; }).join('')
    + '</tr></thead><tbody>'
    + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('')
    + '</tbody></table></div>';
}

function renderCardGrid(items, slide, key, prefix, labelSuffix, descSuffix, descFn) {
  return '<div class="sub-card-grid">'
    + items.map(function (id) {
      var label = t(prefix + id + '.' + labelSuffix);
      var desc = descFn ? descFn(id) : t(prefix + id + '.' + descSuffix);
      return '<div class="sub-card" onclick="event.stopPropagation();openDetail(\'' + slide + '\',\'' + key + '\',\'' + id + '\')"><div class="sc-title">' + label + '</div><div class="sc-desc">' + desc + '</div><div class="sc-hint">[ ' + t('app.buttons.expand') + ' ' + BUTTON_ICONS.expand + ' ]</div></div>';
    }).join('')
    + '</div>';
}


/* ---- Block renderer (generic, drives all detail views) ---- */

function renderBlock(b, sub) {
  switch (b.t) {
    case 'h3':    var h3 = b.icon ? b.icon + ' ' + t(b.k) : t(b.k); return '<h3>' + h3 + '</h3>';
    case 'h4':    var h4 = b.icon ? b.icon + ' ' + t(b.k) : t(b.k); if (b.pair) { var ll = (LANG_LABELS[LANG] || LANG_LABELS['en']).short; h4 += ' (CN|' + ll + ')'; } return '<h4>' + h4 + '</h4>';
    case 'intro': return '<p class="dp-intro">' + t(b.k) + '</p>';
    case 'p':     return '<p class="dp-text">' + t(b.k) + '</p>';
    case 'muted': return '<p class="muted-sm mt-sm">' + t(b.k) + '</p>';
    case 'tip':   return '<div class="tip-box tip-box--' + (b.s || 'info') + '"><strong>' + t(b.k) + '</strong><span>' + t(b.body) + '</span></div>';
    case 'table':
    case 'cards':
    case 'ul':
    case 'ol':    var fn = BLOCK_HANDLERS[b.ref]; return fn ? fn(sub) : '';
    default:      return '';
  }
}


/* ---- Master render dispatch ---- */

function renderDetail(slide, key, sub) {
  var layout = LAYOUT[slide] && LAYOUT[slide][key];
  if (layout) {
    // Sub-navigation: if sub is set, delegate to cards handler
    if (sub) {
      for (var i = 0; i < layout.blocks.length; i++) {
        var b = layout.blocks[i];
        if (b.t === 'cards' && BLOCK_HANDLERS[b.ref]) {
          return BLOCK_HANDLERS[b.ref](sub);
        }
      }
    }
    return '<button class="detail-back" onclick="closeDetail(\'' + slide + '\')">' + BUTTON_ICONS.back + ' ' + t('app.buttons.back') + '</button>'
      + layout.blocks.map(function (b) { return renderBlock(b, null); }).join('');
  }
  return renderSteps(slide, key);
}


/* ---- Unified open ---- */

function openDetail(slide, key, sub) {
  var summary = document.getElementById(slide + 'Summary');
  var detailEl = document.getElementById(slide + 'Detail');
  if (!summary || !detailEl) return;

  var sec = detailEl.closest('.slide');
  var container = document.getElementById('slidesContainer');

  if (container) container.style.scrollSnapType = 'none';
  if (sec) sec.style.overflow = 'hidden';

  currentDetail.slide = slide; currentDetail.key = key; currentDetail.sub = sub || null;

  detailEl.innerHTML = renderDetail(slide, key, sub);
  summary.classList.add('hide');
  detailEl.classList.add('show');

  if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
  setTimeout(function () {
    if (container) container.style.scrollSnapType = 'y mandatory';
  }, 120);

  if (typeof isRestoring !== 'undefined' && isRestoring) {
    history.replaceState({ slide: slide, key: key, sub: sub }, '', '#' + slide + '-detail-' + key + (sub ? '-' + sub : ''));
  } else {
    history.pushState({ slide: slide, key: key, sub: sub }, '', '#' + slide + '-detail-' + key + (sub ? '-' + sub : ''));
  }
}


/* ---- Unified close ---- */

function closeDetail(slide) {
  var summary = document.getElementById(slide + 'Summary');
  var detailEl = document.getElementById(slide + 'Detail');
  if (!summary || !detailEl) return;

  var sec = detailEl.closest('.slide');
  var container = document.getElementById('slidesContainer');

  if (container) container.style.scrollSnapType = 'none';
  if (sec) sec.style.overflow = '';

  summary.classList.remove('hide');
  detailEl.classList.remove('show');
  detailEl.innerHTML = '';

  currentDetail.slide = null; currentDetail.key = null; currentDetail.sub = null;

  if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
  setTimeout(function () {
    if (container) container.style.scrollSnapType = 'y mandatory';
  }, 120);

  history.replaceState({ _closeDetail: true }, '', '#' + slide);
}


/* ---- Unified popstate (single handler for all detail navigation) ---- */

window.addEventListener('popstate', function (e) {
  var cd = currentDetail;
  if (e.state && e.state.slide) {
    if (!cd.slide || cd.slide !== e.state.slide || cd.key !== e.state.key || cd.sub !== e.state.sub) {
      if (cd.slide) closeDetail(cd.slide);
      openDetail(e.state.slide, e.state.key, e.state.sub || null);
    }
  } else if (cd.slide) {
    closeDetail(cd.slide);
  }
});

/* Escape key to close detail */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && currentDetail.slide) closeDetail(currentDetail.slide);
});
