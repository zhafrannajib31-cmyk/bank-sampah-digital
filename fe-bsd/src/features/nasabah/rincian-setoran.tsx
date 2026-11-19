"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Asset, Button } from "@/components/ui";
import { userMessage } from "@/lib/api";
import { cn } from "@/lib/cn";
import { depositTitle, statusMeta } from "./deposit-ui";
import { formatClock, formatDateMedium, formatRupiah, formatWeight } from "./format";
import { usePrototype } from "./prototype-store";
import type { BankUnit, Deposit } from "./types";

const nextSteps: Record<string, { title: string; steps: string[] }> = {
  dibatalkan: {
    title: "Apa selanjutnya?",
    steps: [
      "Pilah ulang sampah sesuai jenisnya.",
      "Ajukan setoran baru kapan saja.",
      "Hubungi petugas unit bila ada pertanyaan.",
    ],
  },
  menunggu: {
    title: "Apa selanjutnya?",
    steps: [
      "Antar sampah ke unit pada jam operasional.",
      "Tunjukkan kode setoran kepada petugas.",
      "Petugas menimbang, nilai final muncul setelah dikonfirmasi.",
    ],
  },
  diproses: {
    title: "Apa selanjutnya?",
    steps: [
      "Petugas sedang memeriksa dan menimbang sampahmu.",
      "Hasil timbang akan tampil di sini.",
      "Nilai final tercatat setelah petugas mengonfirmasi.",
    ],
  },
};

/** Panel pembatalan di dalam halaman: alasan wajib, error tampil di sini, form tetap terbuka saat gagal. */
function CancelDepositPanel({ depositId }: { depositId: string }) {
  const { cancelDeposit } = usePrototype();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const restoreFocus = useRef(false);
  const fieldId = useId();
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const titleId = `${fieldId}-title`;

  useEffect(() => {
    if (open) {
      fieldRef.current?.focus();
    } else if (restoreFocus.current) {
      restoreFocus.current = false;
      triggerRef.current?.focus();
    }
  }, [open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = reason.trim();

    if (trimmed.length < 5) {
      setError("Alasan minimal 5 karakter.");
      fieldRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      // Sukses mengganti status di store, jadi panel ini otomatis hilang.
      await cancelDeposit(depositId, trimmed);
    } catch (cause) {
      setError(userMessage(cause));
      setIsSubmitting(false);
    }
  }

  if (!open) {
    return (
      <div className="px-5 pb-5">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="min-h-11 w-full rounded-full text-[13px] leading-[18px] font-semibold text-danger-dark transition-colors hover:bg-danger-soft focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Batalkan Pengajuan
        </button>
      </div>
    );
  }

  return (
    <section className="px-5 pb-5">
      <form
        onSubmit={submit}
        aria-labelledby={titleId}
        className="flex flex-col gap-3 rounded-[18px] border border-danger/30 bg-white p-4"
      >
        <div className="flex flex-col gap-1">
          <h2 id={titleId} className="text-[14px] leading-[20px] font-bold text-heading">
            Batalkan pengajuan ini?
          </h2>
          <p className="text-[12px] leading-[18px] text-subtle">
            Pengajuan yang dibatalkan tidak bisa dikembalikan. Kamu tetap bisa mengajukan setoran
            baru kapan saja.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={fieldId} className="text-[13px] leading-[18px] font-semibold text-heading">
            Alasan pembatalan{" "}
            <span aria-hidden className="text-danger">
              *
            </span>
          </label>
          <textarea
            ref={fieldRef}
            id={fieldId}
            name="reason"
            rows={3}
            required
            value={reason}
            disabled={isSubmitting}
            onChange={(event) => {
              setReason(event.target.value);
              setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${hintId} ${errorId}` : hintId}
            placeholder="Contoh: rencana berubah, sampah sudah diambil pihak lain."
            className={cn(
              "block min-h-[84px] w-full resize-none rounded-[12px] border bg-surface px-3 py-2.5 text-[13px] leading-[19px] text-heading placeholder:text-subtle/70 focus:ring-2 focus:outline-none",
              "disabled:cursor-not-allowed disabled:bg-canvas disabled:text-subtle",
              error
                ? "border-danger focus:border-danger focus:ring-danger/25"
                : "border-line focus:border-accent focus:ring-accent/25",
            )}
          />
          <p id={hintId} className="text-[12px] leading-[17px] text-subtle">
            Minimal 5 karakter.
          </p>
          {error ? (
            <p
              id={errorId}
              role="alert"
              className="text-[12px] leading-[17px] font-semibold text-danger"
            >
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-[10px]">
          <Button
            type="submit"
            variant="danger"
            isLoading={isSubmitting}
            loadingText="Membatalkan…"
            className="w-full"
          >
            Ya, batalkan pengajuan
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => {
              restoreFocus.current = true;
              setOpen(false);
            }}
            className="w-full border-line"
          >
            Kembali
          </Button>
        </div>
      </form>
    </section>
  );
}

/** Rincian setoran yang belum selesai (Menunggu, Diproses) atau Dibatalkan, gaya "Detail Dibatalkan" di Figma. */
export function RincianSetoran({ deposit, unit }: { deposit: Deposit; unit?: BankUnit }) {
  const meta = statusMeta[deposit.status];
  const cancelled = deposit.status === "dibatalkan";
  const help = nextSteps[deposit.status] ?? nextSteps.menunggu;
  const estimatedWeight = deposit.items.reduce((sum, item) => sum + item.estimatedWeight, 0);
  const infoRows = [
    { icon: "/nasabah/detail-map-pin.svg", label: "Unit tujuan", value: deposit.unitName },
    {
      icon: "/nasabah/detail-clock.svg",
      label: "Estimasi berat",
      value: `${formatWeight(estimatedWeight)} (${depositTitle(deposit)})`,
    },
    {
      icon: "/nasabah/detail-phone.svg",
      label: "Metode",
      value: "Antar Sendiri",
    },
  ];
  const table: [string, string][] = cancelled
    ? [
        ["Alasan", deposit.cancellationReason ?? "-"],
        [
          "Waktu",
          deposit.cancelledAt
            ? `${formatDateMedium(deposit.cancelledAt)}, ${formatClock(deposit.cancelledAt)}`
            : "-",
        ],
        ["Status", "Dibatalkan"],
        ["Nilai setoran", "Tidak ada"],
      ]
    : [
        ["Status", meta.label],
        ["Perkiraan nilai", formatRupiah(deposit.estimatedTotal)],
        ["Nilai final", "Menunggu penimbangan petugas"],
      ];

  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col bg-canvas shadow-sm">
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-[200px] bg-linear-to-r from-teal-start to-teal-end" />
        <div className="relative px-5 pt-12">
          <Link
            href="/nasabah/riwayat"
            aria-label="Kembali"
            className="flex size-11 items-center justify-center rounded-[14px] bg-[#f0fcf6] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <Asset src="/nasabah/icon-chevron-left.svg" width={21} height={21} />
          </Link>
          <section
            aria-label="Rincian setoran"
            className="mt-11 flex flex-col gap-[14px] rounded-[22px] bg-white p-[18px] shadow-[0_12px_25px_rgba(24,60,36,0.06)]"
          >
            <div className="flex flex-col gap-[2px]">
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-[19px] leading-[26px] font-bold text-heading">
                  Rincian Setoran
                </h1>
                <span
                  className={cn(
                    "flex h-[26px] items-center rounded-full px-3 text-[12px] font-semibold",
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

      <section aria-labelledby="alasan" className="flex flex-col gap-2 px-5 pt-5">
        <div className="flex items-center justify-between">
          <h2 id="alasan" className="text-[15px] leading-[20px] font-bold text-heading">
            {cancelled ? "Alasan Pembatalan" : "Ringkasan"}
          </h2>
          {cancelled ? <p className="text-[12px] text-subtle">Tercatat</p> : null}
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
            ? "Pembatalan tercatat dan tidak mengubah saldo setoran Anda."
            : "Nilai di atas masih estimasi. Nilai final dihitung dari berat aktual dan dicatat setelah petugas mengonfirmasi."}
        </p>
      </section>

      <section className="px-5 pt-5 pb-5">
        <div className="flex flex-col gap-[10px] rounded-[18px] bg-info-bg p-4 leading-[20px]">
          <h2 className="text-[14px] font-bold text-info-title">{help.title}</h2>
          <ol className="flex flex-col text-[12px] text-info-body">
            {help.steps.map((text, index) => (
              <li key={text} className="flex gap-[3px]">
                <span className="w-[15px] shrink-0 text-right">{index + 1}.</span>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {deposit.status === "menunggu" ? <CancelDepositPanel depositId={deposit.id} /> : null}

      <div className="sticky bottom-0 mt-auto flex items-center gap-[10px] border-t-[0.5px] border-line bg-white px-5 pt-[14px] pb-[21px]">
        {!cancelled && unit ? (
          <a
            href={`tel:${unit.phone.replace(/[^\d+]/g, "")}`}
            aria-label={`Hubungi ${unit.name}`}
            className="flex h-[53px] w-[52px] shrink-0 items-center justify-center rounded-full border border-primary"
          >
            <Asset src="/nasabah/action-phone.svg" width={19} height={19} />
          </a>
        ) : null}
        <Link
          href={cancelled ? "/nasabah/setor" : "/nasabah/riwayat"}
          className="flex h-[53px] min-w-0 flex-1 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-foreground shadow-[0_7px_14px_rgba(0,200,75,0.19)] hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {cancelled ? "Ajukan Setoran Baru" : "Kembali ke Riwayat"}
        </Link>
      </div>
    </div>
  );
}
