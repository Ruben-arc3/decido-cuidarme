// Delegación de acciones declaradas en los controles del HTML.
document.addEventListener("click", (event) => {
  const control = event.target.closest("[data-page-action]");
  if (!control) return;
  const action = control.dataset.pageAction;
  if (action === "show-example") {
    window.alert("Ejemplo: aquí el docente iniciaría sesión para gestionar grupos y retos.");
    return;
  }
  const callback = window[action];
  if (typeof callback === "function") callback();
});
