const json = (data, status = 200, cache = "public, max-age=86400") => Response.json(data, {
  status,
  headers: { "Cache-Control": cache }
});

export async function onRequestGet({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const text = searchParams.get("text")?.trim() || "";
  const source = searchParams.get("source") || "en";
  const target = searchParams.get("target") || "es";
  if (![["en", "es"], ["es", "en"]].some(([from, to]) => source === from && target === to)) {
    return json({ error: "Par de idiomas no permitido." }, 400, "no-store");
  }
  const byteLength = new TextEncoder().encode(text).length;
  if (!text || byteLength > 500 || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text)) {
    return json({ error: "La frase está vacía o supera el límite permitido." }, 400, "no-store");
  }

  const params = new URLSearchParams({ q: text, langpair: `${source}|${target}`, mt: "1" });
  try {
    const upstream = await fetch(`https://api.mymemory.translated.net/get?${params}`, {
      headers: { Accept: "application/json" }
    });
    const payload = await upstream.json();
    const translated = payload.responseData?.translatedText;
    if (!upstream.ok || Number(payload.responseStatus) !== 200 || typeof translated !== "string" || !translated.trim()) {
      return json({ error: "MyMemory no devolvió una traducción." }, upstream.ok ? 502 : upstream.status, "no-store");
    }
    return json({ translated: translated.trim(), source: "MyMemory" });
  } catch {
    return json({ error: "No fue posible conectar con MyMemory." }, 502, "no-store");
  }
}
