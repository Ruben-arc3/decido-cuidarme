(() => {
  const form = document.getElementById("villaVideoSearch");
  const topic = document.getElementById("villaVideoTopic");
  const query = document.getElementById("villaVideoQuery");
  const results = document.getElementById("villaVideoResults");
  const status = document.getElementById("villaVideoStatus");
  if (!form || !topic || !query || !results || !status) return;

  const card = video => {
    const article = document.createElement("article");
    article.className = "villa-video-card card";
    const image = document.createElement("img");
    image.src = video.thumbnail;
    image.alt = "Miniatura del video: " + video.title;
    image.loading = "lazy";
    image.width = 480;
    image.height = 360;
    const body = document.createElement("div");
    body.className = "villa-video-body card-body";
    const title = document.createElement("h3");
    title.textContent = video.title;
    const channel = document.createElement("p");
    channel.textContent = video.channel;
    const actions = document.createElement("div");
    actions.className = "villa-video-actions";
    const play = document.createElement("button");
    play.type = "button";
    play.className = "btn villa-video-play";
    play.textContent = "Ver aquí";
    play.setAttribute("aria-label", "Reproducir: " + video.title);
    play.addEventListener("click", () => {
      const frame = document.createElement("iframe");
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}?autoplay=1&rel=0`;
      frame.title = video.title;
      frame.loading = "lazy";
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.allowFullscreen = true;
      const player = document.createElement("div");
      player.className = "villa-video-player ratio ratio-16x9";
      player.append(frame);
      article.replaceChildren(player, body);
      play.remove();
    });
    const open = document.createElement("a");
    open.href = `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;
    open.target = "_blank";
    open.rel = "noopener noreferrer";
    open.className = "villa-video-open";
    open.textContent = "Abrir en YouTube ↗";
    actions.append(play, open);
    body.append(title, channel, actions);
    article.append(image, body);
    return article;
  };

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const selectedTopic = topic.value;
    const search = query.value.trim();
    const params = new URLSearchParams({ tema: selectedTopic });
    if (search) params.set("q", search);
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    results.replaceChildren();
    status.textContent = "Buscando videos educativos…";
    try {
      const response = await fetch(`/api/youtube?${params}`, { headers: { Accept: "application/json" } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo completar la búsqueda.");
      if (!data.videos?.length) {
        status.textContent = "No encontramos videos para este tema. Prueba con otra palabra.";
        return;
      }
      const fragment = document.createDocumentFragment();
      data.videos.forEach(video => fragment.append(card(video)));
      results.append(fragment);
      status.textContent = `${data.videos.length} videos encontrados. Revisa cada contenido antes de usarlo en clase.`;
    } catch (error) {
      status.textContent = error.message || "No se pudo conectar con YouTube. Intenta de nuevo.";
    } finally {
      button.disabled = false;
    }
  });
})();
