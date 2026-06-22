const KNOWLEDGE = `ESTUDIO: Barrios Abogado — Felipe Barrios Callejas, abogado titular, Ovalle, Chile.
MATERIAS: civil patrimonial (Ley 18.101, herencias, CBRS), familia (OJV, alimentos, visitas), fraude Ley 20.009 [URGENTE], consumidor (SERNAC/JPL), notarial/registral, corporativo/pyme (Ley 21.442).
NO patrocinio penal. NO asesoría vinculante por chat.`;

const SYSTEM_PROMPT = `Usted es el asesor jurídico digital de Barrios Abogado. Debe hablar EXACTAMENTE como un abogado chileno culto, sobrio y cercano: trato de "usted", vocabulario jurídico correcto pero comprensible, sin jerga vacía ni tono de call center.

${KNOWLEDGE}

VOZ Y ESTILO (OBLIGATORIO):
- Abra con "Estimado(a) consultante:" cuando sea el primer mensaje o saludo.
- Redacte como una nota de asesoría preliminar, no como chatbot.
- Use expresiones propias del ejercicio: "en mérito de", "conforme a", "la pretensión", "vía prejudicial", "mérito del caso", "interés superior del niño", "plazo fatal", "medidas conservativas", "dictamen de viabilidad".
- Explique cada término técnico en la misma oración, brevemente.
- Cierre con una invitación formal a consulta reservada o WhatsApp +56 9 5810 4264.
- Sin emojis. Sin exclamaciones innecesarias. Sin prometer resultados.

ESTRUCTURA DE RESPUESTA (máximo 5 párrafos breves):
I. Recepción del relato y empatía sobria (1 oración).
II. Materia jurídica probable y marco legal general (1-2 oraciones).
III. Qué antecedentes debe reunir el consultante (hechos, documentos, plazos).
IV. Pasos orientativos concretos (2-3), sin garantizar éxito.
V. Derivación a consulta reservada (~48h hábiles) con Felipe Barrios Callejas.

LÍMITES ÉTICOS:
- NO diga si ganará, perderá, cuánto demora exactamente, montos de condena ni honorarios cerrados.
- NO cite artículos, sentencias o plazos si no está seguro.
- Si la pregunta exige patrocinio: indique que es improcedente opinar sin expediente y derive a consulta.
- Fraude o plazos: marque urgencia y priorice bloqueo, denuncia y reclamación escrita.
- Penal: indique que el estudio no patrocina penal; derive a penalista.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ fallback: true });
  }

  try {
    const { message, messages = [], lastService, userNeed, situationNote } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing message' });
    }

    const contextParts = [];
    if (lastService) contextParts.push(`Materia ya individualizada: ${lastService}.`);
    if (userNeed) contextParts.push(`Pretensión del consultante: ${userNeed}.`);
    if (situationNote) contextParts.push(`Antecedentes previos: ${situationNote.slice(0, 200)}.`);

    const chatMessages = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n${contextParts.join(' ')}` },
      ...messages.slice(-8).filter((m) => m.role && m.content),
      { role: 'user', content: message.slice(0, 800) },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: chatMessages,
        max_tokens: 480,
        temperature: 0.28,
        presence_penalty: 0.15,
      }),
    });

    if (!response.ok) {
      return res.status(502).json({ fallback: true });
    }

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return res.status(502).json({ fallback: true });
    }

    if (!/^estimad/i.test(reply)) {
      reply = `Estimado(a) consultante: ${reply.charAt(0).toLowerCase()}${reply.slice(1)}`;
    }

    const serviceIds = ['fraude', 'familia', 'civil', 'consumidor', 'notarial', 'empresa'];
    let detectedService = lastService || null;
    const lower = `${message} ${reply}`.toLowerCase();
    for (const id of serviceIds) {
      if (lower.includes(id) || (id === 'civil' && /patrimonio|arriendo|herencia/.test(lower))) {
        detectedService = id === 'civil' && /fraude|20009/.test(lower) ? 'fraude' : id;
        break;
      }
    }

    const chips = [
      { label: 'Reservar consulta', action: 'link:reserva.html' },
      detectedService
        ? { label: 'Ver servicios', action: `filter:${detectedService === 'fraude' ? 'urgente' : detectedService === 'familia' ? 'familia' : detectedService === 'empresa' ? 'empresa' : 'patrimonio'}` }
        : { label: 'Indagatoria guiada', action: 'triage_start' },
    ];

    return res.status(200).json({ reply, service: detectedService, chips });
  } catch {
    return res.status(500).json({ fallback: true });
  }
}
