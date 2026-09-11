import { test } from 'node:test';
import assert from 'node:assert/strict';
import { plural } from '../app/js/plural.js';

const EXPENSES = ['útrata', 'útraty', 'útrat'];

test('Czech plural picks the one, few and other forms', () => {
  assert.equal(plural(1, EXPENSES), '1 útrata');
  assert.equal(plural(2, EXPENSES), '2 útraty');
  assert.equal(plural(4, EXPENSES), '4 útraty');
  assert.equal(plural(5, EXPENSES), '5 útrat');
  assert.equal(plural(0, EXPENSES), '0 útrat');
  assert.equal(plural(22, EXPENSES), '22 útrat');
});
