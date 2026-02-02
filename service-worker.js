const CACHE_NAME = 'ramawan-v1';
const ASSETS = [
    './ramawan.html',
    './index.html',
    './css/style.css',
    './css/responsive.css',
    './js/app.js',
    './js/prayer-times.js',
    './js/utils.js',
    './assets/images/icon-192.png',
    './assets/images/icon-512.png'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching assets');
                return cache.addAll(ASSETS);
            })
    );
});

// Activate Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// Fetch Strategy: Cache First, then Network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
