import { deleteRace } from "../../api.js";
import { ShadowElement } from "../shadow-element.mjs";
import { dateFormatter, toast } from "../../utils/functions.js";
import { handleChangeRoute } from "../../router.js";

/**
 * Custom element for displaying a single race item with actions.
 */
class RaceItem extends ShadowElement {
  /**
   * Loads the template and sets up race item actions.
   */
  async connectedCallback() {
    const templateURL = import.meta.url.replace(".mjs", ".html");
    await this.loadTemplate(templateURL);
    this.showTemplate("race-item-template");

    const raceisOngoing = this["race-status"] === "ongoing";

    this.shadow.querySelector(".race-id").textContent = this["race-id"];
    this.shadow.querySelector(".race-name").textContent =
      this["race-name"] || "-";
    this.shadow.querySelector(".race-status").textContent =
      this["race-status"] || "-";
    this.shadow
      .querySelector(".race-status")
      .classList.add(this["race-status"]);
    this.shadow.querySelector(".race-date").textContent = dateFormatter(
      this["race-date"],
      { dateStyle: "medium", timeStyle: "short" }
    );
    this.dialog = this.shadow.querySelector("#actions-dialog");

    this.shadow
      .querySelector(".view-result-button")
      .classList.toggle("hidden", raceisOngoing);
    this.shadow
      .querySelector(".manage-timer")
      .classList.toggle("hidden", !raceisOngoing);

    this.shadow
      .querySelector(".view-result-button")
      .addEventListener("click", this.showResult.bind(this));

    this.shadow
      .querySelector(".manage-timer")
      .addEventListener("click", this.showTimer.bind(this));

    this.shadow
      .querySelector(".delete-item-button")
      .addEventListener("click", this.deleteItem.bind(this));

    this.shadow
      .querySelector(".view-actions")
      .addEventListener("click", this.showActionDialog.bind(this));

    this.dialog.addEventListener("click", (e) => {
      if (e.target === this.dialog) {
        this.dialog.close();
      }
    });
  }

  /**
   * Shows the actions dialog.
   */
  showActionDialog() {
    this.dialog.showModal();
    const dialogWrapper = this.shadow.querySelector(".actions");
    const wrapperRect = dialogWrapper.getBoundingClientRect();
    const dialogRect = this.dialog.getBoundingClientRect();

    // Get scroll position
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Calculate maxLeft if needed
    const maxLeft = window.innerWidth - dialogRect.width;
    const maxTop = window.innerHeight - dialogRect.height;

    // Adjust position
    const dialogLeft = Math.min(wrapperRect.left + scrollLeft, maxLeft) - 20;
    const dialogTop = Math.min(wrapperRect.top + scrollTop, maxTop) - 20;

    this.dialog.style.left = `${dialogLeft}px`;
    this.dialog.style.top = `${dialogTop}px`;
  }

  /**
   * Navigates to the race results page.
   */
  async showResult() {
    handleChangeRoute(`/race-details?raceId=${this["race-id"]}`);
    this.dialog.close();
  }

  /**
   * Navigates to the manage race page.
   */
  async showTimer() {
    handleChangeRoute(`/manage-race?raceId=${this["race-id"]}`);
    this.dialog.close();
  }

  /**
   * Deletes the race.
   */
  async deleteItem() {
    await deleteRace(
      this["race-id"],
      () => {
        this.dialog.close();
        this.remove();
      },
      (error) => {
        toast({
          type: "error",
          title: "Couldn't delete race",
          message: error.error || error,
        });
      }
    );
  }
}

customElements.define("race-item", RaceItem);
