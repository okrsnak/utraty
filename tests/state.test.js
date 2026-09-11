import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialState,
  createExpense,
  addExpense,
  removeExpense,
  addCategory,
  removeCategory,
  renameCategory,
  setCategoryArchived,
  setPayday,
  activeCategories,
  categoryNameError,
  setExpenseNote,
  MAX_NOTE,
} from '../app/js/state.js';

const lunch = createExpense(
  { amount: 12990, categoryId: 'jidlo', date: '2026-09-11', note: '  polední menu  ' },
  { id: 'x1', createdAt: 5 },
);

test('initial state has payday 10 and the starter categories', () => {
  const state = createInitialState();
  assert.equal(state.version, 1);
  assert.equal(state.settings.payday, 10);
  assert.deepEqual(state.categories.map((category) => category.name), ['Jídlo', 'Tanec', 'Nájem', 'Ostatní']);
  assert.deepEqual(state.expenses, []);
});

test('each initial state is an independent copy', () => {
  const first = createInitialState();
  const second = createInitialState();
  assert.notEqual(first.categories, second.categories);
  assert.notEqual(first.categories[0], second.categories[0]);
});

test('createExpense trims the note and stamps id and time', () => {
  assert.deepEqual(lunch, {
    id: 'x1',
    amount: 12990,
    categoryId: 'jidlo',
    date: '2026-09-11',
    note: 'polední menu',
    createdAt: 5,
  });
});

test('addExpense and removeExpense return new states', () => {
  const state = createInitialState();
  const added = addExpense(state, lunch);
  assert.deepEqual(state.expenses, []);
  assert.deepEqual(added.expenses, [lunch]);
  assert.deepEqual(removeExpense(added, 'x1').expenses, []);
  assert.deepEqual(added.expenses, [lunch]);
});

test('setExpenseNote trims the note and changes only that expense', () => {
  const dance = createExpense({ amount: 50000, categoryId: 'tanec', date: '2026-09-11', note: 'kurz' }, { id: 'x2', createdAt: 6 });
  const state = addExpense(addExpense(createInitialState(), lunch), dance);
  const updated = setExpenseNote(state, 'x1', '  Lidl  ');
  const note = (from, id) => from.expenses.find((expense) => expense.id === id).note;
  assert.equal(note(updated, 'x1'), 'Lidl');
  assert.equal(note(updated, 'x2'), 'kurz');
  assert.equal(note(state, 'x1'), 'polední menu');
  assert.equal(note(setExpenseNote(state, 'x1', 'x'.repeat(250)), 'x1').length, MAX_NOTE);
  assert.equal(setExpenseNote(state, 'missing', 'nic'), state);
});

test('addExpense ignores an expense whose id is already stored', () => {
  const added = addExpense(createInitialState(), lunch);
  assert.equal(addExpense(added, lunch), added);
});

test('removeCategory drops an unused category and keeps a used one', () => {
  const withCoffee = addCategory(createInitialState(), { id: 'kafe', name: 'Kafe' });
  assert.equal(removeCategory(withCoffee, 'kafe').categories.some((c) => c.id === 'kafe'), false);
  const used = addExpense(
    withCoffee,
    createExpense({ amount: 100, categoryId: 'kafe', date: '2026-09-11' }, { id: 'k1', createdAt: 1 }),
  );
  assert.equal(removeCategory(used, 'kafe'), used);
});

test('addCategory appends an active category with a trimmed name', () => {
  const state = addCategory(createInitialState(), { id: 'kafe', name: '  Kafe ' });
  assert.deepEqual(state.categories.at(-1), { id: 'kafe', name: 'Kafe', archived: false });
});

test('renameCategory and setCategoryArchived change only their target', () => {
  const renamed = renameCategory(createInitialState(), 'tanec', ' Salsa ');
  assert.equal(renamed.categories.find((c) => c.id === 'tanec').name, 'Salsa');
  assert.equal(renamed.categories.find((c) => c.id === 'jidlo').name, 'Jídlo');

  const archived = setCategoryArchived(renamed, 'najem', true);
  assert.equal(archived.categories.find((c) => c.id === 'najem').archived, true);
  assert.deepEqual(activeCategories(archived).map((c) => c.id), ['jidlo', 'tanec', 'ostatni']);
  assert.equal(setCategoryArchived(archived, 'najem', false).categories.find((c) => c.id === 'najem').archived, false);
});

test('categoryNameError explains empty, long and duplicate names', () => {
  const state = createInitialState();
  assert.equal(categoryNameError(state, '   '), 'Napiš název kategorie.');
  assert.match(categoryNameError(state, 'x'.repeat(25)), /moc dlouhý/);
  assert.equal(categoryNameError(state, ' jídlo '), 'Kategorie s tímhle názvem už existuje.');
  assert.equal(categoryNameError(state, 'NAJEM'), 'Kategorie s tímhle názvem už existuje.');
  assert.equal(categoryNameError(state, 'Jídlo', 'jidlo'), null);
  assert.equal(categoryNameError(state, 'Kafe'), null);
});

test('setPayday accepts whole days 1 to 31 only', () => {
  assert.equal(setPayday(createInitialState(), 15).settings.payday, 15);
  for (const bad of [0, 32, 1.5, '10']) {
    assert.throws(() => setPayday(createInitialState(), bad), RangeError, String(bad));
  }
});
