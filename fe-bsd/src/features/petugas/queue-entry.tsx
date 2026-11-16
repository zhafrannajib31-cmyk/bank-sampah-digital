import Link from "next/link";
import { Asset } from "@/components/ui";
import { statusMeta } from "@/features/nasabah/deposit-ui";
import { formatRupiah, formatWeight } from "@/features/nasabah/format";
import type { Deposit } from "@/features/nasabah/types";
import { cn } from "@/lib/cn";

/** Baris antrean / riwayat petugas: ikon status, nasabah, kode, nilai (final / estimasi) dan lencana status. */
export function QueueEntry({ deposit, href }: { deposit: Deposit; href: string }) {
  const meta = statusMeta[deposit.status];
  const weighed = deposit.status === "selesai";
  const cancelled = deposit.status === "dibatalkan";
  const kg = weighed
    ? deposit.items.reduce((sum, item) => sum + (item.actualWeight ?? 0), 0)
    : deposit.items.reduce((sum, item) => sum + item.estimatedWeight, 0);
  const detail = cancelled
    ? `Alasan: ${deposit.cancellationReason ?? "-"}`
    : [
        deposit.code,
        weighed ? deposit.items.map((item) => item.categoryName).join(", ") : null,
        deposit.method === "pickup" ? "Pickup" : null,
        `${weighed ? "" : "est. "}${formatWeight(kg)}`,
      ]
        .filter(Boolean)
        .join(" · ");

  return (
    <Link
      href={href}
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
        {weighed ? (
          <span className="text-[14px] leading-[15px] font-bold text-green-dark-hover">
            {formatRupiah(deposit.finalTotal ?? 0)}
          </span>
        ) : cancelled ? (
          <span className="text-[14px] leading-[15px] font-bold text-subtle">—</span>
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
