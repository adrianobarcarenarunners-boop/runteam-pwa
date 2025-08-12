const CACHE = 'runteam-cache-v1';
const assets = ['/', '/index.html', '/styles.css'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(assets)));
  self.skipWaiting();
});

self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
