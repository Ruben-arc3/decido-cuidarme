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
    ["community", "comunidad"],
    ["practice", "práctica"],
  ];
  let n = 0;
  const word = document.getElementById("word"),
    choices = document.getElementById("choices"),
    feedback = document.getElementById("feedback");
  function render() {
    const item = words[n % words.length];
    word.textContent = item[0];
    feedback.textContent = "Selecciona una opción.";
    choices.replaceChildren();
    let options = [item[1], words[(n + 3) % words.length][1], words[(n + 6) % words.length][1]];
    options = [...new Set(options)].sort(() => Math.random() - 0.5);
    for (const option of options) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn";
      b.textContent = option;
      b.onclick = () => {
        feedback.textContent =
          option === item[1]
            ? "¡Muy bien! " + item[0] + " significa “" + item[1] + "”."
            : "Esa no es. Vuelve a intentarlo.";
      };
      choices.append(b);
    }
  }
  document.getElementById("next").onclick = () => {
    n++;
    render();
  };
  render();
})();
