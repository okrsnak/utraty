// Statistiky: how spending runs across recent pay periods. Months before the
// first written expense are left out, because the app was not in use yet. The
// average and the extremes use only finished months written from their first
// day: a month where writing started part-way is shown, but not averaged.

import { isDateInPeriod, periodForDate, shiftPeriod } from './period.js';
import { totalAmount, totalsByCategory } from './summary.js';

const averageOf = (amounts) => (amounts.length > 0 ? Math.round(amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length) : 0);

const pick = (rows, isBetter) => rows.reduce((best, row) => (best === null || isBetter(row, best) ? row : best), null);

// The last `count` periods, oldest first, ending with the one running today.
export function recentPeriods(today, payday, count) {
  const current = periodForDate(today, payday);
  return Array.from({ length: count }, (_, index) => shiftPeriod(current, index - count + 1, payday));
}

export function buildStats({ expenses, categories, payday, today, count }) {
  const firstDate = expenses.reduce((first, expense) => (first === null || expense.date < first ? expense.date : first), null);
  const recent = recentPeriods(today, payday, count);
  const periods = recent.filter((period, index) => index === recent.length - 1 || (firstDate !== null && period.end >= firstDate));
  const byPeriod = periods.map((period) => expenses.filter((expense) => isDateInPeriod(expense.date, period)));
  const rows = periods.map((period, index) => {
    const isCurrent = index === periods.length - 1;
    const isPartial = firstDate !== null && firstDate > period.start;
    return { period, total: totalAmount(byPeriod[index]), isCurrent, isPartial, isComplete: !isCurrent && !isPartial };
  });
  const current = rows.at(-1);
  const complete = rows.filter((row) => row.isComplete);
  const completeIndexes = rows.flatMap((row, index) => (row.isComplete ? [index] : []));
  const inRange = byPeriod.flat();
  const categoryRows = totalsByCategory(inRange, categories).map(({ category }) => {
    const totals = byPeriod.map((list) => totalAmount(list.filter((expense) => expense.categoryId === category.id)));
    return { category, totals, average: averageOf(completeIndexes.map((index) => totals[index])) };
  });
  return {
    periods: rows,
    firstDate,
    // While no month has finished yet: the day the first full one will end.
    firstFullEnd: current.isPartial ? shiftPeriod(current.period, 1, payday).end : current.period.end,
    average: averageOf(complete.map((row) => row.total)),
    completeCount: complete.length,
    highest: pick(complete, (row, best) => row.total > best.total),
    lowest: pick(complete, (row, best) => row.total < best.total),
    rangeTotal: totalAmount(inRange),
    categories: categoryRows,
  };
}

// The categories of one period, biggest first; untouched ones follow by their average.
export function categoriesForPeriod(stats, index) {
  return stats.categories
    .map((row) => ({ ...row, amount: row.totals[index] }))
    .sort((a, b) => b.amount - a.amount || b.average - a.average);
}
