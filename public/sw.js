const CACHE = "desafio-matematico-v1";
const OFFLINE_ASSETS = [
  "/", "/manifest.webmanifest", "/logo-erem-clovis-bevilaqua.png",
  "/flags/australia.png", "/flags/argentina.png", "/flags/inglaterra.png",
  "/flags/marrocos.png", "/flags/franca.png", "/flags/espanha.png",
  "/flags/africa-do-sul.png", "/flags/mexico.png", "/flags/japao.png",
  "/flags/portugal.png", "/flags/canada.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(OFFLINE_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request).catch(() => new Response(JSON.stringify({ scores: [], teams: [], offline: true }), { headers: { "Content-Type": "application/json" } })));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone(); caches.open(CACHE).then(cache => cache.put("/", copy)); return response;
    }).catch(() => caches.match("/")));
    return;
  }

  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) caches.open(CACHE).then(cache => cache.put(request, response.clone()));
    return response;
  })));
});
