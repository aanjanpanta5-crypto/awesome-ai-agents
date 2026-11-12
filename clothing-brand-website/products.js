/* Acpanta product catalogue. Shared by the website (app.js) and the Stripe checkout function,
   so the price a customer pays always comes from this file, never from the browser.
   price is in pounds (GBP). colors: [name, swatch hex]. */
(function (root) {
  var PRODUCTS = [
    { id: 'tee', name: 'Loopwheel Tee', cat: 'T-shirts', price: 58, shape: 'tee', spec: '300 gsm loopwheel cotton · boxy fit', colors: [['Indigo', '#2b3a67'], ['Bone', '#e3ddcf'], ['Moss', '#5b6b47']], sizes: ['S','M','L','XL','XXL'], badge: 'Run 07' },
    { id: 'pocket', name: 'Pocket Tee', cat: 'T-shirts', price: 48, shape: 'tee', spec: '240 gsm combed cotton · chest pocket', colors: [['White', '#efece4'], ['Black', '#26262a'], ['Sage', '#8a9a7b']], sizes: ['S','M','L','XL','XXL'], badge: 'New' },
    { id: 'heavy', name: 'Heavyweight Tee', cat: 'T-shirts', price: 54, shape: 'tee', spec: '320 gsm garment-dyed · relaxed fit', colors: [['Washed Black', '#3a3a3f'], ['Clay', '#a0674b'], ['Stone', '#b8b2a3']], sizes: ['S','M','L','XL','XXL'] },
    { id: 'ringer', name: 'Ringer Tee', cat: 'T-shirts', price: 46, shape: 'tee', spec: '200 gsm jersey · contrast trims', colors: [['Ecru', '#e3dccb'], ['Heather', '#a7aab0']], sizes: ['S','M','L','XL'] },
    { id: 'henley', name: 'Henley Tee', cat: 'T-shirts', price: 58, shape: 'tee', spec: '260 gsm slub · three-button placket', colors: [['Navy', '#1f2742'], ['Oat', '#d4c6a8']], sizes: ['S','M','L','XL','XXL'] },
    { id: 'raglan', name: 'Raglan Tee', cat: 'T-shirts', price: 52, shape: 'tee', spec: '220 gsm cotton · raglan sleeves', colors: [['Grey', '#9a9ea6'], ['Forest', '#2f4a3a']], sizes: ['S','M','L','XL'] },
    { id: 'slub', name: 'Slub Jersey Tee', cat: 'T-shirts', price: 44, shape: 'tee', spec: '180 gsm slub jersey · lightweight', colors: [['Sky', '#9fb6d1'], ['White', '#efece4'], ['Rust', '#9c4f2e']], sizes: ['S','M','L','XL','XXL'] },
    { id: 'stripe', name: 'Striped Tee', cat: 'T-shirts', price: 62, shape: 'tee', spec: '280 gsm yarn-dyed stripe · boat neck', colors: [['Navy Stripe', '#2b3a67'], ['Red Stripe', '#a8373a']], sizes: ['S','M','L','XL'] },
    { id: 'mock', name: 'Mock Neck Tee', cat: 'T-shirts', price: 56, shape: 'tee', spec: '260 gsm interlock · ribbed mock neck', colors: [['Black', '#26262a'], ['Bone', '#e3ddcf']], sizes: ['S','M','L','XL'] },
    { id: 'longsleeve', name: 'Long Sleeve Tee', cat: 'T-shirts', price: 64, shape: 'tee', spec: '260 gsm cotton · ribbed cuffs', colors: [['Olive', '#5c5f3a'], ['Indigo', '#2b3a67'], ['Ecru', '#e3dccb']], sizes: ['S','M','L','XL','XXL'] },
    { id: 'graphic', name: 'Acpanta Logo Tee', cat: 'T-shirts', price: 50, shape: 'tee', spec: '240 gsm cotton · screen-printed logo', colors: [['White', '#efece4'], ['Indigo', '#24325a'], ['Burgundy', '#6e1a20']], sizes: ['S','M','L','XL','XXL'], badge: 'Bestseller' },
    { id: 'hood', name: 'Mill Hoodie', cat: 'Tops', price: 128, shape: 'hood', spec: '480 gsm brushed fleece · flat-lock seams', colors: [['Heather', '#8b8f96'], ['Indigo', '#2b3a67']], sizes: ['S','M','L','XL'] },
    { id: 'chore', name: 'Chore Coat', cat: 'Outerwear', price: 245, shape: 'jacket', spec: '12 oz cotton duck · garment-dyed', colors: [['Indigo', '#24325a'], ['Tobacco', '#7a5532'], ['Ecru', '#d9cfb6']], sizes: ['S','M','L','XL'], badge: 'Low stock' },
    { id: 'over', name: 'Twill Overshirt', cat: 'Outerwear', price: 165, shape: 'shirt', spec: '9 oz brushed twill · horn buttons', colors: [['Olive', '#5c5f3a'], ['Navy', '#1f2742']], sizes: ['S','M','L','XL','XXL'] },
    { id: 'denim', name: 'Selvedge Work Pant', cat: 'Trousers', price: 195, shape: 'pant', spec: '14 oz rope-dyed selvedge · straight leg', colors: [['Raw', '#1c2647'], ['Rinsed', '#3c5285']], sizes: ['28','30','32','34','36'] },
    { id: 'fatigue', name: 'Fatigue Trouser', cat: 'Trousers', price: 150, shape: 'pant', spec: '10 oz back-sateen · tapered', colors: [['Khaki', '#a8966b'], ['Black', '#26262a']], sizes: ['28','30','32','34','36'] },
    { id: 'shirt', name: 'Oxford Work Shirt', cat: 'Tops', price: 110, shape: 'shirt', spec: '5 oz oxford · chainstitched hem', colors: [['Chambray', '#7f97bd'], ['White', '#efece4']], sizes: ['S','M','L','XL'] },
    { id: 'cap', name: 'Six-Panel Cap', cat: 'Accessories', price: 42, shape: 'cap', spec: 'Leftover duck from the coat run', colors: [['Indigo', '#24325a'], ['Tobacco', '#7a5532']], sizes: ['One size'] }
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = PRODUCTS;
  else root.ACPANTA_PRODUCTS = PRODUCTS;
})(this);
