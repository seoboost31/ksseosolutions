/* Rankora Digital Agency - site scripts */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav-links');

  /* Mobile navigation */
  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(!nav.classList.contains('open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-wrap')) setMenu(false);
    });
  }


  /* Locations dropdown */
  var subItems = document.querySelectorAll('.nav-item');
  function closeSubs(except) {
    subItems.forEach(function (item) {
      if (item === except) return;
      item.classList.remove('open');
      var b = item.querySelector('.sub-toggle');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  document.querySelectorAll('.sub-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var item = btn.closest('.nav-item');
      closeSubs(item);
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) closeSubs(null);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSubs(null);
  });

  /* Header shadow once the page is scrolled */
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Contact form: opens the visitor's email app with the details filled in */
  document.querySelectorAll('form[data-contact-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var subject = encodeURIComponent('SEO inquiry from Rankora Digital Agency website');
      var body = encodeURIComponent(
        'Name: ' + data.get('name') + '\n' +
        'Email: ' + data.get('email') + '\n' +
        'Website: ' + (data.get('website') || 'Not provided') + '\n' +
        'Service: ' + (data.get('service') || 'Not specified') + '\n\n' +
        'Message:\n' + data.get('message')
      );
      var email = form.dataset.email || 'inforankoraseo@smallbusinessdenver.us';
      if (email.indexOf('YOUR_EMAIL') !== -1) {
        alert('Please edit the contact email in contact.html and replace YOUR_EMAIL@example.com with your real email address.');
        return;
      }
      window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
    });
  });
})();

(function () {
  'use strict';
  var root = document.querySelector('[data-reveal-ready]');
  if (!root) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* scroll progress bar */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  function progress() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? Math.min(100, window.scrollY / h * 100) : 0) + '%';
  }
  progress();
  window.addEventListener('scroll', progress, { passive: true });

  /* tag elements to reveal */
  var sel = '.section-head, .card, .package-item, .person-card, .team-roster li, .stat, .compare-wrap, .faq details, .content-grid > *, .upw-card, .up-card, .gs-card, .team-feature > *, .cta-inner > *, .flag-list li, .check-list li';
  var items = Array.prototype.slice.call(root.querySelectorAll(sel));
  items.forEach(function (el) {
    if (el.closest('.hero-visual')) return;
    el.classList.add('reveal');
    var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.transitionDelay = Math.min(sib, 5) * 90 + 'ms';
    if (el.classList.contains('person-card') || el.closest('.team-feature')) {
      if (el.matches('.team-feature > *')) el.classList.add(sib === 0 ? 'reveal-left' : 'reveal-right');
    }
    if (el.classList.contains('compare-wrap')) el.classList.add('reveal-zoom');
  });

  /* counters */
  function count(el) {
    var end = parseFloat(el.getAttribute('data-count')), pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var fm = function (v) { return el.hasAttribute('data-sep') ? v.toLocaleString('en-US') : v; };
    var rd = function (v) { return dec ? v.toFixed(dec) : Math.round(v); };
    if (reduce) { el.textContent = pre + (dec ? rd(end) : fm(end)) + suf; return; }
    var t0 = null, dur = 1500;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (dec ? rd(end * e) : fm(Math.round(end * e))) + (p === 1 ? suf : '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counted = new WeakSet();
  function run(el) {
    el.classList.add('in');
    el.querySelectorAll('[data-count]').forEach(function (c) {
      if (!counted.has(c)) { counted.add(c); count(c); }
    });
  }

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { run(el); });
    document.querySelectorAll('[data-count]').forEach(count);
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  items.forEach(function (el) { if (!el.closest('.hero-visual')) io.observe(el); });

  /* counters outside revealed items (e.g. hero) */
  document.querySelectorAll('.hero-team [data-count]').forEach(function (c) { setTimeout(function () { count(c); }, 600); });

  /* gentle parallax on hero visual */
  var hv = document.querySelector('.hero-visual');
  if (hv && !reduce) {
    window.addEventListener('scroll', function () {
      var y = Math.min(window.scrollY, 600);
      hv.style.transform = 'translateY(' + (y * 0.06) + 'px)';
    }, { passive: true });
  }
})();
