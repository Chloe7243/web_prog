"use strict";
/**
 * Add your functions here...
 */

function targetTextToConsole(event) {
  console.log(event.target.textContent);
}

function tttcAttacher() {
  const button0 = document.querySelector("#button0");
  button0.addEventListener("click", targetTextToConsole);
}

function lovelyParaAttacher() {
  const paragraph = document.querySelector("#thisisalovelyparagraph");
  paragraph.addEventListener("click", lovelyToggle);
}

function lovelyButtonAttacher() {
  const button1 = document.querySelector("#button1");
  button1.addEventListener("click", lovelyToggle);
}

function concatAttacher() {
  const out1 = document.querySelector("#out1");
  let value1 = "";
  let value2 = "";

  const setValue = (event) => {
    if (event.target.id === "in1") value1 = event.target.value;
    if (event.target.id === "in2") value2 = event.target.value;
    out1.textContent = `${value1}${value2}`;
  };

  document.querySelector("#in1").addEventListener("change", setValue);
  document.querySelector("#in2").addEventListener("change", setValue);
}

function snitchAttacher() {
  const mousewatcher = document.querySelector("#mousewatcher");
  mousewatcher.addEventListener("mouseover", snitchUpdater);
  mousewatcher.addEventListener("mouseout", snitchUpdater);
}

function snitchAttacher() {
  const mousewatcher = document.querySelector("#mousewatcher");
  mousewatcher.addEventListener("mouseover", snitchUpdater);
  mousewatcher.addEventListener("mouseout", snitchUpdater);
}

function reportAttacher() {
  const mousereporter = document.querySelector("#mousereporter");
  mousereporter.addEventListener("mousemove", reportUpdater);
}

function idValidationAttacher() {
  const input = document.querySelector("#newid");
  input.addEventListener("input", (e) => {
    const value = e.target.value;
    input.classList.toggle("invalid", value.includes(" "));
  });
}
