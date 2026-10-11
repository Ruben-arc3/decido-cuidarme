// Busca videos para las campañas y descarta cualquier resultado que supere el límite indicado.
const campaignVideoGrids = document.querySelectorAll("[data-campaign-video-topic]");

function showCampaignVideoStatus(grid, message) {
  grid.replaceChildren();
  const status = document.createElement("p");
  status.className = "campaign-video-state";
  status.setAttribute("role", "status");
  status.textContent = message;
  grid.append(status);
}

function createCampaignVideoCard(video) {
  const card = document.createElement("article");
  card.className = "video-card";

  const frame = document.createElement("div");
  frame.className = "video-frame";
  const player = document.createElement("iframe");
  player.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}?rel=0`;
  player.title = video.title;
  player.loading = "lazy";
  player.referrerPolicy = "strict-origin-when-cross-origin";
  player.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  player.allowFullscreen = true;
  frame.append(player);

  const copy = document.createElement("div");
  copy.className = "video-copy";
  const metadata = document.createElement("div");
  metadata.className = "campaign-video-meta";
  const source = document.createElement("span");
  source.className = "video-source";
  source.textContent = video.channel;
  const duration = document.createElement("span");
  duration.className = "campaign-video-duration";
  duration.textContent = `${video.duration} · máx. 5 min`;
  metadata.append(source, duration);

  const title = document.createElement("h3");
  title.textContent = video.title;
  const description = document.createElement("p");
  description.textContent =
    video.description || "Recurso audiovisual relacionado con esta campaña.";
  const link = document.createElement("a");
  link.href = `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Abrir en YouTube ↗";

  copy.append(metadata, title, description, link);
  card.append(frame, copy);
  return card;
}

async function loadCampaignVideos(grid) {
  showCampaignVideoStatus(grid, "Buscando videos educativos de hasta 5 minutos…");
  const topic = grid.dataset.campaignVideoTopic;

  try {
    const response = await fetch(
      `/api/youtube?${new URLSearchParams({ tema: topic, maxSeconds: "300" })}`,
    );
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "No fue posible consultar YouTube.");

    const videos = (payload.videos || []).filter(
      (video) => Number.isFinite(video.durationSeconds) && video.durationSeconds <= 300,
    );
    if (!videos.length) {
      showCampaignVideoStatus(
        grid,
        "No encontramos videos de este tema que duren 5 minutos o menos. Intenta más tarde.",
      );
      return;
    }

    grid.replaceChildren(...videos.map(createCampaignVideoCard));
  } catch (error) {
    showCampaignVideoStatus(
      grid,
      `${error.message} La búsqueda de videos requiere conexión a internet.`,
    );
  }
}

campaignVideoGrids.forEach(loadCampaignVideos);
