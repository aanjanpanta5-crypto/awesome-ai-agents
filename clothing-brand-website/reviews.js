/* Acpanta customer reviews.
   ONLY add reviews from real customers. Before marking one verified: true, find their
   order in the Stripe Dashboard (Payments) and check the name and product match.
   Never write reviews yourself or for someone else: UK law (DMCC Act 2024) bans fake
   or unverified reviews presented as genuine.

   Example (copy, then fill in from a real customer):
   { name: 'Sam T.', product: 'Premium Boxy Hoodie', rating: 5, date: '2026-12-01',
     text: 'What the customer actually wrote.', verified: true }

   name:     first name and initial only (keeps customers' privacy)
   rating:   1 to 5
   date:     the date they sent it, YYYY-MM-DD
   verified: true only after you've matched it to a real order */
(function (root) {
  var REVIEWS = [
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = REVIEWS;
  else root.ACPANTA_REVIEWS = REVIEWS;
})(this);
