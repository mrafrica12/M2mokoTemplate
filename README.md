# M2MOKO — website prototype

A static, front-end prototype of the M2MOKO storefront, built from
[`master_prompt_m2moko.md`](master_prompt_m2moko.md). It is designed to be
reviewed with the client and then ported to Shopify.

## Run it

No build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, new arrivals, brand intro, categories, campaign, store, gallery, newsletter |
| `shop.html` | Shop All — filterable product grid (Sets / Shirts & Tops / Trousers) |
| `product.html` | Product detail template (Blue Relaxed Set) — gallery, options, accordions, related |
| `about.html` | About & craftsmanship — story scaffold with what the founder must provide |
| `visit.html` | The Zanzibar store — address, hours, map, fittings |
| `contact.html` | Contact details and a (non-wired) enquiry form |
| `policies.html` | Client care — shipping, returns, privacy, terms (draft placeholders) |
| `assets/css/site.css` | All styles (builds on `assets/css/brand.css` provisional palette) |
| `assets/js/site.js` | Shared header/footer injection, drawers, filters, accordions, reveal |

## Design direction

The Row's calm + Saint Laurent's editorial confidence + NET-A-PORTER's
shopping clarity + M2MOKO's Zanzibar warmth. Warm cream/paper palette, near-black
(not pure black), restrained coral accent, Fraunces display serif + Inter sans,
generous spacing, slow reveals, reduced-motion respected, keyboard-focus visible.

## What is real vs. placeholder

**Used as fact (verified in research):** brand name, "Made in Zanzibar / worldwide
shipping", store address & plus code, phone `+255 745 366 282`, public email,
Instagram, Facebook, Google Maps link, listed services (in-store shopping,
pickup, delivery).

**Proposed creative copy (client to approve):** hero lines, "Zanzibar-made,
relaxed, expressive", section headings.

**Placeholder — must not go live as-is:**

- All product names are descriptive, from photography only. No prices, SKUs,
  currency, colours, sizes, materials, fit, stock or lead times are asserted.
  Every product shows "Price on request" and an **Enquire** action instead of
  add-to-cart.
- Founder story, brand-name meaning, design process, team — shown as an
  explicit "to be provided" list on `about.html`.
- Opening hours — all "To be confirmed" on `visit.html`.
- WhatsApp — **not** presented as active; the public phone is not labelled as
  WhatsApp per the master prompt.
- Shipping, returns, privacy, terms — draft checklists on `policies.html`.
- Contact and newsletter forms are not connected to anything.

## Known limitations

- Imagery is 480–512 px wide (from public Instagram). Fine for review, too small
  for full-bleed production. Request high-resolution originals and confirm
  image/model/photographer usage rights before any commercial use.
- The product page reuses the single available angle for its gallery.
- `visit.html` embeds an OpenStreetMap map and also links out to Google Maps.

## Porting to Shopify

- `assets/js/site.js` `NAV`, `CONTACT`, header and footer become theme
  sections / `snippets` + `settings_schema.json`.
- `.card` markup maps to `card-product`; `product.html` maps to
  `sections/main-product.liquid` (gallery, variant pickers, `<details>` blocks).
- `shop.html` filter chips map to Shopify collection filtering / `collection.liquid`.
- Replace "Enquire" CTAs with real add-to-cart once catalogue + pricing land.
- Move policy content into Shopify's policy pages; add real payment gateway only
  after business country / bank / currency are confirmed.

See `master_prompt_m2moko.md` → "Launch blockers" for the full list the client
must provide before launch.
