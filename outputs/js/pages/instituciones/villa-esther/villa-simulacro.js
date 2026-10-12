(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const practiceBank = {
    lectura: [
      {
        stimulus:
          "Informe del club de lectura: “Durante el semestre, los préstamos de libros aumentaron 18 % entre quienes asistieron al club. La participación era voluntaria y no se comparó a estos estudiantes con quienes no asistieron”.",
        question: "¿Cuál conclusión está mejor respaldada por la información?",
        options: [
          "El club causó el aumento de préstamos en todo el colegio.",
          "Entre los asistentes aumentaron los préstamos, pero el informe no permite atribuir el cambio únicamente al club.",
          "El aumento demuestra que los estudiantes que no asistieron dejaron de leer.",
          "La participación voluntaria invalida cualquier dato sobre los préstamos.",
        ],
        answer: 1,
        explanation:
          "El informe describe una asociación entre asistir y pedir más libros. Sin comparación ni control de otros factores, no demuestra que el club haya causado por sí solo el aumento.",
      },
      {
        stimulus:
          "“Prohibir los celulares durante toda la jornada reduce interrupciones. Sin embargo, algunos cursos los usan para consultar mapas, registrar experimentos o revisar materiales. Una regla útil debería reducir distracciones sin bloquear esos usos”.",
        question: "¿Qué propuesta conserva mejor la postura del texto?",
        options: [
          "Permitir el celular en cualquier momento, porque puede tener usos académicos.",
          "Prohibirlo siempre, porque reducir interrupciones es el único objetivo.",
          "Restringirlo durante explicaciones y permitirlo cuando el docente indique una actividad que lo requiera.",
          "Dejar que cada estudiante decida, sin acuerdos comunes.",
        ],
        answer: 2,
        explanation:
          "La propuesta equilibra los dos criterios del texto: disminuir distracciones y conservar usos académicos pertinentes.",
      },
      {
        stimulus:
          "En una reunión sobre el patio, un grupo pide más árboles por el calor; otro propone ampliar la cancha porque se llena en los descansos. El acta registra opiniones, pero no incluye mediciones ni horarios de uso.",
        question:
          "¿Qué información adicional permitiría comparar las propuestas con mayor fundamento?",
        options: [
          "Medir temperatura y sombra en distintos puntos, y registrar quiénes usan cada zona y en qué horarios.",
          "Preguntar cuál propuesta recibe más aplausos durante la reunión.",
          "Contar únicamente los árboles que ya existen.",
          "Elegir la opción mencionada primero para ahorrar tiempo.",
        ],
        answer: 0,
        explanation:
          "Las mediciones de temperatura, sombra y uso aportan evidencia relacionada con ambas necesidades y permiten valorar alternativas o combinaciones.",
      },
    ],
    matematicas: [
      {
        stimulus:
          "Dos estudiantes comparan sus prácticas. Lina resolvió 18 preguntas en 45 minutos y acertó 15. Juan resolvió 24 en 60 minutos y acertó 18.",
        question:
          "Si se compara la cantidad de respuestas correctas por hora, ¿qué conclusión es correcta?",
        options: [
          "Lina: 20 aciertos por hora; Juan: 18, por lo que Lina tuvo mayor ritmo de aciertos.",
          "Lina: 15 aciertos por hora; Juan: 18, por lo que Juan tuvo mayor ritmo.",
          "Ambos tuvieron 24 aciertos por hora porque resolvieron distinta cantidad de preguntas.",
          "No se pueden comparar porque el tiempo de práctica no fue igual.",
        ],
        answer: 0,
        explanation:
          "Lina acertó 15 en 45 minutos: 15 ÷ 0,75 = 20 por hora. Juan acertó 18 en una hora. El ritmo de Lina fue mayor, aunque la muestra no basta para concluir que siempre tendrá mejor desempeño.",
      },
      {
        stimulus:
          "Una calculadora cuesta $200.000. La tienda aplica primero un descuento del 20 % y luego un descuento adicional del 10 % sobre el precio ya rebajado.",
        question:
          "¿Cuál es el precio final y por qué no equivale a descontar 30 % del precio inicial?",
        options: [
          "$140.000, porque los porcentajes se suman sobre el precio inicial.",
          "$144.000, porque el segundo 10 % se calcula sobre $160.000.",
          "$160.000, porque solo se aplica el mayor descuento.",
          "$170.000, porque el segundo descuento resta $20.000.",
        ],
        answer: 1,
        explanation:
          "El primer descuento deja $160.000. El 10 % de ese nuevo valor es $16.000; por tanto, se pagan $144.000. Los porcentajes sucesivos tienen bases distintas.",
      },
      {
        stimulus:
          "En una encuesta de hábitos de lectura participaron dos cursos. El curso A, con 40 estudiantes, registró un promedio de 3 libros. El curso B, con 20 estudiantes, registró un promedio de 5 libros.",
        question:
          "¿Cuál fue el promedio de libros por estudiante al considerar juntos los 60 participantes?",
        options: [
          "4 libros, porque se promedian 3 y 5.",
          "3,7 libros, aproximadamente, porque se pondera cada promedio por el tamaño del curso.",
          "3,5 libros, porque el curso A tiene el doble de participantes.",
          "5 libros, porque es el promedio más alto.",
        ],
        answer: 1,
        explanation:
          "El total estimado es 40×3 + 20×5 = 220 libros. Al dividir entre 60 estudiantes, resulta 3,67, aproximadamente. No se pueden promediar los dos promedios sin tener en cuenta los tamaños.",
      },
    ],
    sociales: [
      {
        stimulus:
          "La alcaldía anuncia que elegirá dónde construir un centro cultural. Un informe técnico recomienda el centro del municipio por facilidad de transporte. Representantes rurales señalan que sus comunidades tienen menos acceso a actividades culturales. El presupuesto solo alcanza para una sede.",
        question: "¿Qué procedimiento permite tomar una decisión pública mejor sustentada?",
        options: [
          "Aceptar el informe técnico sin consultar, porque usa criterios medibles.",
          "Escuchar a las comunidades, comparar tiempos y costos de acceso y publicar los criterios usados para decidir.",
          "Elegir la zona que reúna más firmas, sin analizar el alcance de la sede.",
          "Dividir el presupuesto en partes iguales aunque ninguna sede pueda funcionar.",
        ],
        answer: 1,
        explanation:
          "La decisión debe combinar evidencia de acceso y viabilidad con participación y transparencia. Así se puede evaluar el conflicto entre cobertura, costos y equidad.",
      },
      {
        stimulus:
          "En una institución se propone guardar los teléfonos durante las clases. Algunos estudiantes apoyan la medida por las distracciones; otros explican que los usan para consultar materiales cuando el docente lo autoriza.",
        question:
          "¿Cuál acuerdo responde mejor a los intereses en tensión y conserva una regla común?",
        options: [
          "Prohibirlos en toda circunstancia, incluso en actividades planeadas.",
          "Permitirlos siempre y dejar que cada estudiante determine cuándo usarlos.",
          "Mantenerlos guardados durante explicaciones y habilitarlos para actividades indicadas, con reglas claras para todos.",
          "Aplicar la regla solo a los cursos que reportaron más distracciones.",
        ],
        answer: 2,
        explanation:
          "El acuerdo atiende la preocupación por las interrupciones y reconoce el uso pedagógico bajo condiciones comunes y verificables.",
      },
      {
        stimulus:
          "Un consejo estudiantil consulta por internet el horario de una actividad. La mayoría responde antes de las 6 p. m.; varios estudiantes que viven en zonas rurales dicen que solo tienen conexión por la noche. El consejo concluye que la mayoría prefiere el horario propuesto.",
        question: "¿Qué limitación afecta principalmente la conclusión del consejo?",
        options: [
          "La consulta fue digital y pudo dejar por fuera a parte de la población consultada.",
          "El horario se decidió antes de contar respuestas.",
          "La mayoría siempre tiene razón, así que la conclusión es suficiente.",
          "Las respuestas nocturnas no pueden considerarse opiniones.",
        ],
        answer: 0,
        explanation:
          "El medio y el plazo de consulta pueden producir sesgo de participación. Para representar mejor al grupo, el consejo debe ofrecer otras formas o ampliar el tiempo.",
      },
    ],
    ciencias: [
      {
        stimulus:
          "Un grupo estudia el crecimiento de plantas con distintas cantidades de fertilizante. Promedio de altura a los 14 días: sin fertilizante, 8 cm; 2 ml, 11 cm; 4 ml, 13 cm; 8 ml, 9 cm. Todas recibieron la misma luz y agua, pero solo se usó una planta por cantidad.",
        question: "¿Qué conclusión y siguiente paso son más rigurosos?",
        options: [
          "4 ml es siempre la cantidad ideal; se puede recomendar a cualquier agricultor.",
          "En estas plantas, 4 ml coincidió con mayor altura; se debe repetir con varias plantas por condición antes de generalizar.",
          "El fertilizante causó toda la diferencia, aunque no se conozca el estado inicial.",
          "8 ml no sirve para ninguna especie porque una planta creció menos.",
        ],
        answer: 1,
        explanation:
          "Los datos muestran el mayor promedio observado con 4 ml, pero una sola planta por condición no permite descartar diferencias individuales ni generalizar. Se requieren repeticiones.",
      },
      {
        stimulus:
          "En un lago se midió oxígeno disuelto y cantidad de algas en tres puntos: A: 8 mg/L y pocas algas; B: 5 mg/L y cantidad media; C: 2 mg/L y muchas algas. Los datos se tomaron una sola mañana.",
        question: "¿Cuál interpretación respeta mejor el alcance de estos datos?",
        options: [
          "Más algas causan siempre una disminución del oxígeno en cualquier lago.",
          "En los puntos observados, más algas coincidieron con menos oxígeno; hacen falta mediciones repetidas y otros datos para explicar la causa.",
          "El punto C demuestra que el agua no contiene oxígeno.",
          "El oxígeno es la única variable que puede afectar las algas.",
        ],
        answer: 1,
        explanation:
          "La tabla muestra una relación en los puntos muestreados, pero una medición puntual no establece causalidad ni permite descartar otras variables.",
      },
      {
        stimulus:
          "Un recipiente con agua a 70 °C se deja enfriar. Grupo 1 lo tapa; grupo 2 lo deja destapado. Ambos lo ponen en la misma mesa y registran la temperatura cada cinco minutos.",
        question:
          "¿Qué resultado respaldaría mejor la hipótesis de que tapar el recipiente reduce la pérdida de calor?",
        options: [
          "El recipiente tapado conserva una temperatura mayor que el destapado en varias mediciones, con el mismo volumen y condiciones iniciales.",
          "El recipiente destapado empieza a mayor temperatura que el tapado.",
          "Se cambia la mesa del recipiente tapado a mitad del experimento.",
          "Se toma solo una medida al final y se desconoce cuál recipiente estaba tapado.",
        ],
        answer: 0,
        explanation:
          "Comparar varias mediciones bajo condiciones iniciales iguales permite evaluar si el tapado se relaciona con un enfriamiento más lento.",
      },
    ],
    ingles: [
      {
        stimulus:
          "Read the message: “I planned to take the early bus to the exam-preparation workshop. When it was cancelled, I joined the afternoon group online. I prefer studying with classmates, but the recorded explanations helped me review the questions I missed.”",
        question: "What can be inferred about the student’s experience?",
        options: [
          "The student considers online study better in every situation.",
          "The student adapted to a change and found a useful feature in the online option.",
          "The student stopped preparing because the bus was cancelled.",
          "The afternoon group did not provide any explanations.",
        ],
        answer: 1,
        explanation:
          "The message says the student preferred studying with classmates but adapted and valued the recorded explanations.",
      },
      {
        stimulus:
          "A notice says: “Applications are reviewed on the first and third Friday of each month. Incomplete forms are returned for correction and may be included in the next review.”",
        question:
          "A student submits an incomplete form on Thursday before the first Friday. What is the most reasonable expectation?",
        options: [
          "The application will automatically be rejected forever.",
          "The form may need correction and could be reviewed in the next cycle.",
          "The application will be approved on Thursday.",
          "The review dates do not apply to incomplete forms.",
        ],
        answer: 1,
        explanation:
          "The notice states that incomplete forms are returned and may move to the next review period.",
      },
      {
        stimulus:
          "Read the short report: “The school opened a study room after classes. Attendance was low during the first week, but it increased after students suggested adding charging points and changing the closing time.”",
        question:
          "Which statement best describes the relationship between the students’ suggestions and attendance?",
        options: [
          "Attendance increased after changes based on suggestions, but the report does not prove that one change alone caused it.",
          "The charging points were the only reason attendance increased.",
          "The study room had high attendance before the suggestions.",
          "Changing the closing time reduced the number of students.",
        ],
        answer: 0,
        explanation:
          "The report links the changes with an increase, but because more than one change was made, it does not identify which one caused the increase.",
      },
    ],
  };
  window.addEventListener("villa:published-questions", (event) => {
    for (const q of event.detail || []) {
      if (practiceBank[q.area])
        practiceBank[q.area].push({
          stimulus: q.stimulus,
          question: q.question,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation,
          area: q.area,
          areaName: {
            lectura: "Lectura crítica",
            matematicas: "Matemáticas",
            sociales: "Sociales y ciudadanas",
            ciencias: "Ciencias naturales",
            ingles: "Inglés",
          }[q.area],
        });
    }
  });
  const areaNames = {
    all: "Mezcla de áreas",
    lectura: "Lectura crítica",
    matematicas: "Matemáticas",
    sociales: "Sociales y ciudadanas",
    ciencias: "Ciencias naturales",
    ingles: "Inglés",
  };
  let activeQuestions = [],
    activeIndex = 0,
    examScore = 0,
    chosenAnswer = -1,
    examTimerId = null,
    generatedBank = null,
    examOrigin = "local";
  function shuffle(list) {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function makeQuestionSet(bank, area, count) {
    let picked;
    if (area !== "all") picked = shuffle([...(bank[area] || [])]).slice(0, count);
    else {
      const buckets = {};
      Object.entries(bank).forEach(([key, items]) =>
        items.forEach((q) => {
          const subject = q.area || key;
          (buckets[subject] || (buckets[subject] = [])).push(q);
        }),
      );
      Object.keys(buckets).forEach((key) => (buckets[key] = shuffle(buckets[key])));
      picked = [];
      const keys = Object.keys(buckets);
      while (picked.length < count && keys.some((key) => buckets[key].length)) {
        for (const key of keys) {
          if (buckets[key].length && picked.length < count) picked.push(buckets[key].pop());
        }
      }
    }
    return picked.map((q) => ({
      ...q,
      areaName: q.areaName || areaNames[q.area] || areaNames[area] || "Reto Saber 11",
    }));
  }
  function beginExam(bank = practiceBank, origin = "local") {
    const area = $("examArea").value,
      count = Number($("examCount").value);
    examOrigin = origin;
    activeQuestions = makeQuestionSet(bank, area, count);
    if (!activeQuestions.length) {
      $("apiStatus").textContent = "No hay preguntas disponibles para esa selección.";
      return;
    }
    activeIndex = 0;
    examScore = 0;
    $("aiReview").hidden = true;
    $("examResult").hidden = true;
    $("examGame").hidden = false;
    $("apiStatus").textContent =
      (origin === "ai"
        ? "Preguntas nuevas generadas con Groq."
        : "Modo local: preguntas guardadas en esta página.") +
      " · " +
      activeQuestions.length +
      " preguntas";
    showQuestion();
  }
  function showQuestion() {
    clearInterval(examTimerId);
    chosenAnswer = -1;
    const q = activeQuestions[activeIndex];
    $("examRound").textContent =
      "Pregunta " +
      (activeIndex + 1) +
      " de " +
      activeQuestions.length +
      " · " +
      (q.areaName || areaNames[$("examArea").value] || "Reto Saber 11");
    $("examProgress").style.width = (activeIndex / activeQuestions.length) * 100 + "%";
    $("questionStimulus").textContent = q.stimulus || "";
    $("questionStimulus").hidden = !q.stimulus;
    $("questionText").textContent = q.question;
    $("questionFeedback").hidden = true;
    $("questionFeedback").className = "question-feedback";
    $("submitAnswer").hidden = false;
    $("submitAnswer").disabled = true;
    $("nextQuestion").hidden = true;
    const opts = $("questionOptions");
    opts.replaceChildren();
    q.options.forEach((text, i) => {
      const label = document.createElement("label");
      label.className = "answer-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "examAnswer";
      input.value = i;
      input.addEventListener("change", () => {
        chosenAnswer = i;
        $("submitAnswer").disabled = false;
      });
      const span = document.createElement("span");
      span.textContent = String.fromCharCode(65 + i) + ". " + text;
      label.append(input, span);
      opts.append(label);
    });
    if ($("examTimer").checked) {
      let remaining = 60;
      $("examClock").textContent = "Lean y conversen: " + remaining + " s";
      examTimerId = setInterval(() => {
        remaining--;
        $("examClock").textContent = "Lean y conversen: " + remaining + " s";
        if (remaining <= 0) {
          clearInterval(examTimerId);
          $("examClock").textContent = "Tiempo de conversación terminado";
          if (chosenAnswer >= 0) checkAnswer();
          else {
            $("questionFeedback").hidden = false;
            $("questionFeedback").className = "question-feedback wrong";
            $("questionFeedback").textContent =
              "Elijan una opción para continuar. Pueden tomarse el tiempo que necesiten.";
          }
        }
      }, 1000);
    } else $("examClock").textContent = "Sin cronómetro";
  }
  function checkAnswer() {
    if (chosenAnswer < 0) return;
    clearInterval(examTimerId);
    const q = activeQuestions[activeIndex],
      ok = chosenAnswer === q.answer;
    if (ok) examScore++;
    q.correct = ok;
    $("questionFeedback").hidden = false;
    $("questionFeedback").className = "question-feedback" + (ok ? "" : " wrong");
    $("questionFeedback").textContent =
      (ok ? "Respuesta correcta. " : "Revisemos la respuesta. ") + q.explanation;
    [...$("questionOptions").querySelectorAll("input")].forEach((x) => (x.disabled = true));
    $("submitAnswer").hidden = true;
    $("nextQuestion").hidden = false;
    $("nextQuestion").textContent =
      activeIndex === activeQuestions.length - 1 ? "Ver resultado →" : "Siguiente pregunta →";
    $("examProgress").style.width = ((activeIndex + 1) / activeQuestions.length) * 100 + "%";
  }
  function finishExam() {
    clearInterval(examTimerId);
    $("examGame").hidden = true;
    $("examResult").hidden = false;
    const pct = Math.round((examScore / activeQuestions.length) * 100);
    window.dispatchEvent(
      new CustomEvent("villa:attempt", {
        detail: {
          area: $("examArea").value,
          total: activeQuestions.length,
          correct: examScore,
          percent: pct,
          source: examOrigin,
          questions: activeQuestions,
        },
      }),
    );
    $("examResult").replaceChildren();
    const h = document.createElement("h3");
    h.textContent = "Reto completado";
    const p = document.createElement("p");
    p.textContent =
      "El grupo resolvió " +
      examScore +
      " de " +
      activeQuestions.length +
      " preguntas. " +
      (pct >= 80
        ? "Buen análisis de las situaciones."
        : pct >= 50
          ? "Comparen las explicaciones y revisen qué pistas orientaban cada respuesta."
          : "Vuelvan a leer las situaciones y discutan qué información era clave.");
    const b = document.createElement("button");
    b.className = "btn secondary";
    b.textContent = "Jugar otra ronda";
    b.onclick = () => beginExam(generatedBank || practiceBank, generatedBank ? "ai" : "local");
    $("examResult").append(h, p, b);
  }
  function showAIReview(questions) {
    const list = $("aiReviewList");
    list.replaceChildren();
    const note = document.createElement("p");
    note.className = "smallnote";
    note.textContent = "Las respuestas y explicaciones aparecerán después de responder cada pregunta.";
    list.append(note);
    questions.forEach((q, i) => {
      const item = document.createElement("article");
      item.className = "ai-review-item";
      const title = document.createElement("b");
      title.textContent = i + 1 + ". " + (q.stimulus ? q.stimulus + " " : "") + q.question;
      const options = document.createElement("p");
      options.textContent = q.options
        .map((x, j) => String.fromCharCode(65 + j) + ". " + x)
        .join(" · ");
      item.append(title, options);
      list.append(item);
    });
    $("examGame").hidden = true;
    $("examResult").hidden = true;
    $("aiReview").hidden = false;
  }
  $("startExam").addEventListener("click", () => beginExam(practiceBank, "local"));
  $("submitAnswer").addEventListener("click", checkAnswer);
  $("nextQuestion").addEventListener("click", () => {
    activeIndex++;
    if (activeIndex >= activeQuestions.length) finishExam();
    else showQuestion();
  });
  $("examArea").addEventListener("change", () => {
    generatedBank = null;
    $("apiStatus").textContent = "El banco local funciona sin conexión.";
  });
  $("aiExam").addEventListener("click", async () => {
    const btn = $("aiExam"),
      area = $("examArea").value,
      count = Number($("examCount").value);
    btn.disabled = true;
    $("apiStatus").textContent = "Solicitando preguntas nuevas a Groq…";
    try {
      const data = await window.villaGroqExam({ mode: "exam", area, count });
      if (!Array.isArray(data.questions) || data.questions.length < Math.min(3, count))
        throw new Error("No llegaron suficientes preguntas válidas.");
      generatedBank = area === "all" ? { all: data.questions } : { [area]: data.questions };
      $("apiStatus").textContent = "Preguntas listas. Puedes empezar cuando quieras.";
      showAIReview(data.questions);
    } catch (err) {
      generatedBank = null;
      $("aiReview").hidden = true;
      $("apiStatus").textContent = err.message + " El banco local sigue disponible.";
    } finally {
      btn.disabled = false;
    }
  });
  $("useAIQuestions").addEventListener("click", () => {
    $("aiReview").hidden = true;
    beginExam(generatedBank, "ai");
  });
  $("examArea").addEventListener("change", () => {
    $("aiReview").hidden = true;
  });
})();
