const POPUP_DATA = {
  confidencialidad: {
    icon: 'lock',
    title: 'Confidencialidad absoluta',
    tagline: 'Su caso, su privacidad',
    blocks: [
      { icon: 'shield', title: 'Secreto profesional', text: 'Todo lo que comparte queda protegido por el secreto profesional del abogado. Sin excepciones.' },
      { icon: 'file-x', title: 'Sin registros públicos', text: 'No publicamos casos ni datos en redes. Su historia no es contenido de marketing.' },
      { icon: 'message-circle-off', title: 'Canal directo', text: 'Habla con el abogado, no con una call center ni secretaría intermedia.' },
    ],
    cta: { label: 'Reservar consulta privada', href: 'reserva.html', style: 'primary' },
  },
  honorarios: {
    icon: 'badge-check',
    title: 'Honorarios transparentes',
    tagline: 'Cero letra chica',
    blocks: [
      { icon: 'search', title: 'Diagnóstico honesto', text: 'En 48 horas sabrá si tiene caso. Si no conviene avanzar, se lo decimos sin rodeos.' },
      { icon: 'list-checks', title: 'Por etapas', text: 'Cada fase del proceso con costo definido antes de ejecutar. Usted decide en cada hito.' },
      { icon: 'circle-dollar-sign', title: 'Sin sorpresas', text: 'Nada de “costos adicionales” a mitad de camino. Claridad desde el primer mensaje.' },
    ],
    cta: { label: 'Ver planes', href: 'planes.html', style: 'ghost' },
  },
  diagnostico: {
    icon: 'zap',
    title: 'Diagnóstico en 48 horas',
    tagline: 'Velocidad con criterio',
    blocks: [
      { icon: 'clock', title: 'Respuesta ágil', text: 'Revisión inicial de documentos y situación en máximo 48 horas hábiles.' },
      { icon: 'route', title: 'Ruta clara', text: 'Recibe un plan: qué conviene, qué no, y cuánto tomaría cada camino.' },
      { icon: 'sparkles', title: 'Con asistente IA', text: 'Nuestra guía digital prepara el contexto antes de hablar con el abogado.' },
    ],
    cta: { label: 'Iniciar diagnóstico', href: 'reserva.html', style: 'primary' },
  },
  whatsapp: {
    icon: 'smartphone',
    title: 'WhatsApp directo',
    tagline: 'Sin intermediarios',
    blocks: [
      { icon: 'user-check', title: 'Con el abogado', text: 'Mensajes atendidos por Felipe Barrios Callejas, no por un bot corporativo.' },
      { icon: 'timer', title: '< 24 horas', text: 'Consultas prioritarias con respuesta en menos de un día hábil.' },
      { icon: 'paperclip', title: 'Envíe documentos', text: 'Fotos de contratos, denuncias o cartas del banco — todo desde el chat.' },
    ],
    cta: { label: 'Abrir WhatsApp', href: 'https://wa.me/56958104264', style: 'wa', external: true },
  },
  patrimonio: {
    icon: 'home',
    title: 'Protección patrimonial',
    tagline: 'Derecho civil · Arriendos · Propiedad',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=85&w=1200&h=640',
    intro: 'Defendemos su patrimonio con estrategia procesal clara: desde el cobro de rentas hasta la restitución express de inmuebles usurpados o arrendados sin pago.',
    blocks: [
      { icon: 'key', title: '¿Cuándo conviene?', text: 'Arrendatarios morosos, ocupaciones ilegales, contratos defectuosos, problemas en el CBRS o usurpaciones.' },
      { icon: 'gavel', title: 'Qué ejecutamos', text: 'Cobro judicial, desalojo, restitución de inmuebles y defensa de su título ante terceros.' },
      { icon: 'clipboard-list', title: 'Documentos clave', text: 'Contrato de arriendo, escritura, certificado de dominio vigente, cartas de demanda y comprobantes de pago.' },
      { icon: 'trophy', title: 'Resultado esperado', text: 'Recuperación de propiedades en 60–90 días según complejidad, con honorarios definidos por etapa.' },
    ],
    steps: ['Diagnóstico en 48h', 'Estrategia de cobro o restitución', 'Representación en tribunales civiles'],
    facts: ['48h diagnóstico', 'Tribunales civiles', 'CBRS y restitución'],
    cta: { label: 'Consultar patrimonio', href: 'reserva.html', style: 'primary' },
  },
  familia: {
    icon: 'heart-handshake',
    title: 'Blindaje familiar',
    tagline: 'Divorcio · Pensión · Mediación OJV',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=85&w=1200&h=640',
    intro: 'Asuntos de familia con firmeza y respeto. Priorizamos acuerdos dignos cuando es posible; litigio estratégico cuando la otra parte no cede.',
    blocks: [
      { icon: 'users', title: '¿Cuándo conviene?', text: 'Divorcio, pensión de alimentos, régimen de visitas, violencia intrafamiliar o mediación familiar.' },
      { icon: 'scale', title: 'Nuestro enfoque', text: 'Mediación vía OJV cuando reduce conflicto; representación firme en tribunal cuando protege sus derechos.' },
      { icon: 'heart', title: 'Acompañamiento', text: 'Sin presión ni tecnicismos. Cada conversación con opciones claras y costos por etapa.' },
      { icon: 'shield', title: 'Confidencialidad', text: 'Todo el proceso bajo secreto profesional. Su familia no es contenido público.' },
    ],
    steps: ['Evaluación confidencial', 'Mediación o estrategia procesal', 'Acuerdo o sentencia favorable'],
    facts: ['Mediación OJV', 'Pensión y visitas', '100% confidencial'],
    cta: { label: 'Hablar de mi caso', href: 'reserva.html', style: 'primary' },
  },
  fraude: {
    icon: 'shield-alert',
    title: 'Rescate financiero',
    tagline: 'Ley 20.009 · Prioridad urgente',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=85&w=1200&h=640',
    intro: 'Si fue víctima de clonación, phishing o transferencias no autorizadas, la Ley 20.009 obliga al banco a restituir en plazos acotados. Cada hora cuenta.',
    blocks: [
      { icon: 'alert-triangle', title: 'Actúe hoy', text: 'Bloquee tarjetas, denuncie y conserve capturas. El tiempo es factor crítico para la restitución.' },
      { icon: 'landmark', title: 'Su derecho legal', text: 'El banco debe restituir si no hubo negligencia grave del titular. Nosotros exigimos formalmente.' },
      { icon: 'file-warning', title: 'Protocolo Barrios', text: 'Denuncia → exigencia al banco → escalamiento CMF o JPL si hay resistencia.' },
      { icon: 'banknote', title: 'Resultado típico', text: 'Restitución total en semanas cuando la documentación es completa y oportuna.' },
    ],
    steps: ['Bloqueo y denuncia', 'Exigencia formal al banco', 'Escalamiento regulatorio si aplica'],
    facts: ['Prioridad alta', 'Ley 20.009', 'Restitución bancaria'],
    cta: { label: 'Activar rescate', href: 'reserva.html', style: 'wa' },
  },
  consumidor: {
    icon: 'scale',
    title: 'Defensa ciudadana',
    tagline: 'Consumidor · SERNAC · JPL',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=85&w=1200&h=640',
    intro: 'Nivelamos la balanza cuando una empresa o institución abusa de su posición. Negociamos primero; litigamos en JPL cuando es necesario.',
    blocks: [
      { icon: 'building', title: '¿Cuándo conviene?', text: 'Garantías incumplidas, cobros indebidos, cláusulas abusivas o comparendos en Juzgado de Policía Local.' },
      { icon: 'shield-check', title: 'Qué logramos', text: 'Restitución de montos, anulación de cargos o defensa ante multas con estrategia documentada.' },
      { icon: 'handshake', title: 'Negociación primero', text: 'Buscamos solución rápida con la empresa; tribunal solo si la otra parte no cede.' },
      { icon: 'file-text', title: 'Qué necesitamos', text: 'Contratos, correos, boletas, reclamos en SERNAC y cualquier respuesta de la empresa.' },
    ],
    steps: ['Análisis del abuso', 'Reclamo formal o JPL', 'Negociación o sentencia'],
    facts: ['SERNAC y JPL', 'Defensa ciudadana', 'Sin costos ocultos'],
    cta: { label: 'Consultar', href: 'reserva.html', style: 'primary' },
  },
  notarial: {
    icon: 'file-signature',
    title: 'Certeza jurídica',
    tagline: 'Notaría · Contratos · Testamentos',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=85&w=1200&h=640',
    intro: 'Un instrumento mal redactado hoy es un conflicto de años mañana. Revisamos, corregimos y protocolizamos con precisión notarial.',
    blocks: [
      { icon: 'file-check', title: 'Instrumentos', text: 'Compraventas, testamentos, mandatos, poderes y cesiones sin margen al error.' },
      { icon: 'stamp', title: 'Prevención', text: 'Detectamos cláusulas riesgosas antes de firmar. Invertir ahora evita tribunales después.' },
      { icon: 'archive', title: 'Inscripción', text: 'Seguimiento de inscripción en CBRS y archivo ordenado para su tranquilidad.' },
      { icon: 'search', title: 'Revisión express', text: 'Diagnóstico de contratos existentes en 48 horas con informe claro.' },
    ],
    steps: ['Revisión o redacción', 'Validación notarial', 'Inscripción y resguardo'],
    facts: ['Notaría', 'Testamentos', 'Compraventas'],
    cta: { label: 'Agendar revisión', href: 'reserva.html', style: 'primary' },
  },
  empresa: {
    icon: 'building-2',
    title: 'Alianza corporativa',
    tagline: 'Pymes · Comunidades · Ley 21.442',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=85&w=1200&h=640',
    intro: 'Brazo legal continuo para operar sin apagar incendios. Contratos, laboral, JPL y cumplimiento de copropiedad con predictibilidad de costos.',
    blocks: [
      { icon: 'briefcase', title: '¿Para quién?', text: 'Pymes, administradores de edificios, negocios en expansión y comunidades bajo Ley 21.442.' },
      { icon: 'file-text', title: 'Servicios', text: 'Contratos comerciales y laborales, compliance, defensa en JPL y asesoría de directorio.' },
      { icon: 'users', title: 'Laboral', text: 'Prevención de demandas, finiquitos, desvinculaciones y defensa ante reclamos.' },
      { icon: 'trending-up', title: 'Retainer', text: 'Honorarios mensuales definidos. Usted opera; nosotros blindamos.' },
    ],
    steps: ['Diagnóstico de riesgos', 'Contratos y compliance', 'Defensa y seguimiento continuo'],
    facts: ['Retainer', 'Ley 21.442', 'Laboral y JPL'],
    cta: { label: 'Plan corporativo', href: 'reserva.html', style: 'primary' },
  },
  metodo_escucha: {
    icon: 'ear',
    title: 'Fase 1 · Escucha',
    tagline: 'Diagnóstico honesto',
    blocks: [
      { icon: 'message-square', title: 'Primera conversación', text: 'Entendemos su situación sin juzgar y sin tecnicismos innecesarios.' },
      { icon: 'file-search', title: 'Revisión', text: 'Analizamos documentos clave en un plazo máximo de 48 horas.' },
      { icon: 'thumbs-up', title: 'Veredicto claro', text: 'Si no hay caso viable, se lo decimos. Ahorramos su tiempo y dinero.' },
    ],
    cta: { label: 'Empezar', href: 'reserva.html', style: 'primary' },
  },
  metodo_estrategia: {
    icon: 'compass',
    title: 'Fase 2 · Estrategia',
    tagline: 'Plan con hitos',
    blocks: [
      { icon: 'map', title: 'Hoja de ruta', text: 'Cada paso definido: plazos, costos y probabilidad de éxito.' },
      { icon: 'bar-chart-3', title: 'Reportes', text: 'Actualizaciones claras en cada hito. Usted siempre sabe dónde está su caso.' },
      { icon: 'git-branch', title: 'Opciones', text: 'Mediación, negociación o litigio — con pros y contras de cada camino.' },
    ],
    cta: { label: 'Ver planes', href: 'planes.html', style: 'ghost' },
  },
  metodo_ejecucion: {
    icon: 'gavel',
    title: 'Fase 3 · Ejecución',
    tagline: 'Acción en tribunales',
    blocks: [
      { icon: 'landmark', title: 'Representación', text: 'Civiles, familia, JPL y trámites ante organismos reguladores.' },
      { icon: 'swords', title: 'Firmeza', text: 'Defensa agresiva cuando la situación lo exige; diplomacia cuando conviene más.' },
      { icon: 'monitor', title: 'OJV digital', text: 'Seguimiento de causas por Oficina Judicial Virtual sin que usted pierda tiempo.' },
    ],
    cta: { label: 'Contactar', href: '#contacto', style: 'ghost' },
  },
  metodo_resultado: {
    icon: 'trophy',
    title: 'Fase 4 · Resultado',
    tagline: 'Cierre y prevención',
    blocks: [
      { icon: 'check-circle', title: 'Objetivo cumplido', text: 'Restitución, acuerdo o sentencia favorable según su meta inicial.' },
      { icon: 'shield-plus', title: 'Blindaje futuro', text: 'Recomendaciones para que el problema no se repita.' },
      { icon: 'heart-handshake', title: 'Relación continua', text: 'Muchos clientes nos eligen como aliado legal a largo plazo.' },
    ],
    cta: { label: 'Ver casos de éxito', href: '#resultados', style: 'ghost' },
  },
  caso_fraude: {
    icon: 'shield-alert',
    title: 'Expediente · Fraude bancario',
    tagline: 'Ley 20.009 · Restitución total',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=85&w=1200&h=640',
    intro: 'Cliente víctima de transferencias no autorizadas vía phishing. Restitución completa sin llegar a juicio.',
    blocks: [
      { icon: 'banknote', title: 'Situación', text: 'Cliente víctima de transferencias no autorizadas vía phishing.' },
      { icon: 'scale', title: 'Acción', text: 'Exigencia formal al banco bajo Ley 20.009 con documentación completa.' },
      { icon: 'party-popper', title: 'Resultado', text: 'Restitución total. El banco asumió responsabilidad sin llegar a juicio.' },
    ],
    facts: ['Restitución 100%', 'Sin juicio', 'Plazo: semanas'],
    cta: { label: '¿Le pasó algo similar?', href: 'reserva.html', style: 'primary' },
  },
  caso_propiedad: {
    icon: 'home',
    title: 'Expediente · Propiedad recuperada',
    tagline: 'Desalojo express · 90 días',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=85&w=1200&h=640',
    intro: 'Inmueble arrendado con morosidad prolongada. Restitución judicial y cobro de rentas adeudadas.',
    blocks: [
      { icon: 'key', title: 'Situación', text: 'Inmueble arrendado con morosidad prolongada y negativa a desalojo voluntario.' },
      { icon: 'gavel', title: 'Acción', text: 'Estrategia de cobro + restitución con representación en tribunales civiles.' },
      { icon: 'party-popper', title: 'Resultado', text: 'Vivienda recuperada en 90 días.' },
    ],
    facts: ['90 días', 'Restitución total', 'Cobro de rentas'],
    cta: { label: 'Consultar patrimonio', href: 'reserva.html', style: 'primary' },
  },
  caso_familia: {
    icon: 'heart-handshake',
    title: 'Expediente · Mediación familiar',
    tagline: 'Acuerdo digno vía OJV',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=85&w=1200&h=640',
    intro: 'Conflicto por pensión y visitas tras separación de alto conflicto. Acuerdo mediado sin juicio prolongado.',
    blocks: [
      { icon: 'users', title: 'Situación', text: 'Conflicto por pensión y visitas tras separación de alto conflicto.' },
      { icon: 'handshake', title: 'Acción', text: 'Mediación vía OJV con preparación previa de posiciones y límites.' },
      { icon: 'party-popper', title: 'Resultado', text: 'Acuerdo de pensión digna y régimen de visitas respetado por ambas partes.' },
    ],
    facts: ['Sin juicio largo', 'OJV', 'Acuerdo mediado'],
    cta: { label: 'Hablar de familia', href: 'reserva.html', style: 'primary' },
  },
  plan_inicial: {
    icon: 'search',
    title: 'Consulta inicial',
    tagline: 'Diagnóstico',
    blocks: [
      { icon: 'file-search', title: 'Incluye', text: 'Análisis de documentos, evaluación de viabilidad y ruta legal recomendada.' },
      { icon: 'list', title: 'Honorarios', text: 'Costo de etapas siguientes definido por escrito antes de avanzar.' },
      { icon: 'x-circle', title: 'Sin obligación', text: 'Si no hay caso, se lo decimos. No hay presión para contratar.' },
    ],
    cta: { label: 'Agendar', href: 'reserva.html', style: 'primary' },
  },
  plan_completo: {
    icon: 'sparkles',
    title: 'Consultoría completa',
    tagline: 'Recomendado',
    blocks: [
      { icon: 'message-circle', title: 'WhatsApp directo', text: 'Línea abierta con el abogado durante todo el proceso.' },
      { icon: 'clipboard-list', title: 'Reportes por hitos', text: 'Sabe exactamente qué pasó, qué sigue y cuánto cuesta cada fase.' },
      { icon: 'landmark', title: 'Representación', text: 'Tribunales civiles, familia y JPL incluidos según el plan acordado.' },
    ],
    cta: { label: 'Reservar ahora', href: 'reserva.html', style: 'primary' },
  },
  plan_corporativo: {
    icon: 'building-2',
    title: 'Retainer corporativo',
    tagline: 'Aliado continuo',
    blocks: [
      { icon: 'file-text', title: 'Contratos', text: 'Revisión y redacción de contratos laborales, comerciales y de arriendo.' },
      { icon: 'users', title: 'Laboral', text: 'Defensa ante demandas y asesoría preventiva en relaciones laborales.' },
      { icon: 'building', title: 'Copropiedad', text: 'Cumplimiento Ley 21.442 para comunidades y administradores.' },
    ],
    cta: { label: 'Consultar plan', href: 'reserva.html', style: 'primary' },
  },
  filosofia: {
    icon: 'book-open',
    title: 'Filosofía Barrios',
    tagline: 'El orden precede a la libertad',
    blocks: [
      { icon: 'shield', title: 'Prevención', text: 'Anticiparse no es un gasto: es la inversión más inteligente que puede hacer.' },
      { icon: 'brain', title: 'Paz mental', text: 'Cuando su entorno está jurídicamente blindado, adquiere tranquilidad absoluta.' },
      { icon: 'eye', title: 'Transparencia', text: 'Sin letra chica, sin sorpresas, sin intermediarios.' },
    ],
    cta: { label: 'Leer filosofía completa', href: 'filosofia.html', style: 'primary' },
  },
  abogado_ficha: {},
};

function initPopups() {
  if (typeof getAbogadoFichaPopup === 'function') {
    POPUP_DATA.abogado_ficha = getAbogadoFichaPopup();
  }

  const modal = document.getElementById('info-modal');
  if (!modal) return;

  const backdrop = modal.querySelector('.modal-backdrop');
  const closeBtn = modal.querySelector('.modal-close');
  const iconEl = document.getElementById('modal-icon');
  const titleEl = document.getElementById('modal-title');
  const taglineEl = document.getElementById('modal-tagline');
  const bodyEl = document.getElementById('modal-body');
  const footerEl = document.getElementById('modal-footer');

  let lastFocus = null;

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    lastFocus?.focus();
  }

  const modalPanel = document.getElementById('modal-panel');
  const modalHero = document.getElementById('modal-hero');
  const modalHeader = modal.querySelector('.modal-header');

  function clearDossierPortrait() {
    modalHeader?.classList.remove('modal-header--dossier');
    modalHeader?.querySelector('.modal-dossier-portrait')?.remove();
  }

  function renderCtaButton(cta) {
    const cls = cta.style === 'wa' ? 'btn btn-wa' : cta.style === 'ghost' ? 'btn btn-ghost' : 'btn btn-primary btn-shimmer';
    const ext = cta.external ? ' target="_blank" rel="noopener"' : '';
    const icon = cta.icon || 'arrow-right';
    return `<a href="${cta.href}" class="${cls}"${ext}><i data-lucide="${icon}"></i> ${cta.label}</a>`;
  }

  function openPopup(id) {
    const data = POPUP_DATA[id];
    if (!data) return;

    lastFocus = document.activeElement;
    iconEl.innerHTML = `<i data-lucide="${data.icon}"></i>`;
    titleEl.textContent = data.title;
    taglineEl.textContent = data.tagline || '';

    const isRich = Boolean(data.image || data.intro);
    const isDossier = Boolean(data.dossier);
    modalPanel?.classList.toggle('modal-panel--rich', isRich && !isDossier);
    modalPanel?.classList.toggle('modal-panel--dossier', isDossier);
    clearDossierPortrait();

    if (isDossier && data.image && modalHeader) {
      modalHero.hidden = true;
      modalHero.innerHTML = '';
      modalHeader.classList.add('modal-header--dossier');
      const portrait = document.createElement('div');
      portrait.className = 'modal-dossier-portrait';
      portrait.innerHTML = `
        <img
          src="${data.image}"
          alt="${data.title}"
          width="128"
          height="160"
          decoding="async"
        >`;
      modalHeader.insertBefore(portrait, modalHeader.firstChild);
    } else if (data.image && modalHero) {
      modalHero.hidden = false;
      modalHero.innerHTML = `
        <div class="img-wrap modal-hero-wrap">
          <span class="img-skeleton" aria-hidden="true"></span>
          <img src="${data.image}" alt="" width="1200" height="640" decoding="async">
        </div>`;
      const heroImg = modalHero.querySelector('img');
      const wrap = modalHero.querySelector('.img-wrap');
      if (heroImg?.complete) wrap?.classList.add('is-loaded');
      else heroImg?.addEventListener('load', () => wrap?.classList.add('is-loaded'), { once: true });
    } else if (modalHero) {
      modalHero.hidden = true;
      modalHero.innerHTML = '';
    }

    let html = '';
    if (data.intro) html += `<p class="modal-intro">${data.intro}</p>`;

    if (data.signature) {
      html += `
        <div class="counsel-signature counsel-signature--modal">
          <img src="${data.signature.logo}" alt="" width="44" height="44" class="counsel-signature-logo">
          <div>
            <span class="counsel-signature-firm">${data.signature.firm}</span>
            <span class="counsel-signature-meta">${data.signature.meta}</span>
          </div>
        </div>`;
    }

    if (data.metrics?.length) {
      html += '<div class="counsel-metrics counsel-metrics--premium counsel-metrics--modal">';
      data.metrics.forEach((m) => {
        html += `
          <div class="counsel-metric${m.accent ? ' counsel-metric--accent' : ''}">
            <i data-lucide="${m.icon}"></i>
            <strong>${m.value}</strong>
            <span>${m.label}</span>
          </div>`;
      });
      html += '</div>';
    }

    if (data.practiceTags?.length) {
      html += `
        <div class="counsel-practice counsel-practice--modal">
          <p class="counsel-practice-label">Áreas de práctica</p>
          <div class="counsel-practice-tags">
            ${data.practiceTags.map((t) => `<span>${t}</span>`).join('')}
          </div>
        </div>`;
    }

    html += '<div class="modal-blocks">';
    data.blocks.forEach((b, i) => {
      html += `
        <article class="modal-block" style="animation-delay:${i * 0.05}s">
          <span class="modal-block-icon"><i data-lucide="${b.icon}"></i></span>
          <div>
            <h4>${b.title}</h4>
            <p>${b.text}</p>
          </div>
        </article>`;
    });
    html += '</div>';

    if (data.steps?.length) {
      html += '<ol class="modal-steps">';
      data.steps.forEach((s) => {
        html += `<li><i data-lucide="chevron-right"></i><span>${s}</span></li>`;
      });
      html += '</ol>';
    }

    if (data.facts?.length) {
      html += '<div class="modal-facts">';
      data.facts.forEach((f) => {
        html += `<span class="modal-fact"><i data-lucide="check"></i>${f}</span>`;
      });
      html += '</div>';
    }

    if (data.quote) {
      html += `
        <blockquote class="counsel-quote counsel-quote--premium counsel-quote--modal">
          <i data-lucide="quote" class="counsel-quote-icon" aria-hidden="true"></i>
          <p>${data.quote.text}</p>
          <cite>${data.quote.cite}</cite>
        </blockquote>`;
    }
    bodyEl.innerHTML = html;

    if (data.ctas?.length) {
      footerEl.innerHTML = `<div class="modal-footer-actions">${data.ctas.map(renderCtaButton).join('')}</div>`;
    } else if (data.cta) {
      footerEl.innerHTML = renderCtaButton(data.cta);
    } else {
      footerEl.innerHTML = '';
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    lucide.createIcons();
    closeBtn.focus();
  }

  document.querySelectorAll('[data-popup]').forEach((el) => {
    const trigger = (e) => {
      const id = el.dataset.popup;
      if (!id) return;
      e.stopPropagation();
      if (el.tagName === 'A' && !el.classList.contains('btn-info')) e.preventDefault();
      openPopup(id);
    };
    el.addEventListener('click', trigger);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPopup(el.dataset.popup);
      }
    });
  });

  footerEl?.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link && modal.classList.contains('is-open')) closeModal();
  });

  backdrop?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
}
