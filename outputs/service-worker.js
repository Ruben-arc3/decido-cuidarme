// PWA offline layer: precaches local resources and falls back to cached copies when offline.
const CACHE = "decido-cuidarme-offline-v113";
const CORE = [
  "./css/vicente-diaz/vicente-diaz-chat.css",
  "./instituciones/vicente-diaz/vicente-habilidad-verificar-informacion.html",
  "./instituciones/vicente-diaz/vicente-habilidad-seguridad-informatica.html",
  "./instituciones/vicente-diaz/vicente-habilidad-programacion.html",
  "./instituciones/vicente-diaz/vicente-habilidad-productividad.html",
  "./instituciones/vicente-diaz/vicente-habilidad-inteligencia-artificial.html",
  "./instituciones/vicente-diaz/vicente-habilidad-guia-digital.html",
  "./css/vicente-diaz/vicente-diaz-module-brand.css",
  "./css/vicente-diaz/vicente-diaz-learning.css",
  "./instituciones/vicente-diaz/vicente-ingles.html",
  "./instituciones/vicente-diaz/vicente-habilidades-digitales.html",
  "./instituciones/vicente-diaz/vicente-simulacro.html",
  "./css/pwa-install.css",
  "./css/platform-navigation.css",
  "./assets/vicente-diaz/escudo-vicente-diaz.png",
  "./assets/vicente-diaz/favicon-vicente-diaz.ico",
  "./assets/vicente-diaz/icon-192.png",
  "./assets/vicente-diaz/icon-512.png",
  "./assets/villa-esther/escudo-villa-esther.png",
  "./assets/villa-esther/favicon-villa-esther.ico",
  "./assets/villa-esther/icon-192.png",
  "./assets/villa-esther/icon-512.png",
  "./css/campanas-recursos.css",
  "./css/campaign-illustrations.css",
  "./css/mobile-campaigns.css",
  "./css/prevencion-violencia-sexual-extra.css",
  "./css/prevencion-violencia-sexual.css",
  "./css/vicente-diaz/vicente-diaz-brand.css",
  "./css/villa-esther/habilidades-digitales.css",
  "./css/villa-esther/villa-icfes-tutor.css",
  "./css/villa-esther/villa-esther-brand.css",
  "./css/villa-esther/villa-esther-mobile.css",
  "./css/villa-esther/villa-esther-mobile.css?v=20261012",
  "./css/villa-esther/villa-esther-retro.css",
  "./css/villa-esther/villa-esther-retro.css?v=20261014",
  "./css/villa-esther/youtube-library.css",
  "./css/villa-esther/youtube-library.css?v=20261014",
  "./css/villa-esther/youtube-library.css?v=20261015",
  "./favicon.ico",
  "./conoce-la-plataforma.html",
  "./assets/illustrations/campana-bienestar.svg",
  "./assets/illustrations/campana-escucha.svg",
  "./assets/illustrations/campana-limites.svg",
  "./assets/illustrations/campana-vial.svg",
  "./assets/illustrations/plataforma-comunidad.svg",
  "./assets/illustrations/modulos-companero.svg",
  "./assets/illustrations/villa-esther-futuro.svg",
  "./assets/illustrations/villa-modulo-ruta.svg",
  "./assets/illustrations/villa-modulo-estudios.svg",
  "./assets/illustrations/villa-modulo-trabajo.svg",
  "./assets/illustrations/villa-modulo-digital.svg",
  "./assets/illustrations/villa-modulo-ingles.svg",
  "./assets/illustrations/villa-modulo-icfes.svg",
  "./assets/illustrations/villa-modulo-campus.svg",
  "./assets/illustrations/villa-modulo-ia.svg",
  "./assets/illustrations/villa-modulo-seguridad.svg",
  "./assets/illustrations/villa-modulo-productividad.svg",
  "./assets/illustrations/villa-modulo-verificar.svg",
  "./assets/illustrations/villa-modulo-guia.svg",
  "./favicon.png",
  "./icon-192.png",
  "./icon-512.png",
  "./index.html",
  "./manifest.webmanifest",
  "./manifest-villa-esther.webmanifest",
  "./manifest-vicente-diaz.webmanifest",
  "./shutdown.html",
  "./js/prank-hack-simulation.js",
  "./instituciones/institucion-vicente-diaz.html",
  "./js/vicente-diaz/vicente-groq-chat.js?v=20261016",
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
  "./js/presentation-tour.js",
  "./js/suggestion-box.js",
  "./js/suggestion-firebase-config.js",
  "./js/platform-click-ui.js",
  "./js/platform-click-counter.js",
  "./js/villa-esther/firebase-config.js",
  "./js/villa-esther/habilidades-digitales.js",
  "./js/villa-esther/villa-firebase.js",
  "./js/villa-esther/villa-gemini.js",
  "./js/villa-esther/villa-gemini.js?v=20261017",
  "./js/villa-esther/villa-icfes-tutor.js?v=20261017",
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
  "./juegos/memorama-vial-colombia.html",
  "./juegos/mi-ruta-mi-decision.html",
  "./juegos/mision-salida-segura.html",
  "./juegos/parejas-de-apoyo.html",
  "./juegos/puentes-de-apoyo.html",
  "./juegos/rompecabezas-decisiones-que-cuidan.html",
  "./juegos/ruta-al-futuro.html",
  "./juegos/rutas-de-luz.html",
  "./juegos/una-red-de-apoyo.html",
  "./juegos/wordle-vial-colombia.html",
  "./manifest-vicente-diaz.webmanifest",
  "./manifest-villa-esther.webmanifest",
  "./manifest.webmanifest",
  "./recursos/portal-prevencion.html",
  "./recursos/prevencion-consumo-sustancias.html",
  "./recursos/prevencion-siniestros-viales.html",
  "./recursos/prevencion-violencia-intrafamiliar.html",
  "./recursos/prevencion-violencia-sexual.html",
  "./service-worker.js",
  "./css/pages/index-02.css",
  "./css/pages/index-03.css",
  "./css/pages/index-04.css",
  "./css/pages/index.css",
  "./css/pages/conoce-la-plataforma.css",
  "./css/suggestion-box.css",
  "./css/pages/instituciones/institucion-vicente-diaz.css",
  "./css/pages/instituciones/school-portals.css",
  "./css/pages/instituciones/oferta-educativa-cordoba.css",
  "./css/pages/instituciones/villa-esther/institucion-villa-esther-02.css",
  "./css/pages/instituciones/villa-esther/institucion-villa-esther-03.css",
  "./css/pages/instituciones/villa-esther/institucion-villa-esther-04.css",
  "./css/pages/instituciones/villa-esther/institucion-villa-esther-05.css",
  "./css/pages/instituciones/villa-esther/institucion-villa-esther-06.css",
  "./css/pages/instituciones/villa-esther/institucion-villa-esther-07.css",
  "./css/pages/instituciones/villa-esther/institucion-villa-esther-08.css",
  "./css/pages/instituciones/villa-esther/institucion-villa-esther.css",
  "./css/pages/instituciones/villa-esther/villa-explora-futuro.css",
  "./css/pages/instituciones/villa-esther/villa-module-pages.css",
  "./css/pages/instituciones/villa-esther/villa-habilidades-digitales.css",
  "./css/pages/instituciones/villa-esther/villa-ingles.css",
  "./css/pages/instituciones/villa-esther/villa-mundo-laboral-inline.css",
  "./css/pages/instituciones/villa-esther/villa-mundo-laboral.css",
  "./css/pages/instituciones/villa-esther/villa-proyecto-vida-inline.css",
  "./css/pages/instituciones/villa-esther/villa-proyecto-vida.css",
  "./css/pages/instituciones/villa-esther/villa-simulacro-02.css",
  "./css/pages/instituciones/villa-esther/villa-simulacro-03.css",
  "./css/pages/instituciones/villa-esther/villa-simulacro-04.css",
  "./css/pages/instituciones/villa-esther/villa-simulacro-05.css",
  "./css/pages/instituciones/villa-esther/villa-simulacro-06.css",
  "./css/pages/instituciones/villa-esther/villa-simulacro.css",
  "./css/pages/juegos/campus-secreto.css",
  "./css/pages/juegos/detectives-de-la-confianza-02.css",
  "./css/pages/juegos/detectives-de-la-confianza-03.css",
  "./css/pages/juegos/detectives-de-la-confianza-04.css",
  "./css/pages/juegos/detectives-de-la-confianza-05.css",
  "./css/pages/juegos/detectives-de-la-confianza-06.css",
  "./css/pages/juegos/detectives-de-la-confianza.css",
  "./css/pages/juegos/escape-del-festival.css",
  "./css/pages/juegos/jeroglificos-del-futuro.css",
  "./css/pages/juegos/loteria-de-apoyos-inline.css",
  "./css/pages/juegos/loteria-de-apoyos.css",
  "./css/pages/juegos/mapa-seguro.css",
  "./css/pages/juegos/memorama-decisiones-que-cuidan.css",
  "./css/pages/juegos/memorama-limites-y-redes-seguras.css",
  "./css/pages/juegos/memorama-vial-colombia.css",
  "./css/pages/juegos/mi-ruta-mi-decision.css",
  "./css/pages/juegos/mision-salida-segura-02.css",
  "./css/pages/juegos/mision-salida-segura.css",
  "./css/pages/juegos/parejas-de-apoyo.css",
  "./css/pages/juegos/puentes-de-apoyo.css",
  "./css/pages/juegos/rompecabezas-decisiones-que-cuidan.css",
  "./css/pages/juegos/ruta-al-futuro.css",
  "./css/pages/juegos/rutas-de-luz.css",
  "./css/pages/juegos/una-red-de-apoyo-inline.css",
  "./css/pages/juegos/una-red-de-apoyo.css",
  "./css/pages/juegos/wordle-vial-colombia.css",
  "./css/pages/recursos/portal-prevencion-inline.css",
  "./css/pages/recursos/portal-prevencion.css",
  "./js/pages/instituciones/institucion-vicente-diaz.js",
  "./js/pages/instituciones/oferta-educativa-cordoba.js",
  "./js/pages/instituciones/villa-esther/institucion-villa-esther.js",
  "./js/pages/instituciones/villa-esther/villa-ingles-02.js",
  "./js/pages/instituciones/villa-esther/villa-ingles.js",
  "./js/pages/instituciones/villa-esther/villa-proyecto-vida.js",
  "./js/pages/instituciones/villa-esther/villa-simulacro-02.js",
  "./js/pages/instituciones/villa-esther/villa-simulacro.js",
  "./js/pages/instituciones/villa-esther/villa-simulacro.js?v=20261018",
  "./js/pages/juegos/campus-secreto.js",
  "./js/pages/juegos/detectives-de-la-confianza-actions.js",
  "./js/pages/juegos/detectives-de-la-confianza.js",
  "./js/pages/juegos/escape-del-festival.js",
  "./js/pages/juegos/jeroglificos-del-futuro.js",
  "./js/pages/juegos/loteria-de-apoyos.js",
  "./js/pages/juegos/mapa-seguro.js",
  "./js/pages/juegos/memorama-decisiones-que-cuidan.js",
  "./js/pages/juegos/memorama-limites-y-redes-seguras.js",
  "./js/pages/juegos/memorama-vial-colombia.js",
  "./js/pages/juegos/mi-ruta-mi-decision.js",
  "./js/pages/juegos/mision-salida-segura-actions.js",
  "./js/pages/juegos/mision-salida-segura.js",
  "./js/pages/juegos/parejas-de-apoyo.js",
  "./js/pages/juegos/puentes-de-apoyo.js",
  "./js/pages/juegos/rompecabezas-decisiones-que-cuidan.js",
  "./js/pages/juegos/ruta-al-futuro.js",
  "./js/pages/juegos/rutas-de-luz.js",
  "./js/pages/juegos/una-red-de-apoyo-actions.js",
  "./js/pages/juegos/una-red-de-apoyo.js",
  "./js/pages/juegos/wordle-vial-colombia.js",
  "./js/pages/recursos/portal-prevencion-actions.js",
  "./js/pages/recursos/portal-prevencion.js",
  "./js/register-service-worker.js",
  "./css/campaign-videos.css",
  "./js/campaign-videos.js",
  "./css/campaign-game-cards-retro.css",
];

const OPTIONAL_EXTERNAL = [
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js",
];
const CACHEABLE_EXTERNAL_HOSTS = new Set([
  "cdn.jsdelivr.net",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(CORE);
      await Promise.all(
        OPTIONAL_EXTERNAL.map(async (url) => {
          try {
            const request = new Request(url, { mode: "cors" });
            const response = await fetch(request);
            if (response.ok) await cache.put(request, response);
          } catch {
            /* Los recursos opcionales no deben impedir el modo offline local. */
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === location.origin;
  if (sameOrigin && url.pathname.includes("/api/")) return;
  if (!sameOrigin && !CACHEABLE_EXTERNAL_HOSTS.has(url.hostname)) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request, { ignoreSearch: true });
        if (cached) return cached;
        if (request.mode === "navigate") {
          const home = await caches.match(
            "./instituciones/villa-esther/institucion-villa-esther.html",
          );
          if (home) return home;
        }
        return Response.error();
      }),
  );
});
