const STATIC_FILEPATHS = [
  "/",
  "/favicon.ico",
  "/index.html",
  "/logo192.png",
  "/logo512.png",
  "/manifest.json",
  "/robots.txt",
  "/service-worker.js",
];
const STATIC_CACHE_KEY = "static-cache-v2";

self.oninstall = event => event.waitUntil(install());
self.onactivate = event => event.waitUntil(activate());
self.onfetch = event => {
  if (
    event.request.cache === "only-if-cached" &&
    event.request.mode !== "same-origin"
  ) {
    return;
  }
  if (event.request.method === "GET") {
    event.respondWith(checkCache(event.request));
  }
};

async function install() {
  try {
    const staticCache = await caches.open(STATIC_CACHE_KEY);
    await staticCache.addAll(STATIC_FILEPATHS);
    self.skipWaiting();
  } catch (err) {
    console.log(err);
  }
}

async function activate() {
  try {
    const keyList = await caches.keys();
    for (const key of keyList) {
      if (key !== STATIC_CACHE_KEY) {
        await caches.delete(key);
      }
    }
    self.clients.claim();
  } catch (err) {
    console.log(err);
  }
}

async function checkCache(request) {
  try {
    const staticCache = await caches.open(STATIC_CACHE_KEY);
    const response = await staticCache.match(request);
    return response || fetch(request);
  } catch (err) {
    console.log(err);
  }
}
