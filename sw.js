/* Parler thaï — service worker (offline) */
const CACHE = 'thai-pwa-v16';
const ASSETS = [
  './',
  './index.html',
  './classic.html',
  './jungle.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.png',
  './jungle-assets/bg.png',
  './jungle-assets/panel.png',
  './jungle-assets/ok.png',
  './jungle-assets/sound.png',
  './jungle-assets/close.png',
  './jungle-assets/loadbar-bg.png',
  './jungle-assets/loadbar-fill.png',
  './jungle-assets/loadbar-fill-rev.png',
  './jungle-assets/winbanner.png',
  './jungle-assets/stars0.png',
  './jungle-assets/stars1.png',
  './jungle-assets/stars2.png',
  './jungle-assets/stars3.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.all(
      ASSETS.map(u => c.add(u).catch(() => null)) // tolerate any single miss
    )).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        try {
          const url = new URL(req.url);
          const cacheable = url.origin === location.origin ||
            /fonts\.(googleapis|gstatic)\.com$/.test(url.host);
          if (cacheable && res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
        } catch (_) {}
        return res;
      }).catch(() => {
        if (req.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
