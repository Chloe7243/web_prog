import { deleteRaceItem } from "../../api.js";
import { ShadowElement } from "../../shadow-element.mjs";
import { dateFormatter } from "../../utils/functions.js";

class RaceItem extends ShadowElement {
  async connectedCallback() {
    const templateURL = import.meta.url.replace(".mjs", ".html");
    await this.loadTemplate(templateURL);
    this.showTemplate("race-item-template");

    this.shadow.querySelector(".race-id").textContent = this["race-id"];
    this.shadow.querySelector(".race-name").textContent =
      this["race-name"] || "-";
    this.shadow.querySelector(".race-date").textContent = dateFormatter(
      this["race-date"],
      { dateStyle: "medium", timeStyle: "short" }
    );
    this.dialog = this.shadow.getElementById("actions-dialog");

    this.shadow
      .querySelector(".view-result-button")
      .addEventListener("click", this.showResult.bind(this));

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

  async showResult() {
    const path = window.location.pathname.split("/");
    const url = `${path
      .slice(0, path.length - 2)
      .join("/")}/race-details/race-details.html?id=${this["race-id"]}`;

    this.dialog.close();
    window.location.assign(url);
  }

  async deleteItem() {
    await deleteRaceItem(this["race-id"], () => {
      this.dialog.close();
      this.remove();
    });
  }
}

customElements.define("race-item", RaceItem);
