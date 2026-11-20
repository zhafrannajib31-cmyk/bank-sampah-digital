"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { StepNext, StepScreen } from "@/features/nasabah/step-screen";
import { petugasApi } from "@/features/petugas/api";
import { usePetugasDeposits, weighDeposit } from "@/features/petugas/store";
import { userMessage } from "@/lib/api";
import { useOnline } from "@/lib/use-online";

/** 2 -> "2,0", 2.5 -> "2,5", agar sama dengan tampilan angka di desain. */
const toText = (value: number) =>
  (Number.isInteger(value) ? `${value}.0` : String(value)).replace(".", ",");

export default function TimbangSampahPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const deposit = usePetugasDeposits().find((candidate) => candidate.id === id);
  const [typed, setTyped] = useState<Record<string, string>>({});
  const [corrected, setCorrected] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [askCancel, setAskCancel] = useState(false);
  const online = useOnline();

  useEffect(() => {
    let active = true;
    petugasApi
      .categories()
      .then((rows) => {
        if (active) setCategories(rows.filter((row) => row.status === "active"));
      })
      .catch((cause) => {
        if (active) setCategoriesError(userMessage(cause));
      });
    return () => {
      active = false;
    };
  }, []);

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
    const price = item.pricePerKg ?? 0;
    const text = typed[item.id] ?? toText(item.actualWeight ?? item.estimatedWeight);
    const weight = parseWeight(text);
    const valid = Number.isFinite(weight) && weight > 0;
    return { item, price, text, weight, valid };
  });
  const totalWeight = rows.reduce((sum, row) => sum + (row.valid ? row.weight : 0), 0);

  async function save() {
    if (!deposit || saving) return;
    if (rows.some((row) => !row.valid)) {
      setShowErrors(true);
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      await weighDeposit(
        deposit.id,
        rows.map((row) => ({
          itemId: row.item.id,
          actualWeight: row.weight.toFixed(3),
          ...(corrected[row.item.id] && corrected[row.item.id] !== row.item.categoryId
            ? { categoryId: corrected[row.item.id] }
            : {}),
        })),
      );
      router.push(`/petugas/pengajuan/${deposit.id}/hasil`);
    } catch (cause) {
      setSaveError(userMessage(cause));
      setSaving(false);
    }
  }

  return (
    <StepScreen>
      <StepHeader
        title="Timbang Sampah"
        subtitle={`${deposit.code} · ${deposit.customerName}`}
        backHref={`/petugas/pengajuan/${id}/periksa`}
      />
      <p className="text-[12px] leading-[17px] font-medium text-black/60">
        Masukkan berat aktual hasil timbangan. Nilai dihitung server.
      </p>

      <p className="flex h-[23px] w-fit items-center gap-[10px] rounded-[15px] border-[0.5px] border-accent bg-blue-light px-[13px] text-[12px] font-medium text-blue-dark">
        <Asset src="/nasabah/icon-scales-blue.svg" width={13} height={16.0312} />
        BERAT AKTUAL (PETUGAS)
      </p>

      <ul className="flex flex-col gap-[10px]">
        {rows.map(({ item, price, text, valid }, index) => (
          <li
            key={item.id}
            className="flex flex-col gap-3 rounded-[20px] border-[0.5px] border-black/50 p-[13px]"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-[6px] text-[14px] leading-[16.5px] font-semibold tracking-[-0.275px] text-black">
                <Asset src="/nasabah/dot-green.svg" width={10} height={10} />
                {index + 1}. {item.categoryName}
              </p>
              <p className="text-[12px] text-black/70">{formatRupiah(price)}/kg</p>
            </div>
            <label className="flex flex-col gap-1 text-[12px] font-medium text-black/70">
              Koreksi jenis sampah
              <select
                value={corrected[item.id] ?? item.categoryId}
                onChange={(event) =>
                  setCorrected((current) => ({ ...current, [item.id]: event.target.value }))
                }
                disabled={saving}
                className="h-[42px] rounded-[12px] border-[0.5px] border-black/50 bg-white px-3 text-[13px] text-heading focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-60"
              >
                {categories.length === 0 ? (
                  <option value={item.categoryId}>{item.categoryName}</option>
                ) : null}
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            {categoriesError ? (
              <p role="alert" className="text-[12px] text-[#d92116]">
                Daftar jenis gagal dimuat: {categoriesError}
              </p>
            ) : null}
            <WeightStepper
              label={`Berat ${item.categoryName}`}
              value={text}
              onChange={(next) => setTyped((current) => ({ ...current, [item.id]: next }))}
              error={
                showErrors && !valid
                  ? "Isi berat lebih dari 0 kg, maksimal 3 angka di belakang koma."
                  : undefined
              }
            />
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-3 rounded-[20px] border-[0.5px] border-primary bg-green-light p-[15px]">
        <div className="flex flex-col gap-[5px] tracking-[-0.275px]">
          <p className="text-[14px] leading-[16.5px] font-medium text-black">Total berat aktual</p>
          <p className="text-[18px] leading-[20px] font-semibold text-green-dark-active">
            {formatWeight(totalWeight)}
          </p>
          <p className="text-[12px] leading-[17px] font-medium text-green-dark-active">
            Nilai final dihitung server saat konfirmasi.
          </p>
        </div>
        <Asset src="/nasabah/icon-scales-blue.svg" width={24} height={28} />
      </div>

      <div className="flex items-center gap-3 rounded-[20px] border-[0.5px] border-accent bg-blue-light p-4">
        <Asset src="/nasabah/icon-scales-note.svg" width={21} height={25.8966} />
        <p className="text-[12px] leading-[16.5px] font-semibold text-blue-dark">
          Penting: Konfirmasi hanya sekali. Pembatalan wajib disertai alasan dan tercatat.
        </p>
      </div>

      {saveError ? (
        <p role="alert" className="text-[12px] leading-[17px] font-semibold text-[#d92116]">
          {saveError}
        </p>
      ) : null}

      <StepActions>
        <button
          type="button"
          onClick={() => setAskCancel(true)}
          disabled={saving}
          className="flex h-[50px] w-full items-center justify-center rounded-[30px] border border-[#ff575d] bg-white text-[14px] font-semibold text-[#d92116] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          Batalkan Setoran
        </button>
        <StepNext disabled={!online || saving} onClick={save}>
          {saving ? "Menyimpan…" : online ? "Simpan Berat Aktual" : "Sedang offline"}
        </StepNext>
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
