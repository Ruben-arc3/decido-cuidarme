const TOTAL=12, COLORS=['#d62828','#2f6fed','#e8590c'];

// Banco de palabras FÁCILES (5-6 letras)
const EASY_WORDS = [
  ["BARRO", "Común en los caminos destapados de Puerto Escondido cuando llueve.", "Reduce la velocidad en tramos arcillosos para evitar volcamiento o derrapes."],
  ["CASCO", "Elemento vital para los motociclistas en zona urbana y veredas.", "Debe estar homologado y abrochado; salva vidas en choques en moto."],
  ["CURVA", "Tramos peligrosos en las vias Puerto Escondido, requiere bajar la velocidad.", "Frena antes de entrar a la curva, mantén tu carril y no adelantes."],
  ["ARROYO", "Cuerpos de agua que desbordan o cruzan las vías en época invernal.", "Nunca intentes cruzar un arroyo crecido con el vehículo o la moto."],
  ["FRENOS", "Sistema mecánico crítico para transitar en trochas y bajadas.", "Revisa tus frenos antes de salir a la carretera o entrar a la zona rural."],
  ["MOTOS", "El vehículo más usado en los caminos y veredas de Puerto Escondido.", "Respeta el cupo máximo permitido y usa siempre la prenda reflectiva de noche."],
  ["LUCES", "Indispensables para ser visto de noche o bajo la lluvia en la carretera.", "Revisa que el stop y el faro delantero funcionen bien antes de salir a la vía."],
  ["CEBRA", "Demarcación vial que indica paso peatonal en zonas urbanas y veredas.", "Reduce la velocidad y cede el paso a los peatones en las cebras."],
];

// Banco de palabras DIFICILES (7 a 13 letras)
const HARD_WORDS = [
  ["MANTENIMIENTO", "Revisión periódica de llantas, frenos, luces y dirección del vehículo.", "Un vehículo en buen estado previene fallas mecánicas en trayectos rurales alejados."],
  ["DISTRACCION", "Usar el celular o no mirar la vía adecuadamente al manejar.", "Un segundo de distracción a 60 km/h equivale a recorrer más de 15 metros a ciegas."],
  ["PREVENCION", "Actitud anticipada para evitar siniestros y reaccionar a tiempo ante el peligro.", "Maneja a la defensiva: asume que otros conductores o peatones pueden equivocarse."],
  ["SOMNOLENCIA", "Estado de fatiga o sueño al volante por largas jornadas de manejo.", "Si sientes cansancio, detén el vehículo en un lugar seguro y descansa antes de seguir."],
  ["SEÑALIZACION", "Conjunto de letreros, demarcaciones y avisos informativos en la vía.", "Las señales preventivas (amarillas) te advierten con tiempo sobre peligros en la vía."],
  ["VISIBILIDAD", "Capacidad de ver con claridad la carretera ante humo, lluvia o polvo.", "Si la visibilidad baja a cero por la lluvia o polvo, oríllate con luces intermitentes."],
  ["RESPONSABLE", "Cualidad de un conductor que cuida su vida y la de todos en la comunidad.", "La seguridad vial en Puerto Escondido depende del compromiso y respeto de todos."],
  ["PEATONES", "Usuarios de la vía más vulnerables tanto en la zona urbana como en veredas.", "Tienen prioridad siempre. Reduce la velocidad cerca de parques, colegios y caseríos."],
  ["CARRERITAS", "Práctica ilegal de exceso de velocidad en motos o vehículos en la vía pública.", "Respetar los límites de velocidad salva vidas y previene tragedias fatales en la comunidad."],
  ["IMPRUDENCIA", "Causa principal de siniestros viales por no acatar las señales o conducir distraído.", "No uses el celular mientras manejas y mantén siempre los ojos en la vía."],
  ["ACCIDENTES", "Sucesos inesperados que pueden causar daños a personas o vehículos en la vía.", "Evita los accidentes respetando las señales, límites de velocidad y manteniendo la atención."]

];

const $=id=>document.getElementById(id);
let teams=[],n=2,words=[],wi=0,target,row,col,over,locked=true,hints,rev,grid,mute=false,AC;
try{mute=!!JSON.parse(localStorage.getItem('wvr')||'{}').m}catch(e){}
function beep(f,d=.1,t='square',v=.06){if(mute)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=t;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.stop(AC.currentTime+d)}catch(e){}}
function sem(c){document.querySelectorAll('.sem i').forEach(i=>i.classList.toggle('on',i.classList.contains(c)))}
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(t.h);t.h=setTimeout(()=>t.classList.remove('show'),1500)}
function snd(){$('snd').textContent=mute?'🔇':'🔊';try{localStorage.setItem('wvr',JSON.stringify({m:mute}))}catch(e){}}
function modal(h){$('modal').innerHTML=h;$('ov').classList.add('show')}
function closeM(){$('ov').classList.remove('show')}
function renderTeams(bump){
  $('teams').innerHTML=teams.map((t,i)=>'<div class="tm'+(i===wi%teams.length&&!finished?' act':'')+(bump===i?' bump':'')+'" style="--c:'+t.c+'"><i></i><span>'+t.n+'</span><b>'+t.p+'</b></div>').join('')
}
let finished=false;

function setup(){
  finished=false;locked=true;
  const names=teams.length===n?teams.map(t=>t.n):[];
  let h='<h2>¿Cuántos equipos juegan?</h2><div class="nsel">'+[1,2,3].map(k=>'<button class="btn'+(k===n?' on':'')+'" data-n="'+k+'">'+k+'</button>').join('')+'</div>';
  for(let i=0;i<n;i++)h+='<div class="nm" style="--c:'+COLORS[i]+'"><i></i><input maxlength="14" value="'+(names[i]||'Equipo '+(i+1))+'" aria-label="Nombre del equipo '+(i+1)+'"></div>';
  h+='<p>12 palabras de seguridad vial (4 fáciles + 8 difíciles aleatorias). ¡A partir del nivel 5 el reto se vuelve más difícil!</p><button class="btn" id="go">🚦 ¡A la carretera!</button>';
  modal(h);
  document.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{n=+b.dataset.n;beep(500,.08);setup()});
  $('go').onclick=()=>{
    const ins=[...document.querySelectorAll('.nm input')];
    teams=ins.map((x,i)=>({n:x.value.trim()||'Equipo '+(i+1),c:COLORS[i],p:0}));

    // Seleccionar 4 fáciles al azar y 8 difíciles al azar
    const shuffledEasy = EASY_WORDS.slice().sort(() => Math.random() - 0.5).slice(0, 4);
    const shuffledHard = HARD_WORDS.slice().sort(() => Math.random() - 0.5).slice(0, 8);
    words = [...shuffledEasy, ...shuffledHard];

    wi=0;beep(600,.15);
    $('car').style.left='6px';nextWord();
  };
}

function build(){
  const b=$('board');b.innerHTML='';
  const len=target[0].length;
  for(let r=0;r<6;r++){
    const d=document.createElement('div');
    d.className='row';
    d.style.gridTemplateColumns=`repeat(${len}, 1fr)`;
    for(let c=0;c<len;c++){
      const t=document.createElement('div');
      t.className='t';
      d.appendChild(t);
    }
    b.appendChild(d);
  }
  const k=$('kb');k.innerHTML='';
  ['QWERTYUIOP','ASDFGHJKLÑ','*ZXCVBNM#'].forEach(s=>{const d=document.createElement('div');d.className='kr';[...s].forEach(ch=>{const e=document.createElement('button');e.className='k';if(ch=='*'){e.textContent='ENVIAR';e.classList.add('w');e.dataset.k='ENTER'}else if(ch=='#'){e.textContent='⌫';e.classList.add('w');e.dataset.k='BACK'}else{e.textContent=ch;e.dataset.k=ch}e.onclick=()=>press(e.dataset.k);d.appendChild(e)});k.appendChild(d)})
}

function nextWord(){
  target=[words[wi][0].toUpperCase(), words[wi][1], words[wi][2]];
  const len=target[0].length;
  row=0;col=0;over=false;locked=true;hints=0;rev=[];
  grid=Array.from({length:6},()=>[]);
  build();$('boom').style.display='none';$('car').classList.remove('crash');
  $('hint').textContent='Palabra '+(wi+1)+' de '+TOTAL+'. (Dificultad: '+(wi>=4?'Alta 🔥':'Fácil ⭐')+')';
  $('hintBtn').disabled=false;$('hintBtn').textContent='💡 Pista';sem('g');renderTeams();
  const t=teams[wi%teams.length];
  modal('<h2 style="color:'+t.c+'">Turno de '+t.n+'</h2><p>Palabra '+(wi+1)+' de '+TOTAL+' · <b>'+len+' letras</b> · 6 intentos</p><div style="font-size:50px">'+(['🐄','🚌','🏍️','⛰️','🚧','🌧️','🚜','🏖️','⚠️','🚨','🚦','🛑'][wi%12])+'</div><button class="btn" id="rdy">¡Listos!</button>');
  $('rdy').onclick=()=>{closeM();locked=false;beep(700,.12,'triangle')};
}

function rowEl(){return $('board').children[row]}
function paint(){
  const ts=rowEl().children;
  const len=target[0].length;
  for(let c=0;c<len;c++){
    const t=ts[c],l=grid[row][c];
    t.classList.remove('ghost');
    if(l){
      t.textContent=l;
    }else if(rev.includes(c)){
      t.textContent=target[0][c];
      t.classList.add('ghost');
    }else{
      t.textContent='';
    }
  }
}

function press(k){
  if(over||locked)return;
  const len=target[0].length;
  if(k==='ENTER')return submit();
  if(k==='BACK'){if(col>0){col--;grid[row][col]='';rowEl().children[col].classList.remove('fill');paint();beep(300,.05)}return}
  if(col<len&&/^[A-ZÑ]$/.test(k)){grid[row][col]=k;const t=rowEl().children[col];col++;paint();t.classList.remove('fill');void t.offsetWidth;t.classList.add('fill');beep(420+col*40,.06)}
}

function evalG(g,w){
  const len=w.length;
  const res=Array(len).fill('no'),cnt={};
  for(let i=0;i<len;i++){if(g[i]===w[i])res[i]='ok';else cnt[w[i]]=(cnt[w[i]]||0)+1}
  for(let i=0;i<len;i++){if(res[i]!=='ok'&&cnt[g[i]]>0){res[i]='mid';cnt[g[i]]--}}
  return res;
}

function submit(){
  const len=target[0].length;
  if(col<len){const r=rowEl();r.classList.add('shake');setTimeout(()=>r.classList.remove('shake'),450);toast('Faltan letras');sem('r');setTimeout(()=>sem(row>=4?'y':'g'),700);beep(150,.2,'sawtooth');return}
  locked=true;const g=grid[row],w=target[0],res=evalG(g,w),ts=rowEl().children;
  res.forEach((s,i)=>setTimeout(()=>{ts[i].classList.add('flip');beep(300+i*70,.12,'triangle');setTimeout(()=>{ts[i].classList.remove('ghost');ts[i].classList.add(s);colorKey(g[i],s)},300)},i*320));
  setTimeout(()=>{
    if(g.join('')===w)return end(true);
    row++;col=0;
    if(row>=6)return end(false);
    if(row>=4)sem('y');locked=false;paint();
    if(row===5)toast('¡Último intento!');
  },len*320+400);
}

function colorKey(l,s){const k=document.querySelector('.k[data-k="'+l+'"]');if(!k||k.classList.contains('ok'))return;if(k.classList.contains('mid')&&s!=='ok')return;k.classList.remove('mid','no');k.classList.add(s)}
function confetti(m=70){const cs=['#ffc928','#d62828','#1f8a4c','#2f6fed','#fff'];for(let i=0;i<m;i++){const e=document.createElement('div');e.className='cf';e.textContent=Math.random()<.2?['🚦','🐄','🏁','⭐'][i%4]:'';if(!e.textContent){e.style.width='9px';e.style.height='14px';e.style.background=cs[i%5]}e.style.left=Math.random()*100+'vw';e.style.animationDuration=(2+Math.random()*2.5)+'s';e.style.animationDelay=Math.random()*.6+'s';document.body.appendChild(e);setTimeout(()=>e.remove(),5500)}}

function end(won){
  over=true;locked=true;const t=target,ti=wi%teams.length,nn=row+1;let gain=0;
  if(won){
    gain=Math.max(5,(7-nn)*10-hints*5);teams[ti].p+=gain;sem('g');
    [...rowEl().children].forEach((c,i)=>setTimeout(()=>{c.classList.add('dance');beep(500+i*120,.15,'triangle',.08)},i*100));confetti();
  }else{
    sem('r');$('car').classList.add('crash');const b=$('boom');b.style.left='38%';b.style.display='block';
    document.body.classList.add('shk');setTimeout(()=>document.body.classList.remove('shk'),500);
    [200,160,110].forEach((f,i)=>setTimeout(()=>beep(f,.25,'sawtooth',.09),i*160));
  }
  renderTeams(ti);
  const last=wi===TOTAL-1;
  setTimeout(()=>{
    modal('<h2>'+(won?'¡Bien, '+teams[ti].n+'! 🏁':'¡Siniestro vial! 💥')+'</h2><div class="w">'+t[0]+'</div><p>'+t[1]+'</p><div class="tip">🚦 '+t[2]+'</div><p>'+(won?'+'+gain+' puntos en '+nn+(nn==1?' intento':' intentos'):'0 puntos esta vez. ¡La prevención es lo primero!')+'</p><button class="btn" id="nx">'+(last?'🏆 Ver resultados':'Siguiente palabra ➜')+'</button>');
    $('nx').onclick=()=>{closeM();wi++;$('car').style.left='calc('+(wi/TOTAL)+' * (100% - 46px) + 6px)';if(wi>=TOTAL)results();else nextWord()};
  },won?1300:1600);
}

function results(){
  finished=true;renderTeams();sem('g');
  const s=teams.slice().sort((a,b)=>b.p-a.p),top=s[0].p,m=['🥇','🥈','🥉'];
  const winners=s.filter(t=>t.p===top);
  let h='<h2>'+(teams.length===1?'¡Recorrido completo!':winners.length>1?'¡Empate en el podio!':'¡Ganó '+s[0].n+'!')+'</h2>';
  s.forEach((t,i)=>{h+='<div class="rk" style="--c:'+t.c+';animation-delay:'+(i*.25)+'s"><em>'+(teams.length>1?m[s.findIndex(x=>x.p===t.p)]:'🏁')+'</em><span>'+t.n+'</span><b>'+t.p+'</b></div>'});
  h+='<p>Maneja con precaución en Puerto Escondido: respeta las señales, cuida a los peatones y conduce con responsabilidad.</p><button class="btn" id="again">🔁 Jugar de nuevo</button>';
  modal(h);confetti(110);[523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,.25,'triangle',.09),i*160));
  $('again').onclick=()=>{$('car').style.left='6px';setup()};
}

$('hintBtn').onclick=()=>{
  if(over||locked)return;
  const len=target[0].length;
  if(hints===0){hints=1;$('hint').textContent='💡 '+target[1]+' (−5 pts)';$('hintBtn').textContent='🔤 Revelar letra';beep(700,.15,'sine')}
  else{
    const free=Array.from({length:len},(_,i)=>i).filter(i=>!rev.includes(i));
    if(free.length>1){rev.push(free[Math.floor(Math.random()*free.length)]);hints++;paint();beep(800,.15,'sine');toast('Letra revelada (−5 pts)')}
    if(free.length<=2)$('hintBtn').disabled=true;
  }
};

$('snd').onclick=()=>{mute=!mute;snd();beep(600,.1)};
$('proj').onclick=()=>{
  const on=document.body.classList.toggle('proj');
  $('proj').textContent=on?'✖ Salir':'📽️ Proyectar';
  try{if(on&&document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{});else if(!on&&document.fullscreenElement)document.exitFullscreen()}catch(e){}
  toast(on?'Modo proyección activado':'Modo normal');
};
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&document.body.classList.contains('proj')){document.body.classList.remove('proj');$('proj').textContent='📽️ Proyectar'}});
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key;if(k==='Enter'){const b=$('rdy')||$('nx')||$('go')||$('again');if($('ov').classList.contains('show')&&b){b.click();return}press('ENTER')}else if(k==='Backspace')press('BACK');else if(/^[a-zA-ZñÑ]$/.test(k))press(k.toUpperCase())});
snd();$('hint').textContent='Configura los equipos para comenzar.';setup();
