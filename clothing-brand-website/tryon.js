/* Acpanta "Try it on me": a quick size helper on the product page.
   Four questions (sizes usually bought, height and weight, build, fit), then the piece's own photo
   (or the shop drawing) and a size from Acpanta's own size guide (FIT_CHEST in app.js).
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

  /* ---------- the piece itself: its real photo, or the shop drawing if it has no photo yet ---------- */
  function picture() {
    var html = window.ACPANTA_ART ? window.ACPANTA_ART(prod, prod.sel || 0) : '';
    return html.replace('loading="lazy"', 'loading="eager"');
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
      body.innerHTML = steps() + '<p class="to-q">Which sizes do you usually buy?</p>' +
        choices('figure', [['men', 'Menswear'], ['women', 'Womenswear']]) + '<p class="to-help">Our pieces are unisex. This only fine-tunes the size estimate.</p>' + next(!!profile.figure);
    } else if (step === 1) {
      body.innerHTML = steps() + '<p class="to-q">Your height and weight</p>' +
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
      body.innerHTML = '<div class="to-rh"><button type="button" class="to-link" data-act="edit">Change my answers</button><span>' + profile.height + ' cm · ' + profile.weight + ' kg</span></div>' +
        '<div class="to-res"><div class="to-stage' + (col[2] ? ' has-photo' : '') + '">' + picture() + '</div><div>' +
        '<p class="to-piece"><b>' + esc(prod.name) + '</b><span>' + esc(col[0]) + ' · ' + SHOP.money(prod.price) + '</span></p>' +
        '<p class="to-rt">Recommended size: ' + r.size + '</p>' +
        SIZES.map(function (sz) {
          var out = SHOP.soldOut(prod.id, sz);
          return '<button type="button" class="to-opt' + (sz === r.size ? ' rec' : '') + '" aria-pressed="' + (sz === sel) + '" data-size="' + sz + '"' + (out ? ' disabled' : '') + '><span>' + sz + '</span><small>' + (out ? 'Sold out' : fitLabel(sz, r.size)) + '</small></button>';
        }).join('') + '</div></div>' +
        '<p class="to-basis">' + (c.exact ? 'Based on your ' + c.cm + ' cm chest and our size guide.' : 'An estimate from your height and weight. Add your chest measurement for an exact match.') + (r.note ? ' ' + r.note : '') + '</p>' +
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
    }
    save();
  });
})();
