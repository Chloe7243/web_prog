import { ShadowElement } from "../../shadow-element.mjs";
import { addPositionSuffix } from "../../utils/functions.js";

const getTemplateID = (type) => {
  return `${type}-template`;
};

class RunnerRow extends ShadowElement {
  async connectedCallback() {
    const templateURL = import.meta.url.replace(".mjs", ".html");
    await this.loadTemplate(templateURL);
    if (this["mode"] === "read") {
      this.showReadMode();
    } else {
      this.showEditMode();
    }
    this.shadow.querySelector(".time").textContent = this["runner-time"] || "";
    this.shadow.querySelector(".position").textContent = addPositionSuffix(
      this["runner-position"] || ""
    );
  }

  showEditMode() {
    this.clearShadow();
    const editTemplate = getTemplateID("edit");

    this.showTemplate(editTemplate);

    const runnerIDInputField = this.shadow.querySelector(".runner-id > input");
    if (runnerIDInputField) {
      runnerIDInputField.value = this?.["runner-id"] || "";
      runnerIDInputField.addEventListener(
        "change",
        this.updateRunnerID.bind(this)
      );
    }
  }

  showReadMode() {
    this.clearShadow();
    const readTemplate = getTemplateID("read");
    this.showTemplate(readTemplate);
    this.shadow.querySelector(".runner-id").textContent =
      this?.["runner-id"] || "-";
  }

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
