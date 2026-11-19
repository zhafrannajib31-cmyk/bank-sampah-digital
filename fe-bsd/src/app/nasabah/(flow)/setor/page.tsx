"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Asset, EmptyState, ErrorState } from "@/components/ui";
import { formatDistance } from "@/features/nasabah/format";
import { usePrototype } from "@/features/nasabah/prototype-store";
import { StepNext } from "@/features/nasabah/step-screen";
import type { BankUnit } from "@/features/nasabah/types";
import { cn } from "@/lib/cn";

type Filter = "semua" | "buka" | "terdekat" | "logam";

const filters: { id: Filter; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "buka", label: "Buka Sekarang" },
  { id: "terdekat", label: "Terdekat" },
  { id: "logam", label: "Menerima Logam" },
];

function applyFilter(
  units: BankUnit[],
  filter: Filter,
  query: string,
  logamIds: string[],
): BankUnit[] {
  const q = query.trim().toLowerCase();
  let result = units.filter(
    (unit) => !q || `${unit.name} ${unit.address}`.toLowerCase().includes(q),
  );
  if (filter === "buka") result = result.filter((unit) => unit.isOpen);
  if (filter === "logam")
    result = result.filter((unit) => unit.categoryIds.some((id) => logamIds.includes(id)));
  if (filter === "terdekat")
    result = [...result].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
  return result;
}

export default function PilihUnitPage() {
  const { units, categories, isLoading, error, reload } = usePrototype();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("semua");
  const [pickedId, setPickedId] = useState<string | null>(null);

  const categoryNames = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category.name])),
    [categories],
  );
  const logamIds = useMemo(
    () => categories.filter((category) => /logam/i.test(category.name)).map((category) => category.id),
    [categories],
  );

  const visible = useMemo(
    () => applyFilter(units, filter, query, logamIds),
    [units, filter, query, logamIds],
  );
  // Unit terpilih: pilihan pengguna, atau unit buka pertama pada hasil.
  const selected =
    visible.find((unit) => unit.id === pickedId && unit.isOpen) ??
    visible.find((unit) => unit.isOpen);

  return (
    <>
      <header className="bg-surface px-5 pt-5 pb-4">
        <div className="flex flex-col gap-[14px]">
          <div className="flex h-11 items-center justify-between">
            <div className="flex flex-col gap-[2px]">
              <h1 className="text-[24px] leading-[28px] font-extrabold text-heading">
                Bank Sampah
              </h1>
              <p className="text-[12px] leading-[16px] text-subtle">
                Langkah 1 dari 5 · Pilih unit tujuan
              </p>
            </div>
            <button
              type="button"
              aria-label="Lihat peta"
              title="Peta belum tersedia"
              disabled
              className="flex size-11 items-center justify-center rounded-[15px] border border-line bg-tile-bg"
            >
              <Asset src="/nasabah/icon-map-pin-green.svg" width={17} height={17} />
            </button>
          </div>

          <label className="flex h-[47px] items-center gap-[14px] rounded-[15px] border border-line bg-canvas px-[18px] focus-within:ring-2 focus-within:ring-accent/40">
            <Asset src="/nasabah/icon-search.svg" width={14} height={14} />
            <span className="sr-only">Cari nama unit atau alamat</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama unit atau alamat"
              className="min-w-0 flex-1 bg-transparent text-[14px] text-heading placeholder:text-[#7a7e7b] focus:outline-none"
            />
          </label>

          <div
            role="group"
            aria-label="Filter unit"
            className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
                className={cn(
                  "h-8 shrink-0 rounded-[20px] border px-[14px] text-[12px] whitespace-nowrap text-heading focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                  filter === item.id
                    ? "border-[#00dc50] bg-primary font-bold"
                    : "border-line-strong bg-white font-semibold",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="flex-1 bg-canvas px-5 pt-[14px] pb-6" aria-label="Daftar unit">
        <div className="mx-auto flex w-full max-w-[1072px] flex-col gap-[10px]">
          <p className="text-[12px] leading-[16px] text-subtle" aria-live="polite">
            {visible.length} unit ditemukan
          </p>
          {isLoading ? (
            <p className="text-[12px] leading-[16px] text-subtle" aria-live="polite">
              Memuat daftar unit…
            </p>
          ) : error ? (
            <ErrorState title="Daftar unit gagal dimuat" description={error} onRetry={reload} />
          ) : visible.length === 0 ? (
            <EmptyState title="Unit tidak ditemukan" description="Ubah kata kunci atau filter." />
          ) : (
            <ul className="grid grid-cols-1 gap-[12.5px] md:grid-cols-2 lg:grid-cols-3">
              {visible.map((unit) => (
                <li key={unit.id} className="flex">
                  <UnitCard
                    unit={unit}
                    selected={selected?.id === unit.id}
                    categoryNames={categoryNames}
                    onSelect={() => setPickedId(unit.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="sticky bottom-0 z-10 border-t border-line bg-surface">
        <div className="mx-auto flex w-full max-w-[1072px] flex-col gap-3 px-5 pt-3 pb-4">
          <p className="text-[12px] leading-[17px] text-black/70">
            Bank Sampah Unit:{" "}
            <span className="font-semibold text-black">{selected?.name ?? "belum dipilih"}</span>
          </p>
          {selected ? (
            <Link
              href={`/nasabah/setor/${selected.id}`}
              className="mx-auto flex h-[50px] w-full max-w-[349px] items-center justify-center gap-1 rounded-[10px] bg-primary font-sans text-[14px] font-bold text-foreground hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none sm:max-w-[307px] lg:max-w-[300px]"
            >
              Lanjut
              <Asset src="/onboarding/icon-arrow-dark.svg" width={13.3333} height={13.3333} />
            </Link>
          ) : (
            <StepNext
              disabled
              className="mx-auto max-w-[349px] sm:max-w-[307px] lg:max-w-[300px]"
            />
          )}
        </div>
      </div>
    </>
  );
}

function UnitCard({
  unit,
  selected,
  categoryNames,
  onSelect,
}: {
  unit: BankUnit;
  selected: boolean;
  categoryNames: Record<string, string>;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={!unit.isOpen}
      title={unit.isOpen ? undefined : "Unit sedang tutup"}
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col gap-[9px] rounded-[18px] border bg-white px-[15px] py-[14px] text-left focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:cursor-not-allowed",
        selected ? "border-primary" : "border-line",
      )}
    >
      <span className="flex items-start justify-between gap-2">
        <span className="flex flex-col gap-[3px]">
          <span className="text-[16px] leading-[19px] font-bold text-heading">{unit.name}</span>
          <span className="text-[12.5px] leading-[16px] text-subtle">{unit.address}</span>
        </span>
        <span
          className={cn(
            "flex h-6 shrink-0 items-center rounded-[20px] px-[11px] text-[12px] font-bold",
            unit.isOpen ? "bg-open-bg text-open-text" : "bg-closed-bg text-closed-text",
          )}
        >
          {unit.isOpen ? "Buka" : "Tutup"}
        </span>
      </span>
      <span className="flex items-center gap-4">
        <span className="flex items-center gap-[6px] text-[13px] leading-[16px] text-body-muted">
          <Asset src="/nasabah/icon-clock-sm.svg" width={12} height={12} />
          {unit.shortHours}
        </span>
        {unit.distanceKm !== undefined ? (
          <span className="flex items-center gap-[7px] text-[12px] leading-[16px] text-body-muted">
            <Asset src="/nasabah/icon-pin-sm.svg" width={11} height={11} />
            {formatDistance(unit.distanceKm)}
          </span>
        ) : null}
      </span>
      <span className="flex flex-wrap gap-[5px]">
        {unit.categoryIds.map((id) => (
          <span
            key={id}
            className="flex h-[22px] items-center rounded-[14px] bg-canvas px-[9px] text-[12px] text-body-muted"
          >
            {categoryNames[id] ?? "Kategori"}
          </span>
        ))}
      </span>
    </button>
  );
}
