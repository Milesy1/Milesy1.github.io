// Service Worker for Miles Waite Portfolio PWA
const CACHE_NAME = 'miles-waite-portfolio-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/about.html',
  '/style.css',
  '/script.js',
  '/tooltips.js',
  '/favicon-32x32.png',
  '/manifest.json',
  '/offline.html',
  // Project pages
  '/audio-reactive-abstract-geometry.html',
  '/audio-reactive-visuals.html',
  '/creative-coding.html',
  '/cyberpunk-network.html',
  '/generative-max-for-live-tools.html',
  '/generative-music.html',
  '/live-performance.html',
  '/max-for-live-tools.html',
  '/particle-systems.html',
  '/python.html',
  '/systems-architecture.html',
  '/touchdesigner.html',
  '/api-text-dat.html',
  // Edge rendering
  '/edge-rendering/edge-rendering.html',
  '/edge-rendering/edge-rendering.js',
  '/edge-rendering/edge-renderer-worker.js',
  '/edge-rendering/webgpu-edge-renderer.js',
  // External resources
  'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
  'https://cdn.jsdelivr.net/npm/p5@1.6.0/lib/p5.min.js'
];

// Files to cache on demand
const DYNAMIC_FILES = [
  '/assets/',
  '/images/',
  '/videos/',
  '/audio/',
  '/docs/'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache:', request.url);
          return cachedResponse;
        }
        
        // Otherwise, fetch from network
        console.log('Service Worker: Fetching from network:', request.url);
        return fetch(request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache dynamic content
            if (shouldCache(request.url)) {
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  cache.put(request, responseToCache);
                });
            }
            
            return response;
          })
          .catch(error => {
            console.log('Service Worker: Network error, serving offline page:', error);
            
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            // Return a generic offline response for other requests
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Helper function to determine if URL should be cached
function shouldCache(url) {
  // Cache assets and project files
  if (url.includes('/assets/') || 
      url.includes('/images/') || 
      url.includes('/videos/') || 
      url.includes('/audio/') ||
      url.includes('.html') ||
      url.includes('.css') ||
      url.includes('.js') ||
      url.includes('.png') ||
      url.includes('.jpg') ||
      url.includes('.jpeg') ||
      url.includes('.gif') ||
      url.includes('.svg') ||
      url.includes('.webp')) {
    return true;
  }
  
  // Don't cache external analytics or tracking
  if (url.includes('google-analytics') || 
      url.includes('googletagmanager') ||
      url.includes('facebook.com') ||
      url.includes('twitter.com')) {
    return false;
  }
  
  return false;
}

// Background sync for form submissions (if needed in future)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle any pending form submissions or data sync
  return Promise.resolve();
}

// Push notification handling (for future use)
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New content available on Miles Waite Portfolio',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Portfolio',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Miles Waite Portfolio', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the portfolio
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'content-sync') {
    console.log('Service Worker: Periodic sync triggered');
    event.waitUntil(updateContent());
  }
});

function updateContent() {
  // Check for updates to portfolio content
  return Promise.resolve();
}
