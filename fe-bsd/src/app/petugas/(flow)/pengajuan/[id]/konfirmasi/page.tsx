"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog, ErrorState, StepActions, StepHeader } from "@/components/ui";
import { StepNext, StepScreen } from "@/features/nasabah/step-screen";
import { HasilSummary } from "@/features/petugas/hasil-summary";
import { confirmDeposit, useDepositValue, usePetugasDeposits } from "@/features/petugas/store";
import { newIdempotencyKey, userMessage } from "@/lib/api";
import { useOnline } from "@/lib/use-online";

export default function KonfirmasiTransaksiPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const deposit = usePetugasDeposits().find((candidate) => candidate.id === id);
  // Satu kunci per kunjungan layar ini; dipakai ulang saat retry agar transaksi tidak ganda.
  const [idempotencyKey] = useState(newIdempotencyKey);
  const [processing, setProcessing] = useState(false);
  const [askCancel, setAskCancel] = useState(false);
  const [failed, setFailed] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const online = useOnline();
  const weighed =
    deposit?.status === "diproses" &&
    deposit.items.every((item) => item.actualWeight !== undefined);
  const value = useDepositValue(id, weighed);

  // Setelah konfirmasi status berubah ke Selesai; jangan tampilkan galat saat berpindah ke layar berhasil.
  if (!deposit || (!weighed && !processing)) {
    return (
      <StepScreen>
        <StepHeader
          title="Konfirmasi Transaksi"
          subtitle={deposit?.code}
          backHref="/petugas/antrean"
        />
        <ErrorState
          title="Transaksi tidak bisa dikonfirmasi"
          description="Hanya pengajuan yang sudah ditimbang dan berstatus Diproses yang dapat dikonfirmasi."
        />
        <Link href="/petugas/antrean" className="text-[14px] font-semibold text-blue-dark">
          Kembali ke antrean
        </Link>
      </StepScreen>
    );
  }

  async function confirm() {
    if (!deposit || processing) return;
    setProcessing(true);
    setFailed(false);
    setConfirmError(null);
    try {
      await confirmDeposit(deposit.id, idempotencyKey);
      router.replace(`/petugas/pengajuan/${deposit.id}/berhasil`);
    } catch (cause) {
      setProcessing(false);
      setFailed(true);
      setConfirmError(userMessage(cause));
    }
  }

  const notice = failed
    ? {
        noticeTone: "error" as const,
        noticeTitle: "Konfirmasi Gagal",
        noticeText: "Transaksi belum tersimpan. Aman untuk coba lagi dengan kunci yang sama.",
      }
    : processing
      ? {
          noticeTitle: "Memproses Transaksi…",
          noticeText: "Mohon tunggu. Jangan tutup halaman ini; konfirmasi hanya diproses sekali.",
        }
      : {
          noticeTitle: "QR Tervalidasi",
          noticeText: "Periksa data sekali lagi. Konfirmasi hanya sekali dan tidak dapat diulang.",
        };

  return (
    <StepScreen>
      <StepHeader
        title="Konfirmasi Transaksi"
        subtitle={`${deposit.code} · ${failed ? "Gagal" : processing ? "Memproses" : "QR tervalidasi"}`}
        backHref={`/petugas/pengajuan/${id}/scan`}
      />
      <HasilSummary
        deposit={deposit}
        {...notice}
        valueLoading={deposit.finalTotal === undefined}
        valueError={value.error}
        onRetryValue={value.retry}
      />
      <StepActions>
        <button
          type="button"
          disabled={processing}
          onClick={() => setAskCancel(true)}
          className="flex h-[50px] w-full items-center justify-center rounded-[30px] border border-[#ff575d] bg-white text-[14px] font-semibold text-[#d92116] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-60"
        >
          Batal
        </button>
        {confirmError || !online ? (
          <p role="alert" className="text-[12px] leading-[17px] font-semibold text-[#d92116]">
            {online ? confirmError : "Sedang offline. Periksa koneksi lalu coba lagi."}
          </p>
        ) : null}
        <StepNext
          arrow={false}
          disabled={processing || !online || deposit.finalTotal === undefined}
          onClick={confirm}
        >
          {processing
            ? "Memproses…"
            : !online
              ? "Sedang offline"
              : deposit.finalTotal === undefined
                ? "Nilai belum tersedia"
                : failed
                    ? "Coba Lagi"
                    : "Konfirmasi Transaksi"}
        </StepNext>
      </StepActions>

      <ConfirmDialog
        open={askCancel}
        title="Batalkan transaksi ini?"
        description="Kamu akan memilih alasan pembatalan. Status setoran menjadi Dibatalkan dan tercatat."
        confirmLabel="Ya, Batalkan"
        onConfirm={() => router.push(`/petugas/pengajuan/${id}/tolak`)}
        onCancel={() => setAskCancel(false)}
      />
    </StepScreen>
  );
}
