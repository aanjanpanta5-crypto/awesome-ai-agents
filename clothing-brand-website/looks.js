/* Shop the look (The Acpanta world page): men wearing real Acpanta pieces.
   Prices, names, pictures and links come from products.js, so they're always right.
   To use real model photos later: put a head-to-toe PNG (transparent background, feet at the
   bottom edge) in images/ and set photo: 'images/your-photo.png' on a look below. */
(function () {
  var root = document.getElementById('looks');
  if (!root) return;
  var PRODUCTS = window.ACPANTA_PRODUCTS || [];
  var byId = {}; PRODUCTS.forEach(function (p) { byId[p.id] = p; });
  var ART = window.ACPANTA_ART;
  var money = window.ACPANTA_MONEY;

  // A look: name, figure (what the drawn man wears), pieces = [product id, colour/design index]
  // Only real photos are shown. To add a look: put the cut-out photo in images/ and add a line like
  // { name: 'All black', photo: 'images/look-all-black.png', pieces: [['logo-hoodie', 0], ['logo-tee', 0]] },
  // Custom leather jackets aren't on sale yet: shown with a waitlist link, never a price
  var LEATHER = { name: 'Custom leather jacket', note: 'Coming soon · made to order', href: 'customisation.html#leather' };
  var LOOKS = [
    // Each man in 4 shots (a full, b mirrored, c close-up, d mirrored close-up), mixed so the same man never repeats in a row
    { name: 'Black logo tee', photo: 'images/look-tee-a.png', pieces: [['logo-tee', 0]] },
    { name: 'Tee under leather', photo: 'images/look-leather-1-a.png', pieces: [['logo-tee', 0]], soon: LEATHER },
    { name: 'Quilted leather', photo: 'images/look-leather-2-a.png', pieces: [['logo-tee', 0]], soon: LEATHER },
    { name: 'Black logo tee · close', photo: 'images/look-tee-c.png', pieces: [['logo-tee', 0]] },
    { name: 'Tee under leather · close', photo: 'images/look-leather-1-c.png', pieces: [['logo-tee', 0]], soon: LEATHER },
    { name: 'Quilted leather · close', photo: 'images/look-leather-2-c.png', pieces: [['logo-tee', 0]], soon: LEATHER },
    { name: 'Black logo tee · turned', photo: 'images/look-tee-b.png', pieces: [['logo-tee', 0]] },
    { name: 'Tee under leather · turned', photo: 'images/look-leather-1-b.png', pieces: [['logo-tee', 0]], soon: LEATHER },
    { name: 'Quilted leather · turned', photo: 'images/look-leather-2-b.png', pieces: [['logo-tee', 0]], soon: LEATHER },
    { name: 'Black logo tee · detail', photo: 'images/look-tee-d.png', pieces: [['logo-tee', 0]] },
    { name: 'Tee under leather · detail', photo: 'images/look-leather-1-d.png', pieces: [['logo-tee', 0]], soon: LEATHER },
    { name: 'Quilted leather · detail', photo: 'images/look-leather-2-d.png', pieces: [['logo-tee', 0]], soon: LEATHER },
    { name: 'Pleasures hoodie', photo: 'images/pleasures-hoodie.jpg', pieces: [['pleasures-hoodie', 0]] },
    { name: 'Dice hoodie', photo: 'images/dice-hoodie.jpg', pieces: [['dice-hoodie', 0]] },
    { name: 'Take The Risk hoodie', photo: 'images/take-the-risk-hoodie.jpg', pieces: [['take-the-risk-hoodie', 0]] }
  ].filter(function (l) { return l.pieces.every(function (x) { return byId[x[0]]; }); });
  var N = LOOKS.length; if (!N) return;
  if (N < 2) root.classList.add('rs-single');

  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var f = function (c) { return Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt))); };
    return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  }
  // Drawn man, 200 x 600, head to toe, soft shading so it reads as a real figure
  function man(o, k) {
    var s = o.skin, c = o.color, d = shade(c, c > '#8' ? -.12 : .18), dd = shade(c, c > '#8' ? -.22 : .32), h = '#1a1411', id = 'g' + k;
    var defs = '<defs><linearGradient id="' + id + '" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient></defs>';
    var out = defs;
    // trousers + trainers
    out += '<path d="M74 300 L126 300 L130 548 L106 548 L100 360 L94 548 L70 548 Z" fill="#2a2b2f"/><path d="M84 320 L82 546 M116 320 L118 546" stroke="#222327" stroke-width="1.2"/>';
    out += '<path d="M66 546 Q66 540 72 540 L98 540 Q104 546 102 556 L64 556 Q62 550 66 546 Z M134 546 Q134 540 128 540 L102 540 Q96 546 98 556 L136 556 Q138 550 134 546 Z" fill="#f2f0eb"/><path d="M64 556 L102 556 M98 556 L136 556" stroke="#c9c6bf" stroke-width="3"/>';
    // neck + head
    out += '<rect x="93" y="74" width="14" height="30" rx="7" fill="' + shade(s, -.08) + '"/><ellipse cx="100" cy="52" rx="16" ry="26" fill="' + s + '"/>';
    out += '<path d="M87 66 Q100 86 113 66 Q111 80 100 82 Q89 80 87 66 Z" fill="' + shade(s, -.12) + '" opacity=".6"/>';
    var hair = {
      short: '<path d="M83 46 Q83 22 100 22 Q117 22 117 46 Q114 32 100 32 Q86 32 83 46 Z" fill="' + h + '"/>',
      fade: '<path d="M84 44 Q85 24 100 23 Q115 24 116 44 Q111 30 100 30 Q89 30 84 44 Z" fill="' + h + '"/><path d="M84 44 L84 56 M116 44 L116 56" stroke="' + h + '" stroke-width="3" opacity=".5"/>',
      textured: '<path d="M82 48 Q80 20 99 18 Q120 16 119 46 Q116 30 110 34 Q104 26 96 32 Q88 28 82 48 Z" fill="' + h + '"/>',
      buzz: '<path d="M85 42 Q86 24 100 24 Q114 24 115 42 Q109 32 100 32 Q91 32 85 42 Z" fill="' + h + '" opacity=".75"/>'
    }[o.hair] || '';
    out += hair;
    // arms (sleeves) + hands
    var long = o.top !== 'tee';
    out += '<path d="M68 112 Q56 170 56 214 Q56 256 60 ' + (long ? 292 : 150) + ' M132 112 Q144 170 144 214 Q144 256 140 ' + (long ? 292 : 150) + '" stroke="' + c + '" stroke-width="' + (o.top === 'boxy' ? 26 : 22) + '" fill="none" stroke-linecap="round"/>';
    if (!long) out += '<path d="M60 150 Q56 200 57 240 Q58 270 61 296 M140 150 Q144 200 143 240 Q142 270 139 296" stroke="' + s + '" stroke-width="12" fill="none" stroke-linecap="round"/>';
    out += '<circle cx="60" cy="300" r="8" fill="' + s + '"/><circle cx="140" cy="300" r="8" fill="' + s + '"/>';
    // body
    var w = o.top === 'boxy' ? 8 : 0;
    out += '<path d="M' + (66 - w) + ' 106 Q100 94 ' + (134 + w) + ' 106 L' + (130 + w) + ' 304 Q100 312 ' + (70 - w) + ' 304 Z" fill="' + c + '"/>';
    out += '<path d="M' + (66 - w) + ' 106 Q100 94 ' + (134 + w) + ' 106 L' + (130 + w) + ' 304 Q100 312 ' + (70 - w) + ' 304 Z" fill="url(#' + id + ')"/>';
    if (o.top === 'hoodie' || o.top === 'boxy' || o.top === 'zip') {
      out += '<path d="M80 104 Q100 124 120 104 Q118 92 100 92 Q82 92 80 104 Z" fill="' + d + '"/>';
      out += '<path d="M94 110 L92 150 M106 110 L108 150" stroke="' + dd + '" stroke-width="2" stroke-linecap="round"/>';
      if (o.top !== 'zip') out += '<path d="M78 236 L122 236 L128 280 L72 280 Z" fill="' + d + '" opacity=".75"/>';
    }
    if (o.top === 'zip') out += '<path d="M100 104 L100 304" stroke="' + dd + '" stroke-width="2.5"/><path d="M78 250 L92 250 M108 250 L122 250" stroke="' + d + '" stroke-width="2"/>';
    if (o.top === 'sweat' || o.top === 'tee') out += '<path d="M86 102 Q100 114 114 102" fill="none" stroke="' + dd + '" stroke-width="3"/>';
    out += '<path d="M' + (70 - w) + ' 296 Q100 304 ' + (130 + w) + ' 296" stroke="' + d + '" stroke-width="7" fill="none"/>';
    // prints
    var mark = c > '#8' ? '#141414' : '#f5f3ee';
    if (o.print === 'logo') out += '<text x="' + (o.top === 'zip' ? 114 : 100) + '" y="152" font-family="Georgia, serif" font-style="italic" font-size="13" fill="' + mark + '" text-anchor="middle">cAP</text>';
    if (o.print === 'red') out += '<rect x="84" y="138" width="32" height="32" fill="#e0102e"/><text x="100" y="159" font-family="Georgia, serif" font-style="italic" font-size="12" fill="#fff" text-anchor="middle">cAP</text>';
    out += '<ellipse cx="100" cy="560" rx="52" ry="5" fill="#000" opacity=".12"/>';
    // widen the build (real shoulder-to-height ratio); the head is drawn narrower to compensate
    return '<svg viewBox="0 0 200 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g transform="translate(100 0) scale(1.32 1) translate(-100 0)">' + out + '</g></svg>';
  }

  var esc = function (v) { return String(v).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); };
  var link = function (p) { return 'product.html?id=' + encodeURIComponent(p.id); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var $ = function (s) { return root.querySelector(s); };
  var track = $('.rs-track'), pill = $('.rs-pill'), list = $('.rs-list'), countEl = $('.rs-count'), cta = $('.rs-cta'),
      curEl = $('.rs-cur'), totEl = $('.rs-tot'), barEl = $('.rs-bar i'), stage = $('.rs-stage');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var active = 0, busy = false, timer = null, hover = false, offscreen = false, dragged = false;
  var mq = matchMedia('(max-width: 820px)');
  var LAYOUT = {
    desktop: { x: [80, 62, 46.5, 33.5, 22.5, 13.5], s: [1, .8, .66, .56, .48, .42], o: [1, 1, 1, .92, .7, .42], y: [0, 8, 14, 19, 23, 26], exit: { x: 106, s: 1.1, o: 0, y: 0 }, hide: { x: 6, s: .36, o: 0, y: 28 } },
    mobile: { x: [64, 38, 20, 7], s: [1, .7, .53, .43], o: [1, 1, .75, .4], y: [0, 6, 10, 13], exit: { x: 112, s: 1.1, o: 0, y: 0 }, hide: { x: -4, s: .34, o: 0, y: 14 } }
  };
  var L = function () { return mq.matches ? LAYOUT.mobile : LAYOUT.desktop; };

  var figs = LOOKS.map(function (look, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'rs-fig';
    b.setAttribute('aria-label', 'Look ' + (i + 1) + ': ' + look.name);
    if (look.photo) b.classList.add('rs-photo');
    if (/\.jpg$/.test(look.photo || '')) b.classList.add('rs-photo-card'); // product photos with a background, not cut-outs
    // Only the first 5 photos load at once; the rest load just before they slide into view (see paint)
    var a = i < 5 ? '' : 'data-';
    b.innerHTML = look.photo ? '<picture><source ' + a + 'srcset="' + esc(look.photo.replace(/\.(png|jpg)$/, '.webp')) + '" type="image/webp"><img ' + a + 'src="' + esc(look.photo) + '" alt="" draggable="false"' + (i ? ' decoding="async"' : ' fetchpriority="high"') + '></picture>' : man(look.fig, i);
    b.addEventListener('click', function () { if (!dragged) goTo(i); });
    track.appendChild(b); b._vis = null; return b;
  });
  function slot(v) {
    var l = L();
    if (v === 'exit' || v === 'hide') return { x: l[v].x, s: l[v].s, o: l[v].o, y: l[v].y, z: 1 };
    return { x: N < 2 ? 50 : l.x[v], s: l.s[v], o: l.o[v], y: l.y[v], z: 50 - v }; // a single look stands in the middle
  }
  function load(el) {
    var src = el.querySelector('source[data-srcset]'), img = el.querySelector('img[data-src]');
    if (src) { src.srcset = src.dataset.srcset; src.removeAttribute('data-srcset'); }
    if (img) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
  }
  function paint(el, v) {
    if (typeof v === 'number') load(el);
    var st = slot(v);
    el.style.left = st.x + '%'; el.style.transform = 'translate(-50%,' + (-st.y) + 'px) scale(' + st.s + ')';
    el.style.opacity = st.o; el.style.zIndex = st.z;
    el.classList.toggle('is-front', v === 0); el.classList.toggle('is-off', typeof v !== 'number');
    el.tabIndex = typeof v === 'number' && v !== 0 ? 0 : -1; el._vis = v;
  }
  function instantly(els, fn) { els.forEach(function (e) { e.style.transition = 'none'; }); fn(); void track.offsetWidth; els.forEach(function (e) { e.style.transition = ''; }); }
  function layout(instant) {
    var k = Math.max(0, Math.min(L().x.length - 1, N - 2));
    var plan = figs.map(function (el, i) {
      var d = (i - active + N) % N, cur = el._vis, target, jump = null;
      if (d <= k) target = d; else if (d === N - 1 && (cur === 0 || cur === 'exit')) target = 'exit'; else target = 'hide';
      if (!instant) { if (target === 0 && cur === 'hide') jump = 'exit'; else if (target !== 'exit' && target !== 0 && cur === 'exit') jump = 'hide'; }
      return { el: el, target: target, jump: jump };
    });
    if (instant) { instantly(figs, function () { plan.forEach(function (p) { paint(p.el, p.target); }); }); return; }
    var jumps = plan.filter(function (p) { return p.jump; });
    if (jumps.length) instantly(jumps.map(function (p) { return p.el; }), function () { jumps.forEach(function (p) { paint(p.el, p.jump); }); });
    plan.forEach(function (p) { paint(p.el, p.target); });
    load(figs[(active + k + 1) % N]); load(figs[(active - 1 + N) % N]); // the next ones in both directions
  }
  function renderPanel() {
    var look = LOOKS[active];
    pill.classList.remove('rs-in'); void pill.offsetWidth;
    pill.innerHTML = '<b>' + pad(active + 1) + '</b>' + esc(look.name); pill.classList.add('rs-in');
    var nPieces = look.pieces.length + (look.soon ? 1 : 0);
    countEl.textContent = nPieces + (nPieces === 1 ? ' piece' : ' pieces');
    var total = 0;
    // A piece that isn't on sale yet: no price, links to its waitlist
    var soonCard = look.soon ? '<article class="rs-card rs-soon" style="--i:' + look.pieces.length + '"><div class="rs-media"><a class="rs-media-link" href="' + esc(look.soon.href) + '" aria-label="' + esc(look.soon.name) + ', coming soon">' +
      '<span class="rs-soon-mark">Coming<br>soon</span></a></div>' +
      '<h4 class="rs-card-name"><a href="' + esc(look.soon.href) + '">' + esc(look.soon.name) + '</a></h4><p class="rs-card-desc">' + esc(look.soon.note) + '</p>' +
      '<p class="rs-card-price"><a href="' + esc(look.soon.href) + '">Join the waitlist →</a></p></article>' : '';
    list.innerHTML = look.pieces.map(function (x, j) {
      var p = byId[x[0]], col = p.colors[x[1]] || p.colors[0]; total += p.price;
      return '<article class="rs-card" style="--i:' + j + '"><div class="rs-media"><a class="rs-media-link" href="' + link(p) + '" aria-label="' + esc(p.name) + '">' + (ART ? ART(p, x[1]) : '') + '</a>' +
        '<a class="rs-add" href="' + link(p) + '" aria-label="Choose a size for the ' + esc(p.name) + '">+</a></div>' +
        '<h4 class="rs-card-name"><a href="' + link(p) + '">' + esc(p.name) + '</a></h4><p class="rs-card-desc">' + esc(col[0]) + ' · ' + esc(p.spec.split(' · ')[0]) + '</p>' +
        '<p class="rs-card-price">' + money(p.price) + '</p></article>';
    }).join('') + soonCard;
    list.scrollTop = 0; list.scrollLeft = 0;
    cta.href = link(byId[look.pieces[0][0]]);
    cta.textContent = 'Shop the look · ' + money(total);
    curEl.textContent = pad(active + 1); totEl.textContent = pad(N);
    barEl.style.width = ((active + 1) / N * 100) + '%';
  }
  function step(dir) { if (N < 2) return; active = (active + dir + N) % N; layout(false); renderPanel(); schedule(); }
  function goTo(i) {
    if (busy || i === active) return;
    var n = (i - active + N) % N; if (n === 1) { step(1); return; }
    busy = true; root.classList.add('rs-fast');
    (function run() { step(1); if (--n > 0) setTimeout(run, 230); else setTimeout(function () { root.classList.remove('rs-fast'); busy = false; }, 450); })();
  }
  function schedule() { clearTimeout(timer); if (reduce || N < 2 || hover || offscreen || document.hidden) return; timer = setTimeout(function () { step(1); }, 5000); }
  root.addEventListener('mouseenter', function () { hover = true; schedule(); });
  root.addEventListener('mouseleave', function () { hover = false; schedule(); });
  root.addEventListener('focusin', function () { hover = true; schedule(); });
  root.addEventListener('focusout', function () { hover = false; schedule(); });
  document.addEventListener('visibilitychange', schedule);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { offscreen = !e[0].isIntersecting; schedule(); }, { threshold: .25 }).observe(root);
  $('.rs-prev').addEventListener('click', function () { if (!busy) step(-1); });
  $('.rs-next').addEventListener('click', function () { if (!busy) step(1); });
  stage.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); if (!busy) step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); if (!busy) step(-1); }
  });
  var sx = null;
  stage.addEventListener('pointerdown', function (e) { if (e.target.closest('.rs-nav')) return; sx = e.clientX; });
  window.addEventListener('pointerup', function (e) {
    if (sx === null) return; var dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 40 && !busy) { dragged = true; step(dx > 0 ? 1 : -1); setTimeout(function () { dragged = false; }, 50); }
  });
  window.addEventListener('pointercancel', function () { sx = null; });
  var onMq = function () { layout(true); };
  if (mq.addEventListener) mq.addEventListener('change', onMq); else mq.addListener(onMq);
  layout(true); renderPanel(); schedule();
})();
