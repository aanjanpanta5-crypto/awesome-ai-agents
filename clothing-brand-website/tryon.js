/* Acpanta "Try it on me": a quick size helper on the product page.
   Four questions (figure, height and weight, build, fit), then a simple drawn avatar wearing the
   piece in its chosen colour, and a size from Acpanta's own size guide (FIT_CHEST in app.js).
   If the shopper gives their chest measurement, that decides the size, exactly like Find my size.
   Without it, height and weight give an estimate, and the sheet says so plainly.
   Answers stay in this browser only (localStorage), never sent anywhere. */
(function () {
  'use strict';
  var SHOP = window.ACPANTA_SHOP;
  if (!SHOP) return;

  var SIZES = ['S', 'M', 'L'];
  var KEY = 'acpanta-tryon';
  var profile = { figure: null, height: 175, weight: 72, chest: '', shape: null, fit: null };
  try { var s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && typeof s === 'object') Object.keys(profile).forEach(function (k) { if (k in s) profile[k] = s[k]; }); } catch (e) {}
  // Reuse a chest size already entered in Find my size
  try { var c = JSON.parse(localStorage.getItem('acpanta-chest') || 'null'); if (c && c.v && !profile.chest) profile.chest = Math.round(c.unit === 'in' ? c.v * 2.54 : c.v); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(profile)); } catch (e) {} }

  var prod = null, step = 0, picked = null, opener = null;
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------- the sheet ---------- */
  var scrim = document.createElement('div'); scrim.className = 'to-scrim'; scrim.hidden = true;
  var sheet = document.createElement('div'); sheet.className = 'to-sheet'; sheet.hidden = true;
  sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-labelledby', 'to-title');
  sheet.innerHTML = '<div class="to-top"><button type="button" class="to-icon" data-act="back" aria-label="Back">' +
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M15 6l-6 6 6 6"/></svg></button>' +
    '<h2 id="to-title">Try it on me</h2><button type="button" class="to-icon" data-act="close" aria-label="Close">' +
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
    '<div class="to-body" aria-live="polite"></div>';
  document.body.appendChild(scrim); document.body.appendChild(sheet);
  var body = sheet.querySelector('.to-body'), back = sheet.querySelector('[data-act="back"]');

  /* ---------- drawn avatar (a guide, not a photo) ---------- */
  function avatar(p, piece, sizeStep, width) {
    var bmi = p.weight / Math.pow(p.height / 100, 2);
    var k = clamp((bmi - 15) / 9, 0.78, 1.45);
    if (p.shape === 'slim') k *= 0.92; if (p.shape === 'broad') k *= 1.08;
    var f = p.figure === 'women';
    var sh = (f ? 17 : 20) * k, wa = (f ? 11 : 15) * k, hp = (f ? 17 : 15) * k;
    var sc = 0.86 + (p.height - 150) / 300, y = function (v) { return 18 + (v - 18) * sc; };
    var Y = { sh: y(34), wa: y(78), hip: y(92), foot: y(186) }, cx = 50, skin = '#d7b9a0', legs = '#3a3a3a', arm = Y.hip - Y.sh;
    var o = '<ellipse cx="50" cy="' + (Y.foot + 2) + '" rx="26" ry="4" fill="#0000001a"/>' +
      '<ellipse cx="50" cy="' + y(14) + '" rx="9" ry="11" fill="' + skin + '"/>' +
      '<rect x="46" y="' + y(23) + '" width="8" height="' + (Y.sh - y(23)) + '" fill="' + skin + '"/>' +
      '<path d="M' + (cx - sh) + ' ' + Y.sh + 'Q50 ' + (Y.sh - 6) + ' ' + (cx + sh) + ' ' + Y.sh + 'L' + (cx + wa) + ' ' + Y.wa + 'L' + (cx + hp) + ' ' + Y.hip + 'L' + (cx - hp) + ' ' + Y.hip + 'L' + (cx - wa) + ' ' + Y.wa + 'Z" fill="' + skin + '"/>' +
      '<path d="M' + (cx - sh) + ' ' + Y.sh + 'l' + (-6 * k) + ' ' + (arm + 6) + 'l5 1l' + (5 * k) + ' ' + (-(arm - 4)) + 'Z M' + (cx + sh) + ' ' + Y.sh + 'l' + (6 * k) + ' ' + (arm + 6) + 'l-5 1l' + (-5 * k) + ' ' + (-(arm - 4)) + 'Z" fill="' + skin + '"/>' +
      '<path d="M' + (cx - hp) + ' ' + Y.hip + 'L' + (cx - hp * 0.75) + ' ' + Y.foot + 'L47 ' + Y.foot + 'L49 ' + (Y.hip + 8) + 'L51 ' + (Y.hip + 8) + 'L53 ' + Y.foot + 'L' + (cx + hp * 0.75) + ' ' + Y.foot + 'L' + (cx + hp) + ' ' + Y.hip + 'Z" fill="' + legs + '"/>';
    if (piece) {
      var col = piece.color, e = 1 + sizeStep * 0.07, boxy = piece.shape !== 'tee';
      var s2 = sh * e + 1.5 + (boxy ? 2 : 0), w2 = wa * e + 2 + (boxy ? 3 : 0), h2 = hp * e + 1.5 + (boxy ? 2 : 0);
      var len = Y.hip + 6 + sizeStep * 3 + (boxy ? 2 : 0);
      var sl = piece.shape === 'tee' ? 20 + sizeStep * 2 : arm + 6 + sizeStep * 2;
      var line = col.toLowerCase() === '#f3f3f1' ? '#00000030' : '#ffffff30';
      o += '<path d="M' + (cx - s2) + ' ' + (Y.sh - 1) + 'l' + (-7 * k * e) + ' ' + sl + 'l7 1l' + (5 * k) + ' ' + (-(sl - 4)) + 'Z M' + (cx + s2) + ' ' + (Y.sh - 1) + 'l' + (7 * k * e) + ' ' + sl + 'l-7 1l' + (-5 * k) + ' ' + (-(sl - 4)) + 'Z" fill="' + col + '" stroke="' + line + '" stroke-width=".6"/>' +
        '<path d="M' + (cx - s2) + ' ' + (Y.sh - 1) + 'Q50 ' + (Y.sh - 7) + ' ' + (cx + s2) + ' ' + (Y.sh - 1) + 'L' + (cx + w2) + ' ' + Y.wa + 'L' + (cx + h2) + ' ' + len + 'L' + (cx - h2) + ' ' + len + 'L' + (cx - w2) + ' ' + Y.wa + 'Z" fill="' + col + '" stroke="' + line + '" stroke-width=".6"/>';
      if (piece.shape !== 'tee') o += '<path d="M' + (cx - 9) + ' ' + (Y.sh - 2) + 'Q50 ' + (Y.sh - 14) + ' ' + (cx + 9) + ' ' + (Y.sh - 2) + '" fill="none" stroke="' + line + '" stroke-width="1.2"/>';
      if (piece.shape === 'zip') o += '<path d="M50 ' + (Y.sh - 3) + 'V' + len + '" stroke="' + line + '" stroke-width="1"/>';
      if (piece.shape === 'hood' || piece.shape === 'boxy' || piece.shape === 'zip') o += '<path d="M' + (cx - 12) + ' ' + (Y.wa + 4) + 'H' + (cx + 12) + 'V' + (Y.wa + 16) + 'H' + (cx - 12) + 'Z" fill="none" stroke="' + line + '" stroke-width=".8"/>';
    }
    return '<svg width="' + width + '" viewBox="0 0 100 ' + (Y.foot + 8) + '" role="img" aria-label="A simple drawing of a figure your height and build' + (piece ? ', wearing the ' + esc(prod.name) : '') + '">' + o + '</svg>';
  }

  /* ---------- size, from Acpanta's own guide ---------- */
  function chestUsed() {
    var known = parseFloat(profile.chest);
    if (known >= 60 && known <= 160) return { cm: known, exact: true };
    // Estimate only: a rough guide from height and weight
    var est = 30 + 0.6 * profile.weight + 0.14 * profile.height;
    if (profile.figure === 'women') est -= 6;
    if (profile.shape === 'slim') est -= 3;
    if (profile.shape === 'broad') est += 4;
    return { cm: Math.round(est), exact: false };
  }
  function recommend() {
    var ch = chestUsed().cm, F = SHOP.fitChest, boxy = prod.cat !== 'T-shirts';
    if (profile.fit === 'relaxed') ch += 3;
    if (profile.fit === 'fitted') ch -= 2;
    var best = 'S', diff = Infinity;
    SIZES.forEach(function (sz) { var mid = (F[sz][0] + F[sz][1]) / 2, d = Math.abs(mid - ch); if (d < diff) { diff = d; best = sz; } });
    var note = '';
    if (ch < F.S[0] - 3) note = 'S is our smallest size and will be loose on you.';
    else if (ch > F.L[1] + 3) note = 'L is our largest size and may be snug. Message us on WhatsApp and we\'ll help.';
    else if (boxy && profile.fit === 'fitted') note = 'Our hoodies and sweatshirts are cut boxy, so this size sits closer than the full boxy look.';
    return { size: best, note: note };
  }
  function fitLabel(sz, rec) {
    var d = SIZES.indexOf(sz) - SIZES.indexOf(rec);
    return d === 0 ? 'Recommended' : d < 0 ? 'Closer fit' : 'Roomier fit';
  }

  /* ---------- screens ---------- */
  var done = function () { return profile.figure && profile.shape && profile.fit; };
  function steps() {
    var h = '<ol class="to-steps" aria-label="Step ' + (step + 1) + ' of 4">';
    for (var i = 0; i < 4; i++) h += '<li class="' + (i <= step ? 'on' : '') + '">' + (i + 1) + '</li>';
    return h + '</ol>';
  }
  function choices(key, list) {
    return '<div class="to-choices">' + list.map(function (c) {
      return '<button type="button" class="to-choice" aria-pressed="' + (profile[key] === c[0]) + '" data-k="' + key + '" data-v="' + c[0] + '"><span>' + c[1] + '</span><small>' + (c[2] || '') + '</small></button>';
    }).join('') + '</div>';
  }
  var next = function (ok) { return '<button type="button" class="btn btn-accent to-main" data-act="next"' + (ok ? '' : ' disabled') + '>Continue</button><p class="to-priv">Your answers stay on this device.</p>'; };

  function render() {
    back.style.visibility = step === 0 ? 'hidden' : 'visible';
    if (step === 0) {
      body.innerHTML = steps() + '<p class="to-q">Which figure should the avatar have?</p>' +
        choices('figure', [['men', 'Men\'s figure'], ['women', 'Women\'s figure']]) + '<p class="to-help">Our pieces are unisex. This only changes the drawing and the estimate.</p>' + next(!!profile.figure);
    } else if (step === 1) {
      body.innerHTML = steps() + '<p class="to-q">Your height and weight</p><div class="to-fig">' + avatar(profile, null, 0, 64) + '</div>' +
        '<label class="to-field"><span class="to-fh">Height <output data-out="height">' + profile.height + ' cm</output></span><input type="range" min="140" max="210" value="' + profile.height + '" data-in="height"></label>' +
        '<label class="to-field"><span class="to-fh">Weight <output data-out="weight">' + profile.weight + ' kg</output></span><input type="range" min="40" max="150" value="' + profile.weight + '" data-in="weight"></label>' +
        '<label class="to-field to-chest"><span class="to-fh">Chest, if you know it <small>optional, most accurate</small></span><span class="to-chest-row"><input type="number" inputmode="decimal" min="60" max="160" step="1" placeholder="e.g. 100" value="' + esc(profile.chest) + '" data-in="chest"><span>cm</span></span></label>' +
        next(true);
    } else if (step === 2) {
      body.innerHTML = steps() + '<p class="to-q">How would you describe your build?</p>' +
        choices('shape', [['slim', 'Slim', 'Narrow shoulders and chest'], ['average', 'Average', 'Balanced'], ['broad', 'Broad', 'Wide shoulders and chest']]) + next(!!profile.shape);
    } else if (step === 3) {
      body.innerHTML = steps() + '<p class="to-q">How do you like your clothes to fit?</p>' +
        choices('fit', [['fitted', 'Closer', 'Nearer the body'], ['regular', 'Regular', 'True to size'], ['relaxed', 'Relaxed', 'Room to move']]) + next(!!profile.fit);
    } else {
      var r = recommend(), sel = picked || r.size, c = chestUsed(), col = prod.colors[prod.sel] || prod.colors[0];
      var piece = { color: col[1], shape: prod.shape };
      body.innerHTML = '<div class="to-rh"><button type="button" class="to-link" data-act="edit">Change my answers</button><span>' + profile.height + ' cm · ' + profile.weight + ' kg</span></div>' +
        '<div class="to-res"><div class="to-stage">' + avatar(profile, piece, SIZES.indexOf(sel) - SIZES.indexOf(r.size), 150) + '</div><div>' +
        '<p class="to-piece"><b>' + esc(prod.name) + '</b><span>' + esc(col[0]) + ' · ' + SHOP.money(prod.price) + '</span></p>' +
        '<p class="to-rt">Recommended size: ' + r.size + '</p>' +
        SIZES.map(function (sz) {
          var out = SHOP.soldOut(prod.id, sz);
          return '<button type="button" class="to-opt' + (sz === r.size ? ' rec' : '') + '" aria-pressed="' + (sz === sel) + '" data-size="' + sz + '"' + (out ? ' disabled' : '') + '><span>' + sz + '</span><small>' + (out ? 'Sold out' : fitLabel(sz, r.size)) + '</small></button>';
        }).join('') + '</div></div>' +
        '<p class="to-basis">' + (c.exact ? 'Based on your ' + c.cm + ' cm chest and our size guide.' : 'An estimate from your height and weight. Add your chest measurement for an exact match.') + (r.note ? ' ' + r.note : '') + '</p>' +
        '<p class="to-help">The drawing is a guide to fit, not a photo.</p>' +
        '<button type="button" class="btn btn-accent to-main" data-act="add"' + (SHOP.soldOut(prod.id, sel) ? ' disabled' : '') + '>Add to bag · size ' + sel + '</button>';
    }
  }

  function open(id, from) {
    prod = SHOP.product(id); if (!prod) return;
    opener = from; picked = null; step = done() ? 4 : 0;
    scrim.hidden = false; sheet.hidden = false;
    requestAnimationFrame(function () { scrim.classList.add('open'); sheet.classList.add('open'); });
    document.documentElement.classList.add('to-lock');
    render();
    sheet.querySelector('[data-act="close"]').focus();
  }
  function close() {
    scrim.classList.remove('open'); sheet.classList.remove('open');
    document.documentElement.classList.remove('to-lock');
    setTimeout(function () { scrim.hidden = true; sheet.hidden = true; }, 200);
    if (opener) opener.focus();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-tryon]');
    if (!b) return;
    var card = b.closest('[data-id]'); if (card) open(card.dataset.id, b);
  });
  scrim.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (sheet.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { // keep focus inside the sheet
      var f = [].filter.call(sheet.querySelectorAll('button:not([disabled]),input'), function (x) { return x.offsetParent; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  sheet.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t || t.disabled) return;
    var act = t.dataset.act;
    if (t.dataset.k) { profile[t.dataset.k] = t.dataset.v; save(); render(); }
    else if (t.dataset.size) { picked = t.dataset.size; render(); }
    else if (act === 'close') close();
    else if (act === 'back') { step = step === 4 ? 3 : Math.max(0, step - 1); render(); }
    else if (act === 'next') { step++; save(); render(); }
    else if (act === 'edit') { step = 1; render(); }
    else if (act === 'add') { var sz = picked || recommend().size; close(); SHOP.add(prod.id, prod.sel || 0, sz); }
  });
  sheet.addEventListener('input', function (e) {
    var key = e.target.dataset.in; if (!key) return;
    profile[key] = key === 'chest' ? e.target.value : +e.target.value;
    if (key !== 'chest') {
      sheet.querySelector('[data-out="' + key + '"]').textContent = profile[key] + (key === 'height' ? ' cm' : ' kg');
      sheet.querySelector('.to-fig').innerHTML = avatar(profile, null, 0, 64);
    }
    save();
  });
})();
