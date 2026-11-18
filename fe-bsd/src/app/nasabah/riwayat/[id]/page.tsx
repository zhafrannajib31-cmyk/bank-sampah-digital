"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Asset, EmptyState, StepHeader, buttonClasses } from "@/components/ui";
import { formatDate, formatRupiah, formatWeight } from "@/features/nasabah/format";
import { usePrototype } from "@/features/nasabah/prototype-store";
import { StepNext, StepScreen } from "@/features/nasabah/step-screen";
import type { Deposit } from "@/features/nasabah/types";

/** Detail transaksi bukti setoran nasabah. */
export default function TransaksiDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { deposits } = usePrototype();

  const deposit = deposits.find((d) => d.id === id);

  if (!deposit) {
    return (
      <StepScreen>
        <StepHeader
          title="Transaksi tidak ditemukan"
          subtitle="Kembali ke riwayat"
          backHref="/nasabah/riwayat"
        />
        <EmptyState
          title="Transaksi tidak ditemukan"
          description="Data transaksi yang Anda cari tidak tersedia."
          action={
            <Link href="/nasabah/riwayat" className={buttonClasses({ size: "sm" })}>
              <Asset src="/nasabah/nav-setor.svg" width={16} height={16} />
              Kembali ke Riwayat
            </Link>
          }
        />
      </StepScreen>
    );
  }

  const totalWeight = deposit.items.reduce((sum, i) => sum + (i.actualWeight ?? 0), 0);
  const totalValue = deposit.finalTotal ?? 0;
  const isCompleted = deposit.status === "selesai";

  return (
    <StepScreen>
      <StepHeader
        title="Bukti Transaksi"
        subtitle={`Transaksi ${deposit.code}`}
        backHref="/nasabah/riwayat"
      />

      {/* Status badge */}
      <div className="mb-4 rounded-2xl bg-green-light/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <Asset src="/nasabah/check-green.svg" width={16} height={16} />
          <span className="text-sm font-semibold text-green-dark">
            Transaksi Selesai
          </span>
        </div>
        <p className="text-xs text-black/60 mt-1">
          Penyesoran sampah Anda telah diproses dan dikonfirmasi petugas.
        </p>
      </div>

      {/* Form infomasi transaksi */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-black/60">ID Transaksi</p>
            <p className="text-sm font-semibold text-black">{deposit.code}</p>
          </div>
          <div>
            <p className="text-xs text-black/60">Tanggal Konfirmasi</p>
            <p className="text-sm font-semibold text-black">
              {deposit.completedAt ? formatDate(deposit.completedAt) : "—"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-black/60">Berat Aktual</p>
            <p className="text-sm font-semibold text-black">
              {deposit.items.reduce((sum, i) => sum + (i.actualWeight ?? 0), 0).toFixed(3)} kg
            </p>
          </div>
          <div>
            <p className="text-xs text-black/60">Nilai Total</p>
            <p className="text-sm font-semibold text-black">
              Rp {formatRupiah(deposit.finalTotal ?? 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Rincian item */}
      <div className="mt-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-black mb-3">
          Detail Penimbangan
        </h3>
        <div className="space-y-3">
          {deposit.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-black/5 px-3 py-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black">{item.categoryName}</p>
                <p className="text-xs text-black/60">
                  Berat perkiraan: {item.estimatedWeight.toFixed(3)} kg
                </p>
              </div>
              <div className="text-right text-sm font-medium text-black/80">
                <p>
                  Berat aktual:{" "}
                  {item.actualWeight ? item.actualWeight.toFixed(3) : "—"} kg
                </p>
                <p className="text-xs text-black/60">
                  Harga: Rp {formatRupiah(item.unitPriceSnapshot ?? 0)}/kg
                </p>
                {item.finalValue !== undefined && (
                  <p className="text-xs font-semibold text-green-dark">
                    Nilai: Rp {formatRupiah(item.finalValue)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm details */}
      {deposit.officerName && (
        <div className="rounded-2xl border border-black/5 bg-blue-light/5 p-4">
          <div className="flex items-start gap-3">
            <Asset src="/nasabah/dot-blue.svg" width={10} height={10} />
            <div className="ml-3">
              <p className="text-xs text-black/60">Dikonfirmasi oleh</p>
              <p className="text-sm font-semibold text-black">{deposit.officerName}</p>
              <p className="text-xs text-black/60">
                {deposit.completedAt ? formatDate(deposit.completedAt) : ""}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tombol aksi */}
      <div className="mt-4 flex gap-2">
        <Link
          href="/nasabah/riwayat"
          className={buttonClasses({ size: "sm" })}
        >
          <Asset src="/nasabah/icon-arrow-left.svg" width={16} height={16} />
          Kembali
        </Link>
      </div>
    </StepScreen>
  );
}
