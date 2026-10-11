const scenes = [
  {
    chapter: "Capítulo 1 · Algo no se siente bien",
    title: "Un mensaje en el recreo.",
    story:
      "A Sam le llega un mensaje de su amiga Alex: «En casa últimamente hay gritos. Me cuesta concentrarme y no sé con quién hablar». Alex cambia de tema rápido. Sam quiere responder con cuidado.",
    talk: "Pausa para el salón: ¿qué podría ayudar a Alex a sentirse escuchada?",
    choices: [
      "«Gracias por contármelo. ¿Quieres que te escuche?»",
      "«Seguro no es para tanto; mejor olvídalo.»",
      "Contárselo a todo el grupo para que opinen.",
    ],
    good: 0,
    feedback:
      "Escuchar con calma y agradecer la confianza abre una puerta. No hace falta tener todas las respuestas.",
    gain: 15,
  },
  {
    chapter: "Capítulo 2 · Acompañar sin presionar",
    title: "Alex decide hablar.",
    story:
      "Al día siguiente, Alex cuenta que se siente con miedo cuando las discusiones suben de tono. No sabe si quiere hablar con alguien más, pero sí pide que Sam se quede un rato.",
    talk: "Pausa para el salón: ¿cómo respetar su ritmo y mostrar que no está sola?",
    choices: [
      "Escuchar, preguntar qué necesita ahora y respetar su decisión.",
      "Exigirle que cuente todos los detalles de inmediato.",
      "Decidir por Alex y enfrentar a su familia.",
    ],
    good: 0,
    feedback:
      "Acompañar es preguntar qué necesita, sin forzar detalles ni tomar decisiones por la otra persona.",
    gain: 20,
  },
  {
    chapter: "Capítulo 3 · Una persona adulta segura",
    title: "No tienen que resolverlo solos.",
    story:
      "Sam propone pensar en alguien adulto de confianza. Alex menciona a la orientadora escolar, pero teme que la juzguen. Sam puede acompañarla a pedir una conversación privada.",
    talk: "Pausa para el salón: ¿qué cualidades hacen que una persona adulta sea segura?",
    choices: [
      "Ofrecer acompañarla con una persona adulta de confianza.",
      "Prometer que nunca se lo dirá a nadie, pase lo que pase.",
      "Publicar una indirecta en redes para que alguien intervenga.",
    ],
    good: 0,
    feedback:
      "Buscar ayuda adulta segura es una forma de cuidar. No prometas secreto si alguien puede estar en riesgo; explica que pedirás apoyo.",
    gain: 20,
  },
  {
    chapter: "Capítulo 4 · Pensar en seguridad",
    title: "¿Y si la situación empeora?",
    story:
      "Alex dice que si vuelve a haber una discusión fuerte, quiere tener claro dónde puede ir y a quién avisar. Sam no sabe cuál es el plan correcto, pero pueden pedir apoyo a la orientadora.",
    talk: "Pausa para el salón: ¿quién en la escuela puede ayudar a activar la ruta de protección?",
    choices: [
      "Acordar buscar juntos a orientación y seguir el protocolo escolar.",
      "Entrar a la casa para detener la discusión.",
      "Esperar y manejarlo sin contárselo a ninguna persona adulta.",
    ],
    good: 0,
    feedback:
      "La seguridad va primero. No confrontes a quien puede hacer daño; pide apoyo adulto y sigue las rutas de protección locales.",
    gain: 20,
  },
  {
    chapter: "Capítulo 5 · La red crece",
    title: "Un primer paso, en compañía.",
    story:
      "Alex y Sam conversan en privado con la orientadora. Alex decide qué quiere contar. La orientadora escucha y explica los siguientes pasos de acuerdo con la ruta de protección de la escuela.",
    talk: "Cierre en equipo: ¿qué podemos hacer como curso para que pedir ayuda sea más fácil?",
    choices: [
      "Escuchar sin burlas, no difundir rumores y acercarse a un adulto seguro.",
      "Investigar por nuestra cuenta quién tiene la culpa.",
      "Exigir que Alex cuente su historia delante del salón.",
    ],
    good: 0,
    feedback:
      "Un salón cuidadoso escucha, no culpa, respeta la privacidad y ayuda a conectar con personas adultas capacitadas.",
    gain: 25,
  },
];
let idx = 0,
  score = 35,
  locked = false;
function startGame() {
  document.getElementById("home").classList.add("off");
  document.getElementById("finish").classList.remove("show");
  document.getElementById("game").classList.add("on");
  idx = 0;
  score = 35;
  render();
  document.querySelector("#game .choice")?.focus();
}
function render() {
  locked = false;
  const s = scenes[idx];
  document.getElementById("count").textContent = String(idx + 1).padStart(2, "0") + " / 05";
  document.getElementById("fill").style.width = (idx / scenes.length) * 100 + "%";
  document.getElementById("meter").style.width = score + "%";
  document.getElementById("chapter").textContent = s.chapter;
  document.getElementById("title").textContent = s.title;
  document.getElementById("story").textContent = s.story;
  document.getElementById("talk").textContent = s.talk;
  document.getElementById("result").classList.remove("show");
  document.getElementById("choices").innerHTML = s.choices
    .map(
      (c, i) =>
        `<button class="choice" onclick="choose(${i})"><span class="key">${i + 1}</span><span>${c}</span></button>`,
    )
    .join("");
  document.getElementById("announce").textContent = "Escena " + (idx + 1) + ". " + s.title;
}
function choose(n) {
  if (locked) return;
  locked = true;
  let s = scenes[idx],
    correct = n === s.good;
  score = Math.min(100, score + (correct ? s.gain : -6));
  document.getElementById("meter").style.width = score + "%";
  let res = document.getElementById("result");
  res.textContent =
    (correct ? "✓ Buena decisión. " : "Pensemos en otra posibilidad. ") + s.feedback;
  res.classList.add("show");
  document.getElementById("choices").innerHTML =
    `<button class="btn primary small" onclick="next()">${idx === scenes.length - 1 ? "Ver cierre" : "Continuar"} →</button>`;
  document.getElementById("announce").textContent = res.textContent;
}
function next() {
  idx++;
  if (idx >= scenes.length) {
    document.getElementById("fill").style.width = "100%";
    document.getElementById("game").classList.remove("on");
    document.getElementById("finish").classList.add("show");
  } else render();
}
function restart() {
  document.getElementById("finish").classList.remove("show");
  document.getElementById("game").classList.remove("on");
  document.getElementById("home").classList.remove("off");
  document.getElementById("fill").style.width = "0";
}
function showInfo() {
  document.getElementById("overlay").classList.add("show");
}
function closeInfo() {
  document.getElementById("overlay").classList.remove("show");
}
function toggleProjector() {
  document.body.classList.toggle("projector");
  document.getElementById("projectBtn").textContent = document.body.classList.contains("projector")
    ? "⛶ Salir de proyección"
    : "⛶ Proyectar";
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
  else document.exitFullscreen?.();
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (document.getElementById("overlay").classList.contains("show")) closeInfo();
    else document.body.classList.remove("projector");
  }
  if (document.getElementById("overlay").classList.contains("show")) return;
  if (
    ["1", "2", "3"].includes(e.key) &&
    document.getElementById("game").classList.contains("on") &&
    !locked
  )
    choose(Number(e.key) - 1);
});
