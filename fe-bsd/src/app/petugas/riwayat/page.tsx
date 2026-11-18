"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Asset, StepHeader } from "@/components/ui";
import { formatDate, formatRupiah, formatWeight } from "@/features/nasabah/format";
import { usePetugasDeposits } from "@/features/petugas/store";
import { StepNext, StepScreen } from "@/features/nasabah/step-screen";
import type { Deposit } from "@/features/nasabah/types";

/** Halaman riwayat unit untuk petugas. Menampilkan transaksi yang melibatkan unit yang ditugaskan. */
export default function PetugasRiwayatPage() {
  const router = useRouter();
  const deposits = usePetugasDeposits();

  // Filter: yang sudah selesai (selesai atau dibatalkan) adalah riwayat yang relevan
  const history = deposits.filter((d) => d.status === "selesai" || d.status === "dibatalkan");

  return (
    <StepScreen>
      <StepHeader
        title="Riwayat Unit"
        subtitle="Transaksi yang melibatkan unit"
        backHref="/petugas"
      />

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Asset src="/petugas/no-history.svg" width={48} height={48} />
          <p className="mt-3 text-sm font-medium text-black/70">Belum ada riwayat</p>
          <p className="text-xs text-black/50 mt-1">
            Transaksi yang sudah selesai akan muncul di sini.
          </p>
          <Link
            href="/petugas/antrean"
            className="mt-4 text-sm font-semibold text-blue-dark hover:underline"
          >
            ← Kembali ke Antrean
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((deposit: Deposit) => (
            <div
              key={deposit.id}
              className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-black/60">Kode Transaksi</p>
                  <p className="text-sm font-semibold text-black">{deposit.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-black/60">Status</p>
                  <p
                    className={`text-sm font-semibold ${
                      deposit.status === "selesai"
                        ? "text-green-dark"
                        : "text-red-dark"
                    }`}
                  >
                    {deposit.status === "selesai" ? "Selesai" : "Dibatalkan"}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-black/60">Unit</p>
                  <p className="text-sm font-medium text-black">{deposit.unitName}</p>
                </div>
                <div>
                  <p className="text-xs text-black/60">Berat Aktual</p>
                  <p className="text-sm font-medium text-black">
                    {deposit.items?.reduce((sum, i) => sum + (i.actualWeight ?? 0), 0).toFixed(3)}{" "}
                    kg
                  </p>
                </div>
              </div>

              <div className="mt-3 flex justify-between">
                <div>
                  <p className="text-xs text-black/60">Total Nilai</p>
                  <p className="text-sm font-semibold text-green-dark">
                    Rp {formatRupiah(deposit.finalTotal ?? 0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-black/60">Konfirmasi</p>
                  <p className="text-sm font-medium text-black/70">
                    {deposit.completedAt ? formatDate(deposit.completedAt) : "—"}
                  </p>
                </div>
              </div>

              <div className="mt-2 flex gap-2">
                <Link
                  href={`/petugas/riwayat/${deposit.id}`}
                  className="flex-1 rounded-xl bg-blue-dark px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-mid transition-colors"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </StepScreen>
  );
}
