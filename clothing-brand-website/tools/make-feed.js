// Builds feed.xml for Google Merchant Center (free Shopping listings) from products.js.
// Run after changing products.js:  node tools/make-feed.js
// Google needs a real photo for every listing, so only colours/designs with a photo are included.
// Add photos to products.js and run this again to list the rest.
const fs = require('fs');
const path = require('path');
const PRODUCTS = require('../products.js');

const SITE = 'https://acpanta.com';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const items = [];
const skipped = [];
for (const p of PRODUCTS) {
  if (p.digital) continue;
  const productType = 'Clothing > ' + p.cat;
  const description = [p.spec].concat(p.details || []).join('. ') + '. Free UK delivery over £35, 14-day returns.';
  p.colors.forEach((c, ci) => {
    if (!c[2]) { skipped.push(`${p.name} (${c[0]})`); return; }
    const colour = p.variantLabel === 'Design' ? 'Black' : c[0];
    const title = p.name + (p.colors.length > 1 ? ' – ' + c[0] : '');
    for (const size of p.sizes) {
      const soldOut = p.stock === 0 || (p.soldOut || []).includes(size) || (p.sizeStock && p.sizeStock[size] === 0);
      items.push(`    <item>
      <g:id>${esc(`${p.id}-${slug(c[0])}-${size}`)}</g:id>
      <g:item_group_id>${esc(p.id)}</g:item_group_id>
      <g:title>${esc(title)}</g:title>
      <g:description>${esc(description)}</g:description>
      <g:link>${SITE}/product.html?id=${esc(p.id)}</g:link>
      <g:image_link>${SITE}/${esc(c[2])}</g:image_link>
      <g:availability>${soldOut ? 'out_of_stock' : 'in_stock'}</g:availability>
      <g:price>${p.price.toFixed(2)} GBP</g:price>
      <g:condition>new</g:condition>
      <g:brand>Acpanta</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>1604</g:google_product_category>
      <g:product_type>${esc(productType)}</g:product_type>
      <g:gender>unisex</g:gender>
      <g:age_group>adult</g:age_group>
      <g:color>${esc(colour)}</g:color>
      <g:size>${esc(size)}</g:size>
      <g:size_system>UK</g:size_system>
      <g:shipping><g:country>GB</g:country><g:service>UK tracked delivery</g:service><g:price>${p.price >= PRODUCTS.DELIVERY.freeOver ? '0.00' : PRODUCTS.DELIVERY.fee.toFixed(2)} GBP</g:price></g:shipping>
    </item>`);
    }
  });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Acpanta</title>
    <link>${SITE}</link>
    <description>Acpanta heavyweight tees and hoodies, made in small batches and posted from London.</description>
${items.join('\n')}
  </channel>
</rss>
`;
fs.writeFileSync(path.join(__dirname, '..', 'feed.xml'), xml);
console.log(`feed.xml: ${items.length} listings`);
if (skipped.length) console.log('Not listed yet (no photo): ' + skipped.join(', '));
