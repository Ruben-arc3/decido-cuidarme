const map = L.map("map", { zoomControl: false }).setView([9.01811, -76.26413], 14);
L.control.zoom({ position: "bottomright" }).addTo(map);
const osmBase = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);
const points = [
  {
    id: "camu",
    name: "CAMU Cornelio Valdelamar Peña",
    type: "health",
    category: "Salud",
    icon: "🏥",
    lat: 9.0161341,
    lng: -76.2633445,
    detail:
      "Centro de atención en salud. Dirección reportada: Carrera 5 # 5-03, barrio La Plaza. Confirma horarios y servicios antes de acudir.",
    action: "Carrera 5 # 5-03 · La Plaza",
    osm: "node/14270905285",
  },
  {
    id: "policia",
    name: "Estación de Policía Puerto Escondido",
    type: "protection",
    category: "Seguridad",
    icon: "🛡️",
    lat: 9.0193799,
    lng: -76.2609891,
    detail:
      "Estación de Policía de Puerto Escondido. Para conocer atención y canales vigentes, consulta directamente a la Policía Nacional.",
    action: "Punto de atención policial",
    osm: "node/14270905286",
  },
  {
    id: "alcaldia",
    name: "Alcaldía Municipal de Puerto Escondido",
    type: "institution",
    category: "Institucional",
    icon: "🏛️",
    lat: 9.0196018,
    lng: -76.2607578,
    detail:
      "Sede de la administración municipal. Verifica horarios y servicios antes de desplazarte.",
    action: "Administración municipal",
    osm: "node/14270905287",
  },
  {
    id: "villa-esther",
    name: "Institución Educativa Villa Esther",
    type: "school",
    category: "Orientación escolar",
    icon: "🏫",
    lat: 9.063099,
    lng: -76.124189,
    detail:
      "Plantel educativo de referencia para orientación escolar. Consulta con docentes o directivos la disponibilidad de acompañamiento. Coordenada referenciada en el listado geográfico de puestos de votación de la Registraduría.",
    action: "Corregimiento Villa Esther",
    mapZoom: 16,
  },
  {
    id: "vicente-diaz",
    name: "Institución Educativa Vicente Díaz",
    type: "school",
    category: "Orientación escolar",
    icon: "🏫",
    lat: 8.93114,
    lng: -76.18663,
    detail:
      "Plantel educativo de referencia para orientación escolar. Consulta con docentes o directivos la disponibilidad de acompañamiento. Coordenada referenciada en el listado geográfico de puestos de votación de la Registraduría.",
    action: "Corregimiento Las Mujeres",
    mapZoom: 16,
  },
];
const markers = new Map(),
  places = document.querySelector("#places");
const layers = {
  health: { label: "Salud · CAMU", group: L.layerGroup() },
  protection: { label: "Seguridad · Policía", group: L.layerGroup() },
  institution: { label: "Institucional · Alcaldía", group: L.layerGroup() },
  school: { label: "Orientación escolar · Instituciones", group: L.layerGroup() },
};
const overlays = Object.fromEntries(
  Object.values(layers).map((layer) => [layer.label, layer.group]),
);
L.control
  .layers({ OpenStreetMap: osmBase }, overlays, { collapsed: false, position: "topright" })
  .addTo(map);
const pin = (point) =>
  L.divIcon({
    className: "",
    html: `<div class="pin ${point.type}"><span>${point.icon}</span></div>`,
    iconSize: [39, 39],
    iconAnchor: [19, 39],
    popupAnchor: [0, -38],
  });
function popup(point) {
  const mapUrl = point.osm
    ? `https://www.openstreetmap.org/${point.osm}`
    : `https://www.openstreetmap.org/?mlat=${point.lat}&mlon=${point.lng}#map=${point.mapZoom || 17}/${point.lat}/${point.lng}`;
  return `<h3 class="popup-title">${point.icon} ${point.name}</h3><p class="popup-type">${point.category} · Puerto Escondido, Córdoba</p><p>${point.detail}</p><a class="popup-button" href="${mapUrl}" target="_blank" rel="noopener">Ver ubicación en OpenStreetMap</a>`;
}
points.forEach((point) => {
  const marker = L.marker([point.lat, point.lng], { icon: pin(point) }).bindPopup(popup(point));
  markers.set(point.id, marker);
  layers[point.type].group.addLayer(marker);
});
function show(filter = "all") {
  places.replaceChildren();
  const visible = points.filter((point) => filter === "all" || point.type === filter);
  Object.entries(layers).forEach(([type, layer]) => {
    if (filter === "all" || filter === type) layer.group.addTo(map);
    else map.removeLayer(layer.group);
  });
  visible.forEach((point) => {
    const marker = markers.get(point.id);
    const card = document.createElement("button");
    card.className = "place";
    card.innerHTML = `<span class="place-icon">${point.icon}</span><span><strong>${point.name}</strong><small>${point.category} · ${point.action}</small></span>`;
    card.onclick = () => {
      layers[point.type].group.addTo(map);
      map.flyTo([point.lat, point.lng], point.mapZoom || 17, { duration: 0.55 });
      marker.openPopup();
    };
    places.append(card);
  });
  if (visible.length > 1)
    map.fitBounds(
      L.featureGroup(visible.map((point) => markers.get(point.id)))
        .getBounds()
        .pad(0.28),
    );
}
document.querySelectorAll(".filter").forEach(
  (button) =>
    (button.onclick = () => {
      document.querySelector(".filter.active").classList.remove("active");
      button.classList.add("active");
      show(button.dataset.filter);
    }),
);
show();
