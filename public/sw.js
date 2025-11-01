const CACHE_NAME = 'weather-dashboard-v2';
const RUNTIME_CACHE = 'weather-runtime-v2';
const BASE_PATH = '/Misty';
const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icon-120.png`,
  `${BASE_PATH}/icon-144.png`,
  `${BASE_PATH}/icon-152.png`,
  `${BASE_PATH}/icon-167.png`,
  `${BASE_PATH}/icon-180.png`,
  `${BASE_PATH}/icon-192.png`,
  `${BASE_PATH}/icon-512.png`,
  `${BASE_PATH}/icon-192.svg`,
  `${BASE_PATH}/icon-512.svg`,
  `${BASE_PATH}/screenshot-narrow-1.png`,
  `${BASE_PATH}/screenshot-narrow-2.png`,
  `${BASE_PATH}/screenshot-wide-1.png`
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).catch((err) => {
          console.log('Cache addAll failed:', err);
        });
      })
      .catch((err) => console.log('Cache open failed:', err))
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Fetch event - Network first, falling back to cache, with runtime caching
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  
  // Skip external API calls - always try network for fresh data
  // Use exact hostname matching to prevent URL substring bypass attacks
  const isExternalAPI = url.hostname === 'open-meteo.com' || 
                        url.hostname.endsWith('.open-meteo.com') ||
                        url.hostname === 'api.open-meteo.com' ||
                        url.hostname === 'geocoding-api.open-meteo.com' ||
                        url.hostname === 'air-quality-api.open-meteo.com' ||
                        url.hostname === 'github.com' || 
                        url.hostname.endsWith('.github.com');
  
  const isAPIPath = url.pathname.startsWith('/api/');
  
  if (isExternalAPI || isAPIPath) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful API responses for offline use
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached API data if available when offline
          return caches.match(event.request).then(cached => {
            return cached || new Response(JSON.stringify({
              error: 'Offline - cached data unavailable'
            }), {
              headers: { 'Content-Type': 'application/json' },
              status: 503
            });
          });
        })
    );
    return;
  }

  // For app assets - Cache first, with network fallback
  event.respondWith(
    caches.match(event.request)
      .then((cached) => {
        if (cached) {
          return cached;
        }

        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return response;
          })
          .catch(() => {
            return caches.match(event.request).then((response) => {
              return response || new Response('Offline - content unavailable');
            });
          });
      })
  );
});

// Activate event - clean up old caches and notify clients of updates
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all([
        // Delete old caches
        ...cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE)
          .map((cacheName) => caches.delete(cacheName)),
        // Take control of all clients
        self.clients.claim(),
        // Notify all clients that a new version is available
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'SW_UPDATE_AVAILABLE',
              version: CACHE_NAME
            });
          });
        })
      ]);
    })
  );
});

// Message event - handle client messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
