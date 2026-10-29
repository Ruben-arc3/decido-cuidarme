(() => {
  "use strict";

  const panels = [...document.querySelectorAll("[data-tour-panel]")];
  const stepButtons = [...document.querySelectorAll("[data-go-step]")];
  const progress = document.getElementById("tour-progress");
  const count = document.getElementById("tour-count");
  const time = document.getElementById("tour-time");
  const back = document.getElementById("tour-back");
  const next = document.getElementById("tour-next");
  const restart = document.getElementById("tour-restart");
  const projectionToggle = document.getElementById("projection-toggle");
  const durations = ["0:30", "0:45", "2:00", "0:45", "0:45"];

  if (!panels.length || !stepButtons.length || !progress || !count || !time || !back || !next || !restart)
    return;

  let current = 0;
  function showStep(index, moveFocus = false) {
    current = Math.max(0, Math.min(index, panels.length - 1));
    panels.forEach((panel, i) => {
      panel.hidden = i !== current;
    });
    stepButtons.forEach((button, i) => {
      button.classList.toggle("is-current", i === current);
      if (i === current) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    progress.value = current + 1;
    count.textContent = `Paso ${current + 1} de ${panels.length}`;
    time.textContent = durations[current] || "0:45";
    back.disabled = current === 0;
    next.disabled = false;
    next.textContent = current === panels.length - 1 ? "Finalizar recorrido ✓" : "Siguiente paso →";
    restart.hidden = current !== panels.length - 1;
    if (moveFocus) panels[current].querySelector("h3")?.focus({ preventScroll: true });
  }

  back.addEventListener("click", () => showStep(current - 1, true));
  next.addEventListener("click", () => {
    if (current < panels.length - 1) {
      showStep(current + 1, true);
      return;
    }
    next.disabled = true;
    next.textContent = "Recorrido completado ✓";
    restart.hidden = false;
    if (!panels[current].querySelector("[data-tour-complete]")) {
      const note = document.createElement("p");
      note.dataset.tourComplete = "";
      note.className = "tour-complete-note";
      note.setAttribute("role", "status");
      note.textContent = "Listo para presentar. Puedes reiniciar el recorrido o volver al portal.";
      panels[current].append(note);
    }
  });
  restart.addEventListener("click", () => showStep(0, true));
  stepButtons.forEach((button) => {
    button.addEventListener("click", () => showStep(Number(button.dataset.goStep), true));
  });

  function updateProjectionButton(active) {
    document.body.classList.toggle("presentation-mode", active);
    projectionToggle.setAttribute("aria-pressed", String(active));
    projectionToggle.textContent = active ? "⤢ Salir de proyección" : "⛶ Modo proyección";
  }

  projectionToggle.addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      updateProjectionButton(!document.body.classList.contains("presentation-mode"));
    }
  });
  document.addEventListener("fullscreenchange", () => updateProjectionButton(Boolean(document.fullscreenElement)));
  document.addEventListener("keydown", (event) => {
    if ((!document.fullscreenElement && !document.body.classList.contains("presentation-mode")) || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowRight" && current < panels.length - 1) {
      event.preventDefault();
      showStep(current + 1, true);
    } else if (event.key === "ArrowLeft" && current > 0) {
      event.preventDefault();
      showStep(current - 1, true);
    }
  });

  showStep(0);
})();
