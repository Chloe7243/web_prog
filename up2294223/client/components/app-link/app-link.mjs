import { handleNavigation } from "../../router.js";
import { ShadowElement } from "../shadow-element.mjs";

/**
 * Custom element for SPA navigation links.
 */
class AppLink extends ShadowElement {
  /**
   * Loads the template and sets up the link.
   */
  async connectedCallback() {
    const templateURL = import.meta.url.replace(".mjs", ".html");
    await this.loadTemplate(templateURL);
    this.showTemplate("link");

    const link = this.shadow.querySelector("a");
    link.setAttribute("href", this.getAttribute("href") || "#");
    link.addEventListener("click", handleNavigation);
  }
}

customElements.define("app-link", AppLink);
