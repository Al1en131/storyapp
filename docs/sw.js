const CACHE_NAME = 'story-app-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/scripts/index.js',
    '/scripts/pages/story/storyPage.js',
    '/scripts/presenters/storyPresenter.js',
    '/scripts/utils/indexedDB.js',
    '/styles/main.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      }).catch(() => {
      })
    );
  });
  

self.addEventListener('push', event => {
    let data = { title: "Notification", options: { body: "You have a new notification!" } };
    
    if (event.data) {
        data = event.data.json();
    }
    
    event.waitUntil(
        self.registration.showNotification(data.title, data.options)
    );
});

  
