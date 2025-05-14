// Route map
const routes = {
  "/": { name: "home", path: "/pages/home/home" },
  "/races": { name: "races", path: "/pages/races/races" },
  "/timer": { name: "timer", path: "/pages/timer/timer" },
  "/manage-race": {
    name: "manage-race",
    path: "/pages/manage-race/manage-race",
  },
  "/race-details": {
    name: "race-details",
    path: "/pages/race-details/race-details",
  },
};

const notFoundRoute = { name: "error", path: "/pages/error/error" };

let currentModule = null;

async function loadPageContent() {
  const pathname = window.location.pathname;
  const route = routes[pathname] || notFoundRoute;
  const base = route.path;

  try {
    // Load HTML
    const html = await fetchHtml(`${base}.html`);
    const container = document.getElementById("main-page");
    if (!container) throw new Error("Missing #main-page container");

    const doc = new DOMParser().parseFromString(html, "text/html");
    const content = Array.from(doc.body.children);

    // Scroll to top
    window.scrollTo(0, 0);
    // Load and apply stylesheet
    await loadStylesheet(`${base}.css`);

    // Cleanup previous module
    if (currentModule?.destroy) currentModule.destroy();

    container.replaceChildren(...content);

    // Load new JS module
    if (route.name !== "error") {
      const module = await import(`${base}.js`);
      if (module?.init) module.init();
      currentModule = module;
    }
  } catch (err) {
    console.error("Navigation error:", err);
    // showErrorFallback();
  }
}

function showErrorFallback() {
  const container = document.getElementById("main-page");
  if (container) {
    container.innerHTML = `
      <div style="padding:2rem;text-align:center;">
        <h2>Oops! Something went wrong.</h2>
        <p>Please try refreshing or going back to the <a href="/">home page</a>.</p>
      </div>
    `;
  }
}

// Load and replace route-specific CSS
async function loadStylesheet(href) {
  const oldLink = document.querySelector("link[data-route-style]");
  if (oldLink) oldLink.remove();

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.setAttribute("data-route-style", "");
  document.head.appendChild(link);
}

async function fetchHtml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  const text = await res.text();
  return text;
}

// Intercepts link navigation
export function handleNavigation(event) {
  const anchor = event.target.closest("a");

  // Conditions to ignore SPA routing
  if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download"))
    return;

  const url = new URL(anchor.href);
  if (url.origin !== location.origin) return;

  event.preventDefault();
  if (url.pathname !== window.location.pathname) {
    window.history.pushState({}, "", url.pathname);
    loadPageContent();
  }
}

// Manually change route eg. on click of a button
export function handleChangeRoute(to) {
  const url = typeof to === "string" ? new URL(to, window.location.origin) : to;
  const current = window.location.pathname + window.location.search;
  const target = url.pathname + url.search;

  if (target !== current) {
    window.history.pushState({}, "", url.href);
    loadPageContent();
  }
}

// Link click handler
document.addEventListener("click", handleNavigation);

// Handle browser back/forward
window.addEventListener("popstate", loadPageContent);

// Initial load
window.addEventListener("DOMContentLoaded", loadPageContent);
