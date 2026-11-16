"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Asset, ErrorState } from "@/components/ui";
import { depositActualWeight } from "@/features/nasabah/deposit-ui";
import { formatRupiah, formatWeight } from "@/features/nasabah/format";
import { StepScreen } from "@/features/nasabah/step-screen";
import { usePetugasDeposits } from "@/features/petugas/store";

const QR_SECONDS = 272;
const clock = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

/** Scan QR nasabah. Pemindaian kamera belum dipasang: tombol "Pindai QR" mensimulasikan QR valid. */
export default function ScanQrPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const deposit = usePetugasDeposits().find((candidate) => candidate.id === id);
  const [left, setLeft] = useState(QR_SECONDS);
  const [scanning, setScanning] = useState(false);
  const weighed =
    deposit?.status === "diproses" &&
    deposit.items.every((item) => item.actualWeight !== undefined);

  useEffect(() => {
    if (left <= 0) return;
    const timer = setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [left]);

  if (!deposit || !weighed) {
    return (
      <StepScreen>
        <ErrorState
          title="Belum ada hasil timbang"
          description="Timbang sampah lebih dulu sebelum memindai QR."
        />
        <Link href="/petugas/antrean" className="text-[14px] font-semibold text-blue-dark">
          Kembali ke antrean
        </Link>
      </StepScreen>
    );
  }

  const total = deposit.items.reduce((sum, item) => sum + (item.finalValue ?? 0), 0);

  function scan() {
    setScanning(true);
    setTimeout(() => router.push(`/petugas/pengajuan/${id}/konfirmasi`), 700);
  }

  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col bg-white shadow-sm">
      <header className="flex h-[107px] items-end gap-3 border-b-[0.5px] border-line px-5 pb-[15px]">
        <Link
          href={`/petugas/pengajuan/${id}/hasil`}
          aria-label="Kembali"
          className="block size-11 shrink-0 rounded-[15px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <Asset src="/nasabah/hasil-back.svg" width={44} height={44} />
        </Link>
        <div className="flex flex-col leading-[1.4]">
          <h1 className="font-sans text-[18px] font-medium text-heading">Scan QR Nasabah</h1>
          <p className="text-[12px] font-bold text-green-dark-active">
            {deposit.code} · Menunggu scan
          </p>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-[14px] bg-canvas px-5 pt-4 pb-4">
        <section
          aria-label="Hasil timbang petugas"
          className="flex flex-col gap-[11px] rounded-[22px] border border-line bg-white px-4 py-[14px]"
        >
          <h2 className="text-[14.5px] leading-[1.4] font-extrabold text-heading">
            Hasil Timbang Petugas
          </h2>
          <ul>
            {deposit.items.map((item) => (
              <li
                key={item.id}
                className="flex h-[54px] items-center justify-between border-b-[0.7px] border-[#edf0ee]"
              >
                <span className="flex flex-col">
                  <span className="text-[14px] font-bold text-heading">{item.categoryName}</span>
                  <span className="text-[12px] text-subtle">
                    {formatWeight(item.actualWeight ?? 0)} ×{" "}
                    {formatRupiah(item.unitPriceSnapshot ?? 0)}/kg
                  </span>
                </span>
                <span className="text-[15px] font-bold text-heading">
                  {formatRupiah(item.finalValue ?? 0)}
                </span>
              </li>
            ))}
            <li className="flex h-[46px] items-center justify-between">
              <span className="text-[14px] font-bold text-heading">
                Total sementara · {formatWeight(depositActualWeight(deposit))}
              </span>
              <span className="text-[23px] font-extrabold text-[#008535]">
                {formatRupiah(total)}
              </span>
            </li>
          </ul>
        </section>

        <section
          aria-label="Pindai QR"
          className="flex flex-col items-center gap-1 rounded-[22px] border border-line bg-white px-4 pt-[21px] pb-[17px] text-center"
        >
          <h2 className="text-[15px] leading-[1.4] font-extrabold text-heading">
            Arahkan kamera ke QR nasabah
          </h2>
          <p className="text-[13px] leading-[1.4] text-subtle">
            Pastikan QR berada di dalam bingkai. QR dipakai untuk memvalidasi transaksi.
          </p>
          <div className="pt-[15px] pb-3">
            <div className="relative h-[198px] w-[195px] rounded-[18px] border-[1.5px] border-[#00c943] bg-white">
              <Asset
                src="/nasabah/hasil-qr.svg"
                width={168}
                height={168}
                className="absolute top-[11.5px] left-[11.5px]"
              />
            </div>
          </div>
          <p className="flex items-center gap-[6px] text-[12px] text-subtle">
            <Asset src="/nasabah/hasil-clock.svg" width={13} height={13} />
            {left > 0 ? (
              <>
                Berlaku <span className="font-extrabold text-heading">{clock(left)}</span> lagi ·{" "}
                {deposit.code}
              </>
            ) : (
              <>Kedaluwarsa · minta nasabah memuat ulang QR</>
            )}
          </p>
          <p className="text-[12px] text-subtle">Pemindaian kamera disimulasikan (data contoh)</p>
        </section>

        <div className="flex items-start gap-[10px] rounded-[15px] bg-info-bg px-[15px] py-3">
          <Asset
            src="/nasabah/hasil-info.svg"
            width={15}
            height={15}
            className="mt-[3px] shrink-0"
          />
          <p className="text-[12px] leading-[1.4] text-[#226399]">
            QR tidak terbaca? Minta nasabah menaikkan kecerahan layar lalu pindai ulang.
          </p>
        </div>
      </div>

      <div className="sticky bottom-0 flex h-[90px] items-center border-t-[0.5px] border-line bg-white px-5 pt-[14px] pb-[23px]">
        <button
          type="button"
          disabled={scanning || left <= 0}
          onClick={scan}
          className="flex h-[53px] flex-1 items-center justify-center rounded-[28px] bg-primary font-sans text-[14px] font-semibold text-foreground shadow-[0_8px_14px_rgba(0,217,86,0.19)] hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {scanning ? "Memindai…" : "Pindai QR"}
        </button>
      </div>
    </div>
  );
}
