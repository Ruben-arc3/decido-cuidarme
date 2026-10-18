(() => {
  const pairs = [
    { id: "pare", type: "Señal reglamentaria", title: "PARE", shape: "stop", symbol: "PARE", match: "Detente por completo y continúa solo cuando sea seguro." },
    { id: "ceda", type: "Señal reglamentaria", title: "CEDA EL PASO", shape: "yield", symbol: "CEDA", match: "Reduce la velocidad y da prioridad cuando corresponda." },
    { id: "escolar", type: "Señal preventiva", title: "Zona escolar", shape: "school", symbol: "🚸", match: "Advierte proximidad de zona escolar: reduce la velocidad y extrema cuidado." },
    { id: "curva", type: "Señal preventiva", title: "Curva pronunciada", shape: "diamond", symbol: "↪", match: "Advierte un cambio fuerte de dirección más adelante." },
    { id: "casco", type: "Regla para motociclistas", title: "Casco bien puesto", icon: "🪖", match: "Conductor y acompañante deben usar casco protector correctamente ajustado." },
    { id: "reflectivo", type: "Regla para motociclistas", title: "Hazte visible", icon: "🦺", match: "Usa prenda reflectiva visible entre 6 p. m. y 6 a. m. y cuando la visibilidad sea escasa." },
    { id: "luces", type: "Regla para motociclistas", title: "Luces encendidas", icon: "💡", match: "Mantén las luces exteriores según el horario y las condiciones de visibilidad." },
    { id: "atencion", type: "Regla de cuidado", title: "Atención al camino", icon: "📵", match: "Guarda el celular y evita distracciones mientras conduces." },
  ];
  const quiz = [
    { q: "¿Qué debes hacer ante una señal PARE?", options: ["Bajar un poco la velocidad", "Detenerte por completo y avanzar cuando sea seguro", "Tocar la bocina y seguir"], answer: 1, explain: "PARE indica que debes detenerte por completo." },
    { q: "¿Cuándo debe ser visible la prenda reflectiva para motociclistas?", options: ["Solo al mediodía", "Entre 6 p. m. y 6 a. m. y con visibilidad escasa", "Solo en carretera destapada"], answer: 1, explain: "MinTransporte indica su visibilidad en ese horario y cuando la visibilidad sea escasa." },
    { q: "¿Qué significa una señal preventiva amarilla?", options: ["Advierte una condición o riesgo próximo", "Indica siempre un sitio turístico", "Permite estacionar"], answer: 0, explain: "Las señales preventivas advierten sobre peligros o condiciones de la vía." },
    { q: "¿Quién debe llevar casco protector en una motocicleta?", options: ["Solo quien conduce", "Conductor y acompañante", "Solo el acompañante"], answer: 1, explain: "La regulación de uso del casco incluye a conductores y acompañantes." },
    { q: "Al acercarte a una zona escolar, ¿qué decisión ayuda a cuidar a todos?", options: ["Acelerar para pasar rápido", "Reducir la velocidad y estar atento", "Mirar el celular para revisar la ruta"], answer: 1, explain: "La señal advierte una zona donde pueden cruzar estudiantes: reduce la velocidad y presta atención." },
    { q: "¿Qué opción es más segura al conducir una moto?", options: ["Revisar mensajes en el semáforo y avanzar leyendo", "Guardar el celular y concentrarte en la vía", "Conducir con una sola mano para sostener el teléfono"], answer: 1, explain: "Evitar distracciones ayuda a mantener la atención en la vía." },
    { q: "¿Qué indica CEDA EL PASO?", options: ["Debes dar prioridad y avanzar solo si es seguro", "Tienes prioridad siempre", "La vía está cerrada"], answer: 0, explain: "Reduce la velocidad y cede la prioridad cuando corresponda." },
    { q: "¿Qué hacer si la visibilidad es escasa?", options: ["Apagar las luces", "Aumentar la atención y usar las luces requeridas", "Seguir a otro vehículo muy de cerca"], answer: 1, explain: "Las luces y una conducción atenta ayudan a mejorar la visibilidad y la seguridad." },
  ];

  const $ = (id) => document.getElementById(id);
  const teamCount = $("teamCount");
  const teamNames = $("teamNames");
  const scoreboard = $("scoreboard");
  const board = $("memoryBoard");
  let teams = [];
  let activeTeam = 0;
  let selected = [];
  let found = 0;
  let turns = 0;
  let paused = false;
  let locked = false;
  let questionIndex = 0;
  let gameOver = false;

  function nameFor(i) {
    return teamNames.querySelector(`[data-team-name="${i}"]`)?.value.trim() || `Equipo ${i + 1}`;
  }

  function renderNameFields() {
    const count = Number(teamCount.value);
    const previous = [...teamNames.querySelectorAll("input")].map((input) => input.value);
    teamNames.replaceChildren();
    for (let i = 0; i < count; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 20;
      input.value = previous[i] || `Equipo ${i + 1}`;
      input.setAttribute("aria-label", `Nombre del equipo ${i + 1}`);
      input.dataset.teamName = String(i);
      input.addEventListener("input", renderScores);
      teamNames.append(input);
    }
    renderScores();
  }

  function renderScores() {
    const count = Number(teamCount.value);
    if (!teams.length || teams.length !== count) teams = Array.from({ length: count }, (_, i) => ({ name: nameFor(i), score: 0 }));
    else teams.forEach((team, i) => { team.name = nameFor(i); });
    scoreboard.replaceChildren();
    teams.forEach((team, i) => {
      const item = document.createElement("div");
      item.className = `team-score${i === activeTeam ? " active" : ""}`;
      const label = document.createElement("strong");
      label.textContent = team.name;
      const score = document.createElement("b");
      score.textContent = String(team.score);
      score.setAttribute("aria-label", `${team.score} puntos`);
      item.append(label, score);
      scoreboard.append(item);
    });
    $("turnLabel").textContent = teams[activeTeam]?.name || "Equipo 1";
  }

  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function createCard(pair, side) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "memory-card";
    card.dataset.pair = pair.id;
    card.dataset.side = side;
    card.setAttribute("aria-label", "Carta oculta");
    const back = document.createElement("span");
    back.className = "card-back";
    back.setAttribute("aria-hidden", "true");
    back.innerHTML = "✦<small>VIAL</small>";
    const front = document.createElement("span");
    front.className = "card-front";
    const type = document.createElement("small");
    type.className = "card-type";
    type.textContent = pair.type;
    const face = document.createElement("span");
    if (side === "sign" && pair.shape) {
      face.className = `sign-shape ${pair.shape}`;
      if (pair.shape === "yield") {
        const inner = document.createElement("span");
        inner.textContent = pair.symbol;
        face.append(inner);
      } else face.textContent = pair.symbol;
    } else if (side === "rule" && pair.icon) {
      face.className = "rule-icon";
      face.textContent = pair.icon;
    } else {
      face.className = "card-copy";
      face.textContent = side === "sign" ? pair.title : pair.match;
    }
    if (side === "rule") {
      const title = document.createElement("span");
      title.className = "card-copy";
      title.textContent = pair.title;
      front.append(type, face, title);
    } else front.append(type, face);
    card.append(back, front);
    card.addEventListener("click", () => reveal(card));
    return card;
  }

  function newGame() {
    teams = Array.from({ length: Number(teamCount.value) }, (_, i) => ({ name: nameFor(i), score: 0 }));
    activeTeam = 0;
    selected = [];
    found = 0;
    turns = 0;
    questionIndex = Math.floor(Math.random() * quiz.length);
    paused = false;
    locked = false;
    gameOver = false;
    document.body.classList.remove("is-paused");
    $("pauseButton").textContent = "Ⅱ Pausar";
    $("pauseButton").setAttribute("aria-pressed", "false");
    $("pauseOverlay").hidden = true;
    $("questionDialog").hidden = true;
    $("endDialog").hidden = true;
    $("pairsFound").textContent = `0 / ${pairs.length}`;
    $("turnCount").textContent = "0";
    $("statusLine").textContent = "Seleccionen dos cartas y busquen la relación.";
    const cards = pairs.flatMap((pair) => [createCard(pair, pair.shape ? "sign" : "rule"), createCard(pair, pair.shape ? "meaning" : "rule-definition")]);
    board.replaceChildren(...shuffle(cards));
    renderScores();
  }

  function reveal(card) {
    if (paused || locked || gameOver || card.classList.contains("revealed") || card.classList.contains("matched")) return;
    card.classList.add("revealed");
    card.setAttribute("aria-label", `${card.dataset.pair}, ${card.dataset.side}`);
    selected.push(card);
    if (selected.length < 2) return;
    locked = true;
    const [first, second] = selected;
    if (first.dataset.pair === second.dataset.pair) {
      first.classList.add("matched");
      second.classList.add("matched");
      first.disabled = true;
      second.disabled = true;
      teams[activeTeam].score++;
      found++;
      $("pairsFound").textContent = `${found} / ${pairs.length}`;
      $("statusLine").textContent = `¡Pareja encontrada! ${teams[activeTeam].name} suma un punto.`;
      selected = [];
      finishTurn();
    } else {
      $("statusLine").textContent = "No coinciden; observen y recuerden su ubicación.";
      window.setTimeout(() => {
        first.classList.remove("revealed");
        second.classList.remove("revealed");
        first.setAttribute("aria-label", "Carta oculta");
        second.setAttribute("aria-label", "Carta oculta");
        selected = [];
        finishTurn();
      }, 1000);
    }
  }

  function finishTurn() {
    turns++;
    $("turnCount").textContent = String(turns);
    renderScores();
    locked = false;
    if (turns % 3 === 0 && found < pairs.length) showQuestion();
    else advanceOrEnd();
  }

  function showQuestion() {
    const item = quiz[questionIndex % quiz.length];
    questionIndex++;
    $("questionTeam").textContent = teams[activeTeam].name;
    $("questionTitle").textContent = item.q;
    $("quizFeedback").textContent = "";
    $("continueButton").hidden = true;
    const choices = item.options.map((text, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.textContent = text;
      button.addEventListener("click", () => {
        [...$("quizOptions").children].forEach((choice) => { choice.disabled = true; });
        if (index === item.answer) {
          button.classList.add("correct");
          teams[activeTeam].score++;
          $("quizFeedback").textContent = `¡Correcto! Punto extra. ${item.explain}`;
        } else {
          button.classList.add("incorrect");
          $("quizOptions").children[item.answer].classList.add("correct");
          $("quizFeedback").textContent = `La respuesta correcta era: ${item.explain}`;
        }
        renderScores();
        $("continueButton").hidden = false;
        $("continueButton").focus();
      });
      return button;
    });
    $("quizOptions").replaceChildren(...choices);
    $("questionDialog").hidden = false;
    choices[0]?.focus();
  }

  function advanceOrEnd() {
    if (found === pairs.length) {
      gameOver = true;
      const ranked = [...teams].sort((a, b) => b.score - a.score);
      const winner = ranked[0];
      const tied = ranked.filter((team) => team.score === winner.score).length > 1;
      $("endSummary").textContent = tied
        ? `Empate con ${winner.score} puntos. ¡Buen trabajo reconociendo señales y decisiones de cuidado!`
        : `${winner.name} gana con ${winner.score} puntos. ¡Buen trabajo reconociendo señales y decisiones de cuidado!`;
      $("endDialog").hidden = false;
      $("playAgain").focus();
      return;
    }
    activeTeam = (activeTeam + 1) % teams.length;
    renderScores();
    $("statusLine").textContent = `Turno de ${teams[activeTeam].name}. Cada tres turnos habrá una pregunta sorpresa.`;
  }

  function setPaused(next) {
    if (locked && next) return;
    paused = next;
    document.body.classList.toggle("is-paused", paused);
    [$("setupBar"), scoreboard, document.querySelector(".game-layout")].forEach((element) => {
      if (element) element.inert = paused;
    });
    $("pauseButton").textContent = paused ? "▶ Continuar" : "Ⅱ Pausar";
    $("pauseButton").setAttribute("aria-pressed", String(paused));
    $("pauseOverlay").hidden = !paused;
    if (paused) $("resumeButton").focus();
    else $("pauseButton").focus();
  }

  teamCount.addEventListener("change", renderNameFields);
  $("newGame").addEventListener("click", newGame);
  $("pauseButton").addEventListener("click", () => setPaused(!paused));
  $("resumeButton").addEventListener("click", () => setPaused(false));
  $("continueButton").addEventListener("click", () => {
    $("questionDialog").hidden = true;
    advanceOrEnd();
  });
  $("playAgain").addEventListener("click", newGame);
  $("projectButton").addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      $("statusLine").textContent = "No se pudo activar pantalla completa en este navegador.";
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !$("questionDialog").hidden) event.preventDefault();
    if (event.key.toLowerCase() === "p" && $("questionDialog").hidden && $("endDialog").hidden) setPaused(!paused);
  });
  renderNameFields();
  newGame();
})();
