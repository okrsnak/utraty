// App state and its pure transitions. Every function returns a new state.

import { isValidIsoDate } from './dates.js';
import { MAX_AMOUNT } from './money.js';
import { DEFAULT_STYLE, isStyleId } from './styles.js';
import { DEFAULT_THEME, isThemeId } from './themes.js';

export const STATE_VERSION = 1;
export const DEFAULT_PAYDAY = 10;
export const MAX_CATEGORY_NAME = 24;
export const MAX_NOTE = 200;

const STARTER_CATEGORIES = [
  { id: 'jidlo', name: 'Jídlo' },
  { id: 'tanec', name: 'Tanec' },
  { id: 'najem', name: 'Nájem' },
  { id: 'ostatni', name: 'Ostatní' },
];

export function createInitialState() {
  return {
    version: STATE_VERSION,
    settings: { payday: DEFAULT_PAYDAY, theme: DEFAULT_THEME, style: DEFAULT_STYLE },
    categories: STARTER_CATEGORIES.map((category) => ({ ...category, archived: false })),
    expenses: [],
    recurring: [],
  };
}

const cleanNote = (note) => note.trim().slice(0, MAX_NOTE);

export function createExpense({ amount, categoryId, date, note = '' }, { id, createdAt }) {
  return { id, amount, categoryId, date, note: cleanNote(note), createdAt };
}

const EDITABLE_EXPENSE_FIELDS = ['amount', 'categoryId', 'date', 'note'];

function checkExpenseField(field, value) {
  if (field === 'amount' && !(Number.isInteger(value) && value > 0 && value <= MAX_AMOUNT)) {
    throw new RangeError(`Neplatná částka: ${value}`);
  }
  if (field === 'date' && !isValidIsoDate(value)) throw new RangeError(`Neplatné datum: ${value}`);
  if (field === 'categoryId' && !(typeof value === 'string' && value.length > 0)) throw new RangeError('Chybí kategorie.');
}

// Changes what a person may edit on a written expense (amount, category, date,
// note); id, createdAt and recurringId stay as they were.
export function updateExpense(state, expenseId, changes) {
  if (!state.expenses.some((expense) => expense.id === expenseId)) return state;
  const patch = Object.fromEntries(EDITABLE_EXPENSE_FIELDS.filter((field) => field in changes).map((field) => {
    checkExpenseField(field, changes[field]);
    return [field, field === 'note' ? cleanNote(changes[field]) : changes[field]];
  }));
  return {
    ...state,
    expenses: state.expenses.map((expense) => (expense.id === expenseId ? { ...expense, ...patch } : expense)),
  };
}

export function setExpenseNote(state, expenseId, note) {
  return updateExpense(state, expenseId, { note });
}

// Why an edited expense cannot be saved yet, or null. Any existing category
// counts (an archived one may stay); the day cannot be in the future.
export function expenseEditError({ amount, categoryId, date }, categories, today) {
  if (!Number.isInteger(amount) || amount <= 0 || amount > MAX_AMOUNT) return 'Zadej částku.';
  if (!categories.some((category) => category.id === categoryId)) return 'Vyber kategorii.';
  if (!isValidIsoDate(date)) return 'Zadej datum.';
  if (date > today) return 'Datum nemůže být v budoucnu.';
  return null;
}

// An id that is already stored is never added twice (e.g. an undo racing a restore).
export function addExpense(state, expense) {
  if (state.expenses.some((existing) => existing.id === expense.id)) return state;
  return { ...state, expenses: [...state.expenses, expense] };
}

export function removeExpense(state, expenseId) {
  return { ...state, expenses: state.expenses.filter((expense) => expense.id !== expenseId) };
}

const updateCategory = (state, categoryId, patch) => ({
  ...state,
  categories: state.categories.map((category) => (category.id === categoryId ? { ...category, ...patch } : category)),
});

export function addCategory(state, { id, name }) {
  return { ...state, categories: [...state.categories, { id, name: name.trim(), archived: false }] };
}

// Only an unused category can go; one with history stays (archive it instead).
export function removeCategory(state, categoryId) {
  if (state.expenses.some((expense) => expense.categoryId === categoryId)) return state;
  return { ...state, categories: state.categories.filter((category) => category.id !== categoryId) };
}

export function renameCategory(state, categoryId, name) {
  return updateCategory(state, categoryId, { name: name.trim() });
}

export function setCategoryArchived(state, categoryId, archived) {
  return updateCategory(state, categoryId, { archived });
}

export function activeCategories(state) {
  return state.categories.filter((category) => !category.archived);
}

export function isValidPayday(value) {
  return Number.isInteger(value) && value >= 1 && value <= 31;
}

export function setTheme(state, themeId) {
  if (!isThemeId(themeId)) throw new RangeError(`Neznámé barevné schéma: ${themeId}`);
  return { ...state, settings: { ...state.settings, theme: themeId } };
}

export function setStyle(state, styleId) {
  if (!isStyleId(styleId)) throw new RangeError(`Neznámý styl: ${styleId}`);
  return { ...state, settings: { ...state.settings, style: styleId } };
}

export function setPayday(state, payday) {
  if (!isValidPayday(payday)) throw new RangeError(`Den výplaty musí být celé číslo 1–31, ne ${payday}.`);
  return { ...state, settings: { ...state.settings, payday } };
}

// Case- and accent-insensitive form, so "najem" and "Nájem" count as one name.
export function normalizeCategoryName(name) {
  return name.normalize('NFD').replace(/\p{M}/gu, '').trim().toLocaleLowerCase('cs');
}

export function categoryNameError(state, name, exceptId = null) {
  const trimmed = name.trim();
  if (trimmed === '') return 'Napiš název kategorie.';
  if (trimmed.length > MAX_CATEGORY_NAME) return `Název je moc dlouhý (nejvýš ${MAX_CATEGORY_NAME} znaků).`;
  const wanted = normalizeCategoryName(trimmed);
  const taken = state.categories.some(
    (category) => category.id !== exceptId && normalizeCategoryName(category.name) === wanted,
  );
  return taken ? 'Kategorie s tímhle názvem už existuje.' : null;
}
