// Genera preguntas de práctica Saber 11 con GroqCloud y valida su estructura.
const GROQ_MODEL = "openai/gpt-oss-20b";
const AREAS = {
  lectura: "Lectura Crítica",
  matematicas: "Matemáticas",
  sociales: "Sociales y Ciudadanas",
  ciencias: "Ciencias Naturales",
  ingles: "Inglés",
};
const AREA_KEYS = Object.keys(AREAS);
const json = (data, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
const requestBuckets = new Map();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 12;

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin");
  if (origin && new URL(origin).origin !== new URL(request.url).origin)
    return json({ error: "Origen no permitido." }, 403);
  if (!env.GROQ_API_KEY)
    return json({ error: "Falta configurar el secreto GROQ_API_KEY en Cloudflare Pages." }, 503);
  if (Number(request.headers.get("Content-Length") || 0) > 2000)
    return json({ error: "La solicitud supera el tamaño permitido." }, 413);

  const now = Date.now();
  const ip = request.headers.get("CF-Connecting-IP") || "local";
  let bucket = requestBuckets.get(ip);
  if (!bucket || bucket.resetAt <= now) bucket = { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (bucket.count >= RATE_LIMIT)
    return json({ error: "Se alcanzó el límite temporal de generación. Espera unos minutos." }, 429);
  bucket.count += 1;
  requestBuckets.set(ip, bucket);
  if (requestBuckets.size > 5000) {
    for (const [key, value] of requestBuckets) if (value.resetAt <= now) requestBuckets.delete(key);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Solicitud JSON no válida." }, 400);
  }
  const area = typeof body.area === "string" ? body.area : "all";
  const count = Number(body.count);
  if (area !== "all" && !AREAS[area]) return json({ error: "Área no válida." }, 400);
  if (![5, 10].includes(count)) return json({ error: "La cantidad debe ser 5 o 10 preguntas." }, 400);

  const areaInstruction = area === "all"
    ? "Distribuye las preguntas de forma equilibrada entre las cinco áreas."
    : `Todas las preguntas deben pertenecer exclusivamente al área ${AREAS[area]} (código ${area}).`;
  const prompt = `Escribe exactamente ${count} preguntas originales de práctica inspiradas en competencias Saber 11 para estudiantes colombianos de grados 10 y 11. No copies preguntas oficiales ni las presentes como oficiales. ${areaInstruction} Cada pregunta debe partir de un estímulo concreto y exigir interpretación o razonamiento de varios pasos; evita preguntas de memoria simple y temas personales sensibles. Incluye cuatro opciones plausibles y una sola correcta, más una explicación breve y pedagógica. En Inglés, escribe estímulo, pregunta y opciones en inglés y la explicación en español. Devuelve un objeto JSON con la propiedad questions. Usa en cada objeto los campos: area (lectura|matematicas|sociales|ciencias|ingles), stimulus, question, options (exactamente cuatro textos), answer (índice de 0 a 3), explanation. No agregues Markdown ni texto fuera del JSON.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: "Eres un creador experto de preguntas educativas. Cumple el esquema y las restricciones del usuario. Devuelve solo el objeto JSON solicitado.",
          },
          { role: "user", content: prompt },
        ],
        max_completion_tokens: count === 10 ? 6500 : 3500,
        reasoning_effort: "low",
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "saber11_practice_questions",
            strict: true,
            schema: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      area: { type: "string", enum: AREA_KEYS },
                      stimulus: { type: "string" },
                      question: { type: "string" },
                      options: {
                        type: "array",
                        items: { type: "string" },
                      },
                      answer: { type: "integer", enum: [0, 1, 2, 3] },
                      explanation: { type: "string" },
                    },
                    required: ["area", "stimulus", "question", "options", "answer", "explanation"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["questions"],
              additionalProperties: false,
            },
          },
        },
      }),
      signal: AbortSignal.timeout(45000),
    });

    const raw = await response.text();
    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      console.error("Groq examen respondió no JSON", JSON.stringify({ status: response.status, model: GROQ_MODEL }));
      return json({ error: "Groq devolvió una respuesta inesperada. Intenta de nuevo." }, 502);
    }
    if (!response.ok) {
      const providerMessage = String(result?.error?.message || "Sin detalle del proveedor").slice(0, 400);
      console.error("Groq examen API error", JSON.stringify({ status: response.status, model: GROQ_MODEL, providerMessage }));
      if (response.status === 429)
        return json({ error: "Groq alcanzó su límite temporal. Espera un momento y vuelve a intentarlo." }, 429);
      if ([401, 403].includes(response.status))
        return json({ error: "La clave de Groq no fue aceptada. Revisa el secreto GROQ_API_KEY en Cloudflare Pages." }, 502);
      return json({ error: "Groq no pudo generar preguntas ahora. Inténtalo de nuevo más tarde." }, 502);
    }

    const output = result?.choices?.[0]?.message?.content?.trim();
    let parsed;
    try {
      parsed = JSON.parse(output || "");
    } catch {
      console.error("Groq generó JSON de examen inválido", JSON.stringify({ model: GROQ_MODEL }));
      return json({ error: "No se pudo validar el material generado. Intenta de nuevo o usa el banco local." }, 502);
    }
    if (!Array.isArray(parsed.questions))
      return json({ error: "No llegaron preguntas válidas. Intenta de nuevo o usa el banco local." }, 502);

    const questions = parsed.questions
      .slice(0, count)
      .filter((item) =>
        AREAS[item.area] &&
        (area === "all" || item.area === area) &&
        typeof item.stimulus === "string" && item.stimulus.trim().length >= 35 && item.stimulus.length <= 1500 &&
        typeof item.question === "string" && item.question.trim().length > 0 && item.question.length <= 800 &&
        Array.isArray(item.options) && item.options.length === 4 &&
        item.options.every((option) => typeof option === "string" && option.trim() && option.length <= 350) &&
        Number.isInteger(item.answer) && item.answer >= 0 && item.answer <= 3 &&
        typeof item.explanation === "string" && item.explanation.trim() && item.explanation.length <= 1000,
      )
      .map((item) => ({ ...item, areaName: AREAS[item.area] }));
    if (questions.length < Math.min(3, count))
      return json({ error: "No llegaron suficientes preguntas válidas. Intenta de nuevo o usa el banco local." }, 502);
    return json({ questions, official: false });
  } catch (error) {
    const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError";
    console.error("Fallo al generar examen con Groq", JSON.stringify({ model: GROQ_MODEL, timedOut }));
    return json(
      { error: timedOut ? "La generación tardó demasiado. Intenta con menos preguntas o vuelve a intentar." : "No se pudo conectar con Groq. Revisa tu conexión e inténtalo otra vez." },
      502,
    );
  }
}
