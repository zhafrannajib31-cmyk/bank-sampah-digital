"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui";
import { formatRupiah, formatWeight } from "@/features/nasabah/format";
import { statusMeta, GroupLabel } from "@/features/nasabah/deposit-ui";
import { Asset } from "@/components/ui";
import Link from "next/link";
import { OFFICER_UNIT } from "@/features/petugas/mock-data";
import { usePetugasDeposits } from "@/features/petugas/store";
import type { Deposit } from "@/features/nasabah/types";
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

function QueueEntry({ deposit }: { deposit: Deposit }) {
  const meta = statusMeta[deposit.status];
  const weighed = deposit.status === "selesai";
  const kg = weighed
    ? deposit.items.reduce((sum, item) => sum + (item.actualWeight ?? 0), 0)
    : deposit.items.reduce((sum, item) => sum + item.estimatedWeight, 0);
  const detail = [
    deposit.code,
    deposit.method === "pickup" ? "Pickup" : null,
    `${weighed ? "" : "est. "}${formatWeight(kg)}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/petugas/pengajuan/${deposit.id}`}
      className="flex min-h-[82px] items-center gap-3 rounded-[16px] border border-line bg-white px-[15px] py-[10px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
    >
      <Asset src={meta.symbol} width={44} height={44} className="shrink-0" />
      <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <span className="text-[14px] leading-[18px] font-semibold text-heading">
          {deposit.customerName}
        </span>
        <span className="text-[12px] leading-[17px] text-subtle">{detail}</span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-[3px]">
        {deposit.status === "selesai" ? (
          <span className="text-[14px] leading-[15px] font-bold text-green-dark-hover">
            {formatRupiah(deposit.finalTotal ?? 0)}
          </span>
        ) : deposit.status === "dibatalkan" ? (
          <span className="text-[14px] leading-[15px] font-bold text-danger-dark">—</span>
        ) : (
          <span className="text-right text-[12px] leading-[15px] font-bold text-subtle">
            Estimasi
            <br />
            {formatRupiah(deposit.estimatedTotal)}
          </span>
        )}
        <span
          className={cn(
            "flex h-[19px] items-center rounded-full px-[9px] text-[12px] leading-[17px] font-semibold",
            meta.badge,
          )}
        >
          {meta.label}
        </span>
      </span>
    </Link>
  );
}

export default function AntreanPage() {
  const [tab, setTab] = useState<Tab>("menunggu");
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
                  <QueueEntry deposit={deposit} />
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
