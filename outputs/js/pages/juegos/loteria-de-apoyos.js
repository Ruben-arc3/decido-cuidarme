(() => {
  "use strict";
  const cards = [
    { id: "no", icon: "✋", name: "Respeta un “no”", group: "Límites seguros", tag: "safe" },
    {
      id: "escucha",
      icon: "👂",
      name: "Escucha sin juzgar",
      group: "Red de apoyo",
      tag: "vif",
    },
    {
      id: "adulto",
      icon: "🧑‍🏫",
      name: "Adulto de confianza",
      group: "Red de apoyo",
      tag: "vif",
    },
    {
      id: "orienta",
      icon: "🏫",
      name: "Orientación escolar",
      group: "Red de apoyo",
      tag: "vif",
    },
    { id: "salud", icon: "🩺", name: "Apoyo profesional", group: "Bienestar", tag: "spa" },
    { id: "emerg", icon: "🚨", name: "Ayuda urgente", group: "Red de apoyo", tag: "vif" },
    {
      id: "salida",
      icon: "🚪",
      name: "Plan de salida segura",
      group: "Bienestar",
      tag: "spa",
    },
    {
      id: "acompaña",
      icon: "🤝",
      name: "Acompaña sin presionar",
      group: "Red de apoyo",
      tag: "vif",
    },
    {
      id: "amistad",
      icon: "💬",
      name: "Mantén el vínculo",
      group: "Red de apoyo",
      tag: "vif",
    },
    {
      id: "limite",
      icon: "🧭",
      name: "Pon límites claros",
      group: "Límites seguros",
      tag: "safe",
    },
    {
      id: "privacidad",
      icon: "📵",
      name: "Cuida tu privacidad",
      group: "Límites seguros",
      tag: "safe",
    },
    {
      id: "sinculpa",
      icon: "💛",
      name: "Apoya sin culpar",
      group: "Red de apoyo",
      tag: "vif",
    },
    {
      id: "presion",
      icon: "🌿",
      name: "Aléjate de la presión",
      group: "Bienestar",
      tag: "spa",
    },
    {
      id: "seguro",
      icon: "🛟",
      name: "Busca un lugar seguro",
      group: "Límites seguros",
      tag: "safe",
    },
    {
      id: "autocuidado",
      icon: "✨",
      name: "Elige autocuidado",
      group: "Bienestar",
      tag: "spa",
    },
    { id: "habla", icon: "🗣️", name: "Pide ayuda", group: "Red de apoyo", tag: "vif" },
    {
      id: "acompaadulto",
      icon: "🫶",
      name: "Busca compañía adulta",
      group: "Límites seguros",
      tag: "safe",
    },
    { id: "grupo", icon: "👥", name: "Cuida al grupo", group: "Bienestar", tag: "spa" },
  ];
  const teams = [
    { name: "Equipo Sol", color: "#e0a928" },
    { name: "Equipo Río", color: "#4197a0" },
    { name: "Equipo Monte", color: "#8270bd" },
    { name: "Equipo Brisa", color: "#df7563" },
  ];
  const $ = (id) => document.getElementById(id);
  let state = {
    started: false,
    finished: false,
    bag: [],
    current: null,
    drawn: 0,
    boards: [],
    marks: [],
    called: [],
  };
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function newGame() {
    state = {
      started: false,
      finished: false,
      bag: [],
      current: null,
      drawn: 0,
      boards: [],
      marks: [],
      called: [],
    };
    teams.forEach((_, i) => {
      const b = shuffle([...cards]).slice(0, 9);
      state.boards.push(b);
      state.marks.push(new Set());
    });
    state.bag = shuffle([...cards]);
    $("drawCount").textContent = "0 / 18";
    $("round").textContent = "LISTOS";
    $("roundLabel").textContent = "NUEVA PARTIDA";
    $("caller").classList.remove("ready");
    $("callIcon").textContent = "🎴";
    $("callTitle").textContent = "¿Listos para jugar?";
    $("callTag").textContent = "Apoyos para todos";
    $("callHint").textContent = "Cada equipo tiene un tablero diferente.";
    $("draw").disabled = false;
    $("draw").textContent = "▶ EMPEZAR Y CANTAR";
    $("history").replaceChildren();
    $("toast").textContent = "La partida comienza al presionar el botón.";
    renderBoards();
  }
  function renderBoards() {
    const root = $("boards");
    root.replaceChildren();
    teams.forEach((team, ti) => {
      const section = document.createElement("article");
      section.className = "team-board";
      section.style.setProperty("--team", team.color);
      const head = document.createElement("div");
      head.className = "team-head";
      head.innerHTML =
        '<span class="team-name"><i class="team-dot"></i>' +
        team.name +
        '</span><span class="team-score" id="score' +
        ti +
        '">0 / 9 marcadas</span>';
      const grid = document.createElement("div");
      grid.className = "cells";
      state.boards[ti].forEach((card) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "cell";
        button.dataset.team = ti;
        button.dataset.card = card.id;
        button.setAttribute("aria-label", team.name + ": " + card.name);
        button.innerHTML =
          '<span class="ico">' +
          card.icon +
          '</span><span class="label">' +
          card.name +
          '</span><span class="check">✓</span>';
        button.onclick = () => mark(ti, card, button);
        grid.append(button);
      });
      section.append(head, grid);
      root.append(section);
    });
  }
  function start() {
    if (state.started) return;
    $("intro").hidden = true;
    state.started = true;
    state.bag = shuffle([...cards]);
    $("round").textContent = "EN JUEGO";
    $("roundLabel").textContent = "RONDA COOPERATIVA";
    $("toast").textContent = "¡Primera carta! Encuéntrenla en los tableros.";
    drawNext();
  }
  function drawNext() {
    if (!state.started || state.finished) return;
    if (state.current) {
      const winners = teams.map((t, i) => (hasLine(i) ? t.name : null)).filter(Boolean);
      if (winners.length) {
        finish(winners);
        return;
      }
    }
    if (!state.bag.length) {
      const winners = teams.map((t, i) => (hasLine(i) ? t.name : null)).filter(Boolean);
      if (winners.length) finish(winners);
      else {
        state.finished = true;
        $("round").textContent = "FINAL";
        $("draw").disabled = true;
        $("draw").textContent = "PARTIDA TERMINADA";
        $("toast").textContent = "Se acabaron las cartas. ¡Nueva partida para intentarlo otra vez!";
      }
      return;
    }
    state.current = state.bag.pop();
    state.drawn++;
    state.called.unshift(state.current);
    $("drawCount").textContent = state.drawn + " / 18";
    $("caller").classList.add("ready");
    $("callIcon").textContent = state.current.icon;
    $("callTitle").textContent = state.current.name;
    $("callTag").textContent = state.current.group;
    $("callHint").textContent = "Busca la misma imagen y el mismo nombre en cada tablero.";
    $("draw").textContent = state.bag.length
      ? "CERRAR CANTADA · SIGUIENTE CARTA"
      : "CERRAR CANTADA · FINALIZAR";
    $("toast").textContent = "Si la tienen, hagan clic en la casilla. Revisen los cuatro tableros.";
    $("history").replaceChildren();
    state.called.slice(1, 5).forEach((c) => {
      const chip = document.createElement("span");
      chip.textContent = c.icon + " " + c.name;
      $("history").append(chip);
    });
  }
  function mark(ti, card, button) {
    if (!state.started || state.finished || !state.current) return;
    if (card.id !== state.current.id) {
      button.classList.remove("wrong");
      void button.offsetWidth;
      button.classList.add("wrong");
      $("toast").textContent = "Esa no es la carta cantada. Busquen: " + state.current.name;
      setTimeout(() => button.classList.remove("wrong"), 350);
      return;
    }
    if (state.marks[ti].has(card.id)) return;
    state.marks[ti].add(card.id);
    button.classList.add("marked");
    $("score" + ti).textContent = state.marks[ti].size + " / 9 marcadas";
    $("toast").textContent =
      teams[ti].name + " encontró “" + card.name + "”. ¡Sigan buscando en los otros tableros!";
  }
  function hasLine(ti) {
    const b = state.boards[ti].map((c) => c.id),
      m = state.marks[ti];
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return lines.some((line) => line.every((i) => m.has(b[i])));
  }
  function finish(winners) {
    state.finished = true;
    $("draw").disabled = true;
    $("round").textContent = "LOTERÍA";
    $("resultTitle").textContent =
      winners.length > 1 ? "¡Lotería compartida!" : "¡" + winners[0] + " cantó lotería!";
    $("resultText").textContent =
      (winners.length > 1
        ? winners.join(" y ") + " completaron una línea."
        : "¡" + winners[0] + " completó tres apoyos en línea!") +
      " Antes de jugar otra vez, el grupo puede elegir una carta y decir cómo ese apoyo podría ayudar en una situación ficticia.";
    $("result").hidden = false;
  }
  $("draw").onclick = () => (state.started ? drawNext() : start());
  $("reset").onclick = () => {
    newGame();
    $("intro").hidden = false;
  };
  $("go").onclick = start;
  $("playAgain").onclick = () => {
    $("result").hidden = true;
    newGame();
  };
  newGame();
})();
