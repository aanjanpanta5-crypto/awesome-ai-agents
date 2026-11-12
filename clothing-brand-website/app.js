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
  var LOGO_AT = { tee: [100, 72], hood: [100, 86], boxy: [100, 88], zip: [124, 82], sweat: [100, 74] };
  function printMark(shape, print) {
    var at = LOGO_AT[shape] || [100, 80];
    var txt = function (x, y, size, fill) { return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="' + size + '" fill="' + fill + '" stroke="none">cAP</text>'; };
    if (print === 'logo') return txt(at[0], at[1], shape === 'zip' ? 11 : 15, '#e0102e');
    if (print === 'graphic') return '<rect x="74" y="68" width="52" height="50" fill="#e0102e" stroke="none"/>' + txt(100, 99, 16, '#ffffff');
    return '';
  }
  function art(shape, color, print) {
    var dark = /^#[0-3]/.test(color);
    return '<svg viewBox="0 0 200 200" aria-hidden="true"><g fill="' + color + '" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round">' +
      SHAPES[shape].replace(/class="st"/g, 'stroke="' + (dark ? '#8a8a8a' : '#b9b9b9') + '" stroke-width="2" stroke-dasharray="4 3"') + printMark(shape, print) + '</g></svg>';
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
  var PRODUCT_WORDS = { 'zip-hoodie': 'zipper zipped zip up jacket', 'boxy-hoodie': 'oversized loose', 'printed-tee': 'graphic print', 'logo-tee': 'basic plain', 'logo-hoodie': 'heavy thick' };
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

  function card(p) {
    var c = p.colors[p.sel];
    return '<article class="card" data-id="' + p.id + '">' +
      '<div class="art">' + (badgeFor(p) ? '<span class="badge mono">' + badgeFor(p) + '</span>' : '') + art(p.shape, c[1], p.print) + '</div>' +
      '<div class="card-top"><h3>' + p.name + '</h3><span class="price">' + money(p.price) + '</span></div>' +
      '<p class="spec mono">' + p.spec + '</p>' +
      '<div class="swatches" role="group" aria-label="Colour: ' + c[0] + '">' + p.colors.map(function (col, i) {
        return '<button class="sw" data-sw="' + i + '" style="background:' + col[1] + '" aria-label="' + col[0] + '" aria-pressed="' + (i === p.sel) + '" title="' + col[0] + '"></button>';
      }).join('') + '</div>' +
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
    var sw = e.target.closest('[data-sw]');
    if (sw) {
      var size = el.querySelector('select').value;
      p.sel = +sw.dataset.sw;
      el.outerHTML = card(p);
      var fresh = document.querySelector('.card[data-id="' + p.id + '"]');
      fresh.querySelector('select').value = size;
      fresh.querySelector('[data-sw="' + p.sel + '"]').focus();
      return;
    }
    if (e.target.closest('[data-add]')) {
      var sel = el.querySelector('select');
      if (!sel.value) { sel.focus(); toast('Choose a size first'); return; }
      addToBag(p, p.sel, sel.value);
    }
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

  // Header search: a panel with live results, on every page
  var SEARCH_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';
  var openBagBtn = $('open-bag');
  var sBtn = document.createElement('button');
  sBtn.className = 'search-btn'; sBtn.id = 'open-search'; sBtn.type = 'button';
  sBtn.setAttribute('aria-label', 'Search products');
  sBtn.innerHTML = SEARCH_ICON + '<span>Search</span>';
  var actions = document.createElement('div'); actions.className = 'header-actions';
  openBagBtn.parentNode.insertBefore(actions, openBagBtn);
  actions.appendChild(sBtn); actions.appendChild(openBagBtn);

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
        return '<li><a href="' + shopLink(p.name) + '"><span class="thumb">' + art(p.shape, p.colors[0][1], p.print) + '</span>' +
          '<span class="r-meta"><b>' + esc(p.name) + '</b><span class="mono">' + esc(p.cat) + ' · ' + p.colors.map(function (c) { return c[0]; }).join(' / ') + '</span></span>' +
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
      return '<div class="line"><div class="thumb">' + art(p.shape, c[1], p.print) + '</div><div class="meta"><b>' + p.name + '</b>' +
        '<span class="mono" style="color:var(--muted)">' + c[0] + ' · ' + l.size + '</span>' +
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

  // Size guide
  if ($('size-body-tee')) {
  var SIZE_TABLES = {
    'size-body-tee': [['S', 53, 69, 21], ['M', 56, 71, 22], ['L', 59, 73, 23], ['XL', 62, 75, 24]],
    'size-body-hood': [['S', 57, 68, 60], ['M', 60, 70, 62], ['L', 63, 72, 64], ['XL', 66, 74, 66]]
  };
  function renderSizes(unit) {
    Object.keys(SIZE_TABLES).forEach(function (id) {
      if (!$(id)) return;
      $(id).innerHTML = SIZE_TABLES[id].map(function (r) {
        return '<tr><td>' + r[0] + '</td>' + r.slice(1).map(function (v) {
          return '<td>' + (unit === 'in' ? (v / 2.54).toFixed(1) + '\u2033' : v + ' cm') + '</td>';
        }).join('') + '</tr>';
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

  // Mark the current page in the menu
  var page = document.body.getAttribute('data-page');
  [].forEach.call(document.querySelectorAll('nav.main a[data-page]'), function (a) {
    if (a.getAttribute('data-page') === page) a.setAttribute('aria-current', 'page');
  });

  var tt;
  function toast(msg) { var t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 2200); }
})();
