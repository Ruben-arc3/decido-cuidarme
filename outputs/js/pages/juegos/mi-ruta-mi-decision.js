import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  onValue,
  query,
  orderByChild,
  limitToLast,
  set,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

/* =========================================================
   FIREBASE
========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyAZ3bUuIFUo8k-tLhQJxN59Quvhr0zDBiw",

  authDomain: "camp-9675e.firebaseapp.com",

  databaseURL: "https://camp-9675e-default-rtdb.firebaseio.com",

  projectId: "camp-9675e",

  storageBucket: "camp-9675e.firebasestorage.app",

  messagingSenderId: "1076768786050",

  appId: "1:1076768786050:web:115de8d38d95401338169b",
};

const firebaseApp = initializeApp(firebaseConfig);

const database = getDatabase(firebaseApp);

const scoresRef = ref(database, "mi-ruta-mi-decision/ranking");

const gameStateRef = ref(database, "mi-ruta-mi-decision/gameState");

/* =========================================================
   ELEMENTOS
========================================================= */

const canvas = document.querySelector("#game");

const ctx = canvas.getContext("2d");

const overlay = document.querySelector("#overlay");

const start = document.querySelector("#start");

const leftButton = document.querySelector("#move-left");

const rightButton = document.querySelector("#move-right");

const resetButton = document.querySelector("#reset-ranking");

const scoreEl = document.querySelector("#score");

const livesEl = document.querySelector("#lives");

const timerEl = document.querySelector("#timer");

const rankingEl = document.querySelector("#ranking-list");

const connectionEl = document.querySelector("#connection");

/* =========================================================
   VARIABLES DEL JUEGO
========================================================= */

const playedPrefix = "miRutaJugoEnConcurso:";

let running = false;

let score = 0;

let lives = 3;

let time = 0;

let last = 0;

let combo = 0;

let contestId = "concurso-inicial";

let items = [];

let particles = [];

/*
  El jugador permanece en la parte inferior
  y se mueve horizontalmente.
*/

let player = {
  x: 480,

  y: 444,

  w: 58,

  h: 66,

  target: 480,

  bob: 0,
};

/* =========================================================
   OBJETOS DEL JUEGO
========================================================= */

const supports = [
  ["🤝", "Amistad"],

  ["🏠", "Hogar"],

  ["🏫", "Escuela"],

  ["💬", "Hablar"],

  ["⚽", "Deporte"],

  ["🎨", "Talento"],
];

const pressures = [
  ["🚫", "Presión"],

  ["🍺", "Alcohol"],

  ["🚬", "Vape"],

  ["💊", "Sustancia"],
];

/* =========================================================
   RANKING
========================================================= */

function renderRanking(entries = []) {
  rankingEl.replaceChildren();

  if (!entries.length) {
    const item = document.createElement("li");

    item.textContent = "Aún no hay puntajes";

    rankingEl.append(item);

    return;
  }

  entries

    .sort((a, b) => b.points - a.points || a.stamp - b.stamp)

    .slice(0, 10)

    .forEach((entry, i) => {
      const item = document.createElement("li");

      const points = document.createElement("span");

      item.append(`${i + 1}. ${entry.name || "Navegante"}`);

      points.className = "rank-points";

      points.textContent = entry.points || 0;

      item.append(points);

      rankingEl.append(item);
    });
}

function connectRanking() {
  const bestScores = query(scoresRef, orderByChild("points"), limitToLast(10));

  onValue(
    bestScores,

    (snapshot) => {
      renderRanking(Object.values(snapshot.val() || {}));

      connectionEl.textContent = "● En vivo";

      connectionEl.classList.remove("offline");
    },

    () => {
      connectionEl.textContent = "Sin conexión";

      connectionEl.classList.add("offline");

      renderRanking();
    },
  );
}

/* =========================================================
   CONTROL DE PARTIDA
========================================================= */

function alreadyPlayed() {
  return localStorage.getItem(playedPrefix + contestId) === "si";
}

function showAlreadyPlayed() {
  overlay.classList.remove("hidden");

  overlay.querySelector(".panel").innerHTML = `

    <span class="hero">✅</span>

    <h2>Ya participaste</h2>

    <p>
      Este dispositivo ya registró una partida
      en el concurso actual.
      Espera el próximo reinicio para volver a jugar.
    </p>

  `;
}

function connectContest() {
  onValue(
    gameStateRef,

    (snapshot) => {
      const state = snapshot.val() || {};

      contestId = state.contestId || "concurso-inicial";

      if (!running && alreadyPlayed()) {
        showAlreadyPlayed();
      }
    },

    () => {
      connectionEl.textContent = "Sin conexión";

      connectionEl.classList.add("offline");
    },
  );
}

/* =========================================================
   GUARDAR RESULTADO
========================================================= */

function saveScore() {
  push(
    scoresRef,

    {
      name: playerName,

      points: score,

      stamp: Date.now(),
    },
  ).catch(() => {
    connectionEl.textContent = "No se pudo guardar";

    connectionEl.classList.add("offline");
  });
}

/* =========================================================
   DIMENSIONES
========================================================= */

function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  const rect = canvas.getBoundingClientRect();

  canvas.width = Math.round(rect.width * ratio);

  canvas.height = Math.round(rect.height * ratio);

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  if (running) {
    const d = dims();

    player.y = d.h - 82;

    player.x = Math.max(32, Math.min(d.w - 32, player.x));

    player.target = Math.max(32, Math.min(d.w - 32, player.target));
  }
}

function dims() {
  return {
    w: canvas.clientWidth,

    h: canvas.clientHeight,

    scale: canvas.clientWidth / 960,
  };
}

window.addEventListener("resize", resize);

resize();

/* =========================================================
   GENERAR OBJETOS
========================================================= */

function spawn() {
  const d = dims();

  /*
    La dificultad aumenta con el tiempo.
    Ya no depende de un contador de 45 segundos.
  */

  const difficulty = Math.min(1, 0.52 + time * 0.0025 + score * 0.0015);

  const bad = Math.random() < Math.min(0.82, difficulty);

  const data = bad ? pressures : supports;

  const selected = data[Math.floor(Math.random() * data.length)];

  const speedIncrease = Math.min(190, time * 1.6);

  items.push({
    x: 45 + Math.random() * (d.w - 90),

    y: -35,

    vy: (bad ? 145 : 112) + speedIncrease + Math.min(score, 100) * 1.5,

    bad,

    icon: selected[0],

    label: selected[1],

    r: bad ? 29 : 27,

    wave: Math.random() * 6.28,
  });
}

/* =========================================================
   PARTICULAS
========================================================= */

function burst(x, y, color, n = 14) {
  for (let i = 0; i < n; i++) {
    particles.push({
      x,

      y,

      vx: (Math.random() - 0.5) * 170,

      vy: (Math.random() - 0.7) * 170,

      life: 0.65 + Math.random() * 0.4,

      color,
    });
  }
}

/* =========================================================
   FONDO
========================================================= */

function drawBackground(d) {
  const sky = ctx.createLinearGradient(0, 0, 0, d.h);

  sky.addColorStop(0, "#77d9f2");

  sky.addColorStop(0.54, "#c4f1ef");

  sky.addColorStop(0.55, "#2faec9");

  sky.addColorStop(1, "#126f9e");

  ctx.fillStyle = sky;

  ctx.fillRect(0, 0, d.w, d.h);

  /* Sol */

  ctx.fillStyle = "#fff4c7";

  ctx.beginPath();

  ctx.arc(d.w * 0.81, d.h * 0.16, 40, 0, 7);

  ctx.fill();

  /* Montañas */

  ctx.fillStyle = "#78c874";

  ctx.beginPath();

  ctx.moveTo(0, d.h * 0.48);

  for (let x = 0; x <= d.w; x += 70) {
    ctx.quadraticCurveTo(x + 35, d.h * 0.41 + (x % 140 ? 9 : 0), x + 70, d.h * 0.48);
  }

  ctx.lineTo(d.w, d.h * 0.55);

  ctx.lineTo(0, d.h * 0.55);

  ctx.fill();

  /* Agua */

  for (let y = d.h * 0.59; y < d.h; y += 32) {
    ctx.strokeStyle = "rgba(255,255,255,.18)";

    ctx.lineWidth = 2;

    ctx.beginPath();

    for (let x = 0; x < d.w; x += 35) {
      ctx.quadraticCurveTo(
        x + 17,

        y - 5 + Math.sin((x + y + time * 80) / 40) * 3,

        x + 35,

        y,
      );
    }

    ctx.stroke();
  }

  /* Palmeras */

  ctx.fillStyle = "#1d925f";

  [
    [d.w * 0.09, d.h * 0.43],
    [d.w * 0.93, d.h * 0.45],
  ].forEach(([x, y]) => {
    ctx.fillRect(x - 3, y, 6, 52);

    ctx.beginPath();

    ctx.arc(x, y - 4, 24, 0, 7);

    ctx.fill();
  });
}

/* =========================================================
   JUGADOR
========================================================= */

function drawPlayer(d) {
  const x = player.x;

  const y = player.y + Math.sin(time * 5) * 3;

  ctx.save();

  ctx.translate(x, y);

  /* Canoa */

  ctx.fillStyle = "#713e1e";

  ctx.beginPath();

  ctx.ellipse(0, 12, 30, 12, 0, 0, 7);

  ctx.fill();

  /* Cuerpo */

  ctx.fillStyle = "#ed9a39";

  ctx.beginPath();

  ctx.moveTo(-27, 7);

  ctx.lineTo(27, 7);

  ctx.lineTo(14, 30);

  ctx.lineTo(-14, 30);

  ctx.fill();

  /* Camisa */

  ctx.fillStyle = "#ef6f53";

  ctx.fillRect(-16, -19, 32, 26);

  /* Cabello */

  ctx.fillStyle = "#6d3b22";

  ctx.beginPath();

  ctx.arc(0, -31, 13, 0, 7);

  ctx.fill();

  /* Cara */

  ctx.fillStyle = "#ffd2a3";

  ctx.beginPath();

  ctx.arc(0, -31, 10, 0, 7);

  ctx.fill();

  /* Visera */

  ctx.fillStyle = "#172e4a";

  ctx.fillRect(-13, -23, 26, 3);

  ctx.restore();
}

/* =========================================================
   OBJETOS
========================================================= */

function drawItem(it) {
  ctx.save();

  ctx.translate(it.x, it.y);

  ctx.fillStyle = it.bad ? "#ff8178" : "#fff";

  ctx.beginPath();

  ctx.arc(0, 0, it.r + 6, 0, 7);

  ctx.fill();

  ctx.font = `${it.bad ? 29 : 27}px sans-serif`;

  ctx.textAlign = "center";

  ctx.textBaseline = "middle";

  ctx.fillText(it.icon, 0, 1);

  ctx.font = "800 10px Nunito";

  ctx.fillStyle = it.bad ? "#8a2931" : "#176083";

  ctx.fillText(it.label, 0, it.r + 17);

  ctx.restore();
}

/* =========================================================
   ACTUALIZAR JUEGO
========================================================= */

function update(dt) {
  const d = dims();

  /*
    El tiempo aumenta indefinidamente.
    No existe un límite de 45 segundos.
  */

  time += dt;

  /*
    El marcador superior permanece
    mostrando infinito.
  */

  timerEl.textContent = "∞";

  /*
    Movimiento del jugador
  */

  player.x += Math.max(-460, Math.min(460, player.target - player.x)) * Math.min(1, dt * 8);

  /*
    Generación progresiva de objetos.

    Conforme aumenta time y score,
    aparecen más objetos.
  */

  const spawnRate = 2.1 + Math.min(2.8, time * 0.025) + Math.min(2, score * 0.015);

  if (Math.random() < dt * spawnRate) {
    spawn();
  }

  /*
    Movimiento y colisiones
  */

  items.forEach((it) => {
    it.y += it.vy * dt;

    it.x += Math.sin(time * 2 + it.wave) * 15 * dt;

    const dx = it.x - player.x;

    const dy = it.y - player.y;

    if (Math.hypot(dx, dy) < it.r + 31) {
      it.hit = true;

      if (it.bad) {
        /*
          Presión:
          pierde una vida.
        */

        lives--;

        combo = 0;

        livesEl.textContent = lives;

        burst(it.x, it.y, "#ff7770");

        /*
          La única forma de terminar
          la partida es quedarse sin vidas.
        */

        if (lives <= 0) {
          end(false);
        }
      } else {
        /*
          Apoyo:
          suma puntos.
        */

        combo++;

        score += 1 + Math.floor(combo / 4);

        scoreEl.textContent = score;

        burst(it.x, it.y, "#ffe467");
      }
    }
  });

  items = items.filter((it) => !it.hit && it.y < d.h + 60);

  /*
    Partículas
  */

  particles.forEach((p) => {
    p.x += p.vx * dt;

    p.y += p.vy * dt;

    p.vy += 250 * dt;

    p.life -= dt;
  });

  particles = particles.filter((p) => p.life > 0);
}

/* =========================================================
   DIBUJAR
========================================================= */

function draw() {
  const d = dims();

  ctx.clearRect(0, 0, d.w, d.h);

  drawBackground(d);

  items.forEach(drawItem);

  drawPlayer(d);

  particles.forEach((p) => {
    ctx.globalAlpha = Math.max(0, p.life);

    ctx.fillStyle = p.color;

    ctx.beginPath();

    ctx.arc(p.x, p.y, 4, 0, 7);

    ctx.fill();
  });

  ctx.globalAlpha = 1;
}

/* =========================================================
   BUCLE PRINCIPAL
========================================================= */

function loop(now) {
  if (!running) {
    return;
  }

  const dt = Math.min(0.035, (now - last) / 1000 || 0);

  last = now;

  update(dt);

  draw();

  if (running) {
    requestAnimationFrame(loop);
  }
}

/* =========================================================
   COMENZAR
========================================================= */

let playerName = "Navegante";

function begin() {
  if (alreadyPlayed()) {
    showAlreadyPlayed();

    return;
  }

  playerName =
    (document.querySelector("#player-name")?.value || "Navegante")

      .trim()

      .replace(/[^a-zA-ZÀ-ÿ0-9 .\_-]/g, "")

      .slice(0, 14) || "Navegante";

  running = true;

  score = 0;

  lives = 3;

  time = 0;

  combo = 0;

  items = [];

  particles = [];

  player.x = player.target = dims().w / 2;

  player.y = dims().h - 82;

  scoreEl.textContent = "0";

  livesEl.textContent = "3";

  timerEl.textContent = "∞";

  overlay.classList.add("hidden");

  last = performance.now();

  requestAnimationFrame(loop);
}

/* =========================================================
   FINAL DE PARTIDA
========================================================= */

function end() {
  if (!running) {
    return;
  }

  running = false;

  /*
    Se registra que el dispositivo
    ya jugó este concurso.
  */

  localStorage.setItem(playedPrefix + contestId, "si");

  /*
    Guardar resultado en Firebase.
  */

  saveScore();

  /*
    Mostrar resultado.
  */

  overlay.classList.remove("hidden");

  overlay.querySelector(".panel").innerHTML = `

    <span class="hero">💙</span>

    <h2>¡Fin de tu partida!</h2>

    <p>

      <strong>${playerName}</strong>,

      lograste

      <strong>${score} puntos</strong>.

      <br><br>

      Te quedaste sin vidas.

      Tu resultado se está enviando
      al ranking en vivo.

      <br><br>

      Este dispositivo ya participó
      en este concurso.

    </p>

  `;
}

/* =========================================================
   REINICIAR CONCURSO
========================================================= */

async function resetContest() {
  const password = window.prompt(
    "Clave de administrador para borrar el ranking y reiniciar el concurso:",
  );

  if (password === null) {
    return;
  }

  if (password !== "2460") {
    window.alert("Clave incorrecta. El concurso no fue modificado.");

    return;
  }

  const accepted = window.confirm(
    "Se eliminarán TODOS los puntajes y se habilitará una nueva partida en todos los dispositivos. ¿Continuar?",
  );

  if (!accepted) {
    return;
  }

  try {
    const newContestId = "concurso-" + Date.now();

    await set(scoresRef, null);

    await set(gameStateRef, {
      contestId: newContestId,
      resetAt: Date.now(),
    });

    localStorage.removeItem(playedPrefix + contestId);

    contestId = newContestId;

    window.alert(
      "Concurso reiniciado. El ranking está vacío y los dispositivos pueden volver a participar.",
    );

    window.location.reload();
  } catch (error) {
    console.error(error);

    window.alert(
      "No fue posible reiniciar. Revisa las reglas de Firebase indicadas por el administrador.",
    );
  }
}

/* =========================================================
   CONTROLES
========================================================= */

function setTarget(clientX) {
  const r = canvas.getBoundingClientRect();

  player.target = Math.max(
    32,

    Math.min(r.width - 32, clientX - r.left),
  );
}

function nudge(amount) {
  const d = dims();

  player.target = Math.max(
    32,

    Math.min(d.w - 32, player.target + amount),
  );
}

/* Teclado */

window.addEventListener("keydown", (e) => {
  if (["ArrowLeft", "a", "A"].includes(e.key)) {
    nudge(-55);
  }

  if (["ArrowRight", "d", "D"].includes(e.key)) {
    nudge(55);
  }
});

/* Mouse / pantalla táctil */

canvas.addEventListener("pointerdown", (e) => {
  setTarget(e.clientX);
});

canvas.addEventListener("pointermove", (e) => {
  if (e.buttons) {
    setTarget(e.clientX);
  }
});

/* Botones móviles */

start.onclick = begin;

leftButton.addEventListener("pointerdown", (e) => {
  e.preventDefault();

  nudge(-90);
});

rightButton.addEventListener("pointerdown", (e) => {
  e.preventDefault();

  nudge(90);
});

/* Reiniciar concurso */

resetButton.onclick = resetContest;

/* =========================================================
   INICIALIZAR
========================================================= */

connectRanking();

connectContest();

draw();
