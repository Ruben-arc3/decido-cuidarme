(function () {
  "use strict";
  const $ = (id) => document.getElementById(id),
    board = $("board");
  const pool = [
    { support: ["Tu cuerpo y tus límites merecen respeto", "🛡️"] },
    { support: ["Puedes decir “no” y alejarte si algo te incomoda", "✋"] },
    { support: ["El consentimiento debe ser libre y puede cambiar", "🧭"] },
    { support: ["Nadie debe presionarte para guardar un secreto que te asusta", "🔒"] },
    { support: ["Cuéntaselo a una persona adulta de confianza", "🗣️"] },
    { support: ["Si no te escuchan, busca a otra persona adulta segura", "🤝"] },
    { support: ["Pedir ayuda no es meterse en problemas", "📞"] },
    { support: ["No es tu culpa si alguien cruza tus límites", "💛"] },
    { support: ["Escucha y cree; no interrogues ni culpes", "👂"] },
    { support: ["Agradece que te lo haya contado", "✨"] },
    { support: ["No prometas guardar en secreto algo que pone a alguien en riesgo", "🫶"] },
    { support: ["Busca apoyo de orientación escolar o profesional", "🏫"] },
    { support: ["Si hay peligro inmediato, busca un lugar seguro y ayuda urgente", "🚨"] },
    { support: ["En internet, no tienes que enviar imágenes privadas", "📵"] },
    { support: ["Si alguien amenaza o presiona en línea, pide ayuda adulta", "📲"] },
    { support: ["Respeta el espacio y los límites de otras personas", "🕊️"] },
    { support: ["Acompaña a la persona; deja que decida qué necesita", "🤲"] },
    { support: ["La ayuda puede venir de varias personas seguras", "🌱"] },
  ];
  const rounds = [
    { pairs: 8, title: "CALENTAMIENTO", cols: 4 },
    { pairs: 12, title: "RED EN CONSTRUCCIÓN", cols: 6 },
    { pairs: 18, title: "RETO DEL SALÓN · 36 CARTAS", cols: 6 },
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
    seconds: 480,
    timer: null,
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
    const n = rounds[s.round].pairs,
      items = [];
    pool.slice(0, n).forEach((pair, i) => {
      items.push(
        { id: i, kind: "support", text: pair.support[0], icon: pair.support[1] },
        { id: i, kind: "support", text: pair.support[0], icon: pair.support[1] },
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
    $("clock").textContent =
      String(Math.floor(s.seconds / 60)).padStart(2, "0") +
      ":" +
      String(s.seconds % 60).padStart(2, "0");
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
    s.timer = setInterval(() => {
      if (s.paused || s.preview) return;
      if (s.seconds > 0) s.seconds--;
      else $("clock").style.color = "#ff7c9e";
      hud();
    }, 1000);
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
      " jugadas. El siguiente tablero tendrá más cartas.";
    $("roundEnd").hidden = false;
  }
  function nextRound() {
    s.round++;
    $("roundEnd").hidden = true;
    s.seconds = 480;
    s.paused = false;
    makeDeck();
    $("toast").textContent =
      "Tablero nuevo: observen las cartas durante 2 segundos y cambien de portavoz.";
    showPreview();
    hud();
  }
  function end() {
    clearInterval(s.timer);
    $("ending").hidden = false;
    $("endText").textContent =
      "El salón encontró las 18 parejas en " +
      s.moves +
      " jugadas finales. Mantengan el recuerdo clave: escuchar, creer y buscar apoyo con una persona adulta segura.";
  }
  function pause() {
    if (!s.started) return;
    s.paused = !s.paused;
    $("pause").textContent = s.paused ? "▶ SEGUIR" : "Ⅱ PAUSA";
    $("status").textContent = s.paused ? "PARTIDA EN PAUSA" : "¡PROPONGAN COORDENADAS!";
  }
  function reset() {
    clearInterval(s.timer);
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
      seconds: 480,
      timer: null,
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
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };
  makeDeck();
})();
