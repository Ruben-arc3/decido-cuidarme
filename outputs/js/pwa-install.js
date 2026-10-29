// Opens the browser installation prompt when available, otherwise explains the device steps.
(() => {
  let pendingInstall = null;
  const buttons = [...document.querySelectorAll("[data-pwa-install]")];
  const status = document.querySelector("[data-pwa-install-status]");
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const say = (text) => {
    if (status) status.textContent = text;
  };

  const dialog = document.createElement("dialog");
  dialog.className = "pwa-install-dialog";
  dialog.setAttribute("aria-labelledby", "pwa-install-title");
  dialog.innerHTML = `
    <style>
      .pwa-install-dialog { width: min(92vw, 460px); padding: 0; border: 1px solid #dce4dd; border-radius: 18px; color: #202820; background: #fff; box-shadow: 0 24px 80px #07120b45; }
      .pwa-install-dialog::backdrop { background: #0a120dd1; backdrop-filter: blur(4px); }
      .pwa-install-dialog .install-content { padding: 26px; }
      .pwa-install-dialog .install-kicker { margin: 0 0 8px; color: #557960; font: 700 11px/1.4 system-ui,sans-serif; letter-spacing: .1em; text-transform: uppercase; }
      .pwa-install-dialog h2 { margin: 0 0 10px; font: 750 24px/1.2 system-ui,sans-serif; letter-spacing: -.03em; }
      .pwa-install-dialog p, .pwa-install-dialog li { color: #576259; font: 14px/1.6 system-ui,sans-serif; }
      .pwa-install-dialog ol { padding-left: 22px; }
      .pwa-install-dialog li + li { margin-top: 7px; }
      .pwa-install-dialog .install-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
      .pwa-install-dialog button { min-height: 42px; padding: 0 15px; border: 1px solid #d6ded7; border-radius: 9px; background: #f6f8f6; color: #26352a; font: 700 13px system-ui,sans-serif; cursor: pointer; }
      .pwa-install-dialog [data-dialog-install] { border-color: #276b46; background: #276b46; color: #fff; }
      .pwa-install-dialog [data-dialog-install][hidden] { display: none; }
      .pwa-install-dialog button:focus-visible { outline: 3px solid #72b58b; outline-offset: 2px; }
      .pwa-install-dialog .install-hint { margin: 14px 0 0; font-size: 12px; }
    </style>
    <div class="install-content">
      <p class="install-kicker">Decido Cuidarme</p>
      <h2 id="pwa-install-title">Instala la plataforma</h2>
      <div data-install-instructions></div>
      <p class="install-hint" data-install-hint></p>
      <div class="install-actions">
        <button type="button" data-dialog-install hidden>Instalar ahora</button>
        <button type="button" data-dialog-close>Cerrar</button>
      </div>
    </div>`;
  document.body.append(dialog);

  const instructions = dialog.querySelector("[data-install-instructions]");
  const hint = dialog.querySelector("[data-install-hint]");
  const modalInstall = dialog.querySelector("[data-dialog-install]");

  const updateDialog = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (pendingInstall) {
      instructions.innerHTML = "<p>La instalación está disponible en este navegador. Pulsa <strong>Instalar ahora</strong> para agregar la plataforma al dispositivo.</p>";
      hint.textContent = "La aplicación aparecerá junto a tus otras aplicaciones.";
      modalInstall.hidden = false;
      return;
    }

    modalInstall.hidden = true;
    if (location.protocol === "file:") {
      instructions.innerHTML = "<p>Para instalar la plataforma, ábrela desde su dirección publicada con <strong>https://</strong>. La vista local desde un archivo no permite instalarla.</p>";
      hint.textContent = "Después, vuelve a pulsar el botón de instalación.";
    } else if (/iphone|ipad|ipod/.test(ua)) {
      instructions.innerHTML = "<ol><li>Abre esta página en Safari.</li><li>Pulsa <strong>Compartir</strong>.</li><li>Elige <strong>Añadir a pantalla de inicio</strong> y confirma.</li></ol>";
      hint.textContent = "En iPhone y iPad, la instalación se confirma desde el menú Compartir.";
    } else {
      instructions.innerHTML = "<ol><li>Abre el menú del navegador <strong>⋮</strong> o <strong>⋯</strong>.</li><li>Elige <strong>Instalar aplicación</strong> o <strong>Agregar a pantalla principal</strong>.</li><li>Confirma la instalación.</li></ol>";
      hint.textContent = "Si esa opción no aparece, usa la dirección HTTPS publicada y vuelve a intentarlo.";
    }
  };

  const showInstructions = () => {
    updateDialog();
    if (!dialog.open) dialog.showModal();
  };

  const promptInstall = async () => {
    if (!pendingInstall) {
      showInstructions();
      return;
    }
    const installEvent = pendingInstall;
    pendingInstall = null;
    try {
      await installEvent.prompt();
      const result = await installEvent.userChoice;
      if (result.outcome === "accepted") {
        say("Instalación iniciada. Busca el icono en la pantalla de inicio.");
        if (dialog.open) dialog.close();
      } else {
        say("Puedes instalarla más tarde desde este botón.");
        if (dialog.open) updateDialog();
      }
    } catch {
      say("El navegador no pudo abrir la instalación. Consulta las opciones para tu dispositivo.");
      showInstructions();
    }
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
    if (dialog.open) updateDialog();
  });

  window.addEventListener("appinstalled", () => {
    pendingInstall = null;
    buttons.forEach((button) => {
      button.textContent = "Aplicación instalada ✓";
      button.disabled = true;
    });
    say("La aplicación quedó instalada en este dispositivo.");
    if (dialog.open) dialog.close();
  });

  buttons.forEach((button) => button.addEventListener("click", promptInstall));
  modalInstall.addEventListener("click", promptInstall);
  dialog.querySelector("[data-dialog-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
