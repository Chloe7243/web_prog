import { ShadowElement } from "../shadow-element.mjs";

class ConflictItem extends ShadowElement {
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
    timeOptionsContainer.innerHTML = "";

    times.forEach((time, index) => {
      const inputId = `position-${position}-time-${index}`;
      const wrapper = document.createElement("div");
      wrapper.className = "time-option";
      wrapper.innerHTML = `
            <input type="radio" name="position-${position}" id="${inputId}" value="${time}" ${
        index === 0 ? "checked" : ""
      }/>
            <label for="${inputId}">
              <span class="time-value">${time}</span>
            </label>
          `;
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
      this.clearShadow();
    });
  }
}

customElements.define("conflict-item", ConflictItem);
