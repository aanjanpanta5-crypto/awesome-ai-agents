# Acpanta website

The website for Acpanta (acpanta.com): a clothing shop with T-shirts, tops, outerwear, trousers and accessories. Customers fill a bag and pay with Stripe. It's plain HTML, CSS and JavaScript, plus one small server function for checkout.

## Pages

| File | Page |
|---|---|
| `index.html` | Home: hero, new in, customer reviews, choose your weight, Instagram follow box, stats |
| `shop.html` | Every product, with category filters. `shop.html#t-shirts` opens on T-shirts |
| `about.html` | Our story |
| `size-guide.html` | Size chart in centimetres and inches |
| `contact.html` | Instagram, WhatsApp and email |
| `returns.html` | Shipping and returns policy (14 days to cancel) |
| `privacy.html` | Privacy policy |
| `terms.html` | Terms and conditions |
| `thank-you.html` | Shown after a successful payment; empties the bag |
| `404.html` | Shown when a page doesn't exist |

Also: `og-image.jpg` (the picture shown when the site is shared on WhatsApp, Instagram and elsewhere), `robots.txt` and `sitemap.xml` (help Google find the pages; they assume the site lives at https://acpanta.com).

The standalone `stats-section.html` and `rotating-hero.html` demos live in `extras/` at the repository root, so they aren't published with the shop.

The policy pages are a starting draft for a UK sole trader. Fill in any highlighted `[...]` detail and have them checked before taking orders.

Shared files:

- `reviews.js`: real customer reviews shown on the home page (see below)
- `products.js`: **the product list and prices.** Both the website and the checkout use it, so a customer always pays the price in this file.
- `app.js`: shopping bag, filters, search, zoom, size chart, stats and checkout button
- `styles.css`: all styling, including the red and white colours (the `:root` block at the top)
- `logo.svg`: the Acpanta logo as a vector; `logo.png` is a fallback
- `netlify/functions/create-checkout.js`: creates the Stripe payment page for the bag

The header, footer and bag panel are repeated in each HTML page. If you change one, change it in every page.

## Editing products

Edit `products.js`: name, category, price in pounds, colours (name and hex), sizes, `stock` and an optional badge such as "New".

`stock` is the number of pieces you have. Update it by hand as items sell. Products with 20 or fewer show "Limited · N pieces", and 5 or fewer show "Only N left". Checkout refuses a quantity larger than the stock number. The home page's featured products are set by `data-featured` on the grid in `index.html`.

## Adding customer reviews

Reviews live in `reviews.js` and show in the Customer reviews section on the home page, with the average star rating worked out automatically.

1. A customer sends you a review on WhatsApp or Instagram with their order number.
2. Find that order in the Stripe Dashboard (**Payments**) and check the name and product match.
3. Add it to `reviews.js` with `verified: true`, using their first name and initial only.

Only add reviews from real customers. Writing your own, or showing unverified reviews as genuine, is illegal in the UK (Digital Markets, Competition and Consumers Act 2024). Until there's at least one review, the section says so honestly and asks buyers to send theirs.

## How checkout works

1. The customer presses **Checkout** in the bag.
2. The browser sends the bag (product, colour, size, quantity) to `/.netlify/functions/create-checkout`.
3. The function checks every item against `products.js`, takes the prices from there, and asks Stripe for a Checkout page in GBP with free UK delivery and UK addresses only.
4. The customer pays on Stripe's secure page, then lands on `thank-you.html`.

You'll see each order, with the customer's delivery address and phone number, in the Stripe Dashboard under **Payments**.

## Going live on Netlify

The site is hosted on Netlify (free plan) because checkout needs a server function. `netlify.toml` in the repository root holds the settings.

1. Sign up at netlify.com with your GitHub account.
2. **Add new site > Import an existing project > GitHub**, and pick `awesome-ai-agents`. Netlify reads `netlify.toml`, so leave the build settings as they are. Set the branch to deploy (for example `main`, after merging).
3. Add your Stripe key: **Site configuration > Environment variables > Add a variable**. Name: `STRIPE_SECRET_KEY`. Value: your secret key from Stripe (**Developers > API keys**). Never put this key in the code or share it in chat.
   - Start with your **test** key (`sk_test_...`) and pay with Stripe's test card `4242 4242 4242 4242`, any future date and any CVC.
   - When everything works, replace it with your **live** key (`sk_live_...`) and redeploy.
   - Safer option: create a **restricted key** in Stripe with write access to Checkout Sessions only, and use that instead.
4. In Stripe, turn on receipts: **Settings > Customer emails > Successful payments**.
5. To use acpanta.com: **Domain management > Add a domain** in Netlify, then follow its DNS instructions at the company you bought the domain from.

Until `STRIPE_SECRET_KEY` is set, the Checkout button tells customers that payments aren't switched on yet and to message you on WhatsApp.

## Preview locally

Run `python3 -m http.server` in this folder and visit http://localhost:8000. Checkout needs Netlify; to test it locally, install the Netlify CLI and run `netlify dev` from the repository root.

## Before taking real orders

- Replace the drawn garments with product photos.
- Replace the sample size chart measurements (in `app.js`, `SIZE_TABLES`) with the real ones.
