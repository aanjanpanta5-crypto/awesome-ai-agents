/* Acpanta product catalogue. Shared by the website (app.js) and the Stripe checkout function,
   so the price a customer pays always comes from this file, never from the browser.
   price: pounds (GBP). colors: [name, swatch hex, optional photo, photo description]. variantLabel: 'Colour' (default) or e.g. 'Design'. details: optional list shown under 'Details'. why: optional note explaining the price. model: optional fit note, e.g. 'Model is 6ft 1in and wears L'. stock: 0 marks the whole product sold out. soldOut: optional list of sold-out sizes, e.g. ['XL']. sizeStock: optional pieces left per size, e.g. { S: 4, M: 3, L: 6, XL: 0 } (shows 'M (3 left)' at 5 or fewer, 0 = sold out). stock: pieces in stock (update by hand as items sell).
   drop: optional label for pieces outside Batch 01 (e.g. 'New drop'); they don't count towards the 185. digital: true for gift cards (no delivery, no size). shape: drawing used for the product picture. print: 'logo' (small chest logo), 'graphic' (large front print) or none. */
(function (root) {
  var SIZES = ['S', 'M', 'L', 'XL'];
  var BW = [['Black', '#1c1c1c'], ['White', '#f3f3f1']];
  var PRODUCTS = [
    { id: 'logo-tee', name: 'Premium Logo Tee', cat: 'T-shirts', price: 12.99, shape: 'tee', print: 'logo', spec: 'Substantial weight · Structured drape · Acpanta logo', colors: [['Black', '#1c1c1c', 'images/logo-tee-black.jpg', 'Model wearing the black Acpanta Logo Tee'], ['White', '#f3f3f1']], sizes: SIZES, stock: 100, badge: 'New' },
    { id: 'printed-tee', name: 'Printed Tee', cat: 'T-shirts', price: 14.99, shape: 'tee', print: 'graphic', spec: 'Substantial weight · Printed front', colors: BW, sizes: SIZES, stock: 20 },
    { id: 'logo-hoodie', name: 'Heavyweight Logo Hoodie', cat: 'Hoodies', price: 29.99, shape: 'hood', print: 'logo', spec: 'Our heaviest weight · Dense, structured feel · Acpanta logo', colors: BW, sizes: SIZES, stock: 20 },
    { id: 'boxy-hoodie', name: 'Premium Boxy Hoodie', cat: 'Hoodies', price: 29.99, shape: 'boxy', spec: 'Dense heavyweight cotton · Boxy cut · Back print or plain', variantLabel: 'Design',
      colors: [
        ['Light Up', '#1c1c1c', 'images/boxy-hoodie-light-up.jpg', 'Black boxy hoodie with a large black-and-white back print of three faces lighting cigarettes'],
        ["Don't Look Back", '#1c1c1c', 'images/boxy-hoodie-dont-look-back.jpg', 'Black boxy hoodie with a skeleton hand and skull mirror back print and the words Don\'t Look Back'],
        ['Plain', '#1c1c1c']
      ],
      details: ['Heavyweight cotton', 'Boxy fit', 'Pre-shrunk and bio-washed', 'Heavy, but soft to wear', 'Burr-free finish', 'Colour-fast, so it resists fading', 'Black'],
      sizes: SIZES, stock: 20 },
    { id: 'pleasures-hoodie', name: 'Pleasures Hoodie', cat: 'Hoodies', price: 29.99, shape: 'boxy', spec: 'Dense heavyweight cotton · Boxy cut · Back print', variantLabel: 'Design', colors: [['Pleasures', '#1c1c1c', 'images/pleasures-hoodie.jpg', 'Black boxy hoodie with a black-and-white back print of a face peering through hands and the word Pleasures']], sizes: SIZES, stock: 20, badge: 'New', drop: 'New drop' },
    { id: 'dice-hoodie', name: 'Dice Hoodie', cat: 'Hoodies', price: 29.99, shape: 'boxy', spec: 'Dense heavyweight cotton · Boxy cut · Back print', variantLabel: 'Design', colors: [['Dice', '#1c1c1c', 'images/dice-hoodie.jpg', 'Black boxy hoodie with a back print of two dice and dripping script lettering']], sizes: SIZES, stock: 20, badge: 'New', drop: 'New drop' },
    { id: 'take-the-risk-hoodie', name: 'Take The Risk Hoodie', cat: 'Hoodies', price: 29.99, shape: 'boxy', spec: 'Dense heavyweight cotton · Boxy cut · Back print', variantLabel: 'Design', colors: [['Take The Risk', '#1c1c1c', 'images/take-the-risk-hoodie.jpg', 'Black boxy hoodie with a back print reading Take the risk or lose the chance, with dice and a red question mark']], sizes: SIZES, stock: 20, badge: 'New', drop: 'New drop' },
    { id: 'zip-hoodie', name: 'Zip Hoodie', cat: 'Hoodies', price: 29.99, shape: 'zip', print: 'logo', spec: 'Full zip · Acpanta logo print', colors: BW, sizes: SIZES, stock: 20 },
    { id: 'gift-card-25', name: 'Digital Gift Card £25', cat: 'Gift cards', price: 25, shape: 'gift', print: 'logo', digital: true, spec: 'Emailed within 1 working day · valid 12 months', colors: [['Black', '#1c1c1c']], sizes: ['Digital'] },
    { id: 'gift-card-50', name: 'Digital Gift Card £50', cat: 'Gift cards', price: 50, shape: 'gift', print: 'logo', digital: true, spec: 'Emailed within 1 working day · valid 12 months', colors: [['Black', '#1c1c1c']], sizes: ['Digital'] },
    { id: 'gift-card-100', name: 'Digital Gift Card £100', cat: 'Gift cards', price: 100, shape: 'gift', print: 'logo', digital: true, spec: 'Emailed within 1 working day · valid 12 months', colors: [['Black', '#1c1c1c']], sizes: ['Digital'] },
    { id: 'sweatshirt', name: 'Heavyweight Sweatshirt', cat: 'Sweatshirts', price: 15.99, shape: 'sweat', spec: 'Dense, substantial weight · Soft structured drape', colors: BW, sizes: SIZES, stock: 5 }
  ];
  // UK delivery: £3.99, free when the clothing in the order comes to £35 or more (before discount codes)
  PRODUCTS.DELIVERY = { fee: 3.99, freeOver: 35 };
  if (typeof module !== 'undefined' && module.exports) module.exports = PRODUCTS;
  else root.ACPANTA_PRODUCTS = PRODUCTS;
})(this);
