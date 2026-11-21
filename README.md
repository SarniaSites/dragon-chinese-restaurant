# Dragon Chinese Restaurant — website

Single-page site for Dragon Chinese Restaurant, Southside, St Sampsons, Guernsey. Plain HTML + Tailwind CSS v3 (compiled and committed) + a small vanilla JS file. No frameworks, no runtime CDNs.

## Folder layout

```
index.html              the whole site, sections split by comment banners (header, hero, menu, eat in & takeaway, restaurant, testimonials, find us, footer)
thanks.html             shown after the form is sent (FormSubmit _next)
404.html                page-not-found
assets/css/styles.css   compiled Tailwind — don't edit by hand, run npm run build
assets/js/main.js       header, mobile menu, scroll reveals, menu tabs, lightbox, form validation
assets/fonts/           self-hosted Playfair Display + Figtree (woff2) and their OFL licences
images/brand/           logo.svg, logo-light.svg (footer), logo-plate.svg (menu-cover style), mark.svg (icon)
images/work/            photos — each as name.webp (large) + name-sm.webp (~800px)
images/                 favicons, og-image.jpg (1200×630 share card), site.webmanifest
src/input.css           Tailwind source: @font-face, components, keyframes
tailwind.config.js      brand colours, fonts, animations
sitemap.xml, robots.txt
_fb-pack/               the Facebook research pack (not published — underscore folder)
_shots/                 screenshots for the team (not published)
```

## Brand

| Name | Hex | Used for |
|---|---|---|
| fascia (navy) | `#1f2b5e` | Headings, primary buttons, testimonials band, footer. From the shopfront sign / logo navy (`#283769`). |
| lantern (red) | `#c23a2f` | Call buttons, accents, chilli marker. From the dining-room lanterns and the menu headings. |
| gold | `#d9b56a` | Logo plate, small accents on navy only. From the "DRAGON" plate on the menu cover. |
| paper (cream) | `#f7f0e4` / `#fcf9f3` | Page backgrounds. From the logo cream (`#e5d9ca`) and the menu card. |
| leaf | `#3f7d4a` | Vegetarian marker. |

Fonts: **Playfair Display** (headings — close to the lettering on their printed menu) and **Figtree** (body). Both OFL, self-hosted.

Logo: the Facebook profile picture is a photo of the shopfront, so there was no logo file. The wordmark was **redrawn as SVG** from the "DRAGON / CHINESE RESTAURANT" plate on the May 2026 printed menu (Playfair Display Black, converted to outlines).

## Editing

- **Text**: edit `index.html` directly.
- **Colours**: `tailwind.config.js`, then `npm install && npm run build`.
- **Menu**: each menu section is a `<div class="menu-panel">` with a matching `<button class="menu-tab">`. Each dish is one line:
  `<li class="dish"><span class="dish-no">46</span><span class="dish-name">Chicken with Satay Sauce …flags…</span><span class="dish-lead"></span><span class="dish-price">£6.80</span></li>`
  Flags: copy the chilli (`#f-chilli`), leaf (`#f-leaf`) or nut (`#f-nut`) `<svg class="flag …">` from another dish. Prices were transcribed from the May 2026 menu (`_fb-pack/images/img-001.jpg`, `img-002.jpg`) — **check them against the current menu with the client**. When the printed menu changes, also replace `images/work/menu-outside.webp` / `menu-inside.webp` (shown by "View the printed menu").
- **Adding a photo**: export `name.webp` (~1600px wide) and `name-sm.webp` (~800px), put them in `images/work/`, and copy one of the `<a class="tile …" data-lightbox="gallery">` blocks in the "THE RESTAURANT" section (set width/height to the image's real size, write alt text and `data-caption`).
- **Before & after**: not used (not relevant to a restaurant).

## Going live — checklist

SarniaSites charges a one-time fee and the client owns everything.

- [ ] Client buys their domain in their own name (roughly £10 a year for .com, £30–40 for .gg)
- [ ] Help the client create a free Cloudflare account in their name; connect this repo to Cloudflare Pages on their account (production branch `main`, no build command, output = repo root) and add their domain to the Pages project
- [ ] Swap the GitHub Pages URL (`https://sarniasites.github.io/dragon-chinese-restaurant/`) for the real domain everywhere: canonical, og:url/og:image, twitter:image, JSON-LD, sitemap.xml, robots.txt, form `_next`
- [ ] Switch the form from the team's email to the client's (`action="https://formsubmit.co/…"` in `index.html`) and activate FormSubmit (first submission sends a confirmation email)
- [ ] Confirm phone, opening hours (Facebook says "Opening soon"; the May 2026 menu says open daily 5pm till close, except Tuesdays) and that they're happy to take booking requests by email
- [ ] Get the client to sign off every menu price and the dietary markers
- [ ] Confirm "family restaurant" wording (from a guest review) and the photo captions; ask for food photos and an email address if they have them
- [ ] Optional: transfer the repo to the client's own GitHub if they want it

### Assumptions
- Hours, address ("Southside, St Sampsons, Guernsey, GY2 4QG"), card minimum and allergy wording come from the May 2026 printed menu.
- "At the Bridge" comes from their Facebook page address (dragonchinesethebridgeguernsey).
- No email address was in the pack, so the contact section has phone + Facebook + form only.
- The food photos on the printed menu look like printer stock, so they aren't used on the site.

### Left out of the pack
Closure notices (Christmas, Lunar New Year, staff holidays, Storm Goretti, staff-shortage notice), COVID notices and 2020 lockdown/reopening posts, the 2020 food-donation photos, the "fraud alert" image, Chinese New Year graphics and stock dragon art, the Valentine's/chocolate bouquet photos, the older May 2024 menu, and negative reviews.

## Build

```
npm install
npm run build    # one-off
npm run watch    # while editing
```

Source: built from the Facebook pack in `_fb-pack/` (not published on the live site).
