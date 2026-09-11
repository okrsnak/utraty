import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateState } from '../app/js/validate.js';
import { createInitialState, createExpense, addExpense } from '../app/js/state.js';

const validState = () => addExpense(
  createInitialState(),
  createExpense({ amount: 25000, categoryId: 'jidlo', date: '2026-09-11', note: '' }, { id: 'e1', createdAt: 1 }),
);

test('a state produced by the app validates unchanged', () => {
  assert.deepEqual(validateState(validState()), { ok: true, state: validState(), dropped: 0 });
});

test('unknown fields are dropped', () => {
  const state = validState();
  const result = validateState({ ...state, extra: 1, expenses: [{ ...state.expenses[0], injected: '<script>' }] });
  assert.equal(result.ok, true);
  assert.equal(result.dropped, 0);
  assert.equal('extra' in result.state, false);
  assert.equal('injected' in result.state.expenses[0], false);
});

test('rejects non-objects and other versions', () => {
  for (const bad of [null, 42, 'text', [], { ...validState(), version: 2 }]) {
    assert.equal(validateState(bad).ok, false, JSON.stringify(bad));
  }
});

test('rejects an invalid payday', () => {
  for (const payday of [0, 32, 1.5, '10', undefined]) {
    const result = validateState({ ...validState(), settings: { payday } });
    assert.equal(result.ok, false, String(payday));
    assert.match(result.error, /výplat/);
  }
});

test('rejects missing lists', () => {
  assert.match(validateState({ ...validState(), categories: 'not a list' }).error, /kategori/i);
  assert.match(validateState({ ...validState(), expenses: undefined }).error, /útrat/i);
});

test('drops broken categories and counts them', () => {
  const broken = [
    { id: 'a', name: '', archived: false },
    { id: '', name: 'A', archived: false },
    { id: 'a', name: 'A', archived: 'no' },
  ];
  for (const category of broken) {
    const result = validateState({ ...validState(), categories: [category] });
    assert.equal(result.ok, true, JSON.stringify(category));
    assert.deepEqual(result.state.categories, []);
    assert.equal(result.dropped, 1);
  }
});

test('drops duplicate category ids, keeping the first', () => {
  const categories = [{ id: 'a', name: 'A', archived: false }, { id: 'a', name: 'B', archived: false }];
  const result = validateState({ ...validState(), categories });
  assert.deepEqual(result.state.categories.map((category) => category.name), ['A']);
  assert.equal(result.dropped, 1);
});

test('drops broken expenses and keeps the rest', () => {
  const patches = [
    { amount: -5 },
    { amount: 1.5 },
    { amount: 1_000_000_000 },
    { date: '2026-02-30' },
    { note: 'x'.repeat(201) },
    { createdAt: Number.NaN },
    { categoryId: 42 },
    { id: '' },
  ];
  const good = validState().expenses[0];
  for (const patch of patches) {
    const result = validateState({ ...validState(), expenses: [good, { ...good, id: 'e2', ...patch }] });
    assert.equal(result.ok, true, JSON.stringify(patch));
    assert.deepEqual(result.state.expenses.map((expense) => expense.id), ['e1']);
    assert.equal(result.dropped, 1);
  }
});

test('drops duplicate expense ids, keeping the first', () => {
  const state = validState();
  const result = validateState({ ...state, expenses: [...state.expenses, { ...state.expenses[0], amount: 999 }] });
  assert.deepEqual(result.state.expenses.map((expense) => expense.amount), [25000]);
  assert.equal(result.dropped, 1);
});

const rentTemplate = { id: 'r1', name: 'Nájem', amount: 1200000, categoryId: 'najem', everyMonths: 1, firstDate: '2026-09-15', lastDate: null };

test('older data without recurring payments loads with an empty list', () => {
  const { recurring: _missing, ...older } = validState();
  const result = validateState(older);
  assert.equal(result.ok, true);
  assert.deepEqual(result.state.recurring, []);
  assert.equal(result.dropped, 0);
});

test('a recurring list that is not a list is rejected', () => {
  assert.equal(validateState({ ...validState(), recurring: 'x' }).ok, false);
});

test('broken recurring payments are dropped and counted', () => {
  const recurring = [
    rentTemplate,
    { ...rentTemplate, id: 'r2', everyMonths: 2 },
    { ...rentTemplate, id: 'r3', lastDate: 'soon' },
    { ...rentTemplate, id: 'r4', name: '' },
    'junk',
  ];
  const result = validateState({ ...validState(), recurring });
  assert.deepEqual(result.state.recurring, [rentTemplate]);
  assert.equal(result.dropped, 4);
});

test('an expense keeps a valid recurringId and loses an invalid one', () => {
  const base = validState().expenses[0];
  const result = validateState({ ...validState(), expenses: [{ ...base, recurringId: 'r1' }, { ...base, id: 'e2', recurringId: 42 }] });
  assert.equal(result.state.expenses[0].recurringId, 'r1');
  assert.equal('recurringId' in result.state.expenses[1], false);
  assert.equal(result.dropped, 0);
});
