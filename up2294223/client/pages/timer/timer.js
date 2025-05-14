import { saveResults, uploadTimedResults } from "../../api.js";
import { formatTime, toast } from "../../utils/functions.js";
import { localStorageResults } from "../../utils/constants.js";
import {
  getStopwatchState,
  resetTimer,
  saveTime,
  setStopwatchState,
  startTimer,
  stopTimer,
} from "../../utils/stopwatch.js";
import { handleCloseDialog } from "../../utils/closeDialog.js";

let watchedRunnersData;
let paramsRaceId;
let timerElement;
let isOn;

/**
 * Updates the timer display.
 */
function updateTimer(time) {
  if (timerElement) timerElement.textContent = formatTime(time);
}

/**
 * Initializes the timer page and stopwatch logic.
 */
export const init = () => {
  const buttons = {};
  const dialogs = {};
  const params = new URLSearchParams(window.location.search);
  paramsRaceId = params.get("raceId");

  timerElement = document.querySelector("#timer");
  const raceResults = document.querySelector("results-board");
  const timingRaceId = document.querySelector(".timing-race-id");
  const dialogElements = document.querySelectorAll("dialog[id]");
  const buttonElements = document.querySelectorAll("button[id]");
  const resultButtons = document.querySelector("#result-buttons");

  const localStorageData = JSON.parse(
    localStorage.getItem(localStorageResults)
  );

  if (paramsRaceId) {
    timingRaceId.textContent = `You are currently timing race of Race ID: ${paramsRaceId}`;
  }

  isOn = getStopwatchState() || false;

  const runnersData = [];
  const runnersDataHandler = {
    set(target, property, value) {
      target[property] = value;

      if ((property === "length" && value === 0) || !isNaN(property)) {
        const event = new CustomEvent("show-results", {
          bubbles: true,
          composed: true,
          detail: { runners: target, newValue: value, mode: "no-runner" },
        });
        raceResults.dispatchEvent(event);
      }
      return true;
    },
  };

  watchedRunnersData = new Proxy(runnersData, runnersDataHandler);

  for (const button of buttonElements) {
    buttons[button.id] = button;
  }
  for (const dialog of dialogElements) {
    dialogs[dialog.id] = dialog;
  }

  const confirmationDialogContinue =
    dialogs.confirmationDialog.querySelector("#continueBtn");
  const raceDialogSubmit = dialogs.raceDialog.querySelector("#continueBtn");

  const renderToggleButton = (element) => {
    const textElement = element.querySelector("p");
    const startIcon = element.querySelector(".start-icon");
    const stopIcon = element.querySelector(".stop-icon");
    textElement.textContent = isOn ? "Stop" : "Start";
    element.classList.toggle("stop", isOn);
    element.classList.toggle("start", !isOn);
    buttons.reset.classList.toggle("hidden", isOn);
    stopIcon.classList.toggle("hidden", !isOn);
    startIcon.classList.toggle("hidden", isOn);
  };

  /**
   * Submits timed results to the server.
   */
  async function submitTimedResults(raceId) {
    const data = { runners: runnersData, raceId };

    const onSubmitSuccess = () => {
      toast({
        type: "success",
        message: "Submitted successfully",
      });
      resetTimer(updateTimer);
      dialogs.raceDialog.close();
      clearResults();
      raceIdInput.value = "";
      return;
    };

    const onSubmitFailure = (err) => {
      error.classList.remove("hidden");
      error.textContent = err.error;
    };

    await uploadTimedResults(data, onSubmitSuccess, onSubmitFailure);
  }

  /**
   * Toggles visibility of result buttons based on timer state.
   */
  const showResultsButtons = () => {
    resultButtons.classList.toggle(
      "hidden",
      isOn || !watchedRunnersData.length
    );
  };

  /**
   * Clears all results and resets the timer.
   */
  const clearResults = () => {
    watchedRunnersData.splice(0, watchedRunnersData.length);
    localStorage.removeItem(localStorageResults);
    dialogs.confirmationDialog.close();
    resultButtons.classList.add("hidden");
  };

  buttons.toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    isOn ? stopTimer() : startTimer(updateTimer);
    isOn = setStopwatchState(!isOn);
    renderToggleButton(e.currentTarget);
    showResultsButtons();
  });

  buttons.save.addEventListener("click", () => {
    if (isOn) {
      const time = saveTime();
      watchedRunnersData.push({
        time: formatTime(time),
        position: watchedRunnersData.length + 1,
      });
    } else {
      toast({ message: "Please start the timer" });
    }
  });

  buttons.reset.addEventListener("click", () => {
    if (!isOn) {
      confirmationDialogContinue.addEventListener("click", () => {
        clearResults();
        resetTimer(updateTimer);
      });
      dialogs.confirmationDialog.showModal();
    }
  });

  buttons.submit.addEventListener("click", async (e) => {
    if (isOn) {
      toast({
        type: "warning",
        message: "Can't submit while timer is still running",
      });
      return;
    }

    if (!navigator.onLine) {
      alert("You are offline! Connect to the internet and try again!");
      return;
    }

    if (paramsRaceId) {
      submitTimedResults(paramsRaceId);
    } else {
      dialogs.raceDialog.showModal();
    }
  });

  // Handle Closing dialog
  Object.values(dialogs).forEach((dialog) => {
    handleCloseDialog(dialog, "#cancelBtn");
  });

  const raceIdInput = document.querySelector("#raceId");
  const error = dialogs.raceDialog.querySelector(".error");

  raceIdInput.addEventListener("input", () => {
    error.classList.add("hidden");
  });

  raceDialogSubmit.addEventListener("click", async (e) => {
    const raceId = raceIdInput.value;

    if (!raceId) {
      error.classList.remove("hidden");
      error.textContent = "Race ID is rqeuired";
      return;
    }

    submitTimedResults(raceId);
  });

  document.addEventListener("update-runnerID", ({ detail }) => {
    const updateIndex = watchedRunnersData.findIndex(
      (value) => value.position === detail.key
    );
    if (updateIndex >= 0) {
      watchedRunnersData[updateIndex].id = detail.value;
    }
  });

  setTimeout(() => {
    if (localStorageData) {
      watchedRunnersData.push(...localStorageData?.results);
      showResultsButtons();
      if (localStorageData.isOn) startTimer(updateTimer);
      renderToggleButton(buttons.toggle);
      updateTimer(localStorageData?.stopwatch);
    }
  }, 100);
};

/**
 * Saves timer state and results to localStorage before unload.
 */
export const destroy = () => {
  const currentTime = saveTime();
  if (
    Object.values(currentTime).some((val) => val !== 0) ||
    watchedRunnersData.length
  ) {
    localStorage.setItem(
      localStorageResults,
      JSON.stringify({
        isOn,
        stopwatch: saveTime(),
        results: watchedRunnersData,
      })
    );
  }
};

window.addEventListener("beforeunload", (e) => {
  destroy();
});
