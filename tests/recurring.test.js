import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FREQUENCIES, frequencyLabel, occurrencesBetween, nextOccurrence } from '../app/js/recurring.js';

const rent = { id: 'r1', name: 'Nájem', amount: 1200000, categoryId: 'najem', everyMonths: 1, firstDate: '2026-09-15', lastDate: null };

test('monthly occurrences follow the first date and include the end day', () => {
  assert.deepEqual(occurrencesBetween(rent, null, '2026-12-15'), ['2026-09-15', '2026-10-15', '2026-11-15', '2026-12-15']);
  assert.deepEqual(occurrencesBetween(rent, '2026-10-15', '2026-12-14'), ['2026-11-15']);
  assert.deepEqual(occurrencesBetween(rent, null, '2026-09-14'), []);
});

test('a day past the month end clamps, then returns to the original day', () => {
  const endOfMonth = { ...rent, firstDate: '2026-01-31' };
  assert.deepEqual(occurrencesBetween(endOfMonth, null, '2026-04-30'), ['2026-01-31', '2026-02-28', '2026-03-31', '2026-04-30']);
});

test('quarterly and yearly schedules step by their months', () => {
  assert.deepEqual(
    occurrencesBetween({ ...rent, everyMonths: 3, firstDate: '2026-03-01' }, null, '2027-01-01'),
    ['2026-03-01', '2026-06-01', '2026-09-01', '2026-12-01'],
  );
  assert.deepEqual(
    occurrencesBetween({ ...rent, everyMonths: 12, firstDate: '2028-02-29' }, null, '2030-03-01'),
    ['2028-02-29', '2029-02-28', '2030-02-28'],
  );
});

test('occurrencesBetween stops at the safety limit, oldest first', () => {
  const longAgo = occurrencesBetween({ ...rent, firstDate: '2000-01-15' }, null, '2026-09-11', 36);
  assert.equal(longAgo.length, 36);
  assert.equal(longAgo[0], '2000-01-15');
});

test('nextOccurrence finds the first payment after a given day', () => {
  assert.equal(nextOccurrence(rent, '2026-09-11'), '2026-09-15');
  assert.equal(nextOccurrence(rent, '2026-09-15'), '2026-10-15');
  assert.equal(nextOccurrence({ ...rent, everyMonths: 12, firstDate: '2026-03-01' }, '2026-09-11'), '2027-03-01');
});

test('frequencies are monthly, quarterly, half-yearly and yearly', () => {
  assert.deepEqual(FREQUENCIES.map((frequency) => frequency.months), [1, 3, 6, 12]);
  assert.equal(frequencyLabel(1), 'měsíčně');
  assert.equal(frequencyLabel(3), 'čtvrtletně');
  assert.equal(frequencyLabel(6), 'pololetně');
  assert.equal(frequencyLabel(12), 'ročně');
});
