import { saveResults } from "../../api.js";
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
let timerElement;
let isOn;

function updateTimer(time) {
  if (timerElement) timerElement.textContent = formatTime(time);
}

export const init = () => {
  const buttons = {};
  const dialogs = {};

  timerElement = document.querySelector("#timer");
  const raceResults = document.querySelector("results-board");
  const dialogElements = document.querySelectorAll("dialog[id]");
  const buttonElements = document.querySelectorAll("button[id]");
  const resultButtons = document.querySelector("#result-buttons");

  const localStorageData = JSON.parse(
    localStorage.getItem(localStorageResults)
  );

  isOn = getStopwatchState() || false;

  const runnersData = [];
  const runnersDataHandler = {
    set(target, property, value) {
      target[property] = value;

      if ((property === "length" && value === 0) || !isNaN(property)) {
        const event = new CustomEvent("show-results", {
          bubbles: true,
          composed: true,
          detail: { runners: target, newValue: value },
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
    console.log({ button: isOn });
    const textElement = element.querySelector("p");
    const iconElement = element.querySelector("i");
    textElement.textContent = isOn ? "Stop" : "Start";
    element.classList.toggle("stop", isOn);
    element.classList.toggle("start", !isOn);
    buttons.reset.classList.toggle("hidden", isOn);
    iconElement.classList.toggle("fa-circle-stop", isOn);
    iconElement.classList.toggle("fa-circle-play", !isOn);
  };

  const showResultsButtons = () => {
    resultButtons.classList.toggle(
      "hidden",
      isOn || !watchedRunnersData.length
    );
  };

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
        id: "",
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

    dialogs.raceDialog.showModal();
  });

  // Handle Closing dialog
  Object.values(dialogs).forEach((dialog) => {
    handleCloseDialog(dialog, "#cancelBtn");
  });

  raceDialogSubmit.addEventListener("click", async () => {
    dialogs.raceDialog.close();
    const raceNameInput = document.querySelector("#raceName");
    const raceName = raceNameInput.value;

    const body = JSON.stringify({ runners: runnersData, raceName });

    const onSubmitSuccess = () => {
      toast({
        type: "success",
        message: "Submitted successfully",
      });
      resetTimer();
      clearResults();
      raceNameInput.value = "";
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
      return;
    };

    await saveResults(body, onSubmitSuccess, onSubmitFailure);
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

const params = new URLSearchParams(window.location.search);
const raceId = params.get("raceId");
export const destroy = () => {
  const currentTime = saveTime();
  if (
    raceId &&
    (Object.values(currentTime).some((val) => val !== 0) ||
      watchedRunnersData.length)
  ) {
    localStorage.setItem(
      localStorageResults,
      JSON.stringify({
        raceId,
        isOn,
        stopwatch: saveTime(),
        results: watchedRunnersData,
      })
    );
  }
};

window.addEventListener("beforeunload", (e) => {
  console.log(e);
  destroy();
});
