/* ═══════════════════════════════════════════════════════
   MIDAS MANIFESTATION — Main JavaScript
   GSAP Animations, Interactions, FAQ, Navigation
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── DOM Ready ───
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Wait for GSAP to load
    if (typeof gsap === 'undefined') {
      setTimeout(init, 50);
      return;
    }

    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);

    initNavigation();
    initHeroParticles();
    initRevealAnimations();
    initHeroAnimations();
    initFAQ();
    initStickyCTA();
    initBackToTop();
    initExitPopup();
    initSmoothScroll();
    initCounterAnimations();
  }

  // ─── Navigation ───
  function initNavigation() {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav__mobile-toggle');
    const links = document.querySelector('.nav__links');

    // Scroll state
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      if (current > 50) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
      lastScroll = current;
    }, { passive: true });

    // Mobile toggle
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        links.classList.toggle('nav__links--open');
        const isOpen = links.classList.contains('nav__links--open');
        toggle.setAttribute('aria-expanded', isOpen);
        const spans = toggle.querySelectorAll('span');
        if (isOpen) {
          gsap.to(spans[0], { rotation: 45, y: 7, duration: 0.3 });
          gsap.to(spans[1], { opacity: 0, duration: 0.2 });
          gsap.to(spans[2], { rotation: -45, y: -7, duration: 0.3 });
        } else {
          gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
          gsap.to(spans[1], { opacity: 1, duration: 0.2 });
          gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
        }
      });

      // Close on link click
      links.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
          links.classList.remove('nav__links--open');
          toggle.setAttribute('aria-expanded', 'false');
          const spans = toggle.querySelectorAll('span');
          gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
          gsap.to(spans[1], { opacity: 1, duration: 0.2 });
          gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
        });
      });
    }
  }

  // ─── Hero Particles ───
  function initHeroParticles() {
    const container = document.querySelector('.hero__particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'hero__particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.width = (Math.random() * 3 + 1) + 'px';
      particle.style.height = particle.style.width;
      particle.style.opacity = Math.random() * 0.3 + 0.1;
      container.appendChild(particle);

      gsap.to(particle, {
        y: -100 - Math.random() * 200,
        x: (Math.random() - 0.5) * 100,
        opacity: 0,
        duration: 4 + Math.random() * 6,
        repeat: -1,
        delay: Math.random() * 5,
        ease: 'none'
      });
    }
  }

  // ─── Reveal Animations ───
  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    // Stagger children
    document.querySelectorAll('[data-stagger]').forEach(parent => {
      const children = parent.children;
      gsap.fromTo(children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: parent,
            start: 'top 80%',
            once: true
          }
        }
      );
    });
  }

  // ─── Hero Animations ───
  function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo('.hero__badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo('.hero__title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
      .fromTo('.hero__description', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .fromTo('.hero__actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
      .fromTo('.hero__stats', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
      .fromTo('.hero__image-wrapper', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 }, '-=0.8')
      .fromTo('.hero__floating-card', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.2 }, '-=0.5');

    // Parallax on hero image
    gsap.to('.hero__image-wrapper', {
      y: -50,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  // ─── FAQ Accordion ───
  function initFAQ() {
    const items = document.querySelectorAll('.faq__item');

    items.forEach(item => {
      const question = item.querySelector('.faq__question');
      const answer = item.querySelector('.faq__answer');
      const inner = item.querySelector('.faq__answer-inner');

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('faq__item--active');

        // Close all
        items.forEach(other => {
          if (other !== item && other.classList.contains('faq__item--active')) {
            other.classList.remove('faq__item--active');
            other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
            gsap.to(other.querySelector('.faq__answer'), {
              maxHeight: 0,
              duration: 0.4,
              ease: 'power2.inOut'
            });
          }
        });

        // Toggle current
        if (isActive) {
          item.classList.remove('faq__item--active');
          question.setAttribute('aria-expanded', 'false');
          gsap.to(answer, { maxHeight: 0, duration: 0.4, ease: 'power2.inOut' });
        } else {
          item.classList.add('faq__item--active');
          question.setAttribute('aria-expanded', 'true');
          const height = inner.offsetHeight;
          gsap.to(answer, { maxHeight: height + 20, duration: 0.4, ease: 'power2.inOut' });
        }
      });
    });
  }

  // ─── Sticky CTA ───
  function initStickyCTA() {
    const sticky = document.querySelector('.sticky-cta');
    const hero = document.querySelector('.hero');
    if (!sticky || !hero) return;

    ScrollTrigger.create({
      trigger: hero,
      start: 'bottom top',
      onEnter: () => sticky.classList.add('sticky-cta--visible'),
      onLeaveBack: () => sticky.classList.remove('sticky-cta--visible')
    });
  }

  // ─── Back to Top ───
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) {
        btn.classList.add('back-to-top--visible');
      } else {
        btn.classList.remove('back-to-top--visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── Exit-Intent Popup ───
  function initExitPopup() {
    var popup = document.getElementById('exit-popup');
    var overlay = document.getElementById('exit-popup-overlay');
    var closeBtn = document.getElementById('exit-popup-close');
    var form = document.getElementById('exit-popup-form');
    if (!popup) return;

    // Check if already shown this session
    if (sessionStorage.getItem('exit-popup-shown')) return;

    var shown = false;
    var dismissed = false;

    function showPopup() {
      if (shown || dismissed) return;
      shown = true;
      sessionStorage.setItem('exit-popup-shown', '1');
      popup.classList.add('exit-popup--visible');
      document.body.style.overflow = 'hidden';
    }

    function hidePopup() {
      dismissed = true;
      popup.classList.remove('exit-popup--visible');
      document.body.style.overflow = '';
    }

    // Desktop exit intent (mouse leaves top)
    document.addEventListener('mouseout', function (e) {
      if (e.clientY < 5 && !e.relatedTarget) {
        showPopup();
      }
    });

    // Mobile: show after 30 seconds
    setTimeout(function () {
      if (!shown && !dismissed) showPopup();
    }, 30000);

    // Close handlers
    closeBtn.addEventListener('click', hidePopup);
    overlay.addEventListener('click', hidePopup);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && popup.classList.contains('exit-popup--visible')) {
        hidePopup();
      }
    });

    // Form submit
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('exit-popup-email').value;
      if (email) {
        form.innerHTML = '<p style="color: var(--color-success); font-weight: 600; font-size: var(--text-base);">Checklist sent! Check your inbox.</p>';
        setTimeout(hidePopup, 3000);
      }
    });
  }

  // ─── Smooth Scroll ───
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  // ─── Counter Animations ───
  function initCounterAnimations() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(el,
            { innerText: 0 },
            {
              innerText: target,
              duration: 2,
              ease: 'power2.out',
              snap: { innerText: 1 },
              onUpdate: function () {
                el.textContent = Math.round(parseFloat(el.textContent)) + suffix;
              }
            }
          );
        }
      });
    });
  }

})();
