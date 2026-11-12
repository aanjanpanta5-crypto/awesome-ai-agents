/* Acpanta storefront script: products, bag, filters, size guide, sign-up form. Shared by every page. */
(function () {
  var SHAPES = {
    tee: '<path d="M60 40 L85 30 Q100 44 115 30 L140 40 L170 70 L150 90 L138 80 L138 172 L62 172 L62 80 L50 90 L30 70 Z"/><path d="M85 30 Q100 44 115 30" fill="none" class="st"/>',
    hood: '<path d="M60 44 L80 34 Q78 14 100 12 Q122 14 120 34 L140 44 L168 74 L172 160 L154 162 L140 90 L140 176 L60 176 L60 90 L46 162 L28 160 L32 74 Z"/><path d="M80 34 Q100 58 120 34" fill="none" class="st"/><rect x="78" y="128" width="44" height="26" fill="none" class="st"/>',
    jacket: '<path d="M62 34 L88 26 L100 42 L112 26 L138 34 L166 60 L176 152 L156 154 L146 82 L146 178 L54 178 L54 82 L44 154 L24 152 L34 60 Z"/><path d="M100 42 L100 178" fill="none" class="st"/><rect x="62" y="118" width="26" height="28" fill="none" class="st"/><rect x="112" y="118" width="26" height="28" fill="none" class="st"/>',
    shirt: '<path d="M64 34 L88 28 L100 40 L112 28 L136 34 L162 62 L170 150 L152 152 L144 84 L144 176 L56 176 L56 84 L48 152 L30 150 L38 62 Z"/><path d="M100 40 L100 176" fill="none" class="st"/><rect x="66" y="66" width="22" height="22" fill="none" class="st"/>',
    pant: '<path d="M66 24 L134 24 L144 178 L108 178 L100 78 L92 178 L56 178 Z"/><path d="M66 36 L134 36" fill="none" class="st"/><path d="M100 36 L100 78" fill="none" class="st"/>',
    cap: '<path d="M44 120 Q46 64 100 60 Q154 64 156 120 Z"/><path d="M40 120 L178 120 Q170 138 120 134 L40 128 Z"/><circle cx="100" cy="60" r="5"/>'
  };
  function art(shape, color) {
    return '<svg viewBox="0 0 200 200" aria-hidden="true"><g fill="' + color + '" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round">' +
      SHAPES[shape].replace(/class="st"/g, 'stroke="#a3262d" stroke-width="2" stroke-dasharray="4 3"') + '</g></svg>';
  }

  var PRODUCTS = [
    { id: 'tee', name: 'Loopwheel Tee', cat: 'T-shirts', price: 58, shape: 'tee', spec: '300 gsm loopwheel cotton · boxy fit', colors: [['Indigo', '#2b3a67'], ['Bone', '#e3ddcf'], ['Moss', '#5b6b47']], sizes: ['S','M','L','XL','XXL'], badge: 'Run 07' },
    { id: 'pocket', name: 'Pocket Tee', cat: 'T-shirts', price: 48, shape: 'tee', spec: '240 gsm combed cotton · chest pocket', colors: [['White', '#efece4'], ['Black', '#26262a'], ['Sage', '#8a9a7b']], sizes: ['S','M','L','XL','XXL'], badge: 'New' },
    { id: 'heavy', name: 'Heavyweight Tee', cat: 'T-shirts', price: 54, shape: 'tee', spec: '320 gsm garment-dyed · relaxed fit', colors: [['Washed Black', '#3a3a3f'], ['Clay', '#a0674b'], ['Stone', '#b8b2a3']], sizes: ['S','M','L','XL','XXL'] },
    { id: 'ringer', name: 'Ringer Tee', cat: 'T-shirts', price: 46, shape: 'tee', spec: '200 gsm jersey · contrast trims', colors: [['Ecru', '#e3dccb'], ['Heather', '#a7aab0']], sizes: ['S','M','L','XL'] },
    { id: 'henley', name: 'Henley Tee', cat: 'T-shirts', price: 58, shape: 'tee', spec: '260 gsm slub · three-button placket', colors: [['Navy', '#1f2742'], ['Oat', '#d4c6a8']], sizes: ['S','M','L','XL','XXL'] },
    { id: 'raglan', name: 'Raglan Tee', cat: 'T-shirts', price: 52, shape: 'tee', spec: '220 gsm cotton · raglan sleeves', colors: [['Grey', '#9a9ea6'], ['Forest', '#2f4a3a']], sizes: ['S','M','L','XL'] },
    { id: 'slub', name: 'Slub Jersey Tee', cat: 'T-shirts', price: 44, shape: 'tee', spec: '180 gsm slub jersey · lightweight', colors: [['Sky', '#9fb6d1'], ['White', '#efece4'], ['Rust', '#9c4f2e']], sizes: ['S','M','L','XL','XXL'] },
    { id: 'stripe', name: 'Striped Tee', cat: 'T-shirts', price: 62, shape: 'tee', spec: '280 gsm yarn-dyed stripe · boat neck', colors: [['Navy Stripe', '#2b3a67'], ['Red Stripe', '#a8373a']], sizes: ['S','M','L','XL'] },
    { id: 'mock', name: 'Mock Neck Tee', cat: 'T-shirts', price: 56, shape: 'tee', spec: '260 gsm interlock · ribbed mock neck', colors: [['Black', '#26262a'], ['Bone', '#e3ddcf']], sizes: ['S','M','L','XL'] },
    { id: 'longsleeve', name: 'Long Sleeve Tee', cat: 'T-shirts', price: 64, shape: 'tee', spec: '260 gsm cotton · ribbed cuffs', colors: [['Olive', '#5c5f3a'], ['Indigo', '#2b3a67'], ['Ecru', '#e3dccb']], sizes: ['S','M','L','XL','XXL'] },
    { id: 'graphic', name: 'Acpanta Logo Tee', cat: 'T-shirts', price: 50, shape: 'tee', spec: '240 gsm cotton · screen-printed logo', colors: [['White', '#efece4'], ['Indigo', '#24325a'], ['Burgundy', '#6e1a20']], sizes: ['S','M','L','XL','XXL'], badge: 'Bestseller' },
    { id: 'hood', name: 'Mill Hoodie', cat: 'Tops', price: 128, shape: 'hood', spec: '480 gsm brushed fleece · flat-lock seams', colors: [['Heather', '#8b8f96'], ['Indigo', '#2b3a67']], sizes: ['S','M','L','XL'] },
    { id: 'chore', name: 'Chore Coat', cat: 'Outerwear', price: 245, shape: 'jacket', spec: '12 oz cotton duck · garment-dyed', colors: [['Indigo', '#24325a'], ['Tobacco', '#7a5532'], ['Ecru', '#d9cfb6']], sizes: ['S','M','L','XL'], badge: 'Low stock' },
    { id: 'over', name: 'Twill Overshirt', cat: 'Outerwear', price: 165, shape: 'shirt', spec: '9 oz brushed twill · horn buttons', colors: [['Olive', '#5c5f3a'], ['Navy', '#1f2742']], sizes: ['S','M','L','XL','XXL'] },
    { id: 'denim', name: 'Selvedge Work Pant', cat: 'Trousers', price: 195, shape: 'pant', spec: '14 oz rope-dyed selvedge · straight leg', colors: [['Raw', '#1c2647'], ['Rinsed', '#3c5285']], sizes: ['28','30','32','34','36'] },
    { id: 'fatigue', name: 'Fatigue Trouser', cat: 'Trousers', price: 150, shape: 'pant', spec: '10 oz back-sateen · tapered', colors: [['Khaki', '#a8966b'], ['Black', '#26262a']], sizes: ['28','30','32','34','36'] },
    { id: 'shirt', name: 'Oxford Work Shirt', cat: 'Tops', price: 110, shape: 'shirt', spec: '5 oz oxford · chainstitched hem', colors: [['Chambray', '#7f97bd'], ['White', '#efece4']], sizes: ['S','M','L','XL'] },
    { id: 'cap', name: 'Six-Panel Cap', cat: 'Accessories', price: 42, shape: 'cap', spec: 'Leftover duck from the coat run', colors: [['Indigo', '#24325a'], ['Tobacco', '#7a5532']], sizes: ['One size'] }
  ];
  var byId = {}; PRODUCTS.forEach(function (p) { byId[p.id] = p; p.sel = 0; });
  var money = function (n) { return '£' + n.toFixed(0); };
  var $ = function (id) { return document.getElementById(id); };

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
      '<div class="art">' + (p.badge ? '<span class="badge mono">' + p.badge + '</span>' : '') + art(p.shape, c[1]) + '</div>' +
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
      : PRODUCTS.filter(function (p) { return active === 'All' || p.cat === active; });
    grid.innerHTML = list.map(card).join('');
  }
  if (grid) grid.addEventListener('click', function (e) {
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
  renderGrid();

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
      return '<div class="line"><div class="thumb">' + art(p.shape, c[1]) + '</div><div class="meta"><b>' + p.name + '</b>' +
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
  $('checkout').addEventListener('click', function () {
    $('checkout-msg').textContent = 'Checkout is a demo here. Connect a payment provider (for example Shopify or Stripe) to take real orders.';
  });
  renderBag();

  // Size guide
  if ($('size-body')) {
  var SIZES = [['S', 56, 70, 62, 76, 81], ['M', 59, 72, 64, 81, 81], ['L', 62, 74, 66, 86, 82], ['XL', 65, 76, 68, 91, 82], ['XXL', 68, 78, 70, 97, 83]];
  function renderSizes(unit) {
    $('size-body').innerHTML = SIZES.map(function (r) {
      return '<tr><td>' + r[0] + '</td>' + r.slice(1).map(function (v) {
        return '<td>' + (unit === 'in' ? (v / 2.54).toFixed(1) + '″' : v + ' cm') + '</td>';
      }).join('') + '</tr>';
    }).join('');
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
