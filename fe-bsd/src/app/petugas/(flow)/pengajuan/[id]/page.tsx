"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Asset, ConfirmDialog, ErrorState } from "@/components/ui";
import { statusMeta } from "@/features/nasabah/deposit-ui";
import {
  formatClock,
  formatDateMedium,
  formatRupiah,
  formatWeight,
} from "@/features/nasabah/format";
import { acceptDeposit, usePetugasDeposits } from "@/features/petugas/store";
import { userMessage } from "@/lib/api";
import { cn } from "@/lib/cn";
import { useOnline } from "@/lib/use-online";

const steps = [
  "Periksa jenis dan kondisi sampah.",
  "Timbang dan input berat aktual per jenis.",
  "Konfirmasi transaksi setelah QR nasabah dipindai.",
];

export default function DetailPengajuanPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const deposit = usePetugasDeposits().find((candidate) => candidate.id === id);
  const [askReject, setAskReject] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const online = useOnline();

  if (!deposit) {
    return (
      <div className="mx-auto w-full max-w-[430px] flex-1 bg-surface p-5">
        <Link href="/petugas/antrean" className="text-[14px] font-semibold text-blue-dark">
          ← Kembali ke antrean
        </Link>
        <div className="mt-4">
          <ErrorState
            title="Pengajuan tidak ditemukan"
            description="Pengajuan tidak ada atau bukan milik unit Anda."
          />
        </div>
      </div>
    );
  }

  const meta = statusMeta[deposit.status];
  const waiting = deposit.status === "menunggu";
  const pickup = deposit.method === "pickup";
  const totalWeight = deposit.items.reduce((sum, item) => sum + item.estimatedWeight, 0);
  const breakdown = deposit.items
    .map((item) => `${item.categoryName} ${formatWeight(item.estimatedWeight).replace(" kg", "")}`)
    .join(" · ");
  const infoRows = [
    {
      icon: "/nasabah/detail-map-pin.svg",
      label: "Metode setoran",
      value: pickup ? "Jemput oleh petugas (segera hadir)" : `Antar sendiri ke ${deposit.unitName}`,
    },
    {
      icon: "/nasabah/detail-clock.svg",
      label: "Estimasi berat",
      value: `${formatWeight(totalWeight)} (${breakdown})`,
    },
    {
      icon: "/nasabah/detail-phone.svg",
      label: "Catatan nasabah",
      value: deposit.customerNote ? `“${deposit.customerNote}”` : "Tidak ada catatan",
    },
  ];
  const table: [string, string][] = [    ...deposit.items.map((item): [string, string] => [
      `${item.categoryName} · ${formatWeight(item.estimatedWeight)}`,
      `Est. ${formatRupiah(item.estimatedValue)}`,
    ]),
    ["Total estimasi", formatRupiah(deposit.estimatedTotal)],
    ["Status", meta.label],
  ];

  const onAccept = async () => {
    setAccepting(true);
    setAcceptError(null);
    try {
      await acceptDeposit(deposit.id);
      router.push(`/petugas/pengajuan/${deposit.id}/periksa`);
    } catch (cause) {
      setAcceptError(userMessage(cause));
      setAccepting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col bg-canvas shadow-sm">
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-[200px] bg-linear-to-r from-teal-start to-teal-end" />
        <div className="relative px-5 pt-12">
          <Link
            href="/petugas/antrean"
            aria-label="Kembali"
            className="flex size-11 items-center justify-center rounded-[14px] bg-[#f0fcf6] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <Asset src="/nasabah/icon-chevron-left.svg" width={21} height={21} />
          </Link>
          <section
            aria-label="Informasi pengajuan"
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
                {deposit.code} · diajukan {formatDateMedium(deposit.submittedAt)},{" "}
                {formatClock(deposit.submittedAt)}
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

      <section aria-labelledby="estimasi" className="flex flex-col gap-2 px-5 pt-5">
        <div className="flex items-center justify-between">
          <h2 id="estimasi" className="text-[15px] leading-[20px] font-bold text-heading">
            Estimasi Nasabah
          </h2>
          <p className="text-[12px] text-subtle">Bukan nilai final</p>
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
          Berat aktual dan nilai final hanya diinput petugas saat menimbang.
        </p>
      </section>

      <section className="px-5 pt-5 pb-5">
        <div className="flex flex-col gap-[10px] rounded-[18px] bg-info-bg p-4 leading-[20px]">
          <h2 className="text-[14px] font-bold text-info-title">Langkah petugas</h2>
          <ol className="flex flex-col text-[12px] text-info-body">
            {steps.map((text, index) => (
              <li key={text} className="flex gap-[3px]">
                <span className="w-[15px] shrink-0 text-right">{index + 1}.</span>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="sticky bottom-0 mt-auto flex flex-col gap-2 border-t-[0.5px] border-line bg-white px-5 pt-[14px] pb-[21px]">
        {acceptError ? (
          <p role="alert" className="text-[12px] leading-[17px] font-semibold text-[#d92116]">
            {acceptError}
          </p>
        ) : null}
        <div className="flex items-center gap-[10px]">
          {waiting ? (
            <>
              <button
                type="button"
                onClick={() => setAskReject(true)}
                disabled={accepting}
                className="flex h-[50px] w-24 shrink-0 items-center justify-center rounded-[30px] border border-[#ff575d] bg-white text-[14px] font-semibold text-[#d92116] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                Tolak
              </button>
              <button
                type="button"
                disabled={pickup || !online || accepting}
                title={pickup ? "Penjemputan belum didukung" : online ? undefined : "Sedang offline"}
                onClick={onAccept}
                className="flex h-[53px] min-w-0 flex-1 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-foreground shadow-[0_7px_14px_rgba(0,200,75,0.19)] hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {accepting ? "Memproses…" : "Terima & Periksa"}
              </button>
            </>
          ) : (
            <Link
              href={
                deposit.status === "diproses"
                  ? `/petugas/pengajuan/${deposit.id}/${
                      deposit.items.some((item) => item.actualWeight === undefined)
                        ? "periksa"
                        : "hasil"
                    }`
                  : "/petugas/antrean"
              }
              className="flex h-[53px] min-w-0 flex-1 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-foreground shadow-[0_7px_14px_rgba(0,200,75,0.19)] hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {deposit.status === "diproses" ? "Lanjutkan Proses" : "Kembali ke Antrean"}
            </Link>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={askReject}
        title="Tolak pengajuan ini?"
        description="Kamu akan memilih alasan penolakan. Status pengajuan menjadi Dibatalkan dan tercatat."
        confirmLabel="Ya, Tolak"
        onConfirm={() => router.push(`/petugas/pengajuan/${deposit.id}/tolak`)}
        onCancel={() => setAskReject(false)}
      />
    </div>
  );
}
