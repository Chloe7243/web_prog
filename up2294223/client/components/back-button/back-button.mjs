import { handleChangeRoute } from "../../router.js";
import { ShadowElement } from "../shadow-element.mjs";

class BackButton extends ShadowElement {
  async connectedCallback() {
    const templateURL = import.meta.url.replace(".mjs", ".html");
    await this.loadTemplate(templateURL);

    this.addEventListener("click", (e) => {
      handleChangeRoute("/");
    });
  }
}

customElements.define("back-button", BackButton);
