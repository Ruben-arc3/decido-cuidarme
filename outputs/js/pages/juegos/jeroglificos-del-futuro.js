(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const rounds = [
    {
      title: "Jeroglífico 1 · Una pista para empezar",
      level: "OBSERVAR Y ASOCIAR",
      icons: ["👣", "👣", "🏁"],
      answer: ["PASO", "A", "PASO", "SE", "LLEGA", "LEJOS"],
      bank: [
        "LEJOS",
        "META",
        "PASO",
        "CADA",
        "ATRÁS",
        "SE",
        "A",
        "AVANZA",
        "LLEGA",
        "DÍA",
        "PASO",
        "CORRER",
      ],
      hint: "Las huellas repetidas y la meta sugieren avanzar poco a poco; busquen una frase conocida sobre perseverar.",
      message: "Los avances pequeños cuentan. Una meta puede comenzar con una acción posible.",
    },
    {
      title: "Jeroglífico 2 · La puerta abierta",
      level: "CONECTAR IDEAS",
      icons: ["🗣️", "🤝", "🚪", "🛤️"],
      answer: ["PEDIR", "APOYO", "ABRE", "CAMINOS"],
      bank: [
        "CAMINOS",
        "CIERRA",
        "PEDIR",
        "PUERTAS",
        "APOYO",
        "SOLO",
        "ABRE",
        "AYUDA",
        "HABLA",
        "JUNTOS",
      ],
      hint: "La voz puede pedir algo; las manos unidas muestran compañía. ¿Qué acción puede abrir nuevas rutas?",
      message: "Buscar orientación y apoyarse en otras personas también es parte del proyecto.",
    },
    {
      title: "Jeroglífico 3 · Construir una ruta",
      level: "RETO FINAL",
      icons: ["🧠", "🛠️", "🧱", "🌅"],
      answer: ["TUS", "HABILIDADES", "CONSTRUYEN", "TU", "FUTURO"],
      bank: [
        "FUTURO",
        "CAMBIAN",
        "TUS",
        "PASADO",
        "HABILIDADES",
        "DIBUJOS",
        "TU",
        "CONSTRUYEN",
        "IDEAS",
        "PUEDEN",
        "CAMINO",
        "ABREN",
        "CADA",
      ],
      hint: "Lo que sabes y practicas funciona como herramienta: permite construir algo que todavía no llega.",
      message:
        "Cada persona tiene fortalezas distintas. Explorar, aprender y pedir apoyo abre posibilidades.",
    },
  ];
  const shuffle = (list) => {
    const items = [...list];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  };
  let s = {
    round: 0,
    selected: [],
    bank: shuffle(rounds[0].bank),
    hints: 1,
    elapsed: 0,
    started: false,
    paused: false,
    locked: false,
    score: 0,
    team: 0,
    timer: null,
  };
  function render() {
    const r = rounds[s.round];
    $("round").textContent = s.round + 1 + " / 3";
    $("team").textContent = "Equipo " + (s.team + 1);
    $("title").textContent = r.title;
    $("level").textContent = r.level;
    $("hints").textContent = s.hints;
    $("hint").textContent = "Pista · " + (s.hints === 1 ? "queda " : "quedan ") + s.hints;
    const root = $("riddle");
    root.replaceChildren();
    r.icons.forEach((icon, i) => {
      if (i) {
        const plus = document.createElement("span");
        plus.className = "plus";
        plus.textContent = "·";
        root.append(plus);
      }
      const tile = document.createElement("div");
      tile.className = "glyph";
      tile.textContent = icon;
      tile.setAttribute("aria-label", "Imagen " + (i + 1));
      root.append(tile);
    });
    renderAnswer();
    renderWords();
  }
  function renderAnswer() {
    const a = $("answer");
    a.replaceChildren();
    if (!s.selected.length) {
      const p = document.createElement("span");
      p.className = "placeholder";
      p.textContent = "El mensaje aparecerá aquí…";
      a.append(p);
      return;
    }
    s.selected.forEach((word, i) => {
      const b = document.createElement("button");
      b.className = "chosen";
      b.textContent = word;
      b.title = "Quitar palabra";
      b.disabled = !s.started || s.paused || s.locked;
      b.onclick = () => {
        s.selected.splice(i, 1);
        renderAnswer();
        renderWords();
      };
      a.append(b);
    });
  }
  function renderWords() {
    const root = $("words");
    root.replaceChildren();
    const used = {};
    s.selected.forEach((w) => (used[w] = (used[w] || 0) + 1));
    s.bank.forEach((word) => {
      const b = document.createElement("button");
      b.className = "word-btn";
      b.textContent = word;
      b.disabled =
        !s.started ||
        s.paused ||
        s.locked ||
        ((used[word] || 0) >= rounds[s.round].answer.filter((x) => x === word).length &&
          rounds[s.round].answer.includes(word)) ||
        s.selected.length >= rounds[s.round].answer.length;
      b.onclick = () => {
        if (!s.started || s.paused || s.locked) return;
        s.selected.push(word);
        s.team = (s.team + 1) % 5;
        $("team").textContent = "Equipo " + (s.team + 1);
        renderAnswer();
        renderWords();
        $("feedback").textContent =
          "Idea agregada. Siguiente turno: " + (s.team + 1) + ". ¿Por qué creen que va ahí?";
      };
      root.append(b);
    });
  }
  function start() {
    $("intro").hidden = true;
    s.bank = shuffle(rounds[s.round].bank);
    s.started = true;
    render();
    if (!s.timer)
      s.timer = setInterval(() => {
        if (s.started && !s.paused) {
          s.elapsed++;
          $("clock").textContent =
            String(Math.floor(s.elapsed / 60)).padStart(2, "0") +
            ":" +
            String(s.elapsed % 60).padStart(2, "0");
        }
      }, 1000);
    $("feedback").textContent = "¡A descifrar! ¿Qué historia cuentan las imágenes?";
  }
  function check() {
    if (!s.started || s.paused || s.locked) return;
    const expected = rounds[s.round].answer;
    if (s.selected.length !== expected.length) {
      $("feedback").textContent =
        "El mensaje necesita " + expected.length + " palabras. Revisen las imágenes y el banco.";
      return;
    }
    if (s.selected.every((w, i) => w === expected[i])) {
      s.score++;
      $("score").textContent = s.score;
      complete();
    } else {
      s.team = (s.team + 1) % 5;
      $("team").textContent = "Equipo " + (s.team + 1);
      $("feedback").textContent =
        "Todavía no encaja. El nuevo equipo propone una corrección y justifica la pista.";
    }
  }
  function complete() {
    s.locked = true;
    s.started = false;
    $("roundIcon").textContent = ["👣", "🤝", "🌅"][s.round];
    $("roundEyebrow").textContent = "JEROGLÍFICO " + (s.round + 1) + " DESCIFRADO";
    $("roundModalTitle").textContent = "¡El salón encontró el mensaje!";
    $("reveal").textContent = rounds[s.round].answer.join(" ");
    $("roundMessage").textContent = rounds[s.round].message;
    $("continue").textContent =
      s.round === 2 ? "VER TODOS LOS MENSAJES" : "SIGUIENTE JEROGLÍFICO →";
    $("roundModal").hidden = false;
  }
  function next() {
    $("roundModal").hidden = true;
    if (s.round === 2) {
      $("results").replaceChildren();
      rounds.forEach((r, i) => {
        const tag = document.createElement("span");
        tag.textContent = i + 1 + ". " + r.answer.join(" ");
        $("results").append(tag);
      });
      $("finalModal").hidden = false;
      return;
    }
    s.round++;
    s.selected = [];
    s.hints = 1;
    s.bank = shuffle(rounds[s.round].bank);
    s.locked = false;
    s.started = true;
    render();
    $("feedback").textContent = "Nuevo reto: observen las imágenes y armen el mensaje en equipo.";
  }
  function hint() {
    if (!s.started || s.paused || s.locked) return;
    if (!s.hints) {
      $("feedback").textContent =
        "Ya usaron la pista de esta ronda. Aún pueden debatir y probar combinaciones.";
      return;
    }
    s.hints--;
    $("hints").textContent = s.hints;
    $("hint").textContent = "Pista · quedan " + s.hints;
    $("feedback").textContent = "Pista: " + rounds[s.round].hint;
  }
  function reset() {
    clearInterval(s.timer);
    s = {
      round: 0,
      selected: [],
      bank: shuffle(rounds[0].bank),
      hints: 1,
      elapsed: 0,
      started: false,
      paused: false,
      locked: false,
      score: 0,
      team: 0,
      timer: null,
    };
    $("clock").textContent = "00:00";
    $("score").textContent = "0";
    $("roundModal").hidden = true;
    $("finalModal").hidden = true;
    $("intro").hidden = false;
    $("pause").textContent = "Ⅱ Pausa";
    $("feedback").textContent = "Interpreten las imágenes. El banco incluye palabras distractoras.";
    render();
  }
  $("start").onclick = start;
  $("check").onclick = check;
  $("hint").onclick = hint;
  $("clear").onclick = () => {
    if (s.started && !s.paused && !s.locked) {
      s.selected = [];
      renderAnswer();
      renderWords();
      $("feedback").textContent = "Respuesta borrada. Pueden proponer otra idea.";
    }
  };
  $("continue").onclick = next;
  $("again").onclick = reset;
  $("restart").onclick = reset;
  $("pause").onclick = () => {
    if (!s.started || s.locked) return;
    s.paused = !s.paused;
    $("pause").textContent = s.paused ? "▶ Continuar" : "Ⅱ Pausa";
    $("feedback").textContent = s.paused ? "Reto en pausa." : "¡Continúen el debate!";
    renderAnswer();
    renderWords();
  };
  $("project").onclick = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
  };
  render();
})();
