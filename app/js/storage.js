// Persistence in localStorage plus JSON backups. Nothing here discards data
// silently: whatever cannot be read is set aside under its own key, and when
// even that fails the raw text is handed back so the app can offer it for saving.

import { plural } from './plural.js';
import { createInitialState } from './state.js';
import { validateState } from './validate.js';

export const STORAGE_KEY = 'utraty.state';

const SET_ASIDE_PREFIX = `${STORAGE_KEY}.poskozeno.`;
const BACKUP_APP_ID = 'utraty';
const RECORD_FORMS = ['poškozený záznam', 'poškozené záznamy', 'poškozených záznamů'];

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function setAside(storage, raw, now) {
  try {
    storage.setItem(`${SET_ASIDE_PREFIX}${now}`, raw);
    return true;
  } catch {
    return false;
  }
}

export function loadState(storage, now = Date.now()) {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) return { state: createInitialState(), problem: null };

  const result = validateState(parseJson(raw));
  if (result.ok && result.dropped === 0) return { state: result.state, problem: null };

  const state = result.ok ? result.state : createInitialState();
  const lost = result.ok
    ? `Vynechali jsme ${plural(result.dropped, RECORD_FORMS)}.`
    : 'Uložená data se nepodařilo přečíst.';
  if (setAside(storage, raw, now)) {
    return { state, problem: `${lost} Původní data jsou odložená v Nastavení.` };
  }
  return { state, problem: `${lost} Původní data se nepodařilo odložit, ulož si je v Nastavení.`, unreadable: raw };
}

// The stored state as another tab left it, or null when there is nothing clean to take.
export function readStoredState(storage) {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) return null;
  const result = validateState(parseJson(raw));
  return result.ok && result.dropped === 0 ? result.state : null;
}

export function saveState(storage, state) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { ok: true };
  } catch (error) {
    const full = error?.name === 'QuotaExceededError';
    return { ok: false, error: full ? 'V telefonu došlo místo pro data appky.' : 'Data se nepodařilo uložit.' };
  }
}

// Copies of unreadable data kept by loadState, newest first.
export function listSetAside(storage) {
  const stamp = (key) => Number(key.slice(SET_ASIDE_PREFIX.length)) || 0;
  return Array.from({ length: storage.length }, (_, index) => storage.key(index))
    .filter((key) => key?.startsWith(SET_ASIDE_PREFIX))
    .sort((a, b) => stamp(b) - stamp(a))
    .map((key) => ({ key, raw: storage.getItem(key) }));
}

export function removeSetAside(storage) {
  for (const { key } of listSetAside(storage)) storage.removeItem(key);
}

export function serializeBackup(state, exportedAt) {
  return JSON.stringify({ app: BACKUP_APP_ID, exportedAt, ...state }, null, 2);
}

// validateState drops the backup envelope fields (app, exportedAt) on its own.
export function parseBackup(text) {
  const data = parseJson(text);
  if (data === undefined) return { ok: false, error: 'Soubor se nepodařilo přečíst.' };
  if (data?.app !== BACKUP_APP_ID) return { ok: false, error: 'Tenhle soubor není záloha z appky Útraty.' };
  return validateState(data);
}

export function backupFileName(today) {
  return `utraty-zaloha-${today}.json`;
}
