import { localStorageResults } from "../../utils/constants.js";

const newTimer = document.querySelector(".timer.new");
const existingTimer = document.querySelector(".timer.existing");
const createRaceDialog = document.querySelector("dialog#createRace");

console.log(newTimer);

const storageResults = JSON.parse(localStorage.getItem(localStorageResults));
const resultsIsObject =
  typeof storageResults === "object" &&
  storageResults !== null &&
  !Array.isArray(storageResults);

newTimer.addEventListener("click", (e) => {
  e.preventDefault();
  createRaceDialog.showModal();
  console.log("CLICK", e);
});

// raceDialogSubmit.addEventListener("click", async () => {
//   dialogs.raceDialog.close();
//   const raceNameInput = document.querySelector("#raceName");
//   const raceName = raceNameInput.value;

//   const body = JSON.stringify({ runners: runnersData, raceName });

//   const onSubmitSuccess = () => {
//     toast({
//       type: "success",
//       message: "Submitted successfully",
//       toasterElement: toaster,
//     });
//     resetTimer();
//     clearResults();
//     raceNameInput.value = "";
//     return;
//   };

//   const onSubmitFailure = (err) => {
//     toast({
//       type: "error",
//       title: err.error,
//       message:
//         err.messages[0] || "Couldn't submit results! Please, try again later.",
//       toasterElement: toaster,
//     });
//     return;
//   };

//   await submitResults(body, onSubmitSuccess, onSubmitFailure);
// });

document.addEventListener("DOMContentLoaded", () => {
  existingTimer.classList.toggle("hidden", resultsIsObject);
});
