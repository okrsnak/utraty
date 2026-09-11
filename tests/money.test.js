import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAmount, formatAmount, formatNumber, MAX_AMOUNT } from '../app/js/money.js';

const NBSP = '\u00a0';

test('parseAmount reads whole crowns as haléře', () => {
  assert.equal(parseAmount('250'), 25000);
});

test('parseAmount accepts comma or dot decimals and a trailing separator', () => {
  assert.equal(parseAmount('129,90'), 12990);
  assert.equal(parseAmount('129.9'), 12990);
  assert.equal(parseAmount('0,5'), 50);
  assert.equal(parseAmount('12,'), 1200);
});

test('parseAmount ignores grouping spaces', () => {
  assert.equal(parseAmount('1 250'), 125000);
  assert.equal(parseAmount(`1${NBSP}250,50`), 125050);
});

test('parseAmount rejects zero, junk and more than two decimals', () => {
  for (const bad of ['', '0', '0,00', 'abc', '1,234', '-5', '1,2,3', ',', null, undefined, 12]) {
    assert.equal(parseAmount(bad), null, String(bad));
  }
});

test('parseAmount rejects amounts above the limit', () => {
  assert.equal(parseAmount('9999999'), 999999900);
  assert.equal(parseAmount('10000000'), null);
  assert.ok(MAX_AMOUNT >= 999999900);
});

test('formatAmount groups thousands and hides zero decimals', () => {
  assert.equal(formatAmount(25000), `250${NBSP}Kč`);
  assert.equal(formatAmount(125000), `1${NBSP}250${NBSP}Kč`);
  assert.equal(formatAmount(12990), `129,90${NBSP}Kč`);
  assert.equal(formatAmount(12345678), `123${NBSP}456,78${NBSP}Kč`);
  assert.equal(formatAmount(0), `0${NBSP}Kč`);
});

test('formatNumber omits the currency', () => {
  assert.equal(formatNumber(1500050), `15${NBSP}000,50`);
  assert.equal(formatNumber(5), '0,05');
});
