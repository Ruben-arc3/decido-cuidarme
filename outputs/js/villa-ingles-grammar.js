(() => {
  const topicSelect = document.getElementById("grammar-topic");
  const lesson = document.getElementById("grammar-lesson");
  const question = document.getElementById("grammar-question");
  const options = document.getElementById("grammar-options");
  const feedback = document.getElementById("grammar-feedback");
  const nextButton = document.getElementById("grammar-next");
  if (!topicSelect || !lesson || !question || !options || !feedback || !nextButton) return;

  const topics = {
    present: {
      title: "Presente simple",
      purpose: "Se usa para hábitos, rutinas y hechos que suelen repetirse.",
      pattern: "I / You / We / They + verbo · He / She / It + verbo con -s",
      examples: ["I study every day. — Estudio todos los días.", "She studies at night. — Ella estudia por la noche."],
      questions: [
        { text: "My brother ___ English after school.", choices: ["study", "studies", "studying"], answer: 1, why: "Con he, she o una persona en singular, el verbo normalmente termina en -s: studies." },
        { text: "We ___ for our future.", choices: ["works", "working", "work"], answer: 2, why: "Con we, el verbo va en su forma base: work." },
        { text: "Laura ___ to music while she studies.", choices: ["listen", "listens", "listening"], answer: 1, why: "Laura equivale a she; por eso usamos listens." }
      ]
    },
    continuous: {
      title: "Presente continuo",
      purpose: "Describe algo que está ocurriendo ahora o durante este periodo.",
      pattern: "am / is / are + verbo terminado en -ing",
      examples: ["I am learning English. — Estoy aprendiendo inglés.", "They are working now. — Ellos están trabajando ahora."],
      questions: [
        { text: "She ___ for the exam right now.", choices: ["is preparing", "are preparing", "prepares"], answer: 0, why: "Con she usamos is + verbo en -ing: is preparing." },
        { text: "We ___ a new skill this month.", choices: ["is learning", "are learning", "learns"], answer: 1, why: "Con we usamos are + verbo en -ing: are learning." },
        { text: "I ___ my options at the moment.", choices: ["am exploring", "is exploring", "explore"], answer: 0, why: "Con I usamos am + verbo en -ing: am exploring." }
      ]
    },
    past: {
      title: "Pasado simple",
      purpose: "Cuenta acciones que comenzaron y terminaron en el pasado.",
      pattern: "Verbos regulares: verbo + -ed · Algunos verbos cambian: go → went",
      examples: ["I studied yesterday. — Estudié ayer.", "We went to the library. — Fuimos a la biblioteca."],
      questions: [
        { text: "Yesterday, Mateo ___ his homework.", choices: ["finish", "finished", "finishes"], answer: 1, why: "Yesterday indica pasado. Finish es regular: agregamos -ed, finished." },
        { text: "Last year, we ___ a science project.", choices: ["make", "made", "making"], answer: 1, why: "Make es irregular. En pasado se transforma en made." },
        { text: "I ___ a useful video last night.", choices: ["watched", "watch", "watches"], answer: 0, why: "Last night indica pasado. El pasado de watch es watched." }
      ]
    },
    future: {
      title: "Planes con going to",
      purpose: "Expresa planes o intenciones que ya tienes en mente.",
      pattern: "am / is / are + going to + verbo base",
      examples: ["I am going to study nursing. — Voy a estudiar enfermería.", "They are going to take the exam. — Van a presentar el examen."],
      questions: [
        { text: "I ___ apply for a scholarship.", choices: ["am going to", "is going to", "going"], answer: 0, why: "Con I usamos am going to y luego el verbo base: apply." },
        { text: "She is going to ___ engineering.", choices: ["studies", "studying", "study"], answer: 2, why: "Después de going to va el verbo en forma base: study." },
        { text: "We ___ practice for the ICFES this weekend.", choices: ["are going to", "is going to", "going to"], answer: 0, why: "Con we usamos are going to: We are going to practice." }
      ]
    }
  };

  let questionIndex = 0;
  let answered = false;

  function add(parent, tag, value, className = "") {
    const node = document.createElement(tag);
    node.textContent = value;
    if (className) node.className = className;
    parent.append(node);
    return node;
  }

  function render() {
    const current = topics[topicSelect.value] || topics.present;
    const item = current.questions[questionIndex % current.questions.length];
    answered = false;
    lesson.replaceChildren();
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
        feedback.textContent = `${correct ? "¡Correcto! " : "Aún no. "}${item.why}`;
        feedback.className = `feedback ${correct ? "grammar-correct" : "grammar-retry"}`;
        options.querySelectorAll("button").forEach(option => { option.disabled = true; });
        button.classList.add(correct ? "grammar-answer-good" : "grammar-answer-wrong");
        if (!correct) options.children[item.answer]?.classList.add("grammar-answer-good");
      });
      options.append(button);
    });
    feedback.textContent = "Conversen en equipo y elijan una respuesta.";
    feedback.className = "feedback";
    nextButton.textContent = answered ? "Siguiente reto →" : "Otro reto →";
  }

  topicSelect.addEventListener("change", () => { questionIndex = 0; render(); });
  nextButton.addEventListener("click", () => { questionIndex++; render(); });
  render();
})();
