"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Asset,
  EmptyState,
  ErrorState,
  LoadingState,
  StepActions,
  StepHeader,
  buttonClasses,
} from "@/components/ui";
import { CategoryTile } from "@/features/nasabah/category-tile";
import { clearDraft, isDraftComplete, useDraft } from "@/features/nasabah/draft";
import { formatRupiah, formatWeight } from "@/features/nasabah/format";
import { calculateEstimate } from "@/features/nasabah/prototype-api";
import { usePrototype } from "@/features/nasabah/prototype-store";
import { StepNext, StepScreen } from "@/features/nasabah/step-screen";
import { newIdempotencyKey, userMessage } from "@/lib/api";
import { OFFLINE_MESSAGE } from "@/lib/use-online";

export default function RingkasanSetoranPage() {
  const router = useRouter();
  const { units, categories, submitDeposit } = usePrototype();
  const { draft, ready } = useDraft();
  // Satu kunci per kunjungan layar ini; dipakai ulang saat "Coba lagi" agar tidak ganda.
  const [idempotencyKey] = useState(newIdempotencyKey);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unit = draft ? units.find((candidate) => candidate.id === draft.unitId) : undefined;
  // Simulasi sisi server (prototype); di aplikasi nyata nilai datang dari respons API.
  const estimate = useMemo(
    () => (draft && isDraftComplete(draft) ? calculateEstimate(draft, categories) : null),
    [categories, draft],
  );
  const backHref = draft ? `/nasabah/setor/${draft.unitId}/metode` : "/nasabah/setor";

  async function handleSubmit() {
    if (!draft) return;
    if (!navigator.onLine) {
      setError(OFFLINE_MESSAGE);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const deposit = await submitDeposit(draft, idempotencyKey);
      clearDraft();
      router.push(`/nasabah/setoran/${deposit.id}`);
    } catch (cause) {
      setError(userMessage(cause));
      setSubmitting(false);
    }
  }

  const header = (
    <StepHeader title="Konfirmasi Setoran" step={5} totalSteps={5} backHref={backHref} />
  );

  if (!ready) {
    return (
      <StepScreen>
        {header}
        <LoadingState label="Menyiapkan ringkasan…" />
      </StepScreen>
    );
  }

  if (!draft || !unit || !estimate) {
    return (
      <StepScreen>
        {header}
        <EmptyState
          title="Belum ada data setoran"
          description="Mulai pengajuan baru dari halaman setor."
          action={
            <Link href="/nasabah/setor" className={buttonClasses({ size: "sm" })}>
              Mulai setor
            </Link>
          }
        />
      </StepScreen>
    );
  }

  const totalWeight = estimate.items.reduce((sum, item) => sum + item.estimatedWeight, 0);

  return (
    <StepScreen>
      {header}

      <section aria-labelledby="disetor" className="flex flex-col gap-[10px]">
        <h2
          id="disetor"
          className="text-[14px] leading-[16.5px] font-medium tracking-[-0.275px] text-black"
        >
          Sampah yang Disetorkan
        </h2>
        <p className="text-[12px] leading-[17px] text-black/70">
          Antar sendiri ke <span className="font-semibold text-black">{unit.name}</span>
        </p>
        <ul className="flex flex-col gap-[10px]">
          {estimate.items.map((item) => (
            <li
              key={item.categoryId}
              className="flex h-[70px] items-center gap-3 rounded-[20px] border-[0.1px] border-black bg-white px-3 shadow-[0_4px_4px_rgba(0,0,0,0.1)]"
            >
              <CategoryTile id={item.categoryId} />
              <div className="flex flex-1 flex-col gap-[6px]">
                <p className="text-[14px] leading-[16.5px] font-medium tracking-[-0.275px] text-black">
                  {item.categoryName}
                </p>
                <p className="w-fit rounded-[10px] bg-black/10 px-2 text-[12px] leading-[17px] font-medium text-black">
                  {formatWeight(item.estimatedWeight)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-[12px] leading-[17px] text-black/80">
                  {item.pricePerKg === null
                    ? "Sesuai jenis"
                    : `${formatRupiah(item.pricePerKg)}/kg`}
                </p>
                <p className="text-[14px] leading-[16.5px] font-medium text-green-dark-active">
                  {item.pricePerKg === null
                    ? "Ditentukan petugas"
                    : formatRupiah(item.estimatedValue)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-label="Estimasi setoran"
        className="flex flex-col gap-3 rounded-[20px] border-[0.1px] border-black bg-white p-3 shadow-[0_4px_4px_rgba(0,0,0,0.1)]"
      >
        <div className="flex items-center justify-between">
          <p className="rounded-[5px] bg-blue-light px-[9px] text-[12px] leading-[17px] font-light text-black">
            ESTIMASI SETORAN
          </p>
          <p className="text-[12px] leading-[17px] font-medium text-black/70">
            {estimate.items.length} Kategori
          </p>
        </div>
        <div className="grid grid-cols-2 gap-[14px]">
          <div className="flex flex-col gap-[6px] rounded-[5px] bg-blue-light p-[10px]">
            <p className="text-[12px] leading-[17px] font-medium text-black">Total Berat</p>
            <p className="text-[16px] leading-[16.5px] font-extrabold text-black">
              {formatWeight(totalWeight)}
            </p>
            <p className="text-[12px] leading-[17px] font-light text-black">Est. berat</p>
          </div>
          <div className="flex flex-col gap-[6px] rounded-[5px] bg-blue-light p-[10px]">
            <p className="text-[12px] leading-[17px] font-medium text-black">Perkiraan Nilai</p>
            <p className="text-[16px] leading-[16.5px] font-extrabold text-green-dark-active">
              {formatRupiah(estimate.total)}
            </p>
            <p className="text-[12px] leading-[17px] font-light text-black">
              Estimasi nominal awal
            </p>
          </div>
        </div>
        <p className="flex items-start gap-2 text-[12px] leading-[17px] font-light text-black">
          <span className="mt-[3px]">
            <Asset src="/nasabah/note-info-sm.svg" width={10} height={10} />
          </span>
          Angka di atas masih perkiraan sebelum ditimbang.
        </p>
      </section>

      <section className="flex gap-4 rounded-[20px] bg-blue-light-active p-[14px]">
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
          <h2 className="text-[14px] leading-[16.5px] font-medium text-black">
            Catatan Penimbangan
          </h2>
          <p className="text-[12px] leading-[17px] font-light text-black">
            Berat dan nilai di atas masih estimasi. Nilai akhir dihitung setelah ditimbang petugas.
          </p>
        </div>
      </section>

      {error ? (
        <ErrorState
          title="Pengajuan gagal dikirim"
          description={error}
          onRetry={() => void handleSubmit()}
        />
      ) : null}

      <StepActions>
        <StepNext arrow={false} disabled={submitting} onClick={() => void handleSubmit()}>
          {submitting ? "Mengirim pengajuan…" : "Konfirmasi Setoran"}
        </StepNext>
      </StepActions>
    </StepScreen>
  );
}
