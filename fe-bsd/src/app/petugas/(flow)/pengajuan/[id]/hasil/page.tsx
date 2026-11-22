"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ErrorState, StepActions, StepHeader } from "@/components/ui";
import { StepNext, StepScreen } from "@/features/nasabah/step-screen";
import { HasilSummary } from "@/features/petugas/hasil-summary";
import { useDepositValue, usePetugasDeposits } from "@/features/petugas/store";

export default function KonfirmasiHasilPage() {
  const { id } = useParams<{ id: string }>();
  const deposit = usePetugasDeposits().find((candidate) => candidate.id === id);
  const weighed =
    deposit?.status === "diproses" &&
    deposit.items.every((item) => item.actualWeight !== undefined);
  const value = useDepositValue(id, weighed);

  if (!deposit || !weighed) {
    return (
      <StepScreen>
        <StepHeader title="Konfirmasi Hasil" subtitle={deposit?.code} backHref="/petugas/antrean" />
        <ErrorState
          title="Belum ada hasil timbang"
          description="Timbang sampah lebih dulu sebelum konfirmasi."
        />
        <Link href="/petugas/antrean" className="text-[14px] font-semibold text-blue-dark">
          Kembali ke antrean
        </Link>
      </StepScreen>
    );
  }

  return (
    <StepScreen>
      <StepHeader
        title="Konfirmasi Hasil"
        subtitle={`${deposit.code} · ${deposit.customerName}`}
        backHref={`/petugas/pengajuan/${id}/timbang`}
      />
      <HasilSummary
        deposit={deposit}
        noticeTitle="Langkah Berikutnya"
        noticeText="Minta nasabah menampilkan QR transaksi, lalu pindai untuk memvalidasi."
        valueLoading={deposit.finalTotal === undefined}
        valueError={value.error}
        onRetryValue={value.retry}
      />
      <StepActions>
        <Link
          href={`/petugas/pengajuan/${id}/timbang`}
          className="flex h-[49px] w-full items-center justify-center rounded-[28px] border border-primary bg-white font-sans text-[16px] font-semibold text-green-dark-active focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          Ubah Data
        </Link>
        <StepNext href={`/petugas/pengajuan/${id}/scan`} arrow={false}>
          Lanjut Scan QR
        </StepNext>
      </StepActions>
    </StepScreen>
  );
}
