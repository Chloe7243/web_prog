import { ShadowElement } from "../../shadow-element.mjs";

class RaceList extends ShadowElement {
  async connectedCallback() {
    const templateURL = import.meta.url.replace(".mjs", ".html");
    await this.loadTemplate(templateURL);
    await this.fetchRaces();
    // // Listen for new messages added to refresh the list
    // this.addEventListener("messageadded", this.fetchMessages);
  }

  /**
   * Fetches messages from the server and updates the display
   * If fetch fails, shows an error message
   */
  async fetchRaces() {
    this.clearShadow();
    let races;

    try {
      const response = await fetch(`http://localhost:8080/get-races`);
      const { data } = await response.json();
      if (response.ok) {
        races = data;
      } else {
        throw Error(data.error.message);
      }
    } catch (error) {
      // console.log({ error });
    }

    // Clear existing messages and display new ones
    if (races) {
      races.forEach((race) => {
        const clone = this.showTemplate("race");

        if (clone) {
          clone["race-id"] = race.race_id;
          clone["race-name"] = race?.race_name || "";
          clone["race-date"] = race?.race_date;
        }
      });
    }
  }
}

customElements.define("race-list", RaceList);
