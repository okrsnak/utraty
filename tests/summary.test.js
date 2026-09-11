import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  expensesInPeriod,
  totalAmount,
  totalsByCategory,
  categoryBreakdown,
  niceScale,
  groupByDate,
  dailyAverage,
} from '../app/js/summary.js';
import { periodForDate } from '../app/js/period.js';

const categories = [
  { id: 'jidlo', name: 'Jídlo', archived: false },
  { id: 'tanec', name: 'Tanec', archived: false },
  { id: 'najem', name: 'Nájem', archived: false },
  { id: 'kino', name: 'Kino', archived: true },
];

const expense = (id, amount, categoryId, date, createdAt) => ({ id, amount, categoryId, date, note: '', createdAt });

const expenses = [
  expense('a', 25000, 'jidlo', '2026-09-10', 1),
  expense('b', 1500000, 'najem', '2026-09-12', 2),
  expense('c', 12990, 'jidlo', '2026-09-12', 3),
  expense('d', 60000, 'tanec', '2026-10-09', 4),
  expense('e', 9900, 'jidlo', '2026-09-09', 5),
  expense('f', 20000, 'kino', '2026-09-20', 6),
  expense('g', 5000, 'smazana', '2026-09-21', 7),
];

const period = periodForDate('2026-09-11', 10);

test('expensesInPeriod keeps only the period, newest first', () => {
  assert.deepEqual(expensesInPeriod(expenses, period).map((e) => e.id), ['d', 'g', 'f', 'c', 'b', 'a']);
});

test('totalAmount sums haléře', () => {
  assert.equal(totalAmount(expensesInPeriod(expenses, period)), 1622990);
  assert.equal(totalAmount([]), 0);
});

test('totalsByCategory sorts by spend and keeps archived and unknown categories', () => {
  const rows = totalsByCategory(expensesInPeriod(expenses, period), categories);
  assert.deepEqual(rows.map((row) => [row.category.id, row.total, row.count]), [
    ['najem', 1500000, 1],
    ['tanec', 60000, 1],
    ['jidlo', 37990, 2],
    ['kino', 20000, 1],
    ['smazana', 5000, 1],
  ]);
  assert.equal(rows.at(-1).category.name, 'Bez kategorie');
});

test('totalsByCategory is empty without expenses', () => {
  assert.deepEqual(totalsByCategory([], categories), []);
});

test('categoryBreakdown adds active categories without spend at zero, in their own order', () => {
  const previous = periodForDate('2026-09-09', 10);
  const rows = categoryBreakdown(expensesInPeriod(expenses, previous), categories);
  assert.deepEqual(rows.map((row) => [row.category.id, row.total, row.count]), [
    ['jidlo', 9900, 1],
    ['tanec', 0, 0],
    ['najem', 0, 0],
  ]);
});

test('niceScale picks a round step of 1, 2 or 5 × 10ⁿ Kč with at most five divisions', () => {
  assert.deepEqual(niceScale(1500000), { step: 500000, max: 1500000 });
  assert.deepEqual(niceScale(60000), { step: 20000, max: 60000 });
  assert.deepEqual(niceScale(37990), { step: 10000, max: 40000 });
  assert.deepEqual(niceScale(100), { step: 100, max: 100 });
  assert.deepEqual(niceScale(0), { step: 100, max: 100 });
});

test('groupByDate groups newest day first with day totals', () => {
  const groups = groupByDate(expensesInPeriod(expenses, period));
  assert.deepEqual(groups.map((group) => [group.date, group.total, group.expenses.length]), [
    ['2026-10-09', 60000, 1],
    ['2026-09-21', 5000, 1],
    ['2026-09-20', 20000, 1],
    ['2026-09-12', 1512990, 2],
    ['2026-09-10', 25000, 1],
  ]);
});

test('summary helpers never mutate their input', () => {
  const snapshot = structuredClone(expenses);
  groupByDate(expensesInPeriod(expenses, period));
  totalsByCategory(expenses, categories);
  assert.deepEqual(expenses, snapshot);
});

test('dailyAverage divides by the days lived so far, or by the whole past period', () => {
  assert.equal(dailyAverage(100000, period, '2026-09-11'), 50000);
  assert.equal(dailyAverage(100000, periodForDate('2026-08-15', 10), '2026-09-11'), 3226);
  assert.equal(dailyAverage(0, period, '2026-09-11'), 0);
});
