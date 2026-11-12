/* Acpanta product catalogue. Shared by the website (app.js) and the Stripe checkout function,
   so the price a customer pays always comes from this file, never from the browser.
   price: pounds (GBP). colors: [name, swatch hex]. stock: pieces in stock (update by hand as items sell).
   shape: drawing used for the product picture. print: 'logo' (small chest logo), 'graphic' (large front print) or none. */
(function (root) {
  var SIZES = ['S', 'M', 'L'];
  var BW = [['Black', '#1c1c1c'], ['White', '#f3f3f1']];
  var PRODUCTS = [
    { id: 'logo-tee', name: 'Premium Logo Tee', cat: 'T-shirts', price: 22, shape: 'tee', print: 'logo', spec: '260 GSM heavyweight · Acpanta logo print', colors: BW, sizes: SIZES, stock: 100, badge: 'New' },
    { id: 'printed-tee', name: 'Printed Tee', cat: 'T-shirts', price: 24, shape: 'tee', print: 'graphic', spec: 'Premium heavyweight · printed front', colors: BW, sizes: SIZES, stock: 20 },
    { id: 'logo-hoodie', name: 'Heavyweight Logo Hoodie', cat: 'Hoodies', price: 42, shape: 'hood', print: 'logo', spec: '430 GSM heavyweight · Acpanta logo print', colors: BW, sizes: SIZES, stock: 20 },
    { id: 'boxy-hoodie', name: 'Premium Boxy Hoodie', cat: 'Hoodies', price: 50, shape: 'boxy', spec: '400 GSM premium · boxy fit', colors: BW, sizes: SIZES, stock: 20 },
    { id: 'zip-hoodie', name: 'Zip Hoodie', cat: 'Hoodies', price: 40, shape: 'zip', print: 'logo', spec: 'Full zip · Acpanta logo print', colors: BW, sizes: SIZES, stock: 20 },
    { id: 'sweatshirt', name: 'Heavyweight Sweatshirt', cat: 'Sweatshirts', price: 35, shape: 'sweat', spec: '320 GSM heavyweight', colors: BW, sizes: SIZES, stock: 5 }
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = PRODUCTS;
  else root.ACPANTA_PRODUCTS = PRODUCTS;
})(this);
