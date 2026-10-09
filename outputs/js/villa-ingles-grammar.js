(() => {
  const topicSelect = document.getElementById("grammar-topic");
  const lesson = document.getElementById("grammar-lesson");
  const question = document.getElementById("grammar-question");
  const options = document.getElementById("grammar-options");
  const feedback = document.getElementById("grammar-feedback");
  const nextButton = document.getElementById("grammar-next");
  if (!topicSelect || !lesson || !question || !options || !feedback || !nextButton) return;

  // Daily material written for this learning module; examples and questions are original.
  const lessons = [
    { title: "Presente simple", purpose: "Rutinas, hábitos y hechos que se repiten.", pattern: "I / You / We / They + verbo · He / She / It + verbo con -s", examples: ["I study after school. — Estudio después del colegio.", "She practices every day. — Ella practica todos los días."], questions: [
      { text: "My brother ___ English after school.", choices: ["study", "studies", "studying"], answer: 1, why: "My brother equivale a he; en presente simple agregamos -s: studies." },
      { text: "We ___ for our future.", choices: ["works", "working", "work"], answer: 2, why: "Con we usamos la forma base del verbo: work." },
      { text: "Laura ___ to music while she studies.", choices: ["listen", "listens", "listening"], answer: 1, why: "Laura equivale a she, así que el verbo lleva -s: listens." }
    ] },
    { title: "Presente continuo", purpose: "Acciones que ocurren ahora o durante un periodo actual.", pattern: "am / is / are + verbo-ing", examples: ["I am learning English. — Estoy aprendiendo inglés.", "They are working now. — Están trabajando ahora."], questions: [
      { text: "She ___ for the exam right now.", choices: ["is preparing", "are preparing", "prepares"], answer: 0, why: "Con she usamos is + verbo-ing: is preparing." },
      { text: "We ___ a new skill this month.", choices: ["is learning", "are learning", "learns"], answer: 1, why: "Con we corresponde are + verbo-ing: are learning." },
      { text: "I ___ my options at the moment.", choices: ["am exploring", "is exploring", "explore"], answer: 0, why: "Con I usamos am + verbo-ing: am exploring." }
    ] },
    { title: "Pasado simple: verbos regulares", purpose: "Acciones que empezaron y terminaron en el pasado.", pattern: "Verbo + -ed · study → studied · plan → planned", examples: ["I studied yesterday. — Estudié ayer.", "We planned a project. — Planeamos un proyecto."], questions: [
      { text: "Yesterday, Mateo ___ his homework.", choices: ["finish", "finished", "finishes"], answer: 1, why: "Yesterday señala pasado; finish es regular y forma finished." },
      { text: "They ___ for the test last night.", choices: ["practiced", "practice", "practices"], answer: 0, why: "Last night sitúa la acción en el pasado: practiced." },
      { text: "She ___ her friend with the project.", choices: ["helped", "helps", "helping"], answer: 0, why: "Para una acción terminada usamos helped." }
    ] },
    { title: "Pasado simple: verbos irregulares", purpose: "Algunos verbos cambian de forma en pasado y no usan -ed.", pattern: "go → went · have → had · make → made", examples: ["We went to class. — Fuimos a clase.", "He made a study plan. — Hizo un plan de estudio."], questions: [
      { text: "Last weekend, I ___ my cousins.", choices: ["see", "saw", "seen"], answer: 1, why: "El pasado simple de see es saw." },
      { text: "She ___ a difficult decision yesterday.", choices: ["made", "make", "maked"], answer: 0, why: "Make es irregular; su pasado es made." },
      { text: "They ___ to the library after class.", choices: ["went", "go", "goed"], answer: 0, why: "El pasado de go es went." }
    ] },
    { title: "Planes con going to", purpose: "Intenciones o planes que ya tienes en mente.", pattern: "am / is / are + going to + verbo base", examples: ["I am going to study. — Voy a estudiar.", "They are going to apply. — Van a postularse."], questions: [
      { text: "I ___ apply for a scholarship.", choices: ["am going to", "is going to", "going"], answer: 0, why: "Con I usamos am going to + verbo base." },
      { text: "She is going to ___ engineering.", choices: ["studies", "studying", "study"], answer: 2, why: "Después de going to el verbo queda en forma base: study." },
      { text: "We ___ practice this weekend.", choices: ["are going to", "is going to", "going to"], answer: 0, why: "Con we usamos are going to." }
    ] },
    { title: "Predicciones con will", purpose: "Predicciones, decisiones espontáneas y promesas.", pattern: "will + verbo base", examples: ["I will try again. — Lo intentaré de nuevo.", "She will help us. — Ella nos ayudará."], questions: [
      { text: "I think our team ___ win.", choices: ["will", "is", "does"], answer: 0, why: "Will introduce una predicción sobre el futuro." },
      { text: "Don't worry. I ___ explain it.", choices: ["will", "am", "did"], answer: 0, why: "Es una decisión o promesa tomada en el momento: I will explain." },
      { text: "After 'will', choose the correct verb: She will ___. ", choices: ["studies", "studying", "study"], answer: 2, why: "Después de will usamos el verbo base, sin -s ni -ing." }
    ] },
    { title: "Preguntas con do y does", purpose: "Preguntar por rutinas, gustos y hechos en presente simple.", pattern: "Do + I / you / we / they · Does + he / she / it + verbo base", examples: ["Do you study English? — ¿Estudias inglés?", "Does he work here? — ¿Él trabaja aquí?"], questions: [
      { text: "___ your friends play football?", choices: ["Does", "Do", "Are"], answer: 1, why: "Friends es plural; iniciamos la pregunta con Do." },
      { text: "___ she speak English?", choices: ["Do", "Does", "Is"], answer: 1, why: "Con she usamos Does; el verbo principal queda en base: speak." },
      { text: "Does Alex ___ near the school?", choices: ["lives", "live", "living"], answer: 1, why: "La -s ya está en Does; el verbo principal queda como live." }
    ] },
    { title: "Negaciones con don't y doesn't", purpose: "Expresar que algo no ocurre o no es una costumbre.", pattern: "I / You / We / They + don't · He / She / It + doesn't + verbo base", examples: ["I don't give up. — No me rindo.", "He doesn't work on Sundays. — Él no trabaja los domingos."], questions: [
      { text: "I ___ understand this word yet.", choices: ["doesn't", "don't", "am not"], answer: 1, why: "Con I usamos don't + verbo base." },
      { text: "She doesn't ___ coffee.", choices: ["drinks", "drink", "drinking"], answer: 1, why: "Después de doesn't, usamos el verbo base: drink." },
      { text: "They ___ live far from school.", choices: ["doesn't", "don't", "isn't"], answer: 1, why: "Con they usamos don't." }
    ] },
    { title: "Was y were", purpose: "Hablar de estados y lugares en pasado con el verbo be.", pattern: "I / He / She / It + was · You / We / They + were", examples: ["I was nervous. — Estaba nervioso.", "They were at school. — Estaban en el colegio."], questions: [
      { text: "Yesterday, I ___ tired.", choices: ["were", "was", "am"], answer: 1, why: "Con I, el pasado de be es was." },
      { text: "We ___ happy with the result.", choices: ["was", "were", "are"], answer: 1, why: "Con we usamos were." },
      { text: "___ she at the meeting?", choices: ["Was", "Were", "Did"], answer: 0, why: "En preguntas con she usamos Was al inicio." }
    ] },
    { title: "Can y can't", purpose: "Hablar de habilidades, posibilidades y permisos.", pattern: "can / can't + verbo base", examples: ["I can ask for help. — Puedo pedir ayuda.", "He can't come today. — Él no puede venir hoy."], questions: [
      { text: "She can ___ three languages.", choices: ["speaks", "speak", "speaking"], answer: 1, why: "Después de can usamos el verbo base: speak." },
      { text: "I ___ help you with that task.", choices: ["can", "am can", "cans"], answer: 0, why: "Can no cambia con I, you, he o they." },
      { text: "They ___ come today; they are sick.", choices: ["can't", "don't can", "aren't can"], answer: 0, why: "La forma negativa de can es can't." }
    ] },
    { title: "Have y has", purpose: "Expresar posesión, relaciones y características.", pattern: "I / You / We / They + have · He / She / It + has", examples: ["We have a plan. — Tenemos un plan.", "She has two ideas. — Ella tiene dos ideas."], questions: [
      { text: "My classmates ___ different interests.", choices: ["has", "have", "having"], answer: 1, why: "Con classmates (plural) usamos have." },
      { text: "Daniel ___ a new notebook.", choices: ["have", "has", "haves"], answer: 1, why: "Con Daniel (he) usamos has." },
      { text: "I ___ enough time to practice.", choices: ["has", "have", "am have"], answer: 1, why: "Con I usamos have." }
    ] },
    { title: "There is y there are", purpose: "Indicar que algo existe o está en un lugar.", pattern: "There is + singular · There are + plural", examples: ["There is a book on the desk. — Hay un libro en el escritorio.", "There are many options. — Hay muchas opciones."], questions: [
      { text: "___ a computer in the classroom.", choices: ["There are", "There is", "They is"], answer: 1, why: "A computer es singular, así que usamos There is." },
      { text: "___ three students outside.", choices: ["There is", "There are", "It are"], answer: 1, why: "Three students es plural; usamos There are." },
      { text: "Is there ___ water in the bottle?", choices: ["any", "many", "a"], answer: 0, why: "En preguntas sobre una cantidad incontable usamos any." }
    ] },
    { title: "Adverbios de frecuencia", purpose: "Decir con qué frecuencia hacemos algo.", pattern: "Adverbio + verbo principal · be + adverbio", examples: ["I usually read at night. — Usualmente leo de noche.", "She is always kind. — Ella siempre es amable."], questions: [
      { text: "I ___ practice after class. (usually)", choices: ["usually", "am usually", "usually am"], answer: 0, why: "Con un verbo principal, usually va antes: I usually practice." },
      { text: "He is ___ on time. (always)", choices: ["always", "always is", "is always"], answer: 2, why: "Con be, el adverbio suele ir después: is always." },
      { text: "Choose the natural order: They ___ help each other.", choices: ["often", "are often", "often are"], answer: 0, why: "Help es verbo principal; often va antes: They often help." }
    ] },
    { title: "Comparativos", purpose: "Comparar dos personas, lugares o cosas.", pattern: "Adjetivo corto + -er + than · more + adjetivo largo + than", examples: ["This book is shorter than that one. — Este libro es más corto que aquel.", "Math is more difficult than I expected. — Matemáticas es más difícil de lo que esperaba."], questions: [
      { text: "A train is usually ___ than a bicycle.", choices: ["fast", "faster", "fastest"], answer: 1, why: "Para comparar dos cosas usamos faster than." },
      { text: "This exercise is ___ difficult than the first one.", choices: ["more", "most", "many"], answer: 0, why: "Con el adjetivo largo difficult usamos more difficult." },
      { text: "My bag is ___ than yours. (heavy)", choices: ["heavyer", "heavier", "more heavy"], answer: 1, why: "En adjetivos terminados en consonante + y, cambiamos y por i: heavier." }
    ] },
    { title: "Superlativos", purpose: "Señalar el grado máximo dentro de un grupo.", pattern: "the + adjetivo corto + -est · the most + adjetivo largo", examples: ["She is the fastest runner. — Es la corredora más rápida.", "This is the most useful app. — Esta es la aplicación más útil."], questions: [
      { text: "Mount Everest is the ___ mountain on Earth.", choices: ["higher", "highest", "most high"], answer: 1, why: "Para el grado máximo de un adjetivo corto usamos highest." },
      { text: "That was the ___ interesting class this week.", choices: ["more", "most", "much"], answer: 1, why: "Con interesting usamos the most interesting." },
      { text: "This is ___ easiest question in the quiz.", choices: ["a", "the", "than"], answer: 1, why: "Los superlativos normalmente llevan the: the easiest." }
    ] },
    { title: "A, an y sustantivos", purpose: "Usar artículos con sustantivos contables singulares.", pattern: "a + sonido consonante · an + sonido vocal", examples: ["a university — una universidad.", "an idea — una idea."], questions: [
      { text: "She has ___ idea for the project.", choices: ["a", "an", "the"], answer: 1, why: "Idea empieza con sonido vocal, así que usamos an." },
      { text: "He wants to study at ___ university.", choices: ["an", "a", "some"], answer: 1, why: "University empieza con sonido /y/, consonántico: a university." },
      { text: "I need ___ notebook.", choices: ["a", "an", "any"], answer: 0, why: "Notebook empieza con sonido consonante; usamos a." }
    ] },
    { title: "Some y any", purpose: "Hablar de cantidades no especificadas.", pattern: "some: afirmaciones y ofrecimientos · any: preguntas y negaciones", examples: ["We have some time. — Tenemos algo de tiempo.", "Do you have any questions? — ¿Tienes alguna pregunta?"], questions: [
      { text: "There are ___ books on the table.", choices: ["some", "any", "much"], answer: 0, why: "En una afirmación, some introduce una cantidad no especificada." },
      { text: "Do you have ___ questions?", choices: ["some", "any", "a"], answer: 1, why: "En preguntas generales es común usar any." },
      { text: "We don't have ___ classes tomorrow.", choices: ["some", "any", "much"], answer: 1, why: "En una negación usamos any." }
    ] },
    { title: "Much y many", purpose: "Preguntar y hablar de cantidades grandes.", pattern: "many + contables plurales · much + incontables", examples: ["How many students are there? — ¿Cuántos estudiantes hay?", "How much water do we need? — ¿Cuánta agua necesitamos?"], questions: [
      { text: "How ___ people are in your class?", choices: ["much", "many", "any"], answer: 1, why: "People se puede contar; usamos many." },
      { text: "How ___ time do we have?", choices: ["many", "much", "few"], answer: 1, why: "Time se trata como incontable; usamos much." },
      { text: "There aren't ___ chairs for everyone.", choices: ["much", "many", "little"], answer: 1, why: "Chairs es contable y plural; usamos many." }
    ] },
    { title: "Preposiciones de lugar", purpose: "Explicar dónde se encuentra algo.", pattern: "in: dentro · on: sobre una superficie · under: debajo · next to: al lado", examples: ["The keys are on the desk. — Las llaves están sobre el escritorio.", "My school is next to the park. — Mi colegio está al lado del parque."], questions: [
      { text: "The cat is ___ the table; you can't see it below.", choices: ["under", "between", "on"], answer: 0, why: "Under significa debajo de." },
      { text: "The notebook is ___ the backpack.", choices: ["in", "between", "over"], answer: 0, why: "In indica que está dentro de la mochila." },
      { text: "The pharmacy is ___ the bank and the café.", choices: ["between", "under", "on"], answer: 0, why: "Between se usa para ubicar algo entre dos lugares." }
    ] },
    { title: "Preposiciones de tiempo", purpose: "Ubicar acciones en una hora, un día o un periodo.", pattern: "at + hora · on + día/fecha · in + mes/año/periodo", examples: ["at 7:00 — a las 7:00.", "on Monday · in October · in 2026."], questions: [
      { text: "The exam starts ___ 8:00.", choices: ["in", "at", "on"], answer: 1, why: "Usamos at con una hora exacta." },
      { text: "We have English class ___ Friday.", choices: ["on", "at", "in"], answer: 0, why: "Usamos on con los días de la semana." },
      { text: "My birthday is ___ July.", choices: ["at", "on", "in"], answer: 2, why: "Usamos in con los meses." }
    ] },
    { title: "Consejos con should", purpose: "Dar recomendaciones o expresar lo que sería conveniente.", pattern: "should / shouldn't + verbo base", examples: ["You should rest. — Deberías descansar.", "We shouldn't judge others. — No deberíamos juzgar a los demás."], questions: [
      { text: "You ___ ask a teacher if the instructions are unclear.", choices: ["should", "should to", "shoulds"], answer: 0, why: "Después de should usamos directamente el verbo base." },
      { text: "He should ___ more water.", choices: ["drinks", "drink", "to drink"], answer: 1, why: "Should va seguido de la forma base: drink." },
      { text: "They ___ share someone's private information.", choices: ["shouldn't", "don't should", "shouldn't to"], answer: 0, why: "La forma negativa es shouldn't + verbo base." }
    ] },
    { title: "Obligación: must y have to", purpose: "Expresar reglas, responsabilidades u obligaciones.", pattern: "must + verbo base · have / has to + verbo base", examples: ["Students must wear an ID. — Los estudiantes deben usar identificación.", "She has to finish a form. — Ella tiene que terminar un formulario."], questions: [
      { text: "We ___ follow the safety rules.", choices: ["must", "must to", "musts"], answer: 0, why: "Must se combina directamente con el verbo base." },
      { text: "He ___ to arrive before 8:00.", choices: ["have", "has", "must has"], answer: 1, why: "Con he usamos has to." },
      { text: "I have to ___ my assignment.", choices: ["finish", "finishes", "finishing"], answer: 0, why: "Después de have to va el verbo base." }
    ] },
    { title: "Presente perfecto", purpose: "Conectar una experiencia o acción pasada con el presente.", pattern: "have / has + participio pasado", examples: ["I have learned a lot. — He aprendido mucho.", "She has visited Bogotá. — Ella ha visitado Bogotá."], questions: [
      { text: "They have ___ the activity.", choices: ["finish", "finished", "finishing"], answer: 1, why: "Después de have usamos el participio: finished." },
      { text: "She ___ never tried sushi.", choices: ["have", "has", "is"], answer: 1, why: "Con she usamos has." },
      { text: "I have ___ that movie before.", choices: ["saw", "seen", "see"], answer: 1, why: "El participio de see es seen." }
    ] },
    { title: "Primer condicional", purpose: "Hablar de un resultado posible si se cumple una condición futura.", pattern: "If + presente simple, will + verbo base", examples: ["If we practice, we will improve. — Si practicamos, mejoraremos.", "If it rains, we will stay inside. — Si llueve, nos quedaremos adentro."], questions: [
      { text: "If I study, I ___ the topic better.", choices: ["will understand", "understood", "understand"], answer: 0, why: "En la consecuencia posible usamos will + verbo base." },
      { text: "If she ___ early, we will start on time.", choices: ["arrives", "will arrive", "arrived"], answer: 0, why: "Después de if, en este condicional usamos presente simple." },
      { text: "If they are tired, they ___ a break.", choices: ["will take", "took", "takes"], answer: 0, why: "La consecuencia lleva will + verbo base." }
    ] },
    { title: "Palabras para preguntar", purpose: "Pedir información concreta y comprender mejor una situación.", pattern: "who: quién · what: qué · where: dónde · when: cuándo · why: por qué · how: cómo", examples: ["Where do you study? — ¿Dónde estudias?", "Why are you learning English? — ¿Por qué estás aprendiendo inglés?"], questions: [
      { text: "___ do you live? — In Montería.", choices: ["Where", "When", "Who"], answer: 0, why: "La respuesta es un lugar; preguntamos con Where." },
      { text: "___ is your English teacher? — Mr. Ruiz.", choices: ["Who", "Why", "Where"], answer: 0, why: "Preguntamos por una persona con Who." },
      { text: "___ are you late? — Because the bus was delayed.", choices: ["What", "Why", "When"], answer: 1, why: "Because da una razón; preguntamos con Why." }
    ] },
    { title: "Pronombres personales", purpose: "Reemplazar nombres para evitar repeticiones.", pattern: "I, you, he, she, it, we, they", examples: ["Sara is kind. She helps her team. — Sara es amable. Ella ayuda a su equipo.", "My friends study. They work together. — Mis amigos estudian. Ellos trabajan juntos."], questions: [
      { text: "Laura is my friend. ___ is very creative.", choices: ["He", "She", "They"], answer: 1, why: "Laura es una persona femenina; usamos She." },
      { text: "My brother and I are students. ___ study together.", choices: ["We", "They", "It"], answer: 0, why: "My brother and I se reemplaza por We." },
      { text: "The dog is hungry. ___ needs food.", choices: ["He", "It", "We"], answer: 1, why: "Para un animal sin especificar género usamos It." }
    ] },
    { title: "Adjetivos posesivos", purpose: "Indicar a quién pertenece algo.", pattern: "my, your, his, her, its, our, their + sustantivo", examples: ["This is my notebook. — Este es mi cuaderno.", "Their project is interesting. — Su proyecto es interesante."], questions: [
      { text: "I have a pencil. This is ___ pencil.", choices: ["my", "me", "I"], answer: 0, why: "Antes del sustantivo pencil usamos el posesivo my." },
      { text: "The students finished ___ project.", choices: ["they", "their", "them"], answer: 1, why: "Their indica que el proyecto pertenece a los estudiantes." },
      { text: "Daniel loves ___ dog.", choices: ["his", "he", "him"], answer: 0, why: "Usamos his antes del sustantivo dog." }
    ] },
    { title: "Conectores: and, but, because", purpose: "Unir ideas y mostrar suma, contraste o causa.", pattern: "and: y · but: pero · because: porque", examples: ["I study and work. — Estudio y trabajo.", "I stayed home because it rained. — Me quedé en casa porque llovió."], questions: [
      { text: "I like science, ___ math is my favorite.", choices: ["but", "because", "or"], answer: 0, why: "But introduce un contraste." },
      { text: "She was happy ___ she passed the exam.", choices: ["but", "because", "and"], answer: 1, why: "Because explica la razón." },
      { text: "We need paper ___ pencils.", choices: ["and", "because", "but"], answer: 0, why: "And suma elementos." }
    ] },
    { title: "Verbo + infinitivo o -ing", purpose: "Algunos verbos suelen ir seguidos de to + verbo o de verbo-ing.", pattern: "want / need + to + verbo · enjoy / finish + verbo-ing", examples: ["I want to learn. — Quiero aprender.", "They enjoy reading. — Disfrutan leer."], questions: [
      { text: "I want ___ a new language.", choices: ["learn", "to learn", "learning"], answer: 1, why: "Después de want usamos to + verbo." },
      { text: "She enjoys ___ with her classmates.", choices: ["talk", "to talk", "talking"], answer: 2, why: "Después de enjoy usamos verbo-ing." },
      { text: "We need ___ early tomorrow.", choices: ["to arrive", "arriving", "arrive"], answer: 0, why: "Después de need usamos to + verbo." }
    ] },
    { title: "Voz pasiva", purpose: "Enfocar la acción o su resultado cuando quien la hace no es lo principal.", pattern: "be + participio pasado", examples: ["The song was written in 1990. — La canción fue escrita en 1990.", "English is spoken here. — Aquí se habla inglés."], questions: [
      { text: "The classroom ___ every afternoon.", choices: ["cleans", "is cleaned", "cleaned"], answer: 1, why: "El salón recibe la acción; usamos is + participio." },
      { text: "The letters were ___ yesterday.", choices: ["send", "sent", "sending"], answer: 1, why: "Después de were usamos el participio; send → sent." },
      { text: "This book was ___ by a Colombian writer.", choices: ["write", "wrote", "written"], answer: 2, why: "Write → written es el participio que acompaña a was." }
    ] },
    { title: "Secuencia de acciones", purpose: "Ordenar instrucciones o narrar pasos con claridad.", pattern: "first: primero · then: después · next: luego · finally: finalmente", examples: ["First, read the question. Then, choose an answer. — Primero, lee la pregunta. Luego, elige una respuesta.", "Finally, check your work. — Finalmente, revisa tu trabajo."], questions: [
      { text: "___, open the document. Then, read the first paragraph.", choices: ["First", "Finally", "Because"], answer: 0, why: "First presenta el primer paso." },
      { text: "First, plan the project. ___, share the tasks.", choices: ["Then", "Because", "Although"], answer: 0, why: "Then indica el paso que sigue." },
      { text: "___, check that all answers are complete.", choices: ["Finally", "First", "But"], answer: 0, why: "Finally introduce el último paso." }
    ] }
  ];

  const progress = document.createElement("p");
  progress.id = "grammar-progress";
  progress.className = "note";
  topicSelect.closest(".grammar-controls")?.after(progress);

  const today = new Date();
  const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const startUTC = Date.UTC(2026, 0, 1);
  const dayNumber = Math.floor((todayUTC - startUTC) / 86400000);
  const dailyIndex = ((dayNumber % lessons.length) + lessons.length) % lessons.length;
  const todayLabel = today.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  let questionIndex = 0;
  let answered = false;
  let activeIndex = dailyIndex;
  const localDateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const scoreKey = `villa-english-grammar-score-${localDateKey}`;
  let score = 0;
  try { score = Number(window.localStorage.getItem(scoreKey) || 0); } catch { /* The game still works if local storage is blocked. */ }

  function add(parent, tag, value, className = "") {
    const node = document.createElement(tag);
    node.textContent = value;
    if (className) node.className = className;
    parent.append(node);
    return node;
  }

  topicSelect.replaceChildren();
  lessons.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = item.title;
    topicSelect.append(option);
  });
  topicSelect.value = String(dailyIndex);

  function render() {
    const current = lessons[activeIndex] || lessons[dailyIndex];
    const item = current.questions[questionIndex % current.questions.length];
    answered = false;
    lesson.replaceChildren();
    const dailyLabel = activeIndex === dailyIndex
      ? `Reto diario · ${todayLabel} · tema ${dailyIndex + 1} de ${lessons.length}`
      : `Tema elegido · ${todayLabel} · reto del día: ${lessons[dailyIndex].title}`;
    add(lesson, "p", dailyLabel, "grammar-pattern");
    add(lesson, "h3", current.title);
    add(lesson, "p", current.purpose);
    add(lesson, "p", current.pattern, "grammar-pattern");
    const examples = document.createElement("ul");
    current.examples.forEach(example => add(examples, "li", example));
    lesson.append(examples);

    question.textContent = item.text;
    options.replaceChildren();
    item.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn";
      button.textContent = choice;
      button.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const correct = index === item.answer;
        if (correct) {
          score++;
          try { window.localStorage.setItem(scoreKey, String(score)); } catch { /* Keep this session's score in memory. */ }
        }
        feedback.textContent = `${correct ? "¡Correcto! " : "Revisen la regla. "}${item.why}`;
        feedback.className = `feedback ${correct ? "grammar-correct" : "grammar-retry"}`;
        options.querySelectorAll("button").forEach(option => { option.disabled = true; });
        button.classList.add(correct ? "grammar-answer-good" : "grammar-answer-wrong");
        if (!correct) options.children[item.answer]?.classList.add("grammar-answer-good");
        progress.textContent = `Reto ${questionIndex + 1} de ${current.questions.length} · aciertos del grupo hoy: ${score}`;
        nextButton.textContent = questionIndex === current.questions.length - 1 ? "Repetir reto del día ↻" : "Siguiente reto →";
      });
      options.append(button);
    });
    feedback.textContent = "Conversen en equipo, expliquen por qué y elijan una respuesta.";
    feedback.className = "feedback";
    progress.textContent = `Reto ${questionIndex + 1} de ${current.questions.length} · aciertos del grupo hoy: ${score}`;
    nextButton.textContent = "Siguiente reto →";
  }

  topicSelect.addEventListener("change", () => {
    activeIndex = Number(topicSelect.value);
    questionIndex = 0;
    render();
  });
  nextButton.addEventListener("click", () => {
    const current = lessons[activeIndex] || lessons[dailyIndex];
    questionIndex = (questionIndex + 1) % current.questions.length;
    render();
  });
  render();
})();
