"use client";

import Link from "next/link";
import { useState } from "react";
import { Asset } from "@/components/ui";
import { cn } from "@/lib/cn";
import { depositActualWeight } from "./deposit-ui";
import { formatClock, formatDateMedium, formatRupiah, formatWeight } from "./format";
import type { Deposit } from "./types";

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill={filled ? "#f0a500" : "none"}
      stroke={filled ? "#f0a500" : "#b8c4bd"}
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17l-5.4 2.8 1.1-6.1L3.2 9.4l6.1-.8L12 3Z" />
    </svg>
  );
}

/** Layar sukses setelah petugas mengonfirmasi. Nilai dan saldo berasal dari catatan transaksi, bukan dihitung di layar. */
export function SetoranSelesai({ deposit, deposits }: { deposit: Deposit; deposits: Deposit[] }) {
  const [rating, setRating] = useState(0);
  const done = deposits
    .filter((d) => d.status === "selesai" && d.submittedAt <= deposit.submittedAt)
    .sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
  const now = done.reduce((sum, d) => sum + (d.finalTotal ?? 0), 0);
  const value = deposit.finalTotal ?? 0;
  const before = now - value;

  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col bg-linear-to-b from-[#b9f8d4] from-0% via-[#edf9f1] via-[38%] to-canvas to-[58%] shadow-sm">
      <div className="flex flex-col items-center px-5 pt-14 text-center">
        <p className="text-[12px] leading-[15px] font-bold text-[#005f29]">
          TAHAP 9 · TRANSAKSI SELESAI
        </p>
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
          Setoran Berhasil!
        </h1>
        <p className="mt-1 max-w-[350px] text-[12px] leading-[21px] text-[#506158]">
          Terima kasih sudah memilah sampah. Nilai setoran sudah tercatat.
        </p>
        <p className="mt-[18px] text-[38px] leading-[45px] font-bold text-heading">
          +{formatRupiah(value)}
        </p>
      </div>

      <div className="flex flex-col gap-[13px] px-5 pt-5">
        <section
          aria-label="Saldo setoran"
          className="rounded-[22px] bg-white px-[18px] py-3 shadow-[0_14px_30px_rgba(24,58,36,0.06)]"
        >
          <div className="flex h-7 items-center justify-between text-[14px]">
            <span className="text-[#718079]">Saldo setoran sebelumnya</span>
            <span className="font-bold text-heading">{formatRupiah(before)}</span>
          </div>
          <hr className="my-[5px] border-t-[0.6px] border-[#dcece3]" />
          <div className="flex h-7 items-center justify-between text-[14px]">
            <span className="text-[#718079]">Setoran ini</span>
            <span className="font-bold text-[#008634]">+{formatRupiah(value)}</span>
          </div>
          <hr className="my-[5px] border-t-[0.6px] border-[#dcece3]" />
          <div className="flex h-7 items-center justify-between font-bold">
            <span className="text-[14px] text-heading">Saldo setoran sekarang</span>
            <span className="text-[22px] text-[#005f29]">{formatRupiah(now)}</span>
          </div>
          <p className="mt-2 text-[12px] leading-[17px] text-[#718079]">
            Saldo adalah catatan nilai setoran dan belum dapat dicairkan ke rekening atau e-wallet.
          </p>
        </section>

        <section
          aria-label="Sampah terpilah"
          className="flex h-[69px] items-center gap-3 rounded-[18px] border border-[#e5ede8] bg-white px-4"
        >
          <Asset src="/nasabah/selesai-wallet.svg" width={40} height={40} />
          <div className="flex flex-col gap-[3px]">
            <p className="text-[14px] leading-[18px] font-bold text-heading">
              {formatWeight(depositActualWeight(deposit))} sampah terpilah
            </p>
            <p className="text-[12px] leading-[17px] text-[#718079]">
              {deposit.items
                .map((item) => `${item.categoryName} ${formatWeight(item.actualWeight ?? 0)}`)
                .join(" · ")}
            </p>
          </div>
        </section>

        <section
          aria-label="Rincian transaksi"
          id="bukti"
          className="rounded-[18px] border border-[#e5ede8] bg-white px-4 py-3"
        >
          <h2 className="text-[14px] font-bold text-heading">Rincian Transaksi</h2>
          <p className="text-[12px] text-[#718079]">
            {deposit.code} · {deposit.unitName}
          </p>
          <ul className="mt-2">
            {deposit.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between border-t border-[#edf0ee] py-2 text-[12px]"
              >
                <span>
                  <span className="block text-[13px] font-semibold text-heading">
                    {item.categoryName}
                  </span>
                  <span className="text-[#718079]">
                    {formatWeight(item.actualWeight ?? 0)} ×{" "}
                    {formatRupiah(item.unitPriceSnapshot ?? 0)}/kg
                  </span>
                </span>
                <span className="text-[13px] font-bold text-heading">
                  {formatRupiah(item.finalValue ?? 0)}
                </span>
              </li>
            ))}
          </ul>
          <p className="flex items-center justify-between border-t border-[#edf0ee] pt-2 text-[13px] font-bold text-heading">
            <span>Total nilai</span>
            <span>{formatRupiah(deposit.finalTotal ?? 0)}</span>
          </p>
          <p className="mt-1 text-[12px] leading-[17px] text-[#718079]">
            Dikonfirmasi {formatDateMedium(deposit.completedAt ?? deposit.submittedAt)},{" "}
            {formatClock(deposit.completedAt ?? deposit.submittedAt)} · nilai = berat aktual × harga
            saat konfirmasi.
          </p>
        </section>

        <section
          aria-label="Penilaian layanan"
          className="flex flex-col items-center gap-[9px] rounded-[18px] border border-[#e5ede8] bg-white py-[14px]"
        >
          <h2 className="text-[14px] leading-[18px] font-bold text-heading">
            Bagaimana layanan petugas?
          </h2>
          <div role="group" aria-label="Beri nilai" className="flex">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} bintang`}
                aria-pressed={rating === n}
                onClick={() => setRating(n)}
                className="flex size-11 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                <Star filled={n <= rating} />
              </button>
            ))}
          </div>
          <p className="text-[12px] leading-[17px] text-[#718079]">
            {deposit.officerName ?? "Petugas unit"} · {deposit.unitName}
          </p>
        </section>
      </div>

      <div className="mt-auto flex flex-col gap-[10px] px-5 pt-8 pb-[23px]">
        <a
          href="#bukti"
          className="flex h-[52px] items-center justify-center rounded-[28px] bg-primary font-sans text-[16px] font-semibold text-foreground shadow-[0_7px_18px_rgba(0,182,71,0.19)] hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Lihat Bukti Transaksi
        </a>
        <Link
          href="/nasabah"
          className={cn(
            "flex h-[49px] items-center justify-center rounded-[28px] border border-primary bg-white font-sans text-[16px] font-semibold text-green-dark-active focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
          )}
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
