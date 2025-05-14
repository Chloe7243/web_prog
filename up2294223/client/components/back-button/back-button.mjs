import { handleChangeRoute } from "../../router.js";
import { ShadowElement } from "../shadow-element.mjs";

class BackButton extends ShadowElement {
  async connectedCallback() {
    const templateURL = import.meta.url.replace(".mjs", ".html");
    await this.loadTemplate(templateURL);

    this.addEventListener("click", (e) => {
      if (window.history.length <= 1) {
        handleChangeRoute("/"); // No history to go back to, go to home
      } else {
        window.history.back(); // Otherwise, go back
      }
    });
  }
}

customElements.define("back-button", BackButton);
