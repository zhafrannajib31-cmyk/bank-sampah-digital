import type { ReactNode } from "react";
import { Asset } from "@/components/ui";
import { CategoryTile } from "@/features/nasabah/category-tile";
import { depositActualWeight } from "@/features/nasabah/deposit-ui";
import { formatDateMedium, formatRupiah, formatWeight } from "@/features/nasabah/format";
import type { Deposit } from "@/features/nasabah/types";

/** Ringkasan hasil timbang (Konfirmasi Hasil dan Konfirmasi Transaksi). Nilai berasal dari respons API, bukan dihitung di layar. */
export function HasilSummary({
  deposit,
  noticeTitle,
  noticeText,
  noticeTone = "info",
  valueLoading = false,
  valueError = null,
  onRetryValue,
}: {
  deposit: Deposit;
  noticeTitle: string;
  noticeText: ReactNode;
  noticeTone?: "info" | "error";
  valueLoading?: boolean;
  valueError?: string | null;
  onRetryValue?: () => void;
}) {
  const error = noticeTone === "error";
  const total = deposit.finalTotal ?? 0;
  const hasFinal = deposit.finalTotal !== undefined;

  return (
    <>
      <section aria-labelledby="hasil" className="flex flex-col gap-[10px]">
        <h2
          id="hasil"
          className="text-[14px] leading-[16.5px] font-medium tracking-[-0.275px] text-black"
        >
          Hasil Timbang · Antar Sendiri
        </h2>
        <ul className="flex flex-col gap-[10px]">
          {deposit.items.map((item) => (
            <li
              key={item.id}
              className="flex h-[70px] items-center gap-3 rounded-[20px] border-[0.1px] border-black bg-white px-3 shadow-[0_4px_4px_rgba(0,0,0,0.1)]"
            >
              <CategoryTile id={item.categoryId} />
              <div className="flex flex-1 flex-col gap-[6px]">
                <p className="text-[14px] leading-[16.5px] font-medium tracking-[-0.275px] text-black">
                  {item.categoryName}
                </p>
                <p className="w-fit rounded-[10px] bg-black/10 px-2 text-[12px] leading-[17px] font-medium text-black">
                  {formatWeight(item.actualWeight ?? 0)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-[12px] leading-[17px] text-black/80">
                  {formatRupiah(item.unitPriceSnapshot ?? item.pricePerKg ?? 0)}/kg
                </p>
                <p className="text-[14px] leading-[16.5px] font-medium text-green-dark-active">
                  {item.finalValue === undefined ? "Nilai menyusul" : formatRupiah(item.finalValue)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-label="Ringkasan hasil timbang"
        className="flex flex-col gap-3 rounded-[20px] border-[0.1px] border-black bg-white p-3 shadow-[0_4px_4px_rgba(0,0,0,0.1)]"
      >
        <div className="flex items-center justify-between">
          <p className="rounded-[5px] bg-blue-light px-[9px] text-[12px] leading-[17px] font-light text-black">
            HASIL TIMBANG
          </p>
          <p className="text-[12px] leading-[17px] font-medium text-black/70">
            {formatDateMedium(deposit.submittedAt)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-[14px]">
          <div className="flex flex-col gap-[6px] rounded-[5px] bg-blue-light p-[10px]">
            <p className="text-[12px] leading-[17px] font-medium text-black">Total Berat</p>
            <p className="text-[16px] leading-[16.5px] font-extrabold text-black">
              {formatWeight(depositActualWeight(deposit))}
            </p>
            <p className="text-[12px] leading-[17px] font-light text-black">Berat aktual</p>
          </div>
          <div className="flex flex-col gap-[6px] rounded-[5px] bg-blue-light p-[10px]">
            <p className="text-[12px] leading-[17px] font-medium text-black">Total Nilai</p>
            <p className="text-[16px] leading-[16.5px] font-extrabold text-green-dark-active">
              {hasFinal ? formatRupiah(total) : "—"}
            </p>
            <p className="text-[12px] leading-[17px] font-light text-black">
              {hasFinal ? "Dihitung server" : "Dihitung server saat konfirmasi"}
            </p>
          </div>
        </div>
        <p className="flex items-start gap-2 text-[12px] leading-[17px] font-light text-black">
          <span className="mt-[3px]">
            <Asset src="/nasabah/note-info-sm.svg" width={10} height={10} />
          </span>
          Angka di atas hasil timbangan petugas, bukan estimasi.
        </p>
      </section>

      {valueLoading ? (
        <p role="status" className="text-[12px] leading-[17px] text-black/70">
          Mengambil nilai dari server…
        </p>
      ) : null}
      {valueError ? (
        <div role="alert" className="flex flex-col gap-2 rounded-[14px] bg-[#fee2e2] p-3">
          <p className="text-[12px] leading-[17px] font-semibold text-[#991b1b]">
            Nilai gagal dimuat: {valueError}
          </p>
          {onRetryValue ? (
            <button
              type="button"
              onClick={onRetryValue}
              className="w-fit rounded-[10px] border border-[#991b1b] px-3 py-1 text-[12px] font-semibold text-[#991b1b] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              Coba Lagi
            </button>
          ) : null}
        </div>
      ) : null}

      <section
        role={error ? "alert" : "status"}
        className={`flex gap-4 rounded-[20px] p-[14px] ${error ? "bg-[#fee2e2]" : "bg-blue-light-active"}`}
      >
        <span className="relative flex size-[33px] shrink-0 items-center justify-center self-start">
          <Asset
            src="/nasabah/note-circle.svg"
            width={33}
            height={33}
            className="absolute inset-0"
          />
          <Asset
            src="/nasabah/note-info.svg"
            width={19.249}
            height={19.7185}
            className="relative"
          />
        </span>
        <div className="flex flex-col gap-2">
          <h2
            className={`text-[14px] leading-[16.5px] font-medium ${error ? "text-[#991b1b]" : "text-black"}`}
          >
            {noticeTitle}
          </h2>
          <p
            className={`text-[12px] leading-[17px] font-light ${error ? "text-[#991b1b]" : "text-black"}`}
          >
            {noticeText}
          </p>
        </div>
      </section>
    </>
  );
}
