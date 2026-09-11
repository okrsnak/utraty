// Holds the current state. Every change is persisted first and applied only
// when saving succeeded, so the screen never shows data the phone does not have.
// replace() takes in state that is already stored, e.g. written by another tab.

export function createStore(initialState, persist) {
  let current = initialState;
  const listeners = new Set();
  const notify = () => listeners.forEach((listener) => listener(current));

  return {
    get: () => current,
    update(transition) {
      const next = transition(current);
      const result = persist(next);
      if (!result.ok) return result;
      current = next;
      notify();
      return result;
    },
    replace(state) {
      current = state;
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
