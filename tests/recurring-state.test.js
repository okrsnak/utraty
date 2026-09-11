import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addRecurring,
  updateRecurring,
  removeRecurring,
  restoreRecurring,
  recurringError,
  applyDueRecurring,
  upcomingInPeriod,
} from '../app/js/recurring.js';
import { createInitialState, removeExpense } from '../app/js/state.js';
import { periodForDate } from '../app/js/period.js';

const rent = { id: 'r1', name: 'Nájem', amount: 1200000, categoryId: 'najem', everyMonths: 1, firstDate: '2026-09-15', lastDate: null };
const withRent = () => ({ ...createInitialState(), recurring: [rent] });

test('addRecurring, updateRecurring and removeRecurring keep everything else intact', () => {
  const base = createInitialState();
  const added = addRecurring(base, { ...rent, name: '  Nájem  ', lastDate: '2020-01-01' });
  assert.deepEqual(added.recurring, [rent]);
  assert.deepEqual(base.recurring, []);

  const updated = updateRecurring(added, 'r1', { amount: 1250000, name: ' Nájem byt ', id: 'hacked', lastDate: '2030-01-01' });
  assert.deepEqual(updated.recurring[0], { ...rent, amount: 1250000, name: 'Nájem byt' });
  assert.deepEqual(removeRecurring(updated, 'r1').recurring, []);
});

test('restoreRecurring puts a removed payment back with its history', () => {
  const written = { ...rent, lastDate: '2026-09-15' };
  const state = { ...createInitialState(), recurring: [written] };
  const removed = removeRecurring(state, 'r1');
  assert.deepEqual(restoreRecurring(removed, written).recurring, [written]);
  assert.equal(restoreRecurring(state, written), state);
});

test('recurringError explains what is missing', () => {
  const { categories } = createInitialState();
  const valid = { name: 'Nájem', amount: 1200000, categoryId: 'najem', everyMonths: 1, firstDate: '2026-09-15' };
  assert.equal(recurringError(valid, categories), null);
  assert.match(recurringError({ ...valid, name: '  ' }, categories), /název/i);
  assert.match(recurringError({ ...valid, name: 'x'.repeat(41) }, categories), /dlouhý/i);
  assert.match(recurringError({ ...valid, amount: null }, categories), /částk/i);
  assert.match(recurringError({ ...valid, categoryId: 'nope' }, categories), /kategori/i);
  assert.match(recurringError({ ...valid, everyMonths: 2 }, categories), /často/i);
  assert.match(recurringError({ ...valid, firstDate: '2026-02-30' }, categories), /datum/i);
});

test('applyDueRecurring adds each due payment once and remembers the last one', () => {
  const first = applyDueRecurring(withRent(), '2026-10-20', 7);
  assert.deepEqual(first.added.map((e) => [e.id, e.date, e.amount, e.categoryId, e.note, e.recurringId, e.createdAt]), [
    ['r1:2026-09-15', '2026-09-15', 1200000, 'najem', 'Nájem', 'r1', 7],
    ['r1:2026-10-15', '2026-10-15', 1200000, 'najem', 'Nájem', 'r1', 7],
  ]);
  assert.equal(first.state.recurring[0].lastDate, '2026-10-15');
  assert.equal(first.state.expenses.length, 2);

  const again = applyDueRecurring(first.state, '2026-10-20', 8);
  assert.deepEqual(again.added, []);
  assert.equal(again.state, first.state);
});

test('nothing is added before the first payment', () => {
  const result = applyDueRecurring(withRent(), '2026-09-14', 7);
  assert.deepEqual(result.added, []);
  assert.equal(result.state.recurring[0].lastDate, null);
});

test('a generated payment deleted by hand does not come back', () => {
  const { state } = applyDueRecurring(withRent(), '2026-09-20', 7);
  const deleted = removeExpense(state, 'r1:2026-09-15');
  assert.deepEqual(applyDueRecurring(deleted, '2026-09-25', 8).added, []);
});

test('a payment already stored under the same id is not added twice', () => {
  const { state } = applyDueRecurring(withRent(), '2026-09-20', 7);
  const forgotten = { ...state, recurring: [{ ...state.recurring[0], lastDate: null }] };
  const result = applyDueRecurring(forgotten, '2026-09-20', 8);
  assert.deepEqual(result.added, []);
  assert.equal(result.state.expenses.length, 1);
});

test('upcomingInPeriod lists payments still to come before the next payday', () => {
  const period = periodForDate('2026-09-11', 10);
  const netflix = { id: 'n1', name: 'Netflix', amount: 25900, categoryId: 'ostatni', everyMonths: 1, firstDate: '2026-08-05', lastDate: '2026-09-05' };
  const insurance = { id: 'p1', name: 'Pojištění', amount: 480000, categoryId: 'ostatni', everyMonths: 12, firstDate: '2027-03-01', lastDate: null };
  const rows = upcomingInPeriod([insurance, netflix, rent], '2026-09-11', period);
  assert.deepEqual(rows.map((row) => [row.template.id, row.date]), [['r1', '2026-09-15'], ['n1', '2026-10-05']]);
  assert.deepEqual(upcomingInPeriod([rent], '2026-09-15', period), []);
});
