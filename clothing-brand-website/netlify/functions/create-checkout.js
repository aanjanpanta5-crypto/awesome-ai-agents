// Creates a Stripe Checkout page for the items in the customer's bag.
// Prices always come from products.js on the server, never from the browser.
// Needs the STRIPE_SECRET_KEY environment variable, set in Netlify (never in this code).
const PRODUCTS = require('../../products.js');

const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
const MAX_LINES = 50;
const MAX_QTY = 20;

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Use POST.' });

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return json(503, { error: 'Payments are not switched on yet. Please message us on WhatsApp to order.' });

  let items;
  try {
    items = JSON.parse(event.body || '{}').items;
  } catch {
    return json(400, { error: 'Your bag could not be read. Please refresh and try again.' });
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINES) {
    return json(400, { error: 'Your bag is empty.' });
  }

  const params = new URLSearchParams();
  let i = 0;
  for (const item of items) {
    const p = byId[item && item.id];
    const color = p && p.colors[item.color];
    const qty = Number(item && item.qty);
    if (!p || !color || !p.sizes.includes(item.size) || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      return json(400, { error: 'Something in your bag is no longer available. Please remove it and try again.' });
    }
    const base = `line_items[${i}]`;
    params.append(`${base}[quantity]`, String(qty));
    params.append(`${base}[price_data][currency]`, 'gbp');
    params.append(`${base}[price_data][unit_amount]`, String(Math.round(p.price * 100)));
    params.append(`${base}[price_data][product_data][name]`, `${p.name} (${color[0]}, ${item.size})`);
    params.append(`${base}[price_data][product_data][metadata][product_id]`, p.id);
    i += 1;
  }

  const site = (process.env.URL || `https://${event.headers.host}`).replace(/\/$/, '');
  params.append('mode', 'payment');
  params.append('success_url', `${site}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`);
  params.append('cancel_url', `${site}/shop.html`);
  params.append('shipping_address_collection[allowed_countries][0]', 'GB');
  params.append('phone_number_collection[enabled]', 'true');
  params.append('shipping_options[0][shipping_rate_data][type]', 'fixed_amount');
  params.append('shipping_options[0][shipping_rate_data][display_name]', 'Free UK delivery');
  params.append('shipping_options[0][shipping_rate_data][fixed_amount][amount]', '0');
  params.append('shipping_options[0][shipping_rate_data][fixed_amount][currency]', 'gbp');
  params.append('shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]', 'business_day');
  params.append('shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]', '2');
  params.append('shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]', 'business_day');
  params.append('shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]', '4');
  params.append('custom_text[submit][message]', 'Free UK delivery. 14 days to return. See acpanta.com/returns.html');

  let res;
  try {
    res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
  } catch (err) {
    console.error('Stripe request failed', err);
    return json(502, { error: 'We couldn’t reach the payment service. Please try again.' });
  }
  const session = await res.json();
  if (!res.ok) {
    console.error('Stripe error', session.error && session.error.message);
    return json(502, { error: 'We couldn’t start checkout. Please try again, or message us on WhatsApp.' });
  }
  return json(200, { url: session.url });
};
