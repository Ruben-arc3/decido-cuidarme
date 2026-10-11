(() => {
  "use strict";
  const canvas = document.getElementById("game"),
    ctx = canvas.getContext("2d");
  const $ = (id) => document.getElementById(id);
  const teams = ["Equipo Sol", "Equipo Río", "Equipo Monte", "Equipo Brisa"];
  const goalNames = {
    crear: "Crear algo propio",
    aprender: "Aprender algo nuevo",
    comunidad: "Aportar a mi comunidad",
  };
  const levels = [
    {
      cols: 17,
      rows: 11,
      count: 3,
      hazards: 1,
      title: "Nivel 1 · Encuentra lo que te mueve",
      tag: "EXPLORACIÓN",
      mission: "Reúne chispas de interés",
      item: "Intereses e ideas",
      icon: "✨",
      help: "Encuentra las 3 chispas para abrir la salida.",
      theme: ["#2b826e", "#236c67"],
    },
    {
      cols: 19,
      rows: 13,
      count: 4,
      hazards: 3,
      title: "Nivel 2 · Activa tu red",
      tag: "ALIADOS EN EL CAMINO",
      mission: "Reúne personas y apoyos",
      item: "Aliados y recursos",
      icon: "🤝",
      help: "Encuentra los 4 apoyos para abrir la salida.",
      theme: ["#397ca5", "#285d83"],
    },
    {
      cols: 21,
      rows: 13,
      count: 5,
      hazards: 5,
      title: "Nivel 3 · Traza el siguiente paso",
      tag: "RETO FINAL",
      mission: "Reúne pasos posibles",
      item: "Pasos y herramientas",
      icon: "🧭",
      help: "Encuentra los 5 pasos para llegar a la meta.",
      theme: ["#795fae", "#514e91"],
    },
  ];
  let s = {
    level: 0,
    goal: null,
    map: [],
    player: { x: 1, y: 1 },
    start: { x: 1, y: 1 },
    exit: { x: 1, y: 1 },
    items: [],
    hazards: new Set(),
    seen: new Set(),
    lives: 3,
    hints: 2,
    steps: 0,
    elapsed: 0,
    totalItems: 0,
    team: 0,
    started: false,
    paused: false,
    stunned: false,
    held: null,
    moveTimer: null,
    clockTimer: null,
    raf: null,
    checkpoint: { x: 1, y: 1 },
    hintTarget: null,
  };
  const TILE = 40,
    FOG = 3;
  let particles = [];
  function random(a) {
    return a[Math.floor(Math.random() * a.length)];
  }
  function key(x, y) {
    return x + "," + y;
  }
  function open(map, x, y) {
    return map[y] && map[y][x] === " ";
  }
  function neighbors(x, y) {
    return [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];
  }
  function makeMaze(cols, rows) {
    const map = Array.from({ length: rows }, () => Array(cols).fill("#"));
    const start = { x: 1, y: 1 },
      stack = [start];
    map[1][1] = " ";
    while (stack.length) {
      const c = stack[stack.length - 1],
        opts = [];
      for (const [dx, dy] of [
        [0, -2],
        [2, 0],
        [0, 2],
        [-2, 0],
      ]) {
        const nx = c.x + dx,
          ny = c.y + dy;
        if (nx > 0 && ny > 0 && nx < cols - 1 && ny < rows - 1 && map[ny][nx] === "#")
          opts.push({ x: nx, y: ny, dx, dy });
      }
      if (!opts.length) {
        stack.pop();
        continue;
      }
      const n = random(opts);
      map[c.y + n.dy / 2][c.x + n.dx / 2] = " ";
      map[n.y][n.x] = " ";
      stack.push({ x: n.x, y: n.y });
    }
    for (let y = 1; y < rows - 1; y++)
      for (let x = 1; x < cols - 1; x++)
        if (
          map[y][x] === "#" &&
          Math.random() < 0.095 &&
          neighbors(x, y).filter(([nx, ny]) => open(map, nx, ny)).length >= 2
        )
          map[y][x] = " ";
    return map;
  }
  function distances(map, start) {
    const dist = new Map([[key(start.x, start.y), 0]]),
      q = [start];
    for (let i = 0; i < q.length; i++) {
      const p = q[i];
      for (const [x, y] of neighbors(p.x, p.y)) {
        const k = key(x, y);
        if (open(map, x, y) && !dist.has(k)) {
          dist.set(k, dist.get(key(p.x, p.y)) + 1);
          q.push({ x, y });
        }
      }
    }
    return dist;
  }
  function shortest(map, from, to) {
    const q = [from],
      prev = new Map([[key(from.x, from.y), null]]);
    for (let i = 0; i < q.length; i++) {
      const p = q[i];
      if (p.x === to.x && p.y === to.y) break;
      for (const [x, y] of neighbors(p.x, p.y)) {
        const k = key(x, y);
        if (open(map, x, y) && !prev.has(k)) {
          prev.set(k, key(p.x, p.y));
          q.push({ x, y });
        }
      }
    }
    let k = key(to.x, to.y);
    if (!prev.has(k)) return [];
    const path = [];
    while (k) {
      const [x, y] = k.split(",").map(Number);
      path.unshift({ x, y });
      k = prev.get(k);
    }
    return path;
  }
  function reveal() {
    const c = levels[s.level];
    for (let y = Math.max(0, s.player.y - FOG); y <= Math.min(c.rows - 1, s.player.y + FOG); y++)
      for (let x = Math.max(0, s.player.x - FOG); x <= Math.min(c.cols - 1, s.player.x + FOG); x++)
        if (Math.abs(x - s.player.x) + Math.abs(y - s.player.y) <= FOG + 1) s.seen.add(key(x, y));
  }
  function setupLevel() {
    const c = levels[s.level];
    s.map = makeMaze(c.cols, c.rows);
    canvas.width = c.cols * TILE;
    canvas.height = c.rows * TILE;
    s.start = { x: 1, y: 1 };
    s.player = { ...s.start };
    s.checkpoint = { ...s.start };
    let ds = distances(s.map, s.start),
      spaces = [...ds.entries()]
        .map(([k, d]) => {
          const [x, y] = k.split(",").map(Number);
          return { x, y, d };
        })
        .filter((p) => p.d > 3);
    spaces.sort((a, b) => b.d - a.d);
    s.exit = { x: spaces[0].x, y: spaces[0].y };
    const possible = spaces.filter((p) => key(p.x, p.y) !== key(s.exit.x, s.exit.y));
    shuffle(possible);
    s.items = possible.slice(0, c.count).map((p, i) => ({ x: p.x, y: p.y, got: false, index: i }));
    const reserved = new Set([
      key(s.start.x, s.start.y),
      key(s.exit.x, s.exit.y),
      ...s.items.map((p) => key(p.x, p.y)),
    ]);
    const hazardCells = possible.filter((p) => !reserved.has(key(p.x, p.y)) && p.d > 4);
    shuffle(hazardCells);
    s.hazards = new Set(hazardCells.slice(0, c.hazards).map((p) => key(p.x, p.y)));
    s.seen = new Set();
    reveal();
    s.lives = 3;
    s.hints = 2;
    s.steps = 0;
    s.hintTarget = null;
    particles = [];
    $("level").textContent = s.level + 1 + " / 3";
    $("sceneTitle").textContent = c.title;
    $("mapSize").textContent = "LABERINTO " + c.cols + " × " + c.rows;
    $("levelTag").textContent = c.tag;
    $("missionTitle").textContent = c.mission;
    $("missionText").textContent =
      "Exploren, recojan los objetos y descubran la puerta. El mapa se revela a medida que avanzan.";
    $("itemIcon").textContent = c.icon;
    $("itemName").textContent = c.item;
    $("itemHelp").textContent = c.help;
    $("items").textContent = "0 / " + c.count;
    $("lives").textContent = "♥ ♥ ♥";
    $("progress").style.width = "0%";
    $("progressText").textContent = "0%";
    $("hints").textContent = s.hints;
    $("hint").disabled = false;
    $("toast").textContent = "El grupo decide a dónde moverse. La salida se abre al reunir todo.";
    updateTeam();
    draw();
  }
  function updateTeam() {
    $("team").textContent = teams[s.team % teams.length];
  }
  function draw() {
    const c = levels[s.level],
      w = canvas.width,
      h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    for (let y = 0; y < c.rows; y++)
      for (let x = 0; x < c.cols; x++) {
        const k = key(x, y),
          px = x * TILE,
          py = y * TILE,
          visible = s.seen.has(k) || Math.abs(x - s.player.x) + Math.abs(y - s.player.y) <= FOG;
        if (!visible) {
          ctx.fillStyle = "#193742";
          ctx.fillRect(px, py, TILE, TILE);
          continue;
        }
        if (s.map[y][x] === "#") {
          ctx.fillStyle = (x + y) % 2 ? "#315463" : "#385e6b";
          ctx.fillRect(px + 1, py + 1, TILE - 2, TILE - 2);
          ctx.fillStyle = "#527582";
          ctx.fillRect(px + 4, py + 4, TILE - 8, 5);
          ctx.fillStyle = "#254654";
          ctx.fillRect(px + 4, py + TILE - 8, TILE - 8, 4);
        } else {
          ctx.fillStyle = (x + y) % 2 ? "#d7edcf" : "#e2f1d7";
          ctx.fillRect(px, py, TILE, TILE);
          ctx.fillStyle = "#b7dcbd";
          ctx.globalAlpha = 0.35;
          ctx.beginPath();
          ctx.arc(px + 8 + ((x * 7) % 23), py + 9 + ((y * 11) % 22), 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    if (s.exit && s.seen.has(key(s.exit.x, s.exit.y))) {
      ctx.fillStyle = s.items.every((i) => i.got) ? "#ffd863" : "#89989a";
      ctx.beginPath();
      ctx.roundRect(s.exit.x * TILE + 5, s.exit.y * TILE + 4, TILE - 10, TILE - 8, 9);
      ctx.fill();
      ctx.fillStyle = "#fff7df";
      ctx.font = "24px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        s.items.every((i) => i.got) ? "🚪" : "🔒",
        s.exit.x * TILE + TILE / 2,
        s.exit.y * TILE + TILE / 2 + 1,
      );
    }
    const cNow = s.items.filter((i) => !i.got);
    cNow.forEach((it, i) => {
      if (!s.seen.has(key(it.x, it.y))) return;
      const bob = Math.sin(Date.now() / 220 + i) * 3;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(it.x * TILE + 20, it.y * TILE + 20 + bob, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "22px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(c.icon, it.x * TILE + 20, it.y * TILE + 19 + bob);
    });
    s.hazards.forEach((k) => {
      if (!s.seen.has(k)) return;
      const [x, y] = k.split(",").map(Number),
        pulse = 1 + Math.sin(Date.now() / 180 + x) * 0.06;
      ctx.save();
      ctx.translate(x * TILE + 20, y * TILE + 20);
      ctx.scale(pulse, pulse);
      ctx.fillStyle = "#ef9b70";
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.font = "20px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("☁️", 0, 0);
      ctx.restore();
    });
    particles = particles.filter((p) => p.life > 0);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      ctx.globalAlpha = Math.max(0, p.life / 35);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 4, 4);
    });
    ctx.globalAlpha = 1;
    drawHero(s.player.x * TILE + 20, s.player.y * TILE + 20, Date.now() / 180);
  }
  function drawHero(x, y, t) {
    ctx.save();
    ctx.translate(x, y + Math.sin(t) * 1.5);
    ctx.fillStyle = "#24435444";
    ctx.beginPath();
    ctx.ellipse(0, 16, 13, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f3a976";
    ctx.beginPath();
    ctx.arc(0, -7, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2b3044";
    ctx.beginPath();
    ctx.arc(0, -10, 9, Math.PI, Math.PI * 2);
    ctx.lineTo(9, -6);
    ctx.quadraticCurveTo(0, -13, -9, -6);
    ctx.fill();
    ctx.fillStyle = "#182e43";
    ctx.beginPath();
    ctx.arc(-3, -6, 1, 0, Math.PI * 2);
    ctx.arc(3, -6, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#a55048";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, -4, 3, 0, Math.PI);
    ctx.stroke();
    ctx.fillStyle = "#f18463";
    ctx.beginPath();
    ctx.roundRect(-9, 2, 18, 14, 5);
    ctx.fill();
    ctx.fillStyle = "#ffd45f";
    ctx.beginPath();
    ctx.roundRect(-11, 5, 4, 8, 2);
    ctx.roundRect(7, 5, 4, 8, 2);
    ctx.fill();
    ctx.strokeStyle = "#253b4e";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-4, 15);
    ctx.lineTo(-6, 20 + Math.sin(t) * 2);
    ctx.moveTo(4, 15);
    ctx.lineTo(6, 20 - Math.sin(t) * 2);
    ctx.stroke();
    ctx.fillStyle = "#60b8a1";
    ctx.beginPath();
    ctx.roundRect(6, 2, 7, 10, 2);
    ctx.fill();
    ctx.restore();
  }
  function loop() {
    if (!s.paused && s.started && !s.stunned && s.held && Date.now() - (s.lastMove || 0) > 132) {
      move(s.held);
      s.lastMove = Date.now();
    }
    draw();
    s.raf = requestAnimationFrame(loop);
  }
  function move(dir) {
    if (!s.started || s.paused || s.stunned) return;
    const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[dir];
    if (!d) return;
    const nx = s.player.x + d[0],
      ny = s.player.y + d[1];
    if (!open(s.map, nx, ny)) return;
    s.player = { x: nx, y: ny };
    s.steps++;
    reveal();
    const k = key(nx, ny);
    if (s.hazards.has(k)) {
      s.hazards.delete(k);
      s.lives--;
      updateLives();
      s.stunned = true;
      s.held = null;
      s.player = { ...s.checkpoint };
      reveal();
      $("toast").textContent = s.lives
        ? "¡Nube de distracción! El equipo te ayuda a retomar desde el último apoyo."
        : "Tomen aire: la energía se recarga en el punto seguro. ¡Sigan!";
      if (s.lives <= 0) s.lives = 3;
      setTimeout(() => {
        s.stunned = false;
        updateLives();
        draw();
      }, 750);
      return;
    }
    const item = s.items.find((i) => i.x === nx && i.y === ny && !i.got);
    if (item) {
      item.got = true;
      s.checkpoint = { x: nx, y: ny };
      s.totalItems++;
      s.team = (s.team + 1) % teams.length;
      updateTeam();
      const count = s.items.filter((i) => i.got).length;
      $("items").textContent = count + " / " + levels[s.level].count;
      $("progress").style.width = (count / levels[s.level].count) * 100 + "%";
      $("progressText").textContent = Math.round((count / levels[s.level].count) * 100) + "%";
      $("toast").textContent =
        "¡Objeto encontrado! Guía ahora: " + teams[s.team] + ". La ruta se amplía.";
      burst(nx * TILE + 20, ny * TILE + 20);
      if (s.lives < 3) s.lives++;
      updateLives();
    }
    if (nx === s.exit.x && ny === s.exit.y) {
      if (s.items.every((i) => i.got)) {
        completeLevel();
        return;
      } else {
        $("toast").textContent =
          "La puerta está cerrada. Faltan " +
          (levels[s.level].count - s.items.filter((i) => i.got).length) +
          " objetos por encontrar.";
      }
    }
  }
  function burst(x, y) {
    const colors = ["#ffe16d", "#55c9a0", "#f28b69", "#e8f4ff"];
    for (let i = 0; i < 18; i++)
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 35,
        color: random(colors),
      });
  }
  function updateLives() {
    $("lives").textContent = "♥ ".repeat(s.lives).trim() || "♡ ♡ ♡";
  }
  function getTarget() {
    const remaining = s.items.filter((i) => !i.got);
    if (!remaining.length) return s.exit;
    let best = null,
      path = null;
    remaining.forEach((it) => {
      const p = shortest(s.map, s.player, it);
      if (p.length && (!path || p.length < path.length)) {
        best = it;
        path = p;
      }
    });
    return best || s.exit;
  }
  function hint() {
    if (!s.started || s.paused || s.stunned) return;
    if (s.hints <= 0) {
      $("toast").textContent =
        "Ya usaron las dos pistas de este laberinto. ¡Pidan otra idea al salón!";
      return;
    }
    const target = getTarget(),
      p = shortest(s.map, s.player, target);
    if (p.length < 2) return;
    s.hints--;
    $("hints").textContent = s.hints;
    if (!s.hints) $("hint").disabled = true;
    const next = p[1],
      dx = next.x - s.player.x,
      dy = next.y - s.player.y,
      word = dx > 0 ? "derecha" : dx < 0 ? "izquierda" : dy > 0 ? "abajo" : "arriba";
    $("hintArrow").textContent = "💡 Siguiente paso: " + word;
    $("hintArrow").classList.add("show");
    s.seen.add(key(target.x, target.y));
    $("toast").textContent =
      target === s.exit
        ? "Sigan " + word + " hacia la salida."
        : "Hay un objeto por " + word + " y luego pueden cambiar de ruta.";
    setTimeout(() => {
      $("hintArrow").classList.remove("show");
    }, 1800);
  }
  function start() {
    s.started = true;
    $("intro").hidden = true;
    setupLevel();
    if (!s.clockTimer)
      s.clockTimer = setInterval(() => {
        if (s.started && !s.paused) {
          s.elapsed++;
          $("clock").textContent =
            String(Math.floor(s.elapsed / 60)).padStart(2, "0") +
            ":" +
            String(s.elapsed % 60).padStart(2, "0");
        }
      }, 1000);
  }
  function completeLevel() {
    s.started = false;
    s.held = null;
    const c = levels[s.level];
    $("stageIcon").textContent = s.level === 2 ? "🏁" : "🌟";
    $("stageEyebrow").textContent = "NIVEL " + (s.level + 1) + " COMPLETADO";
    $("stageTitle").textContent = s.level === 2 ? "¡La meta está cerca!" : "¡Salida encontrada!";
    const notes = [
      "Ya reconocieron intereses e ideas que pueden convertir en un primer paso.",
      "La red de apoyo puede acompañar los cambios y nuevos intentos.",
      "Su ruta reunió intereses, apoyos y pasos posibles: ¡misión lograda!",
    ];
    $("stageText").textContent =
      notes[s.level] +
      " La clase encuentra " +
      c.count +
      " objetos en " +
      s.steps +
      " movimientos.";
    $("continue").textContent = s.level === 2 ? "VER RESULTADO" : "SIGUIENTE NIVEL →";
    $("stageModal").hidden = false;
  }
  function nextLevel() {
    $("stageModal").hidden = true;
    if (s.level === 2) {
      finish();
      return;
    }
    s.level++;
    setupLevel();
    s.started = true;
    $("toast").textContent = "¡Nuevo laberinto! Cambia la persona guía y exploren juntos.";
  }
  function finish() {
    s.started = false;
    clearInterval(s.clockTimer);
    s.clockTimer = null;
    $("resultText").textContent =
      "El salón completó tres laberintos para la meta “" +
      s.goal +
      "” en " +
      String(Math.floor(s.elapsed / 60)).padStart(2, "0") +
      ":" +
      String(s.elapsed % 60).padStart(2, "0") +
      ". Cada objeto representa una herramienta que puede ayudar a avanzar.";
    $("resultStats").innerHTML =
      "<span>🧩 " +
      s.totalItems +
      " ideas y pasos</span><span>🤝 " +
      teams.length +
      " equipos guías</span><span>👣 " +
      s.steps +
      " movimientos en el último nivel</span>";
    $("result").hidden = false;
  }
  function reset() {
    clearInterval(s.clockTimer);
    s = {
      level: 0,
      goal: null,
      map: [],
      player: { x: 1, y: 1 },
      start: { x: 1, y: 1 },
      exit: { x: 1, y: 1 },
      items: [],
      hazards: new Set(),
      seen: new Set(),
      lives: 3,
      hints: 2,
      steps: 0,
      elapsed: 0,
      totalItems: 0,
      team: 0,
      started: false,
      paused: false,
      stunned: false,
      held: null,
      moveTimer: null,
      clockTimer: null,
      raf: null,
      checkpoint: { x: 1, y: 1 },
      hintTarget: null,
    };
    $("clock").textContent = "00:00";
    $("result").hidden = true;
    $("stageModal").hidden = true;
    $("intro").hidden = false;
    document.querySelectorAll(".goal").forEach((b) => b.classList.remove("selected"));
    $("go").disabled = true;
    $("go").textContent = "SELECCIONEN UNA MISIÓN";
    $("pause").textContent = "Ⅱ Pausa";
  }
  document.querySelectorAll(".goal").forEach(
    (b) =>
      (b.onclick = () => {
        document.querySelectorAll(".goal").forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected");
        s.goal = b.dataset.goal;
        $("missionText").textContent =
          "Meta acordada: " + goalNames[s.goal] + ". Recojan objetos y descubran la salida.";
        $("go").disabled = false;
        $("go").textContent = "▶ INICIAR MISIÓN";
      }),
  );
  $("go").onclick = start;
  $("continue").onclick = nextLevel;
  $("again").onclick = reset;
  $("restart").onclick = reset;
  $("hint").onclick = hint;
  $("pause").onclick = () => {
    if (!s.started) return;
    s.paused = !s.paused;
    s.held = null;
    $("pause").textContent = s.paused ? "▶ Seguir" : "Ⅱ Pausa";
    $("toast").textContent = s.paused
      ? "Pausa. El equipo puede planear la siguiente ruta."
      : "¡Sigan! El salón guía el camino.";
  };
  $("project").onclick = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };
  const keyDirs = {
    ArrowUp: "up",
    w: "up",
    W: "up",
    ArrowDown: "down",
    s: "down",
    S: "down",
    ArrowLeft: "left",
    a: "left",
    A: "left",
    ArrowRight: "right",
    d: "right",
    D: "right",
  };
  window.addEventListener("keydown", (e) => {
    const dir = keyDirs[e.key];
    if (dir) {
      e.preventDefault();
      if (e.repeat) return;
      s.held = dir;
      move(dir);
      s.lastMove = Date.now();
    }
  });
  window.addEventListener("keyup", (e) => {
    if (keyDirs[e.key] && s.held === keyDirs[e.key]) s.held = null;
  });
  window.addEventListener("blur", () => (s.held = null));
  document.querySelectorAll(".dpad button").forEach((b) => {
    const begin = (e) => {
      e.preventDefault();
      s.held = b.dataset.dir;
      move(s.held);
      s.lastMove = Date.now();
    };
    const end = (e) => {
      e.preventDefault();
      if (s.held === b.dataset.dir) s.held = null;
    };
    b.addEventListener("pointerdown", begin);
    b.addEventListener("pointerup", end);
    b.addEventListener("pointerleave", end);
    b.addEventListener("pointercancel", end);
  });
  setupLevel();
  $("intro").hidden = false;
  requestAnimationFrame(loop);
})();
