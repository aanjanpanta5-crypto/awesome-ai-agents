# Hollin Workshop: clothing brand website

A single-file storefront for a small-batch workwear brand. "Hollin Workshop" is a placeholder name; change it in `index.html`.

Open `index.html` in a browser. It needs no build step or server.

## What's included

- Sticky header with a bag counter, plus an announcement bar
- Hero section with a garment-tag panel (run number, cloth, dye, care)
- Product grid of 8 items, with category filters, colour swatches and a size picker
- Slide-out shopping bag with quantities, subtotal and a free-shipping progress bar. The bag is saved in the browser's localStorage.
- "How it's made" section, a size guide with a cm/in toggle, and reviews
- Newsletter sign-up form with email validation
- Light and dark themes, and a responsive layout down to phone width

## Editing products

Products live in the `PRODUCTS` array in the `<script>` block: name, category, price, colours (name and hex), sizes and an optional badge.

## Before going live

Checkout and the newsletter form are front-end demos. To take real orders and collect sign-ups, connect a commerce platform (such as Shopify or Stripe Checkout) and an email service. Replace the illustrated garments with product photos, and replace the example reviews with real ones.
