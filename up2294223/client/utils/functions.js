export function formatTime(time) {
  const timeValues = Object.values(time);
  const formattedTime = timeValues
    .slice(1)
    .reverse()
    .map((value) => value.toString().padStart("2", "0"))
    .join(":")
    .concat(".", timeValues[0].toString().padStart("3", "0"));

  return formattedTime;
}

export const timeToMillis = (timeStr) => {
  const [h, m, s] = timeStr.split(":");
  const [sec, ms] = s.split(".");
  return (
    parseInt(h) * 3600000 +
    parseInt(m) * 60000 +
    parseInt(sec) * 1000 +
    parseInt(ms)
  );
};

export function addPositionSuffix(position) {
  if (!position) return position;
  let formattedPosition = String(position);
  const isException = Math.floor(position / 10) === 1;

  const unit = position % 10;
  formattedPosition += isException
    ? "th"
    : unit === 1
    ? `st`
    : unit === 2
    ? "nd"
    : unit === 3
    ? "rd"
    : "th";

  return formattedPosition;
}

export function dateFormatter(date, options) {
  let value = "";
  const dateValue = typeof date === "string" ? new Date(date) : date;
  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "full",
      timeStyle: "medium",
      ...options,
    });
    value = formatter.format(dateValue);
  } catch (error) {}
  return value;
}

const toaster = document.querySelector("toast-message");
export function toast({ title, type, message, duration }) {
  const event = new CustomEvent("show-toast", {
    bubbles: true,
    composed: true,
    detail: { title, message, type, duration },
  });
  toaster.dispatchEvent(event);
}
