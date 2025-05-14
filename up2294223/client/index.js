import {
  localStorageResults,
  localStorageUserID,
  userID,
} from "./utils/constants.js";
import { startTimer } from "./utils/stopwatch.js";

const loadedComponentScripts = new Set();

const loadComponents = async () => {
  const componentFiles = [
    "app-link/app-link.mjs",
    "back-button/back-button.mjs",
    "race-item/race-item.mjs",
    "race-list/race-list.mjs",
    "race-results/race-results.mjs",
    "results-board/results-board.mjs",
    "runner-row/runner-row.mjs",
    "toast-message/toast-message.mjs",
    "conflict-item/conflict-item.mjs",
  ];

  const componentPath = "./components/";
  for (const componentFile of componentFiles) {
    const scriptPath = `${componentPath}${componentFile}`;
    if (!loadedComponentScripts.has(scriptPath)) {
      const script = document.createElement("script");
      script.src = scriptPath;
      script.type = "module";
      document.head.appendChild(script);
    }
  }
};

function init() {
  const isOn = JSON.parse(localStorage.getItem(localStorageResults))?.isOn;
  if (isOn === "true") startTimer();
  loadComponents();
}

window.addEventListener("load", () => {
  init();
});

init();
