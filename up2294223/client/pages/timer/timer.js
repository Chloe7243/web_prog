import { submitResults } from "../../api.js";
import { formatTime } from "../../utils/functions.js";
import {
  resetTimer,
  saveTime,
  startTimer,
  stopTimer,
} from "../../utils/stopwatch.js";

let isOn = false;
const buttons = {};
const runnersData = [];
const buttonElements = document.querySelectorAll("button[id]");
const resultButtons = document.querySelector("#result-buttons");
const raceResults = document.querySelector("results-board");

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
    alert("Start timer");
  }
});

buttons.reset.addEventListener("click", () => {
  if (!isOn) resetTimer();
});

buttons.submit.addEventListener("click", async () => {
  const body = JSON.stringify({ runners: runnersData });
  const response = await submitResults(body);
});

buttons.clear.addEventListener("click", () => {
  watchedRunnersData.splice(0, watchedRunnersData.length);
});

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
