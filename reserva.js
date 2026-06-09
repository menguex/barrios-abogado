document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initSparkles();
  document.getElementById('year').textContent = new Date().getFullYear();
  if (typeof initPopups === 'function') initPopups();
  if (typeof initRoutes === 'function') initRoutes();
  initReservaFlow();

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.setProperty('--delay', `${i * 0.06}s`);
    requestAnimationFrame(() => el.classList.add('visible'));
  });
});

function initReservaFlow() {
  const chat = document.getElementById('reserva-chat');
  const stage = document.getElementById('reserva-stage');
  const form = document.getElementById('reserva-form');
  const result = document.getElementById('reserva-result');
  const optionsEl = document.getElementById('reserva-options');
  const questionEl = document.getElementById('reserva-question');
  const navItems = [...document.querySelectorAll('.reserva-steps-nav li')];
  const progressFill = document.getElementById('reserva-progress-fill');
  const progressBar = document.getElementById('reserva-progress-bar');
  const stepLabel = document.getElementById('reserva-step-label');
  const progressPct = document.getElementById('reserva-progress-pct');
  const ringFill = document.getElementById('reserva-ring-fill');
  const ringPct = document.getElementById('reserva-ring-pct');
  const restartBtn = document.getElementById('reserva-restart');
  const backBtn = document.getElementById('reserva-back');
  const formError = document.getElementById('reserva-form-error');

  const TOTAL = 5;
  const RING_LEN = 2 * Math.PI * 34;
  const state = { step: 0, answers: {}, contact: {} };

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  function setNav(idx) {
    navItems.forEach((li, i) => {
      li.classList.toggle('is-active', i === idx);
      li.classList.toggle('is-done', i < idx);
      const marker = li.querySelector('.step-marker');
      if (marker) {
        marker.innerHTML = i < idx ? '<i data-lucide="check"></i>' : String(i + 1);
      }
    });
    lucide.createIcons();
  }

  function updateProgress(pct, label) {
    progressFill.style.width = `${pct}%`;
    progressPct.textContent = `${pct}%`;
    stepLabel.textContent = label;
    progressBar?.setAttribute('aria-valuenow', String(pct));
    ringPct.textContent = `${pct}%`;
    if (ringFill) {
      ringFill.style.strokeDasharray = `${RING_LEN}`;
      ringFill.style.strokeDashoffset = `${RING_LEN * (1 - pct / 100)}`;
    }
  }

  function showPanel(panel) {
    [stage, form, result].forEach((el) => {
      if (!el) return;
      const show = el === panel;
      el.hidden = !show;
      el.classList.toggle('is-entering', show);
    });
  }

  function addBubble(text, type) {
    const typing = document.getElementById('reserva-typing');
    if (typing) typing.style.display = 'none';
    const b = document.createElement('div');
    b.className = `guide-bubble guide-bubble-${type}`;
    b.textContent = text;
    chat.appendChild(b);
    chat.scrollTop = chat.scrollHeight;
  }

  async function showAi(text) {
    const typing = document.getElementById('reserva-typing');
    if (typing) typing.style.display = 'block';
    chat.scrollTop = chat.scrollHeight;
    await delay(550 + Math.random() * 300);
    addBubble(text, 'ai');
    await delay(180);
  }

  function renderOptions(step) {
    optionsEl.innerHTML = '';
    step.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'guide-option' + (opt.wide ? ' guide-option-wide' : '');
      btn.style.animationDelay = `${i * 0.05}s`;
      btn.innerHTML = `
        <span class="guide-option-icon"><i data-lucide="${opt.icon}"></i></span>
        <span class="guide-option-text"><strong>${opt.label}</strong><span>${opt.sub}</span></span>`;
      btn.addEventListener('click', () => pickOption(opt, step, btn));
      optionsEl.appendChild(btn);
    });
    lucide.createIcons();
  }

  async function pickOption(opt, step, btn) {
    optionsEl.querySelectorAll('.guide-option').forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');
    await delay(220);
    state.answers[step.id] = opt.value;
    addBubble(opt.label, 'user');
    state.step += 1;
    await delay(320);
    await next();
  }

  async function renderGuideStep(idx) {
    showPanel(stage);
    const step = GUIDE_STEPS[idx];
    setNav(idx);
    updateProgress(step.progress, `Paso ${idx + 1} de ${TOTAL}`);
    let aiText = step.aiIntro;
    if (idx > 0 && step.aiFollow) {
      aiText = step.aiFollow[state.answers.emotion] || step.aiFollow.default;
    }
    await showAi(aiText);
    questionEl.textContent = step.question;
    renderOptions(step);
  }

  async function showFormStep() {
    showPanel(form);
    setNav(3);
    updateProgress(80, `Paso 4 de ${TOTAL}`);
    formError.hidden = true;
    await showAi('Perfecto. Solo necesito sus datos de contacto para que Felipe Barrios Callejas le responda directamente.');
    form.querySelector('input[name="name"]')?.focus();
  }

  function buildPlanSteps(area) {
    const icons = ['search', 'compass', 'gavel'];
    return area.steps.map((text, i) => ({
      icon: icons[i] || 'check',
      text,
    }));
  }

  async function showFinal() {
    showPanel(result);
    setNav(4);
    updateProgress(100, 'Solicitud lista');

    const { emotion, situation, need } = state.answers;
    const area = AREA_RESULTS[situation];
    const urgency = getUrgency(emotion, situation, need);

    await showAi(buildResultMessage(area, need));

    const urgencyEl = document.getElementById('reserva-urgency');
    urgencyEl.textContent = urgency.label;
    urgencyEl.className = `result-badge ${urgency.class}`;
    document.getElementById('reserva-icon').innerHTML = `<i data-lucide="${area.icon}"></i>`;
    document.getElementById('reserva-title').textContent = area.title;
    document.getElementById('reserva-empathy').textContent = EMOTION_EMPATHY[emotion];
    document.getElementById('reserva-summary').textContent = area.summary;

    const plan = buildPlanSteps(area);
    document.getElementById('reserva-plan').innerHTML = plan
      .map(
        (s, i) => `
        <li>
          <span class="reserva-plan-num">${String(i + 1).padStart(2, '0')}</span>
          <span class="reserva-plan-icon"><i data-lucide="${s.icon}"></i></span>
          <span>${s.text}</span>
        </li>`
      )
      .join('');

    const c = state.contact;
    document.getElementById('reserva-contact-summary').innerHTML = `
      <h4><i data-lucide="clipboard-list"></i> Tu solicitud</h4>
      <div class="reserva-summary-rows">
        <p><i data-lucide="user"></i><span><strong>${c.name}</strong></span></p>
        <p><i data-lucide="smartphone"></i><span>${c.phone}</span></p>
        ${c.email ? `<p><i data-lucide="mail"></i><span>${c.email}</span></p>` : ''}
        <p><i data-lucide="calendar-clock"></i><span class="reserva-meta">${c.slot}</span></p>
        ${c.detail ? `<p class="reserva-summary-detail"><i data-lucide="file-text"></i><span>${c.detail}</span></p>` : ''}
      </div>`;

    const waText = buildWaMessage(state.answers, state.contact);
    document.getElementById('reserva-wa').href =
      `https://wa.me/56958104264?text=${encodeURIComponent('Hola. Solicito reservar consulta.\n\n' + waText)}`;

    lucide.createIcons();
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  async function next() {
    if (state.step < GUIDE_STEPS.length) {
      await renderGuideStep(state.step);
    } else if (state.step === GUIDE_STEPS.length) {
      await showFormStep();
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get('name').toString().trim();
    const phone = fd.get('phone').toString().trim();

    if (!name || !phone) {
      formError.hidden = false;
      form.querySelector(!name ? 'input[name="name"]' : 'input[name="phone"]')?.focus();
      return;
    }

    formError.hidden = true;
    state.contact = {
      name,
      phone,
      email: fd.get('email').toString().trim(),
      slot: fd.get('slot').toString(),
      detail: fd.get('detail').toString().trim(),
    };
    addBubble(`${state.contact.name} · ${state.contact.phone}`, 'user');
    state.step += 1;
    await delay(380);
    await showFinal();
  });

  backBtn?.addEventListener('click', async () => {
    state.step = GUIDE_STEPS.length - 1;
    await renderGuideStep(state.step);
  });

  restartBtn?.addEventListener('click', async () => {
    state.step = 0;
    state.answers = {};
    state.contact = {};
    form.reset();
    formError.hidden = true;
    chat.innerHTML =
      '<div class="guide-bubble guide-bubble-ai" id="reserva-typing"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
    result.hidden = true;
    await delay(200);
    await renderGuideStep(0);
  });

  renderGuideStep(0);
}
