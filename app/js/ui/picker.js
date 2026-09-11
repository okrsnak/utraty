// Typeable category picker (ARIA combobox): filter as you type, then pick an
// existing category, restore an archived one, or create a new one.

import { searchCategories } from '../categories.js';
import { h, icon } from './dom.js';

const BLUR_GRACE_MS = 200;
const MIN_LIST_HEIGHT = 144;

export function createPicker(options) {
  const { input, list, closeButton, getCategories, getNote, getBottomLimit } = options;
  const { canOpen, onBlocked, onOpen, onClose, onPick } = options;
  let choices = [];
  let message = '';
  let activeIndex = -1;
  let isOpen = false;
  let blurTimer = null;

  function computeChoices() {
    const query = input.value;
    const result = searchCategories(getCategories(), query);
    choices = [
      ...result.matches.map((category) => ({ kind: 'existing', category })),
      ...(result.archivedMatch ? [{ kind: 'restore', category: result.archivedMatch }] : []),
      ...(result.createName ? [{ kind: 'create', name: result.createName }] : []),
    ];
    message = result.createError ?? (choices.length === 0 ? 'Zatím žádné kategorie. Napiš název nové.' : '');
    activeIndex = query.trim() !== '' && choices.length > 0 ? 0 : -1;
  }

  function choiceContent(choice) {
    const marker = h('span', { class: 'picker__marker', 'aria-hidden': 'true' }, icon('right'));
    const label = (text) => h('span', { class: 'picker__option-label' }, text);
    if (choice.kind === 'create') return [icon('plus'), label(`Vytvořit „${choice.name}“`), marker];
    if (choice.kind === 'restore') return [icon('plus'), label(`Vrátit „${choice.category.name}“ do regálu`), marker];
    return [label(choice.category.name), h('span', { class: 'picker__option-note' }, getNote(choice.category)), marker];
  }

  function fitList() {
    if (!isOpen) return;
    const viewport = window.visualViewport;
    const viewportBottom = viewport ? viewport.height + viewport.offsetTop : window.innerHeight;
    const bottom = Math.min(viewportBottom, getBottomLimit());
    const top = list.getBoundingClientRect().top;
    list.style.maxHeight = `${Math.max(MIN_LIST_HEIGHT, Math.floor(bottom - top - 8))}px`;
  }

  function paint() {
    const items = choices.map((choice, index) => h('li', {
      id: `picker-option-${index}`,
      role: 'option',
      class: `picker__option picker__option--${choice.kind}`,
      'aria-selected': String(index === activeIndex),
      dataset: { index: String(index) },
    }, ...choiceContent(choice)));
    const note = message ? [h('li', { class: 'picker__message', role: 'presentation' }, message)] : [];
    list.replaceChildren(...items, ...note);
    if (activeIndex >= 0) input.setAttribute('aria-activedescendant', `picker-option-${activeIndex}`);
    else input.removeAttribute('aria-activedescendant');
    list.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
    fitList();
  }

  function open() {
    clearTimeout(blurTimer);
    if (!canOpen()) {
      input.blur();
      onBlocked();
      return;
    }
    if (!isOpen) {
      isOpen = true;
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      onOpen();
    }
    computeChoices();
    paint();
  }

  function close() {
    clearTimeout(blurTimer);
    if (!isOpen) return;
    isOpen = false;
    list.hidden = true;
    list.replaceChildren();
    input.value = '';
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    input.blur();
    onClose();
  }

  function choose(index) {
    const choice = choices[index];
    if (choice && onPick(choice)) close();
  }

  function move(step) {
    if (choices.length === 0) return;
    activeIndex = activeIndex < 0
      ? (step > 0 ? 0 : choices.length - 1)
      : (activeIndex + step + choices.length) % choices.length;
    paint();
  }

  const keyActions = {
    ArrowDown: () => move(1),
    ArrowUp: () => move(-1),
    // Enter (the keyboard's Done key) picks only a highlighted option; otherwise it just closes.
    Enter: () => (activeIndex >= 0 ? choose(activeIndex) : close()),
    Escape: close,
  };

  input.addEventListener('focus', open);
  input.addEventListener('input', () => (isOpen ? (computeChoices(), paint()) : open()));
  input.addEventListener('keydown', (event) => {
    const action = keyActions[event.key];
    if (!action || !isOpen) return;
    event.preventDefault();
    action();
  });
  input.addEventListener('blur', () => {
    blurTimer = setTimeout(() => {
      if (isOpen && document.activeElement !== input) close();
    }, BLUR_GRACE_MS);
  });
  for (const element of [list, closeButton]) {
    element.addEventListener('mousedown', (event) => event.preventDefault());
  }
  list.addEventListener('click', (event) => {
    const item = event.target.closest('[role="option"]');
    if (item) choose(Number(item.dataset.index));
  });
  closeButton.addEventListener('click', close);
  window.visualViewport?.addEventListener('resize', fitList);

  return {
    close,
    refresh() {
      if (!isOpen) return;
      computeChoices();
      paint();
    },
  };
}
