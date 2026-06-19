/* Base de conocimiento — chat asesor Barrios (orientación, no patrocinio) */
const CHAT_CONFIG = {
  name: 'Asesor Barrios',
  disclaimer:
    'Orientación preliminar · No constituye patrocinio ni asesoría legal vinculante. El abogado titular responde en consulta reservada.',
  wa: '56958104264',
  waBase: 'https://wa.me/56958104264',
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
      'patrimonio', 'civil', 'arrendatario', 'arrendador',
    ],
    teaser:
      'En materia civil patrimonial el estudio revisa contratos, arriendos (Ley 18.101), restitución de inmuebles y trámites ante el CBRS.',
    nextStep: 'El abogado titular evaluará título, contrato y la vía prejudicial o judicial que corresponda.',
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
      'familia', 'mediación', 'mediacion', 'matrimonio', 'hijos', 'tuición',
    ],
    teaser:
      'En derecho de familia trabajamos divorcio, alimentos, régimen de visitas y mediación vía OJV, priorizando el interés superior del niño.',
    nextStep: 'Los detalles de su situación familiar los analiza Felipe Barrios en entrevista confidencial.',
    href: 'reserva.html',
    section: 'servicios',
  },
  {
    id: 'fraude',
    label: 'Fraude / Ley 20.009',
    icon: 'shield-alert',
    filter: 'urgente',
    keywords: [
      'fraude', 'phishing', 'clonación', 'clonacion', 'cargo', 'banco', 'tarjeta',
      'transferencia', '20009', 'estafa', 'robo', 'hackeo',
    ],
    teaser:
      'Ante fraude con medio de pago, la Ley 20.009 establece plazos para que el banco restituya si se cumplen los requisitos — el banco puede resistirse.',
    nextStep: 'Conviene actuar pronto: bloqueo, denuncia y reclamación formal. El abogado define la escalada (CMF, JPL o juicio).',
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
    ],
    teaser:
      'En relaciones de consumo se evalúan garantías legales, cláusulas abusivas y comparendos ante JPL o SERNAC.',
    nextStep: 'La estrategia concreta — reclamo extrajudicial o demanda — la define el abogado con sus documentos.',
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
      'notarial', 'registral', 'inscripción', 'inscripcion',
    ],
    teaser:
      'En notarial y registral se busca certeza: compraventas, testamentos, mandatos e inscripciones sin errores que generen nulidad.',
    nextStep: 'La redacción y revisión fina la realiza el abogado titular según el objeto del acto jurídico.',
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
      'comunidad', 'contrato mercantil', 'corporativo', 'sociedad',
    ],
    teaser:
      'Para Pymes y comunidades: contratos, defensa laboral, JPL y cumplimiento de la Ley 21.442 de copropiedad.',
    nextStep: 'El diagnóstico corporativo parte por el riesgo operativo real de su negocio o comunidad.',
    href: 'reserva.html',
    section: 'servicios',
  },
];

const CHAT_QUICK_START = [
  { label: '¿Qué servicio necesito?', action: 'help_choose' },
  { label: 'Fraude bancario', action: 'service:fraude' },
  { label: 'Familia / divorcio', action: 'service:familia' },
  { label: 'Reservar consulta', action: 'link:reserva.html' },
];

const CHAT_BOUNDARY_PATTERNS = [
  /\b(tengo derecho|puedo demandar|me conviene demandar|ganaré|ganare|cuánto demora|cuanto demora|plazo exacto|honorarios exactos|cuánto cuesta|cuanto cuesta|me van a condenar|sentencia|estrategia para|qué hago si mañana|que hago si manana)\b/i,
  /\b(es legal|es ilegal|me pueden|pueden embargar|prescripción|prescripcion|caducidad)\b/i,
];
