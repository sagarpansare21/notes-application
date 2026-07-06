const CACHE_NAME = 'notes-app-cache-v1'

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/icons.svg',
]

// Install event: cache initial baseline assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS)
    }).then(() => {
      // Force the waiting service worker to become the active service worker
      return self.skipWaiting()
    })
  )
})

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: clearing old cache', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      // Claim clients immediately so the page doesn't need a reload
      return self.clients.claim()
    })
  )
})

// Fetch event: Network-first fallback to Cache for assets, Network-only for backend APIs
self.addEventListener('fetch', (event) => {
  // Only intercept GET requests (ignore POST, DELETE, PATCH, etc.)
  if (event.request.method !== 'GET') {
    return
  }

  const requestUrl = new URL(event.request.url)

  // Bypasses APIs, hot reload streams, and prisma studio (don't cache backend request pipelines)
  if (
    requestUrl.pathname.startsWith('/api') || 
    requestUrl.pathname.startsWith('/v1') ||
    requestUrl.port === '3000' || 
    requestUrl.pathname.includes('@vite') ||
    requestUrl.pathname.includes('hot-update')
  ) {
    return
  }

  // Network-First with Cache Fallback strategy
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If the response is valid, clone it and save to cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return response
      })
      .catch(() => {
        // Network failed (offline) -> serve from cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          
          // Fall back to root index page for SPA routing if asset is not found
          if (event.request.mode === 'navigate') {
            return caches.match('/')
          }
        })
      })
  )
})
