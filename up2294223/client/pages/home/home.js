import { createRace } from "../../api.js";
import { handleChangeRoute } from "../../router.js";
import { handleCloseDialog } from "../../utils/closeDialog.js";
import { localStorageResults, userID } from "../../utils/constants.js";
import { toast } from "../../utils/functions.js";

export function init() {
  let getIdDialogTrigger = null;

  const newTimer = document.querySelector(".timer.new");
  const manageRaces = document.querySelector(".history");
  const spectateButton = document.querySelector(".spectate");
  const existingTimer = document.querySelector(".timer.existing");
  const getRaceIdDialog = document.querySelector("dialog#getRaceId");
  const createRaceDialog = document.querySelector("dialog#createRace");
  const confirmationDialog = document.querySelector("dialog#confirmAction");

  const storageResults = JSON.parse(localStorage.getItem(localStorageResults));
  const resultsIsObject =
    typeof storageResults === "object" &&
    storageResults !== null &&
    !Array.isArray(storageResults);

  const resetTrigger = () => {
    getIdDialogTrigger = null;
  };

  newTimer.addEventListener("click", (e) => {
    e.preventDefault();
    createRaceDialog.showModal();
    // if (storageResults) {
    //   confirmationDialog.showModal();
    // } else {
    // }
  });

  existingTimer.addEventListener("click", (e) => {
    e.preventDefault();
    handleChangeRoute(`/timer`);
  });

  manageRaces.addEventListener("click", (e) => {
    e.preventDefault();
    handleChangeRoute(`/races?userId=${userID}`);
  });

  spectateButton.addEventListener("click", (e) => {
    e.preventDefault();
    getRaceIdDialog.showModal();
    getIdDialogTrigger = "spectate";
  });

  confirmationDialog
    .querySelector("#continueBtn")
    .addEventListener("click", () => {
      localStorage.removeItem(localStorageResults);
      confirmationDialog.close();
      createRaceDialog.showModal();
    });

  getRaceIdDialog
    .querySelector("#continueBtn")
    .addEventListener("click", () => {
      const raceIdInput = document.querySelector("#raceId");
      raceIdInput.addEventListener("input", () => {
        error.classList.add("hidden");
      });
      const error = getRaceIdDialog.querySelector(".error");
      const raceId = raceIdInput.value;

      if (!raceId) {
        error.classList.remove("hidden");
        error.textContent = "Race Id is required";
        return;
      }

      if (getIdDialogTrigger === "spectate") {
        handleChangeRoute(`/race-details?raceId=${raceId}`);
      } else {
      }
      getRaceIdDialog.close();
    });

  const raceNameInput = document.querySelector("#raceName");
  const createRaceError = createRaceDialog.querySelector(".error");
  raceNameInput.addEventListener("input", () => {
    createRaceError.classList.add("hidden");
  });

  createRaceDialog
    .querySelector("#continueBtn")
    .addEventListener("click", async () => {
      let runnerIds;
      const raceName = raceNameInput.value;

      if (!raceName) {
        createRaceError.classList.remove("hidden");
        createRaceError.textContent = "Race name is required";
        return;
      }

      const onSubmitSuccess = (data) => {
        toast({
          type: "success",
          message: "Race created successfully",
        });
        createRaceDialog.close();
        raceNameInput.value = "";

        handleChangeRoute(`/timer?raceId=${data.data.raceId}`);
        return;
      };

      const onSubmitFailure = (err) => {
        createRaceError.classList.remove("hidden");
        createRaceError.textContent = err.error;
      };

      await createRace(
        { raceName, runnerIds },
        onSubmitSuccess,
        onSubmitFailure
      );
    });

  handleCloseDialog(getRaceIdDialog, "#cancelBtn", resetTrigger);
  handleCloseDialog(createRaceDialog, "#cancelBtn", resetTrigger);
  handleCloseDialog(confirmationDialog, "#cancelBtn", resetTrigger);
}
