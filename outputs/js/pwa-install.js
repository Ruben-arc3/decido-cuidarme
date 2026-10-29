// Opens the browser's native PWA installation prompt when the browser makes it available.
(() => {
  let pendingInstall = null;
  const buttons = [...document.querySelectorAll("[data-pwa-install]")];
  const status = document.querySelector("[data-pwa-install-status]");
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

  const say = (message) => {
    if (status) status.textContent = message;
  };

  if (isStandalone) {
    buttons.forEach((button) => {
      button.textContent = "Aplicación instalada ✓";
      button.disabled = true;
    });
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    pendingInstall = event;
    buttons.forEach((button) => {
      button.disabled = false;
      button.removeAttribute("aria-disabled");
    });
  });

  window.addEventListener("appinstalled", () => {
    pendingInstall = null;
    buttons.forEach((button) => {
      button.textContent = "Aplicación instalada ✓";
      button.disabled = true;
    });
    say("Aplicación instalada en este dispositivo.");
  });

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      if (isStandalone) return;
      if (!pendingInstall) {
        say("Este navegador aún no ofrece la instalación PWA para esta página.");
        return;
      }

      const installEvent = pendingInstall;
      pendingInstall = null;
      try {
        const result = await installEvent.prompt();
        const choice = result || (await installEvent.userChoice);
        say(
          choice?.outcome === "accepted"
            ? "Instalación aceptada."
            : "Instalación cancelada.",
        );
      } catch {
        say("El navegador no pudo abrir la ventana de instalación.");
      }
    });
  });
})();
