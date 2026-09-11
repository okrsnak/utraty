// Recurring payments (rent, insurance, subscriptions): a template that turns
// into an ordinary expense on every due date. A generated expense gets the id
// "<template id>:<date>", so the same payment is never stored twice.

import { addMonths, daysInMonth, isValidIsoDate, parseIsoDate, toIsoDate } from './dates.js';
import { addExpense } from './state.js';

export const MAX_RECURRING_NAME = 40;
export const FREQUENCIES = [
  { months: 1, label: 'měsíčně' },
  { months: 3, label: 'čtvrtletně' },
  { months: 6, label: 'pololetně' },
  { months: 12, label: 'ročně' },
];

const CATCH_UP_LIMIT = 36;
const EDITABLE_FIELDS = ['name', 'amount', 'categoryId', 'everyMonths', 'firstDate'];

export function frequencyLabel(months) {
  return FREQUENCIES.find((frequency) => frequency.months === months)?.label ?? '';
}

export function isValidFrequency(months) {
  return FREQUENCIES.some((frequency) => frequency.months === months);
}

// The step-th due date: the first payment's day repeats, clamped in shorter months.
function occurrenceAt(template, step) {
  const { year, month, day } = parseIsoDate(template.firstDate);
  const target = addMonths({ year, month }, step * template.everyMonths);
  return toIsoDate({ ...target, day: Math.min(day, daysInMonth(target.year, target.month)) });
}

// Due dates in (afterIso, untilIso], oldest first; afterIso null means from the first payment.
export function occurrencesBetween(template, afterIso, untilIso, limit = CATCH_UP_LIMIT) {
  const dates = [];
  for (let step = 0; dates.length < limit; step += 1) {
    const date = occurrenceAt(template, step);
    if (date > untilIso) break;
    if (afterIso === null || date > afterIso) dates.push(date);
  }
  return dates;
}

export function nextOccurrence(template, afterIso) {
  for (let step = 0; ; step += 1) {
    const date = occurrenceAt(template, step);
    if (date > afterIso) return date;
  }
}

const pickEditable = (source) => Object.fromEntries(
  EDITABLE_FIELDS.filter((key) => key in source).map((key) => [key, key === 'name' ? source[key].trim() : source[key]]),
);

export function addRecurring(state, template) {
  return { ...state, recurring: [...state.recurring, { id: template.id, ...pickEditable(template), lastDate: null }] };
}

export function updateRecurring(state, id, patch) {
  return {
    ...state,
    recurring: state.recurring.map((template) => (template.id === id ? { ...template, ...pickEditable(patch) } : template)),
  };
}

// Payments already written stay in the history; only the future ones stop.
export function removeRecurring(state, id) {
  return { ...state, recurring: state.recurring.filter((template) => template.id !== id) };
}

// Undo of a removal: the payment comes back with its lastDate, so nothing it
// already wrote (or that was deleted by hand) is written again.
export function restoreRecurring(state, template) {
  if (state.recurring.some((item) => item.id === template.id)) return state;
  return { ...state, recurring: [...state.recurring, template] };
}

export function recurringError({ name, amount, categoryId, everyMonths, firstDate }, categories) {
  const trimmed = typeof name === 'string' ? name.trim() : '';
  if (trimmed === '') return 'Napiš název platby.';
  if (trimmed.length > MAX_RECURRING_NAME) return `Název je moc dlouhý (nejvýš ${MAX_RECURRING_NAME} znaků).`;
  if (!Number.isInteger(amount) || amount <= 0) return 'Zadej částku.';
  if (!categories.some((category) => category.id === categoryId && !category.archived)) return 'Vyber kategorii.';
  if (!isValidFrequency(everyMonths)) return 'Vyber, jak často se platí.';
  if (!isValidIsoDate(firstDate)) return 'Zadej datum první platby.';
  return null;
}

// Writes every payment that fell due up to today and remembers the last one.
export function applyDueRecurring(state, today, createdAt) {
  let next = state;
  const added = [];
  for (const template of state.recurring) {
    const dates = occurrencesBetween(template, template.lastDate, today);
    if (dates.length === 0) continue;
    for (const date of dates) {
      const expense = {
        id: `${template.id}:${date}`,
        amount: template.amount,
        categoryId: template.categoryId,
        date,
        note: template.name,
        createdAt,
        recurringId: template.id,
      };
      const before = next;
      next = addExpense(next, expense);
      if (next !== before) added.push(expense);
    }
    const lastDate = dates.at(-1);
    next = { ...next, recurring: next.recurring.map((item) => (item.id === template.id ? { ...item, lastDate } : item)) };
  }
  return { state: next, added };
}

// Payments still to come after today and before the next payday, soonest first.
export function upcomingInPeriod(recurring, today, period) {
  return recurring
    .flatMap((template) => occurrencesBetween(template, today, period.end).map((date) => ({ template, date })))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}
