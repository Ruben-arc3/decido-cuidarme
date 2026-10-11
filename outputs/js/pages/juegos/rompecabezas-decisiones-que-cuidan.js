(() => {
  "use strict";
  const $ = (id) => document.getElementById(id),
    puzzle = $("puzzle");
  const levels = [
    {
      n: 3,
      title: "Ronda 1 · Observa y arma",
      tag: "RONDA 1 · CALENTAMIENTO",
      mission: "Encuentren las formas grandes y unan las piezas del mural.",
      note: "Cada voz aporta una observación. Escuchen las propuestas antes de mover.",
      takeaway: "Cada persona puede tomar decisiones propias y merece que las respeten.",
    },
    {
      n: 4,
      title: "Ronda 2 · Decisiones en equipo",
      tag: "RONDA 2 · RED DE CUIDADO",
      mission: "El tablero crece. Fíjense en los bordes, los colores y las siluetas.",
      note: "Roten a quien propone el intercambio. Pueden pedir una de las dos pistas.",
      takeaway: "Una amistad que cuida acompaña sin presionar y ayuda a buscar apoyo.",
    },
    {
      n: 5,
      title: "Ronda 3 · El mural completo",
      tag: "RONDA 3 · RETO FINAL",
      mission: "Veinticinco piezas. Combinen lo que observa todo el salón para resolverlo.",
      note: "Aprovechen cada detalle. Si se atascan, usen una pista con estrategia.",
      takeaway:
        "Alejarse de una situación de presión y pedir apoyo también son decisiones valientes.",
    },
  ];
  const art = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#9be6df"/><stop offset="1" stop-color="#e9f5d2"/></linearGradient><linearGradient id="hill" x2="0" y2="1"><stop stop-color="#5bbd91"/><stop offset="1" stop-color="#197d76"/></linearGradient><linearGradient id="shirt" x2="0" y2="1"><stop stop-color="#ffb15c"/><stop offset="1" stop-color="#ed765f"/></linearGradient></defs><rect width="800" height="800" fill="url(#sky)"/><circle cx="670" cy="155" r="73" fill="#ffe178"/><g fill="#fff" opacity=".8"><ellipse cx="130" cy="145" rx="72" ry="22"/><ellipse cx="170" cy="135" rx="39" ry="29"/><ellipse cx="412" cy="95" rx="56" ry="18"/></g><path d="M0 390 150 235l145 158 132-142 160 158 103-109 110 96v404H0Z" fill="#83c9ad"/><path d="M0 478q154-123 322-17t478-24v363H0Z" fill="url(#hill)"/><path d="M0 641q205-110 382-9t418-37v205H0Z" fill="#126d69"/><path d="M310 800q60-112 84-211 27-112 112-185" fill="none" stroke="#f4d37b" stroke-width="42" stroke-linecap="round"/><path d="M310 800q60-112 84-211 27-112 112-185" fill="none" stroke="#fff0bb" stroke-width="5" stroke-dasharray="12 16" stroke-linecap="round"/><g transform="translate(85 68)"><rect width="630" height="122" rx="25" fill="#123d50" opacity=".94"/><text x="315" y="50" fill="#ffe178" text-anchor="middle" font-family="system-ui,sans-serif" font-size="23" font-weight="900" letter-spacing="4">TU DECISIÓN,</text><text x="315" y="91" fill="#fff" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" font-weight="900">TU BIENESTAR</text></g><g transform="translate(160 330)"><!-- persona izquierda --><path d="M68 176q12-81 91-86 70 1 83 87l-4 150H72Z" fill="#e88b62"/><path d="M93 124q21-43 71-40 48 2 63 45l-10 31H98Z" fill="#263d54"/><circle cx="160" cy="83" r="51" fill="#a95f45"/><path d="M111 74q5-56 58-56 44 1 57 47l-19-5-23-18-26 19-36 10Z" fill="#22374b"/><circle cx="143" cy="86" r="3.5" fill="#142b41"/><circle cx="177" cy="86" r="3.5" fill="#142b41"/><path d="M148 106q13 12 26 0" fill="none" stroke="#6e3d39" stroke-width="4" stroke-linecap="round"/><path d="M99 151q-44 4-67 56" fill="none" stroke="#a95f45" stroke-width="18" stroke-linecap="round"/><path d="M215 151q37 12 57 49" fill="none" stroke="#a95f45" stroke-width="18" stroke-linecap="round"/><path d="M101 326v89m116-89v89" stroke="#253c54" stroke-width="31" stroke-linecap="round"/><path d="M81 420h49m72 0h48" stroke="#f5d089" stroke-width="15" stroke-linecap="round"/><!-- persona centro --><path d="M251 166q12-81 91-86 70 1 83 87l-4 160H255Z" fill="url(#shirt)"/><path d="M277 117q22-43 70-40 48 2 63 45l-10 31H282Z" fill="#482c49"/><circle cx="344" cy="78" r="51" fill="#e4a66f"/><path d="M294 72q4-55 58-57 43 1 56 48l-19-5-22-18-26 19-36 10Z" fill="#392b42"/><circle cx="327" cy="81" r="3.5" fill="#142b41"/><circle cx="360" cy="81" r="3.5" fill="#142b41"/><path d="M330 102q13 12 26 0" fill="none" stroke="#8f584d" stroke-width="4" stroke-linecap="round"/><path d="M281 146q-39 6-64 41" fill="none" stroke="#e4a66f" stroke-width="18" stroke-linecap="round"/><path d="M409 145q44-9 72-45" fill="none" stroke="#e4a66f" stroke-width="18" stroke-linecap="round"/><path d="M284 322v94m116-94v94" stroke="#263c56" stroke-width="31" stroke-linecap="round"/><path d="M264 420h49m72 0h49" stroke="#f5d089" stroke-width="15" stroke-linecap="round"/><!-- persona derecha --><path d="M424 177q13-80 90-86 69 2 82 87l-5 148H430Z" fill="#7399ce"/><path d="M447 124q21-43 69-40 48 2 63 45l-10 31H452Z" fill="#e9d8bc"/><circle cx="515" cy="83" r="51" fill="#784c3e"/><path d="M464 74q5-56 58-57 44 1 57 48l-19-5-23-18-26 19-36 10Z" fill="#493b39"/><circle cx="498" cy="86" r="3.5" fill="#142b41"/><circle cx="531" cy="86" r="3.5" fill="#142b41"/><path d="M501 107q13 12 26 0" fill="none" stroke="#50342e" stroke-width="4" stroke-linecap="round"/><path d="M454 153q-35 15-54 43" fill="none" stroke="#784c3e" stroke-width="18" stroke-linecap="round"/><path d="M574 150q37 8 56 39" fill="none" stroke="#784c3e" stroke-width="18" stroke-linecap="round"/><path d="M456 326v90m114-90v90" stroke="#283b55" stroke-width="31" stroke-linecap="round"/><path d="M436 420h49m70 0h49" stroke="#f5d089" stroke-width="15" stroke-linecap="round"/></g><g transform="translate(621 270)"><path d="M0 45 45 0l45 45v60q0 76-45 101Q0 181 0 105Z" fill="#fff4cf" stroke="#f0c75e" stroke-width="6"/><path d="m24 93 17 17 30-37" fill="none" stroke="#18816d" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><text x="45" y="137" text-anchor="middle" fill="#325c59" font-family="system-ui,sans-serif" font-size="13" font-weight="800">APOYO</text></g><g fill="#ffe178"><path d="m104 306 9 19 21 3-15 14 4 21-19-10-18 10 4-21-15-14 21-3Z"/><path d="m712 517 7 15 17 3-12 11 3 17-15-8-15 8 3-17-12-11 17-3Z"/><path d="m687 617 6 12 14 2-10 10 2 14-12-7-12 7 2-14-10-10 14-2Z"/></g><rect x="92" y="704" width="616" height="54" rx="18" fill="#103e50"/><text x="400" y="738" text-anchor="middle" fill="#fff" font-family="system-ui,sans-serif" font-size="19" font-weight="900" letter-spacing="2">ELEGIR · ACOMPAÑAR · PEDIR APOYO</text></svg>`;
  const image = 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(art) + '")';
  let s = {
    level: 0,
    arr: [],
    selected: null,
    moves: 0,
    totalMoves: 0,
    hints: 2,
    elapsed: 0,
    started: false,
    paused: false,
    completed: false,
    timer: null,
    hinted: [],
  };
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function coord(i, n) {
    return String.fromCharCode(65 + Math.floor(i / n)) + ((i % n) + 1);
  }
  function formatTime(n) {
    return String(Math.floor(n / 60)).padStart(2, "0") + ":" + String(n % 60).padStart(2, "0");
  }
  function beginLevel() {
    const cfg = levels[s.level],
      total = cfg.n * cfg.n;
    s.arr = Array.from({ length: total }, (_, i) => i);
    for (let k = 0; k < total * 7; k++) {
      const a = Math.floor(Math.random() * total),
        b = Math.floor(Math.random() * total);
      if (a !== b) [s.arr[a], s.arr[b]] = [s.arr[b], s.arr[a]];
    }
    if (s.arr.every((x, i) => x === i)) [s.arr[0], s.arr[1]] = [s.arr[1], s.arr[0]];
    s.selected = null;
    s.moves = 0;
    s.hints = 2;
    s.completed = false;
    $("level").textContent = s.level + 1 + " / 3";
    $("boardTitle").textContent = cfg.title;
    $("boardSub").textContent = "Selecciona dos piezas para intercambiarlas.";
    $("levelTag").textContent = cfg.tag;
    $("missionTitle").textContent = "Construyan el mural";
    $("missionText").textContent = cfg.mission;
    $("moves").textContent = "0";
    $("hints").textContent = "2";
    $("hint").disabled = false;
    $("correctCount").textContent = "0 / " + total + " piezas correctas";
    $("progressText").textContent = "0%";
    $("progressBar").style.width = "0%";
    $("toast").textContent = cfg.note;
    puzzle.style.setProperty("--n", cfg.n);
    puzzle.setAttribute("aria-label", "Rompecabezas de " + cfg.n + " por " + cfg.n + " piezas");
    render();
  }
  function render() {
    puzzle.replaceChildren();
    const n = levels[s.level].n,
      total = n * n,
      correct = s.arr.reduce((a, x, i) => a + (x === i ? 1 : 0), 0);
    s.arr.forEach((piece, pos) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "piece";
      b.setAttribute("role", "gridcell");
      b.setAttribute(
        "aria-label",
        "Pieza " + coord(pos, n) + (piece === pos ? ", correcta" : ", imagen parcial"),
      );
      b.style.backgroundImage = image;
      b.style.backgroundPosition =
        (n === 1 ? 0 : ((piece % n) / (n - 1)) * 100) +
        "% " +
        (n === 1 ? 0 : (Math.floor(piece / n) / (n - 1)) * 100) +
        "%";
      if (piece === pos) b.classList.add("correct");
      if (s.selected === pos) b.classList.add("selected");
      if (s.hinted.includes(pos)) b.classList.add("hinted");
      const c = document.createElement("span");
      c.className = "coord";
      c.textContent = coord(pos, n);
      b.append(c);
      b.onclick = () => selectPiece(pos);
      puzzle.append(b);
    });
    $("moves").textContent = s.moves;
    $("correctCount").textContent = correct + " / " + total + " piezas correctas";
    const pct = Math.round((correct / total) * 100);
    $("progressText").textContent = pct + "%";
    $("progressBar").style.width = pct + "%";
  }
  function selectPiece(pos) {
    if (!s.started || s.paused || s.completed) return;
    if (s.selected === null) {
      s.selected = pos;
      render();
      $("toast").textContent =
        "Pieza " +
        coord(pos, levels[s.level].n) +
        " seleccionada. Elijan otra coordenada para intercambiar.";
      return;
    }
    if (s.selected === pos) {
      s.selected = null;
      render();
      $("toast").textContent = "Selección cancelada. Elijan una pieza para empezar.";
      return;
    }
    const a = s.selected,
      b = pos;
    [s.arr[a], s.arr[b]] = [s.arr[b], s.arr[a]];
    s.selected = null;
    s.moves++;
    s.totalMoves++;
    render();
    $("toast").textContent = "Intercambio hecho. ¿Qué parte del mural encaja ahora?";
    if (s.arr.every((x, i) => x === i)) setTimeout(completeLevel, 350);
  }
  function hint() {
    if (!s.started || s.paused || s.completed) return;
    if (s.hints <= 0) {
      $("toast").textContent =
        "Ya usaron las dos pistas de esta ronda. ¡Revisen las coordenadas en equipo!";
      return;
    }
    let target = s.arr.findIndex((x, i) => x !== i);
    if (target < 0) return;
    let source = s.arr.indexOf(target);
    s.hints--;
    $("hints").textContent = s.hints;
    if (s.hints === 0) $("hint").disabled = true;
    s.hinted = [target, source];
    render();
    const n = levels[s.level].n;
    $("toast").textContent =
      "Pista: intercambien " + coord(source, n) + " con " + coord(target, n) + ".";
    setTimeout(() => {
      s.hinted = [];
      if (s.started && !s.paused) render();
    }, 1800);
  }
  function start() {
    if (s.started) return;
    s.started = true;
    $("intro").hidden = true;
    beginLevel();
    if (!s.timer)
      s.timer = setInterval(() => {
        if (s.started && !s.paused && !s.completed) {
          s.elapsed++;
          $("clock").textContent = formatTime(s.elapsed);
        }
      }, 1000);
    $("start").textContent = "▶ RETO EN CURSO";
    $("start").disabled = true;
  }
  function completeLevel() {
    if (s.completed || !s.started) return;
    s.completed = true;
    const cfg = levels[s.level];
    $("levelEmoji").textContent = s.level === 2 ? "🏆" : "🌿";
    $("modalEyebrow").textContent =
      "RONDA " + (s.level + 1) + " COMPLETADA · " + s.moves + " MOVIMIENTOS";
    $("modalTitle").textContent = s.level === 2 ? "¡Mural completo!" : "¡Imagen armada!";
    $("modalText").textContent = cfg.takeaway;
    $("continue").textContent = s.level === 2 ? "TERMINAR RETO" : "SIGUIENTE NIVEL →";
    $("levelModal").hidden = false;
  }
  function next() {
    $("levelModal").hidden = true;
    if (s.level === 2) {
      s.started = false;
      clearInterval(s.timer);
      s.timer = null;
      $("intro").querySelector("h2").textContent = "¡Reto completado!";
      $("intro").querySelector("p").textContent =
        "En " +
        formatTime(s.elapsed) +
        " y " +
        s.totalMoves +
        " movimientos, el salón armó el mural. Recuerden: tomar decisiones informadas, acompañar sin presionar y buscar apoyo son formas de cuidarse.";
      $("intro").querySelector(".dialog-icon").textContent = "🎉";
      $("go").textContent = "JUGAR DE NUEVO";
      $("go").onclick = reset;
      $("intro").hidden = false;
      return;
    }
    s.level++;
    beginLevel();
  }
  function reset() {
    clearInterval(s.timer);
    s = {
      level: 0,
      arr: [],
      selected: null,
      moves: 0,
      totalMoves: 0,
      hints: 2,
      elapsed: 0,
      started: false,
      paused: false,
      completed: false,
      timer: null,
      hinted: [],
    };
    $("clock").textContent = "00:00";
    $("pause").textContent = "Ⅱ Pausa";
    $("start").disabled = false;
    $("start").textContent = "▶ EMPEZAR RETO";
    $("intro").querySelector("h2").textContent = "¿Pueden armar el mural?";
    $("intro").querySelector("p").textContent =
      "Resuelvan tres tableros: 9, 16 y 25 piezas. Elijan dos coordenadas para intercambiar; usen las pistas si se atascan.";
    $("intro").querySelector(".dialog-icon").textContent = "🧩";
    $("go").textContent = "¡EMPEZAR!";
    $("go").onclick = start;
    $("intro").hidden = false;
    beginLevel();
  }
  $("start").onclick = start;
  $("go").onclick = start;
  $("continue").onclick = next;
  $("hint").onclick = hint;
  $("restart").onclick = reset;
  $("pause").onclick = () => {
    if (!s.started || s.completed) return;
    s.paused = !s.paused;
    $("pause").textContent = s.paused ? "▶ Seguir" : "Ⅱ Pausa";
    $("toast").textContent = s.paused
      ? "Partida en pausa. Conversen la siguiente jugada."
      : "¡Sigan armando el mural!";
  };
  $("project").onclick = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };
  beginLevel();
})();
