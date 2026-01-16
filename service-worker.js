// Service Worker - V2.1.0
const CACHE_NAME = 'schedule-app-v2.1.0';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './src/engine/schedule-engine.js',
    './manifest.json',
    './src/features/products/model/product-catalog.js',
    './src/features/kitchen-stock/services/kitchen-stock.js',
    './src/features/smart-shopping/services/smart-shopping.js',
    './src/features/cooking/services/cooking-integration.js',
    './src/features/recipes/model/recipe-database.js',
    './src/features/recipes/ui/recipe-display.js',
    './src/features/recipes/services/recipe-utils.js',
    './src/features/shopping/ui/shopping-quick-add.js',
    './src/features/schedule-ui/services/import-functions.js',
    './src/features/pwa/services/pwa-manager.js',
    './src/features/work-commute/services/overlap-resolver.js',
    './src/features/products/services/product-management.js'
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
