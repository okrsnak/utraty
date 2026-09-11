import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DEFAULT_STYLE, STYLES, isStyleId } from '../app/js/styles.js';
import { createInitialState, setStyle } from '../app/js/state.js';
import { validateState } from '../app/js/validate.js';

const css = (name) => readFileSync(fileURLToPath(new URL(`../app/css/${name}`, import.meta.url)), 'utf8');
const stored = (settings) => ({ ...createInitialState(), settings });

test('the app ships two styles and the sharp one is the default', () => {
  assert.equal(DEFAULT_STYLE, 'cenovka');
  assert.deepEqual(STYLES.map((style) => style.id), ['cenovka', 'pastelka']);
  for (const style of STYLES) assert.ok(style.name && style.description, style.id);
});

test('isStyleId knows only the listed styles', () => {
  assert.equal(isStyleId('pastelka'), true);
  assert.equal(isStyleId('nakresleno'), false);
  assert.equal(isStyleId(undefined), false);
});

test('a new state starts in the default style', () => {
  assert.equal(createInitialState().settings.style, DEFAULT_STYLE);
});

test('setStyle changes only the style and refuses an unknown one', () => {
  const next = setStyle(createInitialState(), 'pastelka');
  assert.equal(next.settings.style, 'pastelka');
  assert.equal(next.settings.theme, createInitialState().settings.theme);
  assert.equal(next.settings.payday, createInitialState().settings.payday);
  assert.throws(() => setStyle(createInitialState(), 'nakresleno'), RangeError);
});

test('saved data without a style, or with an unknown one, falls back to the default', () => {
  assert.equal(validateState(stored({ payday: 10, theme: 'marcipan' })).state.settings.style, DEFAULT_STYLE);
  assert.equal(validateState(stored({ payday: 10, theme: 'marcipan', style: 'skica' })).state.settings.style, DEFAULT_STYLE);
  assert.equal(validateState(stored({ payday: 10, theme: 'marcipan', style: 'pastelka' })).state.settings.style, 'pastelka');
});

test('the drawn style brings its own CSS layer and its own face', () => {
  const source = css('pastelka.css');
  assert.match(source, /\[data-style='pastelka'\]/);
  assert.match(source, /@font-face/);
});
