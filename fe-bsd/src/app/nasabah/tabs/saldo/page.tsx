"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Asset, StepHeader, buttonClasses } from "@/components/ui";
import { formatRupiah } from "@/features/nasabah/format";
import { usePrototype } from "@/features/nasabah/prototype-store";
import { StepNext, StepScreen } from "@/features/nasabah/step-screen";
import type { DepositStatus } from "@/features/nasabah/types";

/** Halaman saldo nasabah. Tampilkan total nilai setoran, bukan uang yang bisa ditarik. */
export default function SaldoPage() {
  const { deposits } = usePrototype();

  const completedDeposits = deposits.filter((d) => d.status === "selesai");
  const saldo = completedDeposits.reduce((sum, t) => sum + (t.finalTotal ?? 0), 0);

  return (
    <StepScreen>
      <StepHeader
        title="Saldo"
        subtitle="Total nilai setoran"
        backHref="/nasabah"
      />
      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-black/60">Total nilai setoran (riwayat selesai)</p>
            <p className="text-2xl font-bold tracking-[-0.5px] text-black">
              Rp {formatRupiah(saldo)}
            </p>
          </div>
          <div className="rounded-xl bg-black/5 px-4 py-3">
            <p className="text-[10px] text-black/60">Nilai</p>
            <p className="text-xs font-semibold text-black">
              {completedDeposits.length} transaksi
            </p>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-black/60">
          * Nilai akumulatif transaksi selesai. BUKAN dana yang bisa ditarik.
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href="/nasabah/riwayat"
          className={buttonClasses({ size: "sm" })}
        >
          <Asset src="/nasabah/icon-list.svg" width={16} height={16} />
          Lihat Riwayat
        </Link>
      </div>
    </StepScreen>
  );
}
