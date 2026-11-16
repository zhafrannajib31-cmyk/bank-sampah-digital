import Link from "next/link";
import { StatusBadge } from "@/components/ui";
import { formatDate, formatRupiah, formatWeight } from "./format";
import type { Deposit } from "./types";

export function DepositCard({ deposit }: { deposit: Deposit }) {
  const isFinal = deposit.status === "selesai";
  const totalWeight = getDepositWeight(deposit);
  const displayValue = isFinal ? (deposit.finalTotal ?? 0) : deposit.estimatedTotal;

  return (
    <Link
      href={`/nasabah/setoran/${deposit.id}`}
      className="block rounded-xl border border-border bg-surface p-4 shadow-sm transition-colors hover:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-body font-semibold text-foreground">{deposit.code}</p>
          <p className="text-body-sm text-muted">
            {formatDate(deposit.submittedAt)} · {deposit.unitName}
          </p>
        </div>
        <StatusBadge status={deposit.status} />
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-caption text-muted">
            {isFinal ? "Nilai final" : "Estimasi nilai (bukan nilai final)"}
          </p>
          <p className="text-h4 text-foreground">{formatRupiah(displayValue)}</p>
        </div>
        <p className="text-body-sm text-muted">
          {deposit.items.length} jenis · {formatWeight(totalWeight)}
        </p>
      </div>

      {deposit.status === "dibatalkan" && deposit.cancellationReason ? (
        <p className="mt-2 text-body-sm text-danger">Alasan: {deposit.cancellationReason}</p>
      ) : null}
    </Link>
  );
}

export function getDepositWeight(deposit: Deposit): number {
  return deposit.items.reduce(
    (total, item) => total + (item.actualWeight ?? item.estimatedWeight),
    0,
  );
}
