/* Scroll unificado — un solo requestAnimationFrame por frame */
const ScrollBus = (() => {
  const fns = [];
  let pending = false;

  function flush() {
    pending = false;
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const docH = Math.max(document.documentElement.scrollHeight - vh, 0);
    const pct = docH > 0 ? Math.min(scrollY / docH, 1) : 0;
    for (let i = 0; i < fns.length; i += 1) fns[i](scrollY, vh, docH, pct);
    if (typeof MotionLoop !== 'undefined') MotionLoop.onScroll();
  }

  function schedule() {
    if (!pending) {
      pending = true;
      requestAnimationFrame(flush);
    }
  }

  return {
    subscribe(fn) {
      fns.push(fn);
      return () => {
        const idx = fns.indexOf(fn);
        if (idx >= 0) fns.splice(idx, 1);
      };
    },
    start() {
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      schedule();
    },
  };
})();

const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 768px)').matches;
const isCoarse = window.matchMedia('(pointer: coarse)').matches;
const lerp = (a, b, t) => a + (b - a) * t;

/* Interpolación suave — sensación premium al desplazarse */
const MotionLoop = (() => {
  const channels = [];
  let rafId = 0;
  let active = false;

  function tick() {
    let dirty = false;
    for (let i = 0; i < channels.length; i += 1) {
      if (channels[i]()) dirty = true;
    }
    if (dirty || active) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = 0;
    }
  }

  return {
    channel(step) {
      channels.push(step);
    },
    onScroll() {
      active = true;
      if (!rafId) rafId = requestAnimationFrame(tick);
    },
    start() {
      active = true;
      if (!rafId) rafId = requestAnimationFrame(tick);
    },
  };
})();

function initSparkles() {
  const layer = document.getElementById('sparkles');
  if (!layer || motionReduced) return;
  const count = isMobile ? 12 : 28;
  for (let i = 0; i < count; i += 1) {
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

  ScrollBus.subscribe((_y, _vh, _docH, pct) => {
    fill.style.transform = `scaleX(${pct})`;
  });
}

function initStaggerReveal() {
  if (motionReduced) {
    document.querySelectorAll('.reveal-stagger > *').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const staggerStep = isMobile ? 0.05 : 0.08;

  document.querySelectorAll('.reveal-stagger').forEach((container) => {
    const items = [...container.children];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          items.forEach((item, i) => {
            item.style.setProperty('--stagger', `${i * staggerStep}s`);
            item.classList.add('is-visible');
          });
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );
    obs.observe(container);
  });
}

function initParallax() {
  if (motionReduced) return;

  const items = [...document.querySelectorAll('[data-parallax]')];
  if (!items.length) return;

  const state = items.map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallax) || 0.15,
    targetY: 0,
    currentY: 0,
  }));

  const depth = isMobile ? -48 : -96;
  const smooth = motionReduced ? 1 : (isMobile ? 0.2 : 0.14);

  ScrollBus.subscribe((_scrollY, vh) => {
    state.forEach((item) => {
      const rect = item.el.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > vh + 80) return;
      const progress = (rect.top + rect.height * 0.5 - vh * 0.5) / vh;
      item.targetY = progress * item.speed * depth;
    });
    MotionLoop.onScroll();
  });

  MotionLoop.channel(() => {
    let dirty = false;
    state.forEach((item) => {
      const next = lerp(item.currentY, item.targetY, smooth);
      if (Math.abs(next - item.currentY) > 0.08) {
        item.currentY = next;
        item.el.style.transform = `translate3d(0, ${next}px, 0)`;
        dirty = true;
      } else if (Math.abs(item.targetY - item.currentY) > 0.08) {
        item.currentY = item.targetY;
        item.el.style.transform = `translate3d(0, ${item.currentY}px, 0)`;
        dirty = true;
      }
    });
    return dirty;
  });
}

function initHeroVideoScroll() {
  const hero = document.querySelector('.hero--video');
  const video = hero?.querySelector('.hero-video-bg');
  const copy = hero?.querySelector('.hero-copy--scroll');
  const stage = hero?.querySelector('.hero-stage--scroll');
  if (!hero || !video) return;

  const ensurePlay = () => {
    if (motionReduced) return;
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  ensurePlay();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) ensurePlay();
  });

  if (motionReduced) return;

  const target = {
    videoY: 0, scale: 1, fade: 1, copyY: 0, stageY: 0, stageScale: 1,
  };
  const current = { ...target };
  const smooth = isMobile ? 0.18 : 0.12;
  const useScale = !isMobile;

  ScrollBus.subscribe(() => {
    const rect = hero.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const height = Math.max(rect.height, 1);
    const progress = Math.min(Math.max(-rect.top / height, 0), 1);
    const drift = isMobile ? 72 : 140;

    target.videoY = progress * drift;
    target.scale = useScale ? 1 + progress * 0.1 : 1;
    target.fade = Math.max(0, 1 - progress * 1.1);
    target.copyY = progress * (isMobile ? -28 : -52);
    target.stageY = progress * (isMobile ? -18 : -36);
    target.stageScale = useScale ? 1 - progress * 0.035 : 1;
    MotionLoop.onScroll();
  });

  MotionLoop.channel(() => {
    let dirty = false;
    const keys = Object.keys(target);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const next = lerp(current[key], target[key], smooth);
      if (Math.abs(next - current[key]) > 0.002) {
        current[key] = next;
        dirty = true;
      }
    }
    if (!dirty) return false;

    if (useScale) {
      video.style.transform = `translate3d(0, ${current.videoY}px, 0) scale(${current.scale})`;
    } else {
      video.style.transform = `translate3d(0, ${current.videoY}px, 0)`;
    }

    if (copy) {
      copy.style.opacity = String(current.fade);
      copy.style.transform = `translate3d(0, ${current.copyY}px, 0)`;
    }

    if (stage) {
      stage.style.opacity = String(current.fade);
      if (useScale) {
        stage.style.transform = `translate3d(0, ${current.stageY}px, 0) scale(${current.stageScale})`;
      } else {
        stage.style.transform = `translate3d(0, ${current.stageY}px, 0)`;
      }
    }
    return true;
  });
}

function initSectionDrift() {
  if (motionReduced) return;

  const sections = [...document.querySelectorAll('[data-parallax-section]')];
  if (!sections.length) return;

  const state = sections.map((el) => {
    const inner = el.querySelector('.container') || el;
    return { el, inner, targetY: 0, currentY: 0 };
  });

  ScrollBus.subscribe((scrollY, vh) => {
    state.forEach(({ el }) => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height * 0.5;
      const viewCenter = vh * 0.5;
      const dist = (center - viewCenter) / vh;
      el._driftTarget = dist * (isMobile ? 8 : 18);
    });
    state.forEach((item) => {
      item.targetY = item.el._driftTarget || 0;
    });
    MotionLoop.onScroll();
  });

  MotionLoop.channel(() => {
    let dirty = false;
    state.forEach((item) => {
      const next = lerp(item.currentY, item.targetY, isMobile ? 0.16 : 0.1);
      if (Math.abs(next - item.currentY) > 0.05) {
        item.currentY = next;
        item.inner.style.transform = `translate3d(0, ${next}px, 0)`;
        dirty = true;
      }
    });
    return dirty;
  });
}

function initJusticeTilt() {
  const scene = document.getElementById('hero-justice-scene');
  const model = scene?.querySelector('.justice-3d');
  if (!scene || !model || motionReduced || isCoarse) return;

  let raf = 0;
  let targetY = 0;
  let targetX = 0;
  let currentY = 0;
  let currentX = 0;

  const apply = () => {
    currentY = lerp(currentY, targetY, 0.14);
    currentX = lerp(currentX, targetX, 0.14);
    model.style.setProperty('--tilt-y', `${currentY}deg`);
    model.style.setProperty('--tilt-x', `${currentX}deg`);
    if (Math.abs(currentY - targetY) > 0.05 || Math.abs(currentX - targetX) > 0.05) {
      raf = requestAnimationFrame(apply);
    } else {
      raf = 0;
    }
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

function bootScrollBus() {
  ScrollBus.start();
  if (!motionReduced) MotionLoop.start();
}
