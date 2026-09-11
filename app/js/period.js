// Pay periods: a period starts on payday (inclusive) and ends the day before
// the next payday. A payday past the month's length clamps to its last day.

import { addDays, addMonths, daysBetween, daysInMonth, formatShortDate, parseIsoDate, toIsoDate } from './dates.js';
import { plural } from './plural.js';

const MONTH_NAMES = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'];
const MONTH_SHORT = ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'];

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

// A period is named after the month it starts in: "září" runs 10. 9. – 9. 10.
export function periodMonthName(period, currentYear) {
  const { year, month } = period.anchor;
  const name = MONTH_NAMES[month - 1];
  return year === currentYear ? name : `${name} ${year}`;
}

export function periodMonthShort(period) {
  return MONTH_SHORT[period.anchor.month - 1];
}

// Which days a period runs, for the note under the chart. A payday past the
// 28th moves in shorter months, so it only gets the general rule.
export function periodSpanNote(payday) {
  if (payday === 1) return 'kalendářní měsíce';
  if (payday > 28) return 'od výplaty do výplaty';
  return `vždy od ${payday}. do ${payday - 1}.`;
}

export function formatCountdown(days) {
  return days === 1 ? 'Výplata zítra' : `Do výplaty ${plural(days, ['den', 'dny', 'dní'])}`;
}

// Share of the period already lived: 0 on payday, approaching 1 on its last day.
export function periodProgress(today, period) {
  const length = daysBetween(period.start, period.end) + 1;
  return Math.min(1, Math.max(0, daysBetween(period.start, today) / length));
}
