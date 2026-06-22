/* Chat asesor — widget flotante integrado (motor local + API opcional) */
function initLegalChat() {
  const root = document.getElementById('legal-chat-root');
  if (!root || typeof CHAT_SERVICES === 'undefined') return;

  const state = {
    open: false,
    busy: false,
    history: [],
    lastService: null,
    triageStep: 0,
    triageAnswers: {},
    userNeed: null,
    useApi: true,
    situationNote: '',
  };

  const els = {
    launcher: root.querySelector('[data-chat-launcher]'),
    panel: root.querySelector('[data-chat-panel]'),
    close: root.querySelector('[data-chat-close]'),
    messages: root.querySelector('[data-chat-messages]'),
    form: root.querySelector('[data-chat-form]'),
    input: root.querySelector('[data-chat-input]'),
    chips: root.querySelector('[data-chat-chips]'),
    status: root.querySelector('[data-chat-status]'),
  };

  function waLink(text) {
    return `${CHAT_CONFIG.waBase}?text=${encodeURIComponent(text)}`;
  }

  function counselName() {
    return typeof COUNSEL_CONFIG !== 'undefined' ? COUNSEL_CONFIG.fullName : CHAT_CONFIG.counsel;
  }

  function scrollMessages() {
    requestAnimationFrame(() => {
      els.messages.scrollTop = els.messages.scrollHeight;
    });
  }

  function setBusy(on) {
    state.busy = on;
    els.input.disabled = on;
    els.form.querySelector('button[type="submit"]').disabled = on;
    els.status.textContent = on ? 'Redactando opinión…' : 'Abogado disponible';
  }

  function pushMessage(role, html, meta = {}) {
    const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    state.history.push({ role, content: plain, meta });
    if (role === 'user' && plain.length > 12) {
      state.situationNote = plain.slice(0, 220);
    }

    const wrap = document.createElement('div');
    wrap.className = `legal-chat-msg legal-chat-msg--${role}`;
    if (role === 'ai') {
      wrap.innerHTML = `
        <div class="legal-chat-msg-avatar" aria-hidden="true">
          <img src="logo-barrios.png" alt="" width="28" height="28">
        </div>
        <div class="legal-chat-msg-body">${html}</div>`;
    } else {
      wrap.innerHTML = `<div class="legal-chat-msg-body">${html}</div>`;
    }
    els.messages.appendChild(wrap);
    scrollMessages();
    return wrap;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'legal-chat-msg legal-chat-msg--ai legal-chat-msg--typing';
    el.dataset.typing = '1';
    el.innerHTML = `
      <div class="legal-chat-msg-avatar" aria-hidden="true">
        <img src="logo-barrios.png" alt="" width="28" height="28">
      </div>
      <div class="legal-chat-msg-body"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
    els.messages.appendChild(el);
    scrollMessages();
    return el;
  }

  function removeTyping() {
    els.messages.querySelector('[data-typing="1"]')?.remove();
  }

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function deliverReply(html, chips = [], minMs = 500) {
    setBusy(true);
    showTyping();
    await delay(Math.min(1600, minMs + Math.min(html.length, 400) * 6));
    removeTyping();
    pushMessage('ai', html);
    renderChips(chips);
    setBusy(false);
    lucide.createIcons();
  }

  function renderChips(items) {
    els.chips.innerHTML = '';
    (items || []).forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'legal-chat-chip';
      if (item.urgent) btn.classList.add('legal-chat-chip--urgent');
      if (item.icon) {
        btn.innerHTML = `<i data-lucide="${item.icon}"></i><span>${item.label}</span>`;
      } else {
        btn.textContent = item.label;
      }
      btn.addEventListener('click', () => handleAction(item.action || item.id, item.label));
      els.chips.appendChild(btn);
    });
    lucide.createIcons();
  }

  function serviceChips(limit = 6) {
    return CHAT_SERVICES.slice(0, limit).map((s) => ({
      label: s.label,
      icon: s.icon,
      action: `service:${s.id}`,
      urgent: !!s.urgent,
    }));
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function detectEmotion(text) {
    if (typeof CHAT_EMOTION_PATTERNS === 'undefined') return null;
    const hit = CHAT_EMOTION_PATTERNS.find((e) => e.re.test(text));
    return hit?.key || null;
  }

  function detectUrgency(text, service) {
    if (service?.urgent) return true;
    if (typeof CHAT_URGENCY_PATTERNS === 'undefined') return false;
    return CHAT_URGENCY_PATTERNS.some((re) => re.test(text));
  }

  function empathyLine(emotion) {
    if (typeof EMOTION_EMPATHY === 'undefined' || !emotion) return '';
    const line = EMOTION_EMPATHY[emotion];
    return line ? `<p class="legal-chat-empathy">${line}</p>` : '';
  }

  function urgencyBadge(urgent) {
    if (!urgent) return '';
    return '<span class="legal-chat-route-badge legal-chat-route-badge--urgent">Prioridad alta</span>';
  }

  function stepsBlock(serviceId) {
    const area = typeof AREA_RESULTS !== 'undefined' ? AREA_RESULTS[serviceId] : null;
    if (!area?.steps?.length) return '';
    const items = area.steps
      .slice(0, 3)
      .map((step, i) => `<li><span>${i + 1}</span>${escapeHtml(step)}</li>`)
      .join('');
    return `<div class="legal-chat-route"><strong>III. Ruta procesal sugerida</strong><ol class="legal-chat-steps">${items}</ol></div>`;
  }

  function ctaBlock(serviceId, extraWa) {
    const svc = serviceId ? CHAT_SERVICES.find((s) => s.id === serviceId) : null;
    const note = state.situationNote ? ` Contexto: ${state.situationNote.slice(0, 120)}.` : '';
    const waText =
      extraWa ||
      (svc
        ? `Hola. Consulté el asesor digital sobre ${svc.label}.${note} Quisiera orientación de ${counselName()}.`
        : `Hola. Consulté el asesor digital de ${CHAT_CONFIG.firm}.${note} Quisiera agendar orientación.`);
    return `
      <div class="legal-chat-cta">
        <a href="reserva.html" class="btn btn-primary btn-sm"><i data-lucide="calendar-check"></i> Reservar consulta</a>
        <a href="${waLink(waText)}" class="btn btn-wa btn-sm" target="_blank" rel="noopener"><i data-lucide="message-circle"></i> WhatsApp</a>
        <a href="#guia" class="btn btn-ghost btn-sm legal-chat-link-guia"><i data-lucide="sparkles"></i> Guía 3 pasos</a>
      </div>`;
  }

  function proIntro() {
    if (typeof CHAT_VOICE !== 'undefined') {
      return `<p>${CHAT_VOICE.intro(CHAT_CONFIG.firm, counselName())}</p>`;
    }
    return `<p>Estimado(a) consultante: le saluda la <strong>asesoría preliminar de ${CHAT_CONFIG.firm}</strong>.</p>`;
  }

  function needLine(need) {
    if (!need || typeof CHAT_VOICE === 'undefined') return '';
    const text = CHAT_VOICE.need[need];
    return text ? `<p>${text}</p>` : '';
  }

  function detectService(text) {
    const t = text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
    let best = null;
    let score = 0;
    CHAT_SERVICES.forEach((svc) => {
      let s = 0;
      svc.keywords.forEach((kw) => {
        const k = kw.normalize('NFD').replace(/\p{M}/gu, '');
        if (t.includes(k)) s += k.length > 6 ? 3 : k.length > 4 ? 2 : 1;
      });
      if (s > score) {
        score = s;
        best = svc;
      }
    });
    return score > 0 ? best : null;
  }

  function isBoundaryQuestion(text) {
    return CHAT_BOUNDARY_PATTERNS.some((re) => re.test(text));
  }

  function buildServiceReply(svc, text, options = {}) {
    state.lastService = svc.id;
    const area = typeof AREA_RESULTS !== 'undefined' ? AREA_RESULTS[svc.id] : null;
    const emotion = detectEmotion(text);
    const urgent = detectUrgency(text, svc);
    const title = area?.title || svc.label;
    const summary = area?.summary || svc.teaser;
    const need = state.userNeed || options.need;
    const clarify =
      !options.skipClarify && svc.clarify && !state.triageAnswers.clarified
        ? `<p class="legal-chat-clarify"><strong>Antecedente que requiero:</strong> ${svc.clarify}</p>`
        : '';

    return {
      html: `${proIntro()}
        ${empathyLine(emotion)}
        <div class="legal-chat-route">
          ${urgencyBadge(urgent)}
          <strong>I. Opinión preliminar · ${escapeHtml(title)}</strong>
          <p>Desde una perspectiva jurídica general, su relato se enmarca en <em>${escapeHtml(title.toLowerCase())}</em>. ${escapeHtml(summary.split('.').slice(0, 2).join('.') + '.')}</p>
        </div>
        ${needLine(need)}
        ${stepsBlock(svc.id)}
        <p><strong>II. Consideración del estudio.</strong> ${svc.nextStep}</p>
        ${clarify}
        <p class="legal-chat-muted">${CHAT_CONFIG.disclaimer}</p>
        <p class="legal-chat-signoff">${typeof CHAT_VOICE !== 'undefined' ? CHAT_VOICE.cierre : ''}</p>
        ${ctaBlock(svc.id)}`,
      chips: [
        { label: 'Ver en servicios', action: `filter:${svc.filter}` },
        ...(clarify ? [{ label: 'Ya tengo documentos', action: `clarify:${svc.id}:yes` }] : []),
        { label: 'Otra materia', action: 'help_choose' },
        { label: 'Reservar ahora', action: 'link:reserva.html' },
      ],
    };
  }

  function buildTriageStep(stepIndex) {
    const step = CHAT_TRIAGE[stepIndex];
    if (!step) return null;
    return {
      html: `${proIntro()}
        <p><strong>Indagatoria inicial.</strong> Para individualizar correctamente su materia, le formularé ${CHAT_TRIAGE.length} preguntas breves.</p>
        <p><strong>Paso ${stepIndex + 1} de ${CHAT_TRIAGE.length}.</strong> ${step.question}</p>
        <p class="legal-chat-muted">Puede responder con los botones o redactar una frase. Ello evita una derivación jurídica incorrecta.</p>`,
      chips: step.chips,
    };
  }

  function resolveTriageService() {
    const nature = state.triageAnswers.nature;
    const map = CHAT_TRIAGE[0]?.map?.[nature];
    if (map?.length === 1) return CHAT_SERVICES.find((s) => s.id === map[0]);
    if (map?.length > 1) {
      return CHAT_SERVICES.find((s) => map.includes(s.id) && s.id === state.lastService) || CHAT_SERVICES.find((s) => map.includes(s.id));
    }
    return state.lastService ? CHAT_SERVICES.find((s) => s.id === state.lastService) : null;
  }

  function buildLocalReply(text, forcedServiceId, options = {}) {
    const t = text.trim();
    const lower = t.toLowerCase();

    if (options.triageAdvance) {
      const next = buildTriageStep(state.triageStep);
      if (next) return next;
      const svc = resolveTriageService() || detectService(t);
      if (svc) {
        state.triageAnswers.clarified = true;
        return buildServiceReply(svc, t, { need: state.userNeed });
      }
    }

    if (/^(hola|buenas|buenos|hey|hi)\b/.test(lower) || (t.length < 3 && !options.forceService)) {
      return {
        html: `${proIntro()}
          <p>Puedo asistirlo en una <strong>indagatoria preliminar</strong>: individualizar la materia, ordenar antecedentes y señalar la ruta que habitualmente sigue el estudio antes de una consulta reservada.</p>
          <p class="legal-chat-muted">${CHAT_CONFIG.disclaimer}</p>
          ${ctaBlock()}`,
        chips: [
          ...CHAT_QUICK_START.map((q) => ({ label: q.label, action: q.action, urgent: q.urgent })),
          ...serviceChips(3),
        ],
      };
    }

    if (/honorario|precio|plan|costo|tarifa|cuánto cobr|cuanto cobr|valor consulta/.test(lower)) {
      return {
        html: `<p><strong>Honorarios.</strong> En ${CHAT_CONFIG.firm} los honorarios se estructuran <strong>por etapas procesales</strong>, con diagnóstico inicial en ~${CHAT_CONFIG.responseHours}. No es técnicamente serio fijar montos sin conocer la complejidad del conflicto.</p>
          <p>La lógica tarifaria se expone en <a href="planes.html">Honorarios</a>; el valor concreto lo determina ${counselName()} según pretensión, prueba disponible y vía procesal.</p>
          ${ctaBlock()}`,
        chips: [
          { label: 'Ver planes', action: 'link:planes.html' },
          { label: 'Reservar diagnóstico', action: 'link:reserva.html' },
        ],
      };
    }

    if (/contacto|teléfono|telefono|correo|dirección|direccion|oficina|ovalle|ubicación|ubicacion|horario/.test(lower)) {
      const email = typeof CONTACT_CONFIG !== 'undefined' ? CONTACT_CONFIG.email : 'contacto@barriosabogado.cl';
      const addr = typeof CONTACT_CONFIG !== 'undefined' ? CONTACT_CONFIG.location.address : 'Manuel Peñafiel #1480, Ovalle';
      return {
        html: `<p><strong>${CHAT_CONFIG.firm}</strong><br>${escapeHtml(addr)}</p>
          <p>Email: <a href="mailto:${email}">${email}</a><br>WhatsApp: <a href="${waLink('Hola, quisiera contactar al estudio.')}" target="_blank" rel="noopener">+56 9 5810 4264</a></p>
          <p>Para un primer acercamiento formal, la <strong>reserva en línea</strong> permite individualizar su materia y agilizar la respuesta del abogado titular.</p>
          ${ctaBlock()}`,
        chips: [{ label: 'Ir a contacto', action: 'link:#contacto' }, { label: 'Reservar', action: 'link:reserva.html' }],
      };
    }

    if (/abogado|felipe|barrios|quién es|quien es|titular|experiencia|cv/.test(lower)) {
      const bio = typeof COUNSEL_CONFIG !== 'undefined' ? COUNSEL_CONFIG.shortBio : 'Abogado titular en Ovalle.';
      return {
        html: `<p><strong>${counselName()}</strong> — ${typeof COUNSEL_CONFIG !== 'undefined' ? COUNSEL_CONFIG.roleLine : 'CEO · Barrios Abogado'}.</p>
          <p>${escapeHtml(bio)}</p>
          <p>La atención es <strong>directa con el abogado titular</strong>, sin intermediación comercial.</p>
          <p><a href="#abogado">Ver ficha completa</a></p>
          ${ctaBlock()}`,
        chips: [{ label: 'Reservar con Felipe', action: 'link:reserva.html' }],
      };
    }

    if (/penal|delito|carcel|cárcel|detenid|fiscalía penal/.test(lower)) {
      return {
        html: `<p>El estudio patrocina <strong>civil, familia, consumo, fraude (Ley N° 20.009), notarial y corporativo</strong>. No asume causas de naturaleza penal.</p>
          <p>Si su urgencia es penal, deberá contactar a un abogado penalista o a la Defensoría Penal Pública. Si existe un componente civil conexo, con gusto lo oriento en esa parte.</p>
          ${ctaBlock()}`,
        chips: serviceChips(4),
      };
    }

    if (isBoundaryQuestion(t)) {
      const svc = state.lastService ? CHAT_SERVICES.find((s) => s.id === state.lastService) : detectService(t);
      return {
        html: `${empathyLine(detectEmotion(t))}
          <p>${typeof CHAT_VOICE !== 'undefined' ? CHAT_VOICE.limite : 'Esa pregunta exige análisis de hechos, prueba y plazos con criterio de abogado.'}</p>
          <p>${typeof CHAT_VOICE !== 'undefined' ? CHAT_VOICE.consulta(CHAT_CONFIG.responseHours, counselName()) : `Le sugiero una consulta reservada (~${CHAT_CONFIG.responseHours}).`}</p>
          ${svc ? stepsBlock(svc.id) : ''}
          ${ctaBlock(svc?.id)}`,
        chips: [
          { label: 'Reservar diagnóstico', action: 'link:reserva.html' },
          ...serviceChips(3),
        ],
      };
    }

    const svc = forcedServiceId
      ? CHAT_SERVICES.find((s) => s.id === forcedServiceId)
      : detectService(t);

    if (svc) {
      return buildServiceReply(svc, t, options);
    }

    if (/ayuda|servicio|necesito|no sé|no se|orient|duda|caso|qué hago|que hago|por dónde|por donde/.test(lower)) {
      return {
        html: `${proIntro()}
          <p>Para orientarlo con rigor, indique cuál de las siguientes materias se aproxima mejor a su conflicto:</p>
          <ul class="legal-chat-list">${CHAT_SERVICES.map((s) => `<li><strong>${s.label}</strong> — ${s.teaser.split('.')[0]}.</li>`).join('')}</ul>
          <p>También puede solicitar una <strong>indagatoria guiada</strong> mediante el botón inferior.</p>
          <p class="legal-chat-muted">${CHAT_CONFIG.disclaimer}</p>
          ${ctaBlock()}`,
        chips: [{ label: 'Orientarme paso a paso', action: 'triage_start' }, ...serviceChips()],
      };
    }

    return {
      html: `<p>Aún no logro individualizar la materia con la precisión que el caso requiere.</p>
        <p><strong>Sírvase exponer el conflicto en una sola frase</strong> — por ejemplo: «me notificaron desalojo», «cargo no reconocido en tarjeta», «demanda de alimentos».</p>
        <p>Alternativamente, la <a href="#guia">guía estructurada</a> del sitio permite un primer dictamen ordenado.</p>
        ${ctaBlock()}`,
      chips: [{ label: 'Orientarme paso a paso', action: 'triage_start' }, ...serviceChips(4)],
    };
  }

  async function tryApiReply(text) {
    if (!state.useApi) return null;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: state.history.slice(-10).map((m) => ({
            role: m.role === 'ai' ? 'assistant' : 'user',
            content: m.content,
          })),
          message: text,
          lastService: state.lastService,
          userNeed: state.userNeed,
          situationNote: state.situationNote,
        }),
      });
      if (res.status === 503) {
        state.useApi = false;
        return null;
      }
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch {
      state.useApi = false;
      return null;
    }
  }

  function formatApiReply(data) {
    const reply = data.reply || '';
    const svcId = data.service || state.lastService;
    if (data.service) state.lastService = data.service;
    const paragraphs = escapeHtml(reply)
      .split(/\n\n+/)
      .filter(Boolean)
      .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('');
    const steps = svcId ? stepsBlock(svcId) : '';
    return `${paragraphs}${steps}<p class="legal-chat-muted">${CHAT_CONFIG.disclaimer}</p>${ctaBlock(svcId)}`;
  }

  async function respondToUser(text, options = {}) {
    const userText = text.trim();
    if (!userText) return;

    pushMessage('user', `<p>${escapeHtml(userText)}</p>`);

    let html = null;
    let chips = [];

    if (!options.skipApi) {
      const apiData = await tryApiReply(userText);
      if (apiData?.reply) {
        html = formatApiReply(apiData);
        chips = apiData.chips?.length
          ? apiData.chips.map((c) => ({ label: c.label, action: c.action, icon: c.icon }))
          : serviceChips(4);
      }
    }

    if (!html) {
      const local = buildLocalReply(userText, options.serviceId, options);
      html = local.html;
      chips = local.chips || [];
    }

    await deliverReply(html, chips);
  }

  function startTriage() {
    state.triageStep = 0;
    state.triageAnswers = {};
    state.userNeed = null;
    const step = buildTriageStep(0);
    if (step) deliverReply(step.html, step.chips, 400);
  }

  function handleTriageNature(key) {
    state.triageAnswers.nature = key;
    state.triageStep = 1;
    const map = CHAT_TRIAGE[0].map[key];
    if (map?.length === 1) state.lastService = map[0];
    const step = buildTriageStep(1);
    if (step) deliverReply(step.html, step.chips, 400);
  }

  function handleNeed(need) {
    state.userNeed = need;
    state.triageStep = 2;
    const svc = resolveTriageService() || detectService(state.situationNote) || CHAT_SERVICES[0];
    const local = buildServiceReply(svc, state.situationNote || 'consulta guiada', { need, skipClarify: false });
    deliverReply(local.html, local.chips, 500);
  }

  function handleAction(action, label) {
    if (action === 'triage_start') {
      startTriage();
      return;
    }
    if (action === 'help_choose') {
      respondToUser('Necesito ayuda para elegir el servicio adecuado', { skipApi: true });
      return;
    }
    if (action.startsWith('triage:')) {
      handleTriageNature(action.split(':')[1]);
      return;
    }
    if (action.startsWith('need:')) {
      handleNeed(action.split(':')[1]);
      return;
    }
    if (action.startsWith('clarify:')) {
      const id = action.split(':')[1];
      state.triageAnswers.clarified = true;
      const svc = CHAT_SERVICES.find((s) => s.id === id);
      if (svc) {
        const local = buildServiceReply(svc, 'tengo documentación', { skipClarify: true });
        deliverReply(local.html, local.chips, 400);
      }
      return;
    }
    if (action.startsWith('service:')) {
      const id = action.split(':')[1];
      state.lastService = id;
      respondToUser(`Me interesa orientación en ${label || id}`, { skipApi: true, serviceId: id });
      return;
    }
    if (action.startsWith('link:')) {
      const href = action.slice(5);
      if (href.startsWith('#')) {
        closePanel();
        if (typeof scrollToSection === 'function') scrollToSection(href.slice(1));
        else window.location.hash = href;
      } else {
        window.location.href = href;
      }
      return;
    }
    if (action.startsWith('filter:')) {
      const cat = action.split(':')[1];
      closePanel();
      const btn = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
      if (btn) btn.click();
      if (typeof scrollToSection === 'function') scrollToSection('servicios');
      else window.location.href = '/#servicios';
      return;
    }
  }

  function openPanel() {
    state.open = true;
    root.classList.add('is-open');
    document.body.classList.add('legal-chat-open');
    els.input.focus();
    if (state.history.length === 0) {
      setBusy(true);
      delay(650).then(async () => {
        removeTyping();
        const local = buildLocalReply('Hola', { forceService: false });
        pushMessage('ai', local.html);
        renderChips(local.chips || CHAT_QUICK_START.map((q) => ({ label: q.label, action: q.action })));
        setBusy(false);
        lucide.createIcons();
      });
      showTyping();
    }
  }

  function closePanel() {
    state.open = false;
    root.classList.remove('is-open');
    document.body.classList.remove('legal-chat-open');
    els.launcher.focus();
  }

  function togglePanel() {
    if (state.open) closePanel();
    else openPanel();
  }

  els.launcher.addEventListener('click', togglePanel);
  els.close.addEventListener('click', closePanel);

  els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = els.input.value;
    els.input.value = '';
    respondToUser(text);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.open) closePanel();
  });

  root.querySelector('[data-chat-panel]')?.addEventListener('click', (e) => {
    const guia = e.target.closest('.legal-chat-link-guia');
    if (guia) {
      e.preventDefault();
      closePanel();
      if (typeof scrollToSection === 'function') scrollToSection('guia');
      else window.location.href = '/#guia';
    }
  });
}

function mountLegalChatWidget() {
  if (document.getElementById('legal-chat-root')) return;

  const wrap = document.createElement('aside');
  wrap.id = 'legal-chat-root';
  wrap.className = 'legal-chat';
  wrap.setAttribute('aria-label', 'Asesor digital Barrios Abogado');
  wrap.innerHTML = `
    <button type="button" class="float-dock-btn float-dock-btn--legal legal-chat-launcher" data-chat-launcher aria-expanded="false" aria-controls="legal-chat-panel">
      <span class="float-dock-btn-glow" aria-hidden="true"></span>
      <span class="float-dock-btn-icon" aria-hidden="true"><i data-lucide="sparkles"></i></span>
      <span class="float-dock-btn-copy">
        <span class="float-dock-btn-badge">IA</span>
        <strong>Asesor jurídico</strong>
        <span>Opinión preliminar · sitio</span>
      </span>
      <span class="float-dock-btn-pulse" aria-hidden="true"></span>
    </button>
    <div class="legal-chat-panel" id="legal-chat-panel" data-chat-panel role="dialog" aria-modal="true" aria-labelledby="legal-chat-title" hidden>
      <header class="legal-chat-header">
        <div class="legal-chat-header-brand">
          <div class="legal-chat-header-avatar"><img src="logo-barrios.png" alt="" width="36" height="36"></div>
          <div>
            <h2 id="legal-chat-title">Asesoría preliminar</h2>
            <p data-chat-status>Abogado disponible</p>
          </div>
        </div>
        <button type="button" class="legal-chat-close" data-chat-close aria-label="Cerrar chat"><i data-lucide="x"></i></button>
      </header>
      <div class="legal-chat-disclaimer">
        <i data-lucide="shield-check"></i>
        <span>Opinión preliminar · consulta reservada con el abogado titular</span>
      </div>
      <div class="legal-chat-messages" data-chat-messages role="log" aria-live="polite" aria-relevant="additions"></div>
      <div class="legal-chat-chips" data-chat-chips></div>
      <form class="legal-chat-form" data-chat-form>
        <label class="sr-only" for="legal-chat-input">Escriba su consulta</label>
        <input type="text" id="legal-chat-input" data-chat-input placeholder="Exponga su caso en una frase…" maxlength="500" autocomplete="off">
        <button type="submit" class="legal-chat-send" aria-label="Enviar"><i data-lucide="send"></i></button>
      </form>
    </div>`;

  document.body.appendChild(wrap);

  const panel = wrap.querySelector('[data-chat-panel]');
  const launcher = wrap.querySelector('[data-chat-launcher]');
  const observer = new MutationObserver(() => {
    const open = wrap.classList.contains('is-open');
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
  });
  observer.observe(wrap, { attributes: true, attributeFilter: ['class'] });

  initLegalChat();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountLegalChatWidget);
} else {
  mountLegalChatWidget();
}
