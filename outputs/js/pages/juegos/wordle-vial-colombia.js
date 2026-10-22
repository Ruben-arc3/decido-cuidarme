(() => {
  const words = [
    { answer: "PARE", hint: "Señal reglamentaria octagonal: indica que debes detenerte por completo." },
    { answer: "CEDA", hint: "Primera palabra de la señal que pide dar prioridad a quienes ya circulan por la vía." },
    { answer: "PEATON", hint: "Persona que se desplaza caminando por la vía." },
    { answer: "CURVAS", hint: "Señal preventiva que advierte varios cambios de dirección en el camino." },
    { answer: "ESCUELA", hint: "Zona donde puede haber estudiantes entrando o saliendo; conduce con atención." },
    { answer: "CICLISTA", hint: "Persona que se desplaza en bicicleta y comparte la vía con otros actores." },
  ];

  let gameWords = [...words];

  const setupPanel = document.getElementById("setup-panel");
  const gamePanel = document.getElementById("game-panel");
  const teamCount = document.getElementById("team-count");
  const teamNameList = document.getElementById("team-name-list");
  const startButton = document.getElementById("start-game");
  const restartButton = document.getElementById("restart-game");
  const projectionButton = document.getElementById("projection-mode");
  const scoreboard = document.getElementById("scoreboard");
  const roundLabel = document.getElementById("round-label");
  const turnLabel = document.getElementById("turn-label");
  const wordHint = document.getElementById("word-hint");
  const wordGrid = document.getElementById("word-grid");
  const guessForm = document.getElementById("guess-form");
  const guessInput = document.getElementById("guess-input");
  const submitButton = document.getElementById("submit-guess");
  const gameMessage = document.getElementById("game-message");
  const nextRoundButton = document.getElementById("next-round");
  const revealButton = document.getElementById("reveal-letter");
  const hintProgress = document.getElementById("hint-progress");
  const keyboard = document.getElementById("keyboard");
  const roadCar = document.getElementById("road-car");
  const soundToggle = document.getElementById("sound-toggle");

  let teams = [];
  let scores = [];
  let roundIndex = 0;
  let turnIndex = 0;
  let attempts = [];
  let roundFinished = false;
  let revealedLetters = [];
  let soundEnabled = true;
  let audioContext;

  const normalise = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleUpperCase("es-CO")
      .replace(/[^A-Z]/g, "");

  function beep(frequency = 440, duration = 0.07) {
    if (!soundEnabled) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.value = 0.045;
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      oscillator.stop(audioContext.currentTime + duration);
    } catch { /* El juego sigue funcionando si el navegador bloquea audio. */ }
  }

  function setTrafficLight(color) {
    document.querySelectorAll(".sem i").forEach((light) => {
      light.classList.toggle("is-on", light.classList.contains(`light-${color}`));
    });
  }

  function celebrate() {
    const colors = ["#ffc928", "#d62828", "#1f8a4c", "#2f6fed"];
    for (let index = 0; index < 32; index += 1) {
      const piece = document.createElement("i");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.setProperty("--confetti-color", colors[index % colors.length]);
      piece.style.animationDelay = `${Math.random() * 0.45}s`;
      document.body.append(piece);
      window.setTimeout(() => piece.remove(), 2200);
    }
  }

  function renderTeamInputs() {
    const previous = [...teamNameList.querySelectorAll("input")].map((input) => input.value);
    teamNameList.replaceChildren();
    const count = Number(teamCount.value);
    for (let index = 0; index < count; index += 1) {
      const label = document.createElement("label");
      label.className = "team-name-field";
      label.textContent = `Nombre del equipo ${index + 1}`;
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 24;
      input.autocomplete = "off";
      input.value = previous[index] || `Equipo ${index + 1}`;
      input.setAttribute("aria-label", `Nombre del equipo ${index + 1}`);
      label.append(input);
      teamNameList.append(label);
    }
  }

  function renderScoreboard() {
    scoreboard.replaceChildren();
    teams.forEach((team, index) => {
      const card = document.createElement("div");
      card.className = `score-card${index === turnIndex && !roundFinished ? " is-active" : ""}`;
      const name = document.createElement("span");
      name.textContent = team;
      const score = document.createElement("strong");
      score.textContent = String(scores[index] || 0);
      const scoreLabel = document.createElement("small");
      scoreLabel.textContent = "puntos";
      card.append(name, score, scoreLabel);
      scoreboard.append(card);
    });
  }

  function renderGrid(animateLatest = false) {
    const answerLength = gameWords[roundIndex].answer.length;
    wordGrid.replaceChildren();
    wordGrid.style.setProperty("--word-length", answerLength);
    wordGrid.setAttribute("aria-label", `Tablero de ${answerLength} letras, seis intentos`);

    for (let row = 0; row < 6; row += 1) {
      const guess = attempts[row]?.word || "";
      const liveGuess = row === attempts.length ? normalise(guessInput.value) : "";
      const result = attempts[row]?.result || [];
      const cells = document.createElement("div");
      cells.className = "word-row";
      for (let column = 0; column < answerLength; column += 1) {
        const tile = document.createElement("span");
        const revealed = row === attempts.length && revealedLetters.includes(column);
        tile.className = `word-tile${result[column] ? ` is-${result[column]}` : revealed ? " is-revealed" : ""}${animateLatest && row === attempts.length - 1 && result[column] ? " is-scored" : ""}`;
        if (animateLatest && row === attempts.length - 1 && result[column]) {
          tile.style.setProperty("--flip-delay", `${column * 115}ms`);
        }
        tile.textContent = guess[column] || liveGuess[column] || (revealed ? gameWords[roundIndex].answer[column] : "");
        tile.setAttribute("aria-label", guess[column] ? `${guess[column]}: ${result[column]}` : revealed ? `Pista: ${gameWords[roundIndex].answer[column]}` : "Vacía");
        cells.append(tile);
      }
      wordGrid.append(cells);
    }
  }

  function renderTurn() {
    roundLabel.textContent = `Palabra ${roundIndex + 1} de ${gameWords.length}`;
    turnLabel.textContent = roundFinished ? "Ronda completada" : `Turno de ${teams[turnIndex]}`;
    wordHint.textContent = gameWords[roundIndex].hint;
    guessInput.maxLength = gameWords[roundIndex].answer.length;
    guessInput.placeholder = `${gameWords[roundIndex].answer.length} LETRAS`;
    renderGrid();
    hintProgress.textContent = `Pistas: ${revealedLetters.length} ${revealedLetters.length === 1 ? "letra revelada" : "letras reveladas"}`;
    revealButton.disabled = roundFinished || revealedLetters.length >= gameWords[roundIndex].answer.length;
    renderScoreboard();
    renderKeyboard();
  }

  function renderKeyboard() {
    const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
    keyboard.replaceChildren();
    rows.forEach((letters, rowIndex) => {
      const row = document.createElement("div");
      row.className = "keyboard-row";
      if (rowIndex === 2) {
        const enter = document.createElement("button");
        enter.type = "button";
        enter.className = "keyboard-key key-wide";
        enter.dataset.key = "ENTER";
        enter.textContent = "ENTER";
        row.append(enter);
      }
      for (const letter of letters) {
        const key = document.createElement("button");
        key.type = "button";
        key.className = "keyboard-key";
        key.dataset.key = letter;
        key.textContent = letter;
        const state = [...attempts].reverse().flatMap((attempt) => attempt.word.split("").map((value, index) => ({ value, state: attempt.result[index] }))).find((entry) => entry.value === letter);
        if (state) key.classList.add(`is-${state.state}`);
        row.append(key);
      }
      if (rowIndex === 2) {
        const back = document.createElement("button");
        back.type = "button";
        back.className = "keyboard-key key-wide";
        back.dataset.key = "BACK";
        back.textContent = "⌫";
        back.setAttribute("aria-label", "Borrar letra");
        row.append(back);
      }
      keyboard.append(row);
    });
  }

  function scoreGuess(guess, answer) {
    const result = Array(guess.length).fill("absent");
    const remaining = {};
    for (let index = 0; index < answer.length; index += 1) {
      if (guess[index] === answer[index]) {
        result[index] = "correct";
      } else {
        remaining[answer[index]] = (remaining[answer[index]] || 0) + 1;
      }
    }
    for (let index = 0; index < guess.length; index += 1) {
      if (result[index] === "correct") continue;
      if (remaining[guess[index]] > 0) {
        result[index] = "present";
        remaining[guess[index]] -= 1;
      }
    }
    return result;
  }

  function finishRound(message) {
    roundFinished = true;
    revealButton.disabled = true;
    guessInput.disabled = true;
    submitButton.disabled = true;
    nextRoundButton.hidden = false;
    gameMessage.textContent = message;
    turnLabel.textContent = "Ronda completada";
    renderScoreboard();
  }

  function submitGuess(event) {
    event.preventDefault();
    if (roundFinished) return;
    const guess = normalise(guessInput.value);
    const answer = gameWords[roundIndex].answer;
    if (guess.length !== answer.length) {
      gameMessage.textContent = `La palabra debe tener ${answer.length} letras.`;
      guessInput.focus();
      return;
    }

    const guessingTeam = turnIndex;
    const result = scoreGuess(guess, answer);
    attempts.push({ word: guess, result });
    roadCar.style.left = `calc(${8 + (attempts.length / 6) * 80}% - 17px)`;
    if (attempts.length >= 4) setTrafficLight("yellow");
    result.forEach((_, index) => window.setTimeout(() => beep(330 + index * 55, 0.09), index * 95));
    renderGrid(true);
    guessInput.value = "";

    if (guess === answer) {
      const points = 7 - attempts.length;
      scores[guessingTeam] += points;
      roadCar.style.left = "calc(94% - 17px)";
      roadCar.classList.remove("is-crash");
      setTrafficLight("green");
      celebrate();
      beep(700, 0.22);
      turnIndex = (guessingTeam + 1) % teams.length;
      renderScoreboard();
      finishRound(`¡Correcta! ${teams[guessingTeam]} suma ${points} ${points === 1 ? "punto" : "puntos"}.`);
      return;
    }

    if (attempts.length >= 6) {
      setTrafficLight("red");
      roadCar.classList.add("is-crash");
      turnIndex = (guessingTeam + 1) % teams.length;
      finishRound(`Se acabaron los intentos. La respuesta era ${answer}.`);
      return;
    }

    turnIndex = (guessingTeam + 1) % teams.length;
    renderTurn();
    gameMessage.textContent = `No es esa. Sigue el turno de ${teams[turnIndex]}.`;
    guessInput.focus();
  }

  function finishGame() {
    roundLabel.textContent = "Partida terminada · 6 de 6 palabras";
    turnLabel.textContent = "Puntaje final";
    wordHint.textContent = "¡Buen trabajo! Repasen las palabras y lo que significa cada una para cuidarse en la vía.";
    guessForm.hidden = true;
    nextRoundButton.hidden = true;
    const highestScore = Math.max(...scores);
    const winners = teams.filter((_, index) => scores[index] === highestScore);
    const resultText = winners.length > 1 ? `Empate: ${winners.join(" y ")}` : `Gana ${winners[0]}`;
    gameMessage.textContent = `${resultText} con ${highestScore} ${highestScore === 1 ? "punto" : "puntos"}.`;
    restartButton.textContent = "Jugar de nuevo";
    renderScoreboard();
  }

  function advanceRound() {
    roundIndex += 1;
    if (roundIndex >= gameWords.length) {
      finishGame();
      return;
    }
    attempts = [];
    revealedLetters = [];
    roundFinished = false;
    roadCar.style.left = "27px";
    roadCar.classList.remove("is-crash");
    setTrafficLight("green");
    guessInput.disabled = false;
    submitButton.disabled = false;
    nextRoundButton.hidden = true;
    gameMessage.textContent = "Usa el teclado y pulsa ENTER para probar.";
    renderTurn();
    guessInput.focus();
  }

  function shuffleWords() {
    const shuffled = [...words];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function startGame() {
    teams = [...teamNameList.querySelectorAll("input")].map(
      (input, index) => input.value.trim() || `Equipo ${index + 1}`,
    );
    scores = teams.map(() => 0);
    gameWords = shuffleWords();
    roundIndex = 0;
    turnIndex = 0;
    attempts = [];
    revealedLetters = [];
    roundFinished = false;
    roadCar.style.left = "27px";
    roadCar.classList.remove("is-crash");
    setTrafficLight("green");
    guessForm.hidden = false;
    guessInput.disabled = false;
    submitButton.disabled = false;
    restartButton.textContent = "Nueva partida";
    setupPanel.hidden = true;
    gamePanel.hidden = false;
    gameMessage.textContent = "Usa el teclado y pulsa ENTER para probar.";
    renderTurn();
    guessInput.focus();
  }

  teamCount.addEventListener("change", renderTeamInputs);
  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", () => {
    gamePanel.hidden = true;
    setupPanel.hidden = false;
    roadCar.style.left = "27px";
    restartButton.textContent = "Nueva partida";
  });
  guessInput.addEventListener("input", () => {
    const normalisedValue = normalise(guessInput.value);
    if (guessInput.value !== normalisedValue) guessInput.value = normalisedValue;
    renderGrid();
  });
  keyboard.addEventListener("click", (event) => {
    const key = event.target.closest("[data-key]")?.dataset.key;
    if (!key || roundFinished || guessInput.disabled) return;
    if (key === "ENTER") {
      guessForm.requestSubmit();
      return;
    }
    if (key === "BACK") guessInput.value = guessInput.value.slice(0, -1);
    else if (guessInput.value.length < Number(guessInput.maxLength)) guessInput.value += key;
    beep(key === "BACK" ? 250 : 420 + guessInput.value.length * 32, 0.045);
    guessInput.dispatchEvent(new Event("input", { bubbles: true }));
  });
  soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? "🔊" : "🔇";
    soundToggle.setAttribute("aria-pressed", String(soundEnabled));
    beep(600, 0.08);
  });
  guessForm.addEventListener("submit", submitGuess);
  nextRoundButton.addEventListener("click", advanceRound);
  projectionButton.addEventListener("click", async () => {
    const shell = document.querySelector(".wordle-shell");
    try {
      if (!document.fullscreenElement) await shell.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      document.body.classList.toggle("projection-mode");
      const active = document.body.classList.contains("projection-mode");
      projectionButton.setAttribute("aria-label", active ? "Salir de proyección" : "Proyectar pantalla");
    }
  });
  document.addEventListener("fullscreenchange", () => {
    const active = Boolean(document.fullscreenElement);
    document.body.classList.toggle("projection-mode", active);
    projectionButton.textContent = active ? "×" : "⛶";
    projectionButton.setAttribute("aria-label", active ? "Salir de proyección" : "Proyectar pantalla");
  });
  revealButton.addEventListener("click", () => {
    if (roundFinished) return;
    const answerLength = gameWords[roundIndex].answer.length;
    const nextIndex = Array.from({ length: answerLength }, (_, index) => index).find((index) => !revealedLetters.includes(index));
    if (nextIndex === undefined) return;
    revealedLetters.push(nextIndex);
    beep(760, 0.12);
    renderGrid();
    hintProgress.textContent = `Pistas: ${revealedLetters.length} ${revealedLetters.length === 1 ? "letra revelada" : "letras reveladas"}`;
    revealButton.disabled = revealedLetters.length >= answerLength;
  });

  renderTeamInputs();
})();
