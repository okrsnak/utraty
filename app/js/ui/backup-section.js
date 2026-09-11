// Nastavení → Záloha: export, import with a confirmation and an undo, and the
// data the app set aside because it could not read it.

import { plural } from '../plural.js';
import { exportBackup, exportSetAside, readBackupFile } from './backup.js';
import { h } from './dom.js';

const EXPENSES_NOMINATIVE = ['útrata', 'útraty', 'útrat'];
const EXPENSES_ACCUSATIVE = ['útratu', 'útraty', 'útrat'];
const ERROR_TOAST_MS = 8000;
const UNDO_IMPORT_MS = 10000;

export function createBackupSection({ store, toast, setAside, now, requestRender }) {
  let pendingImport = null; // { state, dropped } waiting for confirmation
  let error = null;
  let confirmingRemoval = false;

  const button = (label, action, variant = '') => h(
    'button',
    { type: 'button', class: `button ${variant}`.trim(), dataset: { action } },
    label,
  );

  function confirmation(state) {
    const incoming = plural(pendingImport.state.expenses.length, EXPENSES_ACCUSATIVE);
    const current = plural(state.expenses.length, EXPENSES_NOMINATIVE);
    const dropped = pendingImport.dropped > 0 ? ` Poškozené záznamy, které se vynechají: ${pendingImport.dropped}.` : '';
    return h(
      'div',
      { class: 'confirm', role: 'group', 'aria-label': 'Potvrzení obnovy ze zálohy' },
      h('p', {}, `Záloha obsahuje ${incoming}.${dropped} Obnovením nahradíš všechno, co je teď v telefonu (${current}). Chvíli potom to půjde vrátit.`),
      h('div', { class: 'settings__actions' }, button('Obnovit', 'confirm-import', 'button--ink'), button('Zrušit', 'cancel-import', 'button--quiet')),
    );
  }

  function setAsidePanel(entries) {
    return h(
      'div',
      { class: 'confirm' },
      h('p', {}, `Odložená data, která appka nedokázala přečíst: ${entries.length}. Ulož si je do souboru, ať se neztratí.`),
      h(
        'div',
        { class: 'settings__actions' },
        button('Uložit do souboru', 'export-set-aside'),
        confirmingRemoval
          ? button('Opravdu smazat', 'confirm-remove-set-aside', 'button--ink')
          : button('Smazat', 'remove-set-aside', 'button--quiet'),
      ),
    );
  }

  function render(state) {
    const entries = setAside.list();
    return [
      h('p', { class: 'settings__help' }, `Data jsou jen v tomhle telefonu (${plural(state.expenses.length, EXPENSES_NOMINATIVE)}). Když appku smažeš z plochy, zmizí i data. Zálohu si ulož do Souborů nebo si ji pošli.`),
      h(
        'div',
        { class: 'settings__actions' },
        button('Uložit zálohu', 'export'),
        h(
          'label',
          { class: 'button button--quiet file-button' },
          'Obnovit ze zálohy',
          h('input', { type: 'file', accept: 'application/json,.json', class: 'visually-hidden', dataset: { action: 'import' } }),
        ),
      ),
      pendingImport && confirmation(state),
      error && h('p', { class: 'field__error', role: 'alert' }, error),
      entries.length > 0 && setAsidePanel(entries),
    ];
  }

  async function runExport(exporter, successMessage) {
    try {
      const result = await exporter();
      if (result.ok) toast.show(result.method === 'share' ? successMessage : 'Soubor se stahuje');
    } catch {
      toast.show('Soubor se nepodařilo vytvořit.', { duration: ERROR_TOAST_MS });
    }
  }

  async function importFile(input) {
    const [file] = input.files;
    input.value = '';
    if (!file) return;
    try {
      const result = await readBackupFile(file);
      pendingImport = result.ok ? result : null;
      error = result.ok ? null : result.error;
    } catch {
      pendingImport = null;
      error = 'Soubor se nepodařilo načíst.';
    }
    requestRender();
  }

  function confirmImport() {
    const previous = store.get();
    const restored = pendingImport.state;
    pendingImport = null;
    const result = store.update(() => restored);
    if (!result.ok) {
      toast.show(result.error, { duration: ERROR_TOAST_MS });
      requestRender();
      return;
    }
    toast.show(`Záloha obnovena · ${plural(restored.expenses.length, EXPENSES_NOMINATIVE)}`, {
      duration: UNDO_IMPORT_MS,
      onAction: () => {
        const undone = store.update(() => previous);
        if (!undone.ok) toast.show(undone.error, { duration: ERROR_TOAST_MS });
      },
    });
  }

  const clickActions = {
    export: () => runExport(() => exportBackup(store.get(), now()), 'Záloha je připravená'),
    'export-set-aside': () => runExport(() => exportSetAside(setAside.list(), now()), 'Odložená data jsou připravená'),
    'confirm-import': confirmImport,
    'cancel-import': () => {
      pendingImport = null;
      requestRender();
    },
    'remove-set-aside': () => {
      confirmingRemoval = true;
      requestRender();
    },
    'confirm-remove-set-aside': () => {
      confirmingRemoval = false;
      setAside.remove();
      requestRender();
    },
  };

  return {
    render,
    handleClick(action) {
      const run = clickActions[action];
      if (run) run();
      return Boolean(run);
    },
    handleChange(target) {
      if (target.dataset.action !== 'import') return false;
      importFile(target);
      return true;
    },
  };
}
