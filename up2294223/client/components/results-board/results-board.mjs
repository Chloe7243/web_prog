import { ShadowElement } from "../shadow-element.mjs";

/**
 * Custom element for managing and displaying the results board.
 */
class ResultsBoard extends ShadowElement {
  /**
   * Loads the template and sets up event listeners for results.
   */
  async connectedCallback() {
    const templateURL = import.meta.url.replace(".mjs", ".html");
    await this.loadTemplate(templateURL);

    const raceResults = document.createElement("race-results");

    const results = this.shadow.querySelector("#results-table > .body");
    results.append(raceResults);
    const headChildren = this.shadow.querySelectorAll(
      "#results-table .head > *"
    );

    this.addEventListener("show-results", ({ detail }) => {
      const runnersNum = detail.runners.length;
      if (!runnersNum) {
        const event = new CustomEvent("clear-result", {
          bubbles: true,
          composed: true,
        });
        raceResults.dispatchEvent(event);
      } else {
        const newValue = detail.newValue;
        const event = new CustomEvent("add-runner", {
          bubbles: true,
          composed: true,
          detail: { runner: newValue, mode: detail.mode },
        });

        const last = headChildren[headChildren.length - 1];

        if (last.classList.contains("hidden")) {
        }

        this.shadow
          .querySelector("#results-table > .head")
          .lastElementChild.classList.toggle(
            "hidden",
            detail.mode === "no-runner"
          );
        const secondLast = headChildren[headChildren.length - 2];
        secondLast.classList.toggle("last", detail.mode === "no-runner");
        raceResults.dispatchEvent(event);
      }
    });

    this.addEventListener("show-bulk-results", ({ detail }) => {
      const event = new CustomEvent("show-runners", {
        bubbles: true,
        composed: true,
        detail,
      });

      raceResults.dispatchEvent(event);
    });
  }
}

customElements.define("results-board", ResultsBoard);
