(() => {
  "use strict";


  const rounds = [
    {
      title: "SEÑALES Y PROTECCIÓN BÁSICA",
      pairs: [
        { id: "pare", kind: "Señal reglamentaria", title: "PARE", signal: "stop", symbol: "PARE", detail: "Detente por completo y continúa solo cuando sea seguro." },
        { id: "ceda", kind: "Señal reglamentaria", title: "CEDA EL PASO", signal: "yield", symbol: "CEDA", detail: "Reduce la velocidad y da prioridad cuando corresponda." },
        { id: "escolar", kind: "Señal preventiva", title: "ZONA ESCOLAR", signal: "pentagon", symbol: "🚸", detail: "Advierte una zona escolar: reduce la velocidad y extrema el cuidado." },
        { id: "peatones", kind: "Señal preventiva", title: "PEATONES EN LA VÍA", signal: "diamond", symbol: "🚶", detail: "Conduce con atención y cuida a quienes caminan." },
        { id: "casco", kind: "Seguridad en moto", title: "CASCO BIEN AJUSTADO", icon: "🪖", detail: "Quien conduce y su acompañante deben usar casco protector correctamente ajustado." },
        { id: "reflectivo", kind: "Seguridad en moto", title: "HAZTE VISIBLE", icon: "🦺", detail: "Usa prendas reflectivas visibles de 6 p. m. a 6 a. m. y con visibilidad escasa." },
        { id: "luces", kind: "Seguridad en moto", title: "LUCES ENCENDIDAS", icon: "💡", detail: "Enciende las luces en el horario requerido y cuando la visibilidad sea adversa." },
        { id: "atencion", kind: "Seguridad en moto", title: "ATENCIÓN AL CAMINO", icon: "📵", detail: "Guarda el celular y evita distracciones mientras conduces." },
      ],
      columns: 4,
    },
    {
      title: "SEÑALES Y DECISIONES EN LA VÍA",
      pairs: [
        { id: "curva", kind: "Señal preventiva", title: "CURVA PRONUNCIADA", signal: "diamond", symbol: "↪", detail: "Anticipa la curva, reduce la velocidad y mantén el control." },
        { id: "velocidad", kind: "Señal reglamentaria", title: "VELOCIDAD MÁXIMA", signal: "speed", symbol: "30", detail: "Respeta el límite indicado en la señal y las condiciones del trayecto." },
        { id: "obras", kind: "Señal temporal", title: "OBRAS EN LA VÍA", signal: "works", symbol: "⚠", detail: "La señal naranja advierte cambios temporales: sigue las indicaciones y baja la velocidad." },
        { id: "uturn", kind: "Señal reglamentaria", title: "NO GIRAR EN U", signal: "no-turn", symbol: "↩", detail: "La maniobra está prohibida en ese punto; continúa por una ruta permitida." },
        { id: "distancia", kind: "Seguridad en moto", title: "DISTANCIA SEGURA", icon: "↔️", detail: "Deja espacio suficiente para reaccionar y frenar sin acercarte al vehículo de adelante." },
        { id: "revision", kind: "Seguridad en moto", title: "REVISA TU MOTO", icon: "🔧", detail: "Antes de salir, revisa frenos, llantas y luces." },
        { id: "maniobra", kind: "Seguridad en moto", title: "AVISA TU MANIOBRA", icon: "➡️", detail: "Usa las direccionales con anticipación antes de girar o cambiar de carril." },
        { id: "acompanante", kind: "Seguridad en moto", title: "CUIDA A TU ACOMPAÑANTE", icon: "🧑‍🤝‍🧑", detail: "Asegúrate de que la persona acompañante también lleve y ajuste su casco." },
        { id: "lluvia", kind: "Seguridad en moto", title: "CON LLUVIA, MÁS CUIDADO", icon: "🌧️", detail: "Reduce la velocidad y aumenta la distancia: el pavimento mojado puede alargar el frenado." },
        { id: "alcohol", kind: "Seguridad en moto", title: "CONDUCE SIN ALCOHOL", icon: "🚫", detail: "Si vas a conducir, no consumas alcohol ni sustancias que afecten tu atención." },
      ],
      columns: 5,
    },
  ];

  const questions = [
    { title: "¿Qué indica PARE?", options: ["Detenerse por completo", "Acelerar para pasar primero", "Estacionar en cualquier lugar"], answer: 0, feedback: "PARE indica detenerse por completo y continuar solo cuando sea seguro." },
    { title: "¿Cuándo debe ser visible la prenda reflectiva para motociclistas?", options: ["Solo al mediodía", "De 6 p. m. a 6 a. m. y cuando la visibilidad sea escasa", "Solo en carretera destapada"], answer: 1, feedback: "MinTransporte indica que debe ser visible durante ese horario y con visibilidad escasa." },
    { title: "Al acercarte a una zona escolar, ¿qué decisión cuida a todos?", options: ["Reducir la velocidad y estar atento", "Acelerar para salir rápido", "Mirar el celular para revisar la ruta"], answer: 0, feedback: "La señal advierte una zona escolar: reduce la velocidad y presta atención." },
    { title: "¿Quiénes deben usar casco protector en una moto?", options: ["Solo quien conduce", "Quien conduce y su acompañante", "Solo la persona acompañante"], answer: 1, feedback: "La regulación del casco contempla tanto a conductores como a acompañantes." },
    { title: "¿Qué ayuda a mantener una distancia segura?", options: ["Ir muy cerca para que no se metan otros vehículos", "Dejar espacio para reaccionar y frenar", "Mirar solo el vehículo que está adelante"], answer: 1, feedback: "El espacio ayuda a reaccionar ante cambios inesperados y a frenar con seguridad." },
    { title: "¿Qué significa una señal temporal naranja en una zona de obras?", options: ["Que hay cambios temporales y debes seguir las indicaciones", "Que puedes ignorar las señales habituales", "Que la vía siempre está cerrada"], answer: 0, feedback: "Las señales temporales advierten cambios en el uso normal de la vía." },
    { title: "¿Qué es más seguro antes de salir en moto?", options: ["Revisar frenos, llantas y luces", "Revisar solo el color de la moto", "Confiar en que todo está bien"], answer: 0, feedback: "Una revisión básica permite detectar problemas en elementos importantes." },
    { title: "Si llueve mientras conduces, ¿qué conviene hacer?", options: ["Aumentar la velocidad", "Reducir la velocidad y dejar más distancia", "Frenar bruscamente en cada curva"], answer: 1, feedback: "Con lluvia el pavimento puede estar resbaladizo y el frenado tomar más distancia." },
  ];

  const $ = (id) => document.getElementById(id);
  const board = $("memoryBoard");
  const teamCount = $("teamCount");
  const teamNames = $("teamNames");
  const scoreboard = $("scoreboard");
  let state;

  function freshState() {
    return {
      round: 0, deck: [], first: null, second: null, moves: 0, matched: 0,
      teams: [], activeTeam: 0, started: false, paused: false, locked: false,
      preview: null, previewTimer: null, previewEnd: 0, timer: null, seconds: 20,
      extraTime: false, streak: 0, streakTeam: -1, usedQuestions: new Set(),
      questionPool: [], questionOpen: false, questionWasWrong: false,
      gameOver: false, peekCount: 0, pendingAction: null,
    };
  }
  state = freshState();

  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function nameFor(index) {
    return teamNames.querySelector(`[data-team-name="${index}"]`)?.value.trim() || `Equipo ${index + 1}`;
  }

  function renderNameFields() {
    const oldNames = [...teamNames.querySelectorAll("input")].map((input) => input.value);
    teamNames.replaceChildren();
    for (let i = 0; i < Number(teamCount.value); i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 18;
      input.value = oldNames[i] || `Equipo ${i + 1}`;
      input.dataset.teamName = String(i);
      input.setAttribute("aria-label", `Nombre del equipo ${i + 1}`);
      teamNames.append(input);
    }
    if (!state.started) initializeTeams();
  }

  function initializeTeams() {
    state.teams = Array.from({ length: Number(teamCount.value) }, (_, index) => ({
      name: nameFor(index), score: 0, streak: 0, pairs: 0,
    }));
    renderTeams();
  }

  function renderTeams() {
    scoreboard.replaceChildren();
    state.teams.forEach((team, index) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = `team-score${index === state.activeTeam ? " active" : ""}`;
      item.style.setProperty("--team", ["#81e5d4", "#ff9b91", "#ffdc70", "#bba8ff"][index]);
      item.setAttribute("aria-pressed", String(index === state.activeTeam));
      item.title = state.started ? `Asignar el turno a ${team.name}` : team.name;
      const name = document.createElement("strong");
      name.textContent = team.name;
      const score = document.createElement("b");
      score.textContent = String(team.score);
      item.append(name, score);
      item.addEventListener("click", () => {
        if (!state.started || state.paused || state.questionOpen || state.locked || state.first !== null) return;
        state.activeTeam = index;
        state.streak = 0;
        state.streakTeam = index;
        renderTeams();
        renderHud(`${team.name} tiene el turno. Elijan dos coordenadas.`);
        restartTurnTimer();
      });
      scoreboard.append(item);
    });
    $("activeTeam").textContent = state.teams[state.activeTeam]?.name || "Equipo 1";
  }

  function coordinates(index) {
    const columns = state.columns || rounds[state.round].columns;
    return `${String.fromCharCode(65 + Math.floor(index / columns))}${(index % columns) + 1}`;
  }

  function createDeck() {
    const data = rounds[state.round];
    state.columns = window.matchMedia("(max-width: 620px)").matches ? 4 : data.columns;
    const deck = data.pairs.flatMap((pair, pairIndex) => [0, 1].map((copy) => ({
      ...pair,
      pairIndex,
      copy,
      revealed: false,
      matched: false,
    })));
    state.deck = shuffle(deck);
    state.deck.forEach((card, index) => { card.coordinate = coordinates(index); });
    state.first = null;
    state.second = null;
    state.moves = 0;
    state.matched = 0;
    state.peekCount = 0;
    state.usedQuestions = new Set();
    renderBoard();
    renderHud();
  }

  function renderBoard() {
    board.replaceChildren();
    const columns = state.columns || rounds[state.round].columns;
    board.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    board.setAttribute("aria-label", `Ronda ${state.round + 1}, tablero con ${state.deck.length} cartas`);
    state.deck.forEach((card, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `memory-card${card.revealed || state.preview ? " revealed" : ""}${card.matched ? " matched" : ""}`;
      button.dataset.coordinate = card.coordinate;
      button.disabled = !state.started || state.paused || state.preview || state.locked || card.revealed || card.matched;
      button.setAttribute("aria-label", card.revealed || card.matched || state.preview
        ? `${card.coordinate}, ${card.title}, ${card.detail}`
        : `Carta ${card.coordinate}, oculta`);

      const back = document.createElement("span");
      back.className = "card-back";
      const coord = document.createElement("b");
      coord.textContent = card.coordinate;
      const label = document.createElement("small");
      label.textContent = "✦ VOLTEAR ✦";
      back.append(coord, label);

      const front = document.createElement("span");
      front.className = "card-front";
      const type = document.createElement("small");
      type.className = "card-type";
      type.textContent = card.kind;
      const title = document.createElement("strong");
      title.className = "card-title";
      title.textContent = card.title;
      const detail = document.createElement("span");
      detail.className = "card-detail";
      detail.textContent = card.detail;
      if (card.signal) {
        const sign = document.createElement("span");
        sign.className = `signal-shape ${card.signal}`;
        sign.textContent = card.symbol;
        front.append(type, sign, title, detail);
      } else {
        const icon = document.createElement("span");
        icon.className = "card-icon";
        icon.textContent = card.icon;
        front.append(type, icon, title, detail);
      }
      button.append(back, front);
      button.addEventListener("click", () => flip(index));
      board.append(button);
    });
  }

  function renderHud(message) {
    const round = rounds[state.round];
    $("roundLabel").textContent = `RONDA ${state.round + 1} / ${rounds.length}`;
    $("roundTitle").textContent = round.title;
    $("pairsFound").textContent = `${state.matched} / ${round.pairs.length}`;
    $("movesCount").textContent = String(state.moves);
    $("timerDisplay").textContent = `00:${String(state.seconds).padStart(2, "0")}`;
    $("startButton").disabled = state.started || state.gameOver;
    $("pauseButton").disabled = !state.started || state.gameOver || state.questionOpen || state.locked;
    $("peekButton").disabled = !state.started || state.paused || state.locked || state.first !== null || state.preview || state.peekCount >= 2;
    $("peekButton").textContent = `👁 VER CARTAS (${Math.max(0, 2 - state.peekCount)})`;
    $("holdButton").disabled = !state.started || state.paused || state.locked || state.first !== null || state.questionOpen;
    $("activeTeam").textContent = state.teams[state.activeTeam]?.name || "Equipo 1";
    if (message) $("statusLine").textContent = message;
    renderTeams();
  }

  function startGame() {
    if (state.started) return;
    state.started = true;
    state.paused = false;
    state.teams = Array.from({ length: Number(teamCount.value) }, (_, index) => ({
      name: nameFor(index), score: 0, streak: 0, pairs: 0,
    }));
    state.activeTeam = 0;
    $("setupBar").inert = true;
    $("introDialog").hidden = true;
    $("pauseButton").disabled = false;
    createDeck();
    renderHud("¡A jugar! Memoriza las posiciones durante 3 segundos.");
    showAll(3000, true);
  }

  function showAll(milliseconds = 3000, opening = false) {
    if (!state.started || state.paused || state.locked || state.first !== null || state.questionOpen) return;
    clearTimeout(state.previewTimer);
    stopTimer();
    state.preview = "timed";
    state.previewEnd = Date.now() + milliseconds;
    renderBoard();
    renderHud(opening ? "¡Memoria activa! El tablero se ocultará en 3 segundos." : "Observa las cartas; volverán a ocultarse en 3 segundos.");
    state.previewTimer = window.setTimeout(endPreview, milliseconds);
  }

  function startHoldPreview() {
    if (!state.started || state.paused || state.locked || state.first !== null || state.questionOpen || state.preview) return;
    stopTimer();
    state.preview = "hold";
    renderBoard();
    renderHud("Mantén presionado para ver las cartas; al soltar, se ocultan.");
  }

  function endHoldPreview() {
    if (state.preview !== "hold") return;
    state.preview = null;
    renderBoard();
    renderHud("Cartas ocultas. Continúen la búsqueda.");
    startTurnTimer();
  }

  function endPreview() {
    clearTimeout(state.previewTimer);
    state.previewTimer = null;
    state.preview = null;
    state.deck.forEach((card) => { if (!card.matched) card.revealed = false; });
    renderBoard();
    renderHud("¡Encuentren las parejas! El equipo actual elige dos coordenadas.");
    startTurnTimer();
  }

  function flip(index) {
    if (!state.started || state.paused || state.preview || state.locked || state.questionOpen || state.gameOver) return;
    const card = state.deck[index];
    if (!card || card.revealed || card.matched) return;
    card.revealed = true;
    if (state.first === null) {
      state.first = index;
      renderBoard();
      renderHud(`${state.teams[state.activeTeam].name}: primera carta ${card.coordinate}. Elijan otra.`);
      return;
    }

    state.second = index;
    state.moves++;
    state.locked = true;
    stopTimer();
    renderBoard();
    renderHud();
    const first = state.deck[state.first];
    const second = state.deck[state.second];
    if (first.pairIndex === second.pairIndex) {
      first.matched = true;
      second.matched = true;
      state.matched++;
      const team = state.teams[state.activeTeam];
      team.score += 100;
      team.pairs++;
      if (state.streakTeam === state.activeTeam) state.streak++;
      else { state.streakTeam = state.activeTeam; state.streak = 1; }
      if (state.streak >= 2) team.score += 50;
      state.first = null;
      state.second = null;
      state.locked = false;
      renderBoard();
      const combo = state.streak >= 2 ? " ¡COMBO +50!" : "";
      renderHud(`¡Pareja idéntica! ${first.title}: ${first.detail} +100 puntos.${combo}`);
      if (state.matched === rounds[state.round].pairs.length) {
        state.locked = true;
        renderBoard();
        renderHud("Ronda completada. Preparando el siguiente tablero…");
        scheduleAction(finishRound, 700);
        return;
      }
      if (state.matched % 3 === 0 && !state.usedQuestions.has(state.matched)) {
        state.usedQuestions.add(state.matched);
        state.locked = true;
        renderBoard();
        renderHud("¡Pregunta sorpresa! El equipo debe ponerse de acuerdo.");
        scheduleAction(showQuestion, 450);
      } else startTurnTimer();
      return;
    }

    state.teams[state.activeTeam].streak = 0;
    state.streak = 0;
    renderHud("No coinciden. Recuerden su posición; ahora sigue otro equipo.");
    scheduleAction(() => {
      first.revealed = false;
      second.revealed = false;
      state.first = null;
      state.second = null;
      state.locked = false;
      nextTeam();
      renderBoard();
      renderHud(`${state.teams[state.activeTeam].name}: es su turno.`);
      startTurnTimer();
    }, 1100);
  }

  function scheduleAction(action, delay) {
    window.clearTimeout(state.pendingAction);
    state.pendingAction = window.setTimeout(() => {
      state.pendingAction = null;
      action();
    }, delay);
  }

  function nextTeam() {
    state.activeTeam = (state.activeTeam + 1) % state.teams.length;
    state.streak = 0;
    state.streakTeam = state.activeTeam;
  }

  function startTurnTimer() {
    stopTimer();
    if (!state.started || state.paused || state.preview || state.questionOpen || state.locked || state.gameOver) return;
    state.seconds = 20;
    state.extraTime = false;
    renderHud();
    state.timer = window.setInterval(() => {
      if (state.paused || state.preview || state.questionOpen || state.locked) return;
      state.seconds--;
      $("timerDisplay").textContent = `00:${String(Math.max(0, state.seconds)).padStart(2, "0")}`;
      if (state.seconds > 0) return;
      if (!state.extraTime) {
        state.extraTime = true;
        state.seconds = 10;
        renderHud("Tienen 10 segundos adicionales para decidir la segunda coordenada.");
        return;
      }
      stopTimer();
      const revealed = [state.first, state.second].filter((item) => item !== null);
      revealed.forEach((item) => { state.deck[item].revealed = false; });
      state.first = null;
      state.second = null;
      state.locked = false;
      nextTeam();
      renderBoard();
      renderHud(`Se acabó el tiempo de acuerdo. Turno de ${state.teams[state.activeTeam].name}.`);
      startTurnTimer();
    }, 1000);
  }

  function stopTimer() {
    if (state.timer) window.clearInterval(state.timer);
    state.timer = null;
  }

  function showQuestion() {
    if (state.gameOver || state.paused) return;
    stopTimer();
    state.locked = false;
    state.questionOpen = true;
    state.questionWasWrong = false;
    if (!state.questionPool.length) state.questionPool = shuffle(questions.map((_, index) => index));
    const question = questions[state.questionPool.pop()];
    $("questionTeam").textContent = state.teams[state.activeTeam].name;
    $("questionTitle").textContent = question.title;
    $("quizFeedback").textContent = "";
    $("continueButton").hidden = true;
    const answers = shuffle(question.options.map((text, index) => ({ text, correct: index === question.answer })));
    const answerButtons = answers.map((answer, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.textContent = `${String.fromCharCode(65 + index)}. ${answer.text}`;
      button.addEventListener("click", () => {
        [...$("quizOptions").children].forEach((item) => { item.disabled = true; });
        if (answer.correct) {
          button.classList.add("correct");
          state.teams[state.activeTeam].score += 100;
          $("quizFeedback").textContent = `¡Respuesta correcta! +100 puntos. ${question.feedback}`;
        } else {
          button.classList.add("incorrect");
          state.questionWasWrong = true;
          const correctIndex = answers.findIndex((item) => item.correct);
          $("quizOptions").children[correctIndex].classList.add("correct");
          $("quizFeedback").textContent = `Repasemos: ${question.feedback}`;
        }
        renderTeams();
        $("continueButton").hidden = false;
        $("continueButton").focus();
      });
      return button;
    });
    $("quizOptions").replaceChildren(...answerButtons);
    $("questionDialog").hidden = false;
    answerButtons[0]?.focus();
  }

  function finishRound() {
    stopTimer();
    state.started = false;
    state.locked = false;
    $("pauseButton").disabled = true;
    const leader = [...state.teams].sort((a, b) => b.score - a.score)[0];
    if (state.round === 0) {
      $("roundDialogTitle").textContent = "¡RONDA 1 COMPLETADA!";
      $("roundDialogText").textContent = `Encontraron las ${rounds[0].pairs.length} parejas. ${leader.name} lidera con ${leader.score} puntos. La siguiente ronda agrega nuevas señales y decisiones viales.`;
      $("roundDialog").hidden = false;
      $("nextRoundButton").focus();
    } else finishGame();
  }

  function nextRound() {
    state.round = 1;
    state.started = true;
    state.paused = false;
    state.activeTeam = (state.activeTeam + 1) % state.teams.length;
    state.streak = 0;
    state.streakTeam = state.activeTeam;
    $("roundDialog").hidden = true;
    $("pauseButton").disabled = false;
    createDeck();
    renderHud("Ronda 2: memoriza las nuevas parejas durante 3 segundos.");
    showAll(3000, true);
  }

  function finishGame() {
    state.gameOver = true;
    state.started = false;
    const ranked = [...state.teams].sort((a, b) => b.score - a.score);
    const tied = ranked.length > 1 && ranked[0].score === ranked[1].score;
    $("endSummary").textContent = tied
      ? `¡Empate! Los equipos líderes lograron ${ranked[0].score} puntos. Completen el juego comentando qué señal o consejo recordarán en su próximo trayecto.`
      : `${ranked[0].name} gana con ${ranked[0].score} puntos. ¿Qué señal o consejo recordarán en su próximo trayecto?`;
    const color = ["#81e5d4", "#ff9b91", "#ffdc70", "#bba8ff"];
    $("finalScores").replaceChildren(...ranked.map((team, index) => {
      const row = document.createElement("div");
      row.className = "final-score";
      row.style.setProperty("--team", color[state.teams.indexOf(team)]);
      const label = document.createElement("strong");
      label.textContent = `${index + 1}. ${team.name}`;
      const points = document.createElement("span");
      points.textContent = `${team.score} puntos`;
      row.append(label, points);
      return row;
    }));
    $("endDialog").hidden = false;
    $("playAgainButton").focus();
  }

  function pauseGame() {
    if (!state.started || state.questionOpen || state.locked || state.gameOver) return;
    if (state.preview === "hold") endHoldPreview();
    if (state.preview === "timed") {
      state.previewRemaining = Math.max(500, state.previewEnd - Date.now());
      window.clearTimeout(state.previewTimer);
      state.previewTimer = null;
    }
    state.paused = true;
    stopTimer();
    document.body.classList.add("is-paused");
    $("pauseDialog").hidden = false;
    $("resumeButton").focus();
    renderHud("Partida en pausa.");
  }

  function resumeGame() {
    state.paused = false;
    document.body.classList.remove("is-paused");
    $("pauseDialog").hidden = true;
    if (state.preview === "timed") {
      state.previewEnd = Date.now() + (state.previewRemaining || 3000);
      state.previewTimer = window.setTimeout(endPreview, state.previewRemaining || 3000);
      renderBoard();
      renderHud("Memoriza las cartas; el tablero se ocultará al terminar la vista previa.");
    } else startTurnTimer();
    $("pauseButton").focus();
  }

  function resetGame() {
    stopTimer();
    window.clearTimeout(state.previewTimer);
    window.clearTimeout(state.pendingAction);
    state = freshState();
    $("setupBar").inert = false;
    document.body.classList.remove("is-paused", "projector-mode");
    ["introDialog", "questionDialog", "roundDialog", "pauseDialog", "endDialog"].forEach((id) => { $(id).hidden = true; });
    $("introDialog").hidden = false;
    initializeTeams();
    createDeck();
    renderHud("Pulsa Empezar. Observen las cartas durante 3 segundos.");
    $("startButton").disabled = false;
    $("pauseButton").disabled = true;
    $("goButton").focus();
  }

  function toggleProjector() {
    const active = !document.body.classList.contains("projector-mode");
    document.body.classList.toggle("projector-mode", active);
    $("projectButton").textContent = active ? "⛶ SALIR DE PROYECCIÓN" : "⛶ PROYECTAR";
    if (active && !document.fullscreenElement) document.documentElement.requestFullscreen?.().catch?.(() => {});
    if (!active && document.fullscreenElement) document.exitFullscreen?.().catch?.(() => {});
  }

  function handleCoordinateKey(event) {
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    const active = document.activeElement;
    if (active && ["INPUT", "SELECT", "TEXTAREA", "BUTTON"].includes(active.tagName)) return;
    if (/^[a-e]$/i.test(event.key)) {
      state.coordinateBuffer = event.key.toUpperCase();
      return;
    }
    if (/^[1-5]$/.test(event.key) && state.coordinateBuffer) {
      const wanted = state.coordinateBuffer + event.key;
      const index = state.deck.findIndex((card) => card.coordinate === wanted);
      if (index >= 0) flip(index);
      state.coordinateBuffer = "";
      return;
    }
    if (event.key.toLowerCase() === "p") { pauseGame(); return; }
    if (event.key.toLowerCase() === "h") {
      if (state.started && state.first === null && state.peekCount < 2) { state.peekCount++; showAll(3000); renderHud("Vista rápida: las cartas se ocultarán en 3 segundos."); }
      return;
    }
    if (event.code === "Space" && !state.paused) { event.preventDefault(); startHoldPreview(); }
  }

  teamCount.addEventListener("change", renderNameFields);
  teamNames.addEventListener("input", () => { if (!state.started) initializeTeams(); });
  $("newGame").addEventListener("click", resetGame);
  $("resetButton").addEventListener("click", resetGame);
  $("startButton").addEventListener("click", startGame);
  $("goButton").addEventListener("click", startGame);
  $("pauseButton").addEventListener("click", pauseGame);
  $("resumeButton").addEventListener("click", resumeGame);
  $("peekButton").addEventListener("click", () => {
    if (state.peekCount >= 2) return;
    state.peekCount++;
    showAll(3000);
  });
  const holdButton = $("holdButton");
  holdButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    holdButton.setPointerCapture?.(event.pointerId);
    startHoldPreview();
  });
  ["pointerup", "pointercancel", "lostpointercapture", "blur"].forEach((name) => holdButton.addEventListener(name, endHoldPreview));
  holdButton.addEventListener("keydown", (event) => {
    if ((event.code === "Space" || event.code === "Enter") && !event.repeat) { event.preventDefault(); startHoldPreview(); }
  });
  holdButton.addEventListener("keyup", endHoldPreview);
  $("projectButton").addEventListener("click", toggleProjector);
  $("continueButton").addEventListener("click", () => {
    $("questionDialog").hidden = true;
    state.questionOpen = false;
    if (state.questionWasWrong) nextTeam();
    state.questionWasWrong = false;
    renderBoard();
    renderHud(`${state.teams[state.activeTeam].name}: continúen buscando parejas.`);
    startTurnTimer();
  });
  $("nextRoundButton").addEventListener("click", nextRound);
  $("playAgainButton").addEventListener("click", resetGame);
  document.addEventListener("keydown", handleCoordinateKey);
  document.addEventListener("keyup", (event) => { if (event.code === "Space") endHoldPreview(); });
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      document.body.classList.remove("projector-mode");
      $("projectButton").textContent = "⛶ PROYECTAR";
    }
  });
  window.addEventListener("resize", () => {
    if (!state.deck.length || state.first !== null || state.preview) return;
    const columns = window.matchMedia("(max-width: 620px)").matches ? 4 : rounds[state.round].columns;
    if (columns === state.columns) return;
    state.columns = columns;
    state.deck.forEach((card, index) => { card.coordinate = coordinates(index); });
    renderBoard();
  });

  renderNameFields();
  resetGame();
})();
