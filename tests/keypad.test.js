import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyKey, formatEntry } from '../app/js/keypad.js';

const NBSP = '\u00a0';
const type = (keys) => [...keys].reduce(applyKey, '');

test('digits build the amount', () => {
  assert.equal(type('125'), '125');
});

test('a leading zero is replaced, repeated zeros stay single', () => {
  assert.equal(type('05'), '5');
  assert.equal(type('00'), '0');
});

test('a comma starts the decimals, even as the first key', () => {
  assert.equal(type(',5'), '0,5');
  assert.equal(type('1,,2'), '1,2');
  assert.equal(type('0,05'), '0,05');
});

test('at most two decimals and seven integer digits', () => {
  assert.equal(type('9,999'), '9,99');
  assert.equal(type('12345678'), '1234567');
});

test('backspace removes the last character', () => {
  assert.equal(applyKey('12,5', 'back'), '12,');
  assert.equal(applyKey('1', 'back'), '');
  assert.equal(applyKey('', 'back'), '');
});

test('unknown keys are ignored', () => {
  assert.equal(applyKey('12', 'x'), '12');
});

test('formatEntry groups the integer part and keeps what was typed', () => {
  assert.equal(formatEntry(''), '0');
  assert.equal(formatEntry('1250'), `1${NBSP}250`);
  assert.equal(formatEntry('1250,5'), `1${NBSP}250,5`);
  assert.equal(formatEntry('12,'), '12,');
});
