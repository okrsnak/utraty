import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../app/js/app-state.js';

const alwaysSaves = () => ({ ok: true });

test('update applies the transition, persists it and notifies listeners', () => {
  const saved = [];
  const store = createStore({ count: 0 }, (state) => {
    saved.push(state);
    return { ok: true };
  });
  const seen = [];
  store.subscribe((state) => seen.push(state.count));

  assert.deepEqual(store.update((state) => ({ count: state.count + 1 })), { ok: true });
  assert.equal(store.get().count, 1);
  assert.deepEqual(saved, [{ count: 1 }]);
  assert.deepEqual(seen, [1]);
});

test('a failed save keeps the previous state and reports the error', () => {
  const store = createStore({ count: 0 }, () => ({ ok: false, error: 'plno' }));
  const seen = [];
  store.subscribe(() => seen.push('notified'));

  assert.deepEqual(store.update((state) => ({ count: state.count + 1 })), { ok: false, error: 'plno' });
  assert.equal(store.get().count, 0);
  assert.deepEqual(seen, []);
});

test('replace takes in state read from elsewhere without saving it again', () => {
  const saved = [];
  const store = createStore({ count: 0 }, (state) => {
    saved.push(state);
    return { ok: true };
  });
  const seen = [];
  store.subscribe((state) => seen.push(state.count));
  store.replace({ count: 7 });
  assert.equal(store.get().count, 7);
  assert.deepEqual(saved, []);
  assert.deepEqual(seen, [7]);
});

test('unsubscribe stops notifications', () => {
  const store = createStore({ count: 0 }, alwaysSaves);
  const seen = [];
  const unsubscribe = store.subscribe((state) => seen.push(state.count));
  store.update((state) => ({ count: state.count + 1 }));
  unsubscribe();
  store.update((state) => ({ count: state.count + 1 }));
  assert.deepEqual(seen, [1]);
});
