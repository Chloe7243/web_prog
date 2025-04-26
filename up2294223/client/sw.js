self.addEventListener("install", (e) => {
  console.log("Install");
  e.waitUntil(
    caches
      .open("static")
      .then((cache) => {
        console.log(cache);
        return cache.addAll(["./", "./styles.css", "./logos/logo192.png"]);
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
