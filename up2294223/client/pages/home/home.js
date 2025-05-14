import { createRace, viewRaceResults } from "../../api.js";
import { handleChangeRoute } from "../../router.js";
import { handleCloseDialog } from "../../utils/closeDialog.js";
import {
  localStorageIsOn,
  localStorageResults,
  userID,
} from "../../utils/constants.js";
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
    if (storageResults) {
      confirmationDialog.showModal();
    } else {
      createRaceDialog.showModal();
    }
  });

  existingTimer.addEventListener("click", (e) => {
    e.preventDefault();
    if (storageResults && resultsIsObject) {
      handleChangeRoute(`/timer?raceId=${storageResults?.raceId}`);
    } else {
      getRaceIdDialog.showModal();
      getIdDialogTrigger = "timer";
    }
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
      localStorage.removeItem(localStorageIsOn);
      localStorage.removeItem(localStorageResults);
      confirmationDialog.close();
      createRaceDialog.showModal();
    });

  getRaceIdDialog
    .querySelector("#continueBtn")
    .addEventListener("click", () => {
      const raceNameInput = document.querySelector("#raceId");
      const raceId = raceNameInput.value;
      if (getIdDialogTrigger === "spectate") {
        handleChangeRoute(`/race-details?raceId=${raceId}`);
      } else {
        viewRaceResults(
          raceId,
          ({ data }) => {
            const raceStatus = data?.raceDetails?.status;
            if (raceStatus && raceStatus !== "ongoing") {
              toast({
                title: "Can't time race",
                message: "Race has ended and can't be timed anymore",
                type: "error",
              });
            } else {
              handleChangeRoute(`/timer?raceId=${raceId}`);
            }
          },
          () => {
            toast({
              title: "Can't time race",
              message: "Couldn't find race",
              type: "error",
            });
          }
        );
      }
      getRaceIdDialog.close();
    });

  createRaceDialog
    .querySelector("#continueBtn")
    .addEventListener("click", async () => {
      const raceNameInput = document.querySelector("#raceName");
      let runnerIds;
      const raceName = raceNameInput.value;

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
        console.log(err);

        toast({
          type: "error",
          title: err.error,
          message:
            err?.messages?.[0] ||
            "Couldn't create race! Please, try again later.",
        });
        return;
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

export function destroy() {
  console.log("Timer page cleaned up");
}
