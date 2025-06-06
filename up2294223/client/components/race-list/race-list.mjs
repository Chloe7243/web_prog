import { getUserRaces } from "../../api.js";
import { toast } from "../../utils/functions.js";
import { ShadowElement } from "../shadow-element.mjs";

/**
 * Custom element for displaying a list of races.
 */
class RaceList extends ShadowElement {
  races = [];

  /**
   * Loads the template and fetches races.
   */
  async connectedCallback() {
    const templateURL = import.meta.url.replace(".mjs", ".html");
    await this.loadTemplate(templateURL);
    await this.fetchRaces();

    // Listen for new filter added to refresh the list
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

  /**
   * Checks if a race date is within the given range.
   */
  isWithinDateRange(raceDate, fromStr, toStr) {
    if (!fromStr) return true;
    const from = new Date(fromStr);
    const to = toStr ? new Date(toStr) : new Date();
    const date = new Date(raceDate);
    return date >= from && date <= to;
  }

  /**
   * Checks if a race name matches the search keyword.
   */
  matchesSearch(raceName, keyword) {
    return keyword ? raceName?.toLowerCase().includes(keyword) : true;
  }

  /**
   * Renders the list of race items.
   */
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
        clone["race-status"] = race?.status || "";
        clone["race-date"] = race?.race_date;
      }
    });
  }

  /**
   * Fetches races from the API.
   */
  async fetchRaces() {
    this.clearShadow();
    let races;

    await getUserRaces(
      (data) => {
        races = data.data;
      },
      (error) => {
        toast({
          title: "",
          message: "",
          type: "error",
        });
      }
    );

    // Clear existing races and display new ones
    if (races) {
      this["races"] = races;
      this.renderItems(races);
    }
  }
}

customElements.define("race-list", RaceList);
