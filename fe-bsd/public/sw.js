// Service worker (BSD-78 install, BSD-79 cache dasar).
// Strategi: halaman dan API selalu network-first/network-only (data transaksi dan saldo tidak pernah
// disimpan di cache); jika navigasi gagal karena offline, tampilkan halaman /offline.
// Aset statis bernama-hash (/_next/static, /icons) disimpan cache-first.
// shortcut: halaman /offline di-cache saat install tanpa aset CSS/JS-nya; aset itu masuk cache setelah
// pernah dimuat online. Upgrade ke precache penuh jika halaman offline harus tampil dari instalasi pertama.
const VERSION = "bsd-v2";
const CACHE = `${VERSION}-static`;
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          }),
      ),
    );
  }
});
