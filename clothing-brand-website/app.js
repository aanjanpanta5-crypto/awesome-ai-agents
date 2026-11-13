/* Acpanta storefront script: products, bag, filters, size guide, sign-up form. Shared by every page. */
(function () {
  var SHAPES = {
    tee: '<path d="M60 40 L85 30 Q100 44 115 30 L140 40 L170 70 L150 90 L138 80 L138 172 L62 172 L62 80 L50 90 L30 70 Z"/><path d="M85 30 Q100 44 115 30" fill="none" class="st"/>',
    hood: '<path d="M60 44 L80 34 Q78 14 100 12 Q122 14 120 34 L140 44 L168 74 L172 160 L154 162 L140 90 L140 176 L60 176 L60 90 L46 162 L28 160 L32 74 Z"/><path d="M80 34 Q100 58 120 34" fill="none" class="st"/><rect x="78" y="128" width="44" height="26" fill="none" class="st"/>',
    jacket: '<path d="M62 34 L88 26 L100 42 L112 26 L138 34 L166 60 L176 152 L156 154 L146 82 L146 178 L54 178 L54 82 L44 154 L24 152 L34 60 Z"/><path d="M100 42 L100 178" fill="none" class="st"/><rect x="62" y="118" width="26" height="28" fill="none" class="st"/><rect x="112" y="118" width="26" height="28" fill="none" class="st"/>',
    shirt: '<path d="M64 34 L88 28 L100 40 L112 28 L136 34 L162 62 L170 150 L152 152 L144 84 L144 176 L56 176 L56 84 L48 152 L30 150 L38 62 Z"/><path d="M100 40 L100 176" fill="none" class="st"/><rect x="66" y="66" width="22" height="22" fill="none" class="st"/>',
    pant: '<path d="M66 24 L134 24 L144 178 L108 178 L100 78 L92 178 L56 178 Z"/><path d="M66 36 L134 36" fill="none" class="st"/><path d="M100 36 L100 78" fill="none" class="st"/>',
    cap: '<path d="M44 120 Q46 64 100 60 Q154 64 156 120 Z"/><path d="M40 120 L178 120 Q170 138 120 134 L40 128 Z"/><circle cx="100" cy="60" r="5"/>',
    sweat: '<path d="M60 40 L82 32 Q100 44 118 32 L140 40 L168 72 L174 160 L156 162 L142 92 L142 176 L58 176 L58 92 L44 162 L26 160 L32 72 Z"/><path d="M82 32 Q100 44 118 32" fill="none" class="st"/><path d="M58 166 L142 166" fill="none" class="st"/>',
    zip: '<path d="M60 44 L80 34 Q78 14 100 12 Q122 14 120 34 L140 44 L168 74 L172 160 L154 162 L140 90 L140 176 L60 176 L60 90 L46 162 L28 160 L32 74 Z"/><path d="M80 34 Q100 58 120 34" fill="none" class="st"/><path d="M100 46 L100 176" fill="none" class="st"/><path d="M68 128 L88 128 L92 154" fill="none" class="st"/><path d="M132 128 L112 128 L108 154" fill="none" class="st"/>',
    boxy: '<path d="M54 46 L78 34 Q76 12 100 10 Q124 12 122 34 L146 46 L176 78 L180 156 L160 158 L148 96 L148 168 L52 168 L52 96 L40 158 L20 156 L24 78 Z"/><path d="M78 34 Q100 60 122 34" fill="none" class="st"/><rect x="74" y="120" width="52" height="28" fill="none" class="st"/>'
  };
  var LOGO_AT = { tee: [100, 64, 38], hood: [100, 80, 38], boxy: [100, 82, 40], zip: [124, 76, 24], sweat: [100, 66, 38] };
  function printMark(shape, print, dark) {
    var at = LOGO_AT[shape] || [100, 78, 36];
    var img = function (file, cx, cy, w) { var h = w * 0.558; return '<image href="' + file + '" x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" stroke="none"/>'; };
    if (print === 'logo') return img(dark ? 'logo-white.svg' : 'logo.svg', at[0], at[1], at[2]);
    if (print === 'graphic') return '<rect x="72" y="66" width="56" height="52" fill="#e0102e" stroke="none"/>' + img('logo-white.svg', 100, 92, 44);
    return '';
  }
  function art(shape, color, print) {
    var dark = /^#[0-3]/.test(color);
    return '<svg viewBox="0 0 200 200" aria-hidden="true"><g fill="' + color + '" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round">' +
      SHAPES[shape].replace(/class="st"/g, 'stroke="' + (dark ? '#8a8a8a' : '#b9b9b9') + '" stroke-width="2" stroke-dasharray="4 3"') + printMark(shape, print, dark) + '</g></svg>';
  }
  var ZOOM_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M11 8v6M8 11h6"/></svg>';

  // Product picture: the real photo when a variant has one, otherwise the drawing
  function artFor(p, i) {
    var c = p.colors[i] || p.colors[0];
    if (c[2]) return '<img src="' + c[2] + '" alt="' + esc(c[3] || p.name + ', ' + c[0]) + '" loading="lazy" decoding="async">';
    return art(p.shape, c[1], p.print);
  }
  function badgeFor(p) {
    if (typeof p.stock === 'number' && p.stock <= 5) return 'Only ' + p.stock + ' left';
    if (typeof p.stock === 'number' && p.stock <= 20) return 'Limited \u00b7 ' + p.stock + ' pieces';
    return p.badge || '';
  }

  var PRODUCTS = window.ACPANTA_PRODUCTS || [];
  var byId = {}; PRODUCTS.forEach(function (p) { byId[p.id] = p; p.sel = 0; });
  var money = function (n) { return '£' + n.toFixed(0); };
  var $ = function (id) { return document.getElementById(id); };

  // Search: matches names, categories, fabrics, colours and everyday words
  var CAT_WORDS = {
    'T-shirts': 'tshirt tshirts tee tees top',
    'Hoodies': 'hoodie hoodies hoody hood top',
    'Sweatshirts': 'sweatshirt sweatshirts jumper sweater crew top'
  };
  var PRODUCT_WORDS = { 'zip-hoodie': 'zipper zipped zip up jacket', 'boxy-hoodie': 'oversized loose graphic print back skull cigarette plain blank cotton black', 'printed-tee': 'graphic print', 'logo-tee': 'basic plain', 'logo-hoodie': 'heavy thick' };
  function norm(t) { return String(t).toLowerCase().replace(/\bt[\s-]+shirt/g, 'tshirt').replace(/[-‐–]/g, '').replace(/[^a-z0-9£ ]+/g, ' '); }
  PRODUCTS.forEach(function (p) {
    p.words = norm([p.name, p.cat, p.spec, p.badge || '', p.colors.map(function (c) { return c[0]; }).join(' '), CAT_WORDS[p.cat] || '', PRODUCT_WORDS[p.id] || ''].join(' ')).split(/\s+/).filter(Boolean);
  });
  function hasWord(p, w) { return p.words.some(function (x) { return x.indexOf(w) === 0; }); }
  function matches(p, q) {
    var words = norm(q).split(/\s+/).filter(function (w) { return w.length > 1 || /\d/.test(w); });
    if (!words.length) return true;
    return words.every(function (w) { return hasWord(p, w) || (w.length > 3 && /s$/.test(w) && hasWord(p, w.slice(0, -1))); });
  }
  function searchProducts(q) { return PRODUCTS.filter(function (p) { return matches(p, q); }); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var query = '';
  try { query = new URLSearchParams(location.search).get('q') || ''; } catch (err) {}

  // Filters + grid (shop page shows every piece; home shows a featured few)
  var grid = $('grid'), filters = $('filters');
  var cats = ['All'].concat(PRODUCTS.map(function (p) { return p.cat; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
  var slug = function (c) { return c.toLowerCase().replace(/[^a-z]+/g, '-'); };
  var active = 'All';
  function fromHash() {
    var h = (location.hash || '').slice(1);
    for (var i = 0; i < cats.length; i++) if (slug(cats[i]) === h) return cats[i];
    return 'All';
  }
  function syncFilters() {
    [].forEach.call(filters.children, function (x) { x.setAttribute('aria-pressed', x.dataset.cat === active); });
  }
  if (filters) {
    active = fromHash();
    filters.innerHTML = cats.map(function (c) { return '<button class="chip" data-cat="' + c + '" aria-pressed="' + (c === active) + '">' + c + '</button>'; }).join('');
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cat]'); if (!b) return;
      active = b.dataset.cat; syncFilters(); renderGrid();
      try { history.replaceState(null, '', active === 'All' ? location.pathname : '#' + slug(active)); } catch (err) {}
    });
    window.addEventListener('hashchange', function () { active = fromHash(); syncFilters(); renderGrid(); });
  }

  // Measurements for each size (also used by the size guide page).
  // MEASUREMENTS_READY: keep false until SIZE_TABLES holds the REAL measurements of your stock.
  // While false, no numbers are shown anywhere; customers are asked to message you instead.
  var MEASUREMENTS_READY = true;
  var SIZE_TABLES = {
    'size-body-tee': [['S', 53, 69, 21], ['M', 56, 71, 22], ['L', 59, 73, 23]],
    'size-body-hood': [['S', 57, 68, 60], ['M', 60, 70, 62], ['L', 63, 72, 64]]
  };
  // Rough body chest each size suits, worked out from the garment's flat chest width.
  // Tees sit closer; hoodies and sweatshirts are cut roomier.
  function fitRange(tableId, row) {
    var off = tableId === 'size-body-tee' ? [16, 8] : [24, 14];
    return [2 * row[1] - off[0], 2 * row[1] - off[1]];
  }
  // Text shown on a product card and in the bag once a size is picked
  function sizeText(p, size) {
    if (!MEASUREMENTS_READY) return '';
    var id = p.cat === 'T-shirts' ? 'size-body-tee' : 'size-body-hood', rows = SIZE_TABLES[id] || [];
    for (var i = 0; i < rows.length; i++) if (rows[i][0] === size) {
      var fit = fitRange(id, rows[i]);
      return '<b>Size ' + size + '</b> · chest ' + rows[i][1] + ' cm · length ' + rows[i][2] + ' cm · sleeve ' + rows[i][3] + ' cm' +
        '<br>Best for a body chest of about ' + fit[0] + '–' + fit[1] + ' cm';
    }
    return '';
  }
  function refreshSize(el) {
    var info = el.querySelector('[data-size-info]'), sel = el.querySelector('select');
    if (!info || !sel) return;
    var t = sel.value ? sizeText(byId[el.dataset.id], sel.value) : '';
    info.innerHTML = t || (MEASUREMENTS_READY ? 'Pick a size to see its measurements' :
      'Need exact measurements? <a href="https://wa.me/447448795690" target="_blank" rel="noopener">Message us on WhatsApp</a>');
    info.classList.toggle('is-set', !!t);
  }
  function cardHTML(p) { return card(p); }
  function card(p) {
    var c = p.colors[p.sel];
    return '<article class="card" data-id="' + p.id + '">' +
      '<div class="art' + (c[2] ? ' has-photo' : '') + '" data-zoom>' + (badgeFor(p) ? '<span class="badge mono' + (/^Only/.test(badgeFor(p)) ? '' : ' holo') + '">' + badgeFor(p) + '</span>' : '') + artFor(p, p.sel) +
      '<button type="button" class="zoom-btn" data-zoom aria-label="Zoom in on ' + esc(p.name) + '">' + ZOOM_ICON + '</button></div>' +
      '<div class="card-top"><h3>' + p.name + '</h3><span class="price">' + money(p.price) + '</span></div>' +
      '<p class="spec mono">' + p.spec + '</p>' +
      (p.details ? '<details class="pdetails"><summary>Details</summary><ul>' + p.details.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul></details>' : '') +
      '<p class="variant-name mono">' + (p.variantLabel || 'Colour') + ': <b>' + esc(c[0]) + '</b></p>' +
      '<div class="swatches" role="group" aria-label="' + (p.variantLabel || 'Colour') + '">' + p.colors.map(function (col, i) {
        var look = col[2] ? 'background:' + col[1] + ' url(' + col[2].replace('.jpg', '-thumb.jpg') + ') center 40%/cover' : 'background:' + col[1];
        return '<button class="sw' + (col[2] ? ' sw-img' : '') + '" data-sw="' + i + '" style="' + look + '" aria-label="' + esc(col[0]) + '" aria-pressed="' + (i === p.sel) + '" title="' + esc(col[0]) + '"></button>';
      }).join('') + '</div>' +
      '<p class="size-info mono" data-size-info aria-live="polite">' + (MEASUREMENTS_READY ? 'Pick a size to see its measurements' :
        'Need exact measurements? <a href="https://wa.me/447448795690" target="_blank" rel="noopener">Message us on WhatsApp</a>') + '</p>' +
      '<div class="buy"><label class="mono" for="size-' + p.id + '" hidden>Size</label><select id="size-' + p.id + '">' +
      (p.sizes.length > 1 ? '<option value="">Select size</option>' : '') +
      p.sizes.map(function (s) { return '<option>' + s + '</option>'; }).join('') + '</select>' +
      '<button class="add" data-add>Add to bag</button></div></article>';
  }
  function renderGrid() {
    if (!grid) return;
    var list = grid.dataset.featured
      ? grid.dataset.featured.split(',').map(function (id) { return byId[id]; }).filter(Boolean)
      : PRODUCTS.filter(function (p) { return (active === 'All' || p.cat === active) && (!query || matches(p, query)); });
    grid.innerHTML = list.length ? list.map(card).join('') :
      '<div class="no-results"><p><b>No items match “' + esc(query) + '”' + (active !== 'All' ? ' in ' + esc(active) : '') + '.</b></p>' +
      '<p>Try “tee”, “black” or “jacket”, or <button class="link-btn" data-clear-search>show everything</button>.</p></div>';
    var note = $('result-note');
    if (note) note.textContent = query ? list.length + (list.length === 1 ? ' item' : ' items') + ' for “' + query + '”' + (active !== 'All' ? ' in ' + active : '') : '';
  }
  if (grid) grid.addEventListener('click', function (e) {
    if (e.target.closest('[data-clear-search]')) { setQuery(''); active = 'All'; if (filters) syncFilters(); renderGrid(); if ($('q')) $('q').focus(); return; }
    var el = e.target.closest('.card'); if (!el) return;
    var p = byId[el.dataset.id];
    if (e.target.closest('[data-zoom]')) { openZoom(p, el); return; }
    var sw = e.target.closest('[data-sw]');
    if (sw) {
      var size = el.querySelector('select').value;
      p.sel = +sw.dataset.sw;
      el.outerHTML = card(p);
      var fresh = document.querySelector('.card[data-id="' + p.id + '"]');
      fresh.querySelector('select').value = size;
      refreshSize(fresh);
      fresh.querySelector('[data-sw="' + p.sel + '"]').focus();
      return;
    }
    if (e.target.closest('[data-add]')) {
      var sel = el.querySelector('select');
      if (!sel.value) { sel.classList.add('need-size'); sel.addEventListener('change', function () { sel.classList.remove('need-size'); }, { once: true }); sel.focus(); toast('Pick a size first'); return; }
      addToBag(p, p.sel, sel.value);
    }
  });
  // Hologram shine and tilt on product pictures, following the mouse or finger
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (grid && !calm) {
    grid.addEventListener('pointermove', function (e) {
      var a = e.target.closest('.art'); if (!a) return;
      var r = a.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      a.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      a.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      a.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg');
      a.style.setProperty('--rx', ((0.5 - y) * 10).toFixed(2) + 'deg');
      a.classList.add('holo-on');
    });
    var holoOff = function (e) {
      var a = e.target.closest && e.target.closest('.art');
      if (!a || (e.relatedTarget && a.contains(e.relatedTarget))) return;
      a.classList.remove('holo-on'); a.style.removeProperty('--rx'); a.style.removeProperty('--ry');
    };
    grid.addEventListener('pointerout', holoOff);
    grid.addEventListener('pointercancel', holoOff);
  }

  // Show a size's measurements as soon as it is picked
  if (grid) grid.addEventListener('change', function (e) {
    var el = e.target.closest('.card');
    if (el && e.target.tagName === 'SELECT') refreshSize(el);
  });

  // Shop page search box
  function setQuery(q) {
    query = q;
    if ($('q') && $('q').value !== q) $('q').value = q;
    try {
      var u = new URL(location.href);
      if (q) u.searchParams.set('q', q); else u.searchParams.delete('q');
      history.replaceState(null, '', u.pathname + u.search + u.hash);
    } catch (err) {}
  }
  if ($('q')) {
    $('q').value = query;
    $('q').addEventListener('input', function () { setQuery(this.value.trim()); renderGrid(); });
    $('shop-search').addEventListener('submit', function (e) { e.preventDefault(); $('q').blur(); });
  }
  renderGrid();

  // Menu drawer: a side panel with the shop sections and help links (opened from the header)
  var MENU_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  var mBtn = document.createElement('button');
  mBtn.className = 'search-btn menu-btn'; mBtn.id = 'open-menu'; mBtn.type = 'button';
  mBtn.setAttribute('aria-label', 'Open menu'); mBtn.innerHTML = MENU_ICON + '<span>Menu</span>';
  var mScrim = document.createElement('div'); mScrim.className = 'search-scrim'; mScrim.hidden = true;
  var menu = document.createElement('nav');
  menu.className = 'menu-drawer'; menu.hidden = true; menu.setAttribute('aria-label', 'Menu');
  var tile = function (href, label, note, low) { return '<a class="menu-tile" href="' + href + '"><span>' + label + '</span><small' + (low ? ' class="low"' : '') + '>' + note + '</small></a>'; };
  menu.innerHTML = '<div class="menu-head"><span class="mono">Menu</span><button type="button" class="x" id="close-menu" aria-label="Close menu">×</button></div>' +
    '<div class="menu-tiles">' + tile('shop.html', 'Shop all', '6 pieces') + tile('shop.html#t-shirts', 'T-shirts', '260 GSM and up') +
    tile('shop.html#hoodies', 'Hoodies', '400+ GSM') + tile('shop.html#sweatshirts', 'Sweatshirts', 'Only 5 left', true) + '</div>' +
    '<ul class="menu-links"><li><a href="help.html">Help centre</a></li><li><a href="size-guide.html">Size guide</a></li><li><a href="returns.html">Delivery &amp; returns</a></li>' +
    '<li><a href="about.html">About us</a></li><li><a href="contact.html">Contact us</a></li><li><a href="https://www.instagram.com/acpanta9" target="_blank" rel="noopener">Instagram @acpanta9</a></li></ul>';
  document.body.appendChild(mScrim); document.body.appendChild(menu);
  function openMenu() { mScrim.hidden = false; menu.hidden = false; document.documentElement.classList.add('no-scroll'); $('close-menu').focus(); }
  function closeMenu() { mScrim.hidden = true; menu.hidden = true; document.documentElement.classList.remove('no-scroll'); mBtn.focus(); }
  mBtn.addEventListener('click', openMenu);
  $('close-menu').addEventListener('click', closeMenu);
  mScrim.addEventListener('click', closeMenu);
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) closeMenu(); });

  // Header search: a panel with live results, on every page
  var SEARCH_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';
  var openBagBtn = $('open-bag');
  var sBtn = document.createElement('button');
  sBtn.className = 'search-btn'; sBtn.id = 'open-search'; sBtn.type = 'button';
  sBtn.setAttribute('aria-label', 'Search products');
  sBtn.innerHTML = SEARCH_ICON + '<span>Search</span>';
  var actions = document.createElement('div'); actions.className = 'header-actions';
  openBagBtn.parentNode.insertBefore(actions, openBagBtn);
  actions.appendChild(mBtn); actions.appendChild(sBtn); actions.appendChild(openBagBtn);

  var sScrim = document.createElement('div'); sScrim.className = 'search-scrim'; sScrim.hidden = true;
  var panel = document.createElement('div');
  panel.className = 'search-panel'; panel.hidden = true;
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-label', 'Search products');
  panel.innerHTML = '<div class="wrap"><form class="search-form" id="search-form" role="search" action="shop.html">' + SEARCH_ICON +
    '<label for="search-input" hidden>Search products</label>' +
    '<input id="search-input" name="q" type="search" placeholder="Search tees, jackets, colours…" autocomplete="off" enterkeyhint="search">' +
    '<button type="button" class="x" id="close-search" aria-label="Close search">×</button></form>' +
    '<div class="search-results" id="search-results" aria-live="polite"></div></div>';
  document.body.appendChild(sScrim); document.body.appendChild(panel);
  var sInput = $('search-input'), sResults = $('search-results');
  var SUGGEST = ['T-shirts', 'Hoodies', 'Zip hoodie', 'Sweatshirt', 'Black', 'White'];
  function shopLink(q) { return 'shop.html?q=' + encodeURIComponent(q); }
  function renderResults() {
    var q = sInput.value.trim();
    if (!q) {
      sResults.innerHTML = '<p class="mono search-label">Popular searches</p><div class="suggest">' +
        SUGGEST.map(function (t) { return '<button type="button" class="chip" data-suggest="' + t + '">' + t + '</button>'; }).join('') + '</div>';
      return;
    }
    var found = searchProducts(q);
    if (!found.length) {
      sResults.innerHTML = '<p class="search-empty">No items match “' + esc(q) + '”. Try “tee”, “black” or “jacket”.</p>';
      return;
    }
    sResults.innerHTML = '<p class="mono search-label">' + found.length + (found.length === 1 ? ' item' : ' items') + '</p><ul class="result-list">' +
      found.slice(0, 6).map(function (p) {
        return '<li><a href="' + shopLink(p.name) + '"><span class="thumb">' + artFor(p, 0) + '</span>' +
          '<span class="r-meta"><b>' + esc(p.name) + '</b><span class="mono">' + esc(p.cat) + ' · ' + (p.colors.length > 2 ? p.colors.length + ' ' + (p.variantLabel || 'colour').toLowerCase() + 's' : p.colors.map(function (c) { return c[0]; }).join(' / ')) + '</span></span>' +
          '<span class="price">' + money(p.price) + '</span></a></li>';
      }).join('') + '</ul>' +
      (found.length > 1 ? '<a class="btn btn-accent see-all" href="' + shopLink(q) + '">See all ' + found.length + ' results</a>' : '');
  }
  function openSearch() { sScrim.hidden = false; panel.hidden = false; renderResults(); sInput.focus(); }
  function closeSearch() { sScrim.hidden = true; panel.hidden = true; sBtn.focus(); }
  sBtn.addEventListener('click', openSearch);
  $('close-search').addEventListener('click', closeSearch);
  sScrim.addEventListener('click', closeSearch);
  sInput.addEventListener('input', renderResults);
  sResults.addEventListener('click', function (e) {
    var b = e.target.closest('[data-suggest]'); if (!b) return;
    sInput.value = b.dataset.suggest; renderResults(); sInput.focus();
  });
  $('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var q = sInput.value.trim(); if (!q) return;
    if ($('q')) { setQuery(q); active = 'All'; if (filters) syncFilters(); renderGrid(); closeSearch(); $('grid').scrollIntoView({ behavior: 'smooth' }); }
    else window.location.href = shopLink(q);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) closeSearch();
    if (e.key === '/' && panel.hidden && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
  });

  // Zoom viewer: full-screen picture, tap/click to zoom, drag or move to look around, switch designs
  var Z = { p: null, i: 0, zoomed: false, ox: 50, oy: 50, card: null, start: null, moved: false };
  var ZSCALE = 2.5;
  var zoomEl = document.createElement('div');
  zoomEl.className = 'zoom'; zoomEl.hidden = true;
  zoomEl.setAttribute('role', 'dialog'); zoomEl.setAttribute('aria-modal', 'true');
  zoomEl.innerHTML = '<div class="zoom-top"><div class="zoom-title"><b id="zoom-name"></b><span class="mono" id="zoom-variant"></span></div>' +
    '<button type="button" class="x zoom-close" id="zoom-close" aria-label="Close">×</button></div>' +
    '<div class="zoom-stage" id="zoom-stage"><div class="zoom-media" id="zoom-media"></div></div>' +
    '<button type="button" class="zoom-nav zoom-prev" id="zoom-prev" aria-label="Previous design">‹</button>' +
    '<button type="button" class="zoom-nav zoom-next" id="zoom-next" aria-label="Next design">›</button>' +
    '<div class="zoom-bottom"><p class="zoom-hint mono" id="zoom-hint">Tap the picture to zoom in</p><div class="zoom-thumbs" id="zoom-thumbs"></div></div>';
  document.body.appendChild(zoomEl);
  var zStage = $('zoom-stage'), zMedia = $('zoom-media');
  function zoomArt(p, i) {
    var c = p.colors[i];
    if (c[2]) return '<img src="' + c[2].replace('.jpg', '-large.jpg') + '" alt="' + esc(c[3] || p.name + ', ' + c[0]) + '" draggable="false">';
    return art(p.shape, c[1], p.print);
  }
  function applyZoom() {
    zMedia.style.transformOrigin = Z.ox + '% ' + Z.oy + '%';
    zMedia.style.transform = Z.zoomed ? 'scale(' + ZSCALE + ')' : 'none';
    zStage.classList.toggle('is-zoomed', Z.zoomed);
    $('zoom-hint').textContent = Z.zoomed ? 'Drag to look around · tap to zoom out' : 'Tap the picture to zoom in';
  }
  function showZoom(i) {
    var p = Z.p, n = p.colors.length;
    Z.i = (i + n) % n; Z.zoomed = false; Z.ox = 50; Z.oy = 50;
    zMedia.innerHTML = zoomArt(p, Z.i);
    $('zoom-name').textContent = p.name + ' · ' + money(p.price);
    $('zoom-variant').textContent = (p.variantLabel || 'Colour') + ': ' + p.colors[Z.i][0];
    $('zoom-prev').hidden = $('zoom-next').hidden = n < 2;
    $('zoom-prev').setAttribute('aria-label', 'Previous ' + (p.variantLabel || 'colour').toLowerCase());
    $('zoom-next').setAttribute('aria-label', 'Next ' + (p.variantLabel || 'colour').toLowerCase());
    $('zoom-thumbs').innerHTML = n < 2 ? '' : p.colors.map(function (c, k) {
      var look = c[2] ? 'background:' + c[1] + ' url(' + c[2].replace('.jpg', '-thumb.jpg') + ') center 40%/cover' : 'background:' + c[1];
      return '<button type="button" class="sw' + (c[2] ? ' sw-img' : '') + '" data-zi="' + k + '" style="' + look + '" aria-label="' + esc(c[0]) + '" aria-pressed="' + (k === Z.i) + '"></button>';
    }).join('');
    applyZoom();
  }
  function openZoom(p, card) {
    Z.p = p; Z.card = card;
    zoomEl.setAttribute('aria-label', p.name);
    showZoom(p.sel);
    zoomEl.hidden = false;
    document.documentElement.classList.add('no-scroll');
    $('zoom-close').focus();
  }
  function closeZoom() {
    zoomEl.hidden = true;
    document.documentElement.classList.remove('no-scroll');
    var p = Z.p, card = Z.card;
    if (p && card && document.body.contains(card) && p.sel !== Z.i) {
      var size = card.querySelector('select').value;
      p.sel = Z.i; card.outerHTML = cardHTML(p);
      card = document.querySelector('.card[data-id="' + p.id + '"]');
      card.querySelector('select').value = size;
      refreshSize(card);
    }
    var back = card && card.querySelector('.zoom-btn'); if (back) back.focus();
  }
  $('zoom-close').addEventListener('click', closeZoom);
  $('zoom-prev').addEventListener('click', function () { showZoom(Z.i - 1); });
  $('zoom-next').addEventListener('click', function () { showZoom(Z.i + 1); });
  $('zoom-thumbs').addEventListener('click', function (e) { var b = e.target.closest('[data-zi]'); if (b) showZoom(+b.dataset.zi); });
  function pct(e) { var r = zStage.getBoundingClientRect(); return [Math.min(100, Math.max(0, (e.clientX - r.left) / r.width * 100)), Math.min(100, Math.max(0, (e.clientY - r.top) / r.height * 100))]; }
  zStage.addEventListener('pointerdown', function (e) {
    Z.start = { x: e.clientX, y: e.clientY, ox: Z.ox, oy: Z.oy }; Z.moved = false;
    try { zStage.setPointerCapture(e.pointerId); } catch (err) {}
  });
  zStage.addEventListener('pointermove', function (e) {
    if (Z.start) {
      var dx = e.clientX - Z.start.x, dy = e.clientY - Z.start.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) Z.moved = true;
      if (Z.zoomed && Z.moved) {
        var r = zStage.getBoundingClientRect();
        Z.ox = Math.min(100, Math.max(0, Z.start.ox - dx / r.width * 100 * 1.3));
        Z.oy = Math.min(100, Math.max(0, Z.start.oy - dy / r.height * 100 * 1.3));
        applyZoom();
      }
    } else if (Z.zoomed && e.pointerType === 'mouse') {
      var q = pct(e); Z.ox = q[0]; Z.oy = q[1]; applyZoom();
    }
  });
  zStage.addEventListener('pointerup', function (e) {
    var st = Z.start; Z.start = null; if (!st) return;
    var dx = e.clientX - st.x;
    if (!Z.moved) { var q = pct(e); Z.zoomed = !Z.zoomed; Z.ox = q[0]; Z.oy = q[1]; applyZoom(); }
    else if (!Z.zoomed && Math.abs(dx) > 50 && Z.p.colors.length > 1) showZoom(Z.i + (dx < 0 ? 1 : -1));
  });
  zStage.addEventListener('pointercancel', function () { Z.start = null; });
  document.addEventListener('keydown', function (e) {
    if (zoomEl.hidden) return;
    if (e.key === 'Escape') closeZoom();
    else if (e.key === 'ArrowRight') showZoom(Z.i + 1);
    else if (e.key === 'ArrowLeft') showZoom(Z.i - 1);
    else if (e.key === '+' || e.key === '=' || e.key === '-') { Z.zoomed = e.key !== '-'; applyZoom(); }
  });

  // Bag
  var bag = [];
  try { bag = JSON.parse(localStorage.getItem('acpanta-bag') || '[]').filter(function (l) { return byId[l.id]; }); } catch (err) { bag = []; }
  function save() { try { localStorage.setItem('acpanta-bag', JSON.stringify(bag)); } catch (err) {} }
  function addToBag(p, color, size) {
    var hit = bag.find(function (l) { return l.id === p.id && l.color === color && l.size === size; });
    if (hit) hit.qty++; else bag.push({ id: p.id, color: color, size: size, qty: 1 });
    save(); renderBag();
    toast('Added ' + p.name + ' (' + p.colors[color][0] + ', ' + size + ')');
  }
  function renderBag() {
    var count = 0, sub = 0;
    bag.forEach(function (l) { count += l.qty; sub += l.qty * byId[l.id].price; });
    $('bag-count').textContent = count;
    $('lines').innerHTML = bag.length ? bag.map(function (l, i) {
      var p = byId[l.id], c = p.colors[l.color];
      return '<div class="line"><div class="thumb">' + artFor(p, l.color) + '</div><div class="meta"><b>' + p.name + '</b>' +
        '<span class="mono" style="color:var(--muted)">' + c[0] + ' · ' + l.size + '</span>' +
        '<span class="line-size mono">' + sizeText(p, l.size) + '</span>' +
        '<div class="qty"><button data-dec="' + i + '" aria-label="Decrease quantity">−</button><span>' + l.qty + '</span><button data-inc="' + i + '" aria-label="Increase quantity">+</button></div></div>' +
        '<span class="price">' + money(p.price * l.qty) + '</span></div>';
    }).join('') : '<p class="empty">Your bag is empty. Pick a size on any piece and add it here.</p>';
    $('subtotal').textContent = money(sub);
    $('shipping').textContent = sub === 0 ? '—' : 'Free';
    $('total').textContent = money(sub);
    $('checkout').disabled = !bag.length;
    $('checkout-msg').textContent = '';
  }
  $('lines').addEventListener('click', function (e) {
    var inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]');
    if (inc) bag[+inc.dataset.inc].qty++;
    else if (dec) { var i = +dec.dataset.dec; if (--bag[i].qty <= 0) bag.splice(i, 1); }
    else return;
    save(); renderBag();
  });
  function openBag() { $('scrim').hidden = false; $('drawer').hidden = false; $('close-bag').focus(); }
  function closeBag() { $('scrim').hidden = true; $('drawer').hidden = true; $('open-bag').focus(); }
  $('open-bag').addEventListener('click', openBag);
  $('close-bag').addEventListener('click', closeBag);
  $('scrim').addEventListener('click', closeBag);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('drawer').hidden) closeBag(); });
  // Checkout: the server works out prices from products.js and returns a Stripe Checkout page
  var CHECKOUT_URL = '/.netlify/functions/create-checkout';
  $('checkout').addEventListener('click', function () {
    var btn = this, msg = $('checkout-msg');
    if (!bag.length) return;
    btn.disabled = true; btn.textContent = 'Opening secure checkout…'; msg.textContent = '';
    function fail(text) { btn.disabled = false; btn.textContent = 'Checkout'; msg.textContent = text; }
    fetch(CHECKOUT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: bag.map(function (l) { return { id: l.id, color: l.color, size: l.size, qty: l.qty }; }) })
    }).then(function (r) {
      var type = r.headers.get('Content-Type') || '';
      if (type.indexOf('application/json') === -1) throw new Error('unavailable');
      return r.json().then(function (data) { if (!r.ok || !data.url) throw new Error(data.error || 'failed'); return data; });
    }).then(function (data) {
      window.location.href = data.url;
    }).catch(function (err) {
      if (err.message === 'unavailable' || err instanceof TypeError) fail('Checkout opens on the live website once payments are connected. It isn’t available in this preview.');
      else fail(err.message === 'failed' ? 'We couldn’t start checkout. Please try again, or message us on WhatsApp.' : err.message);
    });
  });
  if (document.body.getAttribute('data-page') === 'thanks' && /session_id=/.test(location.search)) { bag = []; save(); }
  renderBag();

  // Size guide: show the tables only once the real measurements are in
  if ($('size-tables')) {
    $('size-tables').hidden = !MEASUREMENTS_READY;
    $('unit-switch').hidden = !MEASUREMENTS_READY;
    $('size-pending').hidden = MEASUREMENTS_READY;
  }
  if ($('size-body-tee')) {
  function renderSizes(unit) {
    Object.keys(SIZE_TABLES).forEach(function (id) {
      if (!$(id)) return;
      $(id).innerHTML = SIZE_TABLES[id].map(function (r) {
        return '<tr><td>' + r[0] + '</td>' + r.slice(1).map(function (v) {
          return '<td>' + (unit === 'in' ? (v / 2.54).toFixed(1) + '\u2033' : v + ' cm') + '</td>';
        }).join('') + (function () { var fr = fitRange(id, r); return '<td>' + (unit === 'in' ? (fr[0] / 2.54).toFixed(0) + '\u2013' + (fr[1] / 2.54).toFixed(0) + '\u2033' : fr[0] + '\u2013' + fr[1] + ' cm') + '</td>'; })() + '</tr>';
      }).join('');
    });
    $('unit-cm').setAttribute('aria-pressed', unit === 'cm');
    $('unit-in').setAttribute('aria-pressed', unit === 'in');
  }
  $('unit-cm').addEventListener('click', function () { renderSizes('cm'); });
  $('unit-in').addEventListener('click', function () { renderSizes('in'); });
  renderSizes('cm');
  }

  // Newsletter
  if ($('join-form')) $('join-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = $('email').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { $('form-msg').textContent = 'Enter an email address like name@example.com.'; $('email').focus(); return; }
    $('form-msg').textContent = 'Looks good. This form is a demo: connect an email service (for example Mailchimp or Klaviyo) to collect sign-ups.';
    this.reset();
  });

  // Customer reviews (home page): real reviews from reviews.js only
  if ($('review-list')) {
    var REVIEWS = (window.ACPANTA_REVIEWS || []).filter(function (r) { return r && r.text && r.rating >= 1 && r.rating <= 5; });
    var stars = function (n) { var full = Math.round(n); return '<span class="stars" aria-hidden="true">' + '★★★★★'.slice(0, full) + '<span class="stars-off">' + '★★★★★'.slice(full) + '</span></span>'; };
    if (!REVIEWS.length) {
      $('review-summary').innerHTML = '';
      $('review-list').innerHTML =
        '<div class="review-empty"><p><b>No reviews yet.</b> We’re new, and we’d rather show nothing than make something up.</p>' +
        '<p>Bought something from us? Be the first to write one below.</p></div>';
    } else {
      var avg = REVIEWS.reduce(function (t, r) { return t + r.rating; }, 0) / REVIEWS.length;
      $('review-summary').innerHTML = stars(avg) + '<span class="review-avg">' + avg.toFixed(1) + ' out of 5</span>' +
        '<span class="review-count">' + REVIEWS.length + (REVIEWS.length === 1 ? ' review' : ' reviews') + '</span>';
      $('review-list').innerHTML = REVIEWS.slice().sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); }).map(function (r) {
        var when = r.date ? new Date(r.date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
        return '<article class="review-card"><div class="review-top">' + stars(r.rating) + '<span class="sr-only">' + r.rating + ' out of 5 stars</span>' +
          (r.verified ? '<span class="verified mono">✓ Verified buyer</span>' : '') + '</div>' +
          '<p class="review-text">' + esc(r.text) + '</p>' +
          '<p class="review-meta mono">' + esc(r.name || 'Customer') + (r.product ? ' · ' + esc(r.product) : '') + (when ? ' · ' + when : '') + '</p></article>';
      }).join('');
    }
  }

  // Review form: sends to Netlify Forms. Reviews are checked against an order before going up.
  var rForm = $('review-form');
  if (rForm) {
    rForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('review-msg'), btn = rForm.querySelector('button[type=submit]');
      msg.className = 'form-msg';
      if (!rForm.checkValidity()) { rForm.reportValidity(); return; }
      btn.disabled = true; msg.textContent = 'Sending…';
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(rForm)).toString() })
        .then(function (r) { if (!r.ok) throw new Error('bad'); })
        .then(function () {
          rForm.reset(); msg.className = 'form-msg ok';
          msg.textContent = 'Thank you! We’ll check it against your order and post it here soon.';
        })
        .catch(function () {
          msg.className = 'form-msg err';
          msg.innerHTML = 'Sorry, that didn’t send. Please try again, or send your review on <a href="https://wa.me/447448795690" target="_blank" rel="noopener">WhatsApp</a>.';
        })
        .then(function () { btn.disabled = false; });
    });
  }

  // Mark the current page in the menu
  var page = document.body.getAttribute('data-page');
  [].forEach.call(document.querySelectorAll('nav.main a[data-page]'), function (a) {
    if (a.getAttribute('data-page') === page) a.setAttribute('aria-current', 'page');
  });

  var tt;
  function toast(msg) { var t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 2200); }
})();

/* Count-up stats: starts once when the section is 40% visible. */
(function () {
  var DURATION = 1600;   // ms each number takes to count up
  var STAGGER = 250;     // ms delay between one stat and the next
  var LOCALE = 'en-GB';  // 'en-GB' gives 12,480; use 'en-IN' for Indian grouping (1,23,456)

  var section = document.getElementById('stats');
  if (!section) return;
  var stats = [].slice.call(section.querySelectorAll('.stat'));

  // Format a number with thousand separators and a fixed number of decimals
  function format(n, decimals) {
    return n.toLocaleString(LOCALE, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }

  // Ease-out curve (cubic): fast at the start, gentle as it lands
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  // Read each stat's settings, and fix the number's width at its final size so nothing shifts
  var items = stats.map(function (card) {
    var num = card.querySelector('.num');
    var item = {
      num: num,
      value: parseFloat(num.getAttribute('data-value')) || 0,
      decimals: parseInt(num.getAttribute('data-decimals'), 10) || 0,
      wrap: card.querySelector('.stat-value'),
      bar: card.querySelector('.stat-bar span')
    };
    num.textContent = format(item.value, item.decimals); // show the final value, formatted (12,480 / 4.9)
    return item;
  });

  // Fix each number's width at its final size (after the font loads) so digits don't shift while counting
  function lockWidths() {
    items.forEach(function (it) {
      var shown = it.num.textContent;
      it.num.style.minWidth = '';
      // Measure the final value written with each digit 0-9 and keep the widest,
      // so no in-between number can be wider than the space reserved for it
      var final = format(it.value, it.decimals), widest = 0;
      for (var d = 0; d <= 9; d++) {
        it.num.textContent = final.replace(/\d/g, String(d));
        widest = Math.max(widest, it.num.getBoundingClientRect().width);
      }
      it.num.style.minWidth = Math.ceil(widest) + 'px';
      it.num.textContent = shown;
    });
  }
  lockWidths();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(lockWidths);

  // Visitors who prefer reduced motion see the final numbers straight away
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return; // final values are already in place

  // Start state: numbers at 0, bars empty
  items.forEach(function (it) {
    it.num.textContent = format(0, it.decimals);
    it.bar.style.transform = 'scaleX(0)';
  });

  // Animate one stat with requestAnimationFrame
  function run(it) {
    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / DURATION);
      var eased = easeOut(t);
      it.num.textContent = format(it.value * eased, it.decimals);
      it.bar.style.transform = 'scaleX(' + eased + ')';   // bar fills in sync with the number
      if (t < 1) { requestAnimationFrame(frame); return; }
      it.num.textContent = format(it.value, it.decimals);  // land exactly on the final value
      it.wrap.classList.add('pop');                        // small pop when it lands
    }
    requestAnimationFrame(frame);
  }

  // Watch for the section to be 40% visible, then count up once and stop watching
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      items.forEach(function (it, i) { setTimeout(function () { run(it); }, i * STAGGER); });
    });
  }, { threshold: 0.4 });
  observer.observe(section);
})();
