const CACHE_NAME = 'pl-event-v14';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './events.js',
  './ui-renderer.js',
  './time-logic.js',
  './holiday.js',
  './cultural.js',
  './rules.js',
  './audio.js',
  './phonetics.js',
  './numbers.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. Install Event: Saves all assets to the browser cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Pre-caching assets');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Cleans up old caches if you update CACHE_NAME
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Serves files from cache so the app works offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached file OR go to network if not cached
        return cachedResponse || fetch(event.request);
      })
  );
});
