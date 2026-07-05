const CACHE = 'seepferdchen-v70';
const CACHE_ASSETS = ['./', './manifest.json', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CACHE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.endsWith('/data') || url.pathname.endsWith('/backup')) return;
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        if (resp.ok) {
          caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
        }
        return resp;
      })
      .catch(() => caches.match(e.request))
  );
});
