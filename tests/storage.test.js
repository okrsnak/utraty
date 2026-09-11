import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  STORAGE_KEY,
  loadState,
  readStoredState,
  saveState,
  listSetAside,
  removeSetAside,
  serializeBackup,
  parseBackup,
  backupFileName,
} from '../app/js/storage.js';
import { createInitialState, createExpense, addExpense } from '../app/js/state.js';

const validState = () => addExpense(
  createInitialState(),
  createExpense({ amount: 25000, categoryId: 'jidlo', date: '2026-09-11', note: 'oběd' }, { id: 'e1', createdAt: 1 }),
);

function fakeStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
    key: (index) => [...data.keys()][index] ?? null,
    get length() {
      return data.size;
    },
  };
}

test('loadState starts fresh when nothing is stored', () => {
  assert.deepEqual(loadState(fakeStorage()), { state: createInitialState(), problem: null });
});

test('saveState and loadState round-trip', () => {
  const storage = fakeStorage();
  assert.deepEqual(saveState(storage, validState()), { ok: true });
  assert.deepEqual(loadState(storage), { state: validState(), problem: null });
});

test('unreadable data is set aside, never overwritten', () => {
  for (const raw of ['{not json', JSON.stringify({ version: 99 })]) {
    const storage = fakeStorage({ [STORAGE_KEY]: raw });
    const { state, problem } = loadState(storage, 1_700_000_000_000);
    assert.deepEqual(state, createInitialState());
    assert.match(problem, /odložen/);
    assert.equal(storage.getItem(`${STORAGE_KEY}.poskozeno.1700000000000`), raw);
  }
});

test('partly damaged data keeps the good records and sets the original aside', () => {
  const raw = JSON.stringify({ ...validState(), expenses: [...validState().expenses, { id: 'bad' }] });
  const storage = fakeStorage({ [STORAGE_KEY]: raw });
  const { state, problem } = loadState(storage, 1_700_000_000_000);
  assert.deepEqual(state, validState());
  assert.match(problem, /1 poškozený záznam/);
  assert.equal(storage.getItem(`${STORAGE_KEY}.poskozeno.1700000000000`), raw);
});

test('when setting aside fails, the unreadable text is handed back', () => {
  const storage = {
    getItem: () => '{broken',
    setItem() {
      throw new DOMException('full', 'QuotaExceededError');
    },
  };
  const result = loadState(storage, 1);
  assert.deepEqual(result.state, createInitialState());
  assert.equal(result.unreadable, '{broken');
  assert.match(result.problem, /nepodařilo odložit/);
});

test('readStoredState reads without side effects', () => {
  const storage = fakeStorage();
  assert.equal(readStoredState(storage), null);
  saveState(storage, validState());
  assert.deepEqual(readStoredState(storage), validState());
  const broken = fakeStorage({ [STORAGE_KEY]: '{oops' });
  assert.equal(readStoredState(broken), null);
  assert.equal(broken.length, 1);
});

test('saveState reports a full storage instead of throwing', () => {
  const storage = {
    setItem() {
      throw new DOMException('full', 'QuotaExceededError');
    },
  };
  const result = saveState(storage, createInitialState());
  assert.equal(result.ok, false);
  assert.match(result.error, /místo/);
});

test('listSetAside finds set-aside copies newest first, removeSetAside deletes only them', () => {
  const storage = fakeStorage({
    [STORAGE_KEY]: '{}',
    [`${STORAGE_KEY}.poskozeno.1`]: 'a',
    [`${STORAGE_KEY}.poskozeno.20`]: 'b',
    other: 'x',
  });
  assert.deepEqual(listSetAside(storage), [
    { key: `${STORAGE_KEY}.poskozeno.20`, raw: 'b' },
    { key: `${STORAGE_KEY}.poskozeno.1`, raw: 'a' },
  ]);
  removeSetAside(storage);
  assert.deepEqual(listSetAside(storage), []);
  assert.equal(storage.getItem('other'), 'x');
  assert.equal(storage.getItem(STORAGE_KEY), '{}');
});

test('a backup round-trips through serializeBackup and parseBackup', () => {
  const text = serializeBackup(validState(), '2026-09-11T10:00:00.000Z');
  const parsed = JSON.parse(text);
  assert.equal(parsed.app, 'utraty');
  assert.equal(parsed.exportedAt, '2026-09-11T10:00:00.000Z');
  assert.deepEqual(parseBackup(text), { ok: true, state: validState(), dropped: 0 });
});

test('parseBackup explains unreadable and foreign files', () => {
  assert.match(parseBackup('{oops').error, /nepodařilo přečíst/);
  assert.match(parseBackup(JSON.stringify({ hello: 1 })).error, /není záloha/);
});

test('parseBackup keeps the good records of a damaged backup and counts the rest', () => {
  const damaged = JSON.parse(serializeBackup(validState(), '2026-09-11T10:00:00.000Z'));
  const result = parseBackup(JSON.stringify({ ...damaged, expenses: [...damaged.expenses, { id: 'bad', amount: 'hodně' }] }));
  assert.equal(result.ok, true);
  assert.equal(result.dropped, 1);
  assert.deepEqual(result.state, validState());
});

test('backupFileName carries the date', () => {
  assert.equal(backupFileName('2026-09-11'), 'utraty-zaloha-2026-09-11.json');
});
