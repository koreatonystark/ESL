const CACHE = 'videonote-v2';
const ASSETS = [
  '/ESL/',
  '/ESL/index.html',
  '/ESL/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.6/marked.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
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
  const url = e.request.url;

  // Google 관련 요청은 SW가 절대 건드리지 않음 → 브라우저 직접 처리
  if (url.includes('google.com') || url.includes('googleapis.com') || url.includes('gstatic.com')) {
    return;
  }

  // 그 외: 캐시 우선
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
