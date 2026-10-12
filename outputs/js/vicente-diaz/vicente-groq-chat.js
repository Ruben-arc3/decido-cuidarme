// Interfaz del chat de orientación vocacional de Vicente Díaz (GroqCloud).
(() => {
  const $ = (id) => document.getElementById(id);
  const launcher = $("careerLauncher"),
    panel = $("careerPanel"),
    form = $("careerChatForm"),
    log = $("careerChatLog");
  if (!launcher || !panel || !form || !log) return;

  const input = $("careerChatInput"),
    status = $("careerChatStatus"),
    send = $("careerChatSend"),
    clear = $("careerChatClear");
  const chat = { messages: [], busy: false };
  status.textContent = "Disponible sin cuenta. No escribas datos personales.";

  function showPanel(open) {
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
    else launcher.focus();
  }
  function addMessage(role, text) {
    const message = document.createElement("div");
    message.className = `career-message ${role}`;
    message.textContent = text;
    log.append(message);
    log.scrollTop = log.scrollHeight;
  }

  launcher.addEventListener("click", () => showPanel(panel.hidden));
  document.querySelectorAll("[data-career-open]").forEach((button) =>
    button.addEventListener("click", () => showPanel(true)),
  );
  $("careerClose")?.addEventListener("click", () => showPanel(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) showPanel(false);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (chat.busy) return;
    const text = input.value.trim();
    if (!text) return;
    chat.busy = true;
    send.disabled = true;
    clear.disabled = true;
    input.disabled = true;
    status.textContent = "El orientador está preparando una respuesta…";
    chat.messages.push({ role: "user", text });
    addMessage("user", text);
    input.value = "";
    try {
      const response = await fetch("/api/groq-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ mode: "vocational", messages: chat.messages.slice(-10) }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || `El chat respondió con error (${response.status}).`);
      chat.messages.push({ role: "assistant", text: result.answer });
      chat.messages = chat.messages.slice(-10);
      addMessage("assistant", result.answer);
      status.textContent = "Puedes seguir explorando sin crear una cuenta.";
    } catch (error) {
      chat.messages.pop();
      input.value = text;
      addMessage("system", error.message || "No se pudo conectar con el orientador. Inténtalo otra vez.");
      status.textContent = "No se pudo consultar el orientador; tu mensaje sigue en el campo.";
    } finally {
      chat.busy = false;
      send.disabled = false;
      clear.disabled = false;
      input.disabled = false;
      input.focus();
    }
  });

  clear?.addEventListener("click", () => {
    chat.messages = [];
    log.replaceChildren();
    addMessage("assistant", "Conversación nueva. ¿Qué actividad, tema o problema te gusta explorar?");
    status.textContent = "La conversación anterior se borró de esta página.";
  });

  document.querySelectorAll("[data-career-prompt]").forEach((button) =>
    button.addEventListener("click", () => {
      input.value = button.dataset.careerPrompt;
      input.focus();
    }),
  );
})();
