const CACHE_VERSION = "bembe-v1";
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const DATA_CACHE = `data-${CACHE_VERSION}`;
const AUDIO_CACHE = `audio-${CACHE_VERSION}`;

const APP_SHELL_URLS = ["/", "/discover", "/manifest.json"];

// Install: cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_URLS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(
            (key) =>
              key !== APP_SHELL_CACHE &&
              key !== DATA_CACHE &&
              key !== AUDIO_CACHE
          )
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: strategy depends on request type
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Audio files: cache-first
  if (
    url.pathname.endsWith(".mp3") ||
    url.pathname.endsWith(".wav") ||
    url.pathname.endsWith(".ogg") ||
    url.pathname.endsWith(".m4a")
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(AUDIO_CACHE).then((cache) => cache.put(request, clone));
            return response;
          })
      )
    );
    return;
  }

  // API / data requests: network-first with cache fallback
  if (url.pathname.startsWith("/api") || request.headers.get("accept")?.includes("application/json")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(DATA_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // App shell / static assets: cache-first with network fallback
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          // Only cache same-origin successful responses
          if (response.ok && url.origin === self.location.origin) {
            const clone = response.clone();
            caches
              .open(APP_SHELL_CACHE)
              .then((cache) => cache.put(request, clone));
          }
          return response;
        })
    )
  );
});

// Listen for messages to cache specific audio URLs on demand
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CACHE_AUDIO") {
    const urls = event.data.urls;
    if (Array.isArray(urls) && urls.length > 0) {
      caches
        .open(AUDIO_CACHE)
        .then((cache) =>
          Promise.all(
            urls.map((url) =>
              cache.match(url).then((existing) => {
                if (!existing) {
                  return fetch(url).then((response) => {
                    if (response.ok) {
                      return cache.put(url, response);
                    }
                  });
                }
              })
            )
          )
        )
        .then(() => {
          if (event.source) {
            event.source.postMessage({
              type: "CACHE_AUDIO_COMPLETE",
              urls,
            });
          }
        })
        .catch((err) => {
          if (event.source) {
            event.source.postMessage({
              type: "CACHE_AUDIO_ERROR",
              error: err.message,
            });
          }
        });
    }
  }
});
