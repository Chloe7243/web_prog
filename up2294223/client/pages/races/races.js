import { dateFormatter, toast } from "../../utils/functions.js";

const toastElement = document.querySelector("toast-message");
const toDate = document.querySelector(".date_filter #toDate");
const fromDate = document.querySelector(".date_filter #fromDate");
const searchFilter = document.querySelector(".search_input > input");

const raceList = document.querySelector("race-list");

const currentDateTime = dateFormatter(new Date(), {
  dateStyle: "short",
}).split(", ");

const maxDate = `${currentDateTime[0].split("/").reverse().join("-")}T${
  currentDateTime[1]
}`;

toDate.setAttribute("max", maxDate);
fromDate.setAttribute("max", maxDate);

const filter = {
  search: "",
  dateRange: {
    toDate: "",
    fromDate: "",
  },
};

const filterChangeHandler = {
  set(target, property, value) {
    target[property] = value;

    const event = new CustomEvent("filter", {
      bubbles: true,
      composed: true,
      detail: filter,
    });

    raceList.dispatchEvent(event);
    return true;
  },
};

const watchedFilter = new Proxy(filter, filterChangeHandler);

toDate.addEventListener("change", (e) => {
  const newValue = e.target.value;
  if (new Date(watchedFilter.dateRange.fromDate) > new Date(newValue)) {
    toast({
      message: "'To date' cannot be before 'From Date'",
      type: "error",
      duration: 10000,
      toasterElement: toastElement,
    });
    e.target.value = "";
    return;
  }
  watchedFilter.dateRange = {
    ...watchedFilter.dateRange,
    toDate: newValue,
  };
});

fromDate.addEventListener("change", (e) => {
  const newValue = e.target.value;

  if (new Date(newValue) > new Date(watchedFilter.dateRange.toDate)) {
    toast({
      message: "'From date' cannot be after 'To Date'",
      type: "error",
      duration: 10000,
      toasterElement: toastElement,
    });
    e.target.value = "";
    return;
  }
  watchedFilter.dateRange = {
    ...watchedFilter.dateRange,
    fromDate: newValue,
  };
});

searchFilter.addEventListener("input", (e) => {
  setTimeout(() => {
    watchedFilter.search = e.target.value;
  }, 1200);
});
