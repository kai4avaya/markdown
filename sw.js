const CACHE_NAME = 'ai-textbook-editor-v4';

// Cache all local files for fast loading
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/editor.js',
  '/js/fileSystem.js',
  '/js/indexedDB.js',
  '/js/state.js',
  '/js/ui.js',
  '/js/aiChat.js',
  '/js/config.js',
  '/js/outlineTree.js',
  '/js/outlineTreeSimple.js',
  '/js/kaiProfile.js',
  '/js/mobileUI.js',
  '/lib/css/all.min.css',
  '/lib/css/tailwind.js',
  '/lib/css/toastui-editor.min.css',
  '/lib/css/ui.fancytree.min.css',
  '/lib/js/jquery-3.6.0.min.js',
  '/lib/js/jquery-ui.min.js',
  '/lib/js/jquery.fancytree-all-deps.min.js',
  '/lib/js/toastui-editor-all.min.js'
];

// Install event - cache local resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching local resources');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker install failed:', error);
      })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both cache and network fail, return a fallback
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
              return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle messages from the main thread (for dynamic caching)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_FILE') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('Caching file:', event.data.url);
          return cache.add(event.data.url);
        })
        .catch(error => {
          console.error('Failed to cache file:', event.data.url, error);
        })
    );
  }
}); 