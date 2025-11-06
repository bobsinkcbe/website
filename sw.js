/* Service Worker for Performance and Caching */

// Bump this to force a fresh SW install and cache reset
const CACHE_NAME = 'bobs-tattoo-v57';

// Cache only local essentials to avoid CORS issues
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles-complete.css?v=complete-38',
    '/css/animations.css?v=20241029-6',
    '/css/responsive.css?v=20241029-6',
    '/assets/instagram.json',
    '/js/main.js',
    '/js/gallery.js?v=20241031-1',
    '/js/booking.js',
    '/js/instagram.js?v=20251106-tiles4',
    '/assets/images/background.jpg',
    '/assets/images/gallery/circular-image (2).png',
    '/blog/notattooimage.png',
    
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