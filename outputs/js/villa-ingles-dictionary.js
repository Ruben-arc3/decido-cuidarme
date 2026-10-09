(() => {
  const form = document.getElementById("dictionary-form");
  const input = document.getElementById("dictionary-word");
  const status = document.getElementById("dictionary-status");
  const result = document.getElementById("dictionary-result");
  if (!form || !input || !status || !result) return;

  const entries = Array.isArray(window.VILLA_ENGLISH_DICTIONARY)
    ? window.VILLA_ENGLISH_DICTIONARY
    : [];
  const gameVocabulary = {
    goal: ["meta", "Something you want to achieve.", "My goal is to finish school."],
    skills: ["habilidades", "Abilities that help you do something well.", "Communication skills are useful in many jobs."],
    scholarship: ["beca", "Money given to help someone pay for education.", "She applied for a university scholarship."],
    career: ["carrera", "A person's job or professional path over time.", "He is exploring a career in engineering."],
    study: ["estudiar", "To learn about a subject by reading or practicing.", "We study English after class."],
    future: ["futuro", "The time that is still to come.", "She is planning for her future."],
    work: ["trabajo", "An activity or job that uses effort to achieve something.", "They work together on a project."],
    learn: ["aprender", "To gain knowledge or a new ability.", "I learn new words every week."],
    community: ["comunidad", "A group of people who live or work in the same area.", "Our community organized a science fair."],
    practice: ["práctica", "Repeated activity that helps improve a skill.", "Practice helps you speak with confidence."]
  };

  const normalize = value => value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  function addText(parent, tag, text, className = "") {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) element.className = className;
    parent.append(element);
    return element;
  }

  function showGameWord(word) {
    const entry = gameVocabulary[word];
    if (!entry) return false;
    const card = document.createElement("article");
    card.className = "dictionary-meaning";
    addText(card, "h3", "Vocabulario del juego", "dictionary-result-word");
    addText(card, "p", `Español: ${entry[0]}`, "translation");
    addText(card, "p", `Inglés: ${word}`, "translation");
    addText(card, "p", entry[1], "definition");
    addText(card, "p", `Ejemplo: ${entry[2]}`, "example");
    result.append(card);
    status.textContent = "Esta palabra pertenece al vocabulario del juego; la definición local está disponible sin internet.";
    return true;
  }

  function search(rawValue) {
    const query = normalize(rawValue);
    if (!query) {
      status.textContent = "Escribe una palabra o expresión en español o inglés.";
      input.focus();
      return;
    }
    if (query.length > 80) {
      status.textContent = "La búsqueda puede tener hasta 80 caracteres.";
      return;
    }

    input.value = rawValue.trim();
    result.replaceChildren();
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    const exact = entries.filter(entry => normalize(entry.es) === query || normalize(entry.en) === query);
    const matches = exact.length ? exact : entries.filter(entry =>
      normalize(entry.es).includes(query) || normalize(entry.en).includes(query)
    );

    if (!matches.length) {
      if (showGameWord(query)) {
        button.disabled = false;
        return;
      }
      status.textContent = "No encontramos ese término en el diccionario local. Prueba una palabra o expresión relacionada con salud.";
      button.disabled = false;
      return;
    }

    const maxResults = 25;
    for (const entry of matches.slice(0, maxResults)) {
      const card = document.createElement("article");
      card.className = "dictionary-meaning";
      addText(card, "p", `Español: ${entry.es}`, "translation");
      addText(card, "p", `Inglés: ${entry.en}`, "translation");
      result.append(card);
    }
    const capNote = matches.length > maxResults ? ` Se muestran los primeros ${maxResults}.` : "";
    status.textContent = exact.length
      ? `${matches.length} coincidencia${matches.length === 1 ? "" : "s"} exacta${matches.length === 1 ? "" : "s"}.${capNote}`
      : `${matches.length} resultado${matches.length === 1 ? "" : "s"} relacionado${matches.length === 1 ? "" : "s"}.${capNote}`;
    button.disabled = false;
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    search(input.value);
  });
  document.querySelectorAll("[data-dictionary-word]").forEach(button => {
    button.addEventListener("click", () => {
      input.value = button.dataset.dictionaryWord;
      search(input.value);
    });
  });

  status.textContent = entries.length
    ? `Diccionario local listo: ${entries.length.toLocaleString("es-CO")} términos. Funciona sin internet.`
    : "No se pudo cargar el diccionario local. Recarga la página.";
})();
