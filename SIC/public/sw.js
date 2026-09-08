const CACHE_NAME = 'childpause-v1';

self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Network-first strategy for API calls
  if (event.request.url.includes('supabase')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => new Response('Offline - API unavailable', { status: 503 }))
    );
  } else {
    // Cache-first for static assets
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
        .catch(() => new Response('Offline', { status: 503 }))
    );
  }
});
