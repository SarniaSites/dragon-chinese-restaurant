# Dragon Chinese Restaurant — website

One-page site for Dragon Chinese Restaurant, Southside, St Sampson's, Guernsey. Plain HTML, Tailwind CSS v3 (compiled and committed) and one small vanilla JS file. No frameworks and no runtime CDNs, and every path is relative.

## Folder layout

```
index.html              the whole site; sections split by comment banners
                        (header, hero, hours band, menu, set meals, restaurant, reviews, good to know, find us + form, footer)
thanks.html             shown after the form is sent (FormSubmit _next)
404.html                page not found
assets/css/styles.css   compiled Tailwind. Don't edit it by hand; run npm run build
assets/js/main.js       header, mobile menu, open/closed line, hero ticket loop, reveals,
                        menu tabs/search/filters, phone list, set meals, lightbox, form validation
assets/fonts/           self-hosted Rufina, Red Hat Text and Kalam (woff2) + OFL licences
images/brand/           logo.svg, logo-light.svg (footer), mark.svg (favicon / app icon)
images/work/            photos as name.webp (large) + name-sm.webp (~800px)
images/                 favicons, og-image.jpg (1200×630 share card), site.webmanifest
src/input.css           Tailwind source: @font-face, components, the key-fret motif, keyframes
src/menu.json           the full menu + set meals (from the May 2026 printed menu)
src/build-menu.js       writes menu.json into index.html (npm run menu)
tailwind.config.js      brand colours (with where each came from), fonts
sitemap.xml, robots.txt
_fb-pack/               the Facebook research pack (not published: underscore folder)
_shots/                 screenshots for the team (not published)
```

## Design

- **Direction:** the restaurant's royal-blue fascia board, with its gold key-fret border, brought onto the page. The printed menu (with its numbers) is the main content. The interactive centrepiece is a phone "order pad": tap + on any dish and it builds a list with numbers and a total, ready to read out when you ring.
- **Hero:** the dining-room photo bleeds off the right edge behind a fascia strip with the fret border. A paper phone-order ticket crosses the seam and writes itself line by line (a gentle loop that pauses off-screen and is static under reduced motion).
- **Motif:** the key-fret from the sign, drawn in CSS/SVG. It is used on the hero strip, the hours band, the set-meals band, the footer and the share card.

| Name | Hex | Used for |
|---|---|---|
| fascia | `#16309a` (600 `#132a86`, 700 `#102473`, 800 `#0c1b57`) | Logo, headings accents, set-meals band, hours band, footer. Sampled from the shopfront fascia and window frames. |
| lantern | `#c0272d` | The one action colour: Call buttons, dish numbers, ticks. From the dining-room lanterns and the menu headings. |
| fret | `#c8a14a` | The key-fret border, small markers. From the gold border painted round the fascia. |
| wall | `#f7f2e8` / `#fcfaf5` | Page grounds. The cream of the front wall and dining room. |
| ink | `#111737` | Text (a very dark fascia blue). |
| leaf | `#2f7a3e` | Vegetarian marker, as on the printed menu. |

Fonts: **Rufina** (display; a flared serif close to the "DRAGON" lettering on the sign), **Red Hat Text** (body), **Kalam** (handwriting on the order tickets only). All OFL, self-hosted.

Logo: the Facebook profile picture is a photo of the shopfront, so there was no logo file. The wordmark was **redrawn as SVG** following the fascia layout: "DRAGON" with "CHINESE / RESTAURANT" stacked beside it behind a gold rule, set in Rufina and converted to outlines. The calligraphic character on the sign was not reproduced. If they have the signwriter's artwork, swap it in.

## Editing

- **Text:** edit `index.html`.
- **Colours:** `tailwind.config.js`, then `npm install && npm run build`.
- **Menu and set meals:** edit `src/menu.json` (names, prices, flags `chilli` / `leaf` / `nut`), then run `npm run menu && npm run build`. The script rewrites only the parts of `index.html` between the `<!-- TABS -->`, `<!-- MENU -->` and `<!-- SETS -->` markers. When the printed menu changes, also replace `images/work/menu-outside*.webp` / `menu-inside*.webp` (shown by "See the printed menu").
- **Phone list:** works automatically from the menu rows (`data-no`, `data-full`, `data-price`). It is stored in the visitor's browser only. Nothing is sent anywhere.
- **Adding a photo:** export `name.webp` (~1600px) and `name-sm.webp` (~800px) into `images/work/`. Add an `<a href="images/work/name.webp" data-lightbox="gallery" data-caption="…">` either visibly in the restaurant section or in the hidden block near the end of `index.html`.
- **Before & after:** not used, because it isn't relevant to a restaurant.

## Going live — checklist

SarniaSites charges a one-time fee and the client owns everything.

- [ ] Client buys their domain in their own name (roughly £10 a year for .com, £30–40 for .gg)
- [ ] Help the client create a free Cloudflare account in their name; connect this repo to Cloudflare Pages on their account (production branch `main`, no build command, output = repo root) and add their domain to the Pages project
- [ ] Swap the GitHub Pages URL (`https://sarniasites.github.io/dragon-chinese-restaurant/`) for the real domain everywhere: canonical, og:url / og:image / twitter:image, JSON-LD, sitemap.xml, robots.txt, form `_next`
- [ ] Switch the form from the team's email to the client's (`action="https://formsubmit.co/…"` in `index.html`) and activate FormSubmit (the first submission sends a confirmation email)
- [ ] Confirm phone and opening hours. Facebook says "Opening soon"; the May 2026 menu says open daily 5pm till close except Tuesdays, which is what the site uses. Ask for a closing time if they want one shown.
- [ ] Get the client to sign off every menu price, set meal and dietary marker (transcribed from the May 2026 menu, `_fb-pack/images/img-001.jpg` + `img-002.jpg`)
- [ ] Confirm they're happy to take table requests through the form, and ask for an email address (none in the pack, so there is no mailto link yet)
- [ ] Ask for food photos. The pack has none apart from the small pictures printed on the menu.
- [ ] Optional: transfer the repo to the client's own GitHub if they want it

### Assumptions

- "At the Bridge" comes from the page name (dragonchinesethebridgeguernsey) and the Southside address.
- Allergen wording is condensed from the menu's allergy notice ("cereals containing gluten" → "gluten", "sulphur dioxide" → "sulphites").
- Reviews are shown with first name + surname initial: Charlotte J., Richard D., Ali F., Julie M.

### Left out on purpose

Closure notices (Christmas, Lunar New Year, staff holidays, Storm Goretti), the "staff shortage / slower service" notice, COVID notices and the 2020 reopening, the fraud alert, Chinese New Year graphics, a stock dragon image, the old 2023 menu, the sushi-boat photo (sushi isn't on the menu), the Facebook rating and review counts, and the negative reviews.

## Source

Built from the Facebook pack in `_fb-pack/` (not published on the live site).
