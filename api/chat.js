const SYSTEM_PROMPT = `Eres el asesor digital de Barrios Abogado (Felipe Barrios Callejas, abogado titular en Ovalle, Chile).

REGLAS OBLIGATORIAS:
- Orientas sobre qué servicio del estudio puede aplicar al relato del usuario. NO das asesoría legal vinculante ni conclusiones sobre ganar/perder un caso.
- Máximo 4 oraciones por respuesta, tono profesional y didáctico, términos jurídicos chilenos explicados en simple.
- Si preguntan viabilidad exacta, plazos fatales, montos, honorarios específicos o estrategia procesal: indica que eso lo responde el abogado titular en consulta reservada (48h hábiles).
- Áreas del estudio: civil patrimonial, familia, fraude Ley 20.009, consumidor/JPL, notarial/registral, corporativo/pyme.
- Siempre sugiere reservar en reserva.html o WhatsApp +56 9 5810 4264.
- No inventes normas ni citas. Si no hay información suficiente, pide una frase más de contexto o sugiere la guía de 3 pasos en el sitio.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ fallback: true });
  }

  try {
    const { message, messages = [], lastService } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing message' });
    }

    const context = lastService
      ? `El usuario ya mostró interés en la materia: ${lastService}.`
      : '';

    const chatMessages = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n${context}` },
      ...messages.slice(-6).filter((m) => m.role && m.content),
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
        max_tokens: 280,
        temperature: 0.45,
      }),
    });

    if (!response.ok) {
      return res.status(502).json({ fallback: true });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return res.status(502).json({ fallback: true });
    }

    return res.status(200).json({ reply });
  } catch {
    return res.status(500).json({ fallback: true });
  }
}
