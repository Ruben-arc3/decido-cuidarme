(function () {
  "use strict";
  const $ = (id) => document.getElementById(id),
    scene = $("scene"),
    world = $("world");
  const LEVELS = ["PATIO DE LA ESCUELA", "CALLES DEL BARRIO", "CENTRO COMUNITARIO"];
  const supports = [
    { icon: "📱", name: "teléfono de confianza" },
    { icon: "🤝", name: "amistad que acompaña" },
    { icon: "📍", name: "lugar seguro" },
  ];
  let s = {
    level: 0,
    lives: 3,
    started: false,
    paused: true,
    over: false,
    tick: 0,
    time: 300,
    player: { x: 7, y: 87, vx: 0, vy: 0, ground: true },
    platforms: [],
    items: [],
    enemy: [],
    bridges: 0,
    shield: 0,
    interval: null,
    held: {},
  };
  const levels = [
    {
      platforms: [
        [0, 83, 24],
        [31, 75, 18],
        [56, 66, 18],
        [79, 77, 21],
        [105, 65, 20],
        [132, 74, 22],
        [159, 63, 20],
        [185, 77, 18],
        [209, 67, 27],
      ],
      items: [
        [36, 76],
        [110, 66],
        [191, 78],
      ],
      bridges: [
        [49, 69, 8],
        [125, 70, 8],
        [203, 70, 8],
      ],
      entities: [
        { x: 67, y: 67, icon: "🔒", name: "Control" },
        { x: 151, y: 58, icon: "🤫", name: "Silencio" },
      ],
    },
    {
      platforms: [
        [0, 83, 19],
        [25, 73, 18],
        [48, 62, 18],
        [73, 75, 20],
        [98, 60, 18],
        [123, 70, 20],
        [148, 57, 19],
        [174, 74, 20],
        [198, 62, 20],
        [220, 76, 16],
      ],
      items: [
        [28, 74],
        [103, 61],
        [202, 63],
      ],
      bridges: [
        [43, 65, 7],
        [116, 68, 8],
        [218, 69, 8],
      ],
      entities: [
        { x: 58, y: 63, icon: "🌫️", name: "Miedo" },
        { x: 162, y: 58, icon: "🕸️", name: "Aislamiento" },
      ],
    },
    {
      platforms: [
        [0, 83, 22],
        [28, 74, 17],
        [50, 61, 18],
        [74, 72, 17],
        [96, 58, 18],
        [120, 70, 18],
        [144, 56, 18],
        [168, 68, 18],
        [191, 55, 18],
        [211, 72, 25],
      ],
      items: [
        [31, 75],
        [101, 59],
        [198, 56],
      ],
      bridges: [
        [45, 64, 7],
        [114, 67, 8],
        [209, 67, 8],
      ],
      entities: [
        { x: 61, y: 62, icon: "🔒", name: "Control" },
        { x: 130, y: 57, icon: "🌫️", name: "Miedo" },
        { x: 177, y: 69, icon: "🕸️", name: "Aislamiento" },
      ],
    },
  ];
  function rect(x, y, w, h) {
    return { x, y, w, h };
  }
  function visualY(y) {
    return 12 + Math.max(0, y - 45) * 0.75;
  }
  function makeWorld() {
    const L = levels[s.level];
    s.platforms = L.platforms.map(([x, b, w]) => rect(x, b, w, 4));
    s.items = L.items.map((p, i) => ({
      x: p[0],
      y: p[1],
      bridge: L.bridges[i],
      got: false,
      ...supports[i],
    }));
    s.enemy = L.entities.map((e, i) => ({
      ...e,
      homeX: e.x,
      dir: i % 2 ? 1 : -1,
      phase: Math.random() * 5,
    }));
    s.player = { x: 7, y: 87, vx: 0, vy: 0, ground: true };
    s.bridges = 0;
    s.shield = 0;
    s.tick = 0;
    render();
    hud();
  }
  function render() {
    world.innerHTML = "";
    s.platforms.forEach((p) => {
      const el = document.createElement("div");
      el.className = "plat" + (p.bridge ? " bridge" : "");
      el.style.left = (p.x / 240) * 100 + "%";
      el.style.bottom = visualY(p.y) + "%";
      el.style.width = (p.w / 240) * 100 + "%";
      world.appendChild(el);
    });
    s.items.forEach((o) => {
      if (o.got) return;
      const el = document.createElement("div");
      el.className = "item";
      el.textContent = o.icon;
      el.title = o.name;
      el.style.left = (o.x / 240) * 100 + "%";
      el.style.bottom = visualY(o.y) + "%";
      world.appendChild(el);
    });
    s.enemy.forEach((e, i) => {
      const el = document.createElement("div");
      el.className = "entity e" + ((i % 3) + 1);
      el.textContent = e.icon;
      el.title = e.name;
      el.style.left = (e.x / 240) * 100 + "%";
      el.style.bottom = visualY(e.y) + "%";
      world.appendChild(el);
    });
    const pl = document.createElement("div");
    pl.className = "player" + (s.shield > 0 ? " safe" : "");
    pl.textContent = "🧑";
    pl.style.left = (s.player.x / 240) * 100 + "%";
    pl.style.bottom = visualY(s.player.y) + "%";
    pl.title = "Alex";
    world.appendChild(pl);
  }
  function hud() {
    $("level").textContent = s.level + 1 + " / 3";
    $("lives").textContent = "♥ ".repeat(s.lives) || "—";
    $("count").textContent = s.items.filter((i) => i.got).length + " / 3";
    $("gate").textContent =
      s.bridges === 0
        ? "BUSCA LOS APOYOS"
        : s.bridges < 3
          ? "PUENTE " + s.bridges + " / 3 ACTIVADO"
          : "¡RUTA ABIERTA!";
    $("clock").textContent =
      String(Math.floor(s.time / 60)).padStart(2, "0") + ":" + String(s.time % 60).padStart(2, "0");
  }
  function toast(t) {
    $("toast").textContent = t;
    setTimeout(() => {
      if ($("toast").textContent === t) $("toast").textContent = "";
    }, 1200);
  }
  function pickup() {
    s.items.forEach((o, i) => {
      if (!o.got && Math.abs(s.player.x - (o.x + 2)) < 5 && Math.abs(s.player.y - (o.y + 3)) < 8) {
        o.got = true;
        s.bridges++;
        s.platforms.push({ ...rect(o.bridge[0], o.bridge[1], o.bridge[2], 3), bridge: true });
        toast(o.name + " · puente activado");
        $("message").textContent = "¡" + o.name + "! Se formó un puente de apoyo.";
      }
    });
    if (s.items.every((i) => i.got)) $("gate").textContent = "¡RUTA ABIERTA! · BUSCA EL FINAL";
  }
  function collide(a, b) {
    return a.x < b.x + b.w && a.x + 5 > b.x && a.y < b.y + b.h && a.y + 8 > b.y;
  }
  function physics() {
    const p = s.player;
    const speed = s.level === 2 ? 0.92 : 0.82;
    p.vx = ((s.held.right ? 1 : 0) - (s.held.left ? 1 : 0)) * speed;
    if (s.held.jump && p.ground) {
      p.vy = 4.4;
      p.ground = false;
      s.held.jump = false;
    }
    p.x = Math.max(0, Math.min(235, p.x + p.vx));
    p.vy -= 0.22;
    p.y += p.vy;
    p.ground = false;
    for (const plat of s.platforms) {
      if (
        p.vy <= 0 &&
        p.x + 5 > plat.x &&
        p.x < plat.x + plat.w &&
        p.y <= plat.y + plat.h &&
        p.y >= plat.y + plat.h - 5
      ) {
        p.y = plat.y + plat.h;
        p.vy = 0;
        p.ground = true;
      }
    }
    // Gentle auto-catch keeps classroom play forgiving while the pilot learns the jumps.

    pickup();
    if (p.x > 232 && s.items.every((i) => i.got)) {
      nextLevel();
    }
    if (p.y < -8) {
      loseLife();
    }
  }
  function moveEntities() {
    s.enemy.forEach((e) => {
      e.phase += 0.08;
      e.x += e.dir * (0.78 + s.level * 0.12);
      if (e.x < e.homeX - 16 || e.x > e.homeX + 16) e.dir *= -1;
      e.y += Math.sin(e.phase) * 0.12;
    });
    if (s.shield > 0) s.shield--;
    else if (s.enemy.some((e) => Math.abs(s.player.x - e.x) < 5 && Math.abs(s.player.y - e.y) < 9))
      loseLife();
  }
  function loseLife() {
    if (s.shield > 0) return;
    s.lives--;
    if (s.lives <= 0) {
      end(false);
      return;
    }
    s.player = { x: 7, y: 87, vx: 0, vy: 0, ground: true };
    s.shield = 18;
    s.enemy.forEach((e) => (e.x = e.homeX));
    toast("Energía -1 · tienes un instante protegido");
    $("message").textContent = "Alex toma aire y vuelve a intentarlo. La ruta sigue abierta.";
    hud();
  }
  function nextLevel() {
    s.level++;
    if (s.level >= 3) {
      end(true);
      return;
    }
    toast("Nivel superado · cambien de piloto");
    $("message").textContent = "Nuevo escenario: observen las plataformas y acuerden la ruta.";
    makeWorld();
  }
  function end(win) {
    s.over = true;
    s.paused = true;
    clearInterval(s.interval);
    $("endTitle").textContent = win ? "¡Llegaron al punto de apoyo!" : "Pausa y nuevo intento";
    $("endText").textContent = win
      ? "Alex encontró a una persona de confianza y llegó a un lugar seguro. Buscar apoyo fue parte de la ruta."
      : "Las entidades cerraron el paso por ahora. Reinicien y prueben otro recorrido; Alex puede seguir buscando apoyo.";
    $("ending").hidden = false;
  }
  function tick() {
    if (!s.started || s.paused) return;
    s.tick++;
    if (s.tick % 6 === 0) {
      s.time--;
      if (s.time <= 0) {
        s.time = 300;
        toast("¡Pausa de respiro!");
        s.enemy.forEach((e) => (e.x = e.homeX));
      }
    }
    physics();
    if (s.tick % 3 === 0) moveEntities();
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
    $("message").textContent = "¡En marcha! Usa saltos cortos y deja que el grupo te guíe.";
    clearInterval(s.interval);
    s.interval = setInterval(tick, 55);
  }
  function reset() {
    clearInterval(s.interval);
    s = {
      level: 0,
      lives: 3,
      started: false,
      paused: true,
      over: false,
      tick: 0,
      time: 300,
      player: { x: 7, y: 87, vx: 0, vy: 0, ground: true },
      platforms: [],
      items: [],
      enemy: [],
      bridges: 0,
      shield: 0,
      interval: null,
      held: {},
    };
    $("ending").hidden = true;
    $("intro").hidden = false;
    makeWorld();
  }
  function setKey(key, on) {
    if (key === "left" || key === "right") s.held[key] = on;
    if (key === "jump" && on) s.held.jump = true;
  }
  document.addEventListener("keydown", (e) => {
    const k = e.key;
    if (["ArrowLeft", "a", "A"].includes(k)) {
      e.preventDefault();
      setKey("left", true);
    } else if (["ArrowRight", "d", "D"].includes(k)) {
      e.preventDefault();
      setKey("right", true);
    } else if (["ArrowUp", "w", "W", " "].includes(k)) {
      e.preventDefault();
      if (!s.started) start();
      setKey("jump", true);
    } else if (k.toLowerCase() === "p") pause();
  });
  document.addEventListener("keyup", (e) => {
    const k = e.key;
    if (["ArrowLeft", "a", "A"].includes(k)) setKey("left", false);
    if (["ArrowRight", "d", "D"].includes(k)) setKey("right", false);
  });
  document.querySelectorAll("[data-dir]").forEach((b) => {
    const d = b.dataset.dir;
    b.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      setKey(d, true);
      if (d === "jump" && !s.started) start();
    });
    b.addEventListener("pointerup", () => setKey(d, false));
    b.addEventListener("pointerleave", () => setKey(d, false));
  });
  $("go").onclick = start;
  $("start").onclick = start;
  $("again").onclick = reset;
  $("pause").onclick = pause;
  function pause() {
    if (!s.started) return;
    s.paused = !s.paused;
    $("pause").textContent = s.paused ? "▶ SEGUIR" : "Ⅱ PAUSA";
    $("message").textContent = s.paused
      ? "Pausa de equipo: planeen el siguiente salto."
      : "¡Vamos!";
  }
  $("project").onclick = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };
  makeWorld();
})();
