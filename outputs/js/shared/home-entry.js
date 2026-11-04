// Evita abrir el portal en la sección de campañas cuando llega directamente con
// un marcador/enlace antiguo. Los enlaces dentro de la plataforma conservan su ancla.
(() => {
  if (window.location.hash.toLowerCase() !== "#campanas") return;

  let cameFromThisPlatform = false;
  try {
    cameFromThisPlatform = Boolean(
      document.referrer && new URL(document.referrer).origin === window.location.origin,
    );
  } catch {
    // Si el navegador no permite leer el origen, se trata como una entrada directa.
  }

  if (cameFromThisPlatform) return;

  const cleanUrl = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(window.history.state, "", cleanUrl);
  window.scrollTo(0, 0);
})();
