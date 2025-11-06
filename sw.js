/* Service Worker for Performance and Caching */

// Bump this to force a fresh SW install and cache reset
const CACHE_NAME = 'bobs-tattoo-v24';

// Cache only local essentials to avoid CORS issues
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles-complete.css?v=complete-38',
    '/assets/images/circular-image (1).png',
    '/css/animations.css?v=20241029-6',
    '/css/responsive.css?v=20241029-6',
    '/js/main.js',
    '/js/gallery.js?v=20241031-1',
    '/js/booking.js',
    '/js/instagram.js',
    '/assets/images/background.jpg',
    '/assets/images/Bobs_Logo_Header.jpg'
];

// Install event - cache resources and activate immediately
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

// Network-first strategy with cache fallback (prevents stale assets)
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)).catch(() => {});
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});

// Activate event - clean up old caches and take control immediately
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            cacheNames.map(cacheName => {
                if (cacheName !== CACHE_NAME) {
                    return caches.delete(cacheName);
                }
            })
        ))
    );
    self.clients.claim();
});