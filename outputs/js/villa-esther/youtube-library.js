// Video library UI: searches module-specific educational videos and controls playback.
(() => {
  const form = document.getElementById("villaVideoSearch");
  const topic = document.getElementById("villaVideoTopic");
  const query = document.getElementById("villaVideoQuery");
  const results = document.getElementById("villaVideoResults");
  const status = document.getElementById("villaVideoStatus");
  if (!form || !query || !results || !status) return;

  const card = (video, topicLabel) => {
    const article = document.createElement("article");
    article.className = "villa-video-card card";
    const media = document.createElement("div");
    media.className = "villa-video-media";
    const image = document.createElement("img");
    image.src = video.thumbnail;
    image.alt = "Miniatura del video: " + video.title;
    image.loading = "lazy";
    image.width = 480;
    image.height = 360;
    const play = document.createElement("button");
    play.type = "button";
    play.className = "villa-video-play";
    play.setAttribute("aria-label", "Reproducir: " + video.title);
    play.innerHTML =
      '<span aria-hidden="true">▶</span><span class="visually-hidden">Reproducir video</span>';
    media.append(image, play);
    const body = document.createElement("div");
    body.className = "villa-video-body card-body";
    const badge = document.createElement("span");
    badge.className = "villa-video-topic";
    badge.textContent = topicLabel;
    const title = document.createElement("h3");
    title.textContent = video.title;
    const channel = document.createElement("p");
    channel.textContent = video.channel;
    const actions = document.createElement("div");
    actions.className = "villa-video-actions";
    const startPlayback = () => {
      const frame = document.createElement("iframe");
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}?autoplay=1&rel=0`;
      frame.title = video.title;
      frame.loading = "lazy";
      frame.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.allowFullscreen = true;
      const player = document.createElement("div");
      player.className = "villa-video-player ratio ratio-16x9";
      player.append(frame);
      article.classList.add("is-playing");
      media.replaceChildren(player);
      play.removeEventListener("click", startPlayback);
    };
    play.addEventListener("click", startPlayback);
    const open = document.createElement("a");
    open.href = `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;
    open.target = "_blank";
    open.rel = "noopener noreferrer";
    open.className = "villa-video-open";
    open.textContent = "Abrir en YouTube ↗";
    actions.append(open);
    body.append(badge, title, channel, actions);
    article.append(media, body);
    return article;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const selectedTopic = topic?.value || form.dataset.videoTopic;
    if (!selectedTopic) {
      status.textContent = "No se pudo identificar el tema de este módulo.";
      return;
    }
    const search = query.value.trim();
    const params = new URLSearchParams({ tema: selectedTopic });
    if (search) params.set("q", search);
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    results.replaceChildren();
    status.textContent = "Buscando videos educativos…";
    try {
      const response = await fetch(`/api/youtube?${params}`, {
        headers: { Accept: "application/json" },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo completar la búsqueda.");
      if (!data.videos?.length) {
        status.textContent = "No encontramos videos para este tema. Prueba con otra palabra.";
        return;
      }
      const fragment = document.createDocumentFragment();
      const topicNames = {
        proyecto: "Proyecto de vida",
        carreras: "Opciones de estudio",
        icfes: "Saber 11",
        laboral: "Mundo laboral",
        digital: "Habilidades digitales",
        ingles: "Inglés",
        consumo: "Prevención del consumo",
        violencia: "Prevención de la violencia",
        abuso: "Prevención de la violencia sexual",
      };
      const topicLabel =
        topic?.selectedOptions?.[0]?.textContent || topicNames[selectedTopic] || selectedTopic;
      data.videos.forEach((video) => fragment.append(card(video, topicLabel)));
      results.append(fragment);
      status.textContent = `${data.videos.length} videos encontrados. Revisa cada contenido antes de usarlo en clase.`;
    } catch (error) {
      status.textContent = error.message || "No se pudo conectar con YouTube. Intenta de nuevo.";
    } finally {
      button.disabled = false;
    }
  });

  const libraryPanel = document.getElementById("videoLibraryPanel");
  const libraryToggle = document.querySelector('[data-bs-target="#videoLibraryPanel"]');
  libraryPanel?.addEventListener("shown.bs.collapse", () => {
    if (libraryToggle) libraryToggle.textContent = "Ocultar videos";
  });
  libraryPanel?.addEventListener("hidden.bs.collapse", () => {
    if (libraryToggle) libraryToggle.textContent = "Buscar videos";
  });

  if (form.dataset.autoSearch === "true") form.requestSubmit();
})();
