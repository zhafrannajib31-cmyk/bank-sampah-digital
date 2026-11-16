import type { Metadata } from "next";
import { RetryButton } from "./retry-button";

export const metadata: Metadata = { title: "Sedang offline" };

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col items-center justify-center gap-4 bg-canvas px-8 text-center">
      <h1 className="text-[20px] leading-[26px] font-bold text-heading">Kamu sedang offline</h1>
      <p className="text-[14px] leading-[20px] text-subtle">
        Halaman ini belum bisa dimuat tanpa koneksi internet. Data setoran dan saldo selalu diambil
        terbaru dari server, jadi tidak ditampilkan dari penyimpanan perangkat.
      </p>
      <RetryButton />
    </main>
  );
}
