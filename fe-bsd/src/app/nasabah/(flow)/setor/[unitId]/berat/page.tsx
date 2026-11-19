"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Asset,
  EmptyState,
  StepActions,
  StepHeader,
  WeightStepper,
  buttonClasses,
  parseWeight,
} from "@/components/ui";
import { saveDraft, useDraft } from "@/features/nasabah/draft";
import { formatRupiah, formatWeight } from "@/features/nasabah/format";
import { calculateEstimate } from "@/features/nasabah/prototype-api";
import { usePrototype } from "@/features/nasabah/prototype-store";
import { StepNext, StepScreen } from "@/features/nasabah/step-screen";

export default function BeratPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const router = useRouter();
  const { categoriesForUnit } = usePrototype();
  const { draft, ready } = useDraft();
  const [typed, setTyped] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);

  const categories = categoriesForUnit(unitId);

  const backHref = `/nasabah/setor/${unitId}/jenis`;
  const header = <StepHeader title="Berat Sampah" step={3} totalSteps={5} backHref={backHref} />;

  if (!ready) return null;

  if (!draft || draft.unitId !== unitId) {
    return (
      <StepScreen>
        {header}
        <EmptyState
          title="Belum ada jenis dipilih"
          description="Pilih jenis sampah lebih dulu."
          action={
            <Link href={backHref} className={buttonClasses({ size: "sm" })}>
              Pilih jenis
            </Link>
          }
        />
      </StepScreen>
    );
  }

  const rows = draft.items.map((item) => {
    const category = categories.find((candidate) => candidate.id === item.categoryId);
    const text =
      typed[item.categoryId] ??
      (item.estimatedWeight > 0 ? String(item.estimatedWeight).replace(".", ",") : "");
    const weight = parseWeight(text);
    const valid = Number.isFinite(weight) && weight > 0;
    return { item, category, text, weight, valid };
  });

  const validItems = rows.flatMap((row) =>
    row.valid ? [{ categoryId: row.item.categoryId, estimatedWeight: row.weight }] : [],
  );
  // Simulasi sisi server (prototype); di aplikasi nyata nilai datang dari respons API.
  const estimate = validItems.length
    ? calculateEstimate({ unitId, items: validItems }, categories)
    : null;
  const totalWeight = validItems.reduce((sum, item) => sum + item.estimatedWeight, 0);

  function handleNext() {
    if (rows.some((row) => !row.valid)) {
      setShowErrors(true);
      return;
    }
    saveDraft({ unitId, items: validItems });
    router.push(`/nasabah/setor/${unitId}/metode`);
  }

  return (
    <StepScreen>
      {header}
      <p className="text-[12px] leading-[17px] font-medium text-black/60">
        Masukkan perkiraan berat sampah yang akan kamu setorkan.
      </p>

      <p className="flex h-[23px] w-fit items-center gap-[10px] rounded-[15px] border-[0.5px] border-accent bg-blue-light px-[13px] text-[12px] font-medium text-blue-dark">
        <Asset src="/nasabah/icon-scales-blue.svg" width={13} height={16.0312} />
        BERAT ESTIMASI (PERKIRAAN)
      </p>

      <ul className="flex flex-col gap-[10px]">
        {rows.map(({ item, category, text, valid }, index) => {
          const row = estimate?.items.find((entry) => entry.categoryId === item.categoryId);
          return (
            <li
              key={item.categoryId}
              className="flex flex-col gap-3 rounded-[20px] border-[0.5px] border-black/50 p-[13px]"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-[6px] text-[14px] leading-[16.5px] font-semibold tracking-[-0.275px] text-black">
                  <Asset src="/nasabah/dot-green.svg" width={10} height={10} />
                  {index + 1}. {category?.name}
                </p>
                <p className="text-[12px] text-black/70">
                  {category?.pricePerKg == null
                    ? "Sesuai jenis"
                    : `${formatRupiah(category.pricePerKg)}/kg`}
                </p>
              </div>
              <WeightStepper
                label={category?.name ?? ""}
                value={text}
                onChange={(value) =>
                  setTyped((current) => ({ ...current, [item.categoryId]: value }))
                }
                error={
                  showErrors && !valid
                    ? "Isi berat lebih dari 0 kg, maksimal 3 angka di belakang koma."
                    : undefined
                }
              />
              <p className="self-end text-[12px] leading-[16.5px] font-medium tracking-[-0.275px] text-green-dark-active">
                {category?.pricePerKg == null
                  ? "Nilai ditentukan petugas"
                  : `Subtotal: ${formatRupiah(row?.estimatedValue ?? 0)}`}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between gap-3 rounded-[20px] border-[0.5px] border-primary bg-green-light p-[15px]">
        <div className="flex flex-col gap-[5px] tracking-[-0.275px]">
          <p className="text-[14px] leading-[16.5px] font-medium text-black">
            Perkiraan Total Nilai:
          </p>
          <p className="text-[18px] leading-[20px] font-semibold text-green-dark-active">
            {formatRupiah(estimate?.total ?? 0)}
          </p>
          <p className="text-[12px] leading-[17px] font-medium text-green-dark-active">
            Total berat perkiraan: {formatWeight(totalWeight)}
          </p>
        </div>
        <Asset src="/nasabah/chip-dollar.svg" width={44} height={44} />
      </div>

      <div className="flex items-center gap-3 rounded-[20px] border-[0.5px] border-accent bg-blue-light p-4">
        <Asset src="/nasabah/icon-scales-note.svg" width={21} height={25.8966} />
        <p className="text-[12px] leading-[16.5px] font-semibold text-blue-dark">
          Penting: Berat dan nilai akhir akan disesuaikan secara transparan setelah penimbangan
          fisik oleh petugas Bank Sampah.
        </p>
      </div>

      <StepActions>
        <StepNext onClick={handleNext} />
      </StepActions>
    </StepScreen>
  );
}
