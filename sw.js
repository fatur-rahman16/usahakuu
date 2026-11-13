// Naikkan angka ini (v6, v7, ...) setiap kali file aplikasi diubah.
const CACHE = 'usaha-fatur-v17';
const ASSETS = [
  './', './index.html', './style.css', './app.js', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './maskable-512.png',
  './apple-touch-icon.png', './favicon-32.png', './splash.png'
];

self.addEventListener('install', e => {
  // Satu file yang tidak ada tidak menggagalkan instalasi.
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(ASSETS.map(u => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  // Halaman: jaringan dulu, cadangan dari cache saat offline
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return r; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Aset lain: cache dulu, lalu jaringan
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }))
  );
});
