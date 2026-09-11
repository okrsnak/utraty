import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  periodForDate,
  shiftPeriod,
  isDateInPeriod,
  formatPeriodLabel,
  daysUntilNextPeriod,
  formatCountdown,
  periodProgress,
} from '../app/js/period.js';

const NBSP = '\u00a0';
const range = (period) => [period.start, period.end];

test('period starts on payday and includes it', () => {
  assert.deepEqual(range(periodForDate('2026-09-10', 10)), ['2026-09-10', '2026-10-09']);
});

test('the day before payday belongs to the previous period', () => {
  assert.deepEqual(range(periodForDate('2026-09-09', 10)), ['2026-08-10', '2026-09-09']);
});

test('a period can span the new year', () => {
  assert.deepEqual(range(periodForDate('2027-01-05', 10)), ['2026-12-10', '2027-01-09']);
});

test('payday on the 1st gives calendar months', () => {
  assert.deepEqual(range(periodForDate('2026-02-15', 1)), ['2026-02-01', '2026-02-28']);
});

test('a payday beyond the month length clamps to its last day', () => {
  assert.deepEqual(range(periodForDate('2026-02-28', 31)), ['2026-02-28', '2026-03-30']);
  assert.deepEqual(range(periodForDate('2026-02-27', 31)), ['2026-01-31', '2026-02-27']);
  assert.deepEqual(range(periodForDate('2028-02-29', 30)), ['2028-02-29', '2028-03-29']);
});

test('shiftPeriod moves by whole periods', () => {
  const current = periodForDate('2026-09-11', 10);
  assert.deepEqual(range(shiftPeriod(current, -1, 10)), ['2026-08-10', '2026-09-09']);
  assert.deepEqual(range(shiftPeriod(current, 4, 10)), ['2027-01-10', '2027-02-09']);
});

test('isDateInPeriod includes both ends', () => {
  const period = periodForDate('2026-09-11', 10);
  assert.equal(isDateInPeriod('2026-09-10', period), true);
  assert.equal(isDateInPeriod('2026-10-09', period), true);
  assert.equal(isDateInPeriod('2026-10-10', period), false);
  assert.equal(isDateInPeriod('2026-09-09', period), false);
});

test('formatPeriodLabel omits the year inside the current year', () => {
  const period = periodForDate('2026-09-11', 10);
  assert.equal(formatPeriodLabel(period, 2026), `10.${NBSP}9. – 9.${NBSP}10.`);
});

test('formatPeriodLabel adds years when the period leaves the current year', () => {
  const period = periodForDate('2026-12-20', 10);
  assert.equal(formatPeriodLabel(period, 2026), `10.${NBSP}12.${NBSP}2026 – 9.${NBSP}1.${NBSP}2027`);
});

test('daysUntilNextPeriod counts down to the next payday', () => {
  const period = periodForDate('2026-09-11', 10);
  assert.equal(daysUntilNextPeriod('2026-09-11', period), 29);
  assert.equal(daysUntilNextPeriod('2026-10-09', period), 1);
});

test('formatCountdown speaks Czech plural and names the eve of payday', () => {
  assert.equal(formatCountdown(1), 'Výplata zítra');
  assert.equal(formatCountdown(3), 'Do výplaty 3 dny');
  assert.equal(formatCountdown(29), 'Do výplaty 29 dní');
});

test('periodProgress runs from 0 on payday towards 1', () => {
  const period = periodForDate('2026-09-10', 10);
  assert.equal(periodProgress('2026-09-10', period), 0);
  assert.equal(periodProgress('2026-09-25', period), 0.5);
  assert.ok(periodProgress('2026-10-09', period) > 0.96);
});
