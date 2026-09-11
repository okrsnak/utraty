// The strip fed down from beneath the visible view's top rail. It shows a
// message with up to two actions, or one line to write on (a note added right
// after saving). One use at a time: a new one replaces the old, and every
// action or submit runs at most once.

const DEFAULT_DURATION_MS = 5000;

export function createToast(root) {
  const text = root.querySelector('#toast-text');
  const input = root.querySelector('#toast-input');
  const secondary = root.querySelector('#toast-secondary');
  const action = root.querySelector('#toast-action');
  let timer = null;
  let handlers = {}; // { primary, secondary, submit }

  function reposition() {
    const rail = document.querySelector('.view:not([hidden]) .rail');
    const top = rail ? Math.max(0, rail.getBoundingClientRect().bottom) : 0;
    root.style.setProperty('--toast-top', `${Math.round(top)}px`);
  }

  function reset() {
    clearTimeout(timer);
    handlers = {};
    text.hidden = false;
    input.hidden = true;
    secondary.hidden = true;
  }

  function hide() {
    reset();
    root.hidden = true;
  }

  function open(duration) {
    reposition();
    root.hidden = false;
    if (duration > 0) timer = setTimeout(hide, duration);
  }

  function submit() {
    const run = handlers.submit;
    if (!run) return;
    const { value } = input;
    hide();
    run(value);
  }

  function show(message, options = {}) {
    const { actionLabel = 'Vrátit', onAction = null, secondaryLabel = '', onSecondary = null, duration = DEFAULT_DURATION_MS } = options;
    reset();
    text.textContent = message;
    action.textContent = actionLabel;
    action.hidden = !onAction;
    secondary.textContent = secondaryLabel;
    secondary.hidden = !onSecondary;
    handlers = { primary: onAction, secondary: onSecondary };
    open(duration);
  }

  // Stays open until submitted (Hotovo, Enter or leaving the field) or cancelled (Escape).
  function ask({ value = '', placeholder = '', label, onSubmit }) {
    reset();
    text.hidden = true;
    input.hidden = false;
    input.value = value;
    input.placeholder = placeholder;
    input.setAttribute('aria-label', label);
    action.textContent = 'Hotovo';
    action.hidden = false;
    handlers = { submit: onSubmit };
    open(0);
    input.focus();
  }

  action.addEventListener('click', () => {
    if (handlers.submit) return submit();
    const run = handlers.primary;
    hide();
    run?.();
  });

  secondary.addEventListener('click', () => {
    const run = handlers.secondary;
    hide();
    run?.();
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    } else if (event.key === 'Escape') {
      hide();
    }
  });

  input.addEventListener('blur', () => setTimeout(submit, 0));

  return { show, ask, hide, reposition };
}
