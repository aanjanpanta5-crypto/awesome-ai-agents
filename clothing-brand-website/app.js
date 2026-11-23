/* Acpanta storefront script: products, bag, filters, size guide, sign-up form. Shared by every page. */
(function () {
  // Small line icons (Lucide, ISC licence) instead of emoji
  var svg = function (d) { return '<svg class="ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var ICON = {
    box: svg('<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/>'),
    cal: svg('<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>'),
    ruler: svg('<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>'),
    chat: svg('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'),
    person: svg('<circle cx="12" cy="5" r="2.5"/><path d="M12 8v7M7.5 10.5 12 11.5l4.5-1M9.5 21l2.5-6 2.5 6"/>')
  };
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
  SHAPES.gift = '<rect x="22" y="52" width="156" height="96" rx="10"/><path d="M22 124 L178 124" fill="none" class="st"/>';
  var LOGO_AT = { gift: [100, 86, 60], tee: [100, 64, 38], hood: [100, 80, 38], boxy: [100, 82, 40], zip: [124, 76, 24], sweat: [100, 66, 38] };
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
  var SHARE_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4"/></svg>';
  var ZOOM_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M11 8v6M8 11h6"/></svg>';

  // Product picture: the real photo when a variant has one, otherwise the drawing
  function artFor(p, i) {
    var c = p.colors[i] || p.colors[0];
    if (c[2]) return '<picture><source srcset="' + c[2].replace(/\.jpg$/, '.webp') + '" type="image/webp"><img src="' + c[2] + '" alt="' + esc(c[3] || p.name + ', ' + c[0]) + '" loading="lazy" decoding="async"></picture>';
    return art(p.shape, c[1], p.print);
  }
  window.ACPANTA_ART = artFor; // used by the Shop the look slider (looks.js)
  // Sold out: stock 0 for the whole product, or a size listed in soldOut (e.g. soldOut: ['XL'])
  function isSoldOut(p) { return typeof p.stock === 'number' && p.stock <= 0; }
  function sizeLeft(p, s) { return p.sizeStock && typeof p.sizeStock[s] === 'number' ? p.sizeStock[s] : null; }
  function sizeSoldOut(p, s) { return isSoldOut(p) || (p.soldOut || []).indexOf(s) !== -1 || sizeLeft(p, s) === 0; }
  function badgeFor(p) {
    if (isSoldOut(p)) return 'Sold out';
    if (typeof p.stock === 'number' && p.stock <= 5) return 'Only ' + p.stock + ' left';
    return p.badge || '';
  }

  var PRODUCTS = window.ACPANTA_PRODUCTS || [];
  var byId = {}; PRODUCTS.forEach(function (p) { byId[p.id] = p; p.sel = 0; });
  var DELIVERY = PRODUCTS.DELIVERY || { fee: 3.99, freeOver: 35 };
  var money = function (n) { return '£' + (n % 1 ? n.toFixed(2) : n); };
  window.ACPANTA_MONEY = money;
  var $ = function (id) { return document.getElementById(id); };

  // Search: matches names, categories, fabrics, colours and everyday words
  var CAT_WORDS = {
    'T-shirts': 'tshirt tshirts tee tees top',
    'Hoodies': 'hoodie hoodies hoody hood top',
    'Sweatshirts': 'sweatshirt sweatshirts jumper sweater crew top'
  };
  var PRODUCT_WORDS = { 'pleasures-hoodie': 'face hands graphic back print oversized boxy', 'dice-hoodie': 'dice graphic back print oversized boxy gamble', 'take-the-risk-hoodie': 'risk chance dice question graphic back print oversized boxy slogan', 'zip-hoodie': 'zipper zipped zip up jacket', 'boxy-hoodie': 'oversized loose graphic print back skull cigarette plain blank cotton black', 'printed-tee': 'graphic print', 'logo-tee': 'basic plain', 'logo-hoodie': 'heavy thick' };
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
  var PID = '';
  try { PID = new URLSearchParams(location.search).get('id') || ''; } catch (err) {}
  function productLink(p) { return 'product.html?id=' + encodeURIComponent(p.id); }

  // "On the rail": Acpanta's shop photo (images/brand/rail-shop.*). Each hanging piece is a tap target.
  // x = centre of the garment across the photo, in % (photo is 1376 px wide). Keep in order with the photo.
  if ($('rail-photo')) {
    var SPOTS = [['logo-tee', 1, 232, 'Logo Tee'], ['boxy-hoodie', 1, 418, 'Don\u2019t Look Back'], ['boxy-hoodie', 0, 618, 'Light Up'], ['pleasures-hoodie', 0, 818, 'Pleasures'], ['dice-hoodie', 0, 1008, 'Dice'], ['take-the-risk-hoodie', 0, 1200, 'Take The Risk']];
    // Two copies side by side so the rail can glide round and round without a gap (the copy is hidden from screen readers)
    var railHTML = function (copy) {
      return '<div class="rail-photo"' + (copy ? ' aria-hidden="true"' : '') + '><picture><source srcset="images/brand/rail-shop.webp" type="image/webp"><img src="images/brand/rail-shop.jpg" width="1376" height="768" alt="' + (copy ? '' : 'Acpanta pieces hanging on a chrome rail in the shop') + '" decoding="async"></picture>' +
        SPOTS.map(function (sp) {
          var p = byId[sp[0]]; if (!p) return '';
          var label = p.variantLabel === 'Design' && p.colors.length > 1 ? p.name + ' · ' + p.colors[sp[1]][0] : p.name;
          var price = isSoldOut(p) ? 'Sold out' : money(p.price);
          return '<a class="rail-spot" style="left:' + (sp[2] / 1376 * 100).toFixed(2) + '%" href="' + productLink(p) + (sp[1] ? '&c=' + sp[1] : '') + '"' + (copy ? ' tabindex="-1"' : '') + ' aria-label="' + esc(label + ', ' + price) + '">' +
            '<span class="rail-spot-tag" aria-hidden="true">' + esc(sp[3]) + '<span>' + price + '</span></span></a>';
        }).join('') + '</div>';
    };
    $('rail-photo').innerHTML = railHTML(false) + railHTML(true);
  }
  // Saved items and recently viewed, kept only in this browser
  function readList(k) { try { var v = JSON.parse(localStorage.getItem(k) || '[]'); return Array.isArray(v) ? v : []; } catch (err) { return []; } }
  function writeList(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (err) {} }
  var SAVED = readList('acpanta-saved');
  function isSaved(id) { return SAVED.indexOf(id) !== -1; }
  var HEART = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
  function saveBtn(p, cls) { return '<button type="button" class="' + cls + '" data-save aria-pressed="' + isSaved(p.id) + '" aria-label="' + (isSaved(p.id) ? 'Remove ' : 'Save ') + esc(p.name) + (isSaved(p.id) ? ' from saved items' : ' for later') + '">' + HEART + (cls === 'save-btn' ? '<span>' + (isSaved(p.id) ? 'Saved' : 'Save for later') + '</span>' : '') + '</button>'; }
  var query = '';
  try { query = new URLSearchParams(location.search).get('q') || ''; } catch (err) {}

  // Filters + grid (shop page shows every piece; home shows a featured few)
  var grid = $('grid'), filters = $('filters');
  var cats = ['All'].concat(PRODUCTS.map(function (p) { return p.cat; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
  var slug = function (c) { return c.toLowerCase().replace(/[^a-z]+/g, '-'); };
  var active = 'All';
  var sortBy = 'featured';
  function gsmOf(p) { var m = /(\d+)\+? GSM/.exec(p.spec + ' ' + (p.details || []).join(' ')); return m ? +m[1] : 0; }
  function sortList(list) {
    if (sortBy === 'featured') return list;
    return list.slice().sort(function (x, y) {
      if (sortBy === 'price-asc') return x.price - y.price;
      if (sortBy === 'price-desc') return y.price - x.price;
      return gsmOf(y) - gsmOf(x);
    });
  }
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
    'size-body-tee': [['S', 53, 71, 22], ['M', 56, 73, 23], ['L', 59, 75, 24], ['XL', 62, 77, 25]],
    'size-body-hood': [['S', 58, 70, 60], ['M', 61, 72, 61], ['L', 64, 74, 62], ['XL', 67, 76, 63]]
  };
  // Rough body chest each size suits, worked out from the garment's flat chest width.
  // Tees sit closer; hoodies and sweatshirts are cut roomier.
  // Body chest each size fits (cm), from Acpanta's own size guide
  var FIT_CHEST = { S: [91, 96], M: [99, 104], L: [107, 112], XL: [114, 119] };
  function fitRange(tableId, row) { return FIT_CHEST[row[0]]; }

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
  // Sharing: phone share menu where available, otherwise WhatsApp / Facebook / X / email / copy link
  function shareInfo(p) {
    var url = new URL(productLink(p), location.href).href;
    return { url: url, title: p.name + ' · Acpanta', text: p.name + ' from Acpanta, ' + money(p.price) + '. Have a look:' };
  }
  function shareLinksHTML(p) {
    var s = shareInfo(p), u = encodeURIComponent(s.url), t = encodeURIComponent(s.text);
    return '<a class="share-link" href="https://wa.me/?text=' + t + '%20' + u + '" target="_blank" rel="noopener">WhatsApp</a>' +
      '<a class="share-link" href="https://www.facebook.com/sharer/sharer.php?u=' + u + '" target="_blank" rel="noopener">Facebook</a>' +
      '<a class="share-link" href="https://twitter.com/intent/tweet?text=' + t + '&url=' + u + '" target="_blank" rel="noopener">X</a>' +
      '<a class="share-link" href="mailto:?subject=' + encodeURIComponent(s.title) + '&body=' + t + '%20' + u + '">Email</a>' +
      '<button type="button" class="share-link" data-copy-link>Copy link</button>';
  }
  function copyLink(p) {
    var url = shareInfo(p).url;
    var done = function () { toast('Link copied. Paste it to a friend'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link:', url); });
    else window.prompt('Copy this link:', url);
  }
  function shareProduct(p, el) {
    var s = shareInfo(p);
    if (navigator.share) { navigator.share({ title: s.title, text: s.text, url: s.url }).catch(function () {}); return; }
    var pdpShare = el && el.querySelector('.share-links');
    if (pdpShare) { pdpShare.classList.add('flash'); setTimeout(function () { pdpShare.classList.remove('flash'); }, 900); pdpShare.querySelector('a').focus(); return; }
    copyLink(p);
  }
  function cardHTML(p, el) { return el && el.classList.contains('pdp') ? pdpHTML(p) : card(p); }
  function badgeHTML(p) { return badgeFor(p) ? '<span class="badge mono' + (/^Only/.test(badgeFor(p)) ? '' : ' holo') + '">' + badgeFor(p) + '</span>' : ''; }
  // Estimated delivery dates: post in 1-2 working days, then 2-4 working days with Royal Mail (weekends skipped)
  function addWorkingDays(d, n) { d = new Date(d); while (n > 0) { d.setDate(d.getDate() + 1); if (d.getDay() % 6) n--; } return d; }
  function etaText() {
    var now = new Date(), f = function (d) { return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); };
    return 'Estimated delivery: <b>' + f(addWorkingDays(now, 3)) + ' – ' + f(addWorkingDays(now, 6)) + '</b>';
  }
  // Colour/design swatches, size measurements, size picker and Add to bag (product cards and product pages)
  function buyHTML(p) {
    var c = p.colors[p.sel];
    return (p.digital ? '' : '<p class="variant-name mono">' + (p.variantLabel || 'Colour') + ': <b>' + esc(c[0]) + '</b></p>') +
      '<div' + (p.digital ? ' hidden' : '') + ' class="swatches" role="group" aria-label="' + (p.variantLabel || 'Colour') + '">' + p.colors.map(function (col, i) {
        var look = col[2] ? 'background:' + col[1] + ' url(' + col[2].replace('.jpg', '-thumb.jpg') + ') center 40%/cover' : 'background:' + col[1];
        return '<button class="sw' + (col[2] ? ' sw-img' : '') + '" data-sw="' + i + '" style="' + look + '" aria-label="' + esc(col[0]) + '" aria-pressed="' + (i === p.sel) + '" title="' + esc(col[0]) + '"></button>';
      }).join('') + '</div>' +
      (p.digital ? '<p class="size-info mono">Emailed to you within 1 working day. Valid for 12 months.</p>' :
      '<p class="size-info mono" data-size-info aria-live="polite">' + (MEASUREMENTS_READY ? 'Pick a size to see its measurements' :
        'Need exact measurements? <a href="https://wa.me/447448795690" target="_blank" rel="noopener">Message us on WhatsApp</a>') + '</p>') +
      '<div class="buy' + (p.digital ? ' buy-digital' : '') + '"><label class="mono" for="size-' + p.id + '" hidden>Size</label><select id="size-' + p.id + '"' + (p.digital ? ' hidden' : '') + '>' +
      (p.sizes.length > 1 ? '<option value="">Select size</option>' : '') +
      p.sizes.map(function (s) { var left = sizeLeft(p, s); return sizeSoldOut(p, s) ? '<option value="' + s + '" disabled>' + s + ' (sold out)</option>' : '<option value="' + s + '">' + s + (left !== null && left <= 5 ? ' (' + left + ' left)' : '') + '</option>'; }).join('') + '</select>' +
      (isSoldOut(p) ? '<button class="add" data-add disabled aria-disabled="true">Sold out</button>' : '<button class="add" data-add>Add to bag</button>') + '</div>' +
      (isSoldOut(p) || (p.soldOut || []).length ? '<a class="notify-link mono" href="https://wa.me/447448795690?text=' +
        encodeURIComponent('Hi Acpanta, please tell me when the ' + p.name + ' is back' + (isSoldOut(p) ? '' : ' in ' + p.soldOut.join('/')) + '.') +
        '" target="_blank" rel="noopener">' + (isSoldOut(p) ? 'Sold out. Tell me when it\'s back' : (p.soldOut.join(', ') + ' sold out. Tell me when it\'s back')) + '</a>' : '');
  }
  function card(p) {
    var c = p.colors[p.sel];
    return '<article class="card" data-id="' + p.id + '">' +
      '<div class="art' + (c[2] ? ' has-photo' : '') + '"><a class="art-link" href="' + productLink(p) + '" aria-label="View ' + esc(p.name) + '"></a>' + badgeHTML(p) + artFor(p, p.sel) +
      saveBtn(p, 'save-btn-icon') + '</div>' +
      '<div class="card-top"><h3><a href="' + productLink(p) + '">' + p.name + '</a></h3><span class="price">' + money(p.price) + '</span></div>' +
      '<p class="spec mono">' + p.spec + '</p>' +
      (p.details ? '<details class="pdetails"><summary>Details</summary><ul>' + p.details.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul></details>' : '') +
      buyHTML(p) + '<a class="view-link mono" href="' + productLink(p) + '">View details</a></article>';
  }
  // Fit note and quick facts, shown just above Add to bag (only facts already in products.js)
  function fitBoxHTML(p) {
    if (p.digital) return '';
    var boxy = p.shape === 'boxy';
    var pills = ['Substantial weight · Structured drape'];
    if ((p.details || []).some(function (d) { return /pre-shrunk/i.test(d); })) pills.push('Pre-shrunk');
    pills.push('Free UK delivery over £35');
    return '<div class="acp-fit-box"><div><strong>Fit note:</strong> ' + (boxy ?
      'Boxy, wide cut. Take your normal size for a relaxed drape, or size down for a closer fit.' :
      'Unisex fit. Take your usual size, or use Find my size below.') + '</div>' +
      '<div class="acp-care-pills">' + pills.map(function (t) { return '<span class="acp-pill">' + esc(t) + '</span>'; }).join('') + '</div></div>';
  }
  // Product page: big picture, all details, size picker and Add to bag
  function pdpHTML(p) {
    var c = p.colors[p.sel];
    var details = p.digital ? ['A code for ' + money(p.price) + ' to spend at acpanta.com', 'Emailed to you within 1 working day of your order', 'Valid for 12 months from purchase', 'Enter the code in the discount box at checkout', 'Spend less than its value? Message us and we\'ll send a new code for the balance', 'Can\'t be exchanged for cash. Unused cards can be cancelled within 14 days for a full refund']
      : (p.details || p.spec.split(' · ').concat(['Unisex fit'])).concat(['Sizes ' + p.sizes.join(', ')]);
    return '<article class="card pdp" data-id="' + p.id + '">' +
      '<div class="pdp-media"><div class="art' + (c[2] ? ' has-photo' : '') + '" data-zoom>' + badgeHTML(p) + artFor(p, p.sel) +
      '<button type="button" class="zoom-btn" data-zoom aria-label="Zoom in on ' + esc(p.name) + '">' + ZOOM_ICON + '</button></div></div>' +
      '<div class="pdp-info">' +
      '<nav class="crumbs mono" aria-label="Breadcrumb"><a href="shop.html">Shop</a> / <a href="shop.html#' + slug(p.cat) + '">' + esc(p.cat) + '</a></nav>' +
      (p.digital ? '<p class="batch-label mono">Digital gift card</p>' : p.drop ? '<p class="batch-label mono">' + esc(p.drop) + '</p>' : '<p class="batch-label mono">Batch 01 · one of 185 pieces</p>') +
      '<h1>' + esc(p.name) + '</h1>' +
      '<p class="pdp-price"><span class="price">' + money(p.price) + '</span></p>' +
      '<p class="spec mono">' + p.spec + '</p>' + (p.model ? '<p class="pdp-model mono">' + esc(p.model) + '</p>' : '') + fitBoxHTML(p) + buyHTML(p) + saveBtn(p, 'save-btn') +
      (p.digital ? '' : '<details class="size-finder"><summary>' + ICON.ruler + 'Find my size</summary><div class="sf-body"><label>Your chest, measured around the fullest part<span class="sf-row"><input type="number" inputmode="decimal" min="20" max="160" step="0.5" data-sf-chest placeholder="e.g. 100"><select data-sf-unit aria-label="Unit"><option value="cm">cm</option><option value="in">in</option></select></span></label><p class="sf-out" data-sf-out aria-live="polite">Enter your chest to see your size.</p></div></details>' +
        '<button type="button" class="save-btn tryon-open" data-tryon>' + ICON.person + 'Try it on me</button>') +
      '<div class="share-box"><p class="mono share-title">Share with a friend</p>' +
      '<div class="share-links">' + (navigator.share ? '<button type="button" class="share-link share-native" data-share>' + SHARE_ICON + ' Share</button>' : '') + shareLinksHTML(p) + '</div></div>' +
      (p.digital ? '' : '<a class="wa-help" href="https://wa.me/447448795690?text=' + encodeURIComponent('Hi Acpanta, I\'m looking at the ' + p.name + ' and need sizing help.') + '" target="_blank" rel="noopener">' + ICON.chat + 'Need sizing help? Chat with us on WhatsApp</a>' +
      '<p class="pdp-guide"><a href="size-guide.html">Size guide</a></p>') +
      '<h2 class="pdp-h">Details</h2><ul class="pdp-list">' + details.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>' +
      (p.why ? '<p class="pdp-why">' + esc(p.why) + '</p>' : '') +
      (p.digital ? '<ul class="pdp-perks mono"><li>Emailed, no delivery needed</li><li>Valid 12 months</li><li>Secure checkout by Stripe</li></ul>' :
      '<p class="dispatch-line">' + ICON.box + 'Packed by hand in London · dispatched in 1–2 working days · tracked</p>' +
      '<p class="eta-line">' + ICON.cal + etaText() + '</p>' +
      '<ul class="pdp-perks mono"><li>Free UK delivery over £35</li><li>14-day returns</li><li>Secure checkout by Stripe</li></ul>') +
      (p.digital ? '' :
      '<div class="pdp-care"><h2 class="pdp-h">Care</h2><p class="care-icons" aria-label="Care: wash at 30 degrees inside out, do not tumble dry, do not iron the print"><span aria-hidden="true"><b class="ci">30°</b> Wash inside out</span><span aria-hidden="true"><b class="ci ci-x">⊠</b> No tumble dry</span><span aria-hidden="true"><b class="ci ci-x">✕</b> Don\'t iron the print</span></p><ul><li>Wash cold, inside out, at 30°C max</li><li>Do not tumble dry</li><li>Hang dry only, to keep the fabric weight and fit</li></ul><p>Always check the care label. <a href="care.html?id=' + p.id + '">Full care guide for this piece</a></p></div>') +
      '</div></article>';
  }
  function renderGrid() {
    if (!grid) return;
    var list = grid.hasAttribute('data-saved')
      ? SAVED.map(function (id) { return byId[id]; }).filter(Boolean)
      : grid.hasAttribute('data-related')
      ? PRODUCTS.filter(function (p) { return p.id !== PID && !p.digital; }).sort(function (a, b) { var cur = byId[PID]; return cur ? (b.cat === cur.cat) - (a.cat === cur.cat) : 0; }).slice(0, 3)
      : grid.dataset.featured
      ? grid.dataset.featured.split(',').map(function (id) { return byId[id]; }).filter(Boolean)
      : sortList(PRODUCTS.filter(function (p) { return (active === 'All' || p.cat === active) && (!query || matches(p, query)); }));
    if (grid.hasAttribute('data-saved') && !list.length) { grid.innerHTML = '<div class="no-results"><p><b>Nothing saved yet.</b></p><p>Tap the ♡ on any piece to save it here for later.</p><p><a class="btn btn-accent" href="shop.html">Browse the shop</a></p></div>'; return; }
    grid.innerHTML = list.length ? list.map(card).join('') :
      '<div class="no-results"><p><b>No items match “' + esc(query) + '”' + (active !== 'All' ? ' in ' + esc(active) : '') + '.</b></p>' +
      '<p>Try “tee”, “black” or “jacket”, or <button class="link-btn" data-clear-search>show everything</button>.</p></div>';
    var note = $('result-note');
    if (note) note.textContent = query ? list.length + (list.length === 1 ? ' item' : ' items') + ' for “' + query + '”' + (active !== 'All' ? ' in ' + active : '') : '';
  }
  function onCardClick(e) {
    if (e.target.closest('[data-clear-search]')) { setQuery(''); active = 'All'; if (filters) syncFilters(); renderGrid(); if ($('q')) $('q').focus(); return; }
    var el = e.target.closest('.card'); if (!el) return;
    var p = byId[el.dataset.id];
    if (e.target.closest('[data-save]')) { toggleSaved(p, el); return; }
    if (e.target.closest('[data-share]')) { shareProduct(p, el); return; }
    if (e.target.closest('[data-copy-link]')) { copyLink(p); return; }
    if (e.target.closest('[data-zoom]')) { openZoom(p, el); return; }
    var sw = e.target.closest('[data-sw]');
    if (sw) {
      var size = el.querySelector('select').value;
      p.sel = +sw.dataset.sw;
      el.outerHTML = cardHTML(p, el);
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
  }
  if (grid) grid.addEventListener('click', onCardClick);
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
  function onCardChange(e) {
    var el = e.target.closest('.card');
    if (el && e.target.tagName === 'SELECT') refreshSize(el);
  }
  if (grid) grid.addEventListener('change', onCardChange);

  // Product page (product.html?id=...)
  var pdpEl = $('pdp');
  if (pdpEl) {
    var P0 = byId[PID];
    // ?c=1 opens a specific colour/design (used by the Batch 01 page)
    if (P0) { var c0i = +new URLSearchParams(location.search).get('c'); if (Number.isInteger(c0i) && P0.colors[c0i]) P0.sel = c0i; }
    if (!P0) {
      pdpEl.innerHTML = '<div class="pdp-missing"><h1>We can\'t find that piece</h1><p>It may have sold out or moved. Have a look at everything we have.</p><p><a class="btn btn-accent" href="shop.html">Shop all</a></p></div>';
    } else {
      pdpEl.innerHTML = pdpHTML(P0);
      document.title = P0.name + ' · Acpanta';
      // Product data for Google (price, stock, brand)
      try {
        var ld = document.createElement('script'); ld.type = 'application/ld+json';
        var c0 = P0.colors[0], url0 = 'https://acpanta.com/product.html?id=' + P0.id;
        ld.textContent = JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Product', name: P0.name, sku: P0.id,
          brand: { '@type': 'Brand', name: 'Acpanta' },
          description: P0.name + ' by Acpanta. ' + P0.spec + '.',
          image: c0[2] ? 'https://acpanta.com/' + c0[2] : 'https://acpanta.com/og-image.jpg',
          url: url0,
          offers: { '@type': 'Offer', url: url0, priceCurrency: 'GBP', price: P0.price.toFixed(2),
            availability: isSoldOut(P0) ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@type': 'Organization', name: 'Acpanta' },
            shippingDetails: P0.digital ? undefined : { '@type': 'OfferShippingDetails',
              shippingRate: { '@type': 'MonetaryAmount', value: P0.price >= DELIVERY.freeOver ? 0 : DELIVERY.fee, currency: 'GBP' },
              shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'GB' },
              deliveryTime: { '@type': 'ShippingDeliveryTime',
                handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
                transitTime: { '@type': 'QuantitativeValue', minValue: 2, maxValue: 4, unitCode: 'DAY' } } },
            hasMerchantReturnPolicy: { '@type': 'MerchantReturnPolicy', applicableCountry: 'GB',
              returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow', merchantReturnDays: 14,
              returnMethod: 'https://schema.org/ReturnByMail', returnFees: 'https://schema.org/ReturnShippingFees' } }
        });
        document.head.appendChild(ld);
        var bc = document.createElement('script'); bc.type = 'application/ld+json';
        bc.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Shop', item: 'https://acpanta.com/shop.html' },
          { '@type': 'ListItem', position: 2, name: P0.cat, item: 'https://acpanta.com/shop.html#' + slug(P0.cat) },
          { '@type': 'ListItem', position: 3, name: P0.name, item: url0 }] });
        document.head.appendChild(bc);
      } catch (err) {}
      var md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute('content', P0.name + ' by Acpanta. ' + P0.spec + '. ' + money(P0.price) + ', free UK delivery over £35 and 14-day returns.');
      pdpEl.addEventListener('click', onCardClick);
      pdpEl.addEventListener('change', onCardChange);
    }
  }

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
  var item = function (href, label, note, low) { return '<li><a href="' + href + '">' + label + (note ? ' <small class="menu-note' + (low ? ' low' : '') + '">' + note + '</small>' : '') + '</a></li>'; };
  menu.innerHTML = '<div class="menu-head"><span class="mono">Menu</span><button type="button" class="x" id="close-menu" aria-label="Close menu">×</button></div>' +
    '<ul class="menu-list">' + item('women.html', 'Women', 'Coming soon') + item('shop.html', 'Men') + item('looks.html', 'Shop the look', 'Batch 01 Men') + item('rail.html', 'The rail', 'Every piece, hanging') + item('batch-01.html', 'Batch 01', 'The series') + item('index.html', 'The Acpanta world', 'Story & reviews') + '</ul>' +
    '<ul class="menu-list">' + item('shop.html', 'New in') + item('shop.html#t-shirts', 'T-shirts') + item('shop.html#hoodies', 'Hoodies') +
    item('shop.html#sweatshirts', 'Sweatshirts', 'Only 5 left', true) + item('perfume.html', 'Limited perfume', 'Coming soon') +
    item('bags.html', 'Bags and small leather goods', 'Coming soon') + item('customisation.html', 'Customisation') + '</ul>' +
    '<ul class="menu-list menu-list-small">' + item('shop.html#search', 'Search') + '<li><a href="saved.html">Saved items <span id="saved-count"></span></a></li>' + item('help.html', 'Help centre') + item('size-guide.html', 'Size guide') + item('care.html', 'Care guide') + item('returns.html', 'Delivery &amp; returns') + item('track.html', 'Track your order') +
    item('about.html', 'About us') + item('contact.html', 'Contact us') + '<li><a href="https://www.instagram.com/acpanta9" target="_blank" rel="noopener">Instagram @acpanta9</a></li></ul>';
  document.body.appendChild(mScrim); document.body.appendChild(menu);
  function openMenu() { mScrim.hidden = false; menu.hidden = false; document.documentElement.classList.add('no-scroll'); $('close-menu').focus(); }
  function closeMenu() { mScrim.hidden = true; menu.hidden = true; document.documentElement.classList.remove('no-scroll'); mBtn.focus(); }
  mBtn.addEventListener('click', openMenu);
  $('close-menu').addEventListener('click', closeMenu);
  mScrim.addEventListener('click', closeMenu);
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) closeMenu(); });

  // Header buttons: menu and bag. The only search box is at the top of the shop page.
  var openBagBtn = $('open-bag');
  var actions = document.createElement('div'); actions.className = 'header-actions';
  openBagBtn.parentNode.insertBefore(actions, openBagBtn);
  actions.appendChild(mBtn); actions.appendChild(openBagBtn);
  // shop.html#search (from the menu) puts the cursor straight in the search box
  if ($('q') && location.hash === '#search') { $('q').focus(); }
  // '/' jumps to the search box on the shop page
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && $('q') && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); $('q').focus(); }
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
    if (c[2]) return '<picture><source srcset="' + c[2].replace('.jpg', '-large.webp') + '" type="image/webp"><img src="' + c[2].replace('.jpg', '-large.jpg') + '" alt="' + esc(c[3] || p.name + ', ' + c[0]) + '" draggable="false"></picture>';
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
      p.sel = Z.i; card.outerHTML = cardHTML(p, card);
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
  try {
    // Only keep bag lines that match a real product, colour and size (ignores anything tampered with)
    bag = JSON.parse(localStorage.getItem('acpanta-bag') || '[]').filter(function (l) {
      var p = l && byId[l.id];
      return p && Number.isInteger(l.color) && p.colors[l.color] && p.sizes.indexOf(l.size) !== -1 && l.qty === Math.floor(l.qty) && l.qty >= 1 && l.qty <= 20;
    });
  } catch (err) { bag = []; }
  function save() { try { localStorage.setItem('acpanta-bag', JSON.stringify(bag)); } catch (err) {} }
  function addToBag(p, color, size) {
    if (sizeSoldOut(p, size)) { toast('Sorry, that size is sold out'); return; }
    var hit = bag.find(function (l) { return l.id === p.id && l.color === color && l.size === size; });
    if (hit) hit.qty++; else bag.push({ id: p.id, color: color, size: size, qty: 1 });
    save(); renderBag();
    toast('Added ' + p.name + ' (' + p.colors[color][0] + ', ' + size + ')');
  }
  // Small window into the shop for tryon.js (Try it on me): real products, size chart and bag
  window.ACPANTA_SHOP = {
    product: function (id) { return byId[id]; },
    fitChest: FIT_CHEST,
    soldOut: function (id, size) { return sizeSoldOut(byId[id], size); },
    add: function (id, color, size) { addToBag(byId[id], color, size); },
    money: money
  };
  // Bag emblem: only shown when there's room for the whole thing
  function fitEmblem() {
    var w = document.querySelector('.bag-watermark'); if (!w) return;
    w.classList.remove('is-hidden');
    if (w.clientHeight < 110) w.classList.add('is-hidden');
  }
  window.addEventListener('resize', fitEmblem);
  // Complete the look: each piece's natural partner (tee with its hoodie, and so on)
  var PAIRS = { 'logo-tee': 'logo-hoodie', 'printed-tee': 'zip-hoodie', 'logo-hoodie': 'logo-tee',
    'zip-hoodie': 'printed-tee', 'boxy-hoodie': 'logo-tee', 'sweatshirt': 'logo-tee',
    'pleasures-hoodie': 'logo-tee', 'dice-hoodie': 'logo-tee', 'take-the-risk-hoodie': 'logo-tee' };
  // Partner of the most recently added piece that isn't already in the bag or sold out, in the same colour when it exists
  function completeTheLook() {
    for (var i = bag.length - 1; i >= 0; i--) {
      var p = byId[PAIRS[bag[i].id]];
      if (!p || isSoldOut(p) || bag.some(function (l) { return l.id === p.id; })) continue;
      return { p: p, c: p.colors[bag[i].color] && byId[bag[i].id].variantLabel !== 'Design' ? bag[i].color : 0 };
    }
    return null;
  }
  function renderBag() {
    setTimeout(fitEmblem, 0);
    if (!$('bag-extra') && $('lines')) { var bx = document.createElement('div'); bx.id = 'bag-extra'; $('lines').parentNode.insertBefore(bx, $('lines').nextSibling); }
    var count = 0, sub = 0;
    bag.forEach(function (l) { count += l.qty; sub += l.qty * byId[l.id].price; });
    $('bag-count').textContent = count;
    $('lines').innerHTML = bag.length ? bag.map(function (l, i) {
      var p = byId[l.id], c = p.colors[l.color];
      return '<div class="line"><div class="thumb">' + artFor(p, l.color) + '</div><div class="meta"><b>' + p.name + '</b>' +
        '<span class="mono" style="color:var(--muted)">' + (p.digital ? 'Emailed gift card' : c[0] + ' · ' + l.size) + '</span>' +
        '<span class="line-size mono">' + sizeText(p, l.size) + '</span>' +
        '<div class="qty"><button type="button" data-dec="' + i + '" aria-label="Remove one ' + esc(p.name) + '">−</button><span aria-live="polite" aria-label="Quantity ' + l.qty + '">' + l.qty + '</span><button type="button" data-inc="' + i + '" aria-label="Add one more ' + esc(p.name) + '"' + (l.qty >= 20 ? ' disabled' : '') + '>+</button>' +
        '<button type="button" class="line-remove" data-remove="' + i + '" aria-label="Remove ' + esc(p.name) + ' from bag">Remove</button></div></div>' +
        '<span class="price">' + money(p.price * l.qty) + '</span></div>';
    }).join('') : '<p class="empty">Your bag is empty. Pick a size on any piece and add it here.</p>';
    var extra = $('bag-extra');
    if (extra) {
      var look = completeTheLook();
      extra.innerHTML = '<p class="batch-note">Batch 01 · 185 pieces</p><p class="dispatch-line">' + ICON.box + 'Packed by hand in London · dispatched in 1–2 working days · tracked</p>' +
        (bag.some(function (l) { return byId[l.id] && !byId[l.id].digital; }) ? '<p class="eta-line">' + ICON.cal + etaText() + '</p>' : '') +
        (look ? '<a class="xsell" href="' + productLink(look.p) + '"><span class="xsell-art">' + artFor(look.p, look.c) + '</span><span><b>Complete the look</b><span>' + esc(look.p.name) + ' · ' + esc(look.p.colors[look.c][0]) + ' · ' + money(look.p.price) + '</span></span><span class="xsell-go">View →</span></a>' : '');
    }
    // Delivery: £3.99, free once the clothing (not gift cards) reaches £35
    var goods = bag.reduce(function (a, l) { return a + (byId[l.id].digital ? 0 : l.qty * byId[l.id].price); }, 0);
    var ship = goods === 0 ? 0 : goods >= DELIVERY.freeOver ? 0 : DELIVERY.fee;
    $('subtotal').textContent = money(sub);
    $('shipping').textContent = sub === 0 ? '—' : goods === 0 ? 'Emailed' : ship ? money(ship) : 'Free';
    $('total').textContent = money(Math.round((sub + ship) * 100) / 100);
    var away = $('free-away');
    if (!away) { away = document.createElement('p'); away.id = 'free-away'; away.className = 'free-away mono'; $('shipping').parentNode.insertAdjacentElement('afterend', away); }
    away.textContent = ship ? 'Add ' + money(Math.round((DELIVERY.freeOver - goods) * 100) / 100) + ' more for free UK delivery' : '';
    $('checkout').disabled = !bag.length;
    $('checkout-msg').textContent = '';
  }
  $('lines').addEventListener('click', function (e) {
    var inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]'), rm = e.target.closest('[data-remove]');
    if (inc) { var l = bag[+inc.dataset.inc]; if (l.qty < 20) l.qty++; }
    else if (dec) { var i = +dec.dataset.dec; if (--bag[i].qty <= 0) bag.splice(i, 1); }
    else if (rm) bag.splice(+rm.dataset.remove, 1);
    else return;
    save(); renderBag();
  });
  function openBag() { $('scrim').hidden = false; $('drawer').hidden = false; $('toast').hidden = true; fitEmblem(); $('close-bag').focus(); }
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
          '<p class="review-meta mono">' + esc(r.name || 'Customer') + (r.product ? ' · ' + esc(r.product) : '') + (when ? ' · ' + when : '') + '</p>' +
          (r.height || r.size ? '<p class="review-fit mono">' + (r.height ? 'Height ' + esc(r.height) : '') + (r.height && r.size ? ' · ' : '') + (r.size ? 'Wears size ' + esc(r.size) : '') + '</p>' : '') + '</article>';
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
          msg.textContent = 'Thank you. We’ll check it against your order and post it here soon.';
        })
        .catch(function () {
          msg.className = 'form-msg err';
          msg.innerHTML = 'Sorry, that didn’t send. Please try again, or send your review on <a href="https://wa.me/447448795690" target="_blank" rel="noopener">WhatsApp</a>.';
        })
        .then(function () { btn.disabled = false; });
    });
  }

  // Other forms (drop alerts, custom inquiries): send to Netlify Forms and show a message
  [].forEach.call(document.querySelectorAll('form[data-nf-ajax]'), function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.form-msg'), btn = form.querySelector('button[type=submit]');
      msg.className = 'form-msg';
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var hasFile = form.querySelector('input[type=file]');
      btn.disabled = true; msg.textContent = 'Sending…';
      fetch('/', hasFile ? { method: 'POST', body: new FormData(form) } :
        { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() })
        .then(function (r) { if (!r.ok) throw new Error('bad'); })
        .then(function () { form.reset(); msg.className = 'form-msg ok'; msg.textContent = form.getAttribute('data-ok') || 'Thank you, that’s sent.'; })
        .catch(function () {
          msg.className = 'form-msg err';
          msg.innerHTML = 'Sorry, that didn’t send. Please try again, or message us on <a href="https://wa.me/447448795690" target="_blank" rel="noopener">WhatsApp</a>.';
        })
        .then(function () { btn.disabled = false; });
    });
  });

  // Interactive weight guide (home page): compare a typical 150 GSM tee with Acpanta fabrics
  if ($('gsm-slider')) {
    var GSM = [
      { gsm: 150, label: 'Typical tee', tag: '150 GSM · Typical high-street tee', title: 'A typical high-street T-shirt',
        desc: 'The thin, lightweight jersey most fast-fashion tees use. It tends to cling, and collars can stretch and lose their shape after a few washes.',
        drape: 'Thin and clingy', warmth: 'Warm weather only', fabric: 'Lightweight jersey', base: true },
      { gsm: 260, id: 'logo-tee', label: 'Tee', desc: 'Roughly 70% heavier than a typical tee. It holds a clean shape around the collar and shoulders without feeling stiff.',
        drape: 'Clean and structured', warmth: 'All year, on its own or layered' },
      { gsm: 320, id: 'sweatshirt', label: 'Sweatshirt', desc: 'Over twice the weight of a typical tee. Solid and warm, with a relaxed drape that keeps its shape.',
        drape: 'Relaxed, holds its shape', warmth: 'Spring, autumn and cool evenings' },
      { gsm: 400, id: 'boxy-hoodie', label: 'Boxy Hoodie', plus: true, desc: 'More than 2.5 times a typical tee. Cut wide for a boxy drape, pre-shrunk and bio-washed.',
        drape: 'Wide, boxy drape', warmth: 'Autumn and winter' },
      { gsm: 430, id: 'logo-hoodie', label: 'Logo Hoodie', desc: 'Our heaviest piece, nearly three times a typical tee. You feel it the moment you pick it up.',
        drape: 'Heavy, solid structure', warmth: 'Winter and cold days' }
    ];
    var gsmSteps = $('gsm-steps'), gsmSlider = $('gsm-slider');
    gsmSteps.innerHTML = GSM.map(function (g, i) {
      return '<button type="button" class="gsm-step" data-gi="' + i + '" aria-pressed="false">' + g.gsm + (g.plus ? '+' : '') + ' GSM<span>' + g.label + '</span></button>';
    }).join('');
    var showGsm = function (i) {
      var g = GSM[i], p = g.id && byId[g.id], x = g.gsm / 150;
      gsmSlider.value = i;
      gsmSlider.setAttribute('aria-valuetext', g.gsm + (g.plus ? '+' : '') + ' GSM, ' + (p ? p.name : g.title));
      [].forEach.call(gsmSteps.children, function (b, k) { b.setAttribute('aria-pressed', k === i); });
      $('gsm-tag').textContent = g.tag || (g.gsm + (g.plus ? '+' : '') + ' GSM · ' + (p ? p.cat.replace(/s$/, '') : ''));
      $('gsm-price').textContent = p ? money(p.price) : 'For comparison';
      $('gsm-title').textContent = p ? p.name : g.title;
      $('gsm-desc').textContent = g.desc;
      $('gsm-x').textContent = g.base ? 'Baseline' : (x.toFixed(1) + (g.plus ? '×+' : '×') + ' a typical tee');
      $('gsm-fill').style.width = Math.round(g.gsm / 430 * 100) + '%';
      $('gsm-drape').textContent = g.drape;
      $('gsm-warmth').textContent = g.warmth;
      $('gsm-fabric').textContent = g.fabric || (g.gsm + (g.plus ? '+' : '') + ' GSM heavyweight cotton');
      var cta = $('gsm-cta');
      if (p) { cta.href = productLink(p); cta.textContent = 'Shop the ' + p.name + ' →'; cta.classList.remove('is-base'); }
      else { cta.href = '#weights'; cta.textContent = 'Compare with our tee →'; cta.classList.add('is-base'); }
    };
    gsmSlider.addEventListener('input', function () { showGsm(+gsmSlider.value); });
    gsmSteps.addEventListener('click', function (e) { var b = e.target.closest('[data-gi]'); if (b) showGsm(+b.dataset.gi); });
    $('gsm-cta').addEventListener('click', function (e) { if (this.classList.contains('is-base')) { e.preventDefault(); showGsm(1); gsmSlider.focus(); } });
    showGsm(1);
  }

  // Bulk enquiry shortcut: tick the bulk box and set 20 pieces
  if ($('bulk-start')) $('bulk-start').addEventListener('click', function () {
    var f = document.querySelector('.custom-form'); if (!f) return;
    f.elements.bulk.checked = true; if (+f.elements.quantity.value < 20) f.elements.quantity.value = 20;
  });

  // Customisation previewer: garment, colour, view, placement and text, then hand off to WhatsApp or the form
  if ($('cz-preview')) {
    var CZ = { piece: 'tee', colour: 'Black', view: 'front', place: 'chest', text: 'YOUR TEXT' };
    var CZ_PIECES = { tee: { name: 'Logo Tee', gsm: 'heavy weight', shape: 'tee' }, hood: { name: 'Heavyweight Logo Hoodie', gsm: 'heavy weight', shape: 'hood' } };
    var CZ_PLACES = { front: { chest: ['Centre chest', 100, 70, 13], left: ['Left chest', 122, 66, 8] }, back: { big: ['Oversized back print', 100, 106, 22], upper: ['Upper back', 100, 66, 11] } };
    var czDraw = function () {
      var g = CZ_PIECES[CZ.piece], places = CZ_PLACES[CZ.view];
      if (!places[CZ.place]) CZ.place = Object.keys(places)[0];
      var pl = places[CZ.place], dark = CZ.colour === 'Black';
      var t = esc((CZ.text || 'YOUR TEXT').slice(0, 24));
      var fs = pl[3] * (t.length > 10 ? 10 / t.length : 1);
      var svg = art(g.shape, dark ? '#1c1c1c' : '#f3f3f1', '');
      if (CZ.view === 'back') svg = svg.replace(/<path d="M8\d 3\d Q100 \d+ 1\d\d 3\d"[^>]*\/>/, '').replace(/<rect x="78" y="128"[^>]*\/>/, '');
      svg = svg.replace('</g></svg>', '</g><text x="' + pl[1] + '" y="' + pl[2] + '" text-anchor="middle" dominant-baseline="middle" font-family="Big Shoulders Display, sans-serif" font-weight="800" font-size="' + fs.toFixed(1) + '" fill="' + (dark ? '#ffffff' : '#141414') + '" letter-spacing=".5">' + t + '</text></svg>');
      $('cz-preview').innerHTML = svg;
      $('cz-caption').textContent = g.name + ' (' + g.gsm + ') · ' + CZ.colour + ' · ' + (CZ.view === 'front' ? 'Front' : 'Back') + ' · ' + pl[0];
      $('cz-place').innerHTML = Object.keys(places).map(function (k) { return '<button type="button" class="chip" data-cz-place="' + k + '" aria-pressed="' + (k === CZ.place) + '">' + places[k][0] + '</button>'; }).join('');
      [].forEach.call(document.querySelectorAll('[data-cz-piece]'), function (b) { b.setAttribute('aria-pressed', b.dataset.czPiece === CZ.piece); });
      [].forEach.call(document.querySelectorAll('[data-cz-colour]'), function (b) { b.setAttribute('aria-pressed', b.dataset.czColour === CZ.colour); });
      [].forEach.call(document.querySelectorAll('[data-cz-view]'), function (b) { b.setAttribute('aria-pressed', b.dataset.czView === CZ.view); });
      var size = $('cz-size').value, qty = $('cz-qty').value || 1;
      var msg = 'Hi Acpanta, I\'d like a custom piece:\n• ' + g.name + ' (' + g.gsm + '), ' + CZ.colour + '\n• ' + (CZ.view === 'front' ? 'Front' : 'Back') + ': ' + pl[0] + '\n• Text: ' + (CZ.text || '(my own design)') + '\n• Size: ' + (size || 'not sure yet') + '\n• Quantity: ' + qty;
      $('cz-wa').href = 'https://wa.me/447448795690?text=' + encodeURIComponent(msg);
    };
    $('cz-builder').addEventListener('click', function (e) {
      var b = e.target.closest('[data-cz-piece],[data-cz-colour],[data-cz-view],[data-cz-place]'); if (!b) return;
      if (b.dataset.czPiece) CZ.piece = b.dataset.czPiece;
      if (b.dataset.czColour) CZ.colour = b.dataset.czColour;
      if (b.dataset.czView) { CZ.view = b.dataset.czView; CZ.place = Object.keys(CZ_PLACES[CZ.view])[0]; }
      if (b.dataset.czPlace) CZ.place = b.dataset.czPlace;
      czDraw();
    });
    $('cz-text').addEventListener('input', function () { CZ.text = this.value.trim(); czDraw(); });
    $('cz-size').addEventListener('change', czDraw); $('cz-qty').addEventListener('input', czDraw);
    // Copy the design into the enquiry form below
    $('cz-to-form').addEventListener('click', function () {
      var f = document.querySelector('.custom-form'); if (!f) return;
      var g = CZ_PIECES[CZ.piece], pl = CZ_PLACES[CZ.view][CZ.place];
      f.elements.piece.value = g.name; f.elements.colour.value = CZ.colour; f.elements.quantity.value = $('cz-qty').value || 1;
      f.elements.position.value = CZ.view === 'front' ? 'Front' : 'Back';
      f.elements.idea.value = (CZ.view === 'front' ? 'Front' : 'Back') + ', ' + pl[0] + '. Text: ' + (CZ.text || '(my own design)') + '. Size: ' + ($('cz-size').value || 'not sure yet') + '.';
      $('enquire').scrollIntoView({ behavior: 'smooth' }); setTimeout(function () { f.elements.name.focus(); }, 500);
    });
    czDraw();
  }

  // Care guide (care.html): pick a piece, get its care steps
  if ($('care-pick')) {
    var CARE_BASE = ['Wash cold, at 30°C max', 'Turn it inside out before washing', 'Wash with similar colours', 'Never tumble dry', 'Line dry or dry flat, away from direct heat', 'Always check the care label'];
    var CARE_EXTRA = {
      'logo-tee': ['Iron inside out on a low heat, never directly on the logo'],
      'printed-tee': ['Iron inside out on a low heat, never directly on the print', 'Avoid harsh stain removers on the printed area'],
      'logo-hoodie': ['Heavy pieces hold water: reshape while damp and dry it flat or over a thick hanger so it keeps its length', 'Iron inside out, never directly on the logo'],
      'boxy-hoodie': ['It\'s pre-shrunk, but hot washes and tumble drying can still change the fit', 'Dry it flat to keep the boxy shape', 'Iron inside out, never directly on the back print'],
      'zip-hoodie': ['Close the zip before washing, so it doesn\'t snag the fabric', 'Iron inside out, never directly on the logo'],
      'sweatshirt': ['Reshape while damp and dry flat, so the cuffs and hem keep their shape']
    };
    var carePick = $('care-pick');
    carePick.innerHTML = PRODUCTS.filter(function (p) { return !p.digital; }).map(function (p) { return '<button type="button" class="chip" data-care="' + p.id + '">' + esc(p.name) + '</button>'; }).join('');
    var showCare = function (id) {
      var p = (byId[id] && !byId[id].digital) ? byId[id] : PRODUCTS[0];
      [].forEach.call(carePick.children, function (b) { b.setAttribute('aria-pressed', b.dataset.care === p.id); });
      $('care-title').textContent = p.name;
      $('care-spec').textContent = p.spec;
      $('care-list').innerHTML = CARE_BASE.concat(CARE_EXTRA[p.id] || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
      $('care-shop').href = productLink(p);
      try { history.replaceState(null, '', 'care.html?id=' + p.id); } catch (err) {}
    };
    carePick.addEventListener('click', function (e) { var b = e.target.closest('[data-care]'); if (b) showCare(b.dataset.care); });
    showCare(PID);
  }

  // Referral prompt (thank-you page). Create the code in Stripe first, then set REFERRAL_READY = true.
  var REFERRAL_CODE = 'FRIEND10', REFERRAL_READY = false;
  if ($('refer')) {
    var shopUrl = new URL('shop.html', location.href).href;
    var rText = REFERRAL_READY ? 'I just got something from Acpanta, heavyweight tees and hoodies made in London. Use code ' + REFERRAL_CODE + ' for 10% off your first order: ' : 'I just got something from Acpanta, heavyweight tees and hoodies made in London. Have a look: ';
    $('refer-code').hidden = !REFERRAL_READY;
    $('refer-code').innerHTML = 'Your friend gets <b>10% off</b> their first order with code <b class="code">' + REFERRAL_CODE + '</b>';
    $('refer-wa').href = 'https://wa.me/?text=' + encodeURIComponent(rText + shopUrl);
    $('refer-copy').addEventListener('click', function () {
      var t = rText + shopUrl, done = function () { toast('Copied. Paste it to a friend'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function () { window.prompt('Copy this:', t); });
      else window.prompt('Copy this:', t);
    });
  }

  // "Worn in London" lookbook (home page): real customer photos from lookbook.js, hidden until there are some
  if ($('lookbook')) {
    var LOOK = (window.ACPANTA_LOOKBOOK || []).filter(function (l) { return l && l.photo && l.permission; });
    if (LOOK.length) {
      $('lookbook').hidden = false;
      $('lookbook-grid').innerHTML = LOOK.map(function (l) {
        var p = byId[l.product];
        return '<figure class="look"><img src="' + esc(l.photo) + '" alt="' + esc(l.alt || ((l.name || 'A customer') + ' wearing ' + (p ? p.name : 'Acpanta'))) + '" loading="lazy" decoding="async">' +
          '<figcaption class="mono">' + esc(l.height) + ' · wears ' + esc(l.size) + (p ? ' · <a href="' + productLink(p) + '">' + esc(p.name) + '</a>' : '') + '</figcaption></figure>';
      }).join('');
    }
  }

  // Saved items: toggle, refresh buttons, update the menu count, re-render the saved page
  function toggleSaved(p, el) {
    var i = SAVED.indexOf(p.id);
    if (i === -1) SAVED.unshift(p.id); else SAVED.splice(i, 1);
    writeList('acpanta-saved', SAVED);
    [].forEach.call(document.querySelectorAll('.card[data-id="' + p.id + '"] [data-save]'), function (b) {
      var on = isSaved(p.id);
      b.setAttribute('aria-pressed', on);
      b.setAttribute('aria-label', (on ? 'Remove ' : 'Save ') + p.name + (on ? ' from saved items' : ' for later'));
      var t = b.querySelector('span'); if (t) t.textContent = on ? 'Saved' : 'Save for later';
    });
    toast(isSaved(p.id) ? 'Saved. Find it in Menu → Saved items' : 'Removed from saved items');
    updateSavedCount();
    if (grid && grid.hasAttribute('data-saved')) renderGrid();
  }
  function updateSavedCount() { var c = $('saved-count'); if (c) c.textContent = SAVED.length ? '(' + SAVED.length + ')' : ''; }
  updateSavedCount();

  // Find my size: compares body chest with each size's "fits chest" range
  function sizeAdvice(p, chestCm) {
    var boxy = p.cat !== 'T-shirts', order = ['S', 'M', 'L', 'XL'], pick = null, between = null;
    for (var i = 0; i < order.length; i++) {
      var r = FIT_CHEST[order[i]];
      if (chestCm >= r[0] && chestCm <= r[1]) { pick = order[i]; break; }
      if (i < order.length - 1 && chestCm > r[1] && chestCm < FIT_CHEST[order[i + 1]][0]) { between = [order[i], order[i + 1]]; break; }
    }
    if (pick) return '<b>We recommend ' + pick + '.</b> ' + (boxy ? 'That gives the relaxed, boxy fit. Size down for a closer, standard fit.' : 'True to size, with a clean everyday drape.');
    if (between) return '<b>You\'re between ' + between[0] + ' and ' + between[1] + '.</b> Pick ' + between[0] + ' for a closer fit or ' + between[1] + (boxy ? ' for the full boxy look.' : ' for a relaxed fit.');
    if (chestCm < FIT_CHEST.S[0]) return '<b>S is our smallest size</b> and will fit you loosely. <a href="https://wa.me/447448795690" target="_blank" rel="noopener">Ask us on WhatsApp</a> if you\'re unsure.';
    return '<b>XL is our largest size</b> and may be snug on you. <a href="https://wa.me/447448795690" target="_blank" rel="noopener">Ask us on WhatsApp</a> and we\'ll help.';
  }
  document.addEventListener('input', function (e) {
    var box = e.target.closest && e.target.closest('.size-finder'); if (!box) return;
    var el = box.closest('.card'), p = el && byId[el.dataset.id]; if (!p) return;
    var v = parseFloat(box.querySelector('[data-sf-chest]').value), unit = box.querySelector('[data-sf-unit]').value;
    var out = box.querySelector('[data-sf-out]');
    if (!v) { out.textContent = 'Enter your chest to see your size.'; return; }
    var cm = unit === 'in' ? v * 2.54 : v;
    out.innerHTML = sizeAdvice(p, cm);
    // Remember it on this device, and pick the recommended size if none is chosen yet
    try { localStorage.setItem('acpanta-chest', JSON.stringify({ v: v, unit: unit })); } catch (err) {}
    var rec = /We recommend (S|M|L|XL)\./.exec(out.textContent), sel = el.querySelector('select[id^="size-"]');
    if (rec && sel && !sel.value) {
      var opt = sel.querySelector('option[value="' + rec[1] + '"]');
      if (opt && !opt.disabled) { sel.value = rec[1]; sel.dispatchEvent(new Event('change', { bubbles: true })); }
    }
  });
  document.addEventListener('change', function (e) { if (e.target.matches && e.target.matches('[data-sf-unit]')) e.target.closest('.size-finder').querySelector('[data-sf-chest]').dispatchEvent(new Event('input', { bubbles: true })); });

  // Product page extras: recently viewed, and an Add to bag bar that stays on screen on phones
  if (pdpEl && byId[PID]) {
    // Fill Find my size from last time, so the recommended size is ready
    try {
      var saved = JSON.parse(localStorage.getItem('acpanta-chest') || 'null'), sf = pdpEl.querySelector('.size-finder');
      if (saved && sf && saved.v) {
        sf.querySelector('[data-sf-unit]').value = saved.unit === 'in' ? 'in' : 'cm';
        var ci = sf.querySelector('[data-sf-chest]'); ci.value = saved.v;
        ci.dispatchEvent(new Event('input', { bubbles: true }));
        sf.querySelector('summary').innerHTML = ICON.ruler + 'Find my size · using your saved chest size';
      }
    } catch (err) {}
    var RV = readList('acpanta-recent').filter(function (id) { return id !== PID && byId[id]; });
    if ($('recent-grid') && RV.length) {
      $('recent').hidden = false;
      $('recent-grid').innerHTML = RV.slice(0, 4).map(function (id) { return card(byId[id]); }).join('');
      $('recent-grid').addEventListener('click', onCardClick);
      $('recent-grid').addEventListener('change', onCardChange);
    }
    writeList('acpanta-recent', [PID].concat(RV).slice(0, 8));
    var P1 = byId[PID], stick = document.createElement('div');
    stick.className = 'sticky-buy'; stick.hidden = true;
    stick.innerHTML = '<span class="sb-name"><b>' + esc(P1.name) + '</b><span class="price">' + money(P1.price) + '</span></span><button type="button" class="btn btn-accent" data-sticky-add' + (isSoldOut(P1) ? ' disabled>Sold out' : '>Add to bag') + '</button>';
    document.body.appendChild(stick);
    stick.addEventListener('click', function (e) {
      if (!e.target.closest('[data-sticky-add]')) return;
      var card0 = pdpEl.querySelector('.pdp'), sel = card0.querySelector('select');
      if (sel && !sel.value && !P1.digital) { card0.querySelector('.buy').scrollIntoView({ behavior: 'smooth', block: 'center' }); sel.focus(); toast('Pick a size first'); return; }
      card0.querySelector('[data-add]').click();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { stick.hidden = es[0].isIntersecting || window.innerWidth > 820; }).observe(pdpEl.querySelector('.buy'));
    }
  }

  // Mark the current page in the menu
  var page = document.body.getAttribute('data-page');
  [].forEach.call(document.querySelectorAll('nav.main a[data-page]'), function (a) {
    if (a.getAttribute('data-page') === page) a.setAttribute('aria-current', 'page');
  });

  var tt;
  // Welcome back: remind returning visitors what's still in their bag (once per visit)
  try {
    if (bag.length && !sessionStorage.getItem('acpanta-welcome') && document.body.getAttribute('data-page') !== 'thanks') {
      sessionStorage.setItem('acpanta-welcome', '1');
      var n = bag.reduce(function (s, l) { return s + l.qty; }, 0);
      setTimeout(function () { if ($('drawer').hidden) toast('Welcome back. ' + n + (n === 1 ? ' item is' : ' items are') + ' still in your bag.'); }, 900);
    }
  } catch (err) {}
  if ($('sort')) $('sort').addEventListener('change', function () { sortBy = this.value; renderGrid(); });
  function toast(msg) { var t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 2200); }
})();

/* Count-up stats: starts once as the section scrolls into view. */
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

  // The real numbers stay in place until the count-up starts, so screenshots, search engines
  // and anyone who never scrolls there always see 430 / 185 / 14, never 0

  // Animate one stat with requestAnimationFrame
  function run(it) {
    var start = null;
    it.num.textContent = format(0, it.decimals);
    it.bar.style.transform = 'scaleX(0)';
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
  }, { threshold: 0, rootMargin: '0px 0px -15% 0px' }); // starts as the section's top comes into view, before the numbers do
  observer.observe(section);
})();

// Batch 01 stock bar (home page) and floating WhatsApp size helper (every page)
(function () {
  var PRODUCTS = window.ACPANTA_PRODUCTS || [];
  var bar = document.getElementById('batch-bar');
  if (bar) {
    // Pieces left = the stock numbers in products.js, so keep those up to date as pieces sell
    var total = Number(bar.getAttribute('data-total')) || 185, left = 0;
    PRODUCTS.forEach(function (p) { if (!p.digital && !p.drop && typeof p.stock === 'number') left += p.stock; }); // new drops aren't part of Batch 01
    left = Math.max(0, Math.min(total, left));
    bar.querySelector('[data-batch-count]').textContent = left + ' / ' + total + ' pieces left';
    bar.querySelector('[data-batch-fill]').style.width = Math.round(left / total * 100) + '%';
    bar.querySelector('.acp-progress-track').setAttribute('aria-valuenow', left);
    bar.hidden = false;
  }
  if (document.body.getAttribute('data-page') === 'contact') return;
  // Acpanta assistant (AI chat). Answers come from netlify/functions/chat.js; a person is always one tap away on WhatsApp.
  var WA_LINK = 'https://wa.me/447448795690?text=' + encodeURIComponent('Hi Acpanta, I have a question.');
  var launcher = document.createElement('button');
  launcher.type = 'button'; launcher.className = 'acp-wa-float acp-chat-launch';
  launcher.setAttribute('aria-label', 'Questions? Ask the Acpanta assistant'); launcher.setAttribute('aria-expanded', 'false');
  launcher.innerHTML = '<span class="acp-wa-dot" aria-hidden="true"></span><svg class="acp-wa-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3C7 3 3 6.6 3 11c0 2.4 1.2 4.6 3.1 6L5.5 21l4-2.1c.8.2 1.6.3 2.5.3 5 0 9-3.6 9-8s-4-8-9-8z"/></svg><span class="acp-wa-text">Questions? Ask us</span>';
  var panel = document.createElement('section');
  panel.className = 'acp-chat'; panel.hidden = true;
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Acpanta assistant');
  panel.innerHTML = '<div class="acp-chat-head"><div><b>Acpanta assistant</b><span class="mono">AI · replies in seconds</span></div><button type="button" class="acp-chat-x" aria-label="Close chat">×</button></div>' +
    '<div class="acp-chat-log" aria-live="polite"></div>' +
    '<div class="acp-chat-chips"><button type="button">What size am I?</button><button type="button">How much is delivery?</button><button type="button">How do returns work?</button></div>' +
    '<form class="acp-chat-form"><label class="sr-only" for="acp-chat-in">Your question</label><input id="acp-chat-in" maxlength="600" autocomplete="off" placeholder="Ask about sizes, delivery, returns…"><button type="submit" class="btn btn-accent">Send</button></form>' +
    '<a class="acp-chat-human" href="' + WA_LINK + '" target="_blank" rel="noopener">Talk to a person on WhatsApp →</a>';
  document.body.appendChild(launcher); document.body.appendChild(panel);
  var log = panel.querySelector('.acp-chat-log'), form = panel.querySelector('form'), input = panel.querySelector('input');
  var history = [], busy = false;
  function bubble(text, who) {
    var b = document.createElement('p'); b.className = 'acp-msg acp-msg-' + who;
    b.textContent = text; // text only, never HTML
    log.appendChild(b); log.scrollTop = log.scrollHeight; return b;
  }
  bubble('Hi, I’m the Acpanta assistant (AI). Ask me about sizes, delivery, returns or anything in the shop. For your order, message us on WhatsApp.', 'bot');
  function toggle(open) {
    panel.hidden = !open; launcher.setAttribute('aria-expanded', String(open)); launcher.hidden = open;
    if (open) input.focus(); else launcher.focus();
  }
  // Until the AI key is added in Netlify, the bubble simply opens WhatsApp (checked once per visit)
  var chatReady = null;
  try { chatReady = JSON.parse(sessionStorage.getItem('acpanta-chat-ready')); } catch (err) {}
  if (chatReady === null) fetch('/.netlify/functions/chat').then(function (r) { return r.json(); }).then(function (d) {
    chatReady = !!d.ready; try { sessionStorage.setItem('acpanta-chat-ready', String(chatReady)); } catch (err) {}
  }).catch(function () { chatReady = false; });
  launcher.addEventListener('click', function () {
    if (chatReady === false) { window.open(WA_LINK, '_blank', 'noopener'); return; }
    toggle(true);
  });
  panel.querySelector('.acp-chat-x').addEventListener('click', function () { toggle(false); });
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });
  function ask(q) {
    q = (q || '').trim().slice(0, 600);
    if (!q || busy) return;
    busy = true; input.value = '';
    panel.querySelector('.acp-chat-chips').hidden = true;
    bubble(q, 'me'); history.push({ role: 'user', content: q });
    if (history.length > 11) history = history.slice(-11); // keep it short; must start with the shopper
    var wait = bubble('Typing…', 'bot'); wait.classList.add('acp-typing');
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 25000);
    fetch('/.netlify/functions/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }), signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (d) {
        var text = d.reply || d.error || 'Sorry, something went wrong. Message us on WhatsApp.';
        wait.classList.remove('acp-typing'); wait.textContent = text;
        if (d.reply) history.push({ role: 'assistant', content: d.reply }); else history.pop();
      })
      .catch(function () { wait.classList.remove('acp-typing'); wait.textContent = 'Sorry, that took too long. Try again, or message us on WhatsApp.'; history.pop(); })
      .then(function () { clearTimeout(timer); busy = false; log.scrollTop = log.scrollHeight; input.focus(); });
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
  panel.querySelector('.acp-chat-chips').addEventListener('click', function (e) { if (e.target.tagName === 'BUTTON') ask(e.target.textContent); });
})();

// Track your order page: opens Royal Mail or Evri tracking (picked from the number's format), or asks us on WhatsApp
(function () {
  var form = document.getElementById('track-form');
  if (!form) return;
  var input = document.getElementById('track-number'), msg = document.getElementById('track-msg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = input.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (n.length < 8) { msg.textContent = 'Please enter the tracking number from your posting email.'; input.focus(); return; }
    // Royal Mail numbers look like AB123456789GB; anything else is an Evri number
    var rm = /^[A-Z]{2}\d{9}[A-Z]{2}$/.test(n);
    msg.textContent = 'Opening ' + (rm ? 'Royal Mail' : 'Evri') + ' tracking for ' + n + '…';
    window.open(rm ? 'https://www.royalmail.com/track-your-item#/tracking-results/' + encodeURIComponent(n)
      : 'https://www.evri.com/track/parcel/' + encodeURIComponent(n), '_blank', 'noopener');
  });
  var ask = document.getElementById('track-order'), wa = document.getElementById('track-wa');
  function setWa() {
    var t = 'Hi Acpanta, could you send me my tracking link?' + (ask.value.trim() ? ' My order: ' + ask.value.trim() : '');
    wa.href = 'https://wa.me/447448795690?text=' + encodeURIComponent(t);
  }
  ask.addEventListener('input', setWa); setWa();
  document.getElementById('track-ask').addEventListener('submit', function (e) { e.preventDefault(); wa.click(); });
})();

// Business details for Google on the home page (name, logo, social profiles, search box)
(function () {
  if (document.body.getAttribute('data-page') !== 'home') return;
  try {
    var ld = document.createElement('script'); ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify([
      { '@context': 'https://schema.org', '@type': 'Organization', name: 'Acpanta', url: 'https://acpanta.com/',
        logo: 'https://acpanta.com/logo.png', sameAs: ['https://www.instagram.com/acpanta9'],
        address: { '@type': 'PostalAddress', addressLocality: 'London', addressCountry: 'GB' } },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Acpanta', url: 'https://acpanta.com/',
        potentialAction: { '@type': 'SearchAction', target: 'https://acpanta.com/shop.html?q={search_term_string}', 'query-input': 'required name=search_term_string' } }
    ]);
    document.head.appendChild(ld);
  } catch (err) {}
})();
