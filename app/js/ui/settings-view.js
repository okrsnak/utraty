// Nastavení: payday, categories (rename, archive, add) and the backup.

import { parseIsoDate, todayIso } from '../dates.js';
import { formatPeriodLabel, periodForDate } from '../period.js';
import {
  MAX_CATEGORY_NAME,
  addCategory,
  categoryNameError,
  renameCategory,
  setCategoryArchived,
  setPayday,
  setStyle,
  setTheme,
} from '../state.js';
import { createId } from '../ids.js';
import { createBackupSection } from './backup-section.js';
import { createRecurringSection } from './recurring-section.js';
import { renderAppearance } from './appearance-section.js';
import { h, icon } from './dom.js';

const ERROR_TOAST_MS = 8000;
const NEW_CATEGORY = 'new-category';

export function createSettingsView({ root, store, toast, isStandalone, setAside, now = () => new Date() }) {
  const body = root.querySelector('#settings');
  let errors = {}; // focus key → message
  let drafts = {}; // focus key → rejected text to show again
  let values = {}; // focus key → text to put back into inputs while rebuilding
  let frame = 0;
  let pendingFocus = null; // focus key to move to on the next paint
  const backup = createBackupSection({ store, toast, setAside, now, requestRender: () => render() });
  const recurring = createRecurringSection({ store, toast, now, requestRender: (options) => render(options) });

  const errorLine = (key) => errors[key] && h('p', { class: 'field__error', role: 'alert' }, errors[key]);
  const section = (id, title, ...children) => h(
    'section',
    { class: 'settings__section', 'aria-labelledby': `settings-${id}` },
    h('h2', { class: 'section-title', id: `settings-${id}` }, title),
    ...children,
  );

  function paydaySection(state) {
    const day = todayIso(now());
    const { payday } = state.settings;
    const period = periodForDate(day, payday);
    const options = Array.from({ length: 31 }, (_, index) => h('option', { value: index + 1, selected: index + 1 === payday }, `${index + 1}.`));
    return section(
      'payday',
      'Den výplaty',
      h(
        'label',
        { class: 'field' },
        h('span', { class: 'field__label' }, 'Výplata chodí'),
        h('span', { class: 'select' }, h('select', { dataset: { focusKey: 'payday', setting: 'payday' } }, ...options), icon('right')),
      ),
      h('p', { class: 'settings__help' }, `Období začíná tímhle dnem. Teď běží ${formatPeriodLabel(period, parseIsoDate(day).year)}`),
      payday > 28 && h('p', { class: 'settings__help' }, 'V kratších měsících začne období posledním dnem měsíce.'),
    );
  }

  function activeRow(category) {
    const key = `name-${category.id}`;
    return h(
      'li',
      { class: 'category-editor__row' },
      h('input', {
        class: 'category-editor__name',
        value: values[key] ?? category.name,
        maxlength: MAX_CATEGORY_NAME,
        autocomplete: 'off',
        enterkeyhint: 'done',
        'aria-label': `Název kategorie ${category.name}`,
        dataset: { focusKey: key, rename: category.id },
      }),
      h('button', { type: 'button', class: 'button button--quiet', dataset: { archive: category.id } }, 'Vyřadit'),
      errorLine(key),
    );
  }

  function archivedRow(category) {
    return h(
      'li',
      { class: 'category-editor__row is-archived' },
      h('span', { class: 'category-editor__archived-name' }, category.name),
      h('button', { type: 'button', class: 'button button--quiet', dataset: { unarchive: category.id } }, 'Vrátit'),
    );
  }

  function categoriesSection(state) {
    const active = state.categories.filter((category) => !category.archived);
    const archived = state.categories.filter((category) => category.archived);
    return section(
      'categories',
      'Kategorie',
      h('ul', { class: 'category-editor' }, ...active.map(activeRow)),
      h(
        'form',
        { class: 'add-category', dataset: { form: 'add-category' } },
        h('input', {
          class: 'add-category__input',
          value: values[NEW_CATEGORY] ?? '',
          placeholder: 'Nová kategorie',
          maxlength: MAX_CATEGORY_NAME,
          autocomplete: 'off',
          enterkeyhint: 'done',
          'aria-label': 'Název nové kategorie',
          dataset: { focusKey: NEW_CATEGORY },
        }),
        h('button', { type: 'submit', class: 'button' }, icon('plus'), 'Přidat'),
        errorLine(NEW_CATEGORY),
      ),
      archived.length > 0 && h('h3', { class: 'settings__subtitle' }, 'Vyřazené'),
      archived.length > 0 && h('p', { class: 'settings__help' }, 'Nejsou v nabídce, ale jejich útraty v přehledu zůstávají.'),
      archived.length > 0 && h('ul', { class: 'category-editor' }, ...archived.map(archivedRow)),
    );
  }

  function installSection() {
    return section(
      'install',
      'Na plochu',
      h('p', { class: 'settings__help' }, 'V Safari ťukni na Sdílet a vyber Přidat na plochu. Appka se pak otevírá jako každá jiná a funguje i bez internetu.'),
      h('p', { class: 'settings__help' }, 'Appka na ploše má vlastní úložiště: útraty zapsané v Safari se do ní nepřenesou. Když už nějaké máš, ulož si zálohu a v appce na ploše ji obnov.'),
    );
  }

  // Text being typed survives a rebuild: the new-category field, the name being
  // edited right now, and names that were rejected.
  function collectValues() {
    const live = {};
    const newName = body.querySelector(`[data-focus-key="${NEW_CATEGORY}"]`)?.value;
    if (newName) live[NEW_CATEGORY] = newName;
    const typing = document.activeElement;
    if (typing?.dataset?.rename && body.contains(typing)) live[typing.dataset.focusKey] = typing.value;
    return { ...live, ...drafts };
  }

  function paint() {
    const state = store.get();
    const focusKey = pendingFocus ?? document.activeElement?.dataset?.focusKey;
    pendingFocus = null;
    values = collectValues();
    const sections = [
      paydaySection(state),
      categoriesSection(state),
      section('recurring', 'Pravidelné platby', ...recurring.render(state).filter(Boolean)),
      section('appearance', 'Vzhled', ...renderAppearance(state)),
      section('backup', 'Záloha', ...backup.render(state).filter(Boolean)),
      !isStandalone() && installSection(),
      h('p', { class: 'settings__footer' }, 'Útraty · data zůstávají v telefonu'),
    ];
    body.replaceChildren(...sections.filter(Boolean));
    if (focusKey) body.querySelector(`[data-focus-key="${CSS.escape(focusKey)}"]`)?.focus();
  }

  // Rebuilt on the next frame, so a tap that moves focus to another field lands first.
  function render(options = {}) {
    if (options.focus) pendingFocus = options.focus;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(paint);
  }

  function rerender({ nextErrors = {}, nextDrafts = {} } = {}) {
    errors = nextErrors;
    drafts = nextDrafts;
    render();
  }

  function commit(transition, { message, undo, duration } = {}) {
    const result = store.update(transition);
    if (!result.ok) toast.show(result.error, { duration: ERROR_TOAST_MS });
    else if (message) toast.show(message, { duration, onAction: undo && (() => commit(undo)) });
    return result.ok;
  }

  function rename(input) {
    const id = input.dataset.rename;
    const key = input.dataset.focusKey;
    const current = store.get().categories.find((category) => category.id === id);
    if (!current || input.value.trim() === current.name) return rerender();
    const error = categoryNameError(store.get(), input.value, id);
    if (error) return rerender({ nextErrors: { [key]: error }, nextDrafts: { [key]: input.value } });
    errors = {};
    drafts = {};
    commit((state) => renameCategory(state, id, input.value));
  }

  function addNewCategory(form) {
    const input = form.querySelector('input');
    const error = categoryNameError(store.get(), input.value);
    if (error) return rerender({ nextErrors: { [NEW_CATEGORY]: error }, nextDrafts: { [NEW_CATEGORY]: input.value } });
    const name = input.value.trim();
    input.value = '';
    errors = {};
    drafts = {};
    commit((state) => addCategory(state, { id: createId(), name }), { message: `Přidáno · ${name}` });
  }

  function archive(id) {
    const name = store.get().categories.find((category) => category.id === id)?.name ?? '';
    commit((state) => setCategoryArchived(state, id, true), {
      message: `Vyřazeno · ${name}`,
      undo: (state) => setCategoryArchived(state, id, false),
    });
  }

  body.addEventListener('change', (event) => {
    const target = event.target;
    if (target.dataset.setting === 'payday') commit((state) => setPayday(state, Number(target.value)));
    else if (target.dataset.themeChoice) commit((state) => setTheme(state, target.value));
    else if (target.dataset.styleChoice) commit((state) => setStyle(state, target.value));
    else if (target.dataset.rename) rename(target);
    else if (!recurring.handleInput(target)) backup.handleChange(target);
  });

  body.addEventListener('input', (event) => recurring.handleInput(event.target));

  body.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.dataset.rename) event.target.blur();
  });

  body.addEventListener('submit', (event) => {
    event.preventDefault();
    if (event.target.dataset.form === 'recurring') recurring.submit();
    else addNewCategory(event.target);
  });

  body.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || recurring.handleClick(button)) return;
    const { archive: archiveId, unarchive, action } = button.dataset;
    if (archiveId) archive(archiveId);
    else if (unarchive) commit((state) => setCategoryArchived(state, unarchive, false));
    else if (action) backup.handleClick(action);
  });

  return { render };
}
