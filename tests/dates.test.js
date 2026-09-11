import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidIsoDate,
  addDays,
  daysBetween,
  todayIso,
  formatShortDate,
  formatDayLabel,
} from '../app/js/dates.js';

const NBSP = '\u00a0';

test('isValidIsoDate accepts real calendar dates only', () => {
  assert.equal(isValidIsoDate('2026-09-11'), true);
  assert.equal(isValidIsoDate('2028-02-29'), true);
  for (const bad of ['2026-02-29', '2026-13-01', '2026-00-10', '2026-9-1', '2026-09-31', '', 20260911, null]) {
    assert.equal(isValidIsoDate(bad), false, String(bad));
  }
});

test('addDays crosses month and year boundaries', () => {
  assert.equal(addDays('2026-09-30', 1), '2026-10-01');
  assert.equal(addDays('2027-01-01', -1), '2026-12-31');
  assert.equal(addDays('2028-02-28', 1), '2028-02-29');
});

test('daysBetween counts calendar days, ignoring daylight saving', () => {
  assert.equal(daysBetween('2026-09-11', '2026-10-10'), 29);
  assert.equal(daysBetween('2026-10-10', '2026-09-11'), -29);
  assert.equal(daysBetween('2026-03-28', '2026-03-30'), 2);
});

test('todayIso uses the local calendar date', () => {
  assert.equal(todayIso(new Date(2026, 8, 11, 23, 59)), '2026-09-11');
  assert.equal(todayIso(new Date(2026, 0, 5, 0, 1)), '2026-01-05');
});

test('formatShortDate writes Czech day and month', () => {
  assert.equal(formatShortDate('2026-09-03'), `3.${NBSP}9.`);
});

test('formatDayLabel names today and yesterday, then the weekday', () => {
  assert.equal(formatDayLabel('2026-09-11', '2026-09-11'), 'Dnes');
  assert.equal(formatDayLabel('2026-09-10', '2026-09-11'), 'Včera');
  assert.equal(formatDayLabel('2026-09-03', '2026-09-11'), `Čtvrtek 3.${NBSP}9.`);
  assert.equal(formatDayLabel('2025-12-24', '2026-09-11'), `Středa 24.${NBSP}12.${NBSP}2025`);
});
