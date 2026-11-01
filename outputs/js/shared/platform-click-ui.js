const counterButton = document.querySelector("[data-click-counter]");
const counterLabel = document.querySelector("[data-click-count]");

if (counterButton && counterLabel) {
  let savedTotal = 0;
  let initialTotal = null;
  let pageClicks = 0;
  let nextClickId = 0;
  window.platformCounterQueue = window.platformCounterQueue || [];

  const renderTotal = () => {
    const localTotal = (initialTotal ?? 0) + pageClicks;
    const total = Math.max(savedTotal, localTotal);
    counterLabel.textContent = `${new Intl.NumberFormat("es-CO").format(total)} ${total === 1 ? "clic" : "clics"}`;
  };
  renderTotal();

  counterButton.addEventListener("click", () => {
    counterButton.classList.remove("is-clicked");
    void counterButton.offsetWidth;
    counterButton.classList.add("is-clicked");
    window.setTimeout(() => counterButton.classList.remove("is-clicked"), 420);

    const clickId = ++nextClickId;
    pageClicks += 1;
    renderTotal();
    const click = { clickId };
    if (window.platformCounterReady)
      window.dispatchEvent(new CustomEvent("platform-counter:click", { detail: click }));
    else window.platformCounterQueue.push(click);
  });

  window.addEventListener("platform-counter:sync", (event) => {
    const { count } = event.detail;
    if (Number.isSafeInteger(count) && count >= 0) savedTotal = Math.max(savedTotal, count);
    renderTotal();
  });

  window.addEventListener("platform-counter:remote", (event) => {
    if (Number.isSafeInteger(event.detail.count) && event.detail.count >= 0) {
      window.platformCounterConnected = true;
      savedTotal = event.detail.count;
      if (initialTotal === null)
        initialTotal = Math.max(0, event.detail.count - pageClicks);
      renderTotal();
    }
  });
}
