(() => {
  const form = document.getElementById("grammar-rag-form");
  if (!form) return;
  const input = document.getElementById("grammar-rag-question");
  const submit = document.getElementById("grammar-rag-submit");
  const status = document.getElementById("grammar-rag-status");
  const conversation = document.getElementById("grammar-rag-conversation");
  const history = [];

  function addMessage(role, content, sources = []) {
    const article = document.createElement("article");
    article.className = `rag-message ${role === "assistant" ? "rag-assistant" : "rag-student"}`;
    const label = document.createElement("strong");
    label.textContent = role === "assistant" ? "Tutor" : "Pregunta del grupo";
    const text = document.createElement("p");
    text.textContent = content;
    article.append(label, text);
    if (sources.length) {
      const sourceLine = document.createElement("small");
      sourceLine.textContent = `Guía consultada: ${sources.map(source => source.source ? `${source.source}${source.pages ? `, pp. ${source.pages}` : ""}` : source.title).join(" · ")}`;
      article.append(sourceLine);
    }
    conversation.append(article);
    article.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  document.querySelectorAll("[data-rag-question]").forEach(button => {
    button.addEventListener("click", () => {
      input.value = button.dataset.ragQuestion || "";
      input.focus();
    });
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const question = input.value.trim();
    if (question.length < 3) {
      status.textContent = "Escribe una pregunta un poco más completa.";
      input.focus();
      return;
    }
    addMessage("user", question);
    history.push({ role: "user", content: question });
    input.value = "";
    submit.disabled = true;
    status.textContent = "Buscando en la guía y preparando una explicación…";
    try {
      const response = await fetch("/api/grammar-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ question, history: history.slice(0, -1).slice(-6) })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "No se pudo consultar el tutor.");
      addMessage("assistant", data.answer, data.sources || []);
      history.push({ role: "assistant", content: data.answer });
      if (history.length > 8) history.splice(0, history.length - 8);
      status.textContent = "Puedes continuar con otra pregunta.";
    } catch (error) {
      status.textContent = location.protocol === "file:"
        ? "Abre el tutor desde la dirección publicada en Cloudflare Pages; al abrir este archivo directamente no existe la función Groq. Las otras actividades siguen disponibles sin conexión."
        : (error.message || "No se pudo conectar con el tutor. Inténtalo de nuevo.");
    } finally {
      submit.disabled = false;
      input.focus();
    }
  });
})();
