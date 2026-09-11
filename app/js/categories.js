// Finding categories: the typeable picker and the quick labels on the shelf.

import { addDays } from './dates.js';
import { categoryNameError, normalizeCategoryName } from './state.js';

const SHELF_WINDOW_DAYS = 60;

function rankMatches(categories, needle) {
  const hits = categories.filter((category) => normalizeCategoryName(category.name).includes(needle));
  const startsWithNeedle = (category) => normalizeCategoryName(category.name).startsWith(needle);
  return [...hits.filter(startsWithNeedle), ...hits.filter((category) => !startsWithNeedle(category))];
}

// matches: active categories to pick; archivedMatch: an archived category the
// query names exactly; createName / createError: whether the query can become new.
export function searchCategories(categories, query) {
  const needle = normalizeCategoryName(query);
  const active = categories.filter((category) => !category.archived);
  if (needle === '') return { matches: active, archivedMatch: null, createName: null, createError: null };

  const exact = categories.find((category) => normalizeCategoryName(category.name) === needle);
  const createError = exact ? null : categoryNameError({ categories }, query);
  return {
    matches: rankMatches(active, needle),
    archivedMatch: exact?.archived ? exact : null,
    createName: exact || createError ? null : query.trim(),
    createError,
  };
}

// The most used active categories of the last weeks, shown in their own order
// so the labels do not jump around under the thumb.
export function shelfCategories(categories, expenses, today, limit) {
  const since = addDays(today, -SHELF_WINDOW_DAYS);
  const uses = new Map();
  for (const expense of expenses) {
    if (expense.date >= since) uses.set(expense.categoryId, (uses.get(expense.categoryId) ?? 0) + 1);
  }
  const active = categories.filter((category) => !category.archived);
  const favourites = new Set(
    [...active].sort((a, b) => (uses.get(b.id) ?? 0) - (uses.get(a.id) ?? 0)).slice(0, limit),
  );
  return active.filter((category) => favourites.has(category));
}
