let raceDetailRunners = [];

const IdInput = document.querySelector("input.id");
const raceResults = document.querySelector("results-board");
const positionInput = document.querySelector("input.position");

const filter = {
  position: "",
  ID: "",
};

function renderDetails(runners) {
  const event = new CustomEvent("show-results", {
    bubbles: true,
    composed: true,
    detail: {
      mode: "read",
      runners: runners.map((item) => ({
        id: item.runner_id,
        time: item.finish_time,
        position: item.position,
      })),
    },
  });

  raceResults.dispatchEvent(event);
}

const filterChangeHandler = {
  set(target, property, value) {
    target[property] = value;

    const filteredDetails = raceDetailRunners.filter((item) => {
      if (!target.position && !target.ID) return true;
      let isPosition = false;
      let isRunner = false;
      if (target.position) isPosition = +item.position === +target.position;
      if (target.ID)
        isRunner = String(item.runner_id)
          .toLowerCase()
          .includes(target.ID.trim().toLowerCase());

      return isPosition || isRunner;
    });
    renderDetails(filteredDetails);
    return true;
  },
};

const watchedFilter = new Proxy(filter, filterChangeHandler);

positionInput.addEventListener("input", (e) => {
  const max = positionInput.getAttribute("max");
  const parsedValue = e.target.value.replace("-", "");
  const newValue = +parsedValue > +max ? "" : parsedValue;
  watchedFilter.position = newValue;
  e.target.value = newValue;
  IdInput.value = "";
  watchedFilter.ID = "";
});

IdInput.addEventListener("input", (e) => {
  const newValue = e.target.value;
  watchedFilter.ID = newValue;
  positionInput.value = "";
  watchedFilter.position = "";
});

async function loadRaceDetails() {
  const pageContent = document.querySelector(".content");
  const raceName = document.querySelector(".race-name > span");

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
      raceName.textContent =
        data.raceDetails.race_name || `Race#${data.raceDetails.race_id}`;
      raceDetailRunners = data.runners;
      positionInput.setAttribute("max", data.runners.length);
      renderDetails(data.runners);
    } else {
      throw Error(data.error.message);
    }
  } catch (error) {}
}

window.addEventListener("load", async () => {
  loadRaceDetails();
});
