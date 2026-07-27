// Fitness Buddy service worker — offline caching for installability.
const CACHE = "fitness-buddy-v10";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./surreal.svg",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-180.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // Never cache API calls (Anthropic) — always go to network.
  if (url.hostname.endsWith("anthropic.com")) return;
  if (e.request.method !== "GET") return;
  // Cache-first for our own assets, network fallback.
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).then((resp) => {
      if (resp.ok && url.origin === location.origin) {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
      }
      return resp;
    }).catch(() => cached))
  );
});
