/* Dragon Chinese Restaurant — site script (no dependencies)
   header · mobile menu · open/closed status · hero ticket · reveals
   menu tabs + search + filters · phone list · set meals · lightbox · form */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gbp = function (n) { return '£' + n.toFixed(2); };

  /* ---------- Hero entrance ---------- */
  requestAnimationFrame(function () { requestAnimationFrame(function () { document.body.classList.add('is-ready'); }); });

  /* ---------- Header ---------- */
  var header = $('.site-header');
  var mbar = $('#mbar');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-stuck', y > 10);
    if (mbar) mbar.classList.toggle('is-shown', y > window.innerHeight * 0.55);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active nav link
  var navLinks = $$('.nav-link');
  if ('IntersectionObserver' in window && navLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['menu', 'set-meals', 'restaurant', 'visit'].forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
  }

  /* ---------- Mobile menu ---------- */
  var burger = $('.burger');
  var mnav = $('#mnav');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mnav.classList.toggle('is-open', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }
  if (burger && mnav) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mnav.classList.contains('is-open')) { setMenu(false); burger.focus(); } });
  }

  /* ---------- Open / closed status (Guernsey time) ---------- */
  (function () {
    var dot = $('#status-dot'), text = $('#status-text');
    var now;
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(new Date());
      var wd = parts.find(function (p) { return p.type === 'weekday'; }).value;
      var hr = +parts.find(function (p) { return p.type === 'hour'; }).value;
      now = { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(wd), hour: hr };
    } catch (e) { var d = new Date(); now = { day: d.getDay(), hour: d.getHours() }; }
    var row = $('#hours tr[data-day="' + now.day + '"]');
    if (row) { row.classList.add('font-bold', 'text-fascia-700'); row.querySelector('th').insertAdjacentHTML('beforeend', ' <span class="ml-1 rounded-full bg-fascia-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">Today</span>'); }
    if (!dot || !text) return;
    if (now.day === 2) { dot.classList.add('closed'); text.textContent = 'Closed on Tuesdays. Open tomorrow from 5pm'; }
    else if (now.hour >= 17) { dot.classList.add('open'); text.textContent = 'Open this evening from 5pm'; }
    else if (now.hour >= 3) { text.textContent = 'Opens today at 5pm'; }
  })();

  /* ---------- Hero ticket: writes itself, line by line, then loops ---------- */
  (function () {
    var lines = $$('#ticket .t-line');
    var ring = $('#ticket .t-ring');
    var ticket = $('.hero-ticket');
    if (!lines.length) return;
    if (reduce) { lines.forEach(function (l) { l.classList.add('on'); }); if (ring) ring.classList.add('on'); return; }
    var timers = [], visible = true, running = false;
    function clear() { timers.forEach(clearTimeout); timers = []; }
    function run() {
      running = true;
      var t = 1500;
      lines.forEach(function (l) { timers.push(setTimeout(function () { l.classList.add('on'); }, t)); t += 1000; });
      timers.push(setTimeout(function () { ring && ring.classList.add('on'); }, t));
      timers.push(setTimeout(function () {
        var ol = $('#ticket'); ol.classList.add('t-fade'); ol.style.opacity = '0';
        timers.push(setTimeout(function () {
          lines.forEach(function (l) { l.style.transition = 'none'; l.classList.remove('on'); void l.offsetWidth; l.style.transition = ''; });
          if (ring) { ring.style.transition = 'none'; ring.classList.remove('on'); void ring.getBoundingClientRect(); ring.style.transition = ''; }
          ol.style.opacity = '1';
          running = false;
          if (visible) { timers.push(setTimeout(run, 0)); }
        }, 600));
      }, t + 5200));
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible && !running) run();
      }).observe(ticket);
    } else run();
  })();

  /* ---------- Reveals ---------- */
  var revealEls = $$('.reveal, .fret-run');
  if ('IntersectionObserver' in window && !reduce) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else revealEls.forEach(function (el) { el.classList.add('is-in'); });

  /* ---------- Menu: tabs ---------- */
  var tabs = $$('#cat-tabs [role="tab"]');
  var panels = $$('.menu-panel');
  var current = tabs.length ? tabs[0].id.replace('tab-', '') : null;
  function showTab(id, focus) {
    current = id;
    tabs.forEach(function (t) {
      var on = t.id === 'tab-' + id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on) {
        if (focus) t.focus();
        var bar = t.parentElement;
        if (bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: t.offsetLeft - 20, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
    panels.forEach(function (p) {
      var on = p.dataset.cat === id;
      p.hidden = !on;
      if (on && !reduce) { p.classList.remove('is-entering'); void p.offsetWidth; p.classList.add('is-entering'); }
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      if (search.value || filters.size) resetFilters();
      showTab(t.id.replace('tab-', ''));
      var top = $('#menu-panels').getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.6) {
        window.scrollTo({ top: window.scrollY + top - (window.innerWidth < 1024 ? 140 : 120), behavior: reduce ? 'auto' : 'smooth' });
      }
    });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowUp' || k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (k === 'Home') n = tabs[0];
      if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); showTab(n.id.replace('tab-', ''), true); }
    });
  });

  /* ---------- Menu: search + filters ---------- */
  var search = $('#menu-search');
  var chips = $$('[data-filter]');
  var filters = new Set();
  var note = $('#filter-note');
  var empty = $('#menu-empty');
  function applyFilters() {
    var q = search.value.trim().toLowerCase();
    var active = q || filters.size;
    var total = 0;
    panels.forEach(function (p) {
      var shown = 0;
      $$('.dish', p).forEach(function (li) {
        var f = li.dataset.flags.split(' ');
        var ok = true;
        if (q) {
          if (/^\d+$/.test(q)) ok = li.dataset.no === q;
          else ok = (li.dataset.full + ' ' + p.querySelector('h3').textContent).toLowerCase().indexOf(q) > -1;
        }
        if (ok && filters.has('leaf')) ok = f.indexOf('leaf') > -1;
        if (ok && filters.has('chilli')) ok = f.indexOf('chilli') > -1;
        if (ok && filters.has('nonut')) ok = f.indexOf('nut') === -1;
        li.hidden = active ? !ok : false;
        if (ok) shown++;
      });
      p.hidden = active ? shown === 0 : p.dataset.cat !== current;
      p.classList.toggle('mt-10', !!active && shown > 0);
      if (active) total += shown;
    });
    if (active && panels.length) { var first = panels.find(function (p) { return !p.hidden; }); if (first) first.classList.remove('mt-10'); }
    tabs.forEach(function (t) { t.setAttribute('aria-selected', active ? 'false' : String(t.id === 'tab-' + current)); });
    empty.classList.toggle('hidden', !active || total > 0);
    note.classList.toggle('hidden', !active);
    if (active) note.innerHTML = total + (total === 1 ? ' dish' : ' dishes') + ' across the menu. <button type="button" class="link font-semibold text-fascia-700" id="clear-filters">Show the full menu</button>';
    var clr = $('#clear-filters'); if (clr) clr.addEventListener('click', function () { resetFilters(); search.focus(); });
  }
  function resetFilters() {
    search.value = '';
    filters.clear();
    chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
    $$('.dish').forEach(function (li) { li.hidden = false; });
    panels.forEach(function (p) { p.classList.remove('mt-10'); });
    applyFilters();
  }
  if (search) {
    search.addEventListener('input', applyFilters);
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var k = c.dataset.filter;
        if (filters.has(k)) filters.delete(k); else filters.add(k);
        c.setAttribute('aria-pressed', String(filters.has(k)));
        applyFilters();
      });
    });
  }

  /* ---------- Phone list ---------- */
  var KEY = 'dragon-list-v1';
  var list = [];
  try { list = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { list = []; }
  var padItems = $('#pad-items'), padEmpty = $('#pad-empty'), padFoot = $('#pad-foot'), padTotal = $('#pad-total');
  var mbarList = $('#mbar-list'), mbarCount = $('#mbar-count'), mbarBook = $('#mbar-book');
  var pad = $('#pad'), scrim = $('#pad-scrim');

  function save() { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* private mode */ } }
  function find(key) { for (var i = 0; i < list.length; i++) if (list[i].key === key) return list[i]; return null; }
  function add(item, qty) {
    var ex = find(item.key);
    if (ex) ex.qty += qty || 1; else list.push({ key: item.key, no: item.no, name: item.name, price: item.price, qty: qty || 1, per: item.per || '' });
    save(); render(item.key);
  }
  function change(key, d) {
    var ex = find(key); if (!ex) return;
    ex.qty += d;
    if (ex.qty <= 0) list = list.filter(function (x) { return x.key !== key; });
    save(); render();
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function render(fresh) {
    var total = 0, count = 0;
    padItems.innerHTML = list.map(function (x) {
      total += x.price * x.qty; count += x.qty;
      return '<li class="flex items-center gap-2 border-b border-dashed border-wall-300 py-2' + (x.key === fresh ? ' pad-item' : '') + '">' +
        '<span class="w-9 flex-none text-lantern">' + esc(x.no) + '</span>' +
        '<span class="min-w-0 flex-1 leading-tight">' + esc(x.name) + (x.per ? '<span class="block font-body text-xs text-ink-soft">' + esc(x.per) + '</span>' : '') + '</span>' +
        '<span class="flex flex-none items-center font-body text-ink">' +
        '<button type="button" class="grid h-9 w-9 place-items-center rounded-full hover:bg-wall-100" data-q="-1" data-k="' + esc(x.key) + '" aria-label="One fewer ' + esc(x.name) + '"><svg class="h-3.5 w-3.5"><use href="#i-minus"/></svg></button>' +
        '<span class="w-5 text-center text-sm font-semibold tabular-nums">' + x.qty + '</span>' +
        '<button type="button" class="grid h-9 w-9 place-items-center rounded-full hover:bg-wall-100" data-q="1" data-k="' + esc(x.key) + '" aria-label="One more ' + esc(x.name) + '"><svg class="h-3.5 w-3.5"><use href="#i-plus"/></svg></button></span>' +
        '<span class="w-14 flex-none text-right tabular-nums">' + (x.price * x.qty).toFixed(2) + '</span></li>';
    }).join('');
    var has = list.length > 0;
    padEmpty.classList.toggle('hidden', has);
    padFoot.classList.toggle('hidden', !has);
    padTotal.textContent = gbp(total);
    // mark dishes on the menu
    $$('.dish').forEach(function (li) {
      var on = !!find('d' + li.dataset.no + ':' + li.dataset.full);
      var b = li.querySelector('.add');
      b.classList.toggle('is-added', on);
    });
    if (mbarList) {
      mbarList.classList.toggle('hidden', !has);
      mbarList.classList.toggle('inline-flex', has);
      mbarBook.classList.toggle('hidden', has);
      mbarCount.textContent = count;
      if (fresh && !reduce) { mbarList.classList.remove('bump'); void mbarList.offsetWidth; mbarList.classList.add('bump'); }
    }
    if (!has) openPad(false);
  }
  padItems.addEventListener('click', function (e) {
    var b = e.target.closest('[data-q]'); if (!b) return;
    change(b.dataset.k, +b.dataset.q);
  });
  $('#pad-clear').addEventListener('click', function () { list = []; save(); render(); });
  $$('.dish .add').forEach(function (b) {
    b.addEventListener('click', function () {
      var li = b.closest('.dish');
      add({ key: 'd' + li.dataset.no + ':' + li.dataset.full, no: li.dataset.no, name: li.dataset.full, price: +li.dataset.price });
    });
  });
  function openPad(open) {
    if (!pad) return;
    pad.classList.toggle('is-open', open);
    scrim.classList.toggle('is-open', open);
    if (window.innerWidth < 1024) document.documentElement.style.overflow = open ? 'hidden' : '';
  }
  if (mbarList) mbarList.addEventListener('click', function () { openPad(true); });
  $('#pad-close').addEventListener('click', function () { openPad(false); });
  scrim.addEventListener('click', function () { openPad(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pad.classList.contains('is-open')) openPad(false); });
  render();

  /* ---------- Set meals ---------- */
  $$('.set-card').forEach(function (card) {
    var price = +card.dataset.price, min = +card.dataset.min, n = min;
    var out = card.querySelector('output'), totalEl = card.querySelector('.set-total'), people = card.querySelector('.set-people');
    var minus = card.querySelector('[data-step="-1"]'), plus = card.querySelector('[data-step="1"]');
    function upd() {
      out.textContent = n;
      people.textContent = n + (n === 1 ? ' person' : ' people');
      totalEl.textContent = gbp(price * n);
      minus.disabled = n <= min; plus.disabled = n >= 30;
    }
    minus.addEventListener('click', function () { if (n > min) { n--; upd(); } });
    plus.addEventListener('click', function () { if (n < 30) { n++; upd(); } });
    card.querySelector('.set-add').addEventListener('click', function () {
      var btn = this;
      add({ key: 'set' + card.dataset.set, no: card.dataset.set, name: card.dataset.name, price: price, per: gbp(price) + ' per person' }, n);
      btn.textContent = 'Added to your list';
      setTimeout(function () { btn.textContent = 'Add to your list'; }, 1800);
    });
    upd();
  });

  /* ---------- Lightbox ---------- */
  var lb = $('#lb'), lbImg = $('#lb-img'), lbCap = $('#lb-cap');
  var group = [], idx = 0, lastFocus = null;
  function openLb(g, i) {
    group = $$('[data-lightbox="' + g + '"]'); idx = i; lastFocus = document.activeElement;
    showLb(); lb.classList.add('is-open'); document.documentElement.style.overflow = 'hidden';
    $('#lb-close').focus();
    var multi = group.length > 1;
    $('#lb-prev').style.visibility = multi ? '' : 'hidden';
    $('#lb-next').style.visibility = multi ? '' : 'hidden';
  }
  function showLb() {
    var a = group[idx];
    lbImg.style.opacity = '0';
    var im = new Image();
    im.onload = function () { lbImg.src = a.getAttribute('href'); lbImg.alt = (a.querySelector('img') || {}).alt || a.dataset.caption || ''; lbImg.style.opacity = '1'; };
    im.src = a.getAttribute('href');
    lbCap.textContent = (a.dataset.caption || '') + (group.length > 1 ? '  ·  ' + (idx + 1) + ' / ' + group.length : '');
  }
  function closeLb() { lb.classList.remove('is-open'); document.documentElement.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  function step(d) { idx = (idx + d + group.length) % group.length; showLb(); }
  $$('[data-lightbox]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var g = a.dataset.lightbox; openLb(g, $$('[data-lightbox="' + g + '"]').indexOf(a));
    });
  });
  $$('[data-lightbox-open]').forEach(function (b) { b.addEventListener('click', function () { openLb(b.dataset.lightboxOpen, 0); }); });
  $('#lb-close').addEventListener('click', closeLb);
  $('#lb-prev').addEventListener('click', function () { step(-1); });
  $('#lb-next').addEventListener('click', function () { step(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'FIGURE') closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'Tab') { // keep focus inside
      var f = $$('button', lb).filter(function (b) { return b.offsetParent !== null && b.style.visibility !== 'hidden'; });
      var i = f.indexOf(document.activeElement);
      e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
  var sx = null, sy = null;
  lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) && group.length > 1) step(dx < 0 ? 1 : -1);
    else if (dy > 90) closeLb();
    sx = sy = null;
  });

  /* ---------- Form ---------- */
  var form = $('#enquiry');
  if (form) {
    var rules = {
      name: function (v) { return v.trim().length > 1; },
      phone: function (v) { return v.replace(/[^0-9]/g, '').length >= 6; },
      email: function (v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); },
      enquiry: function (v) { return !!v; },
      message: function (v) { return v.trim().length > 2; }
    };
    function check(el) {
      var fn = rules[el.name]; if (!fn) return true;
      var ok = fn(el.value);
      el.closest('.field').classList.toggle('invalid', !ok);
      el.setAttribute('aria-invalid', String(!ok));
      return ok;
    }
    Object.keys(rules).forEach(function (n) {
      var el = form.elements[n]; if (!el) return;
      var errEl = el.closest('.field').querySelector('.err');
      if (errEl) { errEl.id = 'err-' + n; el.setAttribute('aria-describedby', errEl.id); }
      el.addEventListener('blur', function () { if (el.value) check(el); });
      el.addEventListener('input', function () { if (el.closest('.field').classList.contains('invalid')) check(el); });
    });
    form.addEventListener('submit', function (e) {
      var bad = Object.keys(rules).map(function (n) { return form.elements[n]; }).filter(function (el) { return el && !check(el); });
      if (bad.length) { e.preventDefault(); bad[0].focus(); return; }
      var btn = $('#f-submit');
      btn.disabled = true; btn.classList.add('opacity-80');
      btn.querySelector('span').textContent = 'Sending…';
    });
  }

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
