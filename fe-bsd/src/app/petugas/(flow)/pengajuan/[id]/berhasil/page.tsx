"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Asset, ErrorState } from "@/components/ui";
import { formatClock, formatDateMedium, formatRupiah } from "@/features/nasabah/format";
import { usePetugasDeposits } from "@/features/petugas/store";

export default function TransaksiBerhasilPage() {
  const { id } = useParams<{ id: string }>();
  const deposit = usePetugasDeposits().find((candidate) => candidate.id === id);

  if (!deposit || deposit.status !== "selesai") {
    return (
      <div className="mx-auto w-full max-w-[430px] flex-1 bg-surface p-5">
        <ErrorState
          title="Transaksi belum selesai"
          description="Konfirmasi transaksi lebih dulu."
        />
        <Link
          href="/petugas/antrean"
          className="mt-4 inline-block text-[14px] font-semibold text-blue-dark"
        >
          Kembali ke antrean
        </Link>
      </div>
    );
  }

  const at = deposit.completedAt ?? deposit.submittedAt;

  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col bg-linear-to-b from-[#b9f8d4] from-0% via-[#edf9f1] via-[38%] to-canvas to-[58%] shadow-sm">
      <div className="flex flex-col items-center px-5 pt-14 text-center">
        <p className="text-[12px] leading-[15px] font-bold text-[#005f29]">TRANSAKSI BERHASIL</p>
        <div className="relative mt-[13px] size-[76px]">
          <Asset
            src="/nasabah/selesai-badge.svg"
            width={124}
            height={124}
            className="absolute -top-3 -left-6 max-w-none"
          />
          <Asset
            src="/nasabah/selesai-check.svg"
            width={29}
            height={23.1706}
            className="absolute top-[29px] left-[23px] max-w-none"
          />
        </div>
        <h1 className="mt-[25px] font-sans text-[24px] leading-[29px] font-semibold text-heading">
          Transaksi Berhasil!
        </h1>
        <p className="mt-1 max-w-[350px] text-[12px] leading-[21px] text-[#506158]">
          Transaksi tersimpan · {formatDateMedium(at)}, {formatClock(at)} Saldo nasabah bertambah.
        </p>
        <p className="mt-[18px] text-[38px] leading-[45px] font-bold text-heading">
          +{formatRupiah(deposit.finalTotal ?? 0)}
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-[10px] px-5 pt-16 pb-[23px]">
        <Link
          href={`/petugas/pengajuan/${deposit.id}`}
          className="flex h-[52px] items-center justify-center rounded-[28px] bg-primary font-sans text-[16px] font-semibold text-foreground shadow-[0_7px_18px_rgba(0,182,71,0.19)] hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Lihat Detail
        </Link>
        <Link
          href="/petugas/antrean"
          className="flex h-[49px] items-center justify-center rounded-[28px] border border-primary bg-white font-sans text-[16px] font-semibold text-green-dark-active focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          Kembali ke Antrean
        </Link>
      </div>
    </div>
  );
}
