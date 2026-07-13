const CACHE_NAME = 'outing-app-v2.4.5';

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
      .then(keys =>
        Promise.all(
          keys.map(key =>
            key !== CACHE_NAME
              ? caches.delete(key)
              : null
          )
        )
      )
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

          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, copy));

          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);

          return cached ||
            caches.match('./offline.html');
        })
    );

    return;
  }

  // 로컬 정적 파일은 캐시 우선, 실패 시 네트워크
  event.respondWith(
    caches.match(request)
      .then(cached => {
        return cached ||
          fetch(request)
            .then(response => {
              const copy = response.clone();

              caches.open(CACHE_NAME)
                .then(cache => cache.put(request, copy));

              return response;
            });
      })
  );
});


/* =========================================================
   Web Push 알림 수신
   ========================================================= */

self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data
      ? event.data.json()
      : {};
  } catch (error) {
    data = {
      title: '출타 관리 시스템',
      body: event.data
        ? event.data.text()
        : '새 알림이 있습니다.'
    };
  }

  const title =
    data.title ||
    '출타 관리 시스템';

  const options = {
    body:
      data.body ||
      '새 알림이 있습니다.',

    icon:
      './icons/icon-192.png',

    badge:
      './icons/icon-192.png',

    data: {
      url:
        data.url ||
        data.target_url ||
        './admin_Only.html'
    },

    tag:
      data.tag ||
      undefined,

    renotify:
      Boolean(data.renotify),

    // 지원하는 Android 브라우저에서는 기본 알림 진동을 요청한다.
    // 실제 소리는 운영체제/브라우저의 알림 채널 설정을 따른다.
    vibrate: [200, 100, 200],

    timestamp:
      Number(data.timestamp) || Date.now()
  };

  event.waitUntil(
    self.registration.showNotification(
      title,
      options
    )
  );
});


/* =========================================================
   알림 클릭 처리
   ========================================================= */

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl =
    event.notification?.data?.url ||
    './admin_Only.html';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then(clientList => {
      for (const client of clientList) {
        try {
          const clientUrl =
            new URL(client.url);

          const target =
            new URL(
              targetUrl,
              self.location.origin
            );

          if (
            clientUrl.origin ===
            target.origin
          ) {
            client.navigate(target.href);

            return client.focus();
          }
        } catch (error) {
          // 잘못된 URL이면 새 창 열기로 처리
        }
      }

      return clients.openWindow(targetUrl);
    })
  );
});
