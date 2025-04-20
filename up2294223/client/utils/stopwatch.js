import { formatTime } from "./functions.js";

const time = {
  ms: 0,
  secs: 0,
  mins: 0,
  hours: 0,
};

let interval;

const timer = document.querySelector("#timer");

function updateTimer() {
  if (timer) timer.textContent = formatTime(time);
}

export function setTime() {
  time.ms += 10;
  if (time.ms >= 1000) {
    time.secs++;
    time.ms = 0;
  }
  if (time.secs >= 60) {
    time.mins++;
    time.secs = 0;
  }
  if (time.mins >= 60) {
    time.hours++;
    time.mins = 0;
  }
  updateTimer();
}

export function stopTimer() {
  clearInterval(interval);
}

export function startTimer() {
  clearInterval(interval);
  interval = setInterval(setTime, 10);
}

export function resetTimer() {
  stopTimer();
  time.ms = 0;
  time.mins = 0;
  time.secs = 0;
  time.secs = 0;
  updateTimer();
}

export function saveTime() {
  return time;
}
