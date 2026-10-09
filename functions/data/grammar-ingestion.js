const PREFIX = "grammar-kb/";
const MAX_DOCS = 10;
const MAX_CHUNKS_PER_DOC = 500;
const MAX_DOC_TEXT = 750_000;

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
});

export function ingestionError(message, status = 400) { return json({ error: message }, status); }

export function validateIngestionRequest(request, env) {
  const origin = request.headers.get("Origin");
  if (origin && new URL(origin).origin !== new URL(request.url).origin) return "El origen de la solicitud no está permitido.";
  if (!env.GRAMMAR_INGEST_KEY) return "Falta el secreto GRAMMAR_INGEST_KEY en Cloudflare Pages.";
  if (!env.GRAMMAR_KB) return "Falta enlazar el bucket R2 con el nombre GRAMMAR_KB en Cloudflare Pages.";
  const supplied = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (supplied.length !== env.GRAMMAR_INGEST_KEY.length || supplied !== env.GRAMMAR_INGEST_KEY) return "Clave de gestión incorrecta.";
  return null;
}

export function splitPagesIntoChunks(pages, title) {
  const chunks = [];
  for (const page of pages) {
    const pageNumber = Number(page?.page);
    const text = typeof page?.text === "string" ? page.text.replace(/\0/g, " ").replace(/\s+/g, " ").trim() : "";
    const words = text.split(" ").filter(Boolean);
    let start = 0;
    while (start < words.length) {
      let end = start;
      let length = 0;
      while (end < words.length && length + words[end].length + (end > start ? 1 : 0) <= 1150) {
        length += words[end].length + (end > start ? 1 : 0);
        end++;
      }
      if (end === start) end++;
      const content = words.slice(start, end).join(" ");
      if (content.length >= 80) chunks.push({
        id: `p${pageNumber}-c${chunks.length + 1}`,
        title: `${title} · página ${pageNumber}`,
        source: title,
        pages: String(pageNumber),
        text: content
      });
      if (end >= words.length) break;
      let overlapWords = 0;
      let overlapLength = 0;
      while (end - overlapWords > start && overlapLength < 130) {
        overlapWords++;
        overlapLength += words[end - overlapWords].length + 1;
      }
      start = Math.max(start + 1, end - overlapWords);
    }
    if (chunks.length > MAX_CHUNKS_PER_DOC) throw new Error(`El PDF produce demasiados fragmentos (máximo ${MAX_CHUNKS_PER_DOC}).`);
  }
  return chunks;
}

export async function listIngestedGrammar(env) {
  const result = await env.GRAMMAR_KB.list({ prefix: PREFIX, limit: MAX_DOCS + 1 });
  const documents = [];
  for (const object of result.objects) {
    if (!object.key.endsWith(".json")) continue;
    const stored = await env.GRAMMAR_KB.get(object.key);
    if (!stored) continue;
    try {
      const document = await stored.json();
      documents.push({ id: document.id, title: document.title, pages: document.pageCount, chunks: document.chunks?.length || 0, addedAt: document.addedAt });
    } catch { /* Ignore a corrupt object and keep the other documents available. */ }
  }
  return documents;
}

export async function readIngestedGrammar(env) {
  const keys = await env.GRAMMAR_KB.list({ prefix: PREFIX, limit: MAX_DOCS });
  const all = [];
  for (const object of keys.objects) {
    if (!object.key.endsWith(".json")) continue;
    const stored = await env.GRAMMAR_KB.get(object.key);
    if (!stored) continue;
    try {
      const document = await stored.json();
      if (Array.isArray(document.chunks)) all.push(...document.chunks);
    } catch { /* Skip corrupt content rather than breaking every tutoring request. */ }
  }
  return all;
}

export async function onGrammarIngestGet({ request, env }) {
  const problem = validateIngestionRequest(request, env);
  if (problem) return ingestionError(problem, problem.startsWith("Clave") ? 401 : problem.startsWith("El origen") ? 403 : 503);
  try { return json({ documents: await listIngestedGrammar(env) }); }
  catch { return ingestionError("No se pudo consultar el almacenamiento R2.", 502); }
}

export async function onGrammarIngestPost({ request, env }) {
  const problem = validateIngestionRequest(request, env);
  if (problem) return ingestionError(problem, problem.startsWith("Clave") ? 401 : problem.startsWith("El origen") ? 403 : 503);
  const length = Number(request.headers.get("Content-Length") || 0);
  if (length > 2_500_000) return ingestionError("El texto extraído supera el límite de 2.5 MB.", 413);
  let body;
  try { body = await request.json(); } catch { return ingestionError("No se pudo leer el contenido del documento."); }
  const title = typeof body?.title === "string" ? body.title.trim().slice(0, 120) : "";
  const pages = Array.isArray(body?.pages) ? body.pages : [];
  if (title.length < 2) return ingestionError("Escribe un título para el documento.");
  if (!pages.length || pages.length > 500) return ingestionError("El documento debe contener entre 1 y 500 páginas con texto.");
  const totalText = pages.reduce((sum, page) => sum + (typeof page?.text === "string" ? page.text.length : 0), 0);
  if (totalText > MAX_DOC_TEXT) return ingestionError("El PDF contiene demasiado texto para una sola ingesta (máximo 750 KB de texto extraído). Divide el documento en partes.", 413);
  let chunks;
  try { chunks = splitPagesIntoChunks(pages, title); }
  catch (error) { return ingestionError(error.message, 413); }
  if (!chunks.length) return ingestionError("No encontramos texto legible. Si el PDF es escaneado, primero necesita OCR.");
  try {
    const current = await env.GRAMMAR_KB.list({ prefix: PREFIX, limit: MAX_DOCS });
    if (current.objects.filter(object => object.key.endsWith(".json")).length >= MAX_DOCS) {
      return ingestionError(`La biblioteca llegó al máximo de ${MAX_DOCS} documentos. Elimina una fuente antes de ingresar otra.`, 409);
    }
  } catch { return ingestionError("No se pudo revisar el espacio de la biblioteca R2.", 502); }
  const id = crypto.randomUUID();
  const document = { id, title, pageCount: pages.length, chunkCount: chunks.length, addedAt: new Date().toISOString(), chunks };
  try {
    await env.GRAMMAR_KB.put(`${PREFIX}${id}.json`, JSON.stringify(document), {
      httpMetadata: { contentType: "application/json; charset=utf-8" },
      customMetadata: { title, pages: String(pages.length), chunks: String(chunks.length) }
    });
  } catch { return ingestionError("No se pudo guardar en R2. Revisa el bucket y los límites del proyecto.", 502); }
  return json({ document: { id, title, pages: pages.length, chunks: chunks.length } }, 201);
}

export async function onGrammarIngestDelete({ request, env }) {
  const problem = validateIngestionRequest(request, env);
  if (problem) return ingestionError(problem, problem.startsWith("Clave") ? 401 : problem.startsWith("El origen") ? 403 : 503);
  let body;
  try { body = await request.json(); } catch { return ingestionError("No se pudo leer la solicitud."); }
  const id = typeof body?.id === "string" ? body.id : "";
  if (!/^[a-f\d-]{36}$/i.test(id)) return ingestionError("Identificador de documento no válido.");
  try { await env.GRAMMAR_KB.delete(`${PREFIX}${id}.json`); return json({ ok: true }); }
  catch { return ingestionError("No se pudo eliminar el documento de R2.", 502); }
}
