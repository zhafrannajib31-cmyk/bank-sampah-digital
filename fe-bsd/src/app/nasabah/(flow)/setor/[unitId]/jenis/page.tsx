"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Asset, EmptyState, StepActions, StepHeader } from "@/components/ui";
import { CategoryTile, CheckBadge } from "@/features/nasabah/category-tile";
import { saveDraft, useDraft } from "@/features/nasabah/draft";
import { formatRupiah } from "@/features/nasabah/format";
import { usePrototype } from "@/features/nasabah/prototype-store";
import { StepNext, StepScreen } from "@/features/nasabah/step-screen";
import { cn } from "@/lib/cn";

export default function PilihJenisPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const router = useRouter();
  const { categoriesForUnit } = usePrototype();
  const { draft } = useDraft();
  // Pilihan lokal; sebelum disentuh, ikut draft (hanya jika draft untuk unit yang sama).
  const [touched, setTouched] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const offered = categoriesForUnit(unitId);
  const fromDraft = draft?.unitId === unitId ? draft.items.map((item) => item.categoryId) : [];
  const selected = touched ?? fromDraft;
  const selectedNames = offered.filter((c) => selected.includes(c.id)).map((c) => c.name);

  function toggle(categoryId: string) {
    setError(null);
    setTouched(
      selected.includes(categoryId)
        ? selected.filter((id) => id !== categoryId)
        : [...selected, categoryId],
    );
  }

  function handleNext() {
    if (selectedNames.length === 0) {
      setError("Pilih minimal satu jenis sampah.");
      return;
    }
    const previous = draft?.unitId === unitId ? draft.items : [];
    saveDraft({
      unitId,
      items: offered
        .filter((category) => selected.includes(category.id))
        .map((category) => ({
          categoryId: category.id,
          estimatedWeight:
            previous.find((item) => item.categoryId === category.id)?.estimatedWeight ?? 0,
        })),
    });
    router.push(`/nasabah/setor/${unitId}/berat`);
  }

  return (
    <StepScreen wide>
      <StepHeader
        title="Setor Sampah"
        step={2}
        totalSteps={5}
        backHref={`/nasabah/setor/${unitId}`}
      />
      <p className="text-[12px] leading-[17px] font-medium text-black/80">
        Pilih jenis sampah yang ingin kamu setorkan. Ketuk kategori untuk melihat detail &amp;
        memasukkan ke setoran.
      </p>

      {offered.length === 0 ? (
        <EmptyState title="Unit ini belum menerima jenis sampah" />
      ) : (
        <ul className="grid grid-cols-2 gap-x-[10px] gap-y-[9px] md:grid-cols-3 lg:grid-cols-6">
          {offered.map((category) => {
            const isSelected = selected.includes(category.id);
            return (
              <li key={category.id} className="flex">
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggle(category.id)}
                  className={cn(
                    "relative flex min-h-[148px] w-full flex-col gap-[11px] rounded-[20px] border-solid px-3 pt-[14px] pb-[14px] text-left focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                    isSelected
                      ? "border-[1.5px] border-primary bg-green-light px-[14px]"
                      : "border-[0.5px] border-black/50 bg-white",
                  )}
                >
                  <CategoryTile id={category.id} name={category.name} />
                  {isSelected ? (
                    <span className="absolute top-[14px] right-3">
                      <CheckBadge />
                    </span>
                  ) : null}
                  <span className="flex flex-col gap-1 tracking-[-0.275px]">
                    <span className="text-[14px] leading-[16.5px] font-medium text-black">
                      {category.name}
                    </span>
                    {category.pricePerKg === null ? (
                      <span className="text-[12px] leading-[16.5px] font-semibold text-blue-dark">
                        Sesuai Jenis
                      </span>
                    ) : (
                      <span className="text-[12px] leading-[16.5px] font-medium text-black">
                        <span className={isSelected ? "text-green-dark-hover" : undefined}>
                          {formatRupiah(category.pricePerKg)}
                        </span>
                        <span className="font-normal text-black/60">/kg</span>
                      </span>
                    )}
                    <span className="text-[12px] leading-[17px] text-black/80">
                      {category.note}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex items-center gap-[10px] rounded-[10px] border-[0.5px] border-black/20 bg-white px-[18px] py-[12px]">
        <Asset src="/nasabah/icon-info.svg" width={18.5} height={18.5} />
        <p className="text-[12px] leading-[17px] font-light text-black/70">
          Kamu dapat memilih dari satu kategori sebelum memasukkan perkiraan berat.
        </p>
      </div>

      {error ? (
        <p role="alert" className="text-[12px] font-medium text-danger">
          {error}
        </p>
      ) : null}

      <StepActions>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[12px] leading-[17px] text-black/70">
            Dipilih: <span className="font-medium text-black">{selectedNames.length} Kategori</span>
            {selectedNames.length ? ` (${selectedNames.join(", ")})` : ""}
          </p>
          {selectedNames.length ? (
            <p className="shrink-0 font-sans text-[12px] font-semibold text-green-dark-active">
              Siap Input Berat
            </p>
          ) : null}
        </div>
        <StepNext onClick={handleNext} className="lg:mx-auto lg:max-w-[300px]" />
      </StepActions>
    </StepScreen>
  );
}
