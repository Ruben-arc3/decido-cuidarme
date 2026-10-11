// PWA install UI: handles browser prompts and gives manual home-screen steps when needed.
(() => {
  let pending = null;
  const buttons = [...document.querySelectorAll("[data-pwa-install]")],
    status = document.querySelector("[data-pwa-install-status]");
  const say = (text) => {
    if (status) status.textContent = text;
  };
  if (window.matchMedia("(display-mode: standalone)").matches) {
    buttons.forEach((b) => {
      b.textContent = "Aplicación instalada ✓";
      b.disabled = true;
    });
  }
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    pending = event;
  });
  window.addEventListener("appinstalled", () => {
    pending = null;
    buttons.forEach((b) => {
      b.textContent = "Aplicación instalada ✓";
      b.disabled = true;
    });
    say("La aplicación quedó instalada en este dispositivo.");
  });
  buttons.forEach((button) =>
    button.addEventListener("click", async () => {
      if (pending) {
        pending.prompt();
        const result = await pending.userChoice;
        pending = null;
        say(
          result.outcome === "accepted"
            ? "Instalación iniciada. Busca el icono en la pantalla de inicio."
            : "Puedes instalarla más tarde desde este botón.",
        );
        return;
      }
      const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
      say(
        ios
          ? "En Safari: toca Compartir y luego “Añadir a pantalla de inicio”."
          : "Abre el menú ⋮ del navegador y elige “Instalar aplicación” o “Agregar a pantalla principal”. Si no aparece, vuelve a abrir el sitio con internet.",
      );
    }),
  );
})();
