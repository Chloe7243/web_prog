import { viewRaceResults } from "../../api.js";
import { handleChangeRoute } from "../../router.js";
import { addPositionSuffix } from "../../utils/functions.js";

export function init() {
  let raceId;
  let raceDetailRunners = [];

  const IdInput = document.querySelector("input#id");
  const shareBtn = document.querySelector(".share");
  const emptyResults = document.querySelector(".empty");
  const raceResults = document.querySelector("results-board");
  const shareOptions = document.querySelector("#share-options");
  const positionInput = document.querySelector("input#position");

  const filter = {
    position: "",
    ID: "",
  };

  function renderDetails(runners) {
    const event = new CustomEvent("show-bulk-results", {
      bubbles: true,
      composed: true,
      detail: {
        mode: "read",
        runners: runners.map((item) => ({
          id: item.runner_id,
          time: item.time,
          position: item.position,
        })),
      },
    });

    if (runners.length) {
      raceResults.dispatchEvent(event);
    } else {
    }
    raceResults.classList.toggle("hidden", !runners.length);
    emptyResults.classList.toggle("hidden", runners.length);
  }

  const filterChangeHandler = {
    set(target, property, value) {
      target[property] = value;

      const filteredDetails = raceDetailRunners.filter((item) => {
        if (!target.position && !target.ID) return true;
        let isPosition = false;
        let isRunner = false;
        if (target.position) isPosition = +item.position === +target.position;
        if (target.ID)
          isRunner = String(item.runner_id)
            .toLowerCase()
            .includes(target.ID.trim().toLowerCase());

        return isPosition || isRunner;
      });
      renderDetails(filteredDetails);
      return true;
    },
  };

  const watchedFilter = new Proxy(filter, filterChangeHandler);

  positionInput.addEventListener("input", (e) => {
    const max = positionInput.getAttribute("max");
    const parsedValue = e.target.value.replace("-", "");
    const newValue = +parsedValue > +max ? "" : parsedValue;
    watchedFilter.position = newValue;
    e.target.value = newValue;
    IdInput.value = "";
    watchedFilter.ID = "";
  });

  IdInput.addEventListener("input", (e) => {
    const newValue = e.target.value;
    watchedFilter.ID = newValue;
    positionInput.value = "";
    watchedFilter.position = "";
  });

  async function loadRaceDetails() {
    const raceName = document.querySelector(".race-name > span");

    const params = new URLSearchParams(window.location.search);
    const id = params.get("raceId");

    if (!id) {
      handleChangeRoute("404");
      return;
    }

    await viewRaceResults(
      id,
      ({ data }) => {
        raceName.textContent =
          data.raceDetails.race_name || `Race#${data.raceDetails.race_id}`;
        raceDetailRunners = data.runners;
        raceId =
          data.raceDetails.race_name || `Race#${data.raceDetails.race_id}`;
        positionInput.setAttribute("max", data.runners.length);
        renderDetails(data.runners);
      },
      (err) => {
        handleChangeRoute("404");
      }
    );
  }

  function positionDialog() {
    const wrapperRect = shareBtn.getBoundingClientRect();
    const dialogRect = shareOptions.getBoundingClientRect();

    // Calculate maxLeft if needed
    const maxLeft = window.innerWidth - dialogRect.width;
    const maxTop = window.innerHeight - dialogRect.height;

    // Adjust position
    const dialogLeft = Math.min(wrapperRect.left, maxLeft);
    const dialogTop = Math.min(wrapperRect.top, maxTop) + 50;

    shareOptions.style.width = `${wrapperRect.width}px`;
    shareOptions.style.left = `${dialogLeft}px`;
    shareOptions.style.top = `${dialogTop}px`;
  }

  // Toggle dialog when share button is clicked
  shareBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (shareOptions.open) {
      shareOptions.close();
    } else {
      shareOptions.show();
      positionDialog();
    }
  });

  // Close dialog when clicking outside
  document.addEventListener("click", (e) => {
    if (
      shareOptions.open &&
      e.target !== shareBtn &&
      !shareOptions.contains(e.target)
    ) {
      shareOptions.close();
    }
  });

  // Example download handlers
  shareOptions.querySelector(".pdf").addEventListener("click", async () => {
    const styleContent = `
    body {
      font-family: Arial, sans-serif;
      padding: 2rem;
      background-color: #f9f9f9;
      color: #333;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      background-color: #fff;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    th, td {
      border: 1px solid #ccc;
      padding: 0.75rem;
      text-align: left;
    }
    th {
      background-color: #eee;
    }
  `;

    // Create the new tab and use its document
    const newTab = open("", "_blank");
    const doc = newTab?.document;

    if (doc) {
      // Create <style>
      const styleEl = doc.createElement("style");
      styleEl.textContent = styleContent;

      // Create <h1>
      const heading = doc.createElement("h1");
      heading.textContent = `${raceId} results`;

      // Create <table>
      const table = doc.createElement("table");

      const thead = doc.createElement("thead");
      const headRow = doc.createElement("tr");
      ["Position", "Runner ID", "Time"].forEach((text) => {
        const th = doc.createElement("th");
        th.textContent = text;
        headRow.appendChild(th);
      });
      thead.appendChild(headRow);

      const tbody = doc.createElement("tbody");
      for (const row of raceDetailRunners) {
        const tr = doc.createElement("tr");

        const tdPos = doc.createElement("td");
        tdPos.textContent = addPositionSuffix(row.position);
        tr.appendChild(tdPos);

        const tdName = doc.createElement("td");
        tdName.textContent = row.runner_id;
        tr.appendChild(tdName);

        const tdTime = doc.createElement("td");
        tdTime.textContent = row.time;
        tr.appendChild(tdTime);

        tbody.appendChild(tr);
      }

      table.appendChild(thead);
      table.appendChild(tbody);

      doc.head.appendChild(styleEl);
      doc.body.appendChild(heading);
      doc.body.appendChild(table);
      newTab.print();
    }
  });

  shareOptions.querySelector(".csv").addEventListener("click", () => {
    const csvRows = ["Runner ID,Time,Positon"];
    raceDetailRunners.forEach((detail) => {
      csvRows.push(
        `${detail.runner_id},${detail.time},${addPositionSuffix(
          detail.position
        )}`
      );
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${raceId}-results.csv`;
    downloadLink.click();
    downloadLink.remove();
    shareOptions.close();
  });

  loadRaceDetails();
}
