import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildStats, categoriesForPeriod, recentPeriods } from '../app/js/stats.js';

const categories = [
  { id: 'jidlo', name: 'Jídlo', archived: false },
  { id: 'tanec', name: 'Tanec', archived: false },
  { id: 'najem', name: 'Nájem', archived: false },
  { id: 'ostatni', name: 'Ostatní', archived: false },
  { id: 'kino', name: 'Kino', archived: true },
];

const expense = (id, amount, categoryId, date) => ({ id, amount, categoryId, date, note: '', createdAt: 0 });

// July period (10. 7.–9. 8.), August period, and the running September period.
// Writing starts on payday, so July counts as a full month.
const expenses = [
  expense('a', 100000, 'jidlo', '2026-07-10'),
  expense('b', 50000, 'tanec', '2026-08-01'),
  expense('c', 200000, 'jidlo', '2026-08-20'),
  expense('d', 30000, 'jidlo', '2026-09-11'),
  expense('e', 1200000, 'najem', '2026-09-10'),
  expense('f', 9900, 'kino', '2026-08-12'),
];

const stats = (count, list = expenses) => buildStats({ expenses: list, categories, payday: 10, today: '2026-09-11', count });

test('recentPeriods ends with the running period, oldest first', () => {
  assert.deepEqual(recentPeriods('2026-09-11', 10, 3).map((period) => period.start), ['2026-07-10', '2026-08-10', '2026-09-10']);
  assert.deepEqual(recentPeriods('2026-01-05', 10, 2).map((period) => period.start), ['2025-11-10', '2025-12-10']);
});

test('buildStats totals every period and marks the running one', () => {
  const { periods } = stats(3);
  assert.deepEqual(periods.map((row) => [row.period.start, row.total, row.isCurrent]), [
    ['2026-07-10', 150000, false],
    ['2026-08-10', 209900, false],
    ['2026-09-10', 1230000, true],
  ]);
});

test('the average, highest and lowest use complete periods only', () => {
  const result = stats(3);
  assert.equal(result.average, 179950);
  assert.equal(result.highest.period.start, '2026-08-10');
  assert.equal(result.lowest.period.start, '2026-07-10');
  assert.equal(result.completeCount, 2);
  assert.equal(result.rangeTotal, 1589900);
});

test('months before the first expense are left out, so they do not dilute the average', () => {
  const result = stats(6);
  assert.deepEqual(result.periods.map((row) => row.period.start), ['2026-07-10', '2026-08-10', '2026-09-10']);
  assert.equal(result.completeCount, 2);
  assert.equal(result.average, 179950);
});

test('a month where writing started part-way is shown but left out of the average', () => {
  const lateStart = expenses.map((item) => (item.id === 'a' ? { ...item, date: '2026-07-15' } : item));
  const result = stats(3, lateStart);
  assert.equal(result.firstDate, '2026-07-15');
  assert.deepEqual(result.periods.map((row) => [row.total, row.isPartial, row.isComplete]), [
    [150000, true, false],
    [209900, false, true],
    [1230000, false, false],
  ]);
  assert.equal(result.completeCount, 1);
  assert.equal(result.average, 209900);
  assert.equal(result.lowest.period.start, '2026-08-10');
});

test('an empty period after tracking started counts as zero', () => {
  const withGap = expenses.filter((item) => item.date < '2026-08-10' || item.date >= '2026-09-10');
  const result = stats(3, withGap);
  assert.equal(result.completeCount, 2);
  assert.equal(result.average, 75000);
  assert.equal(result.lowest.total, 0);
});

test('with only the running period there is no average yet', () => {
  const result = stats(3, [expense('x', 5000, 'jidlo', '2026-09-11')]);
  assert.equal(result.periods.length, 1);
  assert.equal(result.average, 0);
  assert.equal(result.completeCount, 0);
  assert.equal(result.highest, null);
  assert.equal(result.lowest, null);
});

test('firstFullEnd names the day the first full month ends', () => {
  assert.equal(stats(3, [expense('x', 5000, 'jidlo', '2026-09-10')]).firstFullEnd, '2026-10-09');
  assert.equal(stats(3, [expense('x', 5000, 'jidlo', '2026-09-11')]).firstFullEnd, '2026-11-09');
});

test('categories carry their total per period and their average', () => {
  const byId = Object.fromEntries(stats(3).categories.map((row) => [row.category.id, row]));
  assert.deepEqual(byId.jidlo.totals, [100000, 200000, 30000]);
  assert.equal(byId.jidlo.average, 150000);
  assert.deepEqual(byId.najem.totals, [0, 0, 1200000]);
  assert.equal(byId.najem.average, 0);
  assert.equal(byId.kino.average, 4950);
  assert.equal('ostatni' in byId, false);
});

test('categoriesForPeriod sorts by the chosen period, then by average', () => {
  const result = stats(3);
  assert.deepEqual(categoriesForPeriod(result, 2).map((row) => [row.category.id, row.amount]), [
    ['najem', 1200000],
    ['jidlo', 30000],
    ['tanec', 0],
    ['kino', 0],
  ]);
  assert.deepEqual(categoriesForPeriod(result, 1).map((row) => row.category.id), ['jidlo', 'kino', 'tanec', 'najem']);
});
