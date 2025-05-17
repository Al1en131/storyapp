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
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => url.pathname.startsWith('https://story-api.dicoding.dev/v1/stories'),
  new StaleWhileRevalidate({
    cacheName: 'api-stories-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'story-images-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, 
      }),
    ],
  })
);
  

self.addEventListener('push', event => {
    let data = { title: "Notification", options: { body: "You have a new notification!" } };
    
    if (event.data) {
        data = event.data.json();
    }
    
    event.waitUntil(
        self.registration.showNotification(data.title, data.options)
    );
});

  
