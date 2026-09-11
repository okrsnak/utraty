// Unique ids for expenses and categories. randomUUID needs a secure context
// (HTTPS or localhost); the fallback covers trying the app over plain http.

let counter = 0;

export function createId(cryptoApi = globalThis.crypto) {
  if (typeof cryptoApi?.randomUUID === 'function') return cryptoApi.randomUUID();
  counter += 1;
  return `${Date.now().toString(36)}-${counter.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
