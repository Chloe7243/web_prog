import { getTimeSubmissions, saveResults, viewRaceResults } from "../../api.js";
import { handleChangeRoute } from "../../router.js";
import { timeToMillis, toast } from "../../utils/functions.js";

let runners = [];
let conflicts = [];

const params = new URLSearchParams(window.location.search);
const raceId = params.get("raceId");

/**
 * Initializes the manage race page, loads race details and handles conflicts.
 */
export async function init() {
  const raceResults = document.querySelector("results-board");
  const finalizeButton = document.querySelector(".actions .finalize");
  const emptyResults = document.querySelector(".empty");
  const conflictsCount = document.querySelector(
    ".conflict-section .section-header .count"
  );
  const conflictsContainer = document.querySelector(".conflict-list");

  /**
   * Renders the race details on the page.
   */
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

  /**
   * Renders the list of conflicts on the page.
   */
  function renderConflicts() {
    conflictsCount.textContent = conflicts.length;
    conflicts.forEach((conflict) => {
      const item = document.createElement("conflict-item");
      item["position"] = conflict.position;
      item["times"] = conflict.times;
      conflictsContainer.append(item);
    });
  }

  /**
   * Loads race details and updates the page accordingly.
   */
  async function loadRaceDetails() {
    const raceName = document.querySelector(".container > header .race-name");

    if (!raceId) {
      handleChangeRoute("404");
    }

    await viewRaceResults(
      raceId,
      ({ data }) => {
        if (data.raceDetails.status !== "ongoing") {
          handleChangeRoute(`404`);
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

  /**
   * Loads race timers and resolves conflicts.
   */
  async function loadRaceTimers() {
    await getTimeSubmissions(
      raceId,
      (data) => {
        runners = data.results.map((item) => ({
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

        setTimeout(() => {
          renderDetails();
          renderConflicts();
        }, 200);
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

    // Remove any existing runner at the same position (if necessary)
    runners = runners.filter((runner) => runner.position !== position);

    // Add the confirmed result
    runners.push({
      id: "", // You can set a proper ID if needed later
      time: time,
      position: position,
    });

    // Sort runners by time
    runners.sort((a, b) => timeToMillis(a.time) - timeToMillis(b.time));

    if (!conflicts.length) {
      // // Update positions after sorting
      // runners.forEach((runner, index) => {
      //   runner.position = index + 1;
      // });
    }

    renderDetails();
    conflictsCount.textContent = conflicts.length;
  });

  /**
   * Finalizes the race results and submits them.
   */
  finalizeButton.addEventListener("click", async () => {
    if (conflicts.length) {
      toast({
        title: "Couldn't submit result",
        message: `You have ${conflicts.length} conflicts left to resolve`,
        type: "error",
      });
      return;
    }

    if (!raceId) {
      toast({
        title: "Couldn't submit result",
        message: "Race ID is required",
        type: "error",
      });
      return;
    }

    const data = { runners, raceId };

    if (!data.runners.every((item) => !!item.id)) {
      toast({
        title: "Couldn't submit result",
        message: "Runner Id's must not be empty",
        type: "error",
      });
      return;
    }

    const onSubmitSuccess = () => {
      toast({
        type: "success",
        message: "Race finalized successfully",
      });
      handleChangeRoute(`/race-details?raceId=${raceId}`);
      return;
    };

    const onSubmitFailure = (err) => {
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

  /**
   * Updates the runner ID for a specific position.
   */
  document.addEventListener("update-runnerID", ({ detail }) => {
    const updateIndex = runners.findIndex(
      (value) => value.position === detail.key
    );
    if (updateIndex >= 0) {
      runners[updateIndex].id = detail.value;
    }
  });

  await loadRaceTimers();
  await loadRaceDetails();
}
