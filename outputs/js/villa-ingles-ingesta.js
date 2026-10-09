import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";

const form = document.getElementById("ingest-form");
const keyInput = document.getElementById("admin-key");
const titleInput = document.getElementById("pdf-title");
const fileInput = document.getElementById("pdf-file");
const ingestButton = document.getElementById("ingest-button");
const refreshButton = document.getElementById("refresh-button");
const status = document.getElementById("ingest-status");
const documentList = document.getElementById("document-list");

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { Accept: "application/json", Authorization: `Bearer ${keyInput.value}`, ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `La solicitud falló (${response.status}).`);
  return data;
}

async function getPdfPages(file) {
  const task = pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const pdf = await task.promise;
  if (pdf.numPages > 500) throw new Error("El PDF supera el límite de 500 páginas.");
  const pages = [];
  for (let number = 1; number <= pdf.numPages; number++) {
    status.textContent = `Extrayendo texto: página ${number} de ${pdf.numPages}…`;
    const page = await pdf.getPage(number);
    const content = await page.getTextContent();
    const text = content.items.map(item => item.str || "").join(" ").replace(/\s+/g, " ").trim();
    if (text) pages.push({ page: number, text });
  }
  if (!pages.length) throw new Error("No encontramos texto seleccionable. Si son imágenes escaneadas, primero hace falta OCR.");
  return { pages, pageCount: pdf.numPages };
}

function renderDocuments(documents) {
  documentList.replaceChildren();
  if (!documents.length) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Aún no hay documentos ingresados.";
    documentList.append(empty);
    return;
  }
  documents.forEach(document => {
    const row = document.createElement("li");
    row.className = "doc";
    const details = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = document.title;
    const meta = document.createElement("small");
    meta.textContent = `${document.pages} páginas · ${document.chunks} fragmentos`;
    details.append(name, meta);
    const remove = document.createElement("button");
    remove.className = "button danger";
    remove.type = "button";
    remove.textContent = "Eliminar fuente";
    remove.addEventListener("click", async () => {
      if (!confirm(`¿Eliminar “${document.title}” de la biblioteca del tutor?`)) return;
      remove.disabled = true;
      try {
        await api("/api/grammar-ingest", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: document.id }) });
        status.textContent = `Se eliminó “${document.title}”.`;
        await loadDocuments();
      } catch (error) {
        status.textContent = error.message;
        remove.disabled = false;
      }
    });
    row.append(details, remove);
    documentList.append(row);
  });
}

async function loadDocuments() {
  if (!keyInput.value) {
    status.textContent = "Escribe la clave de gestión para ver la biblioteca.";
    keyInput.focus();
    return;
  }
  refreshButton.disabled = true;
  status.textContent = "Consultando biblioteca…";
  try {
    const data = await api("/api/grammar-ingest");
    renderDocuments(data.documents || []);
    status.textContent = "Biblioteca actualizada.";
  } catch (error) {
    status.textContent = error.message;
  } finally {
    refreshButton.disabled = false;
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const file = fileInput.files?.[0];
  if (!keyInput.value) { status.textContent = "Escribe la clave de gestión."; keyInput.focus(); return; }
  if (!file || (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf"))) { status.textContent = "Selecciona un archivo PDF."; return; }
  if (file.size > 20 * 1024 * 1024) { status.textContent = "El PDF supera el límite de 20 MB."; return; }
  ingestButton.disabled = true;
  refreshButton.disabled = true;
  try {
    const extracted = await getPdfPages(file);
    const textSize = extracted.pages.reduce((size, page) => size + page.text.length, 0);
    if (textSize > 750_000) throw new Error("El texto supera el límite de 750 KB. Divide el PDF en documentos más pequeños.");
    status.textContent = "Dividiendo el texto y guardándolo en la biblioteca…";
    const result = await api("/api/grammar-ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: titleInput.value.trim() || file.name.replace(/\.pdf$/i, ""), pages: extracted.pages })
    });
    status.textContent = `Ingesta completada: ${result.document.chunks} fragmentos de ${result.document.pages} páginas guardados. El tutor ya puede consultarlos.`;
    fileInput.value = "";
    await loadDocuments();
  } catch (error) {
    status.textContent = error.message || "No se pudo procesar el PDF.";
  } finally {
    ingestButton.disabled = false;
    refreshButton.disabled = false;
  }
});

refreshButton.addEventListener("click", loadDocuments);
