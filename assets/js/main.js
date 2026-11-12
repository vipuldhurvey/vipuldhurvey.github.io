/* ==========================================================================
   Main Application Orchestration
   Theme Switcher, Navbar Scroll, Mobile Menu, Preloader, Gallery Lightbox
   ========================================================================== */
(function (window, document) {
  'use strict';

  const THEME_KEY = 'bk-portfolio-theme';

  function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const metaTheme = document.querySelector('meta[name="theme-color"]');

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      if (metaTheme) {
        metaTheme.setAttribute('content', theme === 'light' ? '#f4f7fc' : '#060812');
      }
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        toggleBtn.title = theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
      }
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch {
        // Ignore storage errors
      }
    }

    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const active = document.documentElement.getAttribute('data-theme') || 'dark';
        applyTheme(active === 'dark' ? 'light' : 'dark');
      });
    }
  }

  function initPreloader() {
    const preloader = document.getElementById('page-preloader');
    if (!preloader) return;

    const dismiss = () => {
      preloader.classList.add('is-hidden');
      window.setTimeout(() => {
        preloader.setAttribute('hidden', '');
      }, 480);
    };

    if (document.readyState === 'complete') {
      window.setTimeout(dismiss, 220);
    } else {
      window.addEventListener('load', () => window.setTimeout(dismiss, 220), { once: true });
      window.setTimeout(dismiss, 1400);
    }
  }

  function initNavbarAndBackToTop() {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');
    const progressCircle = document.getElementById('scroll-progress-circle');
    const circumference = 2 * Math.PI * 19; // r = 19

    if (progressCircle) {
      progressCircle.style.strokeDasharray = `${circumference}`;
      progressCircle.style.strokeDashoffset = `${circumference}`;
    }

    let ticking = false;
    function onScroll() {
      ticking = false;
      const scrollY = window.scrollY || window.pageYOffset;

      if (navbar) {
        navbar.classList.toggle('is-scrolled', scrollY > 24);
      }

      if (backToTop) {
        backToTop.hidden = scrollY < 380;
      }

      if (progressCircle) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
        progressCircle.style.strokeDashoffset = `${circumference * (1 - progress)}`;
      }
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(onScroll);
        }
      },
      { passive: true }
    );
    onScroll();

    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  function initMobileMenu() {
    const toggleBtn = document.getElementById('nav-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggleBtn || !menu) return;

    function setOpen(open) {
      toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.hidden = !open;
    }

    toggleBtn.addEventListener('click', () => {
      const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
      setOpen(!isOpen);
    });

    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) {
        setOpen(false);
        toggleBtn.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 900 && !menu.hidden) {
        setOpen(false);
      }
    });
  }

  function initGalleryLightbox() {
    const grid = document.getElementById('gallery-grid');
    const modal = document.getElementById('gallery-modal');
    const closeBtn = document.getElementById('gallery-modal-close');
    const imgEl = document.getElementById('gallery-modal-img');
    const titleEl = document.getElementById('gallery-modal-title');
    const descEl = document.getElementById('gallery-modal-desc');
    if (!grid || !modal || !imgEl) return;

    let lastTrigger = null;

    function close() {
      if (modal.hidden) return;
      modal.hidden = true;
      document.body.style.overflow = '';
      if (lastTrigger && typeof lastTrigger.focus === 'function') {
        lastTrigger.focus();
      }
    }

    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.gallery-item');
      if (!card) return;
      lastTrigger = card;
      imgEl.src = card.getAttribute('data-gallery-src') || '';
      imgEl.alt = card.getAttribute('data-gallery-title') || 'Visual preview';
      if (titleEl) titleEl.textContent = card.getAttribute('data-gallery-title') || '';
      if (descEl) descEl.textContent = card.getAttribute('data-gallery-caption') || '';
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    });

    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  function updateFooterYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initPreloader();
    initNavbarAndBackToTop();
    initMobileMenu();
    initGalleryLightbox();
    updateFooterYear();

    if (window.PortfolioAnimations) {
      window.PortfolioAnimations.initRevealObserver();
      window.PortfolioAnimations.initScrollCounters();
      window.PortfolioAnimations.initTiltEffects(document);
      window.PortfolioAnimations.initTimelineProgress();
      window.PortfolioAnimations.initHeroParticles();
      window.PortfolioAnimations.initCustomCursor();
      window.PortfolioAnimations.initNavIndicator();
    }

    if (window.PortfolioGitHub) {
      window.PortfolioGitHub.init();
    }
  });
})(window, document);

