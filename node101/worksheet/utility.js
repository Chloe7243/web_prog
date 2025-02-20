/**
 * The subtract function is complete and ready for use.
 */
export function subtract(a, b) {
  return a - b;
}

/**
 * To make the add function available for import to other
 * programs it must be exported, so prepend the word
 * "export" to the function definition (as seen in the
 * subtract example above)
 */
export function add(a, b) {
  return a + b;
}

export function compare(arr1, arr2) {
  let isIdentical = true;
  if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
  const len = arr1.length;
  for (let i = 0; i < len; i++) {
    if (arr1[i] != arr2[i]) {
      isIdentical = false;
      break;
    }
  }
  return isIdentical;
}

export function largest(arr) {
  if (arr && arr.length) {
    const newArr = arr.slice(0);
    newArr.sort((a, b) => a - b);
    return newArr.slice(-1)[0];
  } else return null;
}

export function zeroest(arr) {
  if (arr && arr.length) {
    const newArr = arr.map((val) => (val < 0 ? -val : val));
    newArr.sort((a, b) => a - b);
    return newArr[0];
  } else return null;
}
