// The amount being typed on the on-screen keypad, kept as the literal string
// ("1250,5") so the display shows exactly what was pressed.

import { groupThousands } from './money.js';

const MAX_INTEGER_DIGITS = 7;
const MAX_DECIMALS = 2;

export function applyKey(entry, key) {
  if (key === 'back') return entry.slice(0, -1);
  if (key === ',') return entry.includes(',') ? entry : `${entry || '0'},`;
  if (!/^\d$/.test(key)) return entry;

  const [integer, decimals] = entry.split(',');
  if (decimals !== undefined) return decimals.length < MAX_DECIMALS ? entry + key : entry;
  if (integer === '0') return key;
  return integer.length < MAX_INTEGER_DIGITS ? entry + key : entry;
}

export function formatEntry(entry) {
  if (entry === '') return '0';
  const [integer, decimals] = entry.split(',');
  const grouped = groupThousands(integer);
  return decimals === undefined ? grouped : `${grouped},${decimals}`;
}
