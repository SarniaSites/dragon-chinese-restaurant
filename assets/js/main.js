/* ==========================================================================
   Dragon Chinese Restaurant — site scripts (vanilla, no dependencies)
   header · mobile menu · reveals · menu explorer · lightbox · form
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: background + shadow once scrolled ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    var scrolled = window.scrollY > 8;
    header.classList.toggle('bg-paper-50/90', scrolled);
    header.classList.toggle('backdrop-blur', scrolled);
    header.classList.toggle('shadow-[0_10px_30px_-24px_rgba(31,43,94,.6)]', scrolled);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var mnav = document.getElementById('mnav');
  function setMenu(open) {
    if (!toggle || !mnav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.querySelector('.icon-open').classList.toggle('hidden', open);
    toggle.querySelector('.icon-close').classList.toggle('hidden', !open);
    mnav.classList.toggle('is-open', open);
    if (open) header.classList.add('bg-paper-50');
    else header.classList.remove('bg-paper-50');
  }
  if (toggle) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    mnav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1024) setMenu(false); });
  }

  /* ---------- Active nav link ---------- */
  var navLinks = document.querySelectorAll('.nav-link');
  if ('IntersectionObserver' in window && navLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (l) { l.setAttribute('aria-current', l.getAttribute('href') === '#' + en.target.id ? 'true' : 'false'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['menu', 'order', 'restaurant', 'visit'].forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Staggered reveals ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Menu explorer (tabs) ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.menu-tab'));
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      if (on) {
        panel.hidden = false;
        panel.classList.remove('is-entering');
        void panel.offsetWidth; // restart animation
        panel.classList.add('is-entering');
      } else {
        panel.hidden = true;
      }
    });
    if (focus) tab.focus();
    // keep the chosen chip in view on phones
    var list = tab.parentElement;
    if (list && list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: tab.offsetLeft - 20, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    // on phones, bring the panel top into view if it's scrolled away
    var card = document.querySelector('.menu-card');
    if (card && window.innerWidth < 1024) {
      var top = card.getBoundingClientRect().top;
      if (top < 0) window.scrollTo({ top: window.scrollY + top - 90, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  /* ---------- Lightbox (gallery + printed menu) ---------- */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('.lb-img');
    var lbCap = lb.querySelector('.lb-cap');
    var lbCount = lb.querySelector('.lb-count');
    var lbPrev = lb.querySelector('.lb-prev');
    var lbNext = lb.querySelector('.lb-next');
    var items = [], index = 0, lastFocus = null;

    function show(i) {
      index = (i + items.length) % items.length;
      var it = items[index];
      var img = it.querySelector('img');
      lbImg.src = it.getAttribute('href');
      lbImg.alt = img ? img.alt : (it.getAttribute('data-caption') || '');
      lbCap.textContent = it.getAttribute('data-caption') || '';
      lbCount.textContent = items.length > 1 ? (index + 1) + ' / ' + items.length : '';
      lbPrev.hidden = lbNext.hidden = items.length < 2;
    }
    function open(group, i) {
      items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox="' + group + '"]'));
      if (!items.length) return;
      lastFocus = document.activeElement;
      lb.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      show(i || 0);
      requestAnimationFrame(function () { lb.classList.add('is-open'); });
      lb.querySelector('.lb-close').focus();
    }
    function close() {
      lb.classList.remove('is-open');
      document.documentElement.style.overflow = '';
      setTimeout(function () { lb.hidden = true; lbImg.src = ''; }, reduceMotion ? 0 : 250);
      if (lastFocus) lastFocus.focus();
    }

    document.querySelectorAll('[data-lightbox]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var group = a.getAttribute('data-lightbox');
        var list = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox="' + group + '"]'));
        open(group, list.indexOf(a));
      });
    });
    document.querySelectorAll('[data-lightbox-open]').forEach(function (b) {
      b.addEventListener('click', function () { open(b.getAttribute('data-lightbox-open'), 0); });
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lbPrev.addEventListener('click', function () { show(index - 1); });
    lbNext.addEventListener('click', function () { show(index + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'FIGURE') close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
      if (e.key === 'Tab') { // keep focus inside
        var f = Array.prototype.filter.call(lb.querySelectorAll('button'), function (b) { return !b.hidden; });
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    // swipe
    var sx = null, sy = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
      sx = sy = null;
    });
  }

  /* ---------- Enquiry form ---------- */
  var form = document.getElementById('enquiry');
  if (form) {
    var typeSel = form.querySelector('#f-type');
    var booking = form.querySelector('.booking-fields');
    function syncBooking() {
      var show = /booking|group/i.test(typeSel.value);
      booking.hidden = !show;
    }
    typeSel.addEventListener('change', syncBooking);
    syncBooking();

    function validate(input) {
      var field = input.closest('.field');
      if (!field) return true;
      var ok = input.checkValidity() && !(input.required && !input.value.trim());
      field.classList.toggle('is-invalid', !ok);
      input.setAttribute('aria-invalid', String(!ok));
      return ok;
    }
    var inputs = form.querySelectorAll('.field .input');
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value) validate(input); });
      input.addEventListener('input', function () { if (input.closest('.field').classList.contains('is-invalid')) validate(input); });
    });
    form.addEventListener('submit', function (e) {
      var firstBad = null;
      inputs.forEach(function (input) { if (!validate(input) && !firstBad) firstBad = input; });
      if (firstBad) { e.preventDefault(); firstBad.focus(); return; }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.classList.add('opacity-80', 'cursor-wait');
      btn.querySelector('.btn-label').textContent = 'Sending…';
    });
  }

  /* ---------- Footer year ---------- */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
