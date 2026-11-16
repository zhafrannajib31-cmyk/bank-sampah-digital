"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui";
import { cn } from "@/lib/cn";
import { DepositCard } from "@/features/nasabah/deposit-card";
import { PrototypeNotice } from "@/features/nasabah/prototype-notice";
import { usePrototype } from "@/features/nasabah/prototype-store";
import type { DepositStatus } from "@/features/nasabah/types";

type FilterValue = "semua" | DepositStatus;

const filters: { value: FilterValue; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "menunggu", label: "Menunggu" },
  { value: "diproses", label: "Diproses" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

export default function RiwayatPage() {
  const { deposits } = usePrototype();
  const [filter, setFilter] = useState<FilterValue>("semua");

  const sortedDeposits = [...deposits].sort(
    (left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime(),
  );
  const filteredDeposits =
    filter === "semua"
      ? sortedDeposits
      : sortedDeposits.filter((deposit) => deposit.status === filter);

  return (
    <div className="flex flex-col gap-5">
      <PrototypeNotice />

      <header className="flex flex-col gap-1">
        <h1 className="text-h2 text-foreground">Riwayat setoran</h1>
        <p className="text-body text-muted">
          Semua pengajuan dan transaksi milik Anda, terbaru lebih dulu.
        </p>
      </header>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter status setoran">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            aria-pressed={filter === item.value}
            className={cn(
              "min-h-10 rounded-full border px-3 py-1.5 text-body-sm font-semibold transition-colors",
              filter === item.value
                ? "border-green-darker bg-primary-soft text-green-darker"
                : "border-border bg-surface text-muted hover:bg-brown-light",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filteredDeposits.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredDeposits.map((deposit) => (
            <DepositCard key={deposit.id} deposit={deposit} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Belum ada transaksi"
          description={
            filter === "semua"
              ? "Setoran yang Anda ajukan akan muncul di sini."
              : `Tidak ada transaksi berstatus ${filter}. Coba pilih filter lain.`
          }
        />
      )}

      <p className="text-caption text-muted">
        Data simulasi. Pengajuan baru pada prototype tersimpan di perangkat ini.
      </p>
    </div>
  );
}
