async function loadRaceDetails() {
  const pageContent = document.querySelector(".content");
  const raceResults = document.querySelector("results-board");

  const { id } = Object.fromEntries(
    window.location.search
      .slice(1)
      .split(",")
      .map((param) => param.split("="))
  );

  if (!id) {
    pageContent.textContent = "No details found";
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/race-results/${id}`);
    const { data } = await response.json();
    if (response.ok) {
      const event = new CustomEvent("show-results", {
        bubbles: true,
        composed: true,
        detail: {
          mode: "read",
          runners: data.map((item) => ({
            id: item.runner_id,
            time: item.finish_time,
            position: item.position,
          })),
        },
      });

      raceResults.dispatchEvent(event);
    } else {
      throw Error(data.error.message);
    }
  } catch (error) {}
}

window.addEventListener("load", async () => {
  console.log("loaded");

  loadRaceDetails();
});
