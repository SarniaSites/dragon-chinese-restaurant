// Writes the menu and set meals from src/menu.json into index.html
// (between the <!-- MENU:START/END --> and <!-- SETS:START/END --> markers).
// Run with: npm run menu   (then npm run build)
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'menu.json'), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const gbp = (n) => '£' + n.toFixed(2);
const FLAG = { chilli: 'Hot and spicy', leaf: 'Vegetarian', nut: 'Contains nuts' };
const I = '            ';

function flags(list) {
  if (!list.length) return '';
  return `<span class="dish-flags">${list.map((f) => `<svg role="img" aria-label="${FLAG[f]}"><title>${FLAG[f]}</title><use href="#i-${f}"/></svg>`).join('')}</span>`;
}
function row(d, variant, price) {
  const name = esc(d.name);
  const full = esc(variant ? `${d.full} (${variant.toLowerCase()})` : d.full);
  const small = variant || d.note;
  return `${I}<li class="dish" data-no="${d.no}" data-full="${full}" data-price="${price.toFixed(2)}" data-flags="${d.flags.join(' ')}">` +
    `<span class="dish-no">${d.no}</span>` +
    `<span class="dish-name">${name}${flags(d.flags)}${small ? `<small>${esc(small)}</small>` : ''}</span>` +
    `<span class="dish-price">${gbp(price)}</span>` +
    `<button class="add" type="button" aria-label="Add ${d.no}, ${full}, to your list"><svg class="plus" aria-hidden="true"><use href="#i-plus"/></svg><svg class="tick" aria-hidden="true"><use href="#i-check"/></svg></button></li>`;
}

let tabs = '';
let panels = '';
data.categories.forEach((c, i) => {
  const first = c.dishes[0].no, last = c.dishes[c.dishes.length - 1].no;
  const count = c.dishes.reduce((n, d) => n + (d.prices ? d.prices.length : 1), 0);
  tabs += `${I}<button class="cat-btn" type="button" role="tab" id="tab-${c.id}" aria-controls="panel-${c.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><svg aria-hidden="true"><use href="#${c.icon}"/></svg><span>${esc(c.name)}</span><span class="n">${count}</span></button>\n`;
  let rows = '';
  c.dishes.forEach((d) => {
    if (d.prices) d.prices.forEach(([v, p]) => { rows += row(d, v, p) + '\n'; });
    else rows += row(d, null, d.price) + '\n';
  });
  panels += `          <div class="menu-panel" id="panel-${c.id}" role="tabpanel" aria-labelledby="tab-${c.id}" data-cat="${c.id}"${i === 0 ? '' : ' hidden'}>
            <div class="mb-1 flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3">
              <h3 class="text-[1.7rem] font-bold leading-tight">${esc(c.name)}</h3>
              <p class="whitespace-nowrap text-sm font-medium text-ink-soft">Nos. ${first}–${last}</p>
            </div>${c.note ? `\n            <p class="mt-3 text-[0.95rem] text-ink-soft">${esc(c.note)}</p>` : ''}
            <ul class="dish-list">
${rows}            </ul>
          </div>\n`;
});

let sets = '';
data.sets.forEach((s, i) => {
  sets += `          <article class="set-card reveal" style="--d:${i * 70}" data-set="${s.id}" data-name="${esc(s.name)}" data-price="${s.price.toFixed(2)}" data-min="${s.min}">
            <div class="flex items-start justify-between gap-4">
              <span class="set-letter" aria-hidden="true">${s.id}</span>
              <p class="pt-2 text-right"><span class="block font-display text-[1.9rem] font-bold leading-none">${gbp(s.price)}</span><span class="text-sm text-ink-soft">per person</span></p>
            </div>
            <h3 class="mt-4 text-[1.45rem] font-bold leading-tight">${esc(s.name)}</h3>
            <p class="text-[0.95rem] font-semibold text-lantern-600">${esc(s.per)}</p>
            <ul class="mt-4 space-y-1.5 border-t border-dashed border-wall-300 pt-4 text-[0.98rem]">
${s.items.map((it) => `              <li class="flex gap-2.5"><svg class="mt-[0.45rem] h-2 w-2 flex-none text-fret" aria-hidden="true"><use href="#i-diamond"/></svg>${esc(it)}</li>`).join('\n')}
            </ul>
            <div class="mt-auto pt-6">
              <div class="flex items-center justify-between gap-3 border-t border-dashed border-wall-300 pt-5">
                <div class="stepper" role="group" aria-label="People for ${esc(s.name)}">
                  <button type="button" data-step="-1" aria-label="One fewer person"><svg class="h-4 w-4" aria-hidden="true"><use href="#i-minus"/></svg></button>
                  <output aria-live="polite">${s.min}</output>
                  <button type="button" data-step="1" aria-label="One more person"><svg class="h-4 w-4" aria-hidden="true"><use href="#i-plus"/></svg></button>
                </div>
                <p class="text-right text-sm text-ink-soft"><span class="set-people">${s.min} ${s.min === 1 ? 'person' : 'people'}</span><span class="block text-lg font-bold text-ink set-total">${gbp(s.price * s.min)}</span></p>
              </div>
              <button type="button" class="set-add btn btn-line mt-4 w-full">Add to your list</button>
            </div>
          </article>\n`;
});

const file = path.join(root, 'index.html');
let html = fs.readFileSync(file, 'utf8');
const put = (name, content) => {
  const re = new RegExp(`(<!-- ${name}:START -->)[\\s\\S]*?(\\s*<!-- ${name}:END -->)`);
  if (!re.test(html)) throw new Error('marker missing: ' + name);
  html = html.replace(re, `$1\n${content}$2`);
};
put('TABS', tabs.replace(/\n$/, ''));
put('MENU', panels.replace(/\n$/, ''));
put('SETS', sets.replace(/\n$/, ''));
fs.writeFileSync(file, html);
console.log('menu written:', data.categories.length, 'sections,', data.sets.length, 'set meals');
