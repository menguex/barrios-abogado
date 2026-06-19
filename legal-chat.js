/* Chat asesor — widget flotante integrado */
function initLegalChat() {
  const root = document.getElementById('legal-chat-root');
  if (!root || typeof CHAT_SERVICES === 'undefined') return;

  const state = {
    open: false,
    busy: false,
    history: [],
    lastService: null,
    useApi: true,
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
    const encoded = encodeURIComponent(text);
    return `${CHAT_CONFIG.waBase}?text=${encoded}`;
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
    els.status.textContent = on ? 'Redactando…' : 'En línea';
  }

  function pushMessage(role, html, meta = {}) {
    state.history.push({ role, content: html.replace(/<[^>]+>/g, ''), meta });
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

  async function typeReply(html, minMs = 500) {
    setBusy(true);
    const typing = showTyping();
    await delay(Math.min(1400, minMs + html.length * 8));
    removeTyping();
    pushMessage('ai', html);
    setBusy(false);
    lucide.createIcons();
  }

  function renderChips(items) {
    els.chips.innerHTML = '';
    items.forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'legal-chat-chip';
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

  function serviceChips() {
    return CHAT_SERVICES.map((s) => ({
      label: s.label,
      icon: s.icon,
      action: `service:${s.id}`,
    }));
  }

  function ctaBlock(serviceId) {
    const svc = serviceId ? CHAT_SERVICES.find((s) => s.id === serviceId) : null;
    const waText = svc
      ? `Hola. Consulté el asesor digital sobre ${svc.label}. Quisiera orientación del abogado titular.`
      : 'Hola. Consulté el asesor digital de Barrios Abogado y quisiera agendar orientación.';
  return `
    <div class="legal-chat-cta">
      <a href="reserva.html" class="btn btn-primary btn-sm"><i data-lucide="calendar-check"></i> Reservar consulta</a>
      <a href="${waLink(waText)}" class="btn btn-wa btn-sm" target="_blank" rel="noopener"><i data-lucide="message-circle"></i> WhatsApp</a>
      <a href="#guia" class="btn btn-ghost btn-sm legal-chat-link-guia"><i data-lucide="sparkles"></i> Guía completa</a>
    </div>`;
  }

  function detectService(text) {
    const t = text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
    let best = null;
    let score = 0;
    CHAT_SERVICES.forEach((svc) => {
      let s = 0;
      svc.keywords.forEach((kw) => {
        const k = kw.normalize('NFD').replace(/\p{M}/gu, '');
        if (t.includes(k)) s += k.length > 5 ? 2 : 1;
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

  function buildLocalReply(text, forcedServiceId, options = {}) {
    const t = text.trim();
    const lower = t.toLowerCase();

    if ((/^(hola|buenas|buenos|hey|hi)\b/.test(lower) || t.length < 3) && !options.forceService) {
      return {
        html: `<p>Le saluda el <strong>asesor digital de Barrios Abogado</strong>. Puedo ubicar su consulta en una de nuestras materias y preparar el contacto con Felipe Barrios Callejas.</p>
          <p class="legal-chat-muted">${CHAT_CONFIG.disclaimer}</p>
          <p>¿Por dónde quiere empezar?</p>${ctaBlock()}`,
        chips: [...CHAT_QUICK_START.map((q) => ({ label: q.label, action: q.action })), ...serviceChips().slice(0, 4)],
      };
    }

    if (/honorario|precio|plan|costo|tarifa|cuánto cobr|cuanto cobr/.test(lower)) {
      return {
        html: `<p>Los honorarios se definen <strong>por etapas</strong>, con diagnóstico inicial en ~48 horas hábiles. No publicamos cifras cerradas sin conocer el conflicto.</p>
          <p>En <a href="planes.html">Honorarios</a> verá la lógica de cada plan; el monto concreto lo conversa con el abogado titular.</p>${ctaBlock()}`,
        chips: [{ label: 'Ver planes', action: 'link:planes.html' }, { label: 'Reservar', action: 'link:reserva.html' }],
      };
    }

    if (/contacto|teléfono|telefono|correo|dirección|direccion|oficina|ovalle|ubicación|ubicacion/.test(lower)) {
      const email = typeof CONTACT_CONFIG !== 'undefined' ? CONTACT_CONFIG.email : 'contacto@barriosabogado.cl';
      const addr = typeof CONTACT_CONFIG !== 'undefined' ? CONTACT_CONFIG.location.address : 'Manuel Peñafiel #1480, Ovalle';
      return {
        html: `<p><strong>Barrios Abogado</strong> — ${addr}</p>
          <p>Email: <a href="mailto:${email}">${email}</a> · WhatsApp: <a href="${waLink('Hola, quisiera contactar al estudio.')}" target="_blank" rel="noopener">+56 9 5810 4264</a></p>${ctaBlock()}`,
        chips: [{ label: 'Formulario contacto', action: 'link:#contacto' }],
      };
    }

    if (/abogado|felipe|barrios|quién es|quien es|titular/.test(lower)) {
      const name = typeof COUNSEL_CONFIG !== 'undefined' ? COUNSEL_CONFIG.fullName : 'Felipe Barrios Callejas';
      const role = typeof COUNSEL_CONFIG !== 'undefined' ? COUNSEL_CONFIG.roleLine : 'CEO · Barrios Abogado';
      return {
        html: `<p><strong>${name}</strong> — ${role}. Abogado en Ovalle; civil, herencias, registral y minería.</p>
          <p>La consulta es directa con el titular, sin intermediarios.</p>
          <p><a href="#abogado">Ver ficha completa</a></p>${ctaBlock()}`,
        chips: [{ label: 'Reservar con Felipe', action: 'link:reserva.html' }],
      };
    }

    if (isBoundaryQuestion(t)) {
      const svc = state.lastService || detectService(t);
      return {
        html: `<p>Esa pregunta exige analizar <strong>hechos y documentos</strong> con criterio de abogado. No puedo darle una respuesta vinculante por chat.</p>
          <p>Lo razonable es una <strong>consulta reservada</strong>: en 48h hábiles recibe viabilidad y ruta procesal, sin compromiso de litigar.</p>${ctaBlock(svc?.id)}`,
        chips: serviceChips(),
      };
    }

    const svc = forcedServiceId
      ? CHAT_SERVICES.find((s) => s.id === forcedServiceId)
      : detectService(t);

    if (svc) {
      state.lastService = svc.id;
      const area = typeof AREA_RESULTS !== 'undefined' ? AREA_RESULTS[svc.id] : null;
      const summary = area?.summary || svc.teaser;
      const shortSummary = summary.split('.').slice(0, 2).join('.') + '.';
      return {
        html: `<p><strong>${svc.label}</strong> — ${shortSummary}</p>
          <p>${svc.nextStep}</p>
          <p class="legal-chat-muted">No amplío más sin patrocinio: cada caso tiene matices probatorios.</p>
          ${ctaBlock(svc.id)}`,
        chips: [
          { label: 'Saber más en servicios', action: `filter:${svc.filter}` },
          { label: 'Otra materia', action: 'help_choose' },
          { label: 'Reservar', action: 'link:reserva.html' },
        ],
      };
    }

    if (/ayuda|servicio|necesito|no sé|no se|orient|duda|caso/.test(lower) || forcedServiceId === null) {
      return {
        html: `<p>Para orientarlo bien, indique si su conflicto se acerca a alguna de estas materias del estudio:</p>
          <ul class="legal-chat-list">${CHAT_SERVICES.map((s) => `<li><strong>${s.label}</strong> — ${s.teaser.split('.')[0]}.</li>`).join('')}</ul>
          <p class="legal-chat-muted">${CHAT_CONFIG.disclaimer}</p>${ctaBlock()}`,
        chips: serviceChips(),
      };
    }

    return {
      html: `<p>No logré ubicar la materia con claridad. Describa en una frase el conflicto (por ejemplo: «desalojo», «fraude en tarjeta», «pensión de alimentos»).</p>
        <p>O use la <a href="#guia">guía de 3 pasos</a> para un diagnóstico más estructurado.</p>${ctaBlock()}`,
      chips: serviceChips(),
    };
  }

  async function tryApiReply(text) {
    if (!state.useApi) return null;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: state.history.slice(-8).map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content })),
          message: text,
          lastService: state.lastService,
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

  async function respondToUser(text, options = {}) {
    const userText = text.trim();
    if (!userText) return;

    pushMessage('user', `<p>${escapeHtml(userText)}</p>`);

    let html = null;
    let chips = [];

    if (!options.skipApi) {
      const apiReply = await tryApiReply(userText);
      if (apiReply) {
        html = `<p>${escapeHtml(apiReply).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p><p class="legal-chat-muted">${CHAT_CONFIG.disclaimer}</p>${ctaBlock(state.lastService)}`;
        chips = serviceChips().slice(0, 4);
      }
    }

    if (!html) {
      const local = buildLocalReply(userText, options.serviceId, options);
      html = local.html;
      chips = local.chips || [];
    }

    await typeReply(html);
    renderChips(chips);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function handleAction(action, label) {
    if (action === 'help_choose') {
      respondToUser('Necesito ayuda para elegir el servicio adecuado', { skipApi: true });
      return;
    }
    if (action.startsWith('service:')) {
      const id = action.split(':')[1];
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
      const typing = showTyping();
      delay(700).then(async () => {
        removeTyping();
        const local = buildLocalReply('Hola', { skipApi: true });
        pushMessage('ai', local.html);
        renderChips(local.chips || CHAT_QUICK_START.map((q) => ({ label: q.label, action: q.action })));
        setBusy(false);
        lucide.createIcons();
      });
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
    <button type="button" class="legal-chat-launcher" data-chat-launcher aria-expanded="false" aria-controls="legal-chat-panel">
      <span class="legal-chat-launcher-glow" aria-hidden="true"></span>
      <span class="legal-chat-launcher-icon" aria-hidden="true"><i data-lucide="sparkles"></i></span>
      <span class="legal-chat-launcher-copy">
        <span class="legal-chat-ia-badge">IA</span>
        <strong>Asesor jurídico</strong>
        <span>Orientación · no es WhatsApp</span>
      </span>
      <span class="legal-chat-launcher-pulse" aria-hidden="true"></span>
    </button>
    <div class="legal-chat-panel" id="legal-chat-panel" data-chat-panel role="dialog" aria-modal="true" aria-labelledby="legal-chat-title" hidden>
      <header class="legal-chat-header">
        <div class="legal-chat-header-brand">
          <div class="legal-chat-header-avatar"><img src="logo-barrios.png" alt="" width="36" height="36"></div>
          <div>
            <h2 id="legal-chat-title">Asesor Barrios</h2>
            <p data-chat-status>En línea</p>
          </div>
        </div>
        <button type="button" class="legal-chat-close" data-chat-close aria-label="Cerrar chat"><i data-lucide="x"></i></button>
      </header>
      <div class="legal-chat-disclaimer">
        <i data-lucide="shield-check"></i>
        <span>Orientación preliminar · Consulta reservada con el abogado titular</span>
      </div>
      <div class="legal-chat-messages" data-chat-messages role="log" aria-live="polite" aria-relevant="additions"></div>
      <div class="legal-chat-chips" data-chat-chips></div>
      <form class="legal-chat-form" data-chat-form>
        <label class="sr-only" for="legal-chat-input">Escriba su consulta</label>
        <input type="text" id="legal-chat-input" data-chat-input placeholder="Ej.: fraude en mi tarjeta, desalojo…" maxlength="500" autocomplete="off">
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
