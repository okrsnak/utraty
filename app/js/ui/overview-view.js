// Přehled: one pay period at a time — the total, categories on one measured
// scale and the day-by-day list. Deleted entries stay struck through for a
// moment with a way back, instead of vanishing. Notes are written in note-editor.js.

import { formatDayLabel, parseIsoDate, todayIso } from '../dates.js';
import { formatAmount } from '../money.js';
import { formatPeriodLabel, periodForDate, shiftPeriod } from '../period.js';
import { plural } from '../plural.js';
import { addExpense, removeExpense } from '../state.js';
import { categoryBreakdown, dailyAverage, expensesInPeriod, groupByDate, niceScale, totalAmount } from '../summary.js';
import { bindings, h, icon, price } from './dom.js';
import { createNoteEditor } from './note-editor.js';

const UNDO_WINDOW_MS = 6000;
const ERROR_TOAST_MS = 8000;
const EXPENSE_FORMS = ['útrata', 'útraty', 'útrat'];

function periodStatus(offset) {
  if (offset === 0) return 'Aktuální období';
  if (offset === -1) return 'Minulé období';
  return `Před ${-offset} obdobími`;
}

export function createOverviewView({ root, store, toast, onAddRequested, now = () => new Date() }) {
  const rail = bindings(root.querySelector('.rail'));
  const body = root.querySelector('#overview');
  const nextButton = root.querySelector('[data-action="next-period"]');
  const notes = createNoteEditor({ body, store, toast, rerender: () => render(store.get()) });
  let offset = 0;
  let struck = new Map(); // expenseId → deleted expense that can still come back
  const forgetTimers = new Map(); // expenseId → timer that ends its undo window

  const without = (map, id) => new Map([...map].filter(([key]) => key !== id));

  function totalTag(expenses, period, day) {
    const total = totalAmount(expenses);
    return h(
      'div',
      { class: 'total-tag' },
      h('span', { class: 'tag__hole', 'aria-hidden': 'true' }),
      h('p', { class: 'total-tag__label' }, 'Celkem za období'),
      h('p', { class: 'total-tag__amount' }, price(total)),
      h(
        'p',
        { class: 'total-tag__unit' },
        h('span', {}, plural(expenses.length, EXPENSE_FORMS)),
        h('span', {}, `${formatAmount(dailyAverage(total, period, day))}/den`),
      ),
    );
  }

  function categoryRow(row, scale) {
    const classes = ['category-row', row.category.archived && 'is-archived', row.total === 0 && 'is-empty'];
    const count = row.total === 0 ? 'nic' : row.category.archived ? `${row.count}× · vyřazená` : `${row.count}×`;
    const ruler = `--share: ${(row.total / scale.max).toFixed(4)}; --tick: ${(scale.step / scale.max).toFixed(4)}`;
    return h(
      'li',
      { class: classes.filter(Boolean).join(' ') },
      h(
        'span',
        { class: 'category-row__name' },
        h('span', { class: 'category-row__label' }, row.category.name),
        h('span', { class: 'category-row__count' }, count),
      ),
      h('span', { class: 'category-row__amount' }, price(row.total)),
      h('span', { class: 'category-row__bar', style: ruler, 'aria-hidden': 'true' }, h('span')),
    );
  }

  // Every category on one ruler; its step is printed once in the heading.
  function categorySection(expenses, categories) {
    const rows = categoryBreakdown(expenses, categories);
    const scale = niceScale(rows[0]?.total ?? 0);
    return h(
      'section',
      { 'aria-labelledby': 'by-category' },
      h(
        'div',
        { class: 'section-head' },
        h('h2', { class: 'section-title', id: 'by-category' }, 'Podle kategorií'),
        h('p', { class: 'section-head__note' }, `dílek ${formatAmount(scale.step)}`),
      ),
      h('ul', { class: 'category-rows' }, ...rows.map((row) => categoryRow(row, scale))),
    );
  }

  // An entry is struck (deleted, restorable), being written on (note input), or
  // plain, where tapping it opens its note.
  function entryRow(expense, categoryName) {
    const label = `${categoryName} ${formatAmount(expense.amount)}`;
    const name = h('span', { class: 'entry__category' }, categoryName);
    const amount = h('span', { class: 'entry__amount' }, price(expense.amount));
    if (struck.has(expense.id)) {
      return h(
        'li',
        { class: 'entry is-struck' },
        h('div', { class: 'entry__main' }, name, h('span', { class: 'entry__struck' }, 'Smazáno')),
        amount,
        h('button', { type: 'button', class: 'entry__restore', dataset: { restore: expense.id }, 'aria-label': `Vrátit útratu ${label}` }, 'Vrátit'),
      );
    }
    if (notes.isEditing(expense.id)) {
      return h(
        'li',
        { class: 'entry is-editing' },
        h('div', { class: 'entry__main' }, name, notes.input(expense, label)),
        amount,
        h('button', { type: 'button', class: 'entry__done', dataset: { noteDone: expense.id } }, 'Hotovo'),
      );
    }
    const note = expense.note
      ? h('span', { class: 'entry__note' }, expense.note)
      : h('span', { class: 'entry__note is-placeholder' }, 'přidat poznámku');
    const describe = expense.note ? `Poznámka: ${expense.note}` : 'Bez poznámky';
    return h(
      'li',
      { class: 'entry' },
      h('button', { type: 'button', class: 'entry__main', dataset: { editNote: expense.id }, 'aria-label': `${label}. ${describe}. Upravit poznámku.` }, name, note),
      amount,
      h('button', { type: 'button', class: 'entry__delete icon-button', dataset: { delete: expense.id }, 'aria-label': `Smazat útratu ${label}` }, icon('close')),
    );
  }

  function daysSection(expenses, categories, day) {
    const names = new Map(categories.map((category) => [category.id, category.name]));
    const liveTotal = (list) => totalAmount(list.filter((expense) => !struck.has(expense.id)));
    const days = groupByDate(expenses).map((group) => h(
      'section',
      { class: 'day' },
      h('h3', { class: 'day__head' }, h('span', {}, formatDayLabel(group.date, day)), price(liveTotal(group.expenses))),
      h('ul', { class: 'entries' }, ...group.expenses.map((expense) => entryRow(expense, names.get(expense.categoryId) ?? 'Bez kategorie'))),
    ));
    return h(
      'section',
      { 'aria-labelledby': 'by-day' },
      h('h2', { class: 'section-title', id: 'by-day' }, 'Den po dni'),
      h('div', { class: 'days' }, ...days),
    );
  }

  function emptyState() {
    const isCurrent = offset === 0;
    return h(
      'div',
      { class: 'empty' },
      h('p', {}, isCurrent ? 'V tomhle období zatím žádná útrata.' : 'V tomhle období nejsou žádné útraty.'),
      isCurrent && h('button', { type: 'button', class: 'button', dataset: { action: 'go-add' } }, 'Přidat útratu'),
    );
  }

  function render(state) {
    const day = todayIso(now());
    const period = shiftPeriod(periodForDate(day, state.settings.payday), offset, state.settings.payday);
    rail.period.textContent = formatPeriodLabel(period, parseIsoDate(day).year);
    rail.status.textContent = periodStatus(offset);
    nextButton.disabled = offset >= 0;

    const live = expensesInPeriod(state.expenses, period);
    const visible = expensesInPeriod([...state.expenses, ...struck.values()], period);
    const sections = visible.length === 0
      ? [emptyState()]
      : [live.length > 0 && categorySection(live, state.categories), daysSection(visible, state.categories, day)];
    notes.keepFocus(() => body.replaceChildren(totalTag(live, period, day), ...sections.filter(Boolean)));
  }

  function focusButton(attribute, id) {
    body.querySelector(`[data-${attribute}="${CSS.escape(id)}"]`)?.focus();
  }

  function deleteExpense(id) {
    const expense = store.get().expenses.find((candidate) => candidate.id === id);
    if (!expense) return;
    const previous = struck;
    struck = new Map(struck).set(id, expense);
    const result = store.update((state) => removeExpense(state, id));
    if (!result.ok) {
      struck = previous;
      toast.show(result.error, { duration: ERROR_TOAST_MS });
      return;
    }
    focusButton('restore', id);
    clearTimeout(forgetTimers.get(id));
    forgetTimers.set(id, setTimeout(() => {
      forgetTimers.delete(id);
      if (!struck.has(id)) return;
      struck = without(struck, id);
      render(store.get());
    }, UNDO_WINDOW_MS));
  }

  // addExpense ignores an id that is already stored, so a backup restored in
  // the meantime cannot end up with the same entry twice.
  function restoreExpense(id) {
    const expense = struck.get(id);
    if (!expense) return;
    clearTimeout(forgetTimers.get(id));
    forgetTimers.delete(id);
    const previous = struck;
    struck = without(struck, id);
    const result = store.update((state) => addExpense(state, expense));
    if (!result.ok) {
      struck = previous;
      toast.show(result.error, { duration: ERROR_TOAST_MS });
      return;
    }
    focusButton('delete', id);
  }

  body.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const { delete: deleteId, restore, editNote, noteDone, action } = button.dataset;
    if (deleteId) deleteExpense(deleteId);
    else if (restore) restoreExpense(restore);
    else if (editNote) notes.start(editNote);
    else if (noteDone) notes.commit();
    else if (action === 'go-add') onAddRequested();
  });

  function changePeriod(step) {
    notes.stop();
    offset += step;
    render(store.get());
  }

  root.querySelector('[data-action="prev-period"]').addEventListener('click', () => changePeriod(-1));
  nextButton.addEventListener('click', () => {
    if (offset < 0) changePeriod(1);
  });

  return { render };
}
