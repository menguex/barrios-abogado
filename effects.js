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

function initHeroVideoScroll() {
  const hero = document.querySelector('.hero--video');
  const video = hero?.querySelector('.hero-video-bg');
  const copy = hero?.querySelector('.hero-copy--scroll');
  const stage = hero?.querySelector('.hero-stage--scroll');
  if (!hero || !video) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ensurePlay = () => {
    if (reduced) return;
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  ensurePlay();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) ensurePlay();
  });

  if (reduced) return;

  let ticking = false;

  const update = () => {
    const rect = hero.getBoundingClientRect();
    const height = Math.max(rect.height, 1);
    const progress = Math.min(Math.max(-rect.top / height, 0), 1);
    const parallaxY = progress * 140;
    const scale = 1 + progress * 0.1;
    const fade = Math.max(0, 1 - progress * 1.12);

    video.style.transform = `translate3d(0, ${parallaxY}px, 0) scale(${scale})`;

    if (copy) {
      copy.style.opacity = String(fade);
      copy.style.transform = `translate3d(0, ${progress * -48}px, 0)`;
    }

    if (stage) {
      stage.style.opacity = String(fade);
      stage.style.transform = `translate3d(0, ${progress * -32}px, 0) scale(${1 - progress * 0.03})`;
    }

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

function initJusticeTilt() {
  const scene = document.getElementById('hero-justice-scene');
  const model = scene?.querySelector('.justice-3d');
  if (!scene || !model || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let raf = 0;
  let targetY = 0;
  let targetX = 0;

  const apply = () => {
    model.style.setProperty('--tilt-y', `${targetY}deg`);
    model.style.setProperty('--tilt-x', `${targetX}deg`);
    raf = 0;
  };

  scene.addEventListener('pointermove', (e) => {
    const rect = scene.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    targetY = nx * 22;
    targetX = ny * -10;
    if (!raf) raf = requestAnimationFrame(apply);
  }, { passive: true });

  scene.addEventListener('pointerleave', () => {
    targetY = 0;
    targetX = 0;
    if (!raf) raf = requestAnimationFrame(apply);
  });
}
