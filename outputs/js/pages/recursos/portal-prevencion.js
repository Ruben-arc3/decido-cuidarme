const resourceData = {
  familias: [
    ["💬", "Tarjetas de conversación", "PDF · 20 situaciones para hablar en casa"],
    ["🤝", "Acuerdo familiar de cuidado", "Plantilla editable · acuerdos y adultos de confianza"],
    ["📞", "Directorio de apoyo", "PDF · contactos que deben validarse localmente"],
    ["📅", "Calendario protector", "PDF · retos semanales de bienestar"],
  ],
  docentes: [
    ["🧩", "Guía: Mi red me protege", "Sesión de 40 min · 13 a 17 años"],
    ["🖥️", "Presentación editable", "Diapositivas · presión de grupo y apoyo"],
    ["📋", "Protocolo de escucha inicial", "Guía · privacidad, escucha y remisión"],
    ["🏆", "Guía para retos", "PDF · equipos, códigos e insignias"],
  ],
  comunidad: [
    ["📣", "Afiche para cartelera", "PNG editable · mensaje preventivo"],
    ["🎙️", "Guion para emisora", "PDF · cápsula de 45 segundos"],
    ["📱", "Mensajes para WhatsApp", "Texto · versiones para familias y jóvenes"],
    ["🎨", "Kit para jornada comunitaria", "PDF · actividades culturales y deportivas"],
  ],
};
const resourceList = document.querySelector("#resource-list");
function renderResources(group) {
  resourceList.replaceChildren();
  resourceData[group].forEach(([icon, title, detail]) => {
    const item = document.createElement("article");
    item.className = "resource";
    item.innerHTML = `<span class="file">${icon}</span><b>${title}</b><small>${detail}</small><span class="download" role="button">Ver ejemplo ↓</span>`;
    item.querySelector(".download").onclick = () =>
      alert(
        `Ejemplo de recurso: ${title}. En la versión final se descargaría un PDF o plantilla editable.`,
      );
    resourceList.append(item);
  });
}
renderResources("familias");
document.querySelectorAll(".tab").forEach(
  (tab) =>
    (tab.onclick = () => {
      document.querySelector(".tab.active").classList.remove("active");
      tab.classList.add("active");
      renderResources(tab.dataset.group);
    }),
);
const stories = {
  partido: {
    icon: "⚽",
    title: "Después del partido",
    text: "Al terminar el partido, alguien insiste en que pruebes alcohol para “ser parte del grupo”. ¿Qué opción protege mejor tu bienestar?",
    choices: [
      "Decir: “Paso, prefiero seguir jugando otro día”.",
      "Alejarte con una amistad de confianza y proponer otro plan.",
      "Buscar a un adulto de confianza si la presión continúa.",
    ],
  },
  amiga: {
    icon: "💬",
    title: "Una amistad que cuida",
    text: "Una amiga dice que está triste y no quiere volver a casa. ¿Cómo puedes acompañarla sin cargar el problema tú solo?",
    choices: [
      "Escuchar sin juzgar y preguntarle qué necesita.",
      "Buscar juntos a un adulto protector u orientador.",
      "Si hay riesgo inmediato, llamar a una línea de emergencia.",
    ],
  },
  fiesta: {
    icon: "🎉",
    title: "Plan seguro",
    text: "Tu grupo planea una salida. Antes de ir, ¿qué acuerdos pueden cuidar a todas las personas?",
    choices: [
      "Definir cómo volverán y con quién estarán.",
      "Compartir la ubicación solo con un adulto de confianza.",
      "Acordar que nadie se queda solo si se siente incómodo.",
    ],
  },
};
const modal = document.querySelector("#modal");
document.querySelectorAll(".story").forEach(
  (button) =>
    (button.onclick = () => {
      const story = stories[button.dataset.story];
      document.querySelector("#modal-icon").textContent = story.icon;
      document.querySelector("#modal-title").textContent = story.title;
      document.querySelector("#modal-text").textContent = story.text;
      const list = document.querySelector("#modal-choices");
      list.replaceChildren();
      story.choices.forEach((choice) => {
        const b = document.createElement("button");
        b.className = "choice";
        b.textContent = "✓ " + choice;
        b.onclick = () =>
          alert("Buena ruta: esta decisión fortalece el autocuidado y la búsqueda de apoyo.");
        list.append(b);
      });
      modal.classList.add("open");
    }),
);
document.querySelector(".close").onclick = () => modal.classList.remove("open");
modal.onclick = (e) => {
  if (e.target === modal) modal.classList.remove("open");
};
