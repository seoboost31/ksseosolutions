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
      var email = form.dataset.email || 'YOUR_EMAIL@example.com';
      if (email.indexOf('YOUR_EMAIL') !== -1) {
        alert('Please edit the contact email in contact.html and replace YOUR_EMAIL@example.com with your real email address.');
        return;
      }
      window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
    });
  });
})();
