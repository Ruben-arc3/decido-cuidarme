const CACHE = "decido-cuidarme-offline-v51";
const CORE = [
  "./css/pwa-install.css",
  "./assets/vicente-diaz/escudo-vicente-diaz.png",
  "./assets/vicente-diaz/favicon-vicente-diaz.ico",
  "./assets/vicente-diaz/icon-192.png",
  "./assets/vicente-diaz/icon-512.png",
  "./assets/villa-esther/escudo-villa-esther.png",
  "./assets/villa-esther/favicon-villa-esther.ico",
  "./assets/villa-esther/icon-192.png",
  "./assets/villa-esther/icon-512.png",
  "./css/campanas-recursos.css",
  "./css/mobile-campaigns.css",
  "./css/prevencion-violencia-sexual-extra.css",
  "./css/prevencion-violencia-sexual.css",
  "./css/vicente-diaz/vicente-diaz-brand.css",
  "./css/villa-esther/habilidades-digitales.css",
  "./css/villa-esther/villa-esther-brand.css",
  "./css/villa-esther/villa-esther-mobile.css",
  "./css/villa-esther/villa-esther-mobile.css?v=20261012",
  "./css/villa-esther/villa-esther-retro.css",
  "./css/villa-esther/villa-esther-retro.css?v=20261014",
  "./css/villa-esther/youtube-library.css",
  "./css/villa-esther/youtube-library.css?v=20261014",
  "./css/villa-esther/youtube-library.css?v=20261015",
  "./favicon.ico",
  "./favicon.png",
  "./icon-192.png",
  "./icon-512.png",
  "./index.html",
  "./instituciones/institucion-vicente-diaz.html",
  "./instituciones/oferta-educativa-cordoba.html",
  "./instituciones/villa-esther/institucion-villa-esther.html",
  "./instituciones/villa-esther/villa-explora-futuro.html",
  "./instituciones/villa-esther/villa-habilidad-guia-digital.html",
  "./instituciones/villa-esther/villa-habilidad-inteligencia-artificial.html",
  "./instituciones/villa-esther/villa-habilidad-productividad.html",
  "./instituciones/villa-esther/villa-habilidad-programacion.html",
  "./instituciones/villa-esther/villa-habilidad-seguridad-informatica.html",
  "./instituciones/villa-esther/villa-habilidad-verificar-informacion.html",
  "./instituciones/villa-esther/villa-habilidades-digitales.html",
  "./instituciones/villa-esther/villa-ingles.html",
  "./instituciones/villa-esther/villa-mundo-laboral.html",
  "./instituciones/villa-esther/villa-proyecto-vida.html",
  "./instituciones/villa-esther/villa-simulacro.html",
  "./js/pwa-install.js",
  "./js/villa-esther/firebase-config.js",
  "./js/villa-esther/habilidades-digitales.js",
  "./js/villa-esther/villa-firebase.js",
  "./js/villa-esther/villa-gemini.js",
  "./js/villa-esther/villa-gemini.js?v=20261011",
  "./js/villa-esther/villa-ingles-dictionary-data.js",
  "./js/villa-esther/villa-ingles-dictionary.js",
  "./js/villa-esther/villa-ingles-grammar.js",
  "./js/villa-esther/villa-ingles-phrases.js",
  "./js/villa-esther/youtube-library.js",
  "./js/villa-esther/youtube-library.js?v=20261012",
  "./juegos/campus-secreto.html",
  "./juegos/detectives-de-la-confianza.html",
  "./juegos/escape-del-festival.html",
  "./juegos/jeroglificos-del-futuro.html",
  "./juegos/loteria-de-apoyos.html",
  "./juegos/mapa-seguro.html",
  "./juegos/memorama-decisiones-que-cuidan.html",
  "./juegos/memorama-limites-y-redes-seguras.html",
  "./juegos/mi-ruta-mi-decision.html",
  "./juegos/mision-salida-segura.html",
  "./juegos/parejas-de-apoyo.html",
  "./juegos/puentes-de-apoyo.html",
  "./juegos/rompecabezas-decisiones-que-cuidan.html",
  "./juegos/ruta-al-futuro.html",
  "./juegos/rutas-de-luz.html",
  "./juegos/una-red-de-apoyo.html",
  "./manifest-vicente-diaz.webmanifest",
  "./manifest-villa-esther.webmanifest",
  "./manifest.webmanifest",
  "./recursos/portal-prevencion.html",
  "./recursos/prevencion-consumo-sustancias.html",
  "./recursos/prevencion-violencia-intrafamiliar.html",
  "./recursos/prevencion-violencia-sexual.html",
  "./service-worker.js"
];

const OPTIONAL_EXTERNAL = [
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
];
const CACHEABLE_EXTERNAL_HOSTS = new Set(["cdn.jsdelivr.net", "fonts.googleapis.com", "fonts.gstatic.com"]);

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    await Promise.all(OPTIONAL_EXTERNAL.map(async url => {
      try {
        const request = new Request(url, { mode: "cors" });
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response);
      } catch { /* Los recursos opcionales no deben impedir el modo offline local. */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === location.origin;
  if (sameOrigin && url.pathname.includes("/api/")) return;
  if (!sameOrigin && !CACHEABLE_EXTERNAL_HOSTS.has(url.hostname)) return;

  event.respondWith(fetch(request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
    }
    return response;
  }).catch(async () => {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    if (request.mode === "navigate") {
      const home = await caches.match("./instituciones/villa-esther/institucion-villa-esther.html");
      if (home) return home;
    }
    return Response.error();
  }));
});
