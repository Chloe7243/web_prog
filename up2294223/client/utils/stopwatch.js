import { localStorageResults } from "./constants.js";

const localStorageData = JSON.parse(localStorage.getItem(localStorageResults));

const time = localStorageData?.stopwatch || {
  ms: 0,
  secs: 0,
  mins: 0,
  hours: 0,
};

let interval;
let isOn = localStorageData?.isOn;

export function setTime(updateTimer) {
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
  updateTimer(time);
}

export function stopTimer() {
  clearInterval(interval);
}

export function startTimer(update) {
  clearInterval(interval);
  interval = setInterval(() => setTime(update), 10);
}

export function resetTimer(update) {
  stopTimer();
  time.ms = 0;
  time.mins = 0;
  time.secs = 0;
  time.secs = 0;
  update(time);
}

export function saveTime() {
  return time;
}

export function setStopwatchState(value) {
  return (isOn = value);
}

export function getStopwatchState() {
  return isOn;
}
