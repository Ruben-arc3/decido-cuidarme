(function () {
  "use strict";
  const W = 17,
    H = 11,
    LEVELS = ["Patio de la fiesta", "Zona de música", "Punto seguro"];
  const DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  let s = {
    level: 0,
    lives: 3,
    grid: [],
    dots: new Set(),
    dotIcons: new Map(),
    powers: new Set(),
    player: { x: 1, y: 1 },
    enemies: [],
    dir: null,
    next: null,
    tick: 0,
    started: false,
    paused: true,
    remaining: 300,
    shield: 0,
    interval: null,
    won: false,
    sound: false,
  };
  const $ = (id) => document.getElementById(id),
    maze = $("maze");
  function key(x, y) {
    return x + "," + y;
  }
  function floor(x, y) {
    return x >= 0 && y >= 0 && x < W && y < H && s.grid[y][x] === " ";
  }
  function carve() {
    const g = Array.from({ length: H }, () => Array(W).fill("#"));
    const seen = new Set(),
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
            ([nx, ny]) => nx > 0 && ny > 0 && ny < H - 1 && nx < W - 1 && !seen.has(key(nx, ny)),
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
    // Extra openings make routes less predictable and give the group alternatives.
    for (let i = 0; i < 24; i++) {
      const x = 2 + Math.floor(Math.random() * (W - 4)),
        y = 2 + Math.floor(Math.random() * (H - 4));
      if (
        g[y][x] === "#" &&
        ((g[y][x - 1] === " " && g[y][x + 1] === " ") ||
          (g[y - 1][x] === " " && g[y + 1][x] === " "))
      )
        g[y][x] = " ";
    }
    return g;
  }
  function newLevel() {
    s.grid = carve();
    s.player = { x: 1, y: 1 };
    s.dir = null;
    s.next = null;
    s.tick = 0;
    s.shield = 0;
    const exit = [15, 9];
    s.exit = exit;
    // Keep the first portion of the maze readable and reserve cells for the pursuers.
    const enemyStarts = [
      [15, 1],
      [1, 9],
      [13, 3],
    ];
    s.enemies = enemyStarts.map((p, i) => ({
      x: p[0],
      y: p[1],
      home: { x: p[0], y: p[1] },
      name: ["Oferta de alcohol", "Oferta de drogas", "Presión para consumir"][i],
      icon: ["🍺", "💊", "⚠️"][i],
      cls: ["", "g2", "g3"][i],
    }));
    s.dotIcons = new Map([
      [key(3, 5), "📱"],
      [key(9, 5), "🤝"],
      [key(13, 5), "🚌"],
    ]);
    s.dots = new Set(s.dotIcons.keys());
    s.powers = new Set([key(5, 5), key(9, 3), key(11, 5)]);
    $("level").textContent = s.level + 1 + " / 3";
    $("levelName").textContent = "Nivel " + (s.level + 1) + " · " + LEVELS[s.level];
    $("exitHint").textContent = "Salida cerrada";
    $("message").textContent = [
      "Encuentren teléfono, acuerdo de grupo y transporte para salir.",
      "La zona musical tiene atajos. Las presiones avanzan despacio.",
      "Último tramo: reúnan los 3 objetos y salgan en grupo.",
    ][s.level];
    render();
    hud();
  }
  function render() {
    maze.dataset.level = String(s.level + 1);
    maze.innerHTML = "";
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const c = document.createElement("div");
        c.className = "cell" + (s.grid[y][x] === "#" ? " wall" : "");
        if (s.dots.has(key(x, y))) {
          const d = document.createElement("i");
          d.className = "dot";
          d.textContent = s.dotIcons.get(key(x, y)) || "🤝";
          c.appendChild(d);
        }
        if (s.powers.has(key(x, y))) {
          const p = document.createElement("i");
          p.className = "power";
          p.textContent = "🛡️";
          c.appendChild(p);
        }
        maze.appendChild(c);
      }
    const layer = document.createElement("div");
    layer.className = "actors";
    const put = (x, y, cls, label) => {
      const a = document.createElement("div");
      a.className = "actor " + cls + (cls === "hero" && s.shield > 0 ? " shield" : "");
      a.style.left = ((x + 0.5) / W) * 100 + "%";
      a.style.top = ((y + 0.5) / H) * 100 + "%";
      a.setAttribute("aria-label", label);
      if (cls === "hero") a.textContent = "🧑‍🎤";
      else if (cls.includes("ghost")) {
        const e = s.enemies.find((q) => q.x === x && q.y === y);
        a.textContent = e ? e.icon : "💬";
      }
      layer.appendChild(a);
    };
    // Exit is a door that brightens as the group collects signs.
    const door = document.createElement("div");
    door.className = "actor door" + (s.dots.size === 0 ? " open" : " locked");
    door.textContent = "🚪";
    door.style.left = ((s.exit[0] + 0.5) / W) * 100 + "%";
    door.style.top = ((s.exit[1] + 0.5) / H) * 100 + "%";
    door.style.fontSize = "clamp(13px,2.4vw,22px)";
    layer.appendChild(door);
    s.enemies.forEach((e) => put(e.x, e.y, "ghost " + e.cls, e.name));
    put(s.player.x, s.player.y, "hero", "Alex");
    maze.appendChild(layer);
  }
  function hud() {
    $("lives").textContent = "♥ ".repeat(s.lives) || "—";
    $("dots").textContent = 3 - s.dots.size + "/3";
    $("time").textContent =
      String(Math.floor(s.remaining / 60)).padStart(2, "0") +
      ":" +
      String(s.remaining % 60).padStart(2, "0");
    $("exitHint").textContent = s.dots.size
      ? s.dots.size === 1
        ? "Falta 1 objeto"
        : "Faltan " + s.dots.size + " objetos"
      : "¡Salida abierta!";
  }
  function movePlayer() {
    if (s.next && DIR[s.next]) {
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
    const k = key(s.player.x, s.player.y);
    const nearbyDot = [...s.dots].find((pos) => {
      const [x, y] = pos.split(",").map(Number);
      return Math.abs(x - s.player.x) + Math.abs(y - s.player.y) <= 1;
    });
    if (nearbyDot) {
      s.dots.delete(nearbyDot);
      const item = s.dotIcons.get(nearbyDot);
      const names = {
        "📱": "teléfono del adulto de confianza",
        "🤝": "acuerdo con amistades",
        "🚌": "plan de regreso",
      };
      $("message").textContent =
        s.dots.size === 0
          ? "¡Listo! Los tres objetos abren la salida."
          : "Objeto recogido: " + names[item] + ".";
      if (s.dots.size === 0) say("¡Los tres objetos abren la salida!");
      else say("Objeto recogido");
      hud();
    }
    const nearbyPower = [...s.powers].find((pos) => {
      const [x, y] = pos.split(",").map(Number);
      return Math.abs(x - s.player.x) + Math.abs(y - s.player.y) <= 1;
    });
    if (nearbyPower) {
      s.powers.delete(nearbyPower);
      s.shield = 18;
      $("message").textContent =
        "Escudo activado por 3 segundos. ¡Aprovechen para cambiar de ruta!";
      say("Escudo activado");
      hud();
    }
    if (s.dots.size === 0 && s.player.x === s.exit[0] && s.player.y === s.exit[1]) nextLevel();
  }
  function bfsNext(from, target) {
    const q = [from],
      prev = new Map([[key(from.x, from.y), null]]);
    let found = null;
    while (q.length) {
      const p = q.shift();
      if (p.x === target.x && p.y === target.y) {
        found = p;
        break;
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
    if (!found) return null;
    let k = key(found.x, found.y),
      parent = prev.get(k);
    while (parent && parent !== key(from.x, from.y)) {
      k = parent;
      parent = prev.get(k);
    }
    return k.split(",").map(Number);
  }
  function moveEnemies() {
    s.enemies.forEach((e) => {
      const options = Object.values(DIR)
        .map(([dx, dy]) => [e.x + dx, e.y + dy])
        .filter(([x, y]) => floor(x, y));
      let step = null;
      // Las presiones deambulan la mayor parte del tiempo y siguen a Alex de vez en cuando.
      if (s.shield > 0) step = bfsNext(e, e.home);
      else if (s.tick % 6 === 0) step = bfsNext(e, s.player);
      if (!step && options.length) step = options[Math.floor(Math.random() * options.length)];
      if (step) {
        e.x = step[0];
        e.y = step[1];
      }
    });
    const hit = s.enemies.some((e) => e.x === s.player.x && e.y === s.player.y);
    if (hit && s.shield <= 0) {
      s.lives--;
      if (s.lives <= 0) {
        finish(false);
        return;
      }
      s.player = { x: 1, y: 1 };
      s.enemies.forEach((e) => {
        e.x = e.home.x;
        e.y = e.home.y;
      });
      s.shield = 18;
      $("message").textContent =
        "Alex tomó aire y vuelve con el equipo. ¡Quedan " + s.lives + " vidas!";
      say("Una vida menos; seguimos juntos.");
      hud();
    }
  }
  function nextLevel() {
    s.level++;
    if (s.level >= 3) {
      finish(true);
      return;
    }
    say("¡Nivel superado! Cambien de piloto.");
    newLevel();
  }
  function finish(win) {
    s.won = win;
    s.paused = true;
    clearInterval(s.interval);
    $("endTitle").textContent = win ? "¡Salieron en equipo!" : "Una pausa para reorganizarse";
    $("endText").textContent = win
      ? "Alex llegó a un lugar seguro. El grupo combinó observación, comunicación y decisiones para salir de los tres espacios."
      : "Las ofertas de alcohol o drogas alcanzaron a Alex esta vez. Reinicien y prueben otra ruta; pedir apoyo, decir no y salir acompañado siguen siendo opciones.";
    $("endOverlay").hidden = false;
  }
  function tick() {
    if (!s.started || s.paused) return;
    s.tick++;
    movePlayer();
    if (s.tick % 3 === 0) moveEnemies();
    if (s.shield > 0) s.shield--;
    if (s.tick % 10 === 0) {
      s.remaining = Math.max(0, s.remaining - 1);
      if (s.remaining === 0) {
        s.enemies.forEach((e) => {
          e.x = e.home.x;
          e.y = e.home.y;
        });
        $("message").textContent =
          "¡Tiempo de apoyo! Las presiones se retiran un momento: aprovechen para seguir.";
        s.remaining = 300;
        say("Apoyo extra activado.");
      }
    }
    render();
    hud();
  }
  function start() {
    if (s.won) {
      reset();
      return;
    }
    s.started = true;
    s.paused = false;
    $("overlay").hidden = true;
    $("message").textContent =
      "¡En marcha! Recoge los objetos al tocarlos o pasar junto a ellos; evita las amenazas y llega a la puerta.";
    clearInterval(s.interval);
    s.interval = setInterval(tick, 175);
  }
  function reset() {
    clearInterval(s.interval);
    s = {
      level: 0,
      lives: 3,
      grid: [],
      dots: new Set(),
      dotIcons: new Map(),
      powers: new Set(),
      player: { x: 1, y: 1 },
      enemies: [],
      dir: null,
      next: null,
      tick: 0,
      started: false,
      paused: true,
      remaining: 300,
      shield: 0,
      interval: null,
      won: false,
      sound: false,
    };
    $("endOverlay").hidden = true;
    $("overlay").hidden = false;
    newLevel();
  }
  function setDir(d) {
    s.next = d;
    if (!s.started) start();
  }
  function say(t) {
    $("toast").textContent = t;
    setTimeout(() => {
      if ($("toast").textContent === t) $("toast").textContent = "";
    }, 1400);
    if (s.sound) {
      try {
        const C = window.AudioContext || window.webkitAudioContext,
          c = new C(),
          o = c.createOscillator(),
          g = c.createGain();
        o.frequency.value = 660;
        g.gain.value = 0.045;
        o.connect(g);
        g.connect(c.destination);
        o.start();
        o.stop(c.currentTime + 0.09);
      } catch (e) {}
    }
  }
  function pause() {
    if (!s.started) return;
    s.paused = !s.paused;
    $("pause").textContent = s.paused ? "▶ Continuar" : "Ⅱ Pausar";
    $("message").textContent = s.paused
      ? "Pausa de equipo: acuerden su siguiente ruta."
      : "¡Seguimos!";
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
    } else if (e.key.toLowerCase() === "p") {
      pause();
    }
  });
  document.querySelectorAll("[data-dir]").forEach((b) => {
    b.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      setDir(b.dataset.dir);
    });
  });
  $("start").onclick = start;
  $("overlayStart").onclick = start;
  $("pause").onclick = pause;
  $("again").onclick = reset;
  $("project").onclick = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };
  $("sound").onclick = () => {
    s.sound = !s.sound;
    $("sound").textContent = "♫ Sonido: " + (s.sound ? "sí" : "no");
  };
  newLevel();
})();
