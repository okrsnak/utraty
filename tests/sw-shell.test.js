import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = fileURLToPath(new URL('../app/', import.meta.url));

function filesUnder(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

test('the service worker precaches exactly the files the app ships', () => {
  const source = readFileSync(join(APP, 'sw.js'), 'utf8');
  const shell = source
    .match(/const SHELL = \[([\s\S]*?)\];/)[1]
    .match(/'\.\/[^']*'/g)
    .map((entry) => entry.slice(3, -1))
    .filter((entry) => entry !== '');
  const shipped = filesUnder(APP)
    .map((path) => relative(APP, path))
    .filter((path) => path !== 'sw.js' && !path.split('/').some((part) => part.startsWith('.')));
  assert.deepEqual([...shell].sort(), [...shipped].sort());
});
