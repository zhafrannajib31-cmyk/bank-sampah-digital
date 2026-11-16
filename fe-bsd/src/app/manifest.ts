import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bank Sampah Digital",
    short_name: "BSD",
    description: "Ajukan setoran sampah, timbang, dan pantau transaksi Bank Sampah dari ponsel.",
    lang: "id",
    // Aplikasi dibuka di halaman masuk; guard route per role mengarahkan sesuai peran.
    start_url: "/login",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4f8f5",
    theme_color: "#00c65c",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
