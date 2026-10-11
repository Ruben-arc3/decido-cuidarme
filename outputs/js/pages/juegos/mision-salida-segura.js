var levels = [
  {
    name: "Zona 1 · Reúne a tu grupo",
    tag: "ENCUENTRA A TU EQUIPO",
    gate: "PUNTO<br>DE ENCUENTRO",
    objective:
      "Recoge tres apoyos para reunirte con tu grupo: un punto acordado, una amistad de confianza y el teléfono del equipo.",
    items: [
      ["📍", "Punto de encuentro", 17, 35],
      ["🤝", "Amistad de confianza", 49, 66],
      ["📱", "Teléfono del grupo", 75, 26],
    ],
    crowds: [
      [34, 49, 1, 17],
      [62, 41, -1, 19],
      [80, 70, 1, 16],
    ],
    help: "Navegación: busca a la derecha. Apoyos: ¡hay un recurso arriba!",
  },
  {
    name: "Zona 2 · Planea la salida",
    tag: "RUTA Y TRANSPORTE",
    gate: "SALIDA<br>TRANQUILA",
    objective:
      "Ya reunidos, localicen el transporte planeado, el camino menos concurrido y el contacto de confianza antes de salir.",
    items: [
      ["🚌", "Transporte acordado", 22, 27],
      ["🛣️", "Ruta tranquila", 52, 74],
      ["☎️", "Contacto de confianza", 78, 38],
    ],
    crowds: [
      [27, 58, -1, 19],
      [47, 35, 1, 15],
      [68, 58, -1, 18],
    ],
    help: "Apoyos: mira cerca del camino. Equipo: nadie se queda atrás.",
  },
  {
    name: "Zona 3 · Salgan juntos",
    tag: "ACOMPAÑA AL EQUIPO",
    gate: "LUGAR<br>SEGURO",
    objective:
      "En la última zona, acompaña al grupo hasta el punto de apoyo. Junta el teléfono, la persona de confianza y la señal del lugar seguro.",
    items: [
      ["📲", "Teléfono disponible", 17, 69],
      ["🧑‍🏫", "Persona de apoyo", 50, 30],
      ["🛟", "Señal de lugar seguro", 76, 66],
    ],
    crowds: [
      [31, 36, 1, 18],
      [57, 54, -1, 17],
      [81, 36, 1, 15],
    ],
    help: "El equipo marca el ritmo: avancen juntos hasta la señal segura.",
  },
];
var level = 0,
  px = 8,
  py = 76,
  items = 0,
  score = 0,
  keys = {},
  seconds = 300,
  startTime = 0,
  lastTime = 0,
  lastToast = 0,
  hitCooldown = 0,
  locked = false,
  active = false,
  extraHelp = false;
function id(s) {
  return document.getElementById(s);
}
function startGame() {
  level = 0;
  score = 0;
  items = 0;
  px = 8;
  py = 76;
  seconds = 300;
  startTime = Date.now();
  lastTime = 0;
  extraHelp = false;
  locked = false;
  active = true;
  id("home").style.display = "none";
  id("finish").style.display = "none";
  id("game").className = "game active";
  loadLevel();
  requestAnimationFrame(loop);
}
function loadLevel() {
  var l = levels[level];
  items = 0;
  px = 8;
  py = 76;
  id("scene").className = "scene zone" + (level + 1);
  id("zone-name").textContent = l.name;
  id("stage-label").textContent = l.tag;
  id("gate-label").innerHTML = l.gate;
  id("gate").className = "gate";
  id("objective").textContent = l.objective;
  id("zone-help").textContent = l.help;
  id("items-count").textContent = "APOYOS 0/3";
  id("progress-fill").style.width = (level / 3) * 100 + "%";
  id("team-meter").style.width = (score / 9) * 100 + "%";
  id("prompt").textContent = "Busca los 3 apoyos y reúnete con tu grupo.";
  id("player").style.left = px + "%";
  id("player").style.top = py + "%";
  document.querySelectorAll(".teamrole").forEach(function (el) {
    el.classList.remove("active");
  });
  var role = ["role-nav", "role-scan", "role-team"][level];
  id(role).classList.add("active");
  id("pickups").innerHTML = l.items
    .map(function (it, n) {
      return (
        '<div class="pickup" data-item="' +
        n +
        '" style="left:' +
        it[2] +
        "%;top:" +
        it[3] +
        '%"><span>' +
        it[0] +
        "</span><small>" +
        it[1] +
        "</small></div>"
      );
    })
    .join("");
  id("crowds").innerHTML = l.crowds
    .map(function (o, n) {
      return (
        '<div class="crowd" data-crowd="' +
        n +
        '" style="left:' +
        o[0] +
        "%;top:" +
        o[1] +
        '%"><span>' +
        (n % 2 ? "👥" : "✦") +
        "</span></div>"
      );
    })
    .join("");
  toast(l.tag + " · ¡el curso guía la ruta!");
}
function loop(t) {
  if (!active) return;
  if (!lastTime) lastTime = t;
  var dt = Math.min((t - lastTime) / 1000, 0.05);
  lastTime = t;
  if (!locked) {
    if (seconds > 0) {
      seconds -= dt;
      if (seconds < 0) seconds = 0;
      updateClock();
    } else if (!extraHelp) {
      extraHelp = true;
      toast(
        "Apoyo del equipo activado: la ruta se ilumina y las aglomeraciones se mueven más despacio. La misión continúa.",
      );
      id("status").textContent =
        "Se activó el apoyo extra. Mantén al equipo unido y sigue hacia la salida.";
    }
    var left = keys.arrowleft || keys.left || keys.a,
      right = keys.arrowright || keys.right || keys.d,
      up = keys.arrowup || keys.up || keys.w,
      down = keys.arrowdown || keys.down || keys.s;
    var sp = (extraHelp ? 12 : 10) * dt;
    if (left) px -= sp;
    if (right) px += sp;
    if (up) py -= sp * 1.3;
    if (down) py += sp * 1.3;
    px = Math.max(4, Math.min(95, px));
    py = Math.max(12, Math.min(91, py));
    var p = id("player");
    p.style.left = px + "%";
    p.style.top = py + "%";
    p.classList.toggle("walk", !!(left || right || up || down));
    moveCrowds(t);
    collectItems();
    checkCrowd();
    checkGate();
  }
  requestAnimationFrame(loop);
}
function updateClock() {
  var s = Math.ceil(seconds),
    m = Math.floor(s / 60),
    r = s % 60;
  id("clock").textContent = (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r;
  if (s < 60) id("clock").style.color = "#ffd166";
}
function moveCrowds(t) {
  var nodes = document.querySelectorAll(".crowd");
  var l = levels[level];
  nodes.forEach(function (n, i) {
    var o = l.crowds[i],
      speed = extraHelp ? 0.00055 : 0.00105,
      shift = Math.sin(t * speed * o[2] + i * 2) * o[3];
    n.style.left = Math.max(8, Math.min(85, o[0] + shift)) + "%";
  });
}
function worldDistance(el) {
  var rect = id("scene").getBoundingClientRect(),
    box = el.getBoundingClientRect(),
    cx = ((box.left + box.width / 2 - rect.left) / rect.width) * 100,
    cy = ((box.top + box.height / 2 - rect.top) / rect.height) * 100;
  return Math.hypot(((cx - px) * rect.width) / 100, ((cy - py) * rect.height) / 100);
}
function collectItems() {
  var arr = document.querySelectorAll(".pickup");
  arr.forEach(function (el) {
    if (el.classList.contains("taken")) return;
    if (worldDistance(el) < 37) {
      el.classList.add("taken");
      items++;
      score++;
      id("items-count").textContent = "APOYOS " + items + "/3";
      id("progress-fill").style.width = ((level + items / 3) / 3) * 100 + "%";
      id("team-meter").style.width = (score / 9) * 100 + "%";
      id("objective").textContent =
        "¡Buen hallazgo! " +
        (3 - items) +
        " apoyo" +
        (3 - items === 1 ? "" : "s") +
        " restante" +
        (3 - items === 1 ? "" : "s") +
        " para abrir la salida.";
      toast("APOYO ENCONTRADO · " + levels[level].items[Number(el.dataset.item)][1]);
      if (items === 3) {
        id("gate").classList.add("ready");
        id("prompt").textContent = "¡Portón abierto! Llega hasta la salida brillante.";
        id("objective").textContent =
          "Ya reunieron todo. Acércate al portón brillante y pulsa E o espacio.";
      }
    }
  });
}
function checkCrowd() {
  if (Date.now() < hitCooldown) return;
  var crowds = document.querySelectorAll(".crowd");
  crowds.forEach(function (el) {
    if (worldDistance(el) < 49) {
      hitCooldown = Date.now() + 950;
      px = Math.max(7, px - 2);
      id("player").style.left = px + "%";
      id("status").textContent = "Sam se abrió paso sin empujar. Cambien de ruta y sigan juntos.";
      toast("Aglomeración: rodea la zona por un camino más despejado.");
      setTimeout(function () {
        id("status").textContent =
          "Cada apoyo suma al plan. Si Sam choca con una aglomeración, se frena un momento y puede seguir.";
      }, 2300);
    }
  });
}
function checkGate() {
  if (items === 3 && worldDistance(id("gate")) < 65) {
    if (level < 2) {
      level++;
      loadLevel();
    } else finishGame();
  }
}
function act() {
  if (items < 3) {
    toast("Primero reúnan los 3 apoyos; luego el portón se abrirá.");
    return;
  }
  if (worldDistance(id("gate")) < 125) {
    if (level < 2) {
      level++;
      loadLevel();
    } else finishGame();
  } else toast("Acércate al portón brillante, a la derecha.");
}
function finishGame() {
  active = false;
  id("game").className = "game";
  id("finish").style.display = "block";
  id("score-out").textContent = score;
  var elapsed = Math.max(0, Math.floor((Date.now() - startTime) / 1000)),
    m = Math.floor(elapsed / 60),
    s = elapsed % 60;
  id("time-out").textContent = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}
function restart() {
  id("finish").style.display = "none";
  id("home").style.display = "grid";
  id("game").className = "game";
  active = false;
}
function toast(s) {
  var t = id("toast");
  t.textContent = s;
  t.className = "toast show";
  clearTimeout(lastToast);
  lastToast = setTimeout(function () {
    t.className = "toast";
  }, 1800);
}
function showSafety() {
  locked = true;
  id("safety").className = "overlay show";
}
function hideSafety() {
  id("safety").className = "overlay";
  locked = false;
  lastTime = 0;
}
function toggleProject() {
  document.body.classList.toggle("screen-project");
  if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
    var p = document.documentElement.requestFullscreen();
    if (p && p.catch) p.catch(function () {});
  } else if (document.fullscreenElement && document.exitFullscreen)
    document.exitFullscreen().catch(function () {});
}
function down(k) {
  keys[k] = true;
}
function up(k) {
  keys[k] = false;
}
document.addEventListener("keydown", function (e) {
  var k = e.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].indexOf(k) >= 0) e.preventDefault();
  if (k === "e" || k === " ") act();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].indexOf(k) >= 0)
    down(k);
});
document.addEventListener("keyup", function (e) {
  up(e.key.toLowerCase());
});
document.querySelectorAll("[data-dir]").forEach(function (b) {
  b.onpointerdown = function (e) {
    e.preventDefault();
    down(b.dataset.dir);
  };
  b.onpointerup =
    b.onpointercancel =
    b.onpointerleave =
      function () {
        up(b.dataset.dir);
      };
});
id("start").onclick = startGame;
