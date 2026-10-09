(() => {
  const form = document.getElementById("dictionary-form");
  const input = document.getElementById("dictionary-word");
  const language = document.getElementById("dictionary-language");
  const status = document.getElementById("dictionary-status");
  const result = document.getElementById("dictionary-result");
  if (!form || !input || !language || !status || !result) return;

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

  function addText(parent, tag, value, className = "") {
    const element = document.createElement(tag);
    element.textContent = value;
    if (className) element.className = className;
    parent.append(element);
    return element;
  }

  function findMatches(query) {
    const normalized = normalize(query);
    if (!normalized) return [];
    const exact = entries.filter(entry => normalize(entry.es) === normalized || normalize(entry.en) === normalized);
    return exact.length ? exact : entries.filter(entry =>
      normalize(entry.es).includes(normalized) || normalize(entry.en).includes(normalized)
    );
  }

  function renderGameWord(query, sourceLanguage) {
    const pair = Object.entries(gameVocabulary).find(([english, data]) =>
      normalize(sourceLanguage === "es" ? data[0] : english) === normalize(query)
    );
    if (!pair) return false;
    const [english, data] = pair;
    const card = document.createElement("article");
    card.className = "dictionary-meaning";
    addText(card, "h3", "Vocabulario del juego", "dictionary-result-word");
    addText(card, "p", `Español: ${data[0]}`, "translation");
    addText(card, "p", `Inglés: ${english}`, "translation");
    addText(card, "p", data[1]);
    addText(card, "p", `Ejemplo: ${data[2]}`, "example");
    result.append(card);
    status.textContent = "Traducción y definición local; disponible sin conexión.";
    return true;
  }

  async function translateText(text, source, target) {
    const key = `villa-ingles-mymemory:${source}-${target}:${text}`;
    try {
      const cached = window.sessionStorage.getItem(key);
      if (cached) return cached;
    } catch { /* Continue if storage is unavailable. */ }

    const endpoint = location.protocol === "file:"
      ? `https://api.mymemory.translated.net/get?${new URLSearchParams({ q: text, langpair: `${source}|${target}`, mt: "1" })}`
      : `/api/translate?text=${encodeURIComponent(text)}&source=${source}&target=${target}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    let response;
    try {
      response = await fetch(endpoint, { headers: { Accept: "application/json" }, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
    if (!response.ok) throw new Error("translation-failed");
    const payload = await response.json();
    const translated = payload.translated || payload.responseData?.translatedText;
    if (!translated || payload.responseStatus && Number(payload.responseStatus) !== 200) throw new Error("translation-empty");
    try { window.sessionStorage.setItem(key, translated); } catch { /* Keep the result in this view. */ }
    return translated;
  }

  function renderMatches(matches, maxResults = 25) {
    for (const entry of matches.slice(0, maxResults)) {
      const card = document.createElement("article");
      card.className = "dictionary-meaning";
      addText(card, "p", `Español: ${entry.es}`, "translation");
      addText(card, "p", `Inglés: ${entry.en}`, "translation");
      result.append(card);
    }
    return matches.length > maxResults ? ` Se muestran los primeros ${maxResults}.` : "";
  }

  async function search(rawValue) {
    const query = rawValue.trim();
    if (!query || query.length > 80) {
      status.textContent = "Escribe una palabra o frase de hasta 80 caracteres.";
      input.focus();
      return;
    }
    if (!normalize(query)) {
      status.textContent = "Escribe una palabra con letras para buscar o traducir.";
      input.focus();
      return;
    }
    input.value = query;
    result.replaceChildren();
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    const sourceLanguage = language.value === "en" ? "en" : "es";
    const targetLanguage = sourceLanguage === "es" ? "en" : "es";
    try {
      const matches = findMatches(query);
      if (matches.length) {
        const capNote = renderMatches(matches);
        status.textContent = `${matches.length} resultado${matches.length === 1 ? "" : "s"} del diccionario local.${capNote}`;
        return;
      }
      if (renderGameWord(query, sourceLanguage)) return;

      status.textContent = sourceLanguage === "es" ? "Traduciendo al inglés…" : "Traduciendo al español…";
      const translated = await translateText(query, sourceLanguage, targetLanguage);
      const translation = document.createElement("article");
      translation.className = "dictionary-meaning";
      addText(translation, "h3", "Traducción automática", "dictionary-result-word");
      addText(translation, "p", `${sourceLanguage === "es" ? "Español" : "Inglés"}: ${query}`, "translation");
      addText(translation, "p", `${targetLanguage === "en" ? "Inglés" : "Español"}: ${translated}`, "translation");
      addText(translation, "p", "Traducción de MyMemory; verifica el sentido según el contexto.", "note");
      result.append(translation);

      const related = findMatches(translated);
      if (related.length) {
        addText(result, "h3", "Términos relacionados del diccionario", "dictionary-result-word");
        renderMatches(related, 10);
        status.textContent = `Traducción lista. También encontramos ${related.length} término${related.length === 1 ? "" : "s"} relacionado${related.length === 1 ? "" : "s"}.`;
      } else {
        status.textContent = "Traducción lista. Las frases nuevas requieren conexión; las entradas del diccionario siguen disponibles sin internet.";
      }
    } catch (error) {
      status.textContent = error?.name === "AbortError"
        ? "La traducción tardó demasiado. Revisa la conexión e inténtalo de nuevo. El diccionario local sigue disponible sin internet."
        : "No se pudo traducir ahora. Revisa la conexión; las entradas del diccionario local siguen disponibles sin internet.";
    } finally {
      button.disabled = false;
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    search(input.value);
  });
  document.querySelectorAll("[data-dictionary-word]").forEach(button => {
    button.addEventListener("click", () => {
      input.value = button.dataset.dictionaryWord;
      if (button.dataset.dictionaryLanguage) language.value = button.dataset.dictionaryLanguage;
      search(input.value);
    });
  });

  status.textContent = entries.length
    ? `Diccionario local listo: ${entries.length.toLocaleString("es-CO")} términos. Busca en español o inglés.`
    : "No se pudo cargar el diccionario local. Recarga la página.";
})();
