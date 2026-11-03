(() => {
"use strict";
const $ = id => document.getElementById(id);
let soundOn=true,ac;
function beep(k){if(!soundOn)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const seq={ok:[[523,.1],[659,.1],[784,.18]],bad:[[220,.25]],tick:[[880,.05]],flip:[[440,.04]],win:[[523,.12],[659,.12],[784,.12],[1047,.3]],combo:[[659,.08],[784,.08],[988,.08],[1319,.25]]}[k];let t=ac.currentTime;seq.forEach(([f,d])=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;o.type=k==="bad"?"sawtooth":"triangle";g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+d);t+=d})}catch(e){}}
const teamDefs = [
 {name:"Equipo Azul",color:"#56e0e5",score:0,streak:0,participation:0,pairs:0,best:0},
 {name:"Equipo Morado",color:"#c18aff",score:0,streak:0,participation:0,pairs:0,best:0},
 {name:"Equipo Verde",color:"#6ce6a3",score:0,streak:0,participation:0,pairs:0,best:0},
 {name:"Equipo Naranja",color:"#ffb15c",score:0,streak:0,participation:0,pairs:0,best:0}
];
const rounds = [
 {title:"RONDA 1 · MEMORIA EN EQUIPO",focus:"LÍMITES Y APOYO",pairs:[
  ["🛑","Puedo decir NO","Puedo poner límites y merezco que los respeten."],
  ["🗣️","Pedir ayuda","Puedo hablar con una persona adulta de confianza."],
  ["🤝","Consentimiento","Debe ser libre; puedo cambiar de opinión."],
  ["🔒","Privacidad","Nadie debe presionarme para compartir imágenes íntimas."],
  ["💚","Adulto seguro","Busco a alguien que escuche y tome en serio."],
  ["🚩","Señal de alerta","Si algo me incomoda o asusta, puedo alejarme y buscar apoyo."],
  ["🧡","Apoyar sin juzgar","Escucho, creo y acompaño sin culpar."],
  ["📣","No guardar daño","Puedo contar una situación insegura aunque me pidan secreto."]
 ]},
 {title:"RONDA 2 · MEMORIA + DECISIONES",focus:"DECISIONES SEGURAS",pairs:[
  ["🛡️","Mi cuerpo, mis límites","Nadie tiene derecho a tocarme o presionarme sin mi consentimiento."],
  ["📱","Presión en línea","No tengo que enviar fotos; puedo bloquear y pedir ayuda."],
  ["👂","Escuchar","Escuchar con respeto ayuda a que alguien se sienta acompañado."],
  ["🧭","Alejarme","Si me siento en peligro, busco un lugar seguro y apoyo."],
  ["🧑‍🏫","Red de apoyo","Puede ser un familiar seguro, docente u orientador."],
  ["🚫","No es mi culpa","La responsabilidad es de quien hace daño, no de quien lo cuenta."],
  ["🫶","Acompañar","Puedo acompañar a pedir ayuda sin investigar ni presionar."],
  ["🔐","Secreto incómodo","No debo guardar secretos que me hagan sentir inseguro."],
  ["💬","Pedir orientación","Puedo buscar orientación aunque no sepa cómo explicar todo."],
  ["🌱","Cuidarnos","Respetar límites y pedir ayuda son acciones valientes."]
 ]}
];
let roundIndex=0,deck=[],first=null,second=null,lock=false,started=false,paused=false,moves=0,matched=0,activeTeam=0,turnSeconds=20,timerId=null,turnToken=0,previewTimeout=null,challengeUsed=new Set(),lastPairCount=0,turnCount=0;
const letters=["A","B","C","D","E"];
let challengeOk=false,peeksLeft=2,totalMatched=0,pool=[];
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function makeDeck(){const cards=[];rounds[roundIndex].pairs.forEach((p,i)=>{for(let n=0;n<2;n++)cards.push({id:`${i}-${n}`,pair:i,emoji:p[0],label:p[1],desc:p[2],revealed:false,matched:false})});return shuffle(cards)}
function log(msg){const el=document.createElement("div");el.className="logitem";el.textContent=msg;$("log").prepend(el);while($("log").children.length>5)$("log").lastChild.remove()}
function toast(msg){$("toast").textContent=msg;$("toast").classList.remove("show");void $("toast").offsetWidth;$("toast").classList.add("show");const c=document.createElement("div");c.className="confetti";document.body.append(c);setTimeout(()=>c.remove(),950)}
function message(html){$("message").innerHTML=html}
function renderTeams(){
 document.documentElement.style.setProperty("--tc",teamDefs[activeTeam].color);
 $("teams").innerHTML="";
 teamDefs.forEach((t,i)=>{const b=document.createElement("button");b.className="team"+(i===activeTeam?" active":"");b.style.setProperty("--team",t.color);b.innerHTML=`<span class="name">${t.name}</span><span class="score">${t.score}</span><small>${i===activeTeam?"▶ TURNO ACTUAL":"Puntos acumulados"}</small>`;b.title="Pulsa para asignar el turno a este equipo";b.addEventListener("click",()=>{if(!started||paused)return;activeTeam=i;renderTeams();updateTurn();log("Turno asignado a "+t.name+".")});$("teams").append(b)});
 $("activeTeam").textContent=teamDefs[activeTeam].name;$("turnLabel").textContent="TURNO: "+teamDefs[activeTeam].name.replace("Equipo ","").toUpperCase();
}
function coords(i){return letters[Math.floor(i/5)]+((i%5)+1)}
function renderBoard(){
 $("board").innerHTML="";
 deck.forEach((c,i)=>{const b=document.createElement("button");b.className="card"+(c.revealed?" revealed":"")+(c.matched?" matched":"");b.disabled=!started||paused||lock||c.matched||c.revealed;b.setAttribute("aria-label",`${coords(i)}${c.revealed||c.matched?": "+c.label:" carta oculta"}`);
 b.innerHTML=`<span class="coord">${coords(i)}</span><span class="back">?</span><span class="front"><span class="emoji">${c.emoji}</span><span class="msg">${c.label}</span></span>`;b.addEventListener("click",()=>flip(i));$("board").append(b)});
}
function updateStats(){const total=rounds[roundIndex].pairs.length;$("roundStat").textContent=`${roundIndex+1} / 2`;$("pairsStat").textContent=`${matched} / ${total}`;$("movesStat").textContent=moves;$("roundTitle").textContent=rounds[roundIndex].title;$("status").textContent=!started?"PREPARADOS":paused?"EN PAUSA":matched===total?"COMPLETADO":"EN JUEGO";$("peekBtn").disabled=!started||paused||lock||peeksLeft<=0;$("peekBtn").textContent=`👁 VER CARTAS (${peeksLeft})`;$("partBtn").disabled=!started||paused;$("shieldFill").style.width=(totalMatched/18*100)+"%";$("shieldTxt").textContent=totalMatched+" / 18";$("pauseBtn").disabled=!started||matched===rounds[roundIndex].pairs.length;$("startBtn").disabled=started;$("startBtn").textContent=started?"✓ EN JUEGO":"▶ EMPEZAR";renderTeams()}
function updateTurn(){renderTeams();$("turnHint").textContent=`Deliberen juntos: ${teamDefs[activeTeam].name} elige dos coordenadas.`}
function showAll(ms=3000){if(!started||paused||lock)return;deck.forEach(c=>{if(!c.matched)c.revealed=true});renderBoard();$("peekBtn").disabled=true;message("<strong>¡Memoria activa!</strong> Observen las posiciones y ayúdense a recordarlas.");clearTimeout(previewTimeout);previewTimeout=setTimeout(()=>{deck.forEach(c=>{if(!c.matched&&c!==first&&c!==second)c.revealed=false});renderBoard();updateStats()},ms)}
function begin(){if(started)return;started=true;paused=false;peeksLeft=2;deck=makeDeck();first=second=null;lock=false;moves=matched=turnCount=0;activeTeam=0;challengeUsed.clear();renderBoard();updateStats();showAll(3000);message("<strong>¡A jugar!</strong> Miren el tablero durante 3 segundos. Luego el equipo azul elige dos coordenadas.");log("Comienza "+rounds[roundIndex].title.toLowerCase()+".");startTimer()}
function flip(i){
 if(!started||paused||lock)return;const c=deck[i];if(c.matched||c.revealed)return;
 c.revealed=true;beep("flip");renderBoard();
 if(!first){first=c;message(`<strong>${teamDefs[activeTeam].name}:</strong> primera carta ${coords(i)}. Acuerden la segunda.`);return}
 second=c;moves++;lock=true;renderBoard();updateStats();
 if(first.pair===second.pair){
  first.matched=second.matched=true;first.revealed=second.revealed=true;matched++;const t=teamDefs[activeTeam];t.score+=100;t.streak++;t.pairs++;t.best=Math.max(t.best,t.streak);totalMatched++;
  let extra="";if(t.streak>=2){t.score+=50;extra=" ¡COMBO +50!";toast("🔥 COMBO +150");beep("combo");}else{toast("¡PAREJA +100!");beep("ok");}
  message(`<strong>¡Coincidencia!</strong> ${first.emoji} ${first.label}. ${first.desc}<br><strong>+100 puntos.</strong>${extra}`);
  log(`${t.name} encontró "${first.label}" (+${t.streak>=2?150:100}).`);first=null;second=null;lock=false;turnCount++;
  renderBoard();updateStats();
  if(matched===rounds[roundIndex].pairs.length){stopTimer();setTimeout(endRound,650);return}
  // Every third matched pair can trigger a short scenario, at most one per round.
  if(matched%3===0){setTimeout(openChallenge,650);return}
  startTimer();
 }else{
  teamDefs[activeTeam].streak=0;beep("bad");message("<strong>No coinciden.</strong> Recuerden dónde estaban. ¡No se restan puntos!");log(`${teamDefs[activeTeam].name} probó dos cartas. Siguiente turno.`);setTimeout(()=>{if(first)first.revealed=false;if(second)second.revealed=false;first=second=null;lock=false;renderBoard();nextTeam();startTimer()},1150)
 }
}
function banner(){const b=$("turnBanner");b.textContent="▶ "+teamDefs[activeTeam].name.toUpperCase();b.style.background=teamDefs[activeTeam].color;b.classList.remove("show");void b.offsetWidth;b.classList.add("show")}
function nextTeam(){activeTeam=(activeTeam+1)%teamDefs.length;updateTurn();updateStats();banner()}
function startTimer(){clearInterval(timerId);turnSeconds=20;paintTimer();if(!started||paused)return;const token=++turnToken;timerId=setInterval(()=>{if(token!==turnToken)return;turnSeconds--;paintTimer();if(turnSeconds<=0){clearInterval(timerId);if(started&&!paused&&!lock){message("<strong>¡Tiempo de acuerdo!</strong> Elijan una coordenada para comenzar. El facilitador puede dar 10 segundos extra si el grupo lo necesita.");log("Se agotó el tiempo de acuerdo; el facilitador puede dar tiempo extra.");turnSeconds=10;paintTimer();startTimerAfterExtra()}}},1000)}
function startTimerAfterExtra(){clearInterval(timerId);const token=++turnToken;timerId=setInterval(()=>{if(token!==turnToken)return;turnSeconds--;paintTimer();if(turnSeconds<=0){clearInterval(timerId);nextTeam();startTimer();message("<strong>Cambio de turno.</strong> El equipo siguiente puede intentarlo.")}},1000)}
function paintTimer(){const s=Math.max(0,turnSeconds);$("timerSide").classList.toggle("low",s<=5&&started&&!paused);if(s<=5&&s>0&&started&&!paused)beep("tick");const v=`00:${String(s).padStart(2,"0")}`;$("timerStat").textContent=v;$("timerSide").textContent=v}
function stopTimer(){clearInterval(timerId);turnToken++}
function pauseGame(){if(!started||matched===rounds[roundIndex].pairs.length)return;paused=!paused;if(paused){stopTimer();clearTimeout(previewTimeout);message("<strong>Juego en pausa.</strong> Pulsa Reanudar para continuar.");$("pauseBtn").textContent="▶ REANUDAR"}else{$("pauseBtn").textContent="Ⅱ PAUSA";renderBoard();startTimer();message("<strong>¡Seguimos!</strong> Acuerden la próxima jugada.")}renderBoard();updateStats()}
const challenges=[
 {title:"¿Qué harías?",text:"Una persona te pide guardar un secreto que te hace sentir inseguro y dice que no se lo cuentes a nadie. ¿Cuál es una respuesta segura?",options:["Buscar a una persona adulta segura y contárselo.","Guardarlo para no molestar a nadie.","Prometer que nunca lo contarás."],correct:0,feedback:"Buscar a una persona adulta segura es una buena opción. No tienes que guardar secretos que te hagan sentir en peligro."},
 {title:"Apoyo sin juzgar",text:"Un compañero te cuenta que alguien cruzó sus límites. ¿Qué ayuda más?",options:["Escucharlo, no culparlo y acompañarlo a buscar ayuda.","Preguntarle una y otra vez por todos los detalles.","Decirle que no cuente nada para evitar problemas."],correct:0,feedback:"Escuchar sin juzgar, no presionar por detalles y acompañar a buscar ayuda puede marcar una diferencia."},
 {title:"Presión digital",text:"Alguien insiste en que envíes una foto íntima para demostrar que confías en esa persona. ¿Qué puedes hacer?",options:["Enviar la foto para que no se enoje.","Decir que no, dejar de responder si hace falta y pedir ayuda.","Compartirla solo con un grupo pequeño."],correct:1,feedback:"No tienes que enviar imágenes íntimas. Puedes poner límites, bloquear y pedir apoyo a una persona adulta segura."},
 {title:"Chat de grupo",text:"En un chat grupal comparten sin permiso una foto privada de alguien y todos se ríen. ¿Qué ayuda más?",options:["No reenviarla, no burlarme, apoyar a la persona afectada y avisar a un adulto de confianza.","Reenviarla solo a un amigo, así no es tan grave.","Quedarme callado porque no es mi problema."],correct:0,feedback:"Compartir imágenes sin permiso hace daño. No reenviar, apoyar y buscar a un adulto ayuda a frenar el problema."},
 {title:"No es tu culpa",text:"Una amiga dice que alguien la hace sentir incómoda y cree que es su culpa. ¿Qué le dirías?",options:["Que la responsabilidad es de quien cruza los límites y que puede buscar a un adulto de confianza.","Que seguro está exagerando.","Que lo olvide y no lo cuente."],correct:0,feedback:"Quien cuenta una situación incómoda no es culpable. Creer y acompañar ayuda a que se sienta segura."},
 {title:"Contacto en línea",text:"Alguien que conociste en línea te pide que no le cuentes a nadie que hablan. ¿Qué es lo más seguro?",options:["Contárselo a un adulto de confianza y dejar de responder.","Aceptar, porque dice que confía en ti.","Darle tu dirección para demostrar que confías."],correct:0,feedback:"Pedir secreto es una señal de alerta. Es seguro avisar a un adulto y no compartir datos personales."},
 {title:"Cambiar de opinión",text:"¿Qué es cierto sobre el consentimiento?",options:["Puedo cambiar de opinión en cualquier momento y debe respetarse.","Si ya dije que sí, no puedo retractarme.","Solo cuenta si lo digo delante de otras personas."],correct:0,feedback:"El consentimiento es libre y puede retirarse cuando quieras."},
 {title:"No sé cómo explicarlo",text:"Necesitas ayuda, pero no sabes cómo explicar lo que pasó. ¿Qué puedes hacer?",options:["Decir \"necesito hablar con alguien\" y pedir orientación aunque no sepa explicarlo todo.","Esperar a tener las palabras perfectas.","Resolverlo solo sin decirle a nadie."],correct:0,feedback:"No necesitas tener todo claro para pedir ayuda. Un primer paso basta."}
];
function nextChallenge(){if(!pool.length)pool=shuffle(challenges.map((_,i)=>i));const c=challenges[pool.pop()];const o=shuffle(c.options.map((t,i)=>({t,ok:i===c.correct})));return{...c,options:o.map(x=>x.t),correct:o.findIndex(x=>x.ok)}}
function openChallenge(){stopTimer();paused=true;renderBoard();const q=nextChallenge();challengeOk=false;$("challengeTitle").textContent=q.title;$("challengeText").textContent=q.text;$("challengeFeedback").textContent="";$("challengeOptions").innerHTML="";$("challengeContinue").classList.add("hidden");q.options.forEach((opt,i)=>{const b=document.createElement("button");b.className="btn";b.style.display="block";b.style.width="100%";b.style.textAlign="left";b.style.margin="8px 0";b.textContent=String.fromCharCode(65+i)+". "+opt;b.addEventListener("click",()=>{[...$("challengeOptions").querySelectorAll("button")].forEach(x=>x.disabled=true);if(i===q.correct){challengeOk=true;beep("ok");teamDefs[activeTeam].score+=100;$("challengeFeedback").innerHTML="✅ <strong>¡Reto superado! +100 puntos.</strong> "+q.feedback;toast("RETO +100");log(`${teamDefs[activeTeam].name} superó el reto sorpresa (+100).`)}else{$("challengeFeedback").innerHTML="💡 <strong>Vamos a aprender:</strong> "+q.feedback;log(`${teamDefs[activeTeam].name} revisó una situación de prevención.`)}renderTeams();$("challengeContinue").classList.remove("hidden")});$("challengeOptions").append(b)});$("challenge").classList.remove("hidden")}
function endRound(){stopTimer();beep("win");started=false;paused=false;$("roundEndTitle").textContent=roundIndex===0?"¡Ronda 1 superada!":"¡Todas las parejas encontradas!";const leader=[...teamDefs].sort((a,b)=>b.score-a.score)[0];$("roundEndText").textContent=`Encontraron ${matched} parejas en ${moves} jugadas. ${leader.name} lleva ${leader.score} puntos. Recuerden: pedir apoyo y respetar los límites son formas de cuidarnos.`;$("roundOverlay").classList.remove("hidden");$("pauseBtn").disabled=true}
function nextRound(){roundIndex=1;first=second=null;lock=false;started=false;paused=false;moves=matched=0;activeTeam=(activeTeam+1)%teamDefs.length;deck=makeDeck();$("roundOverlay").classList.add("hidden");renderBoard();updateStats();message("<strong>Ronda 2:</strong> hay más parejas y nuevas situaciones. Pulsa Empezar para continuar.");$("startBtn").disabled=false;$("startBtn").textContent="▶ EMPEZAR RONDA 2"}
function finish(){stopTimer();started=false;paused=false;$("endText").textContent=`El grupo encontró todas las parejas de las dos rondas. Se realizaron ${moves} jugadas en la última ronda. Lo importante es recordar que poner límites, buscar ayuda y acompañar sin juzgar son acciones de cuidado.`;const sorted=[...teamDefs].sort((a,b)=>b.score-a.score);$("finalScores").innerHTML=sorted.map((t,i)=>`<p style="border-left:4px solid ${t.color};padding:8px 12px;background:#ffffff08;border-radius:8px"><b>${i+1}. ${t.name}</b> — ${t.score} puntos</p>`).join("");const top=k=>[...teamDefs].sort((a,b)=>b[k]-a[k])[0];const bp=top("pairs"),bs=top("best"),bt=top("participation");
$("finalScores").innerHTML+=`<p>🏅 Más parejas: <b>${bp.name}</b> (${bp.pairs}) · 🔥 Mejor racha: <b>${bs.name}</b> (${bs.best}) · 🗣 Más participativo: <b>${bt.name}</b> (${bt.participation})</p>`;beep("win");$("endOverlay").classList.remove("hidden")}
function reset(){stopTimer();peeksLeft=2;clearTimeout(previewTimeout);roundIndex=0;started=false;paused=false;first=second=null;lock=false;moves=matched=turnCount=0;activeTeam=0;challengeUsed.clear();teamDefs.forEach(t=>{t.score=0;t.streak=0;t.participation=0;t.pairs=0;t.best=0;totalMatched=0});deck=makeDeck();$("intro").classList.remove("hidden");$("challenge").classList.add("hidden");$("roundOverlay").classList.add("hidden");$("endOverlay").classList.add("hidden");$("pauseBtn").textContent="Ⅱ PAUSA";renderBoard();updateStats();message("Pulsa Empezar. Primero observa las cartas y acuerda las coordenadas con tu equipo.");$("startBtn").disabled=false}
$("goBtn").addEventListener("click",()=>{$("intro").classList.add("hidden");begin()});
$("startBtn").addEventListener("click",()=>{if(roundIndex===1&&matched===0&&!started){begin()}else begin()});
$("pauseBtn").addEventListener("click",pauseGame);
$("peekBtn").addEventListener("click",()=>{if(peeksLeft<=0)return;peeksLeft--;showAll(3000);updateStats()});
$("projectBtn").addEventListener("click",async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch(e){message("El navegador no permitió pantalla completa. Pulsa F11 para proyectar.")}});
$("resetBtn").addEventListener("click",reset);
function addPart(){if(!started||paused)return;const t=teamDefs[activeTeam];t.score+=25;t.participation++;beep("ok");toast("🗣 +25 "+t.name.replace("Equipo ",""));log(t.name+": participó una persona nueva (+25).");renderTeams();updateStats()}
$("partBtn").addEventListener("click",addPart);
$("soundBtn").addEventListener("click",()=>{soundOn=!soundOn;$("soundBtn").textContent=soundOn?"🔊 SONIDO":"🔇 SIN SONIDO"});
let buf="",bufT;
function setBuf(v){buf=v;clearTimeout(bufT);$("kbdBuf").textContent=buf?buf+"_":"";if(buf)bufT=setTimeout(()=>setBuf(""),4000)}
$("challengeContinue").addEventListener("click",()=>{$("challenge").classList.add("hidden");paused=false;if(!challengeOk)nextTeam();renderBoard();updateStats();startTimer();message("<strong>¡Reto completado!</strong> Continúen buscando parejas.")});
$("nextRoundBtn").addEventListener("click",()=>{if(roundIndex===0)nextRound();else{$("roundOverlay").classList.add("hidden");finish()}});
let closeId;
$("closeBtn").addEventListener("click",()=>{clearInterval(closeId);let t=300;const p=()=>$("closeTimer").textContent=String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0");p();closeId=setInterval(()=>{t--;p();if(t<=0){clearInterval(closeId);beep("win")}},1000)});
$("againBtn").addEventListener("click",()=>{clearInterval(closeId);$("closeTimer").textContent="05:00";reset()});
document.addEventListener("keydown",e=>{
 if(e.ctrlKey||e.metaKey||e.altKey)return;
 const k=e.key.toLowerCase(),vis=id=>!$(id).classList.contains("hidden");
 if(vis("challenge")){const o=[...$("challengeOptions").querySelectorAll("button")];const i="abc".indexOf(k);if(k.length===1&&i>=0&&o[i]&&!o[i].disabled)o[i].click();else if(k==="enter"){e.preventDefault();if(!$("challengeContinue").classList.contains("hidden"))$("challengeContinue").click()}return}
 for(const [id,b] of [["intro","goBtn"],["roundOverlay","nextRoundBtn"]])if(vis(id)){if(k==="enter"){e.preventDefault();$(b).click()}return}
 if(k==="escape"){setBuf("");return}
 if(k==="p"&&started){pauseGame();return}
 if(k==="u"){addPart();return}
 if(k==="h"){$("peekBtn").click();return}
 if(!started||paused)return;
 if(k.length===1&&"abcde".includes(k)){setBuf(k.toUpperCase());return}
 if(/^[1-5]$/.test(k)){
  if(buf){const idx=letters.indexOf(buf)*5+(+k-1);setBuf("");if(idx<deck.length)flip(idx);return}
  if(+k<=4&&!first){activeTeam=+k-1;updateTurn();log("Turno asignado a "+teamDefs[activeTeam].name+".");banner()}
 }
});
deck=makeDeck();renderBoard();updateStats();
})();
