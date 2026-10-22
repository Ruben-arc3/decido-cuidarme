// Cloudflare Pages proxy for restricted, module-specific YouTube searches.
const TOPICS = {
  proyecto: "proyecto de vida motivación estudiantes Colombia",
  carreras: "orientación vocacional carreras Colombia jóvenes",
  icfes: "estrategias Saber 11 ICFES explicación educativa Colombia",
  laboral: "habilidades para el trabajo emprendimiento jóvenes Colombia",
  digital: "programación inteligencia artificial seguridad digital educación español",
  programacion: "programación lógica algoritmos educación básica español",
  inteligencia: "inteligencia artificial uso responsable educación estudiantes español",
  seguridad: "seguridad informática contraseñas privacidad ciberseguridad estudiantes español",
  productividad: "productividad organización tiempo hábitos estudio estudiantes español",
  verificar: "verificar información fuentes confiables alfabetización mediática español",
  guia: "diseño de guías digitales accesibilidad comunicación visual español",
  ingles: "inglés gramática para estudiantes español",
  consumo: "prevención consumo sustancias adolescentes orientación educativa Colombia",
  violencia: "prevención violencia intrafamiliar rutas de atención Colombia educativo",
  "violencia-familiar":
    "prevención violencia intrafamiliar convivencia familiar apoyo Colombia educativo",
  abuso:
    "prevención violencia sexual consentimiento protección niños adolescentes Colombia educativo",
  vial:
    "seguridad vial educación peatones ciclistas motociclistas jóvenes Colombia prevención siniestros",
};

const json = (data, status = 200) =>
  Response.json(data, {
    status,
    headers: { "Cache-Control": "public, max-age=0, s-maxage=900, stale-while-revalidate=3600" },
  });

async function readJson(response) {
  const body = await response.text();
  if (!body.trim()) return null;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

export async function onRequestGet({ request, env }) {
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin)
    return json({ error: "Origen no permitido." }, 403);
  const url = new URL(request.url);
  const topic = url.searchParams.get("tema") || "";
  const base = TOPICS[topic];
  if (!base) return json({ error: "Elige un tema disponible de Villa Esther." }, 400);
  if (!env.YOUTUBE_API_KEY)
    return json({ error: "Falta configurar el secreto YOUTUBE_API_KEY en Cloudflare." }, 503);

  const extra = (url.searchParams.get("q") || "")
    .trim()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .slice(0, 60);
  const maxSecondsParam = url.searchParams.get("maxSeconds");
  const maxSeconds = maxSecondsParam ? Number(maxSecondsParam) : null;
  if (maxSecondsParam && (!Number.isInteger(maxSeconds) || maxSeconds < 1 || maxSeconds > 600))
    return json({ error: "El límite de duración no es válido." }, 400);
  const query = [base, extra].filter(Boolean).join(" ");
  const apiUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  apiUrl.search = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    maxResults: maxSeconds ? "10" : "6",
    safeSearch: "strict",
    relevanceLanguage: "es",
    regionCode: "CO",
    videoEmbeddable: "true",
    key: env.YOUTUBE_API_KEY,
  }).toString();

  try {
    const response = await fetch(apiUrl, { cf: { cacheTtl: 900, cacheEverything: true } });
    const payload = await readJson(response);
    if (!payload)
      return json({ error: "YouTube devolvió una respuesta vacía o no válida." }, 502);
    if (!response.ok) {
      const status = response.status === 403 ? 503 : 502;
      return json(
        {
          error:
            response.status === 403
              ? "YouTube alcanzó el límite diario o la clave no tiene habilitada la API."
              : "No se pudo consultar YouTube en este momento.",
        },
        status,
      );
    }
    let items = payload.items || [];
    let durations = new Map();
    if (maxSeconds && items.length) {
      const ids = items
        .map((item) => item.id?.videoId)
        .filter((id) => /^[\w-]{11}$/.test(id || ""));
      const detailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
      detailsUrl.search = new URLSearchParams({
        part: "contentDetails",
        id: ids.join(","),
        key: env.YOUTUBE_API_KEY,
      }).toString();
      const detailsResponse = await fetch(detailsUrl, {
        cf: { cacheTtl: 900, cacheEverything: true },
      });
      const details = await readJson(detailsResponse);
      if (!details)
        return json({ error: "YouTube devolvió una respuesta vacía al verificar las duraciones." }, 502);
      if (!detailsResponse.ok)
        return json({ error: "No se pudieron verificar las duraciones de los videos." }, 502);
      durations = new Map(
        (details.items || []).map((item) => {
          const match = item.contentDetails?.duration?.match(
            /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/,
          );
          const seconds = match
            ? Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0)
            : Infinity;
          return [item.id, seconds];
        }),
      );
      items = items.filter((item) => durations.get(item.id?.videoId) <= maxSeconds);
    }

    const videos = items.flatMap((item) => {
      const videoId = item.id?.videoId;
      if (!/^[\w-]{11}$/.test(videoId || "")) return [];
      const durationSeconds = durations.get(videoId);
      const duration = Number.isFinite(durationSeconds)
        ? `${Math.floor(durationSeconds / 60)}:${String(durationSeconds % 60).padStart(2, "0")}`
        : "";
      return [
        {
          id: videoId,
          title: String(item.snippet?.title || "Video educativo").slice(0, 180),
          channel: String(item.snippet?.channelTitle || "Canal de YouTube").slice(0, 100),
          description: String(item.snippet?.description || "").slice(0, 240),
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          publishedAt: item.snippet?.publishedAt || "",
          ...(duration ? { duration, durationSeconds } : {}),
        },
      ];
    });
    return json({ videos });
  } catch (error) {
    console.error("[api/youtube] Falló la consulta de videos", error);
    return json({ error: "No se pudo conectar con YouTube. Intenta de nuevo." }, 502);
  }
}
