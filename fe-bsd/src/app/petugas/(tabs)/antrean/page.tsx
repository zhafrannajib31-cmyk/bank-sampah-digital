"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { EmptyState } from "@/components/ui";
import { GroupLabel } from "@/features/nasabah/deposit-ui";
import type { Deposit } from "@/features/nasabah/types";
import { OFFICER_UNIT } from "@/features/petugas/mock-data";
import { QueueEntry } from "@/features/petugas/queue-entry";
import { usePetugasDeposits } from "@/features/petugas/store";
import { cn } from "@/lib/cn";

type Tab = "menunggu" | "diproses" | "selesai";

const tabs: { id: Tab; label: string }[] = [
  { id: "menunggu", label: "Menunggu" },
  { id: "diproses", label: "Diproses" },
  { id: "selesai", label: "Selesai" },
];

const inTab = (deposit: Deposit, tab: Tab) =>
  tab === "selesai"
    ? deposit.status === "selesai" || deposit.status === "dibatalkan"
    : deposit.status === tab;

export default function AntreanPage() {
  const requested = useSearchParams().get("tab");
  const [tab, setTab] = useState<Tab>(
    tabs.some((item) => item.id === requested) ? (requested as Tab) : "menunggu",
  );
  const deposits = usePetugasDeposits();
  const list = deposits
    .filter((deposit) => inTab(deposit, tab))
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  return (
    <div className="mx-auto w-full max-w-[720px] lg:max-w-[1180px]">
      <header className="bg-white px-5 pt-[50px] pb-1">
        <h1 className="text-[22px] leading-[28px] font-bold text-heading">Antrean Pengajuan</h1>
        <p className="text-[12px] leading-[16px] text-[#64766d]">
          Pengajuan nasabah {OFFICER_UNIT} (simulasi)
        </p>
        <div
          role="group"
          aria-label="Filter status"
          className="mt-4 -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={tab === item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "flex h-[42px] shrink-0 items-center justify-center rounded-full border px-5 text-[12px] text-heading focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                tab === item.id
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
        {list.length === 0 ? (
          <EmptyState
            title="Belum ada pengajuan"
            description="Pengajuan baru dari nasabah akan muncul di sini."
          />
        ) : (
          <>
            <GroupLabel>HARI INI · 16 NOV 2026</GroupLabel>
            <ul className="mt-[10px] grid gap-[10px] md:grid-cols-2 lg:grid-cols-3">
              {list.map((deposit) => (
                <li key={deposit.id}>
                  <QueueEntry
                    deposit={deposit}
                    href={
                      deposit.status === "selesai" || deposit.status === "dibatalkan"
                        ? `/petugas/transaksi/${deposit.id}`
                        : `/petugas/pengajuan/${deposit.id}`
                    }
                  />
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="pt-3 pb-4 text-center text-[12px] font-bold text-black/50">
          Data contoh (simulasi)
        </p>
      </div>
    </div>
  );
}
