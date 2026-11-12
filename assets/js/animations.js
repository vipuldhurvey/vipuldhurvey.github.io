/* ==========================================================================
   Animation Engine — Particles, Scroll Reveals, Tilt, Counters, Cursor
   Respects prefers-reduced-motion and optimizes offscreen performance.
   ========================================================================== */
(function (window, document) {
  'use strict';

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isReducedMotion = () => motionQuery.matches;
  const isFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let revealObserver = null;

  function initRevealObserver() {
    const targets = document.querySelectorAll('.reveal-item:not(.is-visible)');
    if (isReducedMotion() || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
    }

    targets.forEach((el) => revealObserver.observe(el));
  }

  function observeNewReveals(container) {
    if (!container) return;
    const items = container.querySelectorAll('.reveal-item:not(.is-visible)');
    if (isReducedMotion() || !revealObserver) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    items.forEach((el, idx) => {
      el.style.setProperty('--delay', `${Math.min(idx * 0.05, 0.35)}s`);
      revealObserver.observe(el);
    });
  }

  function animateCounter(el, targetValue, duration = 900) {
    if (!el) return;
    const finalVal = Number(targetValue);
    if (!Number.isFinite(finalVal)) return;

    if (isReducedMotion() || finalVal === 0) {
      el.textContent = String(finalVal);
      return;
    }

    const startTime = performance.now();
    const startVal = 0;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (finalVal - startVal) * eased);
      el.textContent = String(current);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = String(finalVal);
      }
    }

    requestAnimationFrame(tick);
  }

  function initScrollCounters() {
    const counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    if (isReducedMotion() || !('IntersectionObserver' in window)) {
      counters.forEach((el) => {
        el.textContent = el.getAttribute('data-count-to') || el.textContent;
      });
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target.getAttribute('data-count-to');
            animateCounter(entry.target, target, 850);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((el) => obs.observe(el));
  }

  function initTiltEffects(root = document) {
    if (isReducedMotion() || !isFinePointer()) return;

    const tiltElements = root.querySelectorAll('[data-tilt]:not([data-tilt-bound])');
    tiltElements.forEach((el) => {
      el.setAttribute('data-tilt-bound', 'true');
      const maxTilt = Number(el.getAttribute('data-tilt-max')) || 6;
      let rafId = null;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateY = ((x - 0.5) * 2 * maxTilt).toFixed(2);
        const rotateX = ((0.5 - y) * 2 * maxTilt).toFixed(2);

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
      });

      el.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        el.style.transform = '';
      });
    });
  }

  function initTimelineProgress() {
    const timeline = document.getElementById('education-timeline');
    const progressEl = document.getElementById('timeline-progress');
    if (!timeline || !progressEl) return;

    if (isReducedMotion()) {
      progressEl.style.height = '100%';
      return;
    }

    let ticking = false;
    function updateTimeline() {
      ticking = false;
      const rect = timeline.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * 0.78;
      const total = rect.height;
      if (total <= 0) return;

      const scrolledInto = start - rect.top;
      const pct = Math.max(0, Math.min(100, (scrolledInto / total) * 100));
      progressEl.style.height = `${pct.toFixed(1)}%`;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateTimeline);
        }
      },
      { passive: true }
    );
    updateTimeline();
  }

  function initHeroParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas || isReducedMotion()) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let rafId = null;
    let isHeroVisible = true;
    const pointer = { x: null, y: null };

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targetCount = Math.min(54, Math.max(22, Math.floor((width * height) / 24000)));
      particles = Array.from({ length: targetCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
        r: Math.random() * 1.8 + 0.8
      }));
    }

    function step() {
      if (!isHeroVisible || document.hidden || isReducedMotion()) {
        rafId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const dotColor = isLight ? 'rgba(37, 99, 235, 0.48)' : 'rgba(56, 189, 248, 0.55)';
      const lineBase = isLight ? '37, 99, 235' : '99, 102, 241';

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (pointer.x !== null) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && dist < 130) {
            p.x -= (dx / dist) * 0.4;
            p.y -= (dy / dist) * 0.4;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 125) {
            const alpha = ((1 - dist / 125) * 0.22).toFixed(3);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${lineBase}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(step);
    }

    function start() {
      if (!rafId && !isReducedMotion()) {
        rafId = requestAnimationFrame(step);
      }
    }

    resize();
    start();

    window.addEventListener('resize', resize, { passive: true });
    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => {
      pointer.x = null;
      pointer.y = null;
    });

    if ('IntersectionObserver' in window) {
      const heroObs = new IntersectionObserver((entries) => {
        isHeroVisible = entries[0].isIntersecting;
        if (isHeroVisible) start();
      });
      heroObs.observe(canvas.parentElement);
    }

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && isHeroVisible) start();
    });
  }

  function initCustomCursor() {
    if (isReducedMotion() || !isFinePointer()) return;

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    document.body.classList.add('has-custom-cursor');

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafActive = false;

    function updateRing() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;

      if (Math.abs(targetX - ringX) > 0.2 || Math.abs(targetY - ringY) > 0.2) {
        requestAnimationFrame(updateRing);
      } else {
        rafActive = false;
      }
    }

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.left = `${targetX}px`;
      dot.style.top = `${targetY}px`;
      dot.classList.add('is-visible');
      ring.classList.add('is-visible');

      if (!rafActive) {
        rafActive = true;
        requestAnimationFrame(updateRing);
      }
    });

    document.addEventListener('mouseleave', () => {
      dot.classList.remove('is-visible');
      ring.classList.remove('is-visible');
    });

    document.addEventListener('mouseover', (e) => {
      const interactive = e.target.closest('a, button, select, input, [role="tab"], .gallery-item');
      ring.classList.toggle('is-hovering', Boolean(interactive));
    });
  }

  function initNavIndicator() {
    const navLinksWrap = document.getElementById('nav-links');
    const indicator = document.getElementById('nav-indicator');
    const links = Array.from(document.querySelectorAll('.nav-link'));
    const mobileLinks = Array.from(document.querySelectorAll('.mobile-nav-link'));
    if (!navLinksWrap || !indicator || !links.length) return;

    function moveIndicator(activeLink) {
      if (!activeLink || window.innerWidth < 900) {
        indicator.style.opacity = '0';
        return;
      }
      const wrapRect = navLinksWrap.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      const offsetX = linkRect.left - wrapRect.left - 1;
      indicator.style.width = `${linkRect.width}px`;
      indicator.style.transform = `translateX(${offsetX}px)`;
      indicator.style.opacity = '1';
    }

    function setActiveSection(id) {
      let activeDesktop = null;
      links.forEach((link) => {
        const match = link.getAttribute('data-section') === id;
        link.classList.toggle('is-active', match);
        if (match) activeDesktop = link;
      });
      mobileLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
      moveIndicator(activeDesktop);
    }

    const sectionIds = links.map((l) => l.getAttribute('data-section')).filter(Boolean);
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { rootMargin: '-38% 0px -52% 0px', threshold: 0 }
      );
      sections.forEach((sec) => spy.observe(sec));
    }

    window.addEventListener('resize', () => {
      const current = navLinksWrap.querySelector('.nav-link.is-active');
      moveIndicator(current);
    });

    requestAnimationFrame(() => {
      const current = navLinksWrap.querySelector('.nav-link.is-active') || links[0];
      moveIndicator(current);
    });
  }

  window.PortfolioAnimations = {
    initRevealObserver,
    observeNewReveals,
    animateCounter,
    initScrollCounters,
    initTiltEffects,
    initTimelineProgress,
    initHeroParticles,
    initCustomCursor,
    initNavIndicator
  };
})(window, document);

