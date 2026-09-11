// Schema check for everything read from outside the running app (localStorage,
// imported backups). Structural problems reject the data; single broken or
// duplicate records are dropped and counted, so one bad entry never costs the
// rest. The result carries only known fields.

import { isValidIsoDate } from './dates.js';
import { MAX_AMOUNT } from './money.js';
import { MAX_RECURRING_NAME, isValidFrequency } from './recurring.js';
import { DEFAULT_STYLE, isStyleId } from './styles.js';
import { DEFAULT_THEME, isThemeId } from './themes.js';
import { STATE_VERSION, MAX_CATEGORY_NAME, MAX_NOTE, isValidPayday } from './state.js';

const MAX_ID = 64;

const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
const isId = (value) => typeof value === 'string' && value.length > 0 && value.length <= MAX_ID;
const fail = (error) => ({ ok: false, error });

function cleanCategory(raw) {
  if (!isPlainObject(raw) || !isId(raw.id) || typeof raw.archived !== 'boolean') return null;
  if (typeof raw.name !== 'string' || raw.name.trim() === '' || raw.name.length > MAX_CATEGORY_NAME) return null;
  return { id: raw.id, name: raw.name, archived: raw.archived };
}

function cleanExpense(raw) {
  if (!isPlainObject(raw) || !isId(raw.id) || !isId(raw.categoryId)) return null;
  if (!Number.isInteger(raw.amount) || raw.amount <= 0 || raw.amount > MAX_AMOUNT) return null;
  if (!isValidIsoDate(raw.date) || typeof raw.note !== 'string' || raw.note.length > MAX_NOTE) return null;
  if (!Number.isFinite(raw.createdAt)) return null;
  const expense = {
    id: raw.id,
    amount: raw.amount,
    categoryId: raw.categoryId,
    date: raw.date,
    note: raw.note,
    createdAt: raw.createdAt,
  };
  return isId(raw.recurringId) ? { ...expense, recurringId: raw.recurringId } : expense;
}

function cleanRecurring(raw) {
  if (!isPlainObject(raw) || !isId(raw.id) || !isId(raw.categoryId)) return null;
  if (typeof raw.name !== 'string' || raw.name.trim() === '' || raw.name.length > MAX_RECURRING_NAME) return null;
  if (!Number.isInteger(raw.amount) || raw.amount <= 0 || raw.amount > MAX_AMOUNT) return null;
  if (!isValidFrequency(raw.everyMonths) || !isValidIsoDate(raw.firstDate)) return null;
  const lastDate = raw.lastDate ?? null;
  if (lastDate !== null && !isValidIsoDate(lastDate)) return null;
  return {
    id: raw.id,
    name: raw.name,
    amount: raw.amount,
    categoryId: raw.categoryId,
    everyMonths: raw.everyMonths,
    firstDate: raw.firstDate,
    lastDate,
  };
}

// Keeps each valid item whose id was not seen yet; the first of duplicates wins.
function cleanList(rawList, cleanItem) {
  const seen = new Set();
  const items = [];
  for (const raw of rawList) {
    const item = cleanItem(raw);
    if (item && !seen.has(item.id)) {
      seen.add(item.id);
      items.push(item);
    }
  }
  return { items, dropped: rawList.length - items.length };
}

export function validateState(data) {
  if (!isPlainObject(data) || data.version !== STATE_VERSION) return fail('Data nejsou ve formátu appky Útraty.');
  if (!isPlainObject(data.settings) || !isValidPayday(data.settings.payday)) {
    return fail('Den výplaty musí být celé číslo 1–31.');
  }
  if (!Array.isArray(data.categories)) return fail('Seznam kategorií chybí.');
  if (!Array.isArray(data.expenses)) return fail('Seznam útrat chybí.');
  // Data saved before recurring payments existed has no list at all.
  if (data.recurring !== undefined && !Array.isArray(data.recurring)) return fail('Seznam pravidelných plateb je poškozený.');

  const categories = cleanList(data.categories, cleanCategory);
  const expenses = cleanList(data.expenses, cleanExpense);
  const recurring = cleanList(data.recurring ?? [], cleanRecurring);
  return {
    ok: true,
    state: {
      version: STATE_VERSION,
      // An unknown or missing scheme or style (older data) falls back to the default.
      settings: {
        payday: data.settings.payday,
        theme: isThemeId(data.settings.theme) ? data.settings.theme : DEFAULT_THEME,
        style: isStyleId(data.settings.style) ? data.settings.style : DEFAULT_STYLE,
      },
      categories: categories.items,
      expenses: expenses.items,
      recurring: recurring.items,
    },
    dropped: categories.dropped + expenses.dropped + recurring.dropped,
  };
}
