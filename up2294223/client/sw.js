self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open("static")
      .then((cache) => {
        return cache.addAll([
          "./",
          "./manifest.json",
          "./index.html",
          "./index.js",
          "./components/runner-row/runner-row.html",
          "./components/runner-row/runner-row.mjs",
          "./pages/timer",
          "./pages/timer/timer.html",
          "./pages/timer/timer.js",
          "./styles.css",
          "./images/logo.png",
        ]);
      })
      .catch((err) => console.error("Caching failed:", err))
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
