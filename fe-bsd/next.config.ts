import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.io", "*.ngrok.app"],
  cacheComponents: true,
  partialPrefetching: true,
  // Gambar statis di public/ tidak ber-hash: cache 1 hari + revalidate di latar (shortcut: ganti nama berkas
  // atau perpanjang cache bila aset sering berubah). Halaman dan data pengguna tidak ikut di-cache.
  async headers() {
    return [
      {
        source: "/:dir(nasabah|petugas|auth|onboarding|icons)/:file(.+\\.(?:svg|png|jpg))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
