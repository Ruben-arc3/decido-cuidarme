const json = (data, status = 200, cache = "public, max-age=900") => Response.json(data, {
  status,
  headers: { "Cache-Control": cache }
});

export async function onRequestGet({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("q")?.trim() || "";
  const after = searchParams.get("after")?.trim() || "";
  if (!query || query.length > 60 || /[\u0000-\u001f\u007f]/.test(query)) {
    return json({ error: "Escribe una palabra o tema breve." }, 400, "no-store");
  }
  if (after && (after.length > 100 || !/^[0-9,]+$/.test(after))) {
    return json({ error: "Cursor de página no válido." }, 400, "no-store");
  }

  const params = new URLSearchParams({
    lang: "eng", q: query,
    "showtrans:lang": "spa", sort: "relevance", limit: "20"
  });
  if (after) params.set("after", after);

  try {
    const upstream = await fetch(`https://api.tatoeba.org/v1/sentences?${params}`, {
      headers: { Accept: "application/json" }
    });
    const payload = await upstream.json();
    if (!upstream.ok) return json({ error: "Tatoeba no pudo completar la búsqueda." }, upstream.status, "no-store");
    const data = (Array.isArray(payload.data) ? payload.data : []).map(sentence => ({
      id: sentence.id,
      text: sentence.text,
      owner: sentence.owner,
      license: sentence.license,
      translations: (sentence.translations || []).filter(item => item.lang === "spa").map(item => ({
        id: item.id, text: item.text, owner: item.owner, license: item.license
      }))
    })).filter(sentence => sentence.text);
    let next = null;
    if (payload.paging?.next) {
      try { next = new URL(payload.paging.next).searchParams.get("after"); } catch { next = null; }
    }
    return json({ data, next });
  } catch {
    return json({ error: "No fue posible conectar con Tatoeba." }, 502, "no-store");
  }
}
