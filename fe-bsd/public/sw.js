// Service worker dasar (BSD-78): membuat aplikasi dapat di-install.
// shortcut: belum ada caching/offline; strategi cache (network-first untuk data transaksi dan saldo)
// ditambahkan di BSD-79. Sampai saat itu semua permintaan langsung ke jaringan.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
