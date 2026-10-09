const json = (data, status = 200, extraHeaders = {}) => Response.json(data, {
  status,
  headers: { "Cache-Control": "public, max-age=3600", ...extraHeaders }
});

export async function onRequestGet({ request }) {
  const word = new URL(request.url).searchParams.get("word")?.trim().toLowerCase() || "";
  if (!/^[a-z][a-z'-]{0,39}$/i.test(word)) {
    return json({ error: "Escribe una sola palabra en inglés." }, 400, { "Cache-Control": "no-store" });
  }

  try {
    const upstream = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      headers: { Accept: "application/json" }
    });
    const body = await upstream.json();
    return json(body, upstream.status);
  } catch {
    return json({ error: "No fue posible consultar Dictionary API." }, 502, { "Cache-Control": "no-store" });
  }
}
