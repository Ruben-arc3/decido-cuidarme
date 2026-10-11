(() => {
  const ids = ["personal", "academic", "formation", "firstStep", "support", "review"],
    status = document.getElementById("status");
  try {
    const d = JSON.parse(localStorage.getItem("villaLifePlan") || "{}");
    ids.forEach((id) => (document.getElementById(id).value = d[id] || ""));
  } catch {}
  document.getElementById("save").onclick = () => {
    const d = {};
    ids.forEach((id) => (d[id] = document.getElementById(id).value.trim()));
    try {
      localStorage.setItem("villaLifePlan", JSON.stringify(d));
      status.textContent = "Ruta guardada en este dispositivo.";
    } catch {
      status.textContent = "No se pudo guardar. Puedes anotar los pasos en tu cuaderno.";
    }
  };
  document.getElementById("clear").onclick = () => {
    localStorage.removeItem("villaLifePlan");
    ids.forEach((id) => (document.getElementById(id).value = ""));
    status.textContent = "Ruta borrada de este dispositivo.";
  };
})();
