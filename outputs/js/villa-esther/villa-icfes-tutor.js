// Chat de acompañamiento para dudas de Saber 11, atendido por GroqCloud.
(() => {
  const $ = (id) => document.getElementById(id);
  const form = $("icfesTutorForm"),
    log = $("icfesTutorLog");
  if (!form || !log) return;

  const input = $("icfesTutorInput"),
    send = $("icfesTutorSend"),
    clear = $("icfesTutorClear"),
    status = $("icfesTutorStatus");
  const chat = { messages: [], busy: false };

  function addMessage(role, text) {
    const message = document.createElement("div");
    message.className = `icfes-tutor-message ${role}`;
    message.textContent = text;
    log.append(message);
    log.scrollTop = log.scrollHeight;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (chat.busy) return;
    const text = input.value.trim();
    if (!text) return;
    chat.busy = true;
    send.disabled = true;
    clear.disabled = true;
    input.disabled = true;
    chat.messages.push({ role: "user", text });
    addMessage("user", text);
    input.value = "";
    status.textContent = "El tutor está preparando una explicación…";
    try {
      const result = await window.villaGroqChat({
        mode: "icfes",
        messages: chat.messages.slice(-10),
      });
      chat.messages.push({ role: "assistant", text: result.answer });
      chat.messages = chat.messages.slice(-10);
      addMessage("assistant", result.answer);
      status.textContent = "Puedes seguir preguntando; la conversación vive solo en esta página.";
    } catch (error) {
      chat.messages.pop();
      input.value = text;
      addMessage("system", error.message || "No se pudo conectar con el tutor. Inténtalo otra vez.");
      status.textContent = "No se pudo consultar al tutor; tu pregunta sigue en el campo.";
    } finally {
      chat.busy = false;
      send.disabled = false;
      clear.disabled = false;
      input.disabled = false;
      input.focus();
    }
  });

  clear.addEventListener("click", () => {
    chat.messages = [];
    log.replaceChildren();
    addMessage("assistant", "Conversación nueva. ¿Qué concepto o pregunta de Saber 11 quieres revisar?");
    status.textContent = "Conversación borrada de esta página.";
    input.focus();
  });
})();
