(() => {
  const tabs = document.querySelectorAll("[data-module-tab]");
  const panels = document.querySelectorAll("[data-module-panel]");
  tabs.forEach(tab => tab.addEventListener("click", () => {
    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    panels.forEach(panel => {
      panel.hidden = panel.dataset.modulePanel !== tab.dataset.moduleTab;
    });
  }));

  const form = document.getElementById("phrases-form");
  const input = document.getElementById("phrases-query");
  const language = document.getElementById("phrases-language");
  const status = document.getElementById("phrases-status");
  const results = document.getElementById("phrases-results");
  const moreButton = document.getElementById("phrases-more");
  if (!form || !input || !language || !status || !results || !moreButton) return;
  let nextCursor = null;
  let shownCount = 0;
  let activeEnglishQuery = "";

  const offline = [
    { q: ["thank", "thanks"], english: "Thank you for your help.", spanish: "Gracias por tu ayuda." },
    { q: ["good morning", "morning"], english: "Good morning. How are you?", spanish: "Buenos días. ¿Cómo estás?" },
    { q: ["school", "study"], english: "I study at school every day.", spanish: "Estudio en el colegio todos los días." },
    { q: ["help"], english: "Could you help me, please?", spanish: "¿Podrías ayudarme, por favor?" },
    { q: ["future", "goal"], english: "I am working toward my goals.", spanish: "Estoy trabajando para alcanzar mis metas." },
    { q: ["work", "trabajo"], english: "I have to go to work.", spanish: "Tengo que ir a trabajar." }
  ];

  function text(parent, tag, value, className = "") {
    const element = document.createElement(tag);
    element.textContent = value;
    if (className) element.className = className;
    parent.append(element);
    return element;
  }

  function showOffline(query) {
    const normalized = query.toLowerCase();
    const matches = offline.filter(item => item.q.some(term => normalized.includes(term) || term.includes(normalized)));
    results.replaceChildren();
    (matches.length ? matches : offline.slice(0, 3)).forEach(item => {
      const card = document.createElement("article");
      card.className = "phrase-card";
      text(card, "p", item.english, "phrase-english");
      text(card, "p", item.spanish, "phrase-spanish");
      text(card, "p", "Ejemplo guardado para consulta sin conexión.", "phrase-meta");
      results.append(card);
    });
  }

  function render(data, append = false) {
    if (!append) results.replaceChildren();
    const needsTranslation = [];
    data.forEach(sentence => {
      const card = document.createElement("article");
      card.className = "phrase-card";
      text(card, "p", sentence.text, "phrase-english");
      const translation = sentence.translations?.[0];
      text(card, "p", translation ? "Traducción de Tatoeba" : "Traducción automática de MyMemory", "phrase-translation-label");
      const translationElement = text(card, "p", translation?.text || "Traduciendo al español…", "phrase-spanish");
      if (!translation && sentence.text) needsTranslation.push({ original: sentence.text, element: translationElement });
      const attribution = document.createElement("p");
      attribution.className = "phrase-meta";
      attribution.textContent = `Autor: ${sentence.owner || "autor de Tatoeba"} · Licencia: ${sentence.license || translation?.license || "indicada en Tatoeba"} · `;
      const source = document.createElement("a");
      source.href = `https://tatoeba.org/en/sentences/show/${encodeURIComponent(sentence.id)}`;
      source.target = "_blank";
      source.rel = "noopener noreferrer";
      source.textContent = "Ver fuente";
      attribution.append(source);
      card.append(attribution);
      results.append(card);
    });
    shownCount += data.length;
    translateMissing(needsTranslation);
  }

  async function translateText(original, source = "en", target = "es") {
    const cacheKey = `villa-ingles-mymemory:${source}-${target}:${original}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return cached;
    } catch { /* Storage may be disabled; continue with the request. */ }

    const endpoint = location.protocol === "file:"
      ? `https://api.mymemory.translated.net/get?${new URLSearchParams({ q: original, langpair: `${source}|${target}`, mt: "1" })}`
      : `/api/translate?text=${encodeURIComponent(original)}&source=${source}&target=${target}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    let response;
    try {
      response = await fetch(endpoint, { headers: { Accept: "application/json" }, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
    if (!response.ok) throw new Error(`MyMemory request failed: ${response.status}`);
    const payload = await response.json();
    const translated = payload.translated || payload.responseData?.translatedText;
    if (!translated || payload.responseStatus && Number(payload.responseStatus) !== 200) throw new Error("MyMemory returned no translation");
    try { sessionStorage.setItem(cacheKey, translated); } catch { /* Keep the result in the current view. */ }
    return translated;
  }

  const translateOne = original => translateText(original, "en", "es");

  async function translateMissing(items) {
    let cursor = 0;
    const worker = async () => {
      while (cursor < items.length) {
        const item = items[cursor++];
        try {
          item.element.textContent = await translateOne(item.original);
        } catch {
          item.element.textContent = "Traducción no disponible en este momento.";
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(3, items.length) }, worker));
  }

  async function search(rawQuery, append = false) {
    const query = rawQuery.trim();
    if (!query || query.length > 60) {
      status.textContent = "Escribe una palabra o tema de hasta 60 caracteres.";
      input.focus();
      return;
    }
    input.value = query;
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    moreButton.disabled = true;
    if (!append) {
      nextCursor = null;
      shownCount = 0;
      moreButton.hidden = true;
      status.textContent = "Buscando frases…";
      results.replaceChildren();
    } else {
      status.textContent = "Cargando más frases…";
    }
    let stage = "Tatoeba";
    try {
      let englishQuery = append ? activeEnglishQuery : query;
      if (!append && language.value === "es") {
        stage = "MyMemory";
        status.textContent = `Traduciendo “${query}” al inglés…`;
        englishQuery = await translateText(query, "es", "en");
        activeEnglishQuery = englishQuery;
        stage = "Tatoeba";
      } else if (!append) {
        activeEnglishQuery = englishQuery;
      }
      const params = new URLSearchParams({ lang: "eng", q: englishQuery, "showtrans:lang": "spa", sort: "relevance", limit: "20" });
      if (append && nextCursor) params.set("after", nextCursor);
      const endpoint = location.protocol === "file:"
        ? `https://api.tatoeba.org/v1/sentences?${params}`
        : `/api/phrases?q=${encodeURIComponent(englishQuery)}${append && nextCursor ? `&after=${encodeURIComponent(nextCursor)}` : ""}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      let response;
      try {
        response = await fetch(endpoint, { headers: { Accept: "application/json" }, signal: controller.signal });
      } finally {
        clearTimeout(timeout);
      }
      if (!response.ok) throw new Error(`Tatoeba request failed: ${response.status}`);
      const payload = await response.json();
      const sentences = Array.isArray(payload.data) ? payload.data : [];
      if (!sentences.length) {
        moreButton.hidden = true;
        status.textContent = append ? "No hay más frases para mostrar." : "No encontramos frases para ese tema. Prueba otra palabra.";
        return;
      }
      render(sentences, append);
      nextCursor = payload.next || null;
      moreButton.hidden = !nextCursor;
      status.textContent = `${shownCount} frases para “${englishQuery}”. Si falta la traducción al español, MyMemory la propone.`;
    } catch (error) {
      showOffline(query);
      status.textContent = error?.name === "AbortError"
        ? "La búsqueda tardó demasiado. Mostramos ejemplos guardados; inténtalo de nuevo con mejor conexión."
        : stage === "MyMemory"
          ? "MyMemory no pudo traducir el tema. Mostramos ejemplos guardados; revisa la conexión e inténtalo otra vez."
          : "No se pudo completar la búsqueda en Tatoeba. Mostramos ejemplos guardados; el módulo sigue disponible sin internet.";
    } finally {
      button.disabled = false;
      moreButton.disabled = false;
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    search(input.value);
  });
  document.querySelectorAll("[data-phrase-query]").forEach(button => {
    button.addEventListener("click", () => {
      language.value = "en";
      search(button.dataset.phraseQuery);
    });
  });
  moreButton.addEventListener("click", () => search(input.value, true));
  status.textContent = "Elige un tema y pulsa “Buscar frases”.";
})();
