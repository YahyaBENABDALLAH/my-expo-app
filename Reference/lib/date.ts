const RELATIVE_TIME_UNITS = [
  { seconds: 60, unit: "second" },
  { seconds: 60, unit: "minute" },
  { seconds: 24, unit: "hour" },
  { seconds: 7, unit: "day" },
  { seconds: 4.345, unit: "week" },
  { seconds: 12, unit: "month" },
  { seconds: Number.POSITIVE_INFINITY, unit: "year" },
] as const;

export function formatRelativeTime(
  value: string | number | Date,
  locale?: string,
  now = Date.now(),
) {
  const timestamp = new Date(value).getTime();

  if (!Number.isFinite(timestamp)) {
    return "";
  }

  let amount = (timestamp - now) / 1_000;

  for (const { seconds, unit } of RELATIVE_TIME_UNITS) {
    if (Math.abs(amount) < seconds) {
      return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
        Math.round(amount),
        unit,
      );
    }

    amount /= seconds;
  }

  return "";
}
