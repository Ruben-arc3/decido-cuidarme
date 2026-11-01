const componentScript = document.currentScript;
const siteRoot = new URL("../../", componentScript.src);

const widget = document.createElement("div");
widget.className = "suggestion-widget";
widget.innerHTML = `
  <dialog class="suggestion-dialog" id="suggestion-dialog" aria-labelledby="suggestion-title">
    <form class="suggestion-form" novalidate>
      <button class="suggestion-close" type="button" aria-label="Cerrar buzón">×</button>
      <div class="suggestion-heading">
        <span class="suggestion-heading-icon" aria-hidden="true">✳</span>
        <div><p class="suggestion-kicker">BUZÓN DE SUGERENCIAS</p><h2 id="suggestion-title">Ayúdanos a mejorar</h2></div>
      </div>
      <p class="suggestion-intro">Comparte una idea o cuéntanos si algo no funcionó. No necesitas crear una cuenta.</p>
      <label class="suggestion-field">Tipo de comentario
        <select name="category" required>
          <option value="idea">Tengo una idea</option>
          <option value="error">Encontré un error</option>
          <option value="content">Quiero sugerir contenido</option>
          <option value="other">Otro comentario</option>
        </select>
      </label>
      <label class="suggestion-field">Tu comentario
        <textarea name="message" rows="5" minlength="10" maxlength="1200" required placeholder="Escribe aquí tu sugerencia…"></textarea>
      </label>
      <label class="suggestion-trap" aria-hidden="true">Deja este campo vacío<input name="website" tabindex="-1" autocomplete="off"></label>
      <p class="suggestion-privacy"><span aria-hidden="true">🔒</span> No incluyas nombres ni datos personales. Tu comentario se guarda de forma privada.</p>
      <p class="suggestion-status" data-suggestion-status role="status" aria-live="polite"></p>
      <button class="suggestion-submit" type="submit"><span>Enviar sugerencia</span><span aria-hidden="true">→</span></button>
    </form>
    <section class="suggestion-success" data-suggestion-success aria-labelledby="suggestion-success-title" tabindex="-1" hidden>
      <span class="suggestion-success-icon" aria-hidden="true">✓</span>
      <p class="suggestion-kicker">MENSAJE RECIBIDO</p>
      <h2 id="suggestion-success-title" tabindex="-1">¡Gracias por compartir!</h2>
      <p>Tu sugerencia quedó guardada. Nos ayudará a seguir mejorando Decido Cuidarme.</p>
      <button class="suggestion-done" type="button">Listo</button>
    </section>
  </dialog>`;
document.body.append(widget);
const dialog = widget.querySelector("dialog");
const form = widget.querySelector("form");
const success = widget.querySelector("[data-suggestion-success]");
const status = widget.querySelector("[data-suggestion-status]");
const submitButton = widget.querySelector(".suggestion-submit");
let activeTrigger;

document.querySelectorAll("[data-suggestion-open]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    activeTrigger = trigger;
    status.textContent = "";
    form.hidden = false;
    success.hidden = true;
    form.reset();
    dialog.showModal();
    form.elements.category.focus();
  });
});
widget.querySelector(".suggestion-done").addEventListener("click", () => dialog.close());
widget.querySelector(".suggestion-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "";
  const message = form.elements.message.value.trim();
  if (form.elements.website.value) return;
  if (message.length < 10) {
    status.textContent = "Escribe al menos 10 caracteres para que podamos entender la sugerencia.";
    form.elements.message.focus();
    return;
  }

  submitButton.disabled = true;
  status.textContent = "Enviando tu sugerencia…";
  submitButton.querySelector("span").textContent = "Enviando…";
  try {
    const [{ firebaseConfig }, { initializeApp, getApps }, firestore] = await Promise.all([
      import(new URL("js/suggestions/suggestion-firebase-config.js", siteRoot).href),
      import("https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js"),
    ]);
    const appName = "public-suggestion-box";
    const app = getApps().find((candidate) => candidate.name === appName) || initializeApp(firebaseConfig, appName);
    const db = firestore.getFirestore(app);
    await firestore.addDoc(firestore.collection(db, "publicSuggestions"), {
      category: form.elements.category.value,
      message,
      page: window.location.pathname.slice(0, 160),
      status: "new",
      createdAt: firestore.serverTimestamp(),
    });
    form.reset();
    form.hidden = true;
    success.hidden = false;
    success.querySelector("h2").focus();
  } catch (error) {
    console.error("No se pudo enviar la sugerencia a Firebase", error);
    status.classList.remove("is-success");
    status.textContent = window.location.protocol === "file:"
      ? "Para guardar el comentario, abre la plataforma desde localhost o desde el sitio publicado."
      : error?.code === "permission-denied"
      ? "Firebase rechazó el envío. Verifica que las reglas de sugerencias estén publicadas."
      : "No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.";
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector("span").textContent = "Enviar sugerencia";
  }
});

dialog.addEventListener("close", () => {
  activeTrigger?.focus();
});
