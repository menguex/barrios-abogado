function initSparkles() {
  const layer = document.getElementById('sparkles');
  if (!layer) return;
  const count = window.innerWidth < 768 ? 18 : 32;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.animationDelay = `${Math.random() * 5}s`;
    s.style.animationDuration = `${2.5 + Math.random() * 4}s`;
    if (Math.random() > 0.6) s.classList.add('sparkle--sky');
    if (Math.random() > 0.85) s.classList.add('sparkle--lg');
    layer.appendChild(s);
  }
}

function initImageLoad() {
  document.querySelectorAll('.img-wrap img').forEach((img) => {
    const wrap = img.closest('.img-wrap');
    const markLoaded = () => wrap?.classList.add('is-loaded');
    const markError = () => wrap?.classList.add('is-error');

    if (img.complete && img.naturalWidth > 0) markLoaded();
    else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', markError, { once: true });
    }
  });
}

function initScrollProgress() {
  const fill = document.getElementById('scroll-progress-fill');
  if (!fill) return;

  let ticking = false;

  const update = () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? Math.min(window.scrollY / docH, 1) : 0;
    fill.style.width = `${pct * 100}%`;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

function initStaggerReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-stagger > *').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  document.querySelectorAll('.reveal-stagger').forEach((container) => {
    const items = [...container.children];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          items.forEach((item, i) => {
            item.style.setProperty('--stagger', `${i * 0.07}s`);
            item.classList.add('is-visible');
          });
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    obs.observe(container);
  });
}

function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const items = [...document.querySelectorAll('[data-parallax]')];
  if (!items.length) return;

  const state = items.map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallax) || 0.15,
  }));

  let ticking = false;

  const update = () => {
    const vh = window.innerHeight;
    state.forEach(({ el, speed }) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > vh + 80) return;
      const progress = (rect.top + rect.height * 0.5 - vh * 0.5) / vh;
      const y = progress * speed * -90;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    });
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}
