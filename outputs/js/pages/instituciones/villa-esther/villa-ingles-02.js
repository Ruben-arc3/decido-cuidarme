(() => {
  const tabs = [...document.querySelectorAll("[data-module-tab]")];
  const panels = [...document.querySelectorAll("[data-module-panel]")];
  function activate(tab) {
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.modulePanel !== tab.dataset.moduleTab;
    });
  }
  tabs.forEach((tab) => tab.addEventListener("click", () => activate(tab)));
})();
