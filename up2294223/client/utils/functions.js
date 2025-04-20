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
