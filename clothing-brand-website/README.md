# Acpanta website

The website for Acpanta (acpanta.com): a clothing storefront with T-shirts, tops, outerwear, trousers and accessories. It's plain HTML, CSS and JavaScript, with no build step.

## Pages

| File | Page |
|---|---|
| `index.html` | Home: hero, new and bestsellers, T-shirt range, reviews, run alerts sign-up |
| `shop.html` | Every product, with category filters. `shop.html#t-shirts` opens on T-shirts |
| `about.html` | Our story: how the clothes are made, and reviews |
| `size-guide.html` | Size chart in centimetres and inches |
| `contact.html` | Instagram, WhatsApp and email, plus the sign-up form |

Shared files:

- `styles.css`: all styling, including colours (the `:root` block at the top) and the dark theme
- `app.js`: products, shopping bag, filters, size chart and sign-up form
- `logo.svg`: the Acpanta logo as a vector (sharp at any size); `logo.png` is a fallback

The header, footer and bag panel are repeated in each HTML page. If you change one, change it in all five.

## Editing products

Products live in the `PRODUCTS` list near the top of `app.js`: name, category, price, colours (name and hex), sizes and an optional badge such as "New". The home page's featured products are set by `data-featured` on the grid in `index.html`.

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Publishing on GitHub Pages

The workflow `.github/workflows/deploy-acpanta-site.yml` publishes this folder whenever it changes on `main`.

1. In the repository, go to **Settings > Pages** and set **Source** to **GitHub Actions** (one time only).
2. Merge this folder into `main`. The site goes live at `https://aanjanpanta5-crypto.github.io/awesome-ai-agents/`.
3. To use acpanta.com, buy the domain, then in **Settings > Pages > Custom domain** enter `acpanta.com` and save. At your domain provider, add these DNS records:
   - Four `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One `CNAME` record for `www`: `aanjanpanta5-crypto.github.io`

   When the domain check passes, tick **Enforce HTTPS**.

## Before taking real orders

Checkout and the sign-up form are front-end demos. To take payments, connect a commerce platform such as Shopify or Stripe Checkout. To collect sign-ups, connect an email service. Replace the drawn garments with product photos, and the example reviews with real ones.
