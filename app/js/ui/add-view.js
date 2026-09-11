// Přidat: keypad → amount on the tag → tap a shelf label (or pick a category) → saved.

import { applyKey, formatEntry } from '../keypad.js';
import { formatAmount, parseAmount } from '../money.js';
import { formatDayLabel, isValidIsoDate, parseIsoDate, todayIso } from '../dates.js';
import { daysUntilNextPeriod, formatCountdown, formatPeriodLabel, periodForDate, periodProgress } from '../period.js';
import { expensesInPeriod, totalsByCategory } from '../summary.js';
import { shelfCategories } from '../categories.js';
import {
  addCategory,
  addExpense,
  createExpense,
  removeCategory,
  removeExpense,
  setCategoryArchived,
  setExpenseNote,
} from '../state.js';
import { createId } from '../ids.js';
import { bindings, h } from './dom.js';
import { createPicker } from './picker.js';

const SHELF_SIZE = 5;
const SHELF_COLUMNS = 3; // matches .shelf grid-template-columns in add.css
const PRINT_SWAP_MS = 150;
const TICK_MS = 420;
const ERROR_TOAST_MS = 8000;
const HINT = 'Naťukej částku a ťukni na kategorii';
const HINT_NO_AMOUNT = 'Nejdřív naťukej částku';
const PHYSICAL_KEYS = { Backspace: 'back', '.': ',', ',': ',' };

// Runs a one-shot CSS animation again. The class is removed once it ends, so
// the animation does not replay when the view is hidden and shown again.
export function replayAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth; // reflow, so the same animation can run again
  element.classList.add(className);
  element.addEventListener('animationend', () => element.classList.remove(className), { once: true });
}

export function createAddView({ root, store, toast, now = () => new Date() }) {
  const rail = bindings(root.querySelector('.rail'));
  const tag = root.querySelector('#tag');
  const amountLine = root.querySelector('.tag__amount');
  const amountOutput = root.querySelector('#amount');
  const noteInput = root.querySelector('#note');
  const dateInput = root.querySelector('#date');
  const dateLabel = root.querySelector('#date-label');
  const shelfLabels = root.querySelector('#shelf-labels');
  const hint = root.querySelector('#shelf-hint');
  const pickerInput = root.querySelector('#picker-input');

  let entry = '';
  let chosenDate = null; // null means today
  let totals = new Map();

  const today = () => todayIso(now());

  function renderEntry() {
    const shown = formatEntry(entry);
    const [crowns, decimals] = shown.split(',');
    amountOutput.replaceChildren(
      h('span', { class: 'price__int' }, crowns),
      ...(decimals === undefined ? [] : [h('span', { class: 'price__dec' }, `,${decimals}`)]),
    );
    amountLine.dataset.size = shown.length > 9 ? 's' : shown.length > 6 ? 'm' : '';
    tag.classList.toggle('is-empty', entry === '');
    pickerInput.readOnly = parseAmount(entry) === null;
  }

  function renderDate() {
    const date = chosenDate ?? today();
    dateInput.max = today();
    dateInput.value = date;
    dateLabel.textContent = date === today() ? 'Dnes' : formatDayLabel(date, today());
  }

  function totalNote(category) {
    const total = totals.get(category.id);
    return total ? formatAmount(total) : 'zatím nic';
  }

  function shelfLabel(category) {
    return h(
      'button',
      {
        type: 'button',
        class: 'shelf-label',
        dataset: { categoryId: category.id },
        'aria-label': `Uložit do kategorie ${category.name}. V tomto období ${totalNote(category)}.`,
      },
      h('span', { class: 'shelf-label__name' }, category.name),
      h('span', { class: 'shelf-label__total' }, totalNote(category)),
    );
  }

  function setHint(warning) {
    hint.textContent = warning ? HINT_NO_AMOUNT : HINT;
    hint.classList.toggle('is-warning', warning);
  }

  function warnNoAmount() {
    setHint(true);
    replayAnimation(tag, 'is-nudged');
  }

  function stampLabel(categoryId) {
    const label = shelfLabels.querySelector(`[data-category-id="${CSS.escape(categoryId)}"]`);
    if (label) replayAnimation(label, 'is-stamped');
  }

  // The label's running total counts up from its old value, like a register.
  function tickTotal(categoryId, from, to) {
    const selector = `[data-category-id="${CSS.escape(categoryId)}"] .shelf-label__total`;
    const label = shelfLabels.querySelector(selector);
    if (!label || from === to || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const started = performance.now();
    const step = (time) => {
      const progress = Math.min(1, (time - started) / TICK_MS);
      const eased = 1 - (1 - progress) ** 3;
      label.textContent = formatAmount(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Undo takes the expense out again and reverts whatever the save did to its category.
  function undo(expenseId, draft, revert) {
    const result = store.update((state) => revert(removeExpense(state, expenseId)));
    if (!result.ok) {
      toast.show(result.error, { duration: ERROR_TOAST_MS });
      return;
    }
    ({ entry, chosenDate } = draft);
    noteInput.value = draft.note;
    renderEntry();
    renderDate();
  }

  function save({ categoryId, categoryName, prepare = (state) => state, revert = (state) => state }) {
    const amount = parseAmount(entry);
    if (amount === null) {
      warnNoAmount();
      return false;
    }
    const date = chosenDate ?? today();
    const draft = { entry, chosenDate, note: noteInput.value };
    const expense = createExpense(
      { amount, categoryId, date, note: noteInput.value },
      { id: createId(), createdAt: now().getTime() },
    );
    const totalBefore = totals.get(categoryId) ?? 0;
    const result = store.update((state) => addExpense(prepare(state), expense));
    if (!result.ok) {
      toast.show(result.error, { duration: ERROR_TOAST_MS });
      return false;
    }

    entry = '';
    chosenDate = null;
    noteInput.value = '';
    renderDate();
    replayAnimation(tag, 'is-printing');
    setTimeout(renderEntry, PRINT_SWAP_MS);
    stampLabel(categoryId);
    tickTotal(categoryId, totalBefore, totals.get(categoryId) ?? 0);
    setHint(false);
    const when = date === today() ? '' : ` · ${formatDayLabel(date, today())}`;
    toast.show(`Uloženo · ${categoryName} · ${formatAmount(amount)}${when}`, {
      onAction: () => undo(expense.id, draft, revert),
      secondaryLabel: 'Poznámka',
      onSecondary: () => askNote(expense.id),
    });
    return true;
  }

  // The strip turns into a line to write on, so a note can follow the save.
  function askNote(expenseId) {
    const saved = store.get().expenses.find((expense) => expense.id === expenseId);
    if (!saved) return;
    toast.ask({
      value: saved.note,
      placeholder: 'za co?',
      label: 'Poznámka k právě uložené útratě',
      onSubmit: (note) => {
        if (note.trim() === saved.note) return;
        const result = store.update((state) => setExpenseNote(state, expenseId, note));
        toast.show(result.ok ? 'Poznámka uložena' : result.error, { duration: result.ok ? 3000 : ERROR_TOAST_MS });
      },
    });
  }

  function pick(choice) {
    if (choice.kind === 'existing') {
      return save({ categoryId: choice.category.id, categoryName: choice.category.name });
    }
    if (choice.kind === 'restore') {
      const { id, name } = choice.category;
      return save({
        categoryId: id,
        categoryName: name,
        prepare: (state) => setCategoryArchived(state, id, false),
        revert: (state) => setCategoryArchived(state, id, true),
      });
    }
    const id = createId();
    return save({
      categoryId: id,
      categoryName: choice.name,
      prepare: (state) => addCategory(state, { id, name: choice.name }),
      revert: (state) => removeCategory(state, id),
    });
  }

  function pressKey(key) {
    entry = applyKey(entry, key);
    renderEntry();
    if (parseAmount(entry) !== null) setHint(false);
  }

  const picker = createPicker({
    input: pickerInput,
    list: root.querySelector('#picker-list'),
    closeButton: root.querySelector('[data-action="close-picker"]'),
    getCategories: () => store.get().categories,
    getNote: totalNote,
    getBottomLimit: () => document.querySelector('.tabs').getBoundingClientRect().top,
    canOpen: () => parseAmount(entry) !== null,
    onBlocked: warnNoAmount,
    onOpen: () => root.classList.add('is-picking'),
    onClose: () => root.classList.remove('is-picking'),
    onPick: pick,
  });

  root.querySelector('#keypad').addEventListener('click', (event) => {
    const key = event.target.closest('[data-key]')?.dataset.key;
    if (key) pressKey(key);
  });

  document.addEventListener('keydown', (event) => {
    if (root.hidden || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.target.closest?.('input, select, textarea')) return;
    const key = /^\d$/.test(event.key) ? event.key : PHYSICAL_KEYS[event.key];
    if (!key) return;
    event.preventDefault();
    pressKey(key);
  });

  shelfLabels.addEventListener('click', (event) => {
    const id = event.target.closest('[data-category-id]')?.dataset.categoryId;
    const category = store.get().categories.find((candidate) => candidate.id === id);
    if (category) save({ categoryId: category.id, categoryName: category.name });
  });

  noteInput.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    noteInput.blur();
  });

  dateInput.addEventListener('change', () => {
    const value = dateInput.value;
    chosenDate = isValidIsoDate(value) && value < today() ? value : null;
    renderDate();
  });

  function render(state) {
    const day = today();
    const period = periodForDate(day, state.settings.payday);
    rail.period.textContent = formatPeriodLabel(period, parseIsoDate(day).year);
    rail.countdown.textContent = formatCountdown(daysUntilNextPeriod(day, period));
    rail.strip.style.transform = `scaleX(${periodProgress(day, period).toFixed(3)})`;

    const rows = totalsByCategory(expensesInPeriod(state.expenses, period), state.categories);
    totals = new Map(rows.map((row) => [row.category.id, row.total]));
    const labels = shelfCategories(state.categories, state.expenses, day, SHELF_SIZE);
    shelfLabels.replaceChildren(...labels.map(shelfLabel));
    // The picker fills whatever is left of the last shelf row.
    const pickerSpan = SHELF_COLUMNS - (labels.length % SHELF_COLUMNS);
    pickerInput.closest('.picker').style.setProperty('--picker-span', String(pickerSpan));
    pickerInput.placeholder = pickerSpan > 1 ? 'Hledat nebo nová…' : 'Hledat…';
    renderDate();
    picker.refresh();
  }

  renderEntry();
  return { render };
}
