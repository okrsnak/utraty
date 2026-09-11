// Editing a written expense in Přehled: tap it and the row opens into a small
// form (amount, date, category, note). Hotovo or Enter saves with undo; Zrušit
// or Escape leaves it as it was.

import { todayIso } from '../dates.js';
import { formatAmount, formatNumber, parseAmount } from '../money.js';
import { MAX_NOTE, expenseEditError, updateExpense } from '../state.js';
import { h, icon } from './dom.js';

const ERROR_TOAST_MS = 8000;

export function createEntryEditor({ body, store, toast, rerender, now }) {
  let editing = null; // { id, draft: { amountText, categoryId, date, note }, error }

  const today = () => todayIso(now());
  const fieldFor = (name) => editing && body.querySelector(
    `[data-entry-for="${CSS.escape(editing.id)}"][data-entry-field="${name}"]`,
  );
  const focusEntry = (id) => body.querySelector(`[data-edit-expense="${CSS.escape(id)}"][data-edit-focus="note"]`)?.focus();

  // The amount is selected so a new one can be typed straight over it.
  function focusField(name, { select = true } = {}) {
    const input = fieldFor(name);
    if (!input) return;
    input.focus();
    if (name === 'amountText' && select) input.select();
    else if (input.type === 'text') input.setSelectionRange(input.value.length, input.value.length);
  }

  const draftFrom = (expense) => ({
    amountText: formatNumber(expense.amount).replace(/\s/g, ''),
    categoryId: expense.categoryId,
    date: expense.date,
    note: expense.note,
  });

  function field(label, control, wide = false) {
    return h('label', { class: wide ? 'form-field is-wide' : 'form-field' }, h('span', { class: 'form-label' }, label), control);
  }

  // Active categories, plus the current one when it was archived or deleted.
  function categoryOptions(categories, currentId) {
    const choices = categories.filter((category) => !category.archived || category.id === currentId);
    const known = choices.some((category) => category.id === currentId);
    return known ? choices : [...choices, { id: currentId, name: 'Bez kategorie' }];
  }

  function form(expense, categories) {
    const { draft } = editing;
    const data = (name) => ({ entryField: name, entryFor: expense.id });
    // novalidate: the browser's own check (max date) would block the submit
    // silently; the app explains the problem in its own words instead.
    return h(
      'form',
      { class: 'entry-editor', novalidate: true, dataset: { entryForm: expense.id } },
      field('Částka', h(
        'span',
        { class: 'entry-editor__amount' },
        h('input', { value: draft.amountText, inputmode: 'decimal', autocomplete: 'off', enterkeyhint: 'done', 'aria-label': 'Částka v korunách', dataset: data('amountText') }),
        h('span', { class: 'entry-editor__currency' }, 'Kč'),
      )),
      field('Datum', h('input', { type: 'date', value: draft.date, max: today(), dataset: data('date') })),
      field('Kategorie', h(
        'span',
        { class: 'select' },
        h('select', { dataset: data('categoryId') }, ...categoryOptions(categories, draft.categoryId).map(
          (category) => h('option', { value: category.id, selected: category.id === draft.categoryId }, category.name),
        )),
        icon('right'),
      ), true),
      field('Poznámka', h('input', {
        type: 'text',
        value: draft.note,
        maxlength: MAX_NOTE,
        placeholder: 'za co?',
        autocomplete: 'off',
        enterkeyhint: 'done',
        dataset: data('note'),
      }), true),
      editing.error && h('p', { class: 'field__error entry-editor__wide', role: 'alert' }, editing.error),
      h(
        'div',
        { class: 'entry-editor__actions entry-editor__wide' },
        h('button', { type: 'submit', class: 'button' }, 'Hotovo'),
        h('button', { type: 'button', class: 'button button--quiet', dataset: { entryCancel: expense.id } }, 'Zrušit'),
      ),
    );
  }

  // Saves the draft; false when it is not valid yet (the form stays open with the reason).
  function commit() {
    if (!editing) return true;
    const state = store.get();
    const { id, draft } = editing;
    const expense = state.expenses.find((candidate) => candidate.id === id);
    if (!expense) {
      editing = null;
      rerender();
      return true;
    }
    const changes = { amount: parseAmount(draft.amountText), categoryId: draft.categoryId, date: draft.date, note: draft.note };
    const error = expenseEditError(changes, state.categories, today());
    if (error) {
      editing = { ...editing, error };
      rerender();
      focusField(changes.amount === null ? 'amountText' : state.categories.some((c) => c.id === changes.categoryId) ? 'date' : 'categoryId');
      return false;
    }
    const previous = { amount: expense.amount, categoryId: expense.categoryId, date: expense.date, note: expense.note };
    const unchanged = changes.amount === previous.amount && changes.categoryId === previous.categoryId
      && changes.date === previous.date && changes.note.trim() === previous.note;
    editing = null;
    const result = unchanged ? { ok: true } : store.update((current) => updateExpense(current, id, changes));
    if (!result.ok) toast.show(result.error, { duration: ERROR_TOAST_MS });
    else if (!unchanged) {
      const name = state.categories.find((category) => category.id === changes.categoryId)?.name ?? 'Bez kategorie';
      toast.show(`Uloženo · ${name} · ${formatAmount(changes.amount)}`, {
        onAction: () => store.update((current) => updateExpense(current, id, previous)),
      });
    }
    if (!result.ok || unchanged) rerender();
    focusEntry(id);
    return true;
  }

  function start(id, focus = 'note') {
    if (editing?.id === id) return;
    if (editing && !commit()) return;
    const expense = store.get().expenses.find((candidate) => candidate.id === id);
    if (!expense) return;
    editing = { id, draft: draftFrom(expense), error: null };
    rerender();
    focusField(focus);
  }

  function cancel() {
    if (!editing) return;
    const { id } = editing;
    editing = null;
    rerender();
    focusEntry(id);
  }

  // Rebuilding the list keeps the caret in the field being written.
  function keepFocus(paint) {
    const active = document.activeElement;
    const typing = editing && active?.dataset?.entryFor === editing.id ? active.dataset.entryField : null;
    paint();
    if (typing) focusField(typing, { select: false });
  }

  // Typing only updates the draft; nothing re-renders under the caret.
  function updateDraft(event) {
    const { entryField, entryFor } = event.target.dataset;
    if (!editing || entryFor !== editing.id || !entryField) return;
    editing = { ...editing, draft: { ...editing.draft, [entryField]: event.target.value }, error: null };
    event.target.closest('form')?.querySelector('.field__error')?.remove();
  }

  body.addEventListener('input', updateDraft);
  body.addEventListener('change', updateDraft);

  body.addEventListener('submit', (event) => {
    if (!event.target.dataset.entryForm) return;
    event.preventDefault();
    commit();
  });

  body.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && event.target.closest?.('[data-entry-form]')) cancel();
  });

  return {
    isEditing: (id) => editing?.id === id,
    form,
    start,
    cancel,
    stop() {
      editing = null;
    },
    keepFocus,
  };
}
