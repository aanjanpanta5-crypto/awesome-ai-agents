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
