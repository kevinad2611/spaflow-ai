/** Return today's date (YYYY-MM-DD) in Vietnam timezone (Asia/Ho_Chi_Minh). */
export function getVietnamTodayISO(referenceDate: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(referenceDate);
}

/** Add a number of days to a YYYY-MM-DD date string. */
export function addDaysISO(dateISO: string, days: number): string {
  const parts = dateISO.split("-").map(Number);
  const year = parts[0] ?? 2026;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

/** Convert HH:mm or HH:mm:ss time string into total minutes from midnight. */
export function timeToMinutes(timeStr: string): number {
  const parts = timeStr.split(":").map(Number);
  const hours = parts[0] ?? 0;
  const minutes = parts[1] ?? 0;
  return hours * 60 + minutes;
}

/** Calculate HH:mm end time from start time and total duration in minutes. */
export function calculateEndTime(
  startTime: string,
  durationMinutes: number
): string {
  const totalMinutes = Math.min(
    timeToMinutes(startTime) + Math.max(durationMinutes, 5),
    23 * 60 + 59
  );
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** Determine whether two [start, end) time intervals overlap. */
export function hasTimeOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const a0 = timeToMinutes(startA);
  const a1 = timeToMinutes(endA);
  const b0 = timeToMinutes(startB);
  const b1 = timeToMinutes(endB);
  return a0 < b1 && b0 < a1;
}
