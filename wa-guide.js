/* WhatsApp con guía IA — orienta como abogado hasta el contacto con Felipe */
(function () {
  if (typeof CHAT_CONFIG === 'undefined' || typeof CHAT_SERVICES === 'undefined') return;

  const NEED_WA = {
    diagnose: 'obtener dictamen de viabilidad',
    act: 'activar gestiones de inmediato',
    rights: 'comprender derechos y obligaciones',
    prevent: 'evitar escalada a litigio',
  };

  const state = {
    open: false,
    busy: false,
    stage: 'welcome',
    history: [],
    serviceId: null,
    serviceLabel: '',
    userNeed: null,
    facts: '',
    useApi: true,
    readyForHandoff: false,
  };

  let root;
  let els = {};

  function counselName() {
    return typeof COUNSEL_CONFIG !== 'undefined' ? COUNSEL_CONFIG.fullName : CHAT_CONFIG.counsel;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function waLink(text) {
    return `${CHAT_CONFIG.waBase}?text=${encodeURIComponent(text)}`;
  }

  function buildHandoffMessage() {
    const svc = CHAT_SERVICES.find((s) => s.id === state.serviceId);
    const matter = state.serviceLabel || svc?.label || 'consulta jurídica';
    const need = state.userNeed ? NEED_WA[state.userNeed] || state.userNeed : 'orientación del abogado titular';
    const facts = state.facts ? `\nRelato: ${state.facts}` : '';
    return `Hola, ${counselName().split(' ')[0]}. Consulté la guía IA de ${CHAT_CONFIG.firm}.

Materia: ${matter}
Pretensión: ${need}${facts}

Quisiera continuar la conversación con usted.`;
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

  function scrollMessages() {
    requestAnimationFrame(() => {
      if (els.messages) els.messages.scrollTop = els.messages.scrollHeight;
    });
  }

  function pushMsg(role, html) {
    const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    state.history.push({ role, content: plain });
    const wrap = document.createElement('div');
    wrap.className = `wa-guide-msg wa-guide-msg--${role}`;
    const time = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    if (role === 'bot') {
      wrap.innerHTML = `
        <div class="wa-guide-msg-body">${html}<span class="wa-guide-time">${time}</span></div>`;
    } else {
      wrap.innerHTML = `<div class="wa-guide-msg-body">${html}<span class="wa-guide-time">${time}</span></div>`;
    }
    els.messages.appendChild(wrap);
    scrollMessages();
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'wa-guide-msg wa-guide-msg--bot wa-guide-msg--typing';
    el.dataset.typing = '1';
    el.innerHTML = `<div class="wa-guide-msg-body"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
    els.messages.appendChild(el);
    scrollMessages();
  }

  function removeTyping() {
    els.messages?.querySelector('[data-typing="1"]')?.remove();
  }

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function botSay(html, chips = [], ms = 600) {
    state.busy = true;
    if (els.input) els.input.disabled = true;
    if (els.send) els.send.disabled = true;
    showTyping();
    await delay(Math.min(1500, ms + Math.min(html.length, 300) * 5));
    removeTyping();
    pushMsg('bot', html);
    renderChips(chips);
    state.busy = false;
    if (els.input) els.input.disabled = state.stage === 'handoff';
    if (els.send) els.send.disabled = state.stage === 'handoff';
    lucide.createIcons();
  }

  function renderChips(items) {
    if (!els.chips) return;
    els.chips.innerHTML = '';
    (items || []).forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'wa-guide-chip';
      if (item.primary) btn.classList.add('wa-guide-chip--primary');
      if (item.urgent) btn.classList.add('wa-guide-chip--urgent');
      btn.textContent = item.label;
      btn.addEventListener('click', () => handleChip(item));
      els.chips.appendChild(btn);
    });
  }

  function localAdvisory(svc, facts) {
    const area = typeof AREA_RESULTS !== 'undefined' ? AREA_RESULTS[svc.id] : null;
    const title = area?.title || svc.label;
    const summary = area?.summary || svc.teaser;
    const needText = state.userNeed && NEED_WA[state.userNeed] ? ` Su pretensión: ${NEED_WA[state.userNeed]}.` : '';
    return `<p><strong>Estimado(a) consultante:</strong> desde una perspectiva preliminar, su relato se enmarca en <em>${escapeHtml(title.toLowerCase())}</em>.${needText}</p>
      <p>${escapeHtml(summary.split('.').slice(0, 2).join('.') + '.')}</p>
      <p>${svc.nextStep}</p>
      <p class="wa-guide-muted">${CHAT_CONFIG.disclaimer}</p>`;
  }

  async function apiAdvisory(text, svc) {
    if (!state.useApi) return null;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: state.history.slice(-8).map((m) => ({
            role: m.role === 'bot' ? 'assistant' : 'user',
            content: m.content,
          })),
          message: text,
          lastService: svc?.id || state.serviceId,
          userNeed: state.userNeed,
          situationNote: state.facts,
          channel: 'whatsapp',
        }),
      });
      if (res.status === 503) {
        state.useApi = false;
        return null;
      }
      if (!res.ok) return null;
      const data = await res.json();
      return data.reply || null;
    } catch {
      state.useApi = false;
      return null;
    }
  }

  function handoffChips() {
    return [
      { label: 'Hablar con Felipe por WhatsApp', action: 'open_wa', primary: true },
      { label: 'Reservar consulta formal', action: 'reserva' },
      { label: 'Reiniciar guía', action: 'restart' },
    ];
  }

  async function showHandoff() {
    state.stage = 'handoff';
    state.readyForHandoff = true;
    const msg = buildHandoffMessage();
    await botSay(
      `<p>He preparado su consulta para que <strong>${counselName()}</strong> la reciba con contexto. Al continuar, se abrirá WhatsApp con un mensaje redactado — usted podrá revisarlo antes de enviar.</p>
        <p class="wa-guide-preview">${escapeHtml(msg).replace(/\n/g, '<br>')}</p>`,
      handoffChips(),
      500
    );
  }

  async function runAdvisory(facts) {
    state.stage = 'advisory';
    state.facts = facts;
    const svc =
      CHAT_SERVICES.find((s) => s.id === state.serviceId) || detectService(facts) || CHAT_SERVICES[0];
    state.serviceId = svc.id;
    state.serviceLabel = svc.label;

    const apiReply = await apiAdvisory(facts, svc);
    let html;
    if (apiReply) {
      html = escapeHtml(apiReply)
        .split(/\n\n+/)
        .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
        .join('');
      html += `<p class="wa-guide-muted">${CHAT_CONFIG.disclaimer}</p>`;
    } else {
      html = localAdvisory(svc, facts);
    }

    await botSay(
      `${html}<p>¿Desea que lo derive ahora con el abogado titular por WhatsApp?</p>`,
      [
        { label: 'Sí, continuar con Felipe', action: 'handoff', primary: true },
        { label: 'Tengo otra consulta', action: 'more' },
      ],
      700
    );
  }

  function askFacts() {
    state.stage = 'facts';
    botSay(
      `<p><strong>Antecedentes.</strong> Sírvase exponer los hechos relevantes en una o dos frases (qué ocurrió, cuándo y qué documentos tiene).</p>`,
      [],
      400
    );
  }

  function askNeed() {
    state.stage = 'need';
    botSay(
      `<p>¿Cuál es su <strong>pretensión principal</strong> en este momento?</p>`,
      [
        { label: 'Saber si tengo un caso', action: 'need:diagnose' },
        { label: 'Actuar ya (plazos)', action: 'need:act', urgent: true },
        { label: 'Entender mis derechos', action: 'need:rights' },
        { label: 'Evitar juicio', action: 'need:prevent' },
      ],
      400
    );
  }

  function askMatter() {
    state.stage = 'matter';
    botSay(
      `<p>Para orientarlo con rigor, indique la <strong>materia</strong> que mejor describe su situación:</p>`,
      CHAT_SERVICES.map((s) => ({
        label: s.label,
        action: `service:${s.id}`,
        urgent: !!s.urgent,
      })),
      450
    );
  }

  function welcome() {
    state.stage = 'welcome';
    const intro =
      typeof CHAT_VOICE !== 'undefined'
        ? CHAT_VOICE.intro(CHAT_CONFIG.firm, counselName())
        : `Estimado(a) consultante: le saluda ${CHAT_CONFIG.firm}.`;
    botSay(
      `${intro}
        <p>Soy la <strong>guía previa a WhatsApp</strong>. Le haré breves preguntas, como en una primera entrevista, y luego lo derivaré con <strong>${counselName()}</strong> con su caso ya ordenado.</p>
        <p class="wa-guide-muted">No sustituyo al abogado · Opinión preliminar</p>`,
      [
        { label: 'Comenzar orientación', action: 'start', primary: true },
        { label: 'Ir directo a WhatsApp', action: 'open_wa_raw' },
      ],
      500
    );
  }

  async function handleChip(item) {
    if (state.busy) return;
    const action = item.action;
    if (action === 'start') {
      pushMsg('user', `<p>${escapeHtml(item.label)}</p>`);
      askMatter();
      return;
    }
    if (action === 'open_wa_raw') {
      window.open(waLink('Hola. Quisiera conversar con el abogado titular.'), '_blank', 'noopener');
      return;
    }
    if (action === 'open_wa') {
      window.open(waLink(buildHandoffMessage()), '_blank', 'noopener');
      closePanel();
      return;
    }
    if (action === 'reserva') {
      window.location.href = 'reserva.html';
      return;
    }
    if (action === 'restart') {
      resetSession();
      welcome();
      return;
    }
    if (action === 'handoff') {
      pushMsg('user', `<p>${escapeHtml(item.label)}</p>`);
      await showHandoff();
      return;
    }
    if (action === 'more') {
      pushMsg('user', `<p>${escapeHtml(item.label)}</p>`);
      askMatter();
      return;
    }
    if (action.startsWith('service:')) {
      const id = action.split(':')[1];
      const svc = CHAT_SERVICES.find((s) => s.id === id);
      state.serviceId = id;
      state.serviceLabel = svc?.label || id;
      pushMsg('user', `<p>${escapeHtml(item.label)}</p>`);
      askNeed();
      return;
    }
    if (action.startsWith('need:')) {
      state.userNeed = action.split(':')[1];
      pushMsg('user', `<p>${escapeHtml(item.label)}</p>`);
      askFacts();
      return;
    }
  }

  function resetSession() {
    state.stage = 'welcome';
    state.history = [];
    state.serviceId = null;
    state.serviceLabel = '';
    state.userNeed = null;
    state.facts = '';
    state.readyForHandoff = false;
    state.useApi = true;
    if (els.messages) els.messages.innerHTML = '';
    if (els.chips) els.chips.innerHTML = '';
  }

  function openPanel() {
    state.open = true;
    root.classList.add('is-open');
    document.body.classList.add('wa-guide-open');
    if (state.history.length === 0) welcome();
    els.input?.focus();
  }

  function closePanel() {
    state.open = false;
    root.classList.remove('is-open');
    document.body.classList.remove('wa-guide-open');
  }

  function togglePanel() {
    if (state.open) closePanel();
    else openPanel();
  }

  function mount() {
    if (document.getElementById('wa-guide-root')) return;

    root = document.createElement('aside');
    root.id = 'wa-guide-root';
    root.className = 'wa-guide';
    root.setAttribute('aria-label', 'WhatsApp con guía jurídica IA');
    root.innerHTML = `
      <div class="wa-guide-panel" id="wa-guide-panel" role="dialog" aria-modal="true" aria-labelledby="wa-guide-title" hidden>
        <header class="wa-guide-header">
          <button type="button" class="wa-guide-back" data-wa-close aria-label="Cerrar"><i data-lucide="arrow-left"></i></button>
          <div class="wa-guide-header-brand">
            <div class="wa-guide-avatar"><img src="assets/felipe-barrios-thumb.jpg" alt="" width="40" height="40" onerror="this.src='logo-barrios.png'"></div>
            <div>
              <h2 id="wa-guide-title">${counselName()}</h2>
              <p data-wa-status><span class="wa-guide-online"></span> Guía IA · luego WhatsApp real</p>
            </div>
          </div>
          <span class="wa-guide-ia-badge">IA</span>
        </header>
        <div class="wa-guide-disclaimer">
          <i data-lucide="bot"></i>
          <span>Asesoría preliminar automatizada · El abogado titular responde en WhatsApp</span>
        </div>
        <div class="wa-guide-messages" data-wa-messages role="log" aria-live="polite"></div>
        <div class="wa-guide-chips" data-wa-chips></div>
        <form class="wa-guide-form" data-wa-form>
          <label class="sr-only" for="wa-guide-input">Mensaje</label>
          <input type="text" id="wa-guide-input" data-wa-input placeholder="Escriba su mensaje…" maxlength="500" autocomplete="off">
          <button type="submit" class="wa-guide-send" aria-label="Enviar"><i data-lucide="send"></i></button>
        </form>
      </div>`;

    document.body.appendChild(root);

    els = {
      panel: root.querySelector('[data-wa-panel]') || root.querySelector('.wa-guide-panel'),
      messages: root.querySelector('[data-wa-messages]'),
      chips: root.querySelector('[data-wa-chips]'),
      form: root.querySelector('[data-wa-form]'),
      input: root.querySelector('[data-wa-input]'),
      send: root.querySelector('.wa-guide-send'),
      close: root.querySelector('[data-wa-close]'),
    };

    const panel = root.querySelector('.wa-guide-panel');
    const observer = new MutationObserver(() => {
      panel.hidden = !root.classList.contains('is-open');
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    els.close?.addEventListener('click', closePanel);
    els.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (state.busy || state.stage === 'handoff') return;
      const text = els.input.value.trim();
      if (!text) return;
      els.input.value = '';
      pushMsg('user', `<p>${escapeHtml(text)}</p>`);

      if (state.stage === 'facts') {
        runAdvisory(text);
        return;
      }
      if (state.stage === 'welcome' || state.stage === 'matter') {
        const svc = detectService(text);
        if (svc) {
          state.serviceId = svc.id;
          state.serviceLabel = svc.label;
          askNeed();
        } else {
          botSay('<p>No individualicé la materia. Elija un botón o nombre el conflicto con más detalle.</p>', [], 300);
        }
        return;
      }
      botSay('<p>Use los botones de guía o escriba cuando se le solicite el relato de hechos.</p>', [], 300);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.open) closePanel();
    });

    bindTriggers();
    enhanceFloatWa();
    lucide.createIcons();
  }

  function enhanceFloatWa() {
    document.querySelectorAll('.float-wa').forEach((el) => {
      el.setAttribute('data-wa-guide-trigger', '1');
      el.setAttribute('aria-label', 'WhatsApp con guía IA');
      if (el.tagName === 'A') {
        el.setAttribute('data-wa-href', el.getAttribute('href') || CHAT_CONFIG.waBase);
        el.setAttribute('href', '#wa-guide');
        el.setAttribute('role', 'button');
      }
      if (!el.querySelector('.float-wa-ia')) {
        const badge = document.createElement('span');
        badge.className = 'float-wa-ia';
        badge.textContent = 'IA';
        badge.setAttribute('aria-hidden', 'true');
        el.appendChild(badge);
      }
    });
  }

  function bindTriggers() {
    document.addEventListener(
      'click',
      (e) => {
        const trigger = e.target.closest('[data-wa-guide-trigger], .wa-guide-trigger, [data-open-wa-guide]');
        if (!trigger) return;
        e.preventDefault();
        openPanel();
      },
      true
    );
  }

  window.openWaGuide = openPanel;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
