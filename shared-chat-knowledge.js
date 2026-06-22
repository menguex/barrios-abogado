/* Base de conocimiento — chat asesor Barrios (orientación, no patrocinio) */
const CHAT_CONFIG = {
  name: 'Asesoría preliminar',
  counsel: 'Felipe Barrios Callejas',
  firm: 'Barrios Abogado',
  disclaimer:
    'Opinión preliminar sin acceso al expediente · No constituye patrocinio ni asesoría legal vinculante. La consulta reservada con el abogado titular es la vía idónea para un dictamen fundado.',
  wa: '56958104264',
  waBase: 'https://wa.me/56958104264',
  responseHours: '48 horas hábiles',
};

/** Voz del asesor: abogado chileno, formal, claro, trato de usted */
const CHAT_VOICE = {
  saludo: 'Estimado(a) consultante:',
  cierre: 'Quedo a su disposición para continuar la orientación.',
  intro(firm, counsel) {
    return `${this.saludo} le saluda la <strong>asesoría preliminar de ${firm}</strong>. Mi función es recibir su relato, individualizar la materia jurídica y preparar su contacto con <strong>${counsel}</strong>, abogado titular del estudio.`;
  },
  need: {
    act: 'Su pretensión apunta a <strong>activar gestiones de inmediato</strong>. En derecho, la oportunidad procesal suele ser determinante; conviene reservar audiencia hoy para evaluar medidas prejudiciales o conservativas.',
    diagnose: `Usted requiere un <strong>dictamen de viabilidad</strong>. En el estudio, el abogado titular suele entregar una primera evaluación en ~${CHAT_CONFIG.responseHours}, indicando si procede litigar, transar o desistir.`,
    rights: 'Busca <strong>comprender el marco jurídico</strong> de su situación. Puedo orientarlo en líneas generales; la aplicación concreta a sus hechos exige revisar antecedentes y documentos.',
    prevent: 'Su enfoque es <strong>preventivo</strong>, lo cual es jurídicamente sensato: anticipar el conflicto reduce costos, riesgo procesal y exposición patrimonial.',
  },
  limite: 'Esa materia exige examinar hechos, prueba y plazos con el estándar de un abogado patrocinante. Emitir una conclusión vinculante por este medio sería técnicamente improcedente.',
  consulta: (hours, counsel) =>
    `Le sugiero agendar una <strong>consulta reservada</strong> (plazo orientativo: ${hours}), en la cual ${counsel} podrá emitir opinión fundada sobre viabilidad y ruta procesal, sin que ello implique patrocinio automático.`,
};

const CHAT_SERVICES = [
  {
    id: 'civil',
    label: 'Patrimonio / Civil',
    icon: 'home',
    filter: 'patrimonio',
    keywords: [
      'arriendo', 'arrendamiento', 'desalojo', 'usurpación', 'usurpacion', 'inmueble',
      'propiedad', 'herencia', 'herencias', 'contrato', 'cbrs', 'conservador', 'restitución',
      'patrimonio', 'civil', 'arrendatario', 'arrendador', 'sucesión', 'sucesion', 'testament',
      'embargo', 'hipoteca', 'compraventa',
    ],
    teaser:
      'En derecho civil patrimonial analizamos contratos, arrendamientos (Ley N° 18.101), acciones de restitución y tramitación ante el Conservador de Bienes Raíces.',
    nextStep: 'Con los antecedentes en mano, el abogado titular determinará la vía prejudicial o judicial que corresponda conforme al mérito del caso.',
    clarify: '¿El conflicto es por arriendo/desalojo, herencia/sucesión o incumplimiento de contrato?',
    href: 'reserva.html',
    section: 'servicios',
  },
  {
    id: 'familia',
    label: 'Familia',
    icon: 'heart-handshake',
    filter: 'familia',
    keywords: [
      'divorcio', 'alimentos', 'pensión', 'pension', 'visitas', 'cuidado personal',
      'familia', 'mediación', 'mediacion', 'matrimonio', 'hijos', 'tuición', 'tuicion',
      'régimen', 'regimen', 'compensación', 'compensacion',
    ],
    teaser:
      'En derecho de familia asistimos en divorcio, alimentos, régimen de relación directa y regular, y mediación vía OJV, con estricto respeto al interés superior del niño.',
    nextStep: 'Los aspectos fácticos y probatorios de su situación familiar serán analizados por el abogado titular en entrevista reservada y confidencial.',
    clarify: '¿Busca divorcio/separación, pensión de alimentos, visitas/cuidado personal u otro?',
    href: 'reserva.html',
    section: 'servicios',
  },
  {
    id: 'fraude',
    label: 'Fraude / Ley 20.009',
    icon: 'shield-alert',
    filter: 'urgente',
    urgent: true,
    keywords: [
      'fraude', 'phishing', 'clonación', 'clonacion', 'cargo', 'banco', 'tarjeta',
      'transferencia', '20009', 'estafa', 'robo', 'hackeo', 'compra no reconocida',
      'movimiento', 'cuenta', 'app bancaria',
    ],
    teaser:
      'Ante operaciones no autorizadas, la Ley N° 20.009 impone obligaciones de restitución a la entidad financiera, siempre que se cumplan los requisitos legales — el banco, con frecuencia, opone resistencia.',
    nextStep: 'Le recomiendo actuar sin demora: bloqueo del producto, denuncia y reclamación formal escrita. El abogado titular definirá la escalada (CMF, JPL o vía judicial).',
    clarify: '¿Ya bloqueó la tarjeta/cuenta y presentó reclamo formal al banco?',
    href: 'reserva.html',
    section: 'servicios',
  },
  {
    id: 'consumidor',
    label: 'Consumidor / JPL',
    icon: 'scale',
    filter: 'patrimonio',
    keywords: [
      'consumidor', 'sernac', 'garantía', 'garantia', 'empresa', 'reclamo', 'jpl',
      'policía local', 'policia local', 'proveedor', 'tienda', 'incumplimiento',
      'devolución', 'devolucion', 'reparación', 'reparacion',
    ],
    teaser:
      'En relaciones de consumo se examinan garantías legales, cláusulas abusivas y eventuales comparendos ante Juzgado de Policía Local o SERNAC.',
    nextStep: 'La estrategia — reclamo extrajudicial o demanda — será definida por el abogado titular una vez revisados sus antecedentes documentales.',
    clarify: '¿Tiene boleta/contrato y ya reclamó por escrito al proveedor?',
    href: 'reserva.html',
    section: 'servicios',
  },
  {
    id: 'notarial',
    label: 'Notarial / Registral',
    icon: 'file-signature',
    filter: 'patrimonio',
    keywords: [
      'notaría', 'notaria', 'testamento', 'mandato', 'compraventa', 'escritura',
      'notarial', 'registral', 'inscripción', 'inscripcion', 'protocolo',
    ],
    teaser:
      'En materia notarial y registral se procura certeza jurídica: compraventas, testamentos, mandatos e inscripciones, evitando vicios que puedan generar nulidad o inoponibilidad.',
    nextStep: 'La redacción, revisión y — si corresponde — protocolización, serán realizadas por el abogado titular según el objeto del acto jurídico.',
    clarify: '¿Necesita redactar un instrumento nuevo o revisar/corregir uno ya firmado?',
    href: 'reserva.html',
    section: 'servicios',
  },
  {
    id: 'empresa',
    label: 'Empresa / Pyme',
    icon: 'building-2',
    filter: 'empresa',
    keywords: [
      'empresa', 'pyme', 'laboral', 'trabajador', 'despido', 'copropiedad', '21442',
      'comunidad', 'contrato mercantil', 'corporativo', 'sociedad', 'administrador',
    ],
    teaser:
      'Para personas jurídicas, Pymes y comunidades: contratos mercantiles, defensa laboral, JPL y cumplimiento de la Ley N° 21.442 de copropiedad.',
    nextStep: 'El diagnóstico corporativo se inicia por el riesgo operativo efectivo de su negocio o comunidad, no solo por la eventualidad de un juicio.',
    clarify: '¿El conflicto es laboral, contractual mercantil o administración de copropiedad?',
    href: 'reserva.html',
    section: 'servicios',
  },
];

const CHAT_QUICK_START = [
  { label: 'Orientarme paso a paso', action: 'triage_start' },
  { label: '¿Qué servicio necesito?', action: 'help_choose' },
  { label: 'Fraude bancario (urgente)', action: 'service:fraude', urgent: true },
  { label: 'Familia / divorcio', action: 'service:familia' },
  { label: 'Reservar consulta', action: 'link:reserva.html' },
];

const CHAT_TRIAGE = [
  {
    id: 'nature',
    question: '¿Su consulta dice relación con derecho de familia, patrimonio/inmueble, empresa/comunidad, fraude bancario o relación de consumo?',
    map: {
      persona: ['familia'],
      inmueble: ['civil', 'notarial'],
      empresa: ['empresa'],
      fraude: ['fraude'],
      consumo: ['consumidor'],
    },
    chips: [
      { label: 'Persona / familia', action: 'triage:persona' },
      { label: 'Inmueble o patrimonio', action: 'triage:inmueble' },
      { label: 'Empresa o comunidad', action: 'triage:empresa' },
      { label: 'Fraude o cargo bancario', action: 'triage:fraude', urgent: true },
      { label: 'Compra o garantía', action: 'triage:consumo' },
    ],
  },
  {
    id: 'goal',
    question: '¿Cuál es su pretensión principal en este momento?',
    chips: [
      { label: 'Saber si tengo un caso', action: 'need:diagnose' },
      { label: 'Actuar ya (plazos)', action: 'need:act', urgent: true },
      { label: 'Entender mis derechos', action: 'need:rights' },
      { label: 'Evitar ir a juicio', action: 'need:prevent' },
    ],
  },
];

const CHAT_URGENCY_PATTERNS = [
  /\b(urgente|urgencia|hoy|mañana|manana|plazo|vence|venció|vencio|48 horas|72 horas|notificación|notificacion|embargo|desalojo mañana)\b/i,
  /\b(fraude|cargo no reconocido|bloquearon|robaron|estafa)\b/i,
];

const CHAT_EMOTION_PATTERNS = [
  { key: 'urgent', re: /\b(urgente|desesperad|no sé qué hacer|no se que hacer|plazo fatal)\b/i },
  { key: 'afraid', re: /\b(miedo|preocupad|asustad|nervios|angustia)\b/i },
  { key: 'angry', re: /\b(indignad|injusto|abuso|estafa|no responden)\b/i },
  { key: 'overwhelmed', re: /\b(abrumad|perdid|confundid|muchas cosas)\b/i },
  { key: 'calm', re: /\b(preventiv|anticip|consulta inicial|información)\b/i },
];

const CHAT_BOUNDARY_PATTERNS = [
  /\b(tengo derecho|puedo demandar|me conviene demandar|ganaré|ganare|cuánto demora|cuanto demora|plazo exacto|honorarios exactos|cuánto cuesta|cuanto cuesta|me van a condenar|sentencia|estrategia para|qué hago si mañana|que hago si manana)\b/i,
  /\b(es legal|es ilegal|me pueden|pueden embargar|prescripción|prescripcion|caducidad)\b/i,
];

/** Texto compacto para inyectar en el system prompt del API */
function buildChatKnowledgePrompt() {
  const lines = CHAT_SERVICES.map(
    (s) =>
      `- ${s.id} (${s.label}): ${s.teaser} Próximo paso: ${s.nextStep}${s.urgent ? ' [URGENTE]' : ''}`
  );
  return `SERVICIOS DEL ESTUDIO:\n${lines.join('\n')}\n\nDISCLAIMER: ${CHAT_CONFIG.disclaimer}`;
}
