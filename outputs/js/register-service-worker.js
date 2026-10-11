// Registra la caché offline en producción o en un servidor local HTTP.
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(new URL("/service-worker.js", location.origin))
      .catch(() => {});
  });
}
