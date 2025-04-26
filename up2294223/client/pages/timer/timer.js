import { submitResults } from "../../api.js";
import { formatTime, timeToMillis, toast } from "../../utils/functions.js";
import {
  localStorageResults,
  localStorageStopwatch,
} from "../../utils/constants.js";
import {
  resetTimer,
  saveTime,
  startTimer,
  stopTimer,
} from "../../utils/stopwatch.js";

let isOn = false;
const buttons = {};
const dialogs = {};

const toaster = document.querySelector("toast-message");
const raceResults = document.querySelector("results-board");
const dialogElements = document.querySelectorAll("dialog[id]");
const buttonElements = document.querySelectorAll("button[id]");
const resultButtons = document.querySelector("#result-buttons");

const runnersData = [];
const resultsValue = JSON.parse(localStorage.getItem(localStorageResults));

for (const button of buttonElements) {
  buttons[button.id] = button;
}

for (const dialog of dialogElements) {
  dialogs[dialog.id] = dialog;
}

const confirmationDialogContinue =
  dialogs.confirmationDialog.querySelector("#continueBtn");
const raceDialogSubmit = dialogs.raceDialog.querySelector("#continueBtn");

const runnersDataHandler = {
  set(target, property, value, j, t) {
    target[property] = value;

    /*
      Temporal solution to duplication issue
    */
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

const watchedRunnersData = new Proxy(runnersData, runnersDataHandler);

const showResultsButtons = () => {
  resultButtons.classList.toggle("hidden", isOn || !watchedRunnersData.length);
};

const clearResults = () => {
  watchedRunnersData.splice(0, watchedRunnersData.length);
  localStorage.removeItem(localStorageResults);
  dialogs.confirmationDialog.close();
  resultButtons.classList.add("hidden");
};

buttons.toggle.addEventListener("click", (e) => {
  e.stopPropagation();
  isOn ? stopTimer() : startTimer();
  const element = e.currentTarget;
  const textElement = element.querySelector("p");
  const iconElement = element.querySelector("i");
  textElement.textContent = isOn ? "Start" : "Stop";
  element.classList.toggle("stop", !isOn);
  element.classList.toggle("start", isOn);
  buttons.reset.classList.toggle("hidden", !isOn);
  iconElement.classList.toggle("fa-circle-stop", !isOn);
  iconElement.classList.toggle("fa-circle-play", isOn);
  isOn = !isOn;
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
    toast({ message: "Please start the timer", toasterElement: toaster });
  }
});

buttons.reset.addEventListener("click", () => {
  if (!isOn) {
    confirmationDialogContinue.addEventListener("click", () => {
      clearResults();
      resetTimer();
    });
    dialogs.confirmationDialog.showModal();
  }
});

buttons.submit.addEventListener("click", async (e) => {
  if (isOn) {
    toast({
      type: "warning",
      message: "Can't submit while timer is still running",
      toasterElement: toaster,
    });
    return;
  }

  if (!navigator.onLine) {
    alert("You are offline! Connect to the internet and try again!");
    return;
  }

  dialogs.raceDialog.showModal();
});

Object.values(dialogs).forEach((dialog) => {
  dialog.querySelector("#cancelBtn").addEventListener("click", () => {
    dialog.close();
  });
  dialog.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      const dialogBox = e.target.getBoundingClientRect();
      if (
        dialogBox.left > e.clientX ||
        dialogBox.right < e.clientX ||
        dialogBox.top > e.clientY ||
        dialogBox.bottom < e.clientY
      ) {
        dialog.close();
      }
    }
  });
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
      toasterElement: toaster,
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
        err.messages[0] || "Couldn't submit results! Please, try again later.",
      toasterElement: toaster,
    });
    return;
  };

  await submitResults(body, onSubmitSuccess, onSubmitFailure);
});

document.addEventListener("update-runnerID", ({ detail }) => {
  const updateIndex = watchedRunnersData.findIndex(
    (value) => value.position === detail.key
  );
  if (updateIndex >= 0) {
    watchedRunnersData[updateIndex].id = detail.value;
  }
});

window.addEventListener("load", () => {
  alert("Remember to turn on airplane mode to avoid disruptions during timing");
  setTimeout(() => {
    if (resultsValue) {
      watchedRunnersData.push(...resultsValue);
      showResultsButtons();
    }
  }, 100);
});

window.addEventListener("beforeunload", (e) => {
  try {
    localStorage.setItem(
      localStorageResults,
      JSON.stringify(watchedRunnersData)
    );
  } catch (err) {}
});
