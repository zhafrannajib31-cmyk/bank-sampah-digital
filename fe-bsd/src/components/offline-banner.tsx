"use client";

import { useOnline } from "@/lib/use-online";

/** Indikator koneksi global: tampil hanya saat perangkat offline. */
export function OfflineBanner() {
  if (useOnline()) return null;
  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[60] bg-[#fff1ca] px-4 py-2 text-center text-[12px] leading-[17px] font-semibold text-[#654a21] shadow-sm"
    >
      Kamu sedang offline. Pengajuan, penimbangan, dan konfirmasi baru bisa dikirim setelah koneksi
      pulih.
    </div>
  );
}
