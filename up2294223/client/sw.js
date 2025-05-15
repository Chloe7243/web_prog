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
          "./router.js",
          "./pages/timer/timer.html",
          "./pages/timer/timer.js",
          "./pages/timer/timer.css",
          "./pages/home/home.html",
          "./pages/home/home.js",
          "./pages/home/home.css",
          "./components/runner-row/runner-row.css",
          "./components/shadow-element.mjs",
          "./utils/stopwatch.js",
          "./utils/constants.js",
          "./utils/functions.js",
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
