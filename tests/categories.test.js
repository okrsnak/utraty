import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchCategories, shelfCategories } from '../app/js/categories.js';

const categories = [
  { id: 'jidlo', name: 'Jídlo', archived: false },
  { id: 'tanec', name: 'Tanec', archived: false },
  { id: 'najem', name: 'Nájem', archived: false },
  { id: 'ostatni', name: 'Ostatní', archived: false },
  { id: 'kino', name: 'Kino', archived: true },
  { id: 'drogerie', name: 'Drogerie', archived: false },
  { id: 'kafe', name: 'Kafe', archived: false },
];

const ids = (list) => list.map((category) => category.id);
const expense = (categoryId, date) => ({ id: `${categoryId}-${date}`, amount: 100, categoryId, date, note: '', createdAt: 0 });

test('an empty query lists every active category in its own order', () => {
  const result = searchCategories(categories, '  ');
  assert.deepEqual(ids(result.matches), ['jidlo', 'tanec', 'najem', 'ostatni', 'drogerie', 'kafe']);
  assert.equal(result.createName, null);
  assert.equal(result.archivedMatch, null);
});

test('search ignores case and diacritics and ranks prefix matches first', () => {
  assert.deepEqual(ids(searchCategories(categories, 'NAJ').matches), ['najem']);
  assert.deepEqual(ids(searchCategories(categories, 'o').matches), ['ostatni', 'jidlo', 'drogerie']);
});

test('an unknown name is offered for creation, trimmed', () => {
  const result = searchCategories(categories, '  Oblečení ');
  assert.deepEqual(result.matches, []);
  assert.equal(result.createName, 'Oblečení');
  assert.equal(result.createError, null);
});

test('a partial match still allows creating the typed name', () => {
  const result = searchCategories(categories, 'Tan');
  assert.deepEqual(ids(result.matches), ['tanec']);
  assert.equal(result.createName, 'Tan');
});

test('an exact match, even without diacritics, blocks a duplicate', () => {
  const result = searchCategories(categories, 'jidlo');
  assert.deepEqual(ids(result.matches), ['jidlo']);
  assert.equal(result.createName, null);
});

test('an archived exact match is offered for restoring instead of creating', () => {
  const result = searchCategories(categories, 'KINO');
  assert.deepEqual(result.matches, []);
  assert.equal(result.archivedMatch.id, 'kino');
  assert.equal(result.createName, null);
});

test('a name over the length limit explains why it cannot be created', () => {
  const result = searchCategories(categories, 'x'.repeat(25));
  assert.equal(result.createName, null);
  assert.match(result.createError, /moc dlouhý/);
});

test('without history the shelf shows the first active categories', () => {
  assert.deepEqual(ids(shelfCategories(categories, [], '2026-09-11', 5)), ['jidlo', 'tanec', 'najem', 'ostatni', 'drogerie']);
});

test('the shelf keeps the most used recent categories, shown in their own order', () => {
  const expenses = [
    expense('kafe', '2026-09-10'),
    expense('kafe', '2026-09-09'),
    expense('drogerie', '2026-09-01'),
    expense('tanec', '2026-05-01'),
    expense('kino', '2026-09-10'),
  ];
  assert.deepEqual(ids(shelfCategories(categories, expenses, '2026-09-11', 3)), ['jidlo', 'drogerie', 'kafe']);
});
