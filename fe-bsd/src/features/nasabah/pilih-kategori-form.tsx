"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  ErrorState,
  Input,
  buttonClasses,
} from "@/components/ui";
import { saveDraft } from "./draft";
import { formatRupiah } from "./format";
import { PrototypeNotice } from "./prototype-notice";
import { calculateEstimate } from "./prototype-api";
import { usePrototype } from "./prototype-store";

export function PilihKategoriForm() {
  const params = useParams<{ unitId: string }>();
  const router = useRouter();
  const { units, categories } = usePrototype();

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const unit = units.find((candidate) => candidate.id === params.unitId);

  const selectedItems = useMemo(
    () =>
      categories.flatMap((category) => {
        if (!selected[category.id]) return [];

        const raw = weights[category.id]?.replace(",", ".") ?? "";
        const value = Number(raw);

        if (!raw || !Number.isFinite(value) || value <= 0) return [];

        return [{ categoryId: category.id, estimatedWeight: value }];
      }),
    [categories, selected, weights],
  );

  const estimate = useMemo(() => {
    if (selectedItems.length === 0) return null;

    try {
      return calculateEstimate({ unitId: params.unitId, items: selectedItems }, categories);
    } catch {
      return null;
    }
  }, [categories, params.unitId, selectedItems]);

  if (!unit) {
    return (
      <ErrorState
        title="Unit tidak ditemukan"
        description="Unit yang Anda pilih tidak tersedia. Kembali dan pilih unit lain."
      />
    );
  }

  function toggleCategory(categoryId: string): void {
    setSelected((current) => {
      const nextSelected = !current[categoryId];

      if (nextSelected) {
        setWeights((currentWeights) => ({ ...currentWeights, [categoryId]: "" }));
      }

      return { ...current, [categoryId]: nextSelected };
    });
    setError(null);
  }

  function handleWeightChange(categoryId: string, value: string): void {
    setWeights((current) => ({ ...current, [categoryId]: value }));
    setError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const selectedCategories = categories.filter((category) => selected[category.id]);

    if (selectedCategories.length === 0) {
      setError("Pilih minimal satu jenis sampah.");
      return;
    }

    const invalidWeight = selectedCategories.some((category) => {
      const raw = weights[category.id]?.replace(",", ".") ?? "";
      const value = Number(raw);
      return !raw || !Number.isFinite(value) || value <= 0;
    });

    if (invalidWeight) {
      setError("Isi estimasi berat lebih dari 0 untuk setiap jenis yang dipilih.");
      return;
    }

    saveDraft({ unitId: params.unitId, items: selectedItems });
    router.push("/nasabah/setor/ringkasan");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <PrototypeNotice />

      <header className="flex flex-col gap-1">
        <p className="text-body-sm font-semibold text-accent">Langkah 2 dari 3</p>
        <h1 className="text-h2 text-foreground">Pilih jenis dan estimasi berat</h1>
        <p className="text-body text-muted">
          Isi perkiraan berat sampah. Angka ini masih estimasi dan bukan nilai final.
        </p>
      </header>

      <Card className="border-blue-light-active bg-blue-light">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-body font-semibold text-blue-darker">{unit.name}</p>
              <p className="text-body-sm text-blue-darker/80">{unit.address}</p>
              <p className="text-body-sm text-blue-darker/80">{unit.hours}</p>
            </div>
            <Link
              href="/nasabah/setor"
              className="text-body-sm font-semibold whitespace-nowrap text-accent"
            >
              Ganti unit
            </Link>
          </div>
        </CardHeader>
      </Card>

      <div className="flex flex-col gap-3">
        {categories.map((category) => {
          const isSelected = Boolean(selected[category.id]);

          return (
            <Card key={category.id} className={isSelected ? "border-green-dark/50" : undefined}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <input
                    id={`kategori-${category.id}`}
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCategory(category.id)}
                    className="mt-1 size-5 shrink-0 accent-green-dark"
                  />
                  <label
                    htmlFor={`kategori-${category.id}`}
                    className="flex flex-1 cursor-pointer flex-col gap-1"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-body font-semibold text-foreground">
                        {category.name}
                      </span>
                      <Badge variant="success">{formatRupiah(category.pricePerKg)}/kg</Badge>
                    </span>
                    <span className="text-body-sm text-muted">{category.note}</span>
                  </label>
                </div>
              </CardHeader>
              {isSelected ? (
                <CardContent>
                  <Input
                    label="Estimasi berat (kg)"
                    name={`berat-${category.id}`}
                    inputMode="decimal"
                    placeholder="Contoh: 2,5"
                    value={weights[category.id] ?? ""}
                    onChange={(event) => handleWeightChange(category.id, event.target.value)}
                    hint="Berat ini estimasi, bukan nilai final."
                  />
                </CardContent>
              ) : null}
            </Card>
          );
        })}
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-body-sm font-medium text-danger-dark"
        >
          {error}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardDescription>Ringkasan sementara</CardDescription>
          <div className="flex items-end justify-between gap-3">
            <p className="text-h4 text-foreground">{selectedItems.length} jenis dipilih</p>
            <p className="text-body font-semibold text-foreground">
              {estimate ? formatRupiah(estimate.total) : "Rp0"}
            </p>
          </div>
          <p className="text-body-sm text-muted">
            Estimasi, bukan nilai final. Nilai final dihitung dari berat aktual.
          </p>
        </CardHeader>
      </Card>

      <div className="flex flex-col gap-2">
        <Button type="submit" size="lg" className="w-full">
          Lanjut ke ringkasan
        </Button>
        <Link
          href="/nasabah/setor"
          className={buttonClasses({
            variant: "ghost",
            size: "md",
            className: "w-full",
          })}
        >
          Kembali pilih unit
        </Link>
      </div>
    </form>
  );
}
