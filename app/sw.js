// Offline support. The whole app is precached as one versioned set and served
// from it, so a launch never mixes files from two versions. Each deploy stamps
// the commit into CACHE (see .github/workflows/pages.yml); the new set installs
// in the background and the next launch uses it.

const CACHE = 'utraty-__BUILD__';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/base.css',
  './css/controls.css',
  './css/add.css',
  './css/shelf.css',
  './css/overview.css',
  './css/entries.css',
  './css/recurring.css',
  './css/settings.css',
  './fonts/archivo-latin.woff2',
  './fonts/archivo-latin-ext.woff2',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './js/main.js',
  './js/app-state.js',
  './js/categories.js',
  './js/dates.js',
  './js/ids.js',
  './js/keypad.js',
  './js/money.js',
  './js/period.js',
  './js/plural.js',
  './js/recurring.js',
  './js/state.js',
  './js/storage.js',
  './js/summary.js',
  './js/validate.js',
  './js/ui/add-view.js',
  './js/ui/backup-section.js',
  './js/ui/backup.js',
  './js/ui/dom.js',
  './js/ui/entry-editor.js',
  './js/ui/overview-view.js',
  './js/ui/picker.js',
  './js/ui/recurring-section.js',
  './js/ui/settings-view.js',
  './js/ui/toast.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

async function respond(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) return cached;
  try {
    return await fetch(request);
  } catch {
    const shell = request.mode === 'navigate' ? await cache.match('./index.html') : undefined;
    return shell ?? Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(respond(request));
});
