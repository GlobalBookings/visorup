const CACHE_NAME = 'visorup-v1';
const TILE_CACHE = 'visorup-tiles-v1';
const OFFLINE_PAGE = '/offline.html';

const APP_SHELL = [
  '/',
  '/styles.css',
  '/site.js',
  '/app.js',
  '/data.js',
  '/planner.js',
  '/route-builder.js',
  '/trip-builder.js',
  '/trip-planner.js',
  '/community.js',
  '/gamification.js',
  '/notifications.js',
  '/supabase-client.js',
  '/supabase-config.js',
  '/bikes.js',
  '/bike-catalogue.js',
  '/articles.js',
  '/fuel-stations-uk.js',
  '/poi-england.js',
  '/poi-scotland.js',
  '/poi-wales-islands.js',
  '/trips/scottish-highlands-loop.js',
  '/trips/nc500-complete.js',
  '/trips/welsh-mountain-passes.js',
  '/trips/lake-district-ultimate.js',
  '/trips/channel-islands-explorer.js',
  '/trips/coastal-cornwall.js',
  '/manifest.json',
  '/offline.html',
  '/public/icons/icon-192x192.png',
  '/public/icons/icon-512x512.png'
];

// Install: pre-cache app shell
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(APP_SHELL);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) {
          return n !== CACHE_NAME && n !== TILE_CACHE;
        }).map(function(n) { return caches.delete(n); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch: strategy per resource type
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  // Skip non-GET and cross-origin auth/API requests
  if (event.request.method !== 'GET') return;
  if (url.hostname.includes('supabase')) return;
  if (url.hostname.includes('googleapis.com') && url.pathname.includes('/auth/')) return;

  // Map tiles: network-first with cache fallback (auto-caches viewed tiles)
  if (isTileRequest(url)) {
    event.respondWith(networkFirstTile(event.request));
    return;
  }

  // OSRM routing: network-only (responses are unique per route)
  if (url.hostname.includes('router.project-osrm.org')) return;

  // App shell and POI data: cache-first with network fallback
  if (isAppShell(url) || isPOIData(url)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // External CDN resources (fonts, FA, Leaflet): cache-first
  if (isExternalCDN(url)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Everything else: network-first with offline fallback
  event.respondWith(networkFirst(event.request));
});

function isTileRequest(url) {
  return url.hostname.includes('basemaps.cartocdn.com') ||
         url.hostname.includes('tile.openstreetmap.org') ||
         url.hostname.includes('tiles.stadiamaps.com');
}

function isAppShell(url) {
  if (url.origin !== self.location.origin) return false;
  var path = url.pathname;
  return APP_SHELL.indexOf(path) !== -1 || path === '/';
}

function isPOIData(url) {
  if (url.origin !== self.location.origin) return false;
  return url.pathname.match(/\/(poi-|fuel-stations)/);
}

function isExternalCDN(url) {
  return url.hostname.includes('fonts.googleapis.com') ||
         url.hostname.includes('fonts.gstatic.com') ||
         url.hostname.includes('cdnjs.cloudflare.com') ||
         url.hostname.includes('unpkg.com') ||
         url.hostname.includes('cdn.jsdelivr.net');
}

// Cache-first: return cached version, fall back to network
function cacheFirst(request) {
  return caches.match(request).then(function(cached) {
    if (cached) return cached;
    return fetch(request).then(function(response) {
      if (response.ok) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(request, clone); });
      }
      return response;
    });
  }).catch(function() {
    if (request.mode === 'navigate') return caches.match(OFFLINE_PAGE);
    return new Response('', { status: 503 });
  });
}

// Network-first: try network, fall back to cache
function networkFirst(request) {
  return fetch(request).then(function(response) {
    if (response.ok) {
      var clone = response.clone();
      caches.open(CACHE_NAME).then(function(cache) { cache.put(request, clone); });
    }
    return response;
  }).catch(function() {
    return caches.match(request).then(function(cached) {
      if (cached) return cached;
      if (request.mode === 'navigate') return caches.match(OFFLINE_PAGE);
      return new Response('', { status: 503 });
    });
  });
}

// Tile-specific: network-first, cache in separate tile cache
function networkFirstTile(request) {
  return fetch(request).then(function(response) {
    if (response.ok) {
      var clone = response.clone();
      caches.open(TILE_CACHE).then(function(cache) { cache.put(request, clone); });
    }
    return response;
  }).catch(function() {
    return caches.match(request).then(function(cached) {
      return cached || new Response('', { status: 503 });
    });
  });
}

// Region tile pre-download messaging
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'CACHE_TILES') {
    var tiles = event.data.tiles || [];
    caches.open(TILE_CACHE).then(function(cache) {
      var done = 0;
      var total = tiles.length;
      function next() {
        if (done >= total) {
          event.source.postMessage({ type: 'CACHE_TILES_DONE', cached: done });
          return;
        }
        var url = tiles[done];
        cache.match(url).then(function(existing) {
          if (existing) {
            done++;
            event.source.postMessage({ type: 'CACHE_TILES_PROGRESS', done: done, total: total });
            next();
          } else {
            fetch(url).then(function(resp) {
              if (resp.ok) cache.put(url, resp);
              done++;
              event.source.postMessage({ type: 'CACHE_TILES_PROGRESS', done: done, total: total });
              next();
            }).catch(function() {
              done++;
              next();
            });
          }
        });
      }
      next();
    });
  }

  if (event.data && event.data.type === 'CLEAR_TILE_CACHE') {
    caches.delete(TILE_CACHE).then(function() {
      event.source.postMessage({ type: 'TILE_CACHE_CLEARED' });
    });
  }

  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    caches.open(TILE_CACHE).then(function(cache) {
      return cache.keys();
    }).then(function(keys) {
      event.source.postMessage({ type: 'CACHE_SIZE', count: keys.length });
    });
  }
});
