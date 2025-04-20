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
      { dateStyle: "medium" }
    ).split(",")[0];

    this.shadow
      .querySelector(".view-result-button")
      .addEventListener("click", this.showResult.bind(this));
  }

  async showResult() {
    const path = window.location.pathname.split("/");
    const url = `${path
      .slice(0, path.length - 1)
      .join("/")}/race-details/race-details.html?id=${this["race-id"]}`;

    window.location.assign(url);
  }
}

customElements.define("race-item", RaceItem);
