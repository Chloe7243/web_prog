import { submitResults } from "../../api.js";
import { formatTime, toast } from "../../utils/functions.js";
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
const dialog = document.getElementById("raceDialog");
const dialogCancel = document.getElementById("cancelBtn");
const dialogSubmit = document.getElementById("submitBtn");

const toaster = document.querySelector("toast-message");
const raceResults = document.querySelector("results-board");
const buttonElements = document.querySelectorAll("button[id]");
const resultButtons = document.querySelector("#result-buttons");

const runnersData = [];
const resultsValue = JSON.parse(localStorage.getItem(localStorageResults));

for (const button of buttonElements) {
  buttons[button.id] = button;
}

const runnersDataHandler = {
  set(target, property, value) {
    target[property] = value;
    const timeToMillis = (timeStr) => {
      const [h, m, s] = timeStr.split(":");
      const [sec, ms] = s.split(".");
      return (
        parseInt(h) * 3600000 +
        parseInt(m) * 60000 +
        parseInt(sec) * 1000 +
        parseInt(ms)
      );
    };

    target.sort((a, b) => timeToMillis(a.time) - timeToMillis(b.time));

    target.forEach((runner, index) => {
      runner.position = index + 1;
    });

    const event = new CustomEvent("show-results", {
      bubbles: true,
      composed: true,
      detail: { runners: target },
    });

    resultButtons.classList.toggle("hidden", !target.length);

    raceResults.dispatchEvent(event);
    return true;
  },
};

const watchedRunnersData = new Proxy(runnersData, runnersDataHandler);

const clearResults = () => {
  watchedRunnersData.splice(0, watchedRunnersData.length);
  localStorage.removeItem(localStorageResults);
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
});

buttons.save.addEventListener("click", () => {
  if (isOn) {
    const time = saveTime();
    watchedRunnersData.push({
      id: "",
      time: formatTime(time),
      position: "",
    });
  } else {
    toast({ message: "Please start the timer", toasterElement: toaster });
  }
});

buttons.reset.addEventListener("click", () => {
  if (!isOn) resetTimer();
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

  dialog.showModal();
});

dialogCancel.addEventListener("click", () => {
  dialog.close();
});

dialogSubmit.addEventListener("click", async () => {
  dialog.close();
  const raceNameInput = document.getElementById("raceName");
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

buttons.clear.addEventListener("click", clearResults);

document.addEventListener("update-runnerID", ({ detail }) => {
  const updateIndex = watchedRunnersData.findIndex(
    (value) => value.position === detail.key
  );

  if (updateIndex >= 0) {
    watchedRunnersData[updateIndex] = {
      ...watchedRunnersData[updateIndex],
      id: detail.value,
    };
  }
});

window.addEventListener("load", async () => {
  setTimeout(() => {
    if (resultsValue) {
      watchedRunnersData.push(...resultsValue);
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
