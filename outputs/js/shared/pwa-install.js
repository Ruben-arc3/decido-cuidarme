// Opens the browser's native PWA installation prompt and reports its installed state.
(() => {
  let pendingInstall = null;
  const buttons = [...document.querySelectorAll("[data-pwa-install]")];
  const status = document.querySelector("[data-pwa-install-status]");
  const standaloneQuery = window.matchMedia(
    "(display-mode: standalone), (display-mode: minimal-ui), (display-mode: fullscreen)",
  );

  const say = (message) => {
    if (status) status.textContent = message;
  };

  const markInstalled = () => {
    buttons.forEach((button) => {
      button.textContent = "Aplicación instalada ✓";
      button.disabled = true;
      button.setAttribute("aria-disabled", "true");
    });
  };

  const isRunningAsApp = () => standaloneQuery.matches || window.navigator.standalone === true;

  const detectInstalled = async () => {
    if (isRunningAsApp()) {
      markInstalled();
      return true;
    }

    // Chromium on Android can report this PWA when it is opened later in a browser tab.
    if (typeof navigator.getInstalledRelatedApps === "function") {
      try {
        const installedApps = await navigator.getInstalledRelatedApps();
        if (installedApps.length > 0) {
          markInstalled();
          return true;
        }
      } catch {
        // Installation state is not exposed by every browser or context.
      }
    }
    return false;
  };

  void detectInstalled();

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
    markInstalled();
    say("PWA instalada. Para abrirla como aplicación, toca su icono en la pantalla de inicio.");
  });

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      if (await detectInstalled()) {
        say("La PWA ya está instalada. Ábrela desde su icono en la pantalla de inicio.");
        return;
      }
      if (!pendingInstall) {
        say("Chrome todavía no ofrece la instalación para esta página. Comprueba el menú ⋮ del navegador.");
        return;
      }

      const installEvent = pendingInstall;
      pendingInstall = null;
      try {
        const result = await installEvent.prompt();
        const choice = result || (await installEvent.userChoice);
        if (choice?.outcome === "accepted") {
          say("Instalación aceptada. Busca el icono de Decido Cuidarme en la pantalla de inicio.");
        } else {
          say("Instalación cancelada.");
        }
      } catch {
        say("Chrome no pudo abrir la ventana de instalación. Prueba desde su menú ⋮.");
      }
    });
  });
})();
