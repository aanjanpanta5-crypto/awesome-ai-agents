// Acpanta assistant: answers shop questions (sizes, delivery, returns, prices) with Claude.
// Facts come from products.js, so prices and delivery never drift from the shop.
// Needs ANTHROPIC_API_KEY in Netlify (never in this code). Without it the chat politely
// points people to WhatsApp instead.
const AnthropicSDK = require('@anthropic-ai/sdk');
const Anthropic = AnthropicSDK.default || AnthropicSDK;
const PRODUCTS = require('../../products.js');

const MAX_TURNS = 12;
const MAX_CHARS = 600;
const WHATSAPP = 'https://wa.me/447448795690';
const HANDOFF = `Sorry, I can't help with that one here. Message us on WhatsApp (${WHATSAPP}) and Anjan will reply.`;

const money = (n) => `£${n % 1 ? n.toFixed(2) : n}`;
const D = PRODUCTS.DELIVERY;

// Size guide: flat garment measurements in cm. Keep in sync with SIZE_TABLES / FIT_CHEST in app.js.
const SIZE_GUIDE = `T-shirts (chest across / length / sleeve): S 53/71/22, M 56/73/23, L 59/75/24, XL 62/77/25.
Hoodies and sweatshirts (chest across / length / sleeve): S 58/70/60, M 61/72/61, L 64/74/62, XL 67/76/63.
Body chest each size fits: S 91-96 cm, M 99-104 cm, L 107-112 cm, XL 114-119 cm.`;

const catalogue = PRODUCTS.map((p) => {
  const variants = p.colors.map((c) => c[0]).join(', ');
  const stock = p.stock === 0 ? 'sold out' : typeof p.stock === 'number' ? `${p.stock} in stock` : 'available';
  const soldOut = (p.soldOut || []).length ? `; sold out in ${p.soldOut.join(', ')}` : '';
  return `- ${p.name} (${p.cat}${p.drop ? `, ${p.drop}, not part of Batch 01` : ''}): ${money(p.price)}. ${p.spec}. ${p.variantLabel || 'Colours'}: ${variants}. Sizes: ${p.sizes.join(', ')}. ${stock}${soldOut}. Link: https://acpanta.com/product.html?id=${p.id}`;
}).join('\n');

const SYSTEM = `You are the Acpanta assistant, an AI helper on acpanta.com, the online shop of Acpanta, a small London clothing brand run by Anjan Panta (sole trader). You answer shoppers' questions in short, friendly British English: two to four sentences, plain text, no markdown headings.

What you can answer, using only the facts below:
- products, prices, colours, sizes and stock
- which size to choose (ask for their chest measurement if needed and use the size guide)
- delivery, returns, discount codes, and how ordering works

Rules:
- Only use the facts below. If something isn't covered (fabric details not listed, restock dates, custom orders, anything unclear), say you're not sure and point them to WhatsApp ${WHATSAPP}.
- You cannot see orders, payments or tracking. For "where is my order" questions, point them to https://acpanta.com/track.html or WhatsApp. Never invent order status, tracking numbers or delivery dates for a specific order.
- Never promise refunds, exchanges, discounts or stock beyond what is written here. Never make up a discount code.
- Never ask for or accept card details, passwords or full addresses. Payment only happens on Stripe's secure checkout.
- If asked, say plainly that you are an AI assistant and that a person (Anjan) answers on WhatsApp.
- Stay on Acpanta topics. Politely decline anything else.

Shop facts:
Products (prices in GBP):
${catalogue}

Delivery: Great Britain only (England, Scotland, Wales), tracked with Royal Mail or Evri. No delivery to Northern Ireland, the Channel Islands or the Isle of Man yet. ${money(D.fee)}, free when the clothing in the order comes to ${money(D.freeOver)} or more before discount codes (so 3 tees, or a hoodie plus a tee, get free delivery). Orders are packed by hand in London and dispatched within 1-2 working days; delivery takes 2-4 working days after posting. A tracking link is emailed when the order is posted.
Returns: under UK law customers have 14 days from receiving the order to cancel for a full refund or a size exchange, no reason needed. Items must be unworn, unwashed, with tags and packaging, and sent back within 14 days of telling us. Return postage is paid by the customer unless the item is faulty or wrong. When a whole order is cancelled, the standard delivery charge is refunded too. Refunds are paid within 14 days of getting the items back. Orders not yet posted can be cancelled for a full refund. Lost or damaged parcels are replaced or refunded. Faulty, damaged or wrong items: contact us with the order number and a photo; within 30 days of delivery we refund or replace and cover the postage. Full details: https://acpanta.com/returns.html
Discount: WELCOME10 gives 10% off a first order to people who join the email/WhatsApp list on the website. Once per customer, can't be combined with another code.
Gift cards: not sold at the moment.
Size guide (https://acpanta.com/size-guide.html):
${SIZE_GUIDE}
Batch 01 is a limited first batch of 185 pieces. Custom leather jackets are coming soon (waitlist on https://acpanta.com/customisation.html#leather); they can't be ordered yet.
Complaints: by email or WhatsApp; Anjan replies within 2 working days. Prices include VAT.
Payment: card, Apple Pay and Google Pay through Stripe checkout.
Contact: WhatsApp ${WHATSAPP} (+44 7448 795690) or email aanjan.panta5@gmail.com.`;

// Best-effort limit per warm function instance: 20 messages per 10 minutes per IP
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 20;
}

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

function cleanMessages(input) {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_TURNS) return null;
  const out = [];
  for (let i = 0; i < input.length; i++) {
    const m = input[i];
    const role = i % 2 === 0 ? 'user' : 'assistant'; // must alternate, starting with the shopper
    if (!m || m.role !== role || typeof m.content !== 'string') return null;
    const text = m.content.trim();
    if (!text || text.length > (role === 'user' ? MAX_CHARS : 2000)) return null;
    out.push({ role, content: text });
  }
  return out[out.length - 1].role === 'user' ? out : null;
}

exports.handler = async (event) => {
  // GET tells the website whether the assistant is switched on (the key is set), without revealing anything else
  if (event.httpMethod === 'GET') return json(200, { ready: !!process.env.ANTHROPIC_API_KEY });
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (err) { return json(400, { error: 'Bad request' }); }
  const messages = cleanMessages(body.messages);
  if (!messages) return json(400, { error: 'Please keep messages short and try again.' });

  const ip = (event.headers && (event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'])) || 'unknown';
  if (limited(ip)) return json(429, { error: `You've sent a lot of messages. Please message us on WhatsApp: ${WHATSAPP}` });

  if (!process.env.ANTHROPIC_API_KEY) return json(503, { error: `The assistant isn't available right now. Message us on WhatsApp: ${WHATSAPP}` });

  try {
    const client = exports._client || new Anthropic({ timeout: 20000, maxRetries: 1 });
    const response = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 1024,
      output_config: { effort: 'low' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default', // if a reply is declined, Anthropic retries it on a fallback model
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
      messages,
    });
    if (response.stop_reason === 'refusal') return json(200, { reply: HANDOFF });
    const reply = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
    return json(200, { reply: reply || HANDOFF });
  } catch (err) {
    console.error('Chat error', err && err.status, err && err.name);
    return json(502, { error: `The assistant couldn't answer just now. Message us on WhatsApp: ${WHATSAPP}` });
  }
};

exports._system = SYSTEM; // for tests
