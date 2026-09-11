// Read-only views over expenses: what falls into a period and how it adds up.

import { daysBetween } from './dates.js';
import { isDateInPeriod } from './period.js';

const UNKNOWN_CATEGORY_NAME = 'Bez kategorie';

const compareDesc = (a, b) => (a < b ? 1 : a > b ? -1 : 0);
const newestFirst = (a, b) => compareDesc(a.date, b.date) || b.createdAt - a.createdAt;

export function expensesInPeriod(expenses, period) {
  return expenses.filter((expense) => isDateInPeriod(expense.date, period)).sort(newestFirst);
}

export function totalAmount(expenses) {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

// Average per day: over the days lived so far in a running period, over the
// whole length of a finished one.
export function dailyAverage(total, period, today) {
  const lastDay = today < period.end ? today : period.end;
  const days = daysBetween(period.start, lastDay) + 1;
  return days > 0 ? Math.round(total / days) : 0;
}

export function totalsByCategory(expenses, categories) {
  const known = new Map(categories.map((category, index) => [category.id, { category, index }]));
  const rows = new Map();
  for (const expense of expenses) {
    const category = known.get(expense.categoryId)?.category
      ?? { id: expense.categoryId, name: UNKNOWN_CATEGORY_NAME, archived: true };
    const row = rows.get(expense.categoryId) ?? { category, total: 0, count: 0 };
    rows.set(expense.categoryId, { ...row, total: row.total + expense.amount, count: row.count + 1 });
  }
  const position = (row) => known.get(row.category.id)?.index ?? categories.length;
  return [...rows.values()].sort((a, b) => b.total - a.total || position(a) - position(b));
}

// Every active category, plus archived or unknown ones that have spend: spent
// rows first by size, then the untouched active ones at zero in their own order.
export function categoryBreakdown(expenses, categories) {
  const spent = totalsByCategory(expenses, categories);
  const listed = new Set(spent.map((row) => row.category.id));
  const untouched = categories
    .filter((category) => !category.archived && !listed.has(category.id))
    .map((category) => ({ category, total: 0, count: 0 }));
  return [...spent, ...untouched];
}

const NICE_STEPS = [1, 2, 5];
const MIN_STEP = 100; // 1 Kč
const MAX_DIVISIONS = 5;

// A ruler for the category bars: a round step (1, 2 or 5 × 10ⁿ Kč) so that the
// largest total fits in at most five divisions.
export function niceScale(maxAmount) {
  const target = Math.max(maxAmount / MAX_DIVISIONS, MIN_STEP);
  for (let magnitude = MIN_STEP; ; magnitude *= 10) {
    const step = NICE_STEPS.map((factor) => factor * magnitude).find((candidate) => candidate >= target);
    if (step) return { step, max: Math.max(step, Math.ceil(maxAmount / step) * step) };
  }
}

export function groupByDate(expenses) {
  const groups = new Map();
  for (const expense of expenses) {
    const group = groups.get(expense.date) ?? { date: expense.date, expenses: [], total: 0 };
    groups.set(expense.date, { ...group, expenses: [...group.expenses, expense], total: group.total + expense.amount });
  }
  return [...groups.values()].sort((a, b) => compareDesc(a.date, b.date));
}
