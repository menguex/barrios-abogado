document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  lucide.createIcons();

  document.getElementById('year').textContent = new Date().getFullYear();

  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  const menuToggle = document.querySelector('.menu-toggle');
  const navMobile = document.querySelector('.nav-mobile');
  menuToggle?.addEventListener('click', () => {
    const open = navMobile.classList.toggle('open');
    navMobile.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.innerHTML = open
      ? '<i data-lucide="x"></i>'
      : '<i data-lucide="menu"></i>';
    lucide.createIcons();
  });

  navMobile?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('open');
      navMobile.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.innerHTML = '<i data-lucide="menu"></i>';
      lucide.createIcons();
    });
  });

  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (motionReduced) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  initGuide();
  initSliders();
  initCatalog();
  initStickyCta();
  initNavSpy();
  initCounters();
  initQuickAccess();
  initSparkles();
  initImageLoad();
  initScrollProgress();
  initStaggerReveal();
  initParallax();
  initCableSystem();
  if (typeof initPopups === 'function') initPopups();
  if (typeof initRoutes === 'function') initRoutes();
  if (typeof initContactForm === 'function') initContactForm();
  initMethodJourney();
  syncContactEmailDisplay();
});

function syncContactEmailDisplay() {
  const el = document.getElementById('contact-email-display');
  if (el && typeof CONTACT_CONFIG !== 'undefined' && CONTACT_CONFIG.email) {
    el.textContent = CONTACT_CONFIG.email;
    el.href = `mailto:${CONTACT_CONFIG.email}`;
  }
}

/* ===== MÉTODO — journey interactivo ===== */
const METHOD_PHASES = [
  {
    popup: 'metodo_escucha',
    icon: 'ear',
    title: 'Escucha',
    tagline: 'Diagnóstico honesto en 48 horas',
    lead: 'Entendemos su situación sin juzgar. Si no hay caso viable, se lo decimos antes de que invierta tiempo o dinero.',
    tags: ['48h máximo', 'Confidencial', 'Sin compromiso'],
    cards: [
      { icon: 'message-square', title: 'Primera conversación', text: 'WhatsApp o consulta guiada — sin tecnicismos ni presión.' },
      { icon: 'file-search', title: 'Revisión de documentos', text: 'Contratos, denuncias o cartas del banco analizados con criterio.' },
      { icon: 'thumbs-up', title: 'Veredicto claro', text: 'Sabe si conviene avanzar, negociar o detenerse.' },
    ],
    cta: { label: 'Empezar diagnóstico', href: 'reserva.html', icon: 'calendar-check' },
  },
  {
    popup: 'metodo_estrategia',
    icon: 'compass',
    title: 'Estrategia',
    tagline: 'Plan con hitos y costos definidos',
    lead: 'Cada paso con plazo, probabilidad y honorarios por escrito. Usted decide en cada hito si continúa.',
    tags: ['Hoja de ruta', 'Costos por etapa', 'Mediación o litigio'],
    cards: [
      { icon: 'map', title: 'Hoja de ruta', text: 'Camino completo con plazos realistas y alternativas.' },
      { icon: 'bar-chart-3', title: 'Reportes por hito', text: 'Sabe qué pasó, qué sigue y cuánto cuesta cada fase.' },
      { icon: 'git-branch', title: 'Opciones comparadas', text: 'Pros y contras de mediación, negociación o tribunal.' },
    ],
    cta: { label: 'Ver honorarios', href: '#honorarios', icon: 'badge-check' },
  },
  {
    popup: 'metodo_ejecucion',
    icon: 'gavel',
    title: 'Ejecución',
    tagline: 'Representación firme cuando corresponde',
    lead: 'Actuamos en tribunales civiles, familia y JPL con seguimiento OJV para que usted no pierda tiempo.',
    tags: ['Tribunales', 'OJV digital', 'Firmeza estratégica'],
    cards: [
      { icon: 'landmark', title: 'Representación', text: 'Civiles, familia, JPL y organismos reguladores.' },
      { icon: 'swords', title: 'Tono adecuado', text: 'Diplomacia cuando conviene; litigio firme cuando es necesario.' },
      { icon: 'monitor', title: 'Seguimiento OJV', text: 'Estado de causas sin que usted gestione trámites.' },
    ],
    cta: { label: 'Contactar estudio', href: '#contacto', icon: 'message-circle' },
  },
  {
    popup: 'metodo_resultado',
    icon: 'trophy',
    title: 'Resultado',
    tagline: 'Cierre con prevención futura',
    lead: 'El objetivo no es solo ganar el caso: es que no vuelva a ocurrir y que tenga tranquilidad a largo plazo.',
    tags: ['Restitución o acuerdo', 'Blindaje futuro', 'Aliado continuo'],
    cards: [
      { icon: 'check-circle', title: 'Objetivo cumplido', text: 'Restitución, acuerdo o sentencia según su meta inicial.' },
      { icon: 'shield-plus', title: 'Prevención', text: 'Recomendaciones para evitar que el problema se repita.' },
      { icon: 'heart-handshake', title: 'Relación continua', text: 'Muchos clientes nos eligen como aliado legal permanente.' },
    ],
    cta: { label: 'Ver casos de éxito', href: '#resultados', icon: 'trophy' },
  },
];

function initMethodJourney() {
  const journey = document.getElementById('method-journey');
  if (!journey) return;

  const steps = [...journey.querySelectorAll('.method-step-btn')];
  const railFill = document.getElementById('method-rail-fill');
  const railDots = [...journey.querySelectorAll('.method-rail-dot')];
  const panel = document.getElementById('method-panel');
  const prevBtn = document.getElementById('method-prev');
  const nextBtn = document.getElementById('method-next');
  const popupBtn = document.getElementById('method-popup-btn');
  const ctaBtn = document.getElementById('method-cta');
  const dotsWrap = document.getElementById('method-panel-dots');

  let active = 0;

  function renderDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = METHOD_PHASES.map((_, i) =>
      `<button type="button" class="method-dot${i === active ? ' is-active' : ''}" data-goto="${i}" aria-label="Fase ${i + 1}"></button>`
    ).join('');
    dotsWrap.querySelectorAll('.method-dot').forEach((d) => {
      d.addEventListener('click', () => setPhase(parseInt(d.dataset.goto, 10)));
    });
  }

  function setPhase(idx) {
    active = idx;
    const phase = METHOD_PHASES[idx];

    steps.forEach((btn, i) => {
      const selected = i === idx;
      btn.setAttribute('aria-selected', String(selected));
      btn.closest('.method-step').classList.toggle('is-active', selected);
      btn.closest('.method-step').classList.toggle('is-done', i < idx);
    });

    railDots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === idx);
      dot.classList.toggle('is-done', i < idx);
    });

    if (railFill) railFill.style.width = `${idx === 0 ? 0 : (idx / (METHOD_PHASES.length - 1)) * 100}%`;

    document.getElementById('method-phase').textContent = `Fase ${idx + 1} de ${METHOD_PHASES.length}`;
    document.getElementById('method-panel-icon').innerHTML = `<i data-lucide="${phase.icon}"></i>`;
    document.getElementById('method-panel-title').textContent = phase.title;
    document.getElementById('method-panel-tagline').textContent = phase.tagline;
    document.getElementById('method-panel-lead').textContent = phase.lead;

    const tagsEl = document.getElementById('method-panel-tags');
    tagsEl.innerHTML = phase.tags.map((t) => `<span class="method-tag"><i data-lucide="check"></i>${t}</span>`).join('');

    document.getElementById('method-panel-cards').innerHTML = phase.cards
      .map(
        (c, i) => `
        <li class="method-card" style="animation-delay:${i * 0.07}s">
          <span class="method-card-icon"><i data-lucide="${c.icon}"></i></span>
          <div>
            <h4>${c.title}</h4>
            <p>${c.text}</p>
          </div>
        </li>`
      )
      .join('');

    popupBtn.dataset.popup = phase.popup;
    ctaBtn.href = phase.cta.href;
    ctaBtn.innerHTML = `<i data-lucide="${phase.cta.icon || 'arrow-right'}"></i> ${phase.cta.label}`;

    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === METHOD_PHASES.length - 1;
    nextBtn.innerHTML = idx === METHOD_PHASES.length - 1
      ? 'Completado <i data-lucide="check"></i>'
      : 'Siguiente <i data-lucide="arrow-right"></i>';

    panel.classList.remove('is-switching');
    void panel.offsetWidth;
    panel.classList.add('is-switching');

    renderDots();
    lucide.createIcons();
  }

  steps.forEach((btn) => {
    btn.addEventListener('click', () => setPhase(parseInt(btn.dataset.method, 10)));
  });

  prevBtn?.addEventListener('click', () => setPhase(Math.max(0, active - 1)));
  nextBtn?.addEventListener('click', () => {
    if (active < METHOD_PHASES.length - 1) setPhase(active + 1);
  });

  journey.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && active < METHOD_PHASES.length - 1) {
      e.preventDefault();
      setPhase(active + 1);
    }
    if (e.key === 'ArrowLeft' && active > 0) {
      e.preventDefault();
      setPhase(active - 1);
    }
  });

  setPhase(0);
}

/* ===== CABLE COLOR — bordes y línea de scroll ===== */
function initCableSystem() {
  const cableEls = [];

  document.querySelectorAll('[data-cable-draw]').forEach((el) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'cable-stroke-svg');
    svg.setAttribute('aria-hidden', 'true');
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('pathLength', '100');
    svg.appendChild(rect);
    el.appendChild(svg);

    const size = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (!w || !h) return;
      const r = parseInt(getComputedStyle(el).borderRadius, 10) || 14;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      rect.setAttribute('x', '1.5');
      rect.setAttribute('y', '1.5');
      rect.setAttribute('width', String(Math.max(0, w - 3)));
      rect.setAttribute('height', String(Math.max(0, h - 3)));
      rect.setAttribute('rx', String(Math.min(r, w / 2, h / 2)));
    };

    size();
    cableEls.push({ el, size });
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(size);
      ro.observe(el);
    } else {
      window.addEventListener('load', size);
    }
  });

  const drawObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('cable-drawn');
          drawObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
  );
  document.querySelectorAll('[data-cable-draw]').forEach((el) => drawObs.observe(el));

  const divObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-drawn');
          divObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('[data-cable-divider]').forEach((el) => divObs.observe(el));

  const fill = document.getElementById('cable-rail-fill');
  const nodesWrap = document.getElementById('cable-rail-nodes');
  const anchors = [...document.querySelectorAll('.cable-anchor')];
  const nodes = [];

  if (nodesWrap && anchors.length) {
    anchors.forEach((section, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cable-node';
      btn.setAttribute('aria-label', section.dataset.cableLabel || `Sección ${i + 1}`);
      btn.addEventListener('click', () => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      nodesWrap.appendChild(btn);
      nodes.push({ btn, section });
    });
  }

  function updateRail() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? Math.min(window.scrollY / docH, 1) : 0;
    if (fill) fill.style.height = `${pct * 100}%`;

    const mid = window.scrollY + window.innerHeight * 0.42;
    let activeIdx = 0;
    nodes.forEach(({ section }, i) => {
      const top = section.offsetTop;
      if (top <= mid) activeIdx = i;
    });
    nodes.forEach(({ btn }, i) => btn.classList.toggle('is-active', i === activeIdx));
  }

  window.addEventListener('scroll', updateRail, { passive: true });
  window.addEventListener('load', () => {
    cableEls.forEach(({ size }) => size());
    updateRail();
  });
  updateRail();
}

/* ===== QUICK ACCESS (Turismo Ovalle) ===== */
function initQuickAccess() {
  document.querySelectorAll('.qa-item[data-filter-hint]').forEach((item) => {
    item.addEventListener('click', (e) => {
      const hint = item.dataset.filterHint;
      const btn = document.querySelector(`.filter-btn[data-filter="${hint}"]`);
      if (!btn) return;
      e.preventDefault();
      btn.click();
      document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ===== CATALOG FILTERS ===== */
function initCatalog() {
  const filters = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.service-card');
  if (!filters.length) return;

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const cat = btn.dataset.filter;
      cards.forEach((card) => {
        const match = cat === 'all' || card.dataset.cat === cat;
        card.classList.toggle('is-hidden', !match);
      });
      lucide.createIcons();
      initImageLoad();
    });
  });
}

/* ===== STICKY CTA BAR ===== */
function initStickyCta() {
  const bar = document.getElementById('sticky-cta');
  if (!bar) return;
  const showAfter = 600;

  window.addEventListener('scroll', () => {
    const visible = window.scrollY > showAfter;
    bar.classList.toggle('is-visible', visible);
    document.body.classList.toggle('sticky-visible', visible);
  }, { passive: true });
}

/* ===== NAV SCROLL SPY ===== */
function initNavSpy() {
  const links = document.querySelectorAll('[data-nav]');
  const sections = [...links].map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach((s) => observer.observe(s));
}

/* ===== COUNTER ANIMATION ===== */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const run = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.count === '100' ? '%' : el.dataset.count === '48' ? 'h' : '';
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        run(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((c) => obs.observe(c));
}

/* ===== PRELOADER (2s) ===== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloader-fill');
  if (!preloader) return;

  const duration = 2000;
  const start = performance.now();

  function tick(now) {
    const pct = Math.min((now - start) / duration, 1);
    fill.style.width = `${pct * 100}%`;
    if (pct < 1) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(() => {
        preloader.classList.add('is-done');
        document.body.classList.remove('is-loading');
      }, 150);
    }
  }

  requestAnimationFrame(tick);
}

/* ===== SLIDERS & GALERÍA ===== */
function initSliders() {
  const portraitSlides = [...document.querySelectorAll('.hero-portrait-slide')];
  const bgSlides = [...document.querySelectorAll('.hero-bg-slide')];
  const dotsWrap = document.getElementById('hero-slide-dots');
  let heroIdx = 0;

  if (portraitSlides.length > 1 && dotsWrap) {
    portraitSlides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Imagen ${i + 1}`);
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goHeroSlide(i));
      dotsWrap.appendChild(dot);
    });

    setInterval(() => goHeroSlide((heroIdx + 1) % portraitSlides.length), 5000);
  }

  function goHeroSlide(index) {
    if (portraitSlides.length < 2) return;
    heroIdx = index;
    portraitSlides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    bgSlides.forEach((s, i) => s.classList.toggle('is-active', i === index % bgSlides.length));
    dotsWrap?.querySelectorAll('button').forEach((d, i) => d.classList.toggle('is-active', i === index));
    document.querySelectorAll('.hero-thumb').forEach((t, i) => t.classList.toggle('is-active', i === index));
  }

  document.querySelectorAll('.hero-thumb').forEach((thumb, i) => {
    thumb.addEventListener('click', () => goHeroSlide(i));
  });

  const philoImgs = [...document.querySelectorAll('#philosophy-slider img')];
  let philoIdx = 0;
  if (philoImgs.length > 1) {
    setInterval(() => {
      philoImgs[philoIdx].classList.remove('is-active');
      philoIdx = (philoIdx + 1) % philoImgs.length;
      philoImgs[philoIdx].classList.add('is-active');
    }, 4500);
  }

  const ctaSlides = [...document.querySelectorAll('.cta-slide')];
  let ctaIdx = 0;
  if (ctaSlides.length > 1) {
    setInterval(() => {
      ctaSlides[ctaIdx].classList.remove('is-active');
      ctaIdx = (ctaIdx + 1) % ctaSlides.length;
      ctaSlides[ctaIdx].classList.add('is-active');
    }, 6000);
  }
}

/* ===== GUÍA INTERACTIVA (datos en shared-guide.js) ===== */
function initGuide() {
  const chat = document.getElementById('guide-chat');
  const stage = document.getElementById('guide-stage');
  const result = document.getElementById('guide-result');
  const optionsEl = document.getElementById('guide-options');
  const questionEl = document.getElementById('guide-question');
  const trail = document.getElementById('guide-trail');
  const progressFill = document.getElementById('guide-progress-fill');
  const stepLabel = document.getElementById('guide-step-label');
  const progressPct = document.getElementById('guide-progress-pct');
  const progressBar = document.querySelector('.guide-progress-bar');
  const restartBtn = document.getElementById('guide-restart');

  if (!chat) return;

  const state = { step: 0, answers: {}, history: [] };

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function showTyping() {
    const typing = document.getElementById('guide-typing');
    if (typing) typing.style.display = 'block';
  }

  function hideTyping() {
    const typing = document.getElementById('guide-typing');
    if (typing) typing.style.display = 'none';
  }

  function addBubble(text, type) {
    hideTyping();
    const bubble = document.createElement('div');
    bubble.className = `guide-bubble guide-bubble-${type}`;
    bubble.textContent = text;
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
    return bubble;
  }

  function updateProgress(pct, stepNum) {
    progressFill.style.width = `${pct}%`;
    progressPct.textContent = `${pct}%`;
    stepLabel.textContent = stepNum < 3 ? `Paso ${stepNum} de 3` : 'Recomendación lista';
    progressBar.setAttribute('aria-valuenow', String(pct));
  }

  function addTrail(label, active) {
    const li = document.createElement('li');
    if (active) li.classList.add('active');
    li.innerHTML = `<i data-lucide="check"></i><span>${label}</span>`;
    trail.appendChild(li);
    lucide.createIcons();
  }

  async function showAiMessage(text) {
    showTyping();
    await delay(700 + Math.random() * 400);
    addBubble(text, 'ai');
    await delay(300);
  }

  async function renderStep() {
    stage.hidden = false;
    result.hidden = true;
    stage.style.animation = 'none';
    stage.offsetHeight;
    stage.style.animation = '';

    const step = GUIDE_STEPS[state.step];
    updateProgress(step.progress, state.step + 1);

    let aiText = step.aiIntro;
    if (state.step > 0 && step.aiFollow) {
      const prev = state.answers.emotion;
      aiText = step.aiFollow[prev] || step.aiFollow.default;
    }

    await showAiMessage(aiText);
    questionEl.textContent = step.question;

    optionsEl.innerHTML = '';
    step.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'guide-option' + (opt.wide ? ' guide-option-wide' : '');
      btn.setAttribute('role', 'option');
      btn.innerHTML = `
        <span class="guide-option-icon"><i data-lucide="${opt.icon}"></i></span>
        <span class="guide-option-text">
          <strong>${opt.label}</strong>
          <span>${opt.sub}</span>
        </span>`;
      btn.addEventListener('click', () => selectOption(opt, btn));
      optionsEl.appendChild(btn);
    });
    lucide.createIcons();
  }

  async function selectOption(opt, btn) {
    optionsEl.querySelectorAll('.guide-option').forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');
    await delay(280);

    const step = GUIDE_STEPS[state.step];
    state.answers[step.id] = opt.value;
    state.history.push({ step: step.id, label: opt.label });
    addBubble(opt.label, 'user');
    addTrail(opt.label, true);
    trail.querySelectorAll('li').forEach((li, i) => {
      if (i < trail.children.length - 1) li.classList.remove('active');
    });

    stage.hidden = true;
    state.step += 1;

    if (state.step < GUIDE_STEPS.length) {
      await delay(400);
      await renderStep();
    } else {
      await delay(500);
      await showResult();
    }
  }

  async function showResult() {
    stage.hidden = true;
    result.hidden = false;
    updateProgress(100, 3);

    const { emotion, situation, need } = state.answers;
    const area = AREA_RESULTS[situation];
    const empathy = EMOTION_EMPATHY[emotion];
    const urgency = getUrgency(emotion, situation, need);

    await showAiMessage(buildResultMessage(area, need));

    document.getElementById('result-urgency').textContent = urgency.label;
    document.getElementById('result-urgency').className = `result-badge ${urgency.class}`;
    document.getElementById('result-icon').innerHTML = `<i data-lucide="${area.icon}"></i>`;
    document.getElementById('result-title').textContent = area.title;
    document.getElementById('result-empathy').textContent = empathy;
    document.getElementById('result-summary').textContent = area.summary;

    const stepsEl = document.getElementById('result-steps');
    stepsEl.innerHTML = area.steps.map((s) => `<li>${s}</li>`).join('');

    const waText = buildWaMessage(state.answers);
    document.getElementById('result-wa').href =
      `https://wa.me/56958104264?text=${encodeURIComponent(waText)}`;

    lucide.createIcons();
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  async function restart() {
    state.step = 0;
    state.answers = {};
    state.history = [];
    chat.innerHTML = '<div class="guide-bubble guide-bubble-ai" id="guide-typing"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
    trail.innerHTML = '';
    result.hidden = true;
    updateProgress(0, 1);
    await delay(200);
    await renderStep();
  }

  restartBtn?.addEventListener('click', restart);

  renderStep();
}
