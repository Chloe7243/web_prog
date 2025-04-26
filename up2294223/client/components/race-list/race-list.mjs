import { ShadowElement } from "../../shadow-element.mjs";

class RaceList extends ShadowElement {
  races = [];
  async connectedCallback() {
    const templateURL = import.meta.url.replace(".mjs", ".html");
    await this.loadTemplate(templateURL);
    await this.fetchRaces();

    // // Listen for new messages added to refresh the list
    this.addEventListener("filter", ({ detail }) => {
      const { search = "", dateRange = {} } = detail;
      const searchValue = search.trim().toLowerCase();
      const { fromDate = "", toDate = "" } = dateRange;

      const filteredRaces = this.races.filter(
        (race) =>
          this.isWithinDateRange(race.race_date, fromDate, toDate) &&
          this.matchesSearch(race.race_name, searchValue)
      );

      this.renderItems(filteredRaces);
    });
  }

  isWithinDateRange(raceDate, fromStr, toStr) {
    if (!fromStr) return true;
    const from = new Date(fromStr);
    const to = toStr ? new Date(toStr) : new Date();
    const date = new Date(raceDate);
    return date >= from && date <= to;
  }

  matchesSearch(raceName, keyword) {
    return keyword ? raceName?.toLowerCase().includes(keyword) : true;
  }

  renderItems(raceList) {
    this.clearShadow();
    if (!raceList.length) {
      this.showTemplate("empty");
      return;
    }
    raceList.forEach((race) => {
      const clone = this.showTemplate("race");
      if (clone) {
        clone["race-id"] = race.race_id;
        clone["race-name"] = race?.race_name || "";
        clone["race-date"] = race?.race_date;
      }
    });
  }

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
      this["races"] = races;
      this.renderItems(races);
    }
  }
}

customElements.define("race-list", RaceList);
