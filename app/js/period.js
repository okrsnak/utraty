// Pay periods: a period starts on payday (inclusive) and ends the day before
// the next payday. A payday past the month's length clamps to its last day.

import { addDays, addMonths, daysBetween, daysInMonth, formatShortDate, parseIsoDate, toIsoDate } from './dates.js';
import { plural } from './plural.js';

function startDayIn({ year, month }, payday) {
  return Math.min(payday, daysInMonth(year, month));
}

function periodFromAnchor(anchor, payday) {
  const next = addMonths(anchor, 1);
  const start = toIsoDate({ ...anchor, day: startDayIn(anchor, payday) });
  const nextStart = toIsoDate({ ...next, day: startDayIn(next, payday) });
  return { anchor, start, end: addDays(nextStart, -1) };
}

export function periodForDate(iso, payday) {
  const { year, month, day } = parseIsoDate(iso);
  const thisMonth = { year, month };
  const anchor = day >= startDayIn(thisMonth, payday) ? thisMonth : addMonths(thisMonth, -1);
  return periodFromAnchor(anchor, payday);
}

export function shiftPeriod(period, offset, payday) {
  return periodFromAnchor(addMonths(period.anchor, offset), payday);
}

export function isDateInPeriod(iso, period) {
  return iso >= period.start && iso <= period.end;
}

export function daysUntilNextPeriod(today, period) {
  return daysBetween(today, addDays(period.end, 1));
}

export function formatPeriodLabel(period, currentYear) {
  const withYear = [period.start, period.end].some((iso) => parseIsoDate(iso).year !== currentYear);
  return `${formatShortDate(period.start, { withYear })} – ${formatShortDate(period.end, { withYear })}`;
}

export function formatCountdown(days) {
  return days === 1 ? 'Výplata zítra' : `Do výplaty ${plural(days, ['den', 'dny', 'dní'])}`;
}

// Share of the period already lived: 0 on payday, approaching 1 on its last day.
export function periodProgress(today, period) {
  const length = daysBetween(period.start, period.end) + 1;
  return Math.min(1, Math.max(0, daysBetween(period.start, today) / length));
}
