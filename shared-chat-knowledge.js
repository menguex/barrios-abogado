/* Base de conocimiento — chat asesor Barrios (orientación, no patrocinio) */
const CHAT_CONFIG = {
  name: 'Asesor Barrios',
  counsel: 'Felipe Barrios Callejas',
  firm: 'Barrios Abogado',
  disclaimer:
    'Orientación preliminar · No constituye patrocinio ni asesoría legal vinculante. El abogado titular responde en consulta reservada.',
  wa: '56958104264',
  waBase: 'https://wa.me/56958104264',
  responseHours: '48 horas hábiles',
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
      'En materia civil patrimonial el estudio revisa contratos, arriendos (Ley 18.101), restitución de inmuebles y trámites ante el CBRS.',
    nextStep: 'El abogado titular evaluará título, contrato y la vía prejudicial o judicial que corresponda.',
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
      'En derecho de familia trabajamos divorcio, alimentos, régimen de visitas y mediación vía OJV, priorizando el interés superior del niño.',
    nextStep: 'Los detalles de su situación familiar los analiza Felipe Barrios en entrevista confidencial.',
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
      'Ante fraude con medio de pago, la Ley 20.009 establece plazos para que el banco restituya si se cumplen los requisitos — el banco puede resistirse.',
    nextStep: 'Conviene actuar pronto: bloqueo, denuncia y reclamación formal. El abogado define la escalada (CMF, JPL o juicio).',
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
      'En relaciones de consumo se evalúan garantías legales, cláusulas abusivas y comparendos ante JPL o SERNAC.',
    nextStep: 'La estrategia concreta — reclamo extrajudicial o demanda — la define el abogado con sus documentos.',
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
      'En notarial y registral se busca certeza: compraventas, testamentos, mandatos e inscripciones sin errores que generen nulidad.',
    nextStep: 'La redacción y revisión fina la realiza el abogado titular según el objeto del acto jurídico.',
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
      'Para Pymes y comunidades: contratos, defensa laboral, JPL y cumplimiento de la Ley 21.442 de copropiedad.',
    nextStep: 'El diagnóstico corporativo parte por el riesgo operativo real de su negocio o comunidad.',
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
    question: '¿Su consulta es sobre una persona, un inmueble/patrimonio, una empresa o un cobro/fraude bancario?',
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
    question: '¿Qué busca principalmente en este momento?',
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
