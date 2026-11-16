"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Asset,
  ConfirmDialog,
  ErrorState,
  StepActions,
  StepHeader,
  WeightStepper,
  parseWeight,
} from "@/components/ui";
import { formatRupiah, formatWeight } from "@/features/nasabah/format";
import { categories } from "@/features/nasabah/mock-data";
import { StepNext, StepScreen } from "@/features/nasabah/step-screen";
import { usePetugasDeposits, weighDeposit } from "@/features/petugas/store";

/** 2 -> "2,0", 2.5 -> "2,5", agar sama dengan tampilan angka di desain. */
const toText = (value: number) =>
  (Number.isInteger(value) ? `${value}.0` : String(value)).replace(".", ",");

export default function TimbangSampahPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const deposit = usePetugasDeposits().find((candidate) => candidate.id === id);
  const [typed, setTyped] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [askCancel, setAskCancel] = useState(false);

  if (!deposit || deposit.status !== "diproses") {
    return (
      <StepScreen>
        <StepHeader title="Timbang Sampah" subtitle={deposit?.code} backHref="/petugas/antrean" />
        <ErrorState
          title="Pengajuan belum bisa ditimbang"
          description="Terima dan periksa pengajuan lebih dulu."
        />
        <Link href="/petugas/antrean" className="text-[14px] font-semibold text-blue-dark">
          Kembali ke antrean
        </Link>
      </StepScreen>
    );
  }

  const rows = deposit.items.map((item) => {
    const price = categories.find((c) => c.id === item.categoryId)?.pricePerKg ?? 0;
    const text = typed[item.categoryId] ?? toText(item.actualWeight ?? item.estimatedWeight);
    const weight = parseWeight(text);
    const valid = Number.isFinite(weight) && weight > 0;
    // Simulasi sisi server (prototype); di aplikasi nyata nilai datang dari respons API.
    return { item, price, text, weight, valid, value: valid ? Math.round(weight * price) : 0 };
  });
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const totalWeight = rows.reduce((sum, row) => sum + (row.valid ? row.weight : 0), 0);

  function save() {
    if (!deposit) return;
    if (rows.some((row) => !row.valid)) {
      setShowErrors(true);
      return;
    }
    weighDeposit(
      deposit.id,
      Object.fromEntries(rows.map((row) => [row.item.categoryId, row.weight])),
    );
    router.push(`/petugas/pengajuan/${deposit.id}/hasil`);
  }

  return (
    <StepScreen>
      <StepHeader
        title="Timbang Sampah"
        subtitle={`${deposit.code} · ${deposit.customerName}`}
        backHref={`/petugas/pengajuan/${id}/periksa`}
      />
      <p className="text-[12px] leading-[17px] font-medium text-black/50">
        Masukkan berat aktual hasil timbangan. Nilai dihitung server.
      </p>

      <p className="flex h-[23px] w-fit items-center gap-[10px] rounded-[15px] border-[0.5px] border-accent bg-blue-light px-[13px] text-[12px] font-medium text-blue-dark">
        <Asset src="/nasabah/icon-scales-blue.svg" width={13} height={16.0312} />
        BERAT AKTUAL (PETUGAS)
      </p>

      <ul className="flex flex-col gap-[10px]">
        {rows.map(({ item, price, text, valid, value }, index) => (
          <li
            key={item.categoryId}
            className="flex flex-col gap-3 rounded-[20px] border-[0.5px] border-black/50 p-[13px]"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-[6px] text-[14px] leading-[16.5px] font-semibold tracking-[-0.275px] text-black">
                <Asset src="/nasabah/dot-green.svg" width={10} height={10} />
                {index + 1}. {item.categoryName}
              </p>
              <p className="text-[12px] text-black/70">{formatRupiah(price)}/kg</p>
            </div>
            <WeightStepper
              label={item.categoryName}
              value={text}
              onChange={(next) => setTyped((current) => ({ ...current, [item.categoryId]: next }))}
              error={
                showErrors && !valid
                  ? "Isi berat lebih dari 0 kg, maksimal 3 angka di belakang koma."
                  : undefined
              }
            />
            <p className="self-end text-[12px] leading-[16.5px] font-medium tracking-[-0.275px] text-green-dark-active">
              Subtotal: {formatRupiah(value)}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-3 rounded-[20px] border-[0.5px] border-primary bg-green-light p-[15px]">
        <div className="flex flex-col gap-[5px] tracking-[-0.275px]">
          <p className="text-[14px] leading-[16.5px] font-medium text-black">
            Total Nilai (server):
          </p>
          <p className="text-[18px] leading-[20px] font-semibold text-green-dark-active">
            {formatRupiah(total)}
          </p>
          <p className="text-[12px] leading-[17px] font-medium text-green-dark-active">
            Total berat aktual: {formatWeight(totalWeight)}
          </p>
        </div>
        <Asset src="/nasabah/chip-dollar.svg" width={44} height={44} />
      </div>

      <div className="flex items-center gap-3 rounded-[20px] border-[0.5px] border-accent bg-blue-light p-4">
        <Asset src="/nasabah/icon-scales-note.svg" width={21} height={25.8966} />
        <p className="text-[12px] leading-[16.5px] font-semibold text-blue-dark">
          Penting: Konfirmasi hanya sekali. Pembatalan wajib disertai alasan dan tercatat.
        </p>
      </div>

      <StepActions>
        <button
          type="button"
          onClick={() => setAskCancel(true)}
          className="flex h-[50px] w-full items-center justify-center rounded-[30px] border border-[#ff575d] bg-white text-[14px] font-semibold text-[#d92116] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          Batalkan Setoran
        </button>
        <StepNext onClick={save}>Konfirmasi Transaksi</StepNext>
      </StepActions>

      <ConfirmDialog
        open={askCancel}
        title="Batalkan setoran ini?"
        description="Pembatalan wajib disertai alasan dan tercatat. Hasil timbang yang sudah diisi tidak disimpan."
        confirmLabel="Ya, Batalkan"
        onConfirm={() => router.push(`/petugas/pengajuan/${id}/tolak`)}
        onCancel={() => setAskCancel(false)}
      />
    </StepScreen>
  );
}
