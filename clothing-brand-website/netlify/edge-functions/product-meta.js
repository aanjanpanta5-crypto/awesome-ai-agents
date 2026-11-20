// Gives every product link its own title, description and picture when shared
// (WhatsApp, iMessage, Instagram, Google), because those apps don't run the page's JavaScript.
// Product data comes from products.json, made from products.js on every deploy.
let cache = null;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function setMeta(html, attr, key, value) {
  const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*">`);
  const tag = `<meta ${attr}="${key}" content="${esc(value)}">`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `${tag}\n</head>`);
}

export default async (request, context) => {
  const response = await context.next();
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id || !(response.headers.get('content-type') || '').includes('text/html')) return response;

  try {
    if (!cache) {
      const r = await fetch(new URL('/products.json', url.origin));
      if (!r.ok) return response;
      cache = await r.json();
    }
    const p = cache.find((x) => x.id === id);
    if (!p) return response;

    const site = 'https://acpanta.com';
    const link = `${site}/product.html?id=${encodeURIComponent(p.id)}`;
    const price = `£${Number(p.price) % 1 ? Number(p.price).toFixed(2) : p.price}`;
    const title = p.name.includes('£') ? `${p.name} · Acpanta` : `${p.name} · ${price} · Acpanta`;
    const desc = p.digital
      ? `${p.name} from Acpanta. Emailed within 1 working day, valid for 12 months.`
      : `${p.name} by Acpanta, London. ${p.spec}. ${price}, free UK delivery over £40 and 14-day returns.`;
    const image = p.photo ? `${site}/${p.photo.replace('.jpg', '-large.jpg')}` : `${site}/og-image.jpg`;

    let html = await response.text();
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
    html = setMeta(html, 'name', 'description', desc);
    html = setMeta(html, 'property', 'og:type', 'product');
    html = setMeta(html, 'property', 'og:title', title);
    html = setMeta(html, 'property', 'og:description', desc);
    html = setMeta(html, 'property', 'og:url', link);
    html = setMeta(html, 'property', 'og:image', image);
    html = setMeta(html, 'name', 'twitter:title', title);
    html = setMeta(html, 'name', 'twitter:description', desc);
    html = setMeta(html, 'name', 'twitter:image', image);
    if (p.photo) html = html.replace(/<meta property="og:image:(width|height)" content="[^"]*">\n?/g, '');
    if (!html.includes('rel="canonical"')) html = html.replace('</head>', `<link rel="canonical" href="${esc(link)}">\n</head>`);
    // Start loading the main photo straight away instead of waiting for app.js to draw the page
    if (p.photo && !url.searchParams.get('c')) html = html.replace('</head>', `<link rel="preload" as="image" href="/${esc(p.photo.replace(/\.jpg$/, '.webp'))}" type="image/webp" fetchpriority="high">\n</head>`);

    const headers = new Headers(response.headers);
    headers.delete('content-length');
    return new Response(html, { status: response.status, headers });
  } catch (err) {
    return response;
  }
};

export const config = { path: '/product.html' };
