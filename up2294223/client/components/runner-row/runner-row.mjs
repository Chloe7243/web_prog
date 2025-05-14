import { ShadowElement } from "../shadow-element.mjs";
import { addPositionSuffix } from "../../utils/functions.js";

const getTemplateID = (type) => {
  return `${type}-template`;
};

/**
 * Custom element for displaying a runner row in results.
 */
class RunnerRow extends ShadowElement {
  /**
   * Loads the template and displays the appropriate mode.
   */
  async connectedCallback() {
    const templateURL = import.meta.url.replace(".mjs", ".html");
    await this.loadTemplate(templateURL);
    if (this["mode"] === "no-runner") {
      this.showNoRunnerMode();
    } else if (this["mode"] === "read") {
      this.showReadMode();
    } else {
      this.showEditMode();
    }
    return true;
  }

  /**
   * Shows the edit mode for runner row.
   */
  showEditMode() {
    this.clearShadow();
    const editTemplate = getTemplateID("edit");
    this.showTemplate(editTemplate);

    this.shadow.querySelector(".time").textContent = this["runner-time"] || "";
    this.shadow.querySelector(".position").textContent = addPositionSuffix(
      this["runner-position"] || ""
    );
    const runnerIDInputField = this.shadow.querySelector(".runner-id > input");
    if (runnerIDInputField) {
      runnerIDInputField.value = this?.["runner-id"] || "";
      runnerIDInputField.addEventListener(
        "input",
        this.updateRunnerID.bind(this)
      );
    }
  }

  /**
   * Shows the read-only mode for runner row.
   */
  showReadMode() {
    this.clearShadow();
    const readTemplate = getTemplateID("read");
    this.showTemplate(readTemplate);
    this.shadow.querySelector(".time").textContent = this["runner-time"] || "";
    this.shadow.querySelector(".position").textContent = addPositionSuffix(
      this["runner-position"] || ""
    );
    this.shadow.querySelector(".runner-id").textContent =
      this?.["runner-id"] || "-";
  }

  /**
   * Shows the no-runner mode for runner row.
   */
  showNoRunnerMode() {
    this.clearShadow();
    const readTemplate = getTemplateID("no-runner");
    this.showTemplate(readTemplate);
    this.shadow.querySelector(".time").textContent = this["runner-time"] || "";
    this.shadow.querySelector(".position").textContent = addPositionSuffix(
      this["runner-position"] || ""
    );
  }

  /**
   * Dispatches an event when the runner ID is updated.
   */
  updateRunnerID(inputEvent) {
    const event = new CustomEvent("update-runnerID", {
      bubbles: true,
      composed: true,
      detail: { value: inputEvent.target.value, key: this["runner-position"] },
    });

    this.dispatchEvent(event);
  }
}

customElements.define("runner-row", RunnerRow);
