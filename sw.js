const CACHE = 'english-daily-v3';

self.addEventListener('install', e => {
  // 不预缓存，运行时按需缓存
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // 网络优先，失败时用缓存
  e.respondWith(
    fetch(e.request).then(response => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return response;
    }).catch(() => {
      return caches.match(e.request);
    })
  );
});
