const CACHE_NAME = 'time-tracker-v200';
const ASSETS = ['./', './index.html', './manifest.json', './bg-fish.png', './bg-week.png', './bg-month.png', './bg-stats.png', './bg-settings.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Network-first for HTML documents to ensure latest code
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('.json')) {
    e.respondWith(
      fetch(e.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => caches.match(e.request))
    );
  } else {
    // Cache-first for static assets (images, etc.)
    e.respondWith(
      caches.match(e.request).then(cached => {
        const fetchPromise = fetch(e.request).then(response => {
          if (response && response.status === 200 && e.request.url.startsWith('http')) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
          }
          return response;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});

// 单窗口控制：已有窗口请求聚焦自己（可恢复最小化状态），并通知其他窗口关闭
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'focus-me') {
    e.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
        // 聚焦发送消息的那个窗口
        const sourceId = e.source ? e.source.id : null;
        const targetClient = clients.find(c => c.id === sourceId) || clients[0];
        if (targetClient) {
          return targetClient.focus().then(client => {
            // 聚焦成功后，通知其他所有窗口关闭
            const others = clients.filter(c => c.id !== targetClient.id);
            others.forEach(c => c.postMessage({ type: 'close-yourself' }));
            return client;
          }).catch(() => {
            // focus 失败，也尝试通知其他窗口关闭
            const others = clients.filter(c => c.id !== sourceId);
            others.forEach(c => c.postMessage({ type: 'close-yourself' }));
          });
        }
      })
    );
  }
});
