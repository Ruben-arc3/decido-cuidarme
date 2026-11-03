(() => {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const targets = document.querySelectorAll(
    ".campaign-detail main.page-shell .campaign-story-banner, " +
      ".campaign-detail main.page-shell .learning-card, " +
      ".campaign-detail main.page-shell .response, " +
      ".campaign-detail main.page-shell .resources, " +
      ".campaign-detail main.page-shell .videos-section, " +
      ".campaign-detail main.page-shell .campaign-games, " +
      ".campaign-detail main.page-shell .quick-nav"
  );

  if (!targets.length) return;

  const cardGroups = new Map();
  targets.forEach((element) => {
    element.classList.add("motion-reveal");
    if (!element.matches(".learning-card")) return;
    const group = element.parentElement;
    const index = cardGroups.get(group) ?? 0;
    cardGroups.set(group, index + 1);
    element.style.setProperty("--motion-delay", `${index * 90}ms`);
  });

  document.documentElement.classList.add("campaign-scroll-motion");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  targets.forEach((element) => observer.observe(element));
})();
