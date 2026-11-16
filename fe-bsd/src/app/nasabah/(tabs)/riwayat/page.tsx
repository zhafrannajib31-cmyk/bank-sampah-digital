"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui";
import { DepositEntry, GroupLabel, isToday } from "@/features/nasabah/deposit-ui";
import { usePrototype } from "@/features/nasabah/prototype-store";
import type { DepositStatus } from "@/features/nasabah/types";
import { cn } from "@/lib/cn";

type Filter = "semua" | Exclude<DepositStatus, "dibatalkan">;

const filters: { id: Filter; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "menunggu", label: "Menunggu" },
  { id: "diproses", label: "Diproses" },
  { id: "selesai", label: "Selesai" },
];

export default function RiwayatPage() {
  const { deposits } = usePrototype();
  const [filter, setFilter] = useState<Filter>("semua");

  const sorted = [...deposits].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  const visible = sorted.filter((deposit) => filter === "semua" || deposit.status === filter);
  const today = visible.filter((deposit) => isToday(deposit.submittedAt));
  const earlier = visible.filter((deposit) => !isToday(deposit.submittedAt));

  return (
    <div className="mx-auto w-full max-w-[720px] lg:max-w-[1180px]">
      <header className="bg-white px-5 pt-[50px] pb-1">
        <h1 className="text-[22px] leading-[28px] font-bold text-heading">Riwayat Setoran</h1>
        <p className="text-[12px] leading-[16px] text-[#64766d]">
          Semua pengajuan dan transaksi kamu
        </p>
        <div
          role="group"
          aria-label="Filter status"
          className="mt-4 -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={cn(
                "flex h-[42px] shrink-0 items-center justify-center rounded-full border px-5 text-[12px] text-heading focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                filter === item.id
                  ? "border-[#00d951] bg-[#00d951] font-semibold"
                  : "border-[#daeae0] bg-white",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 pt-[18px]">
        {visible.length === 0 ? (
          <EmptyState
            title="Belum ada setoran"
            description="Setoran dengan status ini belum ada."
          />
        ) : (
          <ul className="gap-5 md:columns-2 lg:columns-3">
            {today.length > 0 ? (
              <li className="pb-[10px] break-after-avoid">
                <GroupLabel>HARI INI · 25 OKT 2026</GroupLabel>
              </li>
            ) : null}
            {today.map((deposit) => (
              <li key={deposit.id} className="mb-[10px] break-inside-avoid">
                <DepositEntry deposit={deposit} />
              </li>
            ))}
            {earlier.length > 0 ? (
              <li className="pt-2 pb-[10px] break-after-avoid">
                <GroupLabel>SEBELUMNYA</GroupLabel>
              </li>
            ) : null}
            {earlier.map((deposit) => (
              <li key={deposit.id} className="mb-[10px] break-inside-avoid">
                <DepositEntry deposit={deposit} />
              </li>
            ))}
          </ul>
        )}
        <p className="pt-2 pb-4 text-center text-[12px] font-bold text-black/50">
          Data contoh (simulasi)
        </p>
      </div>
    </div>
  );
}
