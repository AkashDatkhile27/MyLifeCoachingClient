/* eslint-disable no-restricted-globals */

// This variable is REQUIRED by the build system to inject the list of files to cache.
// We disable the unused-vars lint rule because we only reference it to satisfy the build tool's check.
// eslint-disable-next-line no-unused-vars
const ignored = self.__WB_MANIFEST;

const CACHE_NAME = 'melife-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add other local assets you want cached immediately:
  // '/static/js/bundle.js',
  // Note: Caching directories like '/static/css' often fails; usually you need specific files (e.g., '/static/css/main.css')
  // but I have left them here as per your request.
  // '/static/css',
  // '/static/assests'
];

// Install SW
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Listen for requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Activate the SW
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
  );
});