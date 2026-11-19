import Link from "next/link";
import { Asset } from "@/components/ui";
import { cn } from "@/lib/cn";
import { dayKey, formatDayMonth, formatRupiah, formatWeight } from "./format";
import type { Deposit, DepositStatus } from "./types";

export const isToday = (iso: string) => dayKey(iso) === dayKey(new Date().toISOString());

export const statusMeta: Record<DepositStatus, { label: string; badge: string; symbol: string }> = {
  selesai: {
    label: "Selesai",
    badge: "bg-open-bg text-green-dark-active",
    symbol: "/nasabah/status-selesai.svg",
  },
  menunggu: {
    label: "Menunggu",
    badge: "bg-wait-bg text-wait-text",
    symbol: "/nasabah/status-menunggu.svg",
  },
  diproses: {
    label: "Diproses",
    badge: "bg-proc-bg text-proc-text",
    symbol: "/nasabah/status-diproses.svg",
  },
  dibatalkan: {
    label: "Dibatalkan",
    badge: "bg-danger-soft text-danger-dark",
    symbol: "/nasabah/status-dibatalkan.svg",
  },
};

export const depositTitle = (deposit: Deposit) =>
  deposit.items.map((item) => item.categoryName).join(", ");

export const depositActualWeight = (deposit: Deposit) =>
  deposit.items.reduce((sum, item) => sum + (item.actualWeight ?? 0), 0);

/** Baris riwayat: ikon status, judul, keterangan, nilai (final / estimasi) dan lencana status. */
export function DepositEntry({ deposit }: { deposit: Deposit }) {
  const meta = statusMeta[deposit.status];
  const weighed = deposit.status === "selesai";
  const weight = weighed
    ? formatWeight(depositActualWeight(deposit))
    : `est. ${formatWeight(deposit.items.reduce((sum, item) => sum + item.estimatedWeight, 0))}`;
  const detail = [
    isToday(deposit.submittedAt) ? null : formatDayMonth(deposit.submittedAt),
    deposit.unitName,
    weight,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/nasabah/setoran/${deposit.id}`}
      className="flex min-h-[74px] items-center gap-3 rounded-[16px] border border-line bg-white px-[15px] py-[10px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
    >
      <Asset src={meta.symbol} width={44} height={44} className="shrink-0" />
      <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <span className="text-[14px] leading-[18px] font-semibold text-heading">
          {depositTitle(deposit)}
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

export function GroupLabel({ children }: { children: string }) {
  return <p className="text-[12px] leading-[16px] font-bold text-subtle">{children}</p>;
}
