/*
 * This is index.js
 *
 * Start by modifying the id, fn and sn functions to return
 * information about you, then open index.html to check what
 * else you have to do, adding functions to the end of this
 * file as necessary.
 *
 * NB: all code you write this year should use strict mode, so
 * we've enabled that by default with the first line of code.
 */

"use strict";

function id() {
  // e.g. return "UP654321";
  return "UP2294223";
}

function fn() {
  return "Stephanie";
}

function sn() {
  return "Oluoha";
}

function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function checkObject(obj) {
  obj["checked"] = true;
}

function checkObjectInside(obj) {
  const data = obj?.data;
  if (typeof data === "object") {
    checkObject(data);
  }
}

function arraySet(arr, i, n) {
  if (arr.length > i && typeof i === "number" && !i.toString().includes(".")) {
    arr[i] = n;
  }
}

function addAll(arr) {
  return arr.reduce((total, val) => (total += val), 0);
}

function larger(a, b) {
  return a < b ? b : a;
}

function largest(arr) {
  if (arr && arr.length) {
    const newArr = arr.slice(0);
    newArr.sort((a, b) => a - b);
    return newArr.slice(-1)[0];
  } else return null;
}

function compare(a, b) {
  let isIdentical = false;
  if (a.length !== b.length) return isIdentical;
  for (let i = 0; i <= a.length; i++) {
    if (a[i] !== b[i]) {
      isIdentical = false;
      break;
    }
    isIdentical = true;
  }
  return isIdentical;
}

function addToAll(arr, n) {
  arr.forEach((_, i) => (arr[i] += n));
  return arr;
}

let remembered;
function rememberThis(keepsake) {
  remembered = keepsake;
}

function nArray(n) {
  return Array.from({ length: n }).map((_, i) => i + 1);
}

function addAllOpt(arr) {
  if (!arr || !arr.length) return 0;
  return (arr[0] += addAllOpt(arr.slice(1)));
}

function divisors(arr, div) {
  return arr.filter((val) => val % div === 0);
}

function multiples(n, m) {
  return nArray(n).map((val) => val * m);
}
