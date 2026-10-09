const json = (data, status = 200, extraHeaders = {}) => Response.json(data, {
  status,
  headers: { "Cache-Control": "public, max-age=3600", ...extraHeaders }
});

export async function onRequestGet({ request }) {
  const word = new URL(request.url).searchParams.get("word")?.trim().toLowerCase() || "";
  if (!/^[a-z][a-z'-]{0,39}$/i.test(word)) {
    return json({ error: "Escribe una sola palabra en inglés." }, 400, { "Cache-Control": "no-store" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);
  try {
    const upstream = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    const body = await upstream.json();
    return json(body, upstream.status);
  } catch (error) {
    const timedOut = error?.name === "AbortError";
    return json(
      { error: timedOut ? "La consulta al diccionario agotó el tiempo de espera." : "No fue posible consultar Dictionary API." },
      timedOut ? 504 : 502,
      { "Cache-Control": "no-store" }
    );
  } finally {
    clearTimeout(timeout);
  }
}
