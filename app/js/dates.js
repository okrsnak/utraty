// Calendar helpers on local ISO dates ('YYYY-MM-DD'). Dates never carry a time
// or zone, so arithmetic runs in UTC where daylight saving cannot shift a day.

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;
const NBSP = '\u00a0';
const WEEKDAYS = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];

const pad2 = (value) => String(value).padStart(2, '0');

export function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function isValidIsoDate(value) {
  if (typeof value !== 'string') return false;
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const [, year, month, day] = match.map(Number);
  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month);
}

export function parseIsoDate(iso) {
  const [, year, month, day] = ISO_DATE.exec(iso).map(Number);
  return { year, month, day };
}

export function toIsoDate({ year, month, day }) {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function toUtcMs(iso) {
  const { year, month, day } = parseIsoDate(iso);
  return Date.UTC(year, month - 1, day);
}

function fromUtcMs(ms) {
  const date = new Date(ms);
  return toIsoDate({ year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() });
}

export function addDays(iso, days) {
  return fromUtcMs(toUtcMs(iso) + days * DAY_MS);
}

export function daysBetween(fromIso, toIso) {
  return Math.round((toUtcMs(toIso) - toUtcMs(fromIso)) / DAY_MS);
}

export function addMonths({ year, month }, offset) {
  const index = year * 12 + (month - 1) + offset;
  return { year: Math.floor(index / 12), month: (((index % 12) + 12) % 12) + 1 };
}

export function todayIso(now = new Date()) {
  return toIsoDate({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() });
}

export function formatShortDate(iso, { withYear = false } = {}) {
  const { year, month, day } = parseIsoDate(iso);
  const dayMonth = `${day}.${NBSP}${month}.`;
  return withYear ? `${dayMonth}${NBSP}${year}` : dayMonth;
}

export function formatDayLabel(iso, today) {
  const offset = daysBetween(iso, today);
  if (offset === 0) return 'Dnes';
  if (offset === 1) return 'Včera';
  const weekday = WEEKDAYS[new Date(toUtcMs(iso)).getUTCDay()];
  const withYear = parseIsoDate(iso).year !== parseIsoDate(today).year;
  return `${weekday} ${formatShortDate(iso, { withYear })}`;
}
