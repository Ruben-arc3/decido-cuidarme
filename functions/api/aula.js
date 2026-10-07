const AREAS = {
  lectura: "Lectura Crítica",
  matematicas: "Matemáticas",
  sociales: "Sociales y Ciudadanas",
  ciencias: "Ciencias Naturales",
  ingles: "Inglés"
};
const TOPICS = [
  "Proyecto de vida y motivación", "Preparación para el ICFES",
  "Prevención del consumo de sustancias psicoactivas", "Prevención de la violencia intrafamiliar",
  "Prevención del abuso sexual", "Convivencia y bienestar", "Otro tema"
];
const json = (data, status = 200) => Response.json(data, {
  status,
  headers: { "Cache-Control": "no-store" }
});

function extractJSON(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No se recibió JSON.");
  return JSON.parse(text.slice(start, end + 1));
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin");
  if (origin && new URL(origin).origin !== new URL(request.url).origin) {
    return json({ error: "Origen no permitido." }, 403);
  }
  const size = Number(request.headers.get("Content-Length") || 0);
  if (size > 4000) return json({ error: "Solicitud demasiado grande." }, 413);

  let body;
  try { body = await request.json(); }
  catch { return json({ error: "Solicitud JSON no válida." }, 400); }
  if (!env.AI) return json({ error: "Vincula Workers AI a este proyecto de Pages." }, 503);

  const mode = body.mode;
  let prompt;
  if (mode === "exam") {
    const area = typeof body.area === "string" ? body.area : "all";
    const count = Number(body.count);
    if (area !== "all" && !AREAS[area]) return json({ error: "Área no válida." }, 400);
    if (![5, 10].includes(count)) return json({ error: "Cantidad no válida." }, 400);
    const areaInstruction = area === "all"
      ? "Distribuye las preguntas entre Lectura Crítica, Matemáticas, Sociales y Ciudadanas, Ciencias Naturales e Inglés."
      : `Todas las preguntas deben pertenecer a ${AREAS[area]}.`;
    prompt = `Crea ${count} preguntas originales de práctica inspiradas en el tipo de razonamiento de Saber 11 de Colombia, para estudiantes de grados 10 y 11. No copies preguntas oficiales, no afirmes que son oficiales y no inventes datos sobre el examen. ${areaInstruction}
Cada pregunta debe tener un estímulo concreto (texto, tabla descrita en texto, datos, caso o situación), un enunciado que exija inferir, contrastar evidencia, modelar o aplicar varios pasos, y cuatro opciones plausibles con una sola respuesta correcta. Escribe distractores verosímiles basados en errores de interpretación o procedimiento; evita opciones absurdas, pistas gramaticales, preguntas de memoria directa y enunciados que revelen la clave. Ajusta la complejidad a grado 10 u 11 sin exigir conocimientos universitarios. En Matemáticas, incluye al menos dos pasos o una comparación; en Ciencias, datos o diseño de investigación; en Sociales, perspectivas, fuentes o criterios de decisión; en Lectura, interpretación o evaluación de un argumento; en Inglés, comprensión contextual con un texto suficiente. La explicación debe justificar la clave y mostrar por qué una confusión frecuente no funciona. Evita asuntos personales sensibles.
Devuelve únicamente JSON válido con este formato, sin Markdown ni texto adicional:
{"questions":[{"area":"lectura|matematicas|sociales|ciencias|ingles","stimulus":"...","question":"...","options":["...","...","...","..."],"answer":0,"explanation":"..."}]}
El campo answer es el índice numérico de la opción correcta entre 0 y 3. No incluyas respuestas en el texto de la pregunta.`;
  } else if (mode === "lesson") {
    const topic = TOPICS.includes(body.topic) ? body.topic : TOPICS[0];
    const duration = [30, 45, 60].includes(Number(body.duration)) ? Number(body.duration) : 45;
    const group = ["small", "medium", "large"].includes(body.group) ? body.group : "medium";
    const style = ["teams", "debate", "stations", "individual"].includes(body.style) ? body.style : "teams";
    prompt = `Diseña una clase participativa para estudiantes de secundaria de Colombia. Tema: ${topic}. Duración: ${duration} minutos. Tamaño del grupo: ${group}. Dinámica elegida por el docente: ${style}. Devuelve una propuesta editable, concreta y apropiada para el aula. Evita discursos largos, pedir experiencias personales sensibles y actividades que expongan o califiquen públicamente a un estudiante. Incluye un inicio breve que active curiosidad, un objetivo observable, exactamente 3 ideas clave, una actividad central con instrucciones claras y participación de todo el grupo, un cierre con pregunta o acción, y materiales comunes o ninguno. Ajusta el trabajo al tiempo y tamaño del grupo.
Devuelve solo JSON válido, sin Markdown, con esta forma: {"title":"...","objective":"...","warmup":"...","keyIdeas":["...","...","..."],"activity":"...","closing":"...","materials":"..."}. No agregues campos.`;
  } else {
    return json({ error: "Tipo de solicitud no válido." }, 400);
  }

  try {
    const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast", {
      messages: [
        { role: "system", content: "Eres un creador de materiales educativos en español. Produce contenido claro, respetuoso y apropiado para adolescentes. Sigue exactamente el formato JSON solicitado." },
        { role: "user", content: prompt }
      ],
      max_tokens: mode === "exam" ? 3500 : 1100,
      temperature: 0.55
    });
    let output = result?.response ?? result?.choices?.[0]?.message?.content ?? result;
    if (typeof output !== "string") output = JSON.stringify(output);
    const parsed = extractJSON(output);

    if (mode === "lesson") {
      const fields = ["title", "objective", "warmup", "activity", "closing", "materials"];
      if (fields.some((key) => typeof parsed[key] !== "string" || parsed[key].length > 1200) ||
          !Array.isArray(parsed.keyIdeas) || parsed.keyIdeas.length !== 3 ||
          parsed.keyIdeas.some((idea) => typeof idea !== "string" || idea.length > 300)) {
        throw new Error("La propuesta de clase no tiene el formato esperado.");
      }
      return json({ lesson: Object.fromEntries([...fields.map((key) => [key, parsed[key].trim()]), ["keyIdeas", parsed.keyIdeas.map((idea) => idea.trim())]]) });
    }

    const requestedArea = body.area === "all" ? "all" : body.area;
    const count = Number(body.count);
    if (!Array.isArray(parsed.questions)) throw new Error("Falta la lista de preguntas.");
    const questions = parsed.questions.slice(0, count).map((q) => {
      const area = AREAS[q.area] ? q.area : (requestedArea === "all" ? "lectura" : requestedArea);
      if (typeof q.stimulus !== "string" || q.stimulus.trim().length < 35 || q.stimulus.length > 1500 ||
          typeof q.question !== "string" || q.question.length > 800 ||
          !Array.isArray(q.options) || q.options.length !== 4 ||
          q.options.some((option) => typeof option !== "string" || option.length > 350) ||
          !Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3 ||
          typeof q.explanation !== "string" || q.explanation.length > 1000) return null;
      return {
        area,
        areaName: AREAS[area],
        stimulus: q.stimulus.trim(),
        question: q.question.trim(),
        options: q.options.map((option) => option.trim()),
        answer: q.answer,
        explanation: q.explanation.trim()
      };
    }).filter(Boolean);
    if (questions.length < Math.min(3, count)) throw new Error("No llegaron suficientes preguntas válidas.");
    return json({ questions, official: false });
  } catch {
    return json({ error: "No se pudieron crear materiales nuevos. Usa el banco de práctica local o ajusta los datos." }, 502);
  }
}
