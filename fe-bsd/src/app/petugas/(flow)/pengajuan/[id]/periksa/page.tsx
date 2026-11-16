"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Asset, ErrorState, StepActions, StepHeader } from "@/components/ui";
import { StepNext, StepScreen } from "@/features/nasabah/step-screen";
import { usePetugasDeposits } from "@/features/petugas/store";
import { cn } from "@/lib/cn";

function Feature({
  src,
  w,
  h,
  label,
  className,
}: {
  src: string;
  w: number;
  h: number;
  label: string;
  className: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-[6px] text-[12px] leading-[17px] font-medium",
        className,
      )}
    >
      <Asset src={src} width={w} height={h} />
      {label}
    </span>
  );
}

export default function PeriksaSampahPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const deposit = usePetugasDeposits().find((candidate) => candidate.id === id);
  const [matches, setMatches] = useState(true);

  if (!deposit || deposit.status !== "diproses") {
    return (
      <StepScreen>
        <StepHeader title="Periksa Sampah" subtitle={deposit?.code} backHref="/petugas/antrean" />
        <ErrorState
          title="Pengajuan belum diterima"
          description="Terima pengajuan lebih dulu sebelum memeriksa sampah."
        />
        <Link href="/petugas/antrean" className="text-[14px] font-semibold text-blue-dark">
          Kembali ke antrean
        </Link>
      </StepScreen>
    );
  }

  const next = matches ? `/petugas/pengajuan/${id}/timbang` : `/petugas/pengajuan/${id}/tolak`;

  return (
    <StepScreen>
      <StepHeader
        title="Periksa Sampah"
        subtitle={`${deposit.code} · ${deposit.customerName}`}
        backHref={`/petugas/pengajuan/${id}`}
      />
      <p className="text-[12px] leading-[17px] text-black/70">
        Apakah sampah sesuai dengan pengajuan? Periksa jenis dan kondisi sebelum menimbang.
      </p>

      <ul className="flex flex-col gap-[10px]">
        <li>
          <button
            type="button"
            aria-pressed={!matches}
            onClick={() => setMatches(false)}
            className={cn(
              "relative flex min-h-[90px] w-full flex-col gap-[7px] rounded-[15px] bg-white px-[14px] py-[11px] text-left focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
              matches ? "border-[0.5px] border-black/50" : "border border-primary",
            )}
          >
            <span className="flex items-center gap-[7px]">
              <span className="flex size-[25px] shrink-0 items-center justify-center rounded-[5px] bg-blue-light">
                <span className="relative block h-[17.6px] w-[14px]">
                  <Asset src="/nasabah/method-pin-b.svg" width={14.0833} height={17.6128} />
                  <Asset
                    src="/nasabah/method-pin-a.svg"
                    width={7.58333}
                    height={7.58333}
                    className="absolute top-[3.2px] left-[3.25px]"
                  />
                </span>
              </span>
              <span className="font-sans text-[12px] leading-[16.5px] font-medium text-black">
                Tidak sesuai
              </span>
              {!matches ? (
                <span className="ml-auto">
                  <Asset src="/nasabah/method-check.svg" width={18} height={18} />
                </span>
              ) : null}
            </span>
            <span className="pl-8 text-[12px] leading-[17px] text-black/70">
              Tolak atau kembalikan sampah ke nasabah dengan alasan yang dicatat.
            </span>
            <span className="flex gap-3 pl-8">
              <Feature
                src="/nasabah/method-clock.svg"
                w={16}
                h={16}
                label="Alasan wajib"
                className="text-blue-dark"
              />
              <Feature
                src="/nasabah/method-scales.svg"
                w={17}
                h={20}
                label="Status Dibatalkan"
                className="text-green-dark-active"
              />
            </span>
          </button>
        </li>
        <li>
          <button
            type="button"
            aria-pressed={matches}
            onClick={() => setMatches(true)}
            className={cn(
              "relative flex min-h-[90px] w-full flex-col gap-[7px] rounded-[15px] bg-white px-[14px] py-[11px] text-left focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
              matches ? "border border-primary" : "border-[0.5px] border-black/50",
            )}
          >
            <span className="flex items-center gap-[7px]">
              <span className="flex size-[25px] shrink-0 items-center justify-center rounded-[5px] bg-green-light">
                <Asset src="/nasabah/method-person-a.svg" width={15.1667} height={18.4959} />
              </span>
              <span className="font-sans text-[12px] leading-[16.5px] font-medium text-black">
                Sesuai
              </span>
              {matches ? (
                <span className="ml-auto">
                  <Asset src="/nasabah/method-check.svg" width={18} height={18} />
                </span>
              ) : null}
            </span>
            <span className="pl-8 text-[12px] leading-[17px] text-black/70">
              Jenis dan kondisi sampah cocok. Lanjut menimbang di unit.
            </span>
            <span className="flex flex-wrap items-center gap-x-6 gap-y-1 pl-8">
              <Feature
                src="/nasabah/method-bolt.svg"
                w={14.2605}
                h={20.647}
                label="Lanjut timbang"
                className="text-green-dark-active"
              />
              <span className="text-[12px] leading-[17px] text-black/70">Input berat aktual</span>
            </span>
          </button>
        </li>
      </ul>

      <StepActions>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[12px] leading-[17px] text-black/70">
            Hasil:{" "}
            <span className="font-semibold text-black">
              {matches ? "Sampah sesuai" : "Sampah tidak sesuai"}
            </span>
          </p>
          <Link href={next} className="text-[12px] font-semibold text-blue-dark">
            {matches ? "Lanjut Timbang" : "Lanjut Tolak"}
          </Link>
        </div>
        <StepNext onClick={() => router.push(next)} />
      </StepActions>
    </StepScreen>
  );
}
