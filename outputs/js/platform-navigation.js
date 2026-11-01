// Menú compartido: navegación táctil, teclado y diseño móvil de páginas normales.
const isGamePage = /(?:^|\/)juegos(?:\/|$)/i.test(location.pathname);
if (!isGamePage) document.documentElement.classList.add("platform-page");

document.addEventListener("DOMContentLoaded", () => {
  const mobileBreakpoint = 1024;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-mobile-toggle");
  const nav = header?.querySelector(".site-nav-menu");
  const dropdowns = [...document.querySelectorAll(".nav-dropdown")];
  if (!header || !toggle || !nav) return;

  if (!nav.id) nav.id = "site-navigation";
  toggle.setAttribute("aria-controls", nav.id);

  let backdrop = document.querySelector(".site-nav-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "site-nav-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(backdrop);
  }

  const isMobileMenu = () => window.matchMedia(`(max-width: ${mobileBreakpoint}px)`).matches;

  const setDropdownState = (dropdown, expanded) => {
    dropdown.classList.toggle("open", expanded);
    const button = dropdown.querySelector(".dropdown-toggle");
    const menu = dropdown.querySelector(".dropdown-menu");
    if (button) button.setAttribute("aria-expanded", String(expanded));
    if (button && menu) {
      if (!menu.id) menu.id = `nav-dropdown-${dropdowns.indexOf(dropdown) + 1}`;
      button.setAttribute("aria-controls", menu.id);
    }
  };

  const closeDropdowns = () => dropdowns.forEach((dropdown) => setDropdownState(dropdown, false));

  const closeMenu = (restoreFocus = false) => {
    header.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú de navegación");
    backdrop.classList.remove("active");
    document.body.classList.remove("nav-locked");
    closeDropdowns();
    if (restoreFocus) toggle.focus();
  };

  const openMenu = () => {
    header.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Cerrar menú de navegación");
    backdrop.classList.add("active");
    document.body.classList.add("nav-locked");
  };

  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector(".dropdown-toggle");
    if (!button) return;
    if (!button.hasAttribute("aria-expanded")) button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", (event) => {
      if (!isMobileMenu()) return;
      event.preventDefault();
      event.stopPropagation();
      const wasOpen = dropdown.classList.contains("open");
      closeDropdowns();
      if (!wasOpen) setDropdownState(dropdown, true);
    });
  });

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    header.classList.contains("menu-open") ? closeMenu() : openMenu();
  });

  backdrop.addEventListener("click", () => closeMenu(true));

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (isMobileMenu()) closeMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("menu-open")) closeMenu(true);
  });

  const desktopQuery = window.matchMedia(`(min-width: ${mobileBreakpoint + 1}px)`);
  const closeOnDesktop = (event) => {
    if (event.matches) closeMenu();
  };
  if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", closeOnDesktop);
  else desktopQuery.addListener(closeOnDesktop);
});
