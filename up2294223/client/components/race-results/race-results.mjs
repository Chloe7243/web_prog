import { ShadowElement } from "../../shadow-element.mjs";

class RaceResults extends ShadowElement {
  async connectedCallback() {
    const templateURL = import.meta.url.replace(".mjs", ".html");
    await this.loadTemplate(templateURL);

    this.addEventListener("add-runner", ({ detail }) => {
      this.clearShadow();
      detail.runners.forEach((runner) => {
        const clone = this.showTemplate("table-row");
        if (clone) {
          clone["mode"] = detail.mode || "edit";
          clone["runner-position"] = runner.position;
          clone["runner-id"] = runner.id;
          clone["runner-time"] = runner.time;
        }
      });
    });
  }
}

customElements.define("race-results", RaceResults);
