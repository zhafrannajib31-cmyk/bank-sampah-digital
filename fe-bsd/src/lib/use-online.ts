"use client";

import { useSyncExternalStore } from "react";

const subscribe = (notify: () => void) => {
  window.addEventListener("online", notify);
  window.addEventListener("offline", notify);
  return () => {
    window.removeEventListener("online", notify);
    window.removeEventListener("offline", notify);
  };
};

/** Status koneksi perangkat. Di server dianggap online agar HTML awal tidak menampilkan banner. */
export const useOnline = () =>
  useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );

/** Pesan saat aksi kirim/timbang/konfirmasi ditolak karena offline (tidak ada yang dikirim diam-diam). */
export const OFFLINE_MESSAGE =
  "Kamu sedang offline. Aksi ini belum dikirim; coba lagi setelah koneksi pulih.";
