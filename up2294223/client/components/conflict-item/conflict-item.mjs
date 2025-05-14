import { ShadowElement } from "../shadow-element.mjs";

/**
 * Custom element for displaying and resolving timing conflicts.
 */
class ConflictItem extends ShadowElement {
  /**
   * Loads the template and sets up conflict resolution UI.
   */
  async connectedCallback() {
    const templateURL = import.meta.url.replace(".mjs", ".html");
    await this.loadTemplate(templateURL);
    this.showTemplate("conflict-item-template");

    const position = this["position"];
    const times = this["times"];
    const badge = this.shadow.querySelector(".position-badge");
    const timeOptionsContainer = this.shadow.querySelector(".time-options");
    const confirmBtn = this.shadow.querySelector(".position-confirm");

    badge.textContent = `Position ${position}`;

    while (timeOptionsContainer.firstChild) {
      timeOptionsContainer.removeChild(timeOptionsContainer.firstChild);
    }

    times.forEach((time, index) => {
      const inputId = `position-${position}-time-${index}`;

      const wrapper = document.createElement("div");
      wrapper.className = "time-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `position-${position}`;
      input.id = inputId;
      input.value = time;
      if (index === 0) input.checked = true;

      const label = document.createElement("label");
      label.setAttribute("for", inputId);

      const span = document.createElement("span");
      span.className = "time-value";
      span.textContent = time;

      label.appendChild(span);
      wrapper.appendChild(input);
      wrapper.appendChild(label);
      timeOptionsContainer.appendChild(wrapper);
    });

    confirmBtn.addEventListener("click", () => {
      const selected = this.shadow.querySelector(
        `input[name="position-${position}"]:checked`
      );
      const selectedTime = selected?.value;

      this.dispatchEvent(
        new CustomEvent("time-confirmed", {
          detail: {
            position,
            time: selectedTime,
          },
          bubbles: true,
          composed: true,
        })
      );
      this.remove();
    });
  }
}

customElements.define("conflict-item", ConflictItem);
