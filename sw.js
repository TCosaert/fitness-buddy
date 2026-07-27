// Fitness Buddy service worker — offline caching for installability.
//
// Strategy is deliberately split:
//   - App shell (HTML, manifest): NETWORK-FIRST, so a deploy reaches an
//     installed phone on the next open. Falls back to cache when offline.
//   - Icons and static art: CACHE-FIRST, they effectively never change.
// A pure cache-first shell would pin the phone to whatever version it first
// installed, which is what we're fixing here.
const CACHE = "fitness-buddy-v11";
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

const isShell = (request, url) =>
  request.mode === "navigate" ||
  url.pathname.endsWith("/") ||
  /\.(html|json)$/.test(url.pathname);

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // Never cache API calls (Anthropic) — always go to network.
  if (url.hostname.endsWith("anthropic.com")) return;
  if (e.request.method !== "GET") return;

  const store = (resp) => {
    if (resp.ok && url.origin === location.origin) {
      const copy = resp.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy));
    }
    return resp;
  };

  if (isShell(e.request, url)) {
    // Fresh if we can, cached if we can't.
    e.respondWith(
      fetch(e.request)
        .then(store)
        .catch(() =>
          caches.match(e.request).then((cached) => cached || caches.match("./index.html"))
        )
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).then(store).catch(() => cached))
  );
});
