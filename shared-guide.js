/* Datos compartidos — guía IA + reserva consulta (tono abogado: técnico, didáctico, dinámico) */
const GUIDE_STEPS = [
  {
    id: 'emotion',
    question: 'Para calibrar el diagnóstico: ¿cómo vive usted este conflicto hoy?',
    aiIntro:
      'Buenos días. Soy el asesor jurídico digital de Barrios Abogado. Aún no constituye patrocinio, pero sí un primer ordenamiento de hechos: ubicaré su situación en el marco legal chileno y le explicaré, en lenguaje claro, qué institutos podrían aplicar. Vamos paso a paso.',
    progress: 20,
    options: [
      { value: 'overwhelmed', label: 'Abrumado/a', sub: 'No distingo por dónde empezar', icon: 'cloud-rain' },
      { value: 'angry', label: 'Con indignación', sub: 'Percibo una injusticia concreta', icon: 'flame' },
      { value: 'afraid', label: 'Con alerta', sub: 'Hay riesgo patrimonial o familiar', icon: 'alert-triangle' },
      { value: 'urgent', label: 'Con urgencia', sub: 'Hay plazos o vencimientos en juego', icon: 'zap', wide: true },
      { value: 'calm', label: 'Con prevención', sub: 'Quiero anticipar un riesgo legal', icon: 'compass' },
    ],
  },
  {
    id: 'situation',
    question: 'Indique el eje del conflicto: ¿qué materia jurídica se acerca más a su caso?',
    aiFollow: {
      overwhelmed:
        'Es habitual sentir saturación ante un litigio o trámite. El primer ejercicio profesional es individualizar el objeto del conflicto — bien, contrato, familia o consumo — para definir la vía procesal correcta.',
      angry:
        'La indignación suele acompañar un incumplimiento o abuso de derecho. Identifiquemos la pretensión (restitución, indemnización, nulidad) para ver si corresponde mediación, gestión prejudicial o demanda.',
      afraid:
        'Cuando hay alerta, conviene revisar de inmediato si existen plazos de prescripción o caducidad. Seleccione la materia más cercana y le orientaré sobre el estándar probatorio básico.',
      urgent:
        'Con urgencia procesal, el orden importa: primero la materia, luego la medida cautelar o la notificación que corresponda. Elija la opción que mejor describa su hecho.',
      calm:
        'La prevención es la forma más eficiente de reducir costos judiciales. Indique el área en que quiere reforzar certeza jurídica — patrimonio, familia, consumo o negocios.',
    },
    progress: 40,
    options: [
      { value: 'civil', label: 'Patrimonio o inmueble', sub: 'Arriendo, desalojo, usurpación o contratos', icon: 'home' },
      { value: 'familia', label: 'Derecho de familia', sub: 'Divorcio, alimentos, régimen de visitas', icon: 'heart-handshake' },
      { value: 'fraude', label: 'Fraude financiero', sub: 'Clonación, phishing o cargo no autorizado', icon: 'shield-alert' },
      { value: 'consumidor', label: 'Relación de consumo', sub: 'Incumplimiento, garantía o JPL', icon: 'scale' },
      { value: 'notarial', label: 'Instrumentos notariales', sub: 'Compraventa, testamento o mandato', icon: 'file-signature' },
      { value: 'empresa', label: 'Persona jurídica / Pyme', sub: 'Laboral, copropiedad o contratos', icon: 'building-2' },
    ],
  },
  {
    id: 'need',
    question: '¿Qué pretensión procesal busca en esta etapa?',
    aiFollow: {
      default:
        'Ya tenemos materia y contexto. Defina su objetivo inmediato: diagnóstico de viabilidad, activación de gestiones o blindaje preventivo. Con eso preparo la ruta para el abogado titular.',
    },
    progress: 60,
    options: [
      { value: 'diagnose', label: 'Viabilidad del caso', sub: 'Quiero un dictamen antes de litigar', icon: 'search' },
      { value: 'act', label: 'Gestión inmediata', sub: 'Necesito interpelar, demandar o notificar ya', icon: 'zap' },
      { value: 'rights', label: 'Comprensión normativa', sub: 'Quiero saber qué me ampara la ley', icon: 'book-open' },
      { value: 'prevent', label: 'Prevención de daño', sub: 'Evitar que el conflicto escale a juicio', icon: 'shield' },
    ],
  },
];

const AREA_RESULTS = {
  civil: {
    title: 'Derecho civil patrimonial',
    icon: 'landmark',
    summary:
      'Su relato apunta a derecho civil: arrendamientos (Ley 18.101), acciones de restitución o cumplimiento contractual, y eventual inscripción o rectificación ante el CBRS (Conservador de Bienes Raíces).',
    steps: [
      'Revisión de título, contrato y cadena de posesión — plazo orientativo: 48 horas hábiles',
      'Estrategia prejudicial (interpelación, cobro o restitución) o demanda civil según mérito',
      'Patrocinio en tribunales civiles y seguimiento por OJV (Oficina Judicial Virtual)',
    ],
    wa: 'Hola. Me encuentro %EMOTION% y requiero orientación en derecho civil patrimonial. Mi pretensión: %NEED%.',
  },
  familia: {
    title: 'Derecho de familia',
    icon: 'heart-handshake',
    summary:
      'Materia de familia: divorcio (causal o acuerdo), alimentos, cuidado personal y régimen de relación directa y regular. La vía puede ser mediación familia o juicio según la OJV.',
    steps: [
      'Entrevista confidencial y análisis de causales o acuerdos viables',
      'Mediación familiar o estrategia de demanda — según interés superior del niño',
      'Homologación judicial de acuerdos o patrocinio en audiencias',
    ],
    wa: 'Hola. Me encuentro %EMOTION% y necesito asesoría en derecho de familia. Mi pretensión: %NEED%.',
  },
  fraude: {
    title: 'Ley 20.009 — fraude con medio de pago',
    icon: 'shield-alert',
    summary:
      'Operaciones no autorizadas, phishing o clonación: la Ley 20.009 obliga a la entidad financiera a restituir en plazos acotados si se cumplen los requisitos. El banco puede resistirse — ahí entra la vía CMF o JPL.',
    steps: [
      'Bloqueo de productos y denuncia (Carabineros o fiscalía, según el hecho)',
      'Carta de reclamación y exigencia de restitución al emisor',
      'Escalamiento ante CMF, mediación o acción ante Juzgado de Policía Local',
    ],
    wa: 'Hola. Fui afectado por fraude con medio de pago (Ley 20.009). Mi pretensión: %NEED%.',
  },
  consumidor: {
    title: 'Derecho del consumidor',
    icon: 'scale',
    summary:
      'Relación de consumo: incumplimiento de garantía legal, cláusulas abusivas o infracciones sancionadas en JPL (Juzgado de Policía Local). Puede coexistir reclamo ante SERNAC y vía judicial.',
    steps: [
      'Individualización del proveedor, contrato y daño patrimonial',
      'Reclamo extrajudicial o comparendo en JPL / SERNAC',
      'Negociación con reserva de acciones o demanda de indemnización',
    ],
    wa: 'Hola. Me encuentro %EMOTION% y requiero defensa en materia de consumo. Mi pretensión: %NEED%.',
  },
  notarial: {
    title: 'Derecho notarial y registral',
    icon: 'file-signature',
    summary:
      'Instrumentos públicos o privados con fuerza ejecutiva: compraventas, testamentos, mandatos judiciales. La certeza jurídica exige redacción precisa y, si corresponde, inscripción registral.',
    steps: [
      'Revisión o redacción del borrador con enfoque registral',
      'Protocolización notarial y validación de requisitos legales',
      'Inscripción, conservación y resguardo documental',
    ],
    wa: 'Hola. Busco certeza en instrumentos notariales/registrales. Mi pretensión: %NEED%.',
  },
  empresa: {
    title: 'Asesoría corporativa y laboral',
    icon: 'building-2',
    summary:
      'Personas jurídicas y Pymes: contratos mercantiles, defensa en Dirección del Trabajo, JPL y cumplimiento de la Ley 21.442 de copropiedad. El riesgo suele estar en la operación diaria, no solo en el juicio.',
    steps: [
      'Diagnóstico de riesgos contractuales y laborales',
      'Ajuste de contratos, reglamentos internos o defensa administrativa',
      'Patrocinio en JPL o tribunales laborales si la controversia escala',
    ],
    wa: 'Hola. Requiero asesoría para mi negocio o comunidad. Mi pretensión: %NEED%.',
  },
};

const EMOTION_LABEL = {
  overwhelmed: 'en situación de sobrecarga',
  angry: 'con indignación ante un incumplimiento',
  afraid: 'con alerta por el riesgo del conflicto',
  urgent: 'con urgencia procesal',
  calm: 'en modalidad preventiva',
};

const EMOTION_EMPATHY = {
  overwhelmed:
    'El orden procesal empieza por nombrar el conflicto. Ya dio ese paso; el siguiente es definir la vía con un abogado titular.',
  angry:
    'La ley no premia la pasividad ante un abuso de derecho, pero sí exige prueba y estrategia. Conviene actuar con método, no solo con ímpetu.',
  afraid:
    'Muchos plazos son fatalos en derecho. Por eso conviene traducir el miedo en un plan: hechos, documentos y pretensión clara.',
  urgent:
    'La urgencia no suspende las reglas del procedimiento, pero sí obliga a priorizar medidas conservativas o notificaciones oportunas.',
  calm:
    'Anticipar el conflicto reduce honorarios y exposición. Es la decisión más racional en términos de gestión de riesgo legal.',
};

const NEED_LABEL = {
  diagnose: 'obtener un dictamen de viabilidad',
  act: 'activar gestiones o patrocinio de inmediato',
  rights: 'comprender mis derechos y obligaciones',
  prevent: 'evitar la escalada a litigio',
};

function getUrgency(emotion, situation, need) {
  if (situation === 'fraude' || emotion === 'urgent' || need === 'act') {
    return { label: 'Prioridad procesal alta', class: 'urgent' };
  }
  if (emotion === 'calm' && need === 'prevent') {
    return { label: 'Ruta preventiva', class: 'calm' };
  }
  return { label: 'Ruta jurídica recomendada', class: 'normal' };
}

function buildResultMessage(area, need) {
  if (need === 'act') {
    return `Diagnóstico preliminar: activa la ruta «${area.title}». Dada su pretensión de gestión inmediata, sugiero contactar al abogado titular hoy para evaluar medidas prejudiciales o cautelares.`;
  }
  if (need === 'diagnose') {
    return `Hipótesis jurídica principal: «${area.title}». Con un dictamen de viabilidad en ~48 horas hábiles puede decidir si conviene litigar, transar o desistir.`;
  }
  if (need === 'rights') {
    return `En «${area.title}» lo primero es fijar el marco normativo aplicable y sus efectos sobre su posición. Abajo resume los hitos que suele revisar el estudio.`;
  }
  return `Recomendación: «${area.title}» con enfoque preventivo. El objetivo es cortar el daño antes de que derive en procedimiento contencioso.`;
}

function buildWaMessage(answers, contact = {}) {
  const area = AREA_RESULTS[answers.situation];
  if (!area) return '';
  let text = area.wa
    .replace('%EMOTION%', EMOTION_LABEL[answers.emotion] || '')
    .replace('%NEED%', NEED_LABEL[answers.need] || '');
  if (contact.name) text += ` Nombre: ${contact.name}.`;
  if (contact.phone) text += ` Teléfono: ${contact.phone}.`;
  if (contact.detail) text += ` Hechos relevantes: ${contact.detail}`;
  if (contact.slot) text += ` Preferencia de contacto: ${contact.slot}.`;
  return text;
}
