(function () {
  "use strict";
  const W = 17,
    H = 11,
    LEVELS = ["CASA DE PAPEL", "CALLES DE SOMBRA", "RED DE APOYO"];
  const DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const $ = (id) => document.getElementById(id),
    maze = $("maze");
  let s = {
    level: 0,
    lives: 3,
    grid: [],
    items: new Map(),
    shields: new Set(),
    player: { x: 1, y: 1 },
    entities: [],
    dir: null,
    next: null,
    tick: 0,
    started: false,
    paused: true,
    remaining: 300,
    shield: 0,
    interval: null,
    over: false,
  };
  function key(x, y) {
    return x + "," + y;
  }
  function floor(x, y) {
    return x > 0 && y > 0 && x < W - 1 && y < H - 1 && s.grid[y][x] === " ";
  }
  function makeMaze() {
    const g = Array.from({ length: H }, () => Array(W).fill("#")),
      seen = new Set(),
      stack = [[1, 1]];
    g[1][1] = " ";
    seen.add(key(1, 1));
    while (stack.length) {
      const [x, y] = stack[stack.length - 1],
        opts = [
          [0, -2],
          [2, 0],
          [0, 2],
          [-2, 0],
        ]
          .map(([dx, dy]) => [x + dx, y + dy, dx, dy])
          .filter(
            ([nx, ny]) => nx > 0 && ny > 0 && nx < W - 1 && ny < H - 1 && !seen.has(key(nx, ny)),
          );
      if (!opts.length) {
        stack.pop();
        continue;
      }
      const [nx, ny, dx, dy] = opts[Math.floor(Math.random() * opts.length)];
      g[y + dy / 2][x + dx / 2] = " ";
      g[ny][nx] = " ";
      seen.add(key(nx, ny));
      stack.push([nx, ny]);
    }
    for (let i = 0; i < 23; i++) {
      const x = 2 + Math.floor(Math.random() * (W - 4)),
        y = 2 + Math.floor(Math.random() * (H - 4));
      if (
        g[y][x] === "#" &&
        ((g[y][x - 1] === " " && g[y][x + 1] === " ") ||
          (g[y - 1][x] === " " && g[y + 1][x] === " "))
      )
        g[y][x] = " ";
    }
    for (let x = 1; x < W - 1; x++) g[5][x] = " ";
    for (let y = 1; y < H - 1; y++) g[y][9] = " ";
    return g;
  }
  function newLevel() {
    s.grid = makeMaze();
    s.player = { x: 1, y: 1 };
    s.dir = null;
    s.next = null;
    s.tick = 0;
    s.shield = 0;
    s.exit = { x: 15, y: 9 };
    const coords = [
      [3, 5, "📱", "Teléfono"],
      [9, 5, "🤝", "Persona de confianza"],
      [13, 5, "📍", "Lugar seguro"],
    ];
    s.items = new Map(coords.map(([x, y, icon, name]) => [key(x, y), { icon, name }]));
    s.shields = new Set([key(5, 5), key(11, 5)]);
    const homes = [
        [15, 1],
        [1, 9],
        [15, 7],
        [7, 9],
      ],
      icons = ["🔒", "🤫", "🌫️", "🕸️"],
      classes = ["e1", "e2", "e3", "e4"],
      names = ["Control", "Silencio", "Miedo", "Aislamiento"];
    s.entities = homes.map((p, i) => ({
      x: p[0],
      y: p[1],
      home: { x: p[0], y: p[1] },
      icon: icons[i],
      name: names[i],
      className: classes[i],
    }));
    $("level").textContent = s.level + 1 + " / 3";
    $("levelName").textContent = "NIVEL " + (s.level + 1) + " · " + LEVELS[s.level];
    $("count").textContent = "0 / 3";
    $("gate").textContent = "SALIDA BLOQUEADA";
    $("message").textContent = [
      "Encuentra los apoyos del patio y planea una ruta.",
      "Cruza las calles; las entidades cambian de pasillo.",
      "Último tramo: usa la red de apoyo y llega a la salida.",
    ][s.level];
    render();
    hud();
  }
  function render() {
    maze.innerHTML = "";
    maze.dataset.level = String(s.level + 1);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const c = document.createElement("div");
        c.className = "cell" + (s.grid[y][x] === "#" ? " wall" : "");
        const item = s.items.get(key(x, y));
        if (item) {
          const p = document.createElement("span");
          p.className = "pickup";
          p.textContent = item.icon;
          p.title = item.name;
          c.appendChild(p);
        }
        if (s.shields.has(key(x, y))) {
          const a = document.createElement("span");
          a.className = "shielditem";
          a.textContent = "🛡️";
          a.title = "Escudo de pausa";
          c.appendChild(a);
        }
        maze.appendChild(c);
      }
    const layer = document.createElement("div");
    layer.className = "actors";
    const put = (x, y, cls, icon, label) => {
      const a = document.createElement("div");
      a.className = "actor " + cls;
      a.style.left = ((x + 0.5) / W) * 100 + "%";
      a.style.top = ((y + 0.5) / H) * 100 + "%";
      a.textContent = icon;
      a.title = label;
      if (cls === "player" && s.shield > 0) a.classList.add("safe");
      layer.appendChild(a);
    };
    const d = document.createElement("div");
    d.className = "actor door " + (s.items.size === 0 ? "open" : "locked");
    d.textContent = "🚪";
    d.style.left = ((s.exit.x + 0.5) / W) * 100 + "%";
    d.style.top = ((s.exit.y + 0.5) / H) * 100 + "%";
    layer.appendChild(d);
    s.entities.forEach((e) => put(e.x, e.y, "entity " + e.className, e.icon, e.name));
    put(s.player.x, s.player.y, "player", "🧑", "Alex");
    maze.appendChild(layer);
  }
  function hud() {
    $("lives").textContent = "♥ ".repeat(s.lives) || "—";
    $("count").textContent = 3 - s.items.size + " / 3";
    $("gate").textContent = s.items.size
      ? s.items.size === 1
        ? "FALTA 1 APOYO"
        : "FALTAN " + s.items.size + " APOYOS"
      : "¡SALIDA ABIERTA!";
    $("clock").textContent =
      String(Math.floor(s.remaining / 60)).padStart(2, "0") +
      ":" +
      String(s.remaining % 60).padStart(2, "0");
  }
  function collect() {
    const pos = [...s.items.keys()].find((k) => {
      const [x, y] = k.split(",").map(Number);
      return Math.abs(x - s.player.x) + Math.abs(y - s.player.y) <= 1;
    });
    if (pos) {
      const item = s.items.get(pos);
      s.items.delete(pos);
      $("message").textContent =
        "Apoyo recogido: " +
        item.name +
        "." +
        (s.items.size === 0 ? " ¡La salida está abierta!" : "");
      toast(item.name + " recogido");
      hud();
    }
    const shield = [...s.shields].find((k) => {
      const [x, y] = k.split(",").map(Number);
      return Math.abs(x - s.player.x) + Math.abs(y - s.player.y) <= 1;
    });
    if (shield) {
      s.shields.delete(shield);
      s.shield = 16;
      $("message").textContent = "Escudo de pausa activado por unos segundos.";
      toast("¡Escudo!");
      hud();
    }
    if (s.items.size === 0 && s.player.x === s.exit.x && s.player.y === s.exit.y) nextLevel();
  }
  function movePlayer() {
    if (s.next) {
      const [dx, dy] = DIR[s.next];
      if (floor(s.player.x + dx, s.player.y + dy)) s.dir = s.next;
    }
    if (s.dir) {
      const [dx, dy] = DIR[s.dir];
      if (floor(s.player.x + dx, s.player.y + dy)) {
        s.player.x += dx;
        s.player.y += dy;
      }
    }
    collect();
  }
  function pathStep(from, target) {
    const q = [from],
      prev = new Map([[key(from.x, from.y), null]]);
    while (q.length) {
      const p = q.shift();
      if (p.x === target.x && p.y === target.y) {
        let k = key(p.x, p.y),
          last = prev.get(k);
        while (last && last !== key(from.x, from.y)) {
          k = last;
          last = prev.get(k);
        }
        return k.split(",").map(Number);
      }
      for (const [dx, dy] of Object.values(DIR)) {
        const nx = p.x + dx,
          ny = p.y + dy,
          k = key(nx, ny);
        if (floor(nx, ny) && !prev.has(k)) {
          prev.set(k, key(p.x, p.y));
          q.push({ x: nx, y: ny });
        }
      }
    }
    return null;
  }
  function moveEntities() {
    s.entities.forEach((e, i) => {
      const options = Object.values(DIR)
        .map(([dx, dy]) => [e.x + dx, e.y + dy])
        .filter(([x, y]) => floor(x, y));
      let step = null;
      if (s.shield > 0) step = pathStep(e, e.home);
      else if (i === s.level % 4 || s.tick % 9 === 0) step = pathStep(e, s.player);
      if (!step && options.length) step = options[Math.floor(Math.random() * options.length)];
      if (step) {
        e.x = step[0];
        e.y = step[1];
      }
    });
    if (s.shield === 0 && s.entities.some((e) => e.x === s.player.x && e.y === s.player.y)) {
      s.lives--;
      if (s.lives <= 0) {
        end(false);
        return;
      }
      s.player = { x: 1, y: 1 };
      s.entities.forEach((e) => {
        e.x = e.home.x;
        e.y = e.home.y;
      });
      s.shield = 22;
      $("message").textContent =
        "Una entidad te alcanzó: descansa un momento, recuperaste el rumbo.";
      toast("Energía -1 · escudo breve");
      hud();
    }
  }
  function nextLevel() {
    s.level++;
    if (s.level >= 3) {
      end(true);
      return;
    }
    toast("¡Nivel superado! Cambien de piloto.");
    newLevel();
  }
  function end(win) {
    s.over = true;
    s.paused = true;
    clearInterval(s.interval);
    $("endTitle").textContent = win ? "¡Llegaron a un lugar seguro!" : "Pausa y nuevo intento";
    $("endText").textContent = win
      ? "Alex encontró personas de confianza y llegó a un lugar seguro. Pedir apoyo es una decisión valiente."
      : "Las entidades cerraron la ruta por ahora. Reinicien y prueben otro camino; Alex puede seguir buscando apoyo.";
    $("ending").hidden = false;
  }
  function tick() {
    if (!s.started || s.paused) return;
    s.tick++;
    movePlayer();
    if (s.tick % 4 === 0) moveEntities();
    if (s.shield > 0) s.shield--;
    if (s.tick % 10 === 0) {
      s.remaining--;
      if (s.remaining <= 0) {
        s.remaining = 300;
        s.entities.forEach((e) => {
          e.x = e.home.x;
          e.y = e.home.y;
        });
        $("message").textContent = "¡Momento de respiro! Las entidades regresan a sus rincones.";
        toast("Pausa de las entidades");
      }
    }
    render();
    hud();
  }
  function start() {
    if (s.over) {
      reset();
      return;
    }
    s.started = true;
    s.paused = false;
    $("intro").hidden = true;
    $("message").textContent =
      "¡En marcha! El salón puede guiar a Alex y pedir pausa en cualquier momento.";
    clearInterval(s.interval);
    s.interval = setInterval(tick, 180);
  }
  function reset() {
    clearInterval(s.interval);
    s = {
      level: 0,
      lives: 3,
      grid: [],
      items: new Map(),
      shields: new Set(),
      player: { x: 1, y: 1 },
      entities: [],
      dir: null,
      next: null,
      tick: 0,
      started: false,
      paused: true,
      remaining: 300,
      shield: 0,
      interval: null,
      over: false,
    };
    $("ending").hidden = true;
    $("intro").hidden = false;
    newLevel();
  }
  function setDir(dir) {
    s.next = dir;
    if (!s.started) start();
  }
  function toast(t) {
    $("toast").textContent = t;
    setTimeout(() => {
      if ($("toast").textContent === t) $("toast").textContent = "";
    }, 1300);
  }
  function pause() {
    if (!s.started) return;
    s.paused = !s.paused;
    $("pause").textContent = s.paused ? "▶ SEGUIR" : "Ⅱ PAUSA";
    $("message").textContent = s.paused ? "Pausa de equipo: planeen otra ruta." : "¡Adelante!";
  }
  document.addEventListener("keydown", (e) => {
    const map = {
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
    if (map[e.key]) {
      e.preventDefault();
      setDir(map[e.key]);
    } else if (e.key.toLowerCase() === "p") pause();
  });
  document.querySelectorAll("[data-dir]").forEach((b) =>
    b.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      setDir(b.dataset.dir);
    }),
  );
  $("start").onclick = start;
  $("go").onclick = start;
  $("again").onclick = reset;
  $("pause").onclick = pause;
  $("project").onclick = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };
  newLevel();
})();
