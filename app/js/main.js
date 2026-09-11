// Composition root: load the data, wire the three views, the tabs and offline support.

import { createStore } from './app-state.js';
import { todayIso } from './dates.js';
import { applyDueRecurring } from './recurring.js';
import { DEFAULT_THEME } from './themes.js';
import { STORAGE_KEY, listSetAside, loadState, readStoredState, removeSetAside, saveState } from './storage.js';
import { createAddView } from './ui/add-view.js';
import { createOverviewView } from './ui/overview-view.js';
import { createSettingsView } from './ui/settings-view.js';
import { createToast } from './ui/toast.js';

const INSTALL_HINT_KEY = 'utraty.installHintDismissed';
const PROBLEM_TOAST_MS = 12000;

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
    key: (index) => [...data.keys()][index] ?? null,
    get length() {
      return data.size;
    },
  };
}

// localStorage can be missing or throw (old private browsing); fall back to memory.
function openStorage() {
  try {
    localStorage.setItem('utraty.probe', '1');
    localStorage.removeItem('utraty.probe');
    return { storage: localStorage, persistent: true };
  } catch {
    return { storage: memoryStorage(), persistent: false };
  }
}

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

// iPadOS reports itself as a Mac, but a Mac has no touch points.
const isIos = () => /iPhone|iPad|iPod/.test(navigator.userAgent)
  || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

function setUpInstallHint(storage) {
  const hint = document.querySelector('#install-hint');
  hint.hidden = !isIos() || isStandalone() || storage.getItem(INSTALL_HINT_KEY) === '1';
  hint.querySelector('[data-action="dismiss-install"]').addEventListener('click', () => {
    hint.hidden = true;
    storage.setItem(INSTALL_HINT_KEY, '1');
  });
}

// The scheme is the data-theme attribute on <html> (index.html sets it early,
// before the first paint); the browser's bar colour follows the scheme's rail.
function applyTheme(themeId = DEFAULT_THEME) {
  const root = document.documentElement;
  if (root.dataset.theme !== themeId) root.dataset.theme = themeId;
  const rail = getComputedStyle(root).getPropertyValue('--rail').trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', rail);
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('sw.js').catch((error) => {
    console.warn('Offline režim se nepodařilo zapnout.', error);
  });
}

function start() {
  const { storage, persistent } = openStorage();
  const loaded = loadState(storage);
  let unreadable = loaded.unreadable ?? null;
  const setAside = {
    list: () => [...listSetAside(storage), ...(unreadable ? [{ key: 'neodlozeno', raw: unreadable }] : [])],
    remove: () => {
      removeSetAside(storage);
      unreadable = null;
    },
  };
  const store = createStore(loaded.state, (next) => saveState(storage, next));
  const toast = createToast(document.querySelector('#toast'));
  const sections = {
    add: document.querySelector('#view-add'),
    overview: document.querySelector('#view-overview'),
    settings: document.querySelector('#view-settings'),
  };
  const tabs = [...document.querySelectorAll('.tab')];

  function showView(name) {
    for (const [key, section] of Object.entries(sections)) section.hidden = key !== name;
    for (const tab of tabs) {
      if (tab.dataset.view === name) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    }
    toast.reposition();
  }

  const views = [
    createAddView({ root: sections.add, store, toast }),
    createOverviewView({ root: sections.overview, store, toast, onAddRequested: () => showView('add') }),
    createSettingsView({ root: sections.settings, store, toast, isStandalone, setAside }),
  ];
  const renderAll = () => views.forEach((view) => view.render(store.get()));

  // Another tab may have saved meanwhile: take its data before the next save overwrites it.
  const syncFromStorage = () => {
    const stored = readStoredState(storage);
    if (stored && JSON.stringify(stored) !== JSON.stringify(store.get())) store.replace(stored);
  };

  // Recurring payments that fell due since the app was last open are written now.
  function writeDuePayments() {
    const today = todayIso();
    const { added } = applyDueRecurring(store.get(), today, Date.now());
    if (added.length === 0) return;
    const result = store.update((state) => applyDueRecurring(state, today, Date.now()).state);
    if (!result.ok) {
      toast.show(result.error, { duration: PROBLEM_TOAST_MS });
      return;
    }
    const names = [...new Set(added.map((expense) => expense.note))].join(', ');
    toast.show(`Zapsané pravidelné platby: ${names}`, {
      actionLabel: 'Ukázat',
      onAction: () => showView('overview'),
      duration: 8000,
    });
  }

  applyTheme(store.get().settings.theme);
  store.subscribe((state) => applyTheme(state.settings.theme));
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme(store.get().settings.theme));
  store.subscribe(renderAll);
  tabs.forEach((tab) => tab.addEventListener('click', () => showView(tab.dataset.view)));
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) syncFromStorage();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    syncFromStorage();
    writeDuePayments();
    renderAll();
  });

  setUpInstallHint(storage);
  renderAll();
  showView('add');
  writeDuePayments();

  if (!persistent) toast.show('Tenhle prohlížeč nedovolí ukládat data. Po zavření zmizí.', { duration: PROBLEM_TOAST_MS });
  else if (loaded.problem) toast.show(loaded.problem, { duration: PROBLEM_TOAST_MS });

  navigator.storage?.persist?.().catch(() => false);
  registerServiceWorker();
}

start();
