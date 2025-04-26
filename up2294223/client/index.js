if ("serviceWorker" in navigator) {
  try {
    navigator.serviceWorker.register("./sw.js");
  } catch (error) {
    console.error("Caching failed:", error);
  }
} else {
}
