// Bump CACHE whenever you change any file in /public so players get the update.
const CACHE = 'karate-chicken-v59';
const ASSETS = [
  './', './index.html', './style.css', './game.js', './manifest.webmanifest',
  './assets/karate-chicken.png', './assets/icon-192.png', './assets/icon-512.png',
  './assets/favicon.png', './assets/apple-touch-icon.png',
  './assets/kick.webm', './assets/perfect.webm', './assets/whiff.webm',
  './assets/yum.webm', './assets/yumyum.webm', './assets/egg.webm', './assets/squawk.webm',
  './assets/welcome.webm', './assets/caesar.webm', './assets/lucy.webm',
  './assets/jackpot.webm', './assets/gameover.webm', './assets/laser.webm', './assets/gate.webm',
  './characters.html', './board-archive-1.json'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Network-first for code (updates land on every load); cache is the offline fallback.
// Images/fonts: stale-while-revalidate for instant paint.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('/api/')) return; // live data — always straight to network
  const isAsset = /\.(png|jpg|jpeg|svg|ico|woff2?)$/i.test(e.request.url);
  e.respondWith(isAsset ? swr(e.request) : netFirst(e.request));
});
function netFirst(req) {
  // cache:'no-cache' forces revalidation — nginx serves js/css with expires 1y,
  // which would otherwise trap old code in the HTTP cache layer
  return fetch(req, { cache: 'no-cache' }).then(res => {
    if (res.ok && new URL(req.url).origin === location.origin)
      caches.open(CACHE).then(c => c.put(req, res.clone()));
    return res;
  }).catch(() => caches.open(CACHE).then(c =>
    c.match(req, { ignoreSearch: true }).then(hit =>
      hit || (req.mode === 'navigate' ? c.match('./index.html') : undefined))));
}
async function swr(req) {
  const c = await caches.open(CACHE);
  const cached = await c.match(req, { ignoreSearch: true });
  const network = fetch(req).then(res => {
    if (res.ok) c.put(req, res.clone());
    return res;
  }).catch(() => cached);
  return cached || network;
}
