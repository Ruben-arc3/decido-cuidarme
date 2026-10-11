(function () {
  "use strict";
  const $ = (id) => document.getElementById(id),
    board = $("board");
  const pool = [
    { support: ["Tu cuerpo y tus límites merecen respeto", "🛡️"] },
    { support: ["Puedes decir “no” y alejarte si algo te incomoda", "✋"] },
    { support: ["El consentimiento debe ser libre y puede cambiar", "🧭"] },
    { support: ["Nadie debe presionarte para guardar un secreto que te asusta", "🔒"] },
    { support: ["Pedir ayuda no es meterse en problemas", "📞"] },
    { support: ["No es tu culpa si alguien cruza tus límites", "💛"] },
    { support: ["Si no te escuchan, busca otra persona adulta segura", "🤝"] },
    { support: ["Escucha y cree; no interrogues ni culpes", "👂"] },
    { support: ["Agradece que te lo haya contado", "✨"] },
    { support: ["No prometas guardar secretos que ponen a alguien en riesgo", "🫶"] },
    { support: ["Busca apoyo de orientación escolar o profesional", "🏫"] },
    { support: ["Si hay peligro inmediato, ve a un lugar seguro y pide ayuda urgente", "🚨"] },
    { support: ["No tienes que enviar imágenes privadas por internet", "📵"] },
    { support: ["Ante presión o amenazas en línea, pide ayuda a una persona adulta", "📲"] },
  ];
  const rounds = [
    { pairs: 6, poolStart: 0, title: "LÍMITES Y CONSENTIMIENTO", focus: "LÍMITES", cols: 4 },
    { pairs: 8, poolStart: 6, title: "CÓMO BUSCAR Y DAR APOYO", focus: "APOYO", cols: 4 },
  ];
  const teams = ["Equipo 1", "Equipo 2", "Equipo 3", "Equipo 4", "Equipo 5", "Equipo 6"];
  let s = {
    round: 0,
    deck: [],
    up: [],
    matched: new Set(),
    moves: 0,
    started: false,
    paused: false,
    preview: false,
    locked: false,
    team: 0,
    turns: 0,
    found: [],
  };
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function makeDeck() {
    const round = rounds[s.round],
      items = [];
    pool.slice(round.poolStart, round.poolStart + round.pairs).forEach((pair, i) => {
      const id = round.poolStart + i;
      items.push(
        { id, kind: "support", text: pair.support[0], icon: pair.support[1] },
        { id, kind: "support", text: pair.support[0], icon: pair.support[1] },
      );
    });
    s.deck = shuffle(
      items.map((item, index) => ({
        ...item,
        index,
        coord:
          String.fromCharCode(65 + Math.floor(index / rounds[s.round].cols)) +
          ((index % rounds[s.round].cols) + 1),
      })),
    );
    s.up = [];
    s.preview = false;
    s.matched = new Set();
    s.moves = 0;
    s.found = [];
    render();
    hud();
  }
  function render() {
    board.innerHTML = "";
    board.style.setProperty("--cols", rounds[s.round].cols);
    board.style.gridTemplateColumns = "repeat(" + rounds[s.round].cols + ",minmax(0,1fr))";
    s.deck.forEach((c, i) => {
      const b = document.createElement("button");
      b.className = "tile";
      b.type = "button";
      b.dataset.index = i;
      b.setAttribute(
        "aria-label",
        "Carta " + c.coord + (s.preview ? ", " + c.kind + ": " + c.text : ", oculta"),
      );
      if (s.up.includes(i)) b.classList.add("flipped", c.kind);
      if (s.preview) {
        b.classList.add("face-up", c.kind);
        b.disabled = true;
      }
      if (s.preview || s.matched.has(c.id)) b.disabled = true;
      if (s.matched.has(c.id)) b.classList.add("matched", c.kind);
      b.innerHTML =
        '<span class="back"><span class="coord">' +
        c.coord +
        '</span><i>✦</i><span>VOLTEAR</span></span><span class="front"><span class="kind">' +
        "APOYO" +
        '</span><span class="icon">' +
        c.icon +
        '</span><span class="faceText">' +
        c.text +
        "</span></span>";
      b.onclick = () => flip(i);
      board.appendChild(b);
    });
  }
  function flip(i) {
    if (
      !s.started ||
      s.paused ||
      s.preview ||
      s.locked ||
      s.matched.has(s.deck[i].id) ||
      s.up.includes(i)
    )
      return;
    s.up.push(i);
    render();
    if (s.up.length === 2) {
      s.moves++;
      s.turns++;
      rotateTeam();
      const [a, b] = s.up.map((n) => s.deck[n]);
      if (a.id === b.id) {
        s.matched.add(a.id);
        const pair = pool[a.id];
        s.found.push(pair.support[0]);
        $("toast").textContent = "¡Pareja idéntica encontrada! " + pair.support[0];
        s.up = [];
        render();
        hud();
        if (s.matched.size === rounds[s.round].pairs) setTimeout(roundComplete, 850);
      } else {
        s.locked = true;
        $("toast").textContent = "No coinciden. Recuerden las coordenadas.";
        hud();
        setTimeout(() => {
          s.up = [];
          s.locked = false;
          render();
          hud();
        }, 1050);
      }
    }
  }
  function rotateTeam() {
    s.team = (s.team + 1) % teams.length;
    $("team").textContent = teams[s.team] + " propone";
  }
  function hud() {
    $("round").textContent = s.round + 1 + " / 3";
    $("pairs").textContent = s.matched.size + " / " + rounds[s.round].pairs;
    $("moves").textContent = s.moves;
    $("focus").textContent = rounds[s.round].focus;
    $("roundTitle").textContent = "RONDA " + (s.round + 1) + " · " + rounds[s.round].title;
    $("status").textContent = !s.started
      ? "LISTOS"
      : s.paused
        ? "PARTIDA EN PAUSA"
        : s.preview
          ? "OBSERVEN · 2 SEGUNDOS"
          : s.locked
            ? "OBSERVEN Y RECUERDEN"
            : "¡PROPONGAN COORDENADAS!";
    $("ledger").innerHTML = s.found.length
      ? s.found.map((x) => "<span>✓ " + x + "</span>").join("")
      : "<span>Las coincidencias quedan visibles en el tablero.</span>";
    $("instruction").textContent = s.preview
      ? "¡Memoricen ahora! Todas las cartas están abiertas durante 2 segundos."
      : "Digan dos coordenadas por jugada. Si las cartas son idénticas, encontraron una pareja; si no, memoricen dónde quedaron.";
  }
  function showPreview() {
    s.preview = true;
    s.up = [];
    render();
    $("toast").textContent = "¡MEMORIZAR POSICIONES Y PAREJAS!";
    hud();
    setTimeout(() => {
      if (!s.started || !s.preview) return;
      $("status").textContent = "OBSERVEN · 1 SEGUNDO";
    }, 1000);
    setTimeout(() => {
      if (!s.started || !s.preview) return;
      s.preview = false;
      render();
      $("toast").textContent = "Cartas ocultas · empieza la búsqueda";
      hud();
    }, 2000);
  }
  function start() {
    if (s.started) return;
    s.started = true;
    s.paused = false;
    $("intro").hidden = true;
    $("toast").textContent = "¡Comienza el reto! Observen todas las cartas durante 2 segundos.";
    $("team").textContent = teams[s.team] + " propone";
    showPreview();
  }
  function roundComplete() {
    if (s.round === rounds.length - 1) {
      end();
      return;
    }
    $("roundEndTitle").textContent = "Ronda " + (s.round + 1) + " superada";
    $("roundEndText").textContent =
      "Encontraron " +
      rounds[s.round].pairs +
      " parejas en " +
      s.moves +
      " jugadas. En la siguiente ronda aparecerán conceptos distintos sobre cómo acompañar y buscar apoyo.";
    $("roundEnd").hidden = false;
  }
  function nextRound() {
    s.round++;
    $("roundEnd").hidden = true;
    s.paused = false;
    makeDeck();
    $("toast").textContent =
      "Tablero nuevo: observen las cartas durante 2 segundos y cambien de portavoz.";
    showPreview();
    hud();
  }
  function end() {
    $("ending").hidden = false;
    $("endText").textContent =
      "El grupo completó las dos rondas y practicó ideas diferentes sobre límites, consentimiento y apoyo. Recuerden: escuchar, creer y buscar ayuda con una persona adulta segura.";
  }
  function pause() {
    if (!s.started) return;
    s.paused = !s.paused;
    $("pause").textContent = s.paused ? "▶ SEGUIR" : "Ⅱ PAUSA";
    $("status").textContent = s.paused ? "PARTIDA EN PAUSA" : "¡PROPONGAN COORDENADAS!";
  }
  function reset() {
    s = {
      round: 0,
      deck: [],
      up: [],
      matched: new Set(),
      moves: 0,
      started: false,
      paused: false,
      preview: false,
      locked: false,
      team: 0,
      turns: 0,
      found: [],
    };
    $("ending").hidden = true;
    $("roundEnd").hidden = true;
    $("intro").hidden = false;
    makeDeck();
  }
  $("start").onclick = start;
  $("go").onclick = () => {
    makeDeck();
    start();
  };
  $("nextRound").onclick = nextRound;
  $("again").onclick = reset;
  $("pause").onclick = pause;
  $("project").onclick = () => {
    const enable = !document.body.classList.contains("projector-mode");
    document.body.classList.toggle("projector-mode", enable);
    $("project").textContent = enable ? "⛶ SALIR DE PROYECCIÓN" : "⛶ PROYECTAR";
    if (enable && !document.fullscreenElement)
      document.documentElement.requestFullscreen?.().catch?.(() => {});
    else if (!enable && document.fullscreenElement) document.exitFullscreen?.().catch?.(() => {});
  };
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      document.body.classList.remove("projector-mode");
      $("project").textContent = "⛶ PROYECTAR";
    }
  });
  makeDeck();
})();
