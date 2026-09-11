import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DEFAULT_THEME, THEMES, isThemeId } from '../app/js/themes.js';

// Every colour a scheme has to define, each as a solid #rrggbb.
const COLOR_TOKENS = [
  'tag', 'ink', 'ink-soft', 'ink-line', 'ink-faint', 'strike', 'bar',
  'ground', 'surface', 'key', 'key-pressed', 'key-alt', 'text', 'muted', 'rule', 'hairline',
  'rail', 'rail-text', 'rail-muted', 'rail-track', 'focus',
];

// [foreground, background, minimum ratio]: 4.5 for text, 3 for large text and graphics.
const PAIRS = [
  ['text', 'ground', 4.5], ['text', 'surface', 4.5], ['muted', 'ground', 4.5], ['muted', 'surface', 4.5],
  ['text', 'key', 4.5], ['text', 'key-alt', 4.5],
  ['ink', 'tag', 4.5], ['ink-soft', 'tag', 4.5], ['ink-line', 'tag', 3], ['ink-faint', 'tag', 3],
  ['rail-text', 'rail', 4.5], ['rail-muted', 'rail', 4.5], ['tag', 'rail', 4.5], ['tag', 'rail-track', 3],
  ['strike', 'surface', 3], ['bar', 'surface', 3], ['bar', 'hairline', 3],
  ['rule', 'ground', 3], ['focus', 'ground', 3],
];

const css = (name) => readFileSync(fileURLToPath(new URL(`../app/css/${name}`, import.meta.url)), 'utf8');
const declarations = (body) => Object.fromEntries(
  [...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]),
);

// base.css holds the default scheme as ":root, [data-theme='cenovka'] { … }",
// once plainly and once inside the dark media query.
function defaultPalettes() {
  const [light, dark] = [...css('base.css').matchAll(/:root,\s*\[data-theme='cenovka'\]\s*\{([^}]*)\}/g)].map((match) => declarations(match[1]));
  return { light, dark: { ...light, ...dark } };
}

// themes.css holds "[data-theme='id'] { … }" plus the same selector inside
// "@media (prefers-color-scheme: dark) { … }" for every other scheme.
function otherPalettes() {
  const source = css('themes.css');
  const darkPattern = /@media \(prefers-color-scheme: dark\) \{\s*\[data-theme='([\w-]+)'\]\s*\{([^}]*)\}\s*\}/g;
  const dark = Object.fromEntries([...source.matchAll(darkPattern)].map(([, id, body]) => [id, declarations(body)]));
  const light = Object.fromEntries(
    [...source.replace(darkPattern, '').matchAll(/\[data-theme='([\w-]+)'\]\s*\{([^}]*)\}/g)].map(([, id, body]) => [id, declarations(body)]),
  );
  return Object.fromEntries(Object.keys(light).map((id) => [id, { light: light[id], dark: { ...light[id], ...dark[id] }, hasDark: id in dark }]));
}

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((part) => parseInt(part, 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

const palettes = { [DEFAULT_THEME]: defaultPalettes(), ...otherPalettes() };

test('the scheme list in JS matches the schemes defined in CSS', () => {
  assert.equal(THEMES[0].id, DEFAULT_THEME);
  assert.deepEqual(THEMES.map((theme) => theme.id).sort(), Object.keys(palettes).sort());
  assert.ok(THEMES.length >= 5);
  for (const theme of THEMES) assert.ok(theme.name && theme.description, theme.id);
});

test('isThemeId knows only the listed schemes', () => {
  assert.equal(isThemeId('cenovka'), true);
  assert.equal(isThemeId('neon'), false);
  assert.equal(isThemeId(undefined), false);
});

test('every other scheme has its own dark variant', () => {
  for (const [id, palette] of Object.entries(otherPalettes())) assert.ok(palette.hasDark, id);
});

test('every scheme defines every colour as a solid #rrggbb in both modes', () => {
  for (const [id, palette] of Object.entries(palettes)) {
    for (const mode of ['light', 'dark']) {
      for (const token of COLOR_TOKENS) {
        assert.match(palette[mode][token] ?? 'missing', /^#[0-9a-f]{6}$/i, `${id}/${mode}: --${token}`);
      }
    }
  }
});

test('every scheme stays readable in both modes', () => {
  const failures = [];
  for (const [id, palette] of Object.entries(palettes)) {
    for (const mode of ['light', 'dark']) {
      for (const [fg, bg, minimum] of PAIRS) {
        const ratio = contrast(palette[mode][fg], palette[mode][bg]);
        if (ratio < minimum) failures.push(`${id}/${mode}: --${fg} on --${bg} is ${ratio.toFixed(2)}, needs ${minimum}`);
      }
    }
  }
  assert.deepEqual(failures, []);
});
