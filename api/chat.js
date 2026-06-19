const KNOWLEDGE = `SERVICIOS BARRIOS ABOGADO (Felipe Barrios Callejas, Ovalle, Chile):
- civil: patrimonio, arriendos Ley 18.101, herencias, restitución, CBRS
- familia: divorcio, alimentos, visitas, mediación OJV, interés superior del niño
- fraude: Ley 20.009, cargos no autorizados, plazos bancarios, CMF/JPL [URGENTE]
- consumidor: garantías, SERNAC, JPL, reclamos a proveedores
- notarial: escrituras, testamentos, mandatos, inscripción registral
- empresa: Pymes, laboral, copropiedad Ley 21.442, contratos mercantiles
NO patrocinio penal. NO asesoría vinculante por chat.`;

const SYSTEM_PROMPT = `Eres el asesor digital profesional de Barrios Abogado. Hablas como un abogado orientador chileno: claro, sobrio, empático y preciso.

${KNOWLEDGE}

ESTRUCTURA DE CADA RESPUESTA (máximo 5 párrafos cortos):
1. Reconoce brevemente la situación del usuario (sin dramatizar).
2. Indica la materia jurídica probable del estudio (civil, familia, fraude, etc.).
3. Explica en lenguaje simple qué suele revisar el abogado titular (hechos, documentos, plazos).
4. Da 2-3 pasos orientativos concretos (prejudicial, denuncia, reclamo, etc.) sin garantizar resultado.
5. Cierra invitando a reserva (~48h hábiles) o WhatsApp +56 9 5810 4264.

REGLAS OBLIGATORIAS:
- NO concluyas si ganará/perderá, plazos exactos, montos de condena ni honorarios cerrados.
- NO inventes artículos, sentencias ni plazos que no conozcas con certeza.
- Si falta contexto, haz UNA pregunta concreta antes de derivar.
- Fraude bancario o plazos: marca urgencia y prioriza bloqueo + reclamo formal.
- Tono: profesional, humano, sin emojis. Términos jurídicos explicados en simple.
- Si preguntan penal: indica que el estudio no patrocina penal; deriva a penalista si aplica.

Al final de tu razonamiento interno, si identificaste servicio, inclúyelo mentalmente como: familia|civil|fraude|consumidor|notarial|empresa.`;

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
    if (lastService) contextParts.push(`Materia previa detectada: ${lastService}.`);
    if (userNeed) contextParts.push(`Objetivo del usuario: ${userNeed}.`);
    if (situationNote) contextParts.push(`Contexto previo: ${situationNote.slice(0, 200)}.`);

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
        max_tokens: 420,
        temperature: 0.35,
        presence_penalty: 0.1,
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
        : { label: 'Orientarme paso a paso', action: 'triage_start' },
    ];

    return res.status(200).json({ reply, service: detectedService, chips });
  } catch {
    return res.status(500).json({ fallback: true });
  }
}
