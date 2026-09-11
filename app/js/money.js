// Amounts are integer haléře (1 Kč = 100 haléřů), so sums never drift.

export const MAX_AMOUNT = 999_999_999;

const NBSP = '\u00a0';
const AMOUNT_PATTERN = /^(\d+)(?:[.,](\d{0,2}))?$/;

export function parseAmount(text) {
  if (typeof text !== 'string') return null;
  const match = AMOUNT_PATTERN.exec(text.replace(/\s/g, ''));
  if (!match) return null;
  const [, crowns, fraction = ''] = match;
  const amount = Number(crowns) * 100 + Number(fraction.padEnd(2, '0'));
  return amount > 0 && amount <= MAX_AMOUNT ? amount : null;
}

export function groupThousands(digits) {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

export function formatNumber(amount) {
  const crowns = groupThousands(String(Math.trunc(amount / 100)));
  const fraction = amount % 100;
  return fraction === 0 ? crowns : `${crowns},${String(fraction).padStart(2, '0')}`;
}

export function formatAmount(amount) {
  return `${formatNumber(amount)}${NBSP}Kč`;
}
