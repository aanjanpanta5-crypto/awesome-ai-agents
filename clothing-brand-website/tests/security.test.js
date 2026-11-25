// Security regression tests for the Acpanta site. Run with:  node --test tests/
// They call the checkout function directly with a pretend Stripe, so nothing real is charged or created.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

process.env.stripe = 'sk_test_dummy'; // never a real key
const PRODUCTS = require('../products.js');
const { handler } = require('../netlify/functions/create-checkout.js');

let sent = null; // what the function would send to Stripe
global.fetch = async (url, opts) => {
  sent = { url, params: new URLSearchParams(opts.body) };
  return { ok: true, json: async () => ({ url: 'https://checkout.stripe.com/test' }) };
};
const call = (items) => handler({ httpMethod: 'POST', headers: { host: 'acpanta.test' }, body: JSON.stringify({ items }) });
const ok = { id: 'logo-tee', color: 0, size: 'M', qty: 1 };

test('only POST is accepted', async () => {
  const r = await handler({ httpMethod: 'GET', headers: {} });
  assert.equal(r.statusCode, 405);
});

test('made-up product names are refused, never a crash (constructor, __proto__, toString)', async () => {
  for (const id of ['constructor', '__proto__', 'toString', 'hasOwnProperty', 'nope', 42, null]) {
    const r = await call([{ ...ok, id }]);
    assert.equal(r.statusCode, 400, `id ${String(id)}`);
    assert.ok(!/TypeError|undefined/.test(r.body), 'no internal error text');
  }
});

test('bad quantities are refused', async () => {
  for (const qty of [0, -1, 0.5, 'abc', null, NaN, 1e9]) {
    const r = await call([{ ...ok, qty }]);
    assert.equal(r.statusCode, 400, `qty ${qty}`);
  }
  assert.equal((await call([{ ...ok, qty: 21 }])).statusCode, 400, 'over 20 of one piece');
});

test('bad sizes and colours are refused', async () => {
  for (const size of ['XL', 'XXL', '__proto__', '', null]) assert.equal((await call([{ ...ok, size }])).statusCode, 400, `size ${size}`);
  for (const color of [-1, 99, 'constructor', null, 0.5]) assert.equal((await call([{ ...ok, color }])).statusCode, 400, `color ${color}`);
});

test('empty or malformed bags are refused', async () => {
  for (const items of [[], {}, 'x', null, Array(51).fill(ok)]) assert.equal((await call(items)).statusCode, 400);
  const r = await handler({ httpMethod: 'POST', headers: { host: 'x' }, body: 'not json' });
  assert.equal(r.statusCode, 400);
});

test('splitting a product across lines cannot beat the stock limit', async () => {
  const sweat = PRODUCTS.find((p) => p.id === 'sweatshirt'); // stock is small
  const lines = Array.from({ length: sweat.stock + 1 }, () => ({ id: 'sweatshirt', color: 0, size: 'S', qty: 1 }));
  assert.equal((await call(lines)).statusCode, 400);
});

test('the customer cannot set the price: it always comes from products.js', async () => {
  sent = null;
  const r = await call([{ ...ok, qty: 2, price: 0.01, unit_amount: 1, total: 0 }]);
  assert.equal(r.statusCode, 200);
  const logo = PRODUCTS.find((p) => p.id === 'logo-tee');
  assert.equal(sent.params.get('line_items[0][price_data][unit_amount]'), String(Math.round(logo.price * 100)));
  assert.equal(sent.params.get('line_items[0][price_data][currency]'), 'gbp');
});

test('delivery: shown fee below the free-delivery limit, free at or above it', async () => {
  const D = PRODUCTS.DELIVERY;
  sent = null; await call([ok]); // one tee, under the limit
  assert.equal(sent.params.get('shipping_options[0][shipping_rate_data][fixed_amount][amount]'), String(Math.round(D.fee * 100)));
  sent = null; await call([{ ...ok, qty: 3 }]); // three tees, over the limit
  assert.equal(sent.params.get('shipping_options[0][shipping_rate_data][fixed_amount][amount]'), '0');
});

test('checkout only ships to the UK and promises 3 to 6 working days', async () => {
  sent = null; await call([ok]);
  assert.equal(sent.params.get('shipping_address_collection[allowed_countries][0]'), 'GB');
  assert.equal(sent.params.get('shipping_address_collection[allowed_countries][1]'), null);
  assert.equal(sent.params.get('shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]'), '3');
  assert.equal(sent.params.get('shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]'), '6');
});

test('there is no XL anywhere in the product list', () => {
  for (const p of PRODUCTS) assert.ok(!p.sizes.includes('XL') && !p.sizes.includes('XXL'), p.id);
});

test('no secret keys are stored in the project files', () => {
  const skip = new Set(['node_modules', '.git', 'images', 'icons', 'brand', 'tests']);
  const pattern = /(sk_live_|rk_live_|sk_test_|whsec_|sk-ant-)[A-Za-z0-9]{20,}|BEGIN (RSA |EC )?PRIVATE KEY|AKIA[0-9A-Z]{16}/;
  const bad = [];
  (function walk(dir) {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skip.has(f.name)) continue;
      const p = path.join(dir, f.name);
      if (f.isDirectory()) walk(p);
      else if (/\.(js|html|css|json|md|toml|xml|txt|webmanifest)$/.test(f.name) && pattern.test(fs.readFileSync(p, 'utf8'))) bad.push(p);
    }
  })(path.join(__dirname, '..'));
  assert.deepEqual(bad, []);
});

test('security headers are set for every page', () => {
  const toml = fs.readFileSync(path.join(__dirname, '..', '..', 'netlify.toml'), 'utf8');
  for (const h of ['Content-Security-Policy', 'Strict-Transport-Security', 'X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy']) assert.ok(toml.includes(h), h);
  assert.ok(toml.includes("script-src 'self'"), 'scripts only from this site');
});

test('private build and code files are hidden from visitors', () => {
  const toml = fs.readFileSync(path.join(__dirname, '..', '..', 'netlify.toml'), 'utf8');
  for (const p of ['/tools/*', '/tests/*', '/package.json', '/package-lock.json', '/node_modules/*', '/netlify/*']) assert.ok(toml.includes(`from = "${p}"`), p);
});
