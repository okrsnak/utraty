// App state and its pure transitions. Every function returns a new state.

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
    settings: { payday: DEFAULT_PAYDAY },
    categories: STARTER_CATEGORIES.map((category) => ({ ...category, archived: false })),
    expenses: [],
    recurring: [],
  };
}

const cleanNote = (note) => note.trim().slice(0, MAX_NOTE);

export function createExpense({ amount, categoryId, date, note = '' }, { id, createdAt }) {
  return { id, amount, categoryId, date, note: cleanNote(note), createdAt };
}

export function setExpenseNote(state, expenseId, note) {
  if (!state.expenses.some((expense) => expense.id === expenseId)) return state;
  return {
    ...state,
    expenses: state.expenses.map((expense) => (expense.id === expenseId ? { ...expense, note: cleanNote(note) } : expense)),
  };
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
