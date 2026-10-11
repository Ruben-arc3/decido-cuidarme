var leads = [
  {
    id: "orientacion",
    name: "Sala de orientación",
    icon: "✳",
    x: 21,
    y: 39,
    room: "office",
    clue: "Plan de apoyo: escuchar en privado · valorar seguridad · activar la ruta de protección",
    object: "🪪",
    puzzle:
      "Alex cuenta que en casa hay gritos, insultos y amenazas, y que algunas discusiones terminan con empujones entre adultos. Tiene miedo de que hablar provoque más problemas. ¿Qué debería hacer primero una persona adulta de confianza?",
    answers: [
      "Pedirle que cuente todos los detalles y comprobar quién tiene la culpa antes de ayudar.",
      "Decirle que aguante hasta que el problema familiar se calme y evitar involucrar a otras personas.",
      "Escucharle en privado, preguntarle si está en peligro ahora y explicarle que buscará ayuda siguiendo la ruta de protección.",
      "Prometerle que nadie se enterará de lo ocurrido, aunque exista un riesgo para su seguridad.",
      "Contarle a varios estudiantes para que estén atentos a lo que pasa en su casa.",
    ],
    correct: 2,
    hint: "La pista une tres acciones: escuchar sin juzgar, revisar si existe un riesgo inmediato y buscar apoyo adulto mediante la ruta de protección. No corresponde investigar ni prometer secretos que impidan proteger a alguien.",
    npc: "Mara · Psicoorientadora",
    personality: "serena y muy cuidadosa con la seguridad",
    emoji: "🧑🏽‍⚕️",
    talk: "Mara habla con calma y deja silencios para pensar. «Si alguien me cuenta que tiene miedo en casa, mi tarea no es investigar a su familia. Primero escucho, pregunto si existe un peligro inmediato y explico qué pasos de protección puedo activar». ¿Qué le respondería el equipo?",
  },
  {
    id: "pasillo",
    name: "Pasillo central",
    icon: "🧭",
    x: 50,
    y: 39,
    room: "hall",
    clue: "Ruta segura: lugar tranquilo · persona adulta disponible · acompañamiento",
    object: "🗺️",
    puzzle:
      "Alex quiere hablar con Mara, pero no quiere hacerlo delante de otros estudiantes. El horario indica que Mara está disponible durante el recreo y el mapa muestra un corredor lateral tranquilo. ¿Qué plan respeta mejor lo que Alex necesita?",
    answers: [
      "Llevar a Alex por el patio central delante de todos porque es el camino más corto.",
      "Esperar sin avisar a Mara y entrar a su oficina aunque esté atendiendo a otra persona.",
      "Decidir por Alex que debe contar todo de inmediato para que el problema se resuelva rápido.",
      "Preguntarle a Alex si quiere hablar con Mara, acordar un momento en que ella esté disponible y usar un camino tranquilo.",
      "Pedirle a un grupo de amigos que acompañe a Alex para que no tenga miedo.",
    ],
    correct: 3,
    hint: "La ruta segura no consiste en ocultar el problema ni en exponerlo. Hay que contar con la voluntad de Alex, buscar un momento adecuado y evitar que tenga que hablar delante de otras personas.",
    npc: "Lía",
    personality: "observadora, cuidadosa y buena para orientarse",
    emoji: "👩🏻",
    talk: "Lía revisa el mapa y señala el corredor lateral. «Podemos encontrar un lugar tranquilo, pero primero debemos preguntarle a Alex si quiere ir y comprobar que Mara esté disponible». ¿Qué debería hacer el equipo?",
  },
  {
    id: "aula",
    name: "Aula",
    icon: "🧑‍🏫",
    x: 79,
    y: 39,
    room: "classroom",
    clue: "Respuesta de apoyo: creer · escuchar · no culpar · acompañar",
    object: "📝",
    puzzle:
      "Sam escribió varias respuestas para cuando Alex diga: «En mi casa me gritan, me insultan y tengo miedo cuando empiezan las peleas». ¿Cuál ayuda sin culparle ni convertirle en investigador de su propia situación?",
    answers: [
      "«¿Qué hiciste para que se enojaran? Necesito saber exactamente qué provocó la pelea».",
      "«Gracias por contármelo. Lo que estás viviendo no es tu culpa. ¿Quieres que te acompañe a hablar con una persona adulta segura?»",
      "«Seguro tus familiares no lo hacen con mala intención; intenta no pensar tanto en eso».",
      "«No se lo digas a nadie. Yo guardaré el secreto aunque crea que puedes estar en peligro».",
      "«Voy a contarle a todos mis amigos para que estén pendientes de tu familia».",
    ],
    correct: 1,
    hint: "Una respuesta de apoyo reconoce la confianza, no culpa a Alex, evita minimizar la violencia y ofrece acompañamiento hacia una persona adulta segura.",
    npc: "Profe Julián",
    personality: "paciente, protector y cuidadoso con las palabras",
    emoji: "👨🏽‍🏫",
    talk: "El profe Julián escucha sin pedir detalles innecesarios. «Cuando alguien cuenta que vive violencia, no le corresponde demostrar lo ocurrido. Podemos creer que necesita ayuda, acompañarle y seguir la ruta de protección». ¿Qué haría el equipo?",
  },
];
var finalPuzzle = {
  question:
    "Código final: Alex ya contó que en casa vive situaciones de violencia y tiene miedo. Las tres pistas están reunidas. ¿Cuál es la secuencia que conecta todo el caso de forma segura?",
  answers: [
    "Investigar primero a la familia → reunir pruebas por cuenta propia → contar lo ocurrido a estudiantes de confianza.",
    "Pedir todos los detalles → decidir quién tiene la culpa → esperar a que Alex resuelva el problema en casa.",
    "Prometer secreto absoluto → llevar a Alex a casa para comprobar la situación → hablar después con una persona adulta.",
    "Escuchar a Alex → preguntarle si existe un peligro inmediato → acordar un lugar seguro y acompañarle a orientación → seguir la ruta de protección.",
    "Contar inmediatamente la historia a todo el curso → organizar una confrontación familiar → esperar que la familia llegue a un acuerdo.",
  ],
  correct: 3,
  hint: "Las tres pistas forman una sola ruta: escuchar sin juzgar, valorar la seguridad, acompañar a Alex a un adulto responsable y activar el protocolo de protección cuando corresponda.",
};
var mode = "hub",
  activeLead = -1,
  px = 50,
  py = 84,
  near = null,
  found = [],
  talked = [],
  wrong = [],
  keys = {},
  dialogOpen = false,
  seconds = 300,
  overtime = false,
  lastSecond = 0,
  lastMove = 0,
  touchDir = "",
  selectedLook = "look1",
  sprinting = false;
function byId(id) {
  return document.getElementById(id);
}
function has(a, v) {
  return a.indexOf(v) !== -1;
}
function personHtml(name, type, x, y, id) {
  return (
    '<div class="sprite ' +
    type +
    '" ' +
    (id ? 'id="' + id + '"' : "") +
    ' style="left:' +
    x +
    "%;top:" +
    y +
    '%"><span class="hair"></span><span class="head"></span><span class="neck"></span><span class="torso"></span><span class="arm left"></span><span class="arm right"></span><span class="leg left"></span><span class="leg right"></span><span class="shoe left"></span><span class="shoe right"></span><span class="label">' +
    name +
    "</span></div>"
  );
}
function showBriefing() {
  byId("briefing").className = "care-wrap show";
}
function closeBriefing() {
  byId("briefing").className = "care-wrap";
  startGame();
}
function startGame() {
  mode = "hub";
  activeLead = -1;
  px = 50;
  py = 84;
  found = [];
  talked = [];
  wrong = [];
  seconds = 300;
  overtime = false;
  lastSecond = 0;
  lastMove = 0;
  byId("home").style.display = "none";
  byId("finish").style.display = "none";
  byId("game").className = "game active";
  showHub();
  nextFrame();
}
function nextFrame() {
  if (window.requestAnimationFrame) window.requestAnimationFrame(loop);
  else
    window.setTimeout(function () {
      loop(new Date().getTime());
    }, 33);
}
function showHub() {
  mode = "hub";
  activeLead = -1;
  px = 50;
  py = 88;
  var stage = byId("stage");
  stage.className = "stage hub";
  byId("loc").textContent = "Patio central · elige una puerta";
  byId("objective").textContent =
    found.length < 3
      ? "Reconstruye con el equipo una ruta de apoyo para Alex: escucha, seguridad y protección."
      : "¡Ya tienes las tres partes de la historia! Ve al tablero y reconstruye la ruta de apoyo para Alex.";
  var html = '<div class="map-label">PATIO CENTRAL · ENTRA POR CUALQUIER PUERTA</div>';
  for (var i = 0; i < leads.length; i++) {
    var l = leads[i],
      done = has(found, l.id);
    html +=
      '<button class="node' +
      (done ? " done" : "") +
      '" data-lead="' +
      i +
      '" style="left:' +
      l.x +
      '%;top:48%"><span class="icon">' +
      (done ? "✓" : l.icon) +
      '</span><span class="label">' +
      l.name +
      '</span><span class="status">' +
      (done ? "Pista reunida" : "Entrar por puerta →") +
      "</span></button>";
  }
  if (found.length === 3)
    html +=
      '<button class="node" data-final="1" style="left:50%;top:77%;border-color:#ffd36e"><span class="icon">🔐</span><span class="label">Tablero del caso</span><span class="status">Combinar pistas</span></button>';
  html += personHtml("Sam", "sam " + selectedLook, px, py, "avatar");
  byId("world").innerHTML = html;
  var nodes = byId("world").querySelectorAll("[data-lead]");
  for (var j = 0; j < nodes.length; j++)
    nodes[j].onclick = function () {
      enterLead(Number(this.getAttribute("data-lead")));
    };
  var finalNode = byId("world").querySelector("[data-final]");
  if (finalNode) finalNode.onclick = openFinal;
  drawHud();
  findTarget();
}
function enterLead(i) {
  if (has(found, leads[i].id) && has(talked, leads[i].id)) {
    toast("Ya reuniste esta pista. Prueba con otra puerta.");
    return;
  }
  mode = "room";
  activeLead = i;
  px = 17;
  py = 77;
  var l = leads[i],
    stage = byId("stage"),
    type = i === 0 ? "orientation" : i === 1 ? "lia" : "teacher";
  stage.className = "stage " + l.room;
  byId("loc").textContent = l.name + " · busca la pista";
  byId("objective").textContent = has(found, l.id)
    ? "Ya encontraste esta pista. Habla con " + l.npc + " antes de regresar al patio."
    : "Recorre la sala. Acércate al objeto que brilla y pulsa E para examinarlo. Después, el equipo resolverá un acertijo.";
  byId("world").innerHTML =
    '<div class="sun"></div><div class="window win1"></div><div class="window win2"></div><div class="window win3"></div><div class="floor"></div><div class="rug"></div><div class="plant">🪴</div><div class="desk"></div><button class="exit" id="exit">← Volver al patio</button>' +
    (has(found, l.id)
      ? ""
      : '<div class="room-clue" style="left:53%;top:63%"><span>' +
        l.object +
        "</span><span>" +
        l.clue +
        "</span></div>") +
    personHtml(l.npc, type, 79, 65, "npc-sprite") +
    personHtml("Sam", "sam " + selectedLook, px, py, "avatar");
  byId("exit").onclick = showHub;
  var exitReady = has(found, l.id) && has(talked, l.id);
  if (exitReady) byId("exit").className = "exit ready";
  drawHud();
  findTarget();
}
function drawHud() {
  byId("pips").innerHTML = "";
  byId("clues").innerHTML = "";
  for (var i = 0; i < leads.length; i++) {
    var yes = has(found, leads[i].id),
      pip = document.createElement("i");
    pip.className = "pip" + (yes ? " done" : "");
    byId("pips").appendChild(pip);
    var row = document.createElement("div");
    row.className = "clue" + (yes ? " done" : "");
    row.innerHTML =
      "<b>" +
      (yes ? "✓" : "○") +
      "</b><span>" +
      (yes ? leads[i].clue : "Evidencia por descubrir") +
      "</span>";
    byId("clues").appendChild(row);
  }
  byId("progress").style.width = (found.length / 3) * 100 + "%";
  updateClock();
}
function distance(x, y) {
  var dx = (x - px) * 10,
    dy = (y - py) * 5.6;
  return Math.sqrt(dx * dx + dy * dy);
}
function findTarget() {
  near = null;
  if (mode === "hub") {
    for (var i = 0; i < leads.length; i++)
      if (!has(found, leads[i].id) && distance(leads[i].x, 48) < 105) {
        near = { kind: "lead", id: i, label: "Entrar por la puerta: " + leads[i].name };
        break;
      }
    if (!near && found.length === 3 && distance(50, 77) < 125)
      near = { kind: "final", label: "Abrir el tablero del caso" };
  } else if (mode === "room") {
    var l = leads[activeLead];
    if (!has(found, l.id) && distance(53, 63) < 105)
      near = { kind: "clue", label: "Examinar " + l.clue };
    else if (has(found, l.id) && !has(talked, l.id) && distance(79, 65) < 110)
      near = { kind: "person", label: "Hablar con " + l.npc };
  }
  var p = byId("prompt");
  if (near) {
    p.textContent = "E · " + near.label;
    p.style.display = "block";
  } else p.style.display = "none";
}
function move(dx, dy) {
  var pace = sprinting ? 2.5 : 1.4,
    vertical = sprinting ? 3 : 1.8;
  if (mode === "hub") {
    px = Math.max(5, Math.min(95, px + dx * pace));
    py = Math.max(20, Math.min(92, py + dy * vertical));
  } else {
    px = Math.max(8, Math.min(92, px + dx * pace));
    py = Math.max(45, Math.min(91, py + dy * vertical));
  }
  var a = byId("avatar");
  if (a) {
    a.style.left = px + "%";
    a.style.top = py + "%";
    a.className = "sprite sam " + selectedLook + " moving" + (sprinting ? " sprint" : "");
    window.setTimeout(function () {
      if (a) a.className = "sprite sam " + selectedLook;
    }, 220);
  }
  findTarget();
}
function interact() {
  if (dialogOpen) return;
  if (!near) {
    toast("Acércate a una pista, persona o tablero.");
    return;
  }
  if (near.kind === "lead") enterLead(near.id);
  else if (near.kind === "clue") openPuzzle(activeLead);
  else if (near.kind === "person") openTalk(activeLead);
  else if (near.kind === "final") openFinal();
}
function openPuzzle(i) {
  var p = leads[i];
  showQuestion(
    "Reto de deducción · " + p.name,
    p.puzzle,
    p.answers,
    p.correct,
    p.hint,
    function () {
      if (!has(found, p.id)) found.push(p.id);
      drawHud();
      byId("objective").textContent =
        "¡Pista asegurada! Ahora habla con " + p.npc + " para completar esta visita.";
      enterLead(i);
      toast("¡Pista añadida al tablero!");
    },
  );
}
function showQuestion(title, question, answers, correct, hint, onCorrect) {
  dialogOpen = true;
  wrong = [];
  byId("speaker").textContent = title;
  byId("dialog-text").textContent =
    question +
    " Las pistas de esta sala forman parte del mismo caso. Lean las cinco opciones, conversen y voten con un número del 1 al 5." +
    (overtime ? " Pista extra: " + hint : "");
  renderAnswers(answers, correct, hint, onCorrect);
  byId("dialog-wrap").className = "dialog-wrap show";
}
function renderAnswers(answers, correct, hint, onCorrect) {
  var html = "";
  for (var i = 0; i < answers.length; i++)
    if (!has(wrong, i))
      html +=
        '<button class="choice" data-answer="' +
        i +
        '"><strong>' +
        (i + 1) +
        ".</strong>" +
        answers[i] +
        "</button>";
  byId("choices").innerHTML = html;
  var buttons = byId("choices").getElementsByTagName("button");
  for (var j = 0; j < buttons.length; j++)
    buttons[j].onclick = function () {
      var n = Number(this.getAttribute("data-answer"));
      if (n === correct) {
        byId("dialog-text").textContent = "¡La pista encaja con el caso! " + hint;
        byId("choices").innerHTML =
          '<button class="btn" id="continue">Guardar evidencia →</button>';
        byId("continue").onclick = function () {
          byId("dialog-wrap").className = "dialog-wrap";
          dialogOpen = false;
          onCorrect();
        };
        return;
      }
      wrong.push(n);
      byId("dialog-text").textContent =
        "Esa decisión se aleja de la ruta de protección. Pista: " +
        hint +
        " Vuelvan a las evidencias del caso y prueben otra respuesta.";
      renderAnswers(answers, correct, hint, onCorrect);
    };
}
function openTalk(i) {
  var l = leads[i];
  dialogOpen = true;
  byId("speaker").textContent = l.npc + " · " + l.personality;
  byId("dialog-text").textContent = l.talk + " ¿Qué le respondería el equipo? Conversen y voten.";
  byId("choices").innerHTML =
    '<button class="choice" id="talk1">1. «Gracias por escuchar. ¿Puedes acompañarme a buscar a la persona adecuada?»</button><button class="choice" id="talk2">2. «Se lo contaré al curso para que todos averigüen qué pasó.»</button>';
  byId("talk1").onclick = function () {
    finishTalk(
      i,
      "Buena elección: pedir compañía y cuidar la privacidad puede conectar a Alex con apoyo seguro.",
    );
  };
  byId("talk2").onclick = function () {
    finishTalk(
      i,
      "Compartirlo en público podría exponer a Alex. Es mejor preguntar qué necesita y buscar apoyo adulto en privado.",
    );
  };
  byId("dialog-wrap").className = "dialog-wrap show";
}
function finishTalk(i, feedback) {
  talked.push(leads[i].id);
  byId("dialog-text").textContent = feedback;
  byId("choices").innerHTML = '<button class="btn" id="backmap">Regresar al patio →</button>';
  byId("backmap").onclick = function () {
    dialogOpen = false;
    byId("dialog-wrap").className = "dialog-wrap";
    showHub();
  };
}
function openFinal() {
  if (found.length < 3) {
    toast("Primero reúne las tres evidencias.");
    return;
  }
  var p = finalPuzzle;
  showQuestion(
    "Código final · combinar evidencias",
    p.question,
    p.answers,
    p.correct,
    p.hint,
    function () {
      byId("game").className = "game";
      byId("finish").style.display = "block";
    },
  );
}
function updateClock() {
  var m = Math.floor(seconds / 60),
    s = seconds % 60;
  byId("clock").textContent = overtime
    ? "TIEMPO EXTRA"
    : (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  if (seconds < 60 && !overtime) byId("clock").style.color = "#ffd36e";
}
function loop(now) {
  if (byId("game").className.indexOf("active") < 0) return;
  if (!dialogOpen && byId("care").className.indexOf("show") < 0) {
    if (!lastSecond) lastSecond = now;
    if (now - lastSecond >= 1000) {
      lastSecond = now;
      if (seconds > 0) seconds--;
      if (seconds === 0 && !overtime) {
        overtime = true;
        toast("Se acabó el reloj, no la investigación. Ahora recibes pistas.");
      }
      updateClock();
    }
    if (touchDir && now - lastMove > 110) {
      if (touchDir === "left") move(-1, 0);
      if (touchDir === "right") move(1, 0);
      if (touchDir === "up") move(0, -1);
      if (touchDir === "down") move(0, 1);
      lastMove = now;
    }
  }
  nextFrame();
}
function onKeyDown(e) {
  var k = e.key,
    low = k.toLowerCase(),
    dir = null;
  if (k.indexOf("Arrow") === 0 || k === " ") e.preventDefault();
  keys[k] = true;
  keys[low] = true;
  if (k === "Shift") sprinting = true;
  if (k === "ArrowLeft" || low === "a") dir = [-1, 0];
  if (k === "ArrowRight" || low === "d") dir = [1, 0];
  if (k === "ArrowUp" || low === "w") dir = [0, -1];
  if (k === "ArrowDown" || low === "s") dir = [0, 1];
  if (
    dir &&
    !dialogOpen &&
    byId("care").className.indexOf("show") < 0 &&
    new Date().getTime() - lastMove > 85
  ) {
    move(dir[0], dir[1]);
    lastMove = new Date().getTime();
  }
  if (k === "e" || k === "E" || k === " ") interact();
  if (dialogOpen && "12345".indexOf(k) !== -1) {
    var bs = byId("choices").getElementsByTagName("button");
    for (var i = 0; i < bs.length; i++)
      if (bs[i].getAttribute("data-answer") === String(Number(k) - 1)) {
        bs[i].click();
        break;
      }
  }
  if (k === "Escape") {
    closeCare();
    byId("dialog-wrap").className = "dialog-wrap";
    dialogOpen = false;
  }
}
function onKeyUp(e) {
  keys[e.key] = false;
  keys[e.key.toLowerCase()] = false;
  if (e.key === "Shift") sprinting = false;
}
function toast(s) {
  var t = byId("toast");
  t.textContent = s;
  t.className = "toast show";
  window.setTimeout(function () {
    t.className = "toast";
  }, 1500);
}
function openCare() {
  byId("care").className = "care-wrap show";
}
function closeCare() {
  byId("care").className = "care-wrap";
}
function toggleProject() {
  document.body.classList.toggle("project");
  if (document.documentElement.requestFullscreen) {
    var p = document.documentElement.requestFullscreen();
    if (p && p.catch) p.catch(function () {});
  }
}
function restart() {
  byId("finish").style.display = "none";
  byId("home").style.display = "grid";
  byId("game").className = "game";
}
byId("start").onclick = showBriefing;
var looks = document.querySelectorAll("[data-look]");
for (var li = 0; li < looks.length; li++)
  looks[li].onclick = function () {
    selectedLook = this.getAttribute("data-look");
    for (var lj = 0; lj < looks.length; lj++)
      looks[lj].className = "look-button" + (looks[lj] === this ? " selected" : "");
  };
document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);
var pads = document.querySelectorAll("[data-dir]");
for (var pi = 0; pi < pads.length; pi++) {
  pads[pi].onpointerdown = function (e) {
    e.preventDefault();
    touchDir = this.getAttribute("data-dir");
    if (touchDir === "left") move(-1, 0);
    if (touchDir === "right") move(1, 0);
    if (touchDir === "up") move(0, -1);
    if (touchDir === "down") move(0, 1);
  };
  pads[pi].onpointerup = pads[pi].onpointercancel = function () {
    touchDir = "";
  };
}
var runButton = document.querySelector("[data-run]");
runButton.onpointerdown = function (e) {
  e.preventDefault();
  sprinting = true;
  this.className = "use run active";
};
runButton.onpointerup = runButton.onpointercancel = function () {
  sprinting = false;
  this.className = "use run";
};
