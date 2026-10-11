(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  let deck = [];
  function esc(x) {
    return String(x).replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  }
  function build() {
    const title = $("title").value.trim(),
      topic = $("topic").value,
      goal = $("goal").value.trim(),
      ideas = $("ideas")
        .value.split(/\n+/)
        .map((x) => x.trim())
        .filter(Boolean),
      activity = $("activity").value.trim(),
      close = $("close").value.trim();
    deck = [
      ["Inicio", title, topic],
      ["Propósito", goal],
      ["Ideas clave", ideas.map((x) => "• " + x).join("\n")],
      ["Reto participativo", activity],
      ["Cierre", close],
    ];
    const root = $("slides");
    root.className = "slides";
    root.replaceChildren();
    deck.forEach((s, i) => {
      const card = document.createElement("article");
      card.className = "slide";
      const n = document.createElement("small");
      n.textContent = "Diapositiva " + (i + 1) + " · " + s[0];
      const h = document.createElement("h4");
      h.textContent = s[1];
      const p = document.createElement("p");
      p.textContent = s[2];
      card.append(n, h, p);
      root.append(card);
    });
    $("downloadrow").hidden = false;
  }
  function download() {
    const body = deck
      .map(
        (s, i) =>
          "<article><small>DIAPOSITIVA " +
          (i + 1) +
          " · " +
          esc(s[0]) +
          "</small><h2>" +
          esc(s[1]) +
          "</h2><p>" +
          esc(s[2]).replace(/\n/g, "<br>") +
          "</p></article>",
      )
      .join("");
    const html =
      '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' +
      esc($("title").value) +
      "</title><style>body{margin:0;padding:4vw;background:#edf4f2;color:#173149;font:20px/1.5 system-ui}main{max-width:1000px;margin:auto}article{min-height:70vh;margin:0 0 24px;padding:7vw;display:flex;flex-direction:column;justify-content:center;border-radius:28px;background:white;box-shadow:0 14px 38px #18384a18;break-after:page}small{color:#147d73;font-weight:900;letter-spacing:.12em}h2{font-size:clamp(38px,7vw,76px);line-height:1.05}p{font-size:clamp(24px,4vw,42px);color:#536d7b}@media print{body{padding:0;background:white}article{min-height:95vh;box-shadow:none;margin:0;border:0}}</style><main>" +
      body +
      "</main></html>";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
    a.download =
      ($("title")
        .value.trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "exposicion") + ".html";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  }
  $("builder").addEventListener("submit", (e) => {
    e.preventDefault();
    build();
  });
  $("download").onclick = download;
  $("print").onclick = () => window.print();
})();
