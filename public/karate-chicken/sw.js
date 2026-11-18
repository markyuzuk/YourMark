// Bump CACHE whenever you change any file in /public so players get the update.
const CACHE = 'karate-chicken-v2';
const ASSETS = [
  './', './index.html', './style.css', './game.js', './manifest.webmanifest',
  './assets/karate-chicken.png', './assets/icon-192.png', './assets/icon-512.png',
  './assets/favicon.png', './assets/apple-touch-icon.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Stale-while-revalidate: instant load from cache, refresh in the background.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(e.request, { ignoreSearch: true });
    const network = fetch(e.request).then(res => {
      if (res.ok && (new URL(e.request.url).origin === location.origin || e.request.url.includes('fonts.g'))) cache.put(e.request, res.clone());
      return res;
    }).catch(() => cached || (e.request.mode === 'navigate' ? cache.match('./index.html') : undefined));
    return cached || network;
  }));
});
