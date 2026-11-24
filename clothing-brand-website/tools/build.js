// Runs on every Netlify deploy (see netlify.toml): writes products.json for the
// product-preview edge function, and feed.xml for Google Shopping, from products.js.
const fs = require('fs');
const path = require('path');
const PRODUCTS = require('../products.js');

const slim = PRODUCTS.map((p) => ({
  id: p.id, name: p.name, cat: p.cat, price: p.price, spec: p.spec,
  digital: !!p.digital, photo: (p.colors.find((c) => c[2]) || [])[2] || null,
}));
fs.writeFileSync(path.join(__dirname, '..', 'products.json'), JSON.stringify(slim));
console.log(`products.json: ${slim.length} products`);
require('./make-feed.js');

// Writes a plain product list into the shop and home page grids, so search engines and
// readers without JavaScript see real names, prices and fabric weights. app.js replaces it
// with the full interactive cards as soon as the page runs.
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const money = (n) => `£${n % 1 ? n.toFixed(2) : n}`;
const staticCard = (p) => {
  const photo = (p.colors.find((c) => c[2]) || [])[2];
  const link = `product.html?id=${encodeURIComponent(p.id)}`;
  return `<article class="card static-card"><a href="${link}">${photo ? `<picture><source srcset="${esc(photo.replace(/\.jpg$/, '.webp'))}" type="image/webp"><img src="${esc(photo)}" alt="${esc(p.name)}" width="400" height="500" loading="lazy"></picture>` : ''}</a>` +
    `<div class="card-top"><h3><a href="${link}">${esc(p.name)}</a></h3><span class="price">${money(p.price)}</span></div><p class="spec">${esc(p.spec)}</p></article>`;
};
for (const file of ['shop.html', 'index.html']) {
  const f = path.join(__dirname, '..', file);
  let html = fs.readFileSync(f, 'utf8');
  const m = html.match(/<div class="grid" id="grid"([^>]*)>[\s\S]*?<\/div><!-- \/grid -->|<div class="grid" id="grid"([^>]*)><\/div>/);
  if (!m) { console.log(`${file}: no grid found`); continue; }
  const attrs = m[1] !== undefined ? m[1] : m[2];
  const feat = (attrs.match(/data-featured="([^"]*)"/) || [])[1];
  const list = feat ? feat.split(',').map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) : PRODUCTS.filter((p) => !p.digital);
  html = html.replace(m[0], `<div class="grid" id="grid"${attrs}>${list.map(staticCard).join('')}</div><!-- /grid -->`);
  fs.writeFileSync(f, html);
  console.log(`${file}: ${list.length} products written for readers without JavaScript`);
}

// Keeps the sitemap's product links in step with products.js
{
  const f = path.join(__dirname, '..', 'sitemap.xml');
  let xml = fs.readFileSync(f, 'utf8');
  const lines = PRODUCTS.filter((p) => !p.digital).map((p) => `  <url><loc>https://acpanta.com/product.html?id=${encodeURIComponent(p.id)}</loc></url>`).join('\n');
  xml = xml.replace(/^  <url><loc>https:\/\/acpanta\.com\/product\.html\?id=[^<]*<\/loc><\/url>\n/gm, '');
  xml = xml.replace('</urlset>', `${lines}\n</urlset>`);
  fs.writeFileSync(f, xml);
  console.log(`sitemap.xml: ${PRODUCTS.filter((p) => !p.digital).length} product links`);
}
