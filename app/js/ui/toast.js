// The undo strip, fed down from beneath the visible view's top rail. One
// message at a time: a new one replaces the old, and its action runs at most once.

const DEFAULT_DURATION_MS = 5000;

export function createToast(root) {
  const text = root.querySelector('#toast-text');
  const action = root.querySelector('#toast-action');
  let timer = null;
  let onAction = null;

  function reposition() {
    const rail = document.querySelector('.view:not([hidden]) .rail');
    const top = rail ? Math.max(0, rail.getBoundingClientRect().bottom) : 0;
    root.style.setProperty('--toast-top', `${Math.round(top)}px`);
  }

  function hide() {
    clearTimeout(timer);
    root.hidden = true;
    onAction = null;
  }

  action.addEventListener('click', () => {
    const run = onAction;
    hide();
    run?.();
  });

  function show(message, { actionLabel = 'Vrátit', onAction: handler = null, duration = DEFAULT_DURATION_MS } = {}) {
    clearTimeout(timer);
    text.textContent = message;
    action.textContent = actionLabel;
    action.hidden = !handler;
    onAction = handler;
    reposition();
    root.hidden = false;
    timer = setTimeout(hide, duration);
  }

  return { show, hide, reposition };
}
