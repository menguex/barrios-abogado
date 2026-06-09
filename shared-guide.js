/* Datos compartidos — guía IA + reserva consulta */
const GUIDE_STEPS = [
  {
    id: 'emotion',
    question: 'Para empezar: ¿cómo te sientes en este momento?',
    aiIntro: 'Hola. Soy el asistente de Barrios Abogado. Sin compromiso — solo quiero entender tu situación para orientarte bien.',
    progress: 20,
    options: [
      { value: 'overwhelmed', label: 'Abrumado/a', sub: 'No sé por dónde empezar', icon: 'cloud-rain' },
      { value: 'angry', label: 'Con indignación', sub: 'Siento que me hicieron algo injusto', icon: 'flame' },
      { value: 'afraid', label: 'Con miedo', sub: 'Algo grave está pasando', icon: 'alert-triangle' },
      { value: 'urgent', label: 'Con urgencia', sub: 'Necesito actuar hoy mismo', icon: 'zap', wide: true },
      { value: 'calm', label: 'Tranquilo/a', sub: 'Quiero prevenir o planificar', icon: 'compass' },
    ],
  },
  {
    id: 'situation',
    question: 'Gracias por compartirlo. ¿Qué situación te preocupa más?',
    aiFollow: {
      overwhelmed: 'Es normal sentirse así. Vamos paso a paso — elige lo que más se acerque a tu caso.',
      angry: 'Tu indignación es válida. Identifiquemos dónde está el problema para convertirlo en acción.',
      afraid: 'Entiendo la preocupación. Lo primero es ubicar el tipo de problema — así sabremos cómo protegerte.',
      urgent: 'Actuemos con foco. Selecciona la situación más cercana a lo que te está pasando.',
      calm: 'Excelente que busques orientación a tiempo. ¿En qué área quieres reforzar tu seguridad legal?',
    },
    progress: 40,
    options: [
      { value: 'civil', label: 'Mi casa o propiedad', sub: 'Arriendo, desalojo, usurpación o contratos', icon: 'home' },
      { value: 'familia', label: 'Mi familia', sub: 'Divorcio, pensión, visitas o mediación', icon: 'heart-handshake' },
      { value: 'fraude', label: 'Me robaron dinero', sub: 'Fraude bancario, clonación o phishing', icon: 'shield-alert' },
      { value: 'consumidor', label: 'Una empresa me falló', sub: 'Abuso, garantía o policía local', icon: 'scale' },
      { value: 'notarial', label: 'Documentos legales', sub: 'Compraventa, testamento o mandato', icon: 'file-signature' },
      { value: 'empresa', label: 'Mi negocio', sub: 'Pyme, comunidad, laboral o copropiedad', icon: 'building-2' },
    ],
  },
  {
    id: 'need',
    question: '¿Qué necesitas que hagamos por ti ahora?',
    aiFollow: { default: 'Ya casi terminamos. Esto nos ayuda a preparar la mejor respuesta para ti.' },
    progress: 60,
    options: [
      { value: 'diagnose', label: 'Saber si tengo un caso', sub: 'Quiero claridad antes de invertir tiempo y dinero', icon: 'search' },
      { value: 'act', label: 'Actuar de inmediato', sub: 'No puedo esperar — necesito movimiento ya', icon: 'zap' },
      { value: 'rights', label: 'Entender mis derechos', sub: 'Necesito saber qué me corresponde por ley', icon: 'book-open' },
      { value: 'prevent', label: 'Evitar que empeore', sub: 'Quiero cortar el problema antes de que escale', icon: 'shield' },
    ],
  },
];

const AREA_RESULTS = {
  civil: {
    title: 'Protección patrimonial',
    icon: 'landmark',
    summary: 'Tu caso encaja en derecho civil: arrendamientos, restitución de propiedad, contratos e inscripciones ante el CBRS.',
    steps: ['Revisión de contrato o título en 48 horas', 'Estrategia de cobro o restitución express', 'Representación ante tribunales civiles si corresponde'],
    wa: 'Hola. Me siento %EMOTION% y necesito protección sobre mi patrimonio. Quiero %NEED%.',
  },
  familia: {
    title: 'Blindaje familiar',
    icon: 'heart-handshake',
    summary: 'Asuntos de familia con firmeza y respeto: divorcio, pensión, visitas o mediación vía OJV.',
    steps: ['Evaluación confidencial', 'Mediación o estrategia procesal', 'Acuerdos que protejan ingresos y visitas'],
    wa: 'Hola. Me siento %EMOTION% y busco tranquilidad en un asunto familiar. Quiero %NEED%.',
  },
  fraude: {
    title: 'Rescate financiero — Ley 20.009',
    icon: 'shield-alert',
    summary: 'Clonación, phishing o movimientos no autorizados: la ley exige restitución en plazos acotados.',
    steps: ['Bloqueo y denuncia si aún no lo hiciste', 'Exigencia formal al banco', 'Escalamiento ante CMF o JPL'],
    wa: 'Hola. Fui víctima de fraude financiero y quiero %NEED%.',
  },
  consumidor: {
    title: 'Defensa ciudadana',
    icon: 'scale',
    summary: 'Abusos empresariales, incumplimientos o comparendos en Juzgado de Policía Local.',
    steps: ['Análisis del abuso o infracción', 'Defensa ante SERNAC, empresa o JPL', 'Negociación o litigio'],
    wa: 'Hola. Me siento %EMOTION% y requiero defensa contra un abuso empresarial. Quiero %NEED%.',
  },
  notarial: {
    title: 'Certeza jurídica notarial',
    icon: 'file-signature',
    summary: 'Compraventas, testamentos y mandatos sin margen al error.',
    steps: ['Revisión o redacción del instrumento', 'Validación notarial', 'Inscripción y resguardo'],
    wa: 'Hola. Busco certeza jurídica notarial. Quiero %NEED%.',
  },
  empresa: {
    title: 'Alianza corporativa',
    icon: 'building-2',
    summary: 'Pymes y comunidades: laboral, JPL y Ley de Copropiedad 21.442.',
    steps: ['Diagnóstico de riesgos', 'Contratos y defensa laboral', 'Cumplimiento copropiedad'],
    wa: 'Hola. Busco aliado legal para mi negocio. Quiero %NEED%.',
  },
};

const EMOTION_LABEL = {
  overwhelmed: 'abrumado/a',
  angry: 'con indignación',
  afraid: 'con miedo',
  urgent: 'con urgencia',
  calm: 'tranquilo/a',
};

const EMOTION_EMPATHY = {
  overwhelmed: 'No tienes que cargar esto solo/a. El primer paso ya lo diste.',
  angry: 'Tu indignación es válida. La ley puede ser tu aliada con estrategia.',
  afraid: 'Es válido tener miedo. Vamos a convertir la incertidumbre en un plan.',
  urgent: 'Entendemos la presión del tiempo. Tu caso puede priorizarse.',
  calm: 'Actuar antes del problema es la decisión más inteligente.',
};

const NEED_LABEL = {
  diagnose: 'saber si tengo un caso viable',
  act: 'actuar de inmediato con un abogado',
  rights: 'entender mis derechos',
  prevent: 'evitar que empeore',
};

function getUrgency(emotion, situation, need) {
  if (situation === 'fraude' || emotion === 'urgent' || need === 'act') {
    return { label: 'Prioridad alta', class: 'urgent' };
  }
  if (emotion === 'calm' && need === 'prevent') {
    return { label: 'Prevención inteligente', class: 'calm' };
  }
  return { label: 'Ruta recomendada', class: 'normal' };
}

function buildResultMessage(area, need) {
  if (need === 'act') return `Tu situación apunta a ${area.title}. Te recomiendo contactar al abogado hoy.`;
  if (need === 'diagnose') return `${area.title} es el camino más probable. En 48 horas puedes tener claridad.`;
  return `Recomendación: ${area.title}. Abajo verás los próximos pasos.`;
}

function buildWaMessage(answers, contact = {}) {
  const area = AREA_RESULTS[answers.situation];
  if (!area) return '';
  let text = area.wa
    .replace('%EMOTION%', EMOTION_LABEL[answers.emotion] || '')
    .replace('%NEED%', NEED_LABEL[answers.need] || '');
  if (contact.name) text += ` Mi nombre: ${contact.name}.`;
  if (contact.phone) text += ` Tel: ${contact.phone}.`;
  if (contact.detail) text += ` Detalle: ${contact.detail}`;
  if (contact.slot) text += ` Preferencia horario: ${contact.slot}.`;
  return text;
}
