import { getTimeSubmissions, saveResults, viewRaceResults } from "../../api.js";
import { handleChangeRoute } from "../../router.js";
import { toast } from "../../utils/functions.js";

let runners = [];
let conflicts = [];

const RUNNERS_KEY = "race-runners";
const CONFLICTS_KEY = "race-conflicts";

function saveState() {
  localStorage.setItem(RUNNERS_KEY, JSON.stringify(runners));
  localStorage.setItem(CONFLICTS_KEY, JSON.stringify(conflicts));
}

export async function init() {
  const params = new URLSearchParams(window.location.search);
  const raceId = params.get("raceId");

  const raceResults = document.querySelector("results-board");
  const finalizeButton = document.querySelector(".actions .finalize");
  const emptyResults = document.querySelector(".empty");
  const conflictsCount = document.querySelector(
    ".conflict-section .section-header .count"
  );
  const conflictsContainer = document.querySelector(".conflict-list");

  function loadStateFromStorage() {
    const savedRunners = localStorage.getItem(RUNNERS_KEY);
    const savedConflicts = localStorage.getItem(CONFLICTS_KEY);

    if (savedRunners && savedConflicts) {
      try {
        runners = JSON.parse(savedRunners);
        conflicts = JSON.parse(savedConflicts);
        return true;
      } catch (e) {
        console.warn("Failed to parse localStorage state:", e);
      }
    }
    return false;
  }

  function renderDetails() {
    const event = new CustomEvent("show-bulk-results", {
      bubbles: true,
      composed: true,
      detail: {
        mode: "edit",
        runners: runners.map((item) => ({
          id: item.id,
          time: item.time,
          position: item.position,
        })),
      },
    });

    raceResults.dispatchEvent(event);
    raceResults.classList.toggle("hidden", !runners.length);
    emptyResults.classList.toggle("hidden", runners.length);
  }

  function renderConflicts() {
    conflictsCount.textContent = conflicts.length;
    conflicts.forEach((conflict) => {
      const item = document.createElement("conflict-item");
      item["position"] = conflict.position;
      item["times"] = conflict.times;
      conflictsContainer.append(item);
    });
  }

  async function loadRaceDetails() {
    const pageContent = document.querySelector(".container");
    const raceName = document.querySelector("header > .race-name");

    if (!raceId) {
      pageContent.textContent = "No details found";
      return;
    }

    await viewRaceResults(
      raceId,
      ({ data }) => {
        console.log({ data });

        if (data.raceDetails.status !== "ongoing") {
          handleChangeRoute(`/race-details?raceId=${data.raceDetails.race_id}`);
          return;
        }
        raceName.textContent =
          data.raceDetails.race_name || `Race#${data.raceDetails.race_id}`;
      },
      () => {
        handleChangeRoute("404");
      }
    );
  }

  async function loadRaceTimers() {
    await getTimeSubmissions(
      raceId,
      (data) => {
        runners = data.duplicates.map((item) => ({
          id: "",
          time: item.time,
          position: item.position,
        }));

        conflicts = data?.conflicts.map((item) => ({
          ...item,
          times: data.allSubmissions
            .filter((time) => time.position === item.position)
            .map((submission) => submission.time),
        }));

        renderDetails();
        renderConflicts();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // Handle time-confirmed events from conflict-item element
  document.addEventListener("time-confirmed", (e) => {
    const { time, position } = e.detail;

    // Remove from conflicts
    conflicts = conflicts.filter((conflict) => conflict.position !== position);

    // Add to runners
    runners.splice(position - 1, 0, {
      id: "",
      time: time,
      position,
    });

    saveState();
    renderDetails();
    conflictsCount.textContent = conflicts.length;
  });

  finalizeButton.addEventListener("click", async () => {
    if (!raceId) {
      toast({
        title: "Couldn't submit result",
        message: "Race Id must be a valid Id",
        type: "Error",
      });
    }

    const data = { runners, raceId };

    const onSubmitSuccess = () => {
      toast({
        type: "success",
        message: "Race finalized successfully",
      });
      handleChangeRoute(`/race-details/${raceId}`);
      return;
    };

    const onSubmitFailure = (err) => {
      console.log({ err });

      toast({
        type: "error",
        title: err.error,
        message:
          err.messages[0] ||
          "Couldn't submit results! Please, try again later.",
      });
    };

    await saveResults(data, onSubmitSuccess, onSubmitFailure);
  });

  document.addEventListener("update-runnerID", ({ detail }) => {
    const updateIndex = runners.findIndex(
      (value) => value.position === detail.key
    );
    if (updateIndex >= 0) {
      runners[updateIndex].id = detail.value;
    }
    saveState();
  });

  const restored = loadStateFromStorage();
  if (restored) {
    setTimeout(() => {
      renderDetails();
    }, 200);
    renderConflicts();
  } else {
    await loadRaceTimers();
  }
  loadRaceDetails();
}
