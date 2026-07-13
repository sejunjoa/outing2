const CACHE_NAME = 'outing-app-v2.2.3';
const APP_SHELL = [
  './',
  './index.html',
  './register_user.html',
  './register_admin.html',
  './reset_password.html',
  './schedule_user.html',
  './config.js',
  './auth.js',
  './toast.js',
  './manifest.json',
  './offline.html',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  // Supabase/API/CDN 요청은 캐시하지 않고 네트워크로 그대로 보냄
  if (url.origin !== self.location.origin) return;

  // 페이지 이동은 네트워크 우선, 실패 시 캐시/오프라인 페이지
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match('./offline.html');
        })
    );
    return;
  }

  // 로컬 정적 파일은 캐시 우선, 실패 시 네트워크
  event.respondWith(
    caches.match(request).then(cached => {
      return cached || fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      });
    })
  );
});
