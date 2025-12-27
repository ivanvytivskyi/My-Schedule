// Service Worker - V2.1.0
const CACHE_NAME = 'schedule-app-v2.1.0';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './manifest.json',
    './product-catalog.js',
    './kitchen-stock.js',
    './smart-shopping.js',
    './cooking-integration.js',
    './recipe-database.js',
    './recipe-display.js',
    './recipe-utils.js',
    './shopping-quick-add.js',
    './import-functions.js',
    './pwa-manager.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
