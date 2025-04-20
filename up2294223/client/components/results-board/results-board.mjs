import { ShadowElement } from "../../shadow-element.mjs";

class ResultsBoard extends ShadowElement {
  async connectedCallback() {
    const templateURL = import.meta.url.replace(".mjs", ".html");
    await this.loadTemplate(templateURL);

    const raceResults = document.createElement("race-results");

    const results = this.shadow.querySelector("#results-table > .body");
    results.append(raceResults);

    this.addEventListener("show-results", ({ detail }) => {
      const event = new CustomEvent("add-runner", {
        bubbles: true,
        composed: true,
        detail,
      });

      raceResults.dispatchEvent(event);
    });
  }
}

customElements.define("results-board", ResultsBoard);
