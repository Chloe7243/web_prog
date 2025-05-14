export function timeToMs(hhmmssMs) {
  const [hh, mm, ssMs] = hhmmssMs.split(":");
  const [ss, ms] = ssMs.split(".");
  return (
    parseInt(hh) * 3600000 +
    parseInt(mm) * 60000 +
    parseInt(ss) * 1000 +
    parseInt(ms)
  );
}
