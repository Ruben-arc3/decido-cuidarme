(() => {
  const words = [
    ["goal", "meta"],
    ["skills", "habilidades"],
    ["scholarship", "beca"],
    ["career", "carrera"],
    ["study", "estudiar"],
    ["future", "futuro"],
    ["work", "trabajo"],
    ["learn", "aprender"],
  ];
  let index = 0;
  const prompt = document.getElementById("englishPrompt"),
    choices = document.getElementById("englishChoices"),
    feedback = document.getElementById("englishFeedback");
  if (!prompt || !choices) return;
  function show() {
    const item = words[index % words.length];
    prompt.textContent = item[0];
    feedback.textContent = "Selecciona una respuesta.";
    choices.replaceChildren();
    const options = [
      item[1],
      words[(index + 2) % words.length][1],
      words[(index + 4) % words.length][1],
    ].sort(() => Math.random() - 0.5);
    for (const option of options) {
      const b = document.createElement("button");
      b.className = "btn secondary";
      b.type = "button";
      b.textContent = option;
      b.addEventListener("click", () => {
        feedback.textContent =
          option === item[1]
            ? "¡Correcto! “" + item[0] + "” significa “" + item[1] + "”."
            : "Inténtalo otra vez. Busca el significado de “" + item[0] + "”.";
        feedback.classList.toggle("wrong", option !== item[1]);
      });
      choices.append(b);
    }
  }
  document.getElementById("englishNext")?.addEventListener("click", () => {
    index++;
    show();
  });
  show();
  const keys = ["lifePersonal", "lifeAcademic", "lifeCareer", "lifeStep"],
    status = document.getElementById("lifePlanStatus");
  function load() {
    try {
      const data = JSON.parse(localStorage.getItem("villaLifePlan") || "{}");
      keys.forEach((k) => {
        const el = document.getElementById(k);
        if (el) el.value = data[k] || "";
      });
    } catch {}
  }
  document.getElementById("saveLifePlan")?.addEventListener("click", () => {
    const data = {};
    keys.forEach((k) => (data[k] = document.getElementById(k)?.value.trim() || ""));
    localStorage.setItem("villaLifePlan", JSON.stringify(data));
    status.textContent = "Ruta guardada en este dispositivo.";
  });
  document.getElementById("clearLifePlan")?.addEventListener("click", () => {
    localStorage.removeItem("villaLifePlan");
    keys.forEach((k) => (document.getElementById(k).value = ""));
    status.textContent = "Ruta borrada de este dispositivo.";
  });
  load();
})();
