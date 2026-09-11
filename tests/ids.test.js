import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createId } from '../app/js/ids.js';

test('createId uses crypto.randomUUID when it exists', () => {
  assert.equal(createId({ randomUUID: () => 'uuid-1' }), 'uuid-1');
});

test('createId falls back to unique short ids without randomUUID', () => {
  const ids = new Set(Array.from({ length: 1000 }, () => createId({})));
  assert.equal(ids.size, 1000);
  for (const id of ids) assert.match(id, /^[a-z0-9-]{8,64}$/);
});
