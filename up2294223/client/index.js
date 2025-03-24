import { resetTimer, saveTime, startTimer, stopTimer } from "./utils/timer.js";

let isOn = false;
const buttons = {};
const runnersData = [];
const buttonElements = document.querySelectorAll("button[id]");
const resultButtons = document.querySelector("#result-buttons");
const savedTimes = document.querySelector("#saved-times > table > tbody");

for (const button of buttonElements) {
  buttons[button.id] = button;
}

const runnersDataHandler = {
  set(target, property, value) {
    console.log(`Array updated: ${property} = ${value}`);
    target[property] = value;
    // Do something when the array is updated
    console.log("Something happened!");
    console.log({ target, property, value });

    if (!target.length) {
      savedTimes.replaceChildren(...[]);
    } else if (!isNaN(property)) {
      const tableRow = document.createElement("tr");
      const runnerID = document.createElement("td");
      const timeElement = document.createElement("td");
      const positionElement = document.createElement("td");

      timeElement.textContent = value.time;
      positionElement.textContent = value.position;
      const inputElement = document.createElement("input");

      inputElement.addEventListener("change", function (e) {
        const elValue = e.target.value;
        if (!isNaN(property)) {
          target[property] = {
            id: elValue,
            ...value,
          };
        }
      });
      runnerID.appendChild(inputElement);
      tableRow.appendChild(positionElement);
      tableRow.appendChild(timeElement);
      tableRow.appendChild(runnerID);
      savedTimes.appendChild(tableRow);
    }

    return true;
  },
};

const watchedRunnersData = new Proxy(runnersData, runnersDataHandler);

buttons.toggle.addEventListener("click", () => {
  isOn ? stopTimer() : startTimer();
  isOn = !isOn;
});

buttons.save.addEventListener("click", () => {
  if (isOn) {
    const time = saveTime();
    watchedRunnersData.push({
      id: "",
      time: Object.values(time)
        .reverse()
        .map((value, idx) =>
          value.toString().padStart(idx === 3 ? "3" : "2", "0")
        )
        .join(":"),
      position: watchedRunnersData.length + 1,
    });
    if (watchedRunnersData.length >= 1) {
      resultButtons.classList.remove("hidden");
    }
  } else {
    console.log("Start timer");
  }
});

buttons.reset.addEventListener("click", resetTimer);

buttons.clear.addEventListener("click", () => {
  watchedRunnersData.splice(0, watchedRunnersData.length);
});
