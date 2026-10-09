const CACHE = "villa-esther-static-v30";
const CORE = ["./", "./instituciones/institucion-villa-esther.html", "./instituciones/villa-simulacro.html", "./instituciones/villa-proyecto-vida.html", "./instituciones/villa-explora-futuro.html", "./instituciones/villa-mundo-laboral.html", "./instituciones/villa-habilidades-digitales.html", "./instituciones/villa-habilidad-programacion.html", "./instituciones/villa-habilidad-inteligencia-artificial.html", "./instituciones/villa-habilidad-seguridad-informatica.html", "./instituciones/villa-habilidad-productividad.html", "./instituciones/villa-habilidad-verificar-informacion.html", "./instituciones/villa-habilidad-guia-digital.html", "./css/habilidades-digitales.css", "./js/habilidades-digitales.js", "./instituciones/villa-ingles.html", "./js/villa-ingles-dictionary-data.js", "./js/villa-ingles-dictionary.js", "./js/villa-ingles-phrases.js", "./js/villa-ingles-grammar.js", "./instituciones/oferta-educativa-cordoba.html", "./js/villa-firebase.js", "./js/firebase-config.js", "./manifest.webmanifest"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== location.origin) return;
  event.respondWith(fetch(request).then(response => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(request, copy)); }
    return response;
  }).catch(() => caches.match(request).then(hit => hit || (request.mode === "navigate" ? caches.match("./instituciones/institucion-villa-esther.html") : Response.error()))));
});
