"use client";

import { useEffect } from "react";

/** Mendaftarkan service worker (hanya production agar tidak mengganggu dev server). */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Gagal mendaftar tidak boleh mengganggu pemakaian aplikasi.
    });
  }, []);
  return null;
}
