/* ============================================================
   EBYG Automation — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ---------- HEADER SCROLL ----------
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  function onScroll() {
    const y = window.scrollY;
    if (y > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- MOBILE NAV ----------
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('main-nav');

  toggle.addEventListener('click', function () {
    toggle.classList.toggle('active');
    nav.classList.toggle('open');
  });

  // Close mobile nav on link click
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      toggle.classList.remove('active');
      nav.classList.remove('open');
    });
  });

  // ---------- SCROLL TO TOP ----------
  const scrollBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 600) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- SCROLL REVEAL ----------
  function addRevealClasses() {
    var selectors = [
      '.about-text', '.about-visual',
      '.friction-card', '.eco-brand', '.eco-transition',
      '.product-card', '.service-card',
      '.step-card', '.industry-card',
      '.support-text', '.support-price-card',
      '.advantage-content', '.advantage-point',
      '.cta-content', '.cta-form-wrap',
      '.section-center'
    ];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('reveal');
      });
    });
  }

  function revealOnScroll() {
    var reveals = document.querySelectorAll('.reveal');
    var windowH = window.innerHeight;

    reveals.forEach(function (el, i) {
      var top = el.getBoundingClientRect().top;
      var triggerPoint = windowH - 80;

      if (top < triggerPoint) {
        // Stagger siblings slightly
        var delay = 0;
        var parent = el.parentElement;
        if (parent) {
          var siblings = parent.querySelectorAll('.reveal');
          siblings.forEach(function (sib, idx) {
            if (sib === el) delay = idx * 80;
          });
        }
        setTimeout(function () {
          el.classList.add('visible');
        }, Math.min(delay, 400));
      }
    });
  }

  addRevealClasses();
  window.addEventListener('scroll', revealOnScroll, { passive: true });
  // Trigger initial check
  setTimeout(revealOnScroll, 100);

  // ---------- SMOOTH SCROLL for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---------- FORM (placeholder handler) ----------
  var form = document.getElementById('audit-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Simulate submission (replace with actual endpoint)
      setTimeout(function () {
        btn.textContent = 'Request Received!';
        btn.style.background = '#2a9d5c';
        btn.style.borderColor = '#2a9d5c';

        setTimeout(function () {
          form.reset();
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.disabled = false;
        }, 3000);
      }, 1200);
    });
  }

})();
