(() => {
  "use strict";
  const $ = (id) => document.getElementById(id),
    teams = ["Equipo Sol", "Equipo Río", "Equipo Monte", "Equipo Brisa"],
    enterLabels = {
      patron: "Entrar al taller",
      datos: "Mirar los datos",
      radio: "Ir a la radio",
      misiones: "Planear una misión",
    };
  let state = {
    started: false,
    completed: new Set(),
    team: 0,
    elapsed: 0,
    timer: null,
    current: null,
    sequence: [],
    seqLocked: false,
  };
  const stations = {
    patron: {
      icon: "🧩",
      kicker: "TALLER DE INNOVACIÓN · PATRONES",
      title: "¿Qué pieza completa el diseño?",
      prompt: "Miren la secuencia. El patrón alterna dos formas. El salón acuerda cuál sigue.",
      type: "pattern",
      skill: "Pensamiento lógico y diseño",
      emoji: "🔷",
      areas: ["Diseño y creación", "Tecnología e ingeniería"],
      explain:
        "¡Patrón descubierto! Observar regularidades ayuda a diseñar, construir y resolver problemas.",
      options: ["▲", "●", "■"],
      answer: 0,
      sequence: ["●", "▲", "●", "▲", "●"],
    },
    datos: {
      icon: "📊",
      kicker: "OBSERVATORIO · DATOS",
      title: "Encuentren el segundo valor más alto",
      prompt:
        "Este grupo registró qué actividades nuevas le interesaron. Lean las barras y acuerden cuál ocupa el segundo lugar.",
      type: "chart",
      skill: "Lectura de datos y análisis",
      emoji: "📈",
      areas: ["Ciencias e investigación", "Economía y análisis"],
      explain:
        "¡Dato encontrado! Leer información ayuda a comparar opciones y sostener ideas con evidencia.",
      chart: [
        ["Diseño", 5],
        ["Ciencia", 3],
        ["Salud", 4],
        ["Comunidad", 2],
      ],
      options: ["Diseño", "Ciencia", "Salud", "Comunidad"],
      answer: 2,
    },
    radio: {
      icon: "🎙️",
      kicker: "RADIO DEL CAMPUS · LECTURA",
      title: "Elijan el titular que mejor resume la historia",
      prompt: "Lean el texto y conversen qué idea reúne lo más importante.",
      type: "reading",
      skill: "Lectura y comunicación",
      emoji: "💬",
      areas: ["Comunicación y educación", "Ciencias sociales"],
      explain:
        "¡Buen resumen! Comprender una idea central sirve para aprender y comunicar en muchos campos.",
      reading:
        "Un grupo quería hacer un podcast sobre su barrio. Al principio casi nadie lo escuchaba. Probaron otros horarios y preguntaron a sus vecinos qué temas les interesaban. Con el tiempo, más jóvenes se sumaron al proyecto.",
      options: [
        "Un equipo adapta su proyecto al escuchar a la comunidad.",
        "Los podcasts solo funcionan con equipos costosos.",
        "Los jóvenes dejaron de compartir historias.",
      ],
      answer: 0,
    },
    misiones: {
      icon: "🚀",
      kicker: "ESTUDIO DE PROYECTOS · PLANIFICACIÓN",
      title: "Ordenen los pasos de la misión",
      prompt: "Para probar una idea sin empezar a lo grande, organicen una ruta posible.",
      type: "sequence",
      skill: "Planificación y experimentación",
      emoji: "🛠️",
      areas: ["Gestión de proyectos", "Ambiente e innovación social"],
      explain: "¡Misión en marcha! Observar, planear y probar ayuda a convertir ideas en acciones.",
      items: [
        ["Observar una necesidad", "👀"],
        ["Planear una prueba pequeña", "🗺️"],
        ["Probar y aprender", "🧪"],
      ],
      answer: ["observar", "planear", "probar"],
    },
  };
  function update() {
    const n = state.completed.size;
    $("progress").textContent = n + " / 3 necesarias" + (n === 4 ? " · campus completo" : "");
    $("team").textContent = teams[state.team % teams.length];
    $("portal").hidden = n < 3;
    document.querySelectorAll(".station").forEach((b) => {
      const done = state.completed.has(b.dataset.id);
      b.classList.toggle("done", done);
      b.disabled = done;
      const action = b.querySelector(".action span:first-child");
      action.textContent = done ? "Insignia obtenida ✓" : enterLabels[b.dataset.id];
    });
  }
  function start() {
    if (state.started) return;
    state.started = true;
    $("intro").hidden = true;
    state.timer = setInterval(() => {
      if (state.started) {
        state.elapsed++;
        $("clock").textContent =
          String(Math.floor(state.elapsed / 60)).padStart(2, "0") +
          ":" +
          String(state.elapsed % 60).padStart(2, "0");
      }
    }, 1000);
    update();
  }
  function enter(id) {
    if (!state.started || state.completed.has(id)) return;
    const d = stations[id];
    state.current = id;
    $("challengeIcon").textContent = d.icon;
    $("challengeKicker").textContent = d.kicker;
    $("challengeTitle").textContent = d.title;
    $("challengePrompt").textContent = d.prompt;
    $("feedback").textContent = "";
    const body = $("challengeBody");
    body.replaceChildren();
    if (d.type === "pattern") renderPattern(d, body);
    if (d.type === "chart") renderChart(d, body);
    if (d.type === "reading") renderReading(d, body);
    if (d.type === "sequence") renderSequence(d, body);
    $("challengeModal").hidden = false;
  }
  function optionButtons(d, body) {
    const row = document.createElement("div");
    row.className = "answer-row";
    d.options.forEach((o, i) => {
      const b = document.createElement("button");
      b.className = "answer";
      b.textContent = o;
      b.onclick = () => answer(i);
      row.append(b);
    });
    body.append(row);
  }
  function renderPattern(d, body) {
    const seq = document.createElement("div");
    seq.className = "puzzle-seq";
    [...d.sequence, "?"].forEach((x, i) => {
      const t = document.createElement("div");
      t.className = "seq-tile" + (i === d.sequence.length ? " missing" : "");
      t.textContent = x;
      seq.append(t);
    });
    body.append(seq);
    optionButtons(d, body);
  }
  function renderChart(d, body) {
    const chart = document.createElement("div");
    chart.className = "chart";
    d.chart.forEach(([label, val]) => {
      const c = document.createElement("div");
      c.className = "column";
      const bar = document.createElement("i");
      bar.style.height = val * 15 + "px";
      bar.title = val + " interesadas";
      const num = document.createElement("b");
      num.textContent = val;
      const name = document.createElement("span");
      name.textContent = label;
      c.append(bar, num, name);
      chart.append(c);
    });
    body.append(chart);
    optionButtons(d, body);
  }
  function renderReading(d, body) {
    const text = document.createElement("div");
    text.className = "reading";
    text.textContent = "“" + d.reading + "”";
    body.append(text);
    optionButtons(d, body);
  }
  function renderSequence(d, body) {
    state.sequence = [];
    state.seqLocked = false;
    const slots = document.createElement("div");
    slots.className = "sequence-slots";
    slots.id = "slots";
    for (let i = 0; i < 3; i++) {
      const x = document.createElement("div");
      x.className = "slot";
      x.textContent = i + 1 + ". Elige un paso";
      slots.append(x);
    }
    body.append(slots);
    const row = document.createElement("div");
    row.className = "sequence-options";
    const shuffled = [...d.items].sort(() => Math.random() - 0.5);
    shuffled.forEach(([label, icon], idx) => {
      const b = document.createElement("button");
      b.innerHTML = icon + " " + label;
      b.dataset.key = ["observar", "planear", "probar"][d.items.findIndex((x) => x[0] === label)];
      b.onclick = () => {
        if (state.seqLocked || b.disabled) return;
        state.sequence.push(b.dataset.key);
        b.disabled = true;
        $("slots").children[state.sequence.length - 1].textContent =
          state.sequence.length + ". " + label;
        if (state.sequence.length === 3) {
          state.seqLocked = true;
          answer(state.sequence.join("|"));
        }
      };
      row.append(b);
    });
    body.append(row);
  }
  function answer(value) {
    const d = stations[state.current];
    const correct = d.type === "sequence" ? value === d.answer.join("|") : value === d.answer;
    if (correct) {
      state.completed.add(state.current);
      state.team = (state.team + 1) % teams.length;
      $("feedback").textContent = d.explain + " Insignia: " + d.skill + ".";
      update();
      $("closeChallenge").textContent =
        state.completed.size >= 3 ? "VOLVER AL CAMPUS · PORTAL DISPONIBLE" : "VOLVER AL CAMPUS";
      $("closeChallenge").classList.add("primary");
    } else {
      $("feedback").textContent =
        d.type === "sequence"
          ? "Casi. Piensen qué conviene hacer antes de probar; vuelvan a intentarlo."
          : "Casi. Conversen otra vez y prueben una alternativa. ¡Pueden reintentar sin perder puntos!";
      if (d.type === "sequence") {
        state.sequence = [];
        state.seqLocked = false;
        document.querySelectorAll(".sequence-options button").forEach((b) => (b.disabled = false));
        [...$("slots").children].forEach((x, i) => (x.textContent = i + 1 + ". Elige un paso"));
      }
    }
  }
  function closeChallenge() {
    $("challengeModal").hidden = true;
    $("closeChallenge").textContent = "Volver al campus";
    $("closeChallenge").classList.remove("primary");
    state.current = null;
    update();
  }
  function openResults() {
    if (state.completed.size < 3) return;
    const skills = [...state.completed].map((id) => stations[id]);
    const root = $("profile");
    root.replaceChildren();
    skills.forEach((d) => {
      const card = document.createElement("article");
      card.className = "profile-card";
      card.innerHTML =
        '<span class="emoji">' +
        d.emoji +
        "</span><b>" +
        d.skill +
        "</b><p>Áreas para curiosear: " +
        d.areas.join(" · ") +
        ".</p>";
      root.append(card);
    });
    if (state.completed.size === 4) {
      const card = document.createElement("article");
      card.className = "profile-card";
      card.innerHTML =
        '<span class="emoji">🌟</span><b>Campus completo</b><p>Exploraron las cuatro estaciones y pusieron en juego habilidades diversas.</p>';
      root.append(card);
    }
    $("results").hidden = false;
  }
  function reset() {
    clearInterval(state.timer);
    state = {
      started: false,
      completed: new Set(),
      team: 0,
      elapsed: 0,
      timer: null,
      current: null,
      sequence: [],
      seqLocked: false,
    };
    $("clock").textContent = "00:00";
    $("results").hidden = true;
    $("intro").hidden = false;
    $("challengeModal").hidden = true;
    $("closeChallenge").textContent = "Volver al campus";
    $("closeChallenge").classList.remove("primary");
    $("feedback").textContent = "";
    update();
  }
  document.querySelectorAll(".station").forEach((b) => (b.onclick = () => enter(b.dataset.id)));
  $("start").onclick = start;
  $("closeChallenge").onclick = closeChallenge;
  $("openPortal").onclick = openResults;
  $("closeResults").onclick = () => ($("results").hidden = true);
  $("again").onclick = reset;
  $("reset").onclick = reset;
  update();
  $("intro").hidden = false;
})();
