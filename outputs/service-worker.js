const CACHE = "villa-esther-static-v40";
const CORE = ["./css/villa-esther/villa-esther-brand.css", "./assets/villa-esther/icon-512.png", "./assets/villa-esther/icon-192.png", "./assets/villa-esther/favicon-villa-esther.ico", "./assets/villa-esther/escudo-villa-esther.png", "./favicon.ico", "./favicon.png", "./icon-192.png", "./icon-512.png", "./", "./instituciones/villa-esther/institucion-villa-esther.html", "./instituciones/villa-esther/villa-simulacro.html", "./instituciones/villa-esther/villa-proyecto-vida.html", "./instituciones/villa-esther/villa-explora-futuro.html", "./instituciones/villa-esther/villa-mundo-laboral.html", "./instituciones/villa-esther/villa-habilidades-digitales.html", "./instituciones/villa-esther/villa-habilidad-programacion.html", "./instituciones/villa-esther/villa-habilidad-inteligencia-artificial.html", "./instituciones/villa-esther/villa-habilidad-seguridad-informatica.html", "./instituciones/villa-esther/villa-habilidad-productividad.html", "./instituciones/villa-esther/villa-habilidad-verificar-informacion.html", "./instituciones/villa-esther/villa-habilidad-guia-digital.html", "./css/villa-esther/habilidades-digitales.css", "./js/villa-esther/habilidades-digitales.js", "./instituciones/villa-esther/villa-ingles.html", "./js/villa-esther/villa-ingles-dictionary-data.js", "./js/villa-esther/villa-ingles-dictionary.js", "./js/villa-esther/villa-ingles-phrases.js", "./js/villa-esther/villa-ingles-grammar.js", "./instituciones/oferta-educativa-cordoba.html", "./js/villa-esther/villa-firebase.js", "./js/villa-esther/firebase-config.js", "./manifest.webmanifest"];
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
  }).catch(() => caches.match(request).then(hit => hit || (request.mode === "navigate" ? caches.match("./instituciones/villa-esther/institucion-villa-esther.html") : Response.error()))));
});
