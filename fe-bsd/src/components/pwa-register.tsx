"use client";

import { useEffect } from "react";

/** Mendaftarkan service worker (production + dev via ngrok untuk testing PWA). */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Gagal mendaftar tidak boleh mengganggu pemakaian aplikasi.
    });
  }, []);
  return null;
}
