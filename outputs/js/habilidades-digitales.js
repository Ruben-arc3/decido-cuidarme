const lessons = {
  programacion: {
    icon: "🧑‍💻", title: "Programación: pensar en pasos", label: "Lógica y algoritmos", duration: "10 minutos",
    intro: "Programar empieza por describir una solución con instrucciones claras. Un algoritmo es una secuencia finita de pasos que transforma una situación inicial en un resultado.",
    goal: "Al terminar, podrás escribir un algoritmo, probarlo con un caso y corregir un paso ambiguo.",
    ideas: ["Secuencia: el orden de los pasos cambia el resultado.", "Condición: permite elegir una acción según lo que ocurra.", "Prueba: recorrer los pasos con un caso ayuda a descubrir errores."],
    concepts: [
      { term: "Algoritmo", meaning: "Conjunto ordenado y finito de instrucciones para lograr un resultado.", use: "Sirve para explicar una solución de modo que otra persona pueda repetirla.", example: "Elegir tema → repartir tareas → preparar material → ensayar." },
      { term: "Variable", meaning: "Dato que se guarda con un nombre y puede cambiar.", use: "Ayuda a representar información que el programa necesita recordar.", example: "minutosDeExposición = 5." },
      { term: "Condición", meaning: "Regla que permite elegir entre acciones según se cumpla algo.", use: "Sirve para que un algoritmo responda a situaciones diferentes.", example: "Si falta una fuente, buscar otra antes de presentar." },
      { term: "Ciclo", meaning: "Instrucción que repite una acción o un grupo de pasos.", use: "Evita escribir muchas veces la misma instrucción.", example: "Revisar cada diapositiva hasta que todas tengan una fuente." },
      { term: "Depurar", meaning: "Encontrar y corregir errores en una secuencia o programa.", use: "Permite mejorar la solución probando paso por paso.", example: "Si el equipo no sabe quién expone, agregar un paso para repartir roles." }
    ],
    scenario: "Reto: organizar una exposición de cinco minutos. El grupo debe elegir un tema, repartir tareas, preparar un apoyo visual y ensayar.",
    question: "¿Qué instrucción está mejor escrita para que cualquier compañero pueda cumplirla?",
    choices: ["Prepara algo bonito para mañana.", "Elige un tema, escribe tres ideas principales y compártelas con el grupo antes del ensayo.", "Haz la exposición como siempre."],
    answer: 1, feedback: "La segunda opción define acciones observables, una cantidad y un momento para compartir. Las otras dependen de interpretaciones distintas.",
    challenge: "Escriban entre todos un algoritmo de seis pasos para una tarea escolar. Luego intercambien las instrucciones con otro equipo y pidan que las siga literalmente. Ajusten los pasos que generen dudas.",
    apiQuery: "algoritmo programación informática", resources: [{ label: "MDN: aprende desarrollo web", href: "https://developer.mozilla.org/es/docs/Learn_web_development" }, { label: "MDN: introducción a HTML", href: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content" }]
  },
  "inteligencia-artificial": {
    icon: "🤖", title: "Inteligencia artificial: usarla con criterio", label: "Preguntar, revisar y decidir", duration: "10 minutos",
    intro: "Una IA generativa produce respuestas a partir de patrones aprendidos. Puede ayudar a resumir o proponer ideas, pero también puede equivocarse, omitir contexto o presentar una afirmación falsa con seguridad.",
    goal: "Al terminar, podrás formular una solicitud clara y revisar una respuesta antes de usarla.",
    ideas: ["Da contexto y explica para quién es la respuesta.", "Pide un formato concreto, como una lista o un ejemplo.", "Comprueba los datos importantes con fuentes independientes y no ingreses información privada."],
    concepts: [
      { term: "Modelo generativo", meaning: "Sistema que produce texto, imágenes u otros contenidos a partir de patrones aprendidos.", use: "Puede ayudar a proponer borradores, ejemplos o explicaciones para revisar.", example: "Pedir tres formas de organizar una exposición." },
      { term: "Prompt", meaning: "Instrucción o pregunta que se da a la herramienta, con contexto y objetivo.", use: "Un prompt claro permite obtener una respuesta más útil y ajustada a la tarea.", example: "Explica la fotosíntesis a grado noveno en cinco pasos y con un ejemplo." },
      { term: "Alucinación", meaning: "Respuesta inventada o incorrecta que puede sonar convincente.", use: "Recordar este riesgo evita tratar la respuesta como una fuente definitiva.", example: "Una beca, fecha o requisito que la IA menciona pero no aparece en la convocatoria." },
      { term: "Fuente primaria", meaning: "Documento o información original de quien publica o toma una decisión.", use: "Sirve para confirmar datos actuales y detalles importantes.", example: "La convocatoria oficial de la institución que ofrece la beca." },
      { term: "Dato personal", meaning: "Información que identifica o permite contactar a una persona.", use: "Protegerlo reduce riesgos al usar herramientas en línea.", example: "No incluir nombre completo, teléfono, dirección ni contraseña en un prompt." }
    ],
    scenario: "La IA afirma que una beca cubre todos los gastos, pero no muestra una fuente ni la fecha. Un compañero quiere compartirlo en el grupo del curso.",
    question: "¿Cuál es el siguiente paso más responsable?",
    choices: ["Compartirlo porque la respuesta suena convincente.", "Pedir a la IA que repita la afirmación con más seguridad.", "Buscar la convocatoria original y confirmar allí cobertura, requisitos y fechas."],
    answer: 2, feedback: "La fuente oficial de la convocatoria permite comprobar las condiciones vigentes. La IA puede ayudar a entenderlas, pero no sustituye la verificación.",
    challenge: "En parejas, escriban una solicitud para obtener una explicación de un tema escolar. Después diseñen una lista de dos fuentes y tres datos que usarían para comprobar la respuesta. No escriban nombres ni información privada.",
    apiQuery: "inteligencia artificial aprendizaje", resources: [{ label: "UNESCO: marco de competencias de IA para estudiantes", href: "https://www.unesco.org/es/articles/marco-de-competencias-para-estudiantes-en-materia-de-ia?hub=84624" }, { label: "Documentación de Gemini API", href: "https://ai.google.dev/gemini-api/docs" }]
  },
  "seguridad-informatica": {
    icon: "🔐", title: "Seguridad informática: detectar riesgos", label: "Protege tus cuentas y dispositivos", duration: "10 minutos",
    intro: "La seguridad digital combina hábitos sencillos: usar contraseñas diferentes, activar la verificación en dos pasos, actualizar los dispositivos y desconfiar de mensajes que presionan para actuar de inmediato.",
    goal: "Al terminar, podrás identificar señales de un mensaje sospechoso y elegir una respuesta segura.",
    ideas: ["No entregues códigos de verificación ni contraseñas por mensajes.", "Revisa el remitente y visita el sitio escribiendo su dirección por tu cuenta.", "Ante una alerta, confirma con la organización por un canal conocido."],
    concepts: [
      { term: "Phishing", meaning: "Engaño que suplanta a una persona o entidad para robar datos o conseguir que abras un enlace.", use: "Reconocerlo permite detenerse y confirmar antes de responder.", example: "Un mensaje urgente que amenaza con cerrar la cuenta si no escribes la contraseña." },
      { term: "Dominio", meaning: "Nombre principal de una dirección web que identifica el sitio al que vas a entrar.", use: "Revisarlo ayuda a notar direcciones falsas o con letras cambiadas.", example: "Comprueba el nombre del sitio; no confíes solo en el logo o el texto del enlace." },
      { term: "Contraseña única", meaning: "Clave diferente para cada cuenta, larga y difícil de adivinar.", use: "Si una cuenta se filtra, reduce la posibilidad de que otras también queden expuestas.", example: "No reutilizar la clave del correo en redes sociales." },
      { term: "Verificación en dos pasos", meaning: "Segundo control además de la contraseña para confirmar el inicio de sesión.", use: "Añade una barrera si alguien consigue la clave.", example: "Una aplicación autenticadora o llave de seguridad; nunca compartas el código recibido." },
      { term: "Canal oficial", meaning: "Medio de contacto que la institución publica y reconoce como propio.", use: "Permite confirmar alertas sin usar el enlace sospechoso del mensaje.", example: "Abrir por cuenta propia el portal del colegio o preguntar a un docente." }
    ],
    scenario: "Llega un mensaje: “Tu cuenta escolar será cerrada en diez minutos. Abre este enlace y escribe tu contraseña para conservarla”. No esperabas ese aviso.",
    question: "¿Qué acción protege mejor la cuenta?",
    choices: ["Abrir el enlace porque el mensaje tiene el logo del colegio.", "No abrirlo y consultar directamente al colegio usando un canal conocido.", "Responder con la contraseña para confirmar que eres el titular."],
    answer: 1, feedback: "La urgencia y la solicitud de contraseña son señales de riesgo. Confirma la alerta con el colegio mediante un contacto que ya conozcas.",
    challenge: "En grupo, inventen un mensaje sospechoso sin usar marcas ni datos reales. Subrayen tres señales de alerta y escriban una respuesta segura para quien lo recibió.",
    apiQuery: "seguridad informática phishing privacidad digital", resources: [{ label: "FTC: cómo reconocer y evitar mensajes de phishing", href: "https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams" }, { label: "Google: protege tu cuenta", href: "https://support.google.com/accounts/answer/46526?hl=es" }]
  },
  productividad: {
    icon: "🧠", title: "Productividad: avanzar con un plan", label: "Priorizar y concentrarse", duration: "10 minutos",
    intro: "Ser productivo no significa llenar cada minuto. Consiste en decidir qué resultado importa, dividirlo en acciones pequeñas y reservar tiempo para trabajar y descansar.",
    goal: "Al terminar, podrás convertir una tarea grande en un plan corto y realista.",
    ideas: ["Define el resultado que necesitas entregar.", "Divide el trabajo en acciones que puedas iniciar hoy.", "Estima el tiempo, elige una prioridad y deja espacio para revisar."],
    concepts: [
      { term: "Meta concreta", meaning: "Resultado observable que quieres alcanzar.", use: "Aclara cómo sabrás que una sesión de trabajo terminó.", example: "Resolver cinco preguntas y revisar los errores, en vez de solo ‘estudiar’" },
      { term: "Prioridad", meaning: "Tarea que conviene atender primero por su importancia o fecha límite.", use: "Ayuda a elegir el siguiente paso cuando compiten varias obligaciones.", example: "Preparar el borrador que vence mañana antes de ordenar apuntes." },
      { term: "Dividir una tarea", meaning: "Separar un trabajo grande en acciones pequeñas y realizables.", use: "Hace más fácil comenzar, estimar el tiempo y pedir apoyo específico.", example: "Tema, tres ideas, fuentes, diapositivas y ensayo." },
      { term: "Bloque de tiempo", meaning: "Periodo reservado para una sola tarea, con inicio y final previstos.", use: "Protege la atención y ayuda a revisar si el plan cabe en el horario.", example: "Veinte minutos para el primer borrador y cinco para una pausa." },
      { term: "Pausa consciente", meaning: "Descanso breve elegido para recuperar atención o cambiar de actividad.", use: "Permite sostener el plan sin convertirlo en una jornada agotadora.", example: "Levantarse, tomar agua y volver a la siguiente tarea." }
    ],
    scenario: "Debes entregar el viernes una exposición, estudiar para una evaluación y responder mensajes del grupo. Hoy tienes 40 minutos disponibles.",
    question: "¿Qué plan permite empezar sin intentar hacerlo todo a la vez?",
    choices: ["Abrir todas las tareas y cambiar de una a otra cada pocos minutos.", "Elegir el siguiente paso de la exposición, trabajar 25 minutos sin notificaciones y reservar 5 para revisar el plan.", "Esperar hasta tener una tarde completa y libre."],
    answer: 1, feedback: "Un bloque breve con una prioridad reduce la dispersión y deja una acción concreta terminada. Puedes ajustar los tiempos a tu realidad.",
    challenge: "Elige una tarea real de esta semana. Anota el resultado esperado, tres pasos, el primer paso de 15 minutos y una pausa. Si el plan no cabe en tu horario, reduce o reorganiza la tarea.",
    apiQuery: "gestión del tiempo hábitos de estudio planificación", resources: [{ label: "UNC Learning Center: time management", href: "https://learningcenter.unc.edu/tips-and-tools/time-management/" }, { label: "Universidad de Minnesota: hábitos de estudio", href: "https://undergrad.umn.edu/tutoring/study-skills" }]
  },
  "verificar-informacion": {
    icon: "🔎", title: "Verifica información antes de compartir", label: "Fuentes, evidencia y contexto", duration: "10 minutos",
    intro: "Una publicación viral no se vuelve confiable por tener muchas reacciones. Antes de compartirla, revisa quién la publicó, cuándo, qué pruebas presenta y si otros medios o fuentes originales la confirman.",
    goal: "Al terminar, podrás hacer una verificación rápida y explicar por qué una fuente merece confianza o necesita más revisión.",
    ideas: ["Busca el origen: autor, entidad y documento original.", "Comprueba fecha, lugar y contexto; una noticia antigua puede circular como nueva.", "Compara fuentes independientes y distingue hechos de opiniones."],
    concepts: [
      { term: "Afirmación", meaning: "Frase concreta que puede comprobarse con evidencia.", use: "Delimitarla evita discutir una publicación entera sin saber qué dato verificar.", example: "‘Mañana se cancelan las clases’ es una afirmación comprobable." },
      { term: "Fuente primaria", meaning: "Registro original relacionado directamente con el hecho.", use: "Sirve para acercarse a la información antes de que otros la resuman.", example: "El comunicado publicado por el colegio, no una captura reenviada." },
      { term: "Corroborar", meaning: "Comparar la afirmación con otras fuentes independientes.", use: "Ayuda a detectar errores y confirmar que distintas fuentes describen el mismo hecho.", example: "Buscar el anuncio en el canal oficial y confirmar con una persona responsable." },
      { term: "Contexto", meaning: "Fecha, lugar y circunstancias que permiten interpretar una información.", use: "Evita presentar como actual una noticia vieja o un dato de otro lugar.", example: "Revisar si la circular corresponde a este año y a esta sede." },
      { term: "Evidencia", meaning: "Documento, dato o registro que respalda o contradice una afirmación.", use: "Permite justificar una conclusión en vez de basarse solo en reacciones o rumores.", example: "Una circular fechada o una publicación institucional verificable." }
    ],
    scenario: "En un chat circula una imagen que anuncia que mañana se cancelan las clases. No tiene fecha visible y no aparece en la página oficial del colegio.",
    question: "¿Qué conviene hacer antes de reenviarla?",
    choices: ["Reenviarla con la frase “por si acaso”.", "Buscar el comunicado en los canales oficiales del colegio o preguntar a un docente por un canal conocido.", "Concluir que es cierta porque varias personas la recibieron."],
    answer: 1, feedback: "La confirmación debe venir de un canal oficial o de una persona responsable. La cantidad de reenvíos no prueba que el anuncio sea verdadero.",
    challenge: "Elijan una afirmación pública no personal. En equipo registren autor, fecha, fuente original, evidencia y una segunda fuente. Concluyan: confirmada, falsa o todavía no comprobada.",
    apiQuery: "verificación de hechos fuentes confiables noticias falsas", resources: [{ label: "Google Fact Check Explorer", href: "https://toolbox.google.com/factcheck/explorer" }, { label: "Google Fact Check Tools API", href: "https://developers.google.com/fact-check/tools/api/reference/rest/" }, { label: "Wikimedia Action API", href: "https://www.mediawiki.org/wiki/API:Main_page" }]
  },
  "guia-digital": {
    icon: "🛠️", title: "Diseña una guía digital útil", label: "Explicar para que otros puedan hacerlo", duration: "15 minutos",
    intro: "Una buena guía digital resuelve una necesidad concreta. Usa un título directo, pasos ordenados, palabras claras y fuentes que permitan ampliar la información. Las imágenes deben aportar algo y describirse para quienes no pueden verlas.",
    goal: "Al terminar, tendrás el borrador de una guía breve que puedes guardar como archivo de texto o imprimir.",
    ideas: ["Piensa en una persona que necesita resolver una tarea.", "Escribe pasos con verbos de acción y una idea por paso.", "Añade una fuente y texto alternativo para cada imagen informativa."],
    concepts: [
      { term: "Público", meaning: "Personas a quienes va dirigida la guía y lo que ya pueden saber.", use: "Ayuda a elegir vocabulario, ejemplos y cantidad de detalle.", example: "Una guía para estudiantes nuevos debe explicar dónde encontrar el portal escolar." },
      { term: "Jerarquía visual", meaning: "Orden que muestran títulos, subtítulos, listas y espacios.", use: "Permite encontrar rápido la información más importante.", example: "Un título claro, pasos numerados y una advertencia destacada." },
      { term: "Lenguaje claro", meaning: "Palabras directas y frases fáciles de seguir.", use: "Reduce confusiones y hace que las instrucciones sean más accesibles.", example: "‘Abre el menú y selecciona Guardar’ en vez de ‘procede a efectuar el almacenamiento’." },
      { term: "Texto alternativo", meaning: "Descripción breve de la información que aporta una imagen.", use: "Comunica el contenido visual a quien usa lector de pantalla o no puede ver la imagen.", example: "‘Diagrama con tres pasos para verificar una fuente’ en vez de ‘imagen’." },
      { term: "Atribución", meaning: "Indicación de quién creó una fuente o material y dónde consultarlo.", use: "Permite verificar, ampliar y reconocer el trabajo de otras personas.", example: "Incluir nombre de la institución, título del recurso y enlace." }
    ],
    scenario: "Tu curso quiere explicar a estudiantes nuevos cómo encontrar información confiable para una tarea.",
    question: "¿Qué estructura ayuda más a quien va a seguir la guía?",
    choices: ["Un párrafo largo con muchas ideas y sin fuentes.", "Un título específico, pasos numerados, un ejemplo y enlaces para ampliar.", "Varias imágenes decorativas sin explicación."],
    answer: 1, feedback: "El título y los pasos orientan; el ejemplo muestra cómo aplicar la instrucción y las fuentes permiten verificar o ampliar.",
    challenge: "Completa el generador de abajo. Usa un tema escolar o una habilidad cotidiana; no incluyas nombres, teléfonos ni información privada.",
    apiQuery: "accesibilidad web diseño de información", resources: [{ label: "W3C: árbol de decisión para texto alternativo", href: "https://www.w3.org/WAI/tutorials/images/decision-tree/" }, { label: "MDN: diseño web accesible", href: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Accessibility" }],
    guideBuilder: true
  }
};

const order = ["programacion", "inteligencia-artificial", "seguridad-informatica", "productividad", "verificar-informacion", "guia-digital"];
const id = document.body.dataset.skill;
const lesson = lessons[id];
const app = document.getElementById("skill-app");

if (!lesson || !app) {
  if (app) app.innerHTML = '<main class="shell"><p>No encontramos este módulo. <a href="villa-habilidades-digitales.html">Volver a Habilidades digitales</a></p></main>';
} else {
  const index = order.indexOf(id);
  const prev = index > 0 ? order[index - 1] : null;
  const next = index < order.length - 1 ? order[index + 1] : null;
  const href = key => `villa-habilidad-${key}.html`;
  const choices = lesson.choices.map((choice, i) => `<button class="choice" type="button" data-choice="${i}">${String.fromCharCode(65 + i)}. ${choice}</button>`).join("");
  const concepts = lesson.concepts.map(concept => `<article class="concept-card"><h3>${concept.term}</h3><p><b>Qué significa:</b> ${concept.meaning}</p><p><b>Para qué sirve:</b> ${concept.use}</p><p><b>Ejemplo:</b> ${concept.example}</p></article>`).join("");
  const resources = lesson.resources.map(resource => `<li><a href="${resource.href}" target="_blank" rel="noopener noreferrer">${resource.label} ↗</a></li>`).join("");
  const builder = lesson.guideBuilder ? `
    <form id="guide-form" class="guide-form">
      <label>Título de la guía<input name="title" maxlength="90" required placeholder="Ej.: Cómo verificar una noticia"></label>
      <label>¿Para quién y para qué sirve?<textarea name="purpose" maxlength="240" required placeholder="Ayudará a estudiantes a..."></textarea></label>
      <div class="cols"><label>Paso 1<textarea name="step1" maxlength="180" required></textarea></label><label>Paso 2<textarea name="step2" maxlength="180" required></textarea></label></div>
      <label>Paso 3<textarea name="step3" maxlength="180" required></textarea></label>
      <label>Fuente consultada<input name="source" maxlength="180" placeholder="Nombre y enlace de la fuente"></label>
      <label>Descripción de la imagen (opcional)<input name="alt" maxlength="180" placeholder="Qué información aporta la imagen"></label>
      <div class="inline-actions"><button class="primary" type="submit">Crear vista previa</button><button class="mark-btn" type="button" id="download-guide" disabled>Descargar guía</button></div>
    </form><article id="guide-preview" class="preview" hidden aria-live="polite"></article>` : "";
  const done = localStorage.getItem(`habilidades:${id}`) === "done";

  app.innerHTML = `
    <header class="top"><div class="shell topline"><a class="brand" href="villa-habilidades-digitales.html">VILLA ESTHER · HABILIDADES DIGITALES</a><a class="back" href="institucion-villa-esther.html#modulos">← Módulos</a></div></header>
    <main class="shell">
      <section class="hero"><div class="kicker">Módulo ${index + 1} de ${order.length} · ${lesson.label}</div><h1>${lesson.icon} ${lesson.title}</h1><p>${lesson.intro}</p><span class="tag">Ruta breve · ${lesson.duration}</span></section>
      <section class="section"><h2>Qué vas a aprender</h2><p>${lesson.goal}</p><div class="cols">${lesson.ideas.map((idea, i) => `<div class="note"><b>${i + 1}.</b> ${idea}</div>`).join("")}</div></section>
      <section class="section"><h2>Conceptos clave para este reto</h2><p>Consulta estas palabras mientras resuelves la actividad. Cada una incluye su utilidad y un ejemplo.</p><div class="concept-grid">${concepts}</div></section>
      <section class="section"><h2>Prueba lo aprendido</h2><div class="scenario"><b>Situación</b><br>${lesson.scenario}</div><p><b>${lesson.question}</b></p><div class="choices">${choices}</div><div id="answer-feedback" class="feedback" role="status" aria-live="polite"></div><details><summary>Ver una explicación posible</summary><p>${lesson.feedback}</p></details></section>
      <section class="section"><h2>Reto práctico</h2><div class="challenge"><b>Hazlo en clase o en casa</b><br>${lesson.challenge}</div>${builder}</section>
      <section class="section"><h2>Consulta una fuente abierta</h2><p>Busca lecturas complementarias en Wikipedia en español mediante su API pública. Revisa siempre las fuentes originales y contrasta lo que encuentres con los recursos recomendados abajo. La búsqueda se envía a Wikimedia; no escribas datos personales.</p><div class="search-row"><label for="open-search-query">Tema para buscar</label><div class="inline-actions"><input id="open-search-query" maxlength="100" value="${lesson.apiQuery}" aria-label="Tema para buscar"><button class="primary" id="open-search-button" type="button">Buscar lecturas</button></div></div><div id="open-search-results" class="open-results" aria-live="polite"></div><p class="small">Resultados de Wikipedia en español, bajo licencia abierta. Úsalos como punto de partida, no como única fuente.</p></section>
      <section class="section"><h2>Fuentes recomendadas</h2><p>Materiales de instituciones y documentación especializada para contrastar la lectura complementaria.</p><ul class="resource-list">${resources}</ul></section>
      <section class="section"><h2>Cierra tu aprendizaje</h2><p>Antes de terminar, explica qué aprendiste y cuál sería tu siguiente paso para seguir practicando.</p><button class="mark-btn${done ? " done" : ""}" id="mark-done" type="button">${done ? "✓ Reto completado" : "Marcar reto como completado"}</button><p class="small">El avance se guarda en este navegador, sin crear una cuenta.</p></section>
      <nav class="footnav" aria-label="Navegar entre módulos"><a href="villa-habilidades-digitales.html">← Ver todos los módulos</a>${prev ? `<a href="${href(prev)}">← Anterior</a>` : ""}${next ? `<a href="${href(next)}">Siguiente →</a>` : ""}</nav>
    </main>`;

  app.querySelectorAll("[data-choice]").forEach(button => button.addEventListener("click", () => {
    const feedback = app.querySelector("#answer-feedback");
    const correct = Number(button.dataset.choice) === lesson.answer;
    feedback.textContent = correct ? `Correcto. ${lesson.feedback}` : "Aún no. Revisa la situación y piensa qué opción se puede comprobar y aplicar con seguridad.";
    feedback.className = `feedback ${correct ? "good" : "try"}`;
  }));

  app.querySelector("#mark-done").addEventListener("click", event => {
    const button = event.currentTarget;
    const marked = localStorage.getItem(`habilidades:${id}`) === "done";
    localStorage.setItem(`habilidades:${id}`, marked ? "todo" : "done");
    button.classList.toggle("done", !marked);
    button.textContent = marked ? "Marcar reto como completado" : "✓ Reto completado";
  });

  const searchButton = app.querySelector("#open-search-button");
  searchButton.addEventListener("click", async () => {
    const query = app.querySelector("#open-search-query").value.trim();
    const results = app.querySelector("#open-search-results");
    if (!query) { results.textContent = "Escribe un tema para buscar."; return; }
    searchButton.disabled = true;
    results.textContent = "Buscando lecturas…";
    try {
      const params = new URLSearchParams({ action: "query", generator: "search", gsrsearch: query, gsrnamespace: "0", gsrlimit: "3", prop: "extracts", exintro: "1", explaintext: "1", exchars: "650", format: "json", origin: "*" });
      const response = await fetch(`https://es.wikipedia.org/w/api.php?${params}`);
      if (!response.ok) throw new Error("No se pudo consultar la fuente.");
      const data = await response.json();
      const pages = Object.values(data.query?.pages || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
      results.replaceChildren();
      if (!pages.length) { results.textContent = "No encontramos resultados. Prueba con palabras más generales."; return; }
      pages.forEach(page => {
        const article = document.createElement("article"); article.className = "open-result";
        const heading = document.createElement("h3");
        const link = document.createElement("a"); link.href = `https://es.wikipedia.org/?curid=${encodeURIComponent(page.pageid)}`; link.target = "_blank"; link.rel = "noopener noreferrer"; link.textContent = page.title;
        heading.append(link);
        const excerpt = document.createElement("p"); excerpt.textContent = page.extract || "Abre el artículo para consultar el contenido.";
        article.append(heading, excerpt); results.append(article);
      });
    } catch {
      results.textContent = "No se pudo consultar Wikimedia. Revisa la conexión; el material principal del módulo sigue disponible.";
    } finally { searchButton.disabled = false; }
  });

  const form = app.querySelector("#guide-form");
  if (form) {
    let guideText = "";
    form.addEventListener("submit", event => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(form));
      guideText = `${values.title.trim()}\n\n${values.purpose.trim()}\n\n1. ${values.step1.trim()}\n2. ${values.step2.trim()}\n3. ${values.step3.trim()}\n\nFuente: ${values.source.trim() || "Por completar"}\nTexto alternativo: ${values.alt.trim() || "No aplica"}`;
      const preview = app.querySelector("#guide-preview");
      preview.replaceChildren();
      const title = document.createElement("h3"); title.textContent = values.title.trim(); preview.append(title);
      const content = document.createElement("p"); content.textContent = guideText.replace(`${values.title.trim()}\n\n`, ""); preview.append(content);
      preview.hidden = false;
      app.querySelector("#download-guide").disabled = false;
    });
    app.querySelector("#download-guide").addEventListener("click", () => {
      if (!guideText) return;
      const blob = new Blob([guideText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = "mi-guia-digital.txt"; link.click();
      URL.revokeObjectURL(url);
    });
  }
}
