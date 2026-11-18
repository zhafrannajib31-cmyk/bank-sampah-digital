"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Asset, EmptyState, StepHeader, buttonClasses } from "@/components/ui";
import { formatDate, formatRupiah, formatWeight } from "@/features/nasabah/format";
import { usePrototype } from "@/features/nasabah/prototype-store";
import { StepNext, StepScreen } from "@/features/nasabah/step-screen";
import type { DepositStatus } from "@/features/nasabah/types";

/** Halaman riwayat transaksi nasabah. */
export default function RiwayatPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { deposits } = usePrototype();

  const completedDeposits = deposits.filter((d) => d.status === "selesai");

  return (
    <StepScreen>
      <StepHeader
        title="Riwayat Transaksi"
        subtitle="Riwayat setoran kamu"
        backHref="/nasabah"
      />
      {completedDeposits.length === 0 ? (
        <EmptyState
          title="Belum ada riwayat"
          description="Transaksi yang sudah selesai akan muncul di sini."
          action={
            <Link href="/nasabah/setor" className={buttonClasses({ size: "sm" })}>
              <Asset src="/nasabah/nav-setor.svg" width={16} height={16} />
              Ajukan Setor
            </Link>
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {completedDeposits.map((deposit) => (
            <li key={deposit.id} className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-light px-3 py-2">
                    <p className="text-[12px] font-semibold text-green-dark">{deposit.code}</p>
                    <p className="text-[10px] text-black/60">
                      {deposit.completedAt ? formatDate(deposit.completedAt) : ""}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black truncate">{deposit.unitName}</p>
                    <p className="text-xs text-black/60">{deposit.unitAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-green-light px-2 py-1 text-[10px] font-semibold text-green-dark">
                    Selesai
                  </span>
                  <Asset src="/nasabah/check-green.svg" width={12} height={12} />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-black/80">
                <span className="rounded-full bg-black/5 px-2 py-1">
                  {deposit.items.reduce((sum, i) => sum + (i.actualWeight ?? 0), 0).toFixed(3)} kg
                </span>
                <span className="rounded-full bg-black/5 px-2 py-1">
                  Rp {formatRupiah(deposit.finalTotal ?? 0)}
                </span>
              </div>
              <Link
                href={`/nasabah/riwayat/${deposit.id}`}
                className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-dark"
              >
                Lihat Detail
                <Asset src="/nasabah/icon-chevron-right.svg" width={16} height={16} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </StepScreen>
  );
}
