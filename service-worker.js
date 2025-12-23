// Service Worker for Weekly Schedule Manager
const CACHE_VERSION = '2.0.0'; // INCREMENT THIS FOR EACH UPDATE!
const CACHE_NAME = `schedule-manager-v${CACHE_VERSION}`;
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './import-functions.js',
  './shopping-quick-add.js',
  './manifest.json',
  './pwa.js',
  './recipe-database.js',
  './recipe-display.js',
  './recipe-prompt-generator.js',
  './recipe-import-parser.js',
  './ingredient-keywords.js',
  './sw-update-listener.js',
  './icon-192-v2.0.0.png',
  './icon-512-v2.0.0.png',
  './apple-touch-icon-v2.0.0.png'
];

// Install service worker
self.addEventListener('install', event => {
  console.log('[SW] Installing version', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become active
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activate - Clean old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating version', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
  
  // Notify all clients about the update
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'CACHE_UPDATED',
        version: CACHE_VERSION
      });
    });
  });
});

// Fetch strategy: Network first, fallback to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response
        const responseToCache = response.clone();
        
        // Update cache with fresh content
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      })
      .catch(() => {
        // Network failed, handle navigation and assets
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return caches.match(event.request);
      })
  );
});

// Handle notifications
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
