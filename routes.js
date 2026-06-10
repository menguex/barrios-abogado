/* ===== SISTEMA DE RUTAS — navegación interna y entre páginas ===== */
const ROUTE_MAP = {
  inicio: 'inicio',
  guia: 'guia',
  filosofia: 'filosofia',
  servicios: 'servicios',
  metodo: 'metodo',
  honorarios: 'honorarios',
  resultados: 'resultados',
  contacto: 'contacto',
  'plan-inicial': 'plan-inicial',
  'plan-completo': 'plan-completo',
  'plan-corporativo': 'plan-corporativo',
};

const FILTER_ALIAS = {
  patrimonio: 'patrimonio',
  patrimonial: 'patrimonio',
  familia: 'familia',
  urgente: 'urgente',
  fraude: 'urgente',
  empresa: 'empresa',
  corporativo: 'empresa',
  consumidor: 'patrimonio',
  notarial: 'patrimonio',
};

function getHeaderOffset() {
  const header = document.querySelector('.site-header');
  const announce = document.querySelector('.announce-bar');
  return (header?.offsetHeight || 72) + (announce?.offsetHeight || 0) + 12;
}

function closeModalIfOpen() {
  const modal = document.getElementById('info-modal');
  if (!modal?.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function closeMobileNav() {
  const nav = document.querySelector('.nav-mobile');
  const toggle = document.querySelector('.menu-toggle');
  if (!nav?.classList.contains('open')) return;
  nav.classList.remove('open');
  nav.hidden = true;
  toggle?.setAttribute('aria-expanded', 'false');
  if (toggle) toggle.innerHTML = '<i data-lucide="menu"></i>';
  lucide.createIcons();
}

function applyCatalogFilter(filter) {
  const cat = FILTER_ALIAS[filter] || filter;
  const btn = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('is-active'));
  btn.classList.add('is-active');
  document.querySelectorAll('.service-card').forEach((card) => {
    const match = cat === 'all' || card.dataset.cat === cat;
    card.classList.toggle('is-hidden', !match);
  });
  lucide.createIcons();
}

function flashTarget(el) {
  if (!el) return;
  el.classList.remove('route-highlight');
  void el.offsetWidth;
  el.classList.add('route-highlight');
  window.setTimeout(() => el.classList.remove('route-highlight'), 2400);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
}

let smoothScrollRaf = 0;

function smoothScrollTo(targetY, duration = 920) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, targetY);
    return;
  }
  if (smoothScrollRaf) cancelAnimationFrame(smoothScrollRaf);

  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(t));
    if (t < 1) {
      smoothScrollRaf = requestAnimationFrame(step);
    } else {
      smoothScrollRaf = 0;
    }
  }

  smoothScrollRaf = requestAnimationFrame(step);
}

function scrollToSection(id, highlightEl) {
  const section = document.getElementById(id);
  if (!section) return false;
  const target = highlightEl || section;
  const top = section.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  smoothScrollTo(Math.max(0, top));
  flashTarget(target);
  return true;
}

function parseHref(href) {
  if (!href) return null;
  const raw = href.trim();
  if (raw.startsWith('#')) {
    const body = raw.slice(1);
    const [section, filter] = body.includes('/')
      ? body.split('/')
      : body.includes(':')
        ? body.split(':')
        : [body, null];
    return { page: null, section: ROUTE_MAP[section] || section, filter };
  }
  const url = new URL(raw, window.location.href);
  const section = url.hash ? url.hash.slice(1).split(/[/:]/)[0] : null;
  const filterPart = url.hash ? url.hash.slice(1).split(/[/:]/)[1] : null;
  const samePage = url.pathname === window.location.pathname
    || url.pathname.endsWith(window.location.pathname.split('/').pop());
  return {
    page: samePage ? null : url.pathname.split('/').pop(),
    section: section ? (ROUTE_MAP[section] || section) : null,
    filter: filterPart,
    full: raw,
  };
}

function navigateTo(href, options = {}) {
  const route = parseHref(href);
  if (!route) return;

  if (route.page && route.page !== window.location.pathname.split('/').pop()) {
    window.location.href = route.full || href;
    return;
  }

  closeModalIfOpen();
  closeMobileNav();

  if (route.filter) applyCatalogFilter(route.filter);

  const sectionId = route.section;
  if (!sectionId) return;

  if (!options.skipHash && href.startsWith('#')) {
    history.pushState(null, '', `#${sectionId}${route.filter ? `/${route.filter}` : ''}`);
  }

  const highlightSelectors = {
    honorarios: '.price-card-featured, #honorarios .section-head',
    'plan-inicial': '#plan-inicial',
    'plan-completo': '#plan-completo',
    'plan-corporativo': '#plan-corporativo',
    servicios: route.filter ? `.service-card[data-cat="${FILTER_ALIAS[route.filter] || route.filter}"]` : '#servicios .section-head',
  };

  const highlightSel = highlightSelectors[sectionId];
  const highlightEl = highlightSel ? document.querySelector(highlightSel) : null;

  if (!scrollToSection(sectionId, highlightEl)) {
    if (href.includes('index.html') || sectionId) {
      window.location.href = `index.html#${sectionId}${route.filter ? `/${route.filter}` : ''}`;
    }
  }
}

function initRoutes() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link || link.target === '_blank') return;

    const href = link.getAttribute('href');
    if (!href) return;

    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('https://wa.me')) return;

    if (href.startsWith('#')) {
      e.preventDefault();
      const parsed = parseHref(href);
      const filter = link.dataset.routeFilter || parsed?.filter || null;
      if (filter) applyCatalogFilter(filter);
      navigateTo(href, { skipHash: false });
      return;
    }

    if (href.includes('#') && !href.startsWith('http')) {
      const [page] = href.split('#');
      const current = window.location.pathname.split('/').pop() || 'index.html';
      if (!page || page === current || page === '') {
        e.preventDefault();
        navigateTo(href.slice(href.indexOf('#')));
      }
    }
  });

  document.getElementById('modal-footer')?.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link || link.target === '_blank') return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') && !href.includes('#')) return;
    if (href.startsWith('#') || (href.includes('#') && !href.startsWith('http'))) {
      e.preventDefault();
      closeModalIfOpen();
      if (href.startsWith('#')) navigateTo(href);
      else window.location.href = href;
    } else if (!href.startsWith('http')) {
      e.preventDefault();
      closeModalIfOpen();
      window.location.href = href;
    }
  });

  document.querySelectorAll('[data-route-filter]').forEach((el) => {
    el.addEventListener('click', () => {
      const filter = el.dataset.routeFilter;
      if (filter) applyCatalogFilter(filter);
    });
  });

  const hash = window.location.hash;
  if (hash) {
    window.setTimeout(() => {
      const parts = hash.slice(1).split(/[/:]/);
      const section = parts[0];
      const filter = parts[1];
      if (filter) applyCatalogFilter(filter);
      navigateTo(`#${section}`, { skipHash: true });
    }, 400);
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash) navigateTo(window.location.hash, { skipHash: true });
  });
}
