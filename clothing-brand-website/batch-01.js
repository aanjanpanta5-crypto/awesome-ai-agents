/* Batch 01: one real product per "episode". Names and prices come from products.js. */
(function () {
  var list = document.getElementById('ep-list');
  if (!list) return;
  var byId = {};
  (window.ACPANTA_PRODUCTS || []).forEach(function (p) { byId[p.id] = p; });
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  var EPISODES = [
    { title: 'The Logo', id: 'logo-tee', c: 0, photo: 'images/logo-tee-black.jpg', alt: 'Model wearing the black Acpanta Logo Tee' },
    { title: 'Light Up', id: 'boxy-hoodie', c: 0, photo: 'images/boxy-hoodie-light-up.jpg', alt: 'Black boxy hoodie with the Light Up back print' },
    { title: 'Don’t Look Back', id: 'boxy-hoodie', c: 1, photo: 'images/boxy-hoodie-dont-look-back.jpg', alt: 'Black boxy hoodie with the Don’t Look Back back print' },
    { title: 'Under Leather', soon: true, photo: 'images/look-leather-1-a.png', alt: 'Black Acpanta logo tee under a leather jacket',
      line: 'Custom leather jackets, made to order. Coming soon.', href: 'customisation.html#leather', cta: 'Join the waitlist →' }
  ];

  list.innerHTML = EPISODES.map(function (e, i) {
    var p = byId[e.id];
    if (!e.soon && !p) return '';
    var webp = e.photo.replace(/\.(jpg|png)$/, '.webp');
    var name = e.soon ? 'Coming soon' : p.name + (p.variantLabel === 'Design' ? ' · ' + p.colors[e.c][0] : '');
    var line = e.soon ? e.line : p.spec;
    var href = e.soon ? e.href : 'product.html?id=' + encodeURIComponent(p.id) + (e.c ? '&c=' + e.c : '');
    var cta = e.soon ? e.cta : 'Shop this episode →';
    return '<article class="ep ep-reveal' + (i % 2 ? ' ep-flip' : '') + '" aria-labelledby="ep-' + i + '">' +
      '<picture class="ep-photo"><source srcset="' + esc(webp) + '" type="image/webp"><img src="' + esc(e.photo) + '" alt="' + esc(e.alt) + '"' +
      (i ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"') + '></picture>' +
      '<div class="ep-copy"><p class="ep-num mono">Episode ' + ('0' + (i + 1)).slice(-2) + '</p>' +
      '<h2 class="ep-name" id="ep-' + i + '">' + esc(e.title) + '</h2>' +
      '<p class="ep-piece">' + esc(name) + (e.soon ? '' : ' <span class="ep-price">£' + p.price + '</span>') + '</p>' +
      '<p class="ep-line">' + esc(line) + '</p>' +
      '<a class="ep-cta" href="' + esc(href) + '">' + cta + '</a></div></article>';
  }).join('');

  // Scenes fade in as they scroll into view
  var items = document.querySelectorAll('.ep-reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('ep-in'); io.unobserve(x.target); } });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else items.forEach(function (el) { el.classList.add('ep-in'); });

  // Title card: plays once per visit, tap to skip, skipped for reduced motion
  var intro = document.getElementById('ep-intro');
  var seen = false;
  try { seen = sessionStorage.getItem('acpanta-batch-intro') === '1'; sessionStorage.setItem('acpanta-batch-intro', '1'); } catch (err) {}
  if (!intro) return;
  if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { intro.remove(); return; }
  var done = function () { intro.classList.add('ep-intro-out'); setTimeout(function () { intro.remove(); }, 700); };
  intro.addEventListener('click', done);
  setTimeout(done, 2400);
})();
