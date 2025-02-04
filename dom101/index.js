/*
 * This is index.js
 * Open index.html in your browser to check what
 * you have to do, adding functions to the end of this
 * file as necessary.
 *
 * NB: all code you write this year should use strict mode, so
 * we've enabled that by default with the first line of code.
 */

"use strict";

// add your functions here

function replaceText(elem, str) {
  elem.textContent = str;
}

function addTextTo(elem, str) {
  elem.append(str);
}

function moreBears() {
  const animals = document.querySelector("#animals");
  animals.src = "http://placebear.com/400/200";
  animals.alt = "A bear.";
  animals.title = "A BEAR!";
}

function setId(elem, str) {
  elem.id = str;
  return elem;
}

function setClass(elem, str) {
  elem.className = str;
  return elem;
}

function addAClass(elem, str) {
  elem.classList.add(str);
  return elem;
}

function removeAClass(elem, str) {
  elem.classList.remove(str);
  return elem;
}

function newElement(name) {
  return document.createElement(name);
}

function findElementById(id) {
  return document.querySelector(`#${id}`);
}

function findElementsByQuery(query) {
  return document.querySelectorAll(query);
}

function findElementByQuery(query) {
  return document.querySelector(query);
}

function reverseList(query) {
  let i = 1;
  const list = document.querySelector(query);
  const listKids = list.children;
  while (i < listKids.length) {
    list.prepend(listKids[i]);
    i++;
  }
  return list;
}

function mover(moveThis, appendToThis) {
  const parent = findElementByQuery(appendToThis);
  const child = findElementByQuery(moveThis);
  return parent.append(child);
}

function filler(list, candidates) {
  for (let i = 0; i < candidates.length; i++) {
    const listItem = document.createElement("li");
    listItem.textContent = candidates[i];
    list.append(listItem);
  }
}

function dupe(selector) {
  const element = findElementByQuery(selector);
  const parent = element.parentNode;
  parent.append(element.cloneNode(true));
}

function removeAll(selector) {
  const elements = findElementsByQuery(selector);
  elements.forEach((element) => element.remove());
}

function getUserData() {
  const data = {};
  data.name = findElementByQuery("#username").value;
  data.speed = +findElementByQuery("#speed").value;
  data.student = findElementByQuery("#student").checked;
  return data;
}
