(() => {
  const form = document.getElementById("dictionary-form");
  const input = document.getElementById("dictionary-word");
  const status = document.getElementById("dictionary-status");
  const result = document.getElementById("dictionary-result");
  if (!form || !input || !status || !result) return;

  const translations = {
    goal: "meta", skills: "habilidades", scholarship: "beca", career: "carrera",
    study: "estudiar", future: "futuro", work: "trabajo", learn: "aprender",
    community: "comunidad", practice: "práctica"
  };
  // Definitions for the module's core vocabulary keep the activity useful when
  // the third-party dictionary is unavailable or the page is used offline.
  const localDefinitions = {
    goal: ["Something you want to achieve.", "My goal is to finish school."],
    skills: ["Abilities that help you do something well.", "Communication skills are useful in many jobs."],
    scholarship: ["Money given to help someone pay for education.", "She applied for a university scholarship."],
    career: ["A person's job or professional path over time.", "He is exploring a career in engineering."],
    study: ["To learn about a subject by reading or practicing.", "We study English after class."],
    future: ["The time that is still to come.", "She is planning for her future."],
    work: ["An activity or job that uses effort to achieve something.", "They work together on a project."],
    learn: ["To gain knowledge or a new ability.", "I learn new words every week."],
    community: ["A group of people who live or work in the same area.", "Our community organized a science fair."],
    practice: ["Repeated activity that helps improve a skill.", "Practice helps you speak with confidence."]
  };

  function addText(parent, tag, text, className = "") {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) element.className = className;
    parent.append(element);
    return element;
  }

  async function lookUp(rawWord) {
    const word = rawWord.trim().toLowerCase();
    if (!/^[a-z][a-z'-]{0,39}$/i.test(word)) {
      status.textContent = "Escribe una sola palabra en inglés, sin números ni datos personales.";
      input.focus();
      return;
    }
    input.value = word;
    status.textContent = "Consultando el diccionario…";
    result.replaceChildren();
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    try {
      // On Pages, use a same-origin Function so browser CORS rules do not block
      // Dictionary API. A file:// copy has no server-side proxy, so try the API
      // directly there and provide a useful fallback message if the browser blocks it.
      const url = location.protocol === "file:"
        ? `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
        : `/api/dictionary?word=${encodeURIComponent(word)}`;
      const controller = new AbortController();
      // Dictionary API can respond slowly on a cold request. Give Pages Functions
      // enough time to return its own timeout/error instead of aborting too early.
      const timeout = setTimeout(() => controller.abort(), 22000);
      let response;
      try {
        response = await fetch(url, { headers: { Accept: "application/json" }, signal: controller.signal });
      } finally {
        clearTimeout(timeout);
      }
      const data = await response.json();
      if (response.status === 404) {
        status.textContent = "No encontramos esa palabra. Revisa la escritura o prueba otra.";
        return;
      }
      if (!response.ok) {
        if (response.status === 502 || response.status === 504) {
          throw new Error("dictionary-source-timeout");
        }
        throw new Error(`Dictionary request failed: ${response.status}`);
      }
      if (!Array.isArray(data) || !data.length) {
        status.textContent = "No encontramos definiciones para esa palabra. Prueba otra.";
        return;
      }

      const entry = data[0];
      const pronunciation = entry.phonetic || entry.phonetics?.find(item => item.text)?.text;
      const audioUrl = entry.phonetics?.find(item => item.audio)?.audio;
      const heading = addText(result, "h3", entry.word || word, "dictionary-result-word");
      if (pronunciation) addText(result, "p", `Pronunciación: ${pronunciation}`, "pronunciation");
      if (translations[word]) addText(result, "p", `Traducción orientativa: ${translations[word]}`, "translation");
      if (audioUrl) {
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.preload = "none";
        audio.src = audioUrl.startsWith("//") ? `https:${audioUrl}` : audioUrl;
        audio.setAttribute("aria-label", `Escuchar pronunciación de ${entry.word || word}`);
        result.append(audio);
      }

      let shown = 0;
      for (const meaning of entry.meanings || []) {
        const definitions = (meaning.definitions || []).slice(0, 2);
        if (!definitions.length) continue;
        const group = document.createElement("section");
        group.className = "dictionary-meaning";
        addText(group, "h4", meaning.partOfSpeech || "Significado");
        for (const definition of definitions) {
          const item = document.createElement("div");
          item.className = "definition";
          addText(item, "p", definition.definition || "Definición no disponible.");
          if (definition.example) addText(item, "p", `Ejemplo: ${definition.example}`, "example");
          group.append(item);
          shown++;
        }
        result.append(group);
        if (shown >= 4) break;
      }
      if (!shown) addText(result, "p", "La API no devolvió definiciones para esta palabra.");
      const credit = document.createElement("a");
      credit.href = "https://dictionaryapi.dev/";
      credit.target = "_blank";
      credit.rel = "noopener noreferrer";
      credit.textContent = "Fuente: Free Dictionary API ↗";
      credit.className = "dictionary-credit";
      result.append(credit);
      status.textContent = "Consulta lista. Las definiciones están en inglés; usa los ejemplos para reconocer el contexto.";
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    } catch (error) {
      const local = localDefinitions[word];
      if (local) {
        addText(result, "h3", word, "dictionary-result-word");
        addText(result, "p", `Traducción orientativa: ${translations[word]}`, "translation");
        const group = document.createElement("section");
        group.className = "dictionary-meaning";
        addText(group, "h4", "Definición en inglés · disponible sin conexión");
        addText(group, "p", local[0]);
        addText(group, "p", `Ejemplo: ${local[1]}`, "example");
        result.append(group);
        status.textContent = "La fuente externa no respondió. Mostramos una definición local para que puedas continuar.";
        return;
      }
      status.textContent = location.protocol === "file:"
        ? "El navegador bloqueó la consulta desde un archivo local o no hay conexión. El reto sigue disponible; para consultar el diccionario, abre la versión publicada en Cloudflare Pages."
        : error?.name === "AbortError" || error?.message === "dictionary-source-timeout"
          ? "El diccionario externo no respondió a tiempo. Prueba de nuevo más tarde; el juego de vocabulario sigue disponible."
          : "No se pudo conectar con el diccionario. Revisa tu conexión; el reto de vocabulario sigue disponible sin internet.";
    } finally {
      button.disabled = false;
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    lookUp(input.value);
  });
  document.querySelectorAll("[data-dictionary-word]").forEach(button => {
    button.addEventListener("click", () => lookUp(button.dataset.dictionaryWord));
  });
})();
