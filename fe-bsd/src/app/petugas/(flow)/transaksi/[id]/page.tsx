"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Asset, ErrorState } from "@/components/ui";
import { depositActualWeight, statusMeta } from "@/features/nasabah/deposit-ui";
import {
  formatClock,
  formatDateMedium,
  formatRupiah,
  formatWeight,
} from "@/features/nasabah/format";
import { usePetugasDeposits } from "@/features/petugas/store";
import { cn } from "@/lib/cn";

const doneSteps = [
  "Pengajuan diterima dan diperiksa.",
  "Berat aktual ditimbang petugas.",
  "QR nasabah dipindai dan transaksi dikonfirmasi.",
];

/** Detail transaksi (read-only): Selesai dengan rincian harga snapshot, atau Dibatalkan dengan alasan. */
export default function DetailTransaksiPage() {
  const { id } = useParams<{ id: string }>();
  const deposit = usePetugasDeposits().find((candidate) => candidate.id === id);

  if (!deposit || (deposit.status !== "selesai" && deposit.status !== "dibatalkan")) {
    return (
      <div className="mx-auto w-full max-w-[430px] flex-1 bg-surface p-5">
        <Link href="/petugas/riwayat" className="text-[14px] font-semibold text-blue-dark">
          ← Kembali ke riwayat
        </Link>
        <div className="mt-4">
          <ErrorState
            title="Transaksi tidak ditemukan"
            description="Transaksi tidak ada atau belum selesai."
          />
        </div>
      </div>
    );
  }

  const meta = statusMeta[deposit.status];
  const cancelled = deposit.status === "dibatalkan";
  const at = (cancelled ? deposit.cancelledAt : deposit.completedAt) ?? deposit.submittedAt;
  const breakdown = deposit.items
    .map(
      (item) =>
        `${item.categoryName} ${formatWeight(item.actualWeight ?? item.estimatedWeight).replace(" kg", "")}`,
    )
    .join(" · ");
  const infoRows = [
    {
      icon: "/nasabah/detail-map-pin.svg",
      label: "Metode setoran",
      value: `Antar sendiri · ${deposit.unitName}`,
    },
    cancelled
      ? {
          icon: "/nasabah/detail-clock.svg",
          label: "Estimasi berat",
          value: `${formatWeight(deposit.items.reduce((s, i) => s + i.estimatedWeight, 0))} (${breakdown})`,
        }
      : {
          icon: "/nasabah/detail-clock.svg",
          label: "Berat aktual",
          value: `${formatWeight(depositActualWeight(deposit))} (${breakdown})`,
        },
    {
      icon: "/nasabah/detail-phone.svg",
      label: cancelled ? "Dibatalkan oleh" : "Dikonfirmasi oleh",
      value: cancelled
        ? (deposit.cancelledBy ?? "Petugas Unit")
        : `${deposit.officerName ?? "Petugas"} (Petugas)`,
    },
  ];
  const table: [string, string][] = cancelled
    ? [
        ["Alasan", deposit.cancellationReason ?? "-"],
        ["Waktu", `${formatDateMedium(at)}, ${formatClock(at)}`],
        ["Status", "Dibatalkan"],
        ["Nilai transaksi", "Tidak ada"],
      ]
    : [
        ...deposit.items.map((item): [string, string] => [
          `${item.categoryName} · ${formatWeight(item.actualWeight ?? 0)} × ${formatRupiah(item.unitPriceSnapshot ?? 0)}`,
          formatRupiah(item.finalValue ?? 0),
        ]),
        ["Total nilai", formatRupiah(deposit.finalTotal ?? 0)],
        ["Status", "Selesai"],
      ];
  const trail = cancelled ? deposit.events.map((entry) => entry.title) : doneSteps;

  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col bg-canvas shadow-sm">
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-[200px] bg-linear-to-r from-teal-start to-teal-end" />
        <div className="relative px-5 pt-12">
          <Link
            href="/petugas/riwayat"
            aria-label="Kembali"
            className="flex size-11 items-center justify-center rounded-[14px] bg-[#f0fcf6] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <Asset src="/nasabah/icon-chevron-left.svg" width={21} height={21} />
          </Link>
          <section
            aria-label="Informasi transaksi"
            className="mt-11 flex flex-col gap-[14px] rounded-[22px] bg-white p-[18px] shadow-[0_12px_25px_rgba(24,60,36,0.06)]"
          >
            <div className="flex flex-col gap-[2px]">
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-[19px] leading-[26px] font-bold text-heading">
                  {deposit.customerName}
                </h1>
                <span
                  className={cn(
                    "flex h-[26px] shrink-0 items-center rounded-full px-3 text-[12px] font-semibold",
                    meta.badge,
                  )}
                >
                  {meta.label}
                </span>
              </div>
              <p className="text-[12px] leading-[17px] text-subtle">
                {deposit.code} · {cancelled ? "dibatalkan" : "selesai"} {formatDateMedium(at)},{" "}
                {formatClock(at)}
              </p>
            </div>
            <ul className="flex flex-col gap-[14px]">
              {infoRows.map((row) => (
                <li key={row.label} className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-tile-bg">
                    <Asset src={row.icon} width={17} height={17} />
                  </span>
                  <span className="flex min-w-0 flex-col gap-[2px] text-[13px]">
                    <span className="leading-[18px] font-semibold text-heading">{row.label}</span>
                    <span className="leading-[19px] text-subtle">{row.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section aria-labelledby="rincian" className="flex flex-col gap-2 px-5 pt-5">
        <div className="flex items-center justify-between">
          <h2 id="rincian" className="text-[15px] leading-[20px] font-bold text-heading">
            {cancelled ? "Alasan Pembatalan" : "Rincian Transaksi"}
          </h2>
          <p className="text-[12px] text-subtle">{cancelled ? "Tercatat" : "Nilai final"}</p>
        </div>
        <dl className="overflow-hidden rounded-[18px] border border-line bg-white text-[13px] text-heading">
          {table.map(([label, value]) => (
            <div
              key={label}
              className="flex min-h-[43.5px] items-center justify-between gap-3 border-b-[0.5px] border-line px-4 py-2 last:border-b-0"
            >
              <dt className="font-medium">{label}</dt>
              <dd className="text-right font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-[12px] leading-[18px] text-subtle">
          {cancelled
            ? "Pembatalan tercatat sebagai event dan tidak mengubah saldo nasabah."
            : "Nilai dihitung server: berat aktual × harga snapshot saat konfirmasi."}
        </p>
      </section>

      <section className="px-5 pt-5 pb-5">
        <div className="flex flex-col gap-[10px] rounded-[18px] bg-info-bg p-4 leading-[20px]">
          <h2 className="text-[14px] font-bold text-info-title">Jejak Transaksi</h2>
          <ol className="flex flex-col text-[12px] text-info-body">
            {trail.map((text, index) => (
              <li key={`${text}-${index}`} className="flex gap-[3px]">
                <span className="w-[15px] shrink-0 text-right">{index + 1}.</span>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="sticky bottom-0 mt-auto flex items-center border-t-[0.5px] border-line bg-white px-5 pt-[14px] pb-[21px]">
        <Link
          href="/petugas/riwayat"
          className="flex h-[53px] min-w-0 flex-1 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-foreground shadow-[0_7px_14px_rgba(0,200,75,0.19)] hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Kembali ke Selesai
        </Link>
      </div>
    </div>
  );
}
