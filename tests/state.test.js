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
  setTheme,
  activeCategories,
  categoryNameError,
  setExpenseNote,
  updateExpense,
  expenseEditError,
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
  assert.deepEqual(state.recurring, []);
  assert.equal(state.settings.theme, 'cenovka');
});

test('setTheme switches to a listed scheme and refuses anything else', () => {
  assert.equal(setTheme(createInitialState(), 'marcipan').settings.theme, 'marcipan');
  assert.equal(setTheme(createInitialState(), 'marcipan').settings.payday, 10);
  assert.throws(() => setTheme(createInitialState(), 'neon'), RangeError);
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

test('updateExpense changes the amount and note of one expense', () => {
  const state = addExpense(createInitialState(), lunch);
  const edited = updateExpense(state, 'x1', { amount: 15000, note: '  menu a dezert ' }).expenses[0];
  assert.equal(edited.amount, 15000);
  assert.equal(edited.note, 'menu a dezert');
  assert.equal(edited.categoryId, 'jidlo');
  assert.equal(state.expenses[0].amount, 12990);
  assert.equal(updateExpense(state, 'missing', { amount: 100 }), state);
});

test('updateExpense refuses an amount outside the valid range', () => {
  const state = addExpense(createInitialState(), lunch);
  for (const bad of [0, -100, 1.5, 1_000_000_000, '100']) {
    assert.throws(() => updateExpense(state, 'x1', { amount: bad }), RangeError, String(bad));
  }
});

test('updateExpense moves an expense to another category and day', () => {
  const state = addExpense(createInitialState(), lunch);
  const edited = updateExpense(state, 'x1', { categoryId: 'tanec', date: '2026-09-10' }).expenses[0];
  assert.equal(edited.categoryId, 'tanec');
  assert.equal(edited.date, '2026-09-10');
  assert.equal(edited.amount, 12990);
});

test('updateExpense refuses an impossible date or an empty category', () => {
  const state = addExpense(createInitialState(), lunch);
  assert.throws(() => updateExpense(state, 'x1', { date: '2026-02-30' }), RangeError);
  assert.throws(() => updateExpense(state, 'x1', { categoryId: '' }), RangeError);
});

test('expenseEditError explains a missing amount, an unknown category or a bad date', () => {
  const { categories } = createInitialState();
  const valid = { amount: 100, categoryId: 'jidlo', date: '2026-09-11' };
  assert.equal(expenseEditError(valid, categories, '2026-09-11'), null);
  assert.match(expenseEditError({ ...valid, amount: null }, categories, '2026-09-11'), /částk/i);
  assert.match(expenseEditError({ ...valid, categoryId: 'nope' }, categories, '2026-09-11'), /kategori/i);
  assert.match(expenseEditError({ ...valid, date: '' }, categories, '2026-09-11'), /datum/i);
  assert.match(expenseEditError({ ...valid, date: '2026-09-12' }, categories, '2026-09-11'), /budoucn/i);
});

test('updateExpense ignores fields it does not own', () => {
  const state = addExpense(createInitialState(), lunch);
  assert.deepEqual(updateExpense(state, 'x1', { id: 'hacked', createdAt: 0, recurringId: 'r1' }).expenses[0], lunch);
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
