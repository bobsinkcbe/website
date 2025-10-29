/* Service Worker for Performance and Caching */

const CACHE_NAME = 'bobs-tattoo-v4';
const urlsToCache = [
    '/',
    '/css/styles.css?v=20241029-4',
    '/css/animations.css?v=20241029-4',
    '/css/responsive.css?v=20241029-4',
    '/js/main.js',
    '/js/gallery.js',
    '/js/booking.js',
    '/js/instagram.js',
    '/assets/images/hero-bg.jpg',
    '/assets/images/artist1.jpg',
    '/assets/images/artist2.jpg',
    '/assets/images/artist3.jpg',
    '/assets/images/background.jpg',
    '/assets/images/Bobs_Logo_Header.jpg',
    'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve cached content
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});