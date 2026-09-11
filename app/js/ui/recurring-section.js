// Nastavení → Pravidelné platby: list, add, edit and delete recurring payments.
// Payments due by the day of saving are written right away, so a first payment
// dated today or earlier shows up in Přehled at once.

import { formatShortDate, parseIsoDate, todayIso } from '../dates.js';
import { formatAmount, formatNumber, parseAmount } from '../money.js';
import {
  FREQUENCIES,
  MAX_RECURRING_NAME,
  addRecurring,
  applyDueRecurring,
  frequencyLabel,
  nextOccurrence,
  recurringError,
  removeRecurring,
  restoreRecurring,
  updateRecurring,
} from '../recurring.js';
import { createId } from '../ids.js';
import { h, icon } from './dom.js';

const ERROR_TOAST_MS = 8000;

export function createRecurringSection({ store, toast, now, requestRender }) {
  let form = null; // draft being edited: { id (null when new), name, amountText, categoryId, everyMonths, firstDate, error }

  const today = () => todayIso(now());

  function openForm(template) {
    const firstActive = store.get().categories.find((category) => !category.archived);
    form = template
      ? {
          id: template.id,
          name: template.name,
          amountText: formatNumber(template.amount).replace(/\s/g, ''),
          categoryId: template.categoryId,
          everyMonths: template.everyMonths,
          firstDate: template.firstDate,
          error: null,
        }
      : { id: null, name: '', amountText: '', categoryId: firstActive?.id ?? '', everyMonths: 1, firstDate: today(), error: null };
    requestRender({ focus: 'recurring-name' });
  }

  function closeForm() {
    form = null;
    requestRender();
  }

  function row(template, categoriesById) {
    const category = categoriesById.get(template.categoryId)?.name ?? 'Bez kategorie';
    const next = nextOccurrence(template, today());
    const withYear = parseIsoDate(next).year !== parseIsoDate(today()).year;
    return h(
      'li',
      { class: 'recurring__row' },
      h(
        'div',
        { class: 'recurring__main' },
        h('span', { class: 'recurring__name' }, template.name),
        h('span', { class: 'recurring__meta' }, `${formatAmount(template.amount)} · ${frequencyLabel(template.everyMonths)} · ${category}`),
        h('span', { class: 'recurring__next' }, `další ${formatShortDate(next, { withYear })}`),
      ),
      h('button', { type: 'button', class: 'button button--quiet', dataset: { recurringEdit: template.id } }, 'Upravit'),
    );
  }

  const field = (label, control) => h('label', { class: 'recurring__field' }, h('span', { class: 'recurring__label' }, label), control);

  const selectField = (key, options) => h(
    'span',
    { class: 'select' },
    h('select', { dataset: { focusKey: `recurring-${key}`, recurringField: key } }, ...options),
    icon('right'),
  );

  function formPanel(state) {
    const categories = state.categories.filter((category) => !category.archived);
    return h(
      'form',
      { class: 'recurring__form', dataset: { form: 'recurring' } },
      field('Název', h('input', {
        value: form.name,
        maxlength: MAX_RECURRING_NAME,
        placeholder: 'třeba Nájem nebo Netflix',
        autocomplete: 'off',
        dataset: { focusKey: 'recurring-name', recurringField: 'name' },
      })),
      field('Částka', h('input', {
        value: form.amountText,
        inputmode: 'decimal',
        placeholder: '0',
        autocomplete: 'off',
        dataset: { focusKey: 'recurring-amountText', recurringField: 'amountText' },
      })),
      field('Kategorie', selectField('categoryId', categories.map((category) => h('option', { value: category.id, selected: category.id === form.categoryId }, category.name)))),
      field('Jak často', selectField('everyMonths', FREQUENCIES.map((frequency) => h('option', { value: frequency.months, selected: frequency.months === form.everyMonths }, frequency.label)))),
      field('První platba', h('input', { type: 'date', value: form.firstDate, dataset: { focusKey: 'recurring-firstDate', recurringField: 'firstDate' } })),
      form.error && h('p', { class: 'field__error', role: 'alert' }, form.error),
      h(
        'div',
        { class: 'settings__actions' },
        h('button', { type: 'submit', class: 'button' }, form.id ? 'Uložit' : 'Přidat'),
        h('button', { type: 'button', class: 'button button--quiet', dataset: { recurringCancel: 'true' } }, 'Zrušit'),
        form.id && h('button', { type: 'button', class: 'button button--ink', dataset: { recurringDelete: form.id } }, 'Smazat'),
      ),
    );
  }

  function render(state) {
    const categoriesById = new Map(state.categories.map((category) => [category.id, category]));
    const items = state.recurring.map((template) => (form?.id === template.id
      ? h('li', { class: 'recurring__editing' }, formPanel(state))
      : row(template, categoriesById)));
    return [
      h('p', { class: 'settings__help' }, 'Zapíšou se samy v den platby, jakmile appku otevřeš. Už zapsané platby zůstanou v přehledu i po smazání.'),
      items.length > 0 && h('ul', { class: 'recurring__list' }, ...items),
      form?.id === null && formPanel(state),
      !form && h('button', { type: 'button', class: 'button', dataset: { recurringAdd: 'true' } }, icon('plus'), 'Přidat pravidelnou platbu'),
    ];
  }

  function submit() {
    const state = store.get();
    const draft = {
      name: form.name,
      amount: parseAmount(form.amountText),
      categoryId: form.categoryId,
      everyMonths: Number(form.everyMonths),
      firstDate: form.firstDate,
    };
    const error = recurringError(draft, state.categories);
    if (error) {
      form = { ...form, error };
      requestRender();
      return;
    }
    const isNew = form.id === null;
    const id = form.id ?? createId();
    const before = state.expenses.length;
    const result = store.update((current) => {
      const saved = isNew ? addRecurring(current, { id, ...draft }) : updateRecurring(current, id, draft);
      return applyDueRecurring(saved, today(), now().getTime()).state;
    });
    if (!result.ok) {
      toast.show(result.error, { duration: ERROR_TOAST_MS });
      return;
    }
    const written = store.get().expenses.length - before;
    toast.show(`${isNew ? 'Přidáno' : 'Uloženo'} · ${draft.name.trim()}${written > 0 ? ` · zapsáno ${written}×` : ''}`);
    closeForm();
  }

  // No confirmation: the strip offers the way back, history included.
  function remove(id) {
    const template = store.get().recurring.find((candidate) => candidate.id === id);
    if (!template) return;
    const result = store.update((state) => removeRecurring(state, id));
    if (!result.ok) {
      toast.show(result.error, { duration: ERROR_TOAST_MS });
      return;
    }
    toast.show(`Smazáno · ${template.name}`, { onAction: () => store.update((state) => restoreRecurring(state, template)) });
    closeForm();
  }

  return {
    render,
    submit,
    handleClick(button) {
      const { recurringAdd, recurringEdit, recurringCancel, recurringDelete } = button.dataset;
      const editing = recurringEdit && store.get().recurring.find((template) => template.id === recurringEdit);
      if (recurringAdd) openForm(null);
      else if (editing) openForm(editing);
      else if (recurringCancel) closeForm();
      else if (recurringDelete) remove(recurringDelete);
      else return false;
      return true;
    },
    // Keeps the draft in step with what is typed. Nothing re-renders while typing
    // (the caret would jump); an error that no longer applies is simply taken away.
    handleInput(target) {
      const key = target.dataset.recurringField;
      if (!key || !form) return false;
      form = { ...form, [key]: key === 'everyMonths' ? Number(target.value) : target.value, error: null };
      target.closest('form')?.querySelector('.field__error')?.remove();
      return true;
    },
  };
}
