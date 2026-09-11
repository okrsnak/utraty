// Writing a note on an entry in Přehled: tap the entry, type, then leave the
// field or press Enter to save (with undo), or Escape to cancel.

import { MAX_NOTE, setExpenseNote } from '../state.js';
import { h } from './dom.js';

const ERROR_TOAST_MS = 8000;

export function createNoteEditor({ body, store, toast, rerender }) {
  let editing = null; // { id, draft } of the entry being written on

  const inputFor = (id) => body.querySelector(`[data-note-for="${CSS.escape(id)}"]`);
  const focusEntry = (id) => body.querySelector(`[data-edit-note="${CSS.escape(id)}"]`)?.focus();

  function focusInput() {
    const input = editing && inputFor(editing.id);
    if (!input) return;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  function input(expense, label) {
    return h('input', {
      class: 'entry__note-input',
      value: editing.draft,
      maxlength: MAX_NOTE,
      placeholder: 'za co?',
      enterkeyhint: 'done',
      autocomplete: 'off',
      'aria-label': `Poznámka k útratě ${label}`,
      dataset: { noteFor: expense.id },
    });
  }

  function commit() {
    if (!editing) return;
    const { id, draft } = editing;
    editing = null;
    const previous = store.get().expenses.find((expense) => expense.id === id)?.note ?? '';
    const unchanged = draft.trim() === previous;
    const result = unchanged ? { ok: true } : store.update((state) => setExpenseNote(state, id, draft));
    if (!result.ok) toast.show(result.error, { duration: ERROR_TOAST_MS });
    else if (!unchanged) {
      toast.show(draft.trim() ? 'Poznámka uložena' : 'Poznámka smazána', {
        onAction: () => store.update((state) => setExpenseNote(state, id, previous)),
      });
    }
    if (!result.ok || unchanged) rerender();
    focusEntry(id);
  }

  function start(id) {
    if (editing) commit();
    const expense = store.get().expenses.find((candidate) => candidate.id === id);
    if (!expense) return;
    editing = { id, draft: expense.note };
    rerender();
    focusInput();
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
    const typing = editing && document.activeElement?.dataset?.noteFor === editing.id;
    paint();
    if (typing) focusInput();
  }

  // Hotovo must not steal focus first, or the field would save and vanish under the tap.
  body.addEventListener('mousedown', (event) => {
    if (event.target.closest('[data-note-done]')) event.preventDefault();
  });

  body.addEventListener('input', (event) => {
    if (editing && event.target.dataset.noteFor === editing.id) editing = { ...editing, draft: event.target.value };
  });

  body.addEventListener('keydown', (event) => {
    if (!event.target.dataset.noteFor) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      commit();
    } else if (event.key === 'Escape') {
      cancel();
    }
  });

  // Leaving the field saves it, like the note line on the tag.
  body.addEventListener('focusout', (event) => {
    if (event.target.dataset?.noteFor) setTimeout(commit, 0);
  });

  return {
    isEditing: (id) => editing?.id === id,
    input,
    start,
    commit,
    stop() {
      editing = null;
    },
    keepFocus,
  };
}
